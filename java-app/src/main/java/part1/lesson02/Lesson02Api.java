package part1.lesson02;

import java.util.List;
import java.util.function.Predicate;
import java.util.function.UnaryOperator;

/**
 * Bài 02: Cost, Latency and Reliability Tradeoffs.
 * {@link Lesson02} là chỗ bạn làm bài, {@link Lesson02Solution} là lời giải mẫu.
 */
public interface Lesson02Api {

    /**
     * Bài 1 (chi phí token): context không reset giữa các vòng. Vòng 1 gửi promptTokens;
     * vòng k gửi promptTokens cộng toàn bộ output của tool ở các vòng trước.
     * Số vòng = toolOutputTokens.size() + 1 (vòng cuối model trả lời).
     * Trả về tổng số input token phải trả qua tất cả các vòng.
     */
    long totalInputTokens(int promptTokens, List<Integer> toolOutputTokens);

    /** Bài 2 (lỗi dồn): mỗi bước đúng với xác suất stepAccuracy. Xác suất cả `steps` bước đều đúng là bao nhiêu? */
    double chanceAllStepsCorrect(double stepAccuracy, int steps);

    /** Bài 3 (giới hạn vòng lặp): số bước tối đa mà xác suất toàn bộ đều đúng vẫn >= target. */
    int maxStepsForTarget(double stepAccuracy, double target);

    /** Bài 4 (độ trễ): các round trip chạy tuần tự, thời gian người dùng chờ là tổng của chúng. */
    long waitTimeMs(List<Long> roundTripsMs);

    /**
     * Bài 5 (hybrid): workflow cố định "validate, làm việc, format" với agent đặt ở bước giữa.
     * Input không hợp lệ thì ném IllegalArgumentException, không gọi agent.
     * Agent ném RuntimeException thì trả về "ERROR: " + message (workflow xử lý lỗi, không để lỗi lan ra).
     * Còn lại trả về format(agent(input)).
     */
    String hybridPipeline(String input, Predicate<String> validate, UnaryOperator<String> agentStage,
                          UnaryOperator<String> format);
}
