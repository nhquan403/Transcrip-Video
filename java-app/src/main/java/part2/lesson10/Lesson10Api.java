package part2.lesson10;

import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 10: Adaptive Thinking and Effort Control.
 * {@link Lesson10} là chỗ bạn làm bài, {@link Lesson10Solution} là lời giải mẫu.
 * Model trong bài: claude-fable-5, claude-sonnet-5, claude-opus-4-8, claude-opus-4-7, claude-opus-4-6, claude-opus-4-5, claude-sonnet-4-5.
 */
public interface Lesson10Api {

    enum DefaultThinking { OFF_UNLESS_ENABLED, ON_BY_DEFAULT, ALWAYS_ON, NO_ADAPTIVE }

    enum BudgetTokens { REJECTED, DEPRECATED, ONLY_WAY }

    /**
     * Bài 1: hành vi mặc định khi KHÔNG gửi trường thinking.
     * Opus 4.8 và 4.7: OFF_UNLESS_ENABLED. Sonnet 5: ON_BY_DEFAULT (muốn tắt phải gửi disabled). Fable 5: ALWAYS_ON (không tắt được).
     * Opus 4.6: OFF_UNLESS_ENABLED. Opus 4.5 và Sonnet 4.5: NO_ADAPTIVE. Model lạ: IllegalArgumentException.
     */
    DefaultThinking defaultThinking(String model);

    /**
     * Bài 2: budget_tokens (thinking type "enabled") trên từng model.
     * Fable 5, Sonnet 5, Opus 4.8, Opus 4.7: REJECTED (trả về 400). Opus 4.6: DEPRECATED (còn chạy, đang bỏ dần).
     * Sonnet 4.5, Opus 4.5: ONLY_WAY (cách duy nhất để bật thinking). Model lạ: IllegalArgumentException.
     */
    BudgetTokens budgetTokens(String model);

    /**
     * Bài 3: kiểm tra body request cho model, trả về danh sách lỗi theo thứ tự:
     *   "effort belongs under output_config.effort" nếu body có khóa "effort" ở cấp cao nhất;
     *   "unknown effort: x" nếu output_config.effort không thuộc low, medium, high, xhigh, max;
     *   "xhigh not available on m" nếu effort là xhigh mà model không phải Fable 5, Opus 4.8, Opus 4.7, Sonnet 5;
     *   "budget_tokens rejected on m" nếu thinking.type là "enabled" trên model REJECTED;
     *   "adaptive not available on m" nếu thinking.type là "adaptive" trên model NO_ADAPTIVE;
     *   "thinking cannot be disabled on m" nếu thinking.type là "disabled" trên Fable 5;
     *   "tool_choice must be auto or none with thinking" nếu thinking đang bật và tool_choice.type là "any" hoặc "tool".
     * "Thinking đang bật" nghĩa là: thinking.type là adaptive hoặc enabled, hoặc không gửi thinking trên model ON_BY_DEFAULT/ALWAYS_ON.
     */
    List<String> validate(String model, Map<String, Object> body);

    /**
     * Bài 4: chuẩn bị lịch sử cho lời gọi tiếp. Lượt assistant MỚI NHẤT giữ nguyên tuyệt đối (kể cả thinking, redacted_thinking và signature).
     * Các lượt assistant cũ hơn được phép bỏ block "thinking" và "redacted_thinking" (để nhẹ context); các block khác giữ nguyên.
     * Mỗi lượt là Map {"role", "content"} với content là danh sách block Map. Không sửa danh sách đầu vào.
     */
    List<Map<String, Object>> dropOldThinking(List<Map<String, Object>> messages);
}
