package part2.lesson37;

import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.PathMatcher;
import java.util.ArrayList;
import java.util.List;

/** Lời giải mẫu Phần 2 · Bài 37. Hãy tự làm trong Lesson37 trước khi đọc file này. */
public class Lesson37Solution implements Lesson37Api {

    @Override
    public int contextTokens(Item item, boolean invoked) {
        return switch (item.kind()) {
            case "rule" -> item.bodyTokens();
            case "skill" -> item.descriptionTokens() + (invoked ? item.bodyTokens() : 0);
            default -> throw new IllegalArgumentException("loại lạ: " + item.kind());
        };
    }

    @Override
    public boolean ruleLoaded(String pathsGlob, List<String> touchedFiles) {
        if (pathsGlob == null) return true;
        PathMatcher m = FileSystems.getDefault().getPathMatcher("glob:" + pathsGlob);
        return touchedFiles.stream().anyMatch(f -> m.matches(Path.of(f)));
    }

    @Override
    public String resolveSlash(String typed, List<String> files) {
        String name = typed.startsWith("/") ? typed.substring(1) : typed;
        if (BUILT_INS.contains(name)) return "builtin";
        String skill = ".claude/skills/" + name + "/SKILL.md";
        String command = ".claude/commands/" + name + ".md";
        for (String f : files) if (f.endsWith(skill)) return f;
        for (String f : files) if (f.endsWith(command)) return f;
        return null;
    }

    @Override
    public String effectiveDescription(String frontMatterDescription, String firstParagraph) {
        if (frontMatterDescription != null && !frontMatterDescription.isBlank()) return frontMatterDescription.trim();
        return firstParagraph == null ? "" : firstParagraph.trim();
    }

    @Override
    public List<String> skillWarnings(String path, String frontMatterDescription) {
        List<String> out = new ArrayList<>();
        if (!path.contains(".claude/skills/") && !path.contains(".claude/commands/")) out.add("NOT_SCANNED");
        if (frontMatterDescription == null || frontMatterDescription.isBlank()) out.add("NO_DESCRIPTION");
        return out;
    }

    @Override
    public Scope scopeOf(String path) {
        if (path.startsWith(".claude/")) return Scope.TEAM;
        if (path.startsWith("~/.claude/")) return Scope.PERSONAL;
        return Scope.NONE;
    }
}
