package part2.lesson15;

/**
 * Bài tập Phần 2 · Bài 15. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-15" (thêm --live để chạy với API thật)
 */
public class Lesson15 implements Lesson15Api {

    @Override
    public boolean isSafe(String method) {
        throw new UnsupportedOperationException("TODO bài 1: method nào chỉ đọc?");
    }

    @Override
    public boolean isIdempotent(String method) {
        throw new UnsupportedOperationException("TODO bài 2: method nào gọi nhiều lần vẫn cùng trạng thái cuối?");
    }

    @Override
    public Family family(int status) {
        throw new UnsupportedOperationException("TODO bài 3: đọc chữ số đầu");
    }

    @Override
    public Action triage(int status) {
        throw new UnsupportedOperationException("TODO bài 4: sửa key, kiểm tra quyền, sửa body hay chờ rồi thử lại?");
    }

    @Override
    public boolean safeToResendAfterTimeout(String method) {
        throw new UnsupportedOperationException("TODO bài 5: gửi lại sau timeout có tạo bản sao không?");
    }
}
