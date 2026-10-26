package part2.lesson06;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

/** Lời giải mẫu Phần 2 · Bài 06. Hãy tự làm trong Lesson06 trước khi đọc file này. */
public class Lesson06Solution implements Lesson06Api {

    @Override
    public Health health(List<CallLog> logs) {
        if (logs.isEmpty()) throw new IllegalArgumentException("chưa có log nào");
        List<Long> sorted = logs.stream().map(CallLog::latencyMs).sorted().toList();
        long p95 = sorted.get((int) Math.ceil(0.95 * sorted.size()) - 1);
        long tokens = logs.stream().mapToLong(l -> l.inputTokens() + l.outputTokens()).sum();
        long bad = logs.stream().filter(l -> l.status() != 200 || "refusal".equals(l.stopReason())).count();
        return new Health(p95, tokens, (double) bad / logs.size());
    }

    @Override
    public Fix readSignature(int status, String stopReason) {
        if (status == 429 || status >= 500) return Fix.RETRY_WITH_BACKOFF;
        if (status != 200) return Fix.FIX_REQUEST;
        if ("refusal".equals(stopReason)) return Fix.REVIEW_PROMPT_OR_POLICY;
        if ("max_tokens".equals(stopReason)) return Fix.RAISE_LIMIT_OR_ASK_SHORTER;
        return Fix.OK;
    }

    @Override
    public List<String> regressions(Map<String, Boolean> oldPass, Map<String, Boolean> newPass) {
        return oldPass.entrySet().stream()
            .filter(e -> e.getValue() && !newPass.getOrDefault(e.getKey(), false))
            .map(Map.Entry::getKey)
            .sorted()
            .toList();
    }

    @Override
    public boolean safeToCutOver(Map<String, Boolean> oldPass, Map<String, Boolean> newPass) {
        return regressions(oldPass, newPass).isEmpty() && passRate(newPass) >= passRate(oldPass);
    }

    private static double passRate(Map<String, Boolean> results) {
        return results.isEmpty() ? 0 : (double) results.values().stream().filter(b -> b).count() / results.size();
    }

    @Override
    public PromptVersion promptFor(List<PromptVersion> registry, String name, String model) {
        return registry.stream()
            .filter(p -> p.name().equals(name) && p.model().equals(model))
            .max(Comparator.comparingInt(PromptVersion::version))
            .orElseThrow(() -> new IllegalStateException("chưa có prompt '" + name + "' nào tinh chỉnh cho " + model));
    }
}
