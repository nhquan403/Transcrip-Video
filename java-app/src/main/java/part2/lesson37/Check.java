package part2.lesson37;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.List;
import part2.lesson37.Lesson37Api.Item;
import part2.lesson37.Lesson37Api.Scope;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson37Api api = useSolution ? new Lesson37Solution() : new Lesson37();
        Checker c = new Checker();

        c.check("Bài 1: rule luôn nạp đủ; skill chỉ tốn description cho tới khi được gọi", () -> {
            assertEquals(800, api.contextTokens(new Item("rule", 0, 800), false));
            assertEquals(800, api.contextTokens(new Item("rule", 0, 800), true));
            assertEquals(40, api.contextTokens(new Item("skill", 40, 5000), false));
            assertEquals(5040, api.contextTokens(new Item("skill", 40, 5000), true));
            expectThrows(IllegalArgumentException.class, () -> api.contextTokens(new Item("hook", 1, 1), false));
        });
        c.check("Bài 2: rule tự nạp lúc bắt đầu, hoặc khi chạm file khớp đường dẫn", () -> {
            assertTrue(api.ruleLoaded(null, List.of()), "rule không giới hạn đường dẫn nạp ngay khi phiên bắt đầu");
            assertTrue(api.ruleLoaded("src/api/**", List.of("README.md", "src/api/user/Handler.java")), "chạm file trong src/api");
            assertTrue(!api.ruleLoaded("src/api/**", List.of("README.md", "src/web/App.tsx")), "chưa chạm file khớp");
            assertTrue(!api.ruleLoaded("**/*.sql", List.of()), "chưa chạm file nào");
        });
        c.check("Bài 3: built-in, skill thắng command trùng tên, tên lấy từ thư mục", () -> {
            List<String> files = List.of(".claude/commands/deploy.md", ".claude/skills/deploy/SKILL.md",
                ".claude/commands/review.md", "~/.claude/skills/standup/SKILL.md", "docs/release.md");
            assertEquals("builtin", api.resolveSlash("/clear", files));
            assertEquals(".claude/skills/deploy/SKILL.md", api.resolveSlash("/deploy", files));
            assertEquals(".claude/commands/review.md", api.resolveSlash("/review", files));
            assertEquals("~/.claude/skills/standup/SKILL.md", api.resolveSlash("/standup", files));
            assertEquals(null, api.resolveSlash("/release", files));
            assertEquals(null, api.resolveSlash("/SKILL", files));
        });
        c.check("Bài 4: description dự phòng và cảnh báo skill khó kích hoạt", () -> {
            assertEquals("Deploy to staging", api.effectiveDescription(" Deploy to staging ", "Steps..."));
            assertEquals("Steps to deploy.", api.effectiveDescription("  ", " Steps to deploy. "));
            assertEquals("", api.effectiveDescription(null, null));
            assertEquals(List.of(), api.skillWarnings(".claude/skills/deploy/SKILL.md", "Use when deploying"));
            assertEquals(List.of("NO_DESCRIPTION"), api.skillWarnings(".claude/skills/deploy/SKILL.md", ""));
            assertEquals(List.of("NOT_SCANNED", "NO_DESCRIPTION"), api.skillWarnings("notes/deploy.md", null));
        });
        c.check("Bài 5: vị trí file quyết định phạm vi", () -> {
            assertEquals(Scope.TEAM, api.scopeOf(".claude/commands/review.md"));
            assertEquals(Scope.PERSONAL, api.scopeOf("~/.claude/skills/standup/SKILL.md"));
            assertEquals(Scope.NONE, api.scopeOf("docs/claude/commands/review.md"));
        });

        return c.summary();
    }
}
