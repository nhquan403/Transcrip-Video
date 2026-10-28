package part2.lesson35;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Phần 2 · Bài 35: Resolving Plugin Dependencies.
 * {@link Lesson35} là chỗ bạn làm bài, {@link Lesson35Solution} là lời giải mẫu.
 *
 * Phiên bản có dạng "X.Y.Z"; thành phần thiếu coi là 0 (ví dụ "2.0" = "2.0.0").
 */
public interface Lesson35Api {

    /**
     * Bài 1 (version range): version có thỏa range không?
     * "~X.Y.Z": cùng X và Y, Z ≥ (chỉ nhận bản vá). "^X.Y.Z": cùng X, và ≥ X.Y.Z (nhận minor + patch).
     * ">=X.Y.Z": mọi bản ≥ mức sàn. Không có tiền tố: phải đúng bằng phiên bản đó.
     * Ví dụ: satisfies("~2.1.0", "2.1.7") = true, satisfies("~2.1.0", "2.2.0") = false, satisfies("^2.0", "2.9.1") = true.
     */
    boolean satisfies(String range, String version);

    /**
     * Bài 2 (constraint intersection, "highest compatible wins"): nhiều plugin cùng phụ thuộc một plugin với các range khác nhau.
     * Trả về phiên bản CAO NHẤT trong tags thỏa TẤT CẢ ranges cùng lúc.
     * Không có bản nào thỏa tất cả: ném IllegalStateException với message "range-conflict" (cài đặt thất bại, không áp một nửa).
     */
    String resolve(List<String> ranges, List<String> tags);

    /**
     * Bài 3 (enable lan truyền, transitive): bật plugin thì bật luôn mọi phụ thuộc của nó, xuống hết chuỗi.
     * deps: plugin → danh sách phụ thuộc trực tiếp (plugin không có key nghĩa là không phụ thuộc gì).
     * Trả về tập gồm plugin đó và mọi phụ thuộc trực tiếp lẫn gián tiếp (bất kể manifest của chúng có default off).
     */
    Set<String> enableCascade(String plugin, Map<String, List<String>> deps);

    /**
     * Bài 4 (disable có bảo vệ): muốn tắt target. Trả về chuỗi lệnh tắt mà thông báo lỗi gợi ý:
     * trước hết các plugin ĐANG BẬT (trong enabled) phụ thuộc TRỰC TIẾP vào target, xếp theo bảng chữ cái, cuối cùng là target.
     * Không có ai đang bật phụ thuộc vào target thì chỉ trả về List.of(target) (tắt êm).
     */
    List<String> disableOrder(String target, Set<String> enabled, Map<String, List<String>> deps);

    /**
     * Bài 5 (plugin prune): installed = mọi plugin đã cài, direct = plugin bạn cài trực tiếp.
     * Plugin được giữ nếu nó là direct, hoặc đi tới được (trực tiếp/gián tiếp qua deps) từ một plugin direct.
     * Trả về tập orphan cần xóa: các plugin auto-installed không còn ai trỏ tới. Không bao giờ xóa plugin direct.
     */
    Set<String> prune(Set<String> installed, Set<String> direct, Map<String, List<String>> deps);

    /** Dùng chung: "2.1" → [2, 1, 0]. */
    static int[] parse(String version) {
        String[] p = version.trim().split("\\.");
        int[] v = new int[3];
        for (int i = 0; i < 3 && i < p.length; i++) v[i] = Integer.parseInt(p[i]);
        return v;
    }

    /** Dùng chung: so sánh hai phiên bản như Comparator (âm nếu a < b). */
    static int compare(String a, String b) {
        int[] x = parse(a), y = parse(b);
        for (int i = 0; i < 3; i++) if (x[i] != y[i]) return Integer.compare(x[i], y[i]);
        return 0;
    }
}
