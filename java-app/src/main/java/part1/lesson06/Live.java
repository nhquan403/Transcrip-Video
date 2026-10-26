package part1.lesson06;

import common.Claude;
import common.LiveSection;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.UnaryOperator;
import part1.lesson06.Lesson06Api.AssistantMessage;
import part1.lesson06.Lesson06Api.Options;
import part1.lesson06.Lesson06Api.ResultMessage;
import part1.lesson06.Lesson06Api.SdkMessage;
import part1.lesson06.Lesson06Api.SystemInit;
import part1.lesson06.Lesson06Api.UserMessage;

/**
 * Bài 06 chạy với Claude thật: query() của bạn điều khiển vòng lặp, Claude là model bên trong.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p1-06 --live"
 */
public final class Live {
    private Live() {}

    public static final Map<String, String> TOOL_DESCRIPTIONS = Map.of(
        "list_lessons", "List the lessons of the course. Input: anything, e.g. 'all'.",
        "read_lesson", "Read the one-line summary of a lesson. Input: the lesson number, e.g. '6'.",
        "delete_lesson", "Delete a lesson. Input: the lesson number.");

    public static final Map<String, UnaryOperator<String>> TOOLS = Map.of(
        "list_lessons", x -> "5: context isolation, 6: first agent with query, 7: agent loop under query",
        "read_lesson", n -> switch (n.trim()) {
            case "5" -> "Subagents start fresh; pass in everything they need.";
            case "6" -> "query() runs the agent loop in your process: standalone, streamed, session-scoped.";
            case "7" -> "The loop repeats until a tool-free answer; max turns is your safety net.";
            default -> "error: no lesson " + n;
        },
        "delete_lesson", n -> "deleted lesson " + n);

    public static void run(boolean useSolution, Claude claude) {
        Lesson06Api api = useSolution ? new Lesson06Solution() : new Lesson06();
        ClaudeQueryModel model = new ClaudeQueryModel(claude, TOOL_DESCRIPTIONS);
        Options options = new Options(
            "You are a study assistant. Use tools to look things up. Answer in Vietnamese, at most 3 sentences.",
            Set.of("list_lessons", "read_lesson"), Claude.MODEL, 5);

        LiveSection.run("Phiên 1: theo dõi luồng message trực tiếp", () -> {
            List<SdkMessage> messages = new ArrayList<>();
            api.query("Tóm tắt bài 6 và bài 7 giúp tôi. Tên tôi là An.", options, model, TOOLS, message -> {
                messages.add(message);
                print(message);
            });
            System.out.println("  → resultText(): " + api.resultText(messages));
        });

        LiveSection.run("Phiên 2: query mới không nhớ phiên trước", () -> {
            List<SdkMessage> messages = new ArrayList<>();
            api.query("Tên tôi là gì? Nếu bạn không biết thì nói là không biết.", options, model, TOOLS, messages::add);
            System.out.println("  → " + api.resultText(messages));
        });

        LiveSection.run("Tool không được phép: Claude không thấy delete_lesson trong danh sách", () -> {
            List<SdkMessage> messages = new ArrayList<>();
            api.query("Hãy xóa bài 5.", options, model, TOOLS, message -> {
                messages.add(message);
                print(message);
            });
        });
    }

    public static void print(SdkMessage message) {
        switch (message) {
            case SystemInit init -> System.out.println("  [init] phiên " + init.sessionId().substring(0, 8)
                + ", model " + init.model() + ", tools " + init.tools());
            case AssistantMessage a -> {
                if (!a.text().isBlank()) System.out.println("  [assistant] " + a.text().replace("\n", " "));
                a.toolCalls().forEach(t -> System.out.println("  [assistant] gọi " + t.name() + "(\"" + t.input() + "\")"));
            }
            case UserMessage u -> u.toolResults().forEach(r ->
                System.out.println("  [user] kết quả" + (r.isError() ? " LỖI" : "") + ": " + r.content()));
            case ResultMessage r -> System.out.println("  [result] " + r.subtype() + ", " + r.numTurns()
                + " lượt, " + r.usage().inputTokens() + " token vào, " + r.usage().outputTokens() + " token ra");
        }
    }
}
