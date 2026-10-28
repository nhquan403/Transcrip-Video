package part2.lesson37;

import java.util.List;

/**
 * Bài tập Phần 2 · Bài 37. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-37"
 */
public class Lesson37 implements Lesson37Api {

    @Override
    public int contextTokens(Item item, boolean invoked) {
        throw new UnsupportedOperationException("TODO bài 1: rule luôn có mặt, skill chỉ có description cho tới khi được gọi");
    }

    @Override
    public boolean ruleLoaded(String pathsGlob, List<String> touchedFiles) {
        throw new UnsupportedOperationException("TODO bài 2: không glob thì nạp lúc bắt đầu; có glob thì chờ file khớp");
    }

    @Override
    public String resolveSlash(String typed, List<String> files) {
        throw new UnsupportedOperationException("TODO bài 3: built-in, rồi skill (thắng), rồi command");
    }

    @Override
    public String effectiveDescription(String frontMatterDescription, String firstParagraph) {
        throw new UnsupportedOperationException("TODO bài 4a: description, nếu trống thì đoạn đầu tiên");
    }

    @Override
    public List<String> skillWarnings(String path, String frontMatterDescription) {
        throw new UnsupportedOperationException("TODO bài 4b: có nằm trong thư mục được quét không? có description không?");
    }

    @Override
    public Scope scopeOf(String path) {
        throw new UnsupportedOperationException("TODO bài 5: .claude/ của dự án hay ~/.claude/ ở home?");
    }
}
