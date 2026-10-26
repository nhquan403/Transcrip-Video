package part1.lesson09;

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
import part1.lesson09.Lesson09Api.AssistantBlocks;
import part1.lesson09.Lesson09Api.Block;
import part1.lesson09.Lesson09Api.Msg;
import part1.lesson09.Lesson09Api.Response;
import part1.lesson09.Lesson09Api.ServerToolUse;
import part1.lesson09.Lesson09Api.Text;
import part1.lesson09.Lesson09Api.ToolUse;
import part1.lesson09.Lesson09Api.UserText;
import part1.lesson09.Lesson09Api.UserToolResults;

/**
 * Nối Api thu gọn của bài 09 với Messages API thật (dùng ở bài 09, 10, 12).
 *
 * Mảng messages thật chỉ được nối thêm: câu trả lời của Claude giữ nguyên dạng gốc (kể cả thinking),
 * các lượt user mới trong mảng của bạn được dịch sang text hoặc tool_result.
 * Mảng của bạn chỉ có một message nghĩa là cuộc hội thoại mới.
 */
public final class ClaudeApi implements Lesson09Api.Api {
    private final Claude claude;
    private final String system;
    private final List<Tool> tools = new ArrayList<>();
    private final List<MessageParam> messages = new ArrayList<>();
    private int synced;

    /** toolDescriptions: tên và mô tả của từng client tool; mỗi tool nhận một chuỗi "input". */
    public ClaudeApi(Claude claude, String system, Map<String, String> toolDescriptions) {
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
    public Response call(List<Msg> conversation) {
        if (conversation.size() == 1) {
            messages.clear();
            synced = 0;
        }
        for (Msg msg : conversation.subList(synced, conversation.size())) {
            switch (msg) {
                case UserText text -> messages.add(MessageParam.ofUser(text.text()));
                case UserToolResults results -> messages.add(MessageParam.ofUserOfContentBlockParams(
                    results.results().stream()
                        .map(r -> ContentBlockParam.ofToolResult(ToolResultBlockParam.builder()
                            .toolUseId(r.toolUseId()).content(r.content()).isError(r.isError()).build()))
                        .toList()));
                case AssistantBlocks ignored -> { } // đã có dạng gốc
            }
        }

        MessageCreateParams.Builder params = Claude.params().system(system).messages(messages);
        tools.forEach(params::addTool);
        Message response = claude.create(params.build());
        messages.add(response.toParam());
        synced = conversation.size() + 1;

        List<Block> blocks = new ArrayList<>();
        for (ContentBlock block : response.content()) {
            block.text().ifPresent(t -> blocks.add(new Text(t.text())));
            block.toolUse().ifPresent(use -> blocks.add(new ToolUse(use.id(), use.name(),
                String.valueOf(use._input().convert(Map.class).get("input")))));
            block.serverToolUse().ifPresent(use -> blocks.add(new ServerToolUse(use.id(), use.name().toString(),
                String.valueOf(use._input()))));
        }
        String stop = response.stopReason().map(Object::toString).orElse("end_turn");
        return new Response(stop, blocks);
    }
}
