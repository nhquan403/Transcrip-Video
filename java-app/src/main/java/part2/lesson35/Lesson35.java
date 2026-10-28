package part2.lesson35;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Bài tập Phần 2 · Bài 35. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-35"
 */
public class Lesson35 implements Lesson35Api {

    /** Gợi ý: Lesson35Api.parse(...) và Lesson35Api.compare(...) đã có sẵn. */
    @Override
    public boolean satisfies(String range, String version) {
        throw new UnsupportedOperationException("TODO bài 1: ~ chỉ patch, ^ minor + patch, >= là mức sàn");
    }

    @Override
    public String resolve(List<String> ranges, List<String> tags) {
        throw new UnsupportedOperationException("TODO bài 2: giao các range, lấy bản cao nhất vừa với tất cả");
    }

    @Override
    public Set<String> enableCascade(String plugin, Map<String, List<String>> deps) {
        throw new UnsupportedOperationException("TODO bài 3: đi hết chuỗi phụ thuộc");
    }

    @Override
    public List<String> disableOrder(String target, Set<String> enabled, Map<String, List<String>> deps) {
        throw new UnsupportedOperationException("TODO bài 4: tắt các plugin đang bật phụ thuộc vào target trước");
    }

    @Override
    public Set<String> prune(Set<String> installed, Set<String> direct, Map<String, List<String>> deps) {
        throw new UnsupportedOperationException("TODO bài 5: cái gì không còn ai trỏ tới từ plugin cài trực tiếp?");
    }
}
