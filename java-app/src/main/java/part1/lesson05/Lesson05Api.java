package part1.lesson05;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Bài 05: Context Isolation with Scoped Subagents.
 * {@link Lesson05} là chỗ bạn làm bài, {@link Lesson05Solution} là lời giải mẫu.
 */
public interface Lesson05Api {

    /** Những gì manager đang có: system prompt, lịch sử hội thoại, kết quả tool trước đó. */
    record ManagerState(String systemPrompt, List<String> history, List<String> toolResults) {}

    /** Định nghĩa subagent: tên và system prompt riêng của nó. */
    record SubagentDef(String name, String systemPrompt) {}

    /**
     * Việc được giao: kênh duy nhất để đưa thông tin cho subagent.
     * Bốn phần: hướng dẫn, dữ liệu liên quan, định dạng output, bộ tool có phạm vi hẹp.
     */
    record DelegatedTask(String instructions, Map<String, String> data, String outputShape, Set<String> tools) {}

    /** Một lần chạy subagent: số token của toàn bộ quá trình bên trong, và số token của bản tóm tắt trả về. */
    record SubagentRun(long transcriptTokens, long summaryTokens) {}

    /**
     * Bài 1: dựng đúng những dòng subagent được nhìn thấy, theo thứ tự:
     * system prompt của subagent, nội dung CLAUDE.md, "Tools: a, b" (sắp xếp tên tool),
     * hướng dẫn của việc, từng dòng dữ liệu "key: value" (sắp xếp theo key), "Output: <định dạng>".
     * Không bao giờ chứa lịch sử, kết quả tool hay system prompt của manager.
     */
    List<String> subagentContext(ManagerState manager, SubagentDef subagent, String claudeMd, DelegatedTask task);

    /**
     * Bài 2: kiểm tra việc giao có đủ bốn phần không. Trả về tên các phần còn thiếu, theo thứ tự:
     * "instructions" (hướng dẫn rỗng), "data" (không có dữ liệu), "output shape" (định dạng rỗng),
     * "scoped tools" (không có tool nào).
     */
    List<String> missingParts(DelegatedTask task);

    /**
     * Bài 3 (lỗi cô lập): những dữ kiện việc con cần nhưng không được truyền trong task.data.
     * Trả về danh sách đã sắp xếp. Đây là các chỗ bạn đang "giả định subagent đã biết".
     */
    List<String> assumedFacts(DelegatedTask task, Set<String> neededFacts);

    /**
     * Bài 4 (chi phí): số token đổ vào context của manager sau các lần chạy subagent.
     * Có cô lập: chỉ bản tóm tắt quay về. Không cô lập: toàn bộ quá trình bên trong tràn vào manager.
     */
    long managerContextTokens(List<SubagentRun> runs, boolean isolated);

    /** Bài 5 (quyền tối thiểu): các tool được cấp nhưng việc không cần, sắp xếp theo tên. */
    List<String> excessTools(Set<String> granted, Set<String> needed);
}
