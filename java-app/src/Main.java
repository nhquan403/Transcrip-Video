import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

/**
 * Chạy bộ chấm bài tập Java.
 *
 * Đứng trong thư mục java-app (lệnh cho Windows: xem docs/java-app.md):
 *   javac -encoding UTF-8 -d out $(find src -name "*.java")
 *   java -Dstdout.encoding=UTF-8 -cp out Main                    chấm tất cả các bài
 *   java -Dstdout.encoding=UTF-8 -cp out Main 01                 chỉ chấm bài 01
 *   java -Dstdout.encoding=UTF-8 -cp out Main 01 --solution      chấm lời giải mẫu
 */
public class Main {
    private static final Map<String, Function<Boolean, Boolean>> LESSONS = new LinkedHashMap<>();

    static {
        LESSONS.put("01", lesson01.Check::run);
        LESSONS.put("02", lesson02.Check::run);
        LESSONS.put("04", lesson04.Check::run);
    }

    public static void main(String[] args) {
        List<String> argList = List.of(args);
        boolean solution = argList.contains("--solution");
        List<String> picked = argList.stream().filter(LESSONS::containsKey).toList();

        boolean allPassed = true;
        for (var entry : LESSONS.entrySet()) {
            if (!picked.isEmpty() && !picked.contains(entry.getKey())) continue;
            System.out.println("\n=== Bài " + entry.getKey() + (solution ? " (lời giải mẫu)" : "") + " ===");
            allPassed &= entry.getValue().apply(solution);
        }
        System.exit(allPassed ? 0 : 1);
    }
}
