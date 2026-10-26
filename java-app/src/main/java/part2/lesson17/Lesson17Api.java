package part2.lesson17;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.function.Function;

/**
 * Phần 2 · Bài 17: Async and Await for API Calls.
 * Java không có từ khóa async/await như Python hay TypeScript; CompletableFuture đóng vai coroutine/promise,
 * còn join() là chỗ "chờ kết quả". {@link Lesson17} là chỗ bạn làm bài, {@link Lesson17Solution} là lời giải mẫu.
 */
public interface Lesson17Api {

    /**
     * Bài 1 (gọi không chặn): bọc một lời gọi chặn (blockingCall) để nó chạy trên executor và trả về ngay một CompletableFuture,
     * thay vì bắt người gọi đứng chờ.
     */
    CompletableFuture<String> callAsync(Function<String, String> blockingCall, String prompt, Executor executor);

    /** Bài 2 (chặn từng cái): gọi lần lượt, cái sau chỉ bắt đầu khi cái trước xong. Kết quả theo đúng thứ tự prompts. */
    List<String> runSequential(List<String> prompts, Function<String, String> blockingCall);

    /**
     * Bài 3 (đồng thời): khởi động TẤT CẢ lời gọi trước (mỗi prompt một future), rồi mới chờ cả nhóm.
     * Kết quả theo đúng thứ tự prompts, dù cái nào xong trước.
     */
    List<String> runConcurrent(List<String> prompts, Function<String, CompletableFuture<String>> asyncCall);

    /**
     * Bài 4: thời gian thực ước tính. Tuần tự: tổng các thời gian. Đồng thời (mọi lời gọi cùng bay): thời gian của cái chậm nhất.
     * Danh sách rỗng: 0.
     */
    long wallTimeMs(List<Long> callDurationsMs, boolean concurrent);
}
