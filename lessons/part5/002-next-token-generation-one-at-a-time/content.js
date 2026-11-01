window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Claude <strong>không</strong> soạn sẵn cả câu trả lời trong đầu rồi mới đọc ra. Nó viết <strong>từng token một, từ trái sang phải</strong>,
và mỗi token mới được chọn dựa trên <strong>tất cả token trước đó</strong>. Vì vậy <strong>phần mở đầu</strong> của câu trả lời có ảnh hưởng rất lớn: neo format ngay từ đầu thì cả câu trả lời sẽ đi đúng hướng.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Next-token generation</strong>: cơ chế model tạo văn bản, mỗi lần một token, cho tới khi gặp điểm dừng.</li>
  <li><strong>Autoregressive</strong>: tự hồi quy: sinh từ trái sang phải, token vừa sinh được đưa ngược vào làm input để chọn token kế tiếp.</li>
  <li><strong>Conditioning</strong>: mỗi token được chọn dựa trên mọi token trước nó, kể cả output của chính model, không chỉ prompt của bạn.</li>
  <li><strong>Token</strong>: đơn vị cơ bản: được sinh từng cái một, chiếm chỗ trong context window và xuất hiện trên hóa đơn.</li>
  <li><strong>Format anchor</strong>: "mỏ neo" định dạng ở đầu câu trả lời, ví dụ dòng đầu của một JSON object hay một tiêu đề rõ ràng.</li>
  <li><strong>Streaming (SSE)</strong>: server gửi từng token ngay khi được sinh ra, qua <strong>server-sent events</strong>.</li>
  <li><strong>Structured outputs</strong>: ép đúng hình dạng output thay vì hy vọng model tự làm đúng format.</li>
</ul>

<h3>Hai bức tranh: chỉ một cái đúng</h3>
<ul>
  <li><strong>Bức tranh sai: "soạn xong rồi mới phát" (compose, then emit)</strong>. Model viết cả câu trả lời bên trong, kiểm tra lại, rồi đưa bạn bản hoàn chỉnh. Nghe rất hợp lý, nhưng <strong>không phải cách model hoạt động</strong>.</li>
  <li><strong>Bức tranh đúng: "sinh từ trái sang phải" (generate, left to right)</strong>. Model tạo từng token theo thứ tự, <strong>không nhìn trước</strong> tới một bản nháp hoàn chỉnh nào cả.</li>
  <li>Model phát ra một token, rồi <strong>xem lại toàn bộ chuỗi tới lúc đó</strong> để chọn token tiếp theo. Lặp lại tới khi xong. <strong>Không có gì viết sẵn sau tấm màn.</strong></li>
  <li>Hệ quả: model <strong>không thể sửa một cam kết ban đầu</strong> bằng cách tham khảo một kế hoạch mà nó chưa từng lập. Thứ gì sinh ra trước sẽ thành "nền đất" cho phần sau.</li>
</ul>
<div class="box">🚂 <strong>Hình dung thế này:</strong> Model giống người <strong>đặt đường ray ngay trước đầu tàu</strong> khi tàu đang chạy. Mỗi đoạn ray mới phải nối tiếp đoạn vừa đặt.
Nếu mấy đoạn đầu lệch hướng, tàu cứ thế đi lệch xa dần. Nếu mấy đoạn đầu thẳng hướng (format anchor tốt), cả hành trình sẽ đi đúng tuyến.</div>

<h3>Phần mở đầu quyết định nhiều thứ</h3>
<ul>
  <li>Vì mỗi token ảnh hưởng tới các token sau, <strong>phần mở đầu có ảnh hưởng vượt trội</strong>.</li>
  <li>Một <strong>format anchor</strong> mạnh ở đầu (dòng đầu của JSON, một heading rõ ràng) thường giữ cả output đi đúng hướng.</li>
  <li>Mặt trái: nếu vài token đầu <strong>lạc hướng</strong>, sự lạc đó <strong>cộng dồn</strong> vì model tiếp tục dựa vào chính output đang lạc của nó.</li>
  <li>Đó là lý do <strong>mở đầu có cấu trúc giúp parse đáng tin cậy hơn nhiều</strong>: bạn không chỉ gọn gàng, bạn đang <strong>lái</strong> quá trình sinh.</li>
</ul>

<h3>Streaming: đổi cách giao, không đổi cách sinh</h3>
<ul>
  <li>Vì token được sinh từng cái, bạn <strong>không cần chờ</strong> cả câu trả lời xong. <strong>Server-sent events</strong> đẩy từng token ra ngay khi có.</li>
  <li>Lợi ích lớn: <strong>tốc độ cảm nhận</strong>, byte đầu tiên tới nhanh, người dùng thấy chữ chạy thay vì vòng xoay chờ.</li>
  <li>Điểm then chốt: streaming <strong>chỉ thay đổi cách output được giao tới bạn</strong>. Quá trình sinh token bên dưới <strong>giống hệt</strong>: vẫn autoregressive, vẫn đi tới.</li>
</ul>

<h3>Ghép ba bài lại: tokens, sampling, generation</h3>
<ul>
  <li><strong>Tokens</strong> là đơn vị: cũng là thứ lấp đầy context window và tính tiền.</li>
  <li><strong>Sampling</strong> là cách chọn từng token từ phân phối, mang tính xác suất, nên output <strong>non-deterministic</strong>.</li>
  <li><strong>Generation</strong> là vòng lặp trái sang phải ghép các lựa chọn đó thành câu trả lời.</li>
  <li>Ba thói quen rút ra: <strong>(1) budget token có chủ đích</strong>, tỉa thứ không cần trong context; <strong>(2) chấp nhận output thay đổi</strong>, validate mọi response; <strong>(3) neo format sớm</strong>, đặt cấu trúc mong muốn lên đầu. Khi cần hình dạng chính xác, ưu tiên <strong>structured outputs</strong>.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có <strong>"output hay lệch format giữa chừng, parse khó"</strong> → đáp án đúng thường là <strong>neo format ở phần mở đầu</strong> (cho dòng đầu rõ ràng) hoặc dùng <strong>structured outputs</strong>.</li>
  <li>Đề có <strong>"model lên kế hoạch toàn bộ câu trả lời trước khi viết"</strong> → đó là phát biểu <strong>sai</strong>; đúng là <strong>autoregressive, từng token, trái sang phải</strong>.</li>
  <li>Đề có <strong>"người dùng thấy chậm, muốn hiện chữ sớm"</strong> → đáp án đúng là <strong>streaming qua SSE</strong>, cải thiện tốc độ cảm nhận.</li>
  <li>Đề hỏi <strong>"streaming có thay đổi chất lượng/cách sinh token không?"</strong> → <strong>không</strong>, chỉ đổi cách giao.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Model soạn xong cả câu rồi mới phát ra" → <strong>sai</strong>, nó sinh từng token, không có bản nháp ẩn.</li>
  <li>"Streaming làm model sinh token khác đi hoặc nhanh hơn về bản chất" → <strong>sai</strong>, chỉ giao từng mảnh sớm hơn, cách sinh giữ nguyên.</li>
  <li>"Mở đầu lệch một chút không sao, model sẽ tự sửa ở cuối" → <strong>sai</strong>, độ lệch thường cộng dồn vì model dựa vào output của chính nó.</li>
  <li>"Mỗi token chỉ dựa vào prompt của người dùng" → <strong>sai</strong>, nó dựa vào <strong>tất cả</strong> token trước, kể cả token model vừa viết.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Viết tới, không nhìn trước: lái được phần đầu là lái được cả bài.</strong></p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
