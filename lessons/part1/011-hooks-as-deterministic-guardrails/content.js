window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Dặn agent "đừng chạy lệnh nguy hiểm" thì chưa đủ, vì nó vẫn có thể làm. Cách chắc chắn là gắn một
<strong>hook</strong>: một đoạn code tự động kiểm tra mỗi lệnh <strong>trước khi</strong> lệnh chạy, và chặn lại nếu nguy hiểm.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Hook:</strong> đoạn code tự động chạy vào một thời điểm nhất định, ví dụ ngay trước khi agent dùng một tool.</li>
  <li><strong>PreToolUse:</strong> thời điểm <strong>trước</strong> khi tool chạy. Chỉ ở đây mới chặn được.</li>
  <li><strong>PostToolUse:</strong> thời điểm <strong>sau</strong> khi tool đã chạy. Chỉ ghi nhận được, không chặn được.</li>
  <li><strong>deny / ask / allow:</strong> chặn hẳn / hỏi người duyệt / cho chạy.</li>
  <li><strong>Matcher:</strong> bộ lọc chọn hook này canh tool nào (ví dụ chỉ canh lệnh shell).</li>
</ul>

<h3>Vì sao dặn bằng lời là chưa đủ?</h3>
<div class="box">🛡️ <strong>Hình dung thế này:</strong> Dặn nhân viên "đừng vào phòng máy chủ" là <strong>lời dặn</strong>.
Lắp <strong>khóa cửa</strong> phòng máy chủ là <strong>hàng rào thật</strong>. Lời dặn có thể bị quên hay bị lách; khóa cửa thì không.</div>
<p>Lời dặn trong prompt nằm ngay trong những gì AI đọc, nên một câu hỏi khéo léo (hoặc chỉ là diễn đạt xui xẻo) có thể khiến AI bỏ qua nó.
Hook thì nằm trong code của bạn, AI <strong>không thấy và không "nói khéo" được</strong>. Nó chạy giống hệt nhau ở mọi lần.</p>

<h3>Một hàng rào gồm 3 phần</h3>
<ol>
  <li><strong>Chọn tool cần canh</strong> (matcher), ví dụ chỉ các lệnh shell.</li>
  <li><strong>Xem lệnh sắp chạy</strong>, ví dụ có phải lệnh xóa toàn bộ ổ đĩa không.</li>
  <li><strong>Trả về deny</strong> nếu nguy hiểm: lệnh sẽ không bao giờ chạy.</li>
</ol>

<h3>Chặn trước hay ghi nhận sau?</h3>
<ul>
  <li><strong>PreToolUse:</strong> lệnh nguy hiểm bị chặn <strong>trước khi chạy</strong>. Đây là phòng ngừa thật.</li>
  <li><strong>PostToolUse:</strong> chỉ thấy kết quả <strong>sau khi đã chạy</strong>. Có ích để ghi log, nhưng <strong>không cứu được gì</strong>.</li>
</ul>
<p>⚠️ <strong>Lỗi hay gặp:</strong> viết hook kiểm tra lệnh xóa nhưng gắn vào PostToolUse. Hook vẫn chạy, nhưng chạy <strong>sau khi</strong> file đã bị xóa.
Lúc đó nó chỉ còn là một bản báo cáo sự cố.</p>
<p>🧪 Câu hỏi để chọn đúng: <strong>"Ở thời điểm này mình muốn ngăn, hay chỉ muốn ghi lại?"</strong> Muốn ngăn thì phải dùng PreToolUse.</p>

<h3>Ba cách dùng hook</h3>
<ul>
  <li><strong>Chặn (deny):</strong> với lệnh phá hoại rõ ràng, như xóa toàn bộ ổ đĩa hay xóa bảng dữ liệu thật.</li>
  <li><strong>Hỏi người (ask):</strong> với lệnh rủi ro nhưng đôi khi hợp lệ, như ép đẩy code lên nhánh chính. Agent tạm dừng, chờ người quyết định.</li>
  <li><strong>Ghi lại (audit):</strong> ghi log mọi lệnh, để luôn biết agent đã làm gì mà không cần agent tự khai.</li>
</ul>

<h3>Gắn hook ở đâu?</h3>
<ul>
  <li>Trong code: thêm vào <code>options.hooks</code> khi cấu hình agent.</li>
  <li>Hoặc trong file <code>settings.json</code> với hook dạng lệnh shell. Loại này có thể chặn bằng <strong>mã thoát</strong> (exit code).</li>
  <li>Sau khi gắn, hãy <strong>thử đúng lệnh bạn muốn chặn</strong> để chắc nó hoạt động.</li>
</ul>

<h3>Hook chỉ là một lớp bảo vệ</h3>
<p>Lớp nền là <strong>quyền tối thiểu</strong>: chỉ cho agent đúng những gì nó cần. Ví dụ agent dọn file tạm thì đừng cho nó quyền vào cơ sở dữ liệu thật.
Không có quyền thì cũng không cần hàng rào. Hook nằm phía trên, canh những lệnh nguy hiểm còn lại trong phạm vi agent được phép.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Lời dặn trong prompt không phải là hàng rào; hook trong code mới là hàng rào.</li>
  <li>Muốn chặn thì dùng PreToolUse; PostToolUse chỉ để ghi lại.</li>
  <li>Thu hẹp quyền trước, rồi dùng hook canh phần còn lại.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">stops the action cold</em>: chặn đứng hành động.</li>
  <li><em class="en">the teeth behind the guardrail</em>: "răng" của hàng rào, sức mạnh thực thi.</li>
  <li><em class="en">shrink the surface</em>: thu nhỏ bề mặt (rủi ro).</li>
  <li><em class="en">a polite incident report</em>: một bản báo cáo sự cố lịch sự.</li>
  <li><em class="en">route to a human</em>: chuyển cho người xử lý.</li>
  <li><em class="en">be prompted away</em>: bị prompt làm cho mất tác dụng.</li>
  <li><em class="en">talk around</em>: nói vòng để lách qua.</li>
  <li><em class="en">step over it</em>: bước qua, vượt qua (quy tắc).</li>
  <li><em class="en">hold</em>: đứng vững.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part1/lesson11/Lesson11.java</code>. Có 4 bài: viết matcher (trống khớp tất cả, khớp toàn bộ tên, khớp cả họ tool),
viết bộ kiểm tra lệnh shell trả về DENY, ASK hoặc ALLOW, gộp quyết định của các hook PreToolUse (DENY thắng, rồi tới ASK),
và thực thi một lời gọi có hook bảo vệ, có người duyệt và nhật ký kiểm toán. Bộ chấm kiểm tra rằng lệnh bị chặn <strong>không bao giờ chạy</strong>,
và hook PostToolUse không chặn được gì. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p1-11"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p1-11 --live"</code>: Claude cầm một shell <strong>giả lập</strong> (không lệnh nào chạy thật trên máy bạn),
system prompt không cấm gì cả, và chỉ có hook của bạn đứng gác.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Nhóm viết hook kiểm tra lệnh "rm -rf /" và gắn vào sự kiện PostToolUse. Khi agent gõ lệnh đó, điều gì xảy ra?', options: ['Hook chặn lệnh trước khi nó chạy', 'Lệnh đã chạy rồi hook mới thấy', 'Hook không bao giờ được gọi vì sai sự kiện', 'Model tự hủy lệnh khi thấy hook'], answer: 1, explain: '"It fires after the delete has already run, so your guardrail is really just a polite incident report."' },
    { q: 'Mục đích là NGĂN một hành động. Sự kiện duy nhất phù hợp là gì?', options: ['PostToolUse', 'Stop', 'PreToolUse', 'SessionStart'], answer: 2, explain: '"If you need to prevent something, the event has to be pre-tool use, because that\'s the only one that runs before the action."' },
    { q: 'Nhóm chỉ cần ghi lại kết quả của mọi tool sau khi chạy để làm vết kiểm toán. Sự kiện nào hợp lý?', options: ['PreToolUse với quyết định deny', 'PostToolUse', 'PreToolUse với quyết định ask', 'Không cần hook, dặn model tự báo cáo'], answer: 1, explain: '"If you just need to observe or clean up afterward, then a later event like post-tool use or stop is exactly right."' },
    { q: 'Lệnh "git push --force" lên nhánh chính đôi khi hợp lệ, đôi khi nguy hiểm. Quyết định hook phù hợp là gì?', options: ['deny mọi lần', 'ask, để một người duyệt quyết định', 'allow mọi lần, ghi log sau', 'Không xử lý, để model tự cân nhắc'], answer: 1, explain: 'Gate: "you use ask to route a high-stakes action to a human for approval".' },
    { q: 'Câu nào SAI về hook làm hàng rào?', options: ['Nó nằm trong code, ngoài tầm với của model', 'Nó chạy giống nhau ở mọi lần', 'Input khéo léo có thể lách qua nó', 'Nó không nhớ gì về các lượt trước trong phiên'], answer: 2, explain: '"A guardrail built as a hook can\'t be prompted away... there\'s nothing for a clever input to talk around."' },
    { q: 'Vì sao quy tắc "không bao giờ chạy lệnh phá hoại" viết trong system prompt là chưa đủ?', options: ['Vì prompt bị cắt bớt khi quá dài', 'Vì nó nằm trong context', 'Vì model không đọc system prompt', 'Vì system prompt chỉ có hiệu lực ở lượt đầu tiên'], answer: 1, explain: '"The right adversarial input, or honestly, just an unlucky phrasing, can get the model to step over it."' },
    { q: 'Ba phần của một hàng rào theo đúng thứ tự là gì?', options: ['Matcher, xem input, trả về deny', 'Trả về deny, matcher, xem input', 'Xem input, trả về deny, matcher', 'Ghi log, matcher, trả về allow'], answer: 0, explain: '"Match the risky tool, inspect the call, deny the dangerous ones."' },
    { q: 'Hook có matcher là "Bash". Agent gọi tool "Write" để ghi file .env. Hook đó có chạy không?', options: ['Có, hook chạy với mọi tool', 'Không, vì matcher chỉ chọn tool tên Bash', 'Có, vì ghi file là thao tác nguy hiểm', 'Chỉ chạy nếu model gọi Bash trước đó'], answer: 1, explain: 'Matcher "selects which tool calls your hook even looks at". Muốn canh Write thì cần matcher cho Write.' },
    { q: 'Matcher để trống nghĩa là gì?', options: ['Không khớp tool nào', 'Khớp mọi tool', 'Chỉ khớp tool shell', 'Báo lỗi khi đăng ký hook'], answer: 1, explain: '"Or nothing at all, which means match everything."' },
    { q: 'Hai hook PreToolUse cùng khớp một lời gọi: một trả ask, một trả deny. Theo logic chặn an toàn, kết quả nên là gì?', options: ['ask, vì hook trả ask chạy trước', 'deny, vì chặn thắng', 'allow, vì hai hook mâu thuẫn', 'Chạy tool rồi hỏi người duyệt'], answer: 1, explain: 'Một hàng rào chặn thì hành động không được chạy; hỏi người duyệt chỉ có ý nghĩa khi không bị chặn.' },
    { q: 'Ba cách dùng xác định của hook là gì?', options: ['Chặn, kiểm duyệt, kiểm toán', 'Đọc, ghi và xóa file trong dự án', 'Gợi ý, tự sửa lệnh và giải thích cho model', 'Nhanh, rẻ, an toàn'], answer: 0, explain: '"Block, gate, audit. Same mechanism, three different jobs."' },
    { q: 'Nhóm cần bản ghi chắc chắn mọi lệnh agent đã chạy, kể cả khi model không tự báo cáo. Giải pháp nào đúng?', options: ['Yêu cầu model tóm tắt cuối phiên', 'Một hook ghi log mọi lời gọi tool', 'Đọc lại system prompt', 'Hỏi người dùng cuối phiên'], answer: 1, explain: '"You log every tool call deterministically, so your record of what the agent did never depends on the model choosing to report it."' },
    { q: 'Trong Agent SDK, đường chính để gắn hook là gì?', options: ['Viết trong CLAUDE.md', 'Callback trong options.hooks', 'Viết trong system prompt', 'Đặt biến môi trường trước khi chạy agent'], answer: 1, explain: '"The primary path is code, attaching your callback to options.hooks."' },
    { q: 'Hook dạng lệnh shell được khai báo ở đâu?', options: ['Trong options.hooks', 'Trong settings.json', 'Trong prompt mà người dùng gửi cho agent', 'Trong file README'], answer: 1, explain: '"The second surface is settings.json, where shell command hooks live. Loaded when you enable setting sources."' },
    { q: 'Hook dạng lệnh có thể chặn hành động ở cấp shell bằng tín hiệu nào?', options: ['Một dòng in ra màn hình', 'Mã thoát (exit code)', 'Một file log', 'Một email gửi cho quản trị'], answer: 1, explain: '"A command style hook can return exit code, too, and that\'s the deterministic signal that blocks the action at the shell level."' },
    { q: 'Sau khi đăng ký hook chặn, bước kiểm tra đúng là gì?', options: ['Đọc lại code hook là đủ', 'Thử đúng hành động cần chặn', 'Hỏi model xem hook đã chạy đúng hay chưa', 'Chờ sự cố thật để kiểm tra'], answer: 1, explain: '"Then test it by trying the exact action you meant to block."' },
    { q: 'Agent dọn dẹp chỉ cần đọc và xóa file trong thư mục tạm, nhưng được cấp quyền truy cập cơ sở dữ liệu production "phòng khi cần". Lớp nào nên sửa trước tiên?', options: ['Thêm hook chặn mọi lệnh SQL', 'Bỏ quyền truy cập production', 'Viết thêm cảnh báo vào prompt', 'Thêm hook PostToolUse ghi log SQL'], answer: 1, explain: '"If the agent can\'t reach production at all, you don\'t need a guardrail for it." Thu hẹp bề mặt trước, rồi canh gác phần còn lại.' },
    { q: 'Câu nào mô tả đúng quan hệ giữa quyền hạn và hook?', options: ['Hook thay thế hoàn toàn quyền hạn', 'Quyền đặt nền, hook canh phần còn lại', 'Quyền hạn chỉ cần thiết khi hệ thống không có hook nào', 'Hai thứ không liên quan nhau'], answer: 1, explain: '"Permissions set the baseline of what\'s even possible, and hooks add deterministic, case-by-case control."' },
    { q: 'Một hàng rào chỉ phát hiện sau khi hành động đã xảy ra thì thực chất là gì?', options: ['Một hàng rào yếu nhưng vẫn ngăn được', 'Một bản báo cáo', 'Một chính sách quyền hạn', 'Một hàng rào mạnh nhất vì thấy được kết quả'], answer: 1, explain: '"A guardrail that catches things afterward isn\'t a guardrail. It\'s a report."' },
    { q: 'Lệnh nào nên bị DENY thẳng thay vì ASK?', options: ['git push --force lên nhánh tính năng', 'rm -rf ở thư mục gốc của hệ thống', 'Tạo một nhánh git mới', 'Liệt kê file trong thư mục'], answer: 1, explain: 'Hành động phá hoại không có trường hợp hợp lệ thì chặn hẳn: "a recursive delete, or a drop of a production table".' },
    { q: 'Hook PostToolUse thấy một lệnh xóa vừa chạy. Nó có thể làm gì?', options: ['Hoàn tác lệnh xóa', 'Cảnh báo hoặc ghi log', 'Chặn lệnh xóa', 'Bắt model chạy lại lệnh khác'], answer: 1, explain: '"It can absolutely alert you or write a log entry... but it can\'t undo what happened."' },
    { q: 'Một người nói: "Hook của tôi đăng ký thành công và có chạy, vậy là hàng rào ổn rồi". Điều gì có thể vẫn sai?', options: ['Không gì sai cả', 'Hook có thể gắn sai sự kiện', 'Hook chạy quá nhanh nên model không kịp thấy kết quả', 'Hook không có tên'], answer: 1, explain: 'Một hook PostToolUse "registers cleanly, and it even fires", nhưng chạy quá muộn để ngăn.' },
    { q: 'Câu nào đúng về deny ở PreToolUse?', options: ['Hành động chạy rồi bị đảo ngược', 'Hành động không bao giờ được thực thi', 'Hành động được chạy ở chế độ thử', 'Hành động được chuyển cho người duyệt'], answer: 1, explain: '"The specific hook move that blocks a pending tool call outright, so the action simply never happens."' },
    { q: 'Nguyên tắc quyền tối thiểu trong bài này nhằm mục đích gì?', options: ['Giúp agent chạy nhanh hơn', 'Thu nhỏ thiệt hại có thể có', 'Giảm chi phí token', 'Thay thế hoàn toàn cho hook, không cần hook nữa'], answer: 1, explain: '"Least privilege shrinks how much damage is even possible."' },
    { q: 'Xếp lớp quyền hạn và hook giúp gì khi một chỉ dẫn trong prompt bị bỏ sót?', options: ['Không giúp gì, prompt vẫn là lớp chính', 'Lớp xác định bên dưới vẫn giữ', 'Model sẽ tự nhắc lại chỉ dẫn', 'Agent tự dừng phiên khi nhận ra chỉ dẫn bị thiếu'], answer: 1, explain: '"A single missed instruction in a prompt doesn\'t turn into a real incident, because the deterministic controls underneath still hold."' },
    { q: 'Matcher "mcp__github__.*" được dùng để làm gì?', options: ['Khớp đúng một tool tên mcp__github__', 'Khớp cả họ tool có tiền tố đó', 'Khớp mọi tool trừ GitHub', 'Không hợp lệ vì có ký tự đặc biệt'], answer: 1, explain: 'Matcher có thể là "a pattern that catches a family of tools".' },
    { q: 'Trong ba cách dùng hook, "gate" khác "block" ở điểm nào?', options: ['Gate chạy sau khi tool đã chạy', 'Gate hỏi người, block chặn hẳn', 'Gate chỉ ghi log', 'Gate chỉ dùng cho tool đọc, không dùng cho tool ghi'], answer: 1, explain: 'Block dùng deny; gate dùng ask để một người quyết định.' },
    { q: 'Vì sao hàng rào nghiêm túc nên sống trong hook thay vì prompt?', options: ['Vì hook rẻ hơn prompt', 'Vì hook là xác định', 'Vì prompt không hỗ trợ đầy đủ ngôn ngữ ngoài tiếng Anh', 'Vì hook giúp model thông minh hơn'], answer: 1, explain: '"That\'s the whole reason serious guardrails live in hooks, not in prompt text."' },
    { q: 'Cái bẫy được nhấn mạnh cuối bài là gì?', options: ['Dùng quá nhiều hook PreToolUse', 'Đặt kiểm tra sau khi tool chạy', 'Dùng matcher quá cụ thể nên bỏ sót họ tool khác', 'Dùng ask thay cho deny'], answer: 1, explain: '"The trap is using a post-tool hook and trying to put your check after the fact, where the damage is already done."' },
    { q: 'Câu nào là điều cần nhớ cuối bài?', options: ['Hàng rào kiểm tra kết quả sau khi tool chạy', 'Kiểm tra hành động đang chờ', 'Hàng rào nằm trong system prompt', 'Hàng rào chỉ cần cho tool shell, các tool khác thì không'], answer: 1, explain: '"When you build a guardrail, you\'re testing a pending action before it runs."' },
  ],
};
