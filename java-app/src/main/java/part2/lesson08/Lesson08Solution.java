package part2.lesson08;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/** Lời giải mẫu Phần 2 · Bài 08. Hãy tự làm trong Lesson08 trước khi đọc file này. */
public class Lesson08Solution implements Lesson08Api {

    @Override
    public String finalText(List<Map<String, Object>> content) {
        return content.stream()
            .filter(b -> "text".equals(b.get("type")))
            .map(b -> String.valueOf(b.get("text")))
            .collect(Collectors.joining("\n"));
    }

    @Override
    public List<Map<String, Object>> toolCalls(List<Map<String, Object>> content) {
        return content.stream().filter(b -> "tool_use".equals(b.get("type"))).toList();
    }

    @Override
    public NextStep next(String stopReason) {
        return switch (stopReason) {
            case "end_turn" -> NextStep.RETURN_ANSWER;
            case "tool_use" -> NextStep.RUN_TOOLS_AND_CALL_AGAIN;
            case "max_tokens" -> NextStep.RAISE_CAP_OR_CONTINUE;
            case "pause_turn" -> NextStep.SEND_BACK_TO_CONTINUE;
            case "refusal" -> NextStep.HANDLE_REFUSAL;
            case "stop_sequence" -> NextStep.STOP_SEQUENCE_HIT;
            case "model_context_window_exceeded" -> NextStep.CONTEXT_WINDOW_FULL;
            default -> throw new IllegalArgumentException("stop_reason lạ: " + stopReason);
        };
    }

    @Override
    public long fullPromptTokens(Usage usage) {
        return usage.inputTokens() + usage.cacheCreationInputTokens() + usage.cacheReadInputTokens();
    }

    @Override
    public Optional<String> refusalCategory(String stopReason, Map<String, Object> stopDetails) {
        if (!"refusal".equals(stopReason) || stopDetails == null) return Optional.empty();
        return Optional.ofNullable(stopDetails.get("category")).map(String::valueOf);
    }
}
