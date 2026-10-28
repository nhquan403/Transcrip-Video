package part2.lesson38;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import part2.lesson38.Lesson38Api.AgentDef;
import part2.lesson38.Lesson38Api.Author;
import part2.lesson38.Lesson38Api.Control;

public final class Check {
    private Check() {}

    static final String REVIEWER = """
        ---
        name: code-reviewer
        description: Use after code changes to review diffs: focus on bugs
        tools: Read, Grep ,Glob
        model: sonnet
        memory: project
        ---
        You are a strict reviewer.
        Return a short summary.
        """;

    public static boolean run(boolean useSolution) {
        Lesson38Api api = useSolution ? new Lesson38Solution() : new Lesson38();
        Checker c = new Checker();
        List<Map<String, Object>> history = List.of(
            Map.of("role", "user", "content", "Dự án này dùng Gradle."),
            Map.of("role", "assistant", "content", "Đã ghi nhận."));

        c.check("Bài 1a: main agent thấy toàn bộ hội thoại", () -> {
            List<Map<String, Object>> before = new ArrayList<>(history);
            List<Map<String, Object>> msgs = api.mainAgentMessages(history, "Chạy test nào?");
            assertEquals(3, msgs.size());
            assertEquals(history.get(0), msgs.get(0));
            assertEquals(Map.of("role", "user", "content", "Chạy test nào?"), msgs.get(2));
            assertEquals(before, history);
        });
        c.check("Bài 1b: subagent bắt đầu sạch, chỉ có task", () -> {
            Map<String, Object> body = api.subagentRequest(history, "You are a test runner.", "Chạy test nào?");
            assertEquals("You are a test runner.", body.get("system"));
            assertEquals(List.of(Map.of("role", "user", "content", "Chạy test nào?")), body.get("messages"));
        });
        c.check("Bài 2: đọc front matter của subagent", () -> {
            AgentDef d = api.parseAgent(REVIEWER);
            assertEquals("code-reviewer", d.name());
            assertEquals("Use after code changes to review diffs: focus on bugs", d.description());
            assertEquals(List.of("Read", "Grep", "Glob"), d.tools());
            assertEquals("sonnet", d.model());
            assertTrue(d.memory(), "memory: project bật subagent memory");
            assertEquals("You are a strict reviewer.\nReturn a short summary.", d.systemPrompt());
            AgentDef min = api.parseAgent("---\nname: tiny\ndescription: Use for quick lookups\n---\nBe brief.");
            assertEquals(null, min.tools());
            assertEquals(null, min.model());
            assertTrue(!min.memory(), "không khai báo memory");
        });
        c.check("Bài 2: chỉ name và description là bắt buộc", () -> {
            expectThrows(IllegalArgumentException.class, () -> api.parseAgent("---\nname: x\n---\nbody"));
            expectThrows(IllegalArgumentException.class, () -> api.parseAgent("---\ndescription: y\n---\nbody"));
            expectThrows(IllegalArgumentException.class, () -> api.parseAgent("Just a prompt, no front matter"));
        });
        c.check("Bài 2b: bỏ trống tools thì kế thừa toàn bộ", () -> {
            List<String> main = List.of("Read", "Edit", "Bash");
            assertEquals(main, api.effectiveTools(new AgentDef("a", "d", null, null, false, ""), main));
            assertEquals(List.of("Read"), api.effectiveTools(new AgentDef("a", "d", List.of("Read"), null, false, ""), main));
        });
        c.check("Bài 3: gợi ý, chắc chắn một task, hay cả phiên", () -> {
            assertEquals(Control.SUGGEST, api.controlOf("Use the code-reviewer agent to check my diff"));
            assertEquals(Control.ONE_TASK, api.controlOf("@code-reviewer check my diff"));
            assertEquals(Control.ONE_TASK, api.controlOf("please ask @code-reviewer"));
            assertEquals(Control.WHOLE_SESSION, api.controlOf("claude --agent code-reviewer"));
            assertEquals(Control.SUGGEST, api.controlOf("email me @ noon"));
        });
        c.check("Bài 4: ai viết, bật bằng cách nào", () -> {
            assertEquals(Author.DEVELOPER, api.authorOf("CLAUDE.md"));
            assertEquals(Author.AGENT, api.authorOf("auto-memory"));
            assertEquals(Author.AGENT, api.authorOf("subagent memory"));
            assertEquals("on by default", api.enabledBy("auto-memory"));
            assertEquals("front matter field", api.enabledBy("subagent memory"));
            assertEquals("you write the file", api.enabledBy("CLAUDE.md"));
            expectThrows(IllegalArgumentException.class, () -> api.authorOf("chat history"));
        });
        c.check("Bài 5: policy → rule, procedure → skill, isolation → subagent", () -> {
            assertEquals("rule", api.chooseMechanism(true, false, false));
            assertEquals("skill", api.chooseMechanism(false, false, false));
            assertEquals("subagent", api.chooseMechanism(false, true, false));
            assertEquals("permissions or hooks", api.chooseMechanism(true, false, true));
        });

        return c.summary();
    }
}
