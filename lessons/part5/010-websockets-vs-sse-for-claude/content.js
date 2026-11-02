window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> <strong>WebSocket</strong> là kênh hai chiều, luôn mở; <strong>SSE</strong> là luồng một chiều từ server về client trên HTTP thường.
Streaming của Claude dùng <strong>SSE trên HTTPS, không bao giờ là WebSocket</strong>. Khi stream, hãy chuẩn bị cho kết nối rớt:
timeout, retry lỗi tạm thời, bỏ qua ping nhưng xử lý error event.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>WebSocket</strong>: kết nối <strong>persistent</strong>, <strong>full-duplex</strong>: cả client lẫn server gửi bất cứ lúc nào trên cùng một kênh.</li>
  <li><strong>Server-sent events (SSE)</strong>: luồng <strong>one-way</strong>, server đẩy event qua một HTTP response; client không gửi ngược được trên kênh đó.</li>
  <li><strong>Full-duplex</strong>: dữ liệu chạy cả hai chiều cùng lúc, như cuộc gọi điện thoại.</li>
  <li><strong>Handshake</strong>: bước bắt tay mở kết nối mà WebSocket cần, SSE thì không.</li>
  <li><strong>Partial message</strong>: phần đã nhận được trước khi stream bị đứt giữa chừng.</li>
  <li><strong>Ping event</strong>: tín hiệu keep-alive, không có payload thật, cứ bỏ qua.</li>
  <li><strong>Error event</strong>: báo có sự cố giữa stream, <strong>phải xử lý</strong>.</li>
</ul>

<h3>WebSocket và SSE: hai "giống loài" khác nhau</h3>
<div class="box">📻 <strong>Hình dung thế này:</strong> WebSocket giống <strong>cuộc gọi điện thoại</strong>: hai người nói qua nói lại bất cứ lúc nào.
SSE giống <strong>nghe đài radio</strong>: đài phát liên tục về phía bạn, bạn chỉ nghe chứ không nói lại qua chính kênh đó được.
Claude streaming là <strong>radio</strong>, không phải điện thoại.</div>
<ul>
  <li><strong>WebSocket</strong>: hai chiều, luôn mở, hợp với ứng dụng hai bên đẩy tin liên tục (live chat, collaborative editing, game nhiều người chơi). Cái giá: setup nhiều hơn, có protocol riêng và <strong>handshake</strong>.</li>
  <li><strong>SSE</strong>: đơn giản hơn, một chiều server → client, chạy trên <strong>HTTP thường</strong>, không handshake đặc biệt; vì trông như HTTP response bình thường nên thường <strong>đi qua firewall và proxy dễ dàng</strong>.</li>
  <li>Điểm chốt: <strong>Claude API dùng SSE cho streaming</strong>, không dùng WebSocket.</li>
</ul>

<h3>Phá bỏ "huyền thoại WebSocket"</h3>
<ul>
  <li>Nhiều người nghĩ Claude stream token theo thời gian thực thì chắc có WebSocket phía sau. <strong>Không có.</strong></li>
  <li>Bạn <strong>không bao giờ mở WebSocket</strong> để nói chuyện với Claude API. Mọi call, stream hay không, đều là <strong>HTTPS request thường tới cùng endpoint</strong>.</li>
  <li>Streaming chỉ đổi <strong>cách response trả về</strong>, không đổi loại kết nối bạn mở.</li>
  <li>Một kiến trúc giả định "socket hai chiều tới Claude" là xây trên <strong>tiền đề sai</strong>.</li>
  <li>WebSocket vẫn hữu ích ở chỗ khác (đồng bộ từng phím gõ, game, chat server), nhưng gọi Claude là bài toán <strong>request → response</strong>, muốn từng phần thì bật streaming. "Đúng công cụ, sai chỗ".</li>
</ul>

<h3>Chuẩn bị cho stream bị rớt</h3>
<ul>
  <li><strong>Timeout</strong>: SDK đặt request timeout khá rộng, khoảng <strong>10 phút</strong> mặc định, nhưng generation lớn vẫn có thể chạy lâu.</li>
  <li>Nếu bạn xin một response rất lớn mà <strong>không stream</strong>, SDK có thể <strong>từ chối call</strong> vì ước tính request chặn sẽ vượt timeout. Cách sửa: <strong>stream</strong>, để dữ liệu chảy và kết nối sống.</li>
  <li>Kết nối rớt giữa chừng → bạn không có response hoàn chỉnh, chỉ có <strong>partial message</strong>. Đừng giả định stream luôn chạy tới cuối.</li>
  <li><strong>Retries with backoff</strong>: SDK tự retry lỗi tạm thời, mặc định vài lần (a couple of times).</li>
</ul>

<h3>Đọc stream một cách phòng thủ</h3>
<ul>
  <li><strong>Ping</strong>: keep-alive, chỉ để kết nối không bị idle → <strong>bỏ qua</strong>.</li>
  <li><strong>Error event</strong>: có thể đến ngay giữa stream → <strong>không được bỏ qua</strong>: log, báo ra ngoài, có thể retry request.</li>
  <li><strong>Event type lạ</strong>: <strong>skip thay vì crash</strong>, vì loại event mới có thể được thêm theo thời gian.</li>
</ul>

<h3>Phân loại lỗi trước, rồi mới hành động</h3>
<ul>
  <li><strong>Transient</strong>: timeout, rate limit, network blip, lỗi server 5xx → <strong>retry với exponential backoff</strong>.</li>
  <li><strong>Permanent</strong>: bad request, schema hỏng, auth failure → retry vô ích, chỉ lặp lại lỗi và <strong>đốt ngân sách</strong>; phải <strong>sửa request</strong>.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề đề xuất "mở WebSocket tới Claude để stream token" → đáp án đúng: <strong>sai tiền đề</strong>, Claude dùng <strong>SSE trên HTTPS</strong>.</li>
  <li>Đề có "response rất lớn, non-streaming bị từ chối / timeout" → đáp án: <strong>chuyển sang streaming</strong>.</li>
  <li>Đề có "reader crash vì gặp ping hoặc event lạ" → đáp án: <strong>bỏ qua ping, skip event lạ, xử lý error event</strong>.</li>
  <li>Đề có lỗi 400 / schema hỏng / auth failure giữa lúc stream → <strong>sửa request</strong>; còn timeout / 429 / 5xx → <strong>retry + backoff</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Real-time token thì chắc chắn là WebSocket" → <strong>sai</strong>, Claude dùng SSE một chiều.</li>
  <li>"Error event cũng như ping, bỏ qua được" → <strong>sai</strong>, error cần xử lý thật.</li>
  <li>"Stream đã bắt đầu thì chắc chắn chạy tới cuối" → <strong>sai</strong>, có thể rớt và chỉ còn partial message.</li>
  <li>"Retry mọi lỗi cho chắc" → <strong>sai</strong>, lỗi permanent retry chỉ tốn tiền.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Claude là đài radio, không phải điện thoại.</strong> Nghe ping thì lờ đi, nghe error thì xử lý, gặp lạ thì bỏ qua.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
