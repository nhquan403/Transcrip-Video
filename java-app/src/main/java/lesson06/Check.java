package lesson06;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.UnaryOperator;
import lesson06.Lesson06Api.AssistantMessage;
import lesson06.Lesson06Api.Model;
import lesson06.Lesson06Api.ModelReply;
import lesson06.Lesson06Api.Options;
import lesson06.Lesson06Api.ResultMessage;
import lesson06.Lesson06Api.SdkMessage;
import lesson06.Lesson06Api.SystemInit;
import lesson06.Lesson06Api.ToolCall;
import lesson06.Lesson06Api.Usage;
import lesson06.Lesson06Api.UserMessage;

public final class Check {
    private Check() {}

    /** Model kịch bản: gọi lần lượt các tool trong `plan`, rồi trả lời bằng kết quả tool cuối. */
    static Model scripted(List<String> plan, List<List<SdkMessage>> seen) {
        return (system, conversation, tools, model) -> {
            seen.add(conversation);
            long done = conversation.stream().filter(m -> m instanceof UserMessage u && u.prompt() == null).count();
            Usage usage = new Usage(100 + 50 * done, 10);
            if (done < plan.size()) {
                return new ModelReply("calling " + plan.get((int) done),
                    List.of(new ToolCall("call_" + done, plan.get((int) done), "x")), usage);
            }
            String last = conversation.get(conversation.size() - 1) instanceof UserMessage u && u.prompt() == null
                ? u.toolResults().get(0).content() : "no tools";
            return new ModelReply("answer: " + last, List.of(), usage);
        };
    }

    public static boolean run(boolean useSolution) {
        Lesson06Api api = useSolution ? new Lesson06Solution() : new Lesson06();
        Checker c = new Checker();
        Map<String, UnaryOperator<String>> tools = Map.of("search", x -> "found", "delete", x -> "deleted");
        Options options = new Options("You are helpful.", Set.of("search"), "test-model", null);

        c.check("Bài 1-2: luồng message đúng thứ tự, kết thúc bằng success", () -> {
            List<SdkMessage> out = new ArrayList<>();
            api.query("hi", options, scripted(List.of("search"), new ArrayList<>()), tools, out::add);
            assertEquals(List.of("SystemInit", "AssistantMessage", "UserMessage", "AssistantMessage", "ResultMessage"),
                out.stream().map(m -> m.getClass().getSimpleName()).toList());
            SystemInit init = (SystemInit) out.get(0);
            assertEquals(List.of("search"), init.tools());
            ResultMessage result = (ResultMessage) out.get(4);
            assertEquals("success", result.subtype());
            assertEquals("answer: found", result.result());
            assertEquals(1, result.numTurns());
            assertEquals(new Usage(250, 20), result.usage());
            assertEquals(init.sessionId(), result.sessionId());
        });

        c.check("Bài 3: tool không được phép trả về lỗi, không chạy", () -> {
            List<SdkMessage> out = new ArrayList<>();
            api.query("hi", options, scripted(List.of("delete"), new ArrayList<>()), tools, out::add);
            UserMessage results = (UserMessage) out.get(2);
            assertTrue(results.toolResults().get(0).isError(), "tool delete phải bị đánh dấu lỗi");
            assertEquals("error: tool delete is not allowed", results.toolResults().get(0).content());
        });

        c.check("Bài 4: chạm maxTurns thì dừng với error_max_turns, không có result text", () -> {
            List<SdkMessage> out = new ArrayList<>();
            api.query("hi", new Options("s", Set.of("search"), "m", 2),
                scripted(List.of("search", "search", "search", "search"), new ArrayList<>()), tools, out::add);
            ResultMessage result = (ResultMessage) out.get(out.size() - 1);
            assertEquals("error_max_turns", result.subtype());
            assertEquals(null, result.result());
            assertEquals(2, result.numTurns());
            assertTrue(result.usage().inputTokens() > 0, "lỗi vẫn phải có usage");
        });

        c.check("Bài 1: mỗi lần gọi là một phiên mới, không nhớ lần trước", () -> {
            List<List<SdkMessage>> seen = new ArrayList<>();
            List<SdkMessage> first = new ArrayList<>();
            List<SdkMessage> second = new ArrayList<>();
            api.query("tên tôi là An", options, scripted(List.of(), seen), tools, first::add);
            api.query("tên tôi là gì?", options, scripted(List.of(), seen), tools, second::add);
            assertEquals(1, seen.get(1).size());
            assertEquals("tên tôi là gì?", ((UserMessage) seen.get(1).get(0)).prompt());
            assertTrue(!((SystemInit) first.get(0)).sessionId().equals(((SystemInit) second.get(0)).sessionId()),
                "hai lần gọi phải có sessionId khác nhau");
        });

        c.check("Bài 5: chỉ đọc result khi success", () -> {
            List<SdkMessage> ok = List.of(new AssistantMessage("a", List.of()),
                new ResultMessage("success", "xong", new Usage(1, 1), 0, "s"));
            assertEquals("xong", api.resultText(ok));
            List<SdkMessage> bad = List.of(new ResultMessage("error_max_turns", null, new Usage(1, 1), 3, "s"));
            var e = expectThrows(IllegalStateException.class, () -> api.resultText(bad));
            assertTrue(e.getMessage().contains("error_max_turns"), "message phải nêu subtype");
        });

        return c.summary();
    }
}
