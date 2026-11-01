window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Gần như mọi thứ với model đều đo bằng <strong>token</strong>, từ việc cái gì nhét vừa một request tới hoá đơn bạn trả.
Token là <strong>mảnh nhỏ hơn một từ</strong>, và <strong>context window</strong> là <strong>một bể chung</strong>: input, lịch sử, tool, và cả output lẫn thinking đều rút từ đó.
Kích thước window <strong>phụ thuộc model</strong>, nên luôn đếm theo từng model.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Token</strong>: đơn vị nhỏ nhất model đọc và sinh ra; là mảnh dưới-từ (sub-word), thường vài ký tự.</li>
  <li><strong>Context window</strong>: số token tối đa model chú ý được trong <strong>một request</strong>, tức không gian làm việc của một lần gọi.</li>
  <li><strong>Token budget</strong>: mọi thứ bạn gửi cộng mọi thứ model sinh ra đều rút từ <strong>cùng một bể</strong>.</li>
  <li><strong>count tokens endpoint</strong>: trả về số token <strong>chính xác</strong> cho model bạn chỉ định; nguồn đáng tin nhất.</li>
  <li><strong>Tokenizer</strong>: bộ tách chữ thành token; <strong>khác nhau giữa các model</strong>.</li>
  <li><strong>Input tokens / Output tokens</strong>: phần gửi vào / phần model sinh ra; output tính giá <strong>cao hơn</strong> input.</li>
  <li><strong>Thinking tokens</strong>: token suy luận, tính tiền như <strong>output tokens</strong> và nằm trong tổng output.</li>
  <li><strong>Rebaseline</strong>: đếm lại token khi đổi model rồi chỉnh budget và ước tính chi phí.</li>
</ul>

<h3>Token không phải là từ</h3>
<ul>
  <li>Trung bình <strong>1 token khoảng 4 ký tự</strong>, tức hơn nửa từ một chút mỗi token. 1.000 từ <strong>rất đại khái</strong> khoảng 1.800 token.</li>
  <li>Tỉ lệ này chỉ là ước chừng: thay đổi theo <strong>ngôn ngữ</strong>, và thay đổi nhiều với <strong>code, dấu câu, định dạng lạ</strong>. Một khối JSON dày đặc tách token rất khác văn xuôi.</li>
  <li>Số từ chỉ là thước đo lỏng lẻo; khi cần biết chi phí thật, đừng đoán.</li>
</ul>

<h3>Đếm token đúng cách</h3>
<ul>
  <li><strong>Đầu lỏng</strong>: ước lượng ~4 ký tự/token, ổn khi chỉ cần con số áng chừng.</li>
  <li><strong>Đầu chính xác</strong>: <strong>count tokens endpoint</strong> cho đúng model bạn truyền vào; dùng trước khi định cỡ prompt thật hay ước tính chi phí.</li>
  <li><strong>Tránh</strong>: quy tắc ký tự/token cố định, hoặc tokenizer của model khác. Chúng lệch khỏi số thật của Claude, có khi lệch nhiều, và <strong>lệch nặng nhất với code</strong>.</li>
</ul>

<h3>Đổi model thì đếm lại</h3>
<ul>
  <li>Tokenizer không cố định. <strong>Opus 4.7 trở về sau</strong>, cùng <strong>Fable 5</strong> và <strong>Sonnet 5</strong>, tách chữ mịn hơn model cũ.</li>
  <li>Cùng một input, tokenizer mới có thể ra <strong>nhiều hơn khoảng 30% token</strong>.</li>
  <li>Prompt đo trên model cũ có thể đắt hơn rõ rệt trên model mới dù không đổi một ký tự → <strong>rebaseline</strong>: chạy lại count tokens cho model mới, chỉnh budget và chi phí. Đừng tin số tháng trước.</li>
</ul>

<h3>Window lớn cỡ nào, và cái gì lấp đầy nó?</h3>
<ul>
  <li><strong>Fable 5, Opus 4.8, Sonnet 5</strong>: tới <strong>1 triệu token</strong> (khoảng 555.000 từ tiếng Anh trong một request).</li>
  <li><strong>Haiku 4.5</strong>: <strong>200.000 token</strong> (khoảng 150.000 từ), bằng một phần năm model lớn. Cùng một prompt quá cỡ có thể chạy ổn trên Opus nhưng <strong>tràn trên Haiku</strong>. Hãy <strong>gọi tên model trước</strong> khi tính sức chứa.</li>
  <li>Trong window có: <strong>system prompt</strong>, <strong>mọi tool definition</strong>, <strong>toàn bộ lịch sử hội thoại</strong>, <strong>mọi tool result</strong>, và <strong>token model đang sinh ra</strong>. Vì vậy một agent chạy lâu có thể dần bò tới giới hạn dù từng tin nhắn đều ngắn.</li>
</ul>
<div class="box">🎒 <strong>Hình dung thế này:</strong> Context window là <strong>một chiếc ba lô</strong> cho một chuyến đi. Bản đồ (system prompt), dụng cụ (tool definitions), nhật ký đường đi (lịch sử, tool result), và cả những gì bạn nhặt thêm dọc đường (output, thinking) đều phải nhét chung vào đó. Ba lô của Opus to gấp năm ba lô của Haiku. Đầy rồi thì ba lô <strong>không tự gấp đồ giúp bạn</strong>: bạn phải bỏ bớt hoặc nén lại.</div>

<h3>Token được tính tiền thế nào, và khi tràn thì sao?</h3>
<ul>
  <li><strong>Input tokens</strong>: system prompt, lịch sử, tool definitions, lượt user hiện tại.</li>
  <li><strong>Output tokens</strong>: mọi thứ model sinh ra, không chỉ phần trả lời bạn thấy; giá cao hơn input.</li>
  <li><strong>Thinking tokens</strong> (model có reasoning): tính như output, nằm trong tổng output; <strong>usage object</strong> báo phần chia nhỏ chỉ-đọc để bạn biết bao nhiêu output dành cho suy luận.</li>
  <li>Tràn window <strong>không được model tự sửa</strong>: không có tự động tóm tắt ở biên. Vượt giới hạn thì bạn <strong>nhận lỗi</strong>; tự giữ dưới budget bằng cách <strong>tỉa lượt cũ</strong> hoặc <strong>compact lịch sử</strong>.</li>
  <li>Request đủ 1 triệu token tính <strong>đúng giá chuẩn mỗi token</strong> trên các model lớn hiện tại, <strong>không phụ phí long context</strong>. Nhưng giá chuẩn nhân một triệu vẫn nhiều: window lớn là budget cần quản lý, không phải chỗ miễn phí.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề hỏi "cách chính xác để biết prompt tốn bao nhiêu token" → <strong>count tokens endpoint</strong> với đúng model.</li>
  <li>Đề có "đổi sang model mới, chi phí tăng dù prompt không đổi" → <strong>tokenizer mới</strong> (~30% token nhiều hơn) → <strong>rebaseline</strong>.</li>
  <li>Đề có "prompt chạy được trên Opus/Sonnet nhưng lỗi trên Haiku" → window <strong>200K</strong> so với <strong>1M</strong>.</li>
  <li>Đề có "agent chạy lâu, mỗi tin nhắn ngắn mà vẫn chạm giới hạn" → lịch sử và tool result tích tụ → <strong>tỉa hoặc compact</strong>.</li>
  <li>Đề hỏi thinking tokens tính thế nào → <strong>như output tokens</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"1 token = 1 từ" → <strong>sai</strong>, khoảng 4 ký tự, hơn nửa từ một chút.</li>
  <li>"Dùng tokenizer của model khác để ước lượng là đủ chính xác" → <strong>sai</strong>, lệch khỏi số thật, nặng nhất với code.</li>
  <li>"Context window chỉ tính prompt của user" → <strong>sai</strong>, gồm system prompt, tools, lịch sử, tool result và cả output.</li>
  <li>"Tràn window thì model tự tóm tắt" → <strong>sai</strong>, bạn nhận lỗi và phải tự quản lý.</li>
  <li>"Dùng đủ 1 triệu token bị tính phụ phí" → <strong>sai</strong>, giá chuẩn, nhưng vẫn tốn nhiều.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Một ba lô chung cho cả đi lẫn về.</strong> Đếm bằng count tokens, <strong>đổi model thì đếm lại</strong>, và nhớ: <strong>1M</strong> cho Fable/Opus/Sonnet, <strong>200K</strong> cho Haiku.</p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
