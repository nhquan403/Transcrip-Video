package part2.lesson38;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Lời giải mẫu Phần 2 · Bài 38. Hãy tự làm trong Lesson38 trước khi đọc file này. */
public class Lesson38Solution implements Lesson38Api {

    @Override
    public List<Map<String, Object>> mainAgentMessages(List<Map<String, Object>> history, String task) {
        List<Map<String, Object>> out = new ArrayList<>(history);
        out.add(Lesson38Api.userTurn(task));
        return out;
    }

    @Override
    public Map<String, Object> subagentRequest(List<Map<String, Object>> mainHistory, String agentSystemPrompt, String task) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("system", agentSystemPrompt);
        body.put("messages", List.of(Lesson38Api.userTurn(task)));
        return body;
    }

    @Override
    public AgentDef parseAgent(String markdown) {
        String[] lines = markdown.strip().split("\n", -1);
        if (lines.length == 0 || !lines[0].strip().equals("---")) throw new IllegalArgumentException("thiếu front matter");
        Map<String, String> fm = new LinkedHashMap<>();
        int i = 1;
        for (; i < lines.length && !lines[i].strip().equals("---"); i++) {
            int colon = lines[i].indexOf(':');
            if (colon > 0) fm.put(lines[i].substring(0, colon).trim(), lines[i].substring(colon + 1).trim());
        }
        if (i >= lines.length) throw new IllegalArgumentException("front matter chưa đóng");
        String body = String.join("\n", Arrays.copyOfRange(lines, i + 1, lines.length)).trim();
        String name = fm.get("name"), description = fm.get("description");
        if (name == null || name.isEmpty() || description == null || description.isEmpty())
            throw new IllegalArgumentException("name và description là bắt buộc");
        List<String> tools = fm.containsKey("tools")
            ? Arrays.stream(fm.get("tools").split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList() : null;
        String memory = fm.get("memory");
        return new AgentDef(name, description, tools, fm.get("model"), memory != null && !memory.isEmpty(), body);
    }

    @Override
    public List<String> effectiveTools(AgentDef def, List<String> mainTools) {
        return def.tools() != null ? def.tools() : mainTools;
    }

    @Override
    public Control controlOf(String input) {
        List<String> tokens = Arrays.asList(input.trim().split("\\s+"));
        if (input.trim().startsWith("claude ") && tokens.contains("--agent")) return Control.WHOLE_SESSION;
        if (tokens.stream().anyMatch(t -> t.startsWith("@") && t.length() > 1)) return Control.ONE_TASK;
        return Control.SUGGEST;
    }

    @Override
    public Author authorOf(String mechanism) {
        return switch (mechanism) {
            case "CLAUDE.md" -> Author.DEVELOPER;
            case "auto-memory", "subagent memory" -> Author.AGENT;
            default -> throw new IllegalArgumentException("cơ chế lạ: " + mechanism);
        };
    }

    @Override
    public String enabledBy(String mechanism) {
        return switch (mechanism) {
            case "CLAUDE.md" -> "you write the file";
            case "auto-memory" -> "on by default";
            case "subagent memory" -> "front matter field";
            default -> throw new IllegalArgumentException("cơ chế lạ: " + mechanism);
        };
    }

    @Override
    public String chooseMechanism(boolean everyTurn, boolean needsIsolation, boolean mustBlock) {
        if (mustBlock) return "permissions or hooks";
        if (needsIsolation) return "subagent";
        return everyTurn ? "rule" : "skill";
    }
}
