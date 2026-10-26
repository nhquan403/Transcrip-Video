package part2.lesson18;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletionException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.Semaphore;
import java.util.function.DoubleSupplier;
import java.util.function.Supplier;

/** Lời giải mẫu Phần 2 · Bài 18. Hãy tự làm trong Lesson18 trước khi đọc file này. */
public class Lesson18Solution implements Lesson18Api {

    @Override
    public <T> List<T> gatherBounded(List<Supplier<T>> tasks, int maxInFlight) {
        Semaphore slots = new Semaphore(maxInFlight);
        try (ExecutorService pool = Executors.newVirtualThreadPerTaskExecutor()) {
            List<Future<T>> futures = new ArrayList<>();
            for (Supplier<T> task : tasks) {
                futures.add(pool.submit(() -> {
                    slots.acquire();
                    try {
                        return task.get();
                    } finally {
                        slots.release();
                    }
                }));
            }
            List<T> results = new ArrayList<>();
            RuntimeException firstError = null;
            for (Future<T> f : futures) {
                try {
                    results.add(f.get());
                } catch (ExecutionException e) {
                    if (firstError == null) firstError = unwrap(e.getCause());
                    results.add(null);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    throw new IllegalStateException(e);
                }
            }
            if (firstError != null) throw firstError;
            return results;
        }
    }

    @Override
    public List<Outcome> gatherSettled(List<Supplier<String>> tasks, int maxInFlight) {
        List<Supplier<Outcome>> settled = tasks.stream().<Supplier<Outcome>>map(task -> () -> {
            try {
                return new Outcome(task.get(), null);
            } catch (RuntimeException e) {
                return new Outcome(null, e.getMessage());
            }
        }).toList();
        return gatherBounded(settled, maxInFlight);
    }

    private static RuntimeException unwrap(Throwable t) {
        if (t instanceof CompletionException && t.getCause() != null) t = t.getCause();
        return t instanceof RuntimeException r ? r : new IllegalStateException(t);
    }

    @Override
    public long backoffWithJitterMs(int attempt, long baseMs, long capMs, DoubleSupplier random) {
        long ceiling = Math.min(capMs, baseMs << Math.min(attempt, 30));
        return (long) Math.floor(ceiling * random.getAsDouble());
    }

    @Override
    public String accumulate(List<String> deltas) {
        StringBuilder sb = new StringBuilder();
        for (String d : deltas) if (d != null) sb.append(d);
        return sb.toString();
    }
}
