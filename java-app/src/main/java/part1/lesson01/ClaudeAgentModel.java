package part1.lesson01;

import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.ContentBlock;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.MessageParam;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.ToolChoiceAuto;
import com.anthropic.models.messages.ToolResultBlockParam;
import com.anthropic.models.messages.ToolUseBlock;
import common.Claude;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Model thật cho vòng lặp agent của bài 01: Claude nhìn mục tiêu và kết quả tool, rồi tự quyết định bước tiếp theo.
 *
 * Mỗi tool nhận một chuỗi "input". Hội thoại với API chỉ được nối thêm (không sửa lượt cũ):
 * lượt đầu gửi mục tiêu, các lượt sau gửi kết quả tool của bước vừa chạy.
 * Dùng một instance cho một lần chạy runAgent.
 */
public final class ClaudeAgentModel implements Lesson01Api.Model {
    private final Claude claude;
    private final String system;
    private final List<Tool> tools = new ArrayList<>();
    private final List<MessageParam> messages = new ArrayList<>();
    private String pendingToolUseId;

    /** toolDescriptions: tên tool và mô tả để Claude biết khi nào nên dùng nó. */
    public ClaudeAgentModel(Claude claude, String system, Map<String, String> toolDescriptions) {
        this.claude = claude;
        this.system = system;
        toolDescriptions.forEach((name, description) -> tools.add(Tool.builder()
            .name(name)
            .description(description)
            .strict(true)
            .inputSchema(Tool.InputSchema.builder()
                .properties(Tool.InputSchema.Properties.builder()
                    .putAdditionalProperty("input", JsonValue.from(Map.of("type", "string")))
                    .build())
                .required(List.of("input"))
                .putAdditionalProperty("additionalProperties", JsonValue.from(false))
                .build())
            .build()));
    }

    @Override
    public Lesson01Api.Action next(String goal, List<Lesson01Api.Step> history) {
        if (messages.isEmpty()) {
            messages.add(MessageParam.ofUser(goal));
        } else if (pendingToolUseId != null) {
            String observation = history.get(history.size() - 1).observation();
            messages.add(MessageParam.ofUserOfContentBlockParams(List.of(ContentBlockParam.ofToolResult(
                ToolResultBlockParam.builder()
                    .toolUseId(pendingToolUseId)
                    .content(observation)
                    .isError(observation.startsWith("error:"))
                    .build()))));
            pendingToolUseId = null;
        }

        MessageCreateParams.Builder params = Claude.params()
            .system(system)
            .messages(messages)
            // Mỗi lượt tối đa một tool, khớp với Action = một CallTool hoặc một Finish.
            .toolChoice(ToolChoiceAuto.builder().disableParallelToolUse(true).build());
        tools.forEach(params::addTool);
        Message response = claude.create(params.build());
        messages.add(response.toParam());

        for (ContentBlock block : response.content()) {
            if (block.isToolUse()) {
                ToolUseBlock toolUse = block.asToolUse();
                pendingToolUseId = toolUse.id();
                String input = String.valueOf(toolUse._input().convert(Map.class).get("input"));
                System.out.println("    🤖 Claude gọi tool " + toolUse.name() + "(\"" + input + "\")");
                return new Lesson01Api.CallTool(toolUse.name(), input);
            }
        }
        return new Lesson01Api.Finish(Claude.text(response));
    }
}
