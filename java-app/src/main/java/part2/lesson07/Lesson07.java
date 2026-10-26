package part2.lesson07;

import java.util.List;
import java.util.Map;

/**
 * Bài tập Phần 2 · Bài 07. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-07" (thêm --live để chạy với Claude thật)
 */
public class Lesson07 implements Lesson07Api {

    @Override
    public List<String> validate(Request request) {
        throw new UnsupportedOperationException("TODO bài 1: kiểm tra model, max_tokens, messages, lượt đầu và role");
    }

    /** Gợi ý: đi qua từng lượt, nếu role trùng lượt trước thì nối block vào lượt trước. */
    @Override
    public List<Turn> mergeSameRole(List<Turn> messages) {
        throw new UnsupportedOperationException("TODO bài 2: gộp các lượt cùng role liền nhau");
    }

    @Override
    public List<Turn> appendExchange(List<Turn> history, List<Map<String, Object>> assistantBlocks, String userText) {
        throw new UnsupportedOperationException("TODO bài 3: nối lượt assistant (giữ nguyên block) và lượt user mới");
    }

    /** Gợi ý: dùng LinkedHashMap để giữ thứ tự khóa cho dễ đọc. */
    @Override
    public Map<String, Object> toBody(Request request) {
        throw new UnsupportedOperationException("TODO bài 4: dựng body JSON, system ở cấp cao nhất");
    }
}
