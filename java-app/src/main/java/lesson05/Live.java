package lesson05;

import common.Claude;
import common.Claude.CallStats;
import common.LiveSection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import lesson01.ClaudeAgentModel;
import lesson01.Lesson01Solution;
import lesson05.Lesson05Api.DelegatedTask;
import lesson05.Lesson05Api.ManagerState;
import lesson05.Lesson05Api.SubagentDef;
import lesson05.Lesson05Api.SubagentRun;

/**
 * Bài 05 chạy với Claude thật: subagent chỉ nhận đúng những dòng do subagentContext() của bạn dựng,
 * nên bạn thấy tận mắt "quên truyền dữ kiện" làm nó thất bại ra sao, và cô lập tiết kiệm bao nhiêu token.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="05 --live"
 */
public final class Live {
    private Live() {}

    public static void run(boolean useSolution, Claude claude) {
        Lesson05Api api = useSolution ? new Lesson05Solution() : new Lesson05();

        ManagerState manager = new ManagerState(
            "You are the manager of a release.",
            List.of("user: Mã dự án là ORCA-17, hạn chót thứ Sáu.", "assistant: Đã ghi nhận."),
            List.of("ci_log: 4.812 test đạt, 0 lỗi"));
        SubagentDef reporter = new SubagentDef("reporter",
            "You are a reporter subagent. Write exactly one Vietnamese status line. "
                + "If a fact you need is not in front of you, write 'THIẾU: <fact>' instead of guessing.");
        String claudeMd = "# Project rules: status lines start with the project code.";

        LiveSection.run("Lần 1: giả định subagent đã biết mã dự án", () -> {
            DelegatedTask task = new DelegatedTask("Write the release status line, starting with the project code.",
                Map.of("ci", "4812 passed, 0 failed"), "one line", Set.of("read_file"));
            System.out.println("  Dữ kiện đang bị giả định: " + api.assumedFacts(task, Set.of("project_code", "deadline")));
            delegate(api, claude, manager, reporter, claudeMd, task);
        });

        LiveSection.run("Lần 2: truyền rõ dữ kiện vào việc giao", () -> {
            DelegatedTask task = new DelegatedTask("Write the release status line, starting with the project code.",
                Map.of("ci", "4812 passed, 0 failed", "project_code", "ORCA-17", "deadline", "Friday"),
                "one line", Set.of("read_file"));
            System.out.println("  Phần còn thiếu của việc giao: " + api.missingParts(task));
            delegate(api, claude, manager, reporter, claudeMd, task);
        });

        LiveSection.run("Cô lập giữ context của manager gọn gàng", () -> {
            api.managerContextTokens(List.of(), true); // chưa làm bài 4 thì dừng ở đây, chưa tốn token
            int before = claude.calls().size();
            ClaudeAgentModel model = new ClaudeAgentModel(claude,
                "You are a log-reading subagent. Read the log with the tool, then reply with one Vietnamese sentence.",
                Map.of("read_log", "Return the full build log. Input: the log name, e.g. 'build'."));
            String summary = new Lesson01Solution().runAgent("Đọc log 'build' và cho biết có lỗi không.",
                model, Map.of("read_log", name -> "OK test passed in 12ms\n".repeat(800) + "ERROR flaky test: PaymentTimeoutTest"), 3);
            List<CallStats> calls = claude.calls().subList(before, claude.calls().size());
            long transcript = calls.stream().mapToLong(s -> s.inputTokens() + s.outputTokens()).sum();
            long summaryTokens = calls.get(calls.size() - 1).outputTokens();
            System.out.println("  Subagent trả về: " + summary);
            List<SubagentRun> runs = List.of(new SubagentRun(transcript, summaryTokens));
            System.out.println("  Manager nhận nếu có cô lập:    " + api.managerContextTokens(runs, true) + " token");
            System.out.println("  Manager nhận nếu không cô lập: " + api.managerContextTokens(runs, false) + " token");
        });

        LiveSection.run("Quyền tối thiểu", () ->
            System.out.println("  Tool thừa của subagent tóm tắt: "
                + api.excessTools(Set.of("read_file", "send_email"), Set.of("read_file"))
                + " → phạm vi quá rộng, nên bỏ đi"));
    }

    private static void delegate(Lesson05Api api, Claude claude, ManagerState manager, SubagentDef subagent,
                                 String claudeMd, DelegatedTask task) {
        List<String> context = api.subagentContext(manager, subagent, claudeMd, task);
        String prompt = String.join("\n", context.subList(1, context.size()));
        if (prompt.contains("ORCA-17") && !task.data().containsKey("project_code")) {
            System.out.println("  ⚠️ Ngữ cảnh subagent chứa dữ liệu của manager: cô lập bị rò rỉ!");
        }
        System.out.println("  Subagent trả lời: " + claude.ask(context.get(0), prompt));
    }
}
