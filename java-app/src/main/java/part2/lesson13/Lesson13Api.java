package part2.lesson13;

import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 13: Batch Jobs, custom_id and Results.
 * {@link Lesson13} là chỗ bạn làm bài, {@link Lesson13Solution} là lời giải mẫu.
 */
public interface Lesson13Api {

    /** Một entry của batch: custom_id và params (một body Messages API bình thường). */
    record Entry(String customId, Map<String, Object> params) {}

    /** Một kết quả batch: custom_id, loại kết quả ("succeeded", "errored", "canceled", "expired") và output nếu thành công. */
    record Result(String customId, String type, String output) {}

    /** Kết quả ghi ngược vào dữ liệu nguồn: nhãn theo id (theo thứ tự input), và các id cần chạy lại (theo thứ tự input). */
    record WriteBack(Map<String, String> outputs, List<String> retry) {}

    /** Bài 1: custom_id hợp lệ khi dài 1 tới 64 ký tự và chỉ gồm chữ cái, chữ số, gạch ngang, gạch dưới. */
    boolean validCustomId(String customId);

    /**
     * Bài 2: kiểm tra batch trước khi gửi. Đi qua các entry theo thứ tự, với mỗi entry thêm (nếu có) theo thứ tự:
     *   "invalid custom_id: X", "duplicate custom_id: X" (từ lần xuất hiện thứ hai),
     *   "X: stream is not allowed in a batch", "X: speed is not allowed in a batch",
     *   "X: max_tokens must be at least 1" (thiếu hoặc nhỏ hơn 1).
     */
    List<String> validate(List<Entry> entries);

    /**
     * Bài 3: biến một request đồng bộ có sẵn thành params cho batch: bỏ "stream" và "speed", giữ nguyên mọi thứ khác
     * (tools, system, thinking, ảnh... đều chạy được trong batch). Không sửa map đầu vào.
     */
    Map<String, Object> toBatchParams(Map<String, Object> syncRequest);

    /**
     * Bài 4: ghép kết quả về đúng input theo custom_id, KHÔNG theo vị trí (kết quả về không theo thứ tự gửi).
     * inputs: custom_id → input, theo thứ tự đã gửi. succeeded thì ghi output; errored, canceled, expired hoặc không có kết quả
     * thì đưa vào danh sách retry. Kết quả có custom_id lạ thì ném IllegalStateException.
     */
    WriteBack writeBack(Map<String, String> inputs, List<Result> results);
}
