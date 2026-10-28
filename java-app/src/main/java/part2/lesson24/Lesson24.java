package part2.lesson24;

import java.util.Map;

/**
 * Bài tập Phần 2 · Bài 24. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-24" (thêm --live để chạy với Claude thật)
 */
public class Lesson24 implements Lesson24Api {

    @Override
    public Channel channelOf(String mechanism) {
        throw new UnsupportedOperationException("TODO bài 1: system prompt, user message hay trong phiên?");
    }

    @Override
    public boolean changesSystemPromptCache(String mechanism) {
        throw new UnsupportedOperationException("TODO bài 2: cái gì chạm vào prefix của system prompt?");
    }

    @Override
    public boolean persistsAfterSession(String mechanism) {
        throw new UnsupportedOperationException("TODO bài 3: cái gì biến mất khi phiên kết thúc?");
    }

    /** Gợi ý: dùng Lesson24Api.userTurn(...) để tạo từng lượt. */
    @Override
    public Map<String, Object> buildRequest(String systemPrompt, String claudeMd, String userText) {
        throw new UnsupportedOperationException("TODO bài 4: CLAUDE.md đi như một lượt user, sau system");
    }

    @Override
    public String bestHome(String need) {
        throw new UnsupportedOperationException("TODO bài 5: quy tắc nào đặt ở đâu?");
    }
}
