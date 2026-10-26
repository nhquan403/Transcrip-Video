package part1.lesson06;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Consumer;
import java.util.function.UnaryOperator;

/**
 * Bài 06: Your First Agent with query.
 *
 * Agent SDK thật chỉ có bản Python và TypeScript. Ở đây bạn tự dựng một query() thu nhỏ bằng Java
 * để hiểu nó làm gì bên trong: luồng message có kiểu, phiên mới mỗi lần gọi, tool được phép, giới hạn số lượt.
 * {@link Lesson06} là chỗ bạn làm bài, {@link Lesson06Solution} là lời giải mẫu.
 */
public interface Lesson06Api {

    /** Các tùy chọn của query: system prompt, tool được phép, model, số lượt dùng tool tối đa (null = không giới hạn). */
    record Options(String systemPrompt, Set<String> allowedTools, String model, Integer maxTurns) {}

    record ToolCall(String id, String name, String input) {}

    record ToolResult(String toolCallId, String content, boolean isError) {}

    record Usage(long inputTokens, long outputTokens) {
        public Usage plus(Usage other) {
            return new Usage(inputTokens + other.inputTokens, outputTokens + other.outputTokens);
        }
    }

    /** Một lần model trả lời: phần text, các tool muốn gọi (rỗng nếu đã xong), và token đã dùng. */
    record ModelReply(String text, List<ToolCall> toolCalls, Usage usage) {}

    /** "Model" nhận system prompt, hội thoại của phiên hiện tại, và danh sách tool nó được thấy. */
    interface Model {
        ModelReply reply(String systemPrompt, List<SdkMessage> conversation, List<String> tools, String model);
    }

    /** Các loại message chảy ra từ query, theo đúng thứ tự agent tạo ra. */
    sealed interface SdkMessage permits SystemInit, AssistantMessage, UserMessage, ResultMessage {}

    /** Mở đầu phiên: báo cấu hình đã chốt. */
    record SystemInit(String sessionId, String model, List<String> tools, String systemPrompt) implements SdkMessage {}

    /** Model nói gì và muốn gọi tool nào. */
    record AssistantMessage(String text, List<ToolCall> toolCalls) implements SdkMessage {}

    /** Phía user: prompt ban đầu (toolResults rỗng), hoặc kết quả tool đưa lại cho model (prompt là null). */
    record UserMessage(String prompt, List<ToolResult> toolResults) implements SdkMessage {}

    /** Kết thúc phiên: subtype "success" hoặc "error_max_turns"; result chỉ có khi success. */
    record ResultMessage(String subtype, String result, Usage usage, int numTurns, String sessionId) implements SdkMessage {}

    /**
     * Bài 1-4: chạy vòng lặp agent và đẩy từng message ra `out` ngay khi có.
     *
     * 1. Mỗi lần gọi là một phiên mới: sessionId mới (UUID), hội thoại mới chỉ gồm UserMessage(prompt).
     *    Đẩy ra SystemInit trước tiên (tools sắp xếp theo tên). Prompt ban đầu không đẩy ra.
     * 2. Gọi model với hội thoại hiện tại và các tool được phép; thêm AssistantMessage vào hội thoại và đẩy ra.
     *    Không có tool call nào: đẩy ResultMessage("success", text, ...) rồi kết thúc.
     * 3. Có tool call: chạy từng tool. Tool không nằm trong allowedTools hoặc không tồn tại thì trả
     *    ToolResult lỗi "error: tool <tên> is not allowed". Gom kết quả thành một UserMessage, thêm vào hội thoại, đẩy ra.
     *    Mỗi vòng như vậy là một lượt (turn).
     * 4. Nếu model còn muốn gọi tool mà số lượt đã bằng maxTurns: không chạy tool nữa, đẩy
     *    ResultMessage("error_max_turns", null, ...) rồi kết thúc. Usage luôn là tổng của mọi lần gọi model.
     */
    void query(String prompt, Options options, Model model, Map<String, UnaryOperator<String>> tools,
               Consumer<SdkMessage> out);

    /** Bài 5: đọc kết quả cuối từ các message đã nhận. Kiểm tra subtype trước: không phải success thì ném IllegalStateException. */
    String resultText(List<SdkMessage> messages);
}
