package part2.lesson16;

import common.Claude;
import common.LiveSection;
import common.RawApi;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 16 chạy với Claude thật: tự dựng body JSON (có một ảnh Base64), xem kích thước body,
 * gửi thẳng tới REST endpoint, rồi đọc câu trả lời từ JSON thô bằng extractAnswer() của bạn.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-16 --live"
 */
public final class Live {
    private Live() {}

    public static void run(boolean useSolution, Claude claude) {
        Lesson16Api api = useSolution ? new Lesson16Solution() : new Lesson16();
        RawApi raw = RawApi.fromEnv();

        LiveSection.run("Một object JSON đi, một object JSON về", () -> {
            byte[] png = part2.lesson09.Live.drawCircles(3);
            String question = "Ảnh có mấy hình tròn? Trả lời một câu tiếng Việt.";
            System.out.println("  Ảnh PNG " + png.length + " byte → Base64 " + api.base64Length(png.length) + " ký tự");
            System.out.println("  Ước tính body: " + api.estimateBodyBytes(question, List.of((long) png.length)) + " byte");

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("model", Claude.MODEL);
            body.put("messages", List.of(Map.of("role", "user", "content", List.of(
                Map.of("type", "image", "source", Map.of("type", "base64", "media_type", "image/png",
                    "data", Base64.getEncoder().encodeToString(png))),
                Map.of("type", "text", "text", question)))));
            System.out.println("  Thiếu khóa cốt lõi: " + api.missingCoreKeys(body));
            body.put("max_tokens", 200);
            System.out.println("  Sau khi thêm max_tokens: " + api.missingCoreKeys(body));

            RawApi.Response r = raw.post(body);
            System.out.println("  HTTP " + r.status() + " · body trả về " + r.body().length() + " ký tự JSON");
            @SuppressWarnings("unchecked")
            Map<String, Object> response = RawApi.JSON.convertValue(r.json(), Map.class);
            for (String key : List.of("content", "stop_reason", "usage", "stop_sequence")) {
                System.out.println("  " + key + " là " + api.jsonType(response.get(key)));
            }
            System.out.println("  💬 " + api.extractAnswer(r.body()));
        });
    }
}
