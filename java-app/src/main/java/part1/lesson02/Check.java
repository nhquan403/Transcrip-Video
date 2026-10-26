package part1.lesson02;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson02Api api = useSolution ? new Lesson02Solution() : new Lesson02();
        Checker c = new Checker();

        c.check("Bài 1: một lần gọi chỉ trả tiền cho prompt", () ->
            assertEquals(1000L, api.totalInputTokens(1000, List.of())));
        c.check("Bài 1: context cộng dồn qua từng vòng", () -> {
            assertEquals(6000L, api.totalInputTokens(1000, List.of(500, 2000)));
            assertEquals(5000L, api.totalInputTokens(1000, List.of(0, 0, 0, 0)));
        });
        c.check("Bài 1: một tool output lớn đi theo mọi vòng sau đó", () ->
            assertEquals(1000L + 51_000 + 51_100 + 51_200,
                api.totalInputTokens(1000, List.of(50_000, 100, 100))));

        c.check("Bài 2: xác suất đúng giảm theo số bước", () -> {
            assertTrue(Math.abs(api.chanceAllStepsCorrect(0.95, 10) - 0.5987) < 0.001, "0.95^10 ≈ 0.5987");
            assertEquals(1.0, api.chanceAllStepsCorrect(0.9, 0));
        });

        c.check("Bài 3: số bước tối đa để vẫn đạt target", () -> {
            assertEquals(6, api.maxStepsForTarget(0.9, 0.5));
            assertEquals(13, api.maxStepsForTarget(0.99, 0.87));
            assertEquals(0, api.maxStepsForTarget(0.5, 0.9));
        });

        c.check("Bài 4: độ trễ cộng dồn qua các round trip", () ->
            assertEquals(3600L, api.waitTimeMs(List.of(800L, 1200L, 1600L))));

        c.check("Bài 5: luồng bình thường đi qua đủ ba bước", () ->
            assertEquals("[KẾT QUẢ] xin chào",
                api.hybridPipeline("  xin chào  ", s -> !s.isBlank(), String::trim, s -> "[KẾT QUẢ] " + s)));
        c.check("Bài 5: input sai thì dừng trước khi gọi agent", () -> {
            AtomicBoolean agentCalled = new AtomicBoolean(false);
            expectThrows(IllegalArgumentException.class, () -> api.hybridPipeline("   ", s -> !s.isBlank(),
                s -> { agentCalled.set(true); return s; }, s -> s));
            assertTrue(!agentCalled.get(), "agent không được chạy khi input không hợp lệ");
        });
        c.check("Bài 5: lỗi của agent được workflow bắt lại", () ->
            assertEquals("ERROR: tool timeout", api.hybridPipeline("job", s -> true,
                s -> { throw new IllegalStateException("tool timeout"); }, s -> s)));

        return c.summary();
    }
}
