package part2.lesson17;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.function.Function;

/** Lời giải mẫu Phần 2 · Bài 17. Hãy tự làm trong Lesson17 trước khi đọc file này. */
public class Lesson17Solution implements Lesson17Api {

    @Override
    public CompletableFuture<String> callAsync(Function<String, String> blockingCall, String prompt, Executor executor) {
        return CompletableFuture.supplyAsync(() -> blockingCall.apply(prompt), executor);
    }

    @Override
    public List<String> runSequential(List<String> prompts, Function<String, String> blockingCall) {
        return prompts.stream().map(blockingCall).toList();
    }

    @Override
    public List<String> runConcurrent(List<String> prompts, Function<String, CompletableFuture<String>> asyncCall) {
        List<CompletableFuture<String>> inFlight = prompts.stream().map(asyncCall).toList();
        return inFlight.stream().map(CompletableFuture::join).toList();
    }

    @Override
    public long wallTimeMs(List<Long> callDurationsMs, boolean concurrent) {
        if (concurrent) return callDurationsMs.stream().mapToLong(Long::longValue).max().orElse(0);
        return callDurationsMs.stream().mapToLong(Long::longValue).sum();
    }
}
