package part2.lesson33;

import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 33: Layering User, Project, and Local Config.
 * {@link Lesson33} là chỗ bạn làm bài, {@link Lesson33Solution} là lời giải mẫu.
 */
public interface Lesson33Api {

    /** Bốn lớp cấu hình, khai báo từ rộng nhất tới bị khóa chặt nhất. */
    enum Layer { USER, PROJECT, LOCAL, MANAGED }

    /** Giá trị có hiệu lực và nguồn của nó: "managed", "cli", "local", "project" hoặc "user". */
    record Resolved(Object value, String source) {}

    /**
     * Bài 1 (đọc đường dẫn): "~/.claude/settings.json" → USER; ".claude/settings.json" → PROJECT;
     * ".claude/settings.local.json" → LOCAL; đường dẫn nào kết thúc bằng "managed-settings.json" → MANAGED
     * (file policy do IT triển khai). Khác: IllegalArgumentException.
     */
    Layer layerOfPath(String path);

    /** Bài 2a: lớp nào được commit vào git và đi theo repo tới cả nhóm? Chỉ PROJECT. */
    boolean isCommitted(Layer layer);

    /**
     * Bài 2b: allow rule của lớp nào cần workspace trust trước khi có hiệu lực? Chỉ lớp dùng chung qua repo (PROJECT);
     * LOCAL là file của riêng bạn nên không cần trust prompt.
     */
    boolean needsWorkspaceTrust(Layer layer);

    /**
     * Bài 3 (precedence): layers ánh xạ mỗi lớp tới các key nó định nghĩa (lớp vắng mặt = không định nghĩa gì).
     * cliValue là giá trị từ đối số dòng lệnh (null = không truyền). Thứ tự thắng: MANAGED > CLI > LOCAL > PROJECT > USER.
     * Trả về Resolved(giá trị, nguồn) của lớp cao nhất có key; không ai định nghĩa → Resolved(null, null).
     */
    Resolved resolve(Map<Layer, Map<String, Object>> layers, String key, Object cliValue);

    /**
     * Bài 4 (debug: kiểm tra mọi lớp): danh sách các lớp có định nghĩa key, xếp từ ưu tiên CAO xuống THẤP
     * (MANAGED, LOCAL, PROJECT, USER). Không lớp nào có → danh sách rỗng.
     */
    List<Layer> definedIn(Map<Layer, Map<String, Object>> layers, String key);

    /**
     * Bài 5 (đặt vào lớp nào): "team permission rule" → PROJECT; "shared hook" → PROJECT; "personal override" → LOCAL;
     * "api token" → LOCAL; "machine-specific path" → LOCAL; "preference for all my projects" → USER;
     * "company policy" → MANAGED. Khác: IllegalArgumentException.
     */
    Layer whereToPut(String item);
}
