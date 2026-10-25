package lesson11;

import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import java.util.function.UnaryOperator;
import java.util.regex.Pattern;

/** Lời giải mẫu bài 11. Hãy tự làm {@link Lesson11} trước khi xem. */
public class Lesson11Solution implements Lesson11Api {

    private static final Pattern ROOT_DELETE = Pattern.compile("\\brm\\s+-(rf|fr)\\s+(/|~|/\\*)(\\s|$)");
    private static final Pattern DROP_PROD = Pattern.compile("drop\\s+table\\s+prod", Pattern.CASE_INSENSITIVE);
    private static final Pattern DROP_ANY = Pattern.compile("drop\\s+table", Pattern.CASE_INSENSITIVE);
    private static final Pattern FORCE_PUSH = Pattern.compile("git\\s+push\\b.*\\s(--force|-f)(\\s|$)");

    @Override
    public boolean matches(String matcher, String toolName) {
        return matcher == null || matcher.isEmpty() || toolName.matches(matcher);
    }

    @Override
    public Decision shellGuard(ToolCall call) {
        String input = call.input();
        if (ROOT_DELETE.matcher(input).find() || DROP_PROD.matcher(input).find()) return Decision.DENY;
        if (FORCE_PUSH.matcher(input).find() || DROP_ANY.matcher(input).find()) return Decision.ASK;
        return Decision.ALLOW;
    }

    @Override
    public Decision decide(List<Hook> hooks, ToolCall call) {
        Decision result = Decision.ALLOW;
        for (Hook hook : hooks) {
            if (hook.event() != Event.PRE_TOOL_USE || !matches(hook.matcher(), call.tool())) continue;
            Decision d = hook.callback().apply(call);
            if (d == Decision.DENY) return Decision.DENY;
            if (d == Decision.ASK) result = Decision.ASK;
        }
        return result;
    }

    @Override
    public String execute(ToolCall call, List<Hook> hooks, Map<String, UnaryOperator<String>> tools,
                          Predicate<ToolCall> humanApproves, List<String> audit) {
        String entry = call.tool() + ": " + call.input();
        Decision decision = decide(hooks, call);
        if (decision == Decision.DENY) {
            audit.add("denied " + entry);
            return "error: blocked by hook";
        }
        if (decision == Decision.ASK && !humanApproves.test(call)) {
            audit.add("rejected " + entry);
            return "error: rejected by human";
        }
        String output = tools.get(call.tool()).apply(call.input());
        audit.add("ran " + entry);
        for (Hook hook : hooks) {
            if (hook.event() == Event.POST_TOOL_USE && matches(hook.matcher(), call.tool())) hook.callback().apply(call);
        }
        return output;
    }
}
