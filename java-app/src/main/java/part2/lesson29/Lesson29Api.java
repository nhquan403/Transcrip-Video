package part2.lesson29;

import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 29: Plugins Across a Team and Project.
 * {@link Lesson29} là chỗ bạn làm bài, {@link Lesson29Solution} là lời giải mẫu.
 */
public interface Lesson29Api {

    enum Scope { USER, PROJECT, LOCAL, MANAGED }

    /** Một plugin đang cài: tên, marketplace nguồn, phiên bản, scope, đang bật hay không. */
    record Plugin(String name, String marketplace, String version, Scope scope, boolean enabled) {}

    /**
     * Bài 1 (chọn scope khi cài): adminEnforced (quản trị viên áp cho cả tổ chức, khóa lại) → MANAGED;
     * nếu không, forEveryone (mọi người trên repo này đều cần) → PROJECT; nếu không, onlyThisRepo (chỉ mình tôi, chỉ repo này, ví dụ thử nghiệm) → LOCAL;
     * còn lại → USER (mặc định: mọi project của riêng tôi). Thứ tự ưu tiên đúng như trên.
     */
    Scope chooseScope(boolean adminEnforced, boolean forEveryone, boolean onlyThisRepo);

    /**
     * Bài 2 (tính chất của scope), trả về đúng 3 giá trị theo thứ tự [shared, committedToRepo, userCanModify]:
     * shared: scope tới cả nhóm (PROJECT, MANAGED). committedToRepo: đi qua source control (chỉ PROJECT).
     * userCanModify: cá nhân tự sửa/gỡ được (mọi scope trừ MANAGED).
     */
    List<Boolean> traits(Scope scope);

    /**
     * Bài 3 (ghi cấu hình project vào settings file): trả về Map (giữ thứ tự chèn) với tối đa 3 khóa, theo thứ tự:
     * "enabledPlugins": Map tên plugin → true (theo thứ tự của danh sách); "extraKnownMarketplaces": chính map marketplaces đưa vào;
     * "pluginConfigs": chính map configs đưa vào. Khóa nào có giá trị rỗng (danh sách/map rỗng hoặc null) thì bỏ hẳn.
     */
    Map<String, Object> projectSettings(List<String> plugins, Map<String, String> marketplaces,
                                        Map<String, Map<String, Object>> configs);

    /**
     * Bài 4 (dọn dẹp có bẫy): action là "disable", "uninstall" hoặc "remove-marketplace". Trả về danh sách tên plugin
     * bị GỠ CÀI ĐẶT (mất file), sắp theo thứ tự chữ cái. "disable" chỉ tạm dừng → rỗng. "uninstall" target là tên plugin → [target]
     * nếu đang cài, rỗng nếu không. "remove-marketplace" target là tên marketplace → mọi plugin đến từ marketplace đó.
     * Action lạ: IllegalArgumentException.
     */
    List<String> uninstalledBy(String action, String target, List<Plugin> installed);

    /**
     * Bài 5 (audit lại sau khi pull): trả về tên các plugin cần xem lại trước khi chạy: plugin có trong after mà
     * không có trong before (theo tên), hoặc có cả hai nhưng version khác. Chỉ tính plugin đang enabled trong after.
     * Sắp theo thứ tự chữ cái.
     */
    List<String> reviewAfterPull(List<Plugin> before, List<Plugin> after);
}
