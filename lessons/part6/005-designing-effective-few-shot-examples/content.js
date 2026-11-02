window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Thêm nhiều ví dụ <strong>không</strong> tự động làm prompt tốt hơn. Kỹ năng thật là chọn <strong>bao nhiêu</strong> ví dụ và làm cho
<strong>mỗi ví dụ đều có giá trị</strong>. Một bộ nhỏ, <strong>đa dạng</strong>, có cả ca khó, được bọc rõ ràng bằng tag sẽ dẫn dắt Claude tốt hơn một đống ví dụ na ná nhau.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Zero-shot</strong>: giao việc không kèm ví dụ nào, dựa vào kiến thức sẵn có của model và một chỉ dẫn rõ.</li>
  <li><strong>One-shot</strong>: đúng một cặp input-output mẫu, khi một ví dụ chuẩn đã định nghĩa đủ pattern.</li>
  <li><strong>Few-shot / multi-shot</strong>: hai ví dụ trở lên để minh hoạ format, tone hoặc cách suy luận.</li>
  <li><strong>Diversity</strong>: ví dụ phải đủ khác nhau để phủ các edge case.</li>
  <li><strong>Happy path</strong>: input sạch sẽ, dễ; bộ ví dụ chỉ có happy path là cái bẫy lớn.</li>
  <li><strong>Overfit</strong>: prompt "học thuộc" một pattern hẹp, gặp input khác là vấp.</li>
  <li><strong>Canonical example</strong>: ví dụ tiêu biểu, thể hiện gọn và đúng hành vi bạn muốn.</li>
</ul>

<h3>Ba mode, không phải cái thang</h3>
<p>Nhiều người coi zero-shot là lựa chọn "yếu", output hơi chập chờn là vội thêm ví dụ. Bài học nói: <strong>như vậy là ngược</strong>.
Một chỉ dẫn zero-shot rõ ràng có thể <strong>ngang ngửa few-shot</strong> với các task phổ biến, mà lại gọn và rẻ hơn.</p>
<ul>
  <li>Cách chọn: task <strong>phức tạp</strong> cỡ nào, và <strong>format output</strong> cần cụ thể tới đâu?</li>
  <li>Format tinh tế hoặc suy luận dễ sai → ví dụ <strong>xứng đáng</strong> có mặt.</li>
  <li>Chỉ dẫn thường đã làm đúng → thêm ví dụ chỉ <strong>tốn token</strong>, thậm chí còn khoá chặt một pattern bạn không muốn.</li>
  <li>Thêm ví dụ khi nó <strong>tăng độ phủ</strong>, không phải theo phản xạ.</li>
</ul>

<h3>Ít mà chất hơn nhiều mà giống</h3>
<div class="box">🍳 <strong>Hình dung thế này:</strong> Bạn dạy người mới nấu ăn. Cho họ xem 10 lần chiên trứng giống hệt nhau, họ chỉ biết chiên trứng.
Cho họ xem 4 món khác nhau: chiên, luộc, hấp, và một lần lửa quá to bị cháy rồi cách xử lý, họ hiểu được <strong>ranh giới</strong> của việc nấu, chứ không chỉ "điểm giữa".</div>
<p>Một đống ví dụ giống nhau trông có vẻ kỹ, nhưng dạy Claude <strong>một pattern hẹp</strong> và prompt bị <strong>overfit</strong> vào happy path.
Bộ nhỏ được chọn kỹ, trải đều dải input (ca dễ, ca khó, những hình dạng lạ thật sự gặp trong production) dẫn dắt ổn định hơn nhiều.
Khi định thêm ví dụ thứ mười gần trùng lặp: <strong>dừng lại</strong>.</p>

<h3>Ba dấu hiệu của ví dụ tốt và cái bẫy happy path</h3>
<ul>
  <li><strong>Relevant</strong>: sát với use case thật, để pattern Claude học là cái bạn thật sự cần.</li>
  <li><strong>Diverse</strong>: đủ khác nhau; nếu quá giống, Claude bám vào một đặc điểm tình cờ chung và khái quát sai.</li>
  <li><strong>Structured</strong>: tách rõ khỏi chỉ dẫn, để model đọc nó là <strong>demonstration</strong> để bắt chước, không phải mệnh lệnh mới.</li>
</ul>
<p>Ví dụ không chỉ cho model thấy "tốt là thế nào", chúng còn ngầm nói cho model <strong>nên chờ đợi input ra sao</strong>. Bộ toàn input gọn gàng dạy Claude rằng mọi input đều gọn,
nên gặp input lộn xộn là hỏng. Hãy cố ý thêm <strong>boundary input</strong> (ticket trống, bản paste 40 trang, yêu cầu đọc được hai nghĩa) và <strong>adversarial input</strong>, kèm cách xử lý từng cái.</p>

<h3>Bốn kiểu hỏng và cách sửa</h3>
<ol>
  <li><strong>Quá ít và quá giống</strong>: chỉ dạy một pattern hẹp.</li>
  <li><strong>Chỉ happy path</strong>: model không bao giờ thấy ca khó trông thế nào.</li>
  <li><strong>Lẫn vào chỉ dẫn</strong>: không có ranh giới, Claude có thể đọc ví dụ thành command.</li>
  <li><strong>Cũ hoặc lệch mục tiêu</strong>: lệch khỏi task hiện tại hoặc model đang dùng, âm thầm kéo về hành vi lỗi thời.</li>
</ol>
<ul>
  <li>Sửa lỗi số 3: bọc <strong>mỗi ví dụ trong tag riêng có nhãn</strong>, rồi bọc cả nhóm trong một <strong>tag ngoài</strong>.</li>
  <li>Số lượng: <strong>3 đến 5 ví dụ</strong> là "điểm ngọt" cho đa số task.</li>
  <li><strong>Show the reasoning</strong>: đưa các bước suy nghĩ vào ví dụ để Claude khái quát được cách suy luận, rất quan trọng cho task cần chuỗi logic.</li>
  <li><strong>Let Claude help</strong>: nhờ Claude đánh giá bộ ví dụ về relevance và diversity, hoặc viết thêm để lấp chỗ trống.</li>
  <li><strong>Stay canonical</strong>: chọn vài ví dụ tiêu biểu, đa dạng thay vì nhồi mọi edge case tưởng tượng được.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có bộ ví dụ <strong>nhiều nhưng giống nhau</strong>, model vấp với input lạ → đáp án đúng là <strong>bộ nhỏ, đa dạng, có ca khó</strong>.</li>
  <li>Đề nói model làm theo ví dụ như thể đó là lệnh → <strong>bọc ví dụ bằng tag</strong> tách khỏi chỉ dẫn.</li>
  <li>Đề có task phổ biến, chỉ dẫn rõ đã đủ → <strong>zero-shot</strong> là hợp lý, không cần thêm ví dụ.</li>
  <li>Đề hỏi số ví dụ hợp lý → <strong>3 đến 5</strong>.</li>
  <li>Đề có task cần chuỗi logic → ví dụ nên <strong>có cả bước suy luận</strong>, không chỉ đáp án.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Càng nhiều ví dụ càng tốt" → <strong>sai</strong>, chất lượng và đa dạng thắng số lượng.</li>
  <li>"Zero-shot luôn yếu hơn few-shot" → <strong>sai</strong>, với task phổ biến chỉ dẫn rõ có thể ngang bằng mà rẻ hơn.</li>
  <li>"Chỉ cần ví dụ đẹp, sạch" → <strong>sai</strong>, thiếu ca khó thì model không biết xử lý input lộn xộn.</li>
  <li>"Liệt kê mọi edge case có thể nghĩ ra" → <strong>sai</strong>, nên chọn vài ví dụ canonical đa dạng.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Ba đến năm ví dụ, Relevant – Diverse – Structured, có cả ca khó, bọc trong tag.</strong> Chất và độ phủ luôn thắng số đếm.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
