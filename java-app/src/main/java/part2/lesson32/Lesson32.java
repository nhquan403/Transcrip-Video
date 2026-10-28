package part2.lesson32;

/**
 * Bài tập Phần 2 · Bài 32. Xóa từng dòng "throw new UnsupportedOperationException" và viết code của bạn,
 * rồi chạy: ./mvnw -q compile exec:java -Dexec.args="p2-32"
 */
public class Lesson32 implements Lesson32Api {

    /** Gợi ý: đọc JSON bằng com.fasterxml.jackson.databind.ObjectMapper (common.RawApi.JSON). */
    @Override
    public Decision decide(String settingsJson, String tool, String argument) {
        throw new UnsupportedOperationException("TODO bài 1: deny trước, rồi ask, rồi allow; không khớp thì hỏi");
    }

    @Override
    public HookEvent eventFor(String goal) {
        throw new UnsupportedOperationException("TODO bài 2a: hành động đó tự nhiên nằm ở thời điểm nào?");
    }

    @Override
    public boolean canBlockToolCall(HookEvent event) {
        throw new UnsupportedOperationException("TODO bài 2b: sự kiện nào còn kịp chặn trước khi tool chạy?");
    }

    @Override
    public Decision applyHookDecision(String hookOutputJson, Decision normalDecision) {
        throw new UnsupportedOperationException("TODO bài 3: allow, deny, ask, defer; object rỗng thì sao?");
    }

    @Override
    public String belongsIn(String change) {
        throw new UnsupportedOperationException("TODO bài 4: config được thực thi hay lời hướng dẫn bằng văn xuôi?");
    }

    @Override
    public boolean takesEffectLive(String key) {
        throw new UnsupportedOperationException("TODO bài 5: key nào cần khởi động lại?");
    }
}
