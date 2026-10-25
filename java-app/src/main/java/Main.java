import common.Claude;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.BiConsumer;
import java.util.function.Function;

/**
 * Chạy bộ chấm bài tập, hoặc chạy bài tập với Claude thật.
 *
 * Đứng trong thư mục java-app (Windows dùng mvnw.cmd thay cho ./mvnw; xem docs/java-app.md):
 *   ./mvnw -q compile exec:java                                    chấm tất cả các bài (offline, miễn phí)
 *   ./mvnw -q compile exec:java -Dexec.args="01"                   chỉ chấm bài 01
 *   ./mvnw -q compile exec:java -Dexec.args="01 --solution"        chấm lời giải mẫu
 *   ./mvnw -q compile exec:java -Dexec.args="01 --live"            chạy code của bạn với Claude thật (cần ANTHROPIC_API_KEY)
 *   ./mvnw -q compile exec:java -Dexec.args="01 --live --solution" chạy lời giải mẫu với Claude thật
 */
public class Main {
    private static final Map<String, Function<Boolean, Boolean>> CHECKS = new LinkedHashMap<>();
    private static final Map<String, BiConsumer<Boolean, Claude>> LIVE = new LinkedHashMap<>();

    static {
        CHECKS.put("01", lesson01.Check::run);
        CHECKS.put("02", lesson02.Check::run);
        CHECKS.put("04", lesson04.Check::run);
        CHECKS.put("05", lesson05.Check::run);
        CHECKS.put("06", lesson06.Check::run);
        CHECKS.put("07", lesson07.Check::run);
        CHECKS.put("08", lesson08.Check::run);
        CHECKS.put("09", lesson09.Check::run);
        CHECKS.put("10", lesson10.Check::run);
        CHECKS.put("11", lesson11.Check::run);
        CHECKS.put("12", lesson12.Check::run);
        LIVE.put("01", lesson01.Live::run);
        LIVE.put("02", lesson02.Live::run);
        LIVE.put("04", lesson04.Live::run);
        LIVE.put("05", lesson05.Live::run);
        LIVE.put("06", lesson06.Live::run);
        LIVE.put("07", lesson07.Live::run);
        LIVE.put("08", lesson08.Live::run);
        LIVE.put("09", lesson09.Live::run);
        LIVE.put("10", lesson10.Live::run);
        LIVE.put("11", lesson11.Live::run);
        LIVE.put("12", lesson12.Live::run);
    }

    public static void main(String[] args) {
        List<String> argList = List.of(args);
        boolean solution = argList.contains("--solution");
        List<String> picked = argList.stream().filter(CHECKS::containsKey).toList();

        if (argList.contains("--live")) {
            runLive(picked, solution);
            return;
        }

        boolean allPassed = true;
        for (var entry : CHECKS.entrySet()) {
            if (!picked.isEmpty() && !picked.contains(entry.getKey())) continue;
            System.out.println("\n=== Bài " + entry.getKey() + (solution ? " (lời giải mẫu)" : "") + " ===");
            allPassed &= entry.getValue().apply(solution);
        }
        System.exit(allPassed ? 0 : 1);
    }

    private static void runLive(List<String> picked, boolean solution) {
        if (picked.isEmpty()) {
            System.out.println("Chế độ --live gọi API thật và tốn token, hãy chọn một bài, ví dụ: 01 --live");
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
        for (String lesson : picked) {
            System.out.println("\n=== Bài " + lesson + " với Claude thật (" + Claude.MODEL + ")"
                + (solution ? ", lời giải mẫu" : ", code của bạn") + " ===");
            LIVE.get(lesson).accept(solution, claude);
        }
        System.out.println("\n💰 " + claude.usageSummary());
    }
}
