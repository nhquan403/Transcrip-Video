package part2.lesson23;

import java.util.List;

/**
 * Bài tập Phần 2 · Bài 23. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-23" (thêm --live để chạy với Claude thật)
 */
public class Lesson23 implements Lesson23Api {

    @Override
    public List<String> loadedInstructions(Surface surface, boolean claudeCodePreset, List<String> settingSources) {
        throw new UnsupportedOperationException("TODO bài 1: mỗi bề mặt tự nạp những gì?");
    }

    @Override
    public boolean reaches(String setOn, Surface target) {
        throw new UnsupportedOperationException("TODO bài 2: quy tắc có đi theo sang bề mặt khác không?");
    }

    @Override
    public List<String> debugSteps() {
        throw new UnsupportedOperationException("TODO bài 3: nghi lớp vỏ trước, nghi model sau");
    }
}
