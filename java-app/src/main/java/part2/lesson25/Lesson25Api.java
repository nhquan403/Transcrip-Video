package part2.lesson25;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Phần 2 · Bài 25: Setting Content and Data Boundaries.
 * {@link Lesson25} là chỗ bạn làm bài, {@link Lesson25Solution} là lời giải mẫu.
 */
public interface Lesson25Api {

    /** Một tài liệu lấy về (RAG, web, kho nội bộ...): nguồn và nội dung. */
    record Document(String source, String content) {}

    /**
     * Bài 1 (cái gì là tin cậy): chỉ "system_prompt" và "developer_instructions" là tin cậy.
     * "user_message", "retrieved_document", "web_page", "internal_kb", "tool_result" và mọi nguồn khác đều KHÔNG tin cậy.
     */
    boolean isTrusted(String source);

    /**
     * Bài 2 (đánh dấu ranh giới): bọc nội dung không tin cậy trong thẻ XML có nhãn:
     * "<" + tag + ">\n" + nội dung + "\n</" + tag + ">". Nếu nội dung chứa chính thẻ đóng "</tag>" (cố tình thoát ra khỏi thẻ),
     * thay nó bằng "&lt;/tag&gt;" trước khi bọc.
     */
    String wrap(String tag, String content);

    /**
     * Bài 3 (dựng request đúng vai trò): chỉ dẫn của bạn ở trường "system"; mỗi tài liệu bọc bằng thẻ "document" (dùng wrap) và
     * nối bằng "\n\n", rồi "\n\n" + câu hỏi, tất cả trong MỘT lượt user. Trả về Map với "system" và "messages".
     * Không bao giờ chép nội dung tài liệu vào system.
     */
    Map<String, Object> buildRequest(String instructions, List<Document> docs, String question);

    /**
     * Bài 4 (giảm dữ liệu từ đầu vào): che dữ liệu nhạy cảm trước khi đưa vào prompt hay log:
     * email → "[EMAIL]", số thẻ 16 chữ số (có thể có dấu cách hoặc gạch ngang giữa các nhóm 4 số) → "[CARD]",
     * số điện thoại Việt Nam 10 chữ số bắt đầu bằng 0 → "[PHONE]". Làm theo thứ tự: email, thẻ, điện thoại.
     */
    String redact(String text);

    /**
     * Bài 5 (kiểm tra output trước khi hành động): payload là đề xuất hành động Claude trả về. Trả về danh sách lỗi:
     *   "action not allowed: x" nếu "action" không thuộc allowedActions (hoặc thiếu: "action not allowed: null");
     *   "amount must be a number" nếu "amount" có mặt mà không phải số;
     *   "amount exceeds limit" nếu amount > maxAmount. JSON đúng hình dạng vẫn có thể mang giá trị sai: đây là chỗ bắt nó.
     */
    List<String> validateAction(Map<String, Object> payload, Set<String> allowedActions, double maxAmount);
}
