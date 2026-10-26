package part2.lesson02;

import java.util.List;
import java.util.Map;

/**
 * Bài tập Phần 2 · Bài 02. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-02" (thêm --live để chạy với Claude thật)
 */
public class Lesson02 implements Lesson02Api {

    /**
     * Gợi ý: new com.fasterxml.jackson.databind.ObjectMapper().readValue(output, Object.class) trả về Map nếu là object JSON,
     * ném JsonProcessingException nếu không phải JSON. Số là Number, mảng là List, true/false là Boolean.
     */
    @Override
    public List<String> formatErrors(String output, Map<String, String> schema) {
        throw new UnsupportedOperationException("TODO bài 1: parse JSON rồi đối chiếu từng trường với schema");
    }

    /** Gợi ý: s.replaceAll("\\s+", " ").trim() */
    @Override
    public boolean isGrounded(List<String> quotes, String source) {
        throw new UnsupportedOperationException("TODO bài 2: mọi trích dẫn phải có trong tài liệu");
    }

    @Override
    public double behaviorAccuracy(List<String> predicted, List<String> labels) {
        throw new UnsupportedOperationException("TODO bài 3: đếm số dự đoán khớp nhãn");
    }

    @Override
    public ResponseKind classify(String stopReason, boolean passesFormatCheck) {
        throw new UnsupportedOperationException("TODO bài 4: phân nhánh theo stop_reason, rồi theo format check");
    }

    @Override
    public List<String> specGaps(List<Turn> turns) {
        throw new UnsupportedOperationException("TODO bài 5: tìm lượt thiếu output mong đợi hoặc thiếu cách kiểm tra");
    }
}
