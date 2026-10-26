package part2.lesson15;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;

import common.Checker;
import part2.lesson15.Lesson15Api.Action;
import part2.lesson15.Lesson15Api.Family;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson15Api api = useSolution ? new Lesson15Solution() : new Lesson15();
        Checker c = new Checker();

        c.check("Bài 1: GET an toàn, POST và DELETE thì không", () -> {
            assertTrue(api.isSafe("GET"), "GET");
            assertTrue(!api.isSafe("POST"), "POST");
            assertTrue(!api.isSafe("DELETE"), "DELETE đổi trạng thái server");
        });
        c.check("Bài 2: DELETE và PUT idempotent, POST và PATCH thì không", () -> {
            assertTrue(api.isIdempotent("DELETE"), "xóa hai lần vẫn là đã xóa");
            assertTrue(api.isIdempotent("PUT"), "thay toàn bộ hai lần vẫn cùng kết quả");
            assertTrue(api.isIdempotent("get"), "an toàn thì cũng idempotent");
            assertTrue(!api.isIdempotent("POST"), "POST");
            assertTrue(!api.isIdempotent("PATCH"), "PATCH");
        });
        c.check("Bài 3: chữ số đầu cho biết vấn đề nằm đâu", () -> {
            assertEquals(Family.SUCCESS, api.family(200));
            assertEquals(Family.REDIRECT, api.family(307));
            assertEquals(Family.CLIENT_ERROR, api.family(429));
            assertEquals(Family.SERVER_ERROR, api.family(529));
        });
        c.check("Bài 4: 401 khác 403", () -> {
            assertEquals(Action.FIX_API_KEY, api.triage(401));
            assertEquals(Action.CHECK_PERMISSIONS, api.triage(403));
        });
        c.check("Bài 4: 400 phải sửa body; 429 và 5xx thì chờ rồi thử lại", () -> {
            assertEquals(Action.FIX_REQUEST_BODY, api.triage(400));
            assertEquals(Action.FIX_REQUEST_BODY, api.triage(413));
            assertEquals(Action.BACK_OFF_AND_RETRY, api.triage(429));
            assertEquals(Action.BACK_OFF_AND_RETRY, api.triage(500));
            assertEquals(Action.PARSE_BODY, api.triage(200));
        });
        c.check("Bài 5: POST bị timeout thì gửi lại mù quáng có thể tạo thêm một câu trả lời", () -> {
            assertTrue(!api.safeToResendAfterTimeout("POST"), "POST /v1/messages là một lần sinh mới");
            assertTrue(api.safeToResendAfterTimeout("GET"), "GET đọc lại vô hại");
            assertTrue(api.safeToResendAfterTimeout("DELETE"), "DELETE idempotent");
        });

        return c.summary();
    }
}
