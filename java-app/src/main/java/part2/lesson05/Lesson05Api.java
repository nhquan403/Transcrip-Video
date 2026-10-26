package part2.lesson05;

import java.net.http.HttpRequest;
import java.util.Map;

/**
 * Phần 2 · Bài 05: Develop and Implement, Build to Ship.
 * {@link Lesson05} là chỗ bạn làm bài, {@link Lesson05Solution} là lời giải mẫu.
 */
public interface Lesson05Api {

    String MESSAGES_URL = "https://api.anthropic.com/v1/messages";
    String API_VERSION = "2023-06-01";

    enum ErrorAction { RETRY, SURFACE }

    /**
     * Bài 1 (ba thứ trên mọi lời gọi): dựng một HTTP POST tới baseUrl + "/v1/messages" với body JSON,
     * kèm header x-api-key, anthropic-version (API_VERSION) và content-type: application/json.
     */
    HttpRequest buildRequest(String baseUrl, String apiKey, String jsonBody);

    /**
     * Bài 2 (bí mật): đọc API key từ môi trường lúc chạy (biến ANTHROPIC_API_KEY trong map env).
     * Thiếu hoặc rỗng thì ném IllegalStateException với thông báo dễ hiểu. Không bao giờ có key mặc định trong code.
     */
    String loadApiKey(Map<String, String> env);

    /**
     * Bài 3 (lỗi ở rìa tích hợp): 429 và 5xx là RETRY nếu attempt (đếm từ 1) còn nhỏ hơn maxAttempts, hết lượt thì SURFACE.
     * 401 (sai hoặc thiếu key) và mọi lỗi 4xx khác là SURFACE ngay ở lần đầu: retry không sửa được.
     */
    ErrorAction onError(int status, int attempt, int maxAttempts);

    /**
     * Bài 4 (Git): file cấu hình nào được commit? CLAUDE.md và .claude/settings.json là cấu hình chung: commit.
     * .claude/settings.local.json là cấu hình cá nhân, và .env chứa bí mật: không commit (nằm trong .gitignore).
     * Đường dẫn có thể nằm trong thư mục con, ví dụ "app/.claude/settings.local.json". Các file khác: commit.
     */
    boolean shouldCommit(String path);

    /**
     * Bài 5 (ghim model): model ID này có cố định (pinned) không?
     * Có "latest" là alias trôi nổi: không. Kết thúc bằng ngày 8 chữ số (ví dụ -20250929) là snapshot: có.
     * Không có ngày: từ phiên bản 4.6 trở lên ID không ngày đã là snapshot cố định (claude-opus-4-6, claude-sonnet-5-5); dưới 4.6 là alias.
     * Phiên bản đọc từ các số trong ID: "claude-sonnet-4-5" là 4.5, "claude-opus-4" là 4.0, "claude-3-7-sonnet" là 3.7.
     */
    boolean isPinnedModel(String modelId);
}
