package part2.lesson11;

import java.util.List;

/**
 * Phần 2 · Bài 11: Prompt Caching, Breakpoints and TTLs.
 * {@link Lesson11} là chỗ bạn làm bài, {@link Lesson11Solution} là lời giải mẫu.
 */
public interface Lesson11Api {

    /** Một đoạn của prompt đã render. volatileContent: thay đổi mỗi lần gọi. breakpoint: có cache_control ở cuối đoạn này. */
    record Segment(String text, boolean volatileContent, boolean breakpoint) {}

    /**
     * Bài 1 (thứ tự render): prefix được render theo thứ tự cố định tools, rồi system, rồi messages.
     * Trả về danh sách nối theo đúng thứ tự đó.
     */
    List<String> render(List<String> tools, List<String> system, List<String> messages);

    /**
     * Bài 2 (khớp prefix chính xác từng byte): số đoạn đầu tiên giống hệt nhau giữa hai lần render.
     * Đổi một đoạn là mọi thứ từ đoạn đó trở đi không còn khớp cache (không có khớp gần đúng).
     */
    int cachedPrefixLength(List<String> previous, List<String> current);

    /**
     * Bài 3 (đặt breakpoint): trả về danh sách lỗi theo thứ tự:
     *   "too many breakpoints: n" nếu có hơn 4 breakpoint;
     *   với mỗi đoạn volatile nằm ở vị trí i TRƯỚC HOẶC TẠI breakpoint cuối cùng: "volatile segment i is inside the cached prefix".
     */
    List<String> checkBreakpoints(List<Segment> segments);

    /**
     * Bài 4 (giá, theo bội số giá input cơ bản): chi phí input của prefix qua `calls` lần gọi có cache.
     * Lần đầu ghi cache: 1.25 với ttl "5m", 2.0 với ttl "1h". Các lần sau đọc cache: 0.1. Giả định cache còn sống suốt.
     * ttl khác thì IllegalArgumentException.
     */
    double cachedCost(long prefixTokens, int calls, String ttl);

    /**
     * Bài 5 (có đáng cache không): prefix phải đạt mức tối thiểu của model (claude-opus-4-8: 1024, claude-opus-4-7: 2048,
     * model khác: IllegalArgumentException), và chi phí có cache phải THẤP HƠN không cache (prefixTokens × calls).
     */
    boolean worthCaching(String model, long prefixTokens, int calls, String ttl);
}
