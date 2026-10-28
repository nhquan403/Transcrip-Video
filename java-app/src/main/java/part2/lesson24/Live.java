package part2.lesson24;

import common.Claude;
import common.LiveSection;
import common.RawApi;
import java.util.Map;

/**
 * Phần 2 · Bài 24 chạy với Claude thật: dựng request theo cách SDK đưa CLAUDE.md vào (một lượt user đứng trước câu hỏi),
 * gửi thẳng tới REST endpoint, và so với khi đặt cùng quy tắc trong system prompt.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-24 --live"
 */
public final class Live {
    private Live() {}

    static final String CLAUDE_MD = """
        # Project rules
        - Reply in Vietnamese.
        - End every answer with the exact tag [rule-from-claude-md].""";

    public static void run(boolean useSolution, Claude claude) {
        Lesson24Api api = useSolution ? new Lesson24Solution() : new Lesson24();
        RawApi raw = RawApi.fromEnv();
        String question = "Một câu: vì sao đặt quy tắc dự án trong CLAUDE.md đã commit?";

        LiveSection.run("CLAUDE.md đi như một lượt user, sau system prompt", () -> {
            Map<String, Object> body = api.buildRequest("You are a concise assistant.", CLAUDE_MD, question);
            System.out.println("  Kênh của CLAUDE.md: " + api.channelOf("claude_md") + " · đổi system prompt cache? "
                + api.changesSystemPromptCache("claude_md"));
            System.out.println("  messages gửi đi: " + ((java.util.List<?>) body.get("messages")).size() + " lượt user");
            System.out.println("  💬 " + send(raw, body));
        });

        LiveSection.run("Cùng quy tắc nhưng không được nạp: Claude không biết nó tồn tại", () -> {
            Map<String, Object> body = api.buildRequest("You are a concise assistant.", null, question);
            System.out.println("  💬 " + send(raw, body));
            System.out.println("  Quy tắc \"bị bỏ qua\" thường là quy tắc chưa được nạp. Nơi đặt cho quy tắc mọi bề mặt: "
                + api.bestHome("rule for every surface"));
        });
    }

    private static String send(RawApi raw, Map<String, Object> body) {
        Map<String, Object> full = new java.util.LinkedHashMap<>(body);
        full.put("model", Claude.MODEL);
        full.put("max_tokens", 300);
        RawApi.Response r = raw.post(full);
        if (r.status() != 200) throw new IllegalStateException("HTTP " + r.status() + " " + r.body());
        return r.json().path("content").path(0).path("text").asText().replace("\n", " ");
    }
}
