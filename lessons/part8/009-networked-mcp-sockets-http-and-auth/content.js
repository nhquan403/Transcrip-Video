window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Khi MCP server rời khỏi máy người dùng và nhận kết nối qua mạng, transport chuẩn là <strong>streamable HTTP</strong>:
server là một <strong>process độc lập</strong>, có <strong>một endpoint duy nhất</strong> (ví dụ <code>/mcp</code>) phục vụ <strong>nhiều client</strong>.
Vì client ở xa và không đáng tin sẵn, mỗi client phải tự chứng minh danh tính bằng <strong>OAuth 2.1</strong>.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Streamable HTTP</strong>: transport từ xa chuẩn hiện tại (ra đời 2025), một endpoint nhận cả POST và GET, có thể stream.</li>
  <li><strong>HTTP + SSE (server-sent events)</strong>: transport cũ từ 2024, dùng kênh riêng để stream; nay đã <strong>deprecated</strong>.</li>
  <li><strong>Mcp-Session-Id</strong>: header giữ session, server cấp khi khởi tạo, client gửi lại trên mọi request.</li>
  <li><strong>MCP-Protocol-Version</strong>: header cho biết hai bên đang nói phiên bản protocol nào.</li>
  <li><strong>Resource server</strong>: chính MCP server, kiểm tra access token trên mọi request.</li>
  <li><strong>Authorization server</strong>: bên phát hành token; có thể ở chung hoặc chạy độc lập với MCP server.</li>
  <li><strong>Bearer token</strong>: token gửi trong header <code>Authorization</code>, trên mọi request.</li>
  <li><strong>Audience</strong>: token được phát cho server nào; server chỉ nhận token đúng audience của mình.</li>
</ul>

<h3>Streamable HTTP: ba nét cơ bản</h3>
<ul>
  <li><strong>Process độc lập</strong>: server không phải con của client nào, tự chạy và có thể phục vụ <strong>nhiều client cùng lúc</strong> qua mạng.</li>
  <li><strong>Một endpoint</strong>: một đường dẫn như <code>/mcp</code> xử lý mọi traffic, nhận cả <strong>POST</strong> lẫn <strong>GET</strong>.</li>
  <li><strong>Có khả năng streaming</strong>: trả về một JSON object, hoặc mở stream để gửi nhiều message theo thời gian.</li>
</ul>
<p>Đôi khi người ta gọi cách này là "nói chuyện qua sockets", nhưng trong spec MCP, tên chính thức của transport từ xa là <strong>streamable HTTP</strong>.</p>

<h3>Một message đi như thế nào?</h3>
<ol>
  <li>Client <strong>POST</strong> từng message JSON-RPC lên endpoint, kèm header <strong>Accept</strong> nói rằng nó nhận được cả JSON thường lẫn event stream.</li>
  <li>Server chọn: trả <strong>một JSON object</strong>, hoặc <strong>mở event stream</strong> và đẩy nhiều message về.</li>
  <li>Có thêm một <strong>GET tùy chọn</strong> để mở stream chỉ dành cho message do <strong>server chủ động gửi</strong>.</li>
</ol>
<p>Vì HTTP vốn <strong>stateless</strong>, MCP dùng hai header để giữ cuộc hội thoại nhiều request cho mạch lạc: <strong>Mcp-Session-Id</strong> (session nào) và <strong>MCP-Protocol-Version</strong> (phiên bản nào).</p>
<div class="box">🏨 <strong>Hình dung thế này:</strong> Streamable HTTP như <strong>quầy lễ tân khách sạn</strong>: chỉ một quầy (một endpoint) phục vụ rất nhiều khách.
Khi check-in, bạn nhận <strong>số phòng</strong> (session ID) và mỗi lần ra quầy bạn đọc lại số phòng đó. Muốn lên phòng thì phải có <strong>thẻ phòng</strong> (bearer token)
do <strong>bộ phận khác</strong> cấp (authorization server); quầy chỉ kiểm tra thẻ có đúng <strong>khách sạn này</strong> (audience) hay không.
Còn stdio thì giống <strong>nhà riêng</strong>: chỉ có bạn, không cần thẻ.</div>

<h3>Bảo vệ một endpoint mở ra mạng</h3>
<ul>
  <li>Server <strong>kiểm tra header Origin</strong> trên request đến, để chống <strong>DNS rebinding</strong> (trang web độc hại cố gọi tới server local).</li>
  <li>Nếu server chạy <strong>local nhưng vẫn qua HTTP</strong>, nên <strong>bind vào loopback</strong> thay vì mở trên mọi network interface.</li>
  <li><strong>Xác thực client trước</strong> khi phục vụ bất kỳ tool hay resource nào.</li>
  <li>Đây không phải "có thì tốt": một endpoint mở, không xác thực chính là thứ kẻ tấn công đi tìm.</li>
</ul>

<h3>OAuth 2.1: ba vai, một token</h3>
<ul>
  <li><strong>Resource server</strong> = MCP server: validate token trên mọi request, chỉ phục vụ caller có token hợp lệ.</li>
  <li><strong>OAuth client</strong> = MCP client: lấy token và gắn vào mỗi request.</li>
  <li><strong>Authorization server</strong>: bên riêng chuyên phát token, co-hosted hoặc độc lập.</li>
</ul>
<p>Luật dùng token:</p>
<ul>
  <li>Token đi trong header <strong>Authorization dưới dạng Bearer</strong>, trên <strong>mọi</strong> request.</li>
  <li><strong>Không bao giờ đặt token trong query string</strong> của URL, vì URL bị log và cache, dễ lộ secret.</li>
  <li>Server kiểm tra <strong>audience</strong> của token khớp với chính nó; token phát cho nơi khác sẽ bị từ chối.</li>
  <li>Server <strong>không chuyển tiếp token của bạn</strong> sang upstream API nó gọi, để tránh kiểu lỗi <strong>confused deputy</strong>.</li>
</ul>

<h3>Đặt hai transport cạnh nhau</h3>
<ul>
  <li><strong>stdio</strong>: một client, server là child process trên máy bạn, credentials từ <strong>environment</strong>, không có danh tính mạng cần chứng minh.</li>
  <li><strong>Streamable HTTP</strong>: server là dịch vụ độc lập, có thể nhiều client từ xa, client không đáng tin sẵn nên phải xác thực bằng <strong>OAuth</strong>.</li>
  <li>Cùng một protocol bên dưới, hai hình dạng triển khai rất khác nhau. <strong>Auth chỉ định nghĩa cho HTTP, không bao giờ cho stdio.</strong></li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có server chạy <strong>ở xa</strong>, phục vụ <strong>nhiều client</strong> → đáp án đúng là <strong>streamable HTTP + OAuth 2.1</strong>.</li>
  <li>Đề nhắc tới transport <strong>HTTP+SSE</strong> riêng biệt cho server mới → đó là <strong>legacy/deprecated</strong>, chọn streamable HTTP.</li>
  <li>Đề hỏi token gửi ở đâu → <strong>Authorization: Bearer</strong> header, mỗi request; không phải URL.</li>
  <li>Đề hỏi chống DNS rebinding → <strong>validate Origin</strong>; server local qua HTTP → <strong>bind loopback</strong>.</li>
  <li>Đề hỏi giữ trạng thái qua nhiều request → <strong>Mcp-Session-Id</strong> (và <strong>MCP-Protocol-Version</strong> cho phiên bản).</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Đặt token trong query string cho tiện" → <strong>sai</strong>, URL bị log/cache, lộ secret.</li>
  <li>"Server nhận token rồi forward luôn cho API upstream" → <strong>sai</strong>, đó là rủi ro confused deputy; server cũng phải kiểm tra audience.</li>
  <li>"Server mới nên dùng transport SSE riêng" → <strong>sai</strong>, transport đó đã deprecated, dùng streamable HTTP.</li>
  <li>"Streamable HTTP cần nhiều endpoint: một để gửi, một để stream" → <strong>sai</strong>, chỉ một endpoint cho cả POST và GET.</li>
  <li>"Endpoint nội bộ thì không cần xác thực" → <strong>sai</strong>, phải authenticate client trước khi phục vụ tool/resource.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>"Ở xa thì HTTP, có HTTP thì OAuth; token nằm trong header, không nằm trên URL."</strong></p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
