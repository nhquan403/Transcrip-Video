package part2.lesson34;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;

/** Lời giải mẫu Phần 2 · Bài 34. Hãy tự làm trong Lesson34 trước khi đọc file này. */
public class Lesson34Solution implements Lesson34Api {

    @Override
    public List<String> missingFromUnit(Set<String> versioned) {
        List<String> missing = new ArrayList<>();
        for (String part : List.of("prompt", "model_id", "config")) {
            if (!versioned.contains(part)) missing.add(part);
        }
        return missing;
    }

    @Override
    public String pluginVersion(String versionField, String commitSha) {
        if (versionField == null || versionField.isBlank()) return commitSha;
        if (!versionField.matches("\\d+\\.\\d+\\.\\d+")) throw new IllegalArgumentException("không phải semver: " + versionField);
        return versionField;
    }

    @Override
    public Map<String, String> requestHeaders(String apiKey, String apiVersion) {
        if (apiVersion == null || apiVersion.isBlank()) throw new IllegalArgumentException("anthropic-version là bắt buộc");
        Map<String, String> headers = new LinkedHashMap<>();
        headers.put("x-api-key", apiKey);
        headers.put("anthropic-version", apiVersion);
        headers.put("content-type", "application/json");
        return headers;
    }

    @Override
    public Map<String, Boolean> runEvalSet(List<EvalCase> cases, Function<String, String> model) {
        Map<String, Boolean> results = new LinkedHashMap<>();
        for (EvalCase c : cases) {
            results.put(c.id(), normalize(model.apply(c.input())).equalsIgnoreCase(c.expected()));
        }
        return results;
    }

    private static String normalize(String output) {
        return output == null ? "" : output.trim().replaceAll("\\.+$", "");
    }

    @Override
    public String promotionDecision(Map<String, Boolean> production, Map<String, Boolean> candidate, Set<String> important) {
        long prodPassed = production.values().stream().filter(Boolean::booleanValue).count();
        long candPassed = candidate.values().stream().filter(Boolean::booleanValue).count();
        boolean importantRegression = important.stream()
            .anyMatch(id -> production.getOrDefault(id, false) && !candidate.getOrDefault(id, false));
        return candPassed >= prodPassed && !importantRegression ? "promote" : "stay in staging";
    }
}
