package part2.lesson29;

import java.util.List;
import java.util.Map;

/**
 * Bài tập Phần 2 · Bài 29. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-29"
 */
public class Lesson29 implements Lesson29Api {

    @Override
    public Scope chooseScope(boolean adminEnforced, boolean forEveryone, boolean onlyThisRepo) {
        throw new UnsupportedOperationException("TODO bài 1: plugin này nên áp rộng tới đâu?");
    }

    @Override
    public List<Boolean> traits(Scope scope) {
        throw new UnsupportedOperationException("TODO bài 2: chia sẻ? commit? tự sửa được?");
    }

    @Override
    public Map<String, Object> projectSettings(List<String> plugins, Map<String, String> marketplaces,
                                               Map<String, Map<String, Object>> configs) {
        throw new UnsupportedOperationException("TODO bài 3: enabledPlugins, extraKnownMarketplaces, pluginConfigs");
    }

    @Override
    public List<String> uninstalledBy(String action, String target, List<Plugin> installed) {
        throw new UnsupportedOperationException("TODO bài 4: gỡ marketplace kéo theo những plugin nào?");
    }

    @Override
    public List<String> reviewAfterPull(List<Plugin> before, List<Plugin> after) {
        throw new UnsupportedOperationException("TODO bài 5: plugin nào mới hoặc đổi version sau khi pull?");
    }
}
