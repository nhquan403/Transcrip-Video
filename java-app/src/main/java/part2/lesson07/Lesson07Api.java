package part2.lesson07;

import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 07: Messages API, Turns, Blocks and Roles.
 * {@link Lesson07} là chỗ bạn làm bài, {@link Lesson07Solution} là lời giải mẫu.
 */
public interface Lesson07Api {

    /** Một lượt trong mảng messages. content là String (dạng chuỗi) hoặc List các block Map (dạng block). */
    record Turn(String role, Object content) {}

    /** Một request rút gọn. maxTokens có thể null (để bài tập kiểm tra trường bắt buộc). */
    record Request(String model, Integer maxTokens, String system, List<Turn> messages) {}

    /**
     * Bài 1 (trường bắt buộc và thứ tự lượt): trả về danh sách lỗi theo đúng thứ tự sau, chỉ gồm lỗi có thật:
     *   "missing model" (null hoặc rỗng), "max_tokens must be > 0" (null hoặc ≤ 0), "messages must not be empty",
     *   "first turn must be user", rồi với mỗi lượt có role "system": "system belongs in the top-level system field",
     *   với role lạ khác: "unknown role: x".
     */
    List<String> validate(Request request);

    /**
     * Bài 2 (hai lượt cùng role liền nhau bị API gộp làm một): trả về danh sách đã gộp.
     * Khi gộp, nội dung thành danh sách block: chuỗi s đổi thành {"type": "text", "text": s}, danh sách block giữ nguyên thứ tự.
     * Lượt không bị gộp giữ nguyên content như cũ.
     */
    List<Turn> mergeSameRole(List<Turn> messages);

    /**
     * Bài 3 (API không giữ trạng thái): dựng lịch sử cho lời gọi tiếp theo = history + lượt assistant + lượt user mới.
     * Lượt assistant giữ NGUYÊN danh sách block nhận được (không làm phẳng thành chuỗi, vì sẽ mất tool_use và thinking).
     * Không được sửa danh sách history truyền vào.
     */
    List<Turn> appendExchange(List<Turn> history, List<Map<String, Object>> assistantBlocks, String userText);

    /**
     * Bài 4 (hình dạng body JSON): trả về Map với "model", "max_tokens", "messages" (mỗi lượt là Map có "role" và "content"),
     * và "system" ở cấp cao nhất CHỈ khi system khác null. System không bao giờ nằm trong messages.
     */
    Map<String, Object> toBody(Request request);
}
