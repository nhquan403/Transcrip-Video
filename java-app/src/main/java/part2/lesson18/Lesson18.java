package part2.lesson18;

import java.util.List;
import java.util.function.DoubleSupplier;
import java.util.function.Supplier;

/**
 * Bài tập Phần 2 · Bài 18. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-18" (thêm --live để chạy với Claude thật)
 */
public class Lesson18 implements Lesson18Api {

    /**
     * Gợi ý: Semaphore slots = new Semaphore(maxInFlight); mỗi task chạy trên một virtual thread
     * (Executors.newVirtualThreadPerTaskExecutor()), acquire() trước khi gọi, release() trong finally.
     */
    @Override
    public <T> List<T> gatherBounded(List<Supplier<T>> tasks, int maxInFlight) {
        throw new UnsupportedOperationException("TODO bài 1: đồng thời nhưng có trần");
    }

    @Override
    public List<Outcome> gatherSettled(List<Supplier<String>> tasks, int maxInFlight) {
        throw new UnsupportedOperationException("TODO bài 2: mỗi nhánh thành công hay thất bại riêng");
    }

    @Override
    public long backoffWithJitterMs(int attempt, long baseMs, long capMs, DoubleSupplier random) {
        throw new UnsupportedOperationException("TODO bài 3: exponential backoff có trần và jitter");
    }

    @Override
    public String accumulate(List<String> deltas) {
        throw new UnsupportedOperationException("TODO bài 4: nối các mảnh theo thứ tự");
    }
}
