package part2.lesson36;

import java.util.List;
import java.util.Map;

/**
 * Bài tập Phần 2 · Bài 36. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-36"
 */
public class Lesson36 implements Lesson36Api {

    /** Gợi ý: dùng Lesson36Api.satisfies(...) và Lesson36Api.compare(...). */
    @Override
    public String resolveFromTags(String plugin, String range, List<String> tags) {
        throw new UnsupportedOperationException("TODO bài 1: lọc tag của đúng plugin, lấy bản cao nhất vừa range");
    }

    @Override
    public boolean shouldCommit(String path) {
        throw new UnsupportedOperationException("TODO bài 2: hành vi phụ thuộc vào nó thì nó thuộc về version control");
    }

    @Override
    public String diagnose(DepState state) {
        throw new UnsupportedOperationException("TODO bài 3: thiếu/tắt hay sai phiên bản?");
    }

    @Override
    public String fixFor(String errorCode) {
        throw new UnsupportedOperationException("TODO bài 4: mỗi mã lỗi chỉ tới một cách sửa khác nhau");
    }

    @Override
    public boolean crossMarketplaceAllowed(String rootMarketplace, String depMarketplace, Map<String, List<String>> allowLists) {
        throw new UnsupportedOperationException("TODO bài 5: mặc định là không, và tin cậy không nối chuỗi");
    }
}
