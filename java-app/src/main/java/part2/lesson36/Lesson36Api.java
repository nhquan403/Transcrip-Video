package part2.lesson36;

import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 36: Sharing Dependencies Across a Team.
 * {@link Lesson36} là chỗ bạn làm bài, {@link Lesson36Solution} là lời giải mẫu.
 */
public interface Lesson36Api {

    /**
     * Bài 1 (resolve qua git tag): tag phát hành theo mẫu "tên-plugin--vPHIÊN-BẢN" (ví dụ "deploy--v2.1.0").
     * tags là toàn bộ tag trong repo marketplace (của nhiều plugin, có cả tag rác).
     * Chỉ xét tag đúng mẫu "plugin--vX.Y.Z" của ĐÚNG plugin này; lấy phiên bản cao nhất thỏa range
     * (dùng {@link #satisfies} có sẵn). Trả về phiên bản (ví dụ "2.1.4"), hoặc null khi không tag nào khớp (lỗi no-matching-tag).
     */
    String resolveFromTags(String plugin, String range, List<String> tags);

    /**
     * Bài 2 (cái gì phải commit): true cho file khai báo môi trường dùng chung:
     * ".claude-plugin/plugin.json" (manifest có mảng dependencies), ".claude-plugin/marketplace.json",
     * ".claude/settings.json" (project settings ghi plugin đã bật).
     * false cho file riêng tư: ".claude/settings.local.json" và "~/.claude/settings.json". Khác: IllegalArgumentException.
     */
    boolean shouldCommit(String path);

    /**
     * Bài 3 (đọc mã lỗi): cho trạng thái một phụ thuộc, trả về mã lỗi trong trường errors của plugin list --json:
     * chưa cài hoặc đã cài nhưng bị tắt → "dependency-unsatisfied";
     * đã cài, đã bật nhưng version nằm ngoài range → "dependency-version-unsatisfied"; ổn thì null.
     */
    String diagnose(DepState state);

    /**
     * Bài 4 (sửa đúng chỗ): mã lỗi → hướng sửa.
     * "dependency-unsatisfied" → "install or enable it"; "dependency-version-unsatisfied" → "adjust the range or bump the release";
     * "no-matching-tag" → "author pushes a tag"; "range-conflict" → "reconcile the ranges"; "cross-marketplace" → "add to allow list".
     * Khác: IllegalArgumentException.
     */
    String fixFor(String errorCode);

    /**
     * Bài 5 (ranh giới marketplace): plugin ở rootMarketplace phụ thuộc thứ ở depMarketplace.
     * Cùng marketplace → true. Khác marketplace → chỉ true khi allowLists.get(rootMarketplace) có depMarketplace.
     * Tin cậy KHÔNG nối chuỗi: root cho phép B, B cho phép C thì root sang C vẫn false.
     */
    boolean crossMarketplaceAllowed(String rootMarketplace, String depMarketplace, Map<String, List<String>> allowLists);

    /** Trạng thái một phụ thuộc như thấy trên máy của đồng đội. */
    record DepState(boolean installed, boolean enabled, String version, String range) {}

    /** Dùng chung: "~X.Y.Z" chỉ patch, "^X.Y.Z" cùng major, ">=X.Y.Z" mức sàn, không tiền tố là khớp đúng. */
    static boolean satisfies(String range, String version) {
        int[] v = parse(version);
        if (range.startsWith(">=")) return compare(version, range.substring(2)) >= 0;
        if (range.startsWith("~")) {
            int[] b = parse(range.substring(1));
            return v[0] == b[0] && v[1] == b[1] && v[2] >= b[2];
        }
        if (range.startsWith("^")) return v[0] == parse(range.substring(1))[0] && compare(version, range.substring(1)) >= 0;
        return compare(version, range) == 0;
    }

    /** Dùng chung: "2.1" → [2, 1, 0]. */
    static int[] parse(String version) {
        String[] p = version.split("\\.");
        int[] v = new int[3];
        for (int i = 0; i < 3 && i < p.length; i++) v[i] = Integer.parseInt(p[i]);
        return v;
    }

    /** Dùng chung: so sánh hai phiên bản như Comparator. */
    static int compare(String a, String b) {
        int[] x = parse(a), y = parse(b);
        for (int i = 0; i < 3; i++) if (x[i] != y[i]) return Integer.compare(x[i], y[i]);
        return 0;
    }
}
