window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Một thiết kế trông gọn gàng trên bảng trắng vẫn có thể trượt yêu cầu. <strong>Solution architecture fit</strong>
là phép kiểm tra thẳng thắn: thiết kế này có thỏa <strong>từng</strong> ràng buộc đã nêu không? Trượt một cái là chưa fit.
Phần lớn lỗi fit nằm ở độ tin cậy, nên bài này nói nhiều về failover, retry và cách xuống cấp nhẹ nhàng.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Fit:</strong> phán quyết có/không: thiết kế thỏa một ràng buộc hay không. Không phải cảm giác "trông ổn".</li>
  <li><strong>Availability:</strong> tỉ lệ thời gian ứng dụng phải dùng được.</li>
  <li><strong>Failover:</strong> đường chuyển sang phương án dự phòng đã định sẵn khi lời gọi chính thất bại.</li>
  <li><strong>Graceful degradation:</strong> trả một trải nghiệm kém hơn nhưng vẫn có ích (bản cache, bản ngắn, một phần) thay vì báo lỗi.</li>
  <li><strong>Lỗi tạm thời (transient):</strong> timeout, rate limit, lỗi server thoáng qua, mạng chập chờn. Dự kiến tự hết.</li>
  <li><strong>Lỗi vĩnh viễn (permanent):</strong> request sai, schema sai, xác thực sai. Gửi lại y nguyên không bao giờ hết.</li>
</ul>

<h3>Fit là phán quyết, không phải cảm giác</h3>
<ol>
  <li>Trước khi đánh giá, <strong>liệt kê mọi ràng buộc</strong> yêu cầu đã nêu.</li>
  <li>Kiểm tra thiết kế với <strong>từng cái một</strong>.</li>
  <li><strong>Một</strong> ràng buộc không đạt nghĩa là thiết kế không fit như đã đặc tả.</li>
  <li>Khi đó hoặc <strong>sửa</strong>, hoặc <strong>thương lượng lại</strong> ràng buộc một cách công khai và ghi lại đánh đổi.</li>
</ol>
<p>Điều không bao giờ làm: cho qua vì thiết kế "đẹp". Fit được đo bằng yêu cầu, không bằng gu của bạn.</p>

<h3>Ba yêu cầu độ tin cậy hay bị bỏ quên</h3>
<ul>
  <li><strong>Availability:</strong> có một con số buộc bạn lên kế hoạch cho lúc đường chính sập, vì sớm muộn gì nó cũng sập.</li>
  <li><strong>Failover:</strong> không có nó, một sự cố kéo sập cả tính năng.</li>
  <li><strong>Degradation:</strong> thay vì ném lỗi vào mặt người dùng, bạn đưa họ một cái gì đó.</li>
</ul>
<p>Ba thứ này thường <strong>không được ghi</strong> trong yêu cầu, và đó chính là lý do chúng bị bỏ sót. Nếu độ tin cậy quan trọng, hãy ghi rõ và thiết kế cho chúng.</p>

<h3>Bộ đồ nghề failover: ba viên gạch</h3>
<ul>
  <li><strong>Fallback model:</strong> model chính không dùng được thì chuyển sang model khác. Tính năng vẫn sống, dù khả năng có giảm một bậc.</li>
  <li><strong>Retry với backoff:</strong> gửi lại lời gọi lỗi sau một khoảng chờ <strong>tăng dần</strong>.</li>
  <li><strong>Graceful degradation:</strong> trả câu trả lời cache, đơn giản hơn, hoặc một phần.</li>
</ul>
<p>Không cần cả ba ở mọi nơi. Chọn những viên khớp với yêu cầu độ tin cậy bạn thật sự phải đạt.</p>

<h3>Phân loại lỗi trước, rồi mới chọn cách xử lý</h3>
<div class="box">🚗 <strong>Hình dung thế này:</strong> Xe không nổ máy vì trời lạnh: chờ chút rồi đề lại là được (lỗi tạm thời).
Xe không nổ máy vì <strong>hết xăng</strong>: đề bao nhiêu lần cũng vô ích, phải đi đổ xăng (lỗi vĩnh viễn).
Đề lại liên tục khi hết xăng chỉ làm hỏng ắc quy và phí thời gian.</div>
<ul>
  <li><strong>Tạm thời</strong> (timeout, rate limit, lỗi server, mạng): <strong>retry với exponential backoff</strong>.</li>
  <li><strong>Vĩnh viễn</strong> (request sai, schema sai, xác thực sai): cần <strong>sửa</strong>, <strong>dự phòng</strong>, hoặc <strong>chuyển cho người</strong>.</li>
</ul>
<p>⚠️ Lỗi kinh điển: retry <strong>mọi thứ</strong>. Retry lỗi vĩnh viễn chỉ đốt ngân sách và làm chậm lúc bạn nhận ra có thứ thật sự hỏng.
Cách xử lý phải khớp với <strong>loại</strong> lỗi, không phải với triệu chứng bạn tình cờ thấy.</p>

<h3>Thiết kế cho "ngày tệ nhất" một cách có chủ đích</h3>
<ul>
  <li>Chọn fallback model <strong>trước</strong> khi sự cố ép bạn quyết định dưới áp lực.</li>
  <li>Cho client một <strong>đường xuống cấp</strong> thay vì màn hình trắng: kết quả cache, câu ngắn hơn, thông báo rõ ràng kèm nút thử lại. Cái nào cũng hơn một vòng xoay không bao giờ dừng.</li>
  <li>Gắn mỗi cách phục hồi với <strong>loại lỗi</strong> đã phân loại, để đúng viên gạch kích hoạt cho đúng lỗi.</li>
</ul>
<p>Những team bị "bỏng" là những team chỉ test đường vui. Ngày tệ luôn đến; nếu đã thiết kế trước, nó chỉ là sự kiện nhỏ.</p>

<h3>Chạy fit check: biến mỗi yêu cầu thành một câu hỏi</h3>
<ul>
  <li><strong>Ngân sách độ trễ?</strong> Đếm số lời gọi model tuần tự, xem có vừa con số không.</li>
  <li><strong>Mục tiêu thông lượng?</strong> Đối chiếu với rate limit bạn sẽ chịu.</li>
  <li><strong>Quy định residency?</strong> Xác nhận lời gọi chạy ở đâu về mặt vật lý và có được phép không.</li>
  <li><strong>Mục tiêu availability?</strong> Chỉ ra đường failover, hoặc thành thật nhận là chưa có.</li>
</ul>
<p>Hỏi thẳng thì lộ lỗ hổng: một câu trả lời lấp lửng không sống sót trước câu hỏi trực diện.</p>

<h3>Ba kiểu trượt fit hay gặp</h3>
<ul>
  <li><strong>Over-provisioning:</strong> dùng năng lực thời gian thực cho việc trì hoãn được, trả giá cao cho tốc độ không ai cần. Một job chạy đêm không cần streaming.</li>
  <li><strong>Under-provisioning:</strong> không failover, không dư địa; đợt tăng rate limit đầu tiên hoặc sự cố ngắn là sập cả tính năng. Chạy tốt lúc demo, chết khi có tải.</li>
  <li><strong>Wrong placement:</strong> thiết kế đúng kỹ thuật nhưng bỏ qua ràng buộc vùng/residency, nên không dùng được về pháp lý hay hợp đồng.</li>
</ul>
<p>Cả ba đều là lỗi fit: code có thể ổn, nhưng sự khớp với yêu cầu thì hỏng.</p>

<h3>Thói quen lặp lại mỗi lần đánh giá thiết kế</h3>
<ol>
  <li>Ghi ra mọi ràng buộc: hành vi chức năng lẫn hạ tầng (độ trễ, thông lượng, vùng, chi phí, availability).</li>
  <li>Dò thiết kế với từng ràng buộc, không bỏ qua cái khó chịu.</li>
  <li>Gắn cờ những gì thiết kế không thỏa rõ ràng.</li>
  <li>Sửa, hoặc ghi lại đánh đổi một cách có ý thức, rồi mới tuyên bố xong.</li>
</ol>
<p>Fit dễ giả khi nhìn lướt, khó giả khi đi từng mục.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Fit nghĩa là thỏa <strong>mọi</strong> ràng buộc đã nêu, không phải phần lớn.</li>
  <li>Retry lỗi tạm thời; lỗi vĩnh viễn thì sửa hoặc dự phòng.</li>
  <li>Cảnh giác over-provisioning, under-provisioning và wrong placement.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">look clean on the whiteboard</em>: trông gọn gàng trên bảng trắng.</li>
  <li><em class="en">It asks a blunt question</em>: nó đặt một câu hỏi thẳng thừng.</li>
  <li><em class="en">without fooling yourself</em>: không tự lừa mình.</li>
  <li><em class="en">a verdict, not a feeling</em>: một phán quyết, không phải cảm giác.</li>
  <li><em class="en">wave it through on elegance</em>: cho qua chỉ vì nó thanh lịch.</li>
  <li><em class="en">even if the capability drops a notch</em>: dù khả năng giảm đi một bậc.</li>
  <li><em class="en">the symptom you happen to see</em>: triệu chứng bạn tình cờ thấy.</li>
  <li><em class="en">a spinner that never resolves</em>: vòng xoay chờ không bao giờ dừng.</li>
  <li><em class="en">the teams that get burned</em>: những team bị "bỏng".</li>
  <li><em class="en">A hand wave doesn't survive a direct question</em>: câu trả lời lấp lửng không qua được câu hỏi trực diện.</li>
  <li><em class="en">It worked in the demo and died under load</em>: chạy tốt lúc demo, chết khi có tải.</li>
  <li><em class="en">easy to fake when you eyeball it</em>: dễ giả khi chỉ nhìn lướt.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson04/Lesson04.java</code>. Có 4 bài: phân loại lỗi theo status HTTP (tạm thời hay vĩnh viễn),
retry với exponential backoff nhưng ném ngay lỗi vĩnh viễn, chuỗi failover primary → fallback model → bản degraded,
và fit check trả về danh sách ràng buộc không đạt. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-04"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-04 --live"</code>: gọi với một API key sai để thấy lỗi 401 thật bị báo ngay
(không retry, không tốn token), rồi gọi một model không tồn tại để code của bạn tự chuyển sang model dự phòng.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Solution architecture fit đặt ra câu hỏi gì?', options: ['Thiết kế có dùng công nghệ mới nhất và kiến trúc hiện đại nhất hiện nay không?', 'Có thỏa mọi ràng buộc đã nêu không?', 'Thiết kế có rẻ hơn phương án cũ không?', 'Thiết kế có được cả team thích không?'], answer: 1, explain: '"Does this proposed design actually satisfy every constraint and requirement that we stated?"' },
    { q: 'Thiết kế đạt 4 trên 5 ràng buộc đã nêu, trượt ràng buộc về vùng dữ liệu. Kết luận đúng là gì?', options: ['Fit, vì đạt phần lớn ràng buộc', 'Fit một phần, có thể ship trước rồi sửa ràng buộc còn lại ở bản cập nhật sau', 'Chưa fit: sửa, hoặc thương lượng lại ràng buộc và ghi lại đánh đổi', 'Fit, nếu thiết kế đủ thanh lịch'], answer: 2, explain: '"A single, unmet constraint means the design doesn\'t fit as specified. You either fix it, or you explicitly renegotiate the constraint and record the tradeoff."' },
    { q: 'Theo bài học, fit được đo bằng gì?', options: ['Bằng yêu cầu', 'Bằng gu thiết kế của kiến trúc sư', 'Bằng số dòng code', 'Bằng ý kiến số đông trong team'], answer: 0, explain: '"Fit is measured against the requirement, never against your own taste for a design."' },
    { q: 'Bước đầu tiên của phương pháp đánh giá fit là gì?', options: ['Vẽ sơ đồ kiến trúc thật đẹp', 'Chạy thử thiết kế trên production để thu số liệu thật trước khi đánh giá', 'Hỏi ý kiến người đặt hàng', 'Liệt kê mọi ràng buộc mà yêu cầu đã nêu'], answer: 3, explain: '"Before you evaluate anything, list every constraint the requirement stated. Then check the design against each one in turn."' },
    { q: 'Ba yêu cầu độ tin cậy được nêu trong bài là gì?', options: ['Latency, throughput, cost', 'Availability, failover, degradation', 'Retry, timeout, logging', 'Caching, batching, streaming'], answer: 1, explain: '"Let\'s name the three requirements there": availability, failover và degradation.' },
    { q: 'Vì sao ba yêu cầu độ tin cậy hay bị bỏ sót?', options: ['Vì chúng quá tốn kém để thực hiện ở giai đoạn đầu của dự án', 'Vì API đã tự lo hết', 'Vì chúng thường không được ghi ra', 'Vì chỉ hệ thống lớn mới cần'], answer: 2, explain: '"These three often go unstated in the requirement, which is exactly why they get missed."' },
    { q: 'Failover được định nghĩa là gì?', options: ['Một đường định sẵn sang phương án dự phòng khi lời gọi chính lỗi, để một sự cố không kéo sập cả tính năng', 'Gửi lại cùng một request cho model chính cho tới khi nó thành công', 'Giảm chất lượng câu trả lời để nhanh hơn', 'Tắt tính năng khi có sự cố'], answer: 0, explain: '"Failover, a defined path to a backup when the primary call fails. Without it, one outage takes the whole feature down with it."' },
    { q: 'Degradation (xuống cấp) nghĩa là gì?', options: ['Chuyển sang model mạnh hơn', 'Ném một thông báo lỗi kỹ thuật rõ ràng, đầy đủ chi tiết cho người dùng', 'Xóa cache để làm mới dữ liệu', 'Trải nghiệm kém hơn nhưng vẫn có ích khi không phục vụ đầy đủ được'], answer: 3, explain: '"Degradation, a reduced but still useful experience when full service isn\'t possible. Instead of throwing a hard error in the user\'s face, you give them something."' },
    { q: 'Viên gạch nào KHÔNG thuộc bộ đồ nghề failover trong bài?', options: ['Fallback model', 'Tăng max tokens khi có lỗi', 'Retry với backoff', 'Graceful degradation'], answer: 1, explain: 'Ba viên gạch là fallback model, retry with backoff và graceful degradation.' },
    { q: 'Fallback model giữ tính năng sống bằng cách nào?', options: ['Gửi lại request cho model chính sau mỗi giây cho tới khi model đó hoạt động trở lại', 'Lưu mọi câu trả lời cũ vào database', 'Chuyển sang model khác khi model chính không dùng được, dù khả năng có giảm một bậc', 'Tắt các tính năng phụ để giảm tải cho model chính trong lúc sự cố'], answer: 2, explain: '"When your primary model is unavailable, you route to an alternate one, keeping the feature alive, even if the capability drops a notch."' },
    { q: 'Có cần dùng cả ba viên gạch failover ở mọi nơi không?', options: ['Không, chỉ chọn viên phù hợp', 'Có, luôn dùng cả ba ở mọi lời gọi để đảm bảo an toàn tuyệt đối', 'Chỉ cần retry là đủ ở mọi nơi', 'Chỉ dùng fallback model, không bao giờ degrade'], answer: 0, explain: '"You don\'t need all three everywhere. You pick the blocks that match the reliability requirement you actually have to meet."' },
    { q: 'Lỗi nào là lỗi TẠM THỜI?', options: ['Request thiếu trường bắt buộc', 'Schema JSON không hợp lệ', 'API key sai', 'Rate limit'], answer: 3, explain: '"Transient errors are timeouts, rate limits, server blips, and network hiccups. They\'re expected to clear on their own."' },
    { q: 'Cách xử lý đúng cho lỗi tạm thời là gì?', options: ['Chuyển ngay cho người xử lý', 'Retry với exponential backoff', 'Sửa request rồi gửi lại', 'Bỏ qua và trả về kết quả rỗng'], answer: 1, explain: '"They\'re expected to clear on their own, so the correct response is a retry with exponential backoff."' },
    { q: 'Request bị lỗi vì xác thực sai. Retry y nguyên 5 lần thì sao?', options: ['Lần thứ 5 sẽ thành công', 'Không sao, chỉ tốn thêm vài giây chờ và một chút ngân sách token', 'Không thay đổi gì, chỉ phí ngân sách và chậm phát hiện lỗi', 'Server sẽ tự cấp lại key'], answer: 2, explain: 'Lỗi vĩnh viễn: "retrying without changing anything can\'t fix them." Retry chúng "just wastes budget and delays the moment you realize something is genuinely broken."' },
    { q: 'Lỗi vĩnh viễn cần được xử lý theo cách nào?', options: ['Sửa, dự phòng, hoặc chuyển người', 'Retry với khoảng chờ dài hơn nhiều so với lỗi tạm thời thông thường', 'Retry ngay lập tức nhiều lần', 'Tăng timeout của client'], answer: 0, explain: '"They need a fix, a fallback, or an escalation to a human."' },
    { q: '"Lỗi kinh điển" về retry trong bài là gì?', options: ['Retry quá ít lần', 'Dùng backoff tăng dần', 'Ghi log trước khi retry', 'Retry mọi lỗi'], answer: 3, explain: '"The classic mistake is applying retry to everything."' },
    { q: 'Cách chọn chiến lược phục hồi đúng là gì?', options: ['Theo triệu chứng nhìn thấy đầu tiên', 'Xác định loại lỗi trước, rồi mới chọn chiến lược phục hồi khớp với đúng loại lỗi đó, không theo triệu chứng', 'Luôn thử fallback model trước', 'Theo mức độ khẩn cấp mà người dùng báo cáo trong ticket hỗ trợ'], answer: 1, explain: '"Identify the type first, then choose the strategy. The strategy has to match the type, not the symptom you happen to see."' },
    { q: 'Khi nào nên quyết định fallback model?', options: ['Trong lúc sự cố đang diễn ra', 'Sau khi sự cố đã xong, trong lúc cả team viết báo cáo rút kinh nghiệm', 'Từ trước, khi chưa có sự cố', 'Chỉ khi người dùng phàn nàn'], answer: 2, explain: '"Decide the fallback model before an outage forces the decision under pressure, not during the incident."' },
    { q: 'Theo bài học, điều gì tệ hơn mọi phương án xuống cấp?', options: ['Một vòng xoay chờ không bao giờ dừng', 'Một câu trả lời ngắn hơn', 'Một kết quả lấy từ cache', 'Một thông báo rõ ràng kèm nút thử lại'], answer: 0, explain: '"A cached result, a shorter answer, a clear message with a retry, any of those beats a spinner that never resolves."' },
    { q: 'Những team nào hay "bị bỏng" khi có sự cố?', options: ['Team dùng nhiều model', 'Team có quá nhiều test chậm', 'Team dùng streaming', 'Team chỉ test đường vui'], answer: 3, explain: '"The teams that get burned are the ones who only ever tested the happy path."' },
    { q: 'Khi chạy fit check, ngân sách độ trễ được kiểm tra bằng câu hỏi nào?', options: ['Prompt có đủ ngắn không?', 'Đếm số lời gọi model tuần tự trong thiết kế và nhân với thời gian mỗi lời gọi, xem tổng có nằm trong con số không', 'Model được chọn có phải là loại nhanh nhất trong danh sách hiện có không?', 'Server có gần người dùng không?'], answer: 1, explain: '"Latency budget? Count the sequential model calls in the design and see if they fit inside the number."' },
    { q: 'Khi chạy fit check, mục tiêu availability được kiểm tra thế nào?', options: ['Xem uptime của tuần trước', 'Hỏi nhà cung cấp cloud về cam kết uptime trong hợp đồng dịch vụ của họ', 'Chỉ ra đường failover', 'Tính trung bình độ trễ'], answer: 2, explain: '"Availability target? Point to the failover path or honestly admit there isn\'t one yet."' },
    { q: 'Vì sao nên biến mỗi yêu cầu thành một câu hỏi thiết kế phải trả lời thành tiếng?', options: ['Vì hỏi thẳng làm lộ lỗ hổng', 'Vì như vậy tài liệu thiết kế trông chuyên nghiệp và dễ trình bày cho cấp trên hơn', 'Vì người đặt hàng thích dạng câu hỏi', 'Vì Claude cần câu hỏi để tự kiểm tra'], answer: 0, explain: '"The value of phrasing them as questions is that it exposes the gaps. A hand wave doesn\'t survive a direct question."' },
    { q: 'Một job tổng hợp chạy mỗi đêm được thiết kế với streaming thời gian thực và tài nguyên cao cấp. Đây là kiểu trượt fit nào?', options: ['Under-provisioning', 'Wrong placement', 'Lỗi tạm thời', 'Over-provisioning'], answer: 3, explain: '"You reach for real-time capacity when the work was actually deferrable... A nightly job doesn\'t need a streaming response."' },
    { q: 'Tính năng chạy tốt lúc demo, nhưng sập hoàn toàn ở đợt tăng rate limit đầu tiên vì không có failover hay dư địa. Đây là gì?', options: ['Over-provisioning', 'Under-provisioning', 'Wrong placement', 'Graceful degradation'], answer: 1, explain: '"You ship with no failover and no headroom, and the first rate limit spike or brief outage takes the entire feature down. It worked in the demo and died under load."' },
    { q: 'Thiết kế chạy rất tốt nhưng dữ liệu được xử lý ở vùng mà hợp đồng không cho phép. Đây là kiểu trượt nào?', options: ['Over-provisioning', 'Under-provisioning', 'Wrong placement', 'Lỗi vĩnh viễn'], answer: 2, explain: '"A design is technically sound, but it ignores a residency or region constraint, so it\'s legally or contractually unusable, no matter how well it runs."' },
    { q: 'Điểm chung của ba kiểu trượt fit là gì?', options: ['Code có thể hoàn toàn ổn, nhưng sự khớp giữa thiết kế và yêu cầu đã nêu thì hỏng', 'Đều do code có bug', 'Đều do chọn sai model', 'Đều sửa được bằng cách viết lại system prompt cho rõ ràng và chặt chẽ hơn'], answer: 0, explain: '"Notice these are all fit problems. The code might be fine. The match to the requirement is what broke."' },
    { q: 'Trong checklist đánh giá thiết kế, bước nào đúng thứ tự?', options: ['Sửa lỗi trước → ghi lại ràng buộc → kiểm tra từng cái → gắn cờ phần còn lại', 'Gắn cờ → ghi ràng buộc → kiểm tra → sửa', 'Kiểm tra → ghi ràng buộc → sửa → gắn cờ', 'Ghi lại mọi ràng buộc → dò thiết kế với từng cái → gắn cờ chỗ chưa thỏa → sửa hoặc ghi lại đánh đổi'], answer: 3, explain: 'Thứ tự: write down every constraint, trace the design against each one, flag anything it can\'t clearly satisfy, then fix it or consciously record the tradeoff.' },
    { q: 'Vì sao phải đi từng mục thay vì nhìn lướt cả thiết kế?', options: ['Vì như vậy nhanh hơn', 'Vì fit dễ giả khi nhìn lướt, khó giả khi đi từng mục', 'Vì người duyệt yêu cầu', 'Vì các công cụ kiểm tra tự động cần một danh sách đầy đủ để chạy được từng bước'], answer: 1, explain: '"Fit is easy to fake when you eyeball it and hard to fake when you go item by item."' },
    { q: 'Một thiết kế được coi là fit khi nào?', options: ['Khi đạt được hầu hết các ràng buộc quan trọng nhất đối với người đặt hàng', 'Khi sơ đồ kiến trúc hoàn chỉnh', 'Khi không còn mục nào bỏ ngỏ', 'Khi chạy được bản demo'], answer: 2, explain: '"A design fits only when nothing on that list is left unanswered."' },
  ],
};
