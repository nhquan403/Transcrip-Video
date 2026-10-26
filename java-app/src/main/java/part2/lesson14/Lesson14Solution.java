package part2.lesson14;

import java.util.List;
import java.util.Map;

/** Lời giải mẫu Phần 2 · Bài 14. Hãy tự làm trong Lesson14 trước khi đọc file này. */
public class Lesson14Solution implements Lesson14Api {

    private static final long FIVE_MB = 5L * 1024 * 1024;

    @Override
    public Integration integrationFor(double opusVersion) {
        return opusVersion >= 4.7 ? Integration.BEDROCK_MANTLE : Integration.LEGACY_INVOKE_MODEL;
    }

    @Override
    public String modelId(Integration integration, String model, String regionalProfile) {
        if (integration == Integration.BEDROCK_MANTLE) {
            if (regionalProfile != null) throw new IllegalArgumentException("Mantle không dùng tiền tố profile");
            return "anthropic." + model;
        }
        String profile = regionalProfile == null ? "global" : regionalProfile;
        if (!profile.equals("global") && !profile.equals("us") && !profile.equals("eu")) {
            throw new IllegalArgumentException("profile lạ: " + profile);
        }
        return profile + ".anthropic." + model;
    }

    @Override
    public AwsCredentials resolveCredentials(Map<String, String> constructorArgs, Map<String, String> env, Map<String, String> configFile) {
        if (constructorArgs.containsKey("AWS_ACCESS_KEY_ID")) return from(constructorArgs, "constructor");
        if (env.containsKey("AWS_ACCESS_KEY_ID")) return from(env, "environment");
        if (configFile.containsKey("AWS_ACCESS_KEY_ID")) return from(configFile, "config file");
        throw new IllegalStateException("không tìm thấy thông tin xác thực AWS");
    }

    private static AwsCredentials from(Map<String, String> source, String name) {
        return new AwsCredentials(source.get("AWS_ACCESS_KEY_ID"), source.get("AWS_REGION"), name);
    }

    @Override
    public List<String> unsupportedOnBedrock(List<String> neededFeatures) {
        return neededFeatures.stream().filter(UNSUPPORTED::contains).toList();
    }

    @Override
    public double endpointPrice(double basePrice, boolean regional) {
        return regional ? basePrice * 1.10 : basePrice;
    }

    @Override
    public List<String> oversizedImages(Map<String, Long> imageBytes) {
        return imageBytes.entrySet().stream().filter(e -> e.getValue() > FIVE_MB).map(Map.Entry::getKey).sorted().toList();
    }
}
