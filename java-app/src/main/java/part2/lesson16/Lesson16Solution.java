package part2.lesson16;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

/** Lời giải mẫu Phần 2 · Bài 16. Hãy tự làm trong Lesson16 trước khi đọc file này. */
public class Lesson16Solution implements Lesson16Api {

    private static final ObjectMapper JSON = new ObjectMapper();

    @Override
    public String jsonType(Object value) {
        if (value == null) return "null";
        if (value instanceof Map<?, ?>) return "object";
        if (value instanceof List<?>) return "array";
        if (value instanceof String) return "string";
        if (value instanceof Number) return "number";
        if (value instanceof Boolean) return "boolean";
        throw new IllegalArgumentException("không phải giá trị JSON: " + value.getClass());
    }

    @Override
    public List<String> missingCoreKeys(Map<String, Object> body) {
        return List.of("model", "messages", "max_tokens").stream().filter(k -> !body.containsKey(k)).toList();
    }

    @Override
    public String extractAnswer(String responseJson) {
        JsonNode root;
        try {
            root = JSON.readTree(responseJson);
        } catch (IOException e) {
            throw new IllegalArgumentException("không phải JSON", e);
        }
        if (root == null || !root.isObject() || !root.path("content").isArray()) {
            throw new IllegalArgumentException("response không có mảng content");
        }
        StringBuilder answer = new StringBuilder();
        for (JsonNode block : root.get("content")) {
            if ("text".equals(block.path("type").asText())) answer.append(block.path("text").asText());
        }
        return answer.toString();
    }

    @Override
    public long base64Length(long rawBytes) {
        return 4 * ((rawBytes + 2) / 3);
    }

    @Override
    public long estimateBodyBytes(String text, List<Long> imageRawBytes) {
        long total = text.getBytes(StandardCharsets.UTF_8).length;
        for (long bytes : imageRawBytes) total += base64Length(bytes);
        return total;
    }
}
