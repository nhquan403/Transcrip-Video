package lesson11;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;

import common.Checker;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.UnaryOperator;
import lesson11.Lesson11Api.Decision;
import lesson11.Lesson11Api.Event;
import lesson11.Lesson11Api.Hook;
import lesson11.Lesson11Api.ToolCall;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson11Api api = useSolution ? new Lesson11Solution() : new Lesson11();
        Checker c = new Checker();

        c.check("Bài 1: matcher rỗng khớp tất cả, tên chính xác, và cả họ tool", () -> {
            assertTrue(api.matches(null, "Bash") && api.matches("", "Write"), "matcher rỗng phải khớp mọi tool");
            assertTrue(api.matches("Bash", "Bash"), "tên chính xác phải khớp");
            assertTrue(!api.matches("Bash", "BashOutput"), "phải khớp toàn bộ tên, không chỉ phần đầu");
            assertTrue(api.matches("Write|Edit", "Edit"), "regex nhiều tên");
            assertTrue(api.matches("mcp__github__.*", "mcp__github__create_issue"), "cả họ tool");
        });

        c.check("Bài 2: DENY xóa đệ quy ở gốc và drop bảng production", () -> {
            for (String cmd : List.of("rm -rf /", "sudo rm  -fr /", "rm -rf ~", "rm -rf /*", "psql -c 'DROP TABLE prod_orders'")) {
                assertEquals(Decision.DENY, api.shellGuard(new ToolCall("Bash", cmd)));
            }
        });
        c.check("Bài 2: ASK cho force push và drop bảng thường; ALLOW cho lệnh an toàn", () -> {
            assertEquals(Decision.ASK, api.shellGuard(new ToolCall("Bash", "git push origin main --force")));
            assertEquals(Decision.ASK, api.shellGuard(new ToolCall("Bash", "git push -f")));
            assertEquals(Decision.ASK, api.shellGuard(new ToolCall("Bash", "drop table orders_backup")));
            assertEquals(Decision.ALLOW, api.shellGuard(new ToolCall("Bash", "rm -rf ./build")));
            assertEquals(Decision.ALLOW, api.shellGuard(new ToolCall("Bash", "ls -la /")));
            assertEquals(Decision.ALLOW, api.shellGuard(new ToolCall("Bash", "git push origin feature")));
        });

        List<Hook> hooks = new ArrayList<>(List.of(
            new Hook(Event.PRE_TOOL_USE, "Bash", api::shellGuard),
            new Hook(Event.PRE_TOOL_USE, "Write", call -> call.input().contains(".env") ? Decision.DENY : Decision.ALLOW),
            new Hook(Event.PRE_TOOL_USE, null, call -> call.input().contains("prod") ? Decision.ASK : Decision.ALLOW)));

        c.check("Bài 3: DENY thắng, rồi tới ASK, còn lại ALLOW; chỉ hook khớp mới chạy", () -> {
            assertEquals(Decision.DENY, api.decide(hooks, new ToolCall("Bash", "rm -rf / # prod")));
            assertEquals(Decision.ASK, api.decide(hooks, new ToolCall("Read", "prod/config.yaml")));
            assertEquals(Decision.ALLOW, api.decide(hooks, new ToolCall("Read", ".env")));
            assertEquals(Decision.DENY, api.decide(hooks, new ToolCall("Write", ".env")));
        });
        c.check("Bài 3: hook POST_TOOL_USE không thể chặn", () -> {
            List<Hook> lateOnly = List.of(new Hook(Event.POST_TOOL_USE, "Bash", api::shellGuard));
            assertEquals(Decision.ALLOW, api.decide(lateOnly, new ToolCall("Bash", "rm -rf /")));
        });

        c.check("Bài 4: lệnh bị DENY không bao giờ chạy, nhật ký vẫn ghi", () -> {
            List<String> ran = new ArrayList<>();
            List<String> audit = new ArrayList<>();
            Map<String, UnaryOperator<String>> tools = Map.of("Bash", cmd -> { ran.add(cmd); return "ok"; });
            List<String> postSeen = new ArrayList<>();
            List<Hook> withPost = new ArrayList<>(hooks);
            withPost.add(new Hook(Event.POST_TOOL_USE, "Bash", call -> { postSeen.add(call.input()); return Decision.ALLOW; }));

            assertEquals("error: blocked by hook", api.execute(new ToolCall("Bash", "rm -rf /"), withPost, tools, call -> true, audit));
            assertEquals("error: rejected by human", api.execute(new ToolCall("Bash", "git push -f"), withPost, tools, call -> false, audit));
            assertEquals("ok", api.execute(new ToolCall("Bash", "git push --force"), withPost, tools, call -> true, audit));
            assertEquals("ok", api.execute(new ToolCall("Bash", "ls"), withPost, tools, call -> true, audit));
            assertEquals(List.of("git push --force", "ls"), ran);
            assertEquals(List.of("git push --force", "ls"), postSeen);
            assertEquals(List.of("denied Bash: rm -rf /", "rejected Bash: git push -f",
                "ran Bash: git push --force", "ran Bash: ls"), audit);
        });

        return c.summary();
    }
}
