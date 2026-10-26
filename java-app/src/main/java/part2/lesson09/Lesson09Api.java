package part2.lesson09;

import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 09: Streaming SSE and Vision Input.
 * {@link Lesson09} là chỗ bạn làm bài, {@link Lesson09Solution} là lời giải mẫu.
 */
public interface Lesson09Api {

    /** Kết quả ghép từ stream: các block hoàn chỉnh, stop_reason và số token ra (đều chỉ có ở message_delta gần cuối). */
    record Assembled(List<Map<String, Object>> blocks, String stopReason, long outputTokens) {}

    /** Bài 1: đọc SSE thô, trả về tên sự kiện theo thứ tự (các dòng "event: ..."). */
    List<String> eventNames(String sse);

    /**
     * Bài 2: thứ tự sự kiện có hợp lệ không? Bỏ qua "ping" và "error" (có thể xuất hiện ở bất kỳ đâu).
     * Phần còn lại phải là: message_start, rồi 0 hoặc nhiều nhóm [content_block_start, content_block_delta*, content_block_stop],
     * rồi message_delta, rồi message_stop.
     */
    boolean validOrder(List<String> events);

    /**
     * Bài 3: ghép stream thành message. events là phần "data" của từng sự kiện (đã parse JSON thành Map).
     * content_block_start mở block ở vị trí "index" (lấy "content_block"). text_delta: nối "text" vào text của block.
     * input_json_delta: nối "partial_json" vào một chuỗi riêng của block, và CHỈ parse chuỗi đó thành Map ở content_block_stop
     * (lưu vào "input"). Đừng parse giữa chừng: các mảnh lẻ không phải JSON hợp lệ.
     * message_delta: lấy delta.stop_reason và usage.output_tokens. Các sự kiện khác bỏ qua.
     */
    Assembled assemble(List<Map<String, Object>> events);

    /**
     * Bài 4 (chi phí ảnh): ảnh lớn hơn 8000 px ở bất kỳ cạnh nào thì bị từ chối (IllegalArgumentException).
     * Cạnh dài hơn maxLongEdge thì ảnh được thu nhỏ giữ tỉ lệ (mỗi cạnh nhân với maxLongEdge / cạnh dài, làm tròn xuống).
     * Sau đó mỗi ô 28×28 px là một visual token: ceil(rộng / 28) × ceil(cao / 28).
     */
    long imageTokens(int width, int height, int maxLongEdge);

    /**
     * Bài 5: dựng block ảnh theo ba cách cấp ảnh.
     * "base64": {"type": "image", "source": {"type": "base64", "media_type": mediaType, "data": value}}
     * "url": {"type": "image", "source": {"type": "url", "url": value}}
     * "file": {"type": "image", "source": {"type": "file", "file_id": value}}
     * Kiểu khác ném IllegalArgumentException; với base64, mediaType phải là image/jpeg, image/png, image/gif hoặc image/webp.
     */
    Map<String, Object> imageBlock(String kind, String value, String mediaType);
}
