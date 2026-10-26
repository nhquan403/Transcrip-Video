package part2.lesson04;

import java.util.List;
import java.util.Optional;
import java.util.function.LongConsumer;
import java.util.function.Supplier;

/**
 * Phần 2 · Bài 04: Matching Architecture to the Requirement.
 * {@link Lesson04} là chỗ bạn làm bài, {@link Lesson04Solution} là lời giải mẫu.
 */
public interface Lesson04Api {

    enum ErrorKind { TRANSIENT, PERMANENT }

    /** Lỗi khi gọi API: status HTTP (0 nếu là timeout hoặc lỗi mạng, chưa có response). */
    final class ApiError extends RuntimeException {
        private final int status;

        public ApiError(int status, String message) {
            super(status + " " + message);
            this.status = status;
        }

        public int status() {
            return status;
        }
    }

    /** Các ràng buộc đã nêu trong yêu cầu. availabilityTarget null nghĩa là không có cam kết uptime. */
    record Requirements(long latencyBudgetMs, int peakRequestsPerMinute, List<String> allowedRegions, Double availabilityTarget) {}

    /** Bản thiết kế: số lời gọi tuần tự, thời gian mỗi lời gọi, rate limit, vùng chạy, có đường failover không. */
    record Design(int sequentialCalls, long msPerCall, int rateLimitPerMinute, String region, boolean hasFailover) {}

    /**
     * Bài 1 (phân loại lỗi): 0 (timeout/mạng), 408, 429, 500, 502, 503, 504, 529 là TRANSIENT (tự hết, nên retry).
     * Mọi status khác (400 request sai, 401 sai key, 403, 404, 413, 422...) là PERMANENT: retry không đổi được gì.
     */
    ErrorKind classify(int status);

    /**
     * Bài 2 (retry với exponential backoff): gọi call; lỗi TRANSIENT thì chờ baseDelayMs, 2×, 4×... rồi thử lại,
     * tối đa maxAttempts lần gọi tổng cộng. Lỗi PERMANENT ném ra NGAY, không chờ, không thử lại.
     * Hết lượt thì ném lỗi cuối cùng. Thời gian chờ được báo qua sleeper (để test không phải chờ thật).
     */
    <T> T retryWithBackoff(Supplier<T> call, int maxAttempts, long baseDelayMs, LongConsumer sleeper);

    /**
     * Bài 3 (failover): thử primary; nếu lỗi (bất kỳ ApiError nào) thì thử fallback model;
     * nếu fallback cũng lỗi thì trả về degraded (bản cache, bản rút gọn...) nếu có, không thì ném lỗi của fallback.
     */
    <T> T withFailover(Supplier<T> primary, Supplier<T> fallback, Optional<T> degraded);

    /**
     * Bài 4 (fit check): đối chiếu thiết kế với TỪNG ràng buộc, trả về danh sách ràng buộc không đạt theo thứ tự
     * "latency", "throughput", "residency", "availability".
     * latency: sequentialCalls × msPerCall phải ≤ latencyBudgetMs. throughput: peak ≤ rate limit.
     * residency: region phải nằm trong allowedRegions. availability: có cam kết uptime thì phải có failover.
     * Danh sách rỗng mới là "fit".
     */
    List<String> unmetConstraints(Requirements req, Design design);
}
