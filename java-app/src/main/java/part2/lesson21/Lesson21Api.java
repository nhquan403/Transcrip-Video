package part2.lesson21;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;

/**
 * Phần 2 · Bài 21: Reviewing Claude Integration Code.
 * {@link Lesson21} là chỗ bạn làm bài, {@link Lesson21Solution} là lời giải mẫu.
 */
public interface Lesson21Api {

    /** Kết quả vòng tạo, kiểm tra, hỏi lại: output cuối cùng đạt kiểm tra và số lần đã gọi model. */
    record Validated(String output, int attempts) {}

    /**
     * Bài 1 (review chính sách retry): một chính sách retry đang retry các status trong `retried`.
     * Trả về những status bị retry SAI, tức lỗi vĩnh viễn (mọi 4xx trừ 408 và 429), sắp xếp tăng dần.
     * Lỗi tạm thời (0 cho timeout, 408, 429, 5xx) được retry là đúng.
     */
    List<Integer> wrongRetries(Set<Integer> retried);

    /**
     * Bài 2 (tạo, kiểm tra, hỏi lại): gọi model với prompt; validator trả về Optional lỗi (rỗng nghĩa là đạt).
     * Nếu trượt, gọi lại với prompt mới = prompt gốc + "\n\nYour previous answer was rejected: " + lỗi + "\nReturn a corrected answer.".
     * Tối đa maxAttempts lần gọi; hết lượt mà vẫn trượt thì ném IllegalStateException chứa lỗi cuối cùng.
     */
    Validated generateValidated(Function<String, String> model, String prompt, Function<String, Optional<String>> validator,
                                int maxAttempts);

    /**
     * Bài 3 (parse phòng thủ, thất bại rõ ràng): đọc một số nguyên từ output đã parse. Chấp nhận Number có giá trị nguyên,
     * hoặc chuỗi chỉ gồm chữ số (có thể có dấu cách hai đầu). Thiếu hoặc null: IllegalArgumentException "missing field: x".
     * Có nhưng không phải số nguyên: IllegalArgumentException "field x is not an integer: <giá trị>".
     */
    int requireInt(Map<String, Object> output, String field);

    /**
     * Bài 4 (thay đổi có review được không): một pull request quá lớn để giữ trong đầu khi chạm hơn 10 file
     * hoặc hơn 400 dòng thay đổi, hoặc khi vừa refactor vừa thêm tính năng trong cùng một PR.
     */
    boolean tooBigToReview(int filesChanged, int linesChanged, boolean mixesRefactorAndFeature);
}
