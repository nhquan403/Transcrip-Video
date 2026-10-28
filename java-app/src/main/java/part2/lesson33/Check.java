package part2.lesson33;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;

import common.Checker;
import java.util.List;
import java.util.Map;
import part2.lesson33.Lesson33Api.Layer;
import part2.lesson33.Lesson33Api.Resolved;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson33Api api = useSolution ? new Lesson33Solution() : new Lesson33();
        Checker c = new Checker();

        Map<Layer, Map<String, Object>> layers = Map.of(
            Layer.USER, Map.of("model", "opus", "theme", "dark", "effort", "low"),
            Layer.PROJECT, Map.of("model", "sonnet", "effort", "medium"),
            Layer.LOCAL, Map.of("effort", "high"),
            Layer.MANAGED, Map.of("disableBypass", true));

        c.check("Bài 1: đường dẫn cho biết lớp", () -> {
            assertEquals(Layer.USER, api.layerOfPath("~/.claude/settings.json"));
            assertEquals(Layer.PROJECT, api.layerOfPath(".claude/settings.json"));
            assertEquals(Layer.LOCAL, api.layerOfPath(".claude/settings.local.json"));
            assertEquals(Layer.MANAGED, api.layerOfPath("/etc/claude-code/managed-settings.json"));
        });
        c.check("Bài 2: committed = dùng chung với mọi người; gitignored = của riêng bạn", () -> {
            assertTrue(api.isCommitted(Layer.PROJECT), "project được commit");
            assertTrue(!api.isCommitted(Layer.LOCAL), "local bị gitignore");
            assertTrue(!api.isCommitted(Layer.USER), "user nằm ở home, không ở repo");
            assertTrue(api.needsWorkspaceTrust(Layer.PROJECT), "rule dùng chung cần workspace trust");
            assertTrue(!api.needsWorkspaceTrust(Layer.LOCAL), "rule local không cần trust prompt");
        });
        c.check("Bài 3: local thắng project, project thắng user", () -> {
            assertEquals(new Resolved("high", "local"), api.resolve(layers, "effort", null));
            assertEquals(new Resolved("sonnet", "project"), api.resolve(layers, "model", null));
            assertEquals(new Resolved("dark", "user"), api.resolve(layers, "theme", null));
            assertEquals(new Resolved(null, null), api.resolve(layers, "nope", null));
        });
        c.check("Bài 3: CLI đứng trên local; managed thắng tất cả, kể cả CLI", () -> {
            assertEquals(new Resolved("max", "cli"), api.resolve(layers, "effort", "max"));
            assertEquals(new Resolved(true, "managed"), api.resolve(layers, "disableBypass", false));
            assertEquals(new Resolved("x", "cli"), api.resolve(Map.of(), "anything", "x"));
        });
        c.check("Bài 4: liệt kê lớp có key, từ trên xuống", () -> {
            Map<Layer, Map<String, Object>> stuck = Map.of(
                Layer.USER, Map.of("allowWebFetch", true),
                Layer.LOCAL, Map.of("allowWebFetch", true),
                Layer.MANAGED, Map.of("allowWebFetch", false));
            assertEquals(List.of(Layer.MANAGED, Layer.LOCAL, Layer.USER), api.definedIn(stuck, "allowWebFetch"));
            assertEquals(List.of(Layer.LOCAL, Layer.PROJECT, Layer.USER), api.definedIn(layers, "effort"));
            assertEquals(List.of(), api.definedIn(layers, "nope"));
        });
        c.check("Bài 5: chia sẻ ở chỗ cần chia sẻ, riêng tư ở chỗ cần riêng tư", () -> {
            assertEquals(Layer.PROJECT, api.whereToPut("team permission rule"));
            assertEquals(Layer.PROJECT, api.whereToPut("shared hook"));
            assertEquals(Layer.LOCAL, api.whereToPut("api token"));
            assertEquals(Layer.LOCAL, api.whereToPut("personal override"));
            assertEquals(Layer.LOCAL, api.whereToPut("machine-specific path"));
            assertEquals(Layer.USER, api.whereToPut("preference for all my projects"));
            assertEquals(Layer.MANAGED, api.whereToPut("company policy"));
        });

        return c.summary();
    }
}
