package part2.lesson35;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

/** Lời giải mẫu Phần 2 · Bài 35. Hãy tự làm trong Lesson35 trước khi đọc file này. */
public class Lesson35Solution implements Lesson35Api {

    @Override
    public boolean satisfies(String range, String version) {
        String r = range.trim();
        int[] v = Lesson35Api.parse(version);
        if (r.startsWith(">=")) return Lesson35Api.compare(version, r.substring(2)) >= 0;
        if (r.startsWith("~")) {
            int[] b = Lesson35Api.parse(r.substring(1));
            return v[0] == b[0] && v[1] == b[1] && v[2] >= b[2];
        }
        if (r.startsWith("^")) {
            String base = r.substring(1);
            return v[0] == Lesson35Api.parse(base)[0] && Lesson35Api.compare(version, base) >= 0;
        }
        return Lesson35Api.compare(version, r) == 0;
    }

    @Override
    public String resolve(List<String> ranges, List<String> tags) {
        return tags.stream()
            .filter(t -> ranges.stream().allMatch(r -> satisfies(r, t)))
            .max(Lesson35Api::compare)
            .orElseThrow(() -> new IllegalStateException("range-conflict"));
    }

    @Override
    public Set<String> enableCascade(String plugin, Map<String, List<String>> deps) {
        return reachable(Set.of(plugin), deps);
    }

    @Override
    public List<String> disableOrder(String target, Set<String> enabled, Map<String, List<String>> deps) {
        List<String> order = new ArrayList<>(new TreeSet<>(enabled.stream()
            .filter(p -> !p.equals(target) && deps.getOrDefault(p, List.of()).contains(target))
            .toList()));
        order.add(target);
        return order;
    }

    @Override
    public Set<String> prune(Set<String> installed, Set<String> direct, Map<String, List<String>> deps) {
        Set<String> keep = reachable(direct, deps);
        Set<String> orphans = new TreeSet<>();
        for (String p : installed) if (!keep.contains(p)) orphans.add(p);
        return orphans;
    }

    private static Set<String> reachable(Set<String> roots, Map<String, List<String>> deps) {
        Set<String> seen = new LinkedHashSet<>();
        Deque<String> todo = new ArrayDeque<>(roots);
        while (!todo.isEmpty()) {
            String p = todo.pop();
            if (seen.add(p)) todo.addAll(deps.getOrDefault(p, List.of()));
        }
        return seen;
    }
}
