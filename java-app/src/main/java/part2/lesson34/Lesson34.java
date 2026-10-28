package part2.lesson34;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;

/**
 * Bài tập Phần 2 · Bài 34. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-34" (thêm --live để chạy với Claude thật)
 */
public class Lesson34 implements Lesson34Api {

    @Override
    public List<String> missingFromUnit(Set<String> versioned) {
        throw new UnsupportedOperationException("TODO bài 1: prompt, model ID, config đi thành một khối");
    }

    @Override
    public String pluginVersion(String versionField, String commitSha) {
        throw new UnsupportedOperationException("TODO bài 2: semver, hoặc SHA khi trường version bỏ trống");
    }

    @Override
    public Map<String, String> requestHeaders(String apiKey, String apiVersion) {
        throw new UnsupportedOperationException("TODO bài 3: header nào ghim hợp đồng của API?");
    }

    @Override
    public Map<String, Boolean> runEvalSet(List<EvalCase> cases, Function<String, String> model) {
        throw new UnsupportedOperationException("TODO bài 4: cùng input cố định, so với output mong đợi");
    }

    @Override
    public String promotionDecision(Map<String, Boolean> production, Map<String, Boolean> candidate, Set<String> important) {
        throw new UnsupportedOperationException("TODO bài 5: bằng hoặc hơn, và không thụt lùi ở case quan trọng");
    }
}
