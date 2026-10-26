package part2.lesson05;

import common.Claude;
import common.LiveSection;
import java.net.http.HttpClient;
import java.net.http.HttpResponse;
import part2.lesson05.Lesson05Api.ErrorAction;

/**
 * Phần 2 · Bài 05 chạy với Claude thật: gọi thẳng REST endpoint bằng java.net.http (không qua SDK) với request bạn dựng,
 * rồi thử một key sai để thấy 401 bị báo ngay thay vì bị retry.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-05 --live"
 */
public final class Live {
    private Live() {}

    public static void run(boolean useSolution, Claude claude) {
        Lesson05Api api = useSolution ? new Lesson05Solution() : new Lesson05();
        String baseUrl = System.getenv().getOrDefault("ANTHROPIC_BASE_URL", "https://api.anthropic.com");
        String body = """
            {"model": "%s", "max_tokens": 200,
             "messages": [{"role": "user", "content": "Trong một câu tiếng Việt: vì sao phải ghim model ID?"}]}"""
            .formatted(Claude.MODEL);
        HttpClient http = HttpClient.newHttpClient();

        LiveSection.run("Develop: prototype gọi thẳng Messages API bằng HTTP thô", () -> {
            String key = api.loadApiKey(System.getenv());
            var request = api.buildRequest(baseUrl, key, body);
            HttpResponse<String> response = send(http, request);
            System.out.println("  " + request.method() + " " + request.uri() + " → HTTP " + response.statusCode());
            System.out.println("  JSON thô trả về: " + response.body().substring(0, Math.min(400, response.body().length())) + "…");
        });

        LiveSection.run("Implement: key sai trả về 401, code của bạn phải báo ngay", () -> {
            var request = api.buildRequest(baseUrl, "sk-ant-sai-key", body);
            for (int attempt = 1; attempt <= 3; attempt++) {
                int status = send(http, request).statusCode();
                ErrorAction action = api.onError(status, attempt, 3);
                System.out.println("  Lần " + attempt + ": HTTP " + status + " → " + action);
                if (action == ErrorAction.SURFACE) break;
            }
        });

        System.out.println("\n▶ Model ID trong cấu hình có được ghim không? (không gọi API)");
        for (String id : new String[] {Claude.MODEL, "claude-sonnet-4-5", "claude-sonnet-4-5-20250929", "claude-3-7-sonnet-latest"}) {
            System.out.println("  " + id + " → " + tryCall(() -> api.isPinnedModel(id) ? "pinned" : "alias trôi nổi"));
        }
    }

    private static HttpResponse<String> send(HttpClient http, java.net.http.HttpRequest request) {
        try {
            return http.send(request, HttpResponse.BodyHandlers.ofString());
        } catch (java.io.IOException e) {
            throw new IllegalStateException("lỗi mạng: " + e.getMessage(), e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException(e);
        }
    }

    private interface Attempt<T> {
        T get();
    }

    private static <T> String tryCall(Attempt<T> attempt) {
        try {
            return String.valueOf(attempt.get());
        } catch (UnsupportedOperationException e) {
            return "⏳ chưa làm (" + e.getMessage() + ")";
        }
    }
}
