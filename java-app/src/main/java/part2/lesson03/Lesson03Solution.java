package part2.lesson03;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Lời giải mẫu Phần 2 · Bài 03. Hãy tự làm trong Lesson03 trước khi đọc file này. */
public class Lesson03Solution implements Lesson03Api {

    @Override
    public long modelBudgetMs(long userToleranceMs, List<Long> overheadsMs) {
        long left = userToleranceMs - overheadsMs.stream().mapToLong(Long::longValue).sum();
        return Math.max(0, left);
    }

    @Override
    public int maxSequentialCalls(long budgetMs, long msPerCall) {
        return (int) (budgetMs / msPerCall);
    }

    @Override
    public DeliveryMode chooseMode(boolean someoneWaiting, long budgetMs, long fullResponseMs) {
        if (!someoneWaiting) return DeliveryMode.BATCH;
        return fullResponseMs <= budgetMs ? DeliveryMode.SYNC : DeliveryMode.STREAMING;
    }

    @Override
    public int maxConcurrency(int requestsPerMinute, double avgCallSeconds) {
        return Math.max(1, (int) Math.floor(requestsPerMinute * avgCallSeconds / 60));
    }

    @Override
    public int minutesToDrain(int incoming, int capacityPerMinute) {
        return (incoming + capacityPerMinute - 1) / capacityPerMinute;
    }

    @Override
    public Deployment chooseDeployment(boolean residencyIsHard, List<String> allowedRegions, List<String> firstPartyRegions) {
        boolean firstPartyAllowed = allowedRegions.containsAll(firstPartyRegions);
        return residencyIsHard && !firstPartyAllowed ? Deployment.CLOUD_PLATFORM_REGION : Deployment.FIRST_PARTY_API;
    }

    @Override
    public double[] prefixCost(long prefixTokens, int calls) {
        if (calls == 0) return new double[] {0, 0};
        double plain = (double) prefixTokens * calls;
        double cached = prefixTokens * 1.25 + prefixTokens * 0.1 * (calls - 1);
        return new double[] {plain, cached};
    }

    @Override
    public Map<String, String> matchBatch(List<String> sentIds, List<BatchResult> results) {
        Map<String, String> byId = new HashMap<>();
        for (BatchResult r : results) byId.put(r.customId(), r.output());
        Map<String, String> ordered = new LinkedHashMap<>();
        for (String id : sentIds) {
            if (!byId.containsKey(id)) throw new IllegalStateException("thiếu kết quả cho " + id);
            ordered.put(id, byId.get(id));
        }
        return ordered;
    }
}
