package part2.lesson23;

import java.util.List;

/**
 * Phần 2 · Bài 23: One Model, Many Surfaces and SDKs.
 * {@link Lesson23} là chỗ bạn làm bài, {@link Lesson23Solution} là lời giải mẫu.
 */
public interface Lesson23Api {

    enum Surface { RAW_API, AGENT_SDK, CLAUDE_CODE, HOSTED_CHAT }

    /**
     * Bài 1 (mỗi bề mặt nạp gì): trả về danh sách chỉ dẫn mà bề mặt tự nạp, theo đúng thứ tự:
     * RAW_API: ["system parameter"] (chỉ thứ bạn tự gửi).
     * AGENT_SDK: "claude code preset" nếu claudeCodePreset, không thì "minimal default prompt"; rồi "CLAUDE.md (project)"
     *   nếu settingSources có "project", "CLAUDE.md (user)" nếu có "user". settingSources null nghĩa là dùng mặc định ["project", "user"].
     * CLAUDE_CODE: ["full claude code prompt", "CLAUDE.md hierarchy", "rules", "auto-memory"] (preset và settingSources bỏ qua).
     * HOSTED_CHAT: ["profile instructions", "project instructions"].
     */
    List<String> loadedInstructions(Surface surface, boolean claudeCodePreset, List<String> settingSources);

    /**
     * Bài 2 (chỉ dẫn có tới được bề mặt kia không): một quy tắc đặt ở `setOn` có ảnh hưởng tới phiên trên `target` không?
     * Đặt trong HOSTED_CHAT: chỉ tới HOSTED_CHAT. Đặt trong system parameter của RAW_API: chỉ tới đúng lời gọi RAW_API đó.
     * Đặt trong CLAUDE.md của dự án ("claude_md"): tới CLAUDE_CODE và AGENT_SDK (với nguồn mặc định), không tới RAW_API hay HOSTED_CHAT.
     * setOn là "hosted_chat", "raw_api_system" hoặc "claude_md".
     */
    boolean reaches(String setOn, Surface target);

    /**
     * Bài 3 (thói quen debug): hành vi khác nhau giữa hai bề mặt. Trả về các bước đúng thứ tự trong bài:
     * "reproduce the same prompt on a surface you control", "compare what each surface loaded", "only then inspect the model output".
     */
    List<String> debugSteps();
}
