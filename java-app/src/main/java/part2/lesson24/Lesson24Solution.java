package part2.lesson24;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Lời giải mẫu Phần 2 · Bài 24. Hãy tự làm trong Lesson24 trước khi đọc file này. */
public class Lesson24Solution implements Lesson24Api {

    @Override
    public Channel channelOf(String mechanism) {
        return switch (mechanism) {
            case "system_prompt", "output_style", "append" -> Channel.SYSTEM_PROMPT;
            case "claude_md" -> Channel.USER_MESSAGE;
            case "typed_in_session" -> Channel.IN_SESSION;
            default -> throw new IllegalArgumentException("cơ chế lạ: " + mechanism);
        };
    }

    @Override
    public boolean changesSystemPromptCache(String mechanism) {
        return channelOf(mechanism) == Channel.SYSTEM_PROMPT;
    }

    @Override
    public boolean persistsAfterSession(String mechanism) {
        return channelOf(mechanism) != Channel.IN_SESSION;
    }

    @Override
    public Map<String, Object> buildRequest(String systemPrompt, String claudeMd, String userText) {
        Map<String, Object> body = new LinkedHashMap<>();
        if (systemPrompt != null) body.put("system", systemPrompt);
        List<Map<String, Object>> messages = new ArrayList<>();
        if (claudeMd != null && !claudeMd.isBlank()) messages.add(Lesson24Api.userTurn(claudeMd));
        messages.add(Lesson24Api.userTurn(userText));
        body.put("messages", messages);
        return body;
    }

    @Override
    public String bestHome(String need) {
        return switch (need) {
            case "system-level rule" -> "append or output style";
            case "portable project rule", "rule for every surface" -> "committed CLAUDE.md";
            case "one-off steering" -> "in-session message";
            default -> throw new IllegalArgumentException("nhu cầu lạ: " + need);
        };
    }
}
