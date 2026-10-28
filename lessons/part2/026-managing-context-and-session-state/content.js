window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Cửa sổ ngữ cảnh <strong>chỉ đầy lên, không tự vơi đi</strong>. Mỗi lượt lại chất thêm lịch sử và tool output,
và mọi token trong đó bị <strong>xử lý lại ở từng lượt</strong>, nên càng lâu càng đắt, càng chậm, càng dễ "trôi". Thứ cần nhớ lâu thì
<strong>đừng để trong cửa sổ</strong>; hãy ghi ra <strong>đĩa</strong> (file, config, CLAUDE.md, memory). Quản lý state là <strong>việc kỹ thuật chủ động</strong>, model không làm hộ bạn.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Context window (cửa sổ ngữ cảnh):</strong> ngân sách token model đọc được trong <strong>một request</strong>; chứa system prompt, lịch sử, định nghĩa tool và mọi tool result, tất cả tranh nhau cùng một chỗ.</li>
  <li><strong>Durable state (state bền):</strong> kiến thức giữ <strong>ngoài</strong> cửa sổ, trong file hoặc config, nên sống sót qua việc cắt bớt (truncation) hay hết phiên.</li>
  <li><strong>Session boundary (ranh giới phiên):</strong> đường ranh nơi một phiên kết thúc và một cửa sổ mới bắt đầu, <strong>không mang gì theo</strong> trừ khi bạn chủ động lưu.</li>
  <li><strong>Ephemeral context (ngữ cảnh tạm):</strong> những gì đang nằm trong cửa sổ lúc này: nhanh, model thấy ngay, nhưng mong manh.</li>
  <li><strong>Pruning (tỉa):</strong> bỏ một tool result cũ, đã hết tác dụng, mà không đụng phần còn lại của hội thoại.</li>
  <li><strong>Auto memory:</strong> ghi chú Claude tự viết cho chính nó, nằm trên đĩa dưới một chỉ mục <code>MEMORY.md</code>.</li>
</ul>

<h3>Trong một phiên, mọi thứ đều chồng chất</h3>
<ul>
  <li><strong>System prompt</strong> có mặt ở mọi lượt.</li>
  <li><strong>Định nghĩa tool</strong> có mặt ở mọi lượt.</li>
  <li><strong>Hội thoại qua lại</strong> cứ dài thêm.</li>
  <li><strong>Tool output lớn</strong> (một file khổng lồ, một kết quả search dài) là "kẻ ngốn ngân sách" thật sự: nó nằm lì trong cửa sổ rất lâu sau khi hết hữu ích.</li>
</ul>
<p>Điều mọi người hay bỏ qua: <strong>không có gì tự bị xóa</strong>. Model không lặng lẽ quên đồ nhàm chán để lấy chỗ.
Muốn thứ gì ra khỏi cửa sổ, <strong>code của bạn phải lấy nó ra</strong>.</p>

<h3>Hai loại state: đừng trộn lẫn</h3>
<ul>
  <li><strong>Ephemeral:</strong> nằm trong cửa sổ. Nhanh, nhưng ngay khi cửa sổ bị cắt hoặc phiên kết thúc là <strong>mất</strong>.</li>
  <li><strong>Durable:</strong> ghi ra ngoài cửa sổ (file, config). Sống qua <strong>compaction</strong>, qua <strong>ranh giới phiên</strong>, mai vẫn còn.</li>
</ul>
<p>Quy tắc tự hiện ra: thứ gì cần nhớ đường dài (một quyết định, một sự thật, một bản ghi đang chạy) <strong>thuộc về đĩa</strong>, nơi reset không xóa được.</p>

<h3>Cửa sổ phình to tốn bạn 3 thứ</h3>
<ol>
  <li><strong>Chi phí cao hơn:</strong> mọi token trong cửa sổ bị xử lý lại ở <strong>mỗi lượt</strong>, dù nội dung thừa có giúp gì hay không.</li>
  <li><strong>Phản hồi chậm hơn:</strong> nhiều token phải đọc hơn ở mỗi lời gọi, nên độ trễ tăng theo kích thước cửa sổ.</li>
  <li><strong>Trôi và lỗi:</strong> lịch sử ít giá trị chồng lên, model theo chỉ dẫn kém tin cậy hơn, ngữ cảnh quan trọng bị tiếng ồn chen mất.</li>
</ol>

<h3>Tỉa tool output cũ</h3>
<p>Một tool result khổng lồ không chỉ tốn một lần: nó bị xử lý lại ở <strong>mọi lượt sau</strong>. Cách sửa là <strong>pruning</strong>:
bỏ đúng kết quả cũ đó, <strong>không đụng</strong> phần khác. Bạn không "phá" cả phiên; bạn chỉ dọn tiếng ồn đã xong việc, để nhiệm vụ và các quyết định gần đây vẫn ở chỗ model thấy được.</p>
<div class="box">🧹 <strong>Hình dung thế này:</strong> làm việc lâu, bàn bạn đầy giấy in. Pruning là <strong>dọn bàn</strong>: vứt tờ in log đã đọc xong,
giữ lại bản kế hoạch và ghi chú hôm nay. Còn cái gì quan trọng lâu dài thì bạn <strong>cất vào tủ hồ sơ</strong> (đĩa), chứ không để trên bàn.
Dọn bàn, chứ đừng <strong>đốt cả căn phòng</strong>.</div>

<h3>Cái gì mang kiến thức từ phiên này sang phiên sau?</h3>
<ol>
  <li>Mỗi phiên Claude Code bắt đầu với <strong>cửa sổ mới tinh</strong>; model tự nó không nhớ gì từ lần trước.</li>
  <li><strong>CLAUDE.md</strong> mang chỉ dẫn <strong>do bạn viết</strong>: nạp ở đầu mỗi phiên, và file ở <strong>gốc dự án</strong> được chèn lại cả sau compaction.</li>
  <li><strong>Auto memory</strong> mang những điều <strong>Claude tự học và tự viết</strong>: nằm trên đĩa dưới chỉ mục <code>MEMORY.md</code>, nạp lại khi cần.</li>
</ol>
<p>Phân vai đơn giản: <strong>bạn viết CLAUDE.md, Claude giữ memory của nó</strong>, và cửa sổ mới được "re-ground" từ cả hai.</p>

<h3>Trên API: ranh giới phiên do code của bạn vẽ</h3>
<ul>
  <li>API <strong>stateless</strong>: không nhớ gì giữa các lời gọi. Toàn bộ state hội thoại nằm trong <strong>request bạn gửi</strong>.</li>
  <li>Code của bạn <strong>giữ transcript</strong> và <strong>gửi lại nó ở mọi request</strong>.</li>
  <li>Bắt đầu phiên mới = <strong>reset mảng messages</strong>: bỏ lượt cũ, bắt đầu mảng mới. Bạn quyết định mang gì theo: một tóm tắt ngắn, hoặc không gì cả.</li>
  <li>Rồi re-ground phiên mới từ <strong>config và system prompt</strong>. Ranh giới không phải phép màu; nó là một lựa chọn trong code.</li>
</ul>

<h3>Bỏ mặc thì hỏng lặng lẽ</h3>
<ol>
  <li><strong>Khả năng theo chỉ dẫn yếu đi trước tiên</strong>: token ít giá trị chen chúc, model khó giữ quy tắc của bạn trong tầm chú ý.</li>
  <li><strong>Ngữ cảnh đầu phiên bị đẩy ra</strong> khỏi vùng chú ý hiệu quả: những gì bạn thiết lập từ đầu bắt đầu trượt.</li>
  <li><strong>Chi phí leo thang suốt thời gian đó</strong>, kể cả khi nội dung hữu ích không tăng, vì bạn đang trả tiền xử lý lại tiếng ồn.</li>
</ol>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Cửa sổ chỉ tích lũy; không gì tự rời đi trừ khi code của bạn lấy ra (ví dụ prune tool output cũ).</li>
  <li>Ephemeral context biến mất khi cắt cửa sổ hoặc hết phiên; durable state nằm trên đĩa (file, config, CLAUDE.md, memory).</li>
  <li>Trên API, bạn giữ transcript và gửi lại mỗi lần; phiên mới chỉ là một mảng messages mới, mang theo đúng thứ bạn chọn.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">a problem that creeps up on every long session</em>: một vấn đề lặng lẽ tìm đến mọi phiên dài.</li>
  <li><em class="en">nothing empties on its own</em>: không có gì tự vơi đi.</li>
  <li><em class="en">all competing for the same space</em>: tất cả tranh nhau cùng một chỗ.</li>
  <li><em class="en">the real budget killer</em>: kẻ ngốn ngân sách thật sự.</li>
  <li><em class="en">long after they stop being useful</em>: rất lâu sau khi chúng hết hữu ích.</li>
  <li><em class="en">It's wonderfully fast, but it's fragile</em>: nó nhanh tuyệt vời, nhưng mong manh.</li>
  <li><em class="en">for the long haul</em>: cho đường dài, lâu dài.</li>
  <li><em class="en">session hygiene earns its place</em>: "vệ sinh phiên" xứng đáng có chỗ đứng.</li>
  <li><em class="en">quietly draining your budget</em>: lặng lẽ rút cạn ngân sách.</li>
  <li><em class="en">clearing your desk, not burning the room down</em>: dọn bàn, chứ không đốt cả căn phòng.</li>
  <li><em class="en">The boundary isn't magic. It's a choice you make in code.</em>: ranh giới không phải phép màu, nó là lựa chọn bạn đưa ra trong code.</li>
  <li><em class="en">degrades in ways that sneak up on you</em>: xuống cấp theo cách lặng lẽ "đánh úp" bạn.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson26/Lesson26.java</code>. Có 5 bài: tính tổng token đầu vào khi mỗi request gửi lại system prompt,
tool và toàn bộ lịch sử; prune các tool result lớn và cũ mà không đụng gì khác; phân loại nơi lưu là ephemeral hay durable;
dựng messages cho request kế tiếp bằng cách gửi lại transcript (API stateless); và bắt đầu phiên mới bằng một mảng mới chỉ mang theo tóm tắt.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-26"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-26 --live"</code>: hỏi lại một sự thật khi gửi kèm transcript (Claude trả lời được),
khi mở phiên mới không mang gì theo (Claude không biết), và khi phiên mới chỉ mang theo một tóm tắt ngắn.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Một phiên làm việc dài dần trở nên chậm và đắt. Bạn kỳ vọng model sẽ tự quên bớt nội dung nhàm chán. Theo bài học, điều đó có xảy ra không?', options: ['Có, model tự bỏ phần ít liên quan nhất', 'Không, code của bạn phải tự lấy nó ra', 'Có, nhưng chỉ với tool output', 'Chỉ khi bật chế độ tiết kiệm token'], answer: 1, explain: '"Nothing gets removed automatically. The model doesn\'t quietly forget the boring stuff to make room. If you want something out of that window, your code has to take it out."' },
    { q: 'Thứ nào sau đây KHÔNG tranh chỗ trong context window của một request?', options: ['Định nghĩa của mọi tool được khai báo trong request', 'Toàn bộ lịch sử hội thoại đang chạy từ đầu phiên', 'Ghi chú đã lưu trong một file chưa được đọc', 'Kết quả của mọi lần gọi tool'], answer: 2, explain: '"It holds the system prompt, the running history, your tool definitions, and every tool result, all competing for the same space." Một file trên đĩa chưa được đọc thì không nằm trong cửa sổ.' },
    { q: 'Định nghĩa nào đúng nhất với "durable state" trong bài?', options: ['Kiến thức lưu trong file/config', 'Phần lịch sử được model đánh dấu là quan trọng', 'Bản tóm tắt mà compaction tạo ra trong cửa sổ', 'System prompt, vì nó có mặt ở mọi lượt'], answer: 0, explain: '"Durable state. That\'s knowledge you keep outside the live window, in a file or in config, so it survives a truncation or the end of a session."' },
    { q: 'Theo bài học, "kẻ ngốn ngân sách" thật sự trong một phiên thường là gì?', options: ['System prompt dài', 'Định nghĩa tool nhiều tham số', 'Câu hỏi ngắn của người dùng', 'Tool output lớn'], answer: 3, explain: '"And the real budget killer is large tool output, a giant file you read, a huge search result."' },
    { q: 'Bạn đọc một file log 8.000 token ở lượt 2 và phiên kéo dài tới lượt 20. File đó tốn bạn bao nhiêu lần?', options: ['Một lần, lúc tool trả về', 'Bị xử lý lại ở mọi lượt sau đó', 'Hai lần: lúc đọc và lúc compaction', 'Không lần nào nếu nó được cache'], answer: 1, explain: '"That result doesn\'t just cost you once. It sits in the window and gets reprocessed on every later turn, quietly draining your budget the whole time."' },
    { q: 'Một kết quả search khổng lồ đã xong việc nhưng các quyết định gần đây vẫn quan trọng. Cách xử lý phù hợp nhất?', options: ['Bắt đầu lại phiên mới hoàn toàn', 'Tăng max_tokens để còn chỗ', 'Prune đúng kết quả đó', 'Yêu cầu model hãy bỏ qua kết quả đó'], answer: 2, explain: '"Pruning is the fix. You drop that one stale result without touching anything else in the conversation. You\'re not nuking the session."' },
    { q: 'Điều nào sau đây mô tả đúng ephemeral context?', options: ['Nhanh, nhưng mất khi cắt cửa sổ hay hết phiên', 'Chậm hơn đọc từ đĩa nhưng bền vững qua compaction', 'Luôn được tự động ghi ra auto memory khi phiên kết thúc', 'Chỉ gồm tool output, không gồm hội thoại'], answer: 0, explain: '"Ephemeral context is whatever sits in the live window right now. It\'s wonderfully fast... but it\'s fragile. The moment the window truncates or the session ends, it\'s gone."' },
    { q: 'Nhóm bạn chốt một quyết định kiến trúc quan trọng giữa phiên. Nên để quyết định đó ở đâu?', options: ['Nhắc lại nó ở mỗi tin nhắn', 'Để trong hội thoại vì model thấy ngay', 'Đưa vào tool result để được giữ lâu hơn', 'Ghi ra chỗ bền trên đĩa, nơi reset không xóa được'], answer: 3, explain: '"Anything you need to remember for the long haul, a decision, a fact, a running record, doesn\'t belong in the live window. It belongs somewhere durable, on disk, where a reset can\'t erase it."' },
    { q: 'Vì sao một cửa sổ phình to làm hóa đơn tăng, kể cả khi nội dung thừa không giúp gì?', options: ['Vì phần thừa bị tính phí gấp đôi', 'Vì mọi token trong cửa sổ bị xử lý lại ở mỗi lượt', 'Vì output dài hơn theo kích thước input', 'Vì API thu thêm phí lưu trữ phiên'], answer: 1, explain: '"Every token in the window gets reprocessed on every single turn. So a huge window means a bigger bill, whether or not the extra content is helping."' },
    { q: 'Thứ nào KHÔNG nằm trong ba cái giá của một cửa sổ phình to theo bài học?', options: ['Chi phí cao hơn', 'Phản hồi chậm hơn', 'Model từ chối trả lời', 'Trôi và lỗi khi theo chỉ dẫn'], answer: 2, explain: '"A bloated window costs you in three concrete ways. The first is higher cost... The second is slower responses... The third is drift and errors."' },
    { q: 'Câu trả lời của model chậm dần khi phiên dài ra. Lý do trực tiếp nhất theo bài?', options: ['Nhiều token phải đọc hơn ở mỗi lời gọi', 'Server ưu tiên phiên mới hơn phiên cũ', 'Model phải tự nén lịch sử trước khi trả lời', 'Tool definitions bị nạp lại từ đĩa'], answer: 0, explain: '"More tokens to read on each call adds latency. So replies take longer as the window grows."' },
    { q: 'Khi lịch sử ít giá trị chồng chất, điều gì xảy ra với chỉ dẫn của bạn?', options: ['Chỉ dẫn được model ưu tiên cao hơn', 'Không đổi, vì system prompt luôn thắng', 'Model chuyển sang hỏi lại người dùng', 'Model theo chỉ dẫn kém tin cậy hơn'], answer: 3, explain: '"As low signal history piles up, the model follows your instructions less reliably. And the context that actually matters gets crowded out by noise."' },
    { q: 'Mở một phiên Claude Code mới vào sáng hôm sau, model tự nó còn nhớ gì từ hôm qua?', options: ['Toàn bộ hội thoại hôm qua', 'Không gì cả: cửa sổ mới tinh', 'Năm lượt cuối của phiên trước', 'Mọi tool result đã được cache'], answer: 1, explain: '"Every Claude Code session starts with a fresh context window. The model remembers nothing from last time on its own."' },
    { q: 'Sau một lần compaction, file CLAUDE.md nào được chèn lại vào ngữ cảnh?', options: ['Mọi CLAUDE.md trong các thư mục con', 'Không file nào cho tới phiên sau', 'CLAUDE.md ở gốc dự án', 'Chỉ CLAUDE.md trong thư mục home'], answer: 2, explain: '"Claude.md files carry instructions you write. They load at the start of every session and the project root file re-injects even after a compaction."' },
    { q: 'Ai viết nội dung nào? Chọn phân vai đúng.', options: ['Bạn viết CLAUDE.md; Claude giữ auto memory', 'Claude viết CLAUDE.md; bạn tự viết auto memory', 'Cả hai đều do Claude tự sinh trong lúc làm việc', 'Cả hai đều do bạn viết tay'], answer: 0, explain: '"You author Claude.md, Claude maintains its own memory and the fresh window gets re-grounded from both."' },
    { q: 'Auto memory của Claude nằm ở đâu?', options: ['Trong system prompt của mỗi phiên', 'Trên server, gắn với tài khoản', 'Trong lịch sử hội thoại được nén', 'Trên đĩa, dưới chỉ mục MEMORY.md'], answer: 3, explain: '"Auto memory carries learnings Claude writes for itself. It lives on disk under a memory.md index and reloads as needed."' },
    { q: 'Bạn xây ứng dụng chat trên API trực tiếp. Lượt thứ ba, model "quên" tên người dùng nói ở lượt đầu. Nguyên nhân khả dĩ nhất?', options: ['API chỉ nhớ tối đa hai lượt', 'Code không gửi lại lượt đầu tiên', 'Model cố ý bỏ dữ liệu cá nhân', 'Phiên API đã hết hạn sau vài giây'], answer: 1, explain: '"Remember, the API is stateless. It keeps no memory between calls. So all of your conversation state lives in the request you send. Your code owns the transcript and you resend it on every single request."' },
    { q: 'Trên API, "bắt đầu một phiên mới" thực chất là gì?', options: ['Gọi một endpoint riêng để mở một phiên mới', 'Đổi API key để server quên toàn bộ lịch sử', 'Reset mảng messages và bắt đầu mảng mới', 'Đợi phiên cũ tự hết hạn'], answer: 2, explain: '"Starting a new session just means resetting that message history, dropping the old turns and beginning a fresh array."' },
    { q: 'Khi bắt đầu phiên API mới, bạn được mang gì theo từ phiên cũ?', options: ['Tùy bạn: tóm tắt ngắn hoặc không gì', 'Bắt buộc toàn bộ lịch sử, vì API cần nó', 'Chỉ tool result, vì chúng lớn nhất', 'Không được mang gì, API sẽ từ chối'], answer: 0, explain: '"You get to decide exactly what carries over, maybe a short summary, maybe nothing. And then you re-ground the new session from your config and system prompt."' },
    { q: 'Câu nào phản ánh đúng thông điệp về ranh giới phiên trên API?', options: ['Ranh giới do server quyết định theo thời gian', 'Ranh giới chỉ tồn tại trong Claude Code', 'Ranh giới tự sinh khi cửa sổ đầy', 'Lựa chọn trong code'], answer: 3, explain: '"The boundary isn\'t magic. It\'s a choice you make in code."' },
    { q: 'Một phiên dài bị bỏ mặc. Dấu hiệu nào thường xuất hiện ĐẦU TIÊN theo bài?', options: ['Request bị API từ chối', 'Khả năng theo chỉ dẫn yếu đi', 'Tool definitions biến mất', 'Model trả lời bằng ngôn ngữ khác'], answer: 1, explain: '"Left unmanaged, a long session degrades in ways that sneak up on you. Instruction following weakens first."' },
    { q: 'Những quy tắc bạn đặt ra từ đầu phiên bắt đầu "trượt" sau nhiều giờ làm việc. Bài học giải thích thế nào?', options: ['Model có giới hạn số quy tắc tối đa', 'Quy tắc cũ tự hết hạn sau một thời gian', 'Ngữ cảnh đầu phiên bị đẩy khỏi vùng chú ý hiệu quả', 'Compaction luôn xóa mọi quy tắc'], answer: 2, explain: '"Then early context gets pushed out of the model\'s effective attention. So things you established up front start slipping."' },
    { q: 'Nội dung hữu ích của phiên không tăng thêm, nhưng chi phí vẫn leo. Vì sao?', options: ['Bạn đang trả tiền xử lý lại tiếng ồn', 'Giá token tăng dần theo thời gian của phiên', 'Output của model ngày càng dài', 'Cache hết hạn nên tính phí phạt'], answer: 0, explain: '"Your costs climb the whole time, even when the useful content hasn\'t grown at all because you\'re paying to reprocess noise."' },
    { q: 'Câu nào KHÔNG đúng về state trong bài học này?', options: ['Durable state sống sót qua compaction', 'Durable state sống sót qua ranh giới phiên', 'Ephemeral context mất khi phiên kết thúc', 'Ephemeral context bền hơn vì nhanh hơn'], answer: 3, explain: '"It\'s wonderfully fast. The model sees it instantly, but it\'s fragile." Nhanh không có nghĩa là bền.' },
    { q: 'Câu chốt của bài về việc quản lý state phiên là gì?', options: ['Một tính năng model tự lo khi cửa sổ đầy', 'Việc kỹ thuật chủ động, không phải model làm hộ', 'Chỉ cần thiết khi dùng raw API', 'Chỉ là dọn dẹp cho gọn, không ảnh hưởng chất lượng'], answer: 1, explain: '"Managing session state is active engineering, not something the model does for you."' },
    { q: 'Đồng nghiệp đề xuất: "Mỗi khi phiên chậm, cứ xóa sạch hội thoại." Bạn có một tool result cũ khổng lồ nhưng đang giữa chừng một nhiệm vụ. Phản biện hợp lý nhất?', options: ['Đồng ý, xóa sạch luôn là an toàn nhất', 'Nên tăng ngân sách token thay vì dọn', 'Chỉ cần tỉa kết quả cũ đó, đừng phá cả phiên', 'Nên chép toàn bộ hội thoại vào CLAUDE.md'], answer: 2, explain: '"Think of it as clearing your desk, not burning the room down." Pruning giữ nhiệm vụ và quyết định gần đây ở chỗ model thấy được.' },
    { q: 'Theo bài, ranh giới phiên được định nghĩa thế nào?', options: ['Chỗ phiên cũ dừng, cửa sổ mới bắt đầu trống', 'Thời điểm cửa sổ đầy và model tự tóm tắt', 'Lúc người dùng đổi model sang phiên bản khác', 'Lượt cuối cùng mà tool còn được gọi'], answer: 0, explain: '"The session boundary. That\'s the line where one working session ends and a fresh window begins, carrying nothing forward unless you deliberately saved it."' },
    { q: 'Bạn muốn một phiên dài vẫn "sắc" ở cuối như lúc đầu. Thói quen nào là trọng tâm?', options: ['Viết prompt dài hơn ở cuối phiên', 'Luôn bật chế độ suy nghĩ mở rộng', 'Đổi sang model lớn hơn khi phiên dài', 'Chủ động kiểm soát thứ gì nằm trong cửa sổ'], answer: 3, explain: '"Good hygiene is what keeps a long run as sharp at the end as it was at the very start. You stay deliberate about what\'s in the window."' },
    { q: 'Thứ nào sau đây có mặt ở MỌI lượt trong một phiên, dù bạn có dùng tới hay không?', options: ['Chỉ câu hỏi mới nhất', 'System prompt và định nghĩa tool', 'Chỉ tool result gần nhất', 'Những file đã lưu trên đĩa của dự án'], answer: 1, explain: '"The system prompt is present on every turn. Your tool definitions are present on every turn."' },
    { q: 'Một phiên Claude Code mới được "re-ground" từ những nguồn nào theo bài?', options: ['Từ hội thoại của phiên trước', 'Từ cache của server', 'Từ CLAUDE.md và auto memory', 'Từ tool result được lưu tự động'], answer: 2, explain: '"You author Claude.md, Claude maintains its own memory and the fresh window gets re-grounded from both."' },
  ],
};
