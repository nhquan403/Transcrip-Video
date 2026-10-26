package part2.lesson15;

/**
 * Phần 2 · Bài 15: REST Fundamentals for the Claude API.
 * {@link Lesson15} là chỗ bạn làm bài, {@link Lesson15Solution} là lời giải mẫu.
 */
public interface Lesson15Api {

    enum Family { SUCCESS, REDIRECT, CLIENT_ERROR, SERVER_ERROR }

    enum Action { PARSE_BODY, FIX_API_KEY, CHECK_PERMISSIONS, FIX_REQUEST_BODY, BACK_OFF_AND_RETRY }

    /** Bài 1: method an toàn (không đổi gì trên server): GET, HEAD, OPTIONS. Các method khác thì không. */
    boolean isSafe(String method);

    /**
     * Bài 2: method idempotent (gọi một lần hay nhiều lần, trạng thái cuối như nhau): mọi method an toàn, cộng PUT và DELETE.
     * POST và PATCH thì không.
     */
    boolean isIdempotent(String method);

    /** Bài 3: chữ số đầu của status nói vấn đề nằm đâu: 2xx SUCCESS, 3xx REDIRECT, 4xx CLIENT_ERROR, 5xx SERVER_ERROR. */
    Family family(int status);

    /**
     * Bài 4: status nói phải làm gì. 2xx: PARSE_BODY. 401 (thiếu hoặc sai key): FIX_API_KEY. 403 (key đúng nhưng không được phép):
     * CHECK_PERMISSIONS. 429 và mọi 5xx: BACK_OFF_AND_RETRY. Các 4xx còn lại (ví dụ 400 body sai): FIX_REQUEST_BODY.
     */
    Action triage(int status);

    /**
     * Bài 5: một request bị timeout (không biết server đã xử lý hay chưa). Gửi lại y nguyên có an toàn không?
     * An toàn khi method idempotent. POST tới /v1/messages không idempotent: gửi lại có thể tạo thêm một câu trả lời riêng
     * (và tốn thêm token), nên trả về false.
     */
    boolean safeToResendAfterTimeout(String method);
}
