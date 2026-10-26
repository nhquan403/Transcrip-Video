package part2.lesson14;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Phần 2 · Bài 14: Invoking Claude on Amazon Bedrock.
 * {@link Lesson14} là chỗ bạn làm bài, {@link Lesson14Solution} là lời giải mẫu.
 * Bài này không có phần --live vì cần tài khoản AWS có quyền Bedrock.
 */
public interface Lesson14Api {

    enum Integration { BEDROCK_MANTLE, LEGACY_INVOKE_MODEL }

    /** Thông tin xác thực AWS đã chọn được, kèm nguồn: "constructor", "environment" hoặc "config file". */
    record AwsCredentials(String accessKeyId, String region, String source) {}

    /**
     * Bài 1 (đường nào cho model nào): Opus 4.7 trở lên dùng Bedrock Mantle (đường hiện tại).
     * Opus 4.6 trở xuống dùng invoke model (đường cũ). Version cho dạng số thập phân, ví dụ 4.6, 4.7, 4.8.
     */
    Integration integrationFor(double opusVersion);

    /**
     * Bài 2 (model ID theo đường tích hợp): Mantle dùng tiền tố trần "anthropic." + tên model, ví dụ "anthropic.claude-opus-4-8".
     * Đường cũ dùng tiền tố profile: "global." mặc định (khuyến nghị), hoặc "us." / "eu." khi chọn vùng (regionalProfile là "us" hoặc "eu"),
     * ghép trước "anthropic." + tên model, ví dụ "global.anthropic.claude-opus-4-6". Với Mantle, regionalProfile phải null.
     */
    String modelId(Integration integration, String model, String regionalProfile);

    /**
     * Bài 3 (thứ tự ưu tiên thông tin xác thực): tham số truyền vào constructor thắng tất cả; không có thì biến môi trường
     * (AWS_ACCESS_KEY_ID, AWS_REGION); không có nữa thì file cấu hình AWS. Mỗi nguồn là một Map, rỗng nghĩa là không đặt gì.
     * Map dùng khóa "AWS_ACCESS_KEY_ID" và "AWS_REGION". Không nguồn nào có key thì ném IllegalStateException.
     */
    AwsCredentials resolveCredentials(Map<String, String> constructorArgs, Map<String, String> env, Map<String, String> configFile);

    /**
     * Bài 4 (tính năng không có trên Bedrock): trong các tính năng thiết kế cần, trả về những cái KHÔNG có trên Bedrock, giữ thứ tự:
     * "url_image", "files_api", "code_execution", "web_search", "web_fetch", "message_batches", "mcp_connector".
     * Những cái có (prompt_caching, extended_thinking, client_tools, citations, structured_outputs, streaming...) không trả về.
     */
    List<String> unsupportedOnBedrock(List<String> neededFeatures);

    /** Bài 5 (giá endpoint): global không phụ phí; regional đắt hơn khoảng 10%. */
    double endpointPrice(double basePrice, boolean regional);

    /** Ảnh trên Bedrock phải gửi inline base64 và tối đa 5 MB mỗi ảnh. Trả về các ảnh (tên → byte) vượt giới hạn, sắp theo tên. */
    List<String> oversizedImages(Map<String, Long> imageBytes);

    /** Tập tính năng không có trên Bedrock, dùng chung cho lời giải. */
    Set<String> UNSUPPORTED = Set.of("url_image", "files_api", "code_execution", "web_search", "web_fetch", "message_batches", "mcp_connector");
}
