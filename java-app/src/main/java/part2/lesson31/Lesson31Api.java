package part2.lesson31;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Phần 2 · Bài 31: The CLAUDE.md Precedence Hierarchy.
 * {@link Lesson31} là chỗ bạn làm bài, {@link Lesson31Solution} là lời giải mẫu.
 *
 * <p>Quy ước đường dẫn trong bài: managed policy là "/etc/claude-code/CLAUDE.md", file user là "~/.claude/CLAUDE.md",
 * còn lại là đường dẫn tuyệt đối dùng dấu "/" (ví dụ "/repo/app/CLAUDE.md", "/repo/app/CLAUDE.local.md").
 */
public interface Lesson31Api {

    String MANAGED_FILE = "/etc/claude-code/CLAUDE.md";
    String USER_FILE = "~/.claude/CLAUDE.md";

    enum Scope { MANAGED, USER, PROJECT, LOCAL }

    /**
     * Bài 1 (file này thuộc scope nào): bắt đầu bằng "/etc/claude-code/" → MANAGED; bắt đầu bằng "~/.claude/" → USER;
     * tên file là "CLAUDE.local.md" → LOCAL (cá nhân, git-ignored); tên file là "CLAUDE.md" → PROJECT. Khác: IllegalArgumentException.
     */
    Scope scopeOf(String path);

    /**
     * Bài 2 (thứ tự nạp lúc khởi động): `files` là mọi file CLAUDE.md / CLAUDE.local.md có trên máy.
     * Trả về danh sách file được nạp khi mở phiên ở thư mục cwd, theo thứ tự đọc (file cuối nằm gần sự chú ý của model nhất):
     * MANAGED_FILE (nếu có trong files), rồi USER_FILE (nếu có), rồi các file nằm trong cwd hoặc thư mục tổ tiên của cwd,
     * từ gốc "/" đi xuống cwd; trong cùng một thư mục, "CLAUDE.md" trước "CLAUDE.local.md".
     * File trong thư mục CON của cwd KHÔNG nạp lúc khởi động. File nào có trong `excludes` thì bỏ, NGOẠI TRỪ MANAGED_FILE (không bao giờ bị loại).
     */
    List<String> launchOrder(String cwd, Set<String> files, Set<String> excludes);

    /**
     * Bài 3 (nạp theo yêu cầu): khi Claude đọc file `readPath`, những file CLAUDE.md lồng nhau nào được nạp thêm?
     * Là các "CLAUDE.md" / "CLAUDE.local.md" trong `files` nằm ở thư mục con thật sự của cwd (không phải chính cwd)
     * mà là thư mục chứa readPath hoặc tổ tiên của nó. Thứ tự: từ trên xuống; cùng thư mục thì CLAUDE.md trước. Không có → rỗng.
     */
    List<String> loadedOnRead(String cwd, String readPath, Set<String> files);

    /**
     * Bài 4 (import bằng @path): imports cho biết mỗi file chứa những tham chiếu "@đường/dẫn" nào (theo thứ tự xuất hiện).
     * Tham chiếu được phân giải tương đối với THƯ MỤC của file đang import (cho phép "../"); tham chiếu bắt đầu bằng "/" là tuyệt đối.
     * Trả về danh sách file được kéo vào context (không tính chính `root`), duyệt theo chiều sâu, thứ tự xuất hiện,
     * mỗi file một lần. File con trực tiếp của root là hop 1; chuỗi import dừng ở tối đa 4 hop (file ở hop 5 không nạp).
     */
    List<String> importedFiles(String root, Map<String, List<String>> imports);

    /**
     * Bài 5 (thiết kế để tránh xung đột): đặt quy tắc ở đâu?
     * "company-wide, no exceptions" → "managed policy"; "personal default for every repo" → "user CLAUDE.md";
     * "team convention for this repo" → "project CLAUDE.md"; "only matters inside one folder" → "subdirectory CLAUDE.md";
     * "private note for this repo" → "CLAUDE.local.md". Khác: IllegalArgumentException.
     */
    String placeRule(String need);
}
