package part2.lesson21;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;

/** Lời giải mẫu Phần 2 · Bài 21. Hãy tự làm trong Lesson21 trước khi đọc file này. */
public class Lesson21Solution implements Lesson21Api {

    @Override
    public List<Integer> wrongRetries(Set<Integer> retried) {
        return retried.stream().filter(s -> s >= 400 && s < 500 && s != 408 && s != 429).sorted().toList();
    }

    @Override
    public Validated generateValidated(Function<String, String> model, String prompt, Function<String, Optional<String>> validator,
                                       int maxAttempts) {
        String current = prompt;
        String lastError = null;
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            String output = model.apply(current);
            Optional<String> error = validator.apply(output);
            if (error.isEmpty()) return new Validated(output, attempt);
            lastError = error.get();
            current = prompt + "\n\nYour previous answer was rejected: " + lastError + "\nReturn a corrected answer.";
        }
        throw new IllegalStateException("vẫn không đạt sau " + maxAttempts + " lần: " + lastError);
    }

    @Override
    public int requireInt(Map<String, Object> output, String field) {
        Object value = output.get(field);
        if (value == null) throw new IllegalArgumentException("missing field: " + field);
        if (value instanceof Number n && n.doubleValue() == Math.rint(n.doubleValue())) return n.intValue();
        if (value instanceof String s && s.strip().matches("\\d+")) return Integer.parseInt(s.strip());
        throw new IllegalArgumentException("field " + field + " is not an integer: " + value);
    }

    @Override
    public boolean tooBigToReview(int filesChanged, int linesChanged, boolean mixesRefactorAndFeature) {
        return filesChanged > 10 || linesChanged > 400 || mixesRefactorAndFeature;
    }
}
