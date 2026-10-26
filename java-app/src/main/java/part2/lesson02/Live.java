package part2.lesson02;

import com.fasterxml.jackson.databind.ObjectMapper;
import common.Claude;
import common.LiveSection;
import com.anthropic.models.messages.Message;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 02 chạy với Claude thật: một tính năng hỏi đáp chính sách hoàn tiền, có hợp đồng JSON.
 * Code của bạn chấm từng phản hồi bằng ba tín hiệu: format, grounding và behavior.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-02 --live"
 */
public final class Live {
    private Live() {}

    /** Hợp đồng đầu ra: câu trả lời, nhãn, và các đoạn trích nguyên văn từ tài liệu. */
    public record Answer(String answer, String category, List<String> quotes) {}

    public record Route(String category) {}

    static final String POLICY = """
        Refund policy (v3).
        Refunds are available within 30 days of purchase for annual plans.
        Monthly plans are not refundable, but you can cancel at any time and keep access until the end of the billing period.
        To request a refund, email billing@example.com with your invoice number.""";

    static final String SYSTEM = """
        You answer customer questions about the refund policy below, and nothing else.
        Reply with only a JSON object with fields "answer" (string, Vietnamese), "category" (one of "refund", "cancel",
        "out_of_scope") and "quotes" (array of exact sentences copied from the policy that support the answer).

        """ + POLICY;

    static final Map<String, String> SCHEMA = Map.of("answer", "string", "category", "string", "quotes", "array");

    public static void run(boolean useSolution, Claude claude) {
        Lesson02Api api = useSolution ? new Lesson02Solution() : new Lesson02();

        LiveSection.run("Format signal: chỉ dặn \"trả về JSON\" trong prompt, rồi chấm output thô", () -> {
            api.formatErrors("{}", SCHEMA);
            for (String q : List.of("Tôi mua gói năm 10 ngày trước, có được hoàn tiền không?",
                "Viết giúp tôi một bài thơ về mùa thu.")) {
                Message reply = claude.create(Claude.params().system(SYSTEM).addUserMessage(q).build());
                String raw = Claude.text(reply);
                String stop = reply.stopReason().map(Object::toString).orElse("?");
                List<String> errors = api.formatErrors(raw, SCHEMA);
                System.out.println("\n  ❓ " + q + "\n  stop_reason: " + stop + "\n  output thô: " + raw.replace("\n", " "));
                System.out.println("  format check: " + (errors.isEmpty() ? "đạt" : errors)
                    + " → " + tryCall(() -> api.classify(stop, errors.isEmpty())));
            }
            System.out.println("\n  Nếu thấy CONTRACT_BROKEN: chỉ dặn bằng lời thì không đảm bảo định dạng. Phần sau dùng structured outputs.");
        });

        LiveSection.run("Structured outputs giữ hợp đồng; grounding signal kiểm tra trích dẫn", () -> {
            api.isGrounded(List.of("x"), POLICY);
            for (String q : List.of("Gói tháng có hoàn tiền được không?", "Muốn xin hoàn tiền thì làm thế nào?")) {
                Answer a = claude.askJson(SYSTEM, q, Answer.class);
                String raw = toJson(a);
                System.out.println("\n  ❓ " + q + "\n  💬 " + a.answer() + "\n  📎 " + a.quotes());
                System.out.println("  format: " + tryCall(() -> api.formatErrors(raw, SCHEMA))
                    + " · grounded: " + api.isGrounded(a.quotes(), POLICY));
            }
        });

        LiveSection.run("Behavior signal: so lựa chọn của app với tập ví dụ gán nhãn sẵn", () -> {
            api.behaviorAccuracy(List.of("a"), List.of("a"));
            Map<String, String> labeled = Map.of(
                "Tôi mua gói năm hôm qua, muốn lấy lại tiền.", "refund",
                "Làm sao để hủy gói tháng?", "cancel",
                "Hủy rồi thì còn dùng được tới khi nào?", "cancel",
                "Công ty bạn có tuyển dụng không?", "out_of_scope",
                "Email nào để gửi yêu cầu hoàn tiền?", "refund");
            List<String> predicted = new ArrayList<>();
            List<String> labels = new ArrayList<>();
            labeled.forEach((q, label) -> {
                String got = claude.askJson(SYSTEM, q, Route.class).category();
                predicted.add(got);
                labels.add(label);
                System.out.println("  " + (got.equals(label) ? "✅" : "❌") + " " + q + " → " + got + " (nhãn: " + label + ")");
            });
            System.out.println("  Độ chính xác: " + String.format("%.0f%%", api.behaviorAccuracy(predicted, labels) * 100));
        });
    }

    private static String toJson(Object value) {
        try {
            return new ObjectMapper().writeValueAsString(value);
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            throw new IllegalStateException(e);
        }
    }

    private interface Attempt<T> {
        T get();
    }

    private static <T> String tryCall(Attempt<T> attempt) {
        try {
            return String.valueOf(attempt.get());
        } catch (UnsupportedOperationException e) {
            return "⏳ chưa làm (" + e.getMessage() + ")";
        }
    }
}
