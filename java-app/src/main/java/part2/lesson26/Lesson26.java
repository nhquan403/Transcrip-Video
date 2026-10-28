package part2.lesson26;

import java.util.List;
import java.util.Map;

/**
 * Bài tập Phần 2 · Bài 26. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-26" (thêm --live để chạy với Claude thật)
 */
public class Lesson26 implements Lesson26Api {

    @Override
    public long totalInputTokens(int systemTokens, int toolDefinitionTokens, List<Integer> messageTokens) {
        throw new UnsupportedOperationException("TODO bài 1: mỗi request gửi lại system + tools + toàn bộ lịch sử tới lúc đó");
    }

    @Override
    public List<Turn> pruneStaleToolResults(List<Turn> window, int keepLast, int minTokens) {
        throw new UnsupportedOperationException("TODO bài 2: chỉ thay tool_result lớn và cũ bằng \"[pruned]\"");
    }

    @Override
    public StateKind kindOf(String where) {
        throw new UnsupportedOperationException("TODO bài 3: nằm trong cửa sổ hay nằm trên đĩa?");
    }

    /** Gợi ý: dùng Lesson26Api.turn("user", ...). */
    @Override
    public List<Map<String, Object>> nextRequestMessages(List<Map<String, Object>> history, String userText) {
        throw new UnsupportedOperationException("TODO bài 4: API không nhớ gì, hãy gửi lại toàn bộ history");
    }

    @Override
    public List<Map<String, Object>> startNewSession(List<Map<String, Object>> oldHistory, String carrySummary) {
        throw new UnsupportedOperationException("TODO bài 5: bỏ lịch sử cũ, chỉ mang theo tóm tắt (nếu có)");
    }
}
