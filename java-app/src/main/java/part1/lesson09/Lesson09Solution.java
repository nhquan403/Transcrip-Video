package part1.lesson09;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.UnaryOperator;
import java.util.stream.Collectors;

/** Lời giải mẫu bài 09. Hãy tự làm {@link Lesson09} trước khi xem. */
public class Lesson09Solution implements Lesson09Api {

    @Override
    public List<ToolUse> clientToolUses(Response response) {
        List<ToolUse> uses = new ArrayList<>();
        for (Block block : response.content()) {
            if (block instanceof ToolUse use) uses.add(use);
        }
        return uses;
    }

    @Override
    public List<ToolResult> runTools(List<ToolUse> uses, Map<String, UnaryOperator<String>> tools) {
        List<ToolResult> results = new ArrayList<>();
        for (ToolUse use : uses) {
            UnaryOperator<String> tool = tools.get(use.name());
            if (tool == null) {
                results.add(new ToolResult(use.id(), "error: unknown tool " + use.name(), true));
                continue;
            }
            try {
                results.add(new ToolResult(use.id(), tool.apply(use.input()), false));
            } catch (RuntimeException e) {
                results.add(new ToolResult(use.id(), "error: " + e.getMessage(), true));
            }
        }
        return results;
    }

    @Override
    public boolean handshakeOk(AssistantBlocks assistant, UserToolResults results) {
        List<String> expected = assistant.content().stream()
            .filter(b -> b instanceof ToolUse).map(b -> ((ToolUse) b).id()).sorted().toList();
        List<String> actual = results.results().stream().map(ToolResult::toolUseId).sorted().toList();
        return expected.equals(actual);
    }

    @Override
    public String runLoop(String prompt, Api api, Map<String, UnaryOperator<String>> tools, int maxIterations) {
        List<Msg> messages = new ArrayList<>();
        messages.add(new UserText(prompt));
        for (int i = 0; i < maxIterations; i++) {
            Response response = api.call(List.copyOf(messages));
            messages.add(new AssistantBlocks(response.content()));
            switch (response.stopReason()) {
                case "tool_use" -> messages.add(new UserToolResults(runTools(clientToolUses(response), tools)));
                case "end_turn" -> {
                    return response.content().stream()
                        .filter(b -> b instanceof Text).map(b -> ((Text) b).text())
                        .collect(Collectors.joining("\n"));
                }
                default -> throw new IllegalStateException("Unexpected stop reason: " + response.stopReason());
            }
        }
        throw new IllegalStateException("No answer within " + maxIterations + " API calls");
    }
}
