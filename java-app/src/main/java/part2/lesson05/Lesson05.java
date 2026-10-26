package part2.lesson05;

import java.net.http.HttpRequest;
import java.util.Map;

/**
 * Bài tập Phần 2 · Bài 05. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-05" (thêm --live để chạy với Claude thật)
 */
public class Lesson05 implements Lesson05Api {

    /** Gợi ý: HttpRequest.newBuilder(URI.create(...)).header(...).POST(HttpRequest.BodyPublishers.ofString(jsonBody)).build() */
    @Override
    public HttpRequest buildRequest(String baseUrl, String apiKey, String jsonBody) {
        throw new UnsupportedOperationException("TODO bài 1: endpoint, x-api-key, anthropic-version");
    }

    @Override
    public String loadApiKey(Map<String, String> env) {
        throw new UnsupportedOperationException("TODO bài 2: đọc key lúc chạy, báo lỗi rõ ràng nếu thiếu");
    }

    @Override
    public ErrorAction onError(int status, int attempt, int maxAttempts) {
        throw new UnsupportedOperationException("TODO bài 3: retry cái tự hết, báo ngay cái không tự hết");
    }

    @Override
    public boolean shouldCommit(String path) {
        throw new UnsupportedOperationException("TODO bài 4: cấu hình chung vào Git, cấu hình cá nhân và bí mật thì không");
    }

    /** Gợi ý: regex lấy các nhóm số trong ID; số đầu là major, số thứ hai (nếu có, và không phải ngày) là minor. */
    @Override
    public boolean isPinnedModel(String modelId) {
        throw new UnsupportedOperationException("TODO bài 5: snapshot cố định hay alias trôi nổi?");
    }
}
