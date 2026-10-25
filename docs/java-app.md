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
- `lesson06/ClaudeQueryModel.java`: model thật cho `query()` thu nhỏ của bài 06 và 07.
- `lesson09/ClaudeApi.java`: nối các kiểu Messages API thu gọn của bài 09 với API thật (dùng ở bài 09, 10, 12).
- `Main.java`: điểm chạy chung.

Các adapter này giữ nguyên câu trả lời gốc của Claude và chỉ nối thêm lượt mới vào hội thoại, nên code bài tập của bạn chỉ làm việc với các kiểu đơn giản.

Bài 03 (Quick Check-In) không có nội dung chuyên môn nên không có bài tập. Các bài khác (01, 02, 04 tới 12) đều có.

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
- **Bài 05:** subagent chỉ nhận những dòng do `subagentContext()` của bạn dựng: quên truyền mã dự án thì nó không biết, truyền vào thì biết; đo token manager nhận khi có và không có cô lập.
- **Bài 06:** `query()` thu nhỏ của bạn (Agent SDK thật chỉ có Python/TypeScript) điều khiển vòng lặp với Claude bên trong; in luồng message init, assistant, user, result; phiên mới không nhớ phiên cũ.
- **Bài 07:** cùng một việc chạy ba lần với ba kiểu giới hạn: chạm max turns, chạm ngân sách USD, và thành công; đọc kết quả an toàn theo subtype.
- **Bài 08:** single message quên tên bạn, streaming input nhớ, resume nhớ lại; streaming output in chữ ngay khi Claude viết.
- **Bài 09:** vòng lặp bạn tự viết nói chuyện trực tiếp với Messages API, in stop_reason của từng lần gọi.
- **Bài 10:** `parseToolInput()` ghép các mảnh partial JSON thật từ stream; harness của bạn chặn lệnh xóa bảng, thử lại khi timeout, ghi nhật ký từng lượt.
- **Bài 11:** Claude cầm một shell **giả lập** (không lệnh nào chạy thật trên máy bạn); chỉ có hook của bạn chặn `rm -rf /`, hỏi người duyệt cho force push, và ghi nhật ký kiểm toán.
- **Bài 12:** Claude yêu cầu đọc nhiều file cùng lúc; `planBatches()` và `executeBatches()` của bạn chạy các lần đọc song song, các lần ghi tuần tự, và in thời gian tiết kiệm.

Cấu hình:

- Model mặc định `claude-opus-5-5`. Đổi bằng biến môi trường `CLAUDE_MODEL`, ví dụ `claude-haiku-5-5` để rẻ hơn.
- Mọi lời gọi dùng effort `low`, vì đây là các việc ngắn.
- Mọi lời gọi bật fallback phía server (`fallbacks: "default"`): nếu bộ lọc an toàn từ chối một yêu cầu bình thường, server tự chuyển sang model dự phòng.

## Thêm bài mới

1. Tạo package `lessonXX` với các file như trên.
2. Thêm `CHECKS.put("XX", lessonXX.Check::run);` và `LIVE.put("XX", lessonXX.Live::run);` vào `Main.java`.
