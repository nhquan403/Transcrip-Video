package part2.lesson23;

import common.Claude;
import common.LiveSection;
import common.RawApi;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 23 chạy với Claude thật: trên raw API, Claude chỉ biết những gì bạn gửi. Một quy tắc "nằm trong CLAUDE.md"
 * không tới được lời gọi raw API cho tới khi chính bạn đưa nó vào system parameter.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-23 --live"
 */
public final class Live {
    private Live() {}

    static final String RULE = "Always finish every answer with the exact tag [team-rule-42].";

    public static void run(boolean useSolution, Claude claude) {
        Lesson23Api api = useSolution ? new Lesson23Solution() : new Lesson23();
        RawApi raw = RawApi.fromEnv();

        LiveSection.run("Cùng một câu hỏi, hai request raw API", () -> {
            System.out.println("  Raw API tự nạp: " + api.loadedInstructions(Lesson23Api.Surface.RAW_API, false, null)
                + " · quy tắc trong CLAUDE.md có tới raw API không? " + api.reaches("claude_md", Lesson23Api.Surface.RAW_API));
            String question = "Trong một câu tiếng Việt: API khác Agent SDK ở điểm nào?";
            System.out.println("  Không gửi quy tắc → " + text(raw.post(body(null, question))));
            System.out.println("  Gửi quy tắc trong system → " + text(raw.post(body(RULE, question))));
            System.out.println("  Thứ tự debug khi hai bề mặt cư xử khác nhau: " + api.debugSteps());
        });
    }

    private static Map<String, Object> body(String system, String question) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", Claude.MODEL);
        body.put("max_tokens", 300);
        if (system != null) body.put("system", system);
        body.put("messages", List.of(Map.of("role", "user", "content", question)));
        return body;
    }

    private static String text(RawApi.Response r) {
        if (r.status() != 200) throw new IllegalStateException("HTTP " + r.status() + " " + r.body());
        return r.json().path("content").path(0).path("text").asText().replace("\n", " ");
    }
}
