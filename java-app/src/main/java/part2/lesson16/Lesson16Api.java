package part2.lesson16;

import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 16: JSON Request and Response Bodies.
 * {@link Lesson16} là chỗ bạn làm bài, {@link Lesson16Solution} là lời giải mẫu.
 */
public interface Lesson16Api {

    /**
     * Bài 1 (ba viên gạch của JSON): giá trị đã parse bằng Jackson thuộc loại nào?
     * Map → "object", List → "array", String → "string", Number → "number", Boolean → "boolean", null → "null".
     */
    String jsonType(Object value);

    /** Bài 2: trong ba khóa cốt lõi "model", "messages", "max_tokens" (đúng thứ tự này), body thiếu những khóa nào? */
    List<String> missingCoreKeys(Map<String, Object> body);

    /**
     * Bài 3 (đọc response bằng cách đi theo cấu trúc): từ chuỗi JSON thô của response, lấy câu trả lời bằng cách duyệt mảng
     * "content", nối "text" của mọi block có "type" là "text" (nối liền, không thêm ký tự). Không có block text thì trả về "".
     * Chuỗi không phải JSON object hoặc không có mảng content thì ném IllegalArgumentException.
     */
    String extractAnswer(String responseJson);

    /** Bài 4 (Base64 làm dữ liệu to ra): số ký tự Base64 của rawBytes byte = 4 × ceil(rawBytes / 3). */
    long base64Length(long rawBytes);

    /**
     * Bài 5 (ước lượng kích thước body): số byte UTF-8 của phần text, cộng độ dài Base64 của từng ảnh.
     * Nhớ: chữ tiếng Việt có dấu chiếm 2 tới 3 byte trong UTF-8.
     */
    long estimateBodyBytes(String text, List<Long> imageRawBytes);
}
