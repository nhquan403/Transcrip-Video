package part2.lesson07;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Lời giải mẫu Phần 2 · Bài 07. Hãy tự làm trong Lesson07 trước khi đọc file này. */
public class Lesson07Solution implements Lesson07Api {

    @Override
    public List<String> validate(Request request) {
        List<String> errors = new ArrayList<>();
        if (request.model() == null || request.model().isBlank()) errors.add("missing model");
        if (request.maxTokens() == null || request.maxTokens() <= 0) errors.add("max_tokens must be > 0");
        List<Turn> messages = request.messages() == null ? List.of() : request.messages();
        if (messages.isEmpty()) errors.add("messages must not be empty");
        else if (!"user".equals(messages.get(0).role())) errors.add("first turn must be user");
        for (Turn t : messages) {
            if ("system".equals(t.role())) errors.add("system belongs in the top-level system field");
            else if (!"user".equals(t.role()) && !"assistant".equals(t.role())) errors.add("unknown role: " + t.role());
        }
        return errors;
    }

    @Override
    public List<Turn> mergeSameRole(List<Turn> messages) {
        List<Turn> merged = new ArrayList<>();
        for (Turn t : messages) {
            int last = merged.size() - 1;
            if (last >= 0 && merged.get(last).role().equals(t.role())) {
                List<Object> blocks = new ArrayList<>(blocks(merged.get(last).content()));
                blocks.addAll(blocks(t.content()));
                merged.set(last, new Turn(t.role(), blocks));
            } else {
                merged.add(t);
            }
        }
        return merged;
    }

    private static List<?> blocks(Object content) {
        if (content instanceof String s) return List.of(Map.of("type", "text", "text", s));
        return (List<?>) content;
    }

    @Override
    public List<Turn> appendExchange(List<Turn> history, List<Map<String, Object>> assistantBlocks, String userText) {
        List<Turn> next = new ArrayList<>(history);
        next.add(new Turn("assistant", assistantBlocks));
        next.add(new Turn("user", userText));
        return next;
    }

    @Override
    public Map<String, Object> toBody(Request request) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", request.model());
        body.put("max_tokens", request.maxTokens());
        if (request.system() != null) body.put("system", request.system());
        List<Map<String, Object>> messages = new ArrayList<>();
        for (Turn t : request.messages()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("role", t.role());
            m.put("content", t.content());
            messages.add(m);
        }
        body.put("messages", messages);
        return body;
    }
}
