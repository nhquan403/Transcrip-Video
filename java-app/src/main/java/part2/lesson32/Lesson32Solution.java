package part2.lesson32;

import com.fasterxml.jackson.databind.JsonNode;
import common.RawApi;

/** Lời giải mẫu Phần 2 · Bài 32. Hãy tự làm trong Lesson32 trước khi đọc file này. */
public class Lesson32Solution implements Lesson32Api {

    @Override
    public Decision decide(String settingsJson, String tool, String argument) {
        JsonNode permissions = parse(settingsJson).path("permissions");
        if (anyMatches(permissions.path("deny"), tool, argument)) return Decision.DENY;
        if (anyMatches(permissions.path("ask"), tool, argument)) return Decision.ASK;
        if (anyMatches(permissions.path("allow"), tool, argument)) return Decision.ALLOW;
        return Decision.ASK;
    }

    private static boolean anyMatches(JsonNode rules, String tool, String argument) {
        for (JsonNode rule : rules) {
            if (matches(rule.asText(), tool, argument)) return true;
        }
        return false;
    }

    static boolean matches(String rule, String tool, String argument) {
        int open = rule.indexOf('(');
        if (open < 0) return rule.equals(tool);
        if (!rule.substring(0, open).equals(tool) || !rule.endsWith(")")) return false;
        String pattern = rule.substring(open + 1, rule.length() - 1);
        String arg = argument == null ? "" : argument;
        if (pattern.endsWith(":*")) {
            String prefix = pattern.substring(0, pattern.length() - 2);
            return arg.equals(prefix) || arg.startsWith(prefix + " ");
        }
        return arg.equals(pattern);
    }

    @Override
    public HookEvent eventFor(String goal) {
        return switch (goal) {
            case "block a risky command" -> HookEvent.PRE_TOOL_USE;
            case "log a tool result" -> HookEvent.POST_TOOL_USE;
            case "react when Claude messages you" -> HookEvent.NOTIFICATION;
            case "run checks when a response completes" -> HookEvent.STOP;
            case "set up a new session" -> HookEvent.SESSION_START;
            default -> throw new IllegalArgumentException("mục tiêu lạ: " + goal);
        };
    }

    @Override
    public boolean canBlockToolCall(HookEvent event) {
        return event == HookEvent.PRE_TOOL_USE;
    }

    @Override
    public Decision applyHookDecision(String hookOutputJson, Decision normalDecision) {
        JsonNode decision = parse(hookOutputJson).path("hookSpecificOutput").path("permissionDecision");
        if (decision.isMissingNode()) return Decision.ALLOW;
        return switch (decision.asText()) {
            case "allow" -> Decision.ALLOW;
            case "deny" -> Decision.DENY;
            case "ask" -> Decision.ASK;
            case "defer" -> normalDecision;
            default -> throw new IllegalArgumentException("permissionDecision lạ: " + decision.asText());
        };
    }

    @Override
    public String belongsIn(String change) {
        return switch (change) {
            case "permission rule", "hook", "environment variable", "default model", "effort level" -> "settings.json";
            case "coding convention", "architecture notes", "review checklist" -> "CLAUDE.md";
            default -> throw new IllegalArgumentException("thay đổi lạ: " + change);
        };
    }

    @Override
    public boolean takesEffectLive(String key) {
        return switch (key) {
            case "permissions", "hooks", "env" -> true;
            case "model", "outputStyle" -> false;
            default -> throw new IllegalArgumentException("key lạ: " + key);
        };
    }

    private static JsonNode parse(String json) {
        try {
            return RawApi.JSON.readTree(json);
        } catch (Exception e) {
            throw new IllegalArgumentException("JSON không hợp lệ: " + json, e);
        }
    }
}
