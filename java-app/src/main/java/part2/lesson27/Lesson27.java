package part2.lesson27;

import java.util.List;
import java.util.Map;

/**
 * Bài tập Phần 2 · Bài 27. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-27" (thêm --live để chạy với Claude thật)
 */
public class Lesson27 implements Lesson27Api {

    @Override
    public Move chooseMove(Situation s) {
        throw new UnsupportedOperationException("TODO bài 1: drift/bloat/đổi việc → bắt đầu mới; còn lại compact hay clear?");
    }

    @Override
    public boolean survivesCompaction(String item) {
        throw new UnsupportedOperationException("TODO bài 2: bản tóm tắt giữ gì, đánh rơi gì?");
    }

    @Override
    public boolean nestedClaudeMdReloaded(String nestedDir, List<String> filesReadSinceCompaction) {
        throw new UnsupportedOperationException("TODO bài 3: chỉ nạp lại khi đọc file trong thư mục đó");
    }

    @Override
    public boolean sessionDataKept(int ageDays, Integer cleanupPeriodDays) {
        throw new UnsupportedOperationException("TODO bài 4: null nghĩa là mặc định bao nhiêu ngày?");
    }

    @Override
    public Map<String, List<String>> planHandoff(List<Note> notes) {
        throw new UnsupportedOperationException("TODO bài 5: quyết định + việc dở vào summary, sự thật bền vào CLAUDE.md");
    }
}
