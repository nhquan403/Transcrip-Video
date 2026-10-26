package part2.lesson03;

import java.util.List;
import java.util.Map;

/**
 * Bài tập Phần 2 · Bài 03. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-03" (thêm --live để chạy với Claude thật)
 */
public class Lesson03 implements Lesson03Api {

    /** Ví dụ: chịu được 2.000ms, overhead [150, 100, 250] thì còn 1.500ms cho Claude. */
    @Override
    public long modelBudgetMs(long userToleranceMs, List<Long> overheadsMs) {
        throw new UnsupportedOperationException("TODO bài 1: trừ overhead khỏi thời gian chịu được");
    }

    @Override
    public int maxSequentialCalls(long budgetMs, long msPerCall) {
        throw new UnsupportedOperationException("TODO bài 2: số lời gọi tuần tự vừa ngân sách");
    }

    @Override
    public DeliveryMode chooseMode(boolean someoneWaiting, long budgetMs, long fullResponseMs) {
        throw new UnsupportedOperationException("TODO bài 3: chọn SYNC, STREAMING hay BATCH");
    }

    /** Ví dụ: 120 request/phút, mỗi request 3 giây thì tối đa 6 request bay cùng lúc. */
    @Override
    public int maxConcurrency(int requestsPerMinute, double avgCallSeconds) {
        throw new UnsupportedOperationException("TODO bài 4: định cỡ concurrency theo rate limit");
    }

    @Override
    public int minutesToDrain(int incoming, int capacityPerMinute) {
        throw new UnsupportedOperationException("TODO bài 5: xếp hàng phần vượt sức chứa");
    }

    @Override
    public Deployment chooseDeployment(boolean residencyIsHard, List<String> allowedRegions, List<String> firstPartyRegions) {
        throw new UnsupportedOperationException("TODO bài 6: residency có buộc phải ghim vùng không?");
    }

    /** Ví dụ: prefix 10.000 token, 5 lần gọi: không cache 50.000; có cache 12.500 + 4 × 1.000 = 16.500. */
    @Override
    public double[] prefixCost(long prefixTokens, int calls) {
        throw new UnsupportedOperationException("TODO bài 7: so chi phí có và không có prompt caching");
    }

    @Override
    public Map<String, String> matchBatch(List<String> sentIds, List<BatchResult> results) {
        throw new UnsupportedOperationException("TODO bài 8: ghép kết quả theo customId, không theo vị trí");
    }
}
