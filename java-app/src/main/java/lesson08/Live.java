package lesson08;

import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageParam;
import common.Claude;
import common.LiveSection;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import lesson08.Lesson08Api.Turn;
import lesson08.Lesson08Api.Workload;

/**
 * Bài 08 chạy với Claude thật: so sánh single message, streaming input, resume, và xem streaming output trực tiếp.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="08 --live"
 */
public final class Live {
    private Live() {}

    private static final String SYSTEM = "You are a friendly tutor. Answer in Vietnamese in one short sentence.";

    public static void run(boolean useSolution, Claude claude) {
        Lesson08Api api = useSolution ? new Lesson08Solution() : new Lesson08();

        LiveSection.run("Chọn chế độ nhập", () -> {
            System.out.println("  Chatbot có ảnh:            " + api.chooseMode(new Workload(true, true, true, false, false)));
            System.out.println("  Hàm serverless dịch 1 câu: " + api.chooseMode(new Workload(false, false, false, false, true)));
            System.out.println("  Chưa rõ:                   " + api.chooseMode(new Workload(false, false, false, false, false)));
        });

        List<Turn> firstRun = new ArrayList<>();
        LiveSection.run("Single message: hai lần gọi độc lập", () -> {
            ClaudeChatModel model = new ClaudeChatModel(claude);
            String first = api.singleMessage("Tên tôi là An, tôi đang học về agent.", model);
            System.out.println("  Lần 1 → " + first);
            firstRun.addAll(List.of(new Turn("user", "Tên tôi là An, tôi đang học về agent."), new Turn("assistant", first)));
            System.out.println("  Lần 2 → " + api.singleMessage("Tên tôi là gì?", model));
        });

        LiveSection.run("Streaming input: một phiên sống lâu, tin nhắn được đưa vào dần", () -> {
            Iterator<String> inputs = List.of("Tên tôi là An, tôi đang học về agent.", "Tên tôi là gì?",
                "Tôi đang học chủ đề gì?").iterator();
            Iterator<String> logged = new Iterator<>() {
                public boolean hasNext() { return inputs.hasNext(); }
                public String next() {
                    String message = inputs.next();
                    System.out.println("  📨 gửi: " + message);
                    return message;
                }
            };
            api.streamingSession(logged, new ClaudeChatModel(claude)).forEach(r -> System.out.println("  → " + r));
        });

        LiveSection.run("Resume: single message nhưng chủ động nối lại phiên cũ", () -> {
            if (firstRun.isEmpty()) throw new UnsupportedOperationException("cần làm bài 2 (singleMessage) trước");
            System.out.println("  → " + api.resume(firstRun, "Tên tôi là gì?", new ClaudeChatModel(claude)));
        });

        LiveSection.run("Streaming output: chữ hiện ra ngay khi Claude viết", () -> {
            api.streamOutput(List.<String>of().iterator(), delta -> { }); // chưa làm bài 5 thì chưa gọi API
            BlockingQueue<String> queue = new LinkedBlockingQueue<>();
            String end = "\u0000END";
            Thread producer = Thread.ofVirtual().start(() -> {
                try {
                    claude.stream(Claude.params().system("You are a poet. Answer in Vietnamese.")
                        .addUserMessage("Viết 4 câu thơ ngắn về một agent biết khi nào nên dừng.").build(), queue::add);
                } finally {
                    queue.add(end);
                }
            });
            Iterator<String> deltas = new Iterator<>() {
                String next;
                public boolean hasNext() {
                    if (next == null) {
                        try {
                            next = queue.take();
                        } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                            next = end;
                        }
                    }
                    return !next.equals(end);
                }
                public String next() {
                    if (!hasNext()) throw new NoSuchElementException();
                    String value = next;
                    next = null;
                    return value;
                }
            };
            String full = api.streamOutput(deltas, delta -> {
                System.out.print(delta);
                System.out.flush();
            });
            System.out.println("\n  (tổng " + full.length() + " ký tự)");
            try {
                producer.join();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
    }

    /**
     * Model thật: nhận hội thoại dạng Turn. Nếu hội thoại nối tiếp lần trước thì chỉ thêm lượt mới vào
     * lịch sử gốc (giữ nguyên câu trả lời của Claude); nếu không thì bắt đầu lại từ text.
     */
    static final class ClaudeChatModel implements Lesson08Api.Model {
        private final Claude claude;
        private final List<MessageParam> raw = new ArrayList<>();
        private List<Turn> known = List.of();

        ClaudeChatModel(Claude claude) {
            this.claude = claude;
        }

        @Override
        public String reply(List<Turn> conversation) {
            boolean continues = conversation.size() > known.size()
                && conversation.subList(0, known.size()).equals(known);
            if (!continues) {
                raw.clear();
                known = List.of();
            }
            for (Turn turn : conversation.subList(known.size(), conversation.size())) {
                raw.add(turn.role().equals("user") ? MessageParam.ofUser(turn.text()) : MessageParam.ofAssistant(turn.text()));
            }
            Message message = claude.create(Claude.params().system(SYSTEM).messages(raw).build());
            raw.add(message.toParam());
            String text = Claude.text(message);
            List<Turn> updated = new ArrayList<>(conversation);
            updated.add(new Turn("assistant", text));
            known = updated;
            return text;
        }
    }
}
