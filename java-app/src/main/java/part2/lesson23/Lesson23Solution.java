package part2.lesson23;

import java.util.ArrayList;
import java.util.List;

/** Lời giải mẫu Phần 2 · Bài 23. Hãy tự làm trong Lesson23 trước khi đọc file này. */
public class Lesson23Solution implements Lesson23Api {

    @Override
    public List<String> loadedInstructions(Surface surface, boolean claudeCodePreset, List<String> settingSources) {
        return switch (surface) {
            case RAW_API -> List.of("system parameter");
            case CLAUDE_CODE -> List.of("full claude code prompt", "CLAUDE.md hierarchy", "rules", "auto-memory");
            case HOSTED_CHAT -> List.of("profile instructions", "project instructions");
            case AGENT_SDK -> {
                List<String> sources = settingSources == null ? List.of("project", "user") : settingSources;
                List<String> loaded = new ArrayList<>();
                loaded.add(claudeCodePreset ? "claude code preset" : "minimal default prompt");
                if (sources.contains("project")) loaded.add("CLAUDE.md (project)");
                if (sources.contains("user")) loaded.add("CLAUDE.md (user)");
                yield loaded;
            }
        };
    }

    @Override
    public boolean reaches(String setOn, Surface target) {
        return switch (setOn) {
            case "hosted_chat" -> target == Surface.HOSTED_CHAT;
            case "raw_api_system" -> target == Surface.RAW_API;
            case "claude_md" -> target == Surface.CLAUDE_CODE || target == Surface.AGENT_SDK;
            default -> throw new IllegalArgumentException("nơi đặt lạ: " + setOn);
        };
    }

    @Override
    public List<String> debugSteps() {
        return List.of("reproduce the same prompt on a surface you control", "compare what each surface loaded",
            "only then inspect the model output");
    }
}
