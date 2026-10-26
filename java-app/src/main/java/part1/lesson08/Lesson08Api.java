package part1.lesson08;

import java.util.Iterator;
import java.util.List;
import java.util.function.Consumer;

/**
 * Bài 08: Streaming vs Single-Message Input.
 * {@link Lesson08} là chỗ bạn làm bài, {@link Lesson08Solution} là lời giải mẫu.
 */
public interface Lesson08Api {

    enum InputMode { STREAMING, SINGLE_MESSAGE }

    /** Đặc điểm của công việc cần chọn chế độ nhập. */
    record Workload(boolean interactive, boolean multiTurn, boolean needsImages, boolean needsInterrupt,
                    boolean statelessOneOff) {}

    /** Một lượt hội thoại: role là "user" hoặc "assistant". */
    record Turn(String role, String text) {}

    /** Model nhận toàn bộ hội thoại mà nó được thấy và trả lời một lượt. */
    interface Model {
        String reply(List<Turn> conversation);
    }

    /**
     * Bài 1: chọn chế độ nhập. Cần ảnh, cần ngắt giữa chừng, tương tác hoặc nhiều lượt: STREAMING.
     * Chỉ là việc một lần trong môi trường không trạng thái (và không cần những thứ trên): SINGLE_MESSAGE.
     * Phân vân (không rơi vào trường hợp nào): dùng mặc định được khuyên dùng là STREAMING.
     */
    InputMode chooseMode(Workload workload);

    /** Bài 2 (single message): một chuỗi vào, một câu trả lời ra. Model chỉ thấy đúng một lượt user. */
    String singleMessage(String prompt, Model model);

    /**
     * Bài 3 (streaming input): một phiên sống lâu, nhận lần lượt các tin nhắn từ `inputs`.
     * Hội thoại tự nối tiếp: mỗi tin nhắn mới được thêm sau toàn bộ các lượt trước. Trả về các câu trả lời theo thứ tự.
     */
    List<String> streamingSession(Iterator<String> inputs, Model model);

    /** Bài 4 (resume): single message nhưng chủ động nối lại phiên cũ: model thấy transcript cũ rồi đến prompt mới. */
    String resume(List<Turn> priorTranscript, String prompt, Model model);

    /** Bài 5 (streaming output): chuyển từng đoạn text cho onDelta ngay khi nhận, và trả về toàn văn khi xong. */
    String streamOutput(Iterator<String> deltas, Consumer<String> onDelta);
}
