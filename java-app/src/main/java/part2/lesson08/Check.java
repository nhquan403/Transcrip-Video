package part2.lesson08;

import static common.Checker.assertEquals;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import part2.lesson08.Lesson08Api.NextStep;
import part2.lesson08.Lesson08Api.Usage;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson08Api api = useSolution ? new Lesson08Solution() : new Lesson08();
        Checker c = new Checker();
        List<Map<String, Object>> content = List.of(
            Map.of("type", "thinking", "thinking", "", "signature", "sig"),
            Map.of("type", "text", "text", "Để mình tra đơn hàng."),
            Map.of("type", "tool_use", "id", "toolu_1", "name", "lookup_order", "input", Map.of("id", "A12")),
            Map.of("type", "text", "text", "Chờ chút nhé."),
            Map.of("type", "tool_use", "id", "toolu_2", "name", "lookup_customer", "input", Map.of("id", "C7")));

        c.check("Bài 1: thinking đứng đầu vẫn lấy đúng text", () ->
            assertEquals("Để mình tra đơn hàng.\nChờ chút nhé.", api.finalText(content)));
        c.check("Bài 1: không có block text nào thì trả về chuỗi rỗng", () ->
            assertEquals("", api.finalText(List.of(Map.of("type", "tool_use", "id", "t", "name", "x", "input", Map.of())))));
        c.check("Bài 2: lấy đủ các tool_use theo thứ tự", () ->
            assertEquals(List.of("toolu_1", "toolu_2"), api.toolCalls(content).stream().map(b -> b.get("id")).toList()));

        c.check("Bài 3: bốn stop_reason hay gặp", () -> {
            assertEquals(NextStep.RETURN_ANSWER, api.next("end_turn"));
            assertEquals(NextStep.RUN_TOOLS_AND_CALL_AGAIN, api.next("tool_use"));
            assertEquals(NextStep.RAISE_CAP_OR_CONTINUE, api.next("max_tokens"));
            assertEquals(NextStep.HANDLE_REFUSAL, api.next("refusal"));
        });
        c.check("Bài 3: ba giá trị còn lại, pause_turn không được coi là xong", () -> {
            assertEquals(NextStep.SEND_BACK_TO_CONTINUE, api.next("pause_turn"));
            assertEquals(NextStep.STOP_SEQUENCE_HIT, api.next("stop_sequence"));
            assertEquals(NextStep.CONTEXT_WINDOW_FULL, api.next("model_context_window_exceeded"));
            expectThrows(IllegalArgumentException.class, () -> api.next("done"));
        });

        c.check("Bài 4: input_tokens chưa phải cả prompt", () -> {
            assertEquals(12_150L, api.fullPromptTokens(new Usage(150, 300, 0, 12_000)));
            assertEquals(10_400L, api.fullPromptTokens(new Usage(400, 50, 10_000, 0)));
        });

        c.check("Bài 5: chỉ đọc stop_details khi là refusal", () -> {
            assertEquals(Optional.of("cyber"), api.refusalCategory("refusal", Map.of("category", "cyber", "explanation", "...")));
            assertEquals(Optional.empty(), api.refusalCategory("end_turn", null));
            assertEquals(Optional.empty(), api.refusalCategory("max_tokens", Map.of("category", "stale")));
            assertEquals(Optional.empty(), api.refusalCategory("refusal", null));
        });

        return c.summary();
    }
}
