package part2.lesson05;

import java.net.URI;
import java.net.http.HttpRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Lời giải mẫu Phần 2 · Bài 05. Hãy tự làm trong Lesson05 trước khi đọc file này. */
public class Lesson05Solution implements Lesson05Api {

    private static final Pattern NUMBER = Pattern.compile("\\d+");

    @Override
    public HttpRequest buildRequest(String baseUrl, String apiKey, String jsonBody) {
        return HttpRequest.newBuilder(URI.create(baseUrl + "/v1/messages"))
            .header("x-api-key", apiKey)
            .header("anthropic-version", API_VERSION)
            .header("content-type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
            .build();
    }

    @Override
    public String loadApiKey(Map<String, String> env) {
        String key = env.get("ANTHROPIC_API_KEY");
        if (key == null || key.isBlank()) {
            throw new IllegalStateException("Thiếu ANTHROPIC_API_KEY: hãy nạp key từ secret manager hoặc biến môi trường");
        }
        return key;
    }

    @Override
    public ErrorAction onError(int status, int attempt, int maxAttempts) {
        boolean transientError = status == 429 || status >= 500;
        return transientError && attempt < maxAttempts ? ErrorAction.RETRY : ErrorAction.SURFACE;
    }

    @Override
    public boolean shouldCommit(String path) {
        String p = path.replace('\\', '/');
        String name = p.substring(p.lastIndexOf('/') + 1);
        if (name.equals(".env") || name.startsWith(".env.")) return false;
        return !p.endsWith(".claude/settings.local.json");
    }

    @Override
    public boolean isPinnedModel(String modelId) {
        if (modelId.contains("latest")) return false;
        List<String> numbers = new ArrayList<>();
        Matcher m = NUMBER.matcher(modelId);
        while (m.find()) numbers.add(m.group());
        if (!numbers.isEmpty() && numbers.get(numbers.size() - 1).length() == 8) return true;
        if (numbers.isEmpty()) return false;
        int major = Integer.parseInt(numbers.get(0));
        int minor = numbers.size() > 1 ? Integer.parseInt(numbers.get(1)) : 0;
        return major > 4 || (major == 4 && minor >= 6);
    }
}
