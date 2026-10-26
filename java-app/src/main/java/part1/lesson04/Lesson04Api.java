package part1.lesson04;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.UnaryOperator;

/**
 * Bài 04: Manager and Subagent Orchestration.
 * {@link Lesson04} là chỗ bạn làm bài, {@link Lesson04Solution} là lời giải mẫu.
 */
public interface Lesson04Api {

    /**
     * Một subagent: tên, mô tả "giỏi việc gì" (manager dựa vào đây để chọn), danh sách tool được phép,
     * và phần việc nó làm khi nhận một handoff.
     */
    record Subagent(String name, String description, Set<String> allowedTools, UnaryOperator<String> work) {}

    /**
     * Bài 1 (chọn subagent): nếu subtask có "@tên" thì chọn đúng subagent đó (gọi tên trực tiếp).
     * Nếu không, chọn subagent có description chứa nhiều từ của subtask nhất
     * (so sánh không phân biệt hoa thường, chỉ tính các từ dài từ 4 ký tự). Hòa thì lấy subagent đứng trước.
     * Không subagent nào khớp từ nào thì trả về null.
     */
    Subagent pickSubagent(String subtask, List<Subagent> subagents);

    /**
     * Bài 2 (least privilege): subagent chỉ được gọi tool có trong allowedTools.
     * Tool ngoài danh sách thì ném SecurityException, kể cả khi tool đó tồn tại.
     */
    String callTool(Subagent subagent, String tool, String input, Map<String, UnaryOperator<String>> tools);

    /**
     * Bài 3 (handoff đủ ngữ cảnh): subagent bắt đầu từ con số 0, nên handoff phải mang đủ thông tin.
     * Định dạng:
     *   Task: <subtask>
     *   Context:
     *   - <key>: <value>      (chỉ các key trong neededKeys, đúng thứ tự)
     *   Output format: <outputFormat>
     * Thiếu key nào trong sharedContext thì ném IllegalArgumentException.
     */
    String buildHandoff(String subtask, Map<String, String> sharedContext, List<String> neededKeys, String outputFormat);

    /**
     * Bài 4 (manager loop): decompose lúc chạy, delegate từng subtask cho subagent phù hợp (dùng bài 1),
     * validate từng kết quả, rồi synthesize. Subtask không có subagent phù hợp hoặc kết quả không hợp lệ
     * thì ném IllegalStateException có chứa tên subtask.
     */
    String orchestrate(String goal, Function<String, List<String>> decompose, List<Subagent> subagents,
                       Predicate<String> validate, Function<List<String>, String> synthesize);
}
