package lesson09;

import java.util.List;
import java.util.Map;
import java.util.function.UnaryOperator;

/**
 * Bài tập bài 09. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="09" (thêm --live để chạy với Claude thật)
 */
public class Lesson09 implements Lesson09Api {

    /** Gợi ý: duyệt response.content(), chỉ lấy các khối là ToolUse (dùng instanceof). */
    @Override
    public List<ToolUse> clientToolUses(Response response) {
        throw new UnsupportedOperationException("TODO bài 1: lọc client tool_use");
    }

    @Override
    public List<ToolResult> runTools(List<ToolUse> uses, Map<String, UnaryOperator<String>> tools) {
        throw new UnsupportedOperationException("TODO bài 2: chạy tool, tool_result khớp id");
    }

    @Override
    public boolean handshakeOk(AssistantBlocks assistant, UserToolResults results) {
        throw new UnsupportedOperationException("TODO bài 3: so khớp id tool_use và tool_result");
    }

    @Override
    public String runLoop(String prompt, Api api, Map<String, UnaryOperator<String>> tools, int maxIterations) {
        throw new UnsupportedOperationException("TODO bài 4: vòng lặp gọi API, rẽ nhánh theo stopReason");
    }
}
