package lesson05;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.TreeMap;

/** Lời giải mẫu bài 05. Hãy tự làm {@link Lesson05} trước khi xem. */
public class Lesson05Solution implements Lesson05Api {

    @Override
    public List<String> subagentContext(ManagerState manager, SubagentDef subagent, String claudeMd, DelegatedTask task) {
        List<String> lines = new ArrayList<>();
        lines.add(subagent.systemPrompt());
        lines.add(claudeMd);
        lines.add("Tools: " + String.join(", ", task.tools().stream().sorted().toList()));
        lines.add(task.instructions());
        new TreeMap<>(task.data()).forEach((key, value) -> lines.add(key + ": " + value));
        lines.add("Output: " + task.outputShape());
        return lines;
    }

    @Override
    public List<String> missingParts(DelegatedTask task) {
        List<String> missing = new ArrayList<>();
        if (task.instructions().isBlank()) missing.add("instructions");
        if (task.data().isEmpty()) missing.add("data");
        if (task.outputShape().isBlank()) missing.add("output shape");
        if (task.tools().isEmpty()) missing.add("scoped tools");
        return missing;
    }

    @Override
    public List<String> assumedFacts(DelegatedTask task, Set<String> neededFacts) {
        return neededFacts.stream().filter(fact -> !task.data().containsKey(fact)).sorted().toList();
    }

    @Override
    public long managerContextTokens(List<SubagentRun> runs, boolean isolated) {
        return runs.stream().mapToLong(r -> isolated ? r.summaryTokens() : r.transcriptTokens()).sum();
    }

    @Override
    public List<String> excessTools(Set<String> granted, Set<String> needed) {
        return granted.stream().filter(tool -> !needed.contains(tool)).sorted().toList();
    }
}
