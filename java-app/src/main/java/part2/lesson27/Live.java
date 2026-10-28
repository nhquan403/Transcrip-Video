package part2.lesson27;

import common.Claude;
import common.LiveSection;
import java.util.List;
import java.util.Map;
import part2.lesson27.Lesson27Api.Note;

/**
 * Phần 2 · Bài 27 chạy với Claude thật: handoff sạch. Bạn lọc ghi chú trước khi reset, rồi mở một "phiên mới"
 * chỉ với bản tóm tắt + phần CLAUDE.md, bỏ lại toàn bộ hội thoại thô, và hỏi Claude bước tiếp theo.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-27 --live"
 */
public final class Live {
    private Live() {}

    static final List<Note> NOTES = List.of(
        new Note("raw_chatter", "hmm, thử lại xem"),
        new Note("decision", "Use PostgreSQL instead of MySQL"),
        new Note("durable_fact", "Run tests with ./mvnw test"),
        new Note("open_thread", "The /orders endpoint still times out under load"),
        new Note("raw_chatter", "<300 dòng log đã đọc>"));

    public static void run(boolean useSolution, Claude claude) {
        Lesson27Api api = useSolution ? new Lesson27Solution() : new Lesson27();

        LiveSection.run("Phiên mới được \"re-ground\" chỉ từ handoff", () -> {
            Map<String, List<String>> handoff = api.planHandoff(NOTES);
            System.out.println("  Cách reset cho phiên đã trôi xa: "
                + api.chooseMove(new Lesson27Api.Situation(true, false, false, true)));
            System.out.println("  summary: " + handoff.get("summary"));
            System.out.println("  CLAUDE.md thêm: " + handoff.get("claude_md"));
            String prompt = "Project CLAUDE.md:\n- " + String.join("\n- ", handoff.get("claude_md"))
                + "\n\nHandoff summary from the previous session:\n- " + String.join("\n- ", handoff.get("summary"))
                + "\n\nIn two short sentences in Vietnamese: what did we decide, and what is the next step?";
            System.out.println("  💬 " + claude.ask("You are a concise coding assistant.", prompt).replace("\n", " "));
        });
    }
}
