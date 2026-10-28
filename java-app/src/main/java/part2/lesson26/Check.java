package part2.lesson26;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import part2.lesson26.Lesson26Api.StateKind;
import part2.lesson26.Lesson26Api.Turn;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson26Api api = useSolution ? new Lesson26Solution() : new Lesson26();
        Checker c = new Checker();

        c.check("Bài 1: system + tools + lịch sử bị tính lại ở mỗi request", () -> {
            assertEquals(340L, api.totalInputTokens(100, 50, List.of(10, 20)));
            assertEquals(0L, api.totalInputTokens(100, 50, List.of()));
            // Một tool output 5000 token ở lượt đầu bị trả tiền lại ở cả 3 request.
            assertEquals(3L * 1000 + 5000 * 3 + 10 * 2 + 10, api.totalInputTokens(900, 100, List.of(5000, 10, 10)));
        });
        c.check("Bài 2: chỉ prune tool_result lớn và cũ, mọi thứ khác giữ nguyên", () -> {
            List<Turn> window = List.of(
                new Turn("user", "đọc file log", 5),
                new Turn("tool_result", "<cả file log>", 8000),
                new Turn("tool_result", "ok", 3),
                new Turn("assistant", "đã quyết: dùng retry 3 lần", 12),
                new Turn("tool_result", "<kết quả search mới>", 4000),
                new Turn("user", "tiếp tục", 2));
            List<Turn> before = new ArrayList<>(window);
            List<Turn> pruned = api.pruneStaleToolResults(window, 2, 1000);
            assertEquals(List.of(
                new Turn("user", "đọc file log", 5),
                new Turn("tool_result", "[pruned]", 0),
                new Turn("tool_result", "ok", 3),
                new Turn("assistant", "đã quyết: dùng retry 3 lần", 12),
                new Turn("tool_result", "<kết quả search mới>", 4000),
                new Turn("user", "tiếp tục", 2)), pruned);
            assertEquals(before, window);
        });
        c.check("Bài 3: ephemeral trong cửa sổ, durable trên đĩa", () -> {
            assertEquals(StateKind.EPHEMERAL, api.kindOf("live_window"));
            assertEquals(StateKind.EPHEMERAL, api.kindOf("tool_output"));
            assertEquals(StateKind.EPHEMERAL, api.kindOf("chat_message"));
            assertEquals(StateKind.DURABLE, api.kindOf("claude_md"));
            assertEquals(StateKind.DURABLE, api.kindOf("auto_memory"));
            assertEquals(StateKind.DURABLE, api.kindOf("file_on_disk"));
            assertEquals(StateKind.DURABLE, api.kindOf("config"));
            expectThrows(IllegalArgumentException.class, () -> api.kindOf("cloud"));
        });
        c.check("Bài 4: API stateless, gửi lại toàn bộ transcript", () -> {
            List<Map<String, Object>> history = List.of(
                Lesson26Api.turn("user", "Tên tôi là Lan."), Lesson26Api.turn("assistant", "Chào Lan!"));
            assertEquals(List.of(Lesson26Api.turn("user", "Tên tôi là Lan."), Lesson26Api.turn("assistant", "Chào Lan!"),
                Lesson26Api.turn("user", "Tôi tên gì?")), api.nextRequestMessages(history, "Tôi tên gì?"));
            assertEquals(2, history.size());
        });
        c.check("Bài 5: phiên mới = mảng mới, chỉ mang theo tóm tắt", () -> {
            List<Map<String, Object>> old = List.of(Lesson26Api.turn("user", "a"), Lesson26Api.turn("assistant", "b"));
            assertTrue(api.startNewSession(old, null).isEmpty(), "không có tóm tắt thì bắt đầu trống");
            assertTrue(api.startNewSession(old, "  ").isEmpty(), "tóm tắt rỗng cũng như không có");
            assertEquals(List.of(Lesson26Api.turn("user", "Summary of the previous session: dùng Postgres")),
                api.startNewSession(old, "dùng Postgres"));
        });

        return c.summary();
    }
}
