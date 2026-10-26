package part2.lesson13;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

/** Lời giải mẫu Phần 2 · Bài 13. Hãy tự làm trong Lesson13 trước khi đọc file này. */
public class Lesson13Solution implements Lesson13Api {

    private static final Pattern CUSTOM_ID = Pattern.compile("[A-Za-z0-9_-]{1,64}");

    @Override
    public boolean validCustomId(String customId) {
        return customId != null && CUSTOM_ID.matcher(customId).matches();
    }

    @Override
    public List<String> validate(List<Entry> entries) {
        List<String> errors = new ArrayList<>();
        Set<String> seen = new HashSet<>();
        for (Entry e : entries) {
            String id = e.customId();
            if (!validCustomId(id)) errors.add("invalid custom_id: " + id);
            if (!seen.add(id)) errors.add("duplicate custom_id: " + id);
            if (e.params().containsKey("stream")) errors.add(id + ": stream is not allowed in a batch");
            if (e.params().containsKey("speed")) errors.add(id + ": speed is not allowed in a batch");
            Object max = e.params().get("max_tokens");
            if (!(max instanceof Number n) || n.longValue() < 1) errors.add(id + ": max_tokens must be at least 1");
        }
        return errors;
    }

    @Override
    public Map<String, Object> toBatchParams(Map<String, Object> syncRequest) {
        Map<String, Object> params = new LinkedHashMap<>(syncRequest);
        params.remove("stream");
        params.remove("speed");
        return params;
    }

    @Override
    public WriteBack writeBack(Map<String, String> inputs, List<Result> results) {
        Map<String, Result> byId = new HashMap<>();
        for (Result r : results) {
            if (!inputs.containsKey(r.customId())) throw new IllegalStateException("kết quả lạ: " + r.customId());
            byId.put(r.customId(), r);
        }
        Map<String, String> outputs = new LinkedHashMap<>();
        List<String> retry = new ArrayList<>();
        for (String id : inputs.keySet()) {
            Result r = byId.get(id);
            if (r != null && "succeeded".equals(r.type())) outputs.put(id, r.output());
            else retry.add(id);
        }
        return new WriteBack(outputs, retry);
    }
}
