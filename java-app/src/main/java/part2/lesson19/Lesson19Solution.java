package part2.lesson19;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;

/** Lời giải mẫu Phần 2 · Bài 19. Hãy tự làm trong Lesson19 trước khi đọc file này. */
public class Lesson19Solution implements Lesson19Api {

    @Override
    public String gitBlobId(String content) {
        byte[] body = content.getBytes(StandardCharsets.UTF_8);
        byte[] header = ("blob " + body.length + "\0").getBytes(StandardCharsets.UTF_8);
        try {
            MessageDigest sha1 = MessageDigest.getInstance("SHA-1");
            sha1.update(header);
            sha1.update(body);
            return HexFormat.of().formatHex(sha1.digest());
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    @Override
    public Integrate integrate(boolean branchIsShared) {
        return branchIsShared ? Integrate.MERGE : Integrate.REBASE;
    }

    @Override
    public List<String> diff(String before, String after) {
        List<String> a = before.lines().toList();
        List<String> b = after.lines().toList();
        int[][] lcs = new int[a.size() + 1][b.size() + 1];
        for (int i = a.size() - 1; i >= 0; i--) {
            for (int j = b.size() - 1; j >= 0; j--) {
                lcs[i][j] = a.get(i).equals(b.get(j)) ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
            }
        }
        List<String> out = new ArrayList<>();
        int i = 0;
        int j = 0;
        while (i < a.size() || j < b.size()) {
            if (i < a.size() && j < b.size() && a.get(i).equals(b.get(j))) {
                out.add("  " + a.get(i++));
                j++;
            } else if (i < a.size() && (j == b.size() || lcs[i + 1][j] >= lcs[i][j + 1])) {
                out.add("- " + a.get(i++));
            } else {
                out.add("+ " + b.get(j++));
            }
        }
        return out;
    }

    @Override
    public boolean needsReview(String path) {
        String p = path.replace('\\', '/');
        String name = p.substring(p.lastIndexOf('/') + 1);
        return name.endsWith(".java") || name.endsWith(".py") || name.endsWith(".ts")
            || p.startsWith("prompts/") || p.contains("/prompts/")
            || p.startsWith("schemas/") || p.contains("/schemas/") || name.endsWith(".schema.json")
            || name.equals("CLAUDE.md") || p.endsWith(".claude/settings.json");
    }
}
