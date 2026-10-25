package lesson10;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import java.util.function.Supplier;
import java.util.function.UnaryOperator;
import java.util.stream.Collectors;
import lesson09.Lesson09Api.Api;
import lesson09.Lesson09Api.AssistantBlocks;
import lesson09.Lesson09Api.Msg;
import lesson09.Lesson09Api.Response;
import lesson09.Lesson09Api.Text;
import lesson09.Lesson09Api.ToolResult;
import lesson09.Lesson09Api.ToolUse;
import lesson09.Lesson09Api.UserText;
import lesson09.Lesson09Api.UserToolResults;

/** Lời giải mẫu bài 10. Hãy tự làm {@link Lesson10} trước khi xem. */
public class Lesson10Solution implements Lesson10Api {

    @Override
    @SuppressWarnings("unchecked")
    public Map<String, Object> parseToolInput(List<String> partialJsonDeltas) {
        String json = String.join("", partialJsonDeltas);
        try {
            return new ObjectMapper().readValue(json, Map.class);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Invalid tool input JSON: " + json, e);
        }
    }

    @Override
    public String withRetry(Supplier<String> tool, int maxAttempts, Predicate<RuntimeException> retryable) {
        RuntimeException last = null;
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return tool.get();
            } catch (RuntimeException e) {
                if (!retryable.test(e)) throw e;
                last = e;
            }
        }
        throw last;
    }

    @Override
    public HarnessResult run(String prompt, Api api, Map<String, UnaryOperator<String>> tools, Policy policy,
                             int maxTurns, int maxAttempts, Predicate<RuntimeException> retryable) {
        List<Msg> messages = new ArrayList<>();
        messages.add(new UserText(prompt));
        List<String> log = new ArrayList<>();
        int turns = 0;
        while (true) {
            Response response;
            try {
                response = api.call(List.copyOf(messages));
            } catch (RuntimeException e) {
                log.add("error: " + e.getMessage());
                return new HarnessResult(Stop.ERROR, null, turns, log);
            }
            messages.add(new AssistantBlocks(response.content()));

            if (response.stopReason().equals("end_turn")) {
                String answer = response.content().stream()
                    .filter(b -> b instanceof Text).map(b -> ((Text) b).text()).collect(Collectors.joining("\n"));
                return new HarnessResult(Stop.DONE, answer, turns, log);
            }
            if (!response.stopReason().equals("tool_use")) {
                log.add("error: stop reason " + response.stopReason());
                return new HarnessResult(Stop.ERROR, null, turns, log);
            }
            if (turns >= maxTurns) {
                return new HarnessResult(Stop.MAX_TURNS, null, turns, log);
            }

            int turn = turns + 1;
            List<ToolResult> results = new ArrayList<>();
            for (var block : response.content()) {
                if (!(block instanceof ToolUse call)) continue;
                if (policy.check(call) == Decision.BLOCK) {
                    log.add("turn " + turn + " blocked " + call.name());
                    results.add(new ToolResult(call.id(), "error: blocked by policy", true));
                    continue;
                }
                UnaryOperator<String> tool = tools.get(call.name());
                try {
                    if (tool == null) throw new IllegalArgumentException("unknown tool " + call.name());
                    String output = withRetry(() -> tool.apply(call.input()), maxAttempts, retryable);
                    log.add("turn " + turn + " ran " + call.name());
                    results.add(new ToolResult(call.id(), output, false));
                } catch (RuntimeException e) {
                    log.add("turn " + turn + " failed " + call.name() + ": " + e.getMessage());
                    results.add(new ToolResult(call.id(), "error: " + e.getMessage(), true));
                }
            }
            messages.add(new UserToolResults(results));
            turns = turn;
        }
    }
}
