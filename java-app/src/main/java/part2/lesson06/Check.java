package part2.lesson06;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import part2.lesson06.Lesson06Api.CallLog;
import part2.lesson06.Lesson06Api.Fix;
import part2.lesson06.Lesson06Api.Health;
import part2.lesson06.Lesson06Api.PromptVersion;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson06Api api = useSolution ? new Lesson06Solution() : new Lesson06();
        Checker c = new Checker();

        c.check("Bài 1: p95 độ trễ, tổng token, tỉ lệ lỗi và từ chối", () -> {
            List<CallLog> logs = new ArrayList<>();
            for (int i = 1; i <= 20; i++) logs.add(new CallLog(i * 100L, 1000, 200, 200, "end_turn"));
            logs.set(3, new CallLog(400, 0, 0, 529, null));
            logs.set(7, new CallLog(800, 1000, 10, 200, "refusal"));
            Health h = api.health(logs);
            assertEquals(1900L, h.p95LatencyMs());
            assertEquals(18L * 1200 + 1010, h.totalTokens());
            assertTrue(Math.abs(h.errorAndRefusalRate() - 0.1) < 1e-9, "2/20 = 10%, nhận " + h.errorAndRefusalRate());
        });
        c.check("Bài 1: chưa có log thì báo lỗi", () ->
            expectThrows(IllegalArgumentException.class, () -> api.health(List.of())));

        c.check("Bài 2: lỗi tạm thời thì retry, request sai thì sửa request", () -> {
            assertEquals(Fix.RETRY_WITH_BACKOFF, api.readSignature(429, null));
            assertEquals(Fix.RETRY_WITH_BACKOFF, api.readSignature(529, null));
            assertEquals(Fix.FIX_REQUEST, api.readSignature(400, null));
        });
        c.check("Bài 2: refusal là chuyện prompt/policy, max_tokens là nâng giới hạn", () -> {
            assertEquals(Fix.REVIEW_PROMPT_OR_POLICY, api.readSignature(200, "refusal"));
            assertEquals(Fix.RAISE_LIMIT_OR_ASK_SHORTER, api.readSignature(200, "max_tokens"));
            assertEquals(Fix.OK, api.readSignature(200, "end_turn"));
        });

        Map<String, Boolean> oldPass = Map.of("ex-1", true, "ex-2", true, "ex-3", false, "ex-4", true);
        c.check("Bài 3: tìm ví dụ trước đạt, giờ trượt (kể cả bị thiếu)", () -> {
            assertEquals(List.of("ex-2", "ex-4"),
                api.regressions(oldPass, Map.of("ex-1", true, "ex-2", false, "ex-3", true)));
            assertEquals(List.of(), api.regressions(oldPass, Map.of("ex-1", true, "ex-2", true, "ex-3", false, "ex-4", true)));
        });
        c.check("Bài 4: tỉ lệ đạt cao hơn nhưng có regression thì chưa được chuyển", () ->
            assertTrue(!api.safeToCutOver(oldPass, Map.of("ex-1", false, "ex-2", true, "ex-3", true, "ex-4", true)),
                "ex-1 bị regression"));
        c.check("Bài 4: không regression và không tụt chất lượng thì chuyển", () ->
            assertTrue(api.safeToCutOver(oldPass, Map.of("ex-1", true, "ex-2", true, "ex-3", true, "ex-4", true)), "phải cho chuyển"));

        List<PromptVersion> registry = List.of(
            new PromptVersion("triage", 1, "claude-opus-4-7", "v1"),
            new PromptVersion("triage", 3, "claude-opus-4-8", "v3"),
            new PromptVersion("triage", 2, "claude-opus-4-8", "v2"),
            new PromptVersion("summary", 5, "claude-opus-4-8", "s5"));
        c.check("Bài 5: lấy version cao nhất của đúng prompt, đúng model", () -> {
            assertEquals("v3", api.promptFor(registry, "triage", "claude-opus-4-8").text());
            assertEquals("v1", api.promptFor(registry, "triage", "claude-opus-4-7").text());
        });
        c.check("Bài 5: chưa có prompt cho model mới thì báo lỗi, không dùng tạm prompt cũ", () ->
            expectThrows(IllegalStateException.class, () -> api.promptFor(registry, "triage", "claude-sonnet-5")));

        return c.summary();
    }
}
