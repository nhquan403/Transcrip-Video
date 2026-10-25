package lesson08;

import java.util.Iterator;
import java.util.List;
import java.util.function.Consumer;

/**
 * Bài tập bài 08. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="08" (thêm --live để chạy với Claude thật)
 */
public class Lesson08 implements Lesson08Api {

    @Override
    public InputMode chooseMode(Workload workload) {
        throw new UnsupportedOperationException("TODO bài 1: chọn chế độ nhập");
    }

    @Override
    public String singleMessage(String prompt, Model model) {
        throw new UnsupportedOperationException("TODO bài 2: hội thoại chỉ có một lượt user");
    }

    @Override
    public List<String> streamingSession(Iterator<String> inputs, Model model) {
        throw new UnsupportedOperationException("TODO bài 3: một hội thoại dùng chung cho mọi tin nhắn");
    }

    @Override
    public String resume(List<Turn> priorTranscript, String prompt, Model model) {
        throw new UnsupportedOperationException("TODO bài 4: transcript cũ + prompt mới");
    }

    @Override
    public String streamOutput(Iterator<String> deltas, Consumer<String> onDelta) {
        throw new UnsupportedOperationException("TODO bài 5: chuyển từng delta rồi ghép lại");
    }
}
