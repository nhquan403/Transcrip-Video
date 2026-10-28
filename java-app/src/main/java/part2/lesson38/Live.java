package part2.lesson38;

import common.Claude;
import common.LiveSection;
import common.RawApi;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 38 chạy với Claude thật: cùng một câu hỏi gửi theo kiểu main agent (có cả hội thoại) và theo kiểu subagent
 * (context sạch, chỉ có task). Subagent không biết những gì bạn đã nói với main agent.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-38 --live"
 */
public final class Live {
    private Live() {}

    static final List<Map<String, Object>> HISTORY = List.of(
        Map.of("role", "user", "content", "Ghi nhớ giúp tôi: dự án này build bằng Gradle, không dùng Maven."),
        Map.of("role", "assistant", "content", "Đã ghi nhận: dự án build bằng Gradle."));
    static final String TASK = "Một câu tiếng Việt: dự án này build bằng công cụ gì? Nếu không có thông tin, hãy nói là không biết.";

    public static void run(boolean useSolution, Claude claude) {
        Lesson38Api api = useSolution ? new Lesson38Solution() : new Lesson38();
        RawApi raw = RawApi.fromEnv();

        LiveSection.run("Main agent: thấy cả hội thoại", () -> {
            List<Map<String, Object>> msgs = api.mainAgentMessages(HISTORY, TASK);
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("messages", msgs);
            System.out.println("  messages gửi đi: " + msgs.size() + " lượt");
            System.out.println("  💬 " + send(raw, body));
        });

        LiveSection.run("Subagent: context riêng, chỉ có task được giao", () -> {
            Map<String, Object> body = api.subagentRequest(HISTORY, "You are a build helper. Reply with a one-sentence summary.", TASK);
            System.out.println("  messages gửi đi: " + ((List<?>) body.get("messages")).size() + " lượt (history bị bỏ lại)");
            System.out.println("  💬 " + send(raw, body));
            System.out.println("  Cần chạy riêng, tách khỏi context chính → " + api.chooseMechanism(false, true, false));
        });
    }

    private static String send(RawApi raw, Map<String, Object> body) {
        Map<String, Object> full = new LinkedHashMap<>(body);
        full.put("model", Claude.MODEL);
        full.put("max_tokens", 300);
        RawApi.Response r = raw.post(full);
        if (r.status() != 200) throw new IllegalStateException("HTTP " + r.status() + " " + r.body());
        return r.json().path("content").path(0).path("text").asText().replace("\n", " ");
    }
}
