package part2.lesson09;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.List;
import java.util.Map;
import part2.lesson09.Lesson09Api.Assembled;

public final class Check {
    private Check() {}

    static final String SSE = """
        event: message_start
        data: {"type":"message_start","message":{"content":[]}}

        event: content_block_start
        data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

        event: ping
        data: {"type":"ping"}

        event: content_block_delta
        data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Xin "}}

        event: content_block_stop
        data: {"type":"content_block_stop","index":0}

        event: message_delta
        data: {"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":2}}

        event: message_stop
        data: {"type":"message_stop"}
        """;

    static List<Map<String, Object>> toolStream() {
        return List.of(
            Map.of("type", "message_start", "message", Map.of("content", List.of())),
            Map.of("type", "content_block_start", "index", 0, "content_block", Map.of("type", "text", "text", "")),
            Map.of("type", "content_block_delta", "index", 0, "delta", Map.of("type", "text_delta", "text", "Để mình ")),
            Map.of("type", "content_block_delta", "index", 0, "delta", Map.of("type", "text_delta", "text", "tra cứu.")),
            Map.of("type", "content_block_stop", "index", 0),
            Map.of("type", "content_block_start", "index", 1, "content_block",
                Map.of("type", "tool_use", "id", "toolu_9", "name", "lookup_order", "input", Map.of())),
            Map.of("type", "content_block_delta", "index", 1, "delta", Map.of("type", "input_json_delta", "partial_json", "{\"id\": \"A")),
            Map.of("type", "content_block_delta", "index", 1, "delta", Map.of("type", "input_json_delta", "partial_json", "12\", \"lang")),
            Map.of("type", "content_block_delta", "index", 1, "delta", Map.of("type", "input_json_delta", "partial_json", "\": \"vi\"}")),
            Map.of("type", "content_block_stop", "index", 1),
            Map.of("type", "message_delta", "delta", Map.of("stop_reason", "tool_use"), "usage", Map.of("output_tokens", 41)),
            Map.of("type", "message_stop"));
    }

    public static boolean run(boolean useSolution) {
        Lesson09Api api = useSolution ? new Lesson09Solution() : new Lesson09();
        Checker c = new Checker();

        c.check("Bài 1: đọc tên sự kiện theo thứ tự", () -> assertEquals(
            List.of("message_start", "content_block_start", "ping", "content_block_delta", "content_block_stop", "message_delta", "message_stop"),
            api.eventNames(SSE)));

        c.check("Bài 2: thứ tự chuẩn (có ping xen giữa) là hợp lệ", () -> assertTrue(api.validOrder(List.of("message_start", "ping",
            "content_block_start", "content_block_delta", "content_block_delta", "content_block_stop",
            "content_block_start", "content_block_stop", "message_delta", "message_stop")), "phải hợp lệ"));
        c.check("Bài 2: delta ngoài block, thiếu message_delta, block chưa đóng đều không hợp lệ", () -> {
            assertTrue(!api.validOrder(List.of("message_start", "content_block_delta", "message_delta", "message_stop")), "delta ngoài block");
            assertTrue(!api.validOrder(List.of("message_start", "content_block_start", "content_block_stop", "message_stop")), "thiếu message_delta");
            assertTrue(!api.validOrder(List.of("message_start", "content_block_start", "message_delta", "message_stop")), "block chưa đóng");
        });

        c.check("Bài 3: ghép text và parse input của tool một lần ở cuối block", () -> {
            Assembled a = api.assemble(toolStream());
            assertEquals(2, a.blocks().size());
            assertEquals("Để mình tra cứu.", a.blocks().get(0).get("text"));
            assertEquals(Map.of("id", "A12", "lang", "vi"), a.blocks().get(1).get("input"));
            assertEquals("lookup_order", a.blocks().get(1).get("name"));
        });
        c.check("Bài 3: stop_reason và usage chỉ có ở message_delta gần cuối", () -> {
            Assembled a = api.assemble(toolStream());
            assertEquals("tool_use", a.stopReason());
            assertEquals(41L, a.outputTokens());
        });

        c.check("Bài 4: mỗi ô 28×28 là một visual token", () -> {
            assertEquals(4L, api.imageTokens(56, 56, 2576));
            assertEquals(4L * 3, api.imageTokens(100, 70, 2576));
        });
        c.check("Bài 4: cạnh dài vượt mức của model thì thu nhỏ, vượt 8000 px thì bị từ chối", () -> {
            assertEquals(api.imageTokens(2576, 1288, 2576), api.imageTokens(5152, 2576, 2576));
            assertTrue(api.imageTokens(4000, 3000, 2576) < api.imageTokens(4000, 3000, 8000), "model cạnh dài hơn thì nhiều token hơn");
            expectThrows(IllegalArgumentException.class, () -> api.imageTokens(9000, 100, 2576));
        });

        c.check("Bài 5: ba cách cấp ảnh", () -> {
            assertEquals(Map.of("type", "image", "source", Map.of("type", "base64", "media_type", "image/png", "data", "iVBOR")),
                api.imageBlock("base64", "iVBOR", "image/png"));
            assertEquals(Map.of("type", "image", "source", Map.of("type", "url", "url", "https://example.com/a.jpg")),
                api.imageBlock("url", "https://example.com/a.jpg", null));
            assertEquals(Map.of("type", "image", "source", Map.of("type", "file", "file_id", "file_011")),
                api.imageBlock("file", "file_011", null));
        });
        c.check("Bài 5: định dạng ảnh không hỗ trợ bị chặn", () ->
            expectThrows(IllegalArgumentException.class, () -> api.imageBlock("base64", "x", "image/bmp")));

        return c.summary();
    }
}
