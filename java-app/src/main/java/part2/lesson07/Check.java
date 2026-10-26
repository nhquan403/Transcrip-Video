package part2.lesson07;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;

import common.Checker;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import part2.lesson07.Lesson07Api.Request;
import part2.lesson07.Lesson07Api.Turn;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson07Api api = useSolution ? new Lesson07Solution() : new Lesson07();
        Checker c = new Checker();
        List<Turn> ok = List.of(new Turn("user", "Xin chào"));

        c.check("Bài 1: request đủ ba trường bắt buộc và lượt đầu là user thì hợp lệ", () ->
            assertEquals(List.of(), api.validate(new Request("claude-opus-4-8", 1024, "Bạn là gia sư.", ok))));
        c.check("Bài 1: thiếu model, max_tokens, messages", () -> assertEquals(
            List.of("missing model", "max_tokens must be > 0", "messages must not be empty"),
            api.validate(new Request(null, null, null, List.of()))));
        c.check("Bài 1: lượt đầu là assistant, system lọt vào messages, role lạ", () -> assertEquals(
            List.of("first turn must be user", "system belongs in the top-level system field", "unknown role: tool"),
            api.validate(new Request("m", 100, null, List.of(new Turn("assistant", "Chào bạn"),
                new Turn("system", "Hãy trả lời ngắn"), new Turn("tool", "42"))))));

        c.check("Bài 2: hai lượt user liền nhau bị gộp thành danh sách block", () -> {
            List<Turn> merged = api.mergeSameRole(List.of(new Turn("user", "Câu 1"), new Turn("user", "Câu 2"),
                new Turn("assistant", "Trả lời"), new Turn("user", "Câu 3")));
            assertEquals(3, merged.size());
            assertEquals(List.of(Map.of("type", "text", "text", "Câu 1"), Map.of("type", "text", "text", "Câu 2")),
                merged.get(0).content());
            assertEquals("Trả lời", merged.get(1).content());
        });
        c.check("Bài 2: gộp block với chuỗi vẫn giữ thứ tự", () -> {
            Map<String, Object> image = Map.of("type", "image", "source", Map.of("type", "url", "url", "https://x/y.png"));
            List<Turn> merged = api.mergeSameRole(List.of(new Turn("user", List.of(image)), new Turn("user", "Ảnh này có gì?")));
            assertEquals(List.of(image, Map.of("type", "text", "text", "Ảnh này có gì?")), merged.get(0).content());
        });

        c.check("Bài 3: nối lượt assistant giữ nguyên block (kể cả tool_use) và lượt user mới", () -> {
            List<Turn> history = new ArrayList<>(ok);
            List<Map<String, Object>> reply = List.of(
                Map.of("type", "thinking", "thinking", "...", "signature", "sig-abc"),
                Map.of("type", "text", "text", "Chào An!"));
            List<Turn> next = api.appendExchange(history, reply, "Tôi tên gì?");
            assertEquals(3, next.size());
            assertEquals(new Turn("assistant", reply), next.get(1));
            assertEquals(new Turn("user", "Tôi tên gì?"), next.get(2));
            assertEquals(1, history.size());
        });

        c.check("Bài 4: system ở cấp cao nhất, không nằm trong messages", () -> {
            Map<String, Object> body = api.toBody(new Request("claude-opus-4-8", 512, "Trả lời bằng tiếng Việt.", ok));
            assertEquals("claude-opus-4-8", body.get("model"));
            assertEquals(512, body.get("max_tokens"));
            assertEquals("Trả lời bằng tiếng Việt.", body.get("system"));
            assertEquals(List.of(Map.of("role", "user", "content", "Xin chào")), body.get("messages"));
        });
        c.check("Bài 4: không có system thì không có khóa system", () ->
            assertTrue(!api.toBody(new Request("m", 10, null, ok)).containsKey("system"), "không được có khóa system"));

        return c.summary();
    }
}
