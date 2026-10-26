package part2.lesson13;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import part2.lesson13.Lesson13Api.Entry;
import part2.lesson13.Lesson13Api.Result;
import part2.lesson13.Lesson13Api.WriteBack;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson13Api api = useSolution ? new Lesson13Solution() : new Lesson13();
        Checker c = new Checker();

        c.check("Bài 1: id hợp lệ", () -> {
            for (String id : new String[] {"ticket-1042", "doc_7", "A", "x".repeat(64)}) assertTrue(api.validCustomId(id), id);
        });
        c.check("Bài 1: id rỗng, quá dài, có dấu cách hay gạch chéo", () -> {
            for (String id : new String[] {"", "x".repeat(65), "ticket 1042", "orders/42", "đơn-1"}) assertTrue(!api.validCustomId(id), id);
        });

        Map<String, Object> ok = Map.of("model", "m", "max_tokens", 100, "messages", List.of());
        c.check("Bài 2: batch sạch thì không có lỗi", () ->
            assertEquals(List.of(), api.validate(List.of(new Entry("t-1", ok), new Entry("t-2", ok)))));
        c.check("Bài 2: id sai, id trùng, stream sót lại, max_tokens bằng 0", () -> assertEquals(List.of(
                "invalid custom_id: t 3", "duplicate custom_id: t-1", "t-1: stream is not allowed in a batch",
                "t-4: speed is not allowed in a batch", "t-4: max_tokens must be at least 1"),
            api.validate(List.of(new Entry("t-1", ok), new Entry("t 3", ok),
                new Entry("t-1", Map.of("model", "m", "max_tokens", 100, "stream", true)),
                new Entry("t-4", Map.of("model", "m", "max_tokens", 0, "speed", "fast"))))));

        c.check("Bài 3: bỏ stream và speed, giữ tools, system, thinking", () -> {
            Map<String, Object> sync = new LinkedHashMap<>();
            sync.put("model", "m");
            sync.put("max_tokens", 500);
            sync.put("stream", true);
            sync.put("speed", "fast");
            sync.put("tools", List.of(Map.of("name", "web_search")));
            sync.put("thinking", Map.of("type", "adaptive"));
            Map<String, Object> params = api.toBatchParams(sync);
            assertEquals(List.of("model", "max_tokens", "tools", "thinking"), List.copyOf(params.keySet()));
            assertTrue(sync.containsKey("stream"), "không được sửa map đầu vào");
        });

        Map<String, String> inputs = new LinkedHashMap<>();
        inputs.put("TCK-1", "Trừ tiền hai lần");
        inputs.put("TCK-2", "Nút PDF không chạy");
        inputs.put("TCK-3", "Đổi email đăng nhập");
        inputs.put("TCK-4", "Hóa đơn sai mã số thuế");
        c.check("Bài 4: kết quả lộn xộn vẫn ghép đúng theo custom_id", () -> {
            WriteBack w = api.writeBack(inputs, List.of(new Result("TCK-3", "succeeded", "account"),
                new Result("TCK-1", "succeeded", "billing"), new Result("TCK-4", "expired", null), new Result("TCK-2", "succeeded", "bug")));
            assertEquals(List.of("TCK-1", "TCK-2", "TCK-3"), List.copyOf(w.outputs().keySet()));
            assertEquals("billing", w.outputs().get("TCK-1"));
            assertEquals("account", w.outputs().get("TCK-3"));
            assertEquals(List.of("TCK-4"), w.retry());
        });
        c.check("Bài 4: lỗi và thiếu kết quả đều vào danh sách chạy lại", () ->
            assertEquals(List.of("TCK-2", "TCK-3", "TCK-4"), api.writeBack(inputs, List.of(new Result("TCK-1", "succeeded", "billing"),
                new Result("TCK-2", "errored", null), new Result("TCK-3", "canceled", null))).retry()));
        c.check("Bài 4: kết quả mang custom_id lạ thì báo lỗi", () ->
            expectThrows(IllegalStateException.class, () -> api.writeBack(inputs, List.of(new Result("TCK-9", "succeeded", "x")))));

        return c.summary();
    }
}
