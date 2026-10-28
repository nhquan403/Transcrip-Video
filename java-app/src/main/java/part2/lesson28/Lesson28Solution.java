package part2.lesson28;

import com.fasterxml.jackson.databind.JsonNode;
import common.RawApi;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/** Lời giải mẫu Phần 2 · Bài 28. Hãy tự làm trong Lesson28 trước khi đọc file này. */
public class Lesson28Solution implements Lesson28Api {

    @Override
    public State apply(State state, String command) {
        String[] parts = command.trim().split("\\s+");
        Set<String> markets = new HashSet<>(state.marketplaces());
        Map<String, Boolean> installed = new LinkedHashMap<>(state.installed());
        if (parts.length == 3 && parts[0].equals("marketplace") && parts[1].equals("add")) {
            markets.add(parts[2]);
        } else if (parts.length == 2 && parts[0].equals("install")) {
            int at = parts[1].indexOf('@');
            if (at <= 0 || at == parts[1].length() - 1) throw new IllegalArgumentException("cần dạng name@marketplace: " + parts[1]);
            String market = parts[1].substring(at + 1);
            if (!markets.contains(market)) throw new IllegalStateException("chưa đăng ký marketplace: " + market);
            installed.put(parts[1], true);
        } else if (parts.length == 2 && Set.of("enable", "disable", "uninstall").contains(parts[0])) {
            if (!installed.containsKey(parts[1])) throw new IllegalStateException("chưa cài: " + parts[1]);
            if (parts[0].equals("uninstall")) installed.remove(parts[1]);
            else installed.put(parts[1], parts[0].equals("enable"));
        } else {
            throw new IllegalArgumentException("lệnh lạ: " + command);
        }
        return new State(Set.copyOf(markets), Map.copyOf(installed));
    }

    @Override
    public List<String> list(State state, String filter) {
        return state.installed().entrySet().stream()
            .filter(e -> switch (filter) {
                case "all" -> true;
                case "enabled" -> e.getValue();
                case "disabled" -> !e.getValue();
                default -> throw new IllegalArgumentException("filter lạ: " + filter);
            })
            .map(Map.Entry::getKey)
            .sorted()
            .toList();
    }

    @Override
    public String pluginId(String pluginJson, String marketplace) {
        JsonNode root;
        try {
            root = RawApi.JSON.readTree(pluginJson);
        } catch (Exception e) {
            throw new IllegalArgumentException("plugin.json hỏng", e);
        }
        String name = root == null ? "" : root.path("name").asText("");
        if (name.isBlank()) throw new IllegalArgumentException("plugin.json thiếu name");
        return name + "@" + marketplace;
    }

    @Override
    public Home whereItBelongs(String change) {
        return switch (change) {
            case "slash command", "skill", "subagent", "hook bundle", "mcp server", "lsp server" -> Home.PLUGIN;
            case "coding convention", "natural language guidance" -> Home.CLAUDE_MD;
            case "permission rule", "machine-readable option" -> Home.SETTINGS_JSON;
            default -> throw new IllegalArgumentException("thay đổi lạ: " + change);
        };
    }
}
