window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Ý chính của cả bài:</strong> Agent đổi <strong>độ trễ và chi phí token</strong> lấy
<strong>sự linh hoạt</strong>. Mỗi vòng lặp thêm tốn token, thêm thời gian chờ, và cho lỗi thêm một cơ hội dồn lại.
Cuộc trao đổi này chỉ đáng giá với việc thật sự mở. Hãy làm và kiểm chứng phiên bản workflow trước.</p>

<h3>1. Ba trục để cân nhắc</h3>
<ul>
  <li><strong>Độ trễ (latency):</strong> agent gọi model nhiều lần nối tiếp nhau, nên người dùng chờ lâu hơn một lần trả lời duy nhất.</li>
  <li><strong>Chi phí token:</strong> mỗi vòng gửi lại toàn bộ context đang lớn dần, nên hóa đơn tăng theo từng bước.</li>
  <li><strong>Hiệu quả công việc (task performance):</strong> đây là thứ bạn "mua" bằng hai thứ trên. Model thích nghi được,
  xử lý được input lộn xộn, và đạt kết quả mà một script cứng không làm nổi.</li>
</ul>
<p>Anthropic nói gọn: <em class="en">agentic systems trade latency and cost for better task performance</em>.
Toàn bộ quyết định là xem cuộc trao đổi đó có đáng với việc trước mặt không.</p>

<h3>2. So sánh thẳng</h3>
<p><strong>Workflow cố định</strong> cho bạn sự dễ đoán và nhất quán: rẻ hơn, nhanh hơn, lần nào cũng chạy như nhau,
nên dễ test và dễ tin. <strong>Agent</strong> cho bạn sự linh hoạt: làm được việc bạn không script hết được, và thích nghi khi input bất ngờ.
Nhưng sự tự chủ đó tốn hơn, chậm hơn, và mở cửa cho những lỗi mà workflow không bao giờ mắc.</p>
<p>Không cái nào tốt hơn một cách tuyệt đối. Workflow thắng khi việc được định nghĩa rõ.
Agent thắng khi sự linh hoạt và việc ra quyết định lúc chạy thật sự quan trọng ở quy mô lớn.
Việc của bạn là chọn hình dạng hợp với bài toán, không mặc định chọn cái "xịn" hơn.</p>

<h3>3. Chi phí cụ thể đến từ đâu?</h3>
<p>Gọi model một lần: trả tiền cho một prompt và một câu trả lời. Trong vòng lặp agent, context <strong>không reset</strong> giữa các vòng.
Mọi thứ cộng dồn: hướng dẫn ban đầu, mọi lần gọi tool, mọi kết quả model đã thấy.
Vòng 5 mang theo sức nặng của vòng 1 tới 4, và bạn trả tiền lại cho tất cả ở mỗi vòng.</p>
<p>Ví dụ: prompt 1.000 token, vòng 1 tool trả về 500 token, vòng 2 tool trả về 2.000 token.
Vòng 1 gửi 1.000, vòng 2 gửi 1.500, vòng 3 gửi 3.500. Tổng cộng 6.000 token input, gấp 6 lần một lần gọi.</p>
<p><strong>Tool output lớn là thủ phạm lớn nhất.</strong> Nhét một tài liệu khổng lồ vào vòng lặp thì nó "đi nhờ" theo mọi vòng sau đó.</p>
<p>Bốn nguồn chi phí cần gọi tên:</p>
<ul>
  <li><strong>Nhiều vòng hơn:</strong> vòng lặp cứ gọi model tới khi xong, mỗi lần gọi đều tính tiền.</li>
  <li><strong>Context lớn hơn:</strong> mỗi vòng mang theo toàn bộ lịch sử, nên các vòng sau là đắt nhất.</li>
  <li><strong>Lỗi dồn (compounding errors):</strong> một bước sai từ sớm trở thành đầu vào cho mọi bước sau.</li>
  <li><strong>Phản hồi chậm hơn:</strong> các round trip nối tiếp cộng lại thành thời gian thật người dùng phải chờ.</li>
</ul>
<p>Không cái nào là lý do để bỏ cuộc, chúng chỉ là "giá vé vào cửa" (<em class="en">the price of admission</em>).
Bạn cần biết mình đang trả giá đó trước khi chọn vòng lặp.</p>

<h3>4. Lỗi dồn: chi phí khó thấy nhất</h3>
<p>Trong workflow, một bước hỏng thì hỏng ở chỗ bạn nhìn thấy được, và code của bạn bắt được.
Trong agent, một lỗi nhỏ lúc đầu trở thành input cho quyết định tiếp theo. Model coi output sai của chính nó là sự thật và suy luận tiếp từ đó.
Vài vòng sau, nó có thể đi rất xa khỏi hướng đúng mà vẫn rất tự tin, và không có điểm hỏng rõ ràng nào.</p>
<p>Ví dụ: mỗi bước đúng 95%. Qua 10 bước liên tiếp, xác suất tất cả đều đúng chỉ còn khoảng 0,95<sup>10</sup> ≈ 60%.
Vì vậy chạy tự động càng dài thì càng rủi ro. Cách kiểm soát: <strong>giới hạn vòng lặp</strong> và <strong>kiểm tra kết quả</strong> ở các checkpoint.</p>

<h3>5. Ba lợi ích "thầm lặng" của workflow</h3>
<ul>
  <li><strong>Predictability (dễ đoán):</strong> đường đi cố định cho cùng một hành vi mỗi lần chạy, bạn biết trước điều gì sẽ xảy ra.</li>
  <li><strong>Auditability (truy vết được):</strong> biết chính xác bước nào chạy, theo thứ tự nào, vì sao. Vô giá khi có sự cố hoặc khi sếp hỏi chuyện gì đã xảy ra.</li>
  <li><strong>Consistency (nhất quán):</strong> không có ứng biến lúc chạy nên không bị trôi lệch giữa các lần gọi.</li>
</ul>
<p>Những ưu điểm này không nổi bật trong demo, nhưng quyết định hệ thống có đáng tin ở quy mô lớn hay không.
Khi độ tin cậy là ưu tiên, thiết kế cố định không phải lựa chọn nhàm chán, mà là lựa chọn đúng.</p>

<h3>6. Thói quen: làm workflow trước</h3>
<p>Khi một bài toán có thể làm theo cả hai cách, hãy <strong>xây và kiểm chứng phiên bản workflow trước</strong>.
Nó dựng nhanh hơn, dễ test hơn, và cho bạn một mốc so sánh (baseline) mà bạn hiểu rõ.
Chạy nó với input thật. Thường thì nó đủ tốt, và bạn tiết kiệm được một agent không cần thiết.
Nếu nó không đủ, bạn biết chính xác chỗ nào và vì sao, tức là biết phần nào cần sự linh hoạt của model.
Như thế mạnh hơn nhiều so với bắt đầu bằng một agent mở rồi cố "ghìm cương" nó sau
(<em class="en">rein it in later</em>).</p>

<h3>7. Thiết kế lai: agent nằm trong một bước của workflow</h3>
<p>Hãy hình dung một pipeline cố định gồm ba bước: kiểm tra input, làm việc, định dạng output.
Bước giữa có thể thật sự mở, nên bạn đặt một agent có phạm vi hẹp vào đúng bước đó.
Workflow bao quanh lo thứ tự, kiểm tra và xử lý lỗi. Agent chỉ được tự do ở chỗ sự linh hoạt đáng với chi phí của nó.
Kết quả: dễ đoán ở hai đầu, linh hoạt ở lõi. Đừng coi đây là một lựa chọn cho cả hệ thống,
hãy chọn <strong>theo từng bước</strong> xem ai sở hữu quyết định.</p>

<h3>8. Tóm tắt</h3>
<ul>
  <li>Agent đổi độ trễ và chi phí token lấy sự linh hoạt lúc chạy.</li>
  <li>Cuộc trao đổi đó chỉ đáng với việc mở (open-ended).</li>
  <li>Kiểm chứng workflow trước, chỉ dùng vòng lặp khi workflow không tự xoay xở được.</li>
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
    {
      q: 'Theo bài học, mỗi vòng lặp thêm của agent gây ra ba hệ quả nào?',
      options: ['Tốn thêm token, thêm độ trễ, thêm cơ hội để lỗi dồn lại', 'Tốn thêm RAM, thêm ổ cứng, thêm băng thông', 'Model thông minh hơn, nhanh hơn, rẻ hơn', 'Không có hệ quả gì đáng kể'],
      answer: 0,
      explain: '"Every extra turn an agent loop takes costs more tokens, adds latency, and gives errors another chance to compound."',
    },
    {
      q: 'Ba trục để cân nhắc giữa agent và workflow là gì?',
      options: ['Bảo mật, quyền riêng tư, tuân thủ', 'Độ trễ, chi phí token, hiệu quả công việc', 'Ngôn ngữ, framework, cloud', 'Số người dùng, số tool, số model'],
      answer: 1,
      explain: 'Latency, token cost, task performance.',
    },
    {
      q: 'Vì sao agent làm người dùng chờ lâu hơn?',
      options: ['Vì agent chạy trên máy chủ yếu hơn', 'Vì agent phải tải model về máy', 'Vì agent gọi model nhiều lần nối tiếp nhau', 'Vì agent luôn dùng model lớn nhất'],
      answer: 2,
      explain: '"A loop makes several model calls in sequence, so a user waits longer than they would for a single response."',
    },
    {
      q: 'Vì sao chi phí token của agent tăng theo từng bước?',
      options: ['Vì giá token tăng theo thời gian', 'Vì model trả lời dài hơn ở mỗi bước', 'Vì mỗi tool tính phí riêng', 'Vì mỗi vòng gửi lại toàn bộ context đang lớn dần'],
      answer: 3,
      explain: '"Every turn resends the growing context, so the bill climbs with each step the agent takes."',
    },
    {
      q: 'Trong ba trục, "task performance" đóng vai trò gì?',
      options: ['Là thứ bạn "mua" bằng độ trễ và chi phí', 'Là chi phí phụ phải trả thêm', 'Là thứ workflow luôn tốt hơn agent', 'Là thứ không đo được'],
      answer: 0,
      explain: '"This is what you\'re buying with the other two": khả năng thích nghi, xử lý input lộn xộn.',
    },
    {
      q: 'Anthropic tóm tắt sự đánh đổi của hệ thống agentic như thế nào?',
      options: ['Đổi độ chính xác lấy tốc độ', 'Đổi độ trễ và chi phí lấy hiệu quả công việc tốt hơn', 'Đổi bảo mật lấy sự tiện lợi', 'Đổi sự linh hoạt lấy chi phí thấp'],
      answer: 1,
      explain: '"Agentic systems trade latency and cost for better task performance."',
    },
    {
      q: 'Workflow cố định mang lại điều gì?',
      options: ['Linh hoạt với mọi input bất ngờ', 'Khả năng tự chọn tool', 'Dễ đoán, nhất quán, rẻ hơn, nhanh hơn', 'Không cần test'],
      answer: 2,
      explain: '"A deterministic workflow gives you predictability and consistency. It\'s cheaper, it\'s faster..."',
    },
    {
      q: 'Agent có nhược điểm nào mà workflow không có?',
      options: ['Không gọi được tool', 'Không xử lý được văn bản dài', 'Không chạy được song song', 'Tốn hơn, chậm hơn, và có thể mắc lỗi mà workflow không bao giờ mắc'],
      answer: 3,
      explain: '"That autonomy costs more, runs slower, and opens the door to mistakes the workflow would never make."',
    },
    {
      q: 'Khi nào agent thắng workflow?',
      options: ['Khi sự linh hoạt và quyết định lúc chạy thật sự quan trọng ở quy mô lớn', 'Khi việc được định nghĩa rõ', 'Khi cần rẻ nhất có thể', 'Khi muốn demo cho ấn tượng'],
      answer: 0,
      explain: '"The agent wins when flexibility and runtime decision-making genuinely matter at scale." Workflow thắng khi việc được định nghĩa rõ.',
    },
    {
      q: 'Trong vòng lặp agent, vòng thứ 5 phải trả tiền cho những gì?',
      options: ['Chỉ phần câu hỏi mới', 'Hướng dẫn ban đầu và toàn bộ lời gọi tool cùng kết quả của vòng 1 tới 4', 'Chỉ kết quả tool của vòng 4', 'Không tốn gì vì đã cache'],
      answer: 1,
      explain: '"Turn 5 is carrying the weight of turns 1 through 4, and you pay for all of it again on each pass."',
    },
    {
      q: 'Theo bài, yếu tố lớn nhất đẩy chi phí agent lên là gì?',
      options: ['Số lượng tool được khai báo', 'Độ dài câu hỏi của người dùng', 'Tool output lớn', 'Số người dùng đồng thời'],
      answer: 2,
      explain: '"Large tool outputs are the biggest driver here. Dump a giant document into the loop, and it rides along in every future turn."',
    },
    {
      q: 'Prompt 1.000 token, tool ở vòng 1 trả 500 token, tool ở vòng 2 trả 2.000 token, vòng 3 model trả lời. Tổng input token là bao nhiêu?',
      options: ['3.500', '4.500', '1.000', '6.000'],
      answer: 3,
      explain: 'Vòng 1 gửi 1.000, vòng 2 gửi 1.500, vòng 3 gửi 3.500. Tổng 6.000, vì context không reset giữa các vòng.',
    },
    {
      q: 'Bốn nguồn chi phí thêm của agent mà bài học gọi tên là gì?',
      options: ['Nhiều vòng hơn, context lớn hơn, lỗi dồn, phản hồi chậm hơn', 'Licence, server, nhân sự, đào tạo', 'Prompt, tool, memory, retrieval', 'Bảo mật, logging, monitoring, backup'],
      answer: 0,
      explain: 'More turns, bigger context, compounding errors, slower responses.',
    },
    {
      q: 'Vì sao các vòng sau của agent là đắt nhất?',
      options: ['Vì model mệt hơn', 'Vì mỗi vòng mang theo toàn bộ lịch sử đang lớn dần', 'Vì vòng sau dùng model đắt hơn', 'Vì vòng sau gọi nhiều tool hơn'],
      answer: 1,
      explain: '"Every turn carries the full growing history, so later turns are the most expensive ones."',
    },
    {
      q: 'Bài học nói bốn nguồn chi phí đó là gì?',
      options: ['Lý do để không bao giờ dùng agent', 'Lỗi cần sửa ngay', 'Giá vé vào cửa mà bạn nên biết trước khi chọn vòng lặp', 'Không đáng quan tâm'],
      answer: 2,
      explain: '"None of these are deal breakers. They\'re just the price of admission, and you should know you\'re paying it before you commit to the loop."',
    },
    {
      q: 'Vì sao lỗi dồn (compounding errors) được gọi là chi phí "khó thấy nhất"?',
      options: ['Vì nó chỉ xảy ra ban đêm', 'Vì nó không bao giờ xảy ra trong workflow', 'Vì nó không ảnh hưởng tới kết quả', 'Vì model coi output sai của mình là sự thật, suy luận tiếp và có thể lệch xa mà không có điểm hỏng rõ ràng'],
      answer: 3,
      explain: '"The model treats its own flawed output as fact and reasons forward from there... confidently far off track with no obvious point of failure."',
    },
    {
      q: 'Trong workflow, khi một bước hỏng thì sao?',
      options: ['Nó hỏng ở chỗ bạn nhìn thấy được và code bắt được', 'Nó âm thầm lan sang các bước sau', 'Toàn bộ hệ thống phải khởi động lại', 'Model tự sửa lỗi'],
      answer: 0,
      explain: '"In a workflow, if a step misfires, it fails in a spot you can see, and your code can catch it."',
    },
    {
      q: 'Mỗi bước đúng với xác suất 95%. Qua 10 bước liên tiếp, xác suất tất cả đều đúng khoảng bao nhiêu?',
      options: ['95%', 'Khoảng 60%', 'Khoảng 90%', 'Khoảng 5%'],
      answer: 1,
      explain: '0,95 mũ 10 ≈ 0,60. Đây là lý do chạy tự động càng dài càng rủi ro.',
    },
    {
      q: 'Cách bài học đề xuất để kiểm soát lỗi dồn là gì?',
      options: ['Dùng model lớn hơn', 'Tăng số vòng lặp', 'Giới hạn vòng lặp và kiểm tra kết quả của nó', 'Tắt tool'],
      answer: 2,
      explain: '"Bounding the loop and checking its work is how you keep that in check."',
    },
    {
      q: 'Ba lợi ích của workflow trong môi trường production là gì?',
      options: ['Rẻ, đẹp, nhanh', 'Sáng tạo, linh hoạt, tự chủ', 'Tự học, tự sửa, tự mở rộng', 'Predictability, auditability, consistency'],
      answer: 3,
      explain: 'Dễ đoán, truy vết được, nhất quán.',
    },
    {
      q: '"Auditability" của workflow có nghĩa là gì?',
      options: ['Truy vết được chính xác bước nào chạy, theo thứ tự nào và vì sao', 'Tự động kiểm toán tài chính', 'Model tự giải thích suy nghĩ', 'Có thể chạy offline'],
      answer: 0,
      explain: '"You can trace exactly which step ran in what order and why", rất quý khi có sự cố hoặc ai đó hỏi chuyện gì đã xảy ra.',
    },
    {
      q: 'Theo giảng viên, khi độ tin cậy là ưu tiên thì thiết kế cố định là gì?',
      options: ['Lựa chọn nhàm chán', 'Lựa chọn đúng, nên chọn trước tiên', 'Lựa chọn tạm thời', 'Lựa chọn chỉ dành cho người mới'],
      answer: 1,
      explain: '"A deterministic design isn\'t the boring choice. It\'s the correct one, and I\'d reach for it first."',
    },
    {
      q: 'Khi bài toán có thể làm bằng cả workflow lẫn agent, bài học khuyên làm gì trước?',
      options: ['Làm agent trước rồi tối ưu sau', 'Làm cả hai song song', 'Xây và kiểm chứng phiên bản workflow trước', 'Hỏi người dùng thích cái nào'],
      answer: 2,
      explain: '"When a problem could plausibly be either, build and validate the workflow version first."',
    },
    {
      q: 'Khi workflow không đủ tốt, bạn được lợi gì từ việc đã làm nó trước?',
      options: ['Không được gì, phí công', 'Có thể bán workflow cho khách khác', 'Agent sẽ chạy nhanh hơn', 'Biết chính xác chỗ nào và vì sao nó hỏng, tức là phần nào cần sự linh hoạt của model'],
      answer: 3,
      explain: '"You now know exactly where and why, which tells you precisely which part needs the model\'s flexibility."',
    },
    {
      q: 'Trong thiết kế lai "validate input, làm việc, format output", agent nên được đặt ở đâu?',
      options: ['Chỉ ở bước giữa (làm việc), nơi việc thật sự mở', 'Ở cả ba bước', 'Ở bước validate input', 'Ở bước format output'],
      answer: 0,
      explain: '"That middle step, the work, might be genuinely open-ended. So you drop a scoped agent inside just that stage."',
    },
    {
      q: 'Trong thiết kế lai, phần workflow bao quanh agent chịu trách nhiệm gì?',
      options: ['Chọn tool cho agent', 'Thứ tự các bước, kiểm tra hợp lệ và xử lý lỗi', 'Viết prompt thay agent', 'Không làm gì cả'],
      answer: 1,
      explain: '"The workflow around the agent handles ordering, validation, and error handling."',
    },
    {
      q: 'Câu chốt của bài: nên nghĩ về việc chọn agent hay workflow như thế nào?',
      options: ['Một lựa chọn duy nhất cho cả hệ thống', 'Luôn chọn agent cho chắc', 'Chọn theo từng bước xem ai sở hữu quyết định', 'Để model tự chọn'],
      answer: 2,
      explain: '"Think of it as choosing, stage by stage, who owns each decision."',
    },
    {
      q: '🇬🇧 "...gives errors another chance to compound." Từ "compound" ở đây nghĩa là gì?',
      options: ['Pha trộn hóa chất', 'Khu nhà có tường bao', 'Đơn giản hóa', 'Cộng dồn, làm cho tệ thêm'],
      answer: 3,
      explain: '"Compound" (động từ) là chồng chất, làm trầm trọng thêm, giống "lãi kép" (compound interest).',
    },
    {
      q: '🇬🇧 "None of these are deal breakers." Cụm "deal breaker" nghĩa là gì?',
      options: ['Yếu tố khiến bạn từ bỏ, không chấp nhận được', 'Người phá vỡ hợp đồng', 'Một ưu đãi đặc biệt', 'Lỗi kỹ thuật nghiêm trọng'],
      answer: 0,
      explain: 'Deal breaker là điều đủ nghiêm trọng để bạn hủy thỏa thuận. Câu này ý là các chi phí đó không đủ để bỏ hẳn agent.',
    },
    {
      q: '🇬🇧 "...the more room a single wrong turn has to snowball." Từ "snowball" ở đây nghĩa là gì?',
      options: ['Ném tuyết', 'Lớn dần lên ngày càng nhanh, như quả cầu tuyết lăn', 'Tan biến', 'Đông cứng lại'],
      answer: 1,
      explain: '"Snowball" (động từ) là phình to dần, giống quả cầu tuyết càng lăn càng lớn.',
    },
  ],
};
