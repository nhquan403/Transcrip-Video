package part2.lesson24;

import java.util.Map;

/**
 * Phần 2 · Bài 24: Portable Instructions Across Interfaces.
 * {@link Lesson24} là chỗ bạn làm bài, {@link Lesson24Solution} là lời giải mẫu.
 */
public interface Lesson24Api {

    enum Channel { SYSTEM_PROMPT, USER_MESSAGE, IN_SESSION }

    /**
     * Bài 1 (chỉ dẫn thực sự nằm ở đâu): "system_prompt", "output_style", "append" ghi thẳng vào SYSTEM_PROMPT.
     * "claude_md" đi vào như một USER_MESSAGE. "typed_in_session" là IN_SESSION. Khác: IllegalArgumentException.
     */
    Channel channelOf(String mechanism);

    /** Bài 2: cơ chế nào làm đổi system prompt cache? Chỉ những cơ chế ghi vào system prompt. */
    boolean changesSystemPromptCache(String mechanism);

    /** Bài 3: chỉ dẫn có còn sau khi phiên kết thúc không? Gõ trong phiên thì không; các cơ chế khác thì còn. */
    boolean persistsAfterSession(String mechanism);

    /**
     * Bài 4 (dựng request như SDK làm): system prompt đi ở trường system; nội dung CLAUDE.md được chèn thành một lượt user
     * ĐỨNG TRƯỚC lượt user thật. Trả về Map body với "system" (nếu khác null) và "messages".
     * claudeMd null hoặc rỗng thì không chèn gì.
     */
    Map<String, Object> buildRequest(String systemPrompt, String claudeMd, String userText);

    /**
     * Bài 5 (chọn nơi đặt quy tắc): "system-level rule" → "append or output style"; "portable project rule" → "committed CLAUDE.md";
     * "one-off steering" → "in-session message"; "rule for every surface" → "committed CLAUDE.md". Khác: IllegalArgumentException.
     */
    String bestHome(String need);

    /** Dùng chung cho bài 4. */
    static Map<String, Object> userTurn(String text) {
        return Map.of("role", "user", "content", text);
    }
}
