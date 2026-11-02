window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Có <strong>bốn cách</strong> trao thêm khả năng cho Claude và mỗi cách làm một việc khác nhau:
<strong>built-in tools</strong> (Anthropic host sẵn), <strong>custom tools</strong> (bạn tự định nghĩa và chạy), <strong>skills</strong> (đóng gói quy trình, kiến thức)
và <strong>MCP servers</strong> (chuẩn hóa tích hợp để dùng lại ở nhiều nơi). Ba trục phân biệt chúng: <strong>reach, reuse scope, context cost</strong>.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Built-in tools</strong> (còn gọi <strong>server tools</strong>): chạy trên hạ tầng Anthropic: web search, web fetch, code execution, tool search.</li>
  <li><strong>Custom tools</strong>: tool bạn tự viết name, description, input schema và <strong>tự thực thi trong code của mình</strong>.</li>
  <li><strong>Skill</strong>: một folder có file <strong>SKILL.md</strong> ở gốc (front matter gồm name, description, rồi tới instructions), có thể kèm scripts và resources.</li>
  <li><strong>Progressive disclosure</strong>: Claude chỉ đọc description ngắn, nạp toàn bộ skill khi task thật sự khớp.</li>
  <li><strong>MCP (Model Context Protocol)</strong>: chuẩn mở để ứng dụng kết nối tới tools và dữ liệu bên ngoài; không phải model, không phải một API endpoint.</li>
  <li><strong>Reach</strong>: có chạm được vào hệ thống riêng tư của bạn không.</li>
  <li><strong>Reuse scope</strong>: dùng cho một app hay chia sẻ cho nhiều client, team.</li>
  <li><strong>Context cost</strong>: chiếm bao nhiêu context trước khi hội thoại bắt đầu.</li>
</ul>

<h3>Built-in tools vs custom tools: tiện lợi đổi lấy tầm với</h3>
<ul>
  <li><strong>Built-in</strong> chạy trên hạ tầng của Anthropic: bạn <strong>không viết handler</strong>, kết quả trả thẳng trong response. Bật lên là chạy, nên là thứ nhanh nhất để áp dụng.</li>
  <li>Giới hạn quan trọng: vì chạy trên hạ tầng Anthropic, built-in tool <strong>không thể với tới hệ thống riêng</strong> của bạn: database nội bộ, API công ty.</li>
  <li><strong>Custom tool</strong> chạy trong ứng dụng của bạn: Claude trả về một <strong>tool_use</strong> request, code của bạn làm việc thật, rồi gửi lại kết quả.</li>
  <li>Vì chạy trong app, custom tool <strong>với tới được mọi thứ code của bạn với tới</strong>: API nội bộ, database, service sau firewall.</li>
  <li>Trade-off: built-in = <strong>không tốn công nhưng bộ khả năng cố định</strong>; custom = <strong>tầm với không giới hạn nhưng phải tự viết và chạy handler</strong>.</li>
</ul>

<h3>Skills: dạy quy trình, không phải nối dây</h3>
<ul>
  <li>Skill <strong>không phải kết nối tới hệ thống ngoài</strong>, mà là <strong>know-how đã đóng gói</strong>.</li>
  <li>Claude đọc phần <strong>description</strong> ngắn ở mỗi lượt và chỉ nạp toàn bộ khi task khớp: đó là <strong>progressive disclosure</strong>. Vì phần nặng nằm ngoài context cho tới khi cần, lượng nội dung đóng gói vào skill gần như không giới hạn.</li>
  <li>Ví dụ: team có quy trình nộp báo cáo riêng (các bước, quy tắc format, quy ước). Thay vì giải thích lại trong mỗi prompt, đóng gói một lần thành skill. Giá trị là <strong>nhất quán và dùng lại kiến thức quy trình</strong>.</li>
  <li>Lưu ý trên <strong>Claude API</strong>: skill chỉ dùng được package <strong>đã cài sẵn</strong> và <strong>không tự gọi mạng ra ngoài</strong>. Skill cần dữ liệu sống thì phải đi cặp với một tool hoặc MCP server cung cấp kết nối.</li>
</ul>
<div class="box">🍳 <strong>Hình dung thế này:</strong> Bạn mở một quán ăn. <strong>Built-in tool</strong> là bếp ga quán thuê sẵn có, bật là nấu, nhưng không mang về nhà được.
<strong>Custom tool</strong> là món dụng cụ bạn tự chế cho đúng món của quán mình. <strong>Skill</strong> là <strong>cuốn công thức</strong>: không phải dụng cụ, mà dạy cách nấu cho đều tay mỗi lần.
<strong>MCP server</strong> là <strong>ổ cắm chuẩn</strong> (như USB-C): thiết bị nào theo chuẩn cũng cắm vào được, ở quán nào cũng dùng lại được.</div>

<h3>MCP: tích hợp một lần, dùng lại nhiều nơi</h3>
<ul>
  <li>MCP là <strong>chuẩn mở</strong>, hay được ví là <strong>cổng USB-C cho Claude</strong>: một đầu nối chung thay vì tích hợp riêng cho từng hệ thống.</li>
  <li>Một MCP server đóng gói <strong>tools, resources, prompts</strong> sau giao diện chuẩn, và <strong>mọi client tuân thủ</strong> đều nói chuyện được với nó.</li>
  <li>Lợi ích: xây tích hợp <strong>một lần</strong>, dùng lại qua nhiều host, team, ứng dụng. Custom tool thì "may đo" cho một app; MCP server là cách <strong>chuẩn hóa, chia sẻ được</strong>.</li>
</ul>

<h3>Ba trục để phân biệt</h3>
<ol>
  <li><strong>Reach</strong>: built-in <strong>không</strong> chạm được hệ thống riêng; custom tool và MCP server <strong>chạm được</strong>.</li>
  <li><strong>Reuse scope</strong>: custom tool sống trong <strong>một app</strong>; MCP server được xây để <strong>dùng lại</strong> qua nhiều client và team.</li>
  <li><strong>Context cost</strong>: tool definitions đã nạp sẽ <strong>chiếm chỗ</strong>; skill nhờ progressive disclosure giữ phần lớn nội dung <strong>ngoài context</strong> tới khi cần.</li>
</ol>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề cần <strong>tìm thông tin công khai trên web, chạy code</strong> → <strong>built-in tool</strong> (web search, code execution).</li>
  <li>Đề cần chạm <strong>database nội bộ, API sau firewall</strong> → built-in bị loại; chọn <strong>custom tool</strong> hoặc <strong>MCP server</strong>.</li>
  <li>Đề nói <strong>quy trình làm giống nhau mỗi lần</strong>, quy ước, format → <strong>skill</strong>.</li>
  <li>Đề nói tích hợp cần <strong>dùng chung cho nhiều client/team</strong> → <strong>MCP server</strong>.</li>
  <li>Đề hỏi cái gì giữ context gọn khi có nhiều kiến thức → <strong>skill (progressive disclosure)</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Built-in tool có thể truy cập database nội bộ" → <strong>sai</strong>, nó chạy trên hạ tầng Anthropic, không có đường vào hệ thống riêng.</li>
  <li>"MCP là một model hoặc một API endpoint" → <strong>sai</strong>, MCP là một chuẩn mở (protocol).</li>
  <li>"Skill là cách nối Claude với hệ thống ngoài" → <strong>sai</strong>, skill đóng gói know-how; kết nối là việc của tool/MCP.</li>
  <li>"Skill trên Claude API tự gọi mạng lấy dữ liệu được" → <strong>sai</strong>, chỉ dùng package đã cài, không gọi mạng ra ngoài.</li>
  <li>"Custom tool thì Anthropic thực thi giúp" → <strong>sai</strong>, bạn tự chạy handler trong code của mình.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>"Built-in có sẵn, Custom với xa, Skill dạy cách, MCP cắm chung"</strong> và ba trục <strong>Reach – Reuse – Context</strong>.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
