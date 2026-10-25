package lesson09;

import common.Claude;
import common.LiveSection;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.function.UnaryOperator;
import lesson09.Lesson09Api.Api;
import lesson09.Lesson09Api.Response;
import lesson09.Lesson09Api.ToolUse;

/**
 * Bài 09 chạy với Claude thật: runLoop() của bạn nói chuyện trực tiếp với Messages API.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="09 --live"
 */
public final class Live {
    private Live() {}

    public static void run(boolean useSolution, Claude claude) {
        Lesson09Api api = useSolution ? new Lesson09Solution() : new Lesson09();
        Map<String, UnaryOperator<String>> tools = Map.of(
            "current_time", x -> LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm, dd/MM/yyyy")),
            "count_words", text -> String.valueOf(text.trim().split("\\s+").length));
        ClaudeApi claudeApi = new ClaudeApi(claude,
            "You are an assistant. Use the tools for facts you cannot know. Answer in Vietnamese in one or two sentences.",
            Map.of("current_time", "Return the current local time. Input: anything, e.g. 'now'.",
                "count_words", "Count the words in a text. Input: the text."));

        // Bọc Api để in ra mỗi lần gọi: stop_reason và các client tool được yêu cầu.
        Api traced = messages -> {
            Response response = claudeApi.call(messages);
            List<String> uses = response.content().stream()
                .filter(b -> b instanceof ToolUse).map(b -> ((ToolUse) b).name()).toList();
            System.out.println("  📡 lần gọi " + ((messages.size() + 1) / 2) + ": stop_reason=" + response.stopReason()
                + (uses.isEmpty() ? "" : ", tool_use=" + uses));
            return response;
        };

        LiveSection.run("Vòng lặp tự viết: gửi messages, đọc stop_reason, chạy tool, gửi tool_result", () ->
            System.out.println("  → " + api.runLoop(
                "Bây giờ là mấy giờ? Và câu 'stop reason tool use means Claude paused for your code' có bao nhiêu từ?",
                traced, tools, 6)));

        LiveSection.run("Không có tool cần chạy: một lần gọi là xong", () ->
            System.out.println("  → " + api.runLoop("Giải thích tool_result trong một câu.", traced, tools, 3)));
    }
}
