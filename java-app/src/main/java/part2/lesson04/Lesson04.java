package part2.lesson04;

import java.util.List;
import java.util.Optional;
import java.util.function.LongConsumer;
import java.util.function.Supplier;

/**
 * Bài tập Phần 2 · Bài 04. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-04" (thêm --live để chạy với Claude thật)
 */
public class Lesson04 implements Lesson04Api {

    @Override
    public ErrorKind classify(int status) {
        throw new UnsupportedOperationException("TODO bài 1: lỗi tạm thời hay lỗi vĩnh viễn?");
    }

    /** Gợi ý: bắt ApiError, dùng classify(e.status()); lần chờ thứ k (đếm từ 0) là baseDelayMs * 2^k. */
    @Override
    public <T> T retryWithBackoff(Supplier<T> call, int maxAttempts, long baseDelayMs, LongConsumer sleeper) {
        throw new UnsupportedOperationException("TODO bài 2: retry lỗi tạm thời, ném ngay lỗi vĩnh viễn");
    }

    @Override
    public <T> T withFailover(Supplier<T> primary, Supplier<T> fallback, Optional<T> degraded) {
        throw new UnsupportedOperationException("TODO bài 3: primary → fallback model → degraded");
    }

    @Override
    public List<String> unmetConstraints(Requirements req, Design design) {
        throw new UnsupportedOperationException("TODO bài 4: kiểm tra từng ràng buộc, không bỏ cái nào");
    }
}
