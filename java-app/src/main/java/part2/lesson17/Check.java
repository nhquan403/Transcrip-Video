package part2.lesson17;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;

import common.Checker;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Function;

public final class Check {
    private Check() {}

    /** Một lời gọi giả mất `ms` mili giây, giống thời gian chờ mạng. */
    static String slow(String prompt, long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return "đáp: " + prompt;
    }

    public static boolean run(boolean useSolution) {
        Lesson17Api api = useSolution ? new Lesson17Solution() : new Lesson17();
        Checker c = new Checker();
        ExecutorService pool = Executors.newVirtualThreadPerTaskExecutor();

        c.check("Bài 1: callAsync trả về ngay, không chờ lời gọi xong", () -> {
            CountDownLatch release = new CountDownLatch(1);
            long start = System.nanoTime();
            CompletableFuture<String> f = api.callAsync(p -> {
                try {
                    release.await(2, TimeUnit.SECONDS);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                return "xong " + p;
            }, "a", pool);
            long returnedAfterMs = (System.nanoTime() - start) / 1_000_000;
            assertTrue(returnedAfterMs < 200, "callAsync phải trả về ngay, mất " + returnedAfterMs + "ms");
            assertTrue(!f.isDone(), "lời gọi còn đang bay");
            release.countDown();
            assertEquals("xong a", f.join());
        });

        c.check("Bài 2: tuần tự thì cái sau đợi cái trước", () -> {
            AtomicInteger running = new AtomicInteger();
            AtomicInteger peak = new AtomicInteger();
            List<String> out = api.runSequential(List.of("1", "2", "3"), p -> {
                peak.accumulateAndGet(running.incrementAndGet(), Math::max);
                String r = slow(p, 30);
                running.decrementAndGet();
                return r;
            });
            assertEquals(List.of("đáp: 1", "đáp: 2", "đáp: 3"), out);
            assertEquals(1, peak.get());
        });

        c.check("Bài 3: đồng thời thì mọi lời gọi cùng bay, kết quả giữ thứ tự", () -> {
            AtomicInteger running = new AtomicInteger();
            AtomicInteger peak = new AtomicInteger();
            long[] ms = {300, 100, 200};
            List<String> prompts = List.of("0", "1", "2");
            Function<String, CompletableFuture<String>> asyncCall = p -> CompletableFuture.supplyAsync(() -> {
                peak.accumulateAndGet(running.incrementAndGet(), Math::max);
                String r = slow(p, ms[Integer.parseInt(p)]);
                running.decrementAndGet();
                return r;
            }, pool);
            long start = System.nanoTime();
            List<String> out = api.runConcurrent(prompts, asyncCall);
            long took = (System.nanoTime() - start) / 1_000_000;
            assertEquals(List.of("đáp: 0", "đáp: 1", "đáp: 2"), out);
            assertEquals(3, peak.get());
            assertTrue(took < 550, "đồng thời phải gần bằng cái chậm nhất (300ms), mất " + took + "ms");
        });

        c.check("Bài 4: tuần tự là tổng, đồng thời là cái chậm nhất", () -> {
            assertEquals(1500L, api.wallTimeMs(List.of(300L, 500L, 700L), false));
            assertEquals(700L, api.wallTimeMs(List.of(300L, 500L, 700L), true));
            assertEquals(0L, api.wallTimeMs(List.of(), true));
        });

        pool.shutdown();
        return c.summary();
    }
}
