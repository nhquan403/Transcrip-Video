package part2.lesson06;

import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 06: Operate and Maintain in Production.
 * {@link Lesson06} là chỗ bạn làm bài, {@link Lesson06Solution} là lời giải mẫu.
 */
public interface Lesson06Api {

    /** Một lời gọi đã ghi log: thời gian, token, status HTTP (200 nếu thành công) và stop_reason (null nếu lỗi HTTP). */
    record CallLog(long latencyMs, long inputTokens, long outputTokens, int status, String stopReason) {}

    /** Ba tín hiệu vận hành gom từ log. */
    record Health(long p95LatencyMs, long totalTokens, double errorAndRefusalRate) {}

    enum Fix { OK, RETRY_WITH_BACKOFF, REVIEW_PROMPT_OR_POLICY, RAISE_LIMIT_OR_ASK_SHORTER, FIX_REQUEST }

    /** Một prompt đã được version, gắn với model mà nó được tinh chỉnh cho. */
    record PromptVersion(String name, int version, String model, String text) {}

    /**
     * Bài 1 (ba tín hiệu): từ log, tính p95 độ trễ (sắp xếp tăng dần, lấy phần tử ở vị trí ceil(0.95 × n) − 1),
     * tổng token (vào + ra), và tỉ lệ lời gọi lỗi HTTP (status khác 200) hoặc bị từ chối (stopReason "refusal").
     * Log rỗng thì ném IllegalArgumentException.
     */
    Health health(List<CallLog> logs);

    /**
     * Bài 2 (đọc chữ ký lỗi): chữ ký gọi tên cách sửa.
     * 429 và 5xx: RETRY_WITH_BACKOFF. Các 4xx khác: FIX_REQUEST.
     * Status 200: stopReason "refusal" là REVIEW_PROMPT_OR_POLICY (không phải chuyện retry), "max_tokens" là RAISE_LIMIT_OR_ASK_SHORTER,
     * còn lại OK.
     */
    Fix readSignature(int status, String stopReason);

    /**
     * Bài 3 (regression trên bộ đánh giá đóng băng): id các ví dụ model cũ làm đúng mà model mới làm sai.
     * oldPass/newPass: id ví dụ → đạt hay không, trên CÙNG bộ ví dụ. Sắp xếp kết quả theo id.
     * Id có trong oldPass mà thiếu trong newPass thì coi là trượt.
     */
    List<String> regressions(Map<String, Boolean> oldPass, Map<String, Boolean> newPass);

    /**
     * Bài 4 (chỉ chuyển khi chất lượng giữ vững): chuyển sang model mới khi không có regression nào
     * và tỉ lệ đạt của model mới không thấp hơn model cũ.
     */
    boolean safeToCutOver(Map<String, Boolean> oldPass, Map<String, Boolean> newPass);

    /**
     * Bài 5 (prompt gắn với model): trong các phiên bản của prompt `name`, chọn version cao nhất được tinh chỉnh cho đúng `model`.
     * Không có thì ném IllegalStateException (đừng âm thầm dùng prompt của model khác).
     */
    PromptVersion promptFor(List<PromptVersion> registry, String name, String model);
}
