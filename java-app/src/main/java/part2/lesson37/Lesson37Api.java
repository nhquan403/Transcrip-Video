package part2.lesson37;

import java.util.List;

/**
 * Phần 2 · Bài 37: Rules, Skills, and Slash Commands.
 * {@link Lesson37} là chỗ bạn làm bài, {@link Lesson37Solution} là lời giải mẫu.
 */
public interface Lesson37Api {

    /** Một mục cấu hình: kind là "rule" hoặc "skill"; descriptionTokens chỉ có nghĩa với skill. */
    record Item(String kind, int descriptionTokens, int bodyTokens) {}

    /**
     * Bài 1 (always-on và on-demand): số token mục này chiếm trong context ở một lượt.
     * "rule": luôn nạp toàn bộ, tức bodyTokens (dù invoked là gì, rule không bao giờ được gọi).
     * "skill": chưa invoked thì chỉ có descriptionTokens; đã invoked thì descriptionTokens + bodyTokens.
     * kind khác: IllegalArgumentException.
     */
    int contextTokens(Item item, boolean invoked);

    /**
     * Bài 2 (rule tự nạp, không ai gõ slash để gọi rule): pathsGlob null nghĩa là rule không giới hạn đường dẫn,
     * nạp ngay khi phiên bắt đầu → true. Ngược lại rule chỉ nạp khi có ít nhất một file trong touchedFiles khớp glob
     * (dùng FileSystems.getDefault().getPathMatcher("glob:" + pathsGlob) trên Path.of(file)).
     */
    boolean ruleLoaded(String pathsGlob, List<String> touchedFiles);

    /** Các lệnh built-in trong bài (logic cố định, không sửa được). */
    List<String> BUILT_INS = List.of("init", "clear", "help", "model");

    /**
     * Bài 3 (gõ /name thì cái gì chạy?): typed có dạng "/name". Nếu name thuộc BUILT_INS → "builtin".
     * Ngược lại tìm trong files (đường dẫn dùng dấu "/", có thể bắt đầu bằng "~/" cho thư mục home):
     *  - skill: đường dẫn kết thúc bằng ".claude/skills/&lt;name&gt;/SKILL.md" (tên lấy từ TÊN THƯ MỤC, không lấy từ field nào trong file);
     *  - command: đường dẫn kết thúc bằng ".claude/commands/&lt;name&gt;.md".
     * Skill và command trùng tên thì skill thắng. Trả về đường dẫn file thắng; file ở chỗ khác chỉ là ghi chú, không tạo lệnh;
     * không có gì khớp → null.
     */
    String resolveSlash(String typed, List<String> files);

    /**
     * Bài 4a (description dự phòng): front matter description không rỗng thì dùng nó (trim);
     * nếu null hoặc rỗng thì rơi về firstParagraph (trim); cả hai rỗng → "".
     */
    String effectiveDescription(String frontMatterDescription, String firstParagraph);

    /**
     * Bài 4b (vì sao skill không chịu chạy): trả danh sách cảnh báo theo đúng thứ tự:
     *  "NOT_SCANNED" nếu path không chứa ".claude/skills/" và cũng không chứa ".claude/commands/";
     *  "NO_DESCRIPTION" nếu frontMatterDescription null hoặc rỗng (kể cả khi đã có đoạn đầu để dự phòng: khớp kém).
     * Không có vấn đề → danh sách rỗng.
     */
    List<String> skillWarnings(String path, String frontMatterDescription);

    enum Scope { TEAM, PERSONAL, NONE }

    /**
     * Bài 5 (vị trí file quyết định ai dùng được): bắt đầu bằng ".claude/" → TEAM (đi theo repo, cả nhóm có sau khi pull);
     * bắt đầu bằng "~/.claude/" → PERSONAL (mọi dự án, chỉ mình bạn); còn lại → NONE.
     */
    Scope scopeOf(String path);
}
