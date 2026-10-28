package part2.lesson22;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

/**
 * Bài tập Phần 2 · Bài 22. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-22"
 */
public class Lesson22 implements Lesson22Api {

    @Override
    public List<String> duplicatedLines(Map<String, String> promptsByCallSite, int minLength) {
        throw new UnsupportedOperationException("TODO bài 1: dòng nào bị chép ở nhiều chỗ gọi?");
    }

    @Override
    public Map<String, String> extractFragment(Map<String, String> promptsByCallSite, String fragmentText, String name) {
        throw new UnsupportedOperationException("TODO bài 2: thay đoạn trùng bằng tham chiếu {{name}}");
    }

    /** Gợi ý: Pattern.compile("\\{\\{(\\w+)}}") và Matcher.replaceAll(m -> ...). */
    @Override
    public String render(String template, Map<String, String> fragments) {
        throw new UnsupportedOperationException("TODO bài 3: ghép fragment vào template");
    }

    @Override
    public int filesHardcoding(Map<String, String> sourceFiles, String modelId) {
        throw new UnsupportedOperationException("TODO bài 4: bao nhiêu file phải sửa khi đổi model?");
    }

    @Override
    public List<String> behaviorChanges(Function<String, String> before, Function<String, String> after, List<String> inputs) {
        throw new UnsupportedOperationException("TODO bài 5: so output trước và sau refactor");
    }
}
