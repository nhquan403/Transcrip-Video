package part2.lesson07;

import com.fasterxml.jackson.databind.JsonNode;
import common.Claude;
import common.LiveSection;
import common.RawApi;
import java.util.List;
import java.util.Map;
import part2.lesson07.Lesson07Api.Request;
import part2.lesson07.Lesson07Api.Turn;

/**
 * Phần 2 · Bài 07 chạy với Claude thật: body JSON do code của bạn dựng được gửi thẳng tới REST endpoint.
 * Thấy API không giữ trạng thái, lượt đầu là assistant bị từ chối, và system prompt nằm ở cấp cao nhất.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-07 --live"
 */
public final class Live {
    private Live() {}

    static final String SYSTEM = "Bạn là gia sư. Trả lời bằng tiếng Việt, tối đa 2 câu.";

    public static void run(boolean useSolution, Claude claude) {
        Lesson07Api api = useSolution ? new Lesson07Solution() : new Lesson07();
        RawApi raw = RawApi.fromEnv();

        LiveSection.run("API không giữ trạng thái: không gửi lại lịch sử thì Claude không biết gì", () -> {
            api.toBody(new Request("m", 1, null, List.of(new Turn("user", "x"))));
            List<Turn> first = List.of(new Turn("user", "Chào bạn, mình tên là An và đang học Messages API."));
            JsonNode reply = send(raw, api, first).json();
            System.out.println("  Lượt 1 → " + text(reply));

            List<Turn> forgot = List.of(new Turn("user", "Mình tên gì?"));
            System.out.println("  Lời gọi mới KHÔNG kèm lịch sử → " + text(send(raw, api, forgot).json()));

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> blocks = RawApi.JSON.convertValue(reply.get("content"), List.class);
            List<Turn> withHistory = api.appendExchange(first, blocks, "Mình tên gì?");
            System.out.println("  Lời gọi mới CÓ gửi lại " + withHistory.size() + " lượt → " + text(send(raw, api, withHistory).json()));
        });

        LiveSection.run("Lượt đầu là assistant: validate() của bạn chặn trước, API thật cũng từ chối", () -> {
            List<Turn> wrong = List.of(new Turn("assistant", "Chào bạn, tôi có thể giúp gì?"), new Turn("user", "Giải thích REST."));
            Request request = new Request(Claude.MODEL, 200, SYSTEM, wrong);
            System.out.println("  validate() của bạn: " + api.validate(request));
            RawApi.Response r = raw.post(api.toBody(request));
            System.out.println("  Nếu vẫn gửi đi: HTTP " + r.status() + " " + abbreviate(r.body()));
        });

        LiveSection.run("Hai lượt user liền nhau: bạn gộp trước khi gửi, Claude đọc như một lượt", () -> {
            List<Turn> twoUsers = List.of(new Turn("user", "Câu 1: HTTP verb nào dùng để gọi Messages API?"),
                new Turn("user", "Câu 2: header nào chọn phiên bản API?"));
            List<Turn> merged = api.mergeSameRole(twoUsers);
            System.out.println("  Sau khi gộp còn " + merged.size() + " lượt → " + text(send(raw, api, merged).json()));
        });
    }

    private static RawApi.Response send(RawApi raw, Lesson07Api api, List<Turn> messages) {
        Request request = new Request(Claude.MODEL, 300, SYSTEM, messages);
        List<String> errors = api.validate(request);
        if (!errors.isEmpty()) throw new IllegalStateException("request không hợp lệ: " + errors);
        RawApi.Response r = raw.post(api.toBody(request));
        if (r.status() != 200) throw new IllegalStateException("HTTP " + r.status() + " " + r.body());
        return r;
    }

    private static String text(JsonNode message) {
        StringBuilder sb = new StringBuilder();
        for (JsonNode block : message.get("content")) {
            if ("text".equals(block.path("type").asText())) sb.append(block.path("text").asText());
        }
        return sb.toString().replace("\n", " ").trim();
    }

    private static String abbreviate(String s) {
        return s.length() > 220 ? s.substring(0, 220) + "…" : s;
    }
}
