window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Main agent giữ <strong>toàn bộ hội thoại</strong> của bạn. Một <strong>subagent</strong> thì bắt đầu <strong>sạch</strong>,
làm đúng một việc trong <strong>context riêng biệt</strong>, rồi chỉ gửi về <strong>một bản tóm tắt</strong>. Sự cô lập đó không phải hạn chế, mà chính là lý do để dùng subagent.
Còn <strong>agent memory</strong> là trạng thái do <strong>chính agent tự ghi</strong>, khác hẳn CLAUDE.md do <strong>bạn</strong> viết.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Subagent:</strong> một instance Claude Code riêng, được tạo ra để xử lý một subtask được giao, với tool và permission riêng, trong context cô lập.</li>
  <li><strong>Isolated context (context cô lập):</strong> subagent có context window riêng; không thấy lịch sử hội thoại hay các file bạn đã mở. Xong việc chỉ trả về một bản tóm tắt.</li>
  <li><strong>Agent memory:</strong> trạng thái bền vững agent giữ qua các phiên, nằm <strong>ngoài</strong> context window đang chạy, nên sống sót qua compaction.</li>
  <li><strong>Front matter:</strong> khối YAML ở đầu file định nghĩa subagent; chỉ <code>name</code> và <code>description</code> là bắt buộc.</li>
  <li><strong>Auto-memory:</strong> ghi chú main agent tự viết cho chính nó, bật mặc định, lưu cục bộ theo từng dự án.</li>
  <li><strong>Compaction:</strong> việc nén context của phiên khi nó quá dài.</li>
</ul>

<h3>Tính chất định nghĩa subagent: context mới, tách riêng</h3>
<ul>
  <li>Không thừa hưởng <strong>lịch sử chat</strong>, không thấy <strong>các skill</strong> bạn đã gọi, không biết <strong>các file</strong> Claude đã đọc giúp bạn. Nó bắt đầu sạch.</li>
  <li>Chạy với <strong>system prompt riêng</strong>, <strong>bộ tool riêng</strong>, <strong>permission riêng</strong>, tất cả gói gọn cho đúng việc được giao.</li>
  <li>Xong việc, nó <strong>không đổ toàn bộ suy luận</strong> về hội thoại của bạn, mà <strong>trả về một bản tóm tắt</strong>.</li>
</ul>
<p>Đổi tư duy: sự cô lập <strong>không phải hạn chế để lách</strong>; nó là <strong>lý do để dùng subagent</strong>, vì giữ cho context chính sạch sẽ.</p>

<div class="box">🧑‍🍳 <strong>Hình dung thế này:</strong> Bạn là bếp trưởng đang nói chuyện với khách (main agent). Bạn gọi một phụ bếp vào kho, đưa một tờ giấy: "kiểm kê bột mì".
Phụ bếp không nghe được cuộc trò chuyện với khách, chỉ có tờ giấy. Trong kho có thể lục lọi, đếm sai, đếm lại... nhưng khi ra chỉ báo một câu: "còn 12 bao".
Mọi lộn xộn ở lại trong kho, bàn của bạn vẫn gọn.</div>

<h3>Tạo một subagent</h3>
<ul>
  <li>Subagent là một <strong>file markdown có YAML front matter</strong>; <strong>phần thân</strong> file trở thành <strong>system prompt</strong> của subagent.</li>
  <li>Chỉ <strong>hai field bắt buộc</strong>: <code>name</code> và <code>description</code>. Mọi thứ khác là tùy chọn: tool được dùng, model chạy, permission.</li>
  <li>Bỏ trống field <code>tools</code> thì subagent <strong>kế thừa toàn bộ</strong> tool của main agent.</li>
  <li><strong>Description làm hai việc:</strong> không chỉ là nhãn, mà là thứ Claude đọc để <strong>tự quyết định</strong> có giao task cho subagent này không.
  Vì vậy hãy viết nó để mô tả <strong>khi nào</strong> nên dùng agent.</li>
</ul>

<h3>Main agent và subagent đặt cạnh nhau</h3>
<ul>
  <li><strong>Main agent:</strong> chính cuộc hội thoại hiện tại, có bức tranh đầy đủ: mọi điều bạn nói, mọi file đã đọc, mọi skill đã kéo vào.</li>
  <li><strong>Subagent:</strong> không có gì trong số đó; bắt đầu từ con số không với <strong>chỉ task được giao</strong>, làm trong không gian riêng, báo lại bằng <strong>tóm tắt</strong> chứ không phải toàn bộ transcript.</li>
  <li>Vì sao quan trọng: mọi phần việc lộn xộn ở giữa (tool call, ngõ cụt, output dài) <strong>ở ngoài context chính</strong>. Hội thoại của bạn gọn và tập trung.</li>
</ul>

<h3>Ba cách dùng subagent, tăng dần mức kiểm soát</h3>
<ol>
  <li><strong>Ngôn ngữ tự nhiên:</strong> bạn nhờ Claude dùng một subagent; Claude <strong>tự quyết</strong> có giao hay không dựa trên description. (Gợi ý)</li>
  <li><strong>@-mention:</strong> nhắc tên agent; <strong>bảo đảm</strong> đúng subagent đó chạy cho <strong>task kế tiếp</strong>. Không đoán. (Bảo đảm cho một task)</li>
  <li><strong>Cờ khởi động <code>--agent</code>:</strong> <strong>cả phiên</strong> chạy như subagent đó ngay từ tin nhắn đầu tiên. (Cam kết cả phiên)</li>
</ol>

<h3>Agent memory không phải CLAUDE.md</h3>
<ul>
  <li>Hãy nghĩ xem <strong>ai đang viết</strong>. CLAUDE.md là <strong>bạn</strong> viết chỉ dẫn cho Claude làm theo: quy tắc tĩnh, do lập trình viên soạn.</li>
  <li>Agent memory là chiều ngược lại: trạng thái bền vững <strong>agent tự ghi cho chính nó</strong>, cập nhật trong lúc làm việc. Như <strong>sổ tay riêng</strong> của agent.</li>
  <li>Vì memory nằm ngoài context window đang chạy, nó <strong>sống qua compaction</strong> và <strong>còn lại sau khi phiên kết thúc</strong>.</li>
  <li>Hai thứ <strong>bổ sung</strong> cho nhau, nhưng đến từ hai hướng ngược nhau. Đừng xếp chung một mục.</li>
</ul>

<h3>"Memory" có hai hệ thống khác nhau</h3>
<ul>
  <li><strong>Main agent auto-memory:</strong> Claude tự ghi chú, học từ các lần bạn sửa và sở thích của bạn. <strong>Bật mặc định</strong>, lưu trong
  <strong>thư mục theo từng dự án trên máy bạn</strong>, nên chỉ cục bộ, <strong>không đồng bộ</strong> giữa các máy.</li>
  <li><strong>Subagent memory:</strong> kho riêng của một subagent, <strong>bật bằng một field trong front matter</strong> của subagent; giúp agent đó tích lũy hiểu biết qua các phiên.</li>
</ul>

<h3>Rule, skill hay subagent?</h3>
<ul>
  <li>Chính sách <strong>luôn áp dụng</strong>, đúng ở mọi lượt? → <strong>rule</strong>.</li>
  <li>Quy trình <strong>theo yêu cầu</strong>, chỉ thỉnh thoảng cần? → <strong>skill</strong>.</li>
  <li>Cần chạy <strong>trong không gian riêng</strong>, tách khỏi context chính? → <strong>subagent</strong>.</li>
</ul>
<p>Policy, procedure, isolation. Ghép đúng cơ chế với việc, setup gọn, context nhẹ.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Subagent chạy task được giao trong context cô lập (không thấy history, skill, file đã đọc) và chỉ trả về tóm tắt; cô lập là để giữ context chính sạch.</li>
  <li>File subagent: chỉ name và description bắt buộc, thân là system prompt, bỏ tools thì kế thừa hết; description quyết định khi nào Claude tự giao việc.</li>
  <li>Agent memory do agent tự ghi, sống qua compaction và qua phiên; khác CLAUDE.md do bạn viết. Auto-memory bật mặc định, cục bộ; subagent memory bật bằng field front matter.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">they live in different zones</em>: chúng sống ở những vùng khác nhau.</li>
  <li><em class="en">hands back a summary</em>: trao lại một bản tóm tắt.</li>
  <li><em class="en">one delegated subtask</em>: một subtask được giao.</li>
  <li><em class="en">It starts clean</em>: nó bắt đầu sạch trơn.</li>
  <li><em class="en">Here's the mindset shift</em>: đây là chỗ cần đổi tư duy.</li>
  <li><em class="en">a limitation to design around</em>: một hạn chế phải thiết kế để lách qua.</li>
  <li><em class="en">that description does double duty</em>: description đó làm hai nhiệm vụ.</li>
  <li><em class="en">the dead ends</em>: những ngõ cụt.</li>
  <li><em class="en">No guessing</em>: không phải đoán.</li>
  <li><em class="en">the agent's own running notebook</em>: cuốn sổ ghi chép liên tục của chính agent.</li>
  <li><em class="en">don't file these two under one heading</em>: đừng xếp hai thứ này chung một mục.</li>
  <li><em class="en">your context stays lean</em>: context của bạn luôn gọn nhẹ.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson38/Lesson38.java</code>. Có 5 bài: dựng danh sách message cho main agent (cả history cộng task) và request cho subagent (system riêng, chỉ một lượt task),
đọc front matter một file subagent (name và description bắt buộc, bỏ tools thì kế thừa của main agent), phân loại cách gọi subagent (ngôn ngữ tự nhiên, @-mention hay cờ <code>--agent</code>),
phân biệt ai viết và bật bằng cách nào cho CLAUDE.md, auto-memory và subagent memory, và chọn rule, skill, subagent hay permissions/hooks cho một nhu cầu.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-38"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-38 --live"</code>: cùng một câu hỏi "dự án build bằng gì?" gửi theo kiểu main agent (có cả hội thoại, nơi bạn đã nói là Gradle)
và theo kiểu subagent (chỉ có task), để thấy subagent thật sự không biết gì ngoài việc được giao.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Bạn đã trao đổi 40 lượt với Claude về kiến trúc dự án rồi giao một subtask cho subagent. Subagent biết gì về 40 lượt đó?', options: ['Biết hết, vì dùng chung context window', 'Không biết; nó chỉ có task được giao', 'Chỉ biết 5 lượt gần nhất', 'Biết bản tóm tắt tự động của 40 lượt'], answer: 1, explain: '"It doesn\'t inherit your chat history, it doesn\'t see the skills you\'ve already invoked, and it doesn\'t know about the files Claude has read for you. It starts clean."' },
    { q: 'Khi subagent làm xong, thứ gì quay về main agent?', options: ['Toàn bộ transcript và mọi tool call', 'Toàn bộ suy luận nội bộ, để main agent kiểm tra', 'Một bản tóm tắt kết quả công việc', 'Không gì cả; kết quả chỉ ghi ra file'], answer: 2, explain: '"And when it finishes, it doesn\'t dump all its reasoning back into your conversation. It returns a summary."' },
    { q: 'Theo bài học, lý do chính để dùng subagent là gì?', options: ['Sự cô lập giữ context chính sạch', 'Subagent luôn chạy trên model mạnh hơn', 'Subagent có quyền vượt permission của main agent', 'Subagent tự ghi kết quả vào CLAUDE.md'], answer: 0, explain: '"That isolation isn\'t a limitation to design around. It\'s the reason to use a sub-agent in the first place, because it keeps your main context clean."' },
    { q: 'Một đồng nghiệp than: "Subagent không thấy file tôi vừa mở, phiền quá, làm sao để nó thấy hết hội thoại?". Phản hồi nào đúng tinh thần bài học nhất?', options: ['Bật field share-context trong front matter', 'Dùng @-mention để subagent đọc được history', 'Chuyển sang cờ --agent để chia sẻ context', 'Cô lập là chủ đích; ghi đủ thông tin vào task'], answer: 3, explain: '"That isolation isn\'t a limitation to design around." Subagent chỉ có task bạn giao, nên thông tin nó cần phải nằm trong task.' },
    { q: 'Câu nào KHÔNG đúng về subagent?', options: ['Có context window riêng, tách khỏi main agent', 'Chạy với system prompt riêng', 'Thừa hưởng các skill main agent đã gọi', 'Có thể có bộ tool và permission riêng'], answer: 2, explain: '"It doesn\'t see the skills you\'ve already invoked... It runs with its own system prompt, its own set of tools, and its own permissions."' },
    { q: 'Trong file định nghĩa subagent, phần thân (sau front matter) dùng để làm gì?', options: ['Ghi chú cho người đọc, Claude bỏ qua', 'Trở thành system prompt của subagent', 'Là task mặc định subagent chạy khi khởi động', 'Là nơi lưu subagent memory'], answer: 1, explain: '"A sub-agent is a markdown file with YAML front matter at the top, and the body of that file becomes the sub-agent\'s system prompt."' },
    { q: 'Field nào là BẮT BUỘC trong front matter của subagent?', options: ['name và description', 'name, description và tools', 'name, model và permissions', 'description và memory'], answer: 0, explain: '"Only two fields are required, a name and a description. That\'s it. Everything else is optional."' },
    { q: 'Bạn tạo subagent và không khai báo field tools. Điều gì xảy ra?', options: ['Subagent không có tool nào cho tới khi khai báo', 'Subagent chỉ có tool đọc file', 'Claude báo lỗi vì thiếu field', 'Kế thừa toàn bộ tool của main agent'], answer: 3, explain: '"If you leave the tools field out, the sub-agent just inherits the full set the main agent has."' },
    { q: 'Vì sao bài học nói description của subagent "làm hai việc"?', options: ['Nó vừa là nhãn vừa là system prompt', 'Là nhãn, và là thứ Claude đọc để giao việc', 'Nó vừa đặt tên lệnh vừa chọn model', 'Nó vừa ghi memory vừa giới hạn tool'], answer: 1, explain: '"It\'s not only a label, it\'s what Claude reads to decide, on its own, whether to hand a given task off to this sub-agent."' },
    { q: 'Description nào phù hợp nhất cho một subagent review code, theo lời khuyên của bài học?', options: ['"Code reviewer, phiên bản mới nhất của nhóm"', '"Agent số 3 của nhóm backend"', '"Dùng sau khi sửa code để review diff tìm bug"', '"Rất giỏi, cẩn thận, thân thiện"'], answer: 2, explain: '"So write it to describe when the agent should be used."' },
    { q: 'Câu nào mô tả đúng main agent?', options: ['Chỉ thấy task hiện tại, không thấy lịch sử', 'Chỉ nhận tóm tắt, không đọc file trực tiếp', 'Được tạo lại mới cho mỗi tin nhắn', 'Giữ toàn bộ hội thoại, file và skill đã dùng'], answer: 3, explain: '"The main agent is the conversation you\'re in right now. It has the full picture. Everything you\'ve said, every file it\'s read, every skill it\'s pulled in, it all lives in that one context."' },
    { q: 'Subagent chạy 30 tool call, đi vào vài ngõ cụt, đọc các log dài. Những thứ đó ảnh hưởng thế nào tới context chính?', options: ['Ở ngoài context chính; chỉ tóm tắt quay về', 'Được chép vào context chính sau khi nén', 'Được nối vào CLAUDE.md để lần sau dùng', 'Được lưu vào auto-memory của main agent'], answer: 0, explain: '"Because all the messy intermediate work, the tool calls, the dead ends, the long outputs, they stay out of your main context."' },
    { q: 'Bạn gõ "nhờ dùng agent test-runner kiểm tra giúp". Điều gì xảy ra?', options: ['test-runner chắc chắn chạy cho task kế', 'Claude tự quyết dựa trên description', 'Cả phiên chuyển sang chạy như test-runner', 'Lệnh bị bỏ qua vì thiếu dấu @'], answer: 1, explain: '"The first is just natural language. You ask Claude to use a particular sub-agent, and it decides whether to delegate, based on that sub-agent\'s description."' },
    { q: 'Bạn cần chắc chắn subagent security-auditor xử lý task tiếp theo, không để Claude tự đoán. Cách nào phù hợp nhất?', options: ['Viết yêu cầu bằng ngôn ngữ tự nhiên thật lịch sự', 'Khởi động lại với cờ --agent cho cả phiên', '@-mention security-auditor', 'Thêm tên agent vào CLAUDE.md'], answer: 2, explain: '"You mention the agent by name, and that guarantees that specific sub-agent runs for the next task. No guessing."' },
    { q: 'Bạn muốn cả phiên làm việc chạy như subagent docs-writer ngay từ tin nhắn đầu. Chọn cách nào?', options: ['@-mention docs-writer ở mỗi tin nhắn', 'Ngôn ngữ tự nhiên ở tin nhắn đầu tiên', 'Thêm field session: true vào front matter', 'Khởi động với cờ --agent'], answer: 3, explain: '"You launch with the agent flag set, and the entire session runs as that sub-agent from the very first message."' },
    { q: 'Sắp xếp ba cách dùng subagent theo mức kiểm soát TĂNG DẦN:', options: ['Ngôn ngữ tự nhiên → @-mention → cờ --agent', '@-mention → ngôn ngữ tự nhiên → cờ --agent', 'Cờ --agent → @-mention → ngôn ngữ tự nhiên', 'Ngôn ngữ tự nhiên → cờ --agent → @-mention'], answer: 0, explain: '"So it\'s a spectrum. Suggest it, guarantee it for one task, or commit the whole session to it."' },
    { q: 'Điểm khác cốt lõi giữa CLAUDE.md và agent memory là gì?', options: ['CLAUDE.md lưu trên cloud, memory lưu trên máy', 'Ai viết: bạn viết CLAUDE.md, agent tự ghi memory', 'CLAUDE.md chỉ dùng cho subagent, memory cho main', 'Memory là bản nén tự động của CLAUDE.md'], answer: 1, explain: '"Think about who\'s doing the writing. CLAUDE.md is you writing instructions for Claude to follow... Agent memory is the reverse. It\'s durable state the agent writes for itself."' },
    { q: 'Phiên dài bị compaction. Thứ nào chắc chắn KHÔNG bị mất theo bài học?', options: ['Toàn bộ output tool trong phiên', 'Mọi tin nhắn gõ giữa phiên', 'Agent memory', 'Suy luận trung gian của main agent'], answer: 2, explain: '"And because memory lives outside the live context window, it survives compaction, and it carries over after a session ends."' },
    { q: 'Mô tả nào đúng nhất về agent memory?', options: ['Quy tắc tĩnh do lập trình viên soạn', 'Lịch sử chat được giữ nguyên trong context', 'Danh sách tool subagent được dùng', 'Sổ tay agent tự cập nhật trong lúc làm việc'], answer: 3, explain: '"It\'s durable state the agent writes for itself, updating it as it works... The other is the agent\'s own running notebook."' },
    { q: 'Bài học kết luận thế nào về CLAUDE.md và agent memory?', options: ['Bổ sung nhau, từ hai hướng ngược nhau', 'Là một hệ thống, chỉ khác tên gọi', 'Memory đã thay thế hoàn toàn CLAUDE.md', 'CLAUDE.md đã thay thế memory'], answer: 0, explain: '"So don\'t file these two under one heading. They\'re complementary, but they come from opposite directions."' },
    { q: 'Main agent auto-memory có đặc điểm nào sau đây?', options: ['Tắt mặc định, bật bằng field front matter', 'Bật mặc định, lưu theo dự án trên máy bạn', 'Đồng bộ qua mọi máy bạn đăng nhập', 'Lưu chung trong CLAUDE.md của repo'], answer: 1, explain: '"It\'s on by default, and it\'s stored in a per-project folder on your own machine. So it\'s local to you, not synced across machines."' },
    { q: 'Bạn làm cùng dự án trên laptop và máy bàn. Claude trên máy bàn không nhớ sở thích bạn đã dạy trên laptop. Giải thích hợp lý nhất?', options: ['Auto-memory bị xóa sau mỗi compaction', 'Auto-memory chỉ có trong subagent', 'Auto-memory cục bộ, không đồng bộ giữa máy', 'Bạn chưa @-mention main agent'], answer: 2, explain: '"It\'s stored in a per-project folder on your own machine. So it\'s local to you, not synced across machines."' },
    { q: 'Bạn muốn subagent code-reviewer tự tích lũy hiểu biết qua các phiên. Làm gì?', options: ['Dặn nó trong ngôn ngữ tự nhiên mỗi phiên', 'Chép hiểu biết vào CLAUDE.md sau mỗi phiên', 'Khởi động phiên với cờ --agent', 'Bật memory bằng field trong front matter'], answer: 3, explain: '"That\'s a sub-agent\'s own private store, and you turn it on with a field in the sub-agent\'s front matter. It lets that one agent build up knowledge across sessions on its own."' },
    { q: 'Câu nào KHÔNG đúng về hai hệ thống "memory" trong Claude Code?', options: ['Cả hai đều do bạn viết tay và commit vào repo', 'Auto-memory thuộc main agent và bật mặc định', 'Subagent memory là kho riêng của một subagent', 'Cùng chữ memory nhưng là hai cơ chế riêng'], answer: 0, explain: '"When people say agent memory in Claude Code, they can mean two different systems." Cả hai đều do agent tự ghi; thứ bạn viết tay là CLAUDE.md.' },
    { q: 'Quy định "mọi câu trả lời phải dùng tiếng Việt" cần đúng ở mọi lượt. Đặt ở đâu?', options: ['Skill', 'Rule', 'Subagent', 'Agent memory'], answer: 1, explain: '"Is this an always-apply policy, something you want true on every turn? Then it\'s a rule."' },
    { q: 'Quy trình tạo báo cáo release chỉ cần vài lần mỗi tháng, chạy được ngay trong hội thoại. Cơ chế nào hợp nhất?', options: ['Rule trong CLAUDE.md', 'Subagent chạy cả phiên', 'Skill', 'Auto-memory'], answer: 2, explain: '"Is it an on-demand workflow, a procedure you only need sometimes? Then package it as a skill."' },
    { q: 'Bạn cần quét 200 file log dài để tìm một lỗi, nhưng không muốn chúng làm đầy hội thoại chính. Chọn gì?', options: ['Một rule bắt đọc log nhanh', 'Skill đọc log tại chỗ', 'Dán log vào CLAUDE.md', 'Giao việc cho một subagent'], answer: 3, explain: '"Does it need to run in its own space, isolated from your main context? Then delegate it to a sub-agent."' },
    { q: 'Cặp nào ghép ĐÚNG theo bài học?', options: ['Policy → rule; procedure → skill; isolation → subagent', 'Policy → skill; procedure → rule; isolation → subagent', 'Policy → subagent; procedure → skill; isolation → rule', 'Policy → rule; procedure → subagent; isolation → skill'], answer: 0, explain: '"Rule, skill, sub-agent, policy, procedure, isolation."' },
    { q: 'Một subagent được định nghĩa với tools: Read, Grep. Điều gì đúng?', options: ['Vẫn dùng mọi tool của main', 'Chỉ có các tool được khai báo', 'Lỗi vì tools không hợp lệ', 'Nó thêm Read, Grep vào tool của main agent'], answer: 1, explain: '"You can specify which tools it\'s allowed to use... It runs with its own system prompt, its own set of tools, and its own permissions, all scoped to the job you handed it."' },
    { q: 'Nhận định nào đúng nhất khi tổng kết bài học?', options: ['Subagent thấy hết context nhưng trả lời ngắn hơn', 'Agent memory chính là file CLAUDE.md của bạn', 'Subagent chạy riêng, chỉ trả về tóm tắt', 'Rule, skill, subagent thay thế được cho nhau'], answer: 2, explain: '"A sub-agent runs a delegated task in its own isolated context, and only a summary comes back... Just remember, agent memory is the agent\'s own state, not your CLAUDE.md file."' },
  ],
};
