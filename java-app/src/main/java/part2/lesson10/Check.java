package part2.lesson10;

import static common.Checker.assertEquals;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.List;
import java.util.Map;
import part2.lesson10.Lesson10Api.BudgetTokens;
import part2.lesson10.Lesson10Api.DefaultThinking;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson10Api api = useSolution ? new Lesson10Solution() : new Lesson10();
        Checker c = new Checker();

        c.check("Bài 1: mặc định phụ thuộc model", () -> {
            assertEquals(DefaultThinking.OFF_UNLESS_ENABLED, api.defaultThinking("claude-opus-4-8"));
            assertEquals(DefaultThinking.OFF_UNLESS_ENABLED, api.defaultThinking("claude-opus-4-7"));
            assertEquals(DefaultThinking.ON_BY_DEFAULT, api.defaultThinking("claude-sonnet-5"));
            assertEquals(DefaultThinking.ALWAYS_ON, api.defaultThinking("claude-fable-5"));
            assertEquals(DefaultThinking.NO_ADAPTIVE, api.defaultThinking("claude-sonnet-4-5"));
            expectThrows(IllegalArgumentException.class, () -> api.defaultThinking("claude-x"));
        });
        c.check("Bài 2: bậc thang budget_tokens", () -> {
            assertEquals(BudgetTokens.REJECTED, api.budgetTokens("claude-opus-4-7"));
            assertEquals(BudgetTokens.REJECTED, api.budgetTokens("claude-fable-5"));
            assertEquals(BudgetTokens.DEPRECATED, api.budgetTokens("claude-opus-4-6"));
            assertEquals(BudgetTokens.ONLY_WAY, api.budgetTokens("claude-opus-4-5"));
        });

        c.check("Bài 3: request đúng chuẩn mới không có lỗi", () -> assertEquals(List.of(), api.validate("claude-opus-4-8",
            Map.of("thinking", Map.of("type", "adaptive", "display", "summarized"), "output_config", Map.of("effort", "xhigh"),
                "tool_choice", Map.of("type", "auto")))));
        c.check("Bài 3: effort đặt sai chỗ, budget_tokens trên model mới", () -> assertEquals(
            List.of("effort belongs under output_config.effort", "budget_tokens rejected on claude-opus-4-8"),
            api.validate("claude-opus-4-8", Map.of("effort", "high", "thinking", Map.of("type", "enabled", "budget_tokens", 8000)))));
        c.check("Bài 3: xhigh và adaptive trên model cũ, tắt thinking trên Fable 5", () -> {
            assertEquals(List.of("xhigh not available on claude-sonnet-4-5", "adaptive not available on claude-sonnet-4-5"),
                api.validate("claude-sonnet-4-5", Map.of("output_config", Map.of("effort", "xhigh"), "thinking", Map.of("type", "adaptive"))));
            assertEquals(List.of("thinking cannot be disabled on claude-fable-5"),
                api.validate("claude-fable-5", Map.of("thinking", Map.of("type", "disabled"))));
            assertEquals(List.of("unknown effort: extreme"), api.validate("claude-opus-4-7", Map.of("output_config", Map.of("effort", "extreme"))));
        });
        c.check("Bài 3: ép tool khi thinking đang bật (kể cả bật mặc định trên Sonnet 5)", () -> {
            String err = "tool_choice must be auto or none with thinking";
            assertEquals(List.of(err), api.validate("claude-opus-4-7",
                Map.of("thinking", Map.of("type", "adaptive"), "tool_choice", Map.of("type", "any"))));
            assertEquals(List.of(err), api.validate("claude-sonnet-5", Map.of("tool_choice", Map.of("type", "tool", "name", "x"))));
            assertEquals(List.of(), api.validate("claude-opus-4-8", Map.of("tool_choice", Map.of("type", "any"))));
        });

        c.check("Bài 4: lượt assistant mới nhất giữ nguyên, lượt cũ bỏ thinking", () -> {
            Map<String, Object> thinkingOld = Map.of("type", "thinking", "thinking", "cũ", "signature", "s1");
            Map<String, Object> thinkingNew = Map.of("type", "thinking", "thinking", "", "signature", "s2");
            Map<String, Object> redacted = Map.of("type", "redacted_thinking", "data", "enc");
            Map<String, Object> toolUse = Map.of("type", "tool_use", "id", "t1", "name", "x", "input", Map.of());
            List<Map<String, Object>> messages = List.of(
                Map.of("role", "user", "content", "hi"),
                Map.of("role", "assistant", "content", List.of(thinkingOld, redacted, Map.of("type", "text", "text", "A"))),
                Map.of("role", "user", "content", "tiếp"),
                Map.of("role", "assistant", "content", List.of(thinkingNew, redacted, toolUse)));
            List<Map<String, Object>> out = api.dropOldThinking(messages);
            assertEquals(List.of(Map.of("type", "text", "text", "A")), out.get(1).get("content"));
            assertEquals(messages.get(3), out.get(3));
            assertEquals(3, ((List<?>) messages.get(1).get("content")).size());
        });

        return c.summary();
    }
}
