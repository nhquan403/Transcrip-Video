package part2.lesson33;

import java.util.List;
import java.util.Map;

/**
 * Bài tập Phần 2 · Bài 33. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-33"
 */
public class Lesson33 implements Lesson33Api {

    @Override
    public Layer layerOfPath(String path) {
        throw new UnsupportedOperationException("TODO bài 1: thư mục home, repo, hay file .local?");
    }

    @Override
    public boolean isCommitted(Layer layer) {
        throw new UnsupportedOperationException("TODO bài 2a: lớp nào đi theo repo?");
    }

    @Override
    public boolean needsWorkspaceTrust(Layer layer) {
        throw new UnsupportedOperationException("TODO bài 2b: rule dùng chung hay rule của riêng bạn?");
    }

    @Override
    public Resolved resolve(Map<Layer, Map<String, Object>> layers, String key, Object cliValue) {
        throw new UnsupportedOperationException("TODO bài 3: managed > CLI > local > project > user");
    }

    @Override
    public List<Layer> definedIn(Map<Layer, Map<String, Object>> layers, String key) {
        throw new UnsupportedOperationException("TODO bài 4: đi qua các lớp từ trên xuống");
    }

    @Override
    public Layer whereToPut(String item) {
        throw new UnsupportedOperationException("TODO bài 5: dùng chung, riêng tư, hay policy?");
    }
}
