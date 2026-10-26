package part1.lesson09;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.UnaryOperator;
import part1.lesson09.Lesson09Api.Api;
import part1.lesson09.Lesson09Api.AssistantBlocks;
import part1.lesson09.Lesson09Api.Msg;
import part1.lesson09.Lesson09Api.Response;
import part1.lesson09.Lesson09Api.ServerToolResult;
import part1.lesson09.Lesson09Api.ServerToolUse;
import part1.lesson09.Lesson09Api.Text;
import part1.lesson09.Lesson09Api.ToolResult;
import part1.lesson09.Lesson09Api.ToolUse;
import part1.lesson09.Lesson09Api.UserText;
import part1.lesson09.Lesson09Api.UserToolResults;

public final class Check {
    private Check() {}

    /**
     * API giả lập chặt chẽ như API thật: lượt user sau một tool_use phải có tool_result khớp đúng id,
     * nếu không thì "lỗi 400". Trả lời theo kịch bản `script`.
     */
    public static Api strictApi(List<Response> script, List<List<Msg>> seen) {
        return messages -> {
            seen.add(messages);
            for (int i = 0; i + 1 < messages.size(); i++) {
                if (messages.get(i) instanceof AssistantBlocks a && a.content().stream().anyMatch(b -> b instanceof ToolUse)) {
                    if (!(messages.get(i + 1) instanceof UserToolResults r) || !new Lesson09Solution().handshakeOk(a, r)) {
                        throw new IllegalStateException("400: tool_use ids were found without tool_result blocks");
                    }
                }
            }
            int call = seen.size() - 1;
            if (call >= script.size()) throw new IllegalStateException("API được gọi quá số lần kịch bản");
            return script.get(call);
        };
    }

    public static boolean run(boolean useSolution) {
        Lesson09Api api = useSolution ? new Lesson09Solution() : new Lesson09();
        Checker c = new Checker();
        Map<String, UnaryOperator<String>> tools = Map.of(
            "weather", city -> "30C in " + city,
            "broken", x -> { throw new IllegalStateException("disk full"); });

        Response mixed = new Response("tool_use", List.of(
            new Text("Let me check."),
            new ServerToolUse("srv_1", "web_search", "news"),
            new ServerToolResult("srv_1", "3 results"),
            new ToolUse("tu_1", "weather", "Hanoi"),
            new ToolUse("tu_2", "weather", "Hue")));

        c.check("Bài 1: chỉ lấy client tool, bỏ qua server tool", () ->
            assertEquals(List.of(new ToolUse("tu_1", "weather", "Hanoi"), new ToolUse("tu_2", "weather", "Hue")),
                api.clientToolUses(mixed)));

        c.check("Bài 2: tool_result khớp id, lỗi được gói lại thay vì làm sập vòng lặp", () ->
            assertEquals(List.of(
                    new ToolResult("a", "30C in Hanoi", false),
                    new ToolResult("b", "error: unknown tool fly", true),
                    new ToolResult("c", "error: disk full", true)),
                api.runTools(List.of(new ToolUse("a", "weather", "Hanoi"), new ToolUse("b", "fly", "x"),
                    new ToolUse("c", "broken", "x")), tools)));

        c.check("Bài 3: phát hiện tool_result thiếu hoặc sai id", () -> {
            AssistantBlocks assistant = new AssistantBlocks(mixed.content());
            assertTrue(api.handshakeOk(assistant, new UserToolResults(List.of(
                new ToolResult("tu_2", "x", false), new ToolResult("tu_1", "y", false)))), "đủ hai id thì hợp lệ");
            assertTrue(!api.handshakeOk(assistant, new UserToolResults(List.of(new ToolResult("tu_1", "y", false)))),
                "thiếu tu_2 phải báo sai");
            assertTrue(!api.handshakeOk(assistant, new UserToolResults(List.of(
                new ToolResult("tu_1", "y", false), new ToolResult("tu_9", "z", false)))), "sai id phải báo sai");
        });

        c.check("Bài 4: vòng lặp chạy tool rồi gọi lại tới end_turn", () -> {
            List<List<Msg>> seen = new ArrayList<>();
            String answer = api.runLoop("Thời tiết?", strictApi(List.of(mixed,
                new Response("end_turn", List.of(new Text("Hà Nội 30C,"), new Text("Huế 30C.")))), seen), tools, 5);
            assertEquals("Hà Nội 30C,\nHuế 30C.", answer);
            assertEquals(List.of(new UserText("Thời tiết?")), seen.get(0));
            assertEquals(3, seen.get(1).size());
        });
        c.check("Bài 4: stop reason lạ thì dừng rõ ràng", () -> {
            var e = expectThrows(IllegalStateException.class, () -> api.runLoop("x",
                strictApi(List.of(new Response("max_tokens", List.of(new Text("cut")))), new ArrayList<>()), tools, 5));
            assertTrue(e.getMessage().contains("max_tokens"), "message phải nêu stop reason");
        });
        c.check("Bài 4: không lặp vô hạn", () -> {
            List<Response> forever = new ArrayList<>();
            for (int i = 0; i < 10; i++) forever.add(new Response("tool_use", List.of(new ToolUse("t" + i, "weather", "x"))));
            expectThrows(IllegalStateException.class, () -> api.runLoop("x", strictApi(forever, new ArrayList<>()), tools, 3));
        });

        return c.summary();
    }
}
