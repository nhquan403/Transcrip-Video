import common.Claude;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.BiConsumer;
import java.util.function.Function;

/**
 * Chạy bộ chấm bài tập, hoặc chạy bài tập với Claude thật.
 * Mỗi bài có mã "p<phần>-<số bài>", ví dụ p1-07 là bài 07 của Phần 1, p2-03 là bài 03 của Phần 2.
 *
 * Đứng trong thư mục java-app (Windows dùng mvnw.cmd thay cho ./mvnw; xem docs/java-app.md):
 *   ./mvnw -q compile exec:java                                       chấm tất cả các bài (offline, miễn phí)
 *   ./mvnw -q compile exec:java -Dexec.args="p2"                      chấm cả Phần 2
 *   ./mvnw -q compile exec:java -Dexec.args="p2-01"                   chỉ chấm bài 01 của Phần 2
 *   ./mvnw -q compile exec:java -Dexec.args="p2-01 --solution"        chấm lời giải mẫu
 *   ./mvnw -q compile exec:java -Dexec.args="p2-01 --live"            chạy code của bạn với Claude thật (cần ANTHROPIC_API_KEY)
 *   ./mvnw -q compile exec:java -Dexec.args="p2-01 --live --solution" chạy lời giải mẫu với Claude thật
 */
public class Main {
    private static final Map<String, Function<Boolean, Boolean>> CHECKS = new LinkedHashMap<>();
    private static final Map<String, BiConsumer<Boolean, Claude>> LIVE = new LinkedHashMap<>();

    static {
        CHECKS.put("p1-01", part1.lesson01.Check::run);
        CHECKS.put("p1-02", part1.lesson02.Check::run);
        CHECKS.put("p1-04", part1.lesson04.Check::run);
        CHECKS.put("p1-05", part1.lesson05.Check::run);
        CHECKS.put("p1-06", part1.lesson06.Check::run);
        CHECKS.put("p1-07", part1.lesson07.Check::run);
        CHECKS.put("p1-08", part1.lesson08.Check::run);
        CHECKS.put("p1-09", part1.lesson09.Check::run);
        CHECKS.put("p1-10", part1.lesson10.Check::run);
        CHECKS.put("p1-11", part1.lesson11.Check::run);
        CHECKS.put("p1-12", part1.lesson12.Check::run);
        CHECKS.put("p2-01", part2.lesson01.Check::run);
        CHECKS.put("p2-02", part2.lesson02.Check::run);
        CHECKS.put("p2-03", part2.lesson03.Check::run);
        CHECKS.put("p2-04", part2.lesson04.Check::run);
        CHECKS.put("p2-05", part2.lesson05.Check::run);
        CHECKS.put("p2-06", part2.lesson06.Check::run);
        CHECKS.put("p2-07", part2.lesson07.Check::run);
        CHECKS.put("p2-08", part2.lesson08.Check::run);
        CHECKS.put("p2-09", part2.lesson09.Check::run);
        CHECKS.put("p2-10", part2.lesson10.Check::run);
        CHECKS.put("p2-11", part2.lesson11.Check::run);
        CHECKS.put("p2-12", part2.lesson12.Check::run);
        CHECKS.put("p2-13", part2.lesson13.Check::run);
        CHECKS.put("p2-14", part2.lesson14.Check::run);
        CHECKS.put("p2-15", part2.lesson15.Check::run);
        CHECKS.put("p2-16", part2.lesson16.Check::run);
        CHECKS.put("p2-17", part2.lesson17.Check::run);
        CHECKS.put("p2-18", part2.lesson18.Check::run);
        CHECKS.put("p2-19", part2.lesson19.Check::run);
        CHECKS.put("p2-20", part2.lesson20.Check::run);
        CHECKS.put("p2-21", part2.lesson21.Check::run);
        CHECKS.put("p2-22", part2.lesson22.Check::run);
        CHECKS.put("p2-23", part2.lesson23.Check::run);
        CHECKS.put("p2-24", part2.lesson24.Check::run);
        CHECKS.put("p2-25", part2.lesson25.Check::run);
        LIVE.put("p1-01", part1.lesson01.Live::run);
        LIVE.put("p1-02", part1.lesson02.Live::run);
        LIVE.put("p1-04", part1.lesson04.Live::run);
        LIVE.put("p1-05", part1.lesson05.Live::run);
        LIVE.put("p1-06", part1.lesson06.Live::run);
        LIVE.put("p1-07", part1.lesson07.Live::run);
        LIVE.put("p1-08", part1.lesson08.Live::run);
        LIVE.put("p1-09", part1.lesson09.Live::run);
        LIVE.put("p1-10", part1.lesson10.Live::run);
        LIVE.put("p1-11", part1.lesson11.Live::run);
        LIVE.put("p1-12", part1.lesson12.Live::run);
        LIVE.put("p2-01", part2.lesson01.Live::run);
        LIVE.put("p2-02", part2.lesson02.Live::run);
        LIVE.put("p2-03", part2.lesson03.Live::run);
        LIVE.put("p2-04", part2.lesson04.Live::run);
        LIVE.put("p2-05", part2.lesson05.Live::run);
        LIVE.put("p2-06", part2.lesson06.Live::run);
        LIVE.put("p2-07", part2.lesson07.Live::run);
        LIVE.put("p2-08", part2.lesson08.Live::run);
        LIVE.put("p2-09", part2.lesson09.Live::run);
        LIVE.put("p2-10", part2.lesson10.Live::run);
        LIVE.put("p2-11", part2.lesson11.Live::run);
        LIVE.put("p2-12", part2.lesson12.Live::run);
        LIVE.put("p2-13", part2.lesson13.Live::run);
        LIVE.put("p2-15", part2.lesson15.Live::run);
        LIVE.put("p2-16", part2.lesson16.Live::run);
        LIVE.put("p2-17", part2.lesson17.Live::run);
        LIVE.put("p2-18", part2.lesson18.Live::run);
        LIVE.put("p2-19", part2.lesson19.Live::run);
        LIVE.put("p2-21", part2.lesson21.Live::run);
        LIVE.put("p2-23", part2.lesson23.Live::run);
        LIVE.put("p2-24", part2.lesson24.Live::run);
        LIVE.put("p2-25", part2.lesson25.Live::run);
    }

    public static void main(String[] args) {
        List<String> argList = List.of(args);
        boolean solution = argList.contains("--solution");
        List<String> selectors = argList.stream().filter(a -> !a.startsWith("--")).toList();
        List<String> unknown = selectors.stream()
            .filter(s -> CHECKS.keySet().stream().noneMatch(key -> matches(key, s))).toList();
        if (!unknown.isEmpty()) {
            System.out.println("Không có bài " + unknown + ". Mã bài có dạng p1-07 (Phần 1, bài 07); dùng p1 hoặc p2 cho cả phần.");
            System.out.println("Các bài hiện có: " + String.join(" ", CHECKS.keySet()));
            System.exit(1);
        }
        List<String> picked = CHECKS.keySet().stream()
            .filter(key -> selectors.isEmpty() || selectors.stream().anyMatch(s -> matches(key, s))).toList();

        if (argList.contains("--live")) {
            runLive(selectors.isEmpty() ? List.of() : picked, solution);
            return;
        }

        boolean allPassed = true;
        for (String key : picked) {
            System.out.println("\n=== " + label(key) + (solution ? " (lời giải mẫu)" : "") + " ===");
            allPassed &= CHECKS.get(key).apply(solution);
        }
        System.exit(allPassed ? 0 : 1);
    }

    /** "p2" chọn cả Phần 2, "p2-03" chọn đúng một bài. */
    private static boolean matches(String key, String selector) {
        return key.equals(selector) || key.startsWith(selector + "-");
    }

    private static String label(String key) {
        return "Phần " + key.charAt(1) + " · Bài " + key.substring(3);
    }

    private static void runLive(List<String> picked, boolean solution) {
        if (picked.isEmpty()) {
            System.out.println("Chế độ --live gọi API thật và tốn token, hãy chọn bài, ví dụ: p2-01 --live");
            System.exit(1);
        }
        Claude claude;
        try {
            claude = Claude.fromEnv();
        } catch (IllegalStateException e) {
            System.out.println(e.getMessage());
            System.exit(1);
            return;
        }
        for (String key : picked) {
            if (!LIVE.containsKey(key)) {
                System.out.println("\n=== " + label(key) + ": bài này chỉ có bộ chấm offline, không có phần --live ===");
                continue;
            }
            System.out.println("\n=== " + label(key) + " với Claude thật (" + Claude.MODEL + ")"
                + (solution ? ", lời giải mẫu" : ", code của bạn") + " ===");
            LIVE.get(key).accept(solution, claude);
        }
        System.out.println("\n💰 " + claude.usageSummary());
    }
}
