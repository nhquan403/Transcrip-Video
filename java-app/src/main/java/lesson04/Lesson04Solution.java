package lesson04;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.UnaryOperator;
import java.util.stream.Collectors;

/** Lời giải mẫu bài 04. Hãy tự làm {@link Lesson04} trước khi xem. */
public class Lesson04Solution implements Lesson04Api {

    @Override
    public Subagent pickSubagent(String subtask, List<Subagent> subagents) {
        for (Subagent s : subagents) {
            if (subtask.contains("@" + s.name())) return s;
        }
        Set<String> words = words(subtask);
        Subagent best = null;
        int bestScore = 0;
        for (Subagent s : subagents) {
            Set<String> described = words(s.description());
            int score = (int) words.stream().filter(described::contains).count();
            if (score > bestScore) {
                best = s;
                bestScore = score;
            }
        }
        return best;
    }

    private static Set<String> words(String text) {
        return Arrays.stream(text.toLowerCase().split("\\W+"))
            .filter(w -> w.length() >= 4)
            .collect(Collectors.toSet());
    }

    @Override
    public String callTool(Subagent subagent, String tool, String input, Map<String, UnaryOperator<String>> tools) {
        if (!subagent.allowedTools().contains(tool)) {
            throw new SecurityException(subagent.name() + " is not allowed to use " + tool);
        }
        UnaryOperator<String> fn = tools.get(tool);
        if (fn == null) throw new IllegalArgumentException("Unknown tool " + tool);
        return fn.apply(input);
    }

    @Override
    public String buildHandoff(String subtask, Map<String, String> sharedContext, List<String> neededKeys,
                               String outputFormat) {
        StringBuilder sb = new StringBuilder("Task: ").append(subtask).append("\nContext:\n");
        for (String key : neededKeys) {
            String value = sharedContext.get(key);
            if (value == null) throw new IllegalArgumentException("Missing context: " + key);
            sb.append("- ").append(key).append(": ").append(value).append('\n');
        }
        return sb.append("Output format: ").append(outputFormat).toString();
    }

    @Override
    public String orchestrate(String goal, Function<String, List<String>> decompose, List<Subagent> subagents,
                              Predicate<String> validate, Function<List<String>, String> synthesize) {
        List<String> results = new ArrayList<>();
        for (String subtask : decompose.apply(goal)) {
            Subagent subagent = pickSubagent(subtask, subagents);
            if (subagent == null) throw new IllegalStateException("No subagent for: " + subtask);
            String result = subagent.work().apply(subtask);
            if (!validate.test(result)) {
                throw new IllegalStateException("Invalid result for: " + subtask + " -> " + result);
            }
            results.add(result);
        }
        return synthesize.apply(results);
    }
}
