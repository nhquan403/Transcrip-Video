package part2.lesson04;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.function.LongConsumer;
import java.util.function.Supplier;

/** Lời giải mẫu Phần 2 · Bài 04. Hãy tự làm trong Lesson04 trước khi đọc file này. */
public class Lesson04Solution implements Lesson04Api {

    private static final Set<Integer> TRANSIENT = Set.of(0, 408, 429, 500, 502, 503, 504, 529);

    @Override
    public ErrorKind classify(int status) {
        return TRANSIENT.contains(status) ? ErrorKind.TRANSIENT : ErrorKind.PERMANENT;
    }

    @Override
    public <T> T retryWithBackoff(Supplier<T> call, int maxAttempts, long baseDelayMs, LongConsumer sleeper) {
        for (int attempt = 0; ; attempt++) {
            try {
                return call.get();
            } catch (ApiError e) {
                if (classify(e.status()) == ErrorKind.PERMANENT || attempt + 1 >= maxAttempts) throw e;
                sleeper.accept(baseDelayMs << attempt);
            }
        }
    }

    @Override
    public <T> T withFailover(Supplier<T> primary, Supplier<T> fallback, Optional<T> degraded) {
        try {
            return primary.get();
        } catch (ApiError primaryError) {
            try {
                return fallback.get();
            } catch (ApiError fallbackError) {
                return degraded.orElseThrow(() -> fallbackError);
            }
        }
    }

    @Override
    public List<String> unmetConstraints(Requirements req, Design design) {
        List<String> unmet = new ArrayList<>();
        if (design.sequentialCalls() * design.msPerCall() > req.latencyBudgetMs()) unmet.add("latency");
        if (req.peakRequestsPerMinute() > design.rateLimitPerMinute()) unmet.add("throughput");
        if (!req.allowedRegions().contains(design.region())) unmet.add("residency");
        if (req.availabilityTarget() != null && !design.hasFailover()) unmet.add("availability");
        return unmet;
    }
}
