package part1.lesson11;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.UnaryOperator;

/**
 * Bài 11: Hooks as Deterministic Guardrails.
 * {@link Lesson11} là chỗ bạn làm bài, {@link Lesson11Solution} là lời giải mẫu.
 */
public interface Lesson11Api {

    enum Decision { ALLOW, DENY, ASK }

    /** Thời điểm hook chạy: trước khi tool chạy (có thể chặn), hoặc sau khi tool đã chạy (chỉ quan sát). */
    enum Event { PRE_TOOL_USE, POST_TOOL_USE }

    record ToolCall(String tool, String input) {}

    /**
     * Một hook: gắn vào một sự kiện, có matcher chọn tool nào nó theo dõi, và callback.
     * Với POST_TOOL_USE, quyết định trả về bị bỏ qua (việc đã xảy ra rồi).
     */
    record Hook(Event event, String matcher, Function<ToolCall, Decision> callback) {}

    /**
     * Bài 1 (matcher): null hoặc rỗng nghĩa là khớp mọi tool. Ngược lại matcher là biểu thức chính quy
     * phải khớp TOÀN BỘ tên tool (tên chính xác như "Bash" cũng là một regex hợp lệ; "mcp__.*" khớp cả họ tool).
     */
    boolean matches(String matcher, String toolName);

    /**
     * Bài 2 (kiểm tra lệnh shell):
     * DENY: xóa đệ quy ở gốc ("rm -rf /", "rm -fr /", "rm -rf ~", "rm -rf /*", khoảng trắng tùy ý),
     *       hoặc "drop table" một bảng có tên bắt đầu bằng "prod" (không phân biệt hoa thường).
     * ASK:  "git push" kèm "--force" hoặc "-f", hoặc "drop table" bảng khác.
     * ALLOW: mọi lệnh còn lại.
     */
    Decision shellGuard(ToolCall call);

    /** Bài 3: chạy các hook PRE_TOOL_USE có matcher khớp. Có DENY thì DENY; không thì có ASK là ASK; còn lại ALLOW. */
    Decision decide(List<Hook> hooks, ToolCall call);

    /**
     * Bài 4: thực thi một tool call có hook bảo vệ, ghi nhật ký kiểm toán vào `audit`:
     * - DENY: không chạy tool, ghi "denied <tool>: <input>", trả về "error: blocked by hook".
     * - ASK: hỏi humanApproves. Từ chối: không chạy, ghi "rejected <tool>: <input>", trả về "error: rejected by human".
     * - Được phép (ALLOW hoặc ASK được duyệt): chạy tool, ghi "ran <tool>: <input>", rồi gọi các hook
     *   POST_TOOL_USE có matcher khớp. Trả về kết quả của tool.
     */
    String execute(ToolCall call, List<Hook> hooks, Map<String, UnaryOperator<String>> tools,
                   Predicate<ToolCall> humanApproves, List<String> audit);
}
