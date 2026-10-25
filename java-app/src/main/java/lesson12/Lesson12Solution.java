package lesson12;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.function.UnaryOperator;
import lesson09.Lesson09Api.ToolUse;

/** Lời giải mẫu bài 12. Hãy tự làm {@link Lesson12} trước khi xem. */
public class Lesson12Solution implements Lesson12Api {

    @Override
    public List<List<ToolUse>> planBatches(List<ToolUse> calls, Set<String> readOnlyTools) {
        List<List<ToolUse>> batches = new ArrayList<>();
        List<ToolUse> reads = new ArrayList<>();
        for (ToolUse call : calls) {
            if (readOnlyTools.contains(call.name())) {
                reads.add(call);
                continue;
            }
            if (!reads.isEmpty()) {
                batches.add(reads);
                reads = new ArrayList<>();
            }
            batches.add(List.of(call));
        }
        if (!reads.isEmpty()) batches.add(reads);
        return batches;
    }

    @Override
    public Map<String, String> executeBatches(List<List<ToolUse>> batches, Map<String, UnaryOperator<String>> tools) {
        Map<String, String> results = new LinkedHashMap<>();
        for (List<ToolUse> batch : batches) {
            if (batch.size() == 1) {
                ToolUse call = batch.get(0);
                results.put(call.id(), tools.get(call.name()).apply(call.input()));
                continue;
            }
            try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
                List<Future<String>> futures = new ArrayList<>();
                for (ToolUse call : batch) futures.add(executor.submit(() -> tools.get(call.name()).apply(call.input())));
                for (int i = 0; i < batch.size(); i++) results.put(batch.get(i).id(), futures.get(i).get());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new IllegalStateException(e);
            } catch (ExecutionException e) {
                throw new IllegalStateException(e.getCause());
            }
        }
        return results;
    }

    @Override
    public long wallClockMs(List<List<Long>> batchDurationsMs) {
        return batchDurationsMs.stream()
            .mapToLong(batch -> batch.stream().mapToLong(Long::longValue).max().orElse(0))
            .sum();
    }

    @Override
    public String carryAcross(String previousResult, String nextTask) {
        return nextTask + "\n\nKết quả từ worker trước:\n" + previousResult;
    }
}
