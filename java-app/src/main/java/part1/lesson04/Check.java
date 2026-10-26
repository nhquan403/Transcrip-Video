package part1.lesson04;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.UnaryOperator;
import part1.lesson04.Lesson04Api.Subagent;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson04Api api = useSolution ? new Lesson04Solution() : new Lesson04();
        Checker c = new Checker();

        Subagent researcher = new Subagent("researcher",
            "Searches the web and collects sources about a topic", Set.of("web_search"), t -> "SOURCES(" + t + ")");
        Subagent summarizer = new Subagent("summarizer",
            "Summarizes long documents into short bullet points", Set.of("read_file"), t -> "SUMMARY(" + t + ")");
        Subagent tester = new Subagent("tester",
            "Runs the test suite and reports failing tests", Set.of("run_tests"), t -> "TESTS(" + t + ")");
        List<Subagent> team = List.of(researcher, summarizer, tester);

        c.check("Bài 1: chọn theo description", () -> {
            assertEquals(summarizer, api.pickSubagent("Summarizes this long report", team));
            assertEquals(researcher, api.pickSubagent("Search sources about vector databases on the web", team));
            assertEquals(tester, api.pickSubagent("Run the failing tests again", team));
        });
        c.check("Bài 1: gọi tên trực tiếp bằng @tên", () ->
            assertEquals(tester, api.pickSubagent("@tester summarizes long documents", team)));
        c.check("Bài 1: không khớp thì trả về null", () ->
            assertEquals(null, api.pickSubagent("Bake a cake", team)));

        Map<String, UnaryOperator<String>> tools = Map.of(
            "read_file", path -> "content of " + path,
            "delete_file", path -> "deleted " + path);
        c.check("Bài 2: tool được phép thì chạy bình thường", () ->
            assertEquals("content of a.txt", api.callTool(summarizer, "read_file", "a.txt", tools)));
        c.check("Bài 2: summarizer không được xóa file", () ->
            expectThrows(SecurityException.class, () -> api.callTool(summarizer, "delete_file", "a.txt", tools)));

        Map<String, String> shared = Map.of(
            "repo", "github.com/acme/shop",
            "branch", "main",
            "secret_plan", "manager-only notes");
        c.check("Bài 3: handoff mang đủ ngữ cảnh và định dạng output", () ->
            assertEquals("Task: Run the tests\nContext:\n- repo: github.com/acme/shop\n- branch: main\nOutput format: JSON list of failing tests",
                api.buildHandoff("Run the tests", shared, List.of("repo", "branch"), "JSON list of failing tests")));
        c.check("Bài 3: handoff không kèm thông tin thừa", () -> {
            String h = api.buildHandoff("Run the tests", shared, List.of("repo"), "text");
            assertTrue(!h.contains("secret_plan"), "không được gửi key không cần thiết");
        });
        c.check("Bài 3: thiếu ngữ cảnh thì báo lỗi ngay", () ->
            expectThrows(IllegalArgumentException.class,
                () -> api.buildHandoff("Run the tests", shared, List.of("repo", "commit"), "text")));

        c.check("Bài 4: decompose, delegate, synthesize", () -> {
            String out = api.orchestrate("vector db report",
                goal -> List.of("Search sources about " + goal, "Summarizes the long documents"),
                team, r -> !r.isBlank(), results -> String.join(" + ", results));
            assertEquals("SOURCES(Search sources about vector db report) + SUMMARY(Summarizes the long documents)", out);
        });
        c.check("Bài 4: decompose chạy lúc runtime, số subtask theo input", () -> {
            String out = api.orchestrate("a,b,c",
                goal -> Arrays.stream(goal.split(",")).map(x -> "Run tests for module " + x).toList(),
                team, r -> true, results -> String.valueOf(results.size()));
            assertEquals("3", out);
        });
        c.check("Bài 4: manager chặn kết quả sai trước khi tổng hợp", () -> {
            Subagent drifting = new Subagent("summarizer2", "Summarizes documents", Set.of(), t -> "");
            var e = expectThrows(IllegalStateException.class, () -> api.orchestrate("x",
                goal -> List.of("Summarizes documents"), List.of(drifting), r -> !r.isBlank(), results -> "done"));
            assertTrue(e.getMessage().contains("Summarizes documents"), "message phải nêu subtask lỗi");
        });
        c.check("Bài 4: subtask không có ai nhận thì báo lỗi", () ->
            expectThrows(IllegalStateException.class, () -> api.orchestrate("x",
                goal -> List.of("Bake a cake"), team, r -> true, results -> "done")));

        return c.summary();
    }
}
