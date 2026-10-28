package part2.lesson22;

import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Lời giải mẫu Phần 2 · Bài 22. Hãy tự làm trong Lesson22 trước khi đọc file này. */
public class Lesson22Solution implements Lesson22Api {

    private static final Pattern PLACEHOLDER = Pattern.compile("\\{\\{(\\w+)}}");

    @Override
    public List<String> duplicatedLines(Map<String, String> promptsByCallSite, int minLength) {
        Map<String, Set<String>> sites = new HashMap<>();
        promptsByCallSite.forEach((site, prompt) -> prompt.lines().map(String::trim)
            .filter(line -> line.length() >= minLength)
            .forEach(line -> sites.computeIfAbsent(line, l -> new HashSet<>()).add(site)));
        return sites.entrySet().stream().filter(e -> e.getValue().size() >= 2).map(Map.Entry::getKey).sorted().toList();
    }

    @Override
    public Map<String, String> extractFragment(Map<String, String> promptsByCallSite, String fragmentText, String name) {
        Map<String, String> out = new LinkedHashMap<>();
        promptsByCallSite.forEach((site, prompt) -> out.put(site, prompt.replace(fragmentText, "{{" + name + "}}")));
        return out;
    }

    @Override
    public String render(String template, Map<String, String> fragments) {
        Matcher m = PLACEHOLDER.matcher(template);
        return m.replaceAll(match -> {
            String value = fragments.get(match.group(1));
            if (value == null) throw new IllegalArgumentException("thiếu fragment: " + match.group(1));
            return Matcher.quoteReplacement(value);
        });
    }

    @Override
    public int filesHardcoding(Map<String, String> sourceFiles, String modelId) {
        return (int) sourceFiles.values().stream().filter(src -> src.contains(modelId)).count();
    }

    @Override
    public List<String> behaviorChanges(Function<String, String> before, Function<String, String> after, List<String> inputs) {
        return inputs.stream().filter(in -> !Objects.equals(before.apply(in), after.apply(in))).toList();
    }
}
