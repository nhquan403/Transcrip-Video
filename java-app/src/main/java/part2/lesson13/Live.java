package part2.lesson13;

import com.fasterxml.jackson.databind.JsonNode;
import common.Claude;
import common.LiveSection;
import common.RawApi;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import part2.lesson13.Lesson13Api.Entry;
import part2.lesson13.Lesson13Api.Result;

/**
 * Phần 2 · Bài 13 chạy với Claude thật: gửi một Message Batch thật gồm 4 ticket (custom_id là mã ticket),
 * chờ tối đa 3 phút, tải kết quả JSONL và ghép lại bằng writeBack() của bạn.
 * Batch thường xong dưới một giờ nhưng KHÔNG được đảm bảo; nếu chưa xong, chương trình in id để bạn xem sau.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-13 --live"
 */
public final class Live {
    private Live() {}

    public static void run(boolean useSolution, Claude claude) {
        Lesson13Api api = useSolution ? new Lesson13Solution() : new Lesson13();
        RawApi raw = RawApi.fromEnv();

        LiveSection.run("Gửi batch thật, chờ, tải kết quả và ghép theo custom_id", () -> {
            Map<String, String> tickets = new LinkedHashMap<>();
            tickets.put("TCK-1042", "Tôi bị trừ tiền hai lần trong tháng này.");
            tickets.put("TCK-1043", "Nút xuất PDF bấm vào không có phản ứng gì.");
            tickets.put("TCK-1044", "Tôi muốn đổi email đăng nhập của tài khoản.");
            tickets.put("TCK-1045", "Ứng dụng tự thoát khi mở trang báo cáo.");

            List<Entry> entries = new ArrayList<>();
            tickets.forEach((id, text) -> {
                Map<String, Object> sync = new LinkedHashMap<>();
                sync.put("model", Claude.MODEL);
                sync.put("max_tokens", 10);
                sync.put("stream", true);
                sync.put("system", "Classify the support ticket. Reply with one word: billing, bug, or account.");
                sync.put("messages", List.of(Map.of("role", "user", "content", text)));
                entries.add(new Entry(id, api.toBatchParams(sync)));
            });
            List<String> errors = api.validate(entries);
            if (!errors.isEmpty()) throw new IllegalStateException("batch chưa hợp lệ: " + errors);

            List<Map<String, Object>> requests = entries.stream()
                .map(e -> Map.<String, Object>of("custom_id", e.customId(), "params", e.params())).toList();
            RawApi.Response created = raw.postTo("/v1/messages/batches", Map.of("requests", requests));
            if (created.status() != 200) throw new IllegalStateException("HTTP " + created.status() + " " + created.body());
            String batchId = created.json().path("id").asText();
            System.out.println("  Đã gửi batch " + batchId + " gồm " + entries.size() + " request (nửa giá).");

            JsonNode batch = created.json();
            for (int i = 0; i < 18 && !"ended".equals(batch.path("processing_status").asText()); i++) {
                sleep(10_000);
                batch = raw.get("/v1/messages/batches/" + batchId).json();
                System.out.println("  ⏳ " + batch.path("processing_status").asText() + " " + batch.path("request_counts"));
            }
            if (!"ended".equals(batch.path("processing_status").asText())) {
                System.out.println("  Batch chưa xong sau 3 phút (best effort, có thể tới 24 giờ). Xem sau bằng id: " + batchId);
                return;
            }

            List<Result> results = new ArrayList<>();
            List<String> arrival = new ArrayList<>();
            for (String line : raw.get(batch.path("results_url").asText()).body().split("\n")) {
                if (line.isBlank()) continue;
                JsonNode r = parse(line);
                String type = r.path("result").path("type").asText();
                String text = type.equals("succeeded") ? r.path("result").path("message").path("content").path(0).path("text").asText().trim() : null;
                results.add(new Result(r.path("custom_id").asText(), type, text));
                arrival.add(r.path("custom_id").asText());
            }
            System.out.println("  Thứ tự kết quả về: " + arrival + " (đừng ghép theo vị trí)");
            var written = api.writeBack(tickets, results);
            written.outputs().forEach((id, label) -> System.out.println("  " + id + " · " + tickets.get(id) + " → " + label));
            if (!written.retry().isEmpty()) System.out.println("  Cần chạy lại: " + written.retry());
        });
    }

    private static JsonNode parse(String line) {
        try {
            return RawApi.JSON.readTree(line);
        } catch (java.io.IOException e) {
            throw new IllegalStateException("dòng kết quả không phải JSON: " + line, e);
        }
    }

    private static void sleep(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException(e);
        }
    }
}
