package part2.lesson01;

import common.Claude;
import common.LiveSection;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import part2.lesson01.Lesson01Api.AgentChecks;
import part2.lesson01.Lesson01Api.Requirement;

/**
 * Phần 2 · Bài 01 chạy với Claude thật: Claude tách một business need thành các capability nhìn thấy được,
 * code của bạn chọn tier cho từng capability, kiểm tra truy vết, và soát các câu "đội lốt" hạ tầng.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-01 --live"
 */
public final class Live {
    private Live() {}

    /** Một capability người dùng nhìn thấy được, kèm câu trả lời cho bốn check agent. */
    public record Capability(String name, String input, String expectedOutput, boolean multiStep,
                             boolean pathKnownAtDesignTime, boolean complexity, boolean value, boolean viability,
                             boolean errorRecoverable) {}

    public record Decomposition(List<Capability> capabilities) {}

    public record Label(String statement, boolean infrastructure, String reason) {}

    public record Labels(List<Label> labels) {}

    static final String NEED = "Cut support ticket triage time in half for a SaaS help desk.";

    static final List<String> STAKEHOLDER_ASKS = List.of(
        "The assistant should feel fast.",
        "Classify every incoming ticket as billing, bug, or account.",
        "Answers must come back within 2 seconds.",
        "Draft a reply that cites the matching help-center article.",
        "Support 300 tickets per minute during the Monday peak.",
        "Customer data must stay in an EU region.");

    public static void run(boolean useSolution, Claude claude) {
        Lesson01Api api = useSolution ? new Lesson01Solution() : new Lesson01();

        LiveSection.run("Tách business need thành capability, rồi chọn tier đơn giản nhất cho từng cái", () -> {
            api.chooseTier(false, false, new AgentChecks(true, true, true, true)); // chưa làm bài 2 thì dừng ở đây, không gọi API
            System.out.println("  Business need: " + NEED);
            Decomposition d = claude.askJson("""
                You are a solutions engineer writing a functional spec. Break the business need into 3-5
                user-observable capabilities (things a user would watch the app do, not internal plumbing).
                Size each one so a single Claude interaction can deliver it. For each, state the input and the
                expected output as a contract, and answer honestly: is it multi-step, is the path known at design
                time, and do the four agent checks pass (complexity, value, viability, errorRecoverable)?""",
                NEED, Decomposition.class);

            List<Requirement> requirements = new ArrayList<>();
            int n = 1;
            for (Capability cap : d.capabilities()) {
                AgentChecks checks = new AgentChecks(cap.complexity(), cap.value(), cap.viability(), cap.errorRecoverable());
                System.out.println("\n  • " + cap.name());
                System.out.println("    input:  " + cap.input());
                System.out.println("    output: " + cap.expectedOutput());
                System.out.println("    tier của bạn: " + api.chooseTier(cap.multiStep(), cap.pathKnownAtDesignTime(), checks)
                    + "   check yếu: " + tryCall(() -> api.weakChecks(checks)));
                requirements.add(new Requirement("FR-" + n++, cap.name(), "N1"));
            }
            // Một tính năng "thông minh" không ai yêu cầu: truy vết phải bắt được nó.
            requirements.add(new Requirement("FR-" + n, "Write a motivational poem for agents every morning", null));
            System.out.println("\n  Requirement không truy về business need N1: "
                + tryCall(() -> api.untraced(requirements, Set.of("N1"))));
        });

        LiveSection.run("Hành vi hay hạ tầng đội lốt? So code của bạn với nhận xét của Claude", () -> {
            api.isInfrastructureInDisguise(STAKEHOLDER_ASKS.get(0));
            Labels labels = claude.askJson("""
                For each stakeholder statement, decide whether it is really an infrastructure constraint
                (latency, throughput, region/residency, cost) rather than a functional behavior with an input and an
                expected output. Keep the statements verbatim and in order. Give a one-sentence reason in Vietnamese.""",
                String.join("\n", STAKEHOLDER_ASKS), Labels.class);
            int agree = 0;
            for (Label label : labels.labels()) {
                boolean mine = api.isInfrastructureInDisguise(label.statement());
                if (mine == label.infrastructure()) agree++;
                System.out.println("  " + (mine == label.infrastructure() ? "✅" : "⚠️") + " " + label.statement()
                    + "\n     Claude: " + (label.infrastructure() ? "hạ tầng" : "hành vi") + " · bạn: "
                    + (mine ? "hạ tầng" : "hành vi") + " · " + label.reason());
            }
            System.out.println("  Khớp " + agree + "/" + labels.labels().size());
        });
    }

    private interface Attempt<T> {
        T get();
    }

    /** Hiện "chưa làm" thay vì dừng cả demo khi một hàm trong Lesson01 còn TODO. */
    private static <T> String tryCall(Attempt<T> attempt) {
        try {
            return String.valueOf(attempt.get());
        } catch (UnsupportedOperationException e) {
            return "⏳ chưa làm (" + e.getMessage() + ")";
        }
    }
}
