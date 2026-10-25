package lesson06;

import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.UnaryOperator;

/**
 * Bài tập bài 06. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="06" (thêm --live để chạy với Claude thật)
 */
public class Lesson06 implements Lesson06Api {

    /** Gợi ý: một List<SdkMessage> conversation, một biến turns, một biến usage, vòng while(true). */
    @Override
    public void query(String prompt, Options options, Model model, Map<String, UnaryOperator<String>> tools,
                      Consumer<SdkMessage> out) {
        throw new UnsupportedOperationException("TODO bài 1-4: vòng lặp query");
    }

    @Override
    public String resultText(List<SdkMessage> messages) {
        throw new UnsupportedOperationException("TODO bài 5: kiểm tra subtype rồi mới đọc result");
    }
}
