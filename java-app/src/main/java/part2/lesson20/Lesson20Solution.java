package part2.lesson20;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/** Lời giải mẫu Phần 2 · Bài 20. Hãy tự làm trong Lesson20 trước khi đọc file này. */
public class Lesson20Solution implements Lesson20Api {

    private static final ObjectMapper JSON = new ObjectMapper();

    @Override
    public Placement placement(String path) {
        String p = path.replace('\\', '/');
        String name = p.substring(p.lastIndexOf('/') + 1);
        if (name.equals(".env") || name.startsWith(".env.") || name.endsWith(".pem")) return Placement.NEVER_COMMIT_SECRET;
        if (p.endsWith(".claude/settings.local.json") || name.equals("CLAUDE.local.md")) return Placement.KEEP_LOCAL;
        return Placement.COMMIT_SHARED;
    }

    @Override
    public Bump requiredBump(boolean breaksExistingCallers, boolean addsFunctionality) {
        if (breaksExistingCallers) return Bump.MAJOR;
        return addsFunctionality ? Bump.MINOR : Bump.PATCH;
    }

    @Override
    public String bump(String version, Bump bump) {
        if (!version.matches("\\d+\\.\\d+\\.\\d+")) throw new IllegalArgumentException("không phải MAJOR.MINOR.PATCH: " + version);
        String[] parts = version.split("\\.");
        int major = Integer.parseInt(parts[0]);
        int minor = Integer.parseInt(parts[1]);
        int patch = Integer.parseInt(parts[2]);
        return switch (bump) {
            case MAJOR -> (major + 1) + ".0.0";
            case MINOR -> major + "." + (minor + 1) + ".0";
            case PATCH -> major + "." + minor + "." + (patch + 1);
        };
    }

    @Override
    public List<String> ciCheck(Map<String, String> files) {
        List<String> errors = new ArrayList<>();
        for (var e : new TreeMap<>(files).entrySet()) {
            String path = e.getKey().replace('\\', '/');
            String content = e.getValue();
            if (path.endsWith(".json")) {
                JsonNode node;
                try {
                    node = JSON.readTree(content);
                } catch (IOException ex) {
                    errors.add(path + ": invalid JSON");
                    continue;
                }
                if (path.endsWith(".claude/settings.json") && node != null && node.path("model").asText().contains("latest")) {
                    errors.add(path + ": model is not pinned");
                }
            }
            if (path.endsWith("CLAUDE.md") && content.isBlank()) errors.add(path + ": empty CLAUDE.md");
            if ((path.startsWith("prompts/") || path.contains("/prompts/")) && content.lines().anyMatch(l -> l.contains("TODO"))) {
                errors.add(path + ": unfinished prompt");
            }
        }
        return errors;
    }
}
