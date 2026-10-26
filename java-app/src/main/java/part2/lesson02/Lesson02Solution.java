package part2.lesson02;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/** Lời giải mẫu Phần 2 · Bài 02. Hãy tự làm trong Lesson02 trước khi đọc file này. */
public class Lesson02Solution implements Lesson02Api {

    private static final ObjectMapper JSON = new ObjectMapper();

    @Override
    public List<String> formatErrors(String output, Map<String, String> schema) {
        Object parsed;
        try {
            parsed = JSON.readValue(output, Object.class);
        } catch (JsonProcessingException e) {
            return List.of("not JSON");
        }
        if (!(parsed instanceof Map<?, ?> object)) return List.of("not JSON");

        List<String> errors = new ArrayList<>();
        schema.forEach((field, type) -> {
            if (!object.containsKey(field)) errors.add("missing: " + field);
            else if (!hasType(object.get(field), type)) errors.add("wrong type: " + field);
        });
        for (Object key : object.keySet()) {
            if (!schema.containsKey(key)) errors.add("unexpected: " + key);
        }
        return errors;
    }

    private static boolean hasType(Object value, String type) {
        return switch (type) {
            case "string" -> value instanceof String;
            case "number" -> value instanceof Number;
            case "boolean" -> value instanceof Boolean;
            case "array" -> value instanceof List<?>;
            default -> throw new IllegalArgumentException("kiểu lạ trong schema: " + type);
        };
    }

    @Override
    public boolean isGrounded(List<String> quotes, String source) {
        String doc = normalize(source);
        return !quotes.isEmpty() && quotes.stream().allMatch(q -> !normalize(q).isEmpty() && doc.contains(normalize(q)));
    }

    private static String normalize(String s) {
        return s.replaceAll("\\s+", " ").trim();
    }

    @Override
    public double behaviorAccuracy(List<String> predicted, List<String> labels) {
        if (predicted.isEmpty() || predicted.size() != labels.size()) {
            throw new IllegalArgumentException("cần hai danh sách cùng độ dài và không rỗng");
        }
        long hits = 0;
        for (int i = 0; i < labels.size(); i++) {
            if (labels.get(i).equals(predicted.get(i))) hits++;
        }
        return (double) hits / labels.size();
    }

    @Override
    public ResponseKind classify(String stopReason, boolean passesFormatCheck) {
        return switch (stopReason) {
            case "refusal" -> ResponseKind.REFUSAL;
            case "max_tokens" -> ResponseKind.TRUNCATED;
            default -> passesFormatCheck ? ResponseKind.OK : ResponseKind.CONTRACT_BROKEN;
        };
    }

    @Override
    public List<String> specGaps(List<Turn> turns) {
        List<String> gaps = new ArrayList<>();
        for (int i = 0; i < turns.size(); i++) {
            Turn t = turns.get(i);
            if (blank(t.expectedOutput())) gaps.add("turn " + (i + 1) + ": missing expected output");
            if (blank(t.successCheck())) gaps.add("turn " + (i + 1) + ": missing check");
        }
        return gaps;
    }

    private static boolean blank(String s) {
        return s == null || s.isBlank();
    }
}
