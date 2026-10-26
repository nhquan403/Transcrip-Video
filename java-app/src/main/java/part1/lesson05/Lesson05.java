package part1.lesson05;

import java.util.List;
import java.util.Set;

/**
 * Bài tập bài 05. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p1-05" (thêm --live để chạy với Claude thật)
 */
public class Lesson05 implements Lesson05Api {

    /** Gợi ý: không đọc gì từ tham số manager cả. Đó chính là điểm của bài. */
    @Override
    public List<String> subagentContext(ManagerState manager, SubagentDef subagent, String claudeMd, DelegatedTask task) {
        throw new UnsupportedOperationException("TODO bài 1: dựng các dòng ngữ cảnh của subagent");
    }

    @Override
    public List<String> missingParts(DelegatedTask task) {
        throw new UnsupportedOperationException("TODO bài 2: kiểm tra bốn phần của việc giao");
    }

    @Override
    public List<String> assumedFacts(DelegatedTask task, Set<String> neededFacts) {
        throw new UnsupportedOperationException("TODO bài 3: dữ kiện cần mà chưa truyền");
    }

    @Override
    public long managerContextTokens(List<SubagentRun> runs, boolean isolated) {
        throw new UnsupportedOperationException("TODO bài 4: cộng summary hoặc transcript");
    }

    @Override
    public List<String> excessTools(Set<String> granted, Set<String> needed) {
        throw new UnsupportedOperationException("TODO bài 5: tool được cấp mà không cần");
    }
}
