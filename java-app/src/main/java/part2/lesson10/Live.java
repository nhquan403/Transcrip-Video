package part2.lesson10;

import com.fasterxml.jackson.databind.JsonNode;
import common.Claude;
import common.LiveSection;
import common.RawApi;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 10 chạy với Claude thật: bật adaptive thinking với display summarized và effort đặt đúng chỗ,
 * rồi gửi các request sai (effort ở gốc, budget_tokens) để xem model hiện tại trả lời thế nào.
 * Model hiện tại có thể không nằm trong danh sách của bài học: đó chính là lý do luôn phải nêu tên model.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-10 --live"
 */
public final class Live {
    private Live() {}

    public static void run(boolean useSolution, Claude claude) {
        Lesson10Api api = useSolution ? new Lesson10Solution() : new Lesson10();
        RawApi raw = RawApi.fromEnv();

        LiveSection.run("Kiểm tra request trước khi gửi, theo đúng model trong bài", () -> {
            Map<String, Object> wrong = Map.of("effort", "high", "thinking", Map.of("type", "enabled", "budget_tokens", 4000),
                "tool_choice", Map.of("type", "any"));
            for (String model : List.of("claude-opus-4-8", "claude-opus-4-6", "claude-sonnet-4-5", "claude-fable-5")) {
                System.out.println("  " + model + " → " + api.validate(model, wrong));
            }
        });

        LiveSection.run("Adaptive thinking + display summarized + output_config.effort trên " + Claude.MODEL, () -> {
            api.dropOldThinking(List.of());
            Map<String, Object> body = base();
            body.put("thinking", Map.of("type", "adaptive", "display", "summarized"));
            body.put("output_config", Map.of("effort", "high"));
            body.put("messages", List.of(Map.of("role", "user", "content",
                "Một agent 6 bước, mỗi bước đúng 95%. Xác suất cả chuỗi đúng là bao nhiêu? Trả lời ngắn bằng tiếng Việt.")));
            RawApi.Response r = raw.post(body);
            if (r.status() != 200) {
                System.out.println("  HTTP " + r.status() + ": " + r.body());
                return;
            }
            for (JsonNode block : r.json().path("content")) {
                String type = block.path("type").asText();
                String shown = type.equals("thinking") ? block.path("thinking").asText() : block.path("text").asText();
                System.out.println("  [" + type + "] " + (shown.isBlank() ? "(trống: thinking bị ẩn)" : shown.replace("\n", " ")));
            }
            System.out.println("  output_tokens (đã gồm phần thinking, dù hiện hay ẩn): " + r.json().path("usage").path("output_tokens"));
        });

        LiveSection.run("Hai lỗi di chuyển hay gặp, gửi thật để xem server trả lời gì", () -> {
            Map<String, Object> rootEffort = base();
            rootEffort.put("effort", "high");
            rootEffort.put("messages", List.of(Map.of("role", "user", "content", "Chào bạn")));
            RawApi.Response a = raw.post(rootEffort);
            System.out.println("  effort ở gốc → HTTP " + a.status() + " " + shorten(a.body()));

            Map<String, Object> legacy = base();
            legacy.put("max_tokens", 6000);
            legacy.put("thinking", Map.of("type", "enabled", "budget_tokens", 2000));
            legacy.put("messages", List.of(Map.of("role", "user", "content", "Chào bạn")));
            RawApi.Response b = raw.post(legacy);
            System.out.println("  budget_tokens trên " + Claude.MODEL + " → HTTP " + b.status() + " " + shorten(b.body()));
        });
    }

    private static Map<String, Object> base() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", Claude.MODEL);
        body.put("max_tokens", 4000);
        return body;
    }

    private static String shorten(String s) {
        return s.length() > 200 ? s.substring(0, 200) + "…" : s;
    }
}
