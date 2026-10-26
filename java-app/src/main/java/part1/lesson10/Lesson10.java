package part1.lesson10;

import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import java.util.function.Supplier;
import java.util.function.UnaryOperator;
import part1.lesson09.Lesson09Api.Api;

/**
 * Bài tập bài 10. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p1-10" (thêm --live để chạy với Claude thật)
 */
public class Lesson10 implements Lesson10Api {

    @Override
    public Map<String, Object> parseToolInput(List<String> partialJsonDeltas) {
        throw new UnsupportedOperationException("TODO bài 1: gom mảnh JSON rồi parse một lần");
    }

    @Override
    public String withRetry(Supplier<String> tool, int maxAttempts, Predicate<RuntimeException> retryable) {
        throw new UnsupportedOperationException("TODO bài 2: thử lại khi lỗi thoáng qua");
    }

    /** Gợi ý: bắt đầu từ runLoop bài 09, thêm biến turns, List<String> log và ba điểm chèn quanh mỗi tool. */
    @Override
    public HarnessResult run(String prompt, Api api, Map<String, UnaryOperator<String>> tools, Policy policy,
                             int maxTurns, int maxAttempts, Predicate<RuntimeException> retryable) {
        throw new UnsupportedOperationException("TODO bài 3: harness có đếm lượt, chính sách, retry, nhật ký");
    }
}
