package part2.lesson28;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.List;
import java.util.Map;
import part2.lesson28.Lesson28Api.Home;
import part2.lesson28.Lesson28Api.State;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson28Api api = useSolution ? new Lesson28Solution() : new Lesson28();
        Checker c = new Checker();

        c.check("Bài 1: thêm marketplace không cài gì; cài plugin là bước thứ hai", () -> {
            State s0 = Lesson28Api.initial();
            State s1 = api.apply(s0, "marketplace add acme-tools");
            assertTrue(s1.marketplaces().contains("acme-tools"), "đã đăng ký catalog");
            assertEquals(Map.of(), s1.installed());
            State s2 = api.apply(s1, "install formatter@acme-tools");
            assertEquals(Map.of("formatter@acme-tools", true), s2.installed());
            assertEquals(Map.of(), s1.installed());
        });
        c.check("Bài 1: marketplace chính thức có sẵn; chưa đăng ký hoặc thiếu @ thì lỗi", () -> {
            State s = api.apply(Lesson28Api.initial(), "install github@" + Lesson28Api.OFFICIAL);
            assertEquals(Map.of("github@claude-plugins-official", true), s.installed());
            expectThrows(IllegalStateException.class, () -> api.apply(Lesson28Api.initial(), "install formatter@acme-tools"));
            expectThrows(IllegalArgumentException.class, () -> api.apply(Lesson28Api.initial(), "install formatter"));
        });
        c.check("Bài 2: disable giữ plugin đã cài, uninstall gỡ hẳn", () -> {
            State s = api.apply(api.apply(Lesson28Api.initial(), "marketplace add acme"), "install lint@acme");
            State off = api.apply(s, "disable lint@acme");
            assertEquals(Map.of("lint@acme", false), off.installed());
            assertEquals(Map.of("lint@acme", true), api.apply(off, "enable lint@acme").installed());
            assertEquals(Map.of(), api.apply(off, "uninstall lint@acme").installed());
            expectThrows(IllegalStateException.class, () -> api.apply(s, "disable ghost@acme"));
        });
        c.check("Bài 3: list lọc all / enabled / disabled", () -> {
            State s = new State(java.util.Set.of(Lesson28Api.OFFICIAL),
                Map.of("b@m", true, "a@m", false, "c@m", true));
            assertEquals(List.of("a@m", "b@m", "c@m"), api.list(s, "all"));
            assertEquals(List.of("b@m", "c@m"), api.list(s, "enabled"));
            assertEquals(List.of("a@m"), api.list(s, "disabled"));
            expectThrows(IllegalArgumentException.class, () -> api.list(s, "broken"));
        });
        c.check("Bài 4: plugin.json nhận diện plugin", () -> {
            assertEquals("code-review@acme",
                api.pluginId("{\"name\":\"code-review\",\"version\":\"1.2.0\",\"description\":\"Review PRs\"}", "acme"));
            expectThrows(IllegalArgumentException.class, () -> api.pluginId("{\"version\":\"1.0.0\"}", "acme"));
            expectThrows(IllegalArgumentException.class, () -> api.pluginId("{\"name\":\"\"}", "acme"));
            expectThrows(IllegalArgumentException.class, () -> api.pluginId("{name:", "acme"));
        });
        c.check("Bài 5: plugin cho năng lực, CLAUDE.md cho chỉ dẫn, settings.json cho cấu hình", () -> {
            assertEquals(Home.PLUGIN, api.whereItBelongs("slash command"));
            assertEquals(Home.PLUGIN, api.whereItBelongs("mcp server"));
            assertEquals(Home.PLUGIN, api.whereItBelongs("lsp server"));
            assertEquals(Home.CLAUDE_MD, api.whereItBelongs("coding convention"));
            assertEquals(Home.SETTINGS_JSON, api.whereItBelongs("permission rule"));
            expectThrows(IllegalArgumentException.class, () -> api.whereItBelongs("coffee"));
        });

        return c.summary();
    }
}
