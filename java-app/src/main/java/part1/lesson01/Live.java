package part1.lesson01;

import common.Claude;
import common.LiveSection;
import java.util.List;
import java.util.Map;
import java.util.function.UnaryOperator;

/**
 * Bài 01 chạy với Claude thật: dùng chính code bạn viết trong Lesson01, chỉ thay "model" giả bằng Claude.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p1-01 --live"
 */
public final class Live {
    private Live() {}

    public static void run(boolean useSolution, Claude claude) {
        Lesson01Api api = useSolution ? new Lesson01Solution() : new Lesson01();

        LiveSection.run("Prompt chaining: dàn ý, kiểm tra, rồi viết đoạn văn", () -> {
            List<UnaryOperator<String>> steps = List.of(
                topic -> claude.ask("You write short outlines. Reply with 3 bullet points only.",
                    "Outline a short explanation of: " + topic),
                outline -> claude.ask("You are a technical writer. Reply with one paragraph of at most 80 words, in English.",
                    "Write the paragraph from this outline:\n" + outline));
            String paragraph = api.promptChain("workflow vs agent: who owns the next decision", steps,
                out -> !out.isBlank() && out.length() < 2000);
            System.out.println(paragraph);
        });

        LiveSection.run("Routing: Claude phân loại ticket, code gửi cho đúng handler", () -> {
            UnaryOperator<String> classifier = ticket -> claude.ask(
                "Classify the support ticket. Reply with exactly one word: billing, complaint, or other.", ticket)
                .toLowerCase().replaceAll("[^a-z]", "");
            Map<String, UnaryOperator<String>> handlers = Map.of(
                "billing", t -> "💳 Kế toán: " + claude.ask("You are a billing agent. Reply in one short Vietnamese sentence.", t),
                "complaint", t -> "🙏 CSKH: " + claude.ask("You are a polite support agent. Apologise in one short Vietnamese sentence.", t));
            UnaryOperator<String> fallback = t -> "📥 Hộp thư chung: đã nhận \"" + t + "\"";
            for (String ticket : List.of(
                    "I was charged twice for invoice #4821.",
                    "Your app deleted my notes and nobody answered my emails!",
                    "Do you have a dark mode?")) {
                System.out.println(api.route(ticket, classifier, handlers, fallback));
            }
        });

        LiveSection.run("Parallelization: dịch 3 câu trong bài học cùng lúc", () -> {
            List<String> sentences = List.of(
                "The real question is who owns the next decision.",
                "Find the simplest solution that works and only add complexity when it clearly improves the outcome.",
                "Simple is a feature, not a compromise.");
            List<String> translated = api.parallelize(sentences,
                s -> claude.ask("Translate to natural Vietnamese. Reply with the translation only.", s));
            for (int i = 0; i < sentences.size(); i++) {
                System.out.println("  " + sentences.get(i) + "\n  → " + translated.get(i));
            }
        });

        LiveSection.run("Agent: Claude tự chọn tool cho tới khi xong (tối đa 6 bước)", () -> {
            Map<String, UnaryOperator<String>> tools = Map.of(
                "glossary", Live::glossary,
                "calculator", Live::calculate);
            ClaudeAgentModel model = new ClaudeAgentModel(claude,
                "You are a study assistant. Use the tools when they help. Answer in Vietnamese, at most 5 sentences.",
                Map.of(
                    "glossary", "Look up a term from the lesson glossary. Input: one term, e.g. 'workflow'.",
                    "calculator", "Evaluate 'a op b' where op is + - * / or ^ (power). Example: '0.95 ^ 10'."));
            String answer = api.runAgent(
                "Dùng glossary để so sánh 'workflow' và 'agent', rồi dùng calculator tính xác suất cả 10 bước đều đúng nếu mỗi bước đúng 95%.",
                model, tools, 6);
            System.out.println(answer);
        });
    }

    private static final Map<String, String> GLOSSARY = Map.of(
        "workflow", "Steps run in a fixed order written in code; the model only fills in each step.",
        "agent", "The model decides the next step at runtime: reason, call a tool, look at the result, repeat.",
        "augmented language model", "A model enhanced with retrieval, tools and memory.",
        "routing", "Classify a request and send it to the handler built for that case.",
        "prompt chaining", "A fixed sequence of model calls, each working on the previous output.");

    static String glossary(String term) {
        String key = term.trim().toLowerCase();
        return GLOSSARY.getOrDefault(key, "error: no glossary entry for '" + term + "'. Known terms: " + GLOSSARY.keySet());
    }

    static String calculate(String expression) {
        String[] parts = expression.trim().split("\\s+");
        if (parts.length != 3) return "error: expected 'a op b', got '" + expression + "'";
        try {
            double a = Double.parseDouble(parts[0]);
            double b = Double.parseDouble(parts[2]);
            double result = switch (parts[1]) {
                case "+" -> a + b;
                case "-" -> a - b;
                case "*" -> a * b;
                case "/" -> a / b;
                case "^" -> Math.pow(a, b);
                default -> throw new IllegalArgumentException("unknown operator " + parts[1]);
            };
            return String.valueOf(result);
        } catch (IllegalArgumentException e) {
            return "error: " + e.getMessage();
        }
    }
}
