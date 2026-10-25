package lesson02;

import common.Claude;
import common.Claude.CallStats;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.UnaryOperator;
import lesson01.ClaudeAgentModel;
import lesson01.Lesson01Solution;

/**
 * Bài 02 chạy với Claude thật: đo token và độ trễ thật của một vòng lặp agent,
 * rồi đối chiếu với các hàm bạn viết trong Lesson02.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="02 --live"
 */
public final class Live {
    private Live() {}

    public static void run(boolean useSolution, Claude claude) {
        Lesson02Api api = useSolution ? new Lesson02Solution() : new Lesson02();

        System.out.println("\n▶ Context cộng dồn: agent đọc 3 chương, mỗi chương khoảng 1.500 từ");
        int before = claude.calls().size();
        long wallStart = System.nanoTime();
        ClaudeAgentModel model = new ClaudeAgentModel(claude,
            "You are a reading assistant. Read each chapter with the tool, one at a time. Answer in Vietnamese.",
            Map.of("read_chapter", "Return the full text of one chapter. Input: the chapter number, e.g. '1'."));
        String summary = new Lesson01Solution().runAgent(
            "Đọc chương 1, 2 và 3 rồi tóm tắt mỗi chương trong một câu.",
            model, Map.of("read_chapter", Live::chapter), 6);
        long wallMs = (System.nanoTime() - wallStart) / 1_000_000;
        System.out.println(summary);

        List<CallStats> turns = claude.calls().subList(before, claude.calls().size());
        List<Long> inputs = turns.stream().map(CallStats::inputTokens).toList();
        System.out.println("\n  Token vào thật ở từng vòng: " + inputs);
        long actualTotal = inputs.stream().mapToLong(Long::longValue).sum();

        // Phần tăng thêm giữa hai vòng liên tiếp chính là tool output (cộng phần model vừa trả lời) được gửi lại.
        List<Integer> growth = new ArrayList<>();
        for (int i = 1; i < inputs.size(); i++) growth.add((int) (inputs.get(i) - inputs.get(i - 1)));
        System.out.println("  Phần tăng thêm mỗi vòng:     " + growth);
        System.out.println("  Tổng thật: " + actualTotal + " token. totalInputTokens() của bạn: "
            + tryCall(() -> api.totalInputTokens(inputs.get(0).intValue(), growth)));
        System.out.println("  So với một lần gọi duy nhất: " + inputs.get(0) + " token, tức vòng lặp tốn gấp "
            + String.format("%.1f", (double) actualTotal / inputs.get(0)) + " lần.");

        System.out.println("\n▶ Độ trễ cộng dồn");
        List<Long> roundTrips = turns.stream().map(CallStats::millis).toList();
        System.out.println("  Round trip thật (ms): " + roundTrips);
        System.out.println("  waitTimeMs() của bạn: " + tryCall(() -> api.waitTimeMs(roundTrips))
            + " ms, đồng hồ thật đo được: " + wallMs + " ms");

        System.out.println("\n▶ Lỗi dồn: nếu mỗi bước đúng 95%");
        for (int steps : List.of(1, 5, 10, 20)) {
            System.out.println("  " + steps + " bước → " + tryCall(() ->
                String.format("%.0f%%", api.chanceAllStepsCorrect(0.95, steps) * 100)));
        }
        System.out.println("  Muốn đúng ít nhất 80% thì tối đa " + tryCall(() -> api.maxStepsForTarget(0.95, 0.8)) + " bước");

        System.out.println("\n▶ Hybrid: workflow cố định bọc một bước Claude ở giữa");
        UnaryOperator<String> agentStage = q -> claude.ask(
            "You are a tutor for a course on building agents. Answer in Vietnamese in at most 3 sentences.", q);
        UnaryOperator<String> format = s -> "[KẾT QUẢ] " + s;
        System.out.println(tryCall(() -> api.hybridPipeline(
            "Vì sao vòng lặp agent càng dài càng tốn token?", Live::validQuestion, agentStage, format)));
        System.out.println(tryCall(() -> {
            try {
                return api.hybridPipeline("   ", Live::validQuestion, agentStage, format);
            } catch (IllegalArgumentException e) {
                return "🚫 Input rỗng bị chặn trước khi gọi Claude (không tốn token): " + e.getMessage();
            }
        }));
        // Gọi một model không tồn tại để thấy lỗi API thật bị workflow bắt lại (không tốn token).
        UnaryOperator<String> brokenStage = q -> Claude.text(claude.create(Claude.params()
            .model("claude-model-khong-ton-tai").addUserMessage(q).build()));
        System.out.println(tryCall(() -> api.hybridPipeline("Câu hỏi thử", Live::validQuestion, brokenStage, format)));
    }

    private static boolean validQuestion(String q) {
        return !q.isBlank() && q.length() <= 300;
    }

    /** Một chương dài ~1.500 từ: đủ lớn để thấy nó "đi nhờ" qua mọi vòng sau. */
    static String chapter(String number) {
        String n = number.trim();
        if (!n.matches("[1-3]")) return "error: chapter must be 1, 2 or 3";
        String topic = switch (n) {
            case "1" -> "why every extra agent turn resends the whole growing context";
            case "2" -> "how a small early mistake snowballs into compounding errors";
            default -> "why teams validate a deterministic workflow before building an agent";
        };
        String sentence = "Chapter " + n + " explains " + topic + ". ";
        return sentence.repeat(100);
    }

    private interface Attempt<T> {
        T get();
    }

    /** Hiện "chưa làm" thay vì dừng cả demo khi một hàm trong Lesson02 còn TODO. */
    private static <T> String tryCall(Attempt<T> attempt) {
        try {
            return String.valueOf(attempt.get());
        } catch (UnsupportedOperationException e) {
            return "⏳ chưa làm (" + e.getMessage() + ")";
        } catch (RuntimeException e) {
            return "❌ " + e;
        }
    }
}
