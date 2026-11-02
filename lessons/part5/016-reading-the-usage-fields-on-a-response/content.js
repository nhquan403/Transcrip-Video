window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Mỗi response của Claude API đều kèm một <strong>usage object</strong> ghi chính xác số token của lần gọi đó — đây là nguồn sự thật cho chi phí.
Cái bẫy lớn nhất: khi bật caching, <strong>input_tokens chỉ là phần chưa cache</strong>; muốn có kích thước prompt thật phải <strong>cộng ba trường input</strong>.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>usage object</strong>: đi kèm mọi response, báo số token của <strong>đúng một</strong> request đó.</li>
  <li><strong>input_tokens</strong>: phần input <strong>chưa cache</strong>, model đọc mới với giá đầy đủ.</li>
  <li><strong>output_tokens</strong>: token model sinh ra (câu trả lời + thinking), giá <strong>cao hơn input</strong> trên mọi model hiện tại.</li>
  <li><strong>cache_creation_input_tokens</strong>: token được <strong>ghi vào cache</strong> ở lần gọi này, có phí ghi nhỉnh hơn giá input gốc.</li>
  <li><strong>cache_read_input_tokens</strong>: token được <strong>đọc từ cache</strong>, giá giảm sâu.</li>
  <li><strong>count_tokens endpoint</strong>: đếm input token <strong>trước khi gọi</strong>, không chạy generation nên không tốn tiền output.</li>
  <li><strong>server_tool_use</strong>: mục riêng trong usage ghi hoạt động của server tools.</li>
</ul>

<h3>Usage đến từ đâu và ai cộng dồn?</h3>
<ul>
  <li>Không cần gọi thêm lần nào: usage nằm <strong>ngay trong payload</strong> của response, cạnh content.</li>
  <li>Nó chỉ báo cho <strong>một request</strong>, <strong>không phải tổng tích lũy</strong>. API không cộng dồn giùm bạn.</li>
  <li>Muốn có chi phí theo ngày hay theo user → <strong>việc của bạn</strong>: đọc usage từ mỗi response rồi ghi vào "sổ sách" riêng (một dòng database, một dòng log).</li>
</ul>

<h3>Input và output: giá khác nhau</h3>
<ul>
  <li><strong>Input</strong> là mọi thứ model đọc: system prompt, toàn bộ lịch sử hội thoại, tool definitions, tin nhắn hiện tại.</li>
  <li><strong>Output</strong> là mọi thứ model sinh ra: câu trả lời hiển thị <strong>cộng cả thinking tokens</strong>.</li>
  <li>Trên mọi model hiện tại, output đắt hơn input <strong>nhiều lần</strong>. Một prompt ngắn kéo theo câu trả lời dài dòng có thể tốn hơn nhiều so với vẻ ngoài.</li>
</ul>

<h3>Bốn trường và lỗi đếm thiếu phổ biến nhất</h3>
<div class="box">🧾 <strong>Hình dung thế này:</strong> Hóa đơn siêu thị tách thành nhiều dòng: hàng giá gốc, hàng mua lần đầu có phụ phí, hàng giảm giá thẻ thành viên.
Nếu chỉ nhìn dòng "hàng giá gốc" rồi nói "mình mua chừng này món" là <strong>đếm thiếu</strong>. Phải cộng tất cả các dòng mới ra giỏ hàng thật.</div>
<ul>
  <li>Một prompt logic có thể rơi vào <strong>ba ô input</strong> với <strong>ba mức giá</strong>: input_tokens, cache_creation_input_tokens, cache_read_input_tokens. Cộng thêm output_tokens là đủ bốn trường.</li>
  <li>Khi caching bật, input_tokens <strong>không còn là cả prompt</strong>: phần đã cache chuyển sang hai trường cache.</li>
  <li>Ví dụ: system prompt khổng lồ đã cache + câu hỏi mới tí xíu → input_tokens trông gần như bằng không, dù model đã đọc một context rất lớn.</li>
  <li>input_tokens là <strong>phần còn lại</strong>, không phải tổng.</li>
</ul>
<p><strong>Kích thước prompt thật</strong> = <strong>input_tokens + cache_creation_input_tokens + cache_read_input_tokens</strong>. Con số này quan trọng vì hai lý do:
nó là số trung thực cho phép tính chi phí (sau khi nhân mỗi phần với giá riêng), và nó cho biết <strong>context window thật sự đầy đến đâu</strong>.</p>

<h3>Đếm trước khi gọi, và các khoản "ẩn"</h3>
<ul>
  <li><strong>count_tokens</strong>: đưa request vào, nhận về số input token, không có phí output, chỉ là ước tính.</li>
  <li>Truyền <strong>đúng những gì định gửi</strong>: model, messages, system prompt, tools. Đừng đếm bản rút gọn.</li>
  <li>Số đếm <strong>phụ thuộc model</strong>: dùng đúng model sẽ gọi, vì model khác có thể tách cùng văn bản thành số token khác.</li>
  <li>Gắn <strong>tool definitions</strong> sẽ thêm token system prompt "ngầm" vào input; mức thêm tùy model và tool_choice, không phải một con số cố định.</li>
  <li>Dùng <strong>server tools</strong> thì hoạt động đó nằm ở mục <strong>server_tool_use</strong>, tách khỏi text tokens.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có <strong>"bật caching xong input_tokens nhỏ bất thường"</strong> → phần cache đã chuyển sang hai trường cache; prompt thật = <strong>cộng ba trường</strong>.</li>
  <li>Đề hỏi <strong>"tổng chi phí theo ngày lấy ở đâu"</strong> → tự cộng dồn usage từng response vào database/log của bạn.</li>
  <li>Đề hỏi <strong>"biết số token trước khi tốn tiền"</strong> → <strong>count_tokens endpoint</strong>, với đúng model, messages, system, tools.</li>
  <li>Đề có <strong>"prompt ngắn mà hóa đơn cao"</strong> → nhìn output_tokens (kể cả thinking), output đắt hơn nhiều lần.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"input_tokens luôn là kích thước toàn bộ prompt" → <strong>sai</strong> khi có caching, nó chỉ là phần chưa cache.</li>
  <li>"usage là tổng tích lũy của tài khoản" → <strong>sai</strong>, nó chỉ cho đúng một request.</li>
  <li>"Đếm token bằng model nào cũng được" → <strong>sai</strong>, tokenization khác nhau giữa các model.</li>
  <li>"Chỉ cần tính input và output là đủ" → <strong>sai</strong>, thiếu cache fields, tool overhead, server tool use thì ước tính luôn <strong>bị thấp</strong>.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>input_tokens là "phần lẻ", không phải "cả giỏ"</strong> — cộng đủ ba ô input mới ra prompt thật.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
