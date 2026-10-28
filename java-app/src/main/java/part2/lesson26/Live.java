package part2.lesson26;

import common.Claude;
import common.LiveSection;
import common.RawApi;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Phần 2 · Bài 26 chạy với Claude thật: API không lưu state giữa các lời gọi. Claude chỉ "nhớ" khi code của bạn gửi lại
 * transcript; và ranh giới phiên chỉ là việc bạn bắt đầu một mảng messages mới.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-26 --live"
 */
public final class Live {
    private Live() {}

    static final String FACT = "Ghi nhớ: dự án của tôi tên là Hoa Sen và dùng PostgreSQL.";
    static final String QUESTION = "Trong một câu: dự án của tôi tên gì và dùng cơ sở dữ liệu nào?";

    public static void run(boolean useSolution, Claude claude) {
        Lesson26Api api = useSolution ? new Lesson26Solution() : new Lesson26();

        LiveSection.run("Gửi lại transcript: Claude \"nhớ\" vì bạn gửi lại", () -> {
            List<Map<String, Object>> history = List.of(
                Lesson26Api.turn("user", FACT), Lesson26Api.turn("assistant", "Đã ghi nhớ."));
            List<Map<String, Object>> messages = api.nextRequestMessages(history, QUESTION);
            System.out.println("  messages gửi đi: " + messages.size() + " lượt");
            System.out.println("  💬 " + send(messages));
        });

        LiveSection.run("Phiên mới không mang gì theo: Claude không biết gì", () -> {
            List<Map<String, Object>> fresh = api.startNewSession(List.of(Lesson26Api.turn("user", FACT)), null);
            System.out.println("  messages gửi đi: " + (fresh.size() + 1) + " lượt (chỉ câu hỏi)");
            System.out.println("  💬 " + send(api.nextRequestMessages(fresh, QUESTION)));
        });

        LiveSection.run("Phiên mới mang theo một tóm tắt ngắn", () -> {
            List<Map<String, Object>> fresh = api.startNewSession(List.of(Lesson26Api.turn("user", FACT)),
                "project name is Hoa Sen, database is PostgreSQL");
            System.out.println("  Tóm tắt là " + api.kindOf("chat_message") + " nếu chỉ nằm trong chat; muốn bền thì lưu vào "
                + "claude_md (" + api.kindOf("claude_md") + ")");
            System.out.println("  💬 " + send(api.nextRequestMessages(fresh, QUESTION)));
        });
    }

    private static String send(List<Map<String, Object>> messages) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", Claude.MODEL);
        body.put("max_tokens", 200);
        body.put("messages", messages);
        RawApi.Response r = RawApi.fromEnv().post(body);
        if (r.status() != 200) throw new IllegalStateException("HTTP " + r.status() + " " + r.body());
        return r.json().path("content").path(0).path("text").asText().replace("\n", " ");
    }
}
