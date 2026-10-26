package part2.lesson12;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/** Lời giải mẫu Phần 2 · Bài 12. Hãy tự làm trong Lesson12 trước khi đọc file này. */
public class Lesson12Solution implements Lesson12Api {

    @Override
    public Surface choose(Job job) {
        boolean mustBeSync = job.someoneWaiting() || job.needsStreaming() || job.requiresZeroDataRetention();
        return mustBeSync ? Surface.SYNC_MESSAGES : Surface.MESSAGE_BATCHES;
    }

    @Override
    public double batchCost(long inputTokens, long outputTokens, double inputPricePerMTok, double outputPricePerMTok) {
        return 0.5 * (inputTokens * inputPricePerMTok + outputTokens * outputPricePerMTok) / 1_000_000;
    }

    @Override
    public List<Integer> splitIntoBatches(List<Long> requestBytes, int maxRequests, long maxBytes) {
        List<Integer> batches = new ArrayList<>();
        int count = 0;
        long bytes = 0;
        for (long size : requestBytes) {
            if (size > maxBytes) throw new IllegalArgumentException("một request lớn hơn giới hạn của cả batch");
            if (count == maxRequests || bytes + size > maxBytes) {
                batches.add(count);
                count = 0;
                bytes = 0;
            }
            count++;
            bytes += size;
        }
        if (count > 0) batches.add(count);
        return batches;
    }

    @Override
    public BatchState state(Instant createdAt, Instant now, boolean allRequestsDone) {
        Duration age = Duration.between(createdAt, now);
        if (age.compareTo(Duration.ofDays(29)) > 0) return BatchState.RESULTS_GONE;
        if (!allRequestsDone && age.compareTo(Duration.ofHours(24)) < 0) return BatchState.PROCESSING;
        return BatchState.RESULTS_AVAILABLE;
    }
}
