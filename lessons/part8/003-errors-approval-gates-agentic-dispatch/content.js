window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Trong <strong>agentic dispatch</strong>, Claude chọn tool, còn harness của bạn chạy và trả kết quả về. Khi tool lỗi, <strong>đừng để exception làm sập vòng lặp</strong>:
trả lỗi về cho Claude bằng <strong>tool_result với is_error: true</strong> để nó tự xoay xở. Những lệnh nguy hiểm thì chặn bằng <strong>approval gate</strong> trong code bạn kiểm soát, không giao cho model tự giác.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Agentic dispatch</strong>: <strong>model</strong> (không phải code của bạn) chọn tool mỗi lượt; harness chạy lựa chọn đó và đưa kết quả về.</li>
  <li><strong>Execution loop</strong>: vòng lặp quanh Claude: xem <strong>stop_reason</strong> → chạy tool_use → nối tool_result → gọi lại, cho đến khi Claude xong.</li>
  <li><strong>Observation</strong>: kết quả tool trả về, được đưa vào request kế tiếp.</li>
  <li><strong>is_error: true</strong>: cờ trong tool_result báo cho Claude biết lời gọi đã lỗi, kèm lý do.</li>
  <li><strong>Approval gate</strong>: chốt chặn tạm dừng một lời gọi tác động lớn để xác nhận <strong>trước khi</strong> chạy; nằm trong runtime.</li>
  <li><strong>PreToolUse hook</strong>: hook trong Agent SDK harness, kiểm tra lời gọi và <strong>chặn hoặc cho phép</strong> trước khi tool chạy.</li>
</ul>

<h3>Agentic dispatch: model cầm lái, harness thực thi</h3>
<ul>
  <li><strong>Kiểu cũ (hard-coded branch)</strong>: code dùng if-then cố định, kiểu "user hỏi thời tiết thì gọi weather tool". Dễ đoán nhưng <strong>giòn</strong> và mù với sắc thái trong request.</li>
  <li><strong>Agentic dispatch</strong>: Claude đọc request và <strong>tool descriptions</strong>, chọn tool hợp với bước hiện tại. Code chạy tool, lấy observation, đưa vào request kế tiếp.</li>
  <li>Đánh đổi: mất một phần <strong>tính tất định</strong>, đổi lại xử lý được những request bạn chưa từng viết nhánh cho. Với tác vụ mở, sự linh hoạt đó chính là mục đích.</li>
  <li>Việc của bạn chuyển từ "quyết định chạy gì" sang <strong>"chạy đáng tin cậy thứ model đã chọn và báo kết quả"</strong>.</li>
</ul>
<div class="box">🧑‍✈️ <strong>Hình dung thế này:</strong> Claude là <strong>tài xế</strong>, harness là <strong>chiếc xe</strong>. Tài xế chọn rẽ đâu; xe phải chạy đúng lệnh và báo lại "đường này bị chặn" thay vì tự tắt máy giữa đường.
Còn những chỗ nguy hiểm như đường ray tàu hỏa thì có <strong>barie</strong> (approval gate) do bạn dựng, không phụ thuộc tài xế có tự giác dừng hay không.</div>

<h3>Lỗi tool: trả về, đừng ném ra</h3>
<p>Lỗi kinh điển: tool throw exception, exception nổi lên và giết cả vòng lặp. Thay vào đó, đặt <strong>nội dung lỗi vào tool_result</strong> và <strong>is_error: true</strong>.
Claude thấy lời gọi đã lỗi <strong>và thấy vì sao</strong>, nên có thể <strong>retry với tham số khác</strong>, <strong>đổi cách làm</strong>, hoặc <strong>báo người dùng</strong>. Lỗi trả về giữ vòng lặp sống; exception thì kết thúc nó.</p>
<ul>
  <li><strong>Tool execution error</strong>: tool chạy và thật sự lỗi (timeout, trạng thái sai, thiếu record) → trả lý do với is_error: true, viết <strong>có hướng dẫn</strong>, ví dụ "rate limit exceeded, retry after 60 seconds", không chỉ chữ "failed".</li>
  <li><strong>Malformed parameter call</strong>: Claude gửi tham số không dùng được → trả lỗi, Claude sửa và thử lại, thường trong vài lần. Cách sửa lâu dài: <strong>description sắc hơn</strong> hoặc <strong>strict tool use</strong>.</li>
  <li><strong>Server tool error</strong>: lỗi phía Anthropic (ví dụ web search bị rate limit, input không hợp lệ, vượt số lần dùng) → Claude <strong>tự xử lý trong suốt</strong>; bạn <strong>không</strong> set is_error, không dựng tool_result. Chỉ lỗi <strong>client tool</strong> mới về tay bạn.</li>
</ul>

<h3>Luật định dạng message (sai thường ra lỗi 400)</h3>
<ul>
  <li>tool_result phải <strong>đi ngay sau</strong> tool_use mà nó trả lời, không chèn message nào ở giữa.</li>
  <li>Trong user turn, các tool_result block phải <strong>đứng đầu</strong>, trước mọi text. Text đặt trước → request bị từ chối.</li>
  <li><strong>Không có role "tool" hay "function"</strong> riêng: tool_result nằm trong user message, tool_use nằm trong assistant message.</li>
</ul>

<h3>Approval gate cho hành động tác động lớn</h3>
<ul>
  <li>Hành động tác động lớn: <strong>xóa dữ liệu, chuyển tiền, email cho khách hàng</strong>.</li>
  <li>Cách 1: gate trong <strong>runtime</strong>: dừng lời gọi trong loop, yêu cầu xác nhận <strong>trước khi</strong> chạy, không phải sau.</li>
  <li>Cách 2: trong <strong>Agent SDK harness</strong>, dùng <strong>PreToolUse hook</strong> để chặn hoặc cho phép trước khi tool chạy.</li>
  <li>Điều không nên làm: <strong>để Claude tự kiểm soát</strong> hành động nguy hiểm. Gate phải nằm trong <strong>code bạn kiểm soát</strong>.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có tool lỗi làm cả agent loop sập → đáp án: <strong>bắt lỗi, trả tool_result với is_error: true</strong> và thông điệp rõ ràng.</li>
  <li>Đề hỏi xử lý lỗi web search thế nào → <strong>không cần làm gì</strong>, server tool error do Claude xử lý.</li>
  <li>Đề có lỗi 400 khi gửi kết quả tool → kiểm tra <strong>tool_result đứng đầu, liền sau tool_use</strong>, không dùng role "tool".</li>
  <li>Đề có xóa dữ liệu / chuyển tiền tự động → <strong>approval gate trong runtime</strong> hoặc <strong>PreToolUse hook</strong>, không phải "dặn trong system prompt".</li>
  <li>Đề so sánh if-then routing với để model chọn tool → <strong>agentic dispatch</strong>: linh hoạt hơn, kém tất định hơn.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Tool lỗi thì throw exception cho rõ" → <strong>sai</strong>, nó giết vòng lặp; Claude không thấy lỗi để tự sửa.</li>
  <li>"Thông báo lỗi chỉ cần ghi failed" → <strong>sai</strong>, phải có hướng dẫn để Claude biết làm gì tiếp.</li>
  <li>"Server tool lỗi thì set is_error như client tool" → <strong>sai</strong>, Claude tự xử lý; code đó không bao giờ chạy.</li>
  <li>"Dặn Claude cẩn thận trước khi xóa là đủ" → <strong>sai</strong>, gate phải được ép trong code.</li>
  <li>"Gửi kết quả tool bằng role tool" → <strong>sai</strong>, API này không có role tool/function.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Model chọn, harness chạy; lỗi thì trả về chứ không ném ra; việc nguy hiểm thì có barie do bạn dựng.</strong></p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
