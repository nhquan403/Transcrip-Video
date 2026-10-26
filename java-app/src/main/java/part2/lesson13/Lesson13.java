package part2.lesson13;

import java.util.List;
import java.util.Map;

/**
 * Bài tập Phần 2 · Bài 13. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-13" (thêm --live để gửi một batch thật)
 */
public class Lesson13 implements Lesson13Api {

    /** Gợi ý: một regex. */
    @Override
    public boolean validCustomId(String customId) {
        throw new UnsupportedOperationException("TODO bài 1: 1 tới 64 ký tự, chữ, số, - và _");
    }

    @Override
    public List<String> validate(List<Entry> entries) {
        throw new UnsupportedOperationException("TODO bài 2: id hợp lệ, không trùng, không stream, max_tokens ≥ 1");
    }

    @Override
    public Map<String, Object> toBatchParams(Map<String, Object> syncRequest) {
        throw new UnsupportedOperationException("TODO bài 3: bỏ các tham số batch không nhận");
    }

    @Override
    public WriteBack writeBack(Map<String, String> inputs, List<Result> results) {
        throw new UnsupportedOperationException("TODO bài 4: ghép theo custom_id, gom các id cần chạy lại");
    }
}
