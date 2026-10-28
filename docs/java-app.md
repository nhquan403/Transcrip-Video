# Java App: bài tập thực hành

Thư mục `java-app/` chứa bài tập code cho từng bài học. Cần JDK 21 trở lên. Không cần cài Maven: dự án có sẵn Maven Wrapper (`mvnw`, `mvnw.cmd`), lần chạy đầu sẽ tự tải Maven và Anthropic Java SDK.

Có hai cách chạy:

- **Chấm offline** (mặc định): bộ chấm kiểm tra code của bạn bằng dữ liệu cố định. Nhanh, miễn phí, không cần mạng sau lần tải đầu.
- **Chạy với Claude thật** (`--live`): chính code bạn viết được nối với Claude qua API. Mỗi lần chạy tốn token thật.

## Cấu trúc

Khóa học chia thành các phần; mỗi bài học có một package trong `java-app/src/main/java/partN/lessonXX/` (ví dụ `part2/lesson03`).
Mỗi bài có một mã dùng trên dòng lệnh: `p<phần>-<số bài>`, ví dụ `p1-07` là bài 07 của Phần 1, `p2-03` là bài 03 của Phần 2.

- `LessonXXApi.java`: đề bài, mô tả từng phương thức cần viết.
- `LessonXX.java`: **chỗ bạn làm bài**. Mỗi phương thức đang ném `UnsupportedOperationException("TODO ...")`; xóa dòng đó và viết code.
- `LessonXXSolution.java`: lời giải mẫu. Tự làm trước rồi mới xem.
- `Check.java`: bộ chấm offline.
- `Live.java`: kịch bản chạy với Claude thật.

Dùng chung:

- `common/Claude.java`: tạo client từ API key, gọi API, ghi lại token và thời gian mỗi lần gọi.
- `common/RawApi.java`: gọi thẳng REST endpoint `/v1/messages` bằng `java.net.http` (không qua SDK), dùng ở các bài Phần 2 cần thấy JSON thô hoặc SSE thô.
- `common/Checker.java`, `common/LiveSection.java`: phần hiển thị kết quả.
- `part1/lesson01/ClaudeAgentModel.java`: bản cài đặt thật của `Model` trong bài 01, để Claude tự chọn tool trong vòng lặp agent bạn viết.
- `part1/lesson06/ClaudeQueryModel.java`: model thật cho `query()` thu nhỏ của bài 06 và 07.
- `part1/lesson09/ClaudeApi.java`: nối các kiểu Messages API thu gọn của bài 09 với API thật (dùng ở bài 09, 10, 12).
- `Main.java`: điểm chạy chung.

Các adapter này giữ nguyên câu trả lời gốc của Claude và chỉ nối thêm lượt mới vào hội thoại, nên code bài tập của bạn chỉ làm việc với các kiểu đơn giản.

Ở Phần 1, bài 03 (Quick Check-In) không có nội dung chuyên môn nên không có bài tập; các bài 01, 02, 04 tới 12 đều có.

## Chấm offline

Đứng trong thư mục `java-app`. Trên Windows dùng `mvnw.cmd` thay cho `./mvnw`.

```bash
./mvnw -q compile exec:java                                  # chấm tất cả các bài
./mvnw -q compile exec:java -Dexec.args="p2"                 # chấm cả Phần 2
./mvnw -q compile exec:java -Dexec.args="p2-01"              # chỉ chấm bài 01 của Phần 2
./mvnw -q compile exec:java -Dexec.args="p2-01 --solution"   # chấm lời giải mẫu để đối chiếu
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
   ./mvnw -q compile exec:java -Dexec.args="p2-01 --live"              # code của bạn
   ./mvnw -q compile exec:java -Dexec.args="p2-01 --live --solution"   # lời giải mẫu
   ```

Phần nào bạn chưa làm sẽ báo ⏳ và bỏ qua, không gọi API cho phần đó. Cuối mỗi lần chạy có dòng 💰 tổng kết số lần gọi và số token qua SDK; các lời gọi REST thô (`common/RawApi.java`) in usage ngay tại chỗ và không cộng vào dòng này.

Những gì mỗi bài làm với Claude:

### Phần 1

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

### Phần 2

- **Bài 01:** Claude tách nhu cầu "giảm một nửa thời gian phân loại ticket" thành các capability kèm hợp đồng đầu vào/đầu ra; `chooseTier()` của bạn chọn single call, workflow hay agent cho từng cái, `untraced()` bắt tính năng thừa; sau đó so cách bạn nhận ra hạ tầng đội lốt hành vi với nhận xét của Claude.
- **Bài 02:** tính năng hỏi đáp chính sách hoàn tiền có hợp đồng JSON. Output thô (chỉ dặn bằng lời) được `formatErrors()` và `classify()` của bạn chấm, kể cả lời từ chối bằng chữ với end_turn; sau đó structured outputs, grounding và behavior signal trên một tập câu hỏi gán nhãn.
- **Bài 03:** đo cùng một câu hỏi theo kiểu sync và streaming (thời gian tới chữ đầu tiên so với thời gian chờ trọn câu); `chooseMode()` và `maxSequentialCalls()` của bạn quyết định theo ngân sách độ trễ.
- **Bài 04:** API key sai cho lỗi 401 thật mà `retryWithBackoff()` của bạn phải ném ngay (không tốn token); model không tồn tại khiến `withFailover()` chuyển sang model dự phòng.
- **Bài 05:** request HTTP thô do `buildRequest()` của bạn dựng được gửi bằng `java.net.http` (không qua SDK); một key sai cho 401 thật để `onError()` của bạn báo ngay.
- **Bài 06:** một bộ ví dụ phân loại ticket đóng băng chạy trên model hiện tại và model ứng viên (`CANDIDATE_MODEL`, mặc định `claude-haiku-5-5`); `regressions()` và `safeToCutOver()` của bạn quyết định có chuyển không, `health()` tính p95 độ trễ, token và tỉ lệ lỗi từ log thật.
- **Bài 07:** body do `toBody()` của bạn dựng được gửi thẳng tới REST endpoint: Claude quên tên bạn khi không gửi lại lịch sử, nhớ khi `appendExchange()` gửi lại; request có lượt đầu là assistant bị chặn.
- **Bài 08:** vòng đọc, chạy, nối, gọi lại với response JSON thô: `finalText()`, `toolCalls()` và `next()` của bạn đọc từng block và stop_reason, `fullPromptTokens()` đọc usage.
- **Bài 09:** SSE thô (`stream: true`) đi qua `eventNames()`, `validOrder()` và `assemble()` của bạn, in các mảnh partial JSON thật; một ảnh 5 hình tròn tự vẽ được gửi base64 cho Claude đếm.
- **Bài 10:** adaptive thinking với display summarized và `output_config.effort`; hai request sai (effort ở gốc, budget_tokens) được gửi thật để xem model hiện tại phản hồi thế nào; `validate()` của bạn kiểm tra trước theo từng model của bài học.
- **Bài 11:** cùng một system prompt dài có `cache_control` được gửi hai lần để thấy token ghi cache rồi đọc cache; nhét giờ hiện tại vào system để thấy cache bị phá; `worthCaching()` của bạn so 5 phút và 1 giờ.
- **Bài 12:** vài ticket được phân loại bằng lời gọi đồng bộ thật; `batchCost()` của bạn tính nếu chạy cùng việc qua batch thì tốn bao nhiêu.
- **Bài 13:** một Message Batch thật gồm 4 ticket được gửi, chờ tối đa 3 phút, tải kết quả JSONL; `writeBack()` của bạn ghép theo custom_id (batch chưa xong thì in id để xem sau).
- **Bài 14:** chỉ có bộ chấm offline (phần chạy thật cần tài khoản AWS có quyền Bedrock).
- **Bài 15:** cùng một POST được gửi với header đầy đủ, thiếu key, thiếu version, key sai và body hỏng; `triage()` của bạn đọc từng status thật.
- **Bài 16:** tự dựng body JSON có một ảnh Base64, xem kích thước body, phát hiện thiếu max_tokens trước khi gửi, rồi `extractAnswer()` của bạn đọc câu trả lời từ JSON thô.
- **Bài 17:** 5 câu hỏi độc lập được hỏi tuần tự rồi đồng thời (`runConcurrent()` với `CompletableFuture`), so thời gian thực.
- **Bài 18:** 8 lời gọi fan out với trần 3 cùng lúc qua `gatherBounded()` của bạn (in đỉnh đồng thời đo được), một nhánh lỗi thật được `gatherSettled()` cô lập, và một câu trả lời stream được nối từ delta.
- **Bài 19:** `diff()` của bạn tạo diff giữa hai phiên bản system prompt, rồi Claude review như một pull request.
- **Bài 20:** chỉ có bộ chấm offline.
- **Bài 21:** vòng tạo, kiểm tra, hỏi lại qua `generateValidated()` của bạn với một validator nghiệp vụ thật, rồi Claude làm trợ lý review một đoạn code tích hợp (quyết định duyệt vẫn là của bạn).
- **Bài 22:** chỉ có bộ chấm offline.
- **Bài 23:** cùng một câu hỏi gửi qua raw API hai lần, không có quy tắc và có quy tắc trong system, để thấy raw API chỉ biết đúng những gì bạn gửi; `loadedInstructions()` và `reaches()` của bạn giải thích vì sao.
- **Bài 24:** request do `buildRequest()` của bạn dựng đưa CLAUDE.md thành một lượt user đứng trước câu hỏi; gửi lại khi không nạp CLAUDE.md để thấy quy tắc "bị bỏ qua" thật ra là chưa được nạp.
- **Bài 25:** một tài liệu có cài lệnh prompt injection được gửi theo cách sai (dán lẫn vào chỉ dẫn) và cách đúng (`buildRequest()` với thẻ, sau khi `redact()` che dữ liệu nhạy cảm); `validateAction()` của bạn kiểm tra đề xuất hành động của Claude trước khi làm.

Cấu hình:

- Model mặc định `claude-opus-5-5`. Đổi bằng biến môi trường `CLAUDE_MODEL`, ví dụ `claude-haiku-5-5` để rẻ hơn.
- Mọi lời gọi dùng effort `low`, vì đây là các việc ngắn.
- Mọi lời gọi bật fallback phía server (`fallbacks: "default"`): nếu bộ lọc an toàn từ chối một yêu cầu bình thường, server tự chuyển sang model dự phòng.

## Thêm bài mới

1. Tạo package `partN/lessonXX` với các file như trên.
2. Thêm `CHECKS.put("pN-XX", partN.lessonXX.Check::run);` (và `LIVE.put(...)` nếu bài có phần chạy với Claude thật) vào `Main.java`.
