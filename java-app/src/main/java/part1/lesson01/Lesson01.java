package part1.lesson01;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.UnaryOperator;

/**
 * Bài tập bài 01. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p1-01" (thêm --live để chạy với Claude thật)
 */
public class Lesson01 implements Lesson01Api {

    /**
     * Trả về AGENT khi có từ hai tín hiệu trở lên đang bật, ngược lại trả về WORKFLOW.
     * ("When two or three light up together, that's your cue to build an agent.")
     */
    @Override
    public Design chooseDesign(TaskProfile task) {
        throw new UnsupportedOperationException("TODO bài 1: đếm số tín hiệu đang bật");
    }

    /**
     * Áp dụng lần lượt từng step lên kết quả của step trước. Sau mỗi step, nếu gate trả về false
     * thì ném IllegalStateException với message chứa "step N" (N đếm từ 1) để bắt lỗi sớm.
     */
    @Override
    public String promptChain(String input, List<UnaryOperator<String>> steps, Predicate<String> gate) {
        throw new UnsupportedOperationException("TODO bài 2: vòng for qua steps, kiểm tra gate");
    }

    /**
     * Gọi classifier để lấy nhãn, rồi gửi request cho handler có nhãn đó.
     * Nếu không có handler cho nhãn, dùng fallback.
     */
    @Override
    public String route(String request, Function<String, String> classifier,
                        Map<String, UnaryOperator<String>> handlers, UnaryOperator<String> fallback) {
        throw new UnsupportedOperationException("TODO bài 3: classifier rồi handlers.getOrDefault");
    }

    /**
     * Chạy worker trên tất cả sections cùng lúc (gợi ý: Executors.newVirtualThreadPerTaskExecutor()),
     * kết quả phải giữ đúng thứ tự của sections.
     */
    @Override
    public List<String> parallelize(List<String> sections, UnaryOperator<String> worker) {
        throw new UnsupportedOperationException("TODO bài 4: submit từng section, get() theo thứ tự");
    }

    /**
     * Vòng lặp agent: hỏi model hành động tiếp theo.
     * Finish thì trả về answer. CallTool thì chạy tool, lưu Step(call, observation) vào lịch sử và lặp tiếp.
     * Tool không tồn tại: observation là "error: unknown tool <tên>" (để model tự sửa).
     * Quá maxSteps lần gọi tool mà chưa Finish: ném IllegalStateException (giới hạn vòng lặp để tránh lỗi dồn).
     */
    @Override
    public String runAgent(String goal, Model model, Map<String, UnaryOperator<String>> tools, int maxSteps) {
        throw new UnsupportedOperationException("TODO bài 5: vòng lặp model.next(...)");
    }
}
