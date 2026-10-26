package part2.lesson12;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import part2.lesson12.Lesson12Api.BatchState;
import part2.lesson12.Lesson12Api.Job;
import part2.lesson12.Lesson12Api.Surface;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson12Api api = useSolution ? new Lesson12Solution() : new Lesson12();
        Checker c = new Checker();

        c.check("Bài 1: có người chờ, cần stream, hoặc cần ZDR thì ở lại realtime", () -> {
            assertEquals(Surface.SYNC_MESSAGES, api.choose(new Job("chat", true, true, false, 1)));
            assertEquals(Surface.SYNC_MESSAGES, api.choose(new Job("trợ lý code", true, false, false, 1)));
            assertEquals(Surface.SYNC_MESSAGES, api.choose(new Job("phân loại hồ sơ y tế", false, false, true, 50_000)));
        });
        c.check("Bài 1: việc lớn không ai chờ thì batch", () -> {
            assertEquals(Surface.MESSAGE_BATCHES, api.choose(new Job("eval suite", false, false, false, 5_000)));
            assertEquals(Surface.MESSAGE_BATCHES, api.choose(new Job("phân loại tồn đọng", false, false, false, 120_000)));
        });

        c.check("Bài 2: batch tính nửa giá cả input lẫn output", () -> {
            double cost = api.batchCost(10_000_000, 2_000_000, 4.0, 20.0);
            assertTrue(Math.abs(cost - 40.0) < 1e-9, "(10 × 4 + 2 × 20) / 2 = 40 USD, nhận " + cost);
        });

        c.check("Bài 3: chia theo số request", () ->
            assertEquals(List.of(3, 3, 1), api.splitIntoBatches(List.of(1L, 1L, 1L, 1L, 1L, 1L, 1L), 3, 1_000)));
        c.check("Bài 3: chia theo dung lượng, giữ thứ tự", () ->
            assertEquals(List.of(2, 2, 1), api.splitIntoBatches(List.of(40L, 50L, 80L, 10L, 30L), 100, 100)));
        c.check("Bài 3: một request quá lớn thì báo lỗi", () ->
            expectThrows(IllegalArgumentException.class, () -> api.splitIntoBatches(List.of(500L), 10, 100)));

        Instant created = Instant.parse("2026-10-01T00:00:00Z");
        c.check("Bài 4: cửa sổ xử lý 24 giờ", () -> {
            assertEquals(BatchState.PROCESSING, api.state(created, created.plus(Duration.ofMinutes(40)), false));
            assertEquals(BatchState.RESULTS_AVAILABLE, api.state(created, created.plus(Duration.ofMinutes(40)), true));
            assertEquals(BatchState.RESULTS_AVAILABLE, api.state(created, created.plus(Duration.ofHours(25)), false));
        });
        c.check("Bài 4: kết quả chỉ tải được trong 29 ngày kể từ lúc tạo", () -> {
            assertEquals(BatchState.RESULTS_AVAILABLE, api.state(created, created.plus(Duration.ofDays(28)), true));
            assertEquals(BatchState.RESULTS_GONE, api.state(created, created.plus(Duration.ofDays(30)), true));
        });

        return c.summary();
    }
}
