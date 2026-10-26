package part2.lesson10;

import java.util.List;
import java.util.Map;

/**
 * Bài tập Phần 2 · Bài 10. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-10" (thêm --live để chạy với Claude thật)
 */
public class Lesson10 implements Lesson10Api {

    @Override
    public DefaultThinking defaultThinking(String model) {
        throw new UnsupportedOperationException("TODO bài 1: thinking mặc định của từng model");
    }

    @Override
    public BudgetTokens budgetTokens(String model) {
        throw new UnsupportedOperationException("TODO bài 2: budget_tokens trên từng model");
    }

    /** Gợi ý: (Map<String, Object>) body.get("thinking") và body.get("output_config"), có thể null. */
    @Override
    public List<String> validate(String model, Map<String, Object> body) {
        throw new UnsupportedOperationException("TODO bài 3: kiểm tra effort, thinking và tool_choice theo model");
    }

    @Override
    public List<Map<String, Object>> dropOldThinking(List<Map<String, Object>> messages) {
        throw new UnsupportedOperationException("TODO bài 4: giữ nguyên lượt assistant mới nhất, bỏ thinking ở lượt cũ");
    }
}
