package lesson02;

import java.util.List;
import java.util.function.Predicate;
import java.util.function.UnaryOperator;

/**
 * Bài tập bài 02. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="02" (thêm --live để chạy với Claude thật)
 */
public class Lesson02 implements Lesson02Api {

    /** Ví dụ: promptTokens = 1000, outputs = [500, 2000] thì 1000 + 1500 + 3500 = 6000. */
    @Override
    public long totalInputTokens(int promptTokens, List<Integer> toolOutputTokens) {
        throw new UnsupportedOperationException("TODO bài 1: cộng dồn context qua từng vòng");
    }

    /** Gợi ý: Math.pow. Ví dụ 0.95 qua 10 bước chỉ còn khoảng 0.60. */
    @Override
    public double chanceAllStepsCorrect(double stepAccuracy, int steps) {
        throw new UnsupportedOperationException("TODO bài 2: lũy thừa");
    }

    /** Ví dụ: stepAccuracy = 0.9, target = 0.5 thì kết quả là 6 (0.9^6 ≈ 0.53, 0.9^7 ≈ 0.48). */
    @Override
    public int maxStepsForTarget(double stepAccuracy, double target) {
        throw new UnsupportedOperationException("TODO bài 3: tăng số bước tới khi tụt dưới target");
    }

    @Override
    public long waitTimeMs(List<Long> roundTripsMs) {
        throw new UnsupportedOperationException("TODO bài 4: tổng các round trip");
    }

    @Override
    public String hybridPipeline(String input, Predicate<String> validate, UnaryOperator<String> agentStage,
                                 UnaryOperator<String> format) {
        throw new UnsupportedOperationException("TODO bài 5: validate, try/catch quanh agent, format");
    }
}
