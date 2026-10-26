package part2.lesson05;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.net.http.HttpRequest;
import java.util.Map;
import part2.lesson05.Lesson05Api.ErrorAction;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson05Api api = useSolution ? new Lesson05Solution() : new Lesson05();
        Checker c = new Checker();

        c.check("Bài 1: POST tới /v1/messages với đủ ba header", () -> {
            HttpRequest r = api.buildRequest("https://api.anthropic.com", "sk-test", "{}");
            assertEquals("POST", r.method());
            assertEquals(Lesson05Api.MESSAGES_URL, r.uri().toString());
            assertEquals("sk-test", r.headers().firstValue("x-api-key").orElse(null));
            assertEquals("2023-06-01", r.headers().firstValue("anthropic-version").orElse(null));
            assertEquals("application/json", r.headers().firstValue("content-type").orElse(null));
        });

        c.check("Bài 2: đọc key từ môi trường", () ->
            assertEquals("sk-abc", api.loadApiKey(Map.of("ANTHROPIC_API_KEY", "sk-abc"))));
        c.check("Bài 2: thiếu key thì báo lỗi rõ ràng, không dùng key mặc định", () -> {
            expectThrows(IllegalStateException.class, () -> api.loadApiKey(Map.of()));
            expectThrows(IllegalStateException.class, () -> api.loadApiKey(Map.of("ANTHROPIC_API_KEY", " ")));
        });

        c.check("Bài 3: 429 và 5xx thì retry khi còn lượt", () -> {
            assertEquals(ErrorAction.RETRY, api.onError(429, 1, 3));
            assertEquals(ErrorAction.RETRY, api.onError(503, 2, 3));
            assertEquals(ErrorAction.SURFACE, api.onError(500, 3, 3));
        });
        c.check("Bài 3: 401 báo ngay, không trốn trong vòng retry", () -> {
            assertEquals(ErrorAction.SURFACE, api.onError(401, 1, 5));
            assertEquals(ErrorAction.SURFACE, api.onError(400, 1, 5));
        });

        c.check("Bài 4: cấu hình chung được commit", () -> {
            assertTrue(api.shouldCommit("CLAUDE.md"), "CLAUDE.md");
            assertTrue(api.shouldCommit(".claude/settings.json"), ".claude/settings.json");
            assertTrue(api.shouldCommit("src/Main.java"), "code");
        });
        c.check("Bài 4: cấu hình cá nhân và bí mật thì không", () -> {
            assertTrue(!api.shouldCommit(".claude/settings.local.json"), "settings.local.json");
            assertTrue(!api.shouldCommit("app/.claude/settings.local.json"), "settings.local.json trong thư mục con");
            assertTrue(!api.shouldCommit(".env"), ".env");
            assertTrue(!api.shouldCommit("config/.env.production"), ".env.production");
        });

        c.check("Bài 5: snapshot có ngày và ID không ngày từ 4.6 trở lên là cố định", () -> {
            for (String id : new String[] {"claude-sonnet-4-5-20250929", "claude-3-7-sonnet-20250219", "claude-opus-4-6",
                "claude-opus-4-8", "claude-sonnet-5-5"}) {
                assertTrue(api.isPinnedModel(id), id + " phải là pinned");
            }
        });
        c.check("Bài 5: alias trôi nổi trước 4.6 và mọi ID có 'latest' thì không", () -> {
            for (String id : new String[] {"claude-sonnet-4-5", "claude-opus-4-1", "claude-opus-4", "claude-3-7-sonnet-latest"}) {
                assertTrue(!api.isPinnedModel(id), id + " là alias");
            }
        });

        return c.summary();
    }
}
