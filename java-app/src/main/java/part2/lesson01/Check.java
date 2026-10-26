package part2.lesson01;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;

import common.Checker;
import java.util.List;
import java.util.Set;
import part2.lesson01.Lesson01Api.AgentChecks;
import part2.lesson01.Lesson01Api.Requirement;
import part2.lesson01.Lesson01Api.Tier;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson01Api api = useSolution ? new Lesson01Solution() : new Lesson01();
        Checker c = new Checker();
        AgentChecks allPass = new AgentChecks(true, true, true, true);

        c.check("Bài 1: đạt hết thì không có check yếu", () ->
            assertEquals(List.of(), api.weakChecks(allPass)));
        c.check("Bài 1: liệt kê đúng thứ tự, kể cả cost of error", () -> {
            assertEquals(List.of("value", "viability"), api.weakChecks(new AgentChecks(true, false, false, true)));
            assertEquals(List.of("complexity", "cost of error"), api.weakChecks(new AgentChecks(false, true, true, false)));
        });

        c.check("Bài 2: một bước thì một lần gọi là đủ, kể cả khi check agent đều đạt", () ->
            assertEquals(Tier.SINGLE_CALL, api.chooseTier(false, false, allPass)));
        c.check("Bài 2: nhiều bước nhưng đường đi biết trước thì dùng workflow", () ->
            assertEquals(Tier.WORKFLOW, api.chooseTier(true, true, allPass)));
        c.check("Bài 2: đường đi quyết định lúc chạy và đạt cả bốn check thì mới dùng agent", () ->
            assertEquals(Tier.AGENT, api.chooseTier(true, false, allPass)));
        c.check("Bài 2: chỉ một check yếu là quay về tier đơn giản hơn", () -> {
            assertEquals(Tier.WORKFLOW, api.chooseTier(true, false, new AgentChecks(true, true, true, false)));
            assertEquals(Tier.WORKFLOW, api.chooseTier(true, false, new AgentChecks(true, false, true, true)));
        });

        c.check("Bài 3: requirement thiếu hoặc sai business need bị gắn cờ, giữ thứ tự", () -> {
            List<Requirement> reqs = List.of(
                new Requirement("FR-1", "Classify the ticket", "N1"),
                new Requirement("FR-2", "Generate a weekly poem about the team", null),
                new Requirement("FR-3", "Route the ticket", "N1"),
                new Requirement("FR-4", "Translate tickets into Klingon", "N9"),
                new Requirement("FR-5", "Draft a reply", " "));
            assertEquals(List.of("FR-2", "FR-4", "FR-5"), api.untraced(reqs, Set.of("N1", "N2")));
        });
        c.check("Bài 3: tất cả đều truy vết được thì danh sách rỗng", () ->
            assertEquals(List.of(), api.untraced(List.of(new Requirement("FR-1", "Route", "N2")), Set.of("N2"))));

        c.check("Bài 4: nhận ra độ trễ, thông lượng, chi phí, vùng đội lốt hành vi", () -> {
            for (String s : List.of("Make Claude answer faster", "Responses must arrive in under 2 seconds",
                "Handle 500 requests per minute at PEAK", "Keep the monthly bill under $2,000",
                "Customer data must stay in an EU region", "The app feels slow to users")) {
                assertTrue(api.isInfrastructureInDisguise(s), "phải là ràng buộc hạ tầng: " + s);
            }
        });
        c.check("Bài 4: hành vi thật thì không bị gắn cờ", () -> {
            for (String s : List.of("Return a JSON object with the caller's name, email and plan",
                "Classify each ticket as billing, bug or other", "Draft a reply that cites the help-center article",
                "Summarize the items in the customer's last message")) {
                assertTrue(!api.isInfrastructureInDisguise(s), "đây là hành vi, không phải hạ tầng: " + s);
            }
        });

        return c.summary();
    }
}
