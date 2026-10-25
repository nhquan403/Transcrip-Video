package lesson05;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;

import common.Checker;
import java.util.List;
import java.util.Map;
import java.util.Set;
import lesson05.Lesson05Api.DelegatedTask;
import lesson05.Lesson05Api.ManagerState;
import lesson05.Lesson05Api.SubagentDef;
import lesson05.Lesson05Api.SubagentRun;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson05Api api = useSolution ? new Lesson05Solution() : new Lesson05();
        Checker c = new Checker();

        ManagerState manager = new ManagerState("MANAGER-SYSTEM",
            List.of("user: mã dự án là ORCA-17"), List.of("tool: 5000 dòng log"));
        SubagentDef reporter = new SubagentDef("reporter", "You write status reports.");
        DelegatedTask task = new DelegatedTask("Write a one-line status.",
            Map.of("status", "green", "project_code", "ORCA-17"), "one line", Set.of("read_file", "grep"));

        c.check("Bài 1: subagent thấy đúng các dòng, đúng thứ tự", () ->
            assertEquals(List.of("You write status reports.", "# Project rules", "Tools: grep, read_file",
                    "Write a one-line status.", "project_code: ORCA-17", "status: green", "Output: one line"),
                api.subagentContext(manager, reporter, "# Project rules", task)));
        c.check("Bài 1: không thừa hưởng gì từ manager", () -> {
            DelegatedTask noData = new DelegatedTask("Report.", Map.of(), "text", Set.of());
            String all = String.join("\n", api.subagentContext(manager, reporter, "", noData));
            assertTrue(!all.contains("ORCA-17"), "lịch sử của manager bị lọt sang subagent");
            assertTrue(!all.contains("5000 dòng log"), "kết quả tool của manager bị lọt sang subagent");
            assertTrue(!all.contains("MANAGER-SYSTEM"), "system prompt của manager bị lọt sang subagent");
        });

        c.check("Bài 2: việc giao đủ bốn phần", () -> assertEquals(List.of(), api.missingParts(task)));
        c.check("Bài 2: báo đúng các phần còn thiếu", () ->
            assertEquals(List.of("data", "output shape", "scoped tools"),
                api.missingParts(new DelegatedTask("Summarize it.", Map.of(), " ", Set.of()))));

        c.check("Bài 3: tìm dữ kiện đang bị giả định", () ->
            assertEquals(List.of("deadline", "owner"),
                api.assumedFacts(task, Set.of("project_code", "owner", "deadline"))));
        c.check("Bài 3: truyền đủ thì không còn giả định", () ->
            assertEquals(List.of(), api.assumedFacts(task, Set.of("status"))));

        List<SubagentRun> runs = List.of(new SubagentRun(40_000, 300), new SubagentRun(25_000, 200), new SubagentRun(60_000, 250));
        c.check("Bài 4: có cô lập, manager chỉ nhận bản tóm tắt", () ->
            assertEquals(750L, api.managerContextTokens(runs, true)));
        c.check("Bài 4: không cô lập, toàn bộ quá trình tràn vào manager", () ->
            assertEquals(125_000L, api.managerContextTokens(runs, false)));

        c.check("Bài 5: tóm tắt mà gửi được email là phạm vi quá rộng", () ->
            assertEquals(List.of("delete_file", "send_email"),
                api.excessTools(Set.of("read_file", "send_email", "delete_file"), Set.of("read_file"))));

        return c.summary();
    }
}
