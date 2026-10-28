package part2.lesson28;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Phần 2 · Bài 28: Installing and Configuring Plugins.
 * {@link Lesson28} là chỗ bạn làm bài, {@link Lesson28Solution} là lời giải mẫu.
 */
public interface Lesson28Api {

    /** Marketplace chính thức, có sẵn ngay từ đầu. */
    String OFFICIAL = "claude-plugins-official";

    /**
     * Trạng thái quản lý plugin (bất biến). marketplaces: các catalog đã đăng ký.
     * installed: plugin id dạng "name@marketplace" → true nếu đang enabled, false nếu disabled.
     */
    record State(Set<String> marketplaces, Map<String, Boolean> installed) {}

    enum Home { PLUGIN, CLAUDE_MD, SETTINGS_JSON }

    /** Trạng thái ban đầu: chỉ có marketplace OFFICIAL, chưa cài plugin nào. */
    static State initial() {
        return new State(Set.of(OFFICIAL), Map.of());
    }

    /**
     * Bài 1 (luồng hai bước): thực hiện một lệnh và trả về State MỚI (không sửa state cũ).
     * "marketplace add NAME": đăng ký catalog; KHÔNG cài plugin nào.
     * "install NAME@MARKET": cài plugin (ở trạng thái enabled). MARKET chưa đăng ký → IllegalStateException;
     *   thiếu "@MARKET" → IllegalArgumentException.
     * Lệnh khác ở bài 1: IllegalArgumentException (bài 2 thêm lệnh vào chính phương thức này).
     *
     * Bài 2 (tạm dừng hay gỡ hẳn): "disable ID" và "enable ID" đổi cờ nhưng plugin vẫn được cài;
     * "uninstall ID" xóa hẳn khỏi installed. ID chưa được cài → IllegalStateException.
     */
    State apply(State state, String command);

    /**
     * Bài 3 (lệnh list): trả về các plugin id đã cài, sắp xếp tăng dần. filter là "all", "enabled" hoặc "disabled".
     * Khác: IllegalArgumentException.
     */
    List<String> list(State state, String filter);

    /**
     * Bài 4 (manifest plugin.json nhận diện plugin): đọc trường "name" của manifest JSON và trả về id "name@marketplace".
     * Thiếu "name" hoặc name rỗng → IllegalArgumentException. JSON hỏng → IllegalArgumentException.
     */
    String pluginId(String pluginJson, String marketplace);

    /**
     * Bài 5 (ba thứ định hình hành vi): thay đổi đó thuộc về đâu?
     * PLUGIN: "slash command", "skill", "subagent", "hook bundle", "mcp server", "lsp server".
     * CLAUDE_MD: "coding convention", "natural language guidance".
     * SETTINGS_JSON: "permission rule", "machine-readable option".
     * Khác: IllegalArgumentException.
     */
    Home whereItBelongs(String change);
}
