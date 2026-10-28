window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> CLAUDE.md là <strong>bản brief thường trực</strong> bạn viết cho Claude, nạp <strong>đầy đủ</strong> vào đầu mỗi phiên.
Nó chỉ nên chứa ba loại nội dung: <strong>cấu trúc dự án, quy ước, và lệnh</strong> (viết nguyên văn). Mỗi dòng đều tốn token mỗi phiên, nên viết <strong>ngắn, cụ thể, dạng mệnh lệnh</strong>.
Và nhớ: CLAUDE.md là <strong>hướng dẫn để cân nhắc, không phải cưỡng chế</strong>; cần chặn thật thì dùng <strong>PreToolUse hook</strong>.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>CLAUDE.md:</strong> quy tắc do lập trình viên viết tay, nạp vào context đầu mỗi phiên, áp cho mọi lượt.</li>
  <li><strong>Agent memory:</strong> trạng thái bền do chính agent ghi và cập nhật khi làm việc; sống qua compaction và qua ranh giới phiên.</li>
  <li><strong>Context window:</strong> không gian làm việc tạm thời của phiên hiện tại; bị cắt khi đầy, không tự lưu lại.</li>
  <li><strong>PreToolUse hook:</strong> đoạn kiểm tra chạy một cách tất định trước khi tool thực thi, có thể từ chối hẳn hành động.</li>
  <li><strong>Verbatim:</strong> nguyên văn, chép y hệt từng ký tự (ví dụ lệnh build có đủ cờ và đường dẫn).</li>
  <li><strong>Tribal knowledge:</strong> kiến thức chỉ nằm trong đầu vài người, không được ghi lại.</li>
</ul>

<h3>Ba thứ hay bị nhầm</h3>
<ul>
  <li><strong>CLAUDE.md:</strong> bạn viết; nạp đầu mỗi phiên; áp cho mọi lượt.</li>
  <li><strong>Agent memory:</strong> agent tự viết; sống qua compaction và cả khi hết phiên.</li>
  <li><strong>Context window:</strong> chỗ làm việc tạm; bị cắt khi đầy; không có gì ở đó tự tồn tại lâu.</li>
</ul>
<p>Bài này nói về thứ đầu tiên: thứ bạn viết bằng tay.</p>

<h3>Tư duy quan trọng nhất: cân nhắc, không phải tuân lệnh</h3>
<p>Claude coi CLAUDE.md là <strong>ngữ cảnh để cân nhắc</strong>, không phải cấu hình bị ép phải tuân. Vì vậy một quy tắc <strong>có thể bị bỏ sót</strong>,
nhất là khi context đông đúc và câu chỉ dẫn bị chôn dưới mọi thứ khác. Nếu một hành động <strong>thật sự phải bị chặn</strong> (ví dụ lệnh phá hoại),
đừng dựa vào một dòng chữ: dùng <strong>PreToolUse hook</strong>, chạy tất định trước khi tool chạy và có thể từ chối thẳng.
<strong>Viết rule để lái hành vi, dùng hook khi cần cưỡng chế thật.</strong></p>

<h3>Ba loại nội dung xứng đáng có chỗ</h3>
<ol>
  <li><strong>Cấu trúc dự án:</strong> thứ gì nằm ở đâu, thư mục chính, code base tổ chức thế nào, để Claude không phải lục lọi.</li>
  <li><strong>Quy ước:</strong> coding style, cách đặt tên, pattern của nhóm, nói thẳng để output khớp chuẩn của bạn thay vì mặc định chung chung.</li>
  <li><strong>Lệnh:</strong> lệnh build, test, lint <strong>nguyên văn</strong>, để Claude chép và chạy được.</li>
</ol>
<p>Điểm chung: mỗi thứ giúp Claude <strong>khỏi phải đoán</strong> điều nhóm bạn đã biết. Đó là thứ làm một quy tắc "đáng giá token của nó".</p>

<h3>Phía chi phí: CLAUDE.md không phải bộ nhớ miễn phí</h3>
<ul>
  <li>Mỗi dòng đều nạp vào context window: coi nó là <strong>ngân sách</strong> bạn đang tiêu.</li>
  <li>Cả file nạp <strong>đầy đủ</strong>, dài bao nhiêu cũng vậy: <strong>không tóm tắt, không cắt bớt</strong> cho vừa.</li>
  <li>File phình to sẽ chiếm chỗ model cần cho công việc thật. Mục tiêu tốt: <strong>dưới khoảng hai trăm dòng</strong>.</li>
</ul>

<div class="box">🎒 <strong>Hình dung thế này:</strong> CLAUDE.md như <strong>tờ dặn dò dán trên cửa tủ lạnh</strong> cho người trông nhà.
Mỗi sáng họ đọc <strong>hết cả tờ</strong>. Nếu tờ ghi "Tưới cây lúc 7h, khóa cửa sau bằng chìa xanh", họ làm ngay.
Nếu tờ là ba trang kể lịch sử khu vườn, câu "khóa cửa sau" bị chìm mất. Và nếu cửa <strong>tuyệt đối không được mở</strong>, bạn lắp khóa (hook), chứ không chỉ viết giấy nhắc.</div>

<h3>Rule gọn so với văn xuôi dài dòng</h3>
<ul>
  <li><strong>Scoped rules:</strong> ngắn, cụ thể, kiểm chứng được; mỗi cái là một chỉ thị rõ model làm theo được ở mọi lượt.</li>
  <li><strong>Verbose prose:</strong> đoạn văn dài kể bối cảnh và lý do như tài liệu. Chúng đốt context, chôn mất câu quan trọng, khiến Claude khó tìm và làm theo.</li>
</ul>
<p>Khi thấy mình đang giải thích "vì sao" dài dòng: dừng lại, viết lại thành <strong>một chỉ thị ngắn nói phải làm gì</strong>.</p>

<h3>Commit để cả nhóm hưởng lợi</h3>
<p>CLAUDE.md của project nằm ở <strong>gốc repo</strong> và đi qua source control như mọi file khác. Commit nó thì ai clone repo cũng <strong>thừa hưởng đúng quy ước đó</strong>.
Người mới có lệnh build ngay ngày đầu, không phải hỏi ai hay đọc wiki cũ. Hành vi nhất quán vì mọi phiên bắt đầu từ cùng một brief.
So với cảnh lệnh build thật chỉ nằm trong đầu một kỹ sư senior: <strong>quy tắc chung trong version control luôn thắng tribal knowledge</strong>, và cập nhật ngay khi ai đó sửa file rồi push.</p>

<h3>CLAUDE.md tới model thế nào: ba chi tiết</h3>
<ol>
  <li><strong>Nạp lúc đầu:</strong> chèn vào đầu mỗi hội thoại, nên quy tắc đã có mặt trước khi bạn gõ yêu cầu đầu tiên.</li>
  <li><strong>Đến như một lượt user/project message:</strong> đi cạnh system prompt, không nướng vào system prompt.</li>
  <li><strong>Nạp đầy đủ:</strong> khác với file memory có giới hạn chỉ đọc đoạn đầu, CLAUDE.md nạp toàn bộ dù dài cỡ nào.</li>
</ol>
<p>Ba sự thật này giải thích cả sức mạnh lẫn chi phí: luôn có mặt, lái từ trong hội thoại, và luôn tốn đủ token.</p>

<h3>Cách viết một rule tốt</h3>
<ul>
  <li>Viết như <strong>chỉ thị</strong>, không như tài liệu: câu mệnh lệnh, có phạm vi: "làm cái này", "tránh cái kia".</li>
  <li>Lệnh để <strong>nguyên văn</strong>, sẵn sàng chép, không mơ hồ về cờ hay đường dẫn.</li>
  <li><strong>Cắt</strong> mọi thứ không đổi hành vi, vì mỗi dòng giữ lại đều tranh sự chú ý của model.</li>
  <li>Thói quen: <strong>biên tập không thương tiếc</strong>. Dòng nào không làm Claude làm khác đi thì có lẽ không thuộc về đây.</li>
</ul>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>CLAUDE.md chứa cấu trúc, quy ước, lệnh nguyên văn; viết thành chỉ thị ngắn, dưới khoảng 200 dòng.</li>
  <li>Cả file nạp đầy đủ mỗi phiên, như một lượt user cạnh system prompt: mỗi dòng là token bạn trả mỗi phiên.</li>
  <li>Nó là hướng dẫn để cân nhắc, không phải cưỡng chế: cần chặn thật thì dùng PreToolUse hook.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">where you hand Claude your standing rules</em>: nơi bạn trao cho Claude các quy tắc thường trực.</li>
  <li><em class="en">three things people constantly mix up</em>: ba thứ người ta cứ nhầm lẫn mãi.</li>
  <li><em class="en">context to consider, not configuration it is forced to obey</em>: ngữ cảnh để cân nhắc, không phải cấu hình bị ép tuân theo.</li>
  <li><em class="en">your instruction is buried under everything else</em>: chỉ dẫn của bạn bị chôn dưới mọi thứ khác.</li>
  <li><em class="en">deny the action outright</em>: từ chối thẳng hành động.</li>
  <li><em class="en">pull their weight</em>: làm tròn phần việc, xứng đáng có mặt.</li>
  <li><em class="en">without hunting around</em>: không phải lục lọi khắp nơi.</li>
  <li><em class="en">worth its tokens</em>: đáng với số token nó tốn.</li>
  <li><em class="en">this trips people up</em>: chỗ này hay làm người ta vấp.</li>
  <li><em class="en">a bloated file crowds out room</em>: file phình to chiếm hết chỗ.</li>
  <li><em class="en">beat tribal knowledge every time</em>: lần nào cũng thắng kiến thức truyền miệng.</li>
  <li><em class="en">ruthless editing, short and specific wins</em>: biên tập không thương tiếc, ngắn và cụ thể sẽ thắng.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson30/Lesson30.java</code>. Có 5 bài: phân biệt CLAUDE.md, agent memory và context window,
chọn giữa rule CLAUDE.md và PreToolUse hook, tính token CLAUDE.md tiêu qua nhiều phiên (file luôn nạp đầy đủ), viết bộ soát lỗi báo file quá 200 dòng,
dòng văn xuôi dài dòng và lệnh "Run ..." không nguyên văn, rồi dựng file CLAUDE.md gọn từ cấu trúc, quy ước và lệnh.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-30"</code>.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Thứ nào do agent tự ghi khi làm việc và sống qua cả compaction lẫn khi hết phiên?', options: ['CLAUDE.md của project', 'Agent memory', 'Context window', 'System prompt'], answer: 1, explain: '"Agent memory. That is durable state the agent itself writes and updates as it works, and it survives context compaction and even session boundaries."' },
    { q: 'Một ghi chú chỉ nằm trong context window của phiên hiện tại. Điều gì đúng về nó?', options: ['Nó tự lưu vào CLAUDE.md khi phiên kết thúc', 'Nó luôn sống sót qua mọi lần compaction', 'Có thể bị cắt khi đầy, không tự lưu', 'Nó được nạp lại vào đầu phiên sau'], answer: 2, explain: '"The context window... is the ephemeral working space for the current session, and it truncates as things fill up, so nothing living there persists on its own."' },
    { q: 'Câu nào mô tả đúng cách Claude đối xử với CLAUDE.md?', options: ['Ngữ cảnh để cân nhắc, không bắt buộc', 'Cấu hình cứng mà Claude buộc phải tuân theo', 'Một bộ lọc chặn mọi tool call vi phạm quy tắc', 'Một tài liệu chỉ đọc khi được hỏi tới'], answer: 0, explain: '"Claude treats your CLAUDE.md as context to consider, not as configuration it is forced to obey."' },
    { q: 'Nhóm bạn tuyệt đối không cho phép lệnh rm -rf trên thư mục gốc. Cách đúng theo bài là gì?', options: ['Viết rule in hoa trong CLAUDE.md', 'Lặp lại rule ở nhiều chỗ trong CLAUDE.md', 'Nhắc lại Claude bằng tin nhắn ở đầu mỗi phiên', 'Dùng PreToolUse hook từ chối lệnh'], answer: 3, explain: '"If an action genuinely has to be blocked, a destructive command for example, don\'t rely on a written rule to stop it. Reach for a pre-tool use hook instead."' },
    { q: 'Vì sao một quy tắc trong CLAUDE.md có thể bị bỏ sót?', options: ['Vì CLAUDE.md chỉ nạp ở phiên đầu tiên', 'Vì context đông đúc chôn mất chỉ dẫn', 'Vì CLAUDE.md bị cắt sau 50 dòng', 'Vì model bỏ qua mọi lượt user'], answer: 1, explain: '"That means a rule can be missed, especially when the context gets crowded and your instruction is buried under everything else."' },
    { q: 'Điểm gì khiến PreToolUse hook khác hẳn một dòng quy tắc trong CLAUDE.md?', options: ['Hook rẻ hơn về token vì không nạp vào context', 'Hook được viết bằng ngôn ngữ tự nhiên', 'Chạy tất định trước tool, chặn được hẳn', 'Hook chỉ chạy khi model đồng ý thực hiện nó'], answer: 2, explain: '"A pre-tool use hook... runs deterministically before the tool executes and can deny the action outright."' },
    { q: 'Câu nào tóm đúng việc chia vai giữa rule và hook?', options: ['Rule để lái, hook để cưỡng chế', 'Rule để cưỡng chế, hook để gợi ý', 'Dùng rule cho mọi thứ, hook chỉ để log', 'Hook thay thế hoàn toàn CLAUDE.md'], answer: 0, explain: '"Write rules to steer behavior and use hooks when you need real enforcement."' },
    { q: 'Loại nội dung nào sau đây KHÔNG nằm trong ba loại "đáng giá" mà bài nêu?', options: ['Cấu trúc dự án và thư mục chính', 'Quy ước đặt tên và coding style', 'Lệnh build, test, lint nguyên văn', 'Lịch sử dài về lý do chọn framework'], answer: 3, explain: '"Three kinds of content pull their weight. First, project structure... Second, conventions... Third, commands." Văn xuôi về lý do thì "burn context".' },
    { q: 'Vì sao nên ghi rõ thư mục chính và cách tổ chức code base trong CLAUDE.md?', options: ['Để Claude sinh tài liệu kiến trúc', 'Để Claude khỏi phải lục lọi', 'Để giảm kích thước repo', 'Để hook biết những thư mục nào cần chặn ghi'], answer: 1, explain: '"Tell Claude where things live, the key directories, and how the code base is organized so it navigates without hunting around."' },
    { q: 'Claude cứ dùng kiểu đặt tên mặc định chung chung thay vì kiểu của nhóm. Nên bổ sung gì vào CLAUDE.md?', options: ['Lệnh build đầy đủ', 'Sơ đồ thư mục chi tiết của repo', 'Quy ước đặt tên và pattern', 'Lịch sử các commit gần đây của nhóm'], answer: 2, explain: '"Second, conventions. Spell out your coding style, your naming, and the patterns the team follows. Stated plainly so the output matches your norms instead of generic defaults."' },
    { q: 'Cách ghi lệnh test nào trong CLAUDE.md đúng tinh thần bài học?', options: ['"Cứ chạy test như thường lệ vẫn làm"', '"Hỏi trưởng nhóm lệnh test"', '"Test bằng Maven, cờ thì tùy"', '"Test: `./mvnw test -Dtest=*IT`"'], answer: 3, explain: '"Put the exact build, test, and lint commands right in the file, written verbatim, so Claude can copy and run them."' },
    { q: 'Điểm chung khiến ba loại nội dung (cấu trúc, quy ước, lệnh) xứng đáng với token của chúng là gì?', options: ['Khỏi phải đoán điều nhóm đã biết', 'Chúng ngắn hơn mọi loại nội dung khác', 'Được cache riêng nên miễn phí', 'Chúng chỉ được nạp khi Claude cần tới'], answer: 0, explain: '"Every one of these saves Claude from guessing something your team already knows, and that is what makes a rule worth its tokens."' },
    { q: 'CLAUDE.md của bạn dài 900 dòng. Điều gì xảy ra khi phiên bắt đầu?', options: ['Chỉ 200 dòng đầu được nạp', 'Nạp đầy đủ cả file, không cắt', 'Claude tóm tắt file cho vừa context', 'File bị bỏ qua vì quá dài'], answer: 1, explain: '"The whole file loads in full, regardless of how long it is. There is no summarizing and no truncation to fit."' },
    { q: 'Mục tiêu độ dài hợp lý cho CLAUDE.md theo bài là bao nhiêu?', options: ['Dưới khoảng 20 dòng', 'Không giới hạn, càng chi tiết càng tốt', 'Dưới khoảng hai trăm dòng', 'Đúng 1000 dòng'], answer: 2, explain: '"A good target is to keep it under a couple hundred lines."' },
    { q: 'Nhận định "CLAUDE.md là bộ nhớ miễn phí nằm bên cạnh" sai ở chỗ nào?', options: ['Nó là token bạn trả ở mọi phiên', 'Nó chỉ tốn token ở phiên đầu', 'Nó tốn tiền lưu trữ trên server', 'Nó chỉ tốn token khi được nhắc tới'], answer: 0, explain: '"CLAUDE.md isn\'t free memory sitting off to the side. It is tokens you pay for on every session, so spend them only on rules that earn their place."' },
    { q: 'Hậu quả chính của một CLAUDE.md phình to là gì?', options: ['Claude từ chối mở phiên làm việc mới', 'Repo không commit được nữa', 'Model chuyển sang chế độ tóm tắt', 'Chiếm chỗ model cần cho việc thật'], answer: 3, explain: '"A bloated file crowds out room the model needs for the actual work in front of it."' },
    { q: 'Theo bài, "scoped rules" có những đặc điểm nào?', options: ['Dài, giàu bối cảnh, giải thích kỹ lý do', 'Ngắn, cụ thể, kiểm chứng được', 'Viết như tài liệu kiến trúc', 'Chỉ áp cho một phiên'], answer: 1, explain: '"On one side, scoped rules. They are short, specific, and testable."' },
    { q: 'Vấn đề lớn nhất của văn xuôi dài dòng trong CLAUDE.md là gì?', options: ['Model không đọc được tiếng Anh dài', 'Nó vi phạm định dạng Markdown chuẩn của file', 'Đốt context, chôn câu quan trọng', 'Nó làm hỏng system prompt cache'], answer: 2, explain: '"The trouble is they burn context. They bury the one instruction that mattered, and they make it harder for Claude to find and follow it."' },
    { q: 'Bạn thấy mình đang viết một đoạn dài giải thích vì sao nhóm chọn tab thay vì space. Nên làm gì?', options: ['Viết lại thành chỉ thị ngắn', 'Giữ nguyên vì lý do giúp model hiểu sâu', 'Chuyển đoạn đó lên đầu file cho nổi bật', 'Nhân đôi đoạn đó ở cuối file để nhấn mạnh'], answer: 0, explain: '"When you catch yourself explaining why at length, stop, and rewrite it as a short directive that says what to do."' },
    { q: 'Vì sao commit CLAUDE.md của project lại có lợi cho người mới vào nhóm?', options: ['Vì nó tự cài mọi dependency', 'Vì nó thay thế toàn bộ README', 'Vì nó cấp quyền truy cập repo', 'Có ngay lệnh build từ ngày đầu'], answer: 3, explain: '"A new contributor gets your build commands on day one without asking anyone or reading a stale wiki."' },
    { q: 'Lệnh build thật chỉ nằm trong đầu một kỹ sư senior. Bài học so sánh tình huống này thế nào?', options: ['Ổn, miễn là kỹ sư đó luôn trả lời', 'Quy tắc trong version control thắng', 'Nên ghi vào wiki thay vì repo', 'Nên đặt nó trong agent memory của từng người'], answer: 1, explain: '"Shared rules in version control beat tribal knowledge every time, and they update the moment someone improves the file and pushes it."' },
    { q: 'Vì sao mọi người trong nhóm thấy hành vi Claude nhất quán khi dùng CLAUDE.md đã commit?', options: ['Vì mọi người dùng cùng một API key', 'Vì model được fine-tune theo repo', 'Vì mọi phiên bắt đầu từ cùng brief', 'Vì CLAUDE.md khóa nhiệt độ lấy mẫu'], answer: 2, explain: '"Behavior stays consistent because everyone\'s sessions start from the same shared brief."' },
    { q: 'Khi nào quy tắc trong CLAUDE.md có mặt trong hội thoại?', options: ['Từ đầu, trước yêu cầu đầu tiên', 'Chỉ sau khi bạn gõ /memory', 'Chỉ khi Claude đọc một file trong repo', 'Chỉ khi context sắp đầy và cần thêm chỉ dẫn'], answer: 0, explain: '"It is loaded at the start. The file is injected at the beginning of every conversation, so its rules are already present before you type your first request."' },
    { q: 'CLAUDE.md đi tới model qua kênh nào?', options: ['Được nướng thẳng vào system prompt', 'Như một tool definition được đăng ký riêng', 'Như một tham số metadata', 'Một lượt user cạnh system prompt'], answer: 3, explain: '"It arrives as a user or project message. It rides alongside the system prompt rather than being baked into the system prompt itself."' },
    { q: 'Điểm khác giữa CLAUDE.md và các file memory có giới hạn là gì?', options: ['CLAUDE.md chỉ đọc đoạn đầu', 'CLAUDE.md luôn nạp toàn bộ', 'File memory luôn nạp đầy đủ hơn', 'Hai loại nạp giống hệt nhau về độ dài'], answer: 1, explain: '"Unlike capped memory files that only read their first stretch, the entire CLAUDE.md loads no matter how long it is."' },
    { q: 'Ba sự thật về cách CLAUDE.md tới model giải thích điều gì?', options: ['Vì sao nó chặn được lệnh nguy hiểm', 'Vì sao nó không tốn token', 'Cả sức mạnh lẫn chi phí của nó', 'Vì sao nó chỉ dùng được trên Claude Code'], answer: 2, explain: '"Those three facts explain both its power and its cost. It is always there, it steers from the conversation, and it always spends its full weight in tokens."' },
    { q: 'Dòng nào sau đây là một rule CLAUDE.md viết tốt nhất?', options: ['"Dùng pnpm, không dùng npm."', '"Chúng tôi từng dùng npm nhưng sau nhiều tranh luận..."', '"Hãy cố gắng viết code sạch."', '"Package manager là một chủ đề thú vị..."'], answer: 0, explain: '"Use imperative, scoped statements, do this, avoid that, rather than paragraphs of background."' },
    { q: 'Một dòng trong CLAUDE.md không làm Claude hành xử khác đi chút nào. Nên xử lý thế nào?', options: ['Giữ lại cho đầy đủ', 'In đậm để Claude chú ý', 'Chuyển nó lên đầu file', 'Có lẽ không thuộc về file, nên cắt'], answer: 3, explain: '"If a line wouldn\'t change what Claude does, it probably doesn\'t belong."' },
    { q: 'Vì sao một file CLAUDE.md đông đúc làm yếu đi chính những quy tắc tốt trong nó?', options: ['Vì model chỉ đọc quy tắc nằm cuối cùng file', 'Mỗi dòng tranh sự chú ý, làm loãng rule', 'Vì file dài bị chia ra nhiều phiên', 'Vì Markdown dài bị lỗi định dạng'], answer: 1, explain: '"Trim anything that doesn\'t change behavior, because every line you keep competes for the model\'s attention... a crowded file dilutes every rule inside it."' },
    { q: 'Bạn muốn Claude nhớ một quyết định mà nó tự rút ra giữa chừng, qua cả các phiên sau, mà bạn không phải viết tay. Thứ nào phù hợp nhất?', options: ['CLAUDE.md của project', 'Context window', 'Agent memory của dự án', 'Một PreToolUse hook'], answer: 2, explain: '"Agent memory. That is durable state the agent itself writes and updates as it works, and it survives... session boundaries." CLAUDE.md thì "the one you author by hand".' }
  ]
};
