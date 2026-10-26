package part2.lesson16;

import static common.Checker.assertEquals;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public final class Check {
    private Check() {}

    static final String RESPONSE = """
        {"id": "msg_01", "type": "message", "role": "assistant", "model": "claude-opus-4-8",
         "content": [
           {"type": "thinking", "thinking": "", "signature": "sig"},
           {"type": "text", "text": "REST là "},
           {"type": "tool_use", "id": "toolu_1", "name": "lookup", "input": {}},
           {"type": "text", "text": "phong cách API."}],
         "stop_reason": "end_turn", "usage": {"input_tokens": 12, "output_tokens": 9}}""";

    public static boolean run(boolean useSolution) {
        Lesson16Api api = useSolution ? new Lesson16Solution() : new Lesson16();
        Checker c = new Checker();

        c.check("Bài 1: object, array và các scalar", () -> {
            assertEquals("object", api.jsonType(Map.of("model", "x")));
            assertEquals("array", api.jsonType(List.of()));
            assertEquals("string", api.jsonType("xin chào"));
            assertEquals("number", api.jsonType(1024));
            assertEquals("boolean", api.jsonType(true));
            assertEquals("null", api.jsonType(null));
        });

        c.check("Bài 2: thiếu max_tokens là lỗi hay quên nhất", () -> {
            assertEquals(List.of("max_tokens"), api.missingCoreKeys(Map.of("model", "m", "messages", List.of())));
            assertEquals(List.of("model", "messages", "max_tokens"), api.missingCoreKeys(Map.of("system", "s")));
            assertEquals(List.of(), api.missingCoreKeys(Map.of("model", "m", "messages", List.of(), "max_tokens", 10, "tools", List.of())));
        });

        c.check("Bài 3: câu trả lời nằm trong block text, không phải chuỗi ở cấp cao nhất", () ->
            assertEquals("REST là phong cách API.", api.extractAnswer(RESPONSE)));
        c.check("Bài 3: không có block text thì trả về chuỗi rỗng; không phải JSON thì báo lỗi", () -> {
            assertEquals("", api.extractAnswer("{\"content\": [{\"type\": \"tool_use\", \"id\": \"t\", \"name\": \"x\", \"input\": {}}]}"));
            expectThrows(IllegalArgumentException.class, () -> api.extractAnswer("Xin chào"));
            expectThrows(IllegalArgumentException.class, () -> api.extractAnswer("{\"completion\": \"cũ\"}"));
        });

        c.check("Bài 4: Base64 to hơn khoảng một phần ba", () -> {
            assertEquals(4L, api.base64Length(3));
            assertEquals(8L, api.base64Length(4));
            assertEquals(1_333_336L, api.base64Length(1_000_000));
        });

        c.check("Bài 5: đếm byte UTF-8 chứ không đếm ký tự", () -> {
            assertEquals(5L, api.estimateBodyBytes("hello", List.of()));
            assertEquals((long) "Xin chào".getBytes(java.nio.charset.StandardCharsets.UTF_8).length, api.estimateBodyBytes("Xin chào", List.of()));
            assertEquals(5L + 4 + 1_333_336, api.estimateBodyBytes("hello", Arrays.asList(3L, 1_000_000L)));
        });

        return c.summary();
    }
}
