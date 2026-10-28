package part2.lesson34;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;

/**
 * Phần 2 · Bài 34: Versioning Prompts and Config.
 * {@link Lesson34} là chỗ bạn làm bài, {@link Lesson34Solution} là lời giải mẫu.
 */
public interface Lesson34Api {

    /** Một case trong frozen eval set: input cố định và output mong đợi. */
    record EvalCase(String id, String input, String expected) {}

    /**
     * Bài 1 (một đơn vị version): prompt, model ID và config phải đi cùng nhau. versioned là tập những thứ đang
     * được commit, dùng các tên "prompt", "model_id", "config". Trả về những thứ CÒN THIẾU theo đúng thứ tự
     * "prompt", "model_id", "config" (đủ cả ba → danh sách rỗng).
     */
    List<String> missingFromUnit(Set<String> versioned);

    /**
     * Bài 2 (version của plugin): versionField là trường version trong manifest của plugin.
     * Null hoặc rỗng → dùng commitSha (SHA fallback: mỗi commit là một version mới).
     * Có giá trị → phải là semver MAJOR.MINOR.PATCH (ba số nguyên không âm, ví dụ "1.4.0") và được trả về nguyên văn;
     * sai dạng → IllegalArgumentException.
     */
    String pluginVersion(String versionField, String commitSha);

    /**
     * Bài 3 (anthropic-version header): dựng header cho một request /v1/messages:
     * "x-api-key" → apiKey, "anthropic-version" → apiVersion, "content-type" → "application/json".
     * apiVersion null hoặc rỗng → IllegalArgumentException (header này là bắt buộc).
     */
    Map<String, String> requestHeaders(String apiKey, String apiVersion);

    /**
     * Bài 4 (chạy frozen eval set): gọi model cho từng case (đúng một lần mỗi case, theo thứ tự) và trả về
     * Map id → đạt hay không (giữ thứ tự case). Đạt khi output, sau khi trim và bỏ các dấu "." ở cuối,
     * bằng expected không phân biệt hoa thường.
     */
    Map<String, Boolean> runEvalSet(List<EvalCase> cases, Function<String, String> model);

    /**
     * Bài 5 (promote hay ở lại staging): production và candidate là kết quả runEvalSet trên CÙNG eval set.
     * Trả về "promote" khi candidate đạt số case ≥ production VÀ không có case quan trọng nào (important) mà
     * production đạt còn candidate trượt; ngược lại "stay in staging".
     */
    String promotionDecision(Map<String, Boolean> production, Map<String, Boolean> candidate, Set<String> important);
}
