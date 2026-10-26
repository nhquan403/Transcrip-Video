window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Ý chính của cả bài:</strong> Đưa cho agent một shell thì sớm muộn nó sẽ với tới một lệnh bạn không muốn chạy.
<strong>Dặn trong prompt không phải là kiểm soát.</strong> Hàng rào thật là một <strong>hook PreToolUse</strong> trả về <em>deny</em> (chặn) hoặc <em>ask</em> (hỏi người)
<strong>trước khi</strong> tool chạy. Hook nằm trong code, ngoài tầm với của model, nên không thể bị "nói khéo" để vượt qua.</p>

<h3>1. Ba ý tưởng khung</h3>
<ul>
  <li><strong>Hàng rào (guardrail):</strong> một cơ chế chặn hoặc kiểm soát hành động nguy hiểm <strong>trước khi</strong> nó chạy. Chữ quan trọng là "trước".
  Một hàng rào chỉ phát hiện sau đó không phải hàng rào, mà là một bản báo cáo.</li>
  <li><strong>Quyết định deny ở PreToolUse:</strong> nước đi cụ thể của hook để chặn hẳn một lời gọi tool đang chờ, nên hành động không bao giờ xảy ra. Đây là "răng" của hàng rào.</li>
  <li><strong>Quyền tối thiểu:</strong> chỉ cho agent những tool và quyền truy cập nó thật sự cần. Quyền tối thiểu thu nhỏ thiệt hại có thể xảy ra, hàng rào bắt các trường hợp nguy hiểm trong phần còn lại.
  Thu hẹp bề mặt trước, rồi canh gác phần còn lại.</li>
</ul>

<h3>2. Hình dạng của một hàng rào: ba phần</h3>
<ul>
  <li><strong>Matcher:</strong> chọn những lời gọi tool mà hook để ý, ví dụ lệnh shell hoặc thao tác ghi, để hook tập trung thay vì chạy với mọi thứ.</li>
  <li><strong>Xem input đang chờ:</strong> tìm đúng thứ bạn muốn chặn, ví dụ một lệnh xóa đệ quy ở gốc hệ thống file.</li>
  <li><strong>Trả về deny:</strong> khi tìm thấy, lời gọi không bao giờ được thực thi.</li>
</ul>
<p>Khớp tool nguy hiểm, xem lời gọi, chặn cái nguy hiểm. Vì tất cả diễn ra trước khi thực thi, hành động xấu bị <strong>ngăn</strong>, không chỉ bị <strong>phát hiện</strong>.</p>

<h3>3. Chặn trước hay phát hiện sau</h3>
<p>Với <strong>PreToolUse deny</strong>, bạn chặn hành động khi lời gọi còn đang chờ. Lệnh nguy hiểm không bao giờ chạm vào hệ thống vì nó không bao giờ chạy. Đó là phòng ngừa thật.</p>
<p>Ngược lại, hook <strong>PostToolUse</strong> chỉ thấy kết quả <strong>sau khi</strong> tool đã chạy. Nó có thể cảnh báo hoặc ghi log (rất có ích cho vết kiểm toán),
nhưng <strong>không thể hoàn tác</strong> những gì đã xảy ra. Nếu mục đích là ngăn tác hại, phát hiện sau là sai công cụ, dù log có tốt tới đâu.
Quy tắc tự hiện ra: <strong>phòng ngừa sống trước khi thực thi, tức là sống trong PreToolUse.</strong></p>

<h3>4. Chọn đúng sự kiện vòng đời</h3>
<p>Chỉ cần một câu hỏi: <em>ở thời điểm này mình thật sự cần làm gì?</em> Cần <strong>ngăn</strong> thì sự kiện phải là PreToolUse, vì đó là sự kiện duy nhất chạy trước hành động.
Chỉ cần <strong>quan sát hoặc dọn dẹp</strong> sau đó thì PostToolUse hoặc Stop là đúng.</p>
<p>Kiểu lỗi đáng nhấn mạnh: đặt kiểm tra lệnh phá hoại trong một hook PostToolUse. Nó đăng ký gọn gàng, thậm chí còn chạy.
Nhưng nó chạy <strong>sau khi</strong> lệnh xóa đã chạy, nên "hàng rào" của bạn thật ra chỉ là một bản báo cáo sự cố lịch sự.</p>

<h3>5. Ba cách dùng xác định</h3>
<ul>
  <li><strong>Chặn (block):</strong> deny hẳn một lệnh phá hoại (xóa đệ quy, drop bảng production) trước khi nó chạy.</li>
  <li><strong>Kiểm duyệt (gate):</strong> thay vì chặn cứng, dùng <em>ask</em> để chuyển hành động rủi ro cao cho người duyệt. Agent tạm dừng, người quyết định, rồi mới tiếp.</li>
  <li><strong>Kiểm toán (audit):</strong> ghi log mọi lời gọi tool một cách xác định, để bản ghi những gì agent đã làm không phụ thuộc vào việc model có tự báo hay không.</li>
</ul>
<p>Cùng một cơ chế, ba việc khác nhau.</p>

<h3>6. Vì sao hook không thể bị "nói khéo" vượt qua?</h3>
<p>Phần kiểm tra nằm trong code của bạn, hoàn toàn ngoài tầm với của model. Model thậm chí không thấy nó, nên không có gì để một input khéo léo lách qua.
So với một quy tắc viết trong prompt kiểu "không bao giờ chạy lệnh phá hoại": chỉ dẫn đó nằm ngay trong context, và một input tấn công phù hợp
(hoặc đơn giản là một cách diễn đạt xui xẻo) có thể khiến model bước qua nó. Hook không có điểm yếu đó: nó chạy giống nhau ở mọi lần, không nhớ các lượt trước, không có "tâm trạng".
Đó là lý do hàng rào nghiêm túc sống trong hook, không phải trong prompt.</p>

<h3>7. Gắn hook thế nào?</h3>
<ul>
  <li>Trong SDK, đường chính là <strong>code</strong>: gắn callback vào <code>options.hooks</code> trong options của agent.</li>
  <li>Bề mặt thứ hai là <strong>settings.json</strong>, nơi các hook dạng lệnh shell sống, được nạp khi bạn bật nguồn cấu hình (setting sources).</li>
  <li>Cả hai cách đều phải nêu <strong>sự kiện vòng đời</strong> (ví dụ PreToolUse) và một <strong>matcher</strong>: tên tool chính xác, một mẫu khớp cả họ tool, hoặc để trống nghĩa là khớp tất cả.</li>
  <li>Hook dạng lệnh còn có thể trả về <strong>mã thoát (exit code)</strong>: đó là tín hiệu xác định để chặn hành động ở cấp shell.</li>
</ul>
<p>Đăng ký, trỏ matcher đúng lời gọi, rồi <strong>kiểm thử</strong> bằng cách thử chính hành động bạn muốn chặn.</p>

<h3>8. Hook là một lớp, không phải tất cả</h3>
<p>Nền móng là <strong>quyền tối thiểu</strong>: chỉ cho agent tool và quyền nó thật sự cần, thu nhỏ bề mặt rủi ro trước khi hook nào chạy.
Nếu agent không chạm được tới production, bạn không cần hàng rào cho production. Hook nằm phía trên, canh gác các hành động nguy hiểm bên trong những tool agent được phép có.
Hình dung như một chồng lớp: quyền hạn đặt mức nền những gì có thể xảy ra, hook thêm kiểm soát xác định cho từng trường hợp rủi ro còn lại.
Xếp lớp như vậy thì một chỉ dẫn bị bỏ sót trong prompt không biến thành sự cố thật, vì các kiểm soát xác định bên dưới vẫn đứng vững.</p>

<h3>9. Tóm tắt</h3>
<ul>
  <li>Xây hàng rào là kiểm tra một hành động đang chờ trước khi nó chạy.</li>
  <li>Thứ cần dùng: PreToolUse với deny hoặc ask.</li>
  <li>Cái bẫy: dùng hook PostToolUse và đặt kiểm tra sau sự việc, khi thiệt hại đã xảy ra.</li>
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
<p>Mở <code>java-app/src/main/java/lesson11/Lesson11.java</code>. Có 4 bài: viết matcher (trống khớp tất cả, khớp toàn bộ tên, khớp cả họ tool),
viết bộ kiểm tra lệnh shell trả về DENY, ASK hoặc ALLOW, gộp quyết định của các hook PreToolUse (DENY thắng, rồi tới ASK),
và thực thi một lời gọi có hook bảo vệ, có người duyệt và nhật ký kiểm toán. Bộ chấm kiểm tra rằng lệnh bị chặn <strong>không bao giờ chạy</strong>,
và hook PostToolUse không chặn được gì. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="11"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="11 --live"</code>: Claude cầm một shell <strong>giả lập</strong> (không lệnh nào chạy thật trên máy bạn),
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
