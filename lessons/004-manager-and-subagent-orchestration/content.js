window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Khi một việc quá lớn cho một agent, hãy để một <strong>agent quản lý</strong> chia việc ra,
giao từng phần cho các <strong>agent phụ</strong>, rồi gom kết quả lại. Người quản lý chỉ điều phối, không tự làm.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Manager (agent quản lý):</strong> agent nắm mục tiêu chung, chia việc và ghép kết quả.</li>
  <li><strong>Subagent (agent phụ):</strong> một agent riêng, được giao đúng một phần việc nhỏ, làm xong thì báo lại một kết quả.</li>
  <li><strong>Giao việc (delegation):</strong> hành động manager trao một phần việc cho subagent.</li>
  <li><strong>Handoff (gói bàn giao):</strong> nội dung manager gửi kèm khi giao việc: việc cần làm, thông tin cần biết, kết quả mong muốn.</li>
</ul>

<h3>Vì sao cần chia việc?</h3>
<p>Khi một agent phải ôm cả một việc lớn và lộn xộn, "trí nhớ làm việc" của nó (context) bị nhồi đầy, và câu trả lời kém đi.</p>
<div class="box">👩‍💼 <strong>Hình dung thế này:</strong> Trưởng nhóm nhận việc "làm báo cáo thị trường". Họ không tự làm hết, mà giao:
một người tìm số liệu, một người đọc báo cáo đối thủ, một người vẽ biểu đồ. Trưởng nhóm kiểm tra từng phần rồi ghép thành báo cáo cuối.</div>

<h3>Manager làm gì?</h3>
<p>Lần nào cũng ba bước:</p>
<ul>
  <li><strong>Chia nhỏ:</strong> tách việc lớn thành các việc con độc lập.</li>
  <li><strong>Giao việc:</strong> chọn subagent phù hợp cho từng việc con.</li>
  <li><strong>Tổng hợp:</strong> gom các kết quả thành một câu trả lời hoàn chỉnh.</li>
</ul>
<p>⚠️ Manager <strong>không tự làm</strong> việc con. Việc của nó là điều phối.</p>

<h3>Khác gì "làm song song" ở bài 1?</h3>
<p>Nhìn trên sơ đồ thì hai cái giống hệt nhau: một người chia việc cho nhiều người. Khác nhau ở <strong>ai quyết định cách chia</strong>:</p>
<ul>
  <li><strong>Làm song song:</strong> bạn đã biết trước cách chia và viết sẵn trong code. Ví dụ: lúc nào cũng dịch 3 phần mở bài, thân bài, kết luận.</li>
  <li><strong>Manager và subagent:</strong> manager <strong>nhìn từng yêu cầu cụ thể rồi mới quyết định</strong> chia thế nào. Ví dụ: mỗi bug report cần kiểm tra những thứ khác nhau.</li>
</ul>
<p>💡 Nếu cách chia lúc nào cũng giống nhau thì <strong>không cần manager</strong>; chia sẵn bằng code là đơn giản và rẻ hơn.</p>

<h3>Giao việc trong Agent SDK diễn ra thế nào?</h3>
<ul>
  <li>Manager gọi một tool có sẵn tên là <code>agent</code> để tạo subagent.</li>
  <li>Mỗi subagent có một <strong>mô tả ngắn</strong> về việc nó giỏi. Claude đọc mô tả này để chọn đúng người cho đúng việc. Bạn cũng có thể gọi đích danh một subagent.</li>
  <li>Nên cho phép sẵn tool <code>agent</code> để việc giao không bị dừng lại hỏi quyền mỗi lần.</li>
  <li>Lưu ý: cho phép giao việc <strong>không có nghĩa</strong> là cho phép luôn các tool mà subagent dùng. Những tool đó vẫn được kiểm tra quyền riêng.</li>
</ul>

<h3>Giao việc thế nào cho tốt?</h3>
<ul>
  <li><strong>Việc phải rõ ràng:</strong> giao một việc cụ thể, không phải "tìm hiểu chung chung về hệ thống". Giao mơ hồ thì nhận về kết quả mơ hồ.</li>
  <li><strong>Nói rõ muốn nhận về cái gì:</strong> một đoạn tóm tắt, một danh sách, hay dữ liệu có cấu trúc.</li>
  <li><strong>Kiểm tra trước khi ghép:</strong> subagent có thể trả về thứ nghe rất hợp lý nhưng sai. Manager là chốt chặn cuối.</li>
</ul>

<h3>Ba hàng rào an toàn</h3>
<ul>
  <li><strong>Quyền tối thiểu:</strong> chỉ cho subagent đúng những công cụ nó cần.</li>
  <li><strong>Không làm ngoài phần việc:</strong> agent tóm tắt mà đi xóa file là đã giao sai phạm vi.</li>
  <li><strong>Kiểm tra kết quả:</strong> manager xem lại từng kết quả trước khi đưa vào câu trả lời cuối.</li>
</ul>

<h3>Ba lỗi hay gặp</h3>
<ul>
  <li><strong>Giao quá nhiều việc một lúc:</strong> giao "một việc" mà thực ra là năm việc, subagent sẽ lan man và tốn token.</li>
  <li><strong>Thiếu thông tin:</strong> subagent bắt đầu từ con số 0, chỉ biết những gì bạn đưa cho nó.</li>
  <li><strong>Chỉ coi subagent là cách chạy nhanh:</strong> lợi ích lớn hơn là giữ cho manager gọn gàng (bài 5 nói kỹ).</li>
</ul>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Manager chia việc, giao việc, tổng hợp; không tự làm việc con.</li>
  <li>Manager quyết định cách chia <strong>lúc đang chạy</strong>; đó là điểm khác với làm song song cố định.</li>
  <li>Giao việc rõ ràng, đủ thông tin, ít quyền, và luôn kiểm tra kết quả.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">end-to-end</em>: từ đầu tới cuối.</li>
  <li><em class="en">balloon</em> (động từ): phình to ra.</li>
  <li><em class="en">anchor</em> (động từ): làm trụ cột, làm nền tảng.</li>
  <li><em class="en">stitch together</em>: ghép lại, khâu lại với nhau.</li>
  <li><em class="en">spin up</em>: khởi tạo, dựng lên (một instance, một agent).</li>
  <li><em class="en">trip people up</em>: làm người ta dễ nhầm, dễ vấp.</li>
  <li><em class="en">fan out</em>: tỏa ra, chia ra nhiều nhánh.</li>
  <li><em class="en">draw a lane</em>: vạch làn đường, xác định phạm vi.</li>
  <li><em class="en">go sideways</em>: trục trặc, đi chệch hướng.</li>
  <li><em class="en">plausible but wrong</em>: nghe có vẻ hợp lý nhưng sai.</li>
  <li><em class="en">wander</em>: đi lang thang, lạc đề.</li>
  <li><em class="en">muddy</em>: lờ mờ, không rõ ràng.</li>
  <li><em class="en">drown in</em>: chết đuối trong, bị ngợp bởi.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/lesson04/Lesson04.java</code>. Có 4 bài: chọn subagent theo description (và theo <code>@tên</code>),
chặn tool ngoài quyền (least privilege), dựng handoff mang đủ ngữ cảnh và định dạng output,
và một manager loop đầy đủ decompose, delegate, validate, synthesize. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="04"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="04 --live"</code> (cần API key): Claude làm manager chia việc lúc chạy, các subagent nhận handoff do code của bạn dựng, và manager tổng hợp thành ghi chú ôn bài.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Một coordinator chia việc ra 3 agent chạy song song. Chi tiết nào quyết định đây là orchestrator-workers chứ không phải parallelization?', options: ['Có từ ba agent trở lên chạy cùng lúc', 'Cách chia việc được quyết định lúc chạy', 'Mỗi agent dùng một model và system prompt khác nhau', 'Coordinator tổng hợp kết quả ở cuối'], answer: 1, explain: '"The difference is who decides the subtasks." Parallelization cũng có thể tổng hợp kết quả ở cuối.' },
    { q: 'Ứng dụng dịch tài liệu luôn chia đúng 3 phần (mở bài, thân bài, kết luận) rồi dịch song song. Thiết kế nào phù hợp hơn?', options: ['Orchestrator-workers, vì có nhiều worker', 'Code song song bình thường, chia sẵn trong code', 'Một manager agent để có thể chia việc linh hoạt hơn', 'Routing theo từng phần của tài liệu'], answer: 1, explain: '"If the split is always the same, you don\'t need a manager deciding it. Plain parallel code is simpler and cheaper."' },
    { q: 'Manager nhận yêu cầu phân tích một bug report bất kỳ: có khi cần đọc log, có khi đọc code, có khi tìm issue cũ. Vì sao đây là chỗ hợp với orchestrator-workers?', options: ['Vì việc này cần nhiều tool khác nhau như log, code, issue', 'Vì việc con chỉ biết được sau khi đọc bug report', 'Vì phân tích bug luôn tốn nhiều token', 'Vì cần chạy song song cho nhanh'], answer: 1, explain: 'Sự linh hoạt lúc chạy "is the whole reason to reach for orchestration".' },
    { q: 'Câu nào SAI về manager?', options: ['Manager sở hữu mục tiêu của cả nhiệm vụ', 'Manager quyết định tách gì và ai nhận gì', 'Manager tự làm các việc con để bảo đảm chất lượng', 'Manager ghép các kết quả thành một câu trả lời mạch lạc cho người dùng'], answer: 2, explain: '"Notice what the manager doesn\'t do. It doesn\'t carry out the subtask itself."' },
    { q: 'Thứ tự đúng trong vòng làm việc của manager là gì?', options: ['Giao việc, chia nhỏ, kiểm tra, tổng hợp', 'Chia nhỏ, giao việc, tổng hợp', 'Tổng hợp, chia nhỏ, giao việc', 'Chia nhỏ, tổng hợp, giao việc'], answer: 1, explain: 'Decompose, delegate, synthesize.' },
    { q: 'Trong Agent SDK, một subagent được tạo ra bằng cách nào?', options: ['Manager gọi tool có sẵn tên là agent, tool này tạo ra subagent', 'Manager gửi request tới một endpoint riêng cho subagent', 'Lập trình viên khởi tạo subagent bằng code trước mỗi lần chạy', 'Subagent tự khởi động khi phát hiện việc phù hợp'], answer: 0, explain: '"The manager calls a built-in tool named agent, and that tool is what spins up a sub-agent."' },
    { q: 'Hai subagent "researcher" và "writer" có mô tả rất giống nhau, và Claude cứ giao nhầm việc. Cách khắc phục hợp lý nhất theo bài là gì?', options: ['Tăng số tool cho cả hai', 'Viết lại mô tả, hoặc gọi đích danh subagent', 'Gộp hai subagent làm một để Claude khỏi phải chọn', 'Chuyển sang parallelization để mỗi việc có chỗ cố định'], answer: 1, explain: 'Claude chọn subagent bằng cách so mô tả với việc cần làm, và "you can also name a sub-agent directly in the prompt".' },
    { q: 'Đã thêm agent tool vào allowed tools, nhưng subagent vẫn bị dừng hỏi quyền khi gọi tool đọc file. Vì sao?', options: ['Vì allowed tools chỉ có tác dụng với manager', 'Vì quyền giao việc và quyền dùng tool là hai lớp riêng', 'Vì subagent không bao giờ được phép đọc file của dự án', 'Vì phải khởi động lại phiên sau khi đổi allowed tools'], answer: 1, explain: '"That approves the delegation itself. The tools a sub-agent runs still go through permission separately."' },
    { q: 'Để tool của subagent không bị dừng hỏi quyền mỗi lần, bài học gợi ý cách nào?', options: ['Permission rules hoặc PreToolUse hook', 'Thêm tool đó vào mô tả của subagent', 'Cho manager tự chạy tool đó thay subagent', 'Tắt kiểm tra quyền của cả phiên'], answer: 0, explain: '"Pre-approve those with permission rules or a pre-tool use hook."' },
    { q: 'Lợi ích nào được bài học gọi là "sâu nhất" trong ba lợi ích của subagent?', options: ['Chạy song song', 'Giới hạn tool', 'Cô lập ngữ cảnh', 'Giảm giá mỗi token'], answer: 2, explain: '"Isolation is the deep one, and it gets a full lesson of its own next."' },
    { q: 'Điều gì vạch ra "làn đường" của một subagent?', options: ['Mô tả mà manager dùng để chọn nó', 'Danh sách tool được gắn cho nó', 'Định dạng output nó được yêu cầu', 'Thứ tự nó được gọi trong lần chạy'], answer: 1, explain: '"The tool list you attach is what draws that sub-agent\'s lane."' },
    { q: 'Subagent nhận việc "tìm hiểu về hệ thống thanh toán". Kết quả trả về lan man, không dùng được. Nguyên nhân gốc theo bài là gì?', options: ['Subagent dùng model quá yếu', 'Việc giao có ranh giới mờ', 'Manager kiểm tra quá kỹ', 'Thiếu chạy song song'], answer: 1, explain: '"A sub-task with a fuzzy boundary hands you back a fuzzy result you can\'t trust."' },
    { q: 'Manager cần ghép kết quả của 5 subagent thành một bảng so sánh. Bước nào trong lúc giao việc giúp việc ghép dễ và đáng tin nhất?', options: ['Cho mỗi subagent tự chọn cách trình bày', 'Nói rõ định dạng output mong muốn khi giao việc', 'Giao cả 5 việc cho cùng một subagent', 'Yêu cầu subagent trả về toàn bộ quá trình làm việc'], answer: 1, explain: '"The sub-agent can only match a shape you\'ve named."' },
    { q: 'Subagent trả về một kết quả nghe rất hợp lý. Manager nên làm gì trước khi đưa vào câu trả lời cuối?', options: ['Tin kết quả vì subagent đã được giao đúng phạm vi', 'Kiểm tra kết quả trước khi tổng hợp', 'Giao lại cùng việc cho subagent khác để so sánh', 'Chuyển thẳng cho người dùng tự kiểm tra'], answer: 1, explain: 'Hàng rào thứ ba: "a sub-agent can return something plausible, but wrong".' },
    { q: 'Subagent "tóm tắt tài liệu" được cấp quyền gửi email "phòng khi cần". Nguyên tắc nào đang bị vi phạm trực tiếp nhất?', options: ['Kiểm tra kết quả', 'Quyền tối thiểu', 'Định dạng output', 'Tổng hợp kết quả'], answer: 1, explain: '"Give each sub-agent only the tools and permissions its task actually requires."' },
    { q: 'Subagent tóm tắt bắt đầu xóa file trong lúc làm. Theo bài học, điều này cho thấy gì?', options: ['Model đang bị lỗi và cần đổi model', 'Phạm vi đã được đặt sai', 'Subagent đang chủ động tối ưu', 'Manager quên kiểm tra kết quả'], answer: 1, explain: '"If a summarizer starts deleting files, the scope was wrong." Đây là ranh giới tác dụng phụ.' },
    { q: 'Ba hàng rào an toàn khi giao việc thuộc trách nhiệm của ai?', options: ['Của từng subagent', 'Của manager, người giữ quyền và lần kiểm tra cuối', 'Của người dùng cuối', 'Của agent tool trong SDK'], answer: 1, explain: '"Notice these are the manager\'s job. The sub-agent stays narrow on purpose."' },
    { q: 'Subagent được giao "phân tích code, sửa bug, viết test, cập nhật tài liệu, deploy". Lỗi thiết kế nào đang xảy ra?', options: ['Thiếu ngữ cảnh', 'Phạm vi quá rộng', 'Coi subagent chỉ là worker song song', 'Thiếu kiểm tra kết quả'], answer: 1, explain: '"You hand a sub-agent a job that\'s really five jobs, and it wanders, burns tokens, and comes back with something muddy."' },
    { q: 'Subagent thất bại ở một việc rất đơn giản vì không biết tên nhánh git mà manager đã biết từ trước. Lỗi thiết kế nào?', options: ['Phạm vi quá rộng', 'Thiếu ngữ cảnh', 'Thiếu quyền tối thiểu', 'Thiếu chạy song song'], answer: 1, explain: '"Because a sub-agent starts fresh, it only knows what you hand it."' },
    { q: 'Một nhóm chỉ dùng subagent khi cần chạy song song, còn việc tuần tự thì để agent chính tự làm hết. Bài học sẽ nhận xét gì?', options: ['Đúng, vì subagent chỉ có ích khi chạy song song', 'Đang bỏ lỡ lợi ích sâu hơn là cô lập ngữ cảnh', 'Đúng, vì dùng subagent tuần tự tốn thêm token', 'Sai, vì phải luôn dùng subagent cho mọi việc'], answer: 1, explain: '"Speed is a nice bonus, but the deeper win is context isolation."' },
    { q: 'Câu nào đúng về cách Claude chọn subagent?', options: ['Chọn subagent được khai báo đầu tiên trong danh sách', 'So mô tả của từng subagent với việc đang cần làm', 'Chọn ngẫu nhiên rồi kiểm tra kết quả', 'Luôn hỏi người dùng nên chọn subagent nào cho việc này'], answer: 1, explain: '"Claude matches that description against the work in front of it and picks the sub-agent that fits."' },
    { q: 'Câu nào SAI về giao việc trong Agent SDK?', options: ['Model tự quyết định khi nào tạo subagent là đáng', 'Có thể gọi tên subagent trực tiếp trong prompt', 'Duyệt agent tool là duyệt luôn mọi tool subagent dùng', 'Mỗi subagent có một mô tả về việc nó giỏi'], answer: 2, explain: 'Allowed tools chỉ duyệt hành động giao việc; tool của subagent vẫn đi qua kiểm tra quyền riêng.' },
    { q: 'Vì gói bàn giao (handoff) là kênh duy nhất tới subagent, nó cần thỏa điều gì?', options: ['Ngắn nhất có thể để tiết kiệm token', 'Mang đủ mọi thứ mà việc con cần, vì subagent không thấy gì khác', 'Chứa toàn bộ lịch sử của manager cho chắc', 'Chỉ cần tên việc, subagent tự suy ra phần còn lại'], answer: 1, explain: '"The handoff has to carry everything the sub-task needs."' },
    { q: 'Manager nên làm gì khi một subagent hỏng hoặc trôi lệch?', options: ['Bỏ qua kết quả đó và tổng hợp phần còn lại mà không báo', 'Bắt lỗi ở bước kiểm tra kết quả', 'Để người dùng cuối tự phát hiện và báo lại', 'Tắt subagent đó vĩnh viễn cho các lần sau'], answer: 1, explain: '"The manager is the one place you catch that before it reaches the user."' },
    { q: 'Tình huống nào hợp với parallelization hơn orchestrator-workers?', options: ['Trả lời câu hỏi nghiên cứu mở, không biết cần tra những gì', 'Chạy cùng 3 bộ kiểm tra cố định trên mọi pull request', 'Sửa bug chưa rõ nằm ở module nào', 'Lập kế hoạch du lịch theo yêu cầu bất kỳ của khách'], answer: 1, explain: 'Ba bộ kiểm tra cố định là cách chia biết trước, nên code song song đơn giản và rẻ hơn.' },
    { q: 'Vì sao pattern manager và subagent giúp ích khi một agent phải làm một việc lớn, lộn xộn?', options: ['Vì subagent luôn dùng model rẻ hơn', 'Vì một agent không còn phải ôm cả việc lớn', 'Vì nó loại bỏ nhu cầu dùng tool', 'Vì nó giúp hệ thống chạy được mà không cần viết prompt'], answer: 1, explain: '"It keeps one agent from drowning in a job too big for it."' },
    { q: 'Câu nào đúng về subagent?', options: ['Subagent là một hàm trong code của manager', 'Subagent là agent riêng, trả về một kết quả', 'Subagent chia sẻ cửa sổ context với manager', 'Subagent mặc định nhận toàn bộ tool mà manager đang có'], answer: 1, explain: '"A subagent is a separate agent instance the manager spawns to handle one focused subtask, and it reports a single result back."' },
    { q: 'Nhóm muốn subagent chỉ đọc được thư mục docs và không ghi được gì. Cách làm đúng tinh thần bài học là gì?', options: ['Viết vào prompt "không được ghi file"', 'Chỉ gắn tool đọc file cho subagent đó', 'Cho đủ tool rồi kiểm tra kết quả sau', 'Yêu cầu manager theo dõi từng bước'], answer: 1, explain: 'Bộ tool vạch làn của subagent; quyền tối thiểu khiến nó "simply can\'t reach outside its lane".' },
    { q: 'Manager tổng hợp kết quả của 4 subagent. Một kết quả rỗng vì subagent gặp lỗi. Hành vi nào phù hợp nhất?', options: ['Coi kết quả rỗng là "không có gì cần báo" rồi tổng hợp tiếp', 'Phát hiện ở bước kiểm tra và xử lý trước khi tổng hợp', 'Bịa nội dung thay cho phần thiếu', 'Gửi kết quả rỗng thẳng cho người dùng'], answer: 1, explain: 'Thu hết kết quả và kiểm tra trước khi tổng hợp.' },
    { q: 'Câu nào là điều cần nhớ để phân biệt orchestrator-workers với code song song cố định?', options: ['Orchestrator-workers dùng nhiều model hơn', 'Cách chia việc được quyết định lúc chạy', 'Orchestrator-workers luôn chạy nhanh hơn code song song', 'Orchestrator-workers không cần tổng hợp kết quả'], answer: 1, explain: '"Orchestrator workers decide the split at runtime, which is what sets them apart from fixed parallel code."' },
  ],
};
