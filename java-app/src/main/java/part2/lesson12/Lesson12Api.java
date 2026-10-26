package part2.lesson12;

import java.time.Instant;
import java.util.List;

/**
 * Phần 2 · Bài 12: Realtime vs. Batch, When to Go Async.
 * {@link Lesson12} là chỗ bạn làm bài, {@link Lesson12Solution} là lời giải mẫu.
 */
public interface Lesson12Api {

    enum Surface { SYNC_MESSAGES, MESSAGE_BATCHES }

    enum BatchState { PROCESSING, RESULTS_AVAILABLE, RESULTS_GONE }

    /** Mô tả một công việc cần gọi Claude. */
    record Job(String name, boolean someoneWaiting, boolean needsStreaming, boolean requiresZeroDataRetention, int requests) {}

    /**
     * Bài 1 (chọn bề mặt): ở lại Messages API đồng bộ khi có người (hoặc hệ thống) đang chờ, khi cần streaming,
     * hoặc khi tổ chức yêu cầu zero data retention (batch không đủ điều kiện). Còn lại dùng Message Batches.
     */
    Surface choose(Job job);

    /** Bài 2 (giá): batch tính 50% giá chuẩn cho cả input và output. Trả về chi phí nếu chạy bằng batch. */
    double batchCost(long inputTokens, long outputTokens, double inputPricePerMTok, double outputPricePerMTok);

    /**
     * Bài 3 (giới hạn kích thước): chia các request (kích thước byte cho sẵn) thành các batch, giữ thứ tự,
     * mỗi batch tối đa maxRequests request và tối đa maxBytes byte (giới hạn thật: 100.000 request, 256 MB).
     * Trả về số request của từng batch. Một request lớn hơn maxBytes thì ném IllegalArgumentException.
     */
    List<Integer> splitIntoBatches(List<Long> requestBytes, int maxRequests, long maxBytes);

    /**
     * Bài 4 (hai cửa sổ thời gian): batch xử lý trong tối đa 24 giờ; kết quả tải được trong 29 ngày kể từ lúc tạo batch.
     * Chưa xong mọi request và chưa quá 24 giờ: PROCESSING. Sau 29 ngày (tính từ createdAt): RESULTS_GONE.
     * Còn lại (đã xong, hoặc đã quá 24 giờ thì phần chưa xong hết hạn và không bị tính tiền): RESULTS_AVAILABLE.
     */
    BatchState state(Instant createdAt, Instant now, boolean allRequestsDone);
}
