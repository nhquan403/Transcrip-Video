package part1.lesson12;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.UnaryOperator;
import part1.lesson09.Lesson09Api.ToolUse;

/**
 * Bài 12: Tool-Use Loops and Subagent Patterns.
 * Dùng lại ToolUse của bài 09. {@link Lesson12} là chỗ bạn làm bài, {@link Lesson12Solution} là lời giải mẫu.
 */
public interface Lesson12Api {

    /**
     * Bài 1: chia các tool call của một lượt thành các đợt (batch), giữ nguyên thứ tự:
     * các call chỉ đọc (tên nằm trong readOnlyTools) đứng liền nhau gom vào cùng một đợt để chạy song song;
     * mỗi call thay đổi trạng thái đứng riêng một đợt. Tool tự viết mà không đánh dấu chỉ đọc thì coi là thay đổi trạng thái.
     */
    List<List<ToolUse>> planBatches(List<ToolUse> calls, Set<String> readOnlyTools);

    /**
     * Bài 2: chạy lần lượt từng đợt; trong một đợt có nhiều call thì chạy song song.
     * Trả về map id → kết quả, theo đúng thứ tự call ban đầu (gợi ý: LinkedHashMap).
     */
    Map<String, String> executeBatches(List<List<ToolUse>> batches, Map<String, UnaryOperator<String>> tools);

    /** Bài 3: thời gian chờ thực tế (ms): mỗi đợt mất bằng call chậm nhất trong đợt; các đợt cộng lại. */
    long wallClockMs(List<List<Long>> batchDurationsMs);

    /**
     * Bài 4: hai worker song song không thấy kết quả của nhau. Manager phải tự mang kết quả của worker 1
     * sang việc giao cho worker 2. Trả về: nextTask + "\n\nKết quả từ worker trước:\n" + previousResult.
     */
    String carryAcross(String previousResult, String nextTask);
}
