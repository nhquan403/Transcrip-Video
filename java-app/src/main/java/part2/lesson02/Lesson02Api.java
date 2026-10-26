package part2.lesson02;

import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 02: Functional Requirements for Claude.
 * {@link Lesson02} là chỗ bạn làm bài, {@link Lesson02Solution} là lời giải mẫu.
 */
public interface Lesson02Api {

    /** Loại phản hồi sau khi đối chiếu stop_reason và kết quả kiểm tra định dạng. */
    enum ResponseKind { OK, REFUSAL, TRUNCATED, CONTRACT_BROKEN }

    /** Một hàng trong bảng tách tính năng: người dùng gửi gì, Claude phải trả gì, kiểm tra bằng gì. */
    record Turn(String userSends, String expectedOutput, String successCheck) {}

    /**
     * Bài 1 (format signal): output có parse được thành object JSON và đúng hợp đồng không?
     * schema: tên trường → kiểu, một trong "string", "number", "boolean", "array".
     * Trả về danh sách lỗi theo thứ tự trường trong schema, rồi tới trường thừa theo thứ tự xuất hiện:
     *   "not JSON" (chỉ một lỗi này nếu không parse được thành object), "missing: x", "wrong type: x", "unexpected: y".
     * Danh sách rỗng nghĩa là đạt.
     */
    List<String> formatErrors(String output, Map<String, String> schema);

    /**
     * Bài 2 (grounding signal): câu trả lời có dựa vào tài liệu được đưa không?
     * Đạt khi có ít nhất một trích dẫn và MỌI trích dẫn đều xuất hiện nguyên văn trong source,
     * sau khi gộp mọi khoảng trắng liên tiếp thành một dấu cách và bỏ khoảng trắng hai đầu.
     */
    boolean isGrounded(List<String> quotes, String source);

    /**
     * Bài 3 (behavior signal): tỉ lệ lựa chọn của app khớp với tập ví dụ đã gán nhãn.
     * Hai danh sách khác độ dài, hoặc rỗng, thì ném IllegalArgumentException.
     */
    double behaviorAccuracy(List<String> predicted, List<String> labels);

    /**
     * Bài 4 (refusal và đường không vui): phân loại một phản hồi.
     * stop_reason "refusal" là REFUSAL; "max_tokens" là TRUNCATED (câu trả lời bị cắt);
     * còn lại, nếu output không đạt format check thì CONTRACT_BROKEN (ví dụ Claude từ chối bằng lời với end_turn), đạt thì OK.
     */
    ResponseKind classify(String stopReason, boolean passesFormatCheck);

    /**
     * Bài 5 (lỗ hổng đặc tả): với mỗi lượt thiếu expectedOutput hoặc thiếu successCheck (null hoặc toàn khoảng trắng),
     * thêm "turn N: missing expected output" và/hoặc "turn N: missing check" (N đếm từ 1, theo thứ tự đó).
     */
    List<String> specGaps(List<Turn> turns);
}
