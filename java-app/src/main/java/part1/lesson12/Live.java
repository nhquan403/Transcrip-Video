package part1.lesson12;

import common.Claude;
import common.LiveSection;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.UnaryOperator;
import java.util.stream.Collectors;
import part1.lesson09.ClaudeApi;
import part1.lesson09.Lesson09Api.AssistantBlocks;
import part1.lesson09.Lesson09Api.Msg;
import part1.lesson09.Lesson09Api.Response;
import part1.lesson09.Lesson09Api.Text;
import part1.lesson09.Lesson09Api.ToolResult;
import part1.lesson09.Lesson09Api.ToolUse;
import part1.lesson09.Lesson09Api.UserText;
import part1.lesson09.Lesson09Api.UserToolResults;

/**
 * Bài 12 chạy với Claude thật: Claude có thể yêu cầu nhiều tool cùng lúc; planBatches() và executeBatches()
 * của bạn quyết định cái nào chạy song song. Mỗi tool giả lập độ trễ 500ms để thấy rõ thời gian tiết kiệm.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p1-12 --live"
 */
public final class Live {
    private Live() {}

    private static final Map<String, String> FILES = Map.of(
        "lesson05.md", "Subagents start fresh; only the final message returns.",
        "lesson11.md", "Guardrails belong in PreToolUse hooks, not in prompt text.",
        "lesson12.md", "Read-only tools can run in parallel; state-modifying tools run one at a time.");

    public static void run(boolean useSolution, Claude claude) {
        Lesson12Api api = useSolution ? new Lesson12Solution() : new Lesson12();
        Set<String> readOnly = Set.of("read_file");
        List<String> notes = new ArrayList<>();
        Map<String, UnaryOperator<String>> tools = Map.of(
            "read_file", name -> slow(() -> FILES.getOrDefault(name.trim(), "error: no file " + name)),
            "append_note", note -> slow(() -> {
                notes.add(note);
                return "saved note #" + notes.size();
            }));

        LiveSection.run("Tool chỉ đọc chạy song song, tool ghi chạy tuần tự", () -> {
            api.executeBatches(api.planBatches(List.of(), readOnly), tools); // chưa làm bài 1-2 thì chưa gọi API
            ClaudeApi claudeApi = new ClaudeApi(claude,
                "You are a study assistant. Read all needed files at once by calling read_file several times in one turn, "
                    + "then save one Vietnamese summary sentence per file with append_note. Finally answer in Vietnamese.",
                Map.of("read_file", "Read a course file. Input: the file name, e.g. 'lesson05.md'. Read-only.",
                    "append_note", "Append one note to the study notebook. Input: the note text. Modifies state."));
            List<Msg> messages = new ArrayList<>(List.of(new UserText(
                "Đọc lesson05.md, lesson11.md, lesson12.md rồi ghi mỗi file một câu tóm tắt vào sổ.")));
            for (int i = 0; i < 6; i++) {
                Response response = claudeApi.call(List.copyOf(messages));
                messages.add(new AssistantBlocks(response.content()));
                List<ToolUse> uses = response.content().stream()
                    .filter(b -> b instanceof ToolUse).map(b -> (ToolUse) b).toList();
                if (uses.isEmpty()) {
                    System.out.println("  → " + response.content().stream().filter(b -> b instanceof Text)
                        .map(b -> ((Text) b).text()).collect(Collectors.joining(" ")));
                    break;
                }
                List<List<ToolUse>> batches = api.planBatches(uses, readOnly);
                System.out.println("  Lượt " + (i + 1) + ": " + uses.size() + " tool call → các đợt "
                    + batches.stream().map(b -> b.stream().map(ToolUse::name).toList()).toList());
                long start = System.nanoTime();
                Map<String, String> results = api.executeBatches(batches, tools);
                long ms = (System.nanoTime() - start) / 1_000_000;
                System.out.println("    mất " + ms + " ms (nếu chạy tuần tự: ~" + uses.size() * 500 + " ms)");
                messages.add(new UserToolResults(uses.stream()
                    .map(u -> new ToolResult(u.id(), results.get(u.id()), false)).toList()));
            }
            System.out.println("  📓 Sổ ghi chép: " + notes);
            System.out.println("  wallClockMs() cho đợt [500,500,500] rồi [500]: "
                + api.wallClockMs(List.of(List.of(500L, 500L, 500L), List.of(500L))) + " ms");
        });

        LiveSection.run("Hai worker không thấy nhau: manager mang kết quả sang", () -> {
            api.carryAcross("", ""); // chưa làm bài 4 thì chưa gọi API
            String found = claude.ask("You are worker 1. Reply with one short English sentence.",
                "In one sentence: what is the main reason to use subagents according to the course?");
            System.out.println("  Worker 1: " + found);
            String task = api.carryAcross(found, "Viết một câu hỏi trắc nghiệm tiếng Việt (4 lựa chọn) dựa trên kết quả dưới đây.");
            System.out.println("  Worker 2:\n" + claude.ask("You are worker 2. Answer in Vietnamese.", task));
        });
    }

    private static String slow(java.util.function.Supplier<String> work) {
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return work.get();
    }
}
