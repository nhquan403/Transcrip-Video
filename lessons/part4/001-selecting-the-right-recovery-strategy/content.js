window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Khi gọi Claude bị lỗi, đừng phản xạ "thử lại". Hãy <strong>xác định loại lỗi trước</strong>,
rồi loại lỗi sẽ tự chỉ ra cách xử lý: <strong>chờ rồi thử lại</strong>, <strong>sửa request</strong>, hay <strong>sửa prompt / dùng phương án dự phòng</strong>.
Thử lại một lỗi không bao giờ tự hết là cái bẫy lớn nhất.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Retry with backoff</strong>: gửi lại request sau một khoảng chờ <strong>tăng dần</strong> mỗi lần, để không "dội" thêm vào hệ thống đang quá tải.</li>
  <li><strong>Fallback</strong>: phương án B tự động: đổi sang model khác, đường xử lý đơn giản hơn, hoặc kết quả đã cache, để người dùng vẫn nhận được thứ gì đó.</li>
  <li><strong>Escalation</strong>: chuyển cho người hoặc kênh hỗ trợ khi không cách tự động nào hợp, kèm <strong>request ID</strong> và loại lỗi.</li>
  <li><strong>Transient error</strong> (lỗi tạm thời): tự hết sau một lúc: 429, lỗi 5xx, rớt kết nối.</li>
  <li><strong>Permanent error</strong> (lỗi cố định): gửi lại y nguyên vẫn hỏng: 400, 401, 403, 413.</li>
  <li><strong>retry-after header</strong>: server nói thẳng cho bạn phải chờ bao lâu (thường đi kèm 429).</li>
</ul>

<h3>Ba cái thùng: mọi lỗi đều rơi vào một trong ba</h3>
<div class="box">🚗 <strong>Hình dung thế này:</strong> Bạn lái xe đi giao hàng và bị kẹt.
<strong>Kẹt xe</strong> (lỗi tạm thời): chờ một chút rồi đi tiếp. <strong>Sai địa chỉ</strong> (lỗi cố định): chờ bao lâu cũng vô ích, phải sửa địa chỉ.
<strong>Giao đúng chỗ nhưng nhầm hàng</strong> (lỗi ở output của model): đường xá và địa chỉ đều ổn, vấn đề nằm ở thứ bạn mang tới.</div>
<ol>
  <li><strong>Retry + backoff</strong> cho lỗi tích hợp tạm thời: rớt kết nối, <strong>429</strong>, mọi lỗi <strong>5xx</strong>. Chờ lâu dần giữa các lần, và <strong>làm theo retry-after</strong> nếu có.</li>
  <li><strong>Sửa request</strong> cho lỗi cố định: <strong>400, 401, 413</strong>. Đổi payload, key hoặc kích thước rồi mới gửi bản đã sửa.</li>
  <li><strong>Sửa prompt hoặc fallback</strong> cho lỗi output của model, loại lỗi đi kèm <strong>HTTP 200</strong>: chỉnh prompt, nâng giới hạn, hoặc đổi model.</li>
</ol>
<p>Thói quen quan trọng nhất: <strong>chọn cách xử lý theo loại lỗi, không theo "cảm giác" của triệu chứng</strong>. Phản hồi chậm và bị rate limit đều khiến bạn phải chờ,
nhưng cái đầu chỉ cần kiên nhẫn, cái sau cần một lịch backoff thật sự. Retry một request hỏng định dạng thì <em>cảm giác</em> như đang làm gì đó, nhưng không sửa được gì và còn đốt tiền.</p>

<h3>Backoff: mạnh nhưng hay bị dùng sai</h3>
<ul>
  <li><strong>Exponential backoff</strong>: lần đầu chờ ít, lần sau chờ lâu hơn, rồi lâu hơn nữa, để server có thời gian hồi phục.</li>
  <li>Gặp <strong>429</strong>: đừng tự đoán thời gian chờ, hãy <strong>làm đúng theo retry-after</strong>.</li>
  <li>Luôn <strong>đặt giới hạn số lần thử</strong>, để lỗi kéo dài thì báo to ra ngoài thay vì lặp vô tận.</li>
  <li>Giới hạn then chốt: <strong>backoff chỉ dành cho lỗi tạm thời</strong>, không bao giờ cho bad request hay key sai.</li>
</ul>

<h3>SDK đã làm sẵn gì, bạn phải tự lo gì?</h3>
<ul>
  <li>SDK chính thức <strong>tự retry</strong> đúng một nhóm lỗi: <strong>lỗi kết nối, 429, 5xx</strong>, có exponential backoff và tôn trọng retry-after.</li>
  <li>Mặc định chỉ <strong>vài lần retry</strong>; bạn có thể tăng, giảm hoặc tắt.</li>
  <li>SDK <strong>không</strong> retry lỗi 4xx cố định (400, 401, 403, 413): những lỗi đó trả thẳng về cho bạn.</li>
  <li><strong>429 là lỗi 4xx duy nhất được coi là tạm thời</strong>, nên nó nằm trong nhóm được retry.</li>
  <li><strong>409 conflict</strong> là trường hợp riêng: tài nguyên đã đổi "dưới chân" bạn, phải <strong>giải quyết xung đột trước</strong>, rồi mới retry.</li>
</ul>

<h3>Sửa lỗi cố định: phải thay đổi thứ gì đó trước</h3>
<ul>
  <li><strong>400</strong>: đọc trường <code>message</code>, nó thường chỉ thẳng vào phần bị sai, rồi sửa.</li>
  <li><strong>401 / 403</strong>: vấn đề là <strong>credentials hoặc quyền</strong>: sửa key hoặc cấp quyền.</li>
  <li><strong>413</strong>: request quá lớn: thu nhỏ, hoặc chia việc qua <strong>Batches API</strong> nếu khối lượng nhiều.</li>
  <li>Không trường hợp nào ở trên mà <strong>gửi lại y nguyên lại tự chạy được</strong>.</li>
</ul>

<h3>Lỗi đi kèm HTTP 200: 4 cách sửa đáng thuộc lòng</h3>
<ul>
  <li><strong><code>max_tokens</code></strong>: câu trả lời bị cắt ở giới hạn bạn đặt → <strong>tăng max_tokens</strong> hoặc cho model viết tiếp từ chỗ dừng.</li>
  <li><strong><code>model_context_window_exceeded</code></strong>: chạm trần context window của model (không phải giới hạn bạn đặt) → <strong>giảm input, tỉa lịch sử, compact</strong>.</li>
  <li><strong><code>refusal</code></strong>: Claude từ chối vì chính sách → đọc <strong>stop_details</strong> để biết lý do, chỉnh prompt hoặc fallback sang model khác.</li>
  <li><strong>Câu trả lời "sạch" nhưng sai</strong>: là vấn đề <strong>prompt và eval</strong>; retry mạng không bao giờ sửa được.</li>
</ul>

<h3>Hai lối thoát cuối: fallback và escalation</h3>
<ul>
  <li><strong>Fallback</strong> giữ hệ thống <strong>tự chạy tiếp</strong>: model khác, đường đơn giản hơn, kết quả cache. Người dùng có câu trả lời thay vì trang lỗi.</li>
  <li><strong>Escalation</strong> là thừa nhận <strong>cần một người vào cuộc</strong>: chuyển cho người hoặc kênh hỗ trợ, kèm <strong>request ID + loại lỗi</strong> để người nhận dựng lại chuyện gì đã xảy ra.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có <strong>429, 529, 500, 503, timeout, "connection reset"</strong> → đáp án đúng có <strong>backoff</strong> (và retry-after với 429), có giới hạn số lần.</li>
  <li>Đề có <strong>400, 401, 403, 413</strong> → đáp án đúng là <strong>sửa request / key / kích thước</strong>, không phải retry.</li>
  <li>Đề có <strong>HTTP 200 nhưng</strong> câu trả lời bị cắt, bị từ chối, hay sai → đáp án nằm ở <strong>max_tokens, prompt, eval hoặc fallback model</strong>.</li>
  <li>Đề hỏi "không cách tự động nào hợp" → <strong>escalation kèm request ID</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Retry 401 vài lần cho chắc" → <strong>sai</strong>, key sai thì thử bao nhiêu cũng vậy.</li>
  <li>"SDK tự retry mọi lỗi" → <strong>sai</strong>, chỉ lỗi kết nối, 429 và 5xx.</li>
  <li>"Câu trả lời sai thì tăng số lần retry" → <strong>sai</strong>, đó là lỗi prompt/eval.</li>
  <li>"Retry không giới hạn cho tới khi được" → <strong>sai</strong>, phải có trần số lần để lỗi được báo ra ngoài.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Kẹt xe thì chờ, sai địa chỉ thì sửa, nhầm hàng thì đổi cách làm.</strong> Thứ tự luôn là: <strong>phân loại → chọn thùng → mới hành động</strong>.</p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
