package part2.lesson20;

import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 20: Committing Config into the Life Cycle.
 * {@link Lesson20} là chỗ bạn làm bài, {@link Lesson20Solution} là lời giải mẫu.
 * Bài này chỉ có bộ chấm offline.
 */
public interface Lesson20Api {

    enum Placement { COMMIT_SHARED, KEEP_LOCAL, NEVER_COMMIT_SECRET }

    enum Bump { MAJOR, MINOR, PATCH }

    /**
     * Bài 1 (commit hay giữ local): CLAUDE.md, .claude/settings.json, file trong prompts/ hoặc schemas/: COMMIT_SHARED.
     * .claude/settings.local.json và CLAUDE.local.md: KEEP_LOCAL (gitignore, mỗi người một bản).
     * .env, .env.* và file .pem: NEVER_COMMIT_SECRET. File khác: COMMIT_SHARED. Đường dẫn có thể nằm trong thư mục con.
     */
    Placement placement(String path);

    /**
     * Bài 2 (semantic versioning): chọn mức tăng version. Thay đổi không tương thích ngược: MAJOR.
     * Thêm chức năng mà người đang dùng vẫn chạy được: MINOR. Còn lại (sửa nhỏ, không đổi hành vi mong đợi): PATCH.
     */
    Bump requiredBump(boolean breaksExistingCallers, boolean addsFunctionality);

    /**
     * Bài 3: tăng version "MAJOR.MINOR.PATCH". MAJOR: x+1.0.0; MINOR: x.y+1.0; PATCH: x.y.z+1.
     * Chuỗi không đúng dạng ba số thì ném IllegalArgumentException.
     */
    String bump(String version, Bump bump);

    /**
     * Bài 4 (CI cho cấu hình): kiểm tra các file sắp merge (đường dẫn → nội dung), trả về lỗi theo thứ tự đường dẫn tăng dần:
     *   file .json (settings, schema) không parse được: "path: invalid JSON";
     *   CLAUDE.md rỗng hoặc toàn khoảng trắng: "path: empty CLAUDE.md";
     *   .claude/settings.json có "model" chứa "latest": "path: model is not pinned";
     *   file trong prompts/ thì có dòng "TODO": "path: unfinished prompt".
     */
    List<String> ciCheck(Map<String, String> files);
}
