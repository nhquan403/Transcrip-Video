package part2.lesson30;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/** Lời giải mẫu Phần 2 · Bài 30. Hãy tự làm trong Lesson30 trước khi đọc file này. */
public class Lesson30Solution implements Lesson30Api {

    @Override
    public Store storeFor(boolean writtenByDeveloper, boolean survivesSession) {
        if (writtenByDeveloper) return Store.CLAUDE_MD;
        return survivesSession ? Store.AGENT_MEMORY : Store.CONTEXT_WINDOW;
    }

    @Override
    public Mechanism mechanismFor(boolean mustBeBlocked) {
        return mustBeBlocked ? Mechanism.PRE_TOOL_USE_HOOK : Mechanism.CLAUDE_MD_RULE;
    }

    @Override
    public long tokensSpent(List<String> lines, int sessions) {
        long chars = lines.stream().mapToLong(String::length).sum();
        return (long) Math.ceil(chars / 4.0) * sessions;
    }

    @Override
    public List<String> lint(List<String> lines) {
        List<String> warnings = new ArrayList<>();
        if (lines.size() > 200) warnings.add("file: " + lines.size() + " lines, keep it under 200");
        for (int i = 0; i < lines.size(); i++) {
            String line = lines.get(i);
            if (line.length() > 160) warnings.add("line " + (i + 1) + ": verbose prose, rewrite as a short directive");
            String t = line.trim();
            if ((t.startsWith("Run ") || t.startsWith("run ")) && !t.contains("`")) {
                warnings.add("line " + (i + 1) + ": put the command in verbatim");
            }
        }
        return warnings;
    }

    @Override
    public List<String> buildClaudeMd(Map<String, String> structure, List<String> conventions, Map<String, String> commands) {
        List<String> out = new ArrayList<>();
        if (!structure.isEmpty()) {
            out.add("# Structure");
            structure.forEach((dir, what) -> out.add("- `" + dir + "`: " + what));
        }
        if (!conventions.isEmpty()) {
            out.add("# Conventions");
            conventions.forEach(c -> out.add("- " + c));
        }
        if (!commands.isEmpty()) {
            out.add("# Commands");
            commands.forEach((name, cmd) -> out.add("- " + name + ": `" + cmd + "`"));
        }
        return out;
    }
}
