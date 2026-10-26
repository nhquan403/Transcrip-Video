package part2.lesson02;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import part2.lesson02.Lesson02Api.ResponseKind;
import part2.lesson02.Lesson02Api.Turn;

public final class Check {
    private Check() {}

    static Map<String, String> contactSchema() {
        Map<String, String> schema = new LinkedHashMap<>();
        schema.put("name", "string");
        schema.put("email", "string");
        schema.put("seats", "number");
        schema.put("tags", "array");
        return schema;
    }

    public static boolean run(boolean useSolution) {
        Lesson02Api api = useSolution ? new Lesson02Solution() : new Lesson02();
        Checker c = new Checker();
        Map<String, String> schema = contactSchema();

        c.check("Bài 1: JSON đúng hợp đồng thì không có lỗi", () -> assertEquals(List.of(),
            api.formatErrors("{\"name\":\"An\",\"email\":\"an@x.vn\",\"seats\":3,\"tags\":[\"vip\"]}", schema)));
        c.check("Bài 1: câu từ chối bằng lời hoặc JSON bọc trong code fence đều không phải JSON", () -> {
            assertEquals(List.of("not JSON"), api.formatErrors("Xin lỗi, tôi chỉ hỗ trợ câu hỏi về tài khoản.", schema));
            assertEquals(List.of("not JSON"), api.formatErrors("```json\n{\"name\":\"An\"}\n```", schema));
            assertEquals(List.of("not JSON"), api.formatErrors("[1, 2, 3]", schema));
        });
        c.check("Bài 1: thiếu trường, sai kiểu, trường thừa", () -> assertEquals(
            List.of("wrong type: email", "wrong type: seats", "missing: tags", "unexpected: plan"),
            api.formatErrors("{\"name\":\"An\",\"email\":null,\"seats\":\"3\",\"plan\":\"pro\"}", schema)));

        String doc = "Refunds are available within 30 days of purchase.\nAfter 30 days, credit is issued instead.";
        c.check("Bài 2: trích dẫn có thật trong tài liệu, khoảng trắng khác vẫn tính", () ->
            assertTrue(api.isGrounded(List.of("within 30 days  of purchase", "After 30 days, credit"), doc), "phải grounded"));
        c.check("Bài 2: một trích dẫn bịa là không đạt; không trích gì cũng không đạt", () -> {
            assertTrue(!api.isGrounded(List.of("within 30 days", "within 60 days"), doc), "trích dẫn bịa");
            assertTrue(!api.isGrounded(List.of(), doc), "không có trích dẫn nào");
        });

        c.check("Bài 3: tỉ lệ khớp nhãn", () -> assertEquals(0.75,
            api.behaviorAccuracy(List.of("billing", "bug", "bug", "refuse"), List.of("billing", "bug", "account", "refuse"))));
        c.check("Bài 3: dữ liệu lệch độ dài là lỗi", () ->
            expectThrows(IllegalArgumentException.class, () -> api.behaviorAccuracy(List.of("a"), List.of("a", "b"))));

        c.check("Bài 4: refusal và max_tokens đọc từ stop_reason", () -> {
            assertEquals(ResponseKind.REFUSAL, api.classify("refusal", false));
            assertEquals(ResponseKind.TRUNCATED, api.classify("max_tokens", false));
        });
        c.check("Bài 4: từ chối bằng lời với end_turn bị format check bắt", () -> {
            assertEquals(ResponseKind.CONTRACT_BROKEN, api.classify("end_turn", false));
            assertEquals(ResponseKind.OK, api.classify("end_turn", true));
        });

        c.check("Bài 5: tìm lượt thiếu output mong đợi hoặc thiếu check", () -> assertEquals(
            List.of("turn 2: missing check", "turn 3: missing expected output", "turn 3: missing check"),
            api.specGaps(List.of(
                new Turn("Gửi ảnh hóa đơn", "JSON {vendor, total, date}", "JSON hợp lệ theo schema"),
                new Turn("Hỏi 'tổng tiền là bao nhiêu?'", "Số tiền khớp trường total", "  "),
                new Turn("Hỏi chuyện thời tiết", null, null)))));

        return c.summary();
    }
}
