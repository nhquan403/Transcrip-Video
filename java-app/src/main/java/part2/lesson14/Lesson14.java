package part2.lesson14;

import java.util.List;
import java.util.Map;

/**
 * Bài tập Phần 2 · Bài 14. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-14"
 */
public class Lesson14 implements Lesson14Api {

    @Override
    public Integration integrationFor(double opusVersion) {
        throw new UnsupportedOperationException("TODO bài 1: Mantle hay invoke model?");
    }

    @Override
    public String modelId(Integration integration, String model, String regionalProfile) {
        throw new UnsupportedOperationException("TODO bài 2: tiền tố trần hay tiền tố profile");
    }

    @Override
    public AwsCredentials resolveCredentials(Map<String, String> constructorArgs, Map<String, String> env, Map<String, String> configFile) {
        throw new UnsupportedOperationException("TODO bài 3: constructor, rồi môi trường, rồi file cấu hình");
    }

    /** Gợi ý: dùng Lesson14Api.UNSUPPORTED. */
    @Override
    public List<String> unsupportedOnBedrock(List<String> neededFeatures) {
        throw new UnsupportedOperationException("TODO bài 4: lọc tính năng không có trên Bedrock");
    }

    @Override
    public double endpointPrice(double basePrice, boolean regional) {
        throw new UnsupportedOperationException("TODO bài 5: regional đắt hơn khoảng 10%");
    }

    @Override
    public List<String> oversizedImages(Map<String, Long> imageBytes) {
        throw new UnsupportedOperationException("TODO bài 5: ảnh trên 5 MB");
    }
}
