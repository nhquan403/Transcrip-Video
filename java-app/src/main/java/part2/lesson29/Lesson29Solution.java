package part2.lesson29;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** Lời giải mẫu Phần 2 · Bài 29. Hãy tự làm trong Lesson29 trước khi đọc file này. */
public class Lesson29Solution implements Lesson29Api {

    @Override
    public Scope chooseScope(boolean adminEnforced, boolean forEveryone, boolean onlyThisRepo) {
        if (adminEnforced) return Scope.MANAGED;
        if (forEveryone) return Scope.PROJECT;
        if (onlyThisRepo) return Scope.LOCAL;
        return Scope.USER;
    }

    @Override
    public List<Boolean> traits(Scope scope) {
        boolean shared = scope == Scope.PROJECT || scope == Scope.MANAGED;
        return List.of(shared, scope == Scope.PROJECT, scope != Scope.MANAGED);
    }

    @Override
    public Map<String, Object> projectSettings(List<String> plugins, Map<String, String> marketplaces,
                                               Map<String, Map<String, Object>> configs) {
        Map<String, Object> settings = new LinkedHashMap<>();
        if (plugins != null && !plugins.isEmpty()) {
            Map<String, Boolean> enabled = new LinkedHashMap<>();
            plugins.forEach(p -> enabled.put(p, true));
            settings.put("enabledPlugins", enabled);
        }
        if (marketplaces != null && !marketplaces.isEmpty()) settings.put("extraKnownMarketplaces", marketplaces);
        if (configs != null && !configs.isEmpty()) settings.put("pluginConfigs", configs);
        return settings;
    }

    @Override
    public List<String> uninstalledBy(String action, String target, List<Plugin> installed) {
        return switch (action) {
            case "disable" -> List.of();
            case "uninstall" -> installed.stream().map(Plugin::name).filter(target::equals).limit(1).toList();
            case "remove-marketplace" -> installed.stream().filter(p -> p.marketplace().equals(target))
                .map(Plugin::name).sorted().toList();
            default -> throw new IllegalArgumentException("action lạ: " + action);
        };
    }

    @Override
    public List<String> reviewAfterPull(List<Plugin> before, List<Plugin> after) {
        Map<String, String> old = before.stream().collect(Collectors.toMap(Plugin::name, Plugin::version, (a, b) -> a));
        return after.stream().filter(Plugin::enabled)
            .filter(p -> !p.version().equals(old.get(p.name())))
            .map(Plugin::name).sorted().toList();
    }
}
