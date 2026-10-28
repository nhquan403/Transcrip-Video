window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Một chỉ dẫn chạy tốt ở chỗ này nhưng lệch ở chỗ khác thường <strong>không phải do model đổi ý</strong>,
mà do <strong>cùng câu chữ được nạp vào chỗ khác nhau</strong>. Sự thật then chốt: <strong>CLAUDE.md không nằm trong system prompt</strong>;
nó được đưa vào hội thoại như <strong>một lượt user</strong>, đứng sau system prompt. Muốn chỉ dẫn "mang đi đâu cũng đúng", hãy chọn chỗ đặt có chủ đích.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Portable (mang đi được):</strong> chỉ dẫn cho ra cùng hành vi dù bạn dùng Claude qua bề mặt nào.</li>
  <li><strong>System prompt:</strong> kênh cấp cao nhất cho hành vi lâu dài của cả lượt chạy.</li>
  <li><strong>Output style:</strong> tính năng Claude Code thay phần "phong cách" trong system prompt.</li>
  <li><strong>Append option:</strong> tùy chọn nối thêm text vào cuối system prompt.</li>
  <li><strong>In-session message:</strong> câu bạn gõ giữa hội thoại; chỉ lái phiên hiện tại.</li>
  <li><strong>System prompt cache:</strong> phần đầu (prefix) của request được cache lại; đổi system prompt là đổi prefix này.</li>
</ul>

<h3>Ba "ngôi nhà" của một chỉ dẫn</h3>
<ul>
  <li><strong>System prompt:</strong> kênh cấp cao cho hành vi lâu dài. Trên raw API bạn đặt trực tiếp; output style và append option cũng <strong>sửa thẳng vào nó</strong>.</li>
  <li><strong>CLAUDE.md:</strong> quy tắc do lập trình viên viết, nạp vào ngữ cảnh <strong>dưới dạng một lượt user</strong>, đi cùng system prompt bạn đã chọn.</li>
  <li><strong>Tin nhắn trong phiên:</strong> lái phiên hiện tại, nhưng <strong>không lưu lại ở đâu</strong> khi phiên kết thúc.</li>
</ul>
<p>Cùng câu chữ, ba tuổi thọ khác nhau, ba ngôi nhà khác nhau.</p>

<h3>Sự thật then chốt: CLAUDE.md là một lượt user "đi nhờ xe"</h3>
<div class="box">🚌 <strong>Hình dung thế này:</strong> System prompt là <strong>nội quy dán ở cửa công ty</strong>: áp cho mọi người, cả ngày.
CLAUDE.md là <strong>tờ ghi chú đưa tận tay</strong> khi bạn vừa vào phòng họp: vẫn quan trọng, nhưng nó là một lời nói trong cuộc họp, không phải nội quy ở cửa.
Đổi tờ ghi chú không làm thay nội quy (và không làm hỏng cache của nội quy).</div>
<p>Anthropic ghi rõ điều này trong tài liệu của cả Claude Code lẫn Agent SDK: khi CLAUDE.md được nạp, nội dung của nó được chèn vào hội thoại
<strong>như một lượt user</strong>, gửi <strong>sau</strong> system prompt, chứ không nướng vào trong system prompt. Vì thế:</p>
<ul>
  <li>Nó định hình hành vi <strong>bên cạnh</strong> system prompt bạn chọn, bất kể là prompt nào.</li>
  <li>Nó <strong>không ảnh hưởng system prompt cache</strong>.</li>
  <li>Ngược lại, output style và append option <strong>có</strong> sửa system prompt, nên chúng đổi prefix được cache và áp như hành vi cấp cao cho cả lượt chạy.</li>
</ul>

<h3>Vậy đặt quy tắc ở đâu?</h3>
<ul>
  <li>Cần một quy tắc <strong>thực sự cấp hệ thống</strong>: dùng <strong>append</strong> hoặc <strong>output style</strong>.</li>
  <li>Cần <strong>quy tắc dự án mang đi được</strong>: <strong>CLAUDE.md</strong> là đúng chỗ, miễn bạn nhớ nó là một lượt user.</li>
</ul>

<h3>"Lệch" (drift) đến từ đâu?</h3>
<p>Không phải model âm thầm đổi ý. Mà là cùng câu chữ được nạp ở chỗ khác nhau trên bề mặt khác nhau:</p>
<ul>
  <li>Một bề mặt đọc file CLAUDE.md trên đĩa, bề mặt kế tiếp <strong>thậm chí không tìm</strong> file đó.</li>
  <li>Quy tắc đặt trong ứng dụng chat <strong>bị khóa trong ứng dụng đó</strong>, không bao giờ đi tới code của bạn.</li>
  <li>Prompt mặc định tối giản của Agent SDK <strong>đơn giản là thiếu</strong> hướng dẫn mà bạn tưởng lúc nào cũng có.</li>
</ul>
<p>Câu chữ không đổi; <strong>vị trí</strong> đổi. Và vị trí quyết định model <strong>có thấy</strong> chỉ dẫn hay không.</p>

<h3>Checklist mang đi được</h3>
<ol>
  <li><strong>Nói rõ quy tắc</strong> và đặt chúng ở nơi bề mặt <strong>thực sự nạp</strong>, thay vì giả định có cơ chế tự nạp lo hộ.</li>
  <li><strong>Commit quy tắc dùng chung</strong>: quy tắc dự án lâu dài nằm trong CLAUDE.md đã commit, để mọi đồng đội và mọi bề mặt đọc đúng một bản từ version control.</li>
  <li><strong>Đừng tin mặc định</strong>: quy tắc quan trọng thì tự đặt, đừng trông vào bề mặt cung cấp hộ.</li>
</ol>

<h3>Phạm vi bề mặt: quy tắc trên Claude.ai không đi theo bạn</h3>
<p>Chỉ dẫn hồ sơ và chỉ dẫn dự án trên Claude.ai chỉ áp trong web app đó. Claude Code và raw API <strong>không bao giờ thấy chúng</strong>.
Mỗi bề mặt giữ cấu hình riêng, không có "kho chung". Muốn quy tắc đúng ở mọi nơi thì hồ sơ chat là <strong>chỗ sai</strong>; hãy để nó trong cấu hình đã commit như CLAUDE.md của dự án.</p>

<h3>Chọn bề mặt theo việc</h3>
<ul>
  <li><strong>Nhúng Claude vào ứng dụng</strong>, cần kiểm soát từng request bằng code: raw API hoặc SDK.</li>
  <li><strong>Phát triển trên repo</strong>, muốn file, tool và CLAUDE.md được nạp tự động: Claude Code.</li>
  <li><strong>Việc nhanh, tương tác</strong>, soạn nháp, hỏi đáp, không code, không file: ứng dụng chat.</li>
</ul>
<p>Chỉ dẫn khớp với bề mặt: <strong>quy tắc lập trình nằm trong code</strong>, <strong>quy tắc dự án nằm trong CLAUDE.md</strong>, <strong>chỉ dẫn dùng một lần gõ ngay trong chat</strong>.</p>

<h3>Khi một quy tắc có vẻ bị phớt lờ</h3>
<ol>
  <li>Đừng vội nghĩ model không nghe lời; thường quy tắc <strong>chưa từng được nạp</strong> trên bề mặt đó.</li>
  <li>Xác nhận chỉ dẫn <strong>có tới được model</strong> hay không.</li>
  <li>Xem nó <strong>rơi vào đâu</strong>: text cấp hệ thống hay lượt user, vì điều đó đổi độ mạnh khi lái hành vi.</li>
  <li><strong>Thử lại đúng quy tắc đó</strong> trên bề mặt bạn kiểm soát hoàn toàn, như raw API, nơi bạn thấy chính xác cái gì được gửi.</li>
</ol>
<p>Gần như luôn luôn: <strong>quy tắc bị bỏ qua là quy tắc chưa được nạp</strong>. Sửa việc nạp, hành vi bạn muốn quay lại ngay.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>CLAUDE.md đi như một lượt user sau system prompt, không đổi system prompt cache; output style và append thì sửa system prompt.</li>
  <li>Drift đến từ vị trí nạp, không phải câu chữ hay model; quy tắc chat app bị khóa trong app đó.</li>
  <li>Quy tắc lâu dài nằm trong cấu hình đã commit; quy tắc quan trọng thì tự đặt, đừng tin mặc định.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">a problem that bites builders</em>: một vấn đề hay "cắn" người xây dựng.</li>
  <li><em class="en">The instructions just landed in a different spot</em>: chỉ dẫn chỉ rơi vào một chỗ khác.</li>
  <li><em class="en">three very different lifespans</em>: ba tuổi thọ rất khác nhau.</li>
  <li><em class="en">the key fact this whole lesson hangs on</em>: sự thật then chốt cả bài dựa vào.</li>
  <li><em class="en">rather than baked into it</em>: chứ không nướng thẳng vào trong nó.</li>
  <li><em class="en">It's a user message that rides along</em>: nó là một lượt user đi nhờ xe.</li>
  <li><em class="en">leaves the system prompt cache untouched</em>: để nguyên cache của system prompt.</li>
  <li><em class="en">Same words, different home, different behavior</em>: cùng câu chữ, khác ngôi nhà, khác hành vi.</li>
  <li><em class="en">never trust defaults</em>: đừng bao giờ tin mặc định.</li>
  <li><em class="en">full stop</em>: chấm hết, không có ngoại lệ.</li>
  <li><em class="en">throwaway steering</em>: chỉ dẫn lái tạm, dùng xong bỏ.</li>
  <li><em class="en">an ignored rule turns out to be an unloaded rule</em>: quy tắc bị phớt lờ hóa ra là quy tắc chưa được nạp.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson24/Lesson24.java</code>. Có 5 bài: xếp mỗi cơ chế vào đúng kênh (system prompt, lượt user, trong phiên),
cơ chế nào đổi system prompt cache, cơ chế nào còn sống sau khi phiên kết thúc, dựng request đưa CLAUDE.md thành một lượt user đứng trước câu hỏi,
và chọn ngôi nhà đúng cho từng loại quy tắc. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-24"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-24 --live"</code>: gửi request có CLAUDE.md đi như lượt user (Claude làm theo quy tắc của nó),
rồi gửi lại không nạp CLAUDE.md để thấy "quy tắc bị bỏ qua" thật ra là quy tắc chưa được nạp.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Theo bài học, khi một chỉ dẫn chạy ở chỗ này nhưng lệch ở chỗ khác mà không có lỗi nào, chuyện gì thường đã xảy ra?', options: ['Model đã được cập nhật phiên bản', 'Chỉ dẫn rơi vào một chỗ khác', 'Prompt bị cắt bớt vì quá dài', 'API trả về lỗi bị nuốt mất'], answer: 1, explain: '"Nothing errored. The instructions just landed in a different spot."' },
    { q: 'Khi CLAUDE.md được nạp, nội dung của nó đi vào request ở dạng nào?', options: ['Nối vào cuối system prompt', 'Thay phần phong cách của system prompt', 'Một lượt user, sau system prompt', 'Một tham số metadata riêng'], answer: 2, explain: '"When it loads, its content is injected into the conversation as a user message, delivered after the system prompt, rather than baked into it."' },
    { q: 'Cơ chế nào sau đây sửa trực tiếp vào system prompt?', options: ['Output style và append option', 'CLAUDE.md của dự án', 'CLAUDE.md trong thư mục cá nhân', 'Tin nhắn gõ giữa phiên'], answer: 0, explain: '"Contrast that with output styles, and the append option, which do modify the system prompt directly."' },
    { q: 'Đổi nội dung CLAUDE.md có làm thay đổi system prompt cache không?', options: ['Có, vì CLAUDE.md nằm trong system prompt', 'Có, nhưng chỉ khi dùng Agent SDK', 'Chỉ khi file dài hơn một giới hạn', 'Không, nó để nguyên cache đó'], answer: 3, explain: '"It loads beside your chosen system prompt, not inside it, and it leaves the system prompt cache untouched."' },
    { q: 'Một chỉ dẫn gõ giữa hội thoại có đặc điểm gì?', options: ['Được lưu vào CLAUDE.md tự động', 'Lái phiên hiện tại, mất khi phiên kết thúc', 'Áp cho mọi phiên sau của cả nhóm', 'Ghi đè system prompt cho tới khi tắt'], answer: 1, explain: '"It steers the current session, but it persists nowhere once that session ends."' },
    { q: 'Cần một quy tắc hoạt động như quy tắc cấp hệ thống thật sự. Nên làm gì?', options: ['Ghi vào CLAUDE.md của dự án rồi commit', 'Gõ lại ở đầu mỗi phiên làm việc', 'Đặt trong chỉ dẫn hồ sơ Claude.ai', 'Dùng append hoặc output style'], answer: 3, explain: '"If you need something to behave as a genuine system-level rule, append it, or use an output style."' },
    { q: 'Cần quy tắc dự án mang đi được giữa các bề mặt và đồng đội. Chỗ đúng là đâu?', options: ['CLAUDE.md, nhớ rằng nó là lượt user', 'Chỉ dẫn hồ sơ trên web app', 'Tin nhắn đầu tiên mỗi phiên', 'Biến môi trường của từng máy'], answer: 0, explain: '"If you want portable project rules, CLAUDE.md is the right home, as long as you remember it\'s a user message."' },
    { q: 'Theo bài học, "drift" giữa các bề mặt chủ yếu đến từ đâu?', options: ['Model âm thầm đổi ý giữa các lần gọi API', 'Nhiệt độ lấy mẫu khác nhau', 'Cùng câu chữ được nạp ở chỗ khác nhau', 'Giới hạn token khác nhau giữa các bề mặt'], answer: 2, explain: '"Not from the model quietly changing its mind, it comes from the same words loading in different places on different surfaces."' },
    { q: 'Thứ quyết định model có thấy một chỉ dẫn hay không là gì?', options: ['Độ dài của câu chữ', 'Ngôn ngữ viết chỉ dẫn', 'Mức độ nhấn mạnh bằng chữ in hoa', 'Vị trí chỉ dẫn được nạp'], answer: 3, explain: '"Placement is exactly what determines whether the model ever sees the instruction at all."' },
    { q: 'Bạn đặt một quy tắc hữu ích trong chỉ dẫn hồ sơ trên Claude.ai. Lời gọi raw API trong code của bạn sẽ thế nào?', options: ['Không bao giờ thấy quy tắc đó', 'Thấy, vì cùng tài khoản', 'Thấy sau khi đồng bộ hồ sơ', 'Thấy nếu bật Claude Code preset'], answer: 0, explain: '"That rule doesn\'t follow the model into your code... Claude Code and the raw API never see them full stop."' },
    { q: 'Vì sao Agent SDK có thể gây "drift" dù bạn không đổi câu chữ nào?', options: ['SDK dùng model yếu hơn', 'SDK tự viết lại prompt của bạn', 'Prompt tối giản thiếu hướng dẫn bạn tưởng có', 'SDK bỏ qua tham số system'], answer: 2, explain: '"The agent SDK\'s minimal default prompt simply omits the standing guidance you assumed was always there."' },
    { q: 'Mục đầu tiên của checklist mang đi được là gì?', options: ['Viết quy tắc thật ngắn', 'Nói rõ, đặt nơi bề mặt thật sự nạp', 'Lặp lại quy tắc ở mọi bề mặt bằng tay', 'Chỉ dùng một bề mặt duy nhất cho mọi việc'], answer: 1, explain: '"State your rules explicitly and put them where the surface will really load them, instead of assuming some autoload will handle it."' },
    { q: 'Vì sao nên để quy tắc dự án lâu dài trong CLAUDE.md đã commit?', options: ['Để mọi người, mọi bề mặt đọc cùng một bản', 'Để giảm số token mỗi lượt', 'Để model luôn ưu tiên nó hơn system prompt', 'Để quy tắc được mã hóa an toàn trong git repo'], answer: 0, explain: '"Durable project rules belong in a committed CLAUDE.md, so every teammate and every surface reads the exact same thing from version control."' },
    { q: '"Never trust defaults" trong checklist nghĩa là gì trong thực tế?', options: ['Luôn tắt mọi cấu hình mặc định của mọi bề mặt', 'Tự đặt quy tắc quan trọng, đừng trông bề mặt', 'Luôn bật Claude Code preset ở mọi nơi dùng SDK', 'Không bao giờ dùng Agent SDK'], answer: 1, explain: '"If a rule genuinely matters, set it yourself rather than relying on a surface to supply it for you."' },
    { q: 'Chủ đề chung xuyên suốt ba mục của checklist là gì?', options: ['Viết chỉ dẫn càng dài càng tốt', 'Dồn mọi quy tắc vào system prompt', 'Làm cho ngôi nhà của chỉ dẫn có chủ đích', 'Thử chỉ dẫn trên mọi model'], answer: 2, explain: '"You make the instructions home deliberate, so the same behavior shows up no matter which surface loads it."' },
    { q: 'Có "kho cấu hình chung" mà mọi bề mặt cùng đọc không?', options: ['Có, gắn với tài khoản Anthropic của bạn', 'Có, miễn là mọi nơi dùng cùng một API key', 'Có, qua thư mục ~/.claude dùng chung mọi nơi', 'Không, mỗi bề mặt có cấu hình riêng'], answer: 3, explain: '"Each surface keeps its own separate configuration, and there\'s no shared pool they all draw from."' },
    { q: 'Bạn nhúng Claude vào một ứng dụng và muốn kiểm soát từng request bằng code. Nên dùng bề mặt nào?', options: ['Ứng dụng chat trên web', 'Raw API hoặc SDK', 'Claude Desktop', 'Chỉ dẫn hồ sơ Claude.ai'], answer: 1, explain: '"When you\'re embedding Claude inside an application and you want programmatic control over every request, reach for the raw API or the SDK."' },
    { q: 'Bạn làm việc trên một repo và muốn file, tool, CLAUDE.md được nạp tự động. Bề mặt tự nhiên là gì?', options: ['Raw API', 'Ứng dụng chat', 'Claude Code', 'Batches API'], answer: 2, explain: '"When you\'re doing repository-based development and you want your files, your tools, and your CLAUDE.md loaded for you, automatically, Claude Code is the natural fit."' },
    { q: 'Cần hỏi nhanh một câu, soạn nháp, không code, không file. Đường nhanh nhất là gì?', options: ['Viết một Agent SDK script', 'Mở phiên Claude Code', 'Gọi raw API bằng curl', 'Một bề mặt chat được host'], answer: 3, explain: '"When you just need quick interactive work... with no code, no files, and no persistent integration, a hosted chat surface is the fastest path."' },
    { q: 'Ghép đúng loại chỉ dẫn với chỗ đặt theo bài học.', options: ['Lập trình ở code, dự án ở CLAUDE.md', 'Mọi quy tắc trong hồ sơ chat cho tiện', 'Quy tắc dự án gõ lại mỗi phiên', 'Quy tắc lập trình trong CLAUDE.md cá nhân'], answer: 0, explain: '"Programmatic rules in code, project rules in CLAUDE.md, and throwaway steering in the chat itself."' },
    { q: 'Một quy tắc có vẻ bị phớt lờ. Bước đầu tiên nên làm là gì?', options: ['Viết lại quy tắc bằng chữ in hoa cho rõ', 'Xác nhận nó có tới được model không', 'Chuyển sang một model mạnh hơn để thử', 'Báo lỗi rằng model không chịu nghe lời'], answer: 1, explain: '"Don\'t immediately assume the model is disobeying you... So confirm first that the instruction actually reached the model at all."' },
    { q: 'Vì sao cần kiểm tra chỉ dẫn rơi vào system prompt hay lượt user?', options: ['Vì lượt user bị tính phí cao hơn', 'Vì lượt user không được cache', 'Vì điều đó đổi độ mạnh khi lái hành vi', 'Vì system prompt bị giới hạn độ dài'], answer: 2, explain: '"Then check where it landed, whether it came in a system-level text, or as a user message, because that changes how strongly it steers behavior."' },
    { q: 'Ở bước cuối khi debug, vì sao thử lại quy tắc trên raw API?', options: ['Vì raw API dùng một model khác mạnh hơn', 'Vì raw API rẻ hơn mọi bề mặt khác', 'Vì raw API tự nạp CLAUDE.md từ ổ đĩa', 'Vì ở đó thấy rõ cái gì được gửi'], answer: 3, explain: '"Retest the very same rule on a surface you fully control, like the raw API, where you can see exactly what was sent."' },
    { q: 'Kết luận "gần như luôn luôn" của bài khi một quy tắc bị bỏ qua là gì?', options: ['Đó là quy tắc chưa được nạp', 'Đó là lỗi của model', 'Quy tắc viết quá mơ hồ', 'Quy tắc mâu thuẫn với system prompt'], answer: 0, explain: '"Almost always, an ignored rule turns out to be an unloaded rule."' },
    { q: 'Bạn dựng request trên raw API mô phỏng cách SDK nạp CLAUDE.md. Cấu trúc nào đúng?', options: ['system = prompt + nội dung CLAUDE.md', 'system = CLAUDE.md, user = câu hỏi', 'system = prompt; lượt user CLAUDE.md, rồi câu hỏi', 'Bỏ system, chỉ gửi câu hỏi'], answer: 2, explain: 'CLAUDE.md "arrive as a user message alongside whichever system prompt you chose", nên system giữ nguyên, CLAUDE.md là lượt user đứng trước câu hỏi.' },
    { q: 'Đội bạn đổi CLAUDE.md mỗi ngày và lo làm hỏng prompt cache của system prompt. Nhận định nào đúng?', options: ['Đúng, mỗi lần sửa phá cache', 'Nên chuyển quy tắc sang append để cache ổn định', 'Lo không cần thiết: CLAUDE.md không chạm cache đó', 'Phải tắt cache khi dùng CLAUDE.md'], answer: 2, explain: '"Its content doesn\'t affect the system prompt cache." Ngược lại, append và output style mới "change the cached prefix".' },
    { q: 'Ai đó hình dung CLAUDE.md là "text cấp hệ thống". Bài học sửa lại mô hình tư duy đó thế nào?', options: ['Nó là output style', 'Nó là một lượt user đi kèm', 'Nó là phần đầu của system prompt', 'Nó là một tool definition'], answer: 1, explain: '"So if you were picturing CLAUDE.md as system-level text, correct the mental model now. It\'s a user message that rides along."' },
    { q: 'Câu nào mô tả đúng ba ngôi nhà của một chỉ dẫn?', options: ['Ba chỗ nhưng cùng tuổi thọ', 'Chỉ có hai: system prompt và CLAUDE.md', 'Cả ba đều sửa system prompt', 'System prompt, CLAUDE.md, tin nhắn trong phiên'], answer: 3, explain: '"First, the system prompt... Second, CLAUDE.md... Third, an in-session message... Same words, three very different lifespans, and three different homes."' },
    { q: 'Một bề mặt đọc CLAUDE.md từ đĩa, bề mặt kia không tìm file đó. Cùng quy tắc cho hai hành vi khác nhau. Đây là ví dụ của gì?', options: ['Vị trí nạp gây drift', 'Model không ổn định', 'Lỗi encoding của file', 'Rate limit khác nhau'], answer: 0, explain: '"One surface reads a CLAUDE.md file off-disk that the next surface never even looks for... In every case, the instruction text didn\'t change. Its placement did."' },
    { q: 'Theo bài, "bottom line" của chỉ dẫn mang đi được quy về điều gì?', options: ['Chọn đúng model', 'Vị trí đặt chỉ dẫn', 'Viết prompt thật dài', 'Số lượng ví dụ'], answer: 1, explain: '"Here\'s the bottom line. Portable instructions come down to one thing, placement."' }
  ]
};
