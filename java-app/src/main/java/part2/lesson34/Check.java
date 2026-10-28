package part2.lesson34;

import static common.Checker.assertEquals;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import part2.lesson34.Lesson34Api.EvalCase;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson34Api api = useSolution ? new Lesson34Solution() : new Lesson34();
        Checker c = new Checker();

        c.check("Bài 1: prompt, model ID và config đi thành một khối", () -> {
            assertEquals(List.of(), api.missingFromUnit(Set.of("prompt", "model_id", "config")));
            assertEquals(List.of("model_id", "config"), api.missingFromUnit(Set.of("prompt")));
            assertEquals(List.of("prompt", "model_id", "config"), api.missingFromUnit(Set.of()));
        });
        c.check("Bài 2: semver nếu có, SHA fallback nếu bỏ trống", () -> {
            assertEquals("1.4.0", api.pluginVersion("1.4.0", "a1b2c3d"));
            assertEquals("a1b2c3d", api.pluginVersion(null, "a1b2c3d"));
            assertEquals("9f8e7d6", api.pluginVersion("  ", "9f8e7d6"));
            expectThrows(IllegalArgumentException.class, () -> api.pluginVersion("1.4", "a1b2c3d"));
            expectThrows(IllegalArgumentException.class, () -> api.pluginVersion("latest", "a1b2c3d"));
        });
        c.check("Bài 3: anthropic-version là header bắt buộc", () -> {
            assertEquals(Map.of("x-api-key", "k", "anthropic-version", "2023-06-01", "content-type", "application/json"),
                api.requestHeaders("k", "2023-06-01"));
            expectThrows(IllegalArgumentException.class, () -> api.requestHeaders("k", ""));
            expectThrows(IllegalArgumentException.class, () -> api.requestHeaders("k", null));
        });
        List<EvalCase> cases = List.of(
            new EvalCase("fr", "France", "Paris"),
            new EvalCase("jp", "Japan", "Tokyo"),
            new EvalCase("vn", "Vietnam", "Hanoi"));
        Map<String, String> answers = Map.of("France", " paris. ", "Japan", "The capital is Tokyo", "Vietnam", "Hanoi");
        c.check("Bài 4: chạy mỗi case đúng một lần, so sánh sau khi chuẩn hóa", () -> {
            List<String> seen = new ArrayList<>();
            Map<String, Boolean> r = api.runEvalSet(cases, in -> { seen.add(in); return answers.get(in); });
            assertEquals(List.of("France", "Japan", "Vietnam"), seen);
            assertEquals(List.of("fr", "jp", "vn"), new ArrayList<>(r.keySet()));
            assertEquals(Map.of("fr", true, "jp", false, "vn", true), r);
        });
        c.check("Bài 5: promote khi bằng hoặc hơn và không thụt lùi ở case quan trọng", () -> {
            Map<String, Boolean> prod = new LinkedHashMap<>(Map.of("a", true, "b", true, "c", false));
            assertEquals("promote", api.promotionDecision(prod, Map.of("a", true, "b", true, "c", true), Set.of("a")));
            assertEquals("promote", api.promotionDecision(prod, Map.of("a", true, "b", true, "c", false), Set.of("a", "b")));
            assertEquals("stay in staging", api.promotionDecision(prod, Map.of("a", true, "b", false, "c", false), Set.of()));
            assertEquals("stay in staging", api.promotionDecision(prod, Map.of("a", false, "b", true, "c", true), Set.of("a")));
            assertEquals("promote", api.promotionDecision(prod, Map.of("a", false, "b", true, "c", true), Set.of("b")));
        });

        return c.summary();
    }
}
