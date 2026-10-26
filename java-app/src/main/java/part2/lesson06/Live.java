package part2.lesson06;

import com.anthropic.models.messages.Message;
import common.Claude;
import common.LiveSection;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import part2.lesson06.Lesson06Api.CallLog;

/**
 * Phần 2 · Bài 06 chạy với Claude thật: chạy một bộ đánh giá đóng băng trên model hiện tại và một model ứng viên,
 * ghi log từng lời gọi, rồi dùng code của bạn để đọc sức khỏe hệ thống và quyết định có nên chuyển model không.
 * Model ứng viên đổi bằng biến môi trường CANDIDATE_MODEL (mặc định claude-haiku-5-5).
 * Chạy: ./mvnw -q compile exec:java -Dexec.args="p2-06 --live"
 */
public final class Live {
    private Live() {}

    static final String SYSTEM = """
        Classify the support ticket. Reply with exactly one word: billing, bug, or account.""";

    /** Bộ đánh giá đóng băng: cùng input, cùng nhãn, dùng cho mọi lần so model. */
    static final Map<String, String[]> FROZEN_EVAL = new LinkedHashMap<>();

    static {
        FROZEN_EVAL.put("ex-1", new String[] {"Tôi bị trừ tiền hai lần trong tháng này.", "billing"});
        FROZEN_EVAL.put("ex-2", new String[] {"Nút xuất PDF bấm vào không có phản ứng gì.", "bug"});
        FROZEN_EVAL.put("ex-3", new String[] {"Tôi muốn đổi email đăng nhập của tài khoản.", "account"});
        FROZEN_EVAL.put("ex-4", new String[] {"Hóa đơn tháng 9 ghi sai mã số thuế công ty.", "billing"});
        FROZEN_EVAL.put("ex-5", new String[] {"Ứng dụng tự thoát mỗi khi tôi mở trang báo cáo.", "bug"});
        FROZEN_EVAL.put("ex-6", new String[] {"Làm sao thêm một người quản trị nữa vào workspace?", "account"});
    }

    public static void run(boolean useSolution, Claude claude) {
        Lesson06Api api = useSolution ? new Lesson06Solution() : new Lesson06();
        String candidate = System.getenv().getOrDefault("CANDIDATE_MODEL", "claude-haiku-5-5");

        LiveSection.run("Regression test trên bộ đánh giá đóng băng: " + Claude.MODEL + " → " + candidate, () -> {
            api.safeToCutOver(Map.of(), Map.of());
            List<CallLog> logs = new ArrayList<>();
            Map<String, Boolean> oldPass = runEval(claude, Claude.MODEL, logs);
            Map<String, Boolean> newPass = runEval(claude, candidate, logs);
            System.out.println("  Regression (đạt ở model cũ, trượt ở model mới): " + api.regressions(oldPass, newPass));
            System.out.println("  " + (api.safeToCutOver(oldPass, newPass)
                ? "✅ Chất lượng giữ vững: có thể chuyển sang " + candidate
                : "⛔ Chưa chuyển: chỉnh prompt cho model mới rồi chạy lại bộ đánh giá"));

            System.out.println("\n  Ba tín hiệu vận hành từ " + logs.size() + " lời gọi vừa rồi:");
            var h = api.health(logs);
            System.out.println("  p95 độ trễ " + h.p95LatencyMs() + "ms · tổng " + h.totalTokens() + " token · lỗi/từ chối "
                + String.format("%.0f%%", h.errorAndRefusalRate() * 100));
            for (CallLog log : logs) {
                if (api.readSignature(log.status(), log.stopReason()) != Lesson06Api.Fix.OK) {
                    System.out.println("  ⚠️ " + log + " → " + api.readSignature(log.status(), log.stopReason()));
                }
            }
        });

        LiveSection.run("Chữ ký max_tokens: max_tokens quá nhỏ làm câu trả lời bị cắt giữa chừng", () -> {
            api.readSignature(200, "max_tokens");
            Message cut = claude.createAllowingTruncation(Claude.params()
                .maxTokens(12L).addUserMessage("Giải thích vòng đời develop, implement, operate, maintain trong 200 chữ.").build());
            String stop = cut.stopReason().map(Object::toString).orElse("?");
            System.out.println("  stop_reason: " + stop + " · \"" + Claude.text(cut) + "…\"");
            System.out.println("  readSignature của bạn: " + api.readSignature(200, stop));
        });
    }

    private static Map<String, Boolean> runEval(Claude claude, String model, List<CallLog> logs) {
        Map<String, Boolean> pass = new LinkedHashMap<>();
        System.out.println("\n  Model " + model + ":");
        FROZEN_EVAL.forEach((id, example) -> {
            long start = System.nanoTime();
            try {
                Message m = claude.create(Claude.params().model(model).maxTokens(20L).system(SYSTEM).addUserMessage(example[0]).build());
                String label = Claude.text(m).toLowerCase().replaceAll("[^a-z]", "");
                pass.put(id, label.equals(example[1]));
                logs.add(new CallLog((System.nanoTime() - start) / 1_000_000, m.usage().inputTokens(), m.usage().outputTokens(), 200,
                    m.stopReason().map(Object::toString).orElse(null)));
                System.out.println("    " + (label.equals(example[1]) ? "✅" : "❌") + " " + id + " → " + label + " (nhãn " + example[1] + ")");
            } catch (com.anthropic.errors.AnthropicServiceException e) {
                pass.put(id, false);
                logs.add(new CallLog((System.nanoTime() - start) / 1_000_000, 0, 0, e.statusCode(), null));
                System.out.println("    ❌ " + id + " → HTTP " + e.statusCode());
            }
        });
        return pass;
    }
}
