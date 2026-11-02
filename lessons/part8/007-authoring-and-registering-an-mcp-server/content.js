window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Dựng một MCP server là <strong>đăng ký ba primitive</strong> (tools, resources, prompts) rồi lo phần cơ khí xung quanh:
<strong>khai báo capability, định tuyến request, định dạng response, báo lỗi</strong>. Client luôn <strong>list để khám phá</strong> trước, rồi mới <strong>call / read / get</strong> để dùng.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>tools/list, tools/call</strong>: liệt kê tool đã đăng ký; chạy một tool.</li>
  <li><strong>resources/list, resources/read</strong>: liệt kê resource; trả nội dung của một URI.</li>
  <li><strong>prompts/list, prompts/get</strong>: liệt kê prompt; trả về template đã điền dưới dạng <strong>messages</strong>.</li>
  <li><strong>Templated URI</strong>: một mẫu URI đại diện cho cả họ resource, khỏi đăng ký từng file.</li>
  <li><strong>Capability declaration</strong>: lúc khởi động, server tuyên bố nó hỗ trợ primitive nào.</li>
  <li><strong>isError</strong>: đánh dấu tool <strong>đã chạy nhưng thất bại</strong>, chi tiết nằm trong result content.</li>
  <li><strong>JSON-RPC error</strong>: lỗi tầng giao thức, ví dụ gọi tool chưa đăng ký.</li>
  <li><strong>Roots</strong>: client báo cho server những đường dẫn file hoặc URI nằm trong phạm vi làm việc; chỉ mang tính <strong>advisory</strong>.</li>
</ul>

<h3>Đăng ký từng primitive</h3>
<ul>
  <li><strong>Tool</strong>: tối thiểu cần <strong>name, description, inputSchema</strong>. Tuỳ chọn thêm: <strong>title</strong> hiển thị, <strong>outputSchema</strong> cho kết quả có cấu trúc, và <strong>annotations</strong>. Nên đặt tên có namespace (kiểu calculator arithmetic thay vì calculate trơn) để tool của các server không đụng nhau.</li>
  <li><strong>Resource</strong>: mỗi cái có một <strong>URI duy nhất</strong>, tuỳ chọn name, description, <strong>mimeType</strong>. Phục vụ qua resources/list và resources/read, luôn <strong>read-only</strong>: chỉ cho application chèn dữ liệu, không bao giờ cho model thứ gì để thực thi.</li>
  <li><strong>Prompt</strong>: có <strong>name</strong> và danh sách <strong>arguments</strong> tuỳ chọn (mỗi argument mô tả thứ user điền). Client gửi prompts/get, server trả về <strong>messages</strong> để mở đầu hội thoại. Host thường hiện prompt dạng slash command hoặc menu.</li>
</ul>
<p>Tool để được <strong>gọi</strong>, resource để được <strong>đọc</strong>, prompt để được <strong>lấy</strong>. Cùng ý tưởng đăng ký, ba method truy xuất khác nhau.</p>

<h3>Discovery và execution: hai pha tách bạch</h3>
<div class="box">📚 <strong>Hình dung thế này:</strong> Vào thư viện, bạn <strong>xem mục lục</strong> trước (list), rồi mới <strong>mượn đúng cuốn</strong> (read),
<strong>nhờ thủ thư làm việc</strong> (call), hay <strong>lấy mẫu đơn có sẵn</strong> (get). Không ai mượn sách khi chưa biết thư viện có gì.</div>
<ul>
  <li><strong>Discovery luôn là list</strong>: tools/list, resources/list, prompts/list.</li>
  <li><strong>Execution có method riêng</strong>: tools/call chạy tool, resources/read trả dữ liệu của URI, prompts/get trả template đã điền.</li>
</ul>

<h3>Bốn việc của một server, và hai kênh báo lỗi</h3>
<ol>
  <li><strong>Capability declaration</strong>: khởi động là tuyên bố primitive nào được hỗ trợ.</li>
  <li><strong>Request routing</strong>: chuyển từng method list / read / call tới đúng handler.</li>
  <li><strong>Response formatting</strong>: trả kết quả đúng hình dạng giao thức quy định.</li>
  <li><strong>Error signaling</strong>: có hai kênh riêng.</li>
</ol>
<ul>
  <li>Tool <strong>chạy rồi nhưng lỗi</strong> → trả result với <strong>isError</strong>, chi tiết trong content để model đọc và tự điều chỉnh.</li>
  <li>Lỗi <strong>giao thức</strong> (gọi tool chưa đăng ký) → trả <strong>JSON-RPC error</strong>, không phải result.</li>
  <li>Chính tả: viết server theo MCP thì dùng <strong>isError</strong> (camelCase); xử lý response của Messages API thì dùng <strong>is_error</strong> (snake_case).</li>
</ul>

<h3>Roots: quy ước phạm vi, không phải hàng rào</h3>
<ul>
  <li>Roots chỉ là <strong>advisory</strong>: server tử tế nên tôn trọng, nhưng <strong>giao thức không ép buộc</strong>.</li>
  <li>Một <strong>local stdio server</strong> chạy với <strong>toàn quyền file system của user hệ điều hành</strong>, dù có khai báo roots hay không.</li>
  <li>Cách ly thật đến từ môi trường: <strong>OS-level sandboxing, containers, file permissions</strong>. Khi viết server: tôn trọng roots; khi chạy server: sandbox như thể nó sẽ không tôn trọng.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề hỏi client tìm tool bằng gì → <strong>tools/list</strong>; chạy tool → <strong>tools/call</strong>.</li>
  <li>Đề có prompts/get → server trả về <strong>messages</strong>.</li>
  <li>Đề có hàng nghìn file cần expose → <strong>templated URI</strong>.</li>
  <li>Đề có tool chạy nhưng thất bại → <strong>isError trong result</strong>; gọi tool không tồn tại → <strong>JSON-RPC error</strong>.</li>
  <li>Đề hỏi roots có đủ bảo mật không → <strong>không</strong>, cần sandbox, container, file permissions.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Roots giới hạn chắc chắn quyền truy cập file" → <strong>sai</strong>, roots chỉ là advisory.</li>
  <li>"Gọi tool chưa đăng ký thì trả isError" → <strong>sai</strong>, đó là JSON-RPC error.</li>
  <li>"Resource đăng ký xong thì model có thể thực thi" → <strong>sai</strong>, resource luôn read-only.</li>
  <li>"Tool chỉ cần name là đủ" → <strong>sai</strong>, tối thiểu cần name, description, inputSchema.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>List trước, call/read/get sau.</strong> Server làm 4 việc: <strong>khai báo → định tuyến → định dạng → báo lỗi</strong>. Roots là lời nhắc, sandbox mới là hàng rào.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
