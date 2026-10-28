package part2.lesson31;

import static common.Checker.assertEquals;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.List;
import java.util.Map;
import java.util.Set;
import part2.lesson31.Lesson31Api.Scope;

public final class Check {
    private Check() {}

    static final Set<String> FILES = Set.of(
        Lesson31Api.MANAGED_FILE, Lesson31Api.USER_FILE,
        "/CLAUDE.md", "/repo/CLAUDE.md", "/repo/app/CLAUDE.md", "/repo/app/CLAUDE.local.md",
        "/repo/app/api/CLAUDE.md", "/repo/app/api/v2/CLAUDE.md", "/repo/docs/CLAUDE.md");

    public static boolean run(boolean useSolution) {
        Lesson31Api api = useSolution ? new Lesson31Solution() : new Lesson31();
        Checker c = new Checker();

        c.check("Bài 1: bốn scope, từ policy toàn máy tới ghi chú riêng", () -> {
            assertEquals(Scope.MANAGED, api.scopeOf("/etc/claude-code/CLAUDE.md"));
            assertEquals(Scope.USER, api.scopeOf("~/.claude/CLAUDE.md"));
            assertEquals(Scope.PROJECT, api.scopeOf("/repo/CLAUDE.md"));
            assertEquals(Scope.LOCAL, api.scopeOf("/repo/app/CLAUDE.local.md"));
            expectThrows(IllegalArgumentException.class, () -> api.scopeOf("/repo/README.md"));
        });

        c.check("Bài 2: managed trước, rồi user, rồi từ gốc xuống cwd; file gần nhất đọc cuối", () ->
            assertEquals(List.of(Lesson31Api.MANAGED_FILE, Lesson31Api.USER_FILE, "/CLAUDE.md", "/repo/CLAUDE.md",
                    "/repo/app/CLAUDE.md", "/repo/app/CLAUDE.local.md"),
                api.launchOrder("/repo/app", FILES, Set.of())));
        c.check("Bài 2: excludes bỏ được file tổ tiên nhưng không bao giờ bỏ được managed policy", () ->
            assertEquals(List.of(Lesson31Api.MANAGED_FILE, Lesson31Api.USER_FILE, "/repo/CLAUDE.md"),
                api.launchOrder("/repo", FILES, Set.of("/CLAUDE.md", Lesson31Api.MANAGED_FILE))));

        c.check("Bài 3: file lồng bên dưới cwd chỉ nạp khi Claude đọc file trong thư mục đó", () -> {
            assertEquals(List.of("/repo/app/api/CLAUDE.md", "/repo/app/api/v2/CLAUDE.md"),
                api.loadedOnRead("/repo/app", "/repo/app/api/v2/Handler.java", FILES));
            assertEquals(List.of("/repo/app/CLAUDE.md", "/repo/app/CLAUDE.local.md", "/repo/app/api/CLAUDE.md"),
                api.loadedOnRead("/repo", "/repo/app/api/Routes.java", FILES));
            assertEquals(List.of(), api.loadedOnRead("/repo/app", "/repo/app/Main.java", FILES));
            assertEquals(List.of(), api.loadedOnRead("/repo/app", "/repo/docs/guide.md", FILES));
        });

        c.check("Bài 4: @path phân giải tương đối với file đang import", () ->
            assertEquals(List.of("/repo/docs/style.md", "/repo/docs/naming.md", "/home/me/shared.md"),
                api.importedFiles("/repo/CLAUDE.md", Map.of(
                    "/repo/CLAUDE.md", List.of("docs/style.md", "/home/me/shared.md"),
                    "/repo/docs/style.md", List.of("naming.md", "../CLAUDE.md")))));
        c.check("Bài 4: chuỗi import dừng ở tối đa 4 hop", () ->
            assertEquals(List.of("/r/a.md", "/r/b.md", "/r/c.md", "/r/d.md"),
                api.importedFiles("/r/CLAUDE.md", Map.of(
                    "/r/CLAUDE.md", List.of("a.md"), "/r/a.md", List.of("b.md"), "/r/b.md", List.of("c.md"),
                    "/r/c.md", List.of("d.md"), "/r/d.md", List.of("e.md")))));

        c.check("Bài 5: mỗi quy tắc đặt đúng scope của nó, xung đột được thiết kế bỏ đi", () -> {
            assertEquals("managed policy", api.placeRule("company-wide, no exceptions"));
            assertEquals("user CLAUDE.md", api.placeRule("personal default for every repo"));
            assertEquals("project CLAUDE.md", api.placeRule("team convention for this repo"));
            assertEquals("subdirectory CLAUDE.md", api.placeRule("only matters inside one folder"));
            assertEquals("CLAUDE.local.md", api.placeRule("private note for this repo"));
            expectThrows(IllegalArgumentException.class, () -> api.placeRule("whatever"));
        });

        return c.summary();
    }
}
