package part2.lesson21;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;

/**
 * Bài tập Phần 2 · Bài 21. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-21" (thêm --live để chạy với Claude thật)
 */
public class Lesson21 implements Lesson21Api {

    @Override
    public List<Integer> wrongRetries(Set<Integer> retried) {
        throw new UnsupportedOperationException("TODO bài 1: retry đúng cái tự hết được");
    }

    @Override
    public Validated generateValidated(Function<String, String> model, String prompt, Function<String, Optional<String>> validator,
                                       int maxAttempts) {
        throw new UnsupportedOperationException("TODO bài 2: tạo, kiểm tra, hỏi lại kèm lỗi");
    }

    @Override
    public int requireInt(Map<String, Object> output, String field) {
        throw new UnsupportedOperationException("TODO bài 3: đọc phòng thủ, lỗi thì báo to và rõ");
    }

    @Override
    public boolean tooBigToReview(int filesChanged, int linesChanged, boolean mixesRefactorAndFeature) {
        throw new UnsupportedOperationException("TODO bài 4: PR có vừa sức review không?");
    }
}
