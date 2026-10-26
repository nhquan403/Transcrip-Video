package part2.lesson19;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;

import common.Checker;
import java.util.List;
import part2.lesson19.Lesson19Api.Integrate;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson19Api api = useSolution ? new Lesson19Solution() : new Lesson19();
        Checker c = new Checker();

        c.check("Bài 1: hash giống hệt git hash-object", () -> {
            assertEquals("e69de29bb2d1d6434b8b29ae775ad8c2e48c5391", api.gitBlobId(""));
            assertEquals("ce013625030ba8dba906f756967f9e9ca394464a", api.gitBlobId("hello\n"));
        });
        c.check("Bài 1: đổi một ký tự trong prompt là ra snapshot khác", () -> {
            String v1 = "You are a support assistant. Answer in Vietnamese.\n";
            assertEquals(api.gitBlobId(v1), api.gitBlobId(v1));
            assertTrue(!api.gitBlobId(v1).equals(api.gitBlobId(v1.replace("Vietnamese", "English"))), "hash phải khác");
        });

        c.check("Bài 2: rebase việc riêng, merge việc chung", () -> {
            assertEquals(Integrate.REBASE, api.integrate(false));
            assertEquals(Integrate.MERGE, api.integrate(true));
        });

        c.check("Bài 3: một dòng prompt được viết lại hiện thành - rồi +", () -> assertEquals(List.of(
                "  You are a support assistant.",
                "- Answer in at most 3 sentences.",
                "+ Answer in at most 5 sentences.",
                "  Never promise refunds."),
            api.diff("You are a support assistant.\nAnswer in at most 3 sentences.\nNever promise refunds.",
                "You are a support assistant.\nAnswer in at most 5 sentences.\nNever promise refunds.")));
        c.check("Bài 3: thêm và bỏ dòng", () -> assertEquals(List.of("- A", "  B", "+ X", "  C"),
            api.diff("A\nB\nC", "B\nX\nC")));

        c.check("Bài 4: prompt, schema, config cũng là source", () -> {
            for (String p : new String[] {"prompts/triage.system.md", "app/prompts/reply.txt", "schemas/ticket.json",
                "src/ticket.schema.json", "CLAUDE.md", ".claude/settings.json", "src/Main.java"}) {
                assertTrue(api.needsReview(p), p + " phải qua review");
            }
        });
        c.check("Bài 4: thứ không định hướng hành vi thì không cần", () -> {
            for (String p : new String[] {"notes/todo-ca-nhan.txt", "target/classes/Main.class", "docs/screenshot.png"}) {
                assertTrue(!api.needsReview(p), p);
            }
        });

        return c.summary();
    }
}
