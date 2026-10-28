package part2.lesson30;

import java.util.List;
import java.util.Map;

/**
 * Bài tập Phần 2 · Bài 30. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-30"
 */
public class Lesson30 implements Lesson30Api {

    @Override
    public Store storeFor(boolean writtenByDeveloper, boolean survivesSession) {
        throw new UnsupportedOperationException("TODO bài 1: ai viết, và có sống qua phiên không?");
    }

    @Override
    public Mechanism mechanismFor(boolean mustBeBlocked) {
        throw new UnsupportedOperationException("TODO bài 2: hướng dẫn thì viết rule, chặn thật thì dùng gì?");
    }

    @Override
    public long tokensSpent(List<String> lines, int sessions) {
        throw new UnsupportedOperationException("TODO bài 3: cả file nạp đầy đủ, mỗi phiên");
    }

    @Override
    public List<String> lint(List<String> lines) {
        throw new UnsupportedOperationException("TODO bài 4: quá dài, văn xuôi dài dòng, lệnh không nguyên văn");
    }

    @Override
    public List<String> buildClaudeMd(Map<String, String> structure, List<String> conventions, Map<String, String> commands) {
        throw new UnsupportedOperationException("TODO bài 5: Structure, Conventions, Commands");
    }
}
