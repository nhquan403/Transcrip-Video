package lesson09;

import java.util.List;
import java.util.Map;
import java.util.function.UnaryOperator;

/**
 * Bài 09: Building a Custom Agent Loop.
 * Các kiểu dưới đây là bản thu gọn của Messages API: bạn tự viết vòng lặp gửi messages, đọc stop_reason,
 * chạy client tool và gửi tool_result khớp id. Ở chế độ --live, {@link ClaudeApi} nối chúng với API thật.
 * {@link Lesson09} là chỗ bạn làm bài, {@link Lesson09Solution} là lời giải mẫu.
 */
public interface Lesson09Api {

    /** Các khối nội dung trong câu trả lời của model. */
    sealed interface Block permits Text, ToolUse, ServerToolUse, ServerToolResult {}

    record Text(String text) implements Block {}

    /** Client tool: model tạm dừng, code của bạn phải chạy tool và gửi lại tool_result. */
    record ToolUse(String id, String name, String input) implements Block {}

    /** Server tool (ví dụ web search): chạy trên hạ tầng Anthropic, bạn không chạy và không gửi kết quả. */
    record ServerToolUse(String id, String name, String input) implements Block {}

    /** Kết quả server tool, đã có sẵn trong câu trả lời. */
    record ServerToolResult(String toolUseId, String content) implements Block {}

    record ToolResult(String toolUseId, String content, boolean isError) {}

    /** Mảng messages: lượt user bằng text, lượt assistant với các khối, hoặc lượt user mang tool_result. */
    sealed interface Msg permits UserText, AssistantBlocks, UserToolResults {}

    record UserText(String text) implements Msg {}

    record AssistantBlocks(List<Block> content) implements Msg {}

    record UserToolResults(List<ToolResult> results) implements Msg {}

    /** Một câu trả lời: stopReason là "tool_use", "end_turn", "max_tokens", "refusal"... */
    record Response(String stopReason, List<Block> content) {}

    /** Một lần gọi Messages API với toàn bộ mảng messages. */
    interface Api {
        Response call(List<Msg> messages);
    }

    /** Bài 1: lấy các client tool cần chạy trong câu trả lời (bỏ qua server tool). */
    List<ToolUse> clientToolUses(Response response);

    /**
     * Bài 2: chạy từng client tool, trả về tool_result cùng thứ tự, toolUseId khớp với id của tool_use.
     * Tool không tồn tại: isError, nội dung "error: unknown tool <tên>".
     * Tool ném RuntimeException: isError, nội dung "error: " + message (không để lỗi làm sập vòng lặp).
     */
    List<ToolResult> runTools(List<ToolUse> uses, Map<String, UnaryOperator<String>> tools);

    /** Bài 3: kiểm tra cái bắt tay: mỗi client tool_use có đúng một tool_result cùng id, không thừa không thiếu. */
    boolean handshakeOk(AssistantBlocks assistant, UserToolResults results);

    /**
     * Bài 4: vòng lặp tự viết.
     * Bắt đầu với [UserText(prompt)]. Mỗi vòng: gọi api, thêm AssistantBlocks(content) vào messages, rồi xét stopReason:
     * - "tool_use": chạy client tool, thêm UserToolResults rồi gọi lại.
     * - "end_turn": trả về các khối Text nối bằng "\n".
     * - giá trị khác: ném IllegalStateException chứa stopReason (code của bạn tự quyết, không đoán mò).
     * Quá maxIterations lần gọi api: ném IllegalStateException.
     */
    String runLoop(String prompt, Api api, Map<String, UnaryOperator<String>> tools, int maxIterations);
}
