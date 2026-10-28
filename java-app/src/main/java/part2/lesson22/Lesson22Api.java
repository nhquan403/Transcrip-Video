package part2.lesson22;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

/**
 * Phần 2 · Bài 22: Refactoring Prompts and Application Code.
 * {@link Lesson22} là chỗ bạn làm bài, {@link Lesson22Solution} là lời giải mẫu. Bài này chỉ có bộ chấm offline.
 */
public interface Lesson22Api {

    /**
     * Bài 1 (tìm prompt trùng lặp): promptsByCallSite là tên chỗ gọi → nội dung prompt. Trả về các dòng (đã trim)
     * xuất hiện ở ÍT NHẤT hai chỗ gọi khác nhau và dài ít nhất minLength ký tự, sắp xếp theo thứ tự chữ cái.
     */
    List<String> duplicatedLines(Map<String, String> promptsByCallSite, int minLength);

    /**
     * Bài 2 (rút ra fragment dùng chung): thay mọi chỗ xuất hiện của fragmentText trong từng prompt bằng "{{" + name + "}}".
     * Trả về map mới cùng khóa; không sửa map đầu vào.
     */
    Map<String, String> extractFragment(Map<String, String> promptsByCallSite, String fragmentText, String name);

    /**
     * Bài 3: dựng prompt hoàn chỉnh: thay mọi "{{name}}" bằng fragments.get(name).
     * Gặp tên không có trong fragments thì ném IllegalArgumentException (đừng gửi prompt còn chỗ trống).
     */
    String render(String template, Map<String, String> fragments);

    /** Bài 4 (đo coupling): số file nguồn có chứa trực tiếp chuỗi modelId. Sau khi cô lập lời gọi sau một client, số này nên là 1. */
    int filesHardcoding(Map<String, String> sourceFiles, String modelId);

    /**
     * Bài 5 (test là lưới an toàn): refactor giữ nguyên hành vi khi before và after cho cùng output với MỌI input.
     * Trả về danh sách input mà hai bên khác nhau (theo thứ tự inputs); rỗng nghĩa là giữ nguyên hành vi.
     */
    List<String> behaviorChanges(Function<String, String> before, Function<String, String> after, List<String> inputs);
}
