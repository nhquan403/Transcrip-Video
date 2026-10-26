package part2.lesson18;

import com.anthropic.models.messages.Message;
import common.Claude;
import common.LiveSection;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Supplier;

/**
 * Phần 2 · Bài 18 chạy với Claude thật: fan out 8 lời gọi với trần 3 cùng lúc (semaphore của bạn),
 * cô lập một nhánh lỗi thật, và nối delta của một câu trả lời stream.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-18 --live"
 */
public final class Live {
    private Live() {}

    static final List<String> TERMS = List.of("gather", "semaphore", "bounded parallelism", "backpressure", "rate limit",
        "exponential backoff", "jitter", "error isolation");

    public static void run(boolean useSolution, Claude claude) {
        Lesson18Api api = useSolution ? new Lesson18Solution() : new Lesson18();

        LiveSection.run("Fan out có giới hạn: 8 lời gọi, tối đa 3 cùng bay", () -> {
            api.gatherBounded(List.<Supplier<String>>of(), 1);
            AtomicInteger running = new AtomicInteger();
            AtomicInteger peak = new AtomicInteger();
            List<Supplier<String>> tasks = new ArrayList<>();
            for (String term : TERMS) {
                tasks.add(() -> {
                    peak.accumulateAndGet(running.incrementAndGet(), Math::max);
                    try {
                        return term + ": " + claude.ask("Answer in one short Vietnamese sentence.", "Giải thích '" + term + "'.");
                    } finally {
                        running.decrementAndGet();
                    }
                });
            }
            long start = System.nanoTime();
            List<String> answers = api.gatherBounded(tasks, 3);
            answers.forEach(a -> System.out.println("  • " + a));
            System.out.println("  ⏱ " + (System.nanoTime() - start) / 1_000_000 + "ms · đỉnh đồng thời: " + peak.get() + " (trần 3)");
        });

        LiveSection.run("Cô lập lỗi: một nhánh gọi model không tồn tại, các nhánh khác vẫn giữ kết quả", () -> {
            api.gatherSettled(List.of(), 1);
            List<Supplier<String>> tasks = List.of(
                () -> claude.ask("Answer in one short Vietnamese sentence.", "429 nghĩa là gì?"),
                () -> Claude.text(claude.create(Claude.params().model("claude-model-khong-ton-tai").addUserMessage("hi").build())),
                () -> claude.ask("Answer in one short Vietnamese sentence.", "Jitter để làm gì?"));
            List<Lesson18Api.Outcome> outcomes = api.gatherSettled(tasks, 3);
            for (Lesson18Api.Outcome o : outcomes) {
                System.out.println("  " + (o.ok() ? "✅ " + o.value() : "❌ " + o.error().lines().findFirst().orElse("")));
            }
            System.out.println("  Thời gian chờ nếu cần thử lại nhánh lỗi (lần 0, 1, 2): "
                + api.backoffWithJitterMs(0, 1000, 30_000, Math::random) + "ms, "
                + api.backoffWithJitterMs(1, 1000, 30_000, Math::random) + "ms, "
                + api.backoffWithJitterMs(2, 1000, 30_000, Math::random) + "ms");
        });

        LiveSection.run("Streaming: nối các delta thành câu trả lời", () -> {
            api.accumulate(List.of());
            List<String> deltas = new ArrayList<>();
            Message m = claude.stream(Claude.params().maxTokens(300L).addUserMessage(
                "Trong 3 câu tiếng Việt: vì sao không nên fan out không giới hạn vào một API có rate limit?").build(), deltas::add);
            System.out.println("  Nhận " + deltas.size() + " delta, ví dụ: " + deltas.subList(0, Math.min(4, deltas.size())));
            System.out.println("  Ghép lại: " + api.accumulate(deltas));
            System.out.println("  stop_reason: " + m.stopReason().map(Object::toString).orElse("?"));
        });
    }
}
