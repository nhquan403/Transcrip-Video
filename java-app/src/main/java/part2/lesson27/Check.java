package part2.lesson27;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.List;
import java.util.Map;
import part2.lesson27.Lesson27Api.Move;
import part2.lesson27.Lesson27Api.Note;
import part2.lesson27.Lesson27Api.Situation;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson27Api api = useSolution ? new Lesson27Solution() : new Lesson27();
        Checker c = new Checker();

        c.check("Bài 1: compact để đi tiếp, clear để xóa tại chỗ, phiên mới khi đã trôi xa", () -> {
            assertEquals(Move.COMPACT, api.chooseMove(new Situation(false, false, false, true)));
            assertEquals(Move.CLEAR, api.chooseMove(new Situation(false, false, false, false)));
            assertEquals(Move.START_FRESH, api.chooseMove(new Situation(true, false, false, true)));
            assertEquals(Move.START_FRESH, api.chooseMove(new Situation(false, true, false, true)));
            assertEquals(Move.START_FRESH, api.chooseMove(new Situation(false, false, true, false)));
        });
        c.check("Bài 2: compaction là tóm tắt, không lossless", () -> {
            assertTrue(api.survivesCompaction("root_claude_md"), "CLAUDE.md gốc được đọc lại từ đĩa");
            assertTrue(api.survivesCompaction("recent_turns"), "lượt gần đây");
            assertTrue(api.survivesCompaction("key_decisions"), "quyết định chính");
            assertTrue(!api.survivesCompaction("early_prompt_detail"), "chi tiết đầu phiên có thể rơi");
            assertTrue(!api.survivesCompaction("nested_claude_md"), "CLAUDE.md lồng nhau không tự chèn lại");
            assertTrue(!api.survivesCompaction("chat_only_note"), "chỉ nói trong chat thì mất");
            expectThrows(IllegalArgumentException.class, () -> api.survivesCompaction("settings_json"));
        });
        c.check("Bài 3: CLAUDE.md lồng nhau chỉ nạp lại khi đọc file trong thư mục đó", () -> {
            assertTrue(!api.nestedClaudeMdReloaded("src/api", List.of()), "chưa đọc gì");
            assertTrue(!api.nestedClaudeMdReloaded("src/api", List.of("src/web/App.java", "src/apiclient/X.java")),
                "src/apiclient không nằm trong src/api");
            assertTrue(api.nestedClaudeMdReloaded("src/api", List.of("README.md", "src/api/v2/Orders.java")), "đọc file trong src/api");
        });
        c.check("Bài 4: cleanupPeriodDays, mặc định 30 ngày", () -> {
            assertTrue(api.sessionDataKept(30, null), "đúng 30 ngày vẫn giữ");
            assertTrue(!api.sessionDataKept(31, null), "quá 30 ngày thì dọn");
            assertTrue(api.sessionDataKept(60, 90), "đặt 90 ngày");
            assertTrue(!api.sessionDataKept(8, 7), "đặt 7 ngày");
        });
        c.check("Bài 5: handoff có chủ đích trước khi reset", () -> {
            List<Note> notes = List.of(
                new Note("raw_chatter", "ok, để xem"),
                new Note("decision", "Chọn Postgres thay MySQL"),
                new Note("durable_fact", "Test chạy bằng ./mvnw test"),
                new Note("open_thread", "Còn lỗi timeout ở /orders"),
                new Note("decision", "Retry tối đa 3 lần"));
            assertEquals(Map.of(
                "summary", List.of("Chọn Postgres thay MySQL", "Còn lỗi timeout ở /orders", "Retry tối đa 3 lần"),
                "claude_md", List.of("Test chạy bằng ./mvnw test")), api.planHandoff(notes));
            assertEquals(Map.of("summary", List.of(), "claude_md", List.of()), api.planHandoff(List.of()));
            expectThrows(IllegalArgumentException.class, () -> api.planHandoff(List.of(new Note("gossip", "x"))));
        });

        return c.summary();
    }
}
