package lesson04;

import common.Claude;
import common.LiveSection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.function.UnaryOperator;
import lesson04.Lesson04Api.Subagent;

/**
 * Bài 04 chạy với Claude thật: Claude làm manager (chia việc lúc chạy), mỗi subagent là một lần gọi Claude
 * với vai trò hẹp. Việc chọn subagent, handoff, phân quyền và kiểm tra kết quả dùng code bạn viết trong Lesson04.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="04 --live"
 */
public final class Live {
    private Live() {}

    /** Kế hoạch manager trả về dưới dạng JSON có cấu trúc. */
    public record Plan(List<String> subtasks) {}

    public static void run(boolean useSolution, Claude claude) {
        Lesson04Api api = useSolution ? new Lesson04Solution() : new Lesson04();

        Map<String, String> sharedContext = Map.of(
            "lesson", "Manager and Subagent Orchestration",
            "learner", "Vietnamese developer learning English and agent design",
            "key_quote", "Orchestrator workers decide the split at runtime, which is what sets them apart from fixed parallel code.",
            "manager_notes", "internal planning notes that subagents do not need");

        List<Subagent> team = List.of(
            subagent(claude, api, sharedContext, "explainer",
                "Explains a concept from the lesson in simple Vietnamese", List.of("lesson", "learner", "key_quote"),
                "3 short Vietnamese sentences", Set.of()),
            subagent(claude, api, sharedContext, "vocab",
                "Picks English vocabulary from a quote and gives Vietnamese meanings", List.of("key_quote", "learner"),
                "a list of 5 lines 'word: Vietnamese meaning'", Set.of()),
            subagent(claude, api, sharedContext, "quizmaker",
                "Writes multiple choice quiz questions about the lesson", List.of("lesson", "key_quote"),
                "2 questions in Vietnamese, each with options A-D and the answer", Set.of("read_notes")));

        LiveSection.run("Manager chia việc lúc chạy, giao cho subagent, kiểm tra rồi tổng hợp", () -> {
            Function<String, List<String>> decompose = goal -> {
                List<String> subtasks = claude.askJson(
                    "You are a manager agent. Split the goal into 2-4 independent subtasks. "
                        + "Start each subtask with the subagent to use: "
                        + team.stream().map(s -> "@" + s.name() + " (" + s.description() + ")").toList()
                        + ". Do not do the work yourself.",
                    goal, Plan.class).subtasks();
                subtasks.forEach(t -> System.out.println("  📋 " + t));
                return subtasks;
            };
            Function<List<String>, String> synthesize = results -> claude.ask(
                "You are the manager. Combine the subagent results into one tidy study note in Vietnamese. Keep every quiz question.",
                String.join("\n\n---\n\n", results));

            String note = api.orchestrate(
                "Giúp tôi ôn bài 'Manager and Subagent Orchestration': giải thích ý chính, học từ vựng từ câu trích dẫn, và làm vài câu trắc nghiệm.",
                decompose, team, result -> !result.isBlank() && !result.startsWith("ERROR"), synthesize);
            System.out.println("\n" + note);
        });

        LiveSection.run("Least privilege: subagent chỉ dùng được tool của mình", () -> {
            Map<String, UnaryOperator<String>> tools = Map.of(
                "read_notes", topic -> "Notes about " + topic + ": manager decomposes, delegates, synthesizes.",
                "delete_file", path -> "deleted " + path);
            Subagent quizmaker = team.get(2);
            System.out.println("  quizmaker đọc ghi chú: " + api.callTool(quizmaker, "read_notes", "orchestration", tools));
            try {
                api.callTool(quizmaker, "delete_file", "notes.txt", tools);
                System.out.println("  ⚠️ quizmaker xóa được file: chưa chặn đúng quyền!");
            } catch (SecurityException e) {
                System.out.println("  🔒 Bị chặn đúng: " + e.getMessage());
            }
        });
    }

    /** Subagent thật: nhận handoff do code của bạn dựng, gọi Claude với vai trò hẹp. */
    private static Subagent subagent(Claude claude, Lesson04Api api, Map<String, String> sharedContext, String name,
                                     String description, List<String> neededKeys, String outputFormat,
                                     Set<String> allowedTools) {
        UnaryOperator<String> work = subtask -> {
            String handoff = api.buildHandoff(subtask, sharedContext, neededKeys, outputFormat);
            System.out.println("  ➡️ giao cho @" + name);
            return claude.ask("You are the '" + name + "' subagent. " + description
                + ". Do only this task, follow the output format, and add nothing else.", handoff);
        };
        return new Subagent(name, description, allowedTools, work);
    }
}
