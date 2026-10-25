package lesson07;

import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.UnaryOperator;
import lesson06.Lesson06Api.Model;
import lesson06.Lesson06Api.SdkMessage;
import lesson06.Lesson06Api.Usage;

/**
 * Bài 07: How the Agent Loop Runs Under query.
 * Dùng lại các kiểu message của bài 06, thêm giới hạn ngân sách, subtype lỗi và cách đọc kết quả an toàn.
 * {@link Lesson07} là chỗ bạn làm bài, {@link Lesson07Solution} là lời giải mẫu.
 */
public interface Lesson07Api {

    /** Giá USD cho mỗi 1 triệu token vào và ra. */
    record Pricing(double inputUsdPerMTok, double outputUsdPerMTok) {}

    /** Giới hạn của một lần chạy. null nghĩa là không giới hạn (mặc định của SDK!). */
    record Limits(Integer maxTurns, Double maxBudgetUsd) {}

    /** Kết quả cuối: subtype "success", "error_max_turns" hoặc "error_max_budget_usd". */
    record RunResult(String subtype, String result, Usage usage, double totalCostUsd, int numTurns, String sessionId) {}

    /** Bài 1: chi phí USD của một lượng token. */
    double costUsd(Usage usage, Pricing pricing);

    /** Bài 2: đếm số lượt (turn) trong luồng message: mỗi UserMessage mang kết quả tool là một lượt đã xong. */
    int countTurns(List<SdkMessage> messages);

    /**
     * Bài 3: vòng lặp có hai giới hạn. Đẩy SystemInit, AssistantMessage, UserMessage ra `out` như bài 06
     * (mọi tool trong `tools` đều được phép), và trả về RunResult thay vì đẩy ResultMessage.
     * - Ngân sách được kiểm tra GIỮA các lần gọi: trước mỗi lần gọi model (trừ lần đầu), nếu chi phí đã
     *   >= maxBudgetUsd thì dừng với "error_max_budget_usd". Vì vậy chi phí thật có thể vượt trần tối đa một lần gọi.
     * - Model còn muốn gọi tool mà số lượt đã bằng maxTurns thì dừng với "error_max_turns".
     * - Model trả lời không kèm tool: "success" kèm text. Lỗi thì result là null nhưng vẫn có usage và chi phí.
     */
    RunResult run(String prompt, String systemPrompt, Model model, Map<String, UnaryOperator<String>> tools,
                  Limits limits, Pricing pricing, Consumer<SdkMessage> out);

    /** Bài 4: chỉ đọc text khi success. Lỗi thì ném IllegalStateException nêu subtype và số tiền đã tiêu (dạng "$0.0016"). */
    String readResult(RunResult result);

    /**
     * Bài 5: một dòng chẩn đoán dựa trên subtype, numTurns và sessionId, ví dụ:
     *   "done after 2 turns, cost $0.0012, session abc"
     *   "hit max turns after 3 turns, cost $0.0040, session abc"
     *   "hit max budget after 1 turns, cost $0.0016, session abc"
     * Chi phí làm tròn 4 chữ số thập phân (gợi ý: String.format(Locale.ROOT, "%.4f", cost)).
     */
    String describeStop(RunResult result);
}
