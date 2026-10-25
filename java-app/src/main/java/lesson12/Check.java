package lesson12;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;

import common.Checker;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.UnaryOperator;
import lesson09.Lesson09Api.ToolUse;

public final class Check {
    private Check() {}

    static ToolUse call(String id, String name) {
        return new ToolUse(id, name, id);
    }

    public static boolean run(boolean useSolution) {
        Lesson12Api api = useSolution ? new Lesson12Solution() : new Lesson12();
        Checker c = new Checker();
        Set<String> readOnly = Set.of("read_file", "grep");

        c.check("Bài 1: gom call chỉ đọc liền nhau, call ghi đứng riêng, giữ thứ tự", () -> {
            List<ToolUse> calls = List.of(call("a", "read_file"), call("b", "grep"), call("c", "edit_file"),
                call("d", "read_file"), call("e", "bash"), call("f", "bash"), call("g", "grep"));
            assertEquals(List.of(
                    List.of(call("a", "read_file"), call("b", "grep")),
                    List.of(call("c", "edit_file")),
                    List.of(call("d", "read_file")),
                    List.of(call("e", "bash")),
                    List.of(call("f", "bash")),
                    List.of(call("g", "grep"))),
                api.planBatches(calls, readOnly));
        });
        c.check("Bài 1: tool tự viết không đánh dấu chỉ đọc thì chạy tuần tự", () ->
            assertEquals(2, api.planBatches(List.of(call("a", "my_lookup"), call("b", "my_lookup")), readOnly).size()));

        c.check("Bài 2: đợt chỉ đọc chạy song song, đợt ghi chạy sau, kết quả đúng thứ tự", () -> {
            List<String> order = Collections.synchronizedList(new ArrayList<>());
            UnaryOperator<String> slowRead = id -> {
                try {
                    Thread.sleep(300);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                order.add("read " + id);
                return "content " + id;
            };
            Map<String, UnaryOperator<String>> tools = Map.of("read_file", slowRead,
                "edit_file", id -> { order.add("edit " + id); return "edited " + id; });
            List<List<ToolUse>> batches = List.of(
                List.of(call("a", "read_file"), call("b", "read_file"), call("c", "read_file")),
                List.of(call("d", "edit_file")));
            long start = System.nanoTime();
            Map<String, String> results = api.executeBatches(batches, tools);
            long ms = (System.nanoTime() - start) / 1_000_000;
            assertEquals(List.of("a", "b", "c", "d"), new ArrayList<>(results.keySet()));
            assertEquals("edited d", results.get("d"));
            assertEquals("edit d", order.get(3));
            assertTrue(ms < 800, "3 lần đọc x 300ms mất " + ms + "ms, có vẻ đang chạy tuần tự");
        });

        c.check("Bài 3: mỗi đợt tốn bằng call chậm nhất", () ->
            assertEquals(1500L, api.wallClockMs(List.of(List.of(400L, 900L, 300L), List.of(200L), List.of(400L)))));

        c.check("Bài 4: manager mang kết quả của worker 1 sang worker 2", () ->
            assertEquals("Viết test cho hàm parse.\n\nKết quả từ worker trước:\nHàm parse nằm ở src/Parser.java",
                api.carryAcross("Hàm parse nằm ở src/Parser.java", "Viết test cho hàm parse.")));

        return c.summary();
    }
}
