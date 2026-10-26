package part2.lesson09;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

/** Lời giải mẫu Phần 2 · Bài 09. Hãy tự làm trong Lesson09 trước khi đọc file này. */
public class Lesson09Solution implements Lesson09Api {

    private static final ObjectMapper JSON = new ObjectMapper();
    private static final Set<String> MEDIA_TYPES = Set.of("image/jpeg", "image/png", "image/gif", "image/webp");

    @Override
    public List<String> eventNames(String sse) {
        return sse.lines().filter(l -> l.startsWith("event:")).map(l -> l.substring(6).trim()).toList();
    }

    @Override
    public boolean validOrder(List<String> events) {
        List<String> e = events.stream().filter(x -> !x.equals("ping") && !x.equals("error")).toList();
        if (e.size() < 3 || !e.get(0).equals("message_start")) return false;
        if (!e.get(e.size() - 1).equals("message_stop") || !e.get(e.size() - 2).equals("message_delta")) return false;
        boolean inBlock = false;
        for (String name : e.subList(1, e.size() - 2)) {
            switch (name) {
                case "content_block_start" -> {
                    if (inBlock) return false;
                    inBlock = true;
                }
                case "content_block_delta" -> {
                    if (!inBlock) return false;
                }
                case "content_block_stop" -> {
                    if (!inBlock) return false;
                    inBlock = false;
                }
                default -> {
                    return false;
                }
            }
        }
        return !inBlock;
    }

    @Override
    @SuppressWarnings("unchecked")
    public Assembled assemble(List<Map<String, Object>> events) {
        Map<Integer, Map<String, Object>> blocks = new TreeMap<>();
        Map<Integer, StringBuilder> text = new TreeMap<>();
        Map<Integer, StringBuilder> json = new TreeMap<>();
        String stopReason = null;
        long outputTokens = 0;
        for (Map<String, Object> ev : events) {
            int index = ev.get("index") instanceof Number n ? n.intValue() : -1;
            switch (String.valueOf(ev.get("type"))) {
                case "content_block_start" -> blocks.put(index, new LinkedHashMap<>((Map<String, Object>) ev.get("content_block")));
                case "content_block_delta" -> {
                    Map<String, Object> delta = (Map<String, Object>) ev.get("delta");
                    if ("text_delta".equals(delta.get("type"))) {
                        text.computeIfAbsent(index, i -> new StringBuilder()).append(delta.get("text"));
                    } else if ("input_json_delta".equals(delta.get("type"))) {
                        json.computeIfAbsent(index, i -> new StringBuilder()).append(delta.get("partial_json"));
                    }
                }
                case "content_block_stop" -> {
                    Map<String, Object> block = blocks.get(index);
                    if (text.containsKey(index)) block.put("text", text.get(index).toString());
                    if (json.containsKey(index)) block.put("input", parse(json.get(index).toString()));
                }
                case "message_delta" -> {
                    Map<String, Object> delta = (Map<String, Object>) ev.get("delta");
                    stopReason = (String) delta.get("stop_reason");
                    Map<String, Object> usage = (Map<String, Object>) ev.get("usage");
                    if (usage != null && usage.get("output_tokens") instanceof Number n) outputTokens = n.longValue();
                }
                default -> { }
            }
        }
        return new Assembled(new ArrayList<>(blocks.values()), stopReason, outputTokens);
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> parse(String json) {
        try {
            return json.isEmpty() ? Map.of() : JSON.readValue(json, Map.class);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("tool input không phải JSON hoàn chỉnh: " + json, e);
        }
    }

    @Override
    public long imageTokens(int width, int height, int maxLongEdge) {
        if (width > 8000 || height > 8000) throw new IllegalArgumentException("ảnh vượt 8000 px sẽ bị từ chối");
        int longEdge = Math.max(width, height);
        if (longEdge > maxLongEdge) {
            width = (int) ((long) width * maxLongEdge / longEdge);
            height = (int) ((long) height * maxLongEdge / longEdge);
        }
        return (long) Math.ceil(width / 28.0) * (long) Math.ceil(height / 28.0);
    }

    @Override
    public Map<String, Object> imageBlock(String kind, String value, String mediaType) {
        Map<String, Object> source = new LinkedHashMap<>();
        switch (kind) {
            case "base64" -> {
                if (!MEDIA_TYPES.contains(mediaType)) throw new IllegalArgumentException("định dạng ảnh không hỗ trợ: " + mediaType);
                source.put("type", "base64");
                source.put("media_type", mediaType);
                source.put("data", value);
            }
            case "url" -> {
                source.put("type", "url");
                source.put("url", value);
            }
            case "file" -> {
                source.put("type", "file");
                source.put("file_id", value);
            }
            default -> throw new IllegalArgumentException("cách cấp ảnh lạ: " + kind);
        }
        return Map.of("type", "image", "source", source);
    }
}
