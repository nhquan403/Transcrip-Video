package part2.lesson21;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import part2.lesson21.Lesson21Api.Validated;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson21Api api = useSolution ? new Lesson21Solution() : new Lesson21();
        Checker c = new Checker();

        c.check("Bài 1: retry lỗi tạm thời là đúng", () ->
            assertEquals(List.of(), api.wrongRetries(Set.of(0, 408, 429, 500, 503, 529))));
        c.check("Bài 1: retry request sai, schema sai, sai key là lỗi review phải gắn cờ", () ->
            assertEquals(List.of(400, 401, 422), api.wrongRetries(Set.of(429, 401, 500, 400, 422))));

        c.check("Bài 2: trượt thì hỏi lại kèm lỗi cụ thể, đạt thì dừng", () -> {
            List<String> prompts = new ArrayList<>();
            Validated v = api.generateValidated(p -> {
                prompts.add(p);
                return prompts.size() == 1 ? "[\"a\", \"b\"]" : "[\"a\", \"b\", \"c\"]";
            }, "List exactly 3 items as a JSON array.", out -> out.split(",").length == 3 ? Optional.empty()
                : Optional.of("expected 3 items, got " + out.split(",").length), 3);
            assertEquals("[\"a\", \"b\", \"c\"]", v.output());
            assertEquals(2, v.attempts());
            assertTrue(prompts.get(1).contains("expected 3 items, got 2"), "lần hai phải mang lỗi cụ thể");
            assertTrue(prompts.get(1).startsWith("List exactly 3 items"), "giữ prompt gốc");
        });
        c.check("Bài 2: hết lượt vẫn trượt thì báo lỗi, không trả output sai", () -> {
            IllegalStateException e = expectThrows(IllegalStateException.class, () ->
                api.generateValidated(p -> "sai", "x", out -> Optional.of("bad shape"), 2));
            assertTrue(e.getMessage().contains("bad shape"), "thông báo phải chứa lỗi cuối");
        });

        c.check("Bài 3: chấp nhận số nguyên và chuỗi chữ số", () -> {
            assertEquals(3, api.requireInt(Map.of("quantity", 3), "quantity"));
            assertEquals(3, api.requireInt(Map.of("quantity", 3.0), "quantity"));
            assertEquals(12, api.requireInt(Map.of("quantity", " 12 "), "quantity"));
        });
        c.check("Bài 3: thiếu, null hay sai kiểu thì thất bại rõ ràng", () -> {
            Map<String, Object> withNull = new HashMap<>();
            withNull.put("quantity", null);
            assertEquals("missing field: quantity",
                expectThrows(IllegalArgumentException.class, () -> api.requireInt(withNull, "quantity")).getMessage());
            assertEquals("field quantity is not an integer: ba",
                expectThrows(IllegalArgumentException.class, () -> api.requireInt(Map.of("quantity", "ba"), "quantity")).getMessage());
            expectThrows(IllegalArgumentException.class, () -> api.requireInt(Map.of("quantity", 2.5), "quantity"));
        });

        c.check("Bài 4: PR nhỏ, tập trung thì review được; to hoặc trộn refactor với tính năng thì không", () -> {
            assertTrue(!api.tooBigToReview(3, 120, false), "PR nhỏ");
            assertTrue(api.tooBigToReview(14, 120, false), "quá nhiều file");
            assertTrue(api.tooBigToReview(4, 900, false), "quá nhiều dòng");
            assertTrue(api.tooBigToReview(2, 50, true), "trộn refactor và tính năng");
        });

        return c.summary();
    }
}
