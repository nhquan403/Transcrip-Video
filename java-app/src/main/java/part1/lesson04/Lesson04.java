package part1.lesson04;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.UnaryOperator;

/**
 * Bài tập bài 04. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p1-04" (thêm --live để chạy với Claude thật)
 */
public class Lesson04 implements Lesson04Api {

    /** Gợi ý: tách từ bằng split("\\W+"), toLowerCase(), đếm số từ xuất hiện trong description. */
    @Override
    public Subagent pickSubagent(String subtask, List<Subagent> subagents) {
        throw new UnsupportedOperationException("TODO bài 1: @tên trước, sau đó chấm điểm theo description");
    }

    @Override
    public String callTool(Subagent subagent, String tool, String input, Map<String, UnaryOperator<String>> tools) {
        throw new UnsupportedOperationException("TODO bài 2: kiểm tra allowedTools trước khi gọi");
    }

    @Override
    public String buildHandoff(String subtask, Map<String, String> sharedContext, List<String> neededKeys,
                               String outputFormat) {
        throw new UnsupportedOperationException("TODO bài 3: dựng chuỗi handoff bằng StringBuilder");
    }

    @Override
    public String orchestrate(String goal, Function<String, List<String>> decompose, List<Subagent> subagents,
                              Predicate<String> validate, Function<List<String>, String> synthesize) {
        throw new UnsupportedOperationException("TODO bài 4: decompose, delegate, validate, synthesize");
    }
}
