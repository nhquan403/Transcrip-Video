window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Streaming từ Claude chỉ là <strong>server-sent events (SSE)</strong> chảy trên <strong>một HTTPS response bình thường</strong>.
Các event đến theo <strong>thứ tự cố định</strong> (start → deltas → stop), bạn cộng dồn delta vào buffer để dựng lại message.
Riêng tham số tool đến dưới dạng <strong>partial JSON</strong>: chỉ parse khi content block đã đóng.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>stream: true</strong>: cờ yêu cầu server gửi câu trả lời từng phần khi đang sinh ra.</li>
  <li><strong>Server-sent events (SSE)</strong>: chuẩn đơn giản, server đẩy các event có tên xuống kết nối đang mở, <strong>một chiều</strong> từ server tới client.</li>
  <li><strong>Buffered response</strong>: mặc định, server sinh xong toàn bộ rồi trả về một lần.</li>
  <li><strong>message_start</strong>: event mở đầu, chứa message object với <strong>content rỗng</strong>.</li>
  <li><strong>content_block_delta</strong>: event mang từng mẩu output (text hoặc một phần tool input).</li>
  <li><strong>message_delta</strong>: event về cuối, mang thông tin tổng như <strong>stop reason</strong> và <strong>token usage</strong>.</li>
  <li><strong>input_json_delta</strong>: mẩu <strong>partial JSON</strong> của tham số tool.</li>
  <li><strong>message_stop</strong>: event đóng, báo response đã xong.</li>
</ul>

<h3>Ba nền tảng: connection, cờ stream, SSE</h3>
<ul>
  <li><strong>Connection</strong>: một HTTP request mã hoá bình thường, giống trình duyệt tải trang. Không có protocol lạ, không có socket đặc biệt.</li>
  <li><strong>Streaming mode</strong>: mặc định là trả một cục. Đặt <code>stream</code> = true để nhận từng phần.</li>
  <li><strong>Định dạng</strong>: Claude dùng <strong>server-sent events</strong>.</li>
  <li>Bật streaming gần như <strong>không đổi gì ở request</strong>: cùng endpoint, cùng body, thêm cờ. Thứ thay đổi là <strong>response</strong>: server giữ một HTTP response mở và ghi dần vào đó; mỗi phần là một event có nhãn kèm JSON payload nhỏ.</li>
  <li>Bạn <strong>không polling</strong>, cũng <strong>không mở kênh thứ hai</strong>. Chỉ đọc một response khi server đang viết nó.</li>
</ul>

<h3>Buffered vs streaming: vì sao nên stream?</h3>
<div class="box">📺 <strong>Hình dung thế này:</strong> Buffered giống tải xong cả bộ phim rồi mới xem: đơn giản, nhưng phải ngồi chờ màn hình trống.
Streaming giống xem phim online: hình hiện ra ngay, và kết nối luôn có dữ liệu chạy nên không bị "ngắt vì im lặng quá lâu".</div>
<ul>
  <li><strong>Buffered</strong>: gọi, chờ, nhận một object hoàn chỉnh. Rất dễ xử lý, nhưng không thấy gì cho tới khi xong.</li>
  <li><strong>Streaming</strong> cải thiện hai thứ: <strong>perceived speed</strong> (người dùng thấy chữ hiện ngay thay vì spinner) và <strong>câu trả lời dài</strong> (một call chặn có thể dính <strong>timeout</strong>, còn streaming giữ dữ liệu chảy liên tục nên kết nối không bị bỏ).</li>
</ul>

<h3>Thứ tự event cố định: start → deltas → stop</h3>
<ol>
  <li><strong>message_start</strong>: "dấu mở ngoặc". Có message object nhưng <strong>content rỗng</strong>, đừng tìm text ở đây.</li>
  <li>Các <strong>content block events</strong>: payload thật nằm ở đây. Ở giữa là rất nhiều <strong>content_block_delta</strong>, mỗi cái một mẩu text hoặc một lát tool input.</li>
  <li><strong>message_stop</strong>: "dấu đóng ngoặc". Nhận được là response đã xong, kết nối có thể đóng.</li>
</ol>
<p>Vì thứ tự luôn cố định, code của bạn <strong>luôn biết event nào tới tiếp</strong>, không phải đoán còn dữ liệu hay không.</p>

<h3>Ráp lại response và ba loại delta</h3>
<ul>
  <li>Khi <strong>message_start</strong> tới: tạo buffer rỗng. Mỗi delta tới: <strong>append</strong> mẩu text vào buffer.</li>
  <li><strong>content_block_stop</strong>: block đó xong. <strong>message_stop</strong>: buffer chứa response hoàn chỉnh, đúng y như bản buffered.</li>
  <li>SDK chính thức đã <strong>cộng dồn giúp</strong> và trả text hoàn chỉnh, nhưng hiểu cơ chế bên dưới giúp bạn debug.</li>
  <li>Ba "hương vị" delta: <strong>content_block_delta</strong> cho output, <strong>message_delta</strong> cho phần tổng kết (stop reason, usage), <strong>input_json_delta</strong> cho tham số tool.</li>
</ul>

<h3>Partial JSON: đừng parse sớm</h3>
<ul>
  <li>Khi Claude gọi tool, tham số <strong>không đến trong một object gọn</strong> mà đến thành nhiều mảnh partial JSON qua nhiều delta.</li>
  <li>Một mảnh dở dang <strong>không phải JSON hợp lệ</strong>; parse giữa chừng sẽ lỗi.</li>
  <li>Quy tắc: <strong>gom các mảnh</strong>, chờ <strong>content block stop</strong>, rồi <strong>parse một lần</strong>. Lúc đó tool input chắc chắn là object hoàn chỉnh, hợp lệ.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề hỏi streaming của Claude dùng cơ chế gì → đáp án: <strong>SSE trên một HTTPS response</strong>, cùng endpoint, thêm cờ stream.</li>
  <li>Đề có "parse tool input bị lỗi khi đang stream" → đáp án: <strong>gom input_json_delta, parse sau content_block_stop</strong>.</li>
  <li>Đề hỏi stop reason / token usage nằm ở event nào → <strong>message_delta</strong>.</li>
  <li>Đề có "câu trả lời dài bị timeout" hoặc "người dùng phải nhìn spinner lâu" → đáp án: <strong>bật streaming</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Lấy text đầu tiên từ message_start" → <strong>sai</strong>, content của nó rỗng; text nằm ở các delta.</li>
  <li>"Parse từng input_json_delta ngay khi nhận" → <strong>sai</strong>, mảnh dở dang không phải JSON hợp lệ.</li>
  <li>"Streaming cần endpoint khác hoặc polling" → <strong>sai</strong>, cùng endpoint, một response được ghi dần.</li>
  <li>"Event có thể đến lộn xộn" → <strong>sai</strong>, thứ tự được đảm bảo cố định.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Mở ngoặc, nhồi delta, đóng ngoặc.</strong> Tool JSON thì <strong>gom đủ rồi mới parse</strong>.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
