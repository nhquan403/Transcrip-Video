package part2.lesson11;

import java.util.ArrayList;
import java.util.List;

/** Lời giải mẫu Phần 2 · Bài 11. Hãy tự làm trong Lesson11 trước khi đọc file này. */
public class Lesson11Solution implements Lesson11Api {

    @Override
    public List<String> render(List<String> tools, List<String> system, List<String> messages) {
        List<String> out = new ArrayList<>(tools);
        out.addAll(system);
        out.addAll(messages);
        return out;
    }

    @Override
    public int cachedPrefixLength(List<String> previous, List<String> current) {
        int n = 0;
        while (n < previous.size() && n < current.size() && previous.get(n).equals(current.get(n))) n++;
        return n;
    }

    @Override
    public List<String> checkBreakpoints(List<Segment> segments) {
        List<String> errors = new ArrayList<>();
        long count = segments.stream().filter(Segment::breakpoint).count();
        if (count > 4) errors.add("too many breakpoints: " + count);
        int last = -1;
        for (int i = 0; i < segments.size(); i++) if (segments.get(i).breakpoint()) last = i;
        for (int i = 0; i <= last; i++) {
            if (segments.get(i).volatileContent()) errors.add("volatile segment " + i + " is inside the cached prefix");
        }
        return errors;
    }

    @Override
    public double cachedCost(long prefixTokens, int calls, String ttl) {
        double write = switch (ttl) {
            case "5m" -> 1.25;
            case "1h" -> 2.0;
            default -> throw new IllegalArgumentException("ttl chỉ là 5m hoặc 1h: " + ttl);
        };
        if (calls == 0) return 0;
        return prefixTokens * write + prefixTokens * 0.1 * (calls - 1);
    }

    @Override
    public boolean worthCaching(String model, long prefixTokens, int calls, String ttl) {
        long minimum = switch (model) {
            case "claude-opus-4-8" -> 1024;
            case "claude-opus-4-7" -> 2048;
            default -> throw new IllegalArgumentException("chưa biết mức tối thiểu của " + model);
        };
        return prefixTokens >= minimum && cachedCost(prefixTokens, calls, ttl) < (double) prefixTokens * calls;
    }
}
