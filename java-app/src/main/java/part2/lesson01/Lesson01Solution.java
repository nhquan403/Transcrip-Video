package part2.lesson01;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

/** Lời giải mẫu Phần 2 · Bài 01. Hãy tự làm trong Lesson01 trước khi đọc file này. */
public class Lesson01Solution implements Lesson01Api {

    private static final Pattern INFRASTRUCTURE = Pattern.compile(
        "\\b(fast|faster|slow|slower|quick|quicker|latency|seconds?|ms|milliseconds?|respond within|"
            + "throughput|requests? per (second|minute|hour)|rpm|concurrent|peak|capacity|scale|rate limits?|"
            + "cost|costs|cheap|cheaper|budget|price|bill|spend|"
            + "region|regions|residency|data center|eu|on-prem)\\b|\\$\\d",
        Pattern.CASE_INSENSITIVE);

    @Override
    public List<String> weakChecks(AgentChecks checks) {
        List<String> weak = new ArrayList<>();
        if (!checks.complexity()) weak.add("complexity");
        if (!checks.value()) weak.add("value");
        if (!checks.viability()) weak.add("viability");
        if (!checks.errorRecoverable()) weak.add("cost of error");
        return weak;
    }

    @Override
    public Tier chooseTier(boolean multiStep, boolean pathKnownAtDesignTime, AgentChecks checks) {
        if (!multiStep) return Tier.SINGLE_CALL;
        if (pathKnownAtDesignTime) return Tier.WORKFLOW;
        return weakChecks(checks).isEmpty() ? Tier.AGENT : Tier.WORKFLOW;
    }

    @Override
    public List<String> untraced(List<Requirement> requirements, Set<String> needIds) {
        return requirements.stream()
            .filter(r -> r.needId() == null || r.needId().isBlank() || !needIds.contains(r.needId()))
            .map(Requirement::id)
            .toList();
    }

    @Override
    public boolean isInfrastructureInDisguise(String requirement) {
        return INFRASTRUCTURE.matcher(requirement).find();
    }
}
