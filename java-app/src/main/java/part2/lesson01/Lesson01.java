package part2.lesson01;

import java.util.List;
import java.util.Set;

/**
 * Bài tập Phần 2 · Bài 01. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-01" (thêm --live để chạy với Claude thật)
 */
public class Lesson01 implements Lesson01Api {

    /** Ví dụ: chỉ value và viability không đạt thì trả về ["value", "viability"]. */
    @Override
    public List<String> weakChecks(AgentChecks checks) {
        throw new UnsupportedOperationException("TODO bài 1: liệt kê các check không đạt");
    }

    /** Gợi ý: đi từ dưới lên, single call trước, workflow sau, agent cuối cùng. Có thể dùng lại weakChecks. */
    @Override
    public Tier chooseTier(boolean multiStep, boolean pathKnownAtDesignTime, AgentChecks checks) {
        throw new UnsupportedOperationException("TODO bài 2: chọn tier đơn giản nhất");
    }

    @Override
    public List<String> untraced(List<Requirement> requirements, Set<String> needIds) {
        throw new UnsupportedOperationException("TODO bài 3: tìm requirement không gắn với business need");
    }

    /** Gợi ý: một danh sách từ khóa (fast, latency, seconds, requests per minute, cost, budget, region, ...) và regex có \\b. */
    @Override
    public boolean isInfrastructureInDisguise(String requirement) {
        throw new UnsupportedOperationException("TODO bài 4: nhận ra ràng buộc hạ tầng đội lốt hành vi");
    }
}
