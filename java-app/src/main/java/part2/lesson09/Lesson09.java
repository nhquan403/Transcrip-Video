package part2.lesson09;

import java.util.List;
import java.util.Map;

/**
 * Bài tập Phần 2 · Bài 09. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-09" (thêm --live để chạy với Claude thật)
 */
public class Lesson09 implements Lesson09Api {

    @Override
    public List<String> eventNames(String sse) {
        throw new UnsupportedOperationException("TODO bài 1: lấy tên sự kiện từ các dòng event:");
    }

    /** Gợi ý: lọc bỏ ping/error rồi đi qua danh sách với một biến trạng thái. */
    @Override
    public boolean validOrder(List<String> events) {
        throw new UnsupportedOperationException("TODO bài 2: kiểm tra thứ tự sự kiện");
    }

    /** Gợi ý: Map<Integer, StringBuilder> cho text và cho partial JSON; parse bằng Jackson ObjectMapper ở content_block_stop. */
    @Override
    public Assembled assemble(List<Map<String, Object>> events) {
        throw new UnsupportedOperationException("TODO bài 3: ghép delta, parse JSON của tool một lần ở cuối block");
    }

    @Override
    public long imageTokens(int width, int height, int maxLongEdge) {
        throw new UnsupportedOperationException("TODO bài 4: thu nhỏ rồi đếm ô 28×28");
    }

    @Override
    public Map<String, Object> imageBlock(String kind, String value, String mediaType) {
        throw new UnsupportedOperationException("TODO bài 5: block ảnh base64, url hoặc file_id");
    }
}
