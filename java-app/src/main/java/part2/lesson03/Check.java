package part2.lesson03;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.List;
import java.util.Map;
import part2.lesson03.Lesson03Api.BatchResult;
import part2.lesson03.Lesson03Api.Deployment;
import part2.lesson03.Lesson03Api.DeliveryMode;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson03Api api = useSolution ? new Lesson03Solution() : new Lesson03();
        Checker c = new Checker();

        c.check("Bài 1: ngân sách cho Claude là phần còn lại sau overhead", () -> {
            assertEquals(1500L, api.modelBudgetMs(2000, List.of(150L, 100L, 250L)));
            assertEquals(0L, api.modelBudgetMs(500, List.of(400L, 300L)));
        });
        c.check("Bài 2: 1,5 giây ngân sách, mỗi lời gọi 700ms thì chỉ vừa 2 lời gọi tuần tự", () -> {
            assertEquals(2, api.maxSequentialCalls(1500, 700));
            assertTrue(api.maxSequentialCalls(1500, 700) < 5, "agent 5 lời gọi tuần tự đã bị loại");
        });
        c.check("Bài 3: không ai chờ thì batch; kịp thì sync; không kịp thì streaming", () -> {
            assertEquals(DeliveryMode.BATCH, api.chooseMode(false, 2000, 500));
            assertEquals(DeliveryMode.SYNC, api.chooseMode(true, 2000, 1800));
            assertEquals(DeliveryMode.STREAMING, api.chooseMode(true, 2000, 9000));
        });
        c.check("Bài 4: concurrency theo rate limit, ít nhất 1", () -> {
            assertEquals(6, api.maxConcurrency(120, 3));
            assertEquals(1, api.maxConcurrency(10, 2));
            assertEquals(25, api.maxConcurrency(500, 3.1));
        });
        c.check("Bài 5: phần vượt được xếp hàng sang phút sau", () -> {
            assertEquals(3, api.minutesToDrain(250, 100));
            assertEquals(1, api.minutesToDrain(100, 100));
            assertEquals(0, api.minutesToDrain(0, 100));
        });
        c.check("Bài 6: residency cứng mà API first-party nằm ngoài vùng cho phép thì ghim vùng trên cloud platform", () -> {
            assertEquals(Deployment.CLOUD_PLATFORM_REGION,
                api.chooseDeployment(true, List.of("eu-west-1", "eu-central-1"), List.of("us-east-1")));
            assertEquals(Deployment.FIRST_PARTY_API, api.chooseDeployment(false, List.of("eu-west-1"), List.of("us-east-1")));
            assertEquals(Deployment.FIRST_PARTY_API, api.chooseDeployment(true, List.of("us-east-1", "eu-west-1"), List.of("us-east-1")));
        });
        c.check("Bài 7: cache chỉ có lời khi prefix được dùng lại", () -> {
            double[] five = api.prefixCost(10_000, 5);
            assertEquals(50_000.0, five[0]);
            assertTrue(Math.abs(five[1] - 16_500) < 1e-6, "có cache phải là 16.500, nhận " + five[1]);
            double[] once = api.prefixCost(10_000, 1);
            assertTrue(once[1] > once[0], "chỉ gọi một lần thì cache đắt hơn (phí ghi 1.25)");
        });
        c.check("Bài 8: kết quả về lộn xộn vẫn ghép đúng theo customId", () -> {
            Map<String, String> m = api.matchBatch(List.of("t-1", "t-2", "t-3"), List.of(
                new BatchResult("t-3", "bug"), new BatchResult("t-1", "billing"), new BatchResult("t-2", "account")));
            assertEquals(List.of("t-1", "t-2", "t-3"), List.copyOf(m.keySet()));
            assertEquals("billing", m.get("t-1"));
            assertEquals("bug", m.get("t-3"));
        });
        c.check("Bài 8: thiếu kết quả thì báo lỗi, không lặng lẽ bỏ qua", () ->
            expectThrows(IllegalStateException.class, () ->
                api.matchBatch(List.of("t-1", "t-2"), List.of(new BatchResult("t-2", "x")))));

        return c.summary();
    }
}
