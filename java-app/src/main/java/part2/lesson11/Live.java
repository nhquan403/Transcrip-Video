package part2.lesson11;

import com.fasterxml.jackson.databind.JsonNode;
import common.Claude;
import common.LiveSection;
import common.RawApi;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 11 chạy với Claude thật: gửi cùng một system prompt dài (có cache_control) hai lần để thấy
 * cache_creation_input_tokens rồi cache_read_input_tokens; sau đó nhét giờ hiện tại vào system để thấy cache bị phá.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-11 --live"   (khoảng 4 lời gọi, mỗi lời gọi khoảng 7.500 token input)
 */
public final class Live {
    private Live() {}

    /** Một tài liệu chính sách dài, ổn định từng byte: đủ lớn để vượt mức tối thiểu của mọi model. */
    static final String POLICY = String.join("\n", java.util.Collections.nCopies(250,
        "Refunds for annual plans are available within 30 days. Monthly plans can be cancelled any time and keep access "
            + "until the end of the billing period."));

    public static void run(boolean useSolution, Claude claude) {
        Lesson11Api api = useSolution ? new Lesson11Solution() : new Lesson11();
        RawApi raw = RawApi.fromEnv();

        LiveSection.run("Cùng một prefix gửi hai lần: lần đầu ghi cache, lần sau đọc cache", () -> {
            api.checkBreakpoints(List.of());
            System.out.println("  Kiểm tra bố cục của bạn: " + api.checkBreakpoints(List.of(
                new Lesson11Api.Segment("system: policy", false, true), new Lesson11Api.Segment("user: câu hỏi", true, false))));
            for (String q : List.of("Gói năm hoàn tiền trong bao lâu?", "Hủy gói tháng thì còn dùng tới khi nào?")) {
                print(q, raw.post(body(POLICY, q)));
            }
        });

        LiveSection.run("Nhét giờ hiện tại vào đầu system: prefix đổi, cache không còn khớp", () -> {
            String stamped = "Current time: " + LocalTime.now() + "\n" + POLICY;
            print("Gói năm hoàn tiền trong bao lâu? (system có giờ)", raw.post(body(stamped, "Gói năm hoàn tiền trong bao lâu?")));
            System.out.println("  cachedPrefixLength() của bạn giữa hai bản render: "
                + api.cachedPrefixLength(List.of("system:" + POLICY, "user:q"), List.of("system:" + stamped, "user:q"))
                + " đoạn (0 nghĩa là mất sạch cache)");
        });

        System.out.println("\n▶ Có đáng cache không? (không gọi API)");
        for (int calls : new int[] {1, 2, 20}) {
            System.out.println("  Prefix 5.000 token trên claude-opus-4-8, " + calls + " lần gọi: 5m → "
                + tryCall(() -> api.worthCaching("claude-opus-4-8", 5_000, calls, "5m")) + ", 1h → "
                + tryCall(() -> api.worthCaching("claude-opus-4-8", 5_000, calls, "1h")));
        }
    }

    private static Map<String, Object> body(String system, String question) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", Claude.MODEL);
        body.put("max_tokens", 200);
        body.put("system", List.of(Map.of("type", "text", "text", system, "cache_control", Map.of("type", "ephemeral"))));
        body.put("messages", List.of(Map.of("role", "user", "content", question + " Trả lời một câu tiếng Việt.")));
        return body;
    }

    private static void print(String question, RawApi.Response r) {
        if (r.status() != 200) throw new IllegalStateException("HTTP " + r.status() + " " + r.body());
        JsonNode u = r.json().path("usage");
        System.out.println("\n  ❓ " + question);
        System.out.println("  input_tokens " + u.path("input_tokens").asLong() + " · ghi cache " + u.path("cache_creation_input_tokens").asLong()
            + " · đọc cache " + u.path("cache_read_input_tokens").asLong() + " · " + r.millis() + "ms");
    }

    private interface Attempt<T> {
        T get();
    }

    private static <T> String tryCall(Attempt<T> attempt) {
        try {
            return String.valueOf(attempt.get());
        } catch (UnsupportedOperationException e) {
            return "⏳ chưa làm";
        }
    }
}
