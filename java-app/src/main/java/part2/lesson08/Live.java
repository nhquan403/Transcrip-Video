package part2.lesson08;

import com.fasterxml.jackson.databind.JsonNode;
import common.Claude;
import common.LiveSection;
import common.RawApi;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import part2.lesson08.Lesson08Api.NextStep;
import part2.lesson08.Lesson08Api.Usage;

/**
 * Phần 2 · Bài 08 chạy với Claude thật: đọc response thô bằng code của bạn: duyệt block theo type, rẽ nhánh theo stop_reason
 * (chạy tool khi tool_use, dừng khi end_turn), và đọc usage.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-08 --live"
 */
public final class Live {
    private Live() {}

    static final Map<String, Object> TOOL = Map.of(
        "name", "lookup_order",
        "description", "Look up an order by its id and return its status.",
        "input_schema", Map.of("type", "object", "properties", Map.of("id", Map.of("type", "string")), "required", List.of("id")));

    public static void run(boolean useSolution, Claude claude) {
        Lesson08Api api = useSolution ? new Lesson08Solution() : new Lesson08();
        RawApi raw = RawApi.fromEnv();

        LiveSection.run("Vòng đọc, chạy, nối, gọi lại cho tới khi stop_reason là end_turn", () -> {
            api.next("end_turn");
            List<Object> messages = new ArrayList<>(List.of(Map.of("role", "user", "content", "Đơn hàng A12 của tôi tới đâu rồi?")));
            for (int call = 1; call <= 4; call++) {
                JsonNode response = raw.post(body(messages, 600)).json();
                List<Map<String, Object>> content = blocks(response);
                String stop = response.path("stop_reason").asText();
                System.out.println("\n  Lời gọi " + call + ": các block " + content.stream().map(b -> b.get("type")).toList()
                    + " · stop_reason " + stop + " → " + api.next(stop));
                printUsage(api, response);
                if (api.next(stop) != NextStep.RUN_TOOLS_AND_CALL_AGAIN) {
                    System.out.println("  💬 " + api.finalText(content));
                    return;
                }
                messages.add(Map.of("role", "assistant", "content", content));
                List<Map<String, Object>> results = new ArrayList<>();
                for (Map<String, Object> toolUse : api.toolCalls(content)) {
                    System.out.println("  🔧 Code của bạn chạy " + toolUse.get("name") + " " + toolUse.get("input"));
                    results.add(Map.of("type", "tool_result", "tool_use_id", toolUse.get("id"),
                        "content", "Order A12: shipped on 2026-10-24, arriving 2026-10-28."));
                }
                messages.add(Map.of("role", "user", "content", results));
            }
        });

        LiveSection.run("max_tokens quá nhỏ: câu trả lời bị cắt giữa chừng", () -> {
            api.next("max_tokens");
            JsonNode response = raw.post(body(List.of(Map.of("role", "user", "content",
                "Liệt kê đầy đủ bảy giá trị của stop_reason và giải thích từng cái.")), 15)).json();
            String stop = response.path("stop_reason").asText();
            System.out.println("  stop_reason " + stop + " → " + api.next(stop) + " · \"" + api.finalText(blocks(response)) + "…\"");
            System.out.println("  stop_details: " + response.path("stop_details") + " → refusalCategory() của bạn: "
                + api.refusalCategory(stop, null));
        });
    }

    private static Map<String, Object> body(List<?> messages, int maxTokens) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", Claude.MODEL);
        body.put("max_tokens", maxTokens);
        body.put("system", "You are an order assistant. Use the tool when you need order data. Answer in Vietnamese.");
        body.put("tools", List.of(TOOL));
        body.put("messages", messages);
        return body;
    }

    @SuppressWarnings("unchecked")
    private static List<Map<String, Object>> blocks(JsonNode response) {
        if (!response.has("content")) throw new IllegalStateException("API trả về lỗi: " + response);
        return RawApi.JSON.convertValue(response.get("content"), List.class);
    }

    private static void printUsage(Lesson08Api api, JsonNode response) {
        JsonNode u = response.path("usage");
        Usage usage = new Usage(u.path("input_tokens").asLong(), u.path("output_tokens").asLong(),
            u.path("cache_creation_input_tokens").asLong(), u.path("cache_read_input_tokens").asLong());
        System.out.println("  usage: " + usage + " → prompt đầy đủ " + api.fullPromptTokens(usage) + " token");
    }
}
