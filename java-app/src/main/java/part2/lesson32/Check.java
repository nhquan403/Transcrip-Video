package part2.lesson32;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import part2.lesson32.Lesson32Api.Decision;
import part2.lesson32.Lesson32Api.HookEvent;

public final class Check {
    private Check() {}

    static final String SETTINGS = """
        {"permissions": {
          "allow": ["Read", "Bash(npm run test:*)", "Bash(git status)"],
          "deny":  ["Bash(rm -rf:*)", "Bash(npm run test:prod)"],
          "ask":   ["Bash(git push:*)"]
        }}""";

    public static boolean run(boolean useSolution) {
        Lesson32Api api = useSolution ? new Lesson32Solution() : new Lesson32();
        Checker c = new Checker();

        c.check("Bài 1: allow cho việc thường lệ, rule không có () khớp mọi lời gọi", () -> {
            assertEquals(Decision.ALLOW, api.decide(SETTINGS, "Read", "src/App.java"));
            assertEquals(Decision.ALLOW, api.decide(SETTINGS, "Bash", "npm run test"));
            assertEquals(Decision.ALLOW, api.decide(SETTINGS, "Bash", "npm run test -- --watch"));
            assertEquals(Decision.ALLOW, api.decide(SETTINGS, "Bash", "git status"));
        });
        c.check("Bài 1: deny thắng allow, ask cho vùng xám, không khớp thì hỏi", () -> {
            assertEquals(Decision.DENY, api.decide(SETTINGS, "Bash", "rm -rf build"));
            assertEquals(Decision.DENY, api.decide(SETTINGS, "Bash", "npm run test:prod"));
            assertEquals(Decision.ASK, api.decide(SETTINGS, "Bash", "git push origin main"));
            assertEquals(Decision.ASK, api.decide(SETTINGS, "Bash", "git status --short"));
            assertEquals(Decision.ASK, api.decide(SETTINGS, "Bash", "npm run testing"));
            assertEquals(Decision.ASK, api.decide("{}", "Write", "a.txt"));
        });
        c.check("Bài 2: chọn đúng thời điểm cho hook", () -> {
            assertEquals(HookEvent.PRE_TOOL_USE, api.eventFor("block a risky command"));
            assertEquals(HookEvent.POST_TOOL_USE, api.eventFor("log a tool result"));
            assertEquals(HookEvent.NOTIFICATION, api.eventFor("react when Claude messages you"));
            assertEquals(HookEvent.STOP, api.eventFor("run checks when a response completes"));
            assertEquals(HookEvent.SESSION_START, api.eventFor("set up a new session"));
        });
        c.check("Bài 2: chỉ PreToolUse còn kịp chặn; PostToolUse thì việc đã chạy rồi", () -> {
            assertTrue(api.canBlockToolCall(HookEvent.PRE_TOOL_USE), "PreToolUse chặn được");
            assertTrue(!api.canBlockToolCall(HookEvent.POST_TOOL_USE), "PostToolUse không chặn được");
            assertTrue(!api.canBlockToolCall(HookEvent.SESSION_START), "SessionStart không gắn với tool call");
        });
        c.check("Bài 3: permissionDecision allow / deny / ask / defer", () -> {
            String tpl = "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"%s\"}}";
            assertEquals(Decision.ALLOW, api.applyHookDecision(tpl.formatted("allow"), Decision.DENY));
            assertEquals(Decision.DENY, api.applyHookDecision(tpl.formatted("deny"), Decision.ALLOW));
            assertEquals(Decision.ASK, api.applyHookDecision(tpl.formatted("ask"), Decision.ALLOW));
            assertEquals(Decision.DENY, api.applyHookDecision(tpl.formatted("defer"), Decision.DENY));
            assertEquals(Decision.ASK, api.applyHookDecision(tpl.formatted("defer"), Decision.ASK));
            expectThrows(IllegalArgumentException.class, () -> api.applyHookDecision(tpl.formatted("maybe"), Decision.ASK));
        });
        c.check("Bài 3: object rỗng giữ nguyên lời gọi, cư xử như allow", () ->
            assertEquals(Decision.ALLOW, api.applyHookDecision("{}", Decision.ASK)));
        c.check("Bài 4: config được thực thi vào settings.json, văn xuôi vào CLAUDE.md", () -> {
            assertEquals("settings.json", api.belongsIn("permission rule"));
            assertEquals("settings.json", api.belongsIn("hook"));
            assertEquals("settings.json", api.belongsIn("environment variable"));
            assertEquals("settings.json", api.belongsIn("default model"));
            assertEquals("CLAUDE.md", api.belongsIn("coding convention"));
            assertEquals("CLAUDE.md", api.belongsIn("architecture notes"));
        });
        c.check("Bài 5: permissions/hooks/env có hiệu lực ngay; model/outputStyle cần restart", () -> {
            assertTrue(api.takesEffectLive("permissions") && api.takesEffectLive("hooks") && api.takesEffectLive("env"), "live");
            assertTrue(!api.takesEffectLive("model"), "model cần restart");
            assertTrue(!api.takesEffectLive("outputStyle"), "outputStyle cần restart");
        });

        return c.summary();
    }
}
