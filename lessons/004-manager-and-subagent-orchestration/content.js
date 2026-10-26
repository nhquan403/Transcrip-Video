window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Ý chính của cả bài:</strong> Khi một agent phải ôm cả một việc lớn và lộn xộn từ đầu tới cuối,
context của nó phình ra và câu trả lời kém đi. Giải pháp là một <strong>manager</strong> chia việc thành các phần nhỏ có phạm vi rõ,
giao cho các <strong>subagent</strong>, rồi tổng hợp kết quả. Điểm khác với parallelization:
manager <strong>quyết định cách chia việc lúc chạy</strong>, dựa trên input cụ thể.</p>

<h3>1. Ba vai trò</h3>
<ul>
  <li><strong>Manager (orchestrator):</strong> sở hữu mục tiêu, chia nhỏ, giao từng phần, rồi ghép các câu trả lời lại.</li>
  <li><strong>Subagent:</strong> một agent riêng biệt do manager tạo ra để làm một việc con tập trung, rồi trả về một kết quả duy nhất.</li>
  <li><strong>Delegation (giao việc):</strong> hành động bàn giao việc con đó. Trong Agent SDK, việc này đi qua <strong>agent tool</strong>.
  Model tự quyết định khi nào đáng tạo subagent, dựa trên cách bạn mô tả từng subagent.</li>
</ul>

<h3>2. Manager làm gì?</h3>
<p>Manager chạy cùng một vòng ba bước cho mọi việc:</p>
<ul>
  <li><strong>Decompose:</strong> chia một yêu cầu lớn thành các việc con độc lập, mỗi việc tự xử lý được.</li>
  <li><strong>Delegate:</strong> giao mỗi việc con cho subagent phù hợp.</li>
  <li><strong>Synthesize:</strong> gom các kết quả trả về thành một câu trả lời mạch lạc cho người dùng.</li>
</ul>
<p>Điều quan trọng: <strong>manager không tự làm việc con</strong>. Việc của nó là điều phối: quyết định tách gì, ai nhận gì,
và ghép các mảnh lại ra sao. Sự phân công đó chính là cốt lõi của pattern.</p>
<p>Ví dụ đời thường: trưởng nhóm nhận yêu cầu "làm báo cáo thị trường". Họ chia ra: một người tìm số liệu, một người đọc báo cáo đối thủ,
một người vẽ biểu đồ. Trưởng nhóm không tự đi tìm số liệu, họ kiểm tra từng phần rồi ghép thành báo cáo cuối.</p>

<h3>3. Orchestrator-workers khác parallelization ở đâu?</h3>
<p>Trên sơ đồ, hai cái trông gần như giống hệt: một điều phối viên chia việc ra nhiều agent.
Khác biệt nằm ở <strong>ai quyết định các việc con</strong>:</p>
<ul>
  <li><strong>Parallelization:</strong> bạn định nghĩa các việc con trong code từ trước. Bạn đã biết các phần độc lập, chỉ việc chia và chạy cùng lúc.</li>
  <li><strong>Orchestrator-workers:</strong> các việc con không có sẵn. Manager nhìn input cụ thể rồi quyết định lúc chạy cách chia việc.</li>
</ul>
<p>Sự linh hoạt lúc chạy đó là lý do duy nhất để dùng orchestration. Nếu cách chia lúc nào cũng giống nhau,
bạn không cần manager. Code song song bình thường đơn giản và rẻ hơn (đúng tinh thần bài 1 và bài 2).</p>

<h3>4. Delegation trong Agent SDK hoạt động thế nào?</h3>
<ul>
  <li>Manager gọi một tool có sẵn tên là <strong>agent</strong>, tool này tạo ra subagent.</li>
  <li>Mỗi subagent bạn định nghĩa có một <strong>description</strong>: một câu ngắn nói nó giỏi việc gì.
  Khi gặp việc con, Claude so description với việc đó và chọn subagent khớp nhất.</li>
  <li>Bạn không bắt buộc phải để model chọn: có thể <strong>gọi tên subagent trực tiếp trong prompt</strong> khi muốn dùng đúng một subagent.</li>
  <li>Mẹo thực tế: thêm agent tool vào danh sách <strong>allowed tools</strong> để việc giao việc được tự động duyệt,
  không bị dừng lại hỏi quyền mỗi lần.</li>
  <li>Lưu ý: điều đó chỉ duyệt <em>hành động giao việc</em>. Các tool mà subagent dùng vẫn đi qua kiểm tra quyền riêng,
  nên cần duyệt trước bằng permission rules hoặc một <strong>PreToolUse hook</strong>.</li>
</ul>

<h3>5. Vì sao phải tách subagent?</h3>
<p>Ba lợi ích:</p>
<ul>
  <li><strong>Context isolation (cô lập ngữ cảnh):</strong> mọi thứ subagent làm bên trong không lọt vào cửa sổ context của manager.
  Đây là lợi ích sâu nhất, bài sau sẽ nói riêng.</li>
  <li><strong>Parallelization:</strong> các subagent có thể chạy cùng lúc.</li>
  <li><strong>Tool restriction (giới hạn tool):</strong> mỗi subagent chỉ có đúng bộ tool nó cần.</li>
</ul>
<p>Vì subagent chạy tách khỏi manager, <strong>handoff (gói bàn giao) phải mang đủ mọi thứ việc con cần</strong>,
và danh sách tool bạn gắn cho nó chính là "làn đường" của nó. Làm tốt hai thứ này thì cả ba lợi ích đều tự đến.</p>

<h3>6. Giao việc cho tốt</h3>
<ul>
  <li><strong>Phạm vi rõ:</strong> mỗi subagent một việc rõ ràng, không phải "một vùng mơ hồ" của bài toán. Việc có ranh giới mờ thì trả về kết quả mờ.</li>
  <li><strong>Nói rõ định dạng output:</strong> tóm tắt ngắn, danh sách, hay dữ liệu có cấu trúc. Subagent chỉ khớp được hình dạng mà bạn đã gọi tên.</li>
  <li><strong>Kiểm tra trước khi tổng hợp:</strong> manager thu mọi kết quả và validate trước khi ghép. Subagent có thể hỏng hoặc trôi lệch,
  và manager là nơi duy nhất bắt được trước khi tới tay người dùng.</li>
</ul>

<h3>7. Ba hàng rào an toàn (guardrails)</h3>
<ul>
  <li><strong>Least privilege (quyền tối thiểu):</strong> mỗi subagent chỉ có tool và quyền nó thật sự cần, nên không thể vươn ra ngoài làn của mình kể cả khi có gì đó trục trặc.</li>
  <li><strong>Side effect boundary (ranh giới tác dụng phụ):</strong> subagent không được ghi hay hành động gì ngoài việc được giao.
  Nếu một subagent tóm tắt bắt đầu xóa file, phạm vi đã bị đặt sai.</li>
  <li><strong>Result validation (kiểm tra kết quả):</strong> manager kiểm tra từng kết quả trước khi đưa vào câu trả lời cuối,
  vì subagent có thể trả về thứ nghe hợp lý nhưng sai.</li>
</ul>
<p>Cả ba đều là việc của manager. Subagent cố ý được giữ hẹp, còn manager giữ quyền và lần kiểm tra cuối cùng.</p>

<h3>8. Ba lỗi hay gặp (anti-patterns)</h3>
<ul>
  <li><strong>Phạm vi quá rộng:</strong> giao cho subagent một việc thực ra là năm việc. Nó đi lang thang, đốt token và trả về thứ lờ mờ.</li>
  <li><strong>Thiếu ngữ cảnh:</strong> subagent bắt đầu từ con số 0, chỉ biết những gì bạn đưa cho nó. Đưa quá ít thì nó thất bại cả ở việc lẽ ra làm dễ dàng.</li>
  <li><strong>Coi subagent chỉ là worker chạy song song:</strong> tốc độ chỉ là phần thưởng thêm. Lợi ích sâu hơn là cô lập ngữ cảnh,
  giữ cửa sổ của manager sạch sẽ. Bỏ qua điều đó thì một pattern mạnh thành ra kém tin cậy.</li>
</ul>

<h3>9. Tóm tắt</h3>
<ul>
  <li>Manager chia mục tiêu thành các việc con có phạm vi rõ, giao cho subagent, rồi tổng hợp kết quả.</li>
  <li>Pattern này giúp một agent không bị "chết đuối" trong một việc quá lớn.</li>
  <li>Orchestrator-workers quyết định cách chia việc lúc chạy, đó là điều phân biệt nó với code song song cố định.</li>
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
