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
    { q: 'Vấn đề gì xảy ra khi một agent phải xử lý một việc lớn, lộn xộn từ đầu tới cuối?', options: ['Context phình ra và câu trả lời kém đi', 'Agent chạy nhanh hơn', 'Agent tự tạo subagent', 'Không có vấn đề gì'], answer: 0, explain: 'Một agent ôm hết việc thì context phình to và chất lượng giảm.' },
    { q: 'Ba vai trò làm nền cho pattern này là gì?', options: ['Client, server, database', 'Manager, subagent, delegation', 'Prompt, tool, memory', 'Router, chain, parallel'], answer: 1, explain: 'Manager điều phối, subagent làm việc con, delegation là hành động giao việc.' },
    { q: 'Manager (orchestrator) chịu trách nhiệm gì?', options: ['Tự làm tất cả các việc con', 'Chỉ trả lời người dùng', 'Sở hữu mục tiêu, chia nhỏ, giao việc và ghép kết quả', 'Chạy test cho subagent'], answer: 2, explain: 'Manager nắm mục tiêu và ghép các câu trả lời lại.' },
    { q: 'Subagent là gì?', options: ['Một hàm trong code của manager', 'Một tool có sẵn của SDK', 'Một bản sao context của manager', 'Một agent riêng biệt do manager tạo ra để làm một việc con tập trung và trả về một kết quả'], answer: 3, explain: 'Subagent làm một việc con và báo về một kết quả duy nhất.' },
    { q: 'Trong Agent SDK, delegation diễn ra qua đâu?', options: ['Agent tool', 'Một REST API riêng', 'File cấu hình YAML', 'Hệ thống queue'], answer: 0, explain: 'Việc giao đi qua tool có sẵn tên là agent.' },
    { q: 'Vòng làm việc của manager gồm ba bước nào, theo thứ tự?', options: ['Giao việc, chia nhỏ, tổng hợp', 'Chia nhỏ, giao việc, tổng hợp', 'Tổng hợp, chia nhỏ, giao việc', 'Kiểm tra, thử lại, báo cáo'], answer: 1, explain: 'Chia nhỏ mục tiêu, giao việc, rồi tổng hợp.' },
    { q: 'Điều gì manager KHÔNG làm?', options: ['Chia nhỏ mục tiêu', 'Ghép các kết quả', 'Tự thực hiện việc con', 'Quyết định ai nhận việc gì'], answer: 2, explain: 'Việc của manager là điều phối, không tự làm việc con.' },
    { q: 'Khác biệt cốt lõi giữa orchestrator-workers và parallelization là gì?', options: ['Orchestrator-workers luôn nhanh hơn', 'Parallelization không dùng model', 'Orchestrator-workers chỉ có một worker', 'Ai quyết định các việc con: code định sẵn, hay manager quyết định lúc chạy'], answer: 3, explain: 'Trên sơ đồ chúng trông giống nhau; khác ở chỗ ai quyết định cách chia.' },
    { q: 'Với parallelization, các việc con được định nghĩa ở đâu?', options: ['Trong code của bạn, từ trước', 'Do manager quyết định lúc chạy', 'Do người dùng nhập', 'Do subagent tự chọn'], answer: 0, explain: 'Bạn đã biết các phần độc lập nên chia sẵn rồi chạy cùng lúc.' },
    { q: 'Nếu cách chia việc lúc nào cũng giống nhau, bài học khuyên gì?', options: ['Vẫn nên dùng manager cho linh hoạt', 'Dùng code song song bình thường, đơn giản và rẻ hơn', 'Dùng nhiều manager hơn', 'Bỏ hẳn model'], answer: 1, explain: 'Không cần manager quyết định một cách chia không bao giờ đổi.' },
    { q: 'Claude dựa vào đâu để chọn subagent cho một việc con?', options: ['Tên file của subagent', 'Thứ tự khai báo', 'So mô tả (description) của subagent với việc trước mặt', 'Chọn ngẫu nhiên'], answer: 2, explain: 'Mỗi subagent có một câu mô tả nó giỏi việc gì.' },
    { q: 'Khi muốn dùng đúng một subagent cụ thể, bạn có thể làm gì?', options: ['Xóa các subagent khác', 'Đổi mô tả cho giống nhau', 'Không thể, model luôn tự chọn', 'Gọi tên subagent trực tiếp trong prompt'], answer: 3, explain: 'Bạn không bắt buộc phải để model chọn.' },
    { q: 'Vì sao nên thêm agent tool vào danh sách allowed tools?', options: ['Để việc giao việc được tự động duyệt, không dừng lại hỏi quyền mỗi lần', 'Để subagent dùng được mọi tool', 'Để giảm chi phí token', 'Để tắt kiểm tra quyền hoàn toàn'], answer: 0, explain: 'Như vậy mỗi lần giao việc không bị dừng chờ duyệt.' },
    { q: 'Thêm agent tool vào allowed tools thì các tool mà subagent dùng có được tự động duyệt không?', options: ['Có, tất cả đều được duyệt', 'Không, chúng vẫn qua kiểm tra quyền riêng; cần permission rules hoặc PreToolUse hook', 'Có, nếu subagent có mô tả', 'Không, subagent không được dùng tool'], answer: 1, explain: 'Chỉ hành động giao việc được duyệt; tool của subagent vẫn qua kiểm tra riêng.' },
    { q: 'Ba lợi ích của việc tách việc ra subagent là gì?', options: ['Rẻ hơn, nhanh hơn, đẹp hơn', 'Retrieval, tools, memory', 'Cô lập ngữ cảnh, chạy song song, giới hạn tool', 'Logging, monitoring, alerting'], answer: 2, explain: 'Ba lợi ích này cùng đến từ một kỷ luật giao việc tốt.' },
    { q: '"Cô lập ngữ cảnh" có nghĩa là gì?', options: ['Subagent không được đọc file', 'Manager và subagent dùng chung context', 'Mỗi subagent chạy trên một máy riêng', 'Những gì subagent làm bên trong không lọt vào cửa sổ context của manager'], answer: 3, explain: 'Bài sau sẽ nói riêng về lợi ích sâu nhất này.' },
    { q: 'Vì subagent chạy tách khỏi manager, gói bàn giao (handoff) phải đáp ứng điều gì?', options: ['Mang đủ mọi thứ việc con cần', 'Càng ngắn càng tốt, chỉ một câu', 'Chứa toàn bộ lịch sử của manager', 'Không cần gì, subagent tự tìm'], answer: 0, explain: 'Subagent không thấy gì từ manager nên handoff phải đầy đủ.' },
    { q: 'Điều gì vạch ra "làn đường" của một subagent?', options: ['Mô tả của nó', 'Danh sách tool gắn cho nó', 'Tên của nó', 'Model mà nó dùng'], answer: 1, explain: 'Bộ tool quyết định subagent có thể làm gì.' },
    { q: 'Giao cho subagent một vùng mơ hồ của bài toán dẫn tới điều gì?', options: ['Subagent sáng tạo hơn', 'Kết quả tốt hơn', 'Kết quả mơ hồ mà bạn không tin được', 'Tiết kiệm token'], answer: 2, explain: 'Việc có ranh giới mờ thì trả về kết quả mờ.' },
    { q: 'Vì sao phải nói rõ định dạng output mong muốn?', options: ['Để giảm độ trễ', 'Để manager khỏi phải kiểm tra', 'Để subagent chạy song song', 'Vì subagent chỉ khớp được hình dạng mà bạn đã gọi tên'], answer: 3, explain: 'Tóm tắt, danh sách hay dữ liệu có cấu trúc: phải nói rõ.' },
    { q: 'Manager nên làm gì với các kết quả trả về trước khi tổng hợp?', options: ['Thu hết và kiểm tra từng kết quả', 'Chấp nhận ngay', 'Gửi thẳng cho người dùng', 'Bỏ kết quả của subagent chậm nhất'], answer: 0, explain: 'Subagent có thể hỏng hoặc trôi lệch; manager là nơi bắt được.' },
    { q: 'Nguyên tắc "quyền tối thiểu" nghĩa là gì?', options: ['Subagent có quyền cao nhất để làm nhanh', 'Mỗi subagent chỉ có đúng tool và quyền mà việc của nó cần', 'Manager không có quyền gì', 'Chỉ admin mới tạo được subagent'], answer: 1, explain: 'Như vậy nó không thể vươn ra ngoài làn của mình.' },
    { q: 'Một subagent tóm tắt văn bản bắt đầu xóa file. Theo bài học, điều đó nói lên gì?', options: ['Subagent rất chủ động, tốt', 'Model bị lỗi, cần đổi model', 'Phạm vi đã bị đặt sai, vi phạm ranh giới tác dụng phụ', 'Cần thêm tool cho nó'], answer: 2, explain: 'Subagent có phạm vi tốt không ghi hay hành động gì ngoài việc được giao.' },
    { q: 'Vì sao manager phải kiểm tra từng kết quả dù subagent đã chạy xong?', options: ['Để tính tiền', 'Vì subagent luôn sai', 'Để làm chậm hệ thống', 'Vì subagent có thể trả về thứ nghe hợp lý nhưng sai'], answer: 3, explain: 'Kiểm tra kết quả là hàng rào thứ ba.' },
    { q: 'Ai giữ quyền và lần kiểm tra cuối cùng trong pattern này?', options: ['Manager', 'Subagent', 'Người dùng', 'Agent tool'], answer: 0, explain: 'Subagent cố ý được giữ hẹp; manager giữ quyền và lần kiểm tra cuối.' },
    { q: 'Lỗi "phạm vi quá rộng" dẫn tới hậu quả gì?', options: ['Subagent làm xong nhanh hơn', 'Subagent đi lang thang, đốt token và trả về thứ lờ mờ', 'Manager bị quá tải tool', 'Không có hậu quả'], answer: 1, explain: 'Giao một việc thực ra là năm việc thì subagent lạc đề.' },
    { q: 'Vì sao "thiếu ngữ cảnh" làm subagent thất bại?', options: ['Vì subagent dùng model yếu hơn', 'Vì subagent bị giới hạn tool', 'Vì subagent bắt đầu từ con số 0 và chỉ biết những gì bạn đưa cho nó', 'Vì manager xóa context'], answer: 2, explain: 'Đưa quá ít thì nó thất bại cả ở việc lẽ ra làm dễ dàng.' },
    { q: 'Coi subagent "chỉ là worker chạy song song" là sai vì sao?', options: ['Vì subagent không chạy song song được', 'Vì chạy song song rất đắt', 'Vì worker không gọi được tool', 'Vì bỏ qua lợi ích sâu hơn là cô lập ngữ cảnh, giữ cửa sổ của manager sạch'], answer: 3, explain: 'Tốc độ chỉ là phần thưởng thêm.' },
    { q: 'Tình huống: phân tích một bug report bất kỳ. Tùy nội dung, có khi cần đọc log, có khi cần đọc code, có khi cần tìm issue cũ. Thiết kế nào phù hợp?', options: ['Orchestrator-workers, vì cách chia việc phụ thuộc input và chỉ biết lúc chạy', 'Parallelization cố định 3 nhánh', 'Một lần gọi model duy nhất', 'Routing workflow'], answer: 0, explain: 'Việc con không định sẵn được, đúng trường hợp manager chia việc lúc chạy.' },
    { q: 'Pattern manager và subagent giúp ích chính ở điểm nào?', options: ['Làm model rẻ hơn', 'Giúp một agent không bị ngợp trong một việc quá lớn', 'Loại bỏ nhu cầu dùng tool', 'Thay thế hoàn toàn workflow'], answer: 1, explain: 'Manager chia việc thành các phần có phạm vi rõ, giao đi và tổng hợp lại.' },
  ],
};
