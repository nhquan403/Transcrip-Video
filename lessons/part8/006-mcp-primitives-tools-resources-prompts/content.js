window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Một MCP server có thể cung cấp <strong>ba primitive</strong>: <strong>tools</strong>, <strong>resources</strong>, <strong>prompts</strong>.
Điều quan trọng nhất là <strong>ai điều khiển</strong> mỗi loại: <strong>model</strong> điều khiển tools, <strong>application</strong> điều khiển resources, <strong>user</strong> điều khiển prompts.
Gán nhầm "chủ" là lỗi MCP phổ biến nhất.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Tool</strong>: hàm thực thi được (API request, database query, thao tác file). Tools <strong>hành động</strong>.</li>
  <li><strong>Resource</strong>: nguồn dữ liệu <strong>read-only</strong> (nội dung file, record, API response), mỗi cái có một <strong>URI</strong>. Resources <strong>cung cấp thông tin</strong>.</li>
  <li><strong>Prompt</strong>: template tái sử dụng, user chọn qua <strong>slash command</strong> hoặc menu.</li>
  <li><strong>Model-controlled</strong>: Claude tự quyết khi nào gọi.</li>
  <li><strong>Application-controlled</strong>: host app quyết định resource nào đưa vào context.</li>
  <li><strong>User-controlled</strong>: người dùng chủ động chọn.</li>
  <li><strong>inputSchema / isError</strong>: cách viết camelCase của MCP (chạy trên <strong>JSON-RPC</strong>).</li>
  <li><strong>input_schema / is_error</strong>: cách viết snake_case của Claude Messages API.</li>
</ul>

<h3>Ba primitive, ba "ông chủ"</h3>
<div class="box">🏨 <strong>Hình dung thế này:</strong> Trong một khách sạn, <strong>nhân viên</strong> (model) tự quyết khi nào dùng điện thoại để gọi dịch vụ (tool).
<strong>Quản lý</strong> (application) quyết định tờ thông tin nào đặt sẵn trên bàn (resource), nhân viên không tự đi lấy.
<strong>Khách</strong> (user) tự chọn món trong thực đơn có sẵn (prompt), nhân viên không tự gọi món thay khách.</div>
<ul>
  <li><strong>Tools → model</strong>: Claude khám phá tool server quảng bá, đọc request và description rồi tự gọi. Giống hệt tool use trong Claude API: model phát lệnh gọi, server chạy, kết quả trả về.</li>
  <li><strong>Resources → application</strong>: host quyết định khi nào đọc resource và chèn vào context. Model <strong>không</strong> tự đi lấy resource như gọi tool. Resource <strong>không bao giờ</strong> làm hành động hay đổi trạng thái.</li>
  <li><strong>Prompts → user</strong>: là template hoặc workflow dựng sẵn, host thường hiển thị dạng slash command hoặc menu. Model <strong>không bao giờ</strong> tự kích hoạt prompt.</li>
</ul>
<p>Câu thần chú: <strong>tools act, resources inform, prompts get selected</strong>. Hầu như mọi câu hỏi MCP đều xoay quanh mapping <strong>model / application / user</strong> này.</p>

<h3>Bẫy chính tả: MCP và Messages API khác nhau</h3>
<ul>
  <li>Trong <strong>MCP</strong>, tham số tool nằm ở <strong>inputSchema</strong> (camelCase), lỗi là <strong>isError</strong>, method là <strong>tools/call</strong>, vì MCP chạy trên <strong>JSON-RPC</strong>.</li>
  <li>Trong <strong>Claude Messages API</strong>, cùng ý tưởng nhưng viết <strong>input_schema</strong>, <strong>is_error</strong>, <strong>tool_use</strong> (snake_case).</li>
  <li>Cùng khái niệm, khác tầng, khác cách viết. Viết server → theo MCP; gọi API → theo API.</li>
</ul>

<h3>Vì sao MCP đáng dùng: chuẩn mở, dùng lại được</h3>
<ul>
  <li>MCP là <strong>chuẩn mở, model-agnostic</strong>, không phải tính năng riêng của Claude và không phải "thêm một API nữa".</li>
  <li><strong>Một MCP server phục vụ nhiều client</strong>: host nào nói được giao thức đều kết nối được.</li>
  <li>Viết tools và resources một lần, chạy trên mọi client tương thích. Khác với function calling thường, nơi tool bị gắn chặt vào một app.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề hỏi "ai quyết định gọi tool?" → <strong>model</strong>.</li>
  <li>Đề hỏi "ai quyết định đưa resource vào context?" → <strong>host application</strong>, không phải model.</li>
  <li>Đề có slash command hoặc menu template → <strong>prompt, do user chọn</strong>.</li>
  <li>Đề có dữ liệu chỉ đọc, có URI → <strong>resource</strong>; có hành động, đổi trạng thái → <strong>tool</strong>.</li>
  <li>Đề hỏi tên field khi viết MCP server → <strong>inputSchema / isError</strong> (camelCase).</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Model tự fetch resource khi cần" → <strong>sai</strong>, resource do application điều khiển.</li>
  <li>"Model có thể tự chạy prompt" → <strong>sai</strong>, prompt chỉ do user chọn.</li>
  <li>"Resource có thể chạy lệnh hoặc sửa dữ liệu" → <strong>sai</strong>, đó là việc của tool.</li>
  <li>"MCP cũng viết input_schema như API" → <strong>sai</strong>, MCP dùng inputSchema.</li>
  <li>"MCP là tính năng chỉ dành cho Claude" → <strong>sai</strong>, đó là chuẩn mở, model-agnostic.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>T-M, R-A, P-U:</strong> Tools–Model, Resources–Application, Prompts–User. <strong>Tools làm, Resources kể, Prompts được chọn.</strong></p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
