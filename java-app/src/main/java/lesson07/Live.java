package lesson07;

import common.Claude;
import common.LiveSection;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lesson06.ClaudeQueryModel;
import lesson06.Lesson06Api.SdkMessage;
import lesson07.Lesson07Api.Limits;
import lesson07.Lesson07Api.Pricing;
import lesson07.Lesson07Api.RunResult;

/**
 * Bài 07 chạy với Claude thật: cùng một việc cần nhiều lượt tool, chạy với ba kiểu giới hạn khác nhau.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="07 --live"
 */
public final class Live {
    private Live() {}

    public static void run(boolean useSolution, Claude claude) {
        Lesson07Api api = useSolution ? new Lesson07Solution() : new Lesson07();
        Pricing pricing = new Pricing(Claude.price()[0], Claude.price()[1]);
        String system = "You are a study assistant. Read every lesson you are asked about with the tool, "
            + "one lesson per tool call. Answer in Vietnamese, at most 3 sentences.";
        String task = "Đọc lần lượt bài 5, 6 và 7 rồi nối chúng thành một câu chuyện ngắn.";
        Map<String, String> descriptions = Map.of("read_lesson", "Read the one-line summary of a lesson. Input: the lesson number.");

        for (Limits limits : List.of(new Limits(1, null), new Limits(null, 0.0001), new Limits(10, 0.50))) {
            LiveSection.run("Giới hạn: maxTurns=" + limits.maxTurns() + ", maxBudgetUsd=" + limits.maxBudgetUsd(), () -> {
                List<SdkMessage> messages = new ArrayList<>();
                RunResult result = api.run(task, system, new ClaudeQueryModel(claude, descriptions),
                    Map.of("read_lesson", lesson06.Live.TOOLS.get("read_lesson")), limits, pricing,
                    message -> {
                        messages.add(message);
                        lesson06.Live.print(message);
                    });
                System.out.println("  countTurns(): " + api.countTurns(messages) + ", numTurns: " + result.numTurns());
                System.out.println("  " + api.describeStop(result));
                try {
                    System.out.println("  → " + api.readResult(result));
                } catch (IllegalStateException e) {
                    System.out.println("  → Không có câu trả lời: " + e.getMessage());
                }
            });
        }
    }
}
