package part2.lesson21;

import common.Claude;
import common.LiveSection;
import common.RawApi;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Phần 2 · Bài 21 chạy với Claude thật: (1) vòng tạo, kiểm tra, hỏi lại với một validator nghiệp vụ thật,
 * (2) Claude làm trợ lý review một đoạn code tích hợp, còn quyết định duyệt vẫn là của bạn.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-21 --live"
 */
public final class Live {
    private Live() {}

    static final String CODE_UNDER_REVIEW = """
        String answer(String q) {
            for (int i = 0; i < 5; i++) {
                try {
                    Message m = client.messages().create(params(q));
                    return ((TextBlock) m.content().get(0)).text();
                } catch (Exception e) {
                    Thread.sleep(1000);
                }
            }
            return "";
        }""";

    public static void run(boolean useSolution, Claude claude) {
        Lesson21Api api = useSolution ? new Lesson21Solution() : new Lesson21();

        LiveSection.run("Tạo, kiểm tra, hỏi lại: output phải là JSON với đúng 3 ý, mỗi ý dưới 12 từ", () -> {
            api.requireInt(Map.of("n", 1), "n");
            Lesson21Api.Validated v = api.generateValidated(
                p -> claude.ask("Reply with only a JSON array of strings, no prose.", p),
                "Liệt kê 3 điều cần kiểm tra khi review code gọi Claude, bằng tiếng Việt.",
                Live::checkThreeShortItems, 3);
            System.out.println("  Đạt sau " + v.attempts() + " lần gọi: " + v.output());
        });

        LiveSection.run("Claude làm trợ lý review; người duyệt cuối cùng vẫn là bạn", () -> {
            System.out.println("  Retry trong đoạn code bắt mọi Exception, tức retry cả 400/401: "
                + api.wrongRetries(java.util.Set.of(0, 400, 401, 429, 500)));
            String review = claude.ask("""
                You assist a human reviewer. Review this Java method that calls Claude. In Vietnamese, list at most 4 concrete
                defects (error classification, retries, response parsing, readability), one line each. Do not approve or reject.""",
                CODE_UNDER_REVIEW);
            System.out.println("  🔍 " + review.replace("\n", "\n     "));
            System.out.println("  ✋ Gợi ý của Claude mở rộng phạm vi review, nhưng câu trả lời trôi chảy không phải bằng chứng. Bạn duyệt.");
        });
    }

    /** Validator nghiệp vụ: đúng 3 phần tử, mỗi phần tử dưới 12 từ. */
    static Optional<String> checkThreeShortItems(String output) {
        List<?> items;
        try {
            items = RawApi.JSON.readValue(output.strip(), List.class);
        } catch (java.io.IOException e) {
            return Optional.of("not a JSON array");
        }
        if (items.size() != 3) return Optional.of("expected exactly 3 items, got " + items.size());
        for (Object item : items) {
            if (String.valueOf(item).split("\\s+").length >= 12) return Optional.of("item too long: " + item);
        }
        return Optional.empty();
    }
}
