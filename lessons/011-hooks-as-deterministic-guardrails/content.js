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

  quiz: [
    { q: 'Vì sao dặn agent trong prompt "đừng chạy lệnh nguy hiểm" là chưa đủ?', options: ['Vì dặn dò không phải là kiểm soát; model vẫn có thể bước qua', 'Vì prompt quá dài', 'Vì model không đọc prompt', 'Vì API cấm viết như vậy'], answer: 0, explain: 'Hỏi nhờ không phải là một cơ chế kiểm soát.' },
    { q: 'Theo bài học, một hàng rào (guardrail) phải hoạt động khi nào?', options: ['Sau khi hành động chạy', 'Trước khi hành động chạy', 'Chỉ khi có lỗi', 'Mỗi ngày một lần'], answer: 1, explain: 'Hàng rào chỉ phát hiện sau đó là một bản báo cáo.' },
    { q: 'Quyết định nào ở PreToolUse chặn hẳn một lời gọi tool?', options: ['allow', 'log', 'deny', 'retry'], answer: 2, explain: 'Deny là "răng" của hàng rào.' },
    { q: 'Quyền tối thiểu và hàng rào phối hợp thế nào?', options: ['Chỉ cần một trong hai', 'Hàng rào thay thế quyền tối thiểu', 'Quyền tối thiểu thay thế hàng rào', 'Quyền tối thiểu thu nhỏ thiệt hại có thể có, hàng rào bắt các trường hợp nguy hiểm còn lại'], answer: 3, explain: 'Thu hẹp bề mặt trước, rồi canh gác phần còn lại.' },
    { q: 'Ba phần của một hàng rào là gì?', options: ['Matcher, xem input đang chờ, trả về deny', 'Prompt, model, tool', 'Đọc, ghi, xóa', 'Log, cảnh báo, email'], answer: 0, explain: 'Khớp tool nguy hiểm, xem lời gọi, chặn cái nguy hiểm.' },
    { q: 'Matcher dùng để làm gì?', options: ['Chọn model', 'Chọn những lời gọi tool mà hook để ý', 'Đếm token', 'Đặt tên hook'], answer: 1, explain: 'Giúp hook tập trung thay vì chạy với mọi thứ.' },
    { q: 'Hook PostToolUse có thể làm gì với một lệnh xóa đã chạy?', options: ['Hoàn tác lệnh xóa', 'Chặn lệnh xóa', 'Cảnh báo hoặc ghi log, nhưng không hoàn tác được', 'Không làm gì được kể cả ghi log'], answer: 2, explain: 'Nó chỉ thấy kết quả sau khi tool đã chạy.' },
    { q: 'Nếu mục đích là ngăn tác hại, sự kiện nào phải dùng?', options: ['PostToolUse', 'Stop', 'SessionStart', 'PreToolUse'], answer: 3, explain: 'Đó là sự kiện duy nhất chạy trước hành động.' },
    { q: 'Khi chỉ cần quan sát hoặc dọn dẹp sau hành động, sự kiện nào phù hợp?', options: ['PostToolUse hoặc Stop', 'PreToolUse', 'Không có sự kiện nào', 'Chỉ PreToolUse với deny'], answer: 0, explain: 'Chọn sự kiện khớp với thời điểm cần làm.' },
    { q: 'Đặt kiểm tra lệnh phá hoại trong hook PostToolUse dẫn tới điều gì?', options: ['Hook không đăng ký được', 'Hook chạy sau khi lệnh đã chạy, nên chỉ là bản báo cáo sự cố', 'Hook chặn được nhưng chậm hơn', 'Model tự dừng'], answer: 1, explain: 'Nó đăng ký và chạy, nhưng quá muộn.' },
    { q: 'Câu hỏi giúp chọn đúng sự kiện vòng đời là gì?', options: ['Sự kiện nào nhanh nhất?', 'Sự kiện nào rẻ nhất?', 'Ở thời điểm này mình thật sự cần làm gì?', 'Sự kiện nào mới nhất?'], answer: 2, explain: 'Cần ngăn thì PreToolUse; cần quan sát thì sự kiện sau.' },
    { q: 'Ba cách dùng xác định của hook là gì?', options: ['Đọc, ghi, xóa', 'Nhanh, rẻ, đẹp', 'Prompt, model, tool', 'Chặn, kiểm duyệt, kiểm toán'], answer: 3, explain: 'Cùng một cơ chế, ba việc khác nhau.' },
    { q: 'Quyết định ask dùng để làm gì?', options: ['Chuyển hành động rủi ro cao cho người duyệt trước khi tiếp tục', 'Hỏi model có chắc không', 'Hỏi lại người dùng câu hỏi ban đầu', 'Chặn vĩnh viễn'], answer: 0, explain: 'Agent tạm dừng, người quyết định.' },
    { q: 'Kiểm toán bằng hook mang lại lợi ích gì?', options: ['Làm model nhanh hơn', 'Bản ghi những gì agent làm không phụ thuộc vào việc model có tự báo hay không', 'Giảm số token', 'Thay thế quyền tối thiểu'], answer: 1, explain: 'Ghi log mọi lời gọi tool một cách xác định.' },
    { q: 'Vì sao hook không thể bị "nói khéo" vượt qua?', options: ['Vì hook dùng model mạnh hơn', 'Vì hook được mã hóa', 'Vì phần kiểm tra nằm trong code, ngoài tầm với của model, model không thấy nó', 'Vì hook chạy trên máy chủ Anthropic'], answer: 2, explain: 'Không có gì để một input khéo léo lách qua.' },
    { q: 'Điểm yếu của một quy tắc viết trong prompt là gì?', options: ['Nó quá ngắn', 'Nó tốn nhiều token', 'Nó không được lưu', 'Nó nằm trong context, nên input tấn công hoặc cách diễn đạt xui xẻo có thể khiến model bước qua'], answer: 3, explain: 'Hook không có điểm yếu đó.' },
    { q: 'Đặc điểm nào khiến hook đáng tin hơn prompt?', options: ['Chạy giống nhau ở mọi lần, không nhớ lượt trước, không có "tâm trạng"', 'Hook thông minh hơn model', 'Hook rẻ hơn', 'Hook nhanh hơn'], answer: 0, explain: 'Tính xác định là giá trị cốt lõi.' },
    { q: 'Trong Agent SDK, đường chính để gắn hook là gì?', options: ['Viết trong system prompt', 'Code: gắn callback vào options.hooks', 'Gửi email cho Anthropic', 'Sửa file CLAUDE.md'], answer: 1, explain: 'Bề mặt thứ hai là settings.json.' },
    { q: 'Hook dạng lệnh shell được khai báo ở đâu?', options: ['Trong prompt', 'Trong mã nguồn model', 'Trong settings.json, nạp khi bật setting sources', 'Trong biến môi trường'], answer: 2, explain: 'Đó là bề mặt thứ hai để gắn hook.' },
    { q: 'Matcher để trống nghĩa là gì?', options: ['Không khớp tool nào', 'Chỉ khớp tool shell', 'Báo lỗi', 'Khớp mọi tool'], answer: 3, explain: 'Matcher có thể là tên chính xác, một mẫu, hoặc trống.' },
    { q: 'Hook dạng lệnh có thể chặn hành động ở cấp shell bằng cách nào?', options: ['Trả về mã thoát (exit code)', 'In ra màn hình', 'Gửi email', 'Đổi tên file'], answer: 0, explain: 'Mã thoát là tín hiệu xác định để chặn.' },
    { q: 'Sau khi đăng ký hook, bước kiểm tra nên làm là gì?', options: ['Không cần kiểm tra', 'Thử chính hành động bạn muốn chặn', 'Đọc lại tài liệu', 'Khởi động lại máy'], answer: 1, explain: 'Kiểm thử bằng đúng hành động cần chặn.' },
    { q: 'Nền móng bên dưới hook là gì?', options: ['Prompt thật dài', 'Model đắt tiền', 'Quyền tối thiểu', 'Log chi tiết'], answer: 2, explain: 'Quyền hạn đặt mức nền những gì có thể xảy ra.' },
    { q: 'Nếu agent không chạm được tới production, có cần hàng rào cho production không?', options: ['Có, luôn cần', 'Có, cần hai lớp', 'Chỉ khi dùng PostToolUse', 'Không, vì quyền tối thiểu đã loại bỏ rủi ro đó'], answer: 3, explain: 'Thu hẹp bề mặt trước khi canh gác.' },
    { q: 'Lợi ích của việc xếp lớp quyền hạn và hook là gì?', options: ['Một chỉ dẫn bị bỏ sót trong prompt không biến thành sự cố thật', 'Không cần viết prompt nữa', 'Model chạy nhanh hơn', 'Giảm chi phí API'], answer: 0, explain: 'Các kiểm soát xác định bên dưới vẫn đứng vững.' },
    { q: 'Tình huống: agent muốn chạy lệnh xóa đệ quy ở thư mục gốc. Hook nên làm gì?', options: ['Cho chạy rồi ghi log', 'Trả về deny ở PreToolUse, lệnh không bao giờ chạy', 'Hỏi model có chắc không', 'Chặn sau khi chạy'], answer: 1, explain: 'Hành động phá hoại thì chặn hẳn trước khi thực thi.' },
    { q: 'Tình huống: agent muốn đẩy code lên bằng force push. Cách xử lý hợp lý là gì?', options: ['Luôn cho phép', 'Luôn chặn và xóa nhánh', 'Dùng ask để chuyển cho người duyệt quyết định', 'Ghi log sau khi đẩy'], answer: 2, explain: 'Hành động rủi ro cao nhưng đôi khi hợp lệ: kiểm duyệt bởi người.' },
    { q: 'Tình huống: nhóm cần biết mọi lệnh agent đã chạy, kể cả khi model không tự báo cáo. Dùng gì?', options: ['Yêu cầu model tóm tắt cuối phiên', 'Đọc lại prompt', 'Hỏi người dùng', 'Hook ghi log kiểm toán mọi lời gọi tool'], answer: 3, explain: 'Kiểm toán xác định, không phụ thuộc model.' },
    { q: 'Cái bẫy được nhấn mạnh cuối bài là gì?', options: ['Dùng hook PostToolUse và đặt kiểm tra sau sự việc, khi thiệt hại đã xảy ra', 'Dùng quá nhiều hook', 'Dùng matcher trống', 'Dùng ask thay cho deny'], answer: 0, explain: 'Phòng ngừa phải sống trong PreToolUse.' },
    { q: 'Khi xây hàng rào, bạn đang kiểm tra cái gì?', options: ['Kết quả đã có của tool', 'Một hành động đang chờ, trước khi nó chạy', 'Chi phí của phiên', 'Chất lượng câu trả lời'], answer: 1, explain: 'Thứ cần dùng là PreToolUse với deny hoặc ask.' },
  ],
};
