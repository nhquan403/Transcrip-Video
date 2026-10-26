package part2.lesson12;

import java.time.Instant;
import java.util.List;

/**
 * Bài tập Phần 2 · Bài 12. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-12" (thêm --live để chạy với Claude thật)
 */
public class Lesson12 implements Lesson12Api {

    @Override
    public Surface choose(Job job) {
        throw new UnsupportedOperationException("TODO bài 1: realtime hay batch?");
    }

    @Override
    public double batchCost(long inputTokens, long outputTokens, double inputPricePerMTok, double outputPricePerMTok) {
        throw new UnsupportedOperationException("TODO bài 2: nửa giá cho cả input và output");
    }

    @Override
    public List<Integer> splitIntoBatches(List<Long> requestBytes, int maxRequests, long maxBytes) {
        throw new UnsupportedOperationException("TODO bài 3: chia theo số request và theo dung lượng");
    }

    /** Gợi ý: java.time.Duration.between(createdAt, now), so với Duration.ofHours(24) và Duration.ofDays(29). */
    @Override
    public BatchState state(Instant createdAt, Instant now, boolean allRequestsDone) {
        throw new UnsupportedOperationException("TODO bài 4: cửa sổ xử lý 24 giờ, cửa sổ lưu kết quả 29 ngày");
    }
}
