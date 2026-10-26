package part1.lesson10;

import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.Tool;
import common.Claude;
import common.LiveSection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Predicate;
import java.util.function.UnaryOperator;
import part1.lesson09.ClaudeApi;
import part1.lesson10.Lesson10Api.Decision;
import part1.lesson10.Lesson10Api.HarnessResult;
import part1.lesson10.Lesson10Api.Policy;

/**
 * Bài 10 chạy với Claude thật: harness của bạn bọc quanh vòng lặp, chặn thao tác nguy hiểm, thử lại lỗi mạng,
 * ghi nhật ký từng lượt; và parse partial JSON thật lấy từ stream.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p1-10 --live"
 */
public final class Live {
    private Live() {}

    /** Lỗi thoáng qua giả lập (ví dụ timeout mạng): đáng thử lại. */
    static final class NetworkTimeout extends RuntimeException {
        NetworkTimeout() {
            super("network timeout");
        }
    }

    public static void run(boolean useSolution, Claude claude) {
        Lesson10Api api = useSolution ? new Lesson10Solution() : new Lesson10();

        LiveSection.run("Partial JSON thật: input của tool đến từng mảnh khi streaming", () -> {
            api.parseToolInput(List.of("{}")); // chưa làm bài 1 thì chưa gọi API
            Tool searchTool = Tool.builder()
                .name("search_orders")
                .description("Search orders. Provide customer name and a date in YYYY-MM-DD.")
                .eagerInputStreaming(true)
                .inputSchema(Tool.InputSchema.builder()
                    .properties(Tool.InputSchema.Properties.builder()
                        .putAdditionalProperty("customer", JsonValue.from(Map.of("type", "string")))
                        .putAdditionalProperty("date", JsonValue.from(Map.of("type", "string")))
                        .build())
                    .required(List.of("customer", "date"))
                    .build())
                .build();
            List<String> deltas = claude.streamToolInputDeltas(Claude.params()
                .addTool(searchTool)
                .addUserMessage("Use search_orders to find orders of customer Nguyen Van An on 2026-10-25.")
                .build());
            System.out.println("  " + deltas.size() + " mảnh nhận được: " + deltas);
            System.out.println("  parseToolInput() → " + api.parseToolInput(deltas));
        });

        LiveSection.run("Harness: chặn trước, thử lại quanh lúc chạy, ghi nhật ký sau", () -> {
            AtomicInteger attempts = new AtomicInteger();
            Map<String, UnaryOperator<String>> tools = Map.of(
                "query_db", sql -> {
                    if (attempts.incrementAndGet() == 1) throw new NetworkTimeout();
                    return "orders_today = 128";
                },
                "drop_table", table -> "dropped " + table);
            Policy noDrops = call -> call.name().startsWith("drop") || call.input().toUpperCase().contains("DROP")
                ? Decision.BLOCK : Decision.ALLOW;
            Predicate<RuntimeException> retryable = e -> e instanceof NetworkTimeout;
            ClaudeApi claudeApi = new ClaudeApi(claude,
                "You are a database assistant. Do what the user asks using the tools. Answer in Vietnamese in two sentences.",
                Map.of("query_db", "Run a read-only SQL query. Input: the SQL.",
                    "drop_table", "Drop a database table. Input: the table name."));
            HarnessResult result = api.run(
                "Đếm số đơn hàng hôm nay trong bảng orders, rồi xóa bảng orders_backup.",
                claudeApi, tools, noDrops, 4, 3, retryable);
            System.out.println("  Dừng vì: " + result.stop() + " sau " + result.turns() + " lượt");
            result.log().forEach(line -> System.out.println("  📝 " + line));
            System.out.println("  Số lần thử query_db: " + attempts.get());
            if (result.answer() != null) System.out.println("  → " + result.answer());
        });
    }
}
