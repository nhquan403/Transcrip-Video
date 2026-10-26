package part2.lesson20;

import java.util.List;
import java.util.Map;

/**
 * Bài tập Phần 2 · Bài 20. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-20"
 */
public class Lesson20 implements Lesson20Api {

    @Override
    public Placement placement(String path) {
        throw new UnsupportedOperationException("TODO bài 1: chia sẻ, cá nhân hay bí mật?");
    }

    @Override
    public Bump requiredBump(boolean breaksExistingCallers, boolean addsFunctionality) {
        throw new UnsupportedOperationException("TODO bài 2: major, minor hay patch?");
    }

    @Override
    public String bump(String version, Bump bump) {
        throw new UnsupportedOperationException("TODO bài 3: tăng đúng số và đặt lại các số sau");
    }

    /** Gợi ý: Jackson ObjectMapper().readTree(...) để parse; TreeMap để đi theo thứ tự đường dẫn. */
    @Override
    public List<String> ciCheck(Map<String, String> files) {
        throw new UnsupportedOperationException("TODO bài 4: kiểm tra cấu hình, schema và prompt trước khi merge");
    }
}
