package part2.lesson03;

import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 03: Latency, Throughput and Region Budgets.
 * {@link Lesson03} là chỗ bạn làm bài, {@link Lesson03Solution} là lời giải mẫu.
 */
public interface Lesson03Api {

    enum DeliveryMode { SYNC, STREAMING, BATCH }

    enum Deployment { FIRST_PARTY_API, CLOUD_PLATFORM_REGION }

    /** Một kết quả batch: id do bạn đặt lúc gửi, và nội dung trả về. */
    record BatchResult(String customId, String output) {}

    /**
     * Bài 1 (ngân sách độ trễ): lấy thời gian người dùng chịu được trừ đi mọi overhead của bạn
     * (network, auth, xử lý trước và sau). Phần còn lại là ngân sách cho lời gọi Claude; âm thì trả về 0.
     */
    long modelBudgetMs(long userToleranceMs, List<Long> overheadsMs);

    /**
     * Bài 2: thiết kế có nằm trong ngân sách không? Các lời gọi chạy tuần tự, mỗi lời gọi mất msPerCall.
     * Trả về số lời gọi tuần tự tối đa vừa ngân sách (budgetMs / msPerCall, làm tròn xuống).
     */
    int maxSequentialCalls(long budgetMs, long msPerCall);

    /**
     * Bài 3 (chọn cách trả kết quả): không ai đang chờ thì BATCH (rẻ hơn).
     * Có người chờ: nếu cả câu trả lời về kịp trong ngân sách thì SYNC (đơn giản nhất), không kịp thì STREAMING
     * (chữ bắt đầu hiện gần như ngay, đáp ứng độ trễ cảm nhận).
     */
    DeliveryMode chooseMode(boolean someoneWaiting, long budgetMs, long fullResponseMs);

    /**
     * Bài 4 (backpressure): số request được phép bay cùng lúc để không vượt rate limit.
     * Mỗi request mất avgCallSeconds; giới hạn là requestsPerMinute. Đồng thời tối đa = requestsPerMinute * avgCallSeconds / 60,
     * làm tròn xuống, nhưng ít nhất là 1.
     */
    int maxConcurrency(int requestsPerMinute, double avgCallSeconds);

    /**
     * Bài 5 (backpressure): phút cao điểm có `incoming` request, sức chứa là `capacityPerMinute`.
     * Phần vượt không bắn vào model mà xếp hàng sang các phút sau. Trả về số phút cần để xử lý hết (0 nếu không có gì).
     */
    int minutesToDrain(int incoming, int capacityPerMinute);

    /**
     * Bài 6 (vùng dữ liệu): nếu residency là yêu cầu cứng và vùng của API first-party không nằm trong allowedRegions,
     * phải chạy Claude trong cloud platform, ghim vào vùng được phép. Còn lại dùng FIRST_PARTY_API (đơn giản nhất).
     */
    Deployment chooseDeployment(boolean residencyIsHard, List<String> allowedRegions, List<String> firstPartyRegions);

    /**
     * Bài 7 (prompt caching): chi phí input, tính theo bội số giá input cơ bản, cho `calls` lần gọi cùng một prefix dài prefixTokens.
     * Không cache: mỗi lần trả đủ giá. Có cache: lần đầu ghi cache giá 1.25, các lần sau đọc cache giá 0.1.
     * Trả về {chi phí không cache, chi phí có cache}, đơn vị "token quy đổi".
     */
    double[] prefixCost(long prefixTokens, int calls);

    /**
     * Bài 8 (message batches): kết quả batch về KHÔNG theo thứ tự gửi. Ghép lại theo customId.
     * Trả về map customId → output theo đúng thứ tự sentIds. Thiếu kết quả nào thì ném IllegalStateException.
     */
    Map<String, String> matchBatch(List<String> sentIds, List<BatchResult> results);
}
