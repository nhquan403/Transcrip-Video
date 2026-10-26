package part1.lesson11;

import common.Claude;
import common.LiveSection;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import java.util.function.UnaryOperator;
import part1.lesson01.ClaudeAgentModel;
import part1.lesson01.Lesson01Solution;
import part1.lesson11.Lesson11Api.Decision;
import part1.lesson11.Lesson11Api.Event;
import part1.lesson11.Lesson11Api.Hook;
import part1.lesson11.Lesson11Api.ToolCall;

/**
 * Bài 11 chạy với Claude thật: Claude có một shell GIẢ LẬP (không lệnh nào chạy thật trên máy bạn),
 * mọi lệnh đi qua hook của bạn. System prompt không cấm gì cả: rào chắn nằm hoàn toàn trong code.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p1-11 --live"
 */
public final class Live {
    private Live() {}

    public static void run(boolean useSolution, Claude claude) {
        Lesson11Api api = useSolution ? new Lesson11Solution() : new Lesson11();
        List<String> audit = new ArrayList<>();
        List<Hook> hooks = List.of(
            new Hook(Event.PRE_TOOL_USE, "Bash", api::shellGuard),
            new Hook(Event.POST_TOOL_USE, null, call -> {
                System.out.println("    👀 PostToolUse: đã chạy xong \"" + call.input() + "\" (chỉ quan sát được, không chặn được)");
                return Decision.ALLOW;
            }));
        Map<String, UnaryOperator<String>> fakeShell = Map.of("Bash", cmd -> "(giả lập) $ " + cmd + " → exit 0");
        Predicate<ToolCall> human = call -> {
            System.out.println("    🙋 Cần người duyệt: \"" + call.input() + "\" → người duyệt từ chối");
            return false;
        };

        LiveSection.run("Hook chặn trước khi chạy (không cần Claude)", () -> {
            for (String cmd : List.of("ls -la /tmp", "rm -rf /", "git push --force", "DROP TABLE prod_users")) {
                System.out.println("  $ " + cmd + " → " + api.execute(new ToolCall("Bash", cmd), hooks, fakeShell, human, audit));
            }
        });

        LiveSection.run("Claude cầm shell giả lập, hook của bạn đứng gác", () -> {
            api.execute(new ToolCall("Bash", "echo ready"), List.of(), fakeShell, human, new ArrayList<>()); // chưa làm bài 4 thì chưa gọi API
            ClaudeAgentModel model = new ClaudeAgentModel(claude,
                "You are a DevOps assistant with a Bash tool. Carry out the user's request step by step with the tool. "
                    + "If a command is blocked, explain what happened. Answer in Vietnamese.",
                Map.of("Bash", "Run a shell command. Input: the command."));
            String answer = new Lesson01Solution().runAgent(
                "Máy chủ test đầy ổ đĩa. Hãy xem dung lượng bằng 'df -h', xóa thư mục ./build, "
                    + "rồi đẩy nhánh hiện tại lên bằng git push --force.",
                model, Map.of("Bash", cmd -> api.execute(new ToolCall("Bash", cmd), hooks, fakeShell, human, audit)), 6);
            System.out.println("  → " + answer);
        });

        System.out.println("\n  📒 Nhật ký kiểm toán (không phụ thuộc vào việc model có tự báo hay không):");
        audit.forEach(line -> System.out.println("    " + line));
    }
}
