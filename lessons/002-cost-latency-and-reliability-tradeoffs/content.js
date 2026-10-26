window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Agent linh hoạt hơn workflow, nhưng phải trả giá: <strong>tốn tiền hơn</strong>, <strong>chậm hơn</strong>
và <strong>dễ sai dây chuyền hơn</strong>. Cái giá đó chỉ đáng khi việc thật sự mở. Nếu phân vân, hãy làm workflow trước.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Token:</strong> đơn vị tính tiền khi dùng AI. Đại khái là các mẩu chữ; gửi càng nhiều chữ cho AI thì càng tốn token.</li>
  <li><strong>Context:</strong> toàn bộ những gì AI "đang thấy" ở một lần gọi: hướng dẫn, câu hỏi, các kết quả trước đó.</li>
  <li><strong>Độ trễ (latency):</strong> thời gian người dùng phải chờ.</li>
  <li><strong>Lỗi dồn:</strong> một sai sót nhỏ ở bước đầu kéo theo sai ở các bước sau.</li>
</ul>

<h3>Agent đổi cái gì lấy cái gì?</h3>
<p>Có ba thứ cần cân nhắc:</p>
<ul>
  <li><strong>Thời gian chờ:</strong> agent hỏi AI nhiều lần nối tiếp nhau, nên người dùng phải chờ lâu hơn.</li>
  <li><strong>Tiền:</strong> mỗi lần hỏi lại phải gửi kèm cả những gì đã có trước đó, nên hóa đơn tăng dần.</li>
  <li><strong>Hiệu quả công việc:</strong> đây là thứ bạn "mua" được: AI xử lý được những việc lộn xộn mà quy trình cứng không làm nổi.</li>
</ul>
<p>Tóm lại: <strong>agent bỏ tiền và thời gian ra để mua sự linh hoạt.</strong> Câu hỏi luôn là: việc này có đáng để mua không?</p>

<h3>Vì sao agent tốn tiền nhanh vậy?</h3>
<div class="box">📦 <strong>Hình dung thế này:</strong> Mỗi lần hỏi AI, bạn phải gửi lại <strong>cả chồng giấy</strong> từ đầu tới giờ, cộng thêm tờ mới.
Lần 1 gửi 1 tờ, lần 2 gửi 2 tờ, lần 3 gửi 3 tờ... Bạn trả tiền cho <strong>mọi tờ, ở mọi lần gửi</strong>.</div>
<p>Ví dụ: câu hỏi ban đầu dài 1.000 token. Lần 1 AI đọc một kết quả dài 500 token, lần 2 đọc thêm 2.000 token.</p>
<ul>
  <li>Lần gọi 1 gửi 1.000 token.</li>
  <li>Lần gọi 2 gửi 1.000 + 500 = 1.500 token.</li>
  <li>Lần gọi 3 gửi 1.500 + 2.000 = 3.500 token.</li>
</ul>
<p>Tổng cộng 6.000 token, <strong>gấp 6 lần</strong> so với hỏi một lần. Và nếu có một tài liệu thật dài lọt vào, nó sẽ bị gửi đi gửi lại ở mọi lần sau.
Đó là lý do <strong>kết quả tool dài là thủ phạm tốn tiền lớn nhất</strong>.</p>

<h3>Lỗi dồn: cái giá khó thấy nhất</h3>
<p>Trong workflow, một bước hỏng thì hỏng ngay tại chỗ, dễ thấy, dễ bắt. Trong agent, AI có thể <strong>tin vào chính cái sai của mình</strong>
rồi tiếp tục suy luận từ đó. Vài bước sau, nó đã đi rất xa mà vẫn rất tự tin.</p>
<div class="box">🎯 <strong>Một con số dễ nhớ:</strong> nếu mỗi bước đúng 95%, thì sau 10 bước liên tiếp, khả năng tất cả đều đúng chỉ còn khoảng <strong>60%</strong>.</div>
<p>Cách giữ an toàn: <strong>giới hạn số bước</strong> và <strong>kiểm tra kết quả giữa chừng</strong>.</p>

<h3>Workflow có gì hay?</h3>
<ul>
  <li><strong>Dễ đoán:</strong> lần nào cũng chạy giống nhau, nên biết trước điều gì sẽ xảy ra.</li>
  <li><strong>Truy vết được:</strong> biết rõ bước nào chạy, theo thứ tự nào, vì sao. Rất quý khi có sự cố hoặc khi sếp hỏi "chuyện gì đã xảy ra?".</li>
  <li><strong>Nhất quán:</strong> không có chuyện hôm nay làm kiểu này, mai làm kiểu khác.</li>
</ul>
<p>Những ưu điểm này không hào nhoáng khi demo, nhưng quyết định hệ thống có đáng tin khi chạy thật hay không.</p>

<h3>Thói quen nên có: làm workflow trước</h3>
<p>Khi một việc có thể làm theo cả hai cách, hãy làm workflow trước và chạy thử với dữ liệu thật.</p>
<ul>
  <li>Nếu nó đủ tốt: bạn vừa tiết kiệm được một agent không cần thiết.</li>
  <li>Nếu chưa đủ: bạn biết <strong>chính xác chỗ nào</strong> cần sự linh hoạt của AI, rồi chỉ thêm agent vào đúng chỗ đó.</li>
</ul>

<h3>Kết hợp: agent nằm gọn trong một bước</h3>
<p>Ví dụ một quy trình 3 bước: <strong>kiểm tra đầu vào, làm việc, trình bày kết quả</strong>. Nếu chỉ bước giữa là thật sự mở,
hãy đặt một agent nhỏ vào riêng bước đó. Hai đầu vẫn chắc chắn, còn phần lõi thì linh hoạt.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Agent tốn tiền hơn, chậm hơn, dễ sai dây chuyền hơn; đổi lại nó linh hoạt.</li>
  <li>Mỗi lần gọi đều gửi lại cả lịch sử, nên chi phí tăng dần theo từng bước.</li>
  <li>Làm workflow trước; chỉ thêm agent vào đúng chỗ workflow không làm nổi.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">compound</em> (động từ): cộng dồn, làm cho tệ thêm. <em class="en">Compounding errors</em>: lỗi dồn.</li>
  <li><em class="en">the bill climbs</em>: hóa đơn tăng dần.</li>
  <li><em class="en">frame it plainly</em>: diễn đạt một cách đơn giản, thẳng thắn.</li>
  <li><em class="en">pay off</em>: đáng giá, mang lại kết quả xứng đáng.</li>
  <li><em class="en">in the abstract</em>: nói chung chung, không xét bối cảnh cụ thể.</li>
  <li><em class="en">ride along</em>: đi nhờ, đi theo cùng.</li>
  <li><em class="en">deal breaker</em>: yếu tố khiến bạn từ bỏ thỏa thuận.</li>
  <li><em class="en">the price of admission</em>: giá vé vào cửa, cái giá bắt buộc phải trả.</li>
  <li><em class="en">sneaky</em>: lén lút, khó phát hiện.</li>
  <li><em class="en">snowball</em> (động từ): lớn dần như quả cầu tuyết.</li>
  <li><em class="en">keep something in check</em>: kiểm soát, giữ trong giới hạn.</li>
  <li><em class="en">stand up</em> (một hệ thống): dựng lên, triển khai.</li>
  <li><em class="en">fall short</em>: không đạt yêu cầu.</li>
  <li><em class="en">rein it in</em>: ghìm cương, kiềm chế lại.</li>
  <li><em class="en">cope</em>: xoay xở, đối phó được.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/lesson02/Lesson02.java</code>. Có 5 bài: tính tổng token khi context cộng dồn,
xác suất lỗi dồn, số bước tối đa để vẫn đạt độ tin cậy mục tiêu, thời gian chờ, và một pipeline lai
"validate, agent, format" có xử lý lỗi. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="02"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="02 --live"</code> (cần API key): bạn sẽ thấy số token thật tăng dần qua từng vòng và độ trễ thật cộng dồn, đối chiếu với các hàm bạn viết.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Prompt 2.000 token. Agent chạy 3 vòng gọi tool, mỗi vòng tool trả về 1.000 token, rồi vòng 4 trả lời. Tổng input token của cả lần chạy là bao nhiêu?', options: ['5.000', '11.000', '14.000', '8.000'], answer: 2, explain: 'Context không reset: các vòng gửi 2.000, 3.000, 4.000, 5.000. Tổng 14.000. "Turn 5 is carrying the weight of turns 1 through 4."' },
    { q: 'Cũng tình huống trên, nếu đổi thành một lần gọi duy nhất với prompt 2.000 token, vòng lặp tốn gấp bao nhiêu lần input token?', options: ['2 lần', '4 lần', '5 lần', '7 lần'], answer: 3, explain: '14.000 chia 2.000 bằng 7. Vòng lặp tốn hơn nhiều so với số lần gọi vì mỗi vòng gửi lại cả lịch sử.' },
    { q: 'Ở lần gọi model đầu tiên, agent yêu cầu tool đọc một tài liệu 40.000 token; kết quả tool được gửi lại ở lần gọi sau. Tổng cộng có 5 lần gọi model. Tài liệu nằm trong input của bao nhiêu lần gọi?', options: ['1 lần', '4 lần', '5 lần', '2 lần'], answer: 1, explain: 'Lần gọi 1 chỉ trả về yêu cầu tool. Từ lần 2 tới lần 5, kết quả tool nằm trong lịch sử và "rides along in every future turn": 4 lần.' },
    { q: 'Mỗi bước đúng 90%. Agent chạy 5 bước liên tiếp không có checkpoint. Xác suất cả 5 bước đều đúng xấp xỉ bao nhiêu?', options: ['90%', '59%', '45%', '75%'], answer: 1, explain: '0,9 mũ 5 xấp xỉ 0,59. Lỗi dồn lại theo số bước.' },
    { q: 'Mỗi bước đúng 99%. Muốn xác suất cả chuỗi đều đúng vẫn từ 90% trở lên thì tối đa được bao nhiêu bước?', options: ['10 bước', '9 bước', '20 bước', '15 bước'], answer: 0, explain: '0,99 mũ 10 xấp xỉ 0,904; mũ 11 xấp xỉ 0,895. Vậy tối đa 10 bước.' },
    { q: 'Câu nào SAI về lỗi dồn (compounding errors)?', options: ['Một lỗi nhỏ ở đầu trở thành input cho các bước sau', 'Model có thể đi lệch xa mà vẫn rất tự tin', 'Workflow cũng dồn lỗi theo cách y như agent', 'Giới hạn vòng lặp và kiểm tra kết quả giúp kiểm soát nó'], answer: 2, explain: 'Trong workflow, bước hỏng "fails in a spot you can see, and your code can catch it". Agent mới là bên coi output sai của chính nó là sự thật.' },
    { q: 'Theo bài học, "task performance" trong ba trục cân nhắc là gì?', options: ['Một loại chi phí phụ phát sinh khi chạy agent', 'Thứ bạn đổi lấy bằng độ trễ và chi phí token', 'Thước đo tốc độ phản hồi cho người dùng', 'Ưu điểm luôn nghiêng về phía workflow'], answer: 1, explain: '"This is what you\'re buying with the other two."' },
    { q: 'Vì sao người dùng phải chờ agent lâu hơn chờ một lần gọi model?', options: ['Vì agent luôn dùng model lớn hơn, nên sinh token chậm hơn hẳn', 'Vì các lần gọi model nối tiếp nhau, mỗi lần là một round trip', 'Vì agent phải tải lại định nghĩa tool về máy trước mỗi lượt', 'Vì kết quả tool luôn chậm hơn model'], answer: 1, explain: '"A loop makes several model calls in sequence." Các round trip nối tiếp cộng thành thời gian thật.' },
    { q: 'Nguồn chi phí nào KHÔNG nằm trong bốn nguồn chi phí thêm của agent mà bài học gọi tên?', options: ['Nhiều vòng gọi model hơn tới khi xong việc', 'Context lớn dần vì mang theo cả lịch sử', 'Phí bản quyền cho từng tool', 'Lỗi dồn qua các bước'], answer: 2, explain: 'Bốn nguồn là: nhiều vòng hơn, context lớn hơn, lỗi dồn, phản hồi chậm hơn. Không có phí bản quyền tool.' },
    { q: 'Trong một lần chạy agent dài, lượt nào thường tốn nhiều input token nhất?', options: ['Lượt đầu tiên, vì phải gửi system prompt', 'Lượt có tool output lớn nhất', 'Các lượt sau cùng', 'Mọi lượt tốn như nhau'], answer: 2, explain: '"Every turn carries the full growing history, so later turns are the most expensive ones."' },
    { q: 'Bài học nói các chi phí của agent là "the price of admission". Ý chính của nhận định này là gì?', options: ['Đó là lý do đủ mạnh để tránh dùng agent khi có thể', 'Đó là chi phí cần biết trước, không phải lý do để bỏ cuộc', 'Đó là chi phí chỉ phát sinh một lần lúc khởi tạo agent', 'Đó là chi phí có thể loại bỏ bằng cache'], answer: 1, explain: '"None of these are deal breakers. They\'re just the price of admission, and you should know you\'re paying it before you commit to the loop."' },
    { q: 'Một nhóm fintech phải trả lời câu hỏi của kiểm toán viên: bước nào đã chạy, theo thứ tự nào, vì sao. Ưu điểm nào của workflow phục vụ trực tiếp yêu cầu này?', options: ['Predictability', 'Consistency', 'Auditability', 'Flexibility'], answer: 2, explain: 'Auditability: "you can trace exactly which step ran in what order and why".' },
    { q: 'Ưu điểm nào của workflow đến từ việc "không có ứng biến lúc chạy"?', options: ['Auditability', 'Consistency', 'Task performance', 'Flexibility'], answer: 1, explain: '"Consistency because there\'s no runtime improvisation to drift between calls."' },
    { q: 'Khi nào workflow thắng agent theo bài học?', options: ['Khi việc được định nghĩa rõ', 'Khi input lộn xộn và đa dạng', 'Khi cần thích nghi lúc chạy ở quy mô lớn', 'Khi ngân sách token không bị giới hạn'], answer: 0, explain: '"The workflow wins when the task is well defined."' },
    { q: 'Bài toán có thể làm bằng cả workflow lẫn agent. Theo bài học, lợi ích lớn nhất của việc làm workflow trước là gì?', options: ['Workflow luôn cho kết quả tốt hơn agent trên cùng một bài toán', 'Workflow là bản nháp giúp viết agent nhanh hơn rất nhiều về sau', 'Nếu workflow không đủ, bạn biết chính xác chỗ nào cần sự linh hoạt', 'Workflow dùng được model rẻ hơn'], answer: 2, explain: '"When it falls short, you now know exactly where and why, which tells you precisely which part needs the model\'s flexibility."' },
    { q: 'Câu nào mô tả đúng cách tiếp cận bị bài học xem là yếu hơn?', options: ['Làm workflow trước rồi thêm agent ở chỗ cần', 'Bắt đầu bằng agent mở rồi cố kiềm nó lại về sau', 'Đo workflow trên input thật trước khi quyết định', 'Đặt agent nhỏ trong một bước của pipeline'], answer: 1, explain: 'Bài học so sánh với việc "starting with an open-ended agent and trying to rein it in later".' },
    { q: 'Trong thiết kế lai, workflow bao quanh agent KHÔNG đảm nhận việc nào?', options: ['Sắp xếp thứ tự các bước chạy', 'Kiểm tra input và output có hợp lệ không', 'Bắt và xử lý lỗi khi một bước hỏng', 'Quyết định cách làm phần việc mở ở giữa'], answer: 3, explain: '"The workflow around the agent handles ordering, validation, and error handling." Phần việc mở ở giữa là của agent.' },
    { q: 'Pipeline: kiểm tra input, làm việc, định dạng output. Bước nào là ứng viên đặt agent?', options: ['Kiểm tra input, vì input có thể sai nhiều kiểu', 'Làm việc, nếu phần này thật sự mở', 'Định dạng output, vì output đa dạng', 'Cả ba bước, để hệ thống linh hoạt tối đa'], answer: 1, explain: '"That middle step, the work, might be genuinely open-ended. So you drop a scoped agent inside just that stage."' },
    { q: 'Câu chốt về cách chọn agent hay workflow là gì?', options: ['Chọn một kiểu cho cả hệ thống để nhất quán', 'Mặc định agent, chỉ dùng workflow khi bị giới hạn ngân sách', 'Chọn theo từng bước xem ai nắm quyết định', 'Mặc định workflow, không bao giờ dùng agent ở production'], answer: 2, explain: '"Think of it as choosing, stage by stage, who owns each decision."' },
    { q: 'Câu nào SAI về cuộc so sánh workflow và agent?', options: ['Workflow rẻ hơn và nhanh hơn', 'Agent xử lý được những việc không lập trình hết được', 'Agent có thể mắc lỗi mà workflow không bao giờ mắc', 'Agent tốt hơn workflow nếu xét một cách tuyệt đối'], answer: 3, explain: '"Neither one is better in the abstract." Việc của bạn là khớp hình dạng với bài toán.' },
    { q: 'Vì sao lỗi dồn được gọi là chi phí khó thấy nhất?', options: ['Vì nó chỉ lộ ra trên hóa đơn API vào cuối tháng', 'Vì không có điểm hỏng rõ ràng khi agent đi lệch', 'Vì nó chỉ xảy ra khi tool bị lỗi mạng giữa chừng', 'Vì nó chỉ ảnh hưởng tới độ trễ'], answer: 1, explain: 'Agent có thể "be confidently far off track with no obvious point of failure".' },
    { q: 'Hai lần chạy cùng một việc: lần A tự động 20 bước không checkpoint, lần B 20 bước nhưng có kiểm tra sau mỗi 5 bước. Nhận định nào đúng nhất?', options: ['A và B rủi ro như nhau vì có cùng số bước tự động', 'B rủi ro hơn vì có nhiều điểm dừng', 'A rủi ro hơn vì lỗi có nhiều chỗ để lớn dần', 'Hai lần chỉ khác nhau về chi phí, không khác về rủi ro'], answer: 2, explain: '"The more steps the model takes without a checkpoint, the more room a single wrong turn has to snowball."' },
    { q: 'Ví dụ nào làm chi phí agent tăng mạnh nhất theo bài học?', options: ['Tăng độ dài system prompt thêm 200 token', 'Đưa một tài liệu khổng lồ vào vòng lặp', 'Thêm một tool mới vào danh sách', 'Đổi câu hỏi của người dùng sang tiếng Anh'], answer: 1, explain: '"Large tool outputs are the biggest driver here."' },
    { q: 'Câu nào đúng về ba ưu điểm "thầm lặng" của workflow?', options: ['Chúng là thứ nổi bật nhất khi demo cho khách hàng', 'Chúng không quan trọng ở production', 'Chúng quyết định hệ thống có đáng tin ở quy mô lớn', 'Chúng chỉ xuất hiện khi dùng model nhỏ và rẻ'], answer: 2, explain: '"These are the quiet advantages that don\'t show up in a demo but decide whether a system is trustworthy at scale."' },
    { q: 'Một startup chọn agent cho bài toán được định nghĩa rõ, chỉ vì "agent nghe hiện đại hơn". Rủi ro trực tiếp nhất theo bài học là gì?', options: ['Không có rủi ro gì miễn là model đủ mạnh và đủ thông minh', 'Trả thêm độ trễ và chi phí mà không được gì tương xứng', 'Agent sẽ không gọi được tool', 'Agent bị giới hạn về số người dùng'], answer: 1, explain: 'Cuộc trao đổi chỉ đáng khi việc thật sự mở: "the trade only pays off for open-ended work".' },
    { q: 'Câu nào mô tả đúng nhất mục tiêu của thiết kế lai?', options: ['Dễ đoán ở hai đầu, linh hoạt ở lõi', 'Linh hoạt ở hai đầu, dễ đoán ở lõi', 'Linh hoạt ở mọi nơi để xử lý mọi trường hợp', 'Dễ đoán ở mọi nơi, bỏ hẳn agent'], answer: 0, explain: '"You get predictability at the edges and adaptability in the core."' },
    { q: 'Theo bài học, khi độ tin cậy là ưu tiên, thiết kế cố định là gì?', options: ['Lựa chọn nhàm chán nhưng an toàn', 'Lựa chọn tạm thời trước khi có agent', 'Lựa chọn đúng, nên chọn đầu tiên', 'Lựa chọn chỉ phù hợp với nhóm nhỏ'], answer: 2, explain: '"A deterministic design isn\'t the boring choice. It\'s the correct one, and I\'d reach for it first."' },
    { q: 'Agent chạy 4 round trip, lần lượt mất 1,2 giây, 0,8 giây, 1,5 giây và 0,5 giây. Người dùng phải chờ khoảng bao lâu?', options: ['1,5 giây', '1,0 giây', '4,0 giây', '0,5 giây'], answer: 2, explain: 'Các round trip nối tiếp nên cộng lại: 1,2 + 0,8 + 1,5 + 0,5 = 4,0 giây.' },
    { q: 'Câu nào là kết luận chính của bài?', options: ['Agent đổi độ trễ và chi phí lấy sự linh hoạt, chỉ đáng với việc mở', 'Agent luôn rẻ hơn về dài hạn vì tự động hơn', 'Workflow luôn tốt hơn agent vì dễ test và dễ kiểm toán hơn', 'Chi phí token là không đáng kể so với lợi ích linh hoạt'], answer: 0, explain: '"An agent trades latency and token cost for flexibility... the trade only pays off for open-ended work."' },
    { q: 'Theo bài học, câu nào đúng về Anthropic khi nói về agentic system?', options: ['Agentic system luôn cho hiệu quả tốt hơn với chi phí thấp hơn', 'Agentic system đổi độ trễ và chi phí lấy hiệu quả công việc tốt hơn', 'Agentic system chỉ nên dùng khi doanh nghiệp có ngân sách thật lớn', 'Agentic system sẽ dần thay thế hoàn toàn mọi workflow hiện có'], answer: 1, explain: '"Agentic systems trade latency and cost for better task performance."' },
  ],
};
