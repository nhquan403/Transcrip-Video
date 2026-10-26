package part2.lesson08;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Phần 2 · Bài 08: Reading Responses, stop_reason and Usage.
 * {@link Lesson08} là chỗ bạn làm bài, {@link Lesson08Solution} là lời giải mẫu.
 * Mỗi block trong content là một Map như trong JSON: {"type": "text", "text": ...}, {"type": "tool_use", "id": ..., "name": ..., "input": ...},
 * {"type": "thinking", ...}...
 */
public interface Lesson08Api {

    /** Phần usage của response. */
    record Usage(long inputTokens, long outputTokens, long cacheCreationInputTokens, long cacheReadInputTokens) {}

    enum NextStep {
        RETURN_ANSWER, RUN_TOOLS_AND_CALL_AGAIN, RAISE_CAP_OR_CONTINUE, SEND_BACK_TO_CONTINUE,
        HANDLE_REFUSAL, STOP_SEQUENCE_HIT, CONTEXT_WINDOW_FULL
    }

    /**
     * Bài 1: lấy câu trả lời chữ. Duyệt TẤT CẢ block theo thứ tự, chỉ lấy block "text", nối bằng "\n".
     * Đừng giả định block đầu tiên là text: thinking hay tool_use có thể đứng trước.
     */
    String finalText(List<Map<String, Object>> content);

    /** Bài 2: các block "tool_use" theo đúng thứ tự xuất hiện. */
    List<Map<String, Object>> toolCalls(List<Map<String, Object>> content);

    /**
     * Bài 3: rẽ nhánh theo stop_reason.
     * end_turn → RETURN_ANSWER, tool_use → RUN_TOOLS_AND_CALL_AGAIN, max_tokens → RAISE_CAP_OR_CONTINUE,
     * pause_turn → SEND_BACK_TO_CONTINUE, refusal → HANDLE_REFUSAL, stop_sequence → STOP_SEQUENCE_HIT,
     * model_context_window_exceeded → CONTEXT_WINDOW_FULL. Giá trị lạ thì ném IllegalArgumentException.
     */
    NextStep next(String stopReason);

    /** Bài 4: kích thước prompt đầy đủ = input_tokens (phần không cache) + token ghi cache + token đọc cache. */
    long fullPromptTokens(Usage usage);

    /**
     * Bài 5 (kiểm tra trước, đọc sau): stop_details chỉ có dữ liệu khi stop_reason là "refusal".
     * Trả về category trong stopDetails khi và chỉ khi stopReason là "refusal" và stopDetails có "category";
     * mọi trường hợp khác trả về Optional.empty(). stopDetails có thể null.
     */
    Optional<String> refusalCategory(String stopReason, Map<String, Object> stopDetails);
}
