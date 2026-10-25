package lesson07;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.function.Consumer;
import java.util.function.UnaryOperator;
import lesson06.Lesson06Api.AssistantMessage;
import lesson06.Lesson06Api.Model;
import lesson06.Lesson06Api.ModelReply;
import lesson06.Lesson06Api.SdkMessage;
import lesson06.Lesson06Api.SystemInit;
import lesson06.Lesson06Api.ToolCall;
import lesson06.Lesson06Api.ToolResult;
import lesson06.Lesson06Api.Usage;
import lesson06.Lesson06Api.UserMessage;

/** Lời giải mẫu bài 07. Hãy tự làm {@link Lesson07} trước khi xem. */
public class Lesson07Solution implements Lesson07Api {

    @Override
    public double costUsd(Usage usage, Pricing pricing) {
        return (usage.inputTokens() * pricing.inputUsdPerMTok() + usage.outputTokens() * pricing.outputUsdPerMTok())
            / 1_000_000;
    }

    @Override
    public int countTurns(List<SdkMessage> messages) {
        return (int) messages.stream()
            .filter(m -> m instanceof UserMessage user && !user.toolResults().isEmpty())
            .count();
    }

    @Override
    public RunResult run(String prompt, String systemPrompt, Model model, Map<String, UnaryOperator<String>> tools,
                         Limits limits, Pricing pricing, Consumer<SdkMessage> out) {
        String sessionId = UUID.randomUUID().toString();
        List<String> toolNames = tools.keySet().stream().sorted().toList();
        out.accept(new SystemInit(sessionId, "default", toolNames, systemPrompt));

        List<SdkMessage> conversation = new ArrayList<>();
        conversation.add(new UserMessage(prompt, List.of()));
        Usage usage = new Usage(0, 0);
        int turns = 0;
        while (true) {
            double cost = costUsd(usage, pricing);
            if (turns > 0 && limits.maxBudgetUsd() != null && cost >= limits.maxBudgetUsd()) {
                return new RunResult("error_max_budget_usd", null, usage, cost, turns, sessionId);
            }
            ModelReply reply = model.reply(systemPrompt, List.copyOf(conversation), toolNames, "default");
            usage = usage.plus(reply.usage());
            AssistantMessage assistant = new AssistantMessage(reply.text(), reply.toolCalls());
            conversation.add(assistant);
            out.accept(assistant);

            if (reply.toolCalls().isEmpty()) {
                return new RunResult("success", reply.text(), usage, costUsd(usage, pricing), turns, sessionId);
            }
            if (limits.maxTurns() != null && turns >= limits.maxTurns()) {
                return new RunResult("error_max_turns", null, usage, costUsd(usage, pricing), turns, sessionId);
            }
            List<ToolResult> results = new ArrayList<>();
            for (ToolCall call : reply.toolCalls()) {
                UnaryOperator<String> tool = tools.get(call.name());
                results.add(tool == null
                    ? new ToolResult(call.id(), "error: unknown tool " + call.name(), true)
                    : new ToolResult(call.id(), tool.apply(call.input()), false));
            }
            UserMessage toolResults = new UserMessage(null, results);
            conversation.add(toolResults);
            out.accept(toolResults);
            turns++;
        }
    }

    @Override
    public String readResult(RunResult result) {
        if (!result.subtype().equals("success")) {
            throw new IllegalStateException("Run ended with " + result.subtype() + " after spending $"
                + String.format(Locale.ROOT, "%.4f", result.totalCostUsd()));
        }
        return result.result();
    }

    @Override
    public String describeStop(RunResult result) {
        String what = switch (result.subtype()) {
            case "success" -> "done";
            case "error_max_turns" -> "hit max turns";
            case "error_max_budget_usd" -> "hit max budget";
            default -> result.subtype();
        };
        return what + " after " + result.numTurns() + " turns, cost $"
            + String.format(Locale.ROOT, "%.4f", result.totalCostUsd()) + ", session " + result.sessionId();
    }
}
