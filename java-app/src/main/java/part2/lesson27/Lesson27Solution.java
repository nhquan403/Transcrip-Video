package part2.lesson27;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Lời giải mẫu Phần 2 · Bài 27. Hãy tự làm trong Lesson27 trước khi đọc file này. */
public class Lesson27Solution implements Lesson27Api {

    static final int DEFAULT_CLEANUP_PERIOD_DAYS = 30;

    @Override
    public Move chooseMove(Situation s) {
        if (s.drifted() || s.runawayBloat() || s.unrelatedTaskSwitch()) return Move.START_FRESH;
        return s.wantToKeepThread() ? Move.COMPACT : Move.CLEAR;
    }

    @Override
    public boolean survivesCompaction(String item) {
        return switch (item) {
            case "root_claude_md", "recent_turns", "key_decisions" -> true;
            case "early_prompt_detail", "nested_claude_md", "chat_only_note" -> false;
            default -> throw new IllegalArgumentException("mục lạ: " + item);
        };
    }

    @Override
    public boolean nestedClaudeMdReloaded(String nestedDir, List<String> filesReadSinceCompaction) {
        String prefix = nestedDir + "/";
        return filesReadSinceCompaction.stream().anyMatch(f -> f.startsWith(prefix));
    }

    @Override
    public boolean sessionDataKept(int ageDays, Integer cleanupPeriodDays) {
        int period = cleanupPeriodDays == null ? DEFAULT_CLEANUP_PERIOD_DAYS : cleanupPeriodDays;
        return ageDays <= period;
    }

    @Override
    public Map<String, List<String>> planHandoff(List<Note> notes) {
        List<String> summary = new ArrayList<>();
        List<String> claudeMd = new ArrayList<>();
        for (Note n : notes) {
            switch (n.kind()) {
                case "decision", "open_thread" -> summary.add(n.text());
                case "durable_fact" -> claudeMd.add(n.text());
                case "raw_chatter" -> { }
                default -> throw new IllegalArgumentException("loại ghi chú lạ: " + n.kind());
            }
        }
        Map<String, List<String>> out = new LinkedHashMap<>();
        out.put("summary", summary);
        out.put("claude_md", claudeMd);
        return out;
    }
}
