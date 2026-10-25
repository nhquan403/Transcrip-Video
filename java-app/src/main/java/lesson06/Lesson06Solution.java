package lesson06;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Consumer;
import java.util.function.UnaryOperator;

/** Lời giải mẫu bài 06. Hãy tự làm {@link Lesson06} trước khi xem. */
public class Lesson06Solution implements Lesson06Api {

    @Override
    public void query(String prompt, Options options, Model model, Map<String, UnaryOperator<String>> tools,
                      Consumer<SdkMessage> out) {
        String sessionId = UUID.randomUUID().toString();
        List<String> allowed = options.allowedTools().stream().sorted().toList();
        out.accept(new SystemInit(sessionId, options.model(), allowed, options.systemPrompt()));

        List<SdkMessage> conversation = new ArrayList<>();
        conversation.add(new UserMessage(prompt, List.of()));
        Usage usage = new Usage(0, 0);
        int turns = 0;
        while (true) {
            ModelReply reply = model.reply(options.systemPrompt(), List.copyOf(conversation), allowed, options.model());
            usage = usage.plus(reply.usage());
            AssistantMessage assistant = new AssistantMessage(reply.text(), reply.toolCalls());
            conversation.add(assistant);
            out.accept(assistant);

            if (reply.toolCalls().isEmpty()) {
                out.accept(new ResultMessage("success", reply.text(), usage, turns, sessionId));
                return;
            }
            if (options.maxTurns() != null && turns >= options.maxTurns()) {
                out.accept(new ResultMessage("error_max_turns", null, usage, turns, sessionId));
                return;
            }
            List<ToolResult> results = new ArrayList<>();
            for (ToolCall call : reply.toolCalls()) {
                UnaryOperator<String> tool = options.allowedTools().contains(call.name()) ? tools.get(call.name()) : null;
                results.add(tool == null
                    ? new ToolResult(call.id(), "error: tool " + call.name() + " is not allowed", true)
                    : new ToolResult(call.id(), tool.apply(call.input()), false));
            }
            UserMessage toolResults = new UserMessage(null, results);
            conversation.add(toolResults);
            out.accept(toolResults);
            turns++;
        }
    }

    @Override
    public String resultText(List<SdkMessage> messages) {
        for (SdkMessage message : messages) {
            if (message instanceof ResultMessage result) {
                if (!result.subtype().equals("success")) {
                    throw new IllegalStateException("Run ended with " + result.subtype());
                }
                return result.result();
            }
        }
        throw new IllegalStateException("No result message");
    }
}
