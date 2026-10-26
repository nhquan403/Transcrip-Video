package part2.lesson01;

import java.util.List;
import java.util.Set;

/**
 * Phần 2 · Bài 01: From Business Need to Testable Spec.
 * {@link Lesson01} là chỗ bạn làm bài, {@link Lesson01Solution} là lời giải mẫu.
 */
public interface Lesson01Api {

    /** Ba mức Claude có thể đáp ứng một capability, từ đơn giản tới mạnh (và đắt) nhất. */
    enum Tier { SINGLE_CALL, WORKFLOW, AGENT }

    /** Bốn câu hỏi trung thực trước khi chọn agent. true nghĩa là câu đó đạt. */
    record AgentChecks(boolean complexity, boolean value, boolean viability, boolean errorRecoverable) {}

    /** Một functional requirement; needId là business need nó phục vụ (null nếu không ghi). */
    record Requirement(String id, String behavior, String needId) {}

    /**
     * Bài 1: trả về tên các check không đạt, đúng thứ tự "complexity", "value", "viability", "cost of error".
     * errorRecoverable = false nghĩa là một bước sai có thể gây thảm họa, tức check "cost of error" không đạt.
     */
    List<String> weakChecks(AgentChecks checks);

    /**
     * Bài 2: chọn tier đơn giản nhất đáp ứng được capability.
     * Không nhiều bước thì một lần gọi là đủ. Nhiều bước mà đường đi biết trước lúc thiết kế thì dùng workflow.
     * Chỉ khi đường đi phải quyết định lúc chạy VÀ cả bốn check đều đạt mới dùng agent;
     * có check yếu thì quay về tier đơn giản hơn (workflow).
     */
    Tier chooseTier(boolean multiStep, boolean pathKnownAtDesignTime, AgentChecks checks);

    /**
     * Bài 3 (truy vết): trả về id các requirement không truy về được business need nào,
     * tức needId null, rỗng, hoặc không nằm trong needIds. Giữ nguyên thứ tự đầu vào.
     */
    List<String> untraced(List<Requirement> requirements, Set<String> needIds);

    /**
     * Bài 4: requirement này có phải ràng buộc hạ tầng đội lốt hành vi không?
     * Trả về true khi câu (tiếng Anh) nói về tốc độ/độ trễ, thông lượng/sức chứa, chi phí, hoặc vùng/nơi lưu dữ liệu,
     * ví dụ "make Claude answer faster", "500 requests per minute", "keep the bill under $2,000", "data must stay in the EU".
     * Không phân biệt hoa thường.
     */
    boolean isInfrastructureInDisguise(String requirement);
}
