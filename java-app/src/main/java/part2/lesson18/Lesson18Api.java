package part2.lesson18;

import java.util.List;
import java.util.function.DoubleSupplier;
import java.util.function.Supplier;

/**
 * Phần 2 · Bài 18: Concurrency, Streaming and Backpressure.
 * {@link Lesson18} là chỗ bạn làm bài, {@link Lesson18Solution} là lời giải mẫu.
 */
public interface Lesson18Api {

    /** Kết quả của một nhánh: hoặc value, hoặc error (thông điệp của exception), không bao giờ cả hai. */
    record Outcome(String value, String error) {
        public boolean ok() {
            return error == null;
        }
    }

    /**
     * Bài 1 (gather có giới hạn): chạy mọi task đồng thời nhưng KHÔNG BAO GIỜ quá maxInFlight task cùng lúc
     * (dùng java.util.concurrent.Semaphore), chờ tất cả xong, trả kết quả đúng thứ tự task.
     * Một task ném exception thì ném lại exception đó (sau khi đã chờ các task khác).
     */
    <T> List<T> gatherBounded(List<Supplier<T>> tasks, int maxInFlight);

    /**
     * Bài 2 (cô lập lỗi): như bài 1 nhưng không để một nhánh lỗi kéo đổ cả nhóm: mỗi task thành một Outcome
     * (thành công thì value, lỗi thì error là getMessage() của exception). Thứ tự giữ nguyên.
     */
    List<Outcome> gatherSettled(List<Supplier<String>> tasks, int maxInFlight);

    /**
     * Bài 3 (backoff có jitter): thời gian chờ trước lần thử lại thứ `attempt` (đếm từ 0):
     * trần = min(capMs, baseMs × 2^attempt), rồi nhân với một số ngẫu nhiên trong [0, 1) lấy từ random (full jitter), làm tròn xuống.
     * Jitter để cả loạt request lỗi không cùng thử lại một lúc.
     */
    long backoffWithJitterMs(int attempt, long baseMs, long capMs, DoubleSupplier random);

    /** Bài 4 (đọc stream): nối các mảnh text_delta theo đúng thứ tự tới; bỏ qua mảnh null. */
    String accumulate(List<String> deltas);
}
