window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Dùng structured outputs thì <strong>hình dạng</strong> được đảm bảo, nhưng câu trả lời vẫn có thể trông hợp lý, đúng định dạng mà <strong>sai</strong>.
<strong>Guaranteed structure is not guaranteed correctness.</strong> Giải pháp: coi việc sinh output chỉ là một bước trong vòng lặp:
<strong>generate → validate → re-prompt kèm lỗi cụ thể</strong>, và luôn <strong>đọc stop_reason trước khi parse</strong>.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Response validation</strong>: kiểm tra bằng code câu trả lời theo schema và business rule <strong>sau khi model sinh ra</strong>; kiểm cả ý nghĩa, không chỉ cú pháp.</li>
  <li><strong>Syntax check</strong>: response có parse được và khớp hình dạng schema không.</li>
  <li><strong>Semantic check</strong>: giá trị có hợp lý, đầy đủ và tuân theo business rule không.</li>
  <li><strong>Correction path</strong>: khi validate hỏng, re-prompt model kèm <strong>lỗi cụ thể</strong> để nó tự sửa.</li>
  <li><strong>Silent failure</strong>: call trả về thành công, không exception, nhưng dữ liệu sai hoặc thiếu và trôi xuống bước sau.</li>
  <li><strong>stop_reason</strong>: lý do model dừng: <strong>end_turn</strong> (bình thường), <strong>refusal</strong>, <strong>max_tokens</strong>.</li>
  <li><strong>Non-determinism</strong>: cùng prompt có thể cho kết quả khác nhau giữa các lần chạy.</li>
</ul>

<h3>Pipeline đáng tin là một vòng lặp</h3>
<ol>
  <li><strong>Generate</strong> response.</li>
  <li><strong>Validate</strong>: trước theo <strong>schema</strong>, rồi theo <strong>business rule</strong>.</li>
  <li><strong>Hỏng thì re-prompt</strong> kèm lỗi chính xác, rồi <strong>validate lại</strong>. Đây là bước người ta hay bỏ qua.</li>
</ol>
<p>Thứ cần tránh là <strong>one-shot check</strong>: sinh một lần, liếc qua, rồi đi tiếp. Nó ngầm giả định lần sinh đầu hoặc đúng, hoặc sẽ ném lỗi để bạn bắt. Cả hai đều không chắc.
<strong>Silent failure</strong> là cái bẫy: không có gì báo lỗi nên dữ liệu sai chảy thẳng xuống bước kế. Cộng thêm <strong>non-determinism</strong>: prompt hôm qua qua, hôm nay có thể hỏng.</p>
<div class="box">🧾 <strong>Hình dung thế này:</strong> Một tờ hoá đơn được in rất đẹp, đủ ô, đúng font (syntax ổn). Nhưng tổng tiền lại <strong>không bằng</strong> tổng các dòng hàng (semantic sai).
Kế toán giỏi không chỉ nhìn tờ giấy có đúng mẫu không, mà <strong>cộng lại</strong>, thấy sai thì trả lại kèm ghi chú "dòng 3 cộng sai" để người lập sửa.</div>

<h3>Syntax check và semantic check: cần cả hai</h3>
<ul>
  <li><strong>Syntax</strong> chứng minh output <strong>well-formed</strong>, nhưng không nói gì về việc giá trị có đúng không.</li>
  <li>Ví dụ: một ngày tháng đúng type nhưng nằm <strong>trong quá khứ</strong> trong khi business rule nói không được.</li>
  <li><strong>Semantic</strong> chứng minh output <strong>đúng</strong>: bắt được câu trả lời "trông hợp lý mà sai", loại qua mọi type check nhưng vẫn phá workflow.</li>
</ul>

<h3>Bốn trường hợp cần guard, và đọc stop_reason trước</h3>
<ul>
  <li><strong>Refusal</strong>: model từ chối vì lý do an toàn, stop_reason là <code>refusal</code>, output có thể <strong>không khớp schema</strong>.</li>
  <li><strong>max_tokens</strong>: chạm giới hạn token, object có thể bị <strong>cắt giữa chừng</strong>.</li>
  <li><strong>Enum capitalization</strong>: giá trị enum có thể chỉ khác hoa/thường, nên so sánh <strong>không phân biệt hoa thường</strong>.</li>
  <li><strong>Property ordering</strong>: API không đảm bảo thứ tự property, luôn đọc field <strong>theo tên</strong>, không theo vị trí.</li>
</ul>
<p>Việc rẻ nhất trước khi tin payload: <strong>đọc stop_reason trước khi parse</strong>. Refusal → xử lý như từ chối, không phải dữ liệu hỏng.
max_tokens → có thể bị cắt, parse ra rác. Chỉ <strong>end_turn</strong> mới đi đường parse bình thường.</p>

<h3>Ba lớp validate và một re-prompt có ích</h3>
<ol>
  <li><strong>Schema validation</strong>: parse được, mỗi field đúng type; structured outputs lo phần lớn.</li>
  <li><strong>Business rule checks</strong>: giá trị được phép, nhất quán, đầy đủ, ví dụ tổng phải bằng tổng các line item, điều schema không diễn đạt được.</li>
  <li><strong>Re-prompt on failure</strong>: gate nào hỏng thì đưa lỗi chính xác lại cho model để đóng vòng lặp.</li>
</ol>
<ul>
  <li>Re-prompt kèm <strong>lỗi chính xác</strong>, không phải "thử lại" chung chung, và kèm <strong>output bị lỗi</strong> để model thấy mình sai ở đâu.</li>
  <li><strong>Giới hạn số lần retry</strong>: model hỏng ba lần liên tiếp thì lặp mãi cũng vô ích; <strong>escalate</strong> cho người hoặc fallback.</li>
  <li>Phân biệt <strong>refusal</strong> (model cố ý từ chối) với <strong>bug</strong> (lỗi tích hợp): mỗi cái cần cách sửa khác nhau.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có "đã dùng structured outputs nhưng giá trị vẫn sai" → đáp án đúng là <strong>semantic / business rule validation + re-prompt</strong>.</li>
  <li>Đề có object JSON bị cắt hoặc không khớp schema dù đã enforce → <strong>kiểm tra stop_reason</strong> (max_tokens hoặc refusal) trước khi parse.</li>
  <li>Đề hỏi re-prompt thế nào cho hiệu quả → <strong>kèm lỗi chính xác + output lỗi</strong>, có <strong>giới hạn retry</strong>.</li>
  <li>Đề có so sánh enum bị hỏng vì hoa/thường, hoặc đọc field theo vị trí → so sánh <strong>case-insensitive</strong>, đọc <strong>theo tên</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Structured outputs rồi thì không cần validate" → <strong>sai</strong>, cấu trúc đúng không có nghĩa nội dung đúng.</li>
  <li>"Không có exception là ổn" → <strong>sai</strong>, silent failure trả success nhưng dữ liệu sai.</li>
  <li>"Re-prompt chỉ cần nói 'try again'" → <strong>sai</strong>, phải đưa lỗi cụ thể và output lỗi.</li>
  <li>"Retry tới khi đúng thì thôi" → <strong>sai</strong>, phải giới hạn rồi escalate hoặc fallback.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Đúng mẫu chưa chắc đúng số.</strong> Thứ tự: <strong>stop_reason → schema → business rule → re-prompt kèm lỗi (có giới hạn)</strong>.</p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
