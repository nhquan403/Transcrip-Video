window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Nhiều dự án doanh nghiệp không được gửi dữ liệu ra API first-party; mọi thứ phải chạy trong tài khoản AWS của họ.
<strong>Amazon Bedrock</strong> giải quyết đúng chuyện đó. Phần prompt và body request <strong>giữ nguyên</strong>; thứ thay đổi là "đường ống" xung quanh:
endpoint khác, client khác, xác thực bằng <strong>AWS</strong> thay vì API key của Anthropic, model ID khác, và vài tính năng không có.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Bedrock Mantle:</strong> cách tích hợp hiện tại, đưa Messages API vào một endpoint theo vùng trong AWS. Khuyến nghị cho Opus 4.7 trở lên.</li>
  <li><strong>Invoke model / Converse:</strong> cách tích hợp cũ (legacy), dùng ID có tiền tố profile.</li>
  <li><strong>Profile prefix:</strong> tiền tố như <code>global.</code>, <code>us.</code>, <code>eu.</code> trên model ID của đường cũ.</li>
  <li><strong>IAM:</strong> hệ thống quản lý danh tính và quyền của AWS.</li>
  <li><strong>Service role:</strong> vai trò mà nền tảng tự đảm nhận cho bạn; bạn không phải giữ bí mật nào.</li>
</ul>

<h3>Tin tốt: logic prompt không đổi</h3>
<p>Bedrock nhận <strong>đúng body Messages API</strong> và stream về <strong>cùng định dạng sự kiện</strong>. Code parse, bộ đọc stream, vòng lặp xử lý tool
đều chuyển sang nguyên vẹn.</p>
<div class="box">🚪 <strong>Hình dung thế này:</strong> Bạn chỉ <strong>thay cửa chính</strong>, không thay căn phòng phía sau.
Đi vào bằng cửa khác (endpoint, client, chìa khóa AWS), nhưng bên trong vẫn là những đồ đạc quen thuộc (body request, sự kiện stream, vòng tool).</div>

<h3>Đường hiện tại: Bedrock Mantle</h3>
<ul>
  <li>Đưa Messages API vào một <strong>endpoint theo vùng</strong> trong AWS; traffic đi vào vùng của bạn thay vì server của Anthropic.</li>
  <li>Cài <strong>gói Bedrock extra</strong> cho SDK ngôn ngữ bạn dùng (Python, TypeScript...). Từ đó request trông giống hệt lời gọi first-party.</li>
  <li>Thói quen nên có: <strong>đọc tên client</strong>. Tên client cho bạn và người review biết ngay đang ở đường tích hợp nào, rất hữu ích khi code cũ và mới nằm cạnh nhau.</li>
</ul>

<h3>Phân biệt quan trọng nhất: đường hiện tại và đường cũ</h3>
<ul>
  <li><strong>Hiện tại (Bedrock Mantle):</strong> model ID có tiền tố <strong>trần</strong> <code>anthropic.</code>, dùng với client <strong>Anthropic Bedrock Mantle</strong>.</li>
  <li><strong>Cũ (invoke model / converse):</strong> ID có <strong>tiền tố profile</strong> (<code>global.</code>, <code>us.</code>, <code>eu.</code>...), dùng với client <strong>Anthropic Bedrock</strong> thường.</li>
</ul>
<p>⚠️ Cái bẫy: đường cũ <strong>vẫn chạy</strong>, nên rất dễ chép một đoạn code cũ rồi tưởng là mới. Với Opus 4.7 trở lên, dùng Mantle.
Để dành invoke model cho Opus 4.6 trở xuống, hoặc cho code đang bảo trì, đừng viết mới bằng nó.</p>

<h3>Model ID</h3>
<ul>
  <li><strong>Mantle:</strong> tiền tố trần, kiểu "anthropic.claude-opus-4-8". <strong>Không có</strong> tiền tố us., eu. hay profile vùng.</li>
  <li><strong>Đường cũ:</strong> ID có tiền tố profile; <code>global.</code> là mặc định khuyến nghị, dạng theo vùng (us., eu.) là tùy chọn với phụ phí khoảng <strong>10%</strong>.</li>
</ul>
<p>Quy tắc: dùng client Mantle thì dùng tiền tố trần. Thấy mình với tay lấy ID có tiền tố profile là bạn đã âm thầm quay lại đường cũ; hãy tự hỏi có thật muốn vậy không.</p>

<h3>Xác thực: thứ tự ưu tiên</h3>
<p>Trên Bedrock bạn <strong>không bao giờ</strong> gửi API key của Anthropic. Client tìm thông tin xác thực AWS theo thứ tự:</p>
<ol>
  <li><strong>Tham số truyền vào constructor</strong>: thắng tất cả.</li>
  <li><strong>Biến môi trường</strong>: access key, secret key, session token, region của AWS.</li>
  <li><strong>File cấu hình AWS</strong> và chuỗi thông tin xác thực chuẩn.</li>
</ol>
<p>Tường minh luôn thắng ngầm định. Nếu request xác thực nhầm danh tính, hãy kiểm tra <strong>tham số constructor</strong> hay <strong>biến môi trường</strong> lạc trước tiên.</p>

<h3>Ba nguồn thông tin xác thực, xếp theo mức khuyến nghị</h3>
<ul>
  <li><strong>Bedrock service role</strong> (khuyến nghị): nền tảng tự đảm nhận vai trò, bạn không giữ gì nhạy cảm.</li>
  <li><strong>IAM assumed role:</strong> hợp cho truy cập chéo tài khoản, phiên tối đa <strong>12 giờ</strong>.</li>
  <li><strong>Bearer token</strong> (ít khuyến nghị nhất): cũng tối đa 12 giờ, nhưng tạo riêng và truyền như một API key, tức một bí mật tĩnh mà code phải giữ.</li>
</ul>
<p>Điểm chung: không cái nào là API key của Anthropic. Quyền truy cập Claude ở đây do <strong>AWS IAM</strong> quản lý, thường đúng thứ đội bảo mật muốn.</p>

<h3>Những gì KHÔNG có trên Bedrock</h3>
<ul>
  <li><strong>Không có ảnh qua URL</strong> và <strong>không có Files API</strong>: ảnh hay tài liệu phải gửi inline base64; ảnh tối đa <strong>5 MB</strong> mỗi cái.</li>
  <li><strong>Server tools không chạy</strong>: không code execution, web search, web fetch.</li>
  <li><strong>Không có Message Batches API</strong> và <strong>MCP connector</strong>.</li>
</ul>
<p>Không cái nào chặn một app hỏi đáp thông thường, nhưng nếu thiết kế dựa vào batch hay server tool thì cần kế hoạch khác trên Bedrock.</p>

<h3>Những gì vẫn chạy</h3>
<ul>
  <li><strong>Prompt caching</strong> (vẫn được giảm giá), <strong>extended thinking</strong>.</li>
  <li><strong>Client-side tool use</strong> đầy đủ, kể cả bash, text editor, memory và computer use.</li>
  <li><strong>Citations</strong> và <strong>structured outputs</strong>.</li>
  <li>Chọn loại endpoint: <strong>global</strong> không phụ phí; <strong>regional</strong> thêm khoảng 10% để dữ liệu nằm gần hơn.</li>
</ul>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Cùng Messages API, nhưng client, xác thực và model ID khác; Mantle là đường hiện tại, invoke model là đường cũ.</li>
  <li>Xác thực bằng AWS (constructor → môi trường → file cấu hình); service role là mặc định khuyến nghị.</li>
  <li>Caching, thinking, client tools vẫn chạy; batch, server tools, Files API, ảnh qua URL thì không.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">which features quietly change</em>: tính năng nào âm thầm thay đổi.</li>
  <li><em class="en">the plumbing around that request</em>: đường ống quanh request đó.</li>
  <li><em class="en">move over untouched</em>: chuyển sang nguyên vẹn.</li>
  <li><em class="en">swapping the front door, not the room behind it</em>: thay cửa chính, không thay căn phòng phía sau.</li>
  <li><em class="en">sit side by side</em>: nằm cạnh nhau.</li>
  <li><em class="en">grab an old snippet</em>: chộp một đoạn code cũ.</li>
  <li><em class="en">you have quietly slipped back onto the legacy surface</em>: bạn đã âm thầm trượt về đường cũ.</li>
  <li><em class="en">explicit always beats implicit</em>: tường minh luôn thắng ngầm định.</li>
  <li><em class="en">stray constructor arguments</em>: tham số constructor lạc lõng.</li>
  <li><em class="en">off the table</em>: bị loại khỏi lựa chọn.</li>
  <li><em class="en">with AWS holding the keys</em>: với AWS giữ chìa khóa.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson14/Lesson14.java</code>. Có 5 bài: chọn đường tích hợp theo phiên bản Opus, dựng model ID đúng cho Mantle và cho đường cũ,
chọn thông tin xác thực AWS theo thứ tự ưu tiên, tìm tính năng thiết kế cần mà Bedrock không có, và tính giá endpoint regional cùng kiểm tra ảnh quá 5 MB.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-14"</code>.</p>
<p>Bài này không có phần <code>--live</code> vì cần một tài khoản AWS có quyền Bedrock.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Vì sao nhiều dự án doanh nghiệp chọn Bedrock?', options: ['Vì Bedrock luôn rẻ hơn một nửa so với API first-party', 'Mọi thứ phải chạy trong tài khoản AWS', 'Vì Bedrock có model riêng', 'Vì Bedrock không cần prompt'], answer: 1, explain: '"On plenty of enterprise projects, you can\'t send data to the first party API. Everything has to run inside your AWS account."' },
    { q: 'Khi chuyển sang Bedrock, điều gì GIỮ NGUYÊN?', options: ['Endpoint và client', 'API key của Anthropic', 'Body request và stream', 'Model ID'], answer: 2, explain: '"Bedrock accepts the exact same messages API request body, and it streams responses back with the same event format you already handle."' },
    { q: 'Ba thứ thay đổi khi lên Bedrock là gì?', options: ['Endpoint, client, xác thực', 'Prompt, schema, tool', 'Model, max_tokens và cấu trúc mảng messages', 'Streaming, caching, thinking'], answer: 0, explain: '"You point at a different endpoint, you use a different client, and you authenticate with AWS instead of an Anthropic key."' },
    { q: 'Cách tích hợp hiện tại được khuyến nghị cho Opus 4.7 trở lên là gì?', options: ['Invoke model', 'Converse', 'Batches trên Bedrock', 'Bedrock Mantle'], answer: 3, explain: '"The current integration is called Bedrock Mantle. And it is the path Anthropic recommends for Opus 4.7 and later."' },
    { q: 'Bedrock Mantle đưa Messages API vào đâu?', options: ['Server của Anthropic', 'Endpoint theo vùng trong AWS', 'Một máy chủ trong mạng nội bộ của bạn', 'Lambda function'], answer: 1, explain: '"The Bedrock Mantle integration exposes the messages API at a region scoped endpoint inside AWS."' },
    { q: 'Thói quen nào giúp biết ngay code đang dùng đường tích hợp nào?', options: ['Đọc phiên bản SDK', 'Xem giá trên hóa đơn', 'Đọc tên client', 'Đếm số dòng code'], answer: 2, explain: '"The one habit worth forming early is reading the client name. The client you construct tells you... exactly which integration you are on."' },
    { q: 'Đường hiện tại (Mantle) dùng model ID dạng nào?', options: ['anthropic. trần', 'Tiền tố global. đứng trước anthropic.', 'Tiền tố us. đứng trước anthropic.', 'Không có tiền tố nào, chỉ tên model'], answer: 0, explain: '"The current path is Bedrock Mantle, and it pairs a bare Anthropic prefix on model IDs with the Anthropic Bedrock Mantle client."' },
    { q: 'Đường cũ (invoke model) dùng model ID dạng nào?', options: ['Tiền tố trần anthropic.', 'Tên model không có tiền tố', 'Chỉ dùng ARN', 'Tiền tố profile'], answer: 3, explain: '"The legacy path is the older invoke model or converse style, and it pairs profile prefixed identifiers, global dot, US dot, EU dot."' },
    { q: 'Vì sao dễ dùng nhầm đường cũ?', options: ['Vì đường cũ rẻ hơn', 'Vì đường cũ vẫn chạy', 'Vì tài liệu chỉ có đường cũ', 'Vì Mantle chưa ra mắt'], answer: 1, explain: '"Because the legacy path still functions, it is easy to grab an old snippet and assume it is current. It isn\'t."' },
    { q: 'Khi nào vẫn nên dùng invoke model?', options: ['Cho mọi dự án mới', 'Cho Opus 4.8', 'Opus 4.6 trở xuống', 'Khi cần streaming'], answer: 2, explain: '"Save invoke model for Opus 4.6 and earlier, or for code you are maintaining, rather than writing fresh."' },
    { q: 'Bạn dùng client Mantle nhưng điền model ID "us.anthropic.claude-opus-4-8". Vấn đề là gì?', options: ['ID của đường cũ', 'Không có vấn đề', 'Thiếu tiền tố global.', 'Phải viết hoa'], answer: 0, explain: '"If your client is the Mantle client, use the bare Anthropic prefix. If you find yourself reaching for a profile prefixed identifier, you have quietly slipped back onto the legacy surface."' },
    { q: 'Ở đường cũ, profile nào là mặc định khuyến nghị?', options: ['us.', 'eu.', 'apac.', 'global.'], answer: 3, explain: '"Those profile prefixed identifiers... where global is the recommended default, and the regional forms are an opt-in at about a 10% premium."' },
    { q: 'Profile theo vùng (us., eu.) ở đường cũ tốn thêm bao nhiêu?', options: ['Không tốn thêm', 'Khoảng 10%', 'Gấp đôi', 'Khoảng 50%'], answer: 1, explain: 'Các dạng theo vùng là "an opt-in at about a 10% premium".' },
    { q: 'Trên Bedrock, bạn xác thực bằng gì?', options: ['API key của Anthropic', 'Cả API key Anthropic lẫn AWS', 'Thông tin xác thực AWS', 'Không cần xác thực trong VPC'], answer: 2, explain: '"Because Bedrock rides on AWS, you never pass an Anthropic key. Instead, the client resolves your AWS credentials through a precedence order."' },
    { q: 'Thứ tự ưu tiên tìm thông tin xác thực AWS là gì?', options: ['Constructor → biến môi trường → file cấu hình', 'File cấu hình → biến môi trường → constructor', 'Biến môi trường → constructor → file cấu hình', 'Ngẫu nhiên'], answer: 0, explain: 'Tham số constructor "wins over everything else"; không có thì đọc biến môi trường; không có nữa thì "falls back to your AWS config file and the standard credential chain."' },
    { q: 'Request xác thực nhầm danh tính. Nên kiểm tra gì trước?', options: ['File cấu hình AWS', 'Phiên bản SDK', 'Giá endpoint', 'Constructor và biến môi trường'], answer: 3, explain: '"The practical takeaway is that explicit always beats implicit. So if a request authenticates as the wrong identity, check for stray constructor arguments or environment variables first."' },
    { q: 'Nguồn thông tin xác thực được khuyến nghị nhất là gì?', options: ['Bearer token', 'Bedrock service role', 'IAM user có access key dài hạn', 'API key Anthropic'], answer: 1, explain: '"The recommended option is a Bedrock service role, where the platform assumes the role for you, and you manage nothing sensitive directly."' },
    { q: 'IAM assumed role phù hợp cho trường hợp nào, và phiên tối đa bao lâu?', options: ['Ứng dụng di động, 1 giờ', 'Script chạy một lần, 30 phút', 'Chéo tài khoản, 12 giờ', 'Mọi trường hợp, phiên không giới hạn thời gian'], answer: 2, explain: '"Next are IAM assumed roles, which work well for cross-account access and cap out at a 12-hour session."' },
    { q: 'Vì sao bearer token ít được khuyến nghị nhất?', options: ['Bí mật tĩnh phải tự giữ', 'Vì không chạy được với Claude', 'Vì chỉ dùng ở vùng us.', 'Vì phiên tối đa 1 phút'], answer: 0, explain: '"A bearer token, which shares the same 12-hour maximum, but is generated separately and passed like an API key. A static credential your code now has to handle."' },
    { q: 'Điểm chung của cả ba nguồn thông tin xác thực trên Bedrock là gì?', options: ['Đều tồn tại vĩnh viễn', 'Đều là API key Anthropic', 'Đều cần nhập tay mỗi lần', 'Đều do AWS IAM quản lý'], answer: 3, explain: '"All three share one property. None of them is an Anthropic key. Your access to Claude here is entirely governed by AWS identity and access management."' },
    { q: 'Gửi ảnh qua URL trên Bedrock thì sao?', options: ['Chạy bình thường', 'Phải gửi base64', 'Phải dùng Files API', 'Chỉ chạy với ảnh PNG'], answer: 1, explain: '"There is no URL image input and no files API, so any image or document has to be sent inline as base 64."' },
    { q: 'Mỗi ảnh trên Bedrock tối đa bao nhiêu?', options: ['10 MB', '256 MB', '5 MB', '1 MB'], answer: 2, explain: '"And images are capped at five megabytes each."' },
    { q: 'Tính năng nào KHÔNG có trên Bedrock?', options: ['Web search', 'Prompt caching', 'Extended thinking', 'Structured outputs'], answer: 0, explain: '"The server-side tools don\'t run here, so code execution, web search, and web fetch are off the table."' },
    { q: 'Thiết kế của bạn dựa vào Message Batches để xử lý đêm. Trên Bedrock thì sao?', options: ['Chạy bình thường với nửa giá', 'Chạy nhưng giá gấp đôi', 'Chỉ chạy với Opus 4.6', 'Không có Batches API'], answer: 3, explain: '"The message batches API and the MCP connector are both unavailable... if your design leaned on batches or server tools, you\'ll need a different plan on Bedrock."' },
    { q: 'Những gì VẪN chạy trên Bedrock?', options: ['Files API và URL image', 'Caching, thinking, client tools', 'Web fetch và code execution', 'Batches và MCP connector'], answer: 1, explain: '"Prompt caching works... Extended thinking works... Client-side tool use is fully supported... Citations and structured outputs both work as well."' },
    { q: 'Client tool nào được nhắc là chạy đầy đủ trên Bedrock?', options: ['Chỉ text editor', 'Không client tool nào', 'Bash, editor, memory, computer use', 'Chỉ computer use'], answer: 2, explain: '"Client-side tool use is fully supported, including the bash, text editor, memory, and computer use tools."' },
    { q: 'Endpoint global và regional trên Bedrock khác nhau thế nào về giá?', options: ['Regional thêm ~10%', 'Global đắt hơn 10%', 'Bằng nhau', 'Regional rẻ hơn một nửa'], answer: 0, explain: '"Global endpoints carry no premium, while regional endpoints add about 10% for tighter data locality."' },
    { q: 'Một app hỏi đáp thông thường (không batch, không server tool) chuyển lên Bedrock. Đánh giá đúng là gì?', options: ['Không thể chạy', 'Phải viết lại toàn bộ prompt', 'Phải đổi định dạng stream', 'Gần như y hệt first-party'], answer: 3, explain: '"None of these block a typical request and response app... Design your app to the supported feature set, and a Bedrock deployment behaves almost exactly like a first-party one, just with AWS holding the keys."' },
    { q: 'Code parse response, bộ đọc stream và vòng xử lý tool khi chuyển sang Bedrock thì sao?', options: ['Phải viết lại hết', 'Chuyển sang nguyên vẹn', 'Chỉ giữ được vòng tool', 'Chỉ giữ được bộ đọc stream'], answer: 1, explain: '"Because the body shape matches your parsing code, your streaming consumer and your tool handling loop all move over untouched."' },
    { q: 'Câu tổng kết đúng của bài là gì?', options: ['Bedrock dùng API key Anthropic với endpoint khác', 'Invoke model là đường hiện tại', 'Cùng API, khác client/xác thực/ID', 'Bedrock không hỗ trợ caching'], answer: 2, explain: '"Bedrock serves Claude through AWS with the same messages API, but a different client, credentials, and model IDs... Bedrock mantle is current, and invoke model is legacy."' },
  ],
};
