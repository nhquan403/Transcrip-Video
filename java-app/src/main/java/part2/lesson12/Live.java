package part2.lesson12;

import com.anthropic.models.messages.Message;
import common.Claude;
import common.LiveSection;
import java.util.List;
import part2.lesson12.Lesson12Api.Job;

/**
 * Phần 2 · Bài 12 chạy với Claude thật: chạy vài lời gọi đồng bộ thật, đo token, rồi tính nếu chạy bằng batch thì tốn bao nhiêu.
 * Bài 13 sẽ gửi một batch thật.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-12 --live"
 */
public final class Live {
    private Live() {}

    static final List<String> TICKETS = List.of(
        "Tôi bị trừ tiền hai lần trong tháng này.",
        "Nút xuất PDF bấm vào không có phản ứng gì.",
        "Làm sao thêm một người quản trị nữa vào workspace?");

    public static void run(boolean useSolution, Claude claude) {
        Lesson12Api api = useSolution ? new Lesson12Solution() : new Lesson12();

        System.out.println("\n▶ Chọn bề mặt cho từng việc (không gọi API)");
        for (Job job : List.of(new Job("trả lời chat", true, true, false, 1), new Job("eval 5.000 ca", false, false, false, 5_000),
            new Job("phân loại tồn đọng, công ty bắt buộc ZDR", false, false, true, 80_000))) {
            System.out.println("  " + job.name() + " → " + tryCall(() -> api.choose(job)));
        }

        LiveSection.run("Gọi đồng bộ thật rồi so với giá batch", () -> {
            api.batchCost(0, 0, 1, 1);
            long in = 0;
            long out = 0;
            for (String t : TICKETS) {
                Message m = claude.create(Claude.params().maxTokens(20L)
                    .system("Classify the ticket. Reply with one word: billing, bug, or account.").addUserMessage(t).build());
                in += m.usage().inputTokens();
                out += m.usage().outputTokens();
                System.out.println("  " + t + " → " + Claude.text(m));
            }
            double[] price = Claude.price();
            double sync = (in * price[0] + out * price[1]) / 1_000_000;
            double batch = api.batchCost(in, out, price[0], price[1]);
            System.out.printf("  %d lời gọi đồng bộ: %d token vào, %d token ra ≈ $%.5f · cùng việc qua batch ≈ $%.5f%n",
                TICKETS.size(), in, out, sync, batch);
            System.out.printf("  Với 100.000 ticket như vậy: đồng bộ ≈ $%.2f, batch ≈ $%.2f%n",
                sync / TICKETS.size() * 100_000, batch / TICKETS.size() * 100_000);
            System.out.println("  Bắn nhiều lời gọi đồng bộ song song KHÔNG phải batch: vẫn đủ giá và còn đè lên rate limit.");
        });
    }

    private interface Attempt<T> {
        T get();
    }

    private static <T> String tryCall(Attempt<T> attempt) {
        try {
            return String.valueOf(attempt.get());
        } catch (UnsupportedOperationException e) {
            return "⏳ chưa làm";
        }
    }
}
