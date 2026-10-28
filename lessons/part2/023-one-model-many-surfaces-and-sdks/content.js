window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Claude là <strong>một model</strong>, nhưng bạn chạm tới nó qua nhiều "bề mặt" khác nhau: <strong>raw API</strong>, <strong>Agent SDK</strong>,
<strong>Claude Code</strong>, và các <strong>ứng dụng chat</strong>. Bên dưới, model suy luận như nhau. Thứ khác nhau là <strong>lớp vỏ</strong>: bề mặt nào tự nạp
system prompt nào, CLAUDE.md nào, tool nào, bộ nhớ nào. Khi hành vi khác nhau giữa hai bề mặt, hãy nghi lớp vỏ trước, model sau.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Surface (bề mặt):</strong> cách bạn chạm tới Claude: gọi API, dùng SDK, dùng công cụ dòng lệnh, hay mở chat trên web.</li>
  <li><strong>Scaffolding (lớp vỏ):</strong> mọi thứ bọc quanh model: system prompt, tool, file cấu hình được nạp, bộ nhớ phiên.</li>
  <li><strong>Claude Code preset:</strong> tùy chọn trong Agent SDK để dùng system prompt đầy đủ của Claude Code.</li>
  <li><strong>setting sources:</strong> tùy chọn của Agent SDK quyết định nạp CLAUDE.md nào: "project" (trong repo) và "user" (trong thư mục cấu hình cá nhân).</li>
  <li><strong>Auto-memory:</strong> bộ nhớ tự động Claude Code nạp khi mở phiên.</li>
</ul>

<h3>Ba cách chính chạm tới Claude trong code</h3>
<ul>
  <li><strong>Raw API:</strong> gọi thẳng endpoint messages, tự đưa mọi chỉ dẫn qua tham số <code>system</code>. <strong>Không có gì tự nạp.</strong></li>
  <li><strong>Agent SDK:</strong> chạy vòng lặp agent giúp bạn, nhưng system prompt mặc định <strong>cố ý tối giản</strong>, vừa đủ để gọi tool, không phải prompt đầy đủ của Claude Code.</li>
  <li><strong>Claude Code:</strong> agent lập trình dòng lệnh; vừa mở phiên là nạp <strong>system prompt đầy đủ</strong>, <strong>cả hệ thống CLAUDE.md</strong> và <strong>auto-memory</strong>.</li>
</ul>
<p>Cùng một model bên dưới, ba lượng lớp vỏ rất khác nhau.</p>

<h3>Mô hình tư duy đúng</h3>
<div class="box">🎭 <strong>Hình dung thế này:</strong> Cùng một diễn viên, đóng ba vở khác nhau. Diễn viên (model) không đổi tài năng.
Thứ khác là kịch bản được đưa (system prompt), đạo cụ trên sân khấu (tool), và ghi chú hậu trường (CLAUDE.md, bộ nhớ). Diễn khác nhau thì trước hết hãy xem kịch bản và đạo cụ.</div>
<p>Với cùng chỉ dẫn và cùng ngữ cảnh, model suy luận như nhau. Thứ đổi theo bề mặt là lớp vỏ: <strong>quyền dùng tool</strong> (từ không có tool nào tới bộ tool đầy đủ),
<strong>việc nạp file và cấu hình</strong> (có bề mặt đọc từ đĩa, có bề mặt không chạm vào gì bạn không đưa), và <strong>mô hình phiên và bộ nhớ</strong>.
Hành vi khác nhau thì nghi phạm đầu tiên là lớp vỏ, không phải model.</p>

<h3>Chỉ dẫn của bạn thật sự nằm ở đâu?</h3>
<ul>
  <li><strong>Raw API:</strong> chỉ trong tham số <code>system</code> bạn đặt trên request; không gì khác được nạp.</li>
  <li><strong>Agent SDK:</strong> prompt mặc định tối giản, cộng CLAUDE.md của bạn khi setting sources tương ứng được bật (mặc định là bật).</li>
  <li><strong>Claude Code:</strong> system prompt đầy đủ, cả hệ thống CLAUDE.md, rules của bạn và auto-memory, tất cả nạp lúc khởi động.</li>
  <li><strong>Chat trên web:</strong> chỉ dẫn hồ sơ và chỉ dẫn dự án, nhưng <strong>chỉ trong bề mặt web đó</strong>.</li>
</ul>

<h3>Raw API: không có phép màu</h3>
<p>Bạn nhận đúng thứ bạn cấu hình, không hơn. Kênh duy nhất cho chỉ dẫn cấp hệ thống là tham số <code>system</code>. Không có CLAUDE.md đọc từ đĩa,
không có preset, không có auto-memory mang gì qua các lần gọi. Vai trò, quy tắc an toàn, hướng dẫn dùng tool: <strong>bạn tự viết và gửi mỗi lần</strong>.
Mặt lợi: kiểm soát hoàn toàn thứ model thấy. Mặt trái: chịu trách nhiệm hoàn toàn. <strong>Không đưa vào request thì model không bao giờ nhận được.</strong></p>

<h3>Agent SDK và Claude Code: mặc định ngược nhau</h3>
<ul>
  <li><strong>Agent SDK:</strong> system prompt mặc định tối giản, làm cho việc gọi tool, <strong>không phải</strong> prompt của Claude Code.
  Muốn nó cư xử như agent dòng lệnh thì <strong>đặt Claude Code preset</strong> một cách tường minh, và có thể nối thêm text của bạn.</li>
  <li><strong>Claude Code:</strong> ngược lại; kể cả chạy headless ở print mode, nó vẫn dùng system prompt đầy đủ và nạp cả chồng cấu hình mà bạn không cần bật gì.</li>
</ul>
<p>Cùng một vòng lặp bên dưới mà cảm giác rất khác, tùy bạn thừa hưởng mặc định nào. <strong>Gọi tên bề mặt trước khi giả định prompt.</strong></p>

<h3>Phần hay bị hiểu sai nhất: cái gì nạp CLAUDE.md trong SDK?</h3>
<p>SDK <strong>không</strong> nạp CLAUDE.md vì bạn bật Claude Code preset. Đó là <strong>hai công tắc riêng</strong>. Thứ thật sự quyết định là <strong>setting sources</strong>:
nguồn <code>project</code> nạp CLAUDE.md trong repo, nguồn <code>user</code> nạp CLAUDE.md trong thư mục cấu hình cá nhân.
Tin tốt: tùy chọn query mặc định <strong>bật cả hai</strong>, nên mặc định CLAUDE.md của bạn được nạp. Nhưng khi bạn truyền một danh sách nguồn tường minh, bạn tự chịu:
<strong>truyền danh sách rỗng là không CLAUDE.md nào được nạp</strong>, có preset hay không.</p>

<h3>Chat trên web và ứng dụng desktop</h3>
<p>Trên Claude.ai bạn đặt được chỉ dẫn hồ sơ và chỉ dẫn dự án; mọi hội thoại trong dự án thừa hưởng chúng. Claude Desktop tương tự, có chỉ dẫn và connector riêng.
Điểm quan trọng cho người xây dựng: mọi thứ đặt trong các ứng dụng chat <strong>chỉ có hiệu lực trong bề mặt đó</strong>.
Chúng không bao giờ tới phiên Claude Code hay lời gọi raw API của bạn. Một quy tắc gõ trong web app sẽ không theo model vào code.</p>

<h3>Thói quen debug khi hai bề mặt cư xử khác nhau</h3>
<ol>
  <li>Kìm bản năng đổ lỗi cho model hay prompt.</li>
  <li><strong>Tái hiện đúng prompt đó</strong> trên một bề mặt bạn kiểm soát hoàn toàn, ví dụ raw API.</li>
  <li><strong>So xem mỗi bề mặt đã nạp gì</strong>: cấu hình, system prompt, tool. Khác biệt thường nằm ở đây.</li>
  <li>Chỉ sau khi loại trừ lớp vỏ mới xem tới output của model.</li>
</ol>
<p>Chín trên mười lần, điều bất ngờ quy về một cấu hình được nạp hay một tool bị thiếu, không phải model suy luận khác đi.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Một model, nhiều bề mặt; mỗi bề mặt bọc lớp vỏ khác nhau.</li>
  <li>Raw API chỉ có tham số system; Agent SDK mặc định prompt tối giản; Claude Code nạp đầy đủ.</li>
  <li>Setting sources, không phải preset, quyết định CLAUDE.md có được nạp trong SDK.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">worth getting straight</em>: đáng để hiểu cho rõ.</li>
  <li><em class="en">each wrap that model differently</em>: mỗi cái bọc model theo một kiểu.</li>
  <li><em class="en">deliberately minimal</em>: cố ý tối giản.</li>
  <li><em class="en">three very different amounts of scaffolding</em>: ba lượng lớp vỏ rất khác nhau.</li>
  <li><em class="en">the first suspect is the scaffolding, not the model</em>: nghi phạm đầu tiên là lớp vỏ, không phải model.</li>
  <li><em class="en">There's no magic here</em>: không có phép màu nào.</li>
  <li><em class="en">total control, total responsibility</em>: kiểm soát hoàn toàn, chịu trách nhiệm hoàn toàn.</li>
  <li><em class="en">trips people up constantly</em>: làm người ta vấp liên tục.</li>
  <li><em class="en">Name the surface before you assume the prompt</em>: gọi tên bề mặt trước khi giả định prompt.</li>
  <li><em class="en">two separate switches</em>: hai công tắc riêng.</li>
  <li><em class="en">out of the box</em>: ngay khi dùng, không cần chỉnh.</li>
  <li><em class="en">surface scoped</em>: chỉ có hiệu lực trong bề mặt đó.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson23/Lesson23.java</code>. Có 3 bài: liệt kê những gì mỗi bề mặt tự nạp (kể cả ảnh hưởng của preset và setting sources trong SDK),
quyết định một quy tắc đặt ở đâu thì tới được bề mặt nào, và thứ tự các bước debug. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-23"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-23 --live"</code>: cùng một câu hỏi gửi hai lần qua raw API, một lần không có quy tắc, một lần đưa quy tắc vào system,
để thấy trên raw API Claude chỉ biết đúng những gì bạn gửi.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Giữa các bề mặt (raw API, Agent SDK, Claude Code), cái gì KHÔNG đổi?', options: ['System prompt mặc định', 'Hành vi cốt lõi của model', 'Bộ tool có sẵn trong phiên làm việc', 'Việc nạp CLAUDE.md và auto-memory'], answer: 1, explain: '"Underneath every surface, the model\'s core behavior is constant. Given the same instructions and the same context, it reasons the same way."' },
    { q: 'Trên raw API, chỉ dẫn cấp hệ thống đi qua kênh nào?', options: ['CLAUDE.md trong repo', 'Auto-memory của phiên trước', 'Tham số system trên request', 'Hồ sơ trên Claude.ai'], answer: 2, explain: '"Your only channel for system level instruction is the system parameter on the request, that\'s it."' },
    { q: 'System prompt mặc định của Agent SDK là gì?', options: ['Tối giản, vừa đủ để gọi tool', 'Prompt đầy đủ của Claude Code', 'Trống hoàn toàn', 'Prompt của Claude.ai'], answer: 0, explain: '"Its default system prompt is deliberately minimal, just enough for tool calling, not the full Claude Code prompt."' },
    { q: 'Claude Code nạp những gì khi vừa mở phiên?', options: ['Chỉ tham số system', 'Chỉ CLAUDE.md của dự án, không có gì thêm', 'Không nạp gì cho tới khi bạn yêu cầu rõ ràng', 'Prompt đầy đủ, CLAUDE.md, auto-memory'], answer: 3, explain: '"It loads a full system prompt, the entire CLAUDE.md hierarchy, and auto-memory the moment a session starts."' },
    { q: 'Cùng một prompt nhưng hành vi khác nhau giữa hai bề mặt. Nghi phạm đầu tiên là gì?', options: ['Model suy luận khác đi', 'Lớp vỏ', 'Mạng chậm', 'API key khác nhau'], answer: 1, explain: '"When a behavior looks different across surfaces, the first suspect is the scaffolding, not the model."' },
    { q: 'Trục nào thuộc "lớp vỏ" thay đổi giữa các bề mặt?', options: ['Trọng số và dữ liệu huấn luyện của model', 'Cách model suy luận', 'Quyền tool, nạp cấu hình, mô hình phiên', 'Bảng giá token và giới hạn tốc độ của API'], answer: 2, explain: 'Bài học nêu "tool access", "file and config loading" và "the session and memory model" là các trục thay đổi.' },
    { q: 'Trên raw API, bạn quên đưa quy tắc an toàn vào request. Model có biết quy tắc đó không?', options: ['Không', 'Có, nếu nó nằm trong CLAUDE.md', 'Có, vì model nhớ từ lần trước', 'Có, nếu bạn đặt trên Claude.ai'], answer: 0, explain: '"If you didn\'t put an instruction in the request, the model simply never got it."' },
    { q: 'Mặt lợi và mặt trái của raw API là gì?', options: ['Rẻ hơn và chậm hơn', 'Nhiều tool có sẵn hơn và kém an toàn hơn hẳn', 'Tự nạp mọi thứ sẵn và rất khó tùy chỉnh lại', 'Toàn quyền kiểm soát, toàn trách nhiệm'], answer: 3, explain: '"The upside is total control over what the model sees. The trade-off is total responsibility."' },
    { q: 'Muốn Agent SDK cư xử như Claude Code dòng lệnh, làm gì?', options: ['Không làm được', 'Đặt Claude Code preset tường minh', 'Bật auto-memory trong file cấu hình', 'Dùng raw API thay thế cho Agent SDK'], answer: 1, explain: '"If you want the SDK to behave like the command line agent, you set the Claude Code preset explicitly, and you can append your own text on top."' },
    { q: 'Chạy Claude Code headless ở print mode thì system prompt là gì?', options: ['Prompt tối giản mặc định của Agent SDK', 'Trống', 'Vẫn là prompt đầy đủ của Claude Code', 'Chỉ CLAUDE.md'], answer: 2, explain: '"Even when you run it headless in print mode, it uses the full Claude Code system prompt and loads its whole config stack."' },
    { q: 'Trong Agent SDK, thứ gì quyết định CLAUDE.md có được nạp không?', options: ['setting sources', 'Claude Code preset', 'Tên model', 'Tham số system'], answer: 0, explain: '"What actually controls CLAUDE.md loading is setting sources... Setting sources decide every time."' },
    { q: 'Bạn bật Claude Code preset và truyền setting sources là danh sách rỗng. CLAUDE.md có được nạp không?', options: ['Có, vì preset nạp CLAUDE.md', 'Có, chỉ CLAUDE.md của user', 'Có, chỉ CLAUDE.md của project', 'Không'], answer: 3, explain: '"Pass an empty list and no CLAUDE.md loads at all, preset or not."' },
    { q: 'Không truyền setting sources (dùng mặc định) thì sao?', options: ['Không CLAUDE.md nào được nạp', 'Nạp cả project lẫn user', 'Chỉ nạp user', 'Báo lỗi thiếu tham số'], answer: 1, explain: '"The default query options enable both of those sources, so out of the box, your CLAUDE.md does load automatically."' },
    { q: 'Nguồn "project" và "user" lần lượt nạp CLAUDE.md nào?', options: ['Trên Claude.ai và trong ứng dụng Desktop của bạn', 'Của Anthropic và của bạn', 'Trong repo và trong thư mục cấu hình cá nhân', 'Của phiên trước và phiên này'], answer: 2, explain: '"The project source loads the CLAUDE.md in your repository. The user source loads the one in your home config directory."' },
    { q: 'Bạn đặt một quy tắc trong chỉ dẫn hồ sơ trên Claude.ai. Nó có ảnh hưởng tới phiên Claude Code không?', options: ['Không: chỉ có hiệu lực trên web', 'Có, mọi bề mặt dùng chung', 'Có, nếu cùng tài khoản', 'Có, sau khi đồng bộ'], answer: 0, explain: '"Those instructions never reach your Claude Code sessions or your raw API calls. Each surface keeps its own configuration."' },
    { q: 'Bước đầu tiên của thói quen debug giữa hai bề mặt là gì?', options: ['Đổi sang một model mạnh hơn để thử lại', 'Viết lại prompt', 'Báo lỗi cho Anthropic kèm ảnh chụp màn hình', 'Tái hiện prompt ở nơi bạn kiểm soát'], answer: 3, explain: '"First, separate the interface layer from the model output. Reproduce the exact same prompt on a second surface, say the raw API, where you control everything."' },
    { q: 'Sau khi tái hiện, bước tiếp theo là gì?', options: ['Đổi API key sang tài khoản khác', 'So mỗi bề mặt đã nạp gì', 'Tăng max_tokens lên gấp đôi', 'Tắt tool'], answer: 1, explain: '"Then check what each surface actually loaded, its config, its system prompt, and its tools, because that\'s usually where the difference lives."' },
    { q: 'Khi nào mới nên xem tới output của model?', options: ['Ngay từ đầu', 'Khi người dùng phàn nàn', 'Sau khi loại trừ lớp vỏ', 'Không bao giờ'], answer: 2, explain: '"Only after you\'ve ruled out the scaffolding should you look at the model output itself."' },
    { q: '"Chín trên mười lần", điều bất ngờ quy về đâu?', options: ['Cấu hình được nạp hay tool bị thiếu', 'Model suy luận khác đi', 'Lỗi mạng', 'Rate limit'], answer: 0, explain: '"Nine times out of 10, the surprise traces back to a loaded config or a missing tool, not to the model reasoning differently."' },
    { q: 'Câu nào ĐÚNG về Claude Code preset và việc nạp CLAUDE.md?', options: ['Preset bật thì CLAUDE.md tự nạp', 'Preset tắt thì CLAUDE.md không nạp', 'Preset quyết định nguồn user', 'Hai công tắc riêng'], answer: 3, explain: '"The SDK doesn\'t load your CLAUDE.md because you turned on the Claude Code preset. Those are two separate switches."' },
    { q: 'Trên raw API, có thứ nào mang thông tin qua các lần gọi không?', options: ['Auto-memory', 'Không có gì', 'CLAUDE.md', 'Preset'], answer: 1, explain: '"There\'s no CLAUDE.md being read off-disk, no presets, and no auto-memory carrying anything between calls."' },
    { q: 'Quy tắc ngắn gọn bài học đưa ra trước khi giả định prompt là gì?', options: ['Luôn dùng raw API cho chắc ăn', 'Luôn bật preset', 'Gọi tên bề mặt trước', 'Luôn tắt CLAUDE.md khi gỡ lỗi'], answer: 2, explain: '"Name the surface before you assume the prompt."' },
    { q: 'Bạn chạy một agent bằng Agent SDK và thấy nó không làm theo phong cách của Claude Code dòng lệnh. Lý do hợp lý nhất?', options: ['SDK mặc định prompt tối giản', 'Model của SDK yếu hơn', 'SDK không gọi được tool', 'SDK không đọc được file'], answer: 0, explain: '"When you use the agent SDK, its default system prompt is minimal... It isn\'t the Claude Code prompt."' },
    { q: 'Claude Desktop thuộc loại bề mặt nào?', options: ['Một SDK dành cho lập trình viên', 'Một endpoint API', 'Một biến thể của Claude Code', 'Ứng dụng chat, cấu hình riêng'], answer: 3, explain: '"Claude Desktop is a comparable consumer chat app with its own custom instructions and connectors."' },
    { q: 'Câu nào về tool trên các bề mặt là ĐÚNG?', options: ['Mọi bề mặt có cùng bộ tool', 'Từ không tool nào tới bộ tool đầy đủ', 'Raw API có nhiều tool nhất', 'Chat app không có cấu hình riêng'], answer: 1, explain: '"Tool access is one axis. It can range from no tools at all on a bare API call-up, to a full tool set in Claude Code."' },
    { q: 'Mọi hội thoại trong một dự án trên Claude.ai thừa hưởng gì?', options: ['CLAUDE.md của repo', 'Auto-memory của Claude Code', 'Chỉ dẫn dự án', 'Tham số system của API'], answer: 2, explain: '"On Claude.ai, you can set profile custom instructions and project instructions, and every conversation in that project inherits them."' },
    { q: 'Bạn truyền setting sources = ["project"]. Agent SDK nạp gì?', options: ['Prompt tối giản và CLAUDE.md dự án', 'Không CLAUDE.md nào', 'Cả CLAUDE.md dự án lẫn cá nhân', 'Prompt đầy đủ của Claude Code'], answer: 0, explain: 'Khi truyền danh sách tường minh, "you own it": chỉ nguồn project được nạp, cộng prompt mặc định tối giản (chưa bật preset).' },
    { q: 'Câu tổng kết đúng của bài là gì?', options: ['Mỗi bề mặt dùng một model khác', 'Mọi bề mặt nạp giống nhau', 'Preset là thứ nạp CLAUDE.md', 'Một model, nhiều lớp vỏ khác nhau'], answer: 3, explain: '"One Claude model reaches you through several surfaces and each wraps it with different scaffolding... setting sources, not the preset, are what load CLAUDE.md."' },
    { q: 'Vì sao nói raw API "không có phép màu"?', options: ['Vì nó không dùng được tool', 'Bạn nhận đúng thứ bạn cấu hình', 'Vì nó chậm hơn SDK', 'Vì nó không stream được'], answer: 1, explain: '"There\'s no magic here. You get exactly what you configure and not one thing more."' },
    { q: 'Một quy tắc phải áp dụng cho cả Claude Code lẫn Agent SDK (nguồn mặc định). Đặt ở đâu hợp nhất?', options: ['Chỉ dẫn hồ sơ trên Claude.ai', 'Gõ trong từng phiên', 'CLAUDE.md của dự án', 'Ghi chú trên máy cá nhân'], answer: 2, explain: 'CLAUDE.md của dự án được Claude Code nạp, và Agent SDK nạp khi nguồn project bật (mặc định bật). Chỉ dẫn trên web "never reach" Claude Code.' },
  ],
};
