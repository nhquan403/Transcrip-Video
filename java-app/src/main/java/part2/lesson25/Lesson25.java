package part2.lesson25;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Bài tập Phần 2 · Bài 25. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-25" (thêm --live để chạy với Claude thật)
 */
public class Lesson25 implements Lesson25Api {

    @Override
    public boolean isTrusted(String source) {
        throw new UnsupportedOperationException("TODO bài 1: chỉ thứ bạn tự viết mới tin cậy");
    }

    @Override
    public String wrap(String tag, String content) {
        throw new UnsupportedOperationException("TODO bài 2: bọc trong thẻ, chặn đường thoát ra khỏi thẻ");
    }

    @Override
    public Map<String, Object> buildRequest(String instructions, List<Document> docs, String question) {
        throw new UnsupportedOperationException("TODO bài 3: chỉ dẫn ở system, dữ liệu trong thẻ ở lượt user");
    }

    /** Gợi ý: ba regex, ví dụ số thẻ: \\b\\d{4}([ -]?\\d{4}){3}\\b */
    @Override
    public String redact(String text) {
        throw new UnsupportedOperationException("TODO bài 4: che email, thẻ, điện thoại");
    }

    @Override
    public List<String> validateAction(Map<String, Object> payload, Set<String> allowedActions, double maxAmount) {
        throw new UnsupportedOperationException("TODO bài 5: kiểm tra hành động và giới hạn nghiệp vụ");
    }
}
