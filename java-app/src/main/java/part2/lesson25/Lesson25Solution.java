package part2.lesson25;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/** Lời giải mẫu Phần 2 · Bài 25. Hãy tự làm trong Lesson25 trước khi đọc file này. */
public class Lesson25Solution implements Lesson25Api {

    private static final Set<String> TRUSTED = Set.of("system_prompt", "developer_instructions");

    @Override
    public boolean isTrusted(String source) {
        return TRUSTED.contains(source);
    }

    @Override
    public String wrap(String tag, String content) {
        String close = "</" + tag + ">";
        String safe = content.replace(close, "&lt;/" + tag + "&gt;");
        return "<" + tag + ">\n" + safe + "\n" + close;
    }

    @Override
    public Map<String, Object> buildRequest(String instructions, List<Document> docs, String question) {
        String data = docs.stream().map(d -> wrap("document", d.content())).collect(Collectors.joining("\n\n"));
        String user = data.isEmpty() ? question : data + "\n\n" + question;
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("system", instructions);
        body.put("messages", List.of(Map.of("role", "user", "content", user)));
        return body;
    }

    @Override
    public String redact(String text) {
        return text
            .replaceAll("[\\w.+-]+@[\\w-]+(\\.[\\w-]+)+", "[EMAIL]")
            .replaceAll("\\b\\d{4}([ -]?\\d{4}){3}\\b", "[CARD]")
            .replaceAll("\\b0\\d{9}\\b", "[PHONE]");
    }

    @Override
    public List<String> validateAction(Map<String, Object> payload, Set<String> allowedActions, double maxAmount) {
        List<String> errors = new ArrayList<>();
        Object action = payload.get("action");
        if (!(action instanceof String a) || !allowedActions.contains(a)) errors.add("action not allowed: " + action);
        if (payload.containsKey("amount")) {
            Object amount = payload.get("amount");
            if (!(amount instanceof Number n)) errors.add("amount must be a number");
            else if (n.doubleValue() > maxAmount) errors.add("amount exceeds limit");
        }
        return errors;
    }
}
