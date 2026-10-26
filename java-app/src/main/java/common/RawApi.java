package common;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.function.Consumer;

/**
 * Gọi thẳng REST endpoint /v1/messages bằng java.net.http, không qua SDK, để thấy JSON thô đi và về.
 * Dùng cùng API key (ANTHROPIC_API_KEY) và base URL (ANTHROPIC_BASE_URL, nếu có) với common.Claude.
 */
public final class RawApi {
    public static final ObjectMapper JSON = new ObjectMapper();

    /** Kết quả một lời gọi: status HTTP, body thô, và thời gian round trip. */
    public record Response(int status, String body, long millis) {
        public JsonNode json() {
            try {
                return JSON.readTree(body);
            } catch (IOException e) {
                throw new IllegalStateException("body không phải JSON: " + body, e);
            }
        }
    }

    private final HttpClient http = HttpClient.newHttpClient();
    private final String baseUrl;
    private final String apiKey;

    private RawApi(String baseUrl, String apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }

    public static RawApi fromEnv() {
        String key = System.getenv("ANTHROPIC_API_KEY");
        if (key == null || key.isBlank()) throw new IllegalStateException("Chưa có ANTHROPIC_API_KEY");
        String base = System.getenv("ANTHROPIC_BASE_URL");
        return new RawApi(base == null || base.isBlank() ? "https://api.anthropic.com" : base, key);
    }

    /** Cùng endpoint nhưng với một API key khác (ví dụ key sai, để thấy lỗi 401 thật). */
    public RawApi withKey(String otherKey) {
        return new RawApi(baseUrl, otherKey);
    }

    /** POST một body JSON (chuỗi hoặc object Jackson chuyển được) tới /v1/messages. */
    public Response post(Object body) {
        return send(body, null);
    }

    /** POST một body JSON tới một path khác, ví dụ "/v1/messages/batches". */
    public Response postTo(String path, Object body) {
        return exchange("POST", path, body);
    }

    /** GET một path (ví dụ "/v1/messages/batches/{id}") hoặc một URL đầy đủ mà API trả về (ví dụ results_url). */
    public Response get(String pathOrUrl) {
        return exchange("GET", pathOrUrl, null);
    }

    /**
     * POST tới /v1/messages với ĐÚNG những header truyền vào (không tự thêm key hay version), để thấy lỗi khi thiếu header.
     * Giá trị "$KEY" được thay bằng API key thật.
     */
    public Response postWithHeaders(java.util.Map<String, String> headers, String jsonBody) {
        try {
            HttpRequest.Builder builder = HttpRequest.newBuilder(URI.create(baseUrl + "/v1/messages"))
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody));
            headers.forEach((name, value) -> builder.header(name, value.equals("$KEY") ? apiKey : value));
            long start = System.nanoTime();
            HttpResponse<String> r = http.send(builder.build(), HttpResponse.BodyHandlers.ofString());
            return new Response(r.statusCode(), r.body(), (System.nanoTime() - start) / 1_000_000);
        } catch (IOException e) {
            throw new IllegalStateException("lỗi mạng: " + e.getMessage(), e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException(e);
        }
    }

    private Response exchange(String method, String pathOrUrl, Object body) {
        try {
            String url = pathOrUrl.startsWith("http") ? pathOrUrl : baseUrl + pathOrUrl;
            HttpRequest.Builder builder = HttpRequest.newBuilder(URI.create(url))
                .header("x-api-key", apiKey)
                .header("anthropic-version", "2023-06-01")
                .header("content-type", "application/json");
            builder = body == null ? builder.GET()
                : builder.method(method, HttpRequest.BodyPublishers.ofString(body instanceof String s ? s : JSON.writeValueAsString(body)));
            long start = System.nanoTime();
            HttpResponse<String> r = http.send(builder.build(), HttpResponse.BodyHandlers.ofString());
            return new Response(r.statusCode(), r.body(), (System.nanoTime() - start) / 1_000_000);
        } catch (IOException e) {
            throw new IllegalStateException("lỗi mạng: " + e.getMessage(), e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException(e);
        }
    }

    /** POST với "stream": true; onLine nhận từng dòng SSE thô ngay khi tới. */
    public Response stream(Object body, Consumer<String> onLine) {
        return send(body, onLine);
    }

    private Response send(Object body, Consumer<String> onLine) {
        try {
            String json = body instanceof String s ? s : JSON.writeValueAsString(body);
            HttpRequest request = HttpRequest.newBuilder(URI.create(baseUrl + "/v1/messages"))
                .header("x-api-key", apiKey)
                .header("anthropic-version", "2023-06-01")
                .header("content-type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();
            long start = System.nanoTime();
            if (onLine == null) {
                HttpResponse<String> r = http.send(request, HttpResponse.BodyHandlers.ofString());
                return new Response(r.statusCode(), r.body(), (System.nanoTime() - start) / 1_000_000);
            }
            HttpResponse<java.util.stream.Stream<String>> r = http.send(request, HttpResponse.BodyHandlers.ofLines());
            StringBuilder all = new StringBuilder();
            r.body().forEach(line -> {
                all.append(line).append('\n');
                onLine.accept(line);
            });
            return new Response(r.statusCode(), all.toString(), (System.nanoTime() - start) / 1_000_000);
        } catch (IOException e) {
            throw new IllegalStateException("lỗi mạng: " + e.getMessage(), e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException(e);
        }
    }
}
