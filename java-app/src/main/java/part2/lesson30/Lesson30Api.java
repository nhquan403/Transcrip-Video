package part2.lesson30;

import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 30: Writing Effective CLAUDE.md Rules.
 * {@link Lesson30} là chỗ bạn làm bài, {@link Lesson30Solution} là lời giải mẫu.
 */
public interface Lesson30Api {

    enum Store { CLAUDE_MD, AGENT_MEMORY, CONTEXT_WINDOW }

    enum Mechanism { CLAUDE_MD_RULE, PRE_TOOL_USE_HOOK }

    /**
     * Bài 1 (ba thứ hay bị nhầm): writtenByDeveloper → CLAUDE_MD (quy tắc do lập trình viên viết tay).
     * Không phải lập trình viên viết (agent tự ghi) và survivesSession → AGENT_MEMORY. Còn lại → CONTEXT_WINDOW (tạm thời, bị cắt khi đầy).
     */
    Store storeFor(boolean writtenByDeveloper, boolean survivesSession);

    /**
     * Bài 2 (hướng dẫn hay cưỡng chế): CLAUDE.md là ngữ cảnh để cân nhắc, không bắt buộc tuân theo.
     * mustBeBlocked (hành động phải bị chặn chắc chắn, ví dụ lệnh phá hoại) → PRE_TOOL_USE_HOOK; ngược lại → CLAUDE_MD_RULE.
     */
    Mechanism mechanismFor(boolean mustBeBlocked);

    /**
     * Bài 3 (chi phí token): cả file được nạp ĐẦY ĐỦ mỗi phiên, không tóm tắt, không cắt bớt.
     * Ước lượng token của file = ceil(tổng số ký tự của mọi dòng / 4.0) (không tính ký tự xuống dòng).
     * Trả về tổng token tiêu cho `sessions` phiên = token của file × sessions.
     */
    long tokensSpent(List<String> lines, int sessions);

    /**
     * Bài 4 (soát lỗi file): trả về danh sách cảnh báo theo thứ tự:
     * trước tiên, nếu file có hơn 200 dòng: "file: N lines, keep it under 200";
     * sau đó với mỗi dòng (đánh số từ 1) dài hơn 160 ký tự: "line K: verbose prose, rewrite as a short directive";
     * với mỗi dòng (trim) bắt đầu bằng "Run " hoặc "run " mà không chứa dấu backtick (`): "line K: put the command in verbatim".
     * Một dòng có thể sinh cả hai cảnh báo dòng, theo thứ tự trên. File tốt → danh sách rỗng.
     */
    List<String> lint(List<String> lines);

    /**
     * Bài 5 (viết file từ ba loại nội dung đáng giá): trả về các dòng của CLAUDE.md:
     * "# Structure", rồi mỗi mục "- `thư mục`: mô tả"; "# Conventions", rồi mỗi mục "- quy ước";
     * "# Commands", rồi mỗi mục "- tên: `lệnh`" (lệnh nguyên văn). Giữ thứ tự của map/list đưa vào.
     * Phần nào rỗng thì bỏ cả tiêu đề của phần đó. Không có dòng trống.
     */
    List<String> buildClaudeMd(Map<String, String> structure, List<String> conventions, Map<String, String> commands);
}
