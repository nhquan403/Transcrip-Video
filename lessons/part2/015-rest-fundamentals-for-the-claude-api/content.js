window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Bên dưới mọi thứ, Claude API chỉ là <strong>REST qua HTTP</strong>: một endpoint, một động từ <strong>POST</strong>,
vài header bắt buộc, và các <strong>status code</strong> mà chữ số đầu cho biết lỗi nằm ở bạn hay ở server. SDK chỉ là lớp tiện lợi bên trên, không có phép màu nào.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>REST:</strong> một phong cách thiết kế API: tài nguyên nằm sau URL, thao tác bằng vài động từ chuẩn.</li>
  <li><strong>Stateless (không trạng thái):</strong> mỗi request tự mang đủ ngữ cảnh; server không nhớ gì giữa các lần gọi.</li>
  <li><strong>Safe (an toàn):</strong> method không thay đổi gì trên server, như GET.</li>
  <li><strong>Idempotent:</strong> gọi một lần hay nhiều lần, trạng thái cuối trên server vẫn như nhau, như DELETE.</li>
  <li><strong>Status code:</strong> con số trong mọi response, ví dụ 200, 401, 429, 500.</li>
</ul>

<h3>Ba ý làm nên REST</h3>
<ul>
  <li><strong>Client-server:</strong> code của bạn là client, server của Anthropic giữ model. Hai bên độc lập, mỗi bên đổi được mà không làm hỏng bên kia.</li>
  <li><strong>Stateless:</strong> mỗi request phải mang đủ ngữ cảnh của nó, vì server không nhớ gì. Đó là lý do bạn gửi lại cả hội thoại mỗi lần muốn liền mạch.</li>
  <li><strong>Giao diện đồng nhất:</strong> tài nguyên nằm sau URL, bạn tác động lên chúng bằng một nhóm nhỏ động từ chuẩn.</li>
</ul>

<h3>Một lời gọi Claude trên đường truyền</h3>
<ul>
  <li>Gần như mọi thứ là <strong>một POST</strong> tới <code>/v1/messages</code>, qua <strong>HTTPS</strong> nên được mã hóa.</li>
  <li><strong>Tên model không nằm trong URL.</strong> Cùng một endpoint phục vụ mọi model; bạn chọn model <strong>trong body</strong>.</li>
  <li>Hình dạng rất gọn: một động từ (POST), một đường dẫn, một body JSON chứa model, messages và các thiết lập.</li>
</ul>
<p>Mọi tính năng thêm sau này vẫn đi trên chính lời gọi này.</p>

<h3>Safe và idempotent: hai từ hay bị nhầm</h3>
<ul>
  <li><strong>Safe:</strong> không đổi gì trên server. GET chỉ đọc; gọi 100 lần tài nguyên vẫn y nguyên.</li>
  <li><strong>Idempotent:</strong> gọi một hay nhiều lần, trạng thái cuối như nhau. Xóa một tài nguyên hai lần thì nó vẫn chỉ là "đã xóa".</li>
</ul>
<div class="box">🖨️ <strong>Hình dung thế này:</strong> Bấm nút "xem số dư" 10 lần: số dư không đổi (safe). Bấm "khóa thẻ" 10 lần: thẻ vẫn chỉ ở trạng thái khóa (idempotent).
Bấm "chuyển 1 triệu" 10 lần: bạn chuyển 10 triệu. POST tới Claude giống nút thứ ba: <strong>mỗi lần là một lần sinh câu trả lời mới</strong>.</div>
<p>POST <strong>không safe cũng không idempotent</strong>. Nếu request bị timeout mà bạn gửi lại mù quáng, bạn có thể nhận <strong>thêm một câu trả lời riêng biệt</strong> (và trả thêm tiền).
Logic retry phải tính tới chuyện này.</p>

<h3>Các động từ HTTP</h3>
<ul>
  <li><strong>GET:</strong> đọc, không đổi gì.</li>
  <li><strong>POST:</strong> tạo mới hoặc kích hoạt một hành động không nhằm lặp lại.</li>
  <li><strong>PUT:</strong> thay toàn bộ một tài nguyên. <strong>PATCH:</strong> cập nhật một phần.</li>
  <li><strong>DELETE:</strong> xóa; chạy lại vẫn ra cùng kết quả.</li>
</ul>
<p>Với Claude API, để sinh câu trả lời bạn gần như luôn dùng <strong>POST</strong>, vì mỗi lần sinh là một hành động mới, không phải đọc hay thay thế.</p>

<h3>Đọc chữ số đầu của status</h3>
<ul>
  <li><strong>2xx:</strong> thành công. 200 là OK, body sẵn sàng để parse.</li>
  <li><strong>3xx:</strong> chuyển hướng; hiếm khi gặp trực tiếp với Claude API.</li>
  <li><strong>4xx:</strong> vấn đề <strong>ở phía bạn</strong>: xác thực sai, body hỏng, rate limit.</li>
  <li><strong>5xx:</strong> lỗi <strong>ở server</strong>. Không phải bug của bạn; chờ (backoff) rồi thử lại thay vì viết lại request.</li>
</ul>

<h3>Header phải đúng trước khi Claude thấy prompt</h3>
<ul>
  <li><strong>x-api-key:</strong> mang API key bí mật; server biết bạn là ai và có được vào không.</li>
  <li><strong>anthropic-version:</strong> ghim request vào một phiên bản API có ngày, giữ hành vi ổn định khi Anthropic thay đổi. Bắt buộc, dù SDK tự đặt giúp bạn.</li>
  <li><strong>content-type: application/json</strong> cho body.</li>
</ul>
<p>Quên key hay version thì bạn không nhận được câu trả lời nào hữu ích, mà nhận <strong>400 hoặc 401</strong>, và request thất bại trước khi sinh bất kỳ thứ gì.</p>

<h3>Những status hay gặp khi build</h3>
<ul>
  <li><strong>401:</strong> chưa xác thực, gần như luôn là thiếu hoặc sai API key.</li>
  <li><strong>403:</strong> key <strong>hợp lệ</strong>, nhưng bạn <strong>không được phép</strong> làm việc cụ thể đó. Nhầm 401 với 403 là phí rất nhiều thời gian debug.</li>
  <li><strong>429:</strong> rate limit: gửi nhanh hơn tier cho phép. Chậm lại, backoff rồi thử lại, đừng "dội bom" endpoint.</li>
  <li><strong>400:</strong> body request bị hỏng. Retry không tự hết; phải sửa request rồi mới gửi lại.</li>
</ul>

<h3>SDK không có phép màu</h3>
<p>SDK Python, TypeScript... là client tiện lợi nằm trên lớp REST. Khi bạn gọi hàm tạo message, bên dưới nó dựng đúng request POST nói trên:
đặt header, gắn API key, xử lý retry, và parse JSON thành object có kiểu. Rất tiện, nhưng hãy nhớ:
<strong>mọi thứ SDK làm được đều tương ứng với một lời gọi REST mà API đã hỗ trợ</strong>. Endpoint thô không làm được thì không hàm SDK nào làm được.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Một endpoint, một POST; model chọn trong body; mỗi request mang đủ ngữ cảnh.</li>
  <li>x-api-key và anthropic-version là bắt buộc; chữ số đầu của status cho biết sửa request hay thử lại.</li>
  <li>POST không idempotent: gửi lại mù quáng sau timeout có thể tạo thêm một câu trả lời.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">the wire underneath it</em>: đường truyền bên dưới.</li>
  <li><em class="en">carry most of the weight</em>: gánh phần lớn sức nặng.</li>
  <li><em class="en">each side can change without breaking the other</em>: mỗi bên đổi được mà không làm hỏng bên kia.</li>
  <li><em class="en">beautifully simple</em>: đơn giản một cách đẹp đẽ.</li>
  <li><em class="en">Get comfortable with that</em>: làm quen với điều đó.</li>
  <li><em class="en">blindly retry</em>: thử lại một cách mù quáng.</li>
  <li><em class="en">rather than rewriting your request</em>: thay vì viết lại request.</li>
  <li><em class="en">the call never lands</em>: lời gọi không bao giờ tới đích.</li>
  <li><em class="en">Getting those two backwards</em>: nhầm ngược hai cái đó.</li>
  <li><em class="en">hammering the endpoint</em>: dội liên tục vào endpoint.</li>
  <li><em class="en">a real quality-of-life upgrade</em>: một nâng cấp thật sự cho sự tiện lợi.</li>
  <li><em class="en">The SDK has no secret powers</em>: SDK không có phép màu nào.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson15/Lesson15.java</code>. Có 5 bài: method nào safe, method nào idempotent, đọc nhóm status theo chữ số đầu,
quyết định làm gì theo status (sửa key, kiểm tra quyền, sửa body, chờ rồi thử lại), và có nên gửi lại sau timeout không.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-15"</code>.</p>
<p>Làm xong, chạy với API thật bằng <code>-Dexec.args="p2-15 --live"</code>: cùng một POST tới <code>/v1/messages</code> được gửi với header đầy đủ, thiếu key,
thiếu version, key sai và body JSON hỏng; code của bạn đọc từng status trả về và quyết định cách xử lý. Chỉ request đầy đủ là tốn token.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Claude API, ở tầng dưới cùng, là gì?', options: ['Một giao thức nhị phân riêng', 'REST qua HTTP', 'Một WebSocket luôn mở', 'Một hàng đợi tin nhắn'], answer: 1, explain: '"Before you can build anything on Claude, you have to understand the wire underneath it. The good news is that it\'s just REST over HTTP."' },
    { q: 'Ba ý làm nên REST theo bài học là gì?', options: ['Nhanh, rẻ, an toàn và dễ mở rộng theo chiều ngang', 'GET, POST, DELETE', 'Client-server, stateless, đồng nhất', 'JSON, XML, YAML'], answer: 2, explain: 'Bài học nêu client-server, stateless và uniform interface: "Put those together, and you get one predictable pattern."' },
    { q: 'Vì sao bạn phải gửi lại toàn bộ hội thoại mỗi lần?', options: ['Vì API không trạng thái', 'Vì server xóa lịch sử mỗi giờ', 'Vì SDK yêu cầu', 'Vì để tăng độ chính xác'], answer: 0, explain: '"Every request has to carry all of its own context, because the server remembers nothing between calls. That\'s why you resend the whole conversation."' },
    { q: 'Tên model nằm ở đâu trong lời gọi Claude?', options: ['Trong URL, ví dụ /v1/claude-opus/messages', 'Trong header x-model', 'Trong query string', 'Trong body request'], answer: 3, explain: '"You don\'t put the model name in the URL. The same endpoint serves every model. You choose which one you want inside the request body instead."' },
    { q: 'Hình dạng cốt lõi của lời gọi sinh câu trả lời là gì?', options: ['GET /v1/models', 'POST /v1/messages', 'PUT /v1/messages/{id}', 'DELETE /v1/conversations'], answer: 1, explain: '"One verb, POST, one path, the messages endpoint. And a JSON body that carries the model, your messages, and your settings."' },
    { q: '"Safe" nghĩa là gì?', options: ['Được mã hóa bằng HTTPS', 'Có API key hợp lệ', 'Method không thay đổi gì trên server', 'Gọi nhiều lần trạng thái cuối như nhau'], answer: 2, explain: '"SAFE means a method doesn\'t change anything on the server. A GET just reads."' },
    { q: '"Idempotent" nghĩa là gì?', options: ['Lặp lại vẫn cùng kết quả', 'Không thay đổi gì trên server', 'Luôn trả về 200', 'Chạy nhanh hơn'], answer: 0, explain: '"IDEMPOTENT... It means calling the method once, or many times, leaves the server in the same final state."' },
    { q: 'DELETE thuộc loại nào?', options: ['Safe và idempotent', 'Không safe, không idempotent', 'Safe nhưng không idempotent', 'Idempotent nhưng không safe'], answer: 3, explain: 'DELETE đổi server nên không safe, nhưng "Delete the same resource twice, and it is still just gone", nên idempotent.' },
    { q: 'POST tới /v1/messages thuộc loại nào?', options: ['Safe và idempotent', 'Không cái nào', 'Chỉ idempotent', 'Chỉ safe'], answer: 1, explain: '"A POST is neither SAFE nor IDEMPOTENT, and the Claude messages call is a POST. Each call is a brand new generation."' },
    { q: 'Request POST tới Claude bị timeout, bạn gửi lại y nguyên ngay. Rủi ro là gì?', options: ['Không có rủi ro', 'Server từ chối với 409', 'Thêm một câu trả lời mới', 'Bị khóa tài khoản'], answer: 2, explain: '"If a request times out and you blindly retry, you can get a second, separate completion. Retry logic has to account for that."' },
    { q: 'PUT khác PATCH thế nào?', options: ['PUT thay hết, PATCH thay một phần', 'PUT xóa; PATCH tạo mới', 'PUT đọc; PATCH ghi', 'Giống hệt nhau'], answer: 0, explain: '"PUT fully replaces a resource, while PATCH updates just part of it."' },
    { q: 'Vì sao sinh câu trả lời luôn dùng POST?', options: ['Vì POST nhanh hơn GET', 'Vì GET không có body', 'Vì POST được cache', 'Mỗi lần là hành động mới'], answer: 3, explain: '"For generating a response, you almost always use POST, because each completion is a fresh action, rather than a READ or a REPLACE."' },
    { q: 'Status 2xx nghĩa là gì?', options: ['Chuyển hướng', 'Thành công', 'Lỗi phía bạn', 'Lỗi phía server'], answer: 1, explain: '"Anything in the 200s means success. A 200 is the normal OK, and your body is ready to parse."' },
    { q: 'Nhóm 4xx cho biết điều gì?', options: ['Server đang bảo trì', 'Redirect sang endpoint khác', 'Vấn đề ở phía bạn', 'Thành công một phần'], answer: 2, explain: '"The 400s are the ones to watch, because they mean the problem is on your side. Bad auth, a malformed body, or a rate limit all live here."' },
    { q: 'Gặp lỗi 5xx, cách xử lý đúng là gì?', options: ['Backoff rồi thử lại', 'Viết lại request ngay', 'Đổi API key', 'Đổi model'], answer: 0, explain: '"The 500s mean the fault is on the server. Those aren\'t your bug, so the right move is to retry with backoff rather than rewriting your request."' },
    { q: 'Hai header bắt buộc riêng của Claude API là gì?', options: ['authorization và accept', 'x-model và x-tokens', 'user-agent và cookie', 'x-api-key, anthropic-version'], answer: 3, explain: '"The first is x-api-key... The second is anthropic-version... It\'s required."' },
    { q: 'Header anthropic-version làm gì?', options: ['Chọn model', 'Ghim phiên bản API theo ngày', 'Báo phiên bản SDK', 'Bật tính năng beta'], answer: 1, explain: '"That one pins your request to a dated version of the API, so behavior stays stable even as Anthropic ships changes."' },
    { q: 'Gửi request thiếu anthropic-version thì sao?', options: ['Server dùng phiên bản mới nhất', 'Server trả câu trả lời bình thường', 'Lỗi 400/401, không sinh gì', 'Server tự thêm header'], answer: 2, explain: '"If you forget the key or the version header, you don\'t get a helpful model reply. You get a 400 or a 401, and the request fails before any generation happens."' },
    { q: 'Status 401 thường có nghĩa là gì?', options: ['Thiếu hoặc sai API key', 'Key đúng nhưng không có quyền', 'Body hỏng', 'Gửi quá nhanh'], answer: 0, explain: '"A 401 means you aren\'t authenticated, almost always a missing or wrong API key."' },
    { q: 'Status 403 khác 401 thế nào?', options: ['403 là lỗi server', '403 là rate limit', '403 là body hỏng', 'Key đúng, thiếu quyền'], answer: 3, explain: '"A 403 is different. It means the key is valid, but you\'re not permitted to do that particular thing."' },
    { q: 'Gặp 429, bạn làm gì?', options: ['Gửi lại ngay lập tức nhiều lần', 'Chậm lại, chờ rồi thử lại', 'Đổi sang API key khác', 'Sửa body request'], answer: 1, explain: '"Next, 429. That\'s a rate limit. You\'re sending faster than your tier allows, so slow down and retry with backoff instead of hammering the endpoint."' },
    { q: 'Gặp 400 vì body hỏng, retry có giúp không?', options: ['Có, sau 3 lần sẽ được', 'Có, nếu chờ 1 phút', 'Không, phải sửa request', 'Có, nếu đổi model'], answer: 2, explain: '"A 400 means your request body itself is malformed. That one won\'t fix itself on retry. You have to correct the request before you send it again."' },
    { q: 'Chữ số đầu của status giúp bạn quyết định điều gì?', options: ['Sửa request hay chỉ cần thử lại', 'Model nào trả lời', 'Giá của lời gọi', 'Thời gian chờ chính xác'], answer: 0, explain: '"Learn to read the first digit, and you\'ll know instantly whether to fix your call or simply try again."' },
    { q: 'SDK Python/TypeScript thực chất là gì?', options: ['Một API khác với REST', 'Một bản sao model chạy cục bộ', 'Một proxy lưu lịch sử hội thoại', 'Lớp tiện lợi trên REST'], answer: 3, explain: '"The Anthropic SDKs in Python and TypeScript are convenience clients that sit on top of the REST surface we just walked through."' },
    { q: 'Việc nào SDK làm giúp bạn khi tạo message?', options: ['Huấn luyện model', 'Header, key, retry, parse JSON', 'Lưu hội thoại trên server', 'Tự viết prompt'], answer: 1, explain: '"It sets your headers, attaches your API key, handles retries, and parses the JSON response into typed objects."' },
    { q: 'Endpoint thô không làm được một việc. SDK có làm được không?', options: ['Có, SDK có tính năng riêng', 'Có, nếu dùng bản mới nhất', 'Không làm được', 'Có, với SDK Python'], answer: 2, explain: '"The SDK has no secret powers. Anything it can do maps to a REST call the API already supports. So if the raw endpoint can\'t do something, no SDK method can either."' },
    { q: 'Ngoài hai header riêng của Claude, bạn còn gửi header nào cho body?', options: ['content-type: application/json', 'accept-language', 'cache-control: no-cache', 'x-request-id'], answer: 0, explain: '"And of course, you send content type as application slash JSON for the body."' },
    { q: 'Nhóm 3xx với Claude API thì sao?', options: ['Rất hay gặp, cần xử lý kỹ', 'Là lỗi xác thực', 'Là lỗi server', 'Hiếm khi gặp'], answer: 3, explain: '"The 300s are redirects, and honestly, you\'ll rarely touch those directly with the Claude API."' },
    { q: 'Câu nào là lợi ích của client-server tách biệt?', options: ['Server nhớ trạng thái của client', 'Hai bên đổi độc lập', 'Client chạy được model', 'Không cần mạng'], answer: 1, explain: '"Your code is the client, and Anthropic\'s servers hold the model. The two stay independent, so each side can change without breaking the other."' },
    { q: 'Câu tổng kết đúng của bài là gì?', options: ['Claude API dùng nhiều endpoint, mỗi model một cái', 'Không cần header nếu dùng HTTPS', 'Một endpoint, POST, vài header, đọc chữ số đầu', 'Mọi lỗi đều nên retry'], answer: 2, explain: '"The Claude API is REST over HTTP, which gives you one endpoint, a POST, and a handful of headers and status codes... the first digit of a status code tells you where to look."' },
  ],
};
