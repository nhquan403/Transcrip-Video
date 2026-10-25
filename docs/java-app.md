# Java App: bài tập thực hành

Thư mục `java-app/` chứa bài tập code cho từng bài học. Cần JDK 21 trở lên. Không cần cài Maven: dự án có sẵn Maven Wrapper (`mvnw`, `mvnw.cmd`), lần chạy đầu sẽ tự tải Maven và Anthropic Java SDK.

Có hai cách chạy:

- **Chấm offline** (mặc định): bộ chấm kiểm tra code của bạn bằng dữ liệu cố định. Nhanh, miễn phí, không cần mạng sau lần tải đầu.
- **Chạy với Claude thật** (`--live`): chính code bạn viết được nối với Claude qua API. Mỗi lần chạy tốn token thật.

## Cấu trúc

Mỗi bài học có một package trong `java-app/src/main/java/`:

- `lessonXX/LessonXXApi.java`: đề bài, mô tả từng phương thức cần viết.
- `lessonXX/LessonXX.java`: **chỗ bạn làm bài**. Mỗi phương thức đang ném `UnsupportedOperationException("TODO ...")`; xóa dòng đó và viết code.
- `lessonXX/LessonXXSolution.java`: lời giải mẫu. Tự làm trước rồi mới xem.
- `lessonXX/Check.java`: bộ chấm offline.
- `lessonXX/Live.java`: kịch bản chạy với Claude thật.

Dùng chung:

- `common/Claude.java`: tạo client từ API key, gọi API, ghi lại token và thời gian mỗi lần gọi.
- `common/Checker.java`, `common/LiveSection.java`: phần hiển thị kết quả.
- `lesson01/ClaudeAgentModel.java`: bản cài đặt thật của `Model` trong bài 01, để Claude tự chọn tool trong vòng lặp agent bạn viết.
- `Main.java`: điểm chạy chung.

Bài 03 (Quick Check-In) không có nội dung chuyên môn nên không có bài tập.

## Chấm offline

Đứng trong thư mục `java-app`. Trên Windows dùng `mvnw.cmd` thay cho `./mvnw`.

```bash
./mvnw -q compile exec:java                                  # chấm tất cả các bài
./mvnw -q compile exec:java -Dexec.args="01"                 # chỉ chấm bài 01
./mvnw -q compile exec:java -Dexec.args="01 --solution"      # chấm lời giải mẫu để đối chiếu
```

Ý nghĩa kết quả: ✅ đạt, ❌ sai (kèm giá trị mong đợi và giá trị nhận được), ⏳ chưa làm.

Nếu tiếng Việt hiện thành dấu `?`, thêm `MAVEN_OPTS=-Dstdout.encoding=UTF-8` trước lệnh (PowerShell: `$env:MAVEN_OPTS="-Dstdout.encoding=UTF-8"`, và chạy `chcp 65001` một lần).

## Chạy với Claude thật

1. Tạo API key tại Claude Console, rồi đặt vào biến môi trường (không ghi key vào file trong repo):

   ```bash
   export ANTHROPIC_API_KEY=...            # macOS / Linux
   $env:ANTHROPIC_API_KEY="..."            # Windows PowerShell
   ```

   Trong IntelliJ: Run > Edit Configurations > Environment variables.

2. Chạy một bài:

   ```bash
   ./mvnw -q compile exec:java -Dexec.args="01 --live"              # code của bạn
   ./mvnw -q compile exec:java -Dexec.args="01 --live --solution"   # lời giải mẫu
   ```

Phần nào bạn chưa làm sẽ báo ⏳ và bỏ qua, không gọi API cho phần đó. Cuối mỗi lần chạy có dòng 💰 tổng kết số lần gọi và số token.

Những gì mỗi bài làm với Claude:

- **Bài 01:** prompt chaining (dàn ý rồi viết đoạn văn), routing (Claude phân loại ticket, code gửi cho handler), parallelization (dịch 3 câu của bài học cùng lúc), và vòng lặp agent của bạn với `ClaudeAgentModel` tự chọn tool `glossary` / `calculator`.
- **Bài 02:** một agent đọc 3 chương dài; in số token vào thật ở từng vòng, độ trễ thật, rồi đối chiếu với `totalInputTokens()` và `waitTimeMs()` của bạn. Pipeline lai bắt lỗi API thật (gọi một model không tồn tại, không tốn token).
- **Bài 04:** Claude làm manager, chia việc lúc chạy bằng structured output; mỗi subagent là một lần gọi Claude với handoff do `buildHandoff()` của bạn dựng; `orchestrate()` của bạn kiểm tra rồi tổng hợp.

Cấu hình:

- Model mặc định `claude-opus-5-5`. Đổi bằng biến môi trường `CLAUDE_MODEL`, ví dụ `claude-haiku-5-5` để rẻ hơn.
- Mọi lời gọi dùng effort `low`, vì đây là các việc ngắn.
- Mọi lời gọi bật fallback phía server (`fallbacks: "default"`): nếu bộ lọc an toàn từ chối một yêu cầu bình thường, server tự chuyển sang model dự phòng.

## Thêm bài mới

1. Tạo package `lessonXX` với các file như trên.
2. Thêm `CHECKS.put("XX", lessonXX.Check::run);` và `LIVE.put("XX", lessonXX.Live::run);` vào `Main.java`.
