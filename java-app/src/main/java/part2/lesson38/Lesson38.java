package part2.lesson38;

import java.util.List;
import java.util.Map;

/**
 * Bài tập Phần 2 · Bài 38. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-38" (thêm --live để chạy với Claude thật)
 */
public class Lesson38 implements Lesson38Api {

    /** Gợi ý: dùng Lesson38Api.userTurn(...) để tạo lượt user. */
    @Override
    public List<Map<String, Object>> mainAgentMessages(List<Map<String, Object>> history, String task) {
        throw new UnsupportedOperationException("TODO bài 1a: main agent thấy cả history, cộng thêm task");
    }

    @Override
    public Map<String, Object> subagentRequest(List<Map<String, Object>> mainHistory, String agentSystemPrompt, String task) {
        throw new UnsupportedOperationException("TODO bài 1b: subagent chỉ nhận system riêng và đúng một lượt task");
    }

    @Override
    public AgentDef parseAgent(String markdown) {
        throw new UnsupportedOperationException("TODO bài 2: tách front matter, name và description bắt buộc");
    }

    @Override
    public List<String> effectiveTools(AgentDef def, List<String> mainTools) {
        throw new UnsupportedOperationException("TODO bài 2b: bỏ trống tools thì kế thừa của main agent");
    }

    @Override
    public Control controlOf(String input) {
        throw new UnsupportedOperationException("TODO bài 3: --agent, @-mention hay ngôn ngữ tự nhiên?");
    }

    @Override
    public Author authorOf(String mechanism) {
        throw new UnsupportedOperationException("TODO bài 4: ai là người viết?");
    }

    @Override
    public String enabledBy(String mechanism) {
        throw new UnsupportedOperationException("TODO bài 4b: mặc định bật, field front matter hay tự viết file?");
    }

    @Override
    public String chooseMechanism(boolean everyTurn, boolean needsIsolation, boolean mustBlock) {
        throw new UnsupportedOperationException("TODO bài 5: policy, procedure hay isolation?");
    }
}
