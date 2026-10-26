package part2.lesson17;

import common.Claude;
import common.LiveSection;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Function;

/**
 * Phần 2 · Bài 17 chạy với Claude thật: 5 câu hỏi độc lập, gọi tuần tự rồi gọi đồng thời, so thời gian thực.
 * Mỗi lời gọi gần như toàn thời gian chỉ là chờ mạng (I/O bound), nên chạy đồng thời lấy lại được thời gian chết đó.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-17 --live"
 */
public final class Live {
    private Live() {}

    static final List<String> QUESTIONS = List.of(
        "Coroutine là gì? Một câu tiếng Việt.",
        "Event loop làm gì? Một câu tiếng Việt.",
        "Await làm gì? Một câu tiếng Việt.",
        "Vì sao gọi API là việc I/O bound? Một câu tiếng Việt.",
        "Concurrency khác parallelism thế nào? Một câu tiếng Việt.");

    public static void run(boolean useSolution, Claude claude) {
        Lesson17Api api = useSolution ? new Lesson17Solution() : new Lesson17();
        Function<String, String> ask = q -> claude.ask("Answer in one short Vietnamese sentence.", q);

        LiveSection.run("Tuần tự: mỗi lời gọi đứng chờ lời gọi trước", () -> {
            api.wallTimeMs(List.of(), false);
            long start = System.nanoTime();
            List<String> answers = api.runSequential(QUESTIONS, ask);
            report(answers, start);
        });

        LiveSection.run("Đồng thời: khởi động cả 5 rồi mới chờ cả nhóm", () -> {
            api.wallTimeMs(List.of(), true);
            try (ExecutorService pool = Executors.newVirtualThreadPerTaskExecutor()) {
                long start = System.nanoTime();
                List<String> answers = api.runConcurrent(QUESTIONS, q -> api.callAsync(ask, q, pool));
                report(answers, start);
            }
            List<Long> each = claude.calls().subList(claude.calls().size() - QUESTIONS.size(), claude.calls().size())
                .stream().map(Claude.CallStats::millis).toList();
            System.out.println("  Thời gian từng lời gọi: " + each + " → ước tính của bạn: tuần tự " + api.wallTimeMs(each, false)
                + "ms, đồng thời " + api.wallTimeMs(each, true) + "ms");
        });
    }

    private static void report(List<String> answers, long startNanos) {
        long ms = (System.nanoTime() - startNanos) / 1_000_000;
        for (int i = 0; i < answers.size(); i++) System.out.println("  " + (i + 1) + ". " + answers.get(i));
        System.out.println("  ⏱ Thời gian thực: " + ms + "ms");
    }
}
