package part2.lesson18;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Supplier;
import part2.lesson18.Lesson18Api.Outcome;

public final class Check {
    private Check() {}

    static void sleep(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    public static boolean run(boolean useSolution) {
        Lesson18Api api = useSolution ? new Lesson18Solution() : new Lesson18();
        Checker c = new Checker();

        c.check("Bài 1: 12 task, trần 3: không bao giờ quá 3 cùng lúc, kết quả đúng thứ tự", () -> {
            AtomicInteger running = new AtomicInteger();
            AtomicInteger peak = new AtomicInteger();
            List<Supplier<Integer>> tasks = new ArrayList<>();
            for (int i = 0; i < 12; i++) {
                int n = i;
                tasks.add(() -> {
                    peak.accumulateAndGet(running.incrementAndGet(), Math::max);
                    sleep(40 + (n % 3) * 20);
                    running.decrementAndGet();
                    return n * n;
                });
            }
            long start = System.nanoTime();
            List<Integer> out = api.gatherBounded(tasks, 3);
            long took = (System.nanoTime() - start) / 1_000_000;
            assertEquals(List.of(0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121), out);
            assertTrue(peak.get() <= 3, "đỉnh đồng thời phải ≤ 3, nhận " + peak.get());
            assertTrue(peak.get() >= 2, "phải thật sự chạy đồng thời, đỉnh " + peak.get());
            assertTrue(took < 12 * 60, "nhanh hơn chạy tuần tự, mất " + took + "ms");
        });
        c.check("Bài 1: một task lỗi thì gatherBounded ném lỗi đó", () ->
            expectThrows(IllegalStateException.class, () -> api.gatherBounded(List.<Supplier<String>>of(() -> "a",
                () -> { throw new IllegalStateException("timeout"); }), 2)));

        c.check("Bài 2: một nhánh lỗi không kéo đổ 3 nhánh tốt", () -> {
            List<Outcome> out = api.gatherSettled(List.of(() -> "a", () -> { throw new IllegalStateException("529 overloaded"); },
                () -> "c", () -> "d"), 2);
            assertEquals(4, out.size());
            assertEquals(new Outcome("a", null), out.get(0));
            assertEquals(new Outcome(null, "529 overloaded"), out.get(1));
            assertEquals(3L, out.stream().filter(Outcome::ok).count());
        });

        c.check("Bài 3: trần tăng gấp đôi rồi chạm cap, jitter nhân vào", () -> {
            assertEquals(500L, api.backoffWithJitterMs(0, 1000, 30_000, () -> 0.5));
            assertEquals(3_999L, api.backoffWithJitterMs(2, 1000, 30_000, () -> 0.99999));
            assertEquals(15_000L, api.backoffWithJitterMs(10, 1000, 30_000, () -> 0.5));
            assertEquals(0L, api.backoffWithJitterMs(3, 1000, 30_000, () -> 0.0));
        });
        c.check("Bài 3: jitter làm các request lỗi cùng lúc không thử lại cùng một thời điểm", () -> {
            double[] r = {0.1, 0.7, 0.4};
            AtomicInteger i = new AtomicInteger();
            List<Long> waits = new ArrayList<>();
            for (int k = 0; k < 3; k++) waits.add(api.backoffWithJitterMs(1, 1000, 30_000, () -> r[i.getAndIncrement()]));
            assertEquals(List.of(200L, 1400L, 800L), waits);
        });

        c.check("Bài 4: nối delta theo thứ tự", () ->
            assertEquals("Xin chào bạn!", api.accumulate(Arrays.asList("Xin ", null, "chào ", "bạn", "!"))));

        return c.summary();
    }
}
