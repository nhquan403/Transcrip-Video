package common;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.core.http.StreamResponse;
import com.anthropic.helpers.MessageAccumulator;
import com.anthropic.models.messages.RawMessageStreamEvent;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.OutputConfig;
import com.anthropic.models.messages.StopReason;
import com.anthropic.models.messages.StructuredMessage;
import com.anthropic.models.messages.StructuredMessageCreateParams;
import com.anthropic.models.messages.Usage;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.stream.Collectors;

/**
 * Cầu nối tới Claude thật cho chế độ --live.
 *
 * Đọc API key từ biến môi trường ANTHROPIC_API_KEY. Model mặc định là claude-opus-5-5,
 * đổi bằng biến môi trường CLAUDE_MODEL (ví dụ claude-haiku-5-5 để rẻ hơn).
 * Mỗi lần gọi được ghi lại số token và thời gian, để thấy chi phí thật của từng thiết kế (bài 02).
 */
public final class Claude {
    public static final String MODEL = envOr("CLAUDE_MODEL", "claude-opus-5-5");

    /** Giá USD cho mỗi 1 triệu token vào/ra (bảng giá Anthropic tháng 10/2026; model lạ dùng giá Opus 5.5). */
    public static final Map<String, double[]> PRICE_PER_MTOK = Map.of(
        "claude-opus-5-5", new double[] {4.00, 20.00},
        "claude-sonnet-5-5", new double[] {2.00, 10.00},
        "claude-haiku-5-5", new double[] {0.10, 0.50});

    public static double[] price() {
        return PRICE_PER_MTOK.getOrDefault(MODEL, PRICE_PER_MTOK.get("claude-opus-5-5"));
    }

    /** Một lần gọi API: token vào, token ra, và thời gian một round trip. */
    public record CallStats(long inputTokens, long outputTokens, long millis) {}

    private final AnthropicClient client;
    private final List<CallStats> calls = new ArrayList<>();

    private Claude(AnthropicClient client) {
        this.client = client;
    }

    /** Tạo client từ biến môi trường; báo lỗi dễ hiểu nếu chưa có API key. */
    public static Claude fromEnv() {
        if (System.getenv("ANTHROPIC_API_KEY") == null && System.getenv("ANTHROPIC_AUTH_TOKEN") == null) {
            throw new IllegalStateException("""
                Chưa có API key. Hãy đặt biến môi trường ANTHROPIC_API_KEY rồi chạy lại:
                  macOS/Linux:  export ANTHROPIC_API_KEY=...
                  PowerShell:   $env:ANTHROPIC_API_KEY="..."
                  IntelliJ:     Run > Edit Configurations > Environment variables""");
        }
        return new Claude(AnthropicOkHttpClient.fromEnv());
    }

    /** Builder đã điền sẵn model, max tokens, effort và fallback khi bị từ chối. */
    public static MessageCreateParams.Builder params() {
        return MessageCreateParams.builder()
            .model(MODEL)
            .maxTokens(16000L)
            .outputConfig(OutputConfig.builder().effort(OutputConfig.Effort.LOW).build())
            // Nếu bộ lọc an toàn từ chối một yêu cầu bình thường, server tự chuyển sang model dự phòng.
            .putAdditionalHeader("anthropic-beta", "server-side-fallback-2026-07-01")
            .putAdditionalBodyProperty("fallbacks", JsonValue.from("default"));
    }

    /** Gọi API, ghi lại token và thời gian. Ném lỗi nếu model từ chối hoặc bị cắt vì hết max tokens. */
    public Message create(MessageCreateParams params) {
        long start = System.nanoTime();
        Message message = client.messages().create(params);
        record(message.usage(), start, message.stopReason().orElse(null));
        return message;
    }

    /** Như create, nhưng trả về cả câu trả lời bị cắt vì max tokens (để bài học đọc stop_reason "max_tokens"). */
    public Message createAllowingTruncation(MessageCreateParams params) {
        long start = System.nanoTime();
        Message message = client.messages().create(params);
        StopReason stop = message.stopReason().orElse(null);
        record(message.usage(), start, StopReason.MAX_TOKENS.equals(stop) ? null : stop);
        return message;
    }

    /** Gọi API ở chế độ streaming output: onText nhận từng đoạn text ngay khi Claude viết ra. */
    public Message stream(MessageCreateParams params, Consumer<String> onText) {
        return stream(params, onText, new ArrayList<>());
    }

    /** Streaming và chỉ lấy các mảnh partial JSON của input tool (sự kiện input_json_delta), theo đúng thứ tự đến. */
    public List<String> streamToolInputDeltas(MessageCreateParams params) {
        List<String> deltas = new ArrayList<>();
        stream(params, text -> { }, deltas);
        return deltas;
    }

    private Message stream(MessageCreateParams params, Consumer<String> onText, List<String> jsonDeltas) {
        long start = System.nanoTime();
        MessageAccumulator accumulator = MessageAccumulator.create();
        try (StreamResponse<RawMessageStreamEvent> response = client.messages().createStreaming(params)) {
            response.stream()
                .peek(accumulator::accumulate)
                .flatMap(event -> event.contentBlockDelta().stream())
                .forEach(delta -> {
                    delta.delta().text().ifPresent(text -> onText.accept(text.text()));
                    delta.delta().inputJson().ifPresent(json -> jsonDeltas.add(json.partialJson()));
                });
        }
        Message message = accumulator.message();
        record(message.usage(), start, message.stopReason().orElse(null));
        return message;
    }

    /** Gọi API với structured output: Claude trả về JSON đúng schema của `type`, SDK chuyển thành object. */
    public <T> T askJson(String system, String prompt, Class<T> type) {
        StructuredMessageCreateParams<T> params = params().system(system).outputConfig(type).addUserMessage(prompt).build();
        long start = System.nanoTime();
        StructuredMessage<T> message = client.messages().create(params);
        record(message.usage(), start, message.stopReason().orElse(null));
        return message.content().stream()
            .flatMap(block -> block.text().stream())
            .findFirst()
            .orElseThrow(() -> new IllegalStateException("Claude không trả về JSON"))
            .text();
    }

    private void record(Usage usage, long startNanos, StopReason stop) {
        calls.add(new CallStats(usage.inputTokens(), usage.outputTokens(), (System.nanoTime() - startNanos) / 1_000_000));
        if (StopReason.REFUSAL.equals(stop)) {
            throw new IllegalStateException("Claude từ chối yêu cầu này");
        }
        if (StopReason.MAX_TOKENS.equals(stop)) {
            throw new IllegalStateException("Câu trả lời bị cắt vì chạm max tokens");
        }
    }

    /** Một lần gọi đơn giản: system prompt + câu hỏi, trả về phần text. */
    public String ask(String system, String prompt) {
        return text(create(params().system(system).addUserMessage(prompt).build()));
    }

    public static String text(Message message) {
        return message.content().stream()
            .flatMap(block -> block.text().stream())
            .map(t -> t.text())
            .collect(Collectors.joining("\n"))
            .trim();
    }

    public List<CallStats> calls() {
        return List.copyOf(calls);
    }

    public String usageSummary() {
        long in = calls.stream().mapToLong(CallStats::inputTokens).sum();
        long out = calls.stream().mapToLong(CallStats::outputTokens).sum();
        double usd = (in * price()[0] + out * price()[1]) / 1_000_000;
        return calls.size() + " lần gọi " + MODEL + ", " + in + " token vào, " + out + " token ra, khoảng $"
            + String.format("%.4f", usd);
    }

    private static String envOr(String name, String fallback) {
        String value = System.getenv(name);
        return value == null || value.isBlank() ? fallback : value;
    }
}
