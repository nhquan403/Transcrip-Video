package part2.lesson08;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Bài tập Phần 2 · Bài 08. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-08" (thêm --live để chạy với Claude thật)
 */
public class Lesson08 implements Lesson08Api {

    @Override
    public String finalText(List<Map<String, Object>> content) {
        throw new UnsupportedOperationException("TODO bài 1: duyệt mọi block, chỉ lấy text");
    }

    @Override
    public List<Map<String, Object>> toolCalls(List<Map<String, Object>> content) {
        throw new UnsupportedOperationException("TODO bài 2: lọc block tool_use");
    }

    /** Gợi ý: switch trên chuỗi, có nhánh default ném lỗi. */
    @Override
    public NextStep next(String stopReason) {
        throw new UnsupportedOperationException("TODO bài 3: rẽ nhánh theo stop_reason");
    }

    @Override
    public long fullPromptTokens(Usage usage) {
        throw new UnsupportedOperationException("TODO bài 4: cộng cả ba con số input");
    }

    @Override
    public Optional<String> refusalCategory(String stopReason, Map<String, Object> stopDetails) {
        throw new UnsupportedOperationException("TODO bài 5: kiểm tra refusal trước khi đọc stop_details");
    }
}
