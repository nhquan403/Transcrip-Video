package part2.lesson10;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/** Lời giải mẫu Phần 2 · Bài 10. Hãy tự làm trong Lesson10 trước khi đọc file này. */
public class Lesson10Solution implements Lesson10Api {

    private static final Set<String> EFFORTS = Set.of("low", "medium", "high", "xhigh", "max");
    private static final Set<String> XHIGH = Set.of("claude-fable-5", "claude-opus-4-8", "claude-opus-4-7", "claude-sonnet-5");

    @Override
    public DefaultThinking defaultThinking(String model) {
        return switch (model) {
            case "claude-opus-4-8", "claude-opus-4-7", "claude-opus-4-6" -> DefaultThinking.OFF_UNLESS_ENABLED;
            case "claude-sonnet-5" -> DefaultThinking.ON_BY_DEFAULT;
            case "claude-fable-5" -> DefaultThinking.ALWAYS_ON;
            case "claude-opus-4-5", "claude-sonnet-4-5" -> DefaultThinking.NO_ADAPTIVE;
            default -> throw new IllegalArgumentException("model lạ: " + model);
        };
    }

    @Override
    public BudgetTokens budgetTokens(String model) {
        return switch (model) {
            case "claude-fable-5", "claude-sonnet-5", "claude-opus-4-8", "claude-opus-4-7" -> BudgetTokens.REJECTED;
            case "claude-opus-4-6" -> BudgetTokens.DEPRECATED;
            case "claude-sonnet-4-5", "claude-opus-4-5" -> BudgetTokens.ONLY_WAY;
            default -> throw new IllegalArgumentException("model lạ: " + model);
        };
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<String> validate(String model, Map<String, Object> body) {
        List<String> errors = new ArrayList<>();
        Map<String, Object> thinking = (Map<String, Object>) body.get("thinking");
        Map<String, Object> outputConfig = (Map<String, Object>) body.get("output_config");
        Map<String, Object> toolChoice = (Map<String, Object>) body.get("tool_choice");
        String type = thinking == null ? null : (String) thinking.get("type");
        String effort = outputConfig == null ? null : (String) outputConfig.get("effort");

        if (body.containsKey("effort")) errors.add("effort belongs under output_config.effort");
        if (effort != null && !EFFORTS.contains(effort)) errors.add("unknown effort: " + effort);
        if ("xhigh".equals(effort) && !XHIGH.contains(model)) errors.add("xhigh not available on " + model);
        if ("enabled".equals(type) && budgetTokens(model) == BudgetTokens.REJECTED) errors.add("budget_tokens rejected on " + model);
        if ("adaptive".equals(type) && defaultThinking(model) == DefaultThinking.NO_ADAPTIVE) errors.add("adaptive not available on " + model);
        if ("disabled".equals(type) && defaultThinking(model) == DefaultThinking.ALWAYS_ON) errors.add("thinking cannot be disabled on " + model);

        boolean thinkingOn = "adaptive".equals(type) || "enabled".equals(type)
            || (type == null && (defaultThinking(model) == DefaultThinking.ON_BY_DEFAULT || defaultThinking(model) == DefaultThinking.ALWAYS_ON));
        String choice = toolChoice == null ? null : (String) toolChoice.get("type");
        if (thinkingOn && ("any".equals(choice) || "tool".equals(choice))) errors.add("tool_choice must be auto or none with thinking");
        return errors;
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> dropOldThinking(List<Map<String, Object>> messages) {
        int latestAssistant = -1;
        for (int i = 0; i < messages.size(); i++) {
            if ("assistant".equals(messages.get(i).get("role"))) latestAssistant = i;
        }
        List<Map<String, Object>> out = new ArrayList<>();
        for (int i = 0; i < messages.size(); i++) {
            Map<String, Object> turn = messages.get(i);
            if (!"assistant".equals(turn.get("role")) || i == latestAssistant || !(turn.get("content") instanceof List<?>)) {
                out.add(turn);
                continue;
            }
            List<Map<String, Object>> kept = ((List<Map<String, Object>>) turn.get("content")).stream()
                .filter(b -> !"thinking".equals(b.get("type")) && !"redacted_thinking".equals(b.get("type")))
                .toList();
            Map<String, Object> copy = new LinkedHashMap<>(turn);
            copy.put("content", kept);
            out.add(copy);
        }
        return out;
    }
}
