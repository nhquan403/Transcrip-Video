window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Trước khi bàn tính năng, hãy hỏi: thiết kế này có đạt được <strong>độ trễ</strong>, <strong>thông lượng</strong>,
<strong>vùng đặt dữ liệu</strong> và <strong>chi phí</strong> mục tiêu không? Đó là yêu cầu hạ tầng, và chúng quyết định kiến trúc.
Biến từng cái thành <strong>một con số</strong>, rồi để con số đó chọn thiết kế giúp bạn.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Infrastructure requirement (yêu cầu hạ tầng):</strong> những gì kiến trúc phải cung cấp để hành vi chạy được: tốc độ, sức chứa, nơi chạy, ngân sách.</li>
  <li><strong>Latency budget (ngân sách độ trễ):</strong> số mili giây tối đa người dùng chịu chờ.</li>
  <li><strong>Throughput (thông lượng):</strong> số request mỗi phút hệ thống phải chịu được lúc cao điểm.</li>
  <li><strong>Data residency:</strong> quy định dữ liệu chỉ được nằm trong một vùng địa lý nhất định.</li>
  <li><strong>Rate limit:</strong> trần số request và số token API cho phép trong một khoảng thời gian.</li>
  <li><strong>Backpressure:</strong> khi việc đến nhiều hơn sức xử lý, xếp hàng phần dư thay vì bắn hết vào model.</li>
</ul>

<h3>Hai loại yêu cầu, đừng trộn</h3>
<ul>
  <li><strong>Functional:</strong> app phải <strong>làm gì</strong>. "Tóm tắt tài liệu này", "trả lời theo định dạng này".</li>
  <li><strong>Infrastructure:</strong> kiến trúc phải <strong>cung cấp gì</strong> để hành vi đó chạy: compute, độ trễ, thông lượng, nơi host.</li>
</ul>
<p>Cái bẫy kinh điển: "trả lời trong dưới 2 giây" <strong>không phải tính năng</strong>. Đó là ngân sách độ trễ, và nó định hình kiến trúc nhiều hơn mọi câu chữ trong prompt.</p>

<h3>Bốn nhóm yêu cầu hạ tầng</h3>
<ol>
  <li><strong>Độ trễ:</strong> người gọi chờ bao lâu thì coi như thiết kế đã thất bại?</li>
  <li><strong>Thông lượng:</strong> bao nhiêu request mỗi phút lúc cao điểm?</li>
  <li><strong>Vùng và residency:</strong> lời gọi chạy ở đâu, dữ liệu được phép nằm ở đâu?</li>
  <li><strong>Chi phí:</strong> hóa đơn phải nằm dưới trần nào?</li>
</ol>
<p>Việc chọn <strong>model tier</strong> chạm vào hai nhóm: model nặng hơn cho chất lượng tốt hơn nhưng chậm hơn và đắt hơn.
<strong>Availability</strong> (cam kết uptime) quay lại ở bài sau như một yêu cầu về độ tin cậy.
Con số mơ hồ thì kiến trúc phải đoán; con số rõ ràng thì thiết kế gần như tự hiện ra.</p>

<h3>Ngân sách độ trễ: làm ngược từ con số</h3>
<div class="box">⏱️ <strong>Hình dung thế này:</strong> Bạn có 2,5 giây trước khi người dùng mất kiên nhẫn. Mạng, xác thực và phần xử lý của bạn đã ăn mất 0,5 giây.
Còn lại <strong>2 giây</strong> cho lời gọi Claude. Nếu mỗi lời gọi mất 0,7 giây, bạn chỉ gọi tuần tự được 2 lần. Một agent 5 bước tuần tự đã bị loại ngay từ phép tính.</div>
<p>Cách làm: quyết định thời gian chờ tệ nhất người dùng chịu được, <strong>trừ đi overhead</strong> của bạn, phần còn lại là ngân sách cho lời gọi Claude.
Để con số đó cho bạn biết được phép bao nhiêu lời gọi và bao nhiêu context, thay vì phát hiện ra trên production.</p>

<h3>Ba cách trả kết quả</h3>
<ul>
  <li><strong>Synchronous:</strong> một request, một response, người gọi chờ trọn câu trả lời. Dễ làm nhất, nhưng người dùng cảm nhận từng mili giây.</li>
  <li><strong>Streaming:</strong> token gửi dần qua một kết nối, chữ xuất hiện gần như ngay lập tức. Thường là cách đạt <strong>độ trễ cảm nhận</strong> mà model không cần nhanh hơn.</li>
  <li><strong>Batch:</strong> gửi nhiều request một lúc, lấy kết quả sau. Đổi tốc độ lấy giá rẻ cho việc không ai đang ngồi chờ.</li>
</ul>
<p>Ngân sách chọn cách: trả lời chat thì streaming, báo cáo chạy đêm thì batch.</p>

<h3>Thông lượng: va vào giới hạn thật</h3>
<p>API có <strong>rate limit</strong> về số request và số token trong một khung thời gian. Vượt thì nhận phản hồi rate limit: tín hiệu chậm lại và thử lại sau.
Mẫu sâu hơn là <strong>backpressure</strong>: khi nhu cầu vượt sức chứa, <strong>xếp hàng</strong> phần dư thay vì bắn hết vào model rồi bị bóp.
Định cỡ số request chạy song song theo rate limit, và luôn tính cho <strong>phút cao điểm</strong>, vì phút trung bình không bao giờ làm sập hệ thống.</p>

<h3>Vùng và residency</h3>
<ul>
  <li><strong>API first-party</strong> (endpoint của chính nhà cung cấp): tích hợp đơn giản nhất, nhưng bạn nhận các vùng mà endpoint đó phục vụ.</li>
  <li><strong>Chạy Claude trong một cloud platform lớn</strong> bạn đang dùng: có thể ghim traffic vào một vùng cụ thể, thường chính là điều quy định residency đòi hỏi.</li>
</ul>
<p>Không cách nào tốt hơn về lý thuyết. Nhưng nếu residency là yêu cầu cứng, nó có thể thắng sự tiện lợi.</p>

<h3>Chi phí cũng là một ngân sách</h3>
<p>Chi phí token tăng theo <strong>kích thước context</strong> và <strong>số lượt</strong>. Một vòng lặp gửi lại lịch sử ngày càng dài sẽ đắt rất nhanh,
nên trần chi phí chặt có thể <strong>cấm hẳn</strong> một thiết kế, giống như ngân sách độ trễ chặt.
Khi lưu lượng đủ lớn, cache prefix ổn định không còn là "tối ưu thêm" mà thành <strong>yêu cầu</strong>; việc không ai chờ chạy batch cũng vậy.</p>

<h3>Ba cần gạt để vừa ngân sách</h3>
<ul>
  <li><strong>Prompt caching:</strong> phần đầu prompt giống nhau giữa các lần gọi thì cache lại. Đọc từ cache chỉ tốn một phần nhỏ giá input; <strong>ghi</strong> cache tốn thêm,
  nên chỉ có lời khi prefix <strong>được dùng lại</strong>. Dùng lại nhiều thì giảm cả chi phí lẫn thời gian ra token đầu tiên.</li>
  <li><strong>Message Batches:</strong> việc trì hoãn được chạy bất đồng bộ với <strong>nửa giá</strong>, kết quả có trong vòng một ngày.
  Kết quả về <strong>không theo thứ tự</strong>, nên ghép bằng <strong>id</strong>, không bằng vị trí.</li>
  <li><strong>Right-sizing:</strong> chọn model tier vừa với việc, đừng trả tiền cho khả năng suy luận mà việc nhẹ không cần.</li>
</ul>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Yêu cầu hạ tầng là ràng buộc kiến trúc phải thỏa, không phải tính năng.</li>
  <li>Đặt một con số độ trễ thật, rồi để nó chọn sync, streaming hay batch; tính thông lượng theo rate limit và backpressure.</li>
  <li>Khi trần chi phí chặt, caching và batching là yêu cầu, không phải trang trí.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">shape a cloud application before features</em>: định hình ứng dụng trước cả tính năng.</li>
  <li><em class="en">mixing them is a classic mistake</em>: trộn chúng là lỗi kinh điển.</li>
  <li><em class="en">the design almost falls out of them</em>: thiết kế gần như tự hiện ra từ chúng.</li>
  <li><em class="en">a specific number, not a wish</em>: một con số cụ thể, không phải một mong ước.</li>
  <li><em class="en">quietly rules designs in or out</em>: âm thầm giữ lại hoặc loại bỏ các thiết kế.</li>
  <li><em class="en">off the table</em>: bị loại khỏi lựa chọn.</li>
  <li><em class="en">work backward from the number</em>: làm ngược từ con số.</li>
  <li><em class="en">the user feels every millisecond</em>: người dùng cảm nhận từng mili giây.</li>
  <li><em class="en">collides with real limits</em>: va vào giới hạn thật.</li>
  <li><em class="en">the average minute never breaks anything</em>: phút trung bình không bao giờ làm hỏng gì.</li>
  <li><em class="en">the budget that binds hardest</em>: ngân sách ràng buộc chặt nhất.</li>
  <li><em class="en">not optional polish</em>: không phải phần đánh bóng tùy chọn.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson03/Lesson03.java</code>. Có 8 bài: tính ngân sách cho Claude sau overhead, số lời gọi tuần tự vừa ngân sách,
chọn sync/streaming/batch, định cỡ concurrency theo rate limit, xếp hàng phần vượt cao điểm, chọn cách triển khai theo residency,
so chi phí có và không có prompt caching, và ghép kết quả batch theo id. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-03"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-03 --live"</code>: chương trình đo cùng một câu hỏi theo kiểu sync và streaming
(thời gian tới chữ đầu tiên so với thời gian chờ trọn câu), rồi code của bạn quyết định cách trả kết quả và số lời gọi vừa ngân sách.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Câu nào là yêu cầu hạ tầng (infrastructure requirement)?', options: ['Tóm tắt tài liệu trong 5 gạch đầu dòng', 'Trả lời theo định dạng JSON đã thống nhất', 'Chịu 400 request/phút lúc cao điểm', 'Phân loại ticket vào một trong ba nhãn'], answer: 2, explain: 'Yêu cầu hạ tầng nói "what the solution architecture has to provide to support that behavior. Compute, latency, throughput, hosting."' },
    { q: '"Trả lời trong dưới 2 giây" là gì theo bài học?', options: ['Một ngân sách độ trễ, định hình kiến trúc', 'Một tính năng, ghi vào functional requirements', 'Một acceptance criterion cho câu chữ prompt', 'Một yêu cầu về chất lượng nội dung trả lời'], answer: 0, explain: '"Respond in under two seconds isn\'t a feature. It\'s a latency budget and it will shape your whole architecture more than the wording of the prompt ever will."' },
    { q: 'Bốn nhóm yêu cầu hạ tầng được nêu là gì?', options: ['Bảo mật, giao diện, logging, testing', 'Model, prompt, bộ tool, và bộ nhớ của agent', 'Input, output, schema, và tín hiệu đo cho từng yêu cầu', 'Độ trễ, thông lượng, vùng/residency và chi phí'], answer: 3, explain: '"Infrastructure requirements group into four families": latency, throughput, region and residency, cost.' },
    { q: 'Việc chọn model tier ảnh hưởng tới hai nhóm nào?', options: ['Vùng và thông lượng', 'Độ trễ và chi phí', 'Residency và availability', 'Thông lượng và residency'], answer: 1, explain: '"Your model tier choice threads through two of these since a heavier tier buys quality at the price of latency and cost."' },
    { q: 'Availability (cam kết uptime) được xử lý thế nào trong chuỗi bài?', options: ['Không cần quan tâm vì API của Claude luôn sẵn sàng', 'Gộp chung với thông lượng thành một con số duy nhất', 'Quay lại ở bài sau như yêu cầu về độ tin cậy', 'Coi như một phần của ngân sách chi phí hằng tháng'], answer: 2, explain: '"And availability, the uptime commitment, returns in the next lesson as its own reliability requirement."' },
    { q: 'Điều gì xảy ra khi các con số hạ tầng còn mơ hồ?', options: ['Kiến trúc phải đoán', 'Thiết kế tự tối ưu theo thời gian', 'Model chọn giúp cấu hình phù hợp', 'Không ảnh hưởng gì nếu prompt tốt'], answer: 0, explain: '"When they\'re vague, the architecture is guessing. When they\'re concrete, the design almost falls out of them."' },
    { q: 'Người dùng chịu chờ tối đa 2.000ms. Mạng 150ms, xác thực 100ms, xử lý trước và sau 250ms. Ngân sách cho lời gọi Claude là bao nhiêu?', options: ['2.000ms', '1.750ms', '1.850ms', '1.500ms'], answer: 3, explain: 'Lấy thời gian chịu được trừ mọi overhead: 2.000 − (150 + 100 + 250) = 1.500ms. "Whatever is left is the budget the Claude call itself has to fit inside."' },
    { q: 'Ngân sách cho Claude còn khoảng 1,5 giây. Thiết kế nào bị loại ngay từ phép tính?', options: ['Một lời gọi duy nhất trả lời trong 1 giây', 'Agent 5 lời gọi tuần tự', 'Streaming với chữ đầu tiên sau 300ms', 'Một lời gọi có cache prefix'], answer: 1, explain: '"If you\'ve got a second and a half of headroom, a multi-step agent loop that makes five sequential calls is already off the table."' },
    { q: 'Theo bài học, nên dùng ngân sách độ trễ thế nào?', options: ['Đo trên production rồi điều chỉnh dần', 'Để model tự cân đối giữa chất lượng và tốc độ lúc chạy', 'Làm ngược từ con số để biết được phép mấy lời gọi, bao nhiêu context', 'Chỉ dùng để báo cáo cho quản lý sau khi sản phẩm ra mắt'], answer: 2, explain: '"Let the latency budget tell you how many calls and how much context you can afford instead of discovering it in production."' },
    { q: 'Cách trả kết quả nào giúp đạt độ trễ CẢM NHẬN mà model không cần nhanh hơn?', options: ['Streaming', 'Synchronous', 'Batch', 'Gọi lại nhiều lần'], answer: 0, explain: '"That\'s often how you meet a perceived latency target without making the model any faster."' },
    { q: 'Nhược điểm của cách synchronous là gì?', options: ['Không trả về được JSON đúng schema đã thống nhất', 'Tốn gấp đôi số token so với streaming cùng nội dung', 'Không dùng được với tool, chỉ trả về được văn bản thuần', 'Người dùng phải chờ trọn câu trả lời, cảm nhận từng mili giây'], answer: 3, explain: '"Synchronous is the simplest. One request, one response. And the caller waits for the whole thing. Easy to build, but the user feels every millisecond."' },
    { q: 'Một báo cáo tổng hợp chạy lúc 2 giờ sáng, không ai ngồi chờ. Nên dùng cách nào?', options: ['Streaming', 'Batch', 'Synchronous', 'Agent loop nhiều lượt'], answer: 1, explain: 'Batch "trading real-time speed for lower cost on work nobody is sitting and waiting for... An overnight report wants batch."' },
    { q: 'Khi vượt rate limit, phản hồi rate limit nghĩa là gì?', options: ['Request có lỗi trong body, cần sửa trước khi gửi lại', 'Tài khoản đã bị khóa vĩnh viễn vì gửi quá nhiều', 'Tín hiệu chậm lại, chờ rồi thử lại', 'Model không hỗ trợ request đó'], answer: 2, explain: '"When you exceed one, you get a rate limit response, which is a signal to slow down and try again after a wait."' },
    { q: 'Backpressure là gì?', options: ['Xếp hàng phần việc dư thay vì bắn hết vào model', 'Tăng max tokens khi tải cao', 'Giảm chất lượng câu trả lời để nhanh hơn', 'Gửi lại mọi request bị lỗi ngay lập tức'], answer: 0, explain: '"When incoming demand outruns the capacity you have, you queue the excess work instead of firing it all at the model and getting throttled."' },
    { q: 'Nên định cỡ số request chạy song song (concurrency) theo gì?', options: ['Số nhân CPU của máy chủ đang chạy ứng dụng', 'Tổng số người dùng đã đăng ký tài khoản', 'Số tính năng dùng Claude trong ứng dụng', 'Rate limit của API, để luồng gọi đều và êm'], answer: 3, explain: '"Size your concurrency to the rate limit so the integration edge stays smooth."' },
    { q: 'Rate limit 120 request/phút, mỗi request mất khoảng 3 giây. Tối đa bao nhiêu request nên bay cùng lúc?', options: ['3', '6', '40', '120'], answer: 1, explain: '120 request/phút tức 2 request mỗi giây; mỗi request giữ chỗ 3 giây, nên khoảng 2 × 3 = 6 request cùng lúc.' },
    { q: 'Vì sao phải tính thông lượng theo phút cao điểm?', options: ['Vì giá token vào phút cao điểm rẻ hơn bình thường', 'Vì rate limit chỉ áp dụng lúc cao điểm', 'Vì phút trung bình không bao giờ làm sập hệ thống', 'Vì người dùng chỉ đến vào giờ cao điểm'], answer: 2, explain: '"Always plan for the busy minute at peak because the average minute never breaks anything."' },
    { q: 'Hợp đồng yêu cầu dữ liệu người dùng phải ở trong EU, nhưng endpoint first-party bạn dùng không phục vụ vùng EU. Hướng đi hợp lý là gì?', options: ['Chạy Claude trong cloud platform, ghim vào vùng EU', 'Giữ API first-party vì tích hợp đơn giản hơn', 'Mã hóa dữ liệu rồi gửi sang vùng nào cũng được', 'Viết prompt yêu cầu Claude không lưu dữ liệu'], answer: 0, explain: 'Cloud platform "can pin traffic to a specific region... If residency is a hard requirement, it can outweigh convenience."' },
    { q: 'Điểm yếu của API first-party về mặt vùng là gì?', options: ['Không hỗ trợ streaming cho các câu trả lời dài', 'Không công bố rate limit rõ ràng cho từng tài khoản', 'Không trả về usage', 'Bị giới hạn ở vùng endpoint phục vụ'], answer: 3, explain: '"The simplest integration, but you inherit whichever regions that endpoint serves."' },
    { q: 'Câu nào ĐÚNG về API first-party so với chạy trên cloud platform?', options: ['Cloud platform luôn tốt hơn vì có nhiều vùng để lựa chọn', 'Tùy: residency cứng có thể quyết định', 'API first-party luôn tốt hơn vì đơn giản', 'Hai cách giống hệt nhau về vùng'], answer: 1, explain: '"Neither is better in the abstract. If residency is a hard requirement, it can outweigh convenience."' },
    { q: 'Chi phí token tăng theo những gì?', options: ['Số người dùng và số tính năng', 'Độ dài system prompt và ngôn ngữ', 'Kích thước context và số lượt gọi', 'Vùng triển khai và giờ trong ngày'], answer: 2, explain: '"Token cost scales with your context size and your turn count. A loop that resends a growing history gets expensive fast."' },
    { q: 'Một trần chi phí chặt có thể làm gì với một thiết kế?', options: ['Có thể cấm hẳn thiết kế đó ngay từ đầu', 'Không ảnh hưởng, chỉ cần tối ưu sau', 'Chỉ làm chậm tiến độ dự án một chút', 'Bắt buộc phải chuyển sang dùng agent cho linh hoạt'], answer: 0, explain: '"A tight cost envelope can forbid a design outright, the same way a tight latency budget can."' },
    { q: 'Khi lưu lượng đủ cao, cache prefix ổn định trở thành gì?', options: ['Một tối ưu đẹp nhưng không cần thiết', 'Một rủi ro bảo mật cần tránh khi có nhiều người dùng', 'Một tính năng thử nghiệm chỉ nên bật cho nhóm nhỏ', 'Một yêu cầu, vì thiếu nó con số không vừa'], answer: 3, explain: '"Caching a stable prompt prefix stops being a nice optimization and becomes a requirement, because without it, the numbers simply don\'t work."' },
    { q: 'Câu nào ĐÚNG về giá prompt caching?', options: ['Cả ghi và đọc cache đều miễn phí với mọi model', 'Đọc cache rẻ hơn hẳn giá input, còn ghi thì tốn thêm', 'Đọc cache đắt hơn giá input thường', 'Ghi cache rẻ hơn đọc cache vì chỉ làm một lần'], answer: 1, explain: '"Repeated reads bill at a fraction of the base input price. Cache writes bill at a premium, so this only pays off when the prefix is actually reused."' },
    { q: 'Một prefix dài chỉ được dùng đúng MỘT lần. Bật prompt caching cho nó thì sao?', options: ['Rẻ hơn hẳn vì đọc cache giá thấp', 'Không đổi gì về chi phí, chỉ tốn thêm bộ nhớ phía server', 'Đắt hơn, vì trả phí ghi mà không có lần đọc nào', 'Nhanh hơn nhưng không ảnh hưởng chi phí'], answer: 2, explain: 'Ghi cache tốn thêm, "so this only pays off when the prefix is actually reused."' },
    { q: 'Ngoài chi phí, prompt caching (khi dùng lại nhiều) còn giúp gì?', options: ['Giảm thời gian tới token đầu tiên', 'Tăng rate limit của tài khoản', 'Giảm số token output mà model phải sinh ra', 'Cho phép streaming trong batch'], answer: 0, explain: '"Reused often, it cuts cost and time to first token, so it helps latency too."' },
    { q: 'Message Batches có những đặc điểm nào?', options: ['Nhanh hơn API sync nhưng giữ nguyên giá', 'Có streaming và giá gấp đôi', 'Chỉ dùng cho model nhỏ nhất', 'Nửa giá, trong một ngày, không theo thứ tự'], answer: 3, explain: '"Deferrable work runs asynchronously at half the standard price collected within a day. The catch is results come back in any order."' },
    { q: 'Kết quả batch về lộn xộn. Ghép với input thế nào cho đúng?', options: ['Theo vị trí trong danh sách gửi', 'Theo identifier của từng request', 'Theo thời gian hoàn thành của từng request trong batch', 'Theo độ dài câu trả lời'], answer: 1, explain: '"Results come back in any order, so you match them by identifier, not position."' },
    { q: 'Right-sizing nghĩa là gì?', options: ['Luôn dùng model lớn nhất cho chắc', 'Cắt bớt system prompt cho ngắn nhất có thể để tiết kiệm', 'Chọn model tier vừa sức với từng việc', 'Giảm max tokens xuống thấp nhất'], answer: 2, explain: '"The third is right sizing. Match the model tier to the task, so you never pay for reasoning a light job doesn\'t need."' },
    { q: 'Câu chốt của bài về trần chi phí chặt là gì?', options: ['Caching và batching là yêu cầu', 'Hãy chuyển sang model đắt hơn', 'Hãy bỏ streaming đi để tiết kiệm chi phí kết nối', 'Chỉ cần thương lượng lại ngân sách'], answer: 0, explain: '"Just remember, when the cost ceiling is tight, caching and batching are requirements, not optional polish."' },
  ],
};
