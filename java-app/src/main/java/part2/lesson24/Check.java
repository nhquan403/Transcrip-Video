package part2.lesson24;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;

import common.Checker;
import java.util.List;
import java.util.Map;
import part2.lesson24.Lesson24Api.Channel;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson24Api api = useSolution ? new Lesson24Solution() : new Lesson24();
        Checker c = new Checker();

        c.check("Bài 1: CLAUDE.md không nằm trong system prompt, mà đi như một user message", () -> {
            assertEquals(Channel.USER_MESSAGE, api.channelOf("claude_md"));
            assertEquals(Channel.SYSTEM_PROMPT, api.channelOf("output_style"));
            assertEquals(Channel.SYSTEM_PROMPT, api.channelOf("append"));
            assertEquals(Channel.IN_SESSION, api.channelOf("typed_in_session"));
        });
        c.check("Bài 2: chỉ output style, append và system prompt chạm vào system prompt cache", () -> {
            assertTrue(api.changesSystemPromptCache("append"), "append");
            assertTrue(api.changesSystemPromptCache("output_style"), "output style");
            assertTrue(!api.changesSystemPromptCache("claude_md"), "CLAUDE.md không chạm cache của system prompt");
        });
        c.check("Bài 3: gõ trong phiên thì mất khi phiên kết thúc", () -> {
            assertTrue(!api.persistsAfterSession("typed_in_session"), "trong phiên");
            assertTrue(api.persistsAfterSession("claude_md"), "CLAUDE.md");
        });
        c.check("Bài 4: CLAUDE.md thành lượt user đứng trước câu hỏi, system ở riêng", () -> {
            Map<String, Object> body = api.buildRequest("You are a tutor.", "# Rules\n- Reply in Vietnamese", "REST là gì?");
            assertEquals("You are a tutor.", body.get("system"));
            assertEquals(List.of(Map.of("role", "user", "content", "# Rules\n- Reply in Vietnamese"),
                Map.of("role", "user", "content", "REST là gì?")), body.get("messages"));
        });
        c.check("Bài 4: không có CLAUDE.md thì chỉ còn câu hỏi", () ->
            assertEquals(List.of(Map.of("role", "user", "content", "Hi")), api.buildRequest(null, "  ", "Hi").get("messages")));
        c.check("Bài 5: chọn nhà cho quy tắc", () -> {
            assertEquals("append or output style", api.bestHome("system-level rule"));
            assertEquals("committed CLAUDE.md", api.bestHome("portable project rule"));
            assertEquals("committed CLAUDE.md", api.bestHome("rule for every surface"));
            assertEquals("in-session message", api.bestHome("one-off steering"));
        });

        return c.summary();
    }
}
