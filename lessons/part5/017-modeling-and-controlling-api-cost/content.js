window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Chi phí API chỉ là <strong>token × giá</strong>, cộng lại qua input, output và cache. <strong>Output thường là phần đắt nhất</strong>.
Hãy tìm <strong>dominant driver</strong> (chỗ tốn nhiều nhất) rồi kéo bốn cần gạt: <strong>tier, prompt size, caching, batch</strong> — và làm việc này <strong>trước khi ship</strong>.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Per-token pricing</strong>: mỗi token vào và ra đều có giá; chi phí tăng tỷ lệ thuận với số token.</li>
  <li><strong>Input rate / Output rate</strong>: giá token model đọc / token model viết; output rate <strong>cao hơn nhiều lần</strong>.</li>
  <li><strong>Cache read</strong>: bằng một phần nhỏ giá input gốc. <strong>Cache write</strong>: cao hơn giá input một chút.</li>
  <li><strong>Dominant driver</strong>: phần chiếm nhiều token/tiền nhất, thứ cần tối ưu đầu tiên.</li>
  <li><strong>Tier selection</strong>: chọn tier nhẹ nhất vẫn đạt quality.</li>
  <li><strong>Batch processing</strong>: gửi việc không gấp qua đường batch để được giảm giá lớn.</li>
  <li><strong>count_tokens</strong>: đo chính xác input trước khi gọi, không tốn tiền generation.</li>
</ul>

<h3>Ba sự thật về giá và công thức một lần gọi</h3>
<ul>
  <li><strong>Theo token</strong>: chi phí = token × giá.</li>
  <li><strong>Output đắt hơn</strong>: trên mọi model hiện tại, output đắt hơn input <strong>vài lần</strong> cho cùng số token.</li>
  <li><strong>Caching đổi giá</strong>: cache read rẻ, cache write có phụ phí. Cùng token, giá khác tùy cách xử lý.</li>
</ul>
<p><strong>Chi phí một call</strong> = input tokens × input rate + output tokens × output rate + cache reads và writes theo <strong>giá riêng của chúng</strong> + phí server tool (nếu dùng).
Không có hệ số ẩn, không có phí bí ẩn hàng tháng. Tính được một call thì tính được một triệu call: chỉ là cùng phép cộng lặp lại.</p>

<h3>Khoảng cách input – output quyết định chiến lược</h3>
<div class="box">📞 <strong>Hình dung thế này:</strong> Gói cước điện thoại mà <strong>nghe thì rẻ, nói thì đắt gấp mấy lần</strong>. Gọi cho người nói dài dòng thì hóa đơn vọt lên.
Với Claude, "nói" là output: <strong>một prompt ngắn mà nhận câu trả lời lan man</strong> có thể tốn hơn một prompt dài với câu trả lời gọn.</div>
<ul>
  <li>Input là bên rẻ, nên prompt lớn (kể cả tài liệu dài) tính theo token là tương đối rẻ.</li>
  <li>Khi tối ưu, <strong>nhìn độ dài output trước</strong>: thường tiền chảy ra ở đó.</li>
  <li>Bẫy mô hình hóa caching: tính token cache theo <strong>giá input đầy đủ</strong> là sai. Read phải rẻ hơn nhiều, write đắt hơn một chút — <strong>nhân mỗi trường cache với giá của chính nó</strong>.</li>
</ul>

<h3>Từ một call lên workload thật: ba bước</h3>
<ol>
  <li>Ước tính <strong>token mỗi request</strong>, cả input lẫn output, cho một call điển hình.</li>
  <li>Nhân với <strong>volume dự kiến</strong> (mỗi ngày / mỗi tháng).</li>
  <li><strong>Tìm dominant driver</strong> — bước hay bị bỏ: system prompt khổng lồ ở mọi call? output dài? volume dồn vào một endpoint? Tối ưu phần lớn nhất trước; tối ưu một khoản nhỏ thì "cảm giác" năng suất nhưng hầu như không đổi hóa đơn.</li>
</ol>

<h3>Bốn cần gạt và thang chi phí theo tier</h3>
<ul>
  <li><strong>Tier selection</strong>: cần gạt lớn nhất. Dùng model quá mạnh cho việc đơn giản là lãng phí thuần.</li>
  <li><strong>Smaller prompts</strong>: cắt system prompt và lịch sử về đúng mức cần; ít input hơn, rẻ hơn ở mọi call.</li>
  <li><strong>Prompt caching</strong>: tái dùng một prefix ổn định để token lặp lại tính giá read rẻ.</li>
  <li><strong>Batch processing</strong>: việc không gấp đi đường batch để được giảm giá lớn, đổi lại không có kết quả ngay.</li>
</ul>
<p>Thang tier: <strong>Opus</strong> mạnh nhất và đắt nhất/token, cho bài thật sự cần suy luận đỉnh. <strong>Sonnet</strong> cân bằng, rẻ hơn Opus rõ rệt, hợp production khối lượng lớn.
<strong>Haiku</strong> rẻ nhất và nhanh nhất, hợp việc đơn giản throughput cao như <strong>routing, extraction, classification</strong>.</p>
<p>Thói quen gói gọn cả bài: <strong>đừng đợi hóa đơn mới biết tính năng tốn bao nhiêu</strong>. Dùng count_tokens đo input, ước tính output <strong>một cách trung thực</strong> (đừng lạc quan), nhân với volume để có dự báo hàng tháng. Con số đáng sợ thì kéo cần gạt <strong>trước khi launch</strong>.</p>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có <strong>"prompt ngắn nhưng chi phí cao"</strong> → thủ phạm là output; giảm độ dài output trước.</li>
  <li>Đề có <strong>"system prompt lớn lặp lại ở mọi call"</strong> → <strong>prompt caching</strong>.</li>
  <li>Đề có <strong>"việc không gấp, chạy qua đêm, khối lượng lớn"</strong> → <strong>batch processing</strong>.</li>
  <li>Đề có <strong>"classification/routing/extraction đang chạy trên Opus"</strong> → hạ xuống tier nhẹ nhất đạt quality (Haiku).</li>
  <li>Đề hỏi <strong>"ước tính chi phí trước khi ship"</strong> → count_tokens + ước output trung thực + nhân volume.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Tính token cache theo giá input gốc" → <strong>sai</strong>, read rẻ hơn nhiều, write đắt hơn một chút.</li>
  <li>"Input mới là phần đắt" → <strong>sai</strong>, output đắt hơn nhiều lần.</li>
  <li>"Tối ưu chỗ nào cũng như nhau" → <strong>sai</strong>, phải nhắm vào dominant driver trước.</li>
  <li>"Cứ ship rồi xem hóa đơn" → <strong>sai</strong>, mô hình hóa chi phí trước khi launch.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Token × giá, output là "nói đắt"; tìm chỗ chảy tiền nhất rồi gạt: tier, prompt, cache, batch.</strong></p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
