package part2.lesson15;

import common.Claude;
import common.LiveSection;
import common.RawApi;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Phần 2 · Bài 15 chạy với API thật: gửi cùng một POST /v1/messages với header đầy đủ, thiếu key, thiếu version, body hỏng
 * và key sai; code của bạn đọc status và quyết định làm gì. Chỉ request đầy đủ là sinh câu trả lời (tốn token).
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-15 --live"
 */
public final class Live {
    private Live() {}

    public static void run(boolean useSolution, Claude claude) {
        Lesson15Api api = useSolution ? new Lesson15Solution() : new Lesson15();
        RawApi raw = RawApi.fromEnv();

        LiveSection.run("Cùng một endpoint, đổi header và body để thấy từng nhóm status", () -> {
            api.triage(200);
            String good = """
                {"model": "%s", "max_tokens": 60,
                 "messages": [{"role": "user", "content": "Một câu tiếng Việt: REST là gì?"}]}""".formatted(Claude.MODEL);
            String broken = "{\"model\": \"" + Claude.MODEL + "\", \"max_tokens\": 60, \"messages\": [";

            Map<String, Map<String, String>> headerSets = new LinkedHashMap<>();
            headerSets.put("đầy đủ header", Map.of("x-api-key", "$KEY", "anthropic-version", "2023-06-01", "content-type", "application/json"));
            headerSets.put("thiếu x-api-key", Map.of("anthropic-version", "2023-06-01", "content-type", "application/json"));
            headerSets.put("thiếu anthropic-version", Map.of("x-api-key", "$KEY", "content-type", "application/json"));
            headerSets.put("key sai", Map.of("x-api-key", "sk-ant-sai-key", "anthropic-version", "2023-06-01", "content-type", "application/json"));

            for (var entry : headerSets.entrySet()) {
                RawApi.Response r = raw.postWithHeaders(entry.getValue(), good);
                report(api, entry.getKey(), r);
            }
            report(api, "body JSON hỏng", raw.postWithHeaders(headerSets.get("đầy đủ header"), broken));
        });

        System.out.println("\n▶ POST bị timeout: gửi lại mù quáng có an toàn không? (không gọi API)");
        for (String method : new String[] {"POST", "GET", "DELETE", "PUT", "PATCH"}) {
            System.out.println("  " + method + ": safe=" + tryCall(() -> api.isSafe(method)) + ", idempotent=" + tryCall(() -> api.isIdempotent(method))
                + ", gửi lại sau timeout=" + tryCall(() -> api.safeToResendAfterTimeout(method)));
        }
    }

    private static void report(Lesson15Api api, String label, RawApi.Response r) {
        String body = r.body().replace("\n", " ");
        System.out.println("\n  " + label + " → HTTP " + r.status() + " · " + api.family(r.status()) + " · " + api.triage(r.status()));
        System.out.println("    " + (body.length() > 160 ? body.substring(0, 160) + "…" : body));
    }

    private interface Attempt<T> {
        T get();
    }

    private static <T> String tryCall(Attempt<T> attempt) {
        try {
            return String.valueOf(attempt.get());
        } catch (UnsupportedOperationException e) {
            return "⏳";
        }
    }
}
