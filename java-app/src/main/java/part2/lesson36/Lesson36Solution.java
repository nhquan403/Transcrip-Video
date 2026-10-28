package part2.lesson36;

import java.util.List;
import java.util.Map;

/** Lời giải mẫu Phần 2 · Bài 36. Hãy tự làm trong Lesson36 trước khi đọc file này. */
public class Lesson36Solution implements Lesson36Api {

    @Override
    public String resolveFromTags(String plugin, String range, List<String> tags) {
        String prefix = plugin + "--v";
        return tags.stream()
            .filter(t -> t.startsWith(prefix))
            .map(t -> t.substring(prefix.length()))
            .filter(v -> v.matches("\\d+\\.\\d+\\.\\d+"))
            .filter(v -> Lesson36Api.satisfies(range, v))
            .max(Lesson36Api::compare)
            .orElse(null);
    }

    @Override
    public boolean shouldCommit(String path) {
        return switch (path) {
            case ".claude-plugin/plugin.json", ".claude-plugin/marketplace.json", ".claude/settings.json" -> true;
            case ".claude/settings.local.json", "~/.claude/settings.json" -> false;
            default -> throw new IllegalArgumentException("file lạ: " + path);
        };
    }

    @Override
    public String diagnose(DepState s) {
        if (!s.installed() || !s.enabled()) return "dependency-unsatisfied";
        if (!Lesson36Api.satisfies(s.range(), s.version())) return "dependency-version-unsatisfied";
        return null;
    }

    @Override
    public String fixFor(String errorCode) {
        return switch (errorCode) {
            case "dependency-unsatisfied" -> "install or enable it";
            case "dependency-version-unsatisfied" -> "adjust the range or bump the release";
            case "no-matching-tag" -> "author pushes a tag";
            case "range-conflict" -> "reconcile the ranges";
            case "cross-marketplace" -> "add to allow list";
            default -> throw new IllegalArgumentException("mã lỗi lạ: " + errorCode);
        };
    }

    @Override
    public boolean crossMarketplaceAllowed(String rootMarketplace, String depMarketplace, Map<String, List<String>> allowLists) {
        if (rootMarketplace.equals(depMarketplace)) return true;
        return allowLists.getOrDefault(rootMarketplace, List.of()).contains(depMarketplace);
    }
}
