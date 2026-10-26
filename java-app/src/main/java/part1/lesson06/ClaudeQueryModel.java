package part1.lesson06;

import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.ContentBlock;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.MessageParam;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.ToolResultBlockParam;
import common.Claude;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import part1.lesson06.Lesson06Api.ModelReply;
import part1.lesson06.Lesson06Api.SdkMessage;
import part1.lesson06.Lesson06Api.ToolCall;
import part1.lesson06.Lesson06Api.Usage;
import part1.lesson06.Lesson06Api.UserMessage;

/**
 * Model thật cho query() thu nhỏ của bài 06 và 07.
 *
 * Hội thoại gửi lên API chỉ được nối thêm: câu trả lời của Claude được giữ nguyên (kể cả thinking),
 * còn phía user được dịch từ các UserMessage mới mà query() của bạn thêm vào.
 * Một hội thoại chỉ có một message nghĩa là phiên mới, nên lịch sử cũ bị bỏ, giống query() thật.
 */
public final class ClaudeQueryModel implements Lesson06Api.Model {
    private final Claude claude;
    private final Map<String, String> toolDescriptions;
    private final List<MessageParam> messages = new ArrayList<>();
    private int synced;

    /** toolDescriptions: mô tả của mọi tool có thể dùng; mỗi lần gọi chỉ gửi những tool query() cho phép. */
    public ClaudeQueryModel(Claude claude, Map<String, String> toolDescriptions) {
        this.claude = claude;
        this.toolDescriptions = toolDescriptions;
    }

    /** Tham số model chỉ để hiển thị; model thật luôn là Claude.MODEL (đặt bằng biến môi trường CLAUDE_MODEL). */
    @Override
    public ModelReply reply(String systemPrompt, List<SdkMessage> conversation, List<String> tools, String model) {
        if (conversation.size() == 1) {
            messages.clear();
            synced = 0;
        }
        for (SdkMessage message : conversation.subList(synced, conversation.size())) {
            if (message instanceof UserMessage user) {
                messages.add(user.prompt() != null
                    ? MessageParam.ofUser(user.prompt())
                    : MessageParam.ofUserOfContentBlockParams(user.toolResults().stream()
                        .map(r -> ContentBlockParam.ofToolResult(ToolResultBlockParam.builder()
                            .toolUseId(r.toolCallId()).content(r.content()).isError(r.isError()).build()))
                        .toList()));
            }
            // AssistantMessage đã có sẵn ở dạng gốc, thêm ngay sau khi Claude trả lời.
        }

        MessageCreateParams.Builder params = Claude.params().system(systemPrompt).messages(messages);
        for (String name : tools) params.addTool(tool(name));
        Message response = claude.create(params.build());
        messages.add(response.toParam());
        synced = conversation.size() + 1;

        List<ToolCall> calls = new ArrayList<>();
        for (ContentBlock block : response.content()) {
            block.toolUse().ifPresent(use -> calls.add(new ToolCall(use.id(), use.name(),
                String.valueOf(use._input().convert(Map.class).get("input")))));
        }
        return new ModelReply(Claude.text(response), calls,
            new Usage(response.usage().inputTokens(), response.usage().outputTokens()));
    }

    private Tool tool(String name) {
        return Tool.builder()
            .name(name)
            .description(toolDescriptions.getOrDefault(name, name))
            .strict(true)
            .inputSchema(Tool.InputSchema.builder()
                .properties(Tool.InputSchema.Properties.builder()
                    .putAdditionalProperty("input", JsonValue.from(Map.of("type", "string")))
                    .build())
                .required(List.of("input"))
                .putAdditionalProperty("additionalProperties", JsonValue.from(false))
                .build())
            .build();
    }
}
