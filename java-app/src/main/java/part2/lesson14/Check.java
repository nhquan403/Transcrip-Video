package part2.lesson14;

import static common.Checker.assertEquals;
import static common.Checker.assertTrue;
import static common.Checker.expectThrows;

import common.Checker;
import java.util.List;
import java.util.Map;
import part2.lesson14.Lesson14Api.AwsCredentials;
import part2.lesson14.Lesson14Api.Integration;

public final class Check {
    private Check() {}

    public static boolean run(boolean useSolution) {
        Lesson14Api api = useSolution ? new Lesson14Solution() : new Lesson14();
        Checker c = new Checker();

        c.check("Bài 1: Opus 4.7 trở lên dùng Mantle, 4.6 trở xuống dùng invoke model", () -> {
            assertEquals(Integration.BEDROCK_MANTLE, api.integrationFor(4.7));
            assertEquals(Integration.BEDROCK_MANTLE, api.integrationFor(4.8));
            assertEquals(Integration.LEGACY_INVOKE_MODEL, api.integrationFor(4.6));
        });

        c.check("Bài 2: Mantle dùng tiền tố trần anthropic.", () ->
            assertEquals("anthropic.claude-opus-4-8", api.modelId(Integration.BEDROCK_MANTLE, "claude-opus-4-8", null)));
        c.check("Bài 2: đường cũ dùng tiền tố profile, global là mặc định", () -> {
            assertEquals("global.anthropic.claude-opus-4-6", api.modelId(Integration.LEGACY_INVOKE_MODEL, "claude-opus-4-6", null));
            assertEquals("eu.anthropic.claude-opus-4-6", api.modelId(Integration.LEGACY_INVOKE_MODEL, "claude-opus-4-6", "eu"));
        });

        Map<String, String> ctor = Map.of("AWS_ACCESS_KEY_ID", "AKIA-CTOR", "AWS_REGION", "us-west-2");
        Map<String, String> env = Map.of("AWS_ACCESS_KEY_ID", "AKIA-ENV", "AWS_REGION", "eu-west-1");
        Map<String, String> file = Map.of("AWS_ACCESS_KEY_ID", "AKIA-FILE", "AWS_REGION", "ap-southeast-1");
        c.check("Bài 3: constructor thắng biến môi trường và file cấu hình", () ->
            assertEquals(new AwsCredentials("AKIA-CTOR", "us-west-2", "constructor"), api.resolveCredentials(ctor, env, file)));
        c.check("Bài 3: không truyền gì trong code thì đọc biến môi trường, rồi tới file cấu hình", () -> {
            assertEquals("environment", api.resolveCredentials(Map.of(), env, file).source());
            assertEquals(new AwsCredentials("AKIA-FILE", "ap-southeast-1", "config file"), api.resolveCredentials(Map.of(), Map.of(), file));
            expectThrows(IllegalStateException.class, () -> api.resolveCredentials(Map.of(), Map.of(), Map.of()));
        });

        c.check("Bài 4: tìm tính năng thiết kế cần mà Bedrock không có", () -> assertEquals(
            List.of("web_search", "message_batches", "url_image"),
            api.unsupportedOnBedrock(List.of("prompt_caching", "web_search", "extended_thinking", "message_batches",
                "client_tools", "url_image", "structured_outputs"))));
        c.check("Bài 4: app hỏi đáp thông thường thì không thiếu gì", () ->
            assertEquals(List.of(), api.unsupportedOnBedrock(List.of("prompt_caching", "streaming", "citations", "client_tools"))));

        c.check("Bài 5: regional đắt hơn khoảng 10%, ảnh trên 5 MB bị loại", () -> {
            assertTrue(Math.abs(api.endpointPrice(10, true) - 11) < 1e-9, "regional = 11");
            assertEquals(10.0, api.endpointPrice(10, false));
            assertEquals(List.of("scan.png"), api.oversizedImages(Map.of("logo.png", 200_000L, "scan.png", 6_000_000L)));
        });

        return c.summary();
    }
}
