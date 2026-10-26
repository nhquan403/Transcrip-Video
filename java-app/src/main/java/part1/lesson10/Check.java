package part1.lesson10;

import static common.Checker.assertEquals;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Predicate;
import java.util.function.UnaryOperator;
import part1.lesson09.Lesson09Api.Api;
import part1.lesson09.Lesson09Api.Response;
import part1.lesson09.Lesson09Api.Text;
import part1.lesson09.Lesson09Api.ToolUse;
import part1.lesson10.Lesson10Api.Decision;
import part1.lesson10.Lesson10Api.HarnessResult;
import part1.lesson10.Lesson10Api.Policy;
import part1.lesson10.Lesson10Api.Stop;

public final class Check {
    private Check() {}

    /** Lỗi mạng thoáng qua: đáng thử lại. */
    static final class TransientException extends RuntimeException {
        TransientException(String message) {
            super(message);
        }
    }

    public static boolean run(boolean useSolution) {
        Lesson10Api api = useSolution ? new Lesson10Solution() : new Lesson10();
        Checker c = new Checker();
        Predicate<RuntimeException> transientOnly = e -> e instanceof TransientException;

        c.check("Bài 1: gom các mảnh partial JSON rồi parse một lần", () ->
            assertEquals(Map.of("query", "SELECT 1", "limit", 5),
                api.parseToolInput(List.of("{\"que", "ry\": \"SELE", "CT 1\", \"li", "mit\": 5}"))));
        c.check("Bài 1: JSON cuối không hợp lệ thì báo lỗi", () ->
            expectThrows(IllegalArgumentException.class, () -> api.parseToolInput(List.of("{\"query\": "))));

        c.check("Bài 2: lỗi thoáng qua được thử lại", () -> {
            AtomicInteger calls = new AtomicInteger();
            String out = api.withRetry(() -> {
                if (calls.incrementAndGet() < 3) throw new TransientException("timeout");
                return "ok";
            }, 3, transientOnly);
            assertEquals("ok", out);
            assertEquals(3, calls.get());
        });
        c.check("Bài 2: lỗi không đáng thử lại thì ném ngay", () -> {
            AtomicInteger calls = new AtomicInteger();
            expectThrows(IllegalArgumentException.class, () -> api.withRetry(() -> {
                calls.incrementAndGet();
                throw new IllegalArgumentException("bad input");
            }, 5, transientOnly));
            assertEquals(1, calls.get());
        });
        c.check("Bài 2: hết số lần thử thì ném lỗi cuối", () ->
            expectThrows(TransientException.class, () -> api.withRetry(() -> {
                throw new TransientException("still down");
            }, 2, transientOnly)));

        AtomicInteger flaky = new AtomicInteger();
        Map<String, UnaryOperator<String>> tools = Map.of(
            "query_db", q -> "42 rows",
            "flaky_api", q -> {
                if (flaky.incrementAndGet() == 1) throw new TransientException("timeout");
                return "pong";
            },
            "delete_db", q -> { throw new AssertionError("delete_db không được phép chạy"); },
            "broken", q -> { throw new IllegalStateException("disk full"); });
        Policy noDeletes = call -> call.name().startsWith("delete") ? Decision.BLOCK : Decision.ALLOW;

        c.check("Bài 3: ba điểm chèn, nhật ký đúng, kết thúc DONE", () -> {
            flaky.set(0);
            Api api2 = part1.lesson09.Check.strictApi(List.of(
                new Response("tool_use", List.of(new ToolUse("a", "query_db", "x"), new ToolUse("b", "delete_db", "x"))),
                new Response("tool_use", List.of(new ToolUse("c", "flaky_api", "x"), new ToolUse("d", "broken", "x"))),
                new Response("end_turn", List.of(new Text("Xong.")))), new ArrayList<>());
            HarnessResult r = api.run("go", api2, tools, noDeletes, 5, 2, transientOnly);
            assertEquals(Stop.DONE, r.stop());
            assertEquals("Xong.", r.answer());
            assertEquals(2, r.turns());
            assertEquals(List.of("turn 1 ran query_db", "turn 1 blocked delete_db", "turn 2 ran flaky_api",
                "turn 2 failed broken: disk full"), r.log());
        });
        c.check("Bài 3: giới hạn lượt do runtime đếm, không tin model", () -> {
            List<Response> forever = new ArrayList<>();
            for (int i = 0; i < 10; i++) forever.add(new Response("tool_use", List.of(new ToolUse("t" + i, "query_db", "x"))));
            HarnessResult r = api.run("go", part1.lesson09.Check.strictApi(forever, new ArrayList<>()), tools, noDeletes, 3, 1, transientOnly);
            assertEquals(Stop.MAX_TURNS, r.stop());
            assertEquals(null, r.answer());
            assertEquals(3, r.turns());
        });
        c.check("Bài 3: lỗi API hoặc stop reason lạ thì dừng ERROR có ghi nhật ký", () -> {
            Api down = messages -> { throw new IllegalStateException("503 overloaded"); };
            HarnessResult r = api.run("go", down, tools, noDeletes, 3, 1, transientOnly);
            assertEquals(Stop.ERROR, r.stop());
            assertEquals(List.of("error: 503 overloaded"), r.log());
            HarnessResult cut = api.run("go", part1.lesson09.Check.strictApi(
                List.of(new Response("max_tokens", List.of(new Text("...")))), new ArrayList<>()), tools, noDeletes, 3, 1, transientOnly);
            assertEquals(Stop.ERROR, cut.stop());
        });

        return c.summary();
    }
}
