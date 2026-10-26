package part2.lesson19;

import java.util.List;

/**
 * Phần 2 · Bài 19: Git Workflows for Claude Applications.
 * {@link Lesson19} là chỗ bạn làm bài, {@link Lesson19Solution} là lời giải mẫu.
 */
public interface Lesson19Api {

    enum Integrate { REBASE, MERGE }

    /**
     * Bài 1 (commit được đặt tên bằng hash nội dung): tính object id mà Git gán cho nội dung một file (một "blob"):
     * SHA-1 của chuỗi byte "blob " + số byte UTF-8 của nội dung + ký tự '\0' + nội dung (UTF-8), viết thành 40 chữ hex thường.
     * Cùng nội dung luôn cho cùng hash; đổi một ký tự là hash khác hẳn. (Thử: git hash-object file.txt)
     */
    String gitBlobId(String content);

    /** Bài 2 (rebase hay merge): rebase công việc cục bộ của riêng bạn, merge công việc đã chia sẻ cho người khác. */
    Integrate integrate(boolean branchIsShared);

    /**
     * Bài 3 (diff để review prompt): so hai phiên bản theo dòng, dùng dãy con chung dài nhất (LCS).
     * Trả về từng dòng của kết quả: "  " + dòng giữ nguyên, "- " + dòng bị bỏ, "+ " + dòng được thêm.
     * Ở mỗi chỗ khác nhau, liệt kê dòng bị bỏ trước dòng được thêm.
     */
    List<String> diff(String before, String after);

    /**
     * Bài 4 (cái gì là "source" và phải qua review): file định hướng hành vi của app thì nằm trong repo và phải qua pull request:
     * code (.java, .py, .ts), prompt (thư mục prompts/), schema (thư mục schemas/ hoặc file .schema.json), CLAUDE.md và .claude/settings.json.
     * Trả về true cho các file đó, false cho file khác (ví dụ ghi chú cá nhân, file build).
     */
    boolean needsReview(String path);
}
