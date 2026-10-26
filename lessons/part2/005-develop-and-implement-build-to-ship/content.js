window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Ứng dụng Claude nào cũng đi qua bốn giai đoạn: <strong>develop</strong>, <strong>implement</strong>, <strong>operate</strong>, <strong>maintain</strong>.
Bài này đi sâu vào hai giai đoạn đầu. Develop là chứng minh ý tưởng chạy được (nhanh, chấp nhận thô). Implement là làm cho nó
<strong>bền</strong>: bí mật an toàn, xử lý lỗi, triển khai, và cấu hình đưa vào Git để chạy giống nhau ở mọi nơi.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Prototype:</strong> bản thử nhanh để xem ý tưởng có chạy được không.</li>
  <li><strong>Hardening (gia cố):</strong> thêm kiểm tra input, xử lý lỗi, retry, cấu hình ổn định để chạy tốt cả ngày xấu.</li>
  <li><strong>Secret manager:</strong> nơi lưu bí mật (API key) an toàn; app nạp key lúc chạy.</li>
  <li><strong>x-api-key / anthropic-version:</strong> hai header bắt buộc. Một cái xác thực bạn, một cái ghim phiên bản API theo ngày.</li>
  <li><strong>Model ID cố định (pinned):</strong> tên model chỉ đúng một snapshot, không âm thầm đổi khi có model mới.</li>
</ul>

<h3>Bản đồ bốn giai đoạn</h3>
<ul>
  <li><strong>Develop:</strong> thử prompt và tích hợp với Messages API, chỉ để chứng minh ý tưởng chạy được.</li>
  <li><strong>Implement:</strong> gắn xác thực, bí mật, xử lý lỗi, triển khai, để prototype chạy trong môi trường thật.</li>
  <li><strong>Operate:</strong> app đang chạy; theo dõi độ trễ, token, tỉ lệ lỗi, các dấu hiệu từ chối hay thất bại.</li>
  <li><strong>Maintain:</strong> chuyển model, quản lý phiên bản prompt và schema, chạy regression test cho mỗi lần nâng cấp.</li>
</ul>

<h3>Develop: học là chính, chưa đánh bóng</h3>
<ul>
  <li>Gửi prompt thẳng tới Messages API và xem Claude thật sự trả về gì.</li>
  <li>Nối một tích hợp thô, vừa đủ để xác nhận <strong>hình dạng</strong> câu trả lời đúng thứ app cần.</li>
  <li>Thử prompt với input thật, kể cả input <strong>lộn xộn và cố tình phá</strong>: một lần ra kết quả may mắn không chứng minh được gì.</li>
</ul>
<p>Cố ý <strong>chưa</strong> làm: xử lý lỗi cầu kỳ, cấu hình production. Tốc độ học quan trọng hơn sự bóng bẩy. Gia cố để dành cho implement.</p>

<h3>Ba thứ trên mọi lời gọi</h3>
<ol>
  <li><strong>Endpoint:</strong> mọi lời gọi là HTTP <code>POST</code> tới <code>/v1/messages</code>, gửi JSON, nhận JSON. Bên dưới chỉ là REST API bình thường.</li>
  <li><strong>Header x-api-key:</strong> xác thực bạn. Giữ key trong <strong>secret manager</strong>, không bao giờ dán vào code.</li>
  <li><strong>Header anthropic-version:</strong> bắt buộc. Ghim hành vi request/response vào một phiên bản API có ngày, để tích hợp không bị xê dịch khi API thay đổi.</li>
</ol>

<h3>Hai tư duy cho cùng một đoạn code</h3>
<div class="box">🧪 <strong>Hình dung thế này:</strong> Đầu bếp thử món mới trong bếp nhà: nêm thử, đổi công thức liên tục, bày đĩa xấu cũng được. Đó là <strong>prototype</strong>.
Khi đưa món vào nhà hàng: công thức cố định, định lượng chuẩn, xử lý được lúc thiếu nguyên liệu, phục vụ 200 suất giờ cao điểm. Đó là <strong>hardening</strong>.</div>
<ul>
  <li><strong>Prototype</strong> hỏi: "Cái này có chạy được không?"</li>
  <li><strong>Harden</strong> hỏi: "Nó có <strong>tiếp tục</strong> chạy được khi tải cao, vào một ngày xấu trên production không?"</li>
</ul>
<p>Cần cả hai, chỉ là không cùng lúc.</p>

<h3>Implement: từ "chạy được một lần" đến "chạy bền"</h3>
<p>Trên máy bạn, API key nằm trong biến môi trường bạn tự export; lời gọi lỗi thì bạn chạy lại. Trên production <strong>không ai ở đó</strong> để chạy lại.
App phải tự nạp thông tin xác thực, sống sót qua rate limit lúc 2 giờ sáng, và chạy ở staging giống hệt production.
<strong>Mọi bước thủ công</strong> bạn làm lúc prototype phải trở thành việc hệ thống tự làm.</p>

<h3>Ba thứ gần như lần nào cũng phải nối</h3>
<ol>
  <li><strong>Xác thực và bí mật:</strong> key nằm trong secret manager, nạp lúc chạy, không bao giờ commit vào repo. Lộ key là một sự cố thật.</li>
  <li><strong>Xử lý lỗi:</strong> bắt lỗi rate limit và lỗi server, chờ rồi thử lại, để một trục trặc không làm sập cả request.</li>
  <li><strong>Triển khai:</strong> đóng gói app, đặt cấu hình cho từng môi trường, triển khai lên nền tảng đích.</li>
</ol>

<h3>Lỗi ở rìa tích hợp</h3>
<ul>
  <li><strong>429</strong> và nhóm <strong>5xx</strong>: thuộc nhóm retry. Chờ (backoff) rồi gửi lại.</li>
  <li><strong>401</strong>: xác thực hỏng (thiếu hoặc sai key). Retry bao nhiêu cũng không sửa được; mọi lời gọi sẽ lỗi y như vậy cho tới khi bạn sửa key.</li>
</ul>
<p>Rìa tích hợp được làm tốt sẽ <strong>báo lỗi xác thực ngay</strong>, không để nó trốn trong vòng retry.
Kỹ năng vẫn là phân loại: retry cái tự hết, báo và sửa cái không tự hết.</p>

<h3>Thói quen với Git: cái gì commit, cái gì không</h3>
<ul>
  <li><strong>Commit:</strong> cấu hình chung như <code>CLAUDE.md</code> và <code>.claude/settings.json</code> của dự án, để mọi đồng đội và mọi môi trường có cùng hành vi.</li>
  <li><strong>Không commit</strong> (gitignore): <code>.claude/settings.local.json</code>, vì chứa cấu hình riêng của máy bạn.</li>
  <li><strong>Ghim model ID chính xác và commit nó.</strong> Với model trước 4.6, nghĩa là dùng snapshot có ngày thay vì alias ngắn trôi nổi.
  Từ 4.6 trở đi, ID không có ngày (ví dụ Claude Opus 4.8) <strong>đã là</strong> snapshot cố định, không có alias nào phải tránh.</li>
</ul>
<p>Nhờ vậy lần chạy của đồng đội và của production giống lần chạy của bạn, thay vì âm thầm trôi đi khi có model mới.</p>
<p>📝 Transcript tự động ghi nhầm vài từ: "off" là <em class="en">auth</em>, "XAPI key" là <em class="en">x-api-key</em>, "Claw.md" là <em class="en">CLAUDE.md</em>, "cloud" là <em class="en">Claude</em>.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Develop chứng minh ý tưởng với Messages API; implement thêm bí mật, xử lý lỗi, triển khai.</li>
  <li>Retry 429 và 5xx; 401 thì báo ngay và sửa key.</li>
  <li>Commit cấu hình chung và một model ID cố định; không commit cấu hình cá nhân và bí mật.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">where an idea becomes shipped software</em>: nơi ý tưởng thành phần mềm đã giao.</li>
  <li><em class="en">Let's get the whole map in view before we go deep</em>: nhìn toàn cảnh trước khi đi sâu.</li>
  <li><em class="en">learning, not polishing</em>: học, không phải đánh bóng.</li>
  <li><em class="en">one lucky output isn't proof it works</em>: một kết quả may mắn không chứng minh nó chạy được.</li>
  <li><em class="en">pull in opposite directions</em>: kéo về hai hướng ngược nhau.</li>
  <li><em class="en">accept rough edges</em>: chấp nhận chỗ còn thô.</li>
  <li><em class="en">on a bad day in production</em>: vào một ngày xấu trên production.</li>
  <li><em class="en">survive a rate limit at two in the morning</em>: sống sót qua rate limit lúc 2 giờ sáng.</li>
  <li><em class="en">None of it is glamorous</em>: chẳng có gì hào nhoáng.</li>
  <li><em class="en">hide inside a retry loop</em>: trốn trong vòng retry.</li>
  <li><em class="en">silently drifting</em>: âm thầm trôi đi.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson05/Lesson05.java</code>. Có 5 bài: dựng HTTP request thô tới <code>/v1/messages</code> với đủ header,
nạp API key từ môi trường (báo lỗi rõ nếu thiếu), quyết định retry hay báo ngay theo status, chọn file cấu hình nào được commit,
và nhận biết model ID cố định hay alias trôi nổi. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-05"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-05 --live"</code>: chương trình gửi request bạn dựng bằng <code>java.net.http</code>
(không qua SDK) và in JSON thô trả về, rồi thử một key sai để thấy 401 thật và code của bạn phải báo ngay thay vì retry.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Thứ tự đúng của bốn giai đoạn trong vòng đời ứng dụng Claude là gì?', options: ['Implement, develop, maintain, operate', 'Develop, operate, implement, maintain', 'Develop, implement, operate, maintain', 'Operate, develop, implement, maintain'], answer: 2, explain: '"Every Claude application moves through the same four phases. Development, implementation, operation, and maintenance."' },
    { q: 'Việc nào thuộc giai đoạn MAINTAIN?', options: ['Chuyển sang model mới, quản lý phiên bản prompt và schema, chạy regression test cho mỗi lần nâng cấp', 'Thử prompt với Messages API', 'Gắn secret manager và deploy', 'Theo dõi độ trễ, token và tỉ lệ lỗi hằng ngày trên dashboard production'], answer: 0, explain: '"And in maintain, you migrate models, version your prompts and schemas, and regression test every upgrade."' },
    { q: 'Theo dõi độ trễ, token, tỉ lệ lỗi và dấu hiệu từ chối là việc của giai đoạn nào?', options: ['Develop', 'Implement', 'Maintain', 'Operate'], answer: 3, explain: '"In operate, the app is live, and you\'re watching latency, token usage, error rates, and any refusal or failure signatures."' },
    { q: 'Mục tiêu chính của giai đoạn develop là gì?', options: ['Đạt độ ổn định và hiệu năng ngang bản chạy production', 'Học và chứng minh ý tưởng chạy được', 'Tối ưu chi phí token', 'Viết tài liệu hướng dẫn chi tiết cho người dùng cuối'], answer: 1, explain: '"Develop phase, where the whole point is learning, not polishing."' },
    { q: 'Vì sao trong develop vẫn phải thử cả input lộn xộn và cố tình phá?', options: ['Để tăng số token tiêu thụ', 'Vì QA yêu cầu có đủ bộ input khó trước khi bắt đầu giai đoạn develop', 'Vì một kết quả may mắn không chứng minh được nó chạy', 'Để Claude học từ các input đó'], answer: 2, explain: '"Testing it against real inputs and the messy adversarial ones too, because one lucky output isn\'t proof it works."' },
    { q: 'Việc nào bạn CỐ Ý chưa làm trong develop?', options: ['Xử lý lỗi cầu kỳ, retry, và toàn bộ cấu hình cho môi trường production', 'Gửi prompt thử nghiệm thẳng tới Messages API để xem kết quả trả về', 'Kiểm tra hình dạng câu trả lời', 'Thử nhiều cách viết prompt'], answer: 0, explain: '"What you\'re deliberately not doing yet is hardening. No elaborate error handling, no production configuration."' },
    { q: 'Mọi lời gọi tới Messages API có dạng gì?', options: ['GET tới /v1/models kèm query string chứa model và nội dung tin nhắn', 'HTTP POST tới /v1/messages, gửi và nhận JSON', 'WebSocket tới /v1/chat', 'PUT tới /v1/messages/{id}'], answer: 1, explain: '"Every call is an HTTP post to the V1 messages endpoint, and you send JSON and get JSON back. So this is a plain REST API underneath."' },
    { q: 'Header nào dùng để xác thực?', options: ['anthropic-version', 'content-type', 'authorization-model', 'x-api-key'], answer: 3, explain: '"Second, the x-api-key header. That\'s what authenticates you."' },
    { q: 'Header anthropic-version có vai trò gì?', options: ['Chọn model trả lời', 'Bật tự động mọi tính năng beta mới nhất mà API vừa phát hành', 'Ghim hành vi request/response vào một phiên bản API có ngày', 'Báo cho server biết phiên bản SDK đang dùng để tương thích ngược'], answer: 2, explain: '"It\'s required, and it pins the request and response behavior to a dated API version, so your integration doesn\'t shift under you when the API evolves."' },
    { q: 'API key nên được lưu ở đâu?', options: ['Trong secret manager', 'Trong code, ở một hằng số riêng được mã hóa base64 cho an toàn', 'Trong CLAUDE.md để cả team dùng', 'Trong file README của repo'], answer: 0, explain: '"Store your API key in a secret manager and load it at runtime and never commit it to the repo because a leaked key is a real incident."' },
    { q: 'Câu hỏi của tư duy "harden" là gì?', options: ['Ý tưởng này có chạy được không?', 'Prompt nào cho kết quả đẹp nhất trên bộ input thử nghiệm của team?', 'Model nào rẻ nhất?', 'Nó có tiếp tục chạy được khi tải cao vào ngày xấu không?'], answer: 3, explain: '"Prototype asks, can this work? Harden asks, will this keep working under load on a bad day in production?"' },
    { q: 'Câu nào ĐÚNG về prototype và harden?', options: ['Phải làm cả hai cùng lúc ngay từ đầu', 'Cần cả hai, nhưng không cùng lúc', 'Chỉ cần harden, bỏ qua prototype', 'Chỉ cần prototype nếu code tốt'], answer: 1, explain: '"Same code, two mindsets... You need both, just not at the same moment."' },
    { q: 'Việc nào thuộc về hardening khi chuyển sang implement?', options: ['Đổi cách viết prompt liên tục để thử', 'Chấp nhận các chỗ còn thô để đi nhanh, sửa sau khi người dùng phàn nàn', 'Thêm kiểm tra input, xử lý lỗi, retry và cấu hình ổn định', 'Chỉ chạy trên máy cá nhân'], answer: 2, explain: '"You add input validation, real error handling, retries for flaky calls, and stable configuration, so the same request behaves predictably every time you run it."' },
    { q: 'Chủ đề của giai đoạn implement là gì?', options: ['Độ bền: chạy ổn định, không người trông, ở mọi nơi cần', 'Tốc độ học', 'Sự sáng tạo và linh hoạt trong cách viết prompt cho từng trường hợp', 'Giảm số tính năng'], answer: 0, explain: '"The theme of this phase is durability, taking something that worked once on your machine and making it run reliably, unattended, everywhere it needs to."' },
    { q: 'Điều gì thay đổi khi code rời máy bạn lên production?', options: ['Không còn rate limit', 'Không cần xác thực nữa vì server production đã nằm trong mạng nội bộ', 'Model trả lời nhanh hơn', 'Không ai ở đó để chạy lại lời gọi lỗi'], answer: 3, explain: '"In production, nobody is there to rerun anything. The app has to load its own credentials, survive a rate limit at two in the morning..."' },
    { q: 'Bài học nói gì về các bước thủ công lúc prototype?', options: ['Ghi vào tài liệu runbook để đội vận hành làm tay mỗi khi có sự cố', 'Hệ thống phải tự làm hết', 'Bỏ qua vì production không cần', 'Giữ nguyên để linh hoạt'], answer: 1, explain: '"Every manual step you performed while prototyping has to become something the system does for itself."' },
    { q: 'Ba thứ gần như lần nào cũng phải nối trong implement là gì?', options: ['Prompt, model, temperature', 'Streaming, prompt caching và batching cho mọi lời gọi tới API', 'Xác thực và bí mật, xử lý lỗi rate limit và lỗi server, đóng gói và triển khai lên nền tảng đích', 'UI, database, logging'], answer: 2, explain: '"Auth errors deployment... this is the plumbing that turns a working prototype into something you can actually put in front of users."' },
    { q: 'Vì sao không bao giờ commit API key vào repo?', options: ['Vì key lộ ra là một sự cố thật', 'Vì Git không lưu được chuỗi dài', 'Vì key sẽ hết hạn khi commit', 'Vì SDK không đọc được key từ file'], answer: 0, explain: '"Never commit it to the repo because a leaked key is a real incident."' },
    { q: 'Gặp lỗi 429 hoặc 5xx ở rìa tích hợp, nên làm gì?', options: ['Sửa body request', 'Đổi API key', 'Báo ngay cho người dùng và dừng', 'Chờ một khoảng (backoff) rồi gửi lại request'], answer: 3, explain: '"The 429 and the 500 series errors... Both sit in the retry bucket, so back off and resend."' },
    { q: 'Gặp lỗi 401, điều gì ĐÚNG?', options: ['Retry vài lần với exponential backoff là lỗi sẽ tự hết sau vài giây', 'Key thiếu hoặc sai; retry không sửa được, phải sửa key', 'Server đang quá tải, chờ một lúc', 'Request quá lớn, cần cắt bớt'], answer: 1, explain: '"The 401. That means your authentication is bad, a missing or wrong key, and no amount of retrying will fix it."' },
    { q: 'Một rìa tích hợp "được làm tốt" xử lý lỗi xác thực thế nào?', options: ['Retry vô hạn với backoff tăng dần cho tới khi lời gọi thành công', 'Ghi log rồi im lặng bỏ qua', 'Báo ngay', 'Tự động tạo key mới'], answer: 2, explain: '"A well-built edge surfaces an auth failure immediately instead of letting it hide inside a retry loop."' },
    { q: 'Câu tóm gọn kỹ năng xử lý lỗi trong bài là gì?', options: ['Retry cái tự hết; cái không tự hết thì báo ngay và sửa nguyên nhân gốc, ví dụ sai key, sai body', 'Retry mọi lỗi tối đa ba lần', 'Không bao giờ retry để tiết kiệm token', 'Mọi lỗi, dù tạm thời hay vĩnh viễn, đều chuyển ngay cho người xử lý'], answer: 0, explain: '"Triage stays the skill. Retry what clears, surface, and fix what doesn\'t."' },
    { q: 'File nào nên được commit vào Git?', options: ['.claude/settings.local.json', '.env chứa API key', 'File log chi tiết của lần chạy trước để đồng đội tham khảo', '.claude/settings.json'], answer: 3, explain: '"Your shared config, your CLAUDE.md, and the project settings.json gets committed, so every teammate and every environment picks up the same behavior."' },
    { q: 'Vì sao .claude/settings.local.json được gitignore?', options: ['Vì file đó quá lớn', 'Vì nó chứa cấu hình riêng của máy bạn, chỉ dành cho bạn, không áp dụng cho đồng đội và các môi trường khác', 'Vì Claude Code không bao giờ đọc file đó khi chạy trong CI', 'Vì nó chứa API key bắt buộc'], answer: 1, explain: '"Your personal config, the settings.local.json stays Git-ignored because it holds machine-specific overrides that are yours alone."' },
    { q: 'Điều "hay bị quên" về cấu hình trong bài là gì?', options: ['Viết CLAUDE.md thật dài, liệt kê mọi quy tắc có thể nghĩ ra cho dự án', 'Commit file .env', 'Ghim một model ID chính xác và commit nó', 'Đặt temperature bằng 0'], answer: 2, explain: '"And here\'s the one people forget, pin an exact model ID and commit that too."' },
    { q: 'Với model trước 4.6, "ghim model" nghĩa là gì?', options: ['Dùng snapshot có ngày thay vì alias ngắn trôi nổi', 'Dùng alias ngắn vì nó luôn tự trỏ tới bản mới nhất và tốt nhất', 'Dùng tên có chữ "latest"', 'Không cần ghim vì model không đổi'], answer: 0, explain: '"On pre-4.6 models, that means the dated snapshot rather than the shorter floating alias."' },
    { q: 'Với model từ 4.6 trở đi, ID không có ngày như "Claude Opus 4.8" là gì?', options: ['Một alias trôi nổi cần tránh', 'Một ID không hợp lệ', 'Một ID chỉ dùng được trên Bedrock', 'Đã là snapshot cố định'], answer: 3, explain: '"From 4.6 on, the dateless ID like Claude Opus 4.8 already is the pinned snapshot, so there is no alias to avoid."' },
    { q: 'Ghim và commit model ID giúp tránh điều gì?', options: ['Rate limit khi có nhiều người dùng truy cập cùng lúc vào giờ cao điểm', 'Âm thầm trôi hành vi', 'Lỗi 401 khi đổi máy', 'Chi phí ghi cache'], answer: 1, explain: '"A teammate\'s run and production\'s run behave like yours instead of silently drifting when a new model ships."' },
    { q: 'Hành vi tái lập được (reproducible) bắt đầu từ đâu theo bài học?', options: ['Từ việc dùng model mạnh nhất', 'Từ việc viết prompt thật dài và chi tiết cho mọi trường hợp có thể xảy ra', 'Từ việc đưa đúng cấu hình vào source control', 'Từ việc tắt streaming'], answer: 2, explain: '"Reproducible behavior starts with putting the right configuration under source control."' },
    { q: 'Câu nào là phần tổng kết đúng của bài?', options: ['Develop chứng minh ý tưởng bằng Messages API; implement thêm xác thực, bí mật, xử lý lỗi, triển khai, và xử lý lỗi ở rìa tích hợp', 'Develop là lúc tối ưu chi phí token; implement là lúc thử nghiệm nhiều cách viết prompt', 'Develop và implement là cùng một việc', 'Implement chỉ là bước copy code lên server'], answer: 0, explain: '"Develop proves it against the messages API. Implement wires in auth, secrets, error handling, and deployment, and handles failures at the edge."' },
  ],
};
