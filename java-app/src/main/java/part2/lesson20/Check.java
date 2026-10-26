package part2.lesson20;

import static common.Checker.assertEquals;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.List;
import java.util.Map;
import part2.lesson20.Lesson20Api.Bump;
import part2.lesson20.Lesson20Api.Placement;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson20Api api = useSolution ? new Lesson20Solution() : new Lesson20();
        Checker c = new Checker();

        c.check("Bài 1: hành vi chung được commit", () -> {
            for (String p : new String[] {"CLAUDE.md", ".claude/settings.json", "prompts/triage.md", "schemas/ticket.json", "app/CLAUDE.md"}) {
                assertEquals(Placement.COMMIT_SHARED, api.placement(p));
            }
        });
        c.check("Bài 1: sở thích cá nhân giữ local, bí mật không bao giờ commit", () -> {
            assertEquals(Placement.KEEP_LOCAL, api.placement(".claude/settings.local.json"));
            assertEquals(Placement.KEEP_LOCAL, api.placement("CLAUDE.local.md"));
            assertEquals(Placement.NEVER_COMMIT_SECRET, api.placement(".env"));
            assertEquals(Placement.NEVER_COMMIT_SECRET, api.placement("deploy/.env.production"));
            assertEquals(Placement.NEVER_COMMIT_SECRET, api.placement("keys/server.pem"));
        });

        c.check("Bài 2: phá vỡ người đang dùng là MAJOR, kể cả khi có thêm tính năng", () -> {
            assertEquals(Bump.MAJOR, api.requiredBump(true, true));
            assertEquals(Bump.MINOR, api.requiredBump(false, true));
            assertEquals(Bump.PATCH, api.requiredBump(false, false));
        });

        c.check("Bài 3: tăng version và đặt lại các số phía sau", () -> {
            assertEquals("3.0.0", api.bump("2.4.7", Bump.MAJOR));
            assertEquals("2.5.0", api.bump("2.4.7", Bump.MINOR));
            assertEquals("2.4.8", api.bump("2.4.7", Bump.PATCH));
            assertEquals("1.10.0", api.bump("1.9.3", Bump.MINOR));
            expectThrows(IllegalArgumentException.class, () -> api.bump("v2.4", Bump.PATCH));
        });

        c.check("Bài 4: CI chặn cấu hình hỏng trước khi merge", () -> assertEquals(List.of(
                ".claude/settings.json: model is not pinned",
                "CLAUDE.md: empty CLAUDE.md",
                "prompts/reply.md: unfinished prompt",
                "schemas/ticket.json: invalid JSON"),
            api.ciCheck(Map.of(
                "schemas/ticket.json", "{\"type\": \"object\", ",
                "CLAUDE.md", "   \n",
                ".claude/settings.json", "{\"model\": \"claude-sonnet-latest\", \"permissions\": {}}",
                "prompts/reply.md", "You are a support assistant.\nTODO: thêm quy tắc hoàn tiền",
                "prompts/triage.md", "Classify the ticket."))));
        c.check("Bài 4: cấu hình sạch thì CI xanh", () -> assertEquals(List.of(), api.ciCheck(Map.of(
            ".claude/settings.json", "{\"model\": \"claude-opus-4-8\"}", "CLAUDE.md", "# Quy tắc dự án\n- Trả lời bằng tiếng Việt",
            "schemas/ticket.json", "{\"type\": \"object\"}"))));

        return c.summary();
    }
}
