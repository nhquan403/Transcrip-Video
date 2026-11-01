window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Model nói một câu <strong>sai</strong> với độ tự tin y hệt khi nói câu <strong>đúng</strong>. Nếu bạn coi sự tự tin là bằng chứng đúng, lỗi sẽ chảy thẳng vào hệ thống.
Sự tự tin chỉ là <strong>văn phong</strong>, không phải <strong>tín hiệu</strong>. Tính đúng phải đến từ bên ngoài: <strong>grounding, citation, validation</strong>,
và với việc quan trọng: <strong>generate → verify → act</strong>.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Confidence ≠ correctness</strong>: giọng chắc chắn, trôi chảy không chứng minh câu trả lời đúng.</li>
  <li><strong>Plausible, not verified</strong>: model sinh token tiếp theo <strong>hợp lý nhất</strong>, không phải token đã được kiểm chứng.</li>
  <li><strong>Grounding</strong>: gắn câu trả lời với context thật bạn đưa cho model, thay vì trí nhớ của model.</li>
  <li><strong>Citation</strong>: yêu cầu nêu nguồn của từng thông tin, để người đọc mở ra kiểm tra được.</li>
  <li><strong>Validation</strong>: kiểm tra bằng code output theo schema hoặc business rule.</li>
  <li><strong>Silent failure</strong>: trả về success nhưng nội dung sai hoặc thiếu; không exception, status code ổn.</li>
  <li><strong>Semantic gate</strong>: check nhắm vào <strong>ý nghĩa</strong> (đủ, đúng, hợp lý), không chỉ hình dạng.</li>
</ul>

<h3>Ba sự thật về độ tự tin của model</h3>
<ol>
  <li><strong>Tự tin không phải đúng</strong>: giọng văn không nói gì về độ chính xác.</li>
  <li><strong>Sai nghe y như đúng</strong>: không có "giọng run" hay rào đón tự động khi model sai.</li>
  <li><strong>Kiểm chứng từ bên ngoài</strong>: nếu tính đúng quan trọng, nó phải đến từ grounding, citation hoặc validation.</li>
</ol>
<p>Vì sao sự tự tin lại thuyết phục đến vậy? Model tối ưu cho văn bản <strong>đọc hay và khớp pattern</strong>; giọng tự tin chỉ là một pattern nó đã học,
được sinh ra y hệt dù nội dung đúng hay sai. Điều ngược đời: <strong>chi tiết và độ cụ thể</strong> (con số chính xác, các bước có tên, trích dẫn nghe rất chuẩn)
lại làm câu trả lời sai trông <strong>đáng tin hơn</strong>. Câu trả lời càng bóng bẩy, càng phải kiểm kỹ.</p>
<div class="box">🎤 <strong>Hình dung thế này:</strong> Một người bán hàng nói trôi chảy, đọc vanh vách thông số, cười rất tự tin. Nghe thì rất "chuẩn",
nhưng bạn vẫn <strong>xem giấy tờ, thử máy</strong> trước khi trả tiền. Bạn tin <strong>bằng chứng</strong>, không tin <strong>giọng nói</strong>.</div>

<h3>"Nghe đúng" và "là đúng"</h3>
<ul>
  <li><strong>Sounds right</strong>: trôi chảy, chi tiết, tự tin; tự nó không chứng minh gì.</li>
  <li><strong>Is right</strong>: có nguồn bạn mở ra kiểm tra được, hoặc giá trị bạn đã tính, hoặc đã qua một validation gate. Tính đúng được xác lập <strong>bên ngoài model</strong>.</li>
  <li>Đổi câu hỏi: đừng hỏi "nghe có uy tín không?", hãy hỏi <strong>"cái gì chống lưng cho nó mà mình kiểm được?"</strong></li>
</ul>
<p>Ba cách ground một câu trả lời: yêu cầu model <strong>cite nguồn</strong> nó lấy thông tin; ưu tiên giá trị <strong>tính toán hoặc tra cứu</strong> (phép tính, đọc database) hơn giá trị model nhớ ra;
và yêu cầu model <strong>self-check</strong> theo tiêu chí trước khi kết thúc, đặc biệt hiệu quả với math và code.</p>

<h3>Bốn lớp bảo vệ khi việc thật sự quan trọng</h3>
<p>Khi output điều khiển <strong>tiền, thay đổi dữ liệu</strong>, hay bất cứ thứ gì khó hoàn tác:</p>
<ol>
  <li><strong>Ground the claim</strong>: yêu cầu citation hoặc nguồn có thể mở ra kiểm tra.</li>
  <li><strong>Cross-check</strong>: xác minh giá trị quan trọng bằng cách thứ hai: tính lại, tra lại, hoặc chạy pass thứ hai.</li>
  <li><strong>Validate semantics</strong>: gate đánh giá output có đủ và hợp lý không, không chỉ đúng định dạng.</li>
  <li><strong>Gate the action</strong>: đặt người hoặc check tự động giữa output tự tin và bất kỳ bước không thể đảo ngược nào.</li>
</ol>
<ul>
  <li><strong>Silent failure</strong> nguy hiểm vì mọi lưới an toàn thông thường đều không thấy: không exception nên try/except chẳng bắt được gì, status code ổn nên error handling cho qua.</li>
  <li>Chỉ <strong>semantic check</strong> nhắm vào nội dung mới bắt được. Status sạch là <strong>cần</strong>, nhưng không bao giờ <strong>đủ</strong>.</li>
  <li>Đưa vào vận hành: xác định output nào <strong>high stakes</strong> và đòi grounding ở đó (không cần nghi thức này cho mọi câu trả lời vặt); đặt validation gate <strong>trước</strong> khi output điều khiển hành động; check hỏng thì chuyển sang <strong>fallback hoặc người</strong>, không bao giờ chấp nhận im lặng.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có câu trả lời "rất chi tiết, rất tự tin" và hỏi có nên tin → đáp án đúng là <strong>kiểm chứng bằng grounding / citation / validation</strong>.</li>
  <li>Đề có output điều khiển <strong>hành động không thể hoàn tác</strong> → <strong>gate the action</strong> bằng người hoặc check tự động.</li>
  <li>Đề có "status 200, không exception, nhưng dữ liệu sai" → <strong>silent failure</strong>, cần <strong>semantic gate</strong>.</li>
  <li>Đề hỏi thứ tự đúng → <strong>generate → verify → act</strong>, không phải generate → act.</li>
  <li>Đề có giá trị quan trọng model "nhớ ra" → ưu tiên <strong>tính toán hoặc tra cứu</strong>, hoặc cross-check.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Câu trả lời càng chi tiết càng đáng tin" → <strong>sai</strong>, chi tiết làm câu sai trông đáng tin hơn, phải kiểm kỹ hơn.</li>
  <li>"Model sẽ tự rào đón khi không chắc" → <strong>sai</strong>, sai và đúng được nói với cùng một độ chắc chắn.</li>
  <li>"Không có exception, status ổn là xong" → <strong>sai</strong>, đó chính là silent failure.</li>
  <li>"Phải verify mọi câu trả lời như nhau" → <strong>sai</strong>, tập trung grounding vào output high stakes.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Tin bằng chứng, không tin giọng nói.</strong> Ground – Cross-check – Validate – Gate, và luôn <strong>generate → verify → act</strong>.</p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
