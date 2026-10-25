package lesson01;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.UnaryOperator;

/**
 * Bài 01: When to Build an Agent vs a Workflow.
 * {@link Lesson01} là chỗ bạn làm bài, {@link Lesson01Solution} là lời giải mẫu.
 */
public interface Lesson01Api {

    enum Design { WORKFLOW, AGENT }

    /** Ba tín hiệu của bài học: không gian mở, không biết trước số bước, model tự chọn tool. */
    record TaskProfile(boolean openEnded, boolean unknownSteps, boolean modelChoosesTools) {}

    /** Hành động model chọn ở mỗi vòng lặp của agent. */
    sealed interface Action permits CallTool, Finish {}

    record CallTool(String tool, String input) implements Action {}

    record Finish(String answer) implements Action {}

    /** Một vòng đã chạy: model gọi tool nào và nhận lại kết quả gì. */
    record Step(CallTool call, String observation) {}

    /** "Model" của agent: nhìn mục tiêu và lịch sử, rồi tự quyết định bước tiếp theo. */
    interface Model {
        Action next(String goal, List<Step> history);
    }

    /** Bài 1: chọn WORKFLOW hay AGENT dựa trên số tín hiệu đang bật. */
    Design chooseDesign(TaskProfile task);

    /** Bài 2 (prompt chaining): chạy các bước theo thứ tự, kiểm tra gate sau mỗi bước. */
    String promptChain(String input, List<UnaryOperator<String>> steps, Predicate<String> gate);

    /** Bài 3 (routing): phân loại request rồi gửi tới đúng handler. */
    String route(String request, Function<String, String> classifier,
                 Map<String, UnaryOperator<String>> handlers, UnaryOperator<String> fallback);

    /** Bài 4 (parallelization): xử lý các phần độc lập cùng lúc, giữ nguyên thứ tự kết quả. */
    List<String> parallelize(List<String> sections, UnaryOperator<String> worker);

    /** Bài 5 (agent loop): model tự chọn tool cho tới khi Finish, tối đa maxSteps lần gọi tool. */
    String runAgent(String goal, Model model, Map<String, UnaryOperator<String>> tools, int maxSteps);
}
