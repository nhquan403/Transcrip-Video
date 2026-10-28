package part2.lesson26;

import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 26: Managing Context and Session State.
 * {@link Lesson26} là chỗ bạn làm bài, {@link Lesson26Solution} là lời giải mẫu.
 */
public interface Lesson26Api {

    /** Một mục trong cửa sổ ngữ cảnh. kind là "user", "assistant" hoặc "tool_result"; tokens là số token của mục đó. */
    record Turn(String kind, String text, int tokens) {}

    enum StateKind { EPHEMERAL, DURABLE }

    /**
     * Bài 1 (mọi token bị xử lý lại ở MỖI lượt): mỗi request i (bắt đầu từ 0) gửi lại system prompt, định nghĩa tool
     * và toàn bộ lịch sử từ messageTokens[0] tới messageTokens[i]. Trả về tổng số token đầu vào của tất cả request.
     * Ví dụ system 100, tools 50, messageTokens [10, 20]: request 0 = 160, request 1 = 180, tổng 340. Danh sách rỗng → 0.
     */
    long totalInputTokens(int systemTokens, int toolDefinitionTokens, List<Integer> messageTokens);

    /**
     * Bài 2 (prune tool output cũ, không đụng thứ khác): trả về danh sách MỚI cùng thứ tự, trong đó mỗi mục
     * kind "tool_result" có tokens >= minTokens và KHÔNG nằm trong keepLast mục cuối cùng được thay bằng
     * new Turn("tool_result", "[pruned]", 0). Mọi mục khác giữ nguyên. Không sửa danh sách đầu vào.
     */
    List<Turn> pruneStaleToolResults(List<Turn> window, int keepLast, int minTokens);

    /**
     * Bài 3 (hai loại state): "live_window", "tool_output", "chat_message" là EPHEMERAL (mất khi cắt cửa sổ hoặc hết phiên);
     * "file_on_disk", "config", "claude_md", "auto_memory" là DURABLE. Khác: IllegalArgumentException.
     */
    StateKind kindOf(String where);

    /**
     * Bài 4 (API không lưu state, code của bạn giữ transcript): trả về danh sách messages cho request kế tiếp =
     * toàn bộ history (giữ nguyên thứ tự) + một lượt user mới chứa userText. Không sửa history đầu vào.
     */
    List<Map<String, Object>> nextRequestMessages(List<Map<String, Object>> history, String userText);

    /**
     * Bài 5 (ranh giới phiên là lựa chọn trong code): bắt đầu phiên mới = bỏ lịch sử cũ. Nếu carrySummary null hoặc rỗng
     * → danh sách rỗng. Ngược lại → đúng một lượt user có content "Summary of the previous session: " + carrySummary.
     */
    List<Map<String, Object>> startNewSession(List<Map<String, Object>> oldHistory, String carrySummary);

    /** Dùng chung cho bài 4, 5. */
    static Map<String, Object> turn(String role, String text) {
        return Map.of("role", role, "content", text);
    }
}
