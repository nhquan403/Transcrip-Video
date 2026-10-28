package part2.lesson31;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Bài tập Phần 2 · Bài 31. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-31"
 */
public class Lesson31 implements Lesson31Api {

    @Override
    public Scope scopeOf(String path) {
        throw new UnsupportedOperationException("TODO bài 1: managed, user, project hay local?");
    }

    @Override
    public List<String> launchOrder(String cwd, Set<String> files, Set<String> excludes) {
        throw new UnsupportedOperationException("TODO bài 2: managed, user, rồi từ gốc đi xuống cwd");
    }

    @Override
    public List<String> loadedOnRead(String cwd, String readPath, Set<String> files) {
        throw new UnsupportedOperationException("TODO bài 3: file lồng bên dưới cwd chỉ nạp khi đọc file trong đó");
    }

    @Override
    public List<String> importedFiles(String root, Map<String, List<String>> imports) {
        throw new UnsupportedOperationException("TODO bài 4: @path tương đối, tối đa 4 hop");
    }

    @Override
    public String placeRule(String need) {
        throw new UnsupportedOperationException("TODO bài 5: để scope quyết định");
    }
}
