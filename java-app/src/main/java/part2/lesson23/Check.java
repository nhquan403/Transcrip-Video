package part2.lesson23;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;

import common.Checker;
import java.util.List;
import part2.lesson23.Lesson23Api.Surface;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson23Api api = useSolution ? new Lesson23Solution() : new Lesson23();
        Checker c = new Checker();

        c.check("Bài 1: raw API không tự nạp gì ngoài system parameter bạn gửi", () ->
            assertEquals(List.of("system parameter"), api.loadedInstructions(Surface.RAW_API, true, List.of("project"))));
        c.check("Bài 1: Agent SDK mặc định: prompt tối giản và CLAUDE.md (nguồn mặc định bật cả hai)", () ->
            assertEquals(List.of("minimal default prompt", "CLAUDE.md (project)", "CLAUDE.md (user)"),
                api.loadedInstructions(Surface.AGENT_SDK, false, null)));
        c.check("Bài 1: preset không quyết định CLAUDE.md; settingSources mới quyết định", () -> {
            assertEquals(List.of("claude code preset"), api.loadedInstructions(Surface.AGENT_SDK, true, List.of()));
            assertEquals(List.of("minimal default prompt", "CLAUDE.md (project)"),
                api.loadedInstructions(Surface.AGENT_SDK, false, List.of("project")));
        });
        c.check("Bài 1: Claude Code nạp đầy đủ ngay khi mở phiên", () -> assertEquals(
            List.of("full claude code prompt", "CLAUDE.md hierarchy", "rules", "auto-memory"),
            api.loadedInstructions(Surface.CLAUDE_CODE, false, List.of())));

        c.check("Bài 2: quy tắc trong chat app chỉ ở lại chat app", () -> {
            assertTrue(api.reaches("hosted_chat", Surface.HOSTED_CHAT), "trong chat");
            assertTrue(!api.reaches("hosted_chat", Surface.CLAUDE_CODE), "không theo sang Claude Code");
            assertTrue(!api.reaches("hosted_chat", Surface.RAW_API), "không theo sang API");
        });
        c.check("Bài 2: CLAUDE.md tới Claude Code và Agent SDK, không tới raw API", () -> {
            assertTrue(api.reaches("claude_md", Surface.CLAUDE_CODE), "Claude Code");
            assertTrue(api.reaches("claude_md", Surface.AGENT_SDK), "Agent SDK");
            assertTrue(!api.reaches("claude_md", Surface.RAW_API), "raw API không đọc file");
        });

        c.check("Bài 3: nghi lớp vỏ trước, model sau", () -> assertEquals(List.of(
            "reproduce the same prompt on a surface you control", "compare what each surface loaded",
            "only then inspect the model output"), api.debugSteps()));

        return c.summary();
    }
}
