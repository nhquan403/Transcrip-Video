package part1.lesson01;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.UnaryOperator;
import part1.lesson01.Lesson01Api.CallTool;
import part1.lesson01.Lesson01Api.Design;
import part1.lesson01.Lesson01Api.Finish;
import part1.lesson01.Lesson01Api.Model;
import part1.lesson01.Lesson01Api.TaskProfile;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson01Api api = useSolution ? new Lesson01Solution() : new Lesson01();
        Checker c = new Checker();

        c.check("Bài 1: 0 hoặc 1 tín hiệu thì chọn WORKFLOW", () -> {
            assertEquals(Design.WORKFLOW, api.chooseDesign(new TaskProfile(false, false, false)));
            assertEquals(Design.WORKFLOW, api.chooseDesign(new TaskProfile(true, false, false)));
            assertEquals(Design.WORKFLOW, api.chooseDesign(new TaskProfile(false, false, true)));
        });
        c.check("Bài 1: từ 2 tín hiệu trở lên thì chọn AGENT", () -> {
            assertEquals(Design.AGENT, api.chooseDesign(new TaskProfile(true, true, false)));
            assertEquals(Design.AGENT, api.chooseDesign(new TaskProfile(false, true, true)));
            assertEquals(Design.AGENT, api.chooseDesign(new TaskProfile(true, true, true)));
        });

        List<UnaryOperator<String>> steps = List.of(String::trim, String::toUpperCase, s -> s + "!!!");
        c.check("Bài 2: các bước chạy đúng thứ tự", () ->
            assertEquals("HELLO!!!", api.promptChain("  hello ", steps, s -> !s.isEmpty())));
        c.check("Bài 2: gate thất bại thì dừng và báo đúng bước", () -> {
            var e = expectThrows(IllegalStateException.class,
                () -> api.promptChain(" hi ", steps, s -> s.length() <= 3));
            assertTrue(e.getMessage().contains("step 3"), "message phải chứa \"step 3\": " + e.getMessage());
        });

        Map<String, UnaryOperator<String>> handlers = Map.of(
            "billing", r -> "Phòng kế toán xử lý: " + r,
            "complaint", r -> "CSKH xử lý: " + r);
        UnaryOperator<String> classifier = r -> r.contains("invoice") ? "billing" : r.contains("angry") ? "complaint" : "other";
        c.check("Bài 3: route tới đúng handler", () -> {
            assertEquals("Phòng kế toán xử lý: invoice #12", api.route("invoice #12", classifier, handlers, r -> "fallback"));
            assertEquals("CSKH xử lý: angry customer", api.route("angry customer", classifier, handlers, r -> "fallback"));
        });
        c.check("Bài 3: nhãn lạ thì dùng fallback", () ->
            assertEquals("Hộp thư chung: hello", api.route("hello", classifier, handlers, r -> "Hộp thư chung: " + r)));

        c.check("Bài 4: kết quả giữ đúng thứ tự và chạy song song", () -> {
            UnaryOperator<String> slowWorker = s -> {
                try {
                    Thread.sleep(300);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                return s.toUpperCase();
            };
            long start = System.nanoTime();
            List<String> out = api.parallelize(List.of("a", "b", "c", "d", "e"), slowWorker);
            long ms = (System.nanoTime() - start) / 1_000_000;
            assertEquals(List.of("A", "B", "C", "D", "E"), out);
            assertTrue(ms < 1000, "5 phần x 300ms mà mất " + ms + "ms, có vẻ đang chạy tuần tự");
        });

        Map<String, UnaryOperator<String>> tools = Map.of(
            "weather", city -> "30",
            "calc", expr -> String.valueOf(30 - 5));
        Model scripted = (goal, history) -> switch (history.size()) {
            case 0 -> new CallTool("weather", "Hanoi");
            case 1 -> new CallTool("calc", history.get(0).observation() + "-5");
            default -> new Finish("Kết quả: " + history.get(history.size() - 1).observation());
        };
        c.check("Bài 5: agent gọi tool theo quyết định của model rồi Finish", () ->
            assertEquals("Kết quả: 25", api.runAgent("Nhiệt độ Hà Nội trừ 5", scripted, tools, 5)));
        c.check("Bài 5: tool không tồn tại trả về observation lỗi", () -> {
            Model wrongTool = (goal, history) -> history.isEmpty()
                ? new CallTool("fly", "Paris")
                : new Finish(history.get(0).observation());
            assertEquals("error: unknown tool fly", api.runAgent("bay", wrongTool, tools, 5));
        });
        c.check("Bài 5: vượt maxSteps thì dừng bằng IllegalStateException", () -> {
            List<Integer> calls = new ArrayList<>();
            Model neverDone = (goal, history) -> {
                calls.add(history.size());
                return new CallTool("weather", "Hanoi");
            };
            expectThrows(IllegalStateException.class, () -> api.runAgent("lặp mãi", neverDone, tools, 3));
            assertTrue(calls.size() <= 4, "model bị gọi " + calls.size() + " lần, vòng lặp không được giới hạn");
        });

        return c.summary();
    }
}
