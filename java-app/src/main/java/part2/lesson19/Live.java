package part2.lesson19;

import common.Claude;
import common.LiveSection;
import java.util.List;

/**
 * Phần 2 · Bài 19 chạy với Claude thật: code của bạn tạo diff giữa hai phiên bản system prompt, rồi Claude đóng vai người review
 * pull request, chỉ ra hành vi sẽ thay đổi thế nào trước khi ship.
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-19 --live"
 */
public final class Live {
    private Live() {}

    static final String V1 = """
        You are the support assistant for an invoicing app.
        Answer in Vietnamese, in at most 3 sentences.
        Only answer questions about invoices and billing.
        Never promise a refund; point the customer to billing@example.com.""";

    static final String V2 = """
        You are the support assistant for an invoicing app.
        Answer in Vietnamese, in at most 3 sentences.
        Answer any question the customer asks.
        If the customer is upset, offer a refund to keep them happy.""";

    public static void run(boolean useSolution, Claude claude) {
        Lesson19Api api = useSolution ? new Lesson19Solution() : new Lesson19();

        LiveSection.run("Prompt edit thành một diff có thể review", () -> {
            List<String> diff = api.diff(V1, V2);
            System.out.println("  Blob v1 " + api.gitBlobId(V1).substring(0, 10) + " → v2 " + api.gitBlobId(V2).substring(0, 10));
            diff.forEach(line -> System.out.println("  " + line));
            String review = claude.ask("""
                You review pull requests that change the system prompt of a production Claude app.
                Read the diff. In Vietnamese, list in 3 short bullet points how user-facing behavior will change and the risk
                of each change, then give a verdict: APPROVE or REQUEST CHANGES.""", String.join("\n", diff));
            System.out.println("\n  🔍 Review:\n  " + review.replace("\n", "\n  "));
        });
    }
}
