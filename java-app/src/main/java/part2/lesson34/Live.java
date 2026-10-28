package part2.lesson34;

import common.Claude;
import common.LiveSection;
import common.RawApi;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import part2.lesson34.Lesson34Api.EvalCase;

/**
 * Phần 2 · Bài 34 chạy với Claude thật: thấy anthropic-version header là bắt buộc, rồi chạy cùng một frozen eval set
 * cho prompt production và một prompt candidate, để quyết định promote hay giữ ở staging dựa trên bằng chứng.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-34 --live"
 */
public final class Live {
    private Live() {}

    static final String PRODUCTION_PROMPT = "Reply with only the capital city of the country the user names. No other words.";
    static final String CANDIDATE_PROMPT = "You are a friendly geography tutor. Answer the user's country with a warm full sentence about its capital.";

    static final List<EvalCase> FROZEN = List.of(
        new EvalCase("fr", "France", "Paris"),
        new EvalCase("jp", "Japan", "Tokyo"),
        new EvalCase("vn", "Vietnam", "Hanoi"));

    public static void run(boolean useSolution, Claude claude) {
        Lesson34Api api = useSolution ? new Lesson34Solution() : new Lesson34();
        RawApi raw = RawApi.fromEnv();

        LiveSection.run("anthropic-version ghim hợp đồng của API, và nó là bắt buộc", () -> {
            Map<String, String> headers = api.requestHeaders("$KEY", "2023-06-01");
            String body = "{\"model\":\"" + Claude.MODEL + "\",\"max_tokens\":20,"
                + "\"messages\":[{\"role\":\"user\",\"content\":\"Say OK.\"}]}";
            System.out.println("  Có header anthropic-version=" + headers.get("anthropic-version") + " → HTTP "
                + raw.postWithHeaders(headers, body).status());
            Map<String, String> without = new LinkedHashMap<>(headers);
            without.remove("anthropic-version");
            RawApi.Response r = raw.postWithHeaders(without, body);
            System.out.println("  Bỏ header đó → HTTP " + r.status() + " " + r.body().replace("\n", " "));
        });

        LiveSection.run("Cùng frozen eval set cho production và candidate", () -> {
            Map<String, Boolean> production = api.runEvalSet(FROZEN, in -> claude.ask(PRODUCTION_PROMPT, in));
            Map<String, Boolean> candidate = api.runEvalSet(FROZEN, in -> claude.ask(CANDIDATE_PROMPT, in));
            System.out.println("  production (" + Claude.MODEL + "): " + production);
            System.out.println("  candidate  (" + Claude.MODEL + "): " + candidate);
            System.out.println("  Quyết định: " + api.promotionDecision(production, candidate, Set.of("fr", "vn")));
            System.out.println("  Đổi giọng/định dạng cũng là regression nếu downstream cần đúng một từ.");
        });
    }
}
