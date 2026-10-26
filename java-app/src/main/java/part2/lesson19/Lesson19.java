package part2.lesson19;

import java.util.List;

/**
 * Bài tập Phần 2 · Bài 19. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-19" (thêm --live để Claude review một diff prompt thật)
 */
public class Lesson19 implements Lesson19Api {

    /** Gợi ý: MessageDigest.getInstance("SHA-1"), HexFormat.of().formatHex(...). */
    @Override
    public String gitBlobId(String content) {
        throw new UnsupportedOperationException("TODO bài 1: SHA-1 của header blob cộng nội dung");
    }

    @Override
    public Integrate integrate(boolean branchIsShared) {
        throw new UnsupportedOperationException("TODO bài 2: rebase local, merge shared");
    }

    /** Gợi ý: bảng lcs[i][j] cho before[i..] và after[j..], rồi đi từ đầu để in từng dòng. */
    @Override
    public List<String> diff(String before, String after) {
        throw new UnsupportedOperationException("TODO bài 3: diff theo dòng bằng LCS");
    }

    @Override
    public boolean needsReview(String path) {
        throw new UnsupportedOperationException("TODO bài 4: code, prompt, schema, config đều phải qua review");
    }
}
