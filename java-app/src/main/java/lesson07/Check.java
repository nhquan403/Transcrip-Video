package lesson07;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.UnaryOperator;
import lesson06.Lesson06Api.AssistantMessage;
import lesson06.Lesson06Api.Model;
import lesson06.Lesson06Api.ModelReply;
import lesson06.Lesson06Api.SdkMessage;
import lesson06.Lesson06Api.SystemInit;
import lesson06.Lesson06Api.ToolCall;
import lesson06.Lesson06Api.ToolResult;
import lesson06.Lesson06Api.Usage;
import lesson06.Lesson06Api.UserMessage;
import lesson07.Lesson07Api.Limits;
import lesson07.Lesson07Api.Pricing;
import lesson07.Lesson07Api.RunResult;

public final class Check {
    private Check() {}

    /** Mỗi lần gọi tốn 1.000 token vào và 100 token ra; gọi tool `toolCalls` lần rồi mới trả lời. */
    static Model model(int toolCalls) {
        return (system, conversation, tools, name) -> {
            long done = conversation.stream().filter(m -> m instanceof UserMessage u && u.prompt() == null).count();
            Usage usage = new Usage(1000, 100);
            return done < toolCalls
                ? new ModelReply("", List.of(new ToolCall("t" + done, "step", "x")), usage)
                : new ModelReply("final answer", List.of(), usage);
        };
    }

    public static boolean run(boolean useSolution) {
        Lesson07Api api = useSolution ? new Lesson07Solution() : new Lesson07();
        Checker c = new Checker();
        Pricing pricing = new Pricing(4.00, 20.00);
        Map<String, UnaryOperator<String>> tools = Map.of("step", x -> "ok");

        c.check("Bài 1: tính chi phí theo giá mỗi triệu token", () -> {
            assertEquals(0.006, Math.round(api.costUsd(new Usage(1000, 100), pricing) * 1e6) / 1e6);
            assertEquals(0.0, api.costUsd(new Usage(0, 0), pricing));
        });

        c.check("Bài 2: mỗi lần trả kết quả tool là một lượt", () -> {
            List<SdkMessage> messages = List.of(
                new SystemInit("s", "m", List.of(), ""),
                new AssistantMessage("", List.of(new ToolCall("a", "x", ""))),
                new UserMessage(null, List.of(new ToolResult("a", "ok", false))),
                new AssistantMessage("", List.of(new ToolCall("b", "x", ""))),
                new UserMessage(null, List.of(new ToolResult("b", "ok", false))),
                new AssistantMessage("done", List.of()));
            assertEquals(2, api.countTurns(messages));
        });

        c.check("Bài 3: không giới hạn thì chạy tới khi có câu trả lời không kèm tool", () -> {
            RunResult r = api.run("p", "s", model(5), tools, new Limits(null, null), pricing, m -> {});
            assertEquals("success", r.subtype());
            assertEquals("final answer", r.result());
            assertEquals(5, r.numTurns());
        });
        c.check("Bài 3: chạm maxTurns", () -> {
            List<SdkMessage> out = new ArrayList<>();
            RunResult r = api.run("p", "s", model(5), tools, new Limits(2, null), pricing, out::add);
            assertEquals("error_max_turns", r.subtype());
            assertEquals(null, r.result());
            assertEquals(2, r.numTurns());
            assertEquals(2, new Lesson07Solution().countTurns(out));
            assertTrue(r.totalCostUsd() > 0, "lỗi vẫn phải báo chi phí");
        });
        c.check("Bài 3: ngân sách kiểm tra giữa các lần gọi, có thể vượt tối đa một lần gọi", () -> {
            RunResult r = api.run("p", "s", model(5), tools, new Limits(null, 0.010), pricing, m -> {});
            assertEquals("error_max_budget_usd", r.subtype());
            assertEquals(0.012, Math.round(r.totalCostUsd() * 1e6) / 1e6);
            assertEquals(2, r.numTurns());
        });

        RunResult ok = new RunResult("success", "xong", new Usage(10, 1), 0.0012, 2, "abc");
        RunResult capped = new RunResult("error_max_turns", null, new Usage(10, 1), 0.004, 3, "abc");
        RunResult broke = new RunResult("error_max_budget_usd", null, new Usage(10, 1), 0.0016, 1, "abc");
        c.check("Bài 4: chỉ đọc text khi success, lỗi thì báo cả tiền đã tiêu", () -> {
            assertEquals("xong", api.readResult(ok));
            var e = expectThrows(IllegalStateException.class, () -> api.readResult(broke));
            assertTrue(e.getMessage().contains("error_max_budget_usd") && e.getMessage().contains("$0.0016"),
                "message phải nêu subtype và chi phí: " + e.getMessage());
        });

        c.check("Bài 5: dòng chẩn đoán", () -> {
            assertEquals("done after 2 turns, cost $0.0012, session abc", api.describeStop(ok));
            assertEquals("hit max turns after 3 turns, cost $0.0040, session abc", api.describeStop(capped));
            assertEquals("hit max budget after 1 turns, cost $0.0016, session abc", api.describeStop(broke));
        });

        return c.summary();
    }
}
