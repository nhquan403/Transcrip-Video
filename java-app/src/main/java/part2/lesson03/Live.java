package part2.lesson03;

import common.Claude;
import common.LiveSection;
import java.util.List;
import part2.lesson03.Lesson03Api.DeliveryMode;

/**
 * Phần 2 · Bài 03 chạy với Claude thật: đo độ trễ thật của cùng một câu hỏi theo kiểu sync và streaming,
 * rồi để code của bạn quyết định ngân sách và cách trả kết quả.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-03 --live"
 */
public final class Live {
    private Live() {}

    static final String SYSTEM = "You are a support assistant. Answer in Vietnamese, in about 120 words.";
    static final String QUESTION = "Giải thích ngắn gọn vì sao một vòng lặp agent gửi lại lịch sử ngày càng dài thì tốn tiền.";

    public static void run(boolean useSolution, Claude claude) {
        Lesson03Api api = useSolution ? new Lesson03Solution() : new Lesson03();

        LiveSection.run("Đo thời gian thật: sync chờ trọn câu trả lời, streaming có chữ đầu tiên rất sớm", () -> {
            long budget = api.modelBudgetMs(2500, List.of(200L, 100L, 200L));
            System.out.println("  Người dùng chịu được 2.500ms, overhead 500ms → ngân sách cho Claude: " + budget + "ms");

            long t0 = System.nanoTime();
            claude.create(Claude.params().system(SYSTEM).addUserMessage(QUESTION).build());
            long syncMs = (System.nanoTime() - t0) / 1_000_000;

            long[] firstText = {-1};
            long t1 = System.nanoTime();
            claude.stream(Claude.params().system(SYSTEM).addUserMessage(QUESTION).build(), text -> {
                if (firstText[0] < 0 && !text.isBlank()) firstText[0] = (System.nanoTime() - t1) / 1_000_000;
            });
            long streamMs = (System.nanoTime() - t1) / 1_000_000;

            System.out.println("  Sync: người dùng nhìn màn hình trống " + syncMs + "ms");
            System.out.println("  Streaming: chữ đầu tiên sau " + firstText[0] + "ms, xong toàn bộ sau " + streamMs + "ms");
            System.out.println("  chooseMode của bạn (có người chờ): " + api.chooseMode(true, budget, syncMs));
            System.out.println("  chooseMode của bạn (báo cáo chạy đêm): " + api.chooseMode(false, budget, syncMs));
            int calls = api.maxSequentialCalls(budget, Math.max(1, syncMs));
            System.out.println("  Vừa ngân sách được " + calls + " lời gọi tuần tự như vậy"
                + (calls < 5 ? " → agent 5 bước tuần tự đã bị loại ngay từ con số." : "."));
            if (api.chooseMode(true, budget, syncMs) == DeliveryMode.STREAMING) {
                System.out.println("  Streaming giúp đạt độ trễ CẢM NHẬN mà model không cần nhanh hơn.");
            }
        });

        System.out.println("\n▶ Định cỡ thông lượng (không gọi API)");
        System.out.println("  Rate limit 50 request/phút, mỗi request ~4 giây → tối đa "
            + tryCall(() -> api.maxConcurrency(50, 4)) + " request bay cùng lúc");
        System.out.println("  Cao điểm 180 request trong một phút với sức chứa 50/phút → cần "
            + tryCall(() -> api.minutesToDrain(180, 50)) + " phút để xếp hàng xử lý hết");
        System.out.println("  Prefix 20.000 token dùng lại 50 lần (không cache / có cache): " + tryCall(() -> {
            double[] cost = api.prefixCost(20_000, 50);
            return String.format("%,.0f / %,.0f token quy đổi", cost[0], cost[1]);
        }));
    }

    private interface Attempt<T> {
        T get();
    }

    private static <T> String tryCall(Attempt<T> attempt) {
        try {
            return String.valueOf(attempt.get());
        } catch (UnsupportedOperationException e) {
            return "⏳ chưa làm (" + e.getMessage() + ")";
        }
    }
}
