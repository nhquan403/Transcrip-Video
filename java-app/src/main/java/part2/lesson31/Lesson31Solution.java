package part2.lesson31;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/** Lời giải mẫu Phần 2 · Bài 31. Hãy tự làm trong Lesson31 trước khi đọc file này. */
public class Lesson31Solution implements Lesson31Api {

    @Override
    public Scope scopeOf(String path) {
        if (path.startsWith("/etc/claude-code/")) return Scope.MANAGED;
        if (path.startsWith("~/.claude/")) return Scope.USER;
        if (path.endsWith("/CLAUDE.local.md") || path.equals("CLAUDE.local.md")) return Scope.LOCAL;
        if (path.endsWith("/CLAUDE.md") || path.equals("CLAUDE.md")) return Scope.PROJECT;
        throw new IllegalArgumentException("không phải file CLAUDE.md: " + path);
    }

    @Override
    public List<String> launchOrder(String cwd, Set<String> files, Set<String> excludes) {
        List<String> order = new ArrayList<>();
        if (files.contains(MANAGED_FILE)) order.add(MANAGED_FILE);
        if (files.contains(USER_FILE) && !excludes.contains(USER_FILE)) order.add(USER_FILE);
        for (String dir : chain("/", cwd)) {
            for (String f : inDir(dir, files)) if (!excludes.contains(f)) order.add(f);
        }
        return order;
    }

    @Override
    public List<String> loadedOnRead(String cwd, String readPath, Set<String> files) {
        String readDir = parent(readPath);
        if (!isUnder(readDir, cwd) || readDir.equals(cwd)) return List.of();
        List<String> dirs = chain(cwd, readDir);
        List<String> out = new ArrayList<>();
        for (String dir : dirs.subList(1, dirs.size())) out.addAll(inDir(dir, files));
        return out;
    }

    @Override
    public List<String> importedFiles(String root, Map<String, List<String>> imports) {
        Set<String> seen = new LinkedHashSet<>();
        walk(root, 0, imports, seen, root);
        return List.copyOf(seen);
    }

    private void walk(String file, int hop, Map<String, List<String>> imports, Set<String> seen, String root) {
        if (hop == 4) return;
        for (String ref : imports.getOrDefault(file, List.of())) {
            String target = ref.startsWith("/") ? Path.of(ref).normalize().toString()
                : Path.of(parent(file)).resolve(ref).normalize().toString();
            if (target.equals(root) || !seen.add(target)) continue;
            walk(target, hop + 1, imports, seen, root);
        }
    }

    @Override
    public String placeRule(String need) {
        return switch (need) {
            case "company-wide, no exceptions" -> "managed policy";
            case "personal default for every repo" -> "user CLAUDE.md";
            case "team convention for this repo" -> "project CLAUDE.md";
            case "only matters inside one folder" -> "subdirectory CLAUDE.md";
            case "private note for this repo" -> "CLAUDE.local.md";
            default -> throw new IllegalArgumentException("nhu cầu lạ: " + need);
        };
    }

    /** Các thư mục từ `top` đi xuống `bottom` (cả hai đầu), giả định bottom nằm trong top. */
    private static List<String> chain(String top, String bottom) {
        List<String> dirs = new ArrayList<>();
        for (String d = bottom; ; d = parent(d)) {
            dirs.add(0, d);
            if (d.equals(top) || d.equals("/")) break;
        }
        return dirs;
    }

    private static List<String> inDir(String dir, Set<String> files) {
        String base = dir.equals("/") ? "/" : dir + "/";
        List<String> out = new ArrayList<>();
        for (String name : List.of("CLAUDE.md", "CLAUDE.local.md")) if (files.contains(base + name)) out.add(base + name);
        return out;
    }

    private static String parent(String path) {
        int i = path.lastIndexOf('/');
        return i <= 0 ? "/" : path.substring(0, i);
    }

    private static boolean isUnder(String dir, String ancestor) {
        return dir.equals(ancestor) || dir.startsWith(ancestor.equals("/") ? "/" : ancestor + "/");
    }
}
