package part2.lesson35;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.List;
import java.util.Map;
import java.util.Set;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson35Api api = useSolution ? new Lesson35Solution() : new Lesson35();
        Checker c = new Checker();

        c.check("Bài 1: tilde chỉ nhận bản vá trên dòng 2.1", () -> {
            assertTrue(api.satisfies("~2.1.0", "2.1.0"), "~2.1.0 nhận 2.1.0");
            assertTrue(api.satisfies("~2.1.0", "2.1.9"), "~2.1.0 nhận 2.1.9");
            assertTrue(!api.satisfies("~2.1.0", "2.2.0"), "~2.1.0 không nhận 2.2.0");
            assertTrue(!api.satisfies("~2.1.3", "2.1.2"), "~2.1.3 không nhận bản thấp hơn");
        });
        c.check("Bài 1: caret nhận minor + patch nhưng giữ major", () -> {
            assertTrue(api.satisfies("^2.0", "2.9.1"), "^2.0 nhận 2.9.1");
            assertTrue(!api.satisfies("^2.0", "3.0.0"), "^2.0 không nhận 3.0.0");
            assertTrue(!api.satisfies("^2.3", "2.2.9"), "^2.3 không nhận 2.2.9");
        });
        c.check("Bài 1: >= là mức sàn lỏng nhất; không tiền tố là khớp đúng", () -> {
            assertTrue(api.satisfies(">=1.4", "7.0.0"), ">=1.4 nhận cả major mới");
            assertTrue(!api.satisfies(">=1.4", "1.3.9"), ">=1.4 không nhận 1.3.9");
            assertTrue(api.satisfies("1.2.0", "1.2"), "1.2 = 1.2.0");
            assertTrue(!api.satisfies("1.2.0", "1.2.1"), "khớp đúng");
        });
        List<String> tags = List.of("1.0.0", "2.0.0", "2.1.0", "2.1.4", "2.3.0", "3.0.0");
        c.check("Bài 2: giao các range rồi lấy bản cao nhất vừa với tất cả", () -> {
            assertEquals("2.3.0", api.resolve(List.of("^2.0"), tags));
            assertEquals("2.1.4", api.resolve(List.of("^2.0", "~2.1.0"), tags));
            assertEquals("3.0.0", api.resolve(List.of(">=1.4"), tags));
        });
        c.check("Bài 2: range không hòa giải được thì báo range-conflict", () ->
            assertEquals("range-conflict",
                expectThrows(IllegalStateException.class, () -> api.resolve(List.of("^1.0", "^3.0"), tags)).getMessage()));
        Map<String, List<String>> deps = Map.of(
            "deploy", List.of("git-tools", "secrets"),
            "secrets", List.of("crypto"),
            "lint", List.of("git-tools"));
        c.check("Bài 3: bật plugin thì bật cả chuỗi phụ thuộc", () -> {
            assertEquals(Set.of("deploy", "git-tools", "secrets", "crypto"), api.enableCascade("deploy", deps));
            assertEquals(Set.of("crypto"), api.enableCascade("crypto", deps));
        });
        c.check("Bài 4: không tắt được plugin còn bị plugin đang bật phụ thuộc", () -> {
            assertEquals(List.of("deploy", "lint", "git-tools"),
                api.disableOrder("git-tools", Set.of("lint", "deploy", "git-tools"), deps));
            assertEquals(List.of("git-tools"), api.disableOrder("git-tools", Set.of("git-tools", "crypto"), deps));
            assertEquals(List.of("deploy"), api.disableOrder("deploy", Set.of("deploy", "secrets"), deps));
        });
        c.check("Bài 5: prune chỉ xóa phụ thuộc mồ côi, không bao giờ xóa plugin cài trực tiếp", () -> {
            assertEquals(Set.of("secrets", "crypto"), api.prune(Set.of("lint", "git-tools", "secrets", "crypto"), Set.of("lint"), deps));
            assertEquals(Set.of(), api.prune(Set.of("lint", "git-tools", "crypto"), Set.of("lint", "crypto"), deps));
        });

        return c.summary();
    }
}
