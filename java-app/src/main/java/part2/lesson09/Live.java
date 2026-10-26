package part2.lesson09;

import common.Claude;
import common.LiveSection;
import common.RawApi;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.imageio.ImageIO;

/**
 * Phần 2 · Bài 09 chạy với Claude thật: đọc luồng SSE thô (stream: true) bằng parser của bạn, ghép partial JSON của tool,
 * rồi gửi một ảnh tự vẽ (base64) cho Claude đếm hình và so với ước tính visual token của bạn.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-09 --live"
 */
public final class Live {
    private Live() {}

    public static void run(boolean useSolution, Claude claude) {
        Lesson09Api api = useSolution ? new Lesson09Solution() : new Lesson09();
        RawApi raw = RawApi.fromEnv();

        LiveSection.run("Streaming thô: sự kiện theo thứ tự, tool input tới thành từng mảnh JSON", () -> {
            api.eventNames("");
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("model", Claude.MODEL);
            body.put("max_tokens", 600);
            body.put("stream", true);
            body.put("tools", List.of(Map.of("name", "lookup_order", "description", "Look up an order by id.",
                "input_schema", Map.of("type", "object", "properties", Map.of("id", Map.of("type", "string"),
                    "lang", Map.of("type", "string")), "required", List.of("id", "lang")))));
            body.put("messages", List.of(Map.of("role", "user", "content", "Tra giúp đơn hàng A12, trả lời bằng tiếng Việt.")));
            List<Map<String, Object>> events = new ArrayList<>();
            RawApi.Response r = raw.stream(body, line -> {
                if (line.startsWith("data:")) events.add(parse(line.substring(5).trim()));
            });
            List<String> names = api.eventNames(r.body());
            System.out.println("  " + names.size() + " sự kiện, thứ tự hợp lệ: " + api.validOrder(names));
            events.stream().filter(e -> "content_block_delta".equals(e.get("type")))
                .map(e -> ((Map<?, ?>) e.get("delta")).get("partial_json")).filter(p -> p != null).limit(6)
                .forEach(p -> System.out.println("  mảnh partial_json: " + p));
            Lesson09Api.Assembled message = api.assemble(events);
            System.out.println("  Sau khi ghép: " + message.blocks());
            System.out.println("  stop_reason " + message.stopReason() + " · " + message.outputTokens() + " token ra");
        });

        LiveSection.run("Vision: gửi ảnh base64 (ảnh đặt trước câu hỏi)", () -> {
            byte[] png = drawCircles(5);
            Map<String, Object> image = api.imageBlock("base64", Base64.getEncoder().encodeToString(png), "image/png");
            System.out.println("  Ảnh 600×400, ước tính của bạn: " + api.imageTokens(600, 400, 2576) + " visual token");
            Map<String, Object> body = Map.of("model", Claude.MODEL, "max_tokens", 200, "messages", List.of(Map.of("role", "user",
                "content", List.of(image, Map.of("type", "text", "text", "Ảnh này có bao nhiêu hình tròn màu đỏ? Trả lời ngắn bằng tiếng Việt.")))));
            RawApi.Response r = raw.post(body);
            var json = r.json();
            if (r.status() != 200) throw new IllegalStateException("HTTP " + r.status() + " " + r.body());
            System.out.println("  💬 " + json.path("content").path(0).path("text").asText() + " (đáp án: 5)");
            System.out.println("  input_tokens thật của cả request: " + json.path("usage").path("input_tokens").asLong());
            System.out.println("  Nhớ: đếm và vị trí do vision đưa ra chỉ là gần đúng.");
        });
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> parse(String json) {
        try {
            return RawApi.JSON.readValue(json, Map.class);
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }

    /** Vẽ n hình tròn đỏ trên nền trắng, trả về PNG. */
    public static byte[] drawCircles(int n) {
        BufferedImage img = new BufferedImage(600, 400, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = img.createGraphics();
        g.setColor(Color.WHITE);
        g.fillRect(0, 0, 600, 400);
        g.setColor(new Color(220, 30, 30));
        for (int i = 0; i < n; i++) g.fillOval(30 + i * 110, 120 + (i % 2) * 90, 80, 80);
        g.dispose();
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            ImageIO.write(img, "png", out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }
}
