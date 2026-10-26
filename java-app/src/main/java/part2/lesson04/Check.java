package part2.lesson04;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import part2.lesson04.Lesson04Api.ApiError;
import part2.lesson04.Lesson04Api.Design;
import part2.lesson04.Lesson04Api.ErrorKind;
import part2.lesson04.Lesson04Api.Requirements;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson04Api api = useSolution ? new Lesson04Solution() : new Lesson04();
        Checker c = new Checker();

        c.check("Bài 1: timeout, rate limit, lỗi server là tạm thời", () -> {
            for (int s : new int[] {0, 429, 500, 503, 529}) assertEquals(ErrorKind.TRANSIENT, api.classify(s));
        });
        c.check("Bài 1: request sai, schema sai, sai key là vĩnh viễn", () -> {
            for (int s : new int[] {400, 401, 403, 404, 422}) assertEquals(ErrorKind.PERMANENT, api.classify(s));
        });

        c.check("Bài 2: lỗi tạm thời được thử lại với thời gian chờ tăng gấp đôi", () -> {
            AtomicInteger calls = new AtomicInteger();
            List<Long> waits = new ArrayList<>();
            String out = api.retryWithBackoff(() -> {
                if (calls.incrementAndGet() < 4) throw new ApiError(529, "overloaded");
                return "ok";
            }, 5, 200, waits::add);
            assertEquals("ok", out);
            assertEquals(List.of(200L, 400L, 800L), waits);
        });
        c.check("Bài 2: lỗi vĩnh viễn ném ra ngay, không chờ, không thử lại", () -> {
            AtomicInteger calls = new AtomicInteger();
            List<Long> waits = new ArrayList<>();
            ApiError e = expectThrows(ApiError.class, () -> api.retryWithBackoff(() -> {
                calls.incrementAndGet();
                throw new ApiError(401, "invalid x-api-key");
            }, 5, 200, waits::add));
            assertEquals(401, e.status());
            assertEquals(1, calls.get());
            assertEquals(List.of(), waits);
        });
        c.check("Bài 2: hết lượt thì ném lỗi cuối cùng", () -> {
            AtomicInteger calls = new AtomicInteger();
            expectThrows(ApiError.class, () -> api.retryWithBackoff(() -> {
                calls.incrementAndGet();
                throw new ApiError(429, "rate limited");
            }, 3, 100, w -> { }));
            assertEquals(3, calls.get());
        });

        c.check("Bài 3: primary lỗi thì chuyển sang fallback model", () ->
            assertEquals("fallback", api.withFailover(() -> { throw new ApiError(529, "overloaded"); }, () -> "fallback",
                Optional.of("cached"))));
        c.check("Bài 3: cả hai lỗi thì trả bản degraded thay vì màn hình trắng", () ->
            assertEquals("cached", api.withFailover(() -> { throw new ApiError(500, "x"); },
                () -> { throw new ApiError(503, "y"); }, Optional.of("cached"))));
        c.check("Bài 3: không có degraded thì ném lỗi của fallback", () -> {
            ApiError e = expectThrows(ApiError.class, () -> api.withFailover(() -> { throw new ApiError(500, "x"); },
                () -> { throw new ApiError(503, "y"); }, Optional.empty()));
            assertEquals(503, e.status());
        });

        Requirements req = new Requirements(2000, 300, List.of("eu-west-1"), 0.999);
        c.check("Bài 4: thiết kế đạt mọi ràng buộc thì danh sách rỗng", () ->
            assertEquals(List.of(), api.unmetConstraints(req, new Design(2, 900, 400, "eu-west-1", true))));
        c.check("Bài 4: thiết kế đẹp nhưng trượt cả bốn ràng buộc", () -> assertEquals(
            List.of("latency", "throughput", "residency", "availability"),
            api.unmetConstraints(req, new Design(5, 800, 100, "us-east-1", false))));
        c.check("Bài 4: không cam kết uptime thì không bắt buộc failover", () ->
            assertTrue(api.unmetConstraints(new Requirements(2000, 10, List.of("us-east-1"), null),
                new Design(1, 500, 50, "us-east-1", false)).isEmpty(), "phải fit"));

        return c.summary();
    }
}
