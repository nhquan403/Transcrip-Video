package lesson11;

import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import java.util.function.UnaryOperator;

/**
 * Bài tập bài 11. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="11" (thêm --live để chạy với Claude thật)
 */
public class Lesson11 implements Lesson11Api {

    /** Gợi ý: toolName.matches(matcher) khớp toàn bộ chuỗi. */
    @Override
    public boolean matches(String matcher, String toolName) {
        throw new UnsupportedOperationException("TODO bài 1: matcher");
    }

    /** Gợi ý: Pattern.compile(..., Pattern.CASE_INSENSITIVE).matcher(input).find(). */
    @Override
    public Decision shellGuard(ToolCall call) {
        throw new UnsupportedOperationException("TODO bài 2: DENY / ASK / ALLOW cho lệnh shell");
    }

    @Override
    public Decision decide(List<Hook> hooks, ToolCall call) {
        throw new UnsupportedOperationException("TODO bài 3: gộp quyết định của các hook PRE_TOOL_USE");
    }

    @Override
    public String execute(ToolCall call, List<Hook> hooks, Map<String, UnaryOperator<String>> tools,
                          Predicate<ToolCall> humanApproves, List<String> audit) {
        throw new UnsupportedOperationException("TODO bài 4: chặn trước, chạy, kiểm toán sau");
    }
}
