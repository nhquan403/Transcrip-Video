package part2.lesson04;

import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.errors.AnthropicServiceException;
import common.Claude;
import common.LiveSection;
import java.util.Optional;
import java.util.function.Supplier;
import part2.lesson04.Lesson04Api.ApiError;

/**
 * Phần 2 · Bài 04 chạy với Claude thật: tạo lỗi thật (sai key, model không tồn tại), để code của bạn phân loại,
 * quyết định retry hay không, và chuyển sang model dự phòng.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-04 --live"
 */
public final class Live {
    private Live() {}

    static final String QUESTION = "Trong một câu tiếng Việt: graceful degradation là gì?";

    public static void run(boolean useSolution, Claude claude) {
        Lesson04Api api = useSolution ? new Lesson04Solution() : new Lesson04();

        LiveSection.run("Sai API key: lỗi 401 vĩnh viễn, phải báo ngay chứ không retry (không tốn token)", () -> {
            api.classify(401);
            var badClient = AnthropicOkHttpClient.builder().fromEnv().apiKey("sk-ant-sai-key").maxRetries(0).build();
            int[] attempts = {0};
            try {
                String reply = api.retryWithBackoff(() -> {
                    attempts[0]++;
                    return call(() -> Claude.text(badClient.messages().create(Claude.params().addUserMessage("hi").build())));
                }, 4, 500, ms -> System.out.println("  ⏳ chờ " + ms + "ms rồi thử lại"));
                System.out.println("  ⚠️ Lời gọi với key sai lại thành công? " + reply);
            } catch (ApiError e) {
                System.out.println("  Lỗi thật: " + e.getMessage() + " → " + api.classify(e.status())
                    + ", số lần gọi: " + attempts[0] + (attempts[0] == 1 ? " (đúng: không retry)" : " (sai: đã retry vô ích)"));
            }
        });

        LiveSection.run("Failover: model chính không dùng được, chuyển sang model dự phòng", () -> {
            api.withFailover(() -> "x", () -> "y", Optional.empty());
            String answer = api.withFailover(
                () -> call(() -> Claude.text(claude.create(Claude.params().model("claude-model-khong-ton-tai")
                    .addUserMessage(QUESTION).build()))),
                () -> "[fallback " + Claude.MODEL + "] " + call(() -> claude.ask("Answer in Vietnamese.", QUESTION)),
                Optional.of("[degraded] Hệ thống đang bận, đây là câu trả lời lưu sẵn."));
            System.out.println("  " + answer);
        });
    }

    /** Đổi lỗi của SDK thành ApiError (status HTTP) để code của bạn phân loại. */
    private static <T> T call(Supplier<T> body) {
        try {
            return body.get();
        } catch (AnthropicServiceException e) {
            throw new ApiError(e.statusCode(), e.getMessage());
        } catch (IllegalStateException e) {
            throw new ApiError(0, e.getMessage());
        }
    }
}
