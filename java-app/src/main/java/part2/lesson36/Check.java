package part2.lesson36;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.List;
import java.util.Map;
import part2.lesson36.Lesson36Api.DepState;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson36Api api = useSolution ? new Lesson36Solution() : new Lesson36();
        Checker c = new Checker();

        List<String> tags = List.of("deploy--v2.0.0", "deploy--v2.1.4", "deploy--v3.0.0", "deploy--v2.9.0-rc",
            "deploy-extra--v2.5.0", "lint--v2.8.0", "v2.7.0", "release-2.6.0");
        c.check("Bài 1: tag deploy--vX.Y.Z; resolve lấy tag cao nhất của đúng plugin trong range", () -> {
            assertEquals("2.1.4", api.resolveFromTags("deploy", "^2.0", tags));
            assertEquals("3.0.0", api.resolveFromTags("deploy", ">=2.0", tags));
            assertEquals("2.1.4", api.resolveFromTags("deploy", "~2.1.0", tags));
        });
        c.check("Bài 1: không tag nào khớp thì trả null (no-matching-tag), không đoán", () -> {
            assertEquals(null, api.resolveFromTags("deploy", "^4.0", tags));
            assertEquals(null, api.resolveFromTags("secrets", "^1.0", tags));
        });
        c.check("Bài 2: commit file khai báo, giữ file cá nhân ngoài repo", () -> {
            assertTrue(api.shouldCommit(".claude-plugin/plugin.json"), "manifest");
            assertTrue(api.shouldCommit(".claude-plugin/marketplace.json"), "marketplace file");
            assertTrue(api.shouldCommit(".claude/settings.json"), "project settings ghi plugin đã bật");
            assertTrue(!api.shouldCommit(".claude/settings.local.json"), "local settings");
            assertTrue(!api.shouldCommit("~/.claude/settings.json"), "user settings");
            expectThrows(IllegalArgumentException.class, () -> api.shouldCommit("README.md"));
        });
        c.check("Bài 3: đọc đúng mã lỗi", () -> {
            assertEquals("dependency-unsatisfied", api.diagnose(new DepState(false, false, null, "^2.0")));
            assertEquals("dependency-unsatisfied", api.diagnose(new DepState(true, false, "2.1.0", "^2.0")));
            assertEquals("dependency-version-unsatisfied", api.diagnose(new DepState(true, true, "3.0.0", "^2.0")));
            assertEquals(null, api.diagnose(new DepState(true, true, "2.4.0", "^2.0")));
        });
        c.check("Bài 4: mỗi mã lỗi một cách sửa", () -> {
            assertEquals("install or enable it", api.fixFor("dependency-unsatisfied"));
            assertEquals("adjust the range or bump the release", api.fixFor("dependency-version-unsatisfied"));
            assertEquals("author pushes a tag", api.fixFor("no-matching-tag"));
            assertEquals("reconcile the ranges", api.fixFor("range-conflict"));
            assertEquals("add to allow list", api.fixFor("cross-marketplace"));
        });
        c.check("Bài 5: cross-marketplace bị chặn mặc định, tin cậy không nối chuỗi", () -> {
            Map<String, List<String>> allow = Map.of("team", List.of("community"), "community", List.of("random"));
            assertTrue(api.crossMarketplaceAllowed("team", "team", Map.of()), "cùng marketplace");
            assertTrue(!api.crossMarketplaceAllowed("team", "community", Map.of()), "mặc định là không");
            assertTrue(api.crossMarketplaceAllowed("team", "community", allow), "đã allow list");
            assertTrue(!api.crossMarketplaceAllowed("team", "random", allow), "không nối chuỗi");
        });

        return c.summary();
    }
}
