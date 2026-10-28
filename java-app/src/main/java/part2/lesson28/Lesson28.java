package part2.lesson28;

import java.util.List;

/**
 * Bài tập Phần 2 · Bài 28. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-28"
 */
public class Lesson28 implements Lesson28Api {

    @Override
    public State apply(State state, String command) {
        throw new UnsupportedOperationException("TODO bài 1-2: thêm marketplace không cài gì; install/enable/disable/uninstall");
    }

    @Override
    public List<String> list(State state, String filter) {
        throw new UnsupportedOperationException("TODO bài 3: lọc all / enabled / disabled, sắp xếp tăng dần");
    }

    /** Gợi ý: dùng common.RawApi.JSON.readTree(...) (Jackson). */
    @Override
    public String pluginId(String pluginJson, String marketplace) {
        throw new UnsupportedOperationException("TODO bài 4: name trong plugin.json + \"@\" + marketplace");
    }

    @Override
    public Home whereItBelongs(String change) {
        throw new UnsupportedOperationException("TODO bài 5: năng lực, chỉ dẫn hay cấu hình?");
    }
}
