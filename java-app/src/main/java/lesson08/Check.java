package lesson08;

import static common.Checker.assertEquals;

import common.Checker;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import lesson08.Lesson08Api.InputMode;
import lesson08.Lesson08Api.Model;
import lesson08.Lesson08Api.Turn;
import lesson08.Lesson08Api.Workload;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson08Api api = useSolution ? new Lesson08Solution() : new Lesson08();
        Checker c = new Checker();

        c.check("Bài 1: ảnh, ngắt giữa chừng, tương tác, nhiều lượt thì chọn STREAMING", () -> {
            assertEquals(InputMode.STREAMING, api.chooseMode(new Workload(false, false, true, false, true)));
            assertEquals(InputMode.STREAMING, api.chooseMode(new Workload(false, false, false, true, true)));
            assertEquals(InputMode.STREAMING, api.chooseMode(new Workload(true, true, false, false, false)));
        });
        c.check("Bài 1: việc một lần không trạng thái thì SINGLE_MESSAGE, phân vân thì STREAMING", () -> {
            assertEquals(InputMode.SINGLE_MESSAGE, api.chooseMode(new Workload(false, false, false, false, true)));
            assertEquals(InputMode.STREAMING, api.chooseMode(new Workload(false, false, false, false, false)));
        });

        List<List<Turn>> seen = new ArrayList<>();
        Model echo = conversation -> {
            seen.add(conversation);
            return "reply#" + conversation.size();
        };

        c.check("Bài 2: single message chỉ có một lượt user", () -> {
            seen.clear();
            assertEquals("reply#1", api.singleMessage("hello", echo));
            assertEquals(List.of(new Turn("user", "hello")), seen.get(0));
        });

        c.check("Bài 3: streaming input giữ hội thoại qua nhiều tin nhắn", () -> {
            seen.clear();
            List<String> replies = api.streamingSession(List.of("a", "b", "c").iterator(), echo);
            assertEquals(List.of("reply#1", "reply#3", "reply#5"), replies);
            assertEquals(List.of(new Turn("user", "a"), new Turn("assistant", "reply#1"), new Turn("user", "b"),
                new Turn("assistant", "reply#3"), new Turn("user", "c")), seen.get(2));
        });
        c.check("Bài 3: tin nhắn được xếp hàng và đọc dần, không đọc hết trước", () -> {
            List<String> log = new ArrayList<>();
            Iterator<String> lazy = new Iterator<>() {
                int i = 0;
                public boolean hasNext() { return i < 2; }
                public String next() { log.add("input" + i); return "m" + i++; }
            };
            api.streamingSession(lazy, conversation -> {
                log.add("reply");
                return "ok";
            });
            assertEquals(List.of("input0", "reply", "input1", "reply"), log);
        });

        c.check("Bài 4: resume nối lại transcript cũ một cách chủ động", () -> {
            seen.clear();
            List<Turn> prior = List.of(new Turn("user", "Tên tôi là An"), new Turn("assistant", "Chào An"));
            api.resume(prior, "Tên tôi là gì?", echo);
            assertEquals(3, seen.get(0).size());
            assertEquals(new Turn("user", "Tên tôi là gì?"), seen.get(0).get(2));
        });

        c.check("Bài 5: streaming output chuyển từng delta ngay và ghép đủ", () -> {
            List<String> got = new ArrayList<>();
            String full = api.streamOutput(List.of("Xin ", "chào ", "bạn").iterator(), got::add);
            assertEquals(List.of("Xin ", "chào ", "bạn"), got);
            assertEquals("Xin chào bạn", full);
        });

        return c.summary();
    }
}
