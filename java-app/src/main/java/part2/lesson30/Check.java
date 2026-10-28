package part2.lesson30;

import static common.Checker.assertEquals;

import common.Checker;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import part2.lesson30.Lesson30Api.Mechanism;
import part2.lesson30.Lesson30Api.Store;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson30Api api = useSolution ? new Lesson30Solution() : new Lesson30();
        Checker c = new Checker();

        c.check("Bài 1: CLAUDE.md, agent memory và context window là ba thứ khác nhau", () -> {
            assertEquals(Store.CLAUDE_MD, api.storeFor(true, true));
            assertEquals(Store.AGENT_MEMORY, api.storeFor(false, true));
            assertEquals(Store.CONTEXT_WINDOW, api.storeFor(false, false));
        });
        c.check("Bài 2: rule để lái hành vi, hook khi cần cưỡng chế thật", () -> {
            assertEquals(Mechanism.PRE_TOOL_USE_HOOK, api.mechanismFor(true));
            assertEquals(Mechanism.CLAUDE_MD_RULE, api.mechanismFor(false));
        });
        c.check("Bài 3: cả file nạp đầy đủ mỗi phiên, không cắt bớt", () -> {
            assertEquals(50L, api.tokensSpent(List.of("- Use pnpm", "- Tabs!"), 10)); // 17 ký tự → 5 token × 10 phiên
        });
        c.check("Bài 3: file dài 1000 dòng vẫn nạp hết", () -> {
            List<String> big = Collections.nCopies(1000, "x".repeat(40));
            assertEquals(10_000L * 5, api.tokensSpent(big, 5));
        });

        c.check("Bài 4: file gọn gàng không có cảnh báo", () ->
            assertEquals(List.of(), api.lint(List.of("# Commands", "- Run tests: `./mvnw test`", "- Use records for DTOs"))));
        c.check("Bài 4: văn xuôi dài và lệnh không nguyên văn", () -> {
            String prose = "Historically our team has preferred to keep things fairly consistent, and the reasoning behind this goes back "
                + "to a long discussion we had about readability, onboarding and the general feeling of the codebase.";
            assertEquals(List.of("line 2: verbose prose, rewrite as a short directive", "line 3: put the command in verbatim"),
                api.lint(List.of("# Conventions", prose, "  Run the tests before pushing")));
        });
        c.check("Bài 4: hơn 200 dòng thì cảnh báo trước tiên", () -> {
            List<String> lines = new ArrayList<>(Collections.nCopies(205, "- Use tabs"));
            lines.set(9, "run npm test");
            assertEquals(List.of("file: 205 lines, keep it under 200", "line 10: put the command in verbatim"), api.lint(lines));
        });

        c.check("Bài 5: structure, conventions, commands thành directive ngắn", () -> {
            Map<String, String> structure = new LinkedHashMap<>();
            structure.put("src/api", "REST controllers");
            structure.put("src/core", "domain logic, no framework imports");
            Map<String, String> commands = new LinkedHashMap<>();
            commands.put("Build", "./mvnw -q package");
            commands.put("Test", "./mvnw test -Dtest=*IT");
            assertEquals(List.of("# Structure", "- `src/api`: REST controllers", "- `src/core`: domain logic, no framework imports",
                    "# Conventions", "- Use camelCase for methods",
                    "# Commands", "- Build: `./mvnw -q package`", "- Test: `./mvnw test -Dtest=*IT`"),
                api.buildClaudeMd(structure, List.of("Use camelCase for methods"), commands));
        });
        c.check("Bài 5: phần rỗng thì bỏ cả tiêu đề", () ->
            assertEquals(List.of("# Commands", "- Lint: `npm run lint`"),
                api.buildClaudeMd(Map.of(), List.of(), Map.of("Lint", "npm run lint"))));

        return c.summary();
    }
}
