package part2.lesson15;

import java.util.Set;

/** Lời giải mẫu Phần 2 · Bài 15. Hãy tự làm trong Lesson15 trước khi đọc file này. */
public class Lesson15Solution implements Lesson15Api {

    private static final Set<String> SAFE = Set.of("GET", "HEAD", "OPTIONS");

    @Override
    public boolean isSafe(String method) {
        return SAFE.contains(method.toUpperCase());
    }

    @Override
    public boolean isIdempotent(String method) {
        String m = method.toUpperCase();
        return isSafe(m) || m.equals("PUT") || m.equals("DELETE");
    }

    @Override
    public Family family(int status) {
        return switch (status / 100) {
            case 2 -> Family.SUCCESS;
            case 3 -> Family.REDIRECT;
            case 4 -> Family.CLIENT_ERROR;
            case 5 -> Family.SERVER_ERROR;
            default -> throw new IllegalArgumentException("status lạ: " + status);
        };
    }

    @Override
    public Action triage(int status) {
        if (family(status) == Family.SUCCESS) return Action.PARSE_BODY;
        if (status == 401) return Action.FIX_API_KEY;
        if (status == 403) return Action.CHECK_PERMISSIONS;
        if (status == 429 || family(status) == Family.SERVER_ERROR) return Action.BACK_OFF_AND_RETRY;
        return Action.FIX_REQUEST_BODY;
    }

    @Override
    public boolean safeToResendAfterTimeout(String method) {
        return isIdempotent(method);
    }
}
