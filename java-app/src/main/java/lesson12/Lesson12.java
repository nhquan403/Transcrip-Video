package lesson12;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.UnaryOperator;
import lesson09.Lesson09Api.ToolUse;

/**
 * Bài tập bài 12. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="12" (thêm --live để chạy với Claude thật)
 */
public class Lesson12 implements Lesson12Api {

    @Override
    public List<List<ToolUse>> planBatches(List<ToolUse> calls, Set<String> readOnlyTools) {
        throw new UnsupportedOperationException("TODO bài 1: gom call chỉ đọc liền nhau, call ghi đứng riêng");
    }

    /** Gợi ý: Executors.newVirtualThreadPerTaskExecutor() cho đợt có nhiều call. */
    @Override
    public Map<String, String> executeBatches(List<List<ToolUse>> batches, Map<String, UnaryOperator<String>> tools) {
        throw new UnsupportedOperationException("TODO bài 2: chạy từng đợt, song song trong đợt");
    }

    @Override
    public long wallClockMs(List<List<Long>> batchDurationsMs) {
        throw new UnsupportedOperationException("TODO bài 3: tổng của max từng đợt");
    }

    @Override
    public String carryAcross(String previousResult, String nextTask) {
        throw new UnsupportedOperationException("TODO bài 4: manager mang kết quả sang");
    }
}
