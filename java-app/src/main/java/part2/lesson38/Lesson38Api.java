package part2.lesson38;

import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 38: Subagents and Agent Memory in Practice.
 * {@link Lesson38} là chỗ bạn làm bài, {@link Lesson38Solution} là lời giải mẫu.
 */
public interface Lesson38Api {

    /**
     * Bài 1a (main agent giữ cả hội thoại): trả về messages mới = toàn bộ history (giữ nguyên thứ tự) + một lượt user chứa task.
     * Không sửa list history truyền vào.
     */
    List<Map<String, Object>> mainAgentMessages(List<Map<String, Object>> history, String task);

    /**
     * Bài 1b (subagent bắt đầu sạch): trả về body request cho subagent: "system" = agentSystemPrompt,
     * "messages" = đúng MỘT lượt user chứa task. History của main agent bị bỏ qua hoàn toàn.
     */
    Map<String, Object> subagentRequest(List<Map<String, Object>> mainHistory, String agentSystemPrompt, String task);

    /** tools null nghĩa là không khai báo (sẽ kế thừa toàn bộ tool của main agent). */
    record AgentDef(String name, String description, List<String> tools, String model, boolean memory, String systemPrompt) {}

    /**
     * Bài 2 (đọc file định nghĩa subagent): file có dạng
     * <pre>
     * ---
     * name: code-reviewer
     * description: Use after code changes to review diffs
     * tools: Read, Grep
     * model: sonnet
     * memory: project
     * ---
     * You are a strict reviewer...
     * </pre>
     * Dòng đầu phải là "---"; front matter kết thúc ở dòng "---" kế tiếp; mỗi dòng "key: value" (cắt ở dấu ":" đầu tiên, trim).
     * tools tách theo dấu phẩy và trim (không có → null). model không có → null. memory = true nếu có key memory với giá trị không rỗng.
     * systemPrompt = phần thân sau front matter, trim. Thiếu name hoặc description (hoặc rỗng), hoặc không có front matter
     * → IllegalArgumentException.
     */
    AgentDef parseAgent(String markdown);

    /** Bài 2b: tool thực tế của subagent: def.tools() nếu khác null, nếu không thì kế thừa mainTools. */
    List<String> effectiveTools(AgentDef def, List<String> mainTools);

    enum Control { SUGGEST, ONE_TASK, WHOLE_SESSION }

    /**
     * Bài 3 (ba cách dùng subagent): input là thứ người dùng gõ.
     * Bắt đầu bằng "claude " và có token "--agent" → WHOLE_SESSION (cả phiên chạy như subagent đó);
     * ngược lại, có một token (tách theo khoảng trắng) bắt đầu bằng "@" và dài hơn 1 ký tự → ONE_TASK (chắc chắn chạy cho task kế);
     * còn lại (ngôn ngữ tự nhiên) → SUGGEST (Claude tự quyết dựa vào description).
     */
    Control controlOf(String input);

    enum Author { DEVELOPER, AGENT }

    /**
     * Bài 4 (agent memory không phải CLAUDE.md): mechanism là "CLAUDE.md", "auto-memory" hoặc "subagent memory".
     * authorOf: CLAUDE.md → DEVELOPER; hai loại memory → AGENT. Khác: IllegalArgumentException.
     */
    Author authorOf(String mechanism);

    /**
     * Bài 4b: bật bằng cách nào? "CLAUDE.md" → "you write the file"; "auto-memory" → "on by default";
     * "subagent memory" → "front matter field". Khác: IllegalArgumentException.
     */
    String enabledBy(String mechanism);

    /**
     * Bài 5 (rule, skill hay subagent?): xét theo thứ tự:
     * mustBlock (cần chặn cứng) → "permissions or hooks"; needsIsolation → "subagent"; everyTurn → "rule"; còn lại → "skill".
     */
    String chooseMechanism(boolean everyTurn, boolean needsIsolation, boolean mustBlock);

    /** Dùng chung cho bài 1. */
    static Map<String, Object> userTurn(String text) {
        return Map.of("role", "user", "content", text);
    }
}
