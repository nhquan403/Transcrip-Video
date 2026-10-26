package part2.lesson11;

import java.util.List;

/**
 * Bài tập Phần 2 · Bài 11. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-11" (thêm --live để chạy với Claude thật)
 */
public class Lesson11 implements Lesson11Api {

    @Override
    public List<String> render(List<String> tools, List<String> system, List<String> messages) {
        throw new UnsupportedOperationException("TODO bài 1: tools, system, messages");
    }

    @Override
    public int cachedPrefixLength(List<String> previous, List<String> current) {
        throw new UnsupportedOperationException("TODO bài 2: đếm đoạn đầu giống hệt nhau");
    }

    @Override
    public List<String> checkBreakpoints(List<Segment> segments) {
        throw new UnsupportedOperationException("TODO bài 3: tối đa 4 breakpoint, nội dung thay đổi phải nằm sau breakpoint cuối");
    }

    /** Ví dụ: 10.000 token, 3 lần, ttl 5m: 12.500 + 2 × 1.000 = 14.500. */
    @Override
    public double cachedCost(long prefixTokens, int calls, String ttl) {
        throw new UnsupportedOperationException("TODO bài 4: phí ghi một lần, phí đọc các lần sau");
    }

    @Override
    public boolean worthCaching(String model, long prefixTokens, int calls, String ttl) {
        throw new UnsupportedOperationException("TODO bài 5: đủ mức tối thiểu và rẻ hơn mới đáng cache");
    }
}
