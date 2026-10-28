package part2.lesson33;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/** Lời giải mẫu Phần 2 · Bài 33. Hãy tự làm trong Lesson33 trước khi đọc file này. */
public class Lesson33Solution implements Lesson33Api {

    /** Các lớp file, từ ưu tiên cao xuống thấp (CLI chen giữa MANAGED và LOCAL). */
    static final List<Layer> TOP_DOWN = List.of(Layer.MANAGED, Layer.LOCAL, Layer.PROJECT, Layer.USER);

    @Override
    public Layer layerOfPath(String path) {
        if (path.endsWith("managed-settings.json")) return Layer.MANAGED;
        return switch (path) {
            case "~/.claude/settings.json" -> Layer.USER;
            case ".claude/settings.json" -> Layer.PROJECT;
            case ".claude/settings.local.json" -> Layer.LOCAL;
            default -> throw new IllegalArgumentException("đường dẫn lạ: " + path);
        };
    }

    @Override
    public boolean isCommitted(Layer layer) {
        return layer == Layer.PROJECT;
    }

    @Override
    public boolean needsWorkspaceTrust(Layer layer) {
        return layer == Layer.PROJECT;
    }

    @Override
    public Resolved resolve(Map<Layer, Map<String, Object>> layers, String key, Object cliValue) {
        if (defines(layers, Layer.MANAGED, key)) return new Resolved(layers.get(Layer.MANAGED).get(key), "managed");
        if (cliValue != null) return new Resolved(cliValue, "cli");
        for (Layer layer : TOP_DOWN) {
            if (defines(layers, layer, key)) return new Resolved(layers.get(layer).get(key), layer.name().toLowerCase());
        }
        return new Resolved(null, null);
    }

    @Override
    public List<Layer> definedIn(Map<Layer, Map<String, Object>> layers, String key) {
        List<Layer> found = new ArrayList<>();
        for (Layer layer : TOP_DOWN) {
            if (defines(layers, layer, key)) found.add(layer);
        }
        return found;
    }

    private static boolean defines(Map<Layer, Map<String, Object>> layers, Layer layer, String key) {
        Map<String, Object> values = layers.get(layer);
        return values != null && values.containsKey(key);
    }

    @Override
    public Layer whereToPut(String item) {
        return switch (item) {
            case "team permission rule", "shared hook" -> Layer.PROJECT;
            case "personal override", "api token", "machine-specific path" -> Layer.LOCAL;
            case "preference for all my projects" -> Layer.USER;
            case "company policy" -> Layer.MANAGED;
            default -> throw new IllegalArgumentException("mục lạ: " + item);
        };
    }
}
