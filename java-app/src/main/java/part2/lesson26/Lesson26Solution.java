package part2.lesson26;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/** Lời giải mẫu Phần 2 · Bài 26. Hãy tự làm trong Lesson26 trước khi đọc file này. */
public class Lesson26Solution implements Lesson26Api {

    @Override
    public long totalInputTokens(int systemTokens, int toolDefinitionTokens, List<Integer> messageTokens) {
        long total = 0;
        long history = 0;
        for (int tokens : messageTokens) {
            history += tokens;
            total += systemTokens + toolDefinitionTokens + history;
        }
        return total;
    }

    @Override
    public List<Turn> pruneStaleToolResults(List<Turn> window, int keepLast, int minTokens) {
        List<Turn> out = new ArrayList<>(window.size());
        int protectedFrom = window.size() - keepLast;
        for (int i = 0; i < window.size(); i++) {
            Turn t = window.get(i);
            boolean stale = i < protectedFrom && "tool_result".equals(t.kind()) && t.tokens() >= minTokens;
            out.add(stale ? new Turn("tool_result", "[pruned]", 0) : t);
        }
        return out;
    }

    @Override
    public StateKind kindOf(String where) {
        return switch (where) {
            case "live_window", "tool_output", "chat_message" -> StateKind.EPHEMERAL;
            case "file_on_disk", "config", "claude_md", "auto_memory" -> StateKind.DURABLE;
            default -> throw new IllegalArgumentException("nơi lạ: " + where);
        };
    }

    @Override
    public List<Map<String, Object>> nextRequestMessages(List<Map<String, Object>> history, String userText) {
        List<Map<String, Object>> out = new ArrayList<>(history);
        out.add(Lesson26Api.turn("user", userText));
        return out;
    }

    @Override
    public List<Map<String, Object>> startNewSession(List<Map<String, Object>> oldHistory, String carrySummary) {
        if (carrySummary == null || carrySummary.isBlank()) return new ArrayList<>();
        List<Map<String, Object>> out = new ArrayList<>();
        out.add(Lesson26Api.turn("user", "Summary of the previous session: " + carrySummary));
        return out;
    }
}
