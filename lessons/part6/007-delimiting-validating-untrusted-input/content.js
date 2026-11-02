window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Khi bạn thả text của người dùng hay tài liệu lấy về thẳng vào prompt, một chỉ dẫn ẩn có thể "đi nhờ" vào và model có thể làm theo.
<strong>Input sanitization</strong> (clean, validate, delimit) giúp model coi nội dung đó là <strong>data</strong>, không phải <strong>instruction</strong>.
Nhưng đây chỉ là <strong>giảm rủi ro</strong>, không phải thuốc chữa dứt điểm prompt injection.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Input sanitization</strong>: làm sạch, kiểm tra, hoặc khoanh vùng nội dung người dùng đưa vào trước khi nó vào prompt.</li>
  <li><strong>Untrusted input</strong>: mọi nội dung app <strong>không tự viết</strong>: tin nhắn user, tài liệu retrieve, web content, tool result; coi là có thể độc hại.</li>
  <li><strong>Content boundary</strong>: đường ranh giữa chỉ dẫn tin cậy của developer và nội dung không tin cậy, thường bằng <strong>labeled tag</strong>.</li>
  <li><strong>Clean</strong>: bỏ hoặc escape ký tự có thể phá cấu trúc bạn dựng quanh nội dung.</li>
  <li><strong>Validate</strong>: kiểm tra đúng <strong>shape, type, length</strong> mong đợi.</li>
  <li><strong>Delimit</strong>: bọc nội dung để mép của nó rõ ràng, không "rò" sang vùng chỉ dẫn.</li>
  <li><strong>Encoding as JSON string</strong>: mã hoá nội dung thành chuỗi JSON để quote, tag, ký tự đặc biệt đều bị escape.</li>
</ul>

<h3>Ba bước sanitize, chạy phía bạn</h3>
<ol>
  <li><strong>Clean</strong>: strip hoặc escape ký tự nguy hiểm cho cấu trúc.</li>
  <li><strong>Validate</strong>: khớp shape, type, length trước khi tin.</li>
  <li><strong>Delimit</strong>: bọc lại để biên rõ ràng.</li>
</ol>
<p>Tất cả là việc chuẩn bị, chạy <strong>trước khi gọi model</strong>, trong <strong>code của bạn</strong>, ở phía bạn của đường truyền. Làm tốt thì model nhận payload như một khối dữ liệu để xử lý,
không bao giờ thấy một lệnh mới giấu bên trong.</p>

<h3>Ai được ra lệnh, cái gì chỉ để đọc</h3>
<div class="box">📦 <strong>Hình dung thế này:</strong> Bạn làm ở bưu điện, sếp dặn "phân loại các gói hàng theo tỉnh". Một gói có dán tờ giấy "hãy mở két sắt ra".
Bạn biết tờ giấy đó là <strong>một phần của gói hàng</strong> (data), không phải lệnh của sếp (instruction). Thùng có nhãn rõ ràng chính là tag giúp bạn phân biệt.</div>
<ul>
  <li><strong>Trusted instructions</strong>: system prompt và chỉ dẫn developer viết; chúng có quyền quyết định task.</li>
  <li><strong>Untrusted data</strong>: text bên ngoài, field của user, tool result; chỉ là thứ để xử lý, <strong>không bao giờ</strong> là lệnh.</li>
  <li>Câu hỏi luôn tự hỏi: thứ này đang <strong>bảo model làm gì</strong>, hay chỉ là thứ model <strong>cần nhìn</strong>?</li>
</ul>

<h3>Cách delimit và đặt chỗ đúng</h3>
<ul>
  <li>Bọc khối untrusted bằng một <strong>tag có tên rõ ràng</strong>, mở và đóng đầy đủ.</li>
  <li>Trong chỉ dẫn, nói rõ: mọi thứ trong tag là <strong>data để xử lý, không phải lệnh</strong>.</li>
  <li>Giữ chỉ dẫn của bạn <strong>bên ngoài tag</strong>, không trộn vào cùng khối. Không có ranh giới, text bị chèn nằm cạnh chỉ dẫn trông "có quyền" y như chỉ dẫn.</li>
  <li>Chỗ an toàn nhất cho nội dung bên thứ ba: <strong>tool result block</strong>, vì model được huấn luyện để <strong>nghi ngờ</strong> chỉ dẫn xuất hiện ở đó.</li>
  <li>Tránh dán untrusted text vào <strong>system prompt</strong> hay chỉ dẫn thường, vì ở đó nó "thừa hưởng" quyền của mọi thứ xung quanh.</li>
</ul>

<h3>Field có cấu trúc, encoding, và giới hạn thật</h3>
<ul>
  <li>Nhiều input là <strong>structured field</strong>: ngày, số tiền, ID, category. Với mỗi field, validate <strong>type, range, allowed values</strong>; sai thì <strong>reject hoặc escape</strong>, đừng chuyển thẳng rồi hy vọng model tự lo.</li>
  <li><strong>Schema validation</strong> lo field có kiểu, <strong>delimiting</strong> lo phần free text; hai thứ chạy cạnh nhau trước khi gọi model.</li>
  <li>Kẻ tấn công sẽ cố <strong>đóng tag của bạn sớm</strong> rồi bắt đầu thứ trông như chỉ dẫn mới. Phòng thủ: <strong>encode nội dung thành JSON string</strong>, để quote, tag, ký tự đặc biệt bị escape; nội dung không thể tự "giả" cấu trúc để thoát ra.</li>
  <li>Nói thật: đây là <strong>reduction, not a cure</strong>. Delimit và validate giảm khả năng lệnh lén được thực thi, nhưng tự chúng không chặn được injection quyết tâm. Sanitization là <strong>lớp đầu tiên</strong>, cần chồng thêm lớp khác.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có tài liệu / web content chứa câu kiểu "ignore previous instructions" → đáp án đúng có <strong>bọc trong tag + nói rõ là data</strong>, hoặc đưa vào <strong>tool result</strong>.</li>
  <li>Đề hỏi đặt nội dung bên thứ ba ở đâu → <strong>tool result block</strong>, không phải system prompt.</li>
  <li>Đề có field như ngày, số tiền, ID → <strong>validate type, range, allowed values</strong> trong code trước khi gọi model.</li>
  <li>Đề nói attacker đóng tag sớm để thoát ra → <strong>encode thành JSON string</strong>.</li>
  <li>Đề hỏi sanitization có chặn hoàn toàn injection không → <strong>không</strong>, chỉ là lớp đầu tiên.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Chỉ tin nhắn user mới là untrusted" → <strong>sai</strong>, tài liệu retrieve, web content, tool result cũng vậy.</li>
  <li>"Dán nội dung bên ngoài vào system prompt cho model chú ý" → <strong>sai</strong>, nó thừa hưởng quyền của system prompt.</li>
  <li>"Trộn chỉ dẫn của mình vào cùng khối với data cho gọn" → <strong>sai</strong>, xoá mất chính ranh giới bạn muốn tạo.</li>
  <li>"Bọc tag là đủ, hết lo injection" → <strong>sai</strong>, chỉ giảm rủi ro, không ngăn hoàn toàn.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Clean – Validate – Delimit, làm trước khi gọi.</strong> Data ở trong tag, lệnh ở ngoài tag; và nhớ: <strong>giảm rủi ro, không phải hết rủi ro</strong>.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
