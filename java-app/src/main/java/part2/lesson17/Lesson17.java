package part2.lesson17;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.function.Function;

/**
 * Bài tập Phần 2 · Bài 17. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-17" (thêm --live để chạy với Claude thật)
 */
public class Lesson17 implements Lesson17Api {

    /** Gợi ý: CompletableFuture.supplyAsync(() -> ..., executor) */
    @Override
    public CompletableFuture<String> callAsync(Function<String, String> blockingCall, String prompt, Executor executor) {
        throw new UnsupportedOperationException("TODO bài 1: trả về future ngay, chạy lời gọi trên executor");
    }

    @Override
    public List<String> runSequential(List<String> prompts, Function<String, String> blockingCall) {
        throw new UnsupportedOperationException("TODO bài 2: lần lượt từng cái");
    }

    /** Gợi ý: tạo hết danh sách future trước, rồi mới join() từng cái. Đừng join ngay trong lúc tạo. */
    @Override
    public List<String> runConcurrent(List<String> prompts, Function<String, CompletableFuture<String>> asyncCall) {
        throw new UnsupportedOperationException("TODO bài 3: khởi động hết rồi mới chờ");
    }

    @Override
    public long wallTimeMs(List<Long> callDurationsMs, boolean concurrent) {
        throw new UnsupportedOperationException("TODO bài 4: tổng hay lớn nhất?");
    }
}
