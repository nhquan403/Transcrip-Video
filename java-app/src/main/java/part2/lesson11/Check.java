package part2.lesson11;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.List;
import part2.lesson11.Lesson11Api.Segment;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson11Api api = useSolution ? new Lesson11Solution() : new Lesson11();
        Checker c = new Checker();

        c.check("Bài 1: tools trước, rồi system, rồi messages", () -> assertEquals(
            List.of("tool:search", "tool:lookup", "sys:policy", "msg:hỏi"),
            api.render(List.of("tool:search", "tool:lookup"), List.of("sys:policy"), List.of("msg:hỏi"))));

        c.check("Bài 2: chỉ phần đầu giống hệt mới dùng lại được", () -> {
            List<String> a = List.of("tool:search", "sys:policy", "msg:1", "msg:2");
            assertEquals(4, api.cachedPrefixLength(a, a));
            assertEquals(2, api.cachedPrefixLength(a, List.of("tool:search", "sys:policy", "msg:1 ", "msg:2")));
        });
        c.check("Bài 2: đổi bộ tool (nằm đầu prefix) là mất sạch cache", () ->
            assertEquals(0, api.cachedPrefixLength(List.of("tool:search", "sys:policy"), List.of("tool:fetch", "sys:policy"))));

        c.check("Bài 3: ổn định trước, thay đổi sau breakpoint cuối là đúng", () -> assertEquals(List.of(), api.checkBreakpoints(List.of(
            new Segment("tools", false, false), new Segment("system", false, true), new Segment("lịch sử", false, true),
            new Segment("câu hỏi mới", true, false)))));
        c.check("Bài 3: ngày giờ nhét trong system nằm trong prefix được cache, và quá 4 breakpoint", () -> assertEquals(
            List.of("too many breakpoints: 5", "volatile segment 1 is inside the cached prefix"),
            api.checkBreakpoints(List.of(new Segment("tools", false, true), new Segment("Hôm nay 2026-10-26 14:03", true, true),
                new Segment("a", false, true), new Segment("b", false, true), new Segment("c", false, true),
                new Segment("câu hỏi", true, false)))));

        c.check("Bài 4: phí ghi một lần, đọc rẻ các lần sau", () -> {
            assertTrue(Math.abs(api.cachedCost(10_000, 3, "5m") - 14_500) < 1e-6, "5m: 12.500 + 2 × 1.000");
            assertTrue(Math.abs(api.cachedCost(10_000, 3, "1h") - 22_000) < 1e-6, "1h: 20.000 + 2 × 1.000");
            expectThrows(IllegalArgumentException.class, () -> api.cachedCost(10, 2, "10m"));
        });
        c.check("Bài 5: 5 phút hoàn vốn sau khoảng một lần dùng lại", () -> {
            assertTrue(!api.worthCaching("claude-opus-4-8", 5_000, 1, "5m"), "chỉ dùng 1 lần thì cache đắt hơn");
            assertTrue(api.worthCaching("claude-opus-4-8", 5_000, 2, "5m"), "1,25 + 0,1 < 2");
            assertTrue(!api.worthCaching("claude-opus-4-8", 5_000, 2, "1h"), "1h: 2 + 0,1 > 2");
        });
        c.check("Bài 5: dưới mức tối thiểu của model thì không cache được", () -> {
            assertTrue(!api.worthCaching("claude-opus-4-7", 1_500, 50, "5m"), "Opus 4.7 cần 2048 token");
            assertTrue(api.worthCaching("claude-opus-4-8", 1_500, 50, "5m"), "Opus 4.8 cần 1024 token");
        });

        return c.summary();
    }
}
