package part2.lesson06;

import java.util.List;
import java.util.Map;

/**
 * Bài tập Phần 2 · Bài 06. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-06" (thêm --live để chạy với Claude thật)
 */
public class Lesson06 implements Lesson06Api {

    /** Ví dụ: 20 lời gọi thì p95 là phần tử thứ 19 (chỉ số 18) sau khi sắp xếp. */
    @Override
    public Health health(List<CallLog> logs) {
        throw new UnsupportedOperationException("TODO bài 1: p95 độ trễ, tổng token, tỉ lệ lỗi và từ chối");
    }

    @Override
    public Fix readSignature(int status, String stopReason) {
        throw new UnsupportedOperationException("TODO bài 2: chữ ký lỗi gọi tên cách sửa");
    }

    @Override
    public List<String> regressions(Map<String, Boolean> oldPass, Map<String, Boolean> newPass) {
        throw new UnsupportedOperationException("TODO bài 3: ví dụ trước đạt, giờ trượt");
    }

    @Override
    public boolean safeToCutOver(Map<String, Boolean> oldPass, Map<String, Boolean> newPass) {
        throw new UnsupportedOperationException("TODO bài 4: chỉ cut over khi chất lượng giữ vững");
    }

    @Override
    public PromptVersion promptFor(List<PromptVersion> registry, String name, String model) {
        throw new UnsupportedOperationException("TODO bài 5: prompt mới nhất cho đúng model");
    }
}
