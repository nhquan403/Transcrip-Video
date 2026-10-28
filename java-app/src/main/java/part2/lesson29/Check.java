package part2.lesson29;

import static common.Checker.assertEquals;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import part2.lesson29.Lesson29Api.Plugin;
import part2.lesson29.Lesson29Api.Scope;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson29Api api = useSolution ? new Lesson29Solution() : new Lesson29();
        Checker c = new Checker();

        c.check("Bài 1: bốn scope trả lời một câu hỏi: plugin áp rộng tới đâu?", () -> {
            assertEquals(Scope.USER, api.chooseScope(false, false, false));
            assertEquals(Scope.PROJECT, api.chooseScope(false, true, false));
            assertEquals(Scope.LOCAL, api.chooseScope(false, false, true));
            assertEquals(Scope.MANAGED, api.chooseScope(true, true, false));
        });
        c.check("Bài 2: cá nhân (user, local) và chia sẻ (project qua repo, managed khóa bởi admin)", () -> {
            assertEquals(List.of(false, false, true), api.traits(Scope.USER));
            assertEquals(List.of(false, false, true), api.traits(Scope.LOCAL));
            assertEquals(List.of(true, true, true), api.traits(Scope.PROJECT));
            assertEquals(List.of(true, false, false), api.traits(Scope.MANAGED));
        });
        c.check("Bài 3: settings file của project ghi đủ ba khóa", () -> {
            Map<String, String> markets = Map.of("acme-tools", "github:acme/claude-plugins");
            Map<String, Map<String, Object>> configs = Map.of("formatter", Map.of("lineWidth", 100));
            Map<String, Object> s = api.projectSettings(List.of("formatter", "reviewer"), markets, configs);
            Map<String, Boolean> enabled = new LinkedHashMap<>();
            enabled.put("formatter", true);
            enabled.put("reviewer", true);
            assertEquals(List.of("enabledPlugins", "extraKnownMarketplaces", "pluginConfigs"), List.copyOf(s.keySet()));
            assertEquals(enabled, s.get("enabledPlugins"));
            assertEquals(markets, s.get("extraKnownMarketplaces"));
            assertEquals(configs, s.get("pluginConfigs"));
        });
        c.check("Bài 3: chỉ dùng marketplace chính thức thì không có extraKnownMarketplaces", () ->
            assertEquals(List.of("enabledPlugins"), List.copyOf(api.projectSettings(List.of("x"), Map.of(), null).keySet())));

        List<Plugin> installed = List.of(
            new Plugin("lint-helper", "acme-tools", "1.0.0", Scope.PROJECT, true),
            new Plugin("db-docs", "acme-tools", "2.1.0", Scope.USER, false),
            new Plugin("commit-msg", "official", "0.3.0", Scope.USER, true));
        c.check("Bài 4: disable chỉ tạm dừng, uninstall xóa một plugin", () -> {
            assertEquals(List.of(), api.uninstalledBy("disable", "lint-helper", installed));
            assertEquals(List.of("lint-helper"), api.uninstalledBy("uninstall", "lint-helper", installed));
            assertEquals(List.of(), api.uninstalledBy("uninstall", "ghost", installed));
        });
        c.check("Bài 4: gỡ marketplace kéo theo mọi plugin của nó", () -> {
            assertEquals(List.of("db-docs", "lint-helper"), api.uninstalledBy("remove-marketplace", "acme-tools", installed));
            expectThrows(IllegalArgumentException.class, () -> api.uninstalledBy("purge", "x", installed));
        });

        c.check("Bài 5: pull về thì xem lại plugin mới hoặc đổi version trước khi chạy", () -> {
            List<Plugin> after = List.of(
                new Plugin("lint-helper", "acme-tools", "1.1.0", Scope.PROJECT, true),
                new Plugin("db-docs", "acme-tools", "2.1.0", Scope.USER, false),
                new Plugin("commit-msg", "official", "0.3.0", Scope.USER, true),
                new Plugin("deploy-bot", "acme-tools", "0.1.0", Scope.PROJECT, true),
                new Plugin("old-thing", "acme-tools", "9.9.9", Scope.PROJECT, false));
            assertEquals(List.of("deploy-bot", "lint-helper"), api.reviewAfterPull(installed, after));
        });

        return c.summary();
    }
}
