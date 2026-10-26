package part2.lesson16;

import java.util.List;
import java.util.Map;

/**
 * Bài tập Phần 2 · Bài 16. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-16" (thêm --live để chạy với Claude thật)
 */
public class Lesson16 implements Lesson16Api {

    @Override
    public String jsonType(Object value) {
        throw new UnsupportedOperationException("TODO bài 1: object, array hay scalar nào?");
    }

    @Override
    public List<String> missingCoreKeys(Map<String, Object> body) {
        throw new UnsupportedOperationException("TODO bài 2: model, messages, max_tokens");
    }

    /** Gợi ý: new ObjectMapper().readTree(json), rồi node.path("content") và lặp qua các phần tử. */
    @Override
    public String extractAnswer(String responseJson) {
        throw new UnsupportedOperationException("TODO bài 3: đi vào content, lấy text của block text");
    }

    @Override
    public long base64Length(long rawBytes) {
        throw new UnsupportedOperationException("TODO bài 4: 4 ký tự cho mỗi 3 byte");
    }

    /** Gợi ý: text.getBytes(java.nio.charset.StandardCharsets.UTF_8).length */
    @Override
    public long estimateBodyBytes(String text, List<Long> imageRawBytes) {
        throw new UnsupportedOperationException("TODO bài 5: byte UTF-8 của text cộng Base64 của ảnh");
    }
}
