package part2.lesson27;

import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 27: Clearing, Compacting, and Starting Fresh.
 * {@link Lesson27} là chỗ bạn làm bài, {@link Lesson27Solution} là lời giải mẫu.
 */
public interface Lesson27Api {

    enum Move { COMPACT, CLEAR, START_FRESH }

    /** Tình trạng phiên hiện tại. */
    record Situation(boolean drifted, boolean runawayBloat, boolean unrelatedTaskSwitch, boolean wantToKeepThread) {}

    /** Một ghi chú trước khi reset. kind là "decision", "open_thread", "durable_fact" hoặc "raw_chatter". */
    record Note(String kind, String text) {}

    /**
     * Bài 1 (chọn cách reset): nếu drifted, runawayBloat hoặc unrelatedTaskSwitch → START_FRESH.
     * Ngược lại, wantToKeepThread → COMPACT (đi tiếp với ít "hành lý" hơn); không thì CLEAR (xóa sạch, làm lại tại chỗ).
     */
    Move chooseMove(Situation s);

    /**
     * Bài 2 (compaction không lossless): thứ nào còn nguyên sau compaction?
     * true: "root_claude_md" (đọc lại từ đĩa và chèn lại), "recent_turns", "key_decisions" (giữ trong bản tóm tắt).
     * false: "early_prompt_detail", "nested_claude_md", "chat_only_note". Khác: IllegalArgumentException.
     */
    boolean survivesCompaction(String item);

    /**
     * Bài 3 (CLAUDE.md lồng nhau nạp lại "lười"): sau compaction, CLAUDE.md trong thư mục con nestedDir (ví dụ "src/api")
     * chỉ được nạp lại khi Claude đọc một file nằm trong thư mục đó hoặc thư mục con của nó, tức đường dẫn bắt đầu bằng
     * nestedDir + "/". Trả về true nếu filesReadSinceCompaction có ít nhất một file như vậy.
     */
    boolean nestedClaudeMdReloaded(String nestedDir, List<String> filesReadSinceCompaction);

    /**
     * Bài 4 (cleanupPeriodDays): dữ liệu phiên được giữ trên đĩa khi ageDays <= số ngày giữ lại; cleanupPeriodDays null
     * nghĩa là dùng mặc định 30 ngày.
     */
    boolean sessionDataKept(int ageDays, Integer cleanupPeriodDays);

    /**
     * Bài 5 (handoff sạch trước khi reset): chia ghi chú theo nơi đến, giữ thứ tự gốc.
     * Trả về Map có đúng hai khóa: "summary" (text của "decision" và "open_thread") và "claude_md" (text của "durable_fact").
     * "raw_chatter" bị bỏ. kind lạ: IllegalArgumentException.
     */
    Map<String, List<String>> planHandoff(List<Note> notes);
}
