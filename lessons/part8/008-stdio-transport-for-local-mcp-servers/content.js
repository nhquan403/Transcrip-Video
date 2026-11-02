window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> <strong>Transport</strong> là "đường ống" chở tin nhắn giữa Claude và MCP server. Với server chạy <strong>trên cùng máy</strong>,
transport chuẩn là <strong>stdio</strong>: client khởi chạy server như một <strong>child process</strong>, gửi request vào <strong>stdin</strong>, nhận response từ <strong>stdout</strong>, còn log thì đi ra <strong>stderr</strong>.
Server stdio lấy credentials từ <strong>environment variables</strong>, không dùng <strong>OAuth</strong>.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Host</strong>: chính ứng dụng AI (ví dụ Claude Code, Claude Desktop), đứng ra điều phối mọi thứ.</li>
  <li><strong>Client</strong>: thành phần nằm bên trong host, giữ <strong>đúng một</strong> kết nối tới <strong>đúng một</strong> server.</li>
  <li><strong>Server</strong>: chương trình cung cấp tools, resources và prompts.</li>
  <li><strong>Data layer</strong>: phần protocol, xây trên <strong>JSON-RPC 2.0</strong>: lifecycle, primitives, hình dạng từng message.</li>
  <li><strong>Transport layer</strong>: kênh vận chuyển message từ bên này sang bên kia (framing, delivery).</li>
  <li><strong>stdio</strong>: transport dùng ba luồng chuẩn của process: <strong>stdin, stdout, stderr</strong>.</li>
  <li><strong>Newline-delimited</strong>: mỗi message JSON-RPC nằm trên <strong>một dòng</strong>, không được chứa ký tự xuống dòng bên trong.</li>
  <li><strong>Subprocess lifecycle</strong>: client khởi động và tắt server như một process con.</li>
</ul>

<h3>Ba vai trò: host, client, server</h3>
<p>Mọi cấu hình MCP đều có ba vai, bất kể dùng transport nào. <strong>Host</strong> là ứng dụng AI. Bên trong host có các <strong>client</strong>. Và <strong>server</strong> là nơi thật sự cung cấp khả năng.</p>
<ul>
  <li>Quy tắc vàng: <strong>một client, một server</strong>. Một client không "tỏa" ra nhiều server.</li>
  <li>Khi nghe "ứng dụng kết nối tới nhiều MCP server", thực chất là <strong>host tạo ra một client riêng cho mỗi server</strong>. Nói chuyện với 3 server thì có 3 client.</li>
  <li>Host là cái <strong>hub</strong> điều phối, nhưng từng kết nối vẫn <strong>một-một</strong>, nhờ vậy mỗi kết nối tách biệt và dễ suy luận.</li>
</ul>

<h3>Hai tầng: "nói gì" và "chở bằng gì"</h3>
<div class="box">📮 <strong>Hình dung thế này:</strong> Viết thư cho bạn. <strong>Nội dung lá thư</strong> và cách bạn trình bày (chào hỏi, ký tên) là <strong>data layer</strong>, ở đây là JSON-RPC 2.0.
Còn <strong>đi bằng đường bưu điện hay nhờ người quen cầm tay</strong> là <strong>transport layer</strong>. Đổi cách gửi thì nội dung thư vẫn giữ nguyên.
stdio giống như <strong>đưa thư tận tay cho người ngồi cùng phòng</strong>: không cần bưu điện, không cần đường xa.</div>
<ul>
  <li>Mọi message MCP đều là <strong>văn bản UTF-8</strong>.</li>
  <li>Có <strong>hai transport chuẩn</strong>; bài này tập trung vào <strong>stdio</strong> (bài sau là streamable HTTP).</li>
</ul>

<h3>stdio chở message như thế nào?</h3>
<ol>
  <li><strong>stdin</strong>: client ghi các request JSON-RPC vào standard input của server, mỗi lần một message.</li>
  <li><strong>stdout</strong>: server ghi response trở lại qua standard output. <strong>Chỉ protocol message được phép nằm ở đây</strong>.</li>
  <li><strong>stderr</strong>: server gửi log và thông tin chẩn đoán ra standard error, tách hẳn khỏi kênh message.</li>
</ol>
<p>Luật framing: message là <strong>newline-delimited</strong>. Ký tự xuống dòng là dấu hiệu "message này kết thúc, message sau bắt đầu", nên một message <strong>không được chứa newline bên trong</strong>. Từ đó có hai thói quen:</p>
<ul>
  <li>Server <strong>không in gì khác lên stdout</strong> ngoài protocol message (ví dụ một dòng <code>print("debug")</code> lạc vào stdout là phá stream).</li>
  <li>Client chỉ gửi <strong>JSON-RPC hợp lệ</strong> vào stdin, không thêm gì cả. Muốn log thì dùng <strong>stderr</strong>.</li>
</ul>

<h3>Ba đặc điểm của stdio và khi nào dùng</h3>
<ul>
  <li><strong>Local by design</strong>: client và server chạy cùng một máy, không có network hop, nên <strong>latency thấp</strong> và setup cực đơn giản.</li>
  <li><strong>Thường phục vụ một client</strong>: hợp với công cụ dev cá nhân, một người dùng.</li>
  <li><strong>Subprocess lifecycle</strong>: client là bên <strong>khởi chạy server như child process</strong> và quản lý việc bật/tắt nó.</li>
</ul>
<p>Phép thử đơn giản là <strong>vị trí</strong>: server nằm <strong>cùng máy</strong> với ứng dụng dùng nó thì chọn stdio. Ví dụ: tool cắm vào editor, tích hợp command line bạn tự chạy, mọi setup một người dùng không ai kết nối từ xa.
Spec còn <strong>khuyến nghị client hỗ trợ stdio bất cứ khi nào có thể</strong>.</p>

<h3>Credentials: environment, không phải OAuth</h3>
<ul>
  <li>Server stdio vẫn có thể cần secret, ví dụ API key của một dịch vụ nào đó.</li>
  <li>Cách lấy: <strong>client đặt environment variables</strong>, server đọc credentials từ đó.</li>
  <li><strong>Authorization (OAuth) trong MCP chỉ được định nghĩa cho transport dựa trên HTTP</strong>, nên không áp dụng cho subprocess local.</li>
  <li>Lý do hợp lý: server là process con trên chính máy bạn, <strong>không có danh tính từ xa nào cần chứng minh</strong>.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề nói server chạy <strong>trên cùng máy</strong>, tool cho editor/CLI, một người dùng → đáp án đúng thường là <strong>stdio</strong>.</li>
  <li>Đề hỏi host nói chuyện với 3 server thì có mấy client → <strong>3 client</strong>, mỗi client một server.</li>
  <li>Đề mô tả stream bị lỗi parse vì server in log/text lạ → nguyên nhân là <strong>ghi thứ khác lên stdout</strong>; sửa bằng cách đưa log sang <strong>stderr</strong>.</li>
  <li>Đề hỏi server stdio lấy API key ở đâu → <strong>environment variables</strong> do client đặt.</li>
  <li>Đề hỏi ai khởi chạy server stdio → <strong>client</strong>, như một <strong>child process</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Một client có thể kết nối tới nhiều server" → <strong>sai</strong>, luôn là một client – một server; host mới là bên quản lý nhiều client.</li>
  <li>"Server stdio cũng nên xác thực bằng OAuth" → <strong>sai</strong>, authorization trong MCP chỉ định nghĩa cho HTTP; stdio dùng environment.</li>
  <li>"In log debug ra stdout cũng không sao" → <strong>sai</strong>, stdout chỉ dành cho protocol message; log phải ra stderr.</li>
  <li>"Một message JSON-RPC có thể trải nhiều dòng cho dễ đọc" → <strong>sai</strong>, newline là ranh giới message nên mỗi message phải nằm trên một dòng.</li>
  <li>"Transport quyết định nội dung message" → <strong>sai</strong>, nội dung là data layer (JSON-RPC 2.0); transport chỉ là đường chở.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>"Vào stdin, ra stdout, than thở ra stderr"</strong>; <strong>cùng máy thì stdio, chìa khóa nằm trong environment</strong>.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
