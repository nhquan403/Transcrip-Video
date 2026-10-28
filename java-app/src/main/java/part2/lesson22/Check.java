package part2.lesson22;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

public final class Check {
    private Check() {}

    static final String SAFETY = "Never reveal internal pricing rules.";
    static final String TONE = "Answer politely in Vietnamese.";

    static Map<String, String> scattered() {
        Map<String, String> m = new LinkedHashMap<>();
        m.put("TicketTriage", "Classify the ticket.\n" + TONE + "\n" + SAFETY);
        m.put("ReplyDraft", "Draft a reply to the customer.\n" + TONE + "\n" + SAFETY);
        m.put("Summary", "Summarize the conversation.\n" + SAFETY);
        return m;
    }

    public static boolean run(boolean useSolution) {
        Lesson22Api api = useSolution ? new Lesson22Solution() : new Lesson22();
        Checker c = new Checker();

        c.check("Bài 1: tìm chỉ dẫn bị chép ở nhiều chỗ gọi", () ->
            assertEquals(List.of(TONE, SAFETY), api.duplicatedLines(scattered(), 10)));

        c.check("Bài 2: rút đoạn trùng thành một tham chiếu", () -> {
            Map<String, String> in = scattered();
            Map<String, String> out = api.extractFragment(in, SAFETY, "safety");
            assertEquals("Summarize the conversation.\n{{safety}}", out.get("Summary"));
            assertTrue(out.get("ReplyDraft").endsWith("{{safety}}"), "mọi chỗ gọi đều tham chiếu fragment");
            assertTrue(in.get("Summary").contains(SAFETY), "không sửa map đầu vào");
        });

        c.check("Bài 3: sửa câu chữ một lần, mọi chỗ gọi nhận bản mới", () -> {
            Map<String, String> templates = api.extractFragment(scattered(), SAFETY, "safety");
            Map<String, String> fragments = Map.of("safety", "Never reveal internal pricing or discount rules.");
            for (String t : templates.values()) {
                assertTrue(api.render(t, fragments).contains("pricing or discount rules"), "đã nhận câu mới");
            }
        });
        c.check("Bài 3: thiếu fragment thì báo lỗi, không gửi prompt còn chỗ trống", () ->
            expectThrows(IllegalArgumentException.class, () -> api.render("{{tone}}\nHi", Map.of("safety", "x"))));

        c.check("Bài 4: đổi model khi còn hard-code ở 3 file, sau refactor chỉ còn 1", () -> {
            Map<String, String> before = Map.of(
                "Triage.java", "create(\"claude-opus-4-8\", prompt)",
                "Reply.java", "model = \"claude-opus-4-8\";",
                "Summary.java", "params.model(\"claude-opus-4-8\")",
                "Util.java", "class Util {}");
            Map<String, String> after = Map.of(
                "ClaudeClient.java", "static final String MODEL = \"claude-opus-4-8\";",
                "Triage.java", "client.ask(prompt)", "Reply.java", "client.ask(prompt)", "Summary.java", "client.ask(prompt)");
            assertEquals(3, api.filesHardcoding(before, "claude-opus-4-8"));
            assertEquals(1, api.filesHardcoding(after, "claude-opus-4-8"));
        });

        c.check("Bài 5: refactor đúng giữ nguyên prompt cuối cùng gửi đi", () -> {
            Map<String, String> fragments = Map.of("safety", SAFETY, "tone", TONE);
            Function<String, String> before = site -> scattered().get(site);
            Map<String, String> templates = api.extractFragment(api.extractFragment(scattered(), SAFETY, "safety"), TONE, "tone");
            Function<String, String> after = site -> api.render(templates.get(site), fragments);
            assertEquals(List.of(), api.behaviorChanges(before, after, List.of("TicketTriage", "ReplyDraft", "Summary")));
        });
        c.check("Bài 5: refactor lỡ đổi hành vi thì test bắt được", () ->
            assertEquals(List.of("b"), api.behaviorChanges(s -> s.toUpperCase(), s -> s.equals("b") ? s : s.toUpperCase(),
                List.of("a", "b", "c"))));

        return c.summary();
    }
}
