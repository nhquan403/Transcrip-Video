package lesson10;

import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import java.util.function.Supplier;
import java.util.function.UnaryOperator;
import lesson09.Lesson09Api.Api;
import lesson09.Lesson09Api.ToolUse;

/**
 * Bài 10: Harness Design: Turns, State, Control.
 * Dùng lại các kiểu Messages API thu gọn của bài 09. Bạn dựng phần "khung xe" quanh vòng lặp:
 * đếm lượt, giữ trạng thái, xử lý lỗi, điều kiện dừng, và ba điểm chèn chính sách.
 * {@link Lesson10} là chỗ bạn làm bài, {@link Lesson10Solution} là lời giải mẫu.
 */
public interface Lesson10Api {

    enum Decision { ALLOW, BLOCK }

    enum Stop { DONE, MAX_TURNS, ERROR }

    /** Chính sách chạy trước mỗi tool: quyết định cho chạy hay chặn. */
    interface Policy {
        Decision check(ToolUse call);
    }

    /** Kết quả của harness: lý do dừng, câu trả lời (chỉ khi DONE), số lượt đã chạy, và nhật ký. */
    record HarnessResult(Stop stop, String answer, int turns, List<String> log) {}

    /**
     * Bài 1 (partial JSON): input của tool đến thành từng mảnh khi streaming. Gom tất cả rồi parse MỘT lần ở cuối
     * (gợi ý: new ObjectMapper().readValue(json, Map.class)). JSON cuối không hợp lệ thì ném IllegalArgumentException.
     */
    Map<String, Object> parseToolInput(List<String> partialJsonDeltas);

    /**
     * Bài 2 (bao quanh lúc chạy): thử chạy tool tối đa maxAttempts lần. Lỗi thoáng qua (retryable trả true) thì thử lại;
     * lỗi khác thì ném ra ngay. Hết số lần thử thì ném lỗi cuối cùng.
     */
    String withRetry(Supplier<String> tool, int maxAttempts, Predicate<RuntimeException> retryable);

    /**
     * Bài 3 (harness đầy đủ): như runLoop của bài 09, thêm:
     * - Đếm lượt: model còn đòi tool mà đã chạy đủ maxTurns lượt thì dừng MAX_TURNS (answer null).
     * - Trước tool: policy BLOCK thì không chạy, tool_result lỗi "error: blocked by policy", log "turn N blocked <tool>".
     * - Bao quanh: chạy qua withRetry; vẫn lỗi thì tool_result lỗi "error: <message>", log "turn N failed <tool>: <message>"
     *   và chạy tiếp (bỏ qua tool đó, không hủy cả lượt).
     * - Sau tool: log "turn N ran <tool>". (N = số thứ tự lượt hiện tại, bắt đầu từ 1.)
     * - api.call ném lỗi, hoặc stop reason không phải tool_use/end_turn: dừng ERROR, log "error: <chi tiết>".
     * - end_turn: dừng DONE với text.
     */
    HarnessResult run(String prompt, Api api, Map<String, UnaryOperator<String>> tools, Policy policy,
                      int maxTurns, int maxAttempts, Predicate<RuntimeException> retryable);
}
