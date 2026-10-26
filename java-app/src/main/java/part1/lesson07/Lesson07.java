package part1.lesson07;

import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.UnaryOperator;
import part1.lesson06.Lesson06Api.Model;
import part1.lesson06.Lesson06Api.SdkMessage;
import part1.lesson06.Lesson06Api.Usage;

/**
 * Bài tập bài 07. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p1-07" (thêm --live để chạy với Claude thật)
 */
public class Lesson07 implements Lesson07Api {

    @Override
    public double costUsd(Usage usage, Pricing pricing) {
        throw new UnsupportedOperationException("TODO bài 1: token nhân giá chia 1 triệu");
    }

    @Override
    public int countTurns(List<SdkMessage> messages) {
        throw new UnsupportedOperationException("TODO bài 2: đếm UserMessage mang kết quả tool");
    }

    /** Gợi ý: chép vòng lặp query() bài 06 sang, thêm biến cost và kiểm tra ngân sách ở đầu mỗi vòng. */
    @Override
    public RunResult run(String prompt, String systemPrompt, Model model, Map<String, UnaryOperator<String>> tools,
                         Limits limits, Pricing pricing, Consumer<SdkMessage> out) {
        throw new UnsupportedOperationException("TODO bài 3: vòng lặp có maxTurns và maxBudgetUsd");
    }

    @Override
    public String readResult(RunResult result) {
        throw new UnsupportedOperationException("TODO bài 4: kiểm tra subtype trước");
    }

    @Override
    public String describeStop(RunResult result) {
        throw new UnsupportedOperationException("TODO bài 5: dòng chẩn đoán");
    }
}
