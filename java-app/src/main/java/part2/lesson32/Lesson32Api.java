package part2.lesson32;

/**
 * Phần 2 · Bài 32: settings.json: Permissions and Hooks.
 * {@link Lesson32} là chỗ bạn làm bài, {@link Lesson32Solution} là lời giải mẫu.
 */
public interface Lesson32Api {

    enum Decision { ALLOW, DENY, ASK }

    enum HookEvent { PRE_TOOL_USE, POST_TOOL_USE, NOTIFICATION, STOP, SESSION_START }

    /**
     * Bài 1 (quyết định permission từ settings.json): settingsJson có dạng
     * {"permissions": {"allow": [...], "deny": [...], "ask": [...]}} (danh sách nào thiếu thì coi là rỗng).
     * Một rule là "Tool" (khớp MỌI lời gọi tool đó) hoặc "Tool(pattern)":
     * pattern kết thúc bằng ":*" (ví dụ "Bash(npm run test:*)") khớp khi argument bằng đúng phần trước ":*"
     * hoặc bắt đầu bằng phần đó cộng một dấu cách; pattern khác phải bằng đúng argument.
     * Thứ tự xét: có rule deny khớp → DENY; nếu không, có rule ask khớp → ASK; nếu không, có rule allow khớp → ALLOW;
     * không rule nào khớp → ASK (mặc định hỏi người dùng).
     */
    Decision decide(String settingsJson, String tool, String argument);

    /**
     * Bài 2a (chọn sự kiện hook): "block a risky command" → PRE_TOOL_USE; "log a tool result" → POST_TOOL_USE;
     * "react when Claude messages you" → NOTIFICATION; "run checks when a response completes" → STOP;
     * "set up a new session" → SESSION_START. Khác: IllegalArgumentException.
     */
    HookEvent eventFor(String goal);

    /** Bài 2b: hook ở sự kiện này có thể chặn một tool call TRƯỚC khi nó chạy không? Chỉ PRE_TOOL_USE. */
    boolean canBlockToolCall(HookEvent event);

    /**
     * Bài 3 (áp kết quả của một PreToolUse hook): hookOutputJson là JSON hook in ra, ví dụ
     * {"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "deny"}}.
     * permissionDecision "allow" → ALLOW, "deny" → DENY, "ask" → ASK, "defer" → normalDecision (rơi về permission rule thường).
     * Object rỗng {} (không có permissionDecision) → lời gọi giữ nguyên, cư xử như ALLOW.
     * Giá trị lạ khác: IllegalArgumentException.
     */
    Decision applyHookDecision(String hookOutputJson, Decision normalDecision);

    /**
     * Bài 4 (đặt thay đổi vào đâu): "permission rule", "hook", "environment variable", "default model", "effort level"
     * → "settings.json"; "coding convention", "architecture notes", "review checklist" → "CLAUDE.md".
     * Khác: IllegalArgumentException.
     */
    String belongsIn(String change);

    /**
     * Bài 5 (nạp lại): key settings.json nào có hiệu lực ngay (live)? "permissions", "hooks", "env" → true;
     * "model", "outputStyle" → false (cần khởi động lại hoặc slash command). Khác: IllegalArgumentException.
     */
    boolean takesEffectLive(String key);
}
