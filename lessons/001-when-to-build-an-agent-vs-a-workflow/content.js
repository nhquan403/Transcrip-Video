window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Ý chính của cả bài:</strong> Workflow và agent khác nhau ở đúng một điểm:
<strong>ai quyết định bước tiếp theo</strong>. Code của bạn quyết định thì đó là workflow, model tự quyết định
lúc đang chạy thì đó là agent. Lời khuyên xuyên suốt: luôn bắt đầu bằng cách đơn giản nhất, chỉ dùng agent khi bài toán thật sự cần.</p>

<h3>1. Workflow và agent khác nhau thế nào?</h3>
<p><strong>Workflow</strong> giống một công thức nấu ăn in sẵn: bước 1, bước 2, bước 3 theo đúng thứ tự bạn đã viết trong code.
Model chỉ làm phần việc bên trong từng bước (<em class="en">the model just fills in each step</em>).</p>
<p><strong>Agent</strong> giống một đầu bếp được giao "nấu bữa tối": họ tự mở tủ lạnh xem có gì, quyết định món, nếm thử,
rồi điều chỉnh. Model tự suy luận, gọi tool, xem kết quả, rồi chọn hành động tiếp theo, cứ lặp như vậy cho tới khi xong việc.</p>
<p><strong>Hiểu nhầm phổ biến:</strong> "Có dùng tool thì là agent". Sai, vì cả hai đều dùng tool.
Dấu hiệu thật sự (<em class="en">the tell</em>) là ai sở hữu quyết định tiếp theo (<em class="en">who owns the next decision</em>).</p>

<h3>2. Viên gạch chung: augmented language model</h3>
<p>Cả workflow lẫn agent đều được xây trên cùng một khối cơ bản mà Anthropic gọi là <strong>augmented language model</strong>,
tức model được tăng cường thêm ba khả năng:</p>
<ul>
  <li><strong>Retrieval:</strong> lấy thông tin liên quan đưa vào cho model, để model trả lời dựa trên dữ liệu thật thay vì đoán.</li>
  <li><strong>Tools:</strong> cho model làm hành động, ví dụ truy vấn database hay gọi một service.</li>
  <li><strong>Memory:</strong> giúp model nhớ trạng thái trong suốt một nhiệm vụ.</li>
</ul>
<p>Rất nhiều bài toán chỉ cần <strong>một lần gọi model</strong> với retrieval tốt và vài ví dụ mẫu là giải xong. Hãy bắt đầu từ đó.</p>

<h3>3. Trục kiểm soát (control axis)</h3>
<p>Hãy hình dung một đường thẳng. Một đầu là <strong>code quyết định</strong> thứ tự các bước: bạn đọc source từ trên xuống dưới là thấy hết đường đi.
Đầu kia là <strong>model quyết định</strong> thứ tự lúc chạy, dựa trên những gì nó nhìn thấy.</p>
<ul>
  <li>Đường đi cố định thì <strong>dễ đoán, dễ test</strong>, vì lần nào cũng chạy giống nhau.</li>
  <li>Đường đi do model điều khiển thì <strong>linh hoạt</strong>, xử lý được cả những input bạn không lường trước.</li>
</ul>
<p>Khi phác thảo thiết kế, hãy tự hỏi: hệ thống của mình nên nằm ở đâu trên đường thẳng này, và tại sao?</p>

<h3>4. Đơn giản là một tính năng</h3>
<p>Anthropic khuyên rất thẳng: <em class="en">find the simplest solution that works</em>, nghĩa là tìm giải pháp đơn giản nhất mà vẫn chạy được,
và chỉ thêm độ phức tạp khi nó <strong>rõ ràng</strong> làm kết quả tốt hơn. Lý do là agent là lựa chọn đắt:
mỗi vòng lặp thêm tốn token và thêm độ trễ (latency).</p>
<p>Quy trình đúng: làm thiết kế đơn giản nhất, <strong>đo kết quả</strong>, rồi mới leo lên "nấc thang độ phức tạp"
(<em class="en">complexity ladder</em>) khi kết quả đòi hỏi. <em class="en">Simple is a feature, not a compromise</em>:
đơn giản là ưu điểm, không phải sự thỏa hiệp.</p>

<h3>5. Ba tín hiệu cho thấy nên dùng agent</h3>
<ul>
  <li><strong>Không gian mở</strong> (<em class="en">open-ended space</em>): nhiệm vụ có thể rẽ theo rất nhiều hướng mà bạn không liệt kê trước được.</li>
  <li><strong>Không biết trước số bước</strong> (<em class="en">unknown steps</em>): không đoán được việc này cần bao nhiêu hành động.</li>
  <li><strong>Model tự chọn tool</strong> (<em class="en">model chooses tools</em>): giá trị nằm ở chỗ để model tự quyết dùng tool nào và lúc nào.</li>
</ul>
<p>Thường bạn cần <strong>từ hai tín hiệu trở lên</strong> mới nên quyết định làm agent. Nếu đường đi có giới hạn và biết trước được thì workflow tốt hơn.</p>

<h3>6. Bài test rẻ trước khi làm agent</h3>
<p>Khi nhận một yêu cầu tính năng, hãy hỏi hai câu:</p>
<ul>
  <li>Mình có viết được các bước ra theo thứ tự không?</li>
  <li>Cùng một input có luôn đi cùng một đường không?</li>
</ul>
<p>Nếu cả hai đều "có" thì gần như chắc chắn workflow là đủ, và bạn được tính dễ đoán miễn phí.
Rất nhiều việc trông có vẻ cần agent thực ra chỉ là một chuỗi lời gọi model cố định cộng thêm chút code nối (<em class="en">glue code</em>).
Hãy chứng minh workflow không làm được rồi mới trả tiền cho agent.</p>

<h3>7. Ba hình dạng workflow kinh điển</h3>
<ul>
  <li><strong>Prompt chaining:</strong> chia việc thành chuỗi bước cố định, mỗi lần gọi model xử lý output của bước trước.
  Có thể chèn một bước kiểm tra (gate) giữa các bước để bắt lỗi sớm. Ví dụ: viết dàn ý, kiểm tra dàn ý, rồi viết bài.</li>
  <li><strong>Routing:</strong> phân loại request đầu vào rồi chuyển cho bộ xử lý chuyên trách. Ví dụ: phân loại ticket hỗ trợ theo loại.</li>
  <li><strong>Parallelization:</strong> chạy các phần độc lập cùng lúc. Có hai kiểu: chia việc thành nhiều phần (sectioning),
  hoặc chạy cùng một việc vài lần rồi so sánh kết quả (voting).</li>
</ul>
<p>Trong cả ba, <strong>bạn định nghĩa cấu trúc</strong>, model chỉ lo phần suy luận. Code vẫn nắm đường đi, nên chúng dễ đoán.</p>

<h3>8. Thói quen ra quyết định</h3>
<p>Viết nhiệm vụ ra thành chuỗi bước. Nếu viết được và đường đi ổn định thì làm workflow và dừng ở đó.
Nếu không liệt kê được các bước, hoặc request cứ rẽ nhánh theo kiểu không script nổi, thì đó là lúc agent đáng đồng tiền
(<em class="en">earns its keep</em>).</p>
<p>Bạn cũng không phải chọn một kiểu cho cả hệ thống. Một thiết kế phổ biến và mạnh là
<strong>đặt một agent nhỏ bên trong một bước của workflow</strong>: phần cố định vẫn cố định, model chỉ cầm lái ở chỗ thật sự cần linh hoạt.
Hãy thiết kế theo bài toán trước mặt, không theo kiến trúc mình mơ ước.</p>

<h3>9. Tóm tắt</h3>
<ul>
  <li>Workflow chạy theo đường cố định do bạn viết trong code.</li>
  <li>Agent để model tự chọn bước tiếp theo lúc chạy.</li>
  <li>Dùng tool không làm một hệ thống trở thành agent. Điều quyết định là ai sở hữu quyết định tiếp theo.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">Let's dive in</em>: bắt đầu nào, cùng đi sâu vào nội dung.</li>
  <li><em class="en">the first design call</em>: quyết định thiết kế đầu tiên (<em class="en">call</em> ở đây là "quyết định", như "make a call").</li>
  <li><em class="en">the tell</em>: dấu hiệu để nhận ra điều gì đó.</li>
  <li><em class="en">reach for something</em>: chọn dùng, với lấy một công cụ hay giải pháp.</li>
  <li><em class="en">refreshingly blunt</em>: thẳng thắn một cách dễ chịu.</li>
  <li><em class="en">resist the urge to...</em>: kìm lại mong muốn làm gì đó.</li>
  <li><em class="en">light up / fire</em> (tín hiệu): bật sáng, xuất hiện.</li>
  <li><em class="en">earn its keep</em>: xứng đáng với chi phí bỏ ra.</li>
  <li><em class="en">save you cost and headaches</em>: giúp bạn đỡ tốn tiền và đỡ đau đầu.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/lesson01/Lesson01.java</code>. Có 5 bài: chọn workflow hay agent theo số tín hiệu,
viết prompt chaining có gate, routing, parallelization, và một vòng lặp agent có giới hạn số bước.
Chấm bài bằng <code>./mvnw -q compile exec:java -Dexec.args="01"</code> (xem hướng dẫn trong <code>docs/java-app.md</code>).</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="01 --live"</code> (cần API key): Claude viết đoạn văn qua prompt chain, phân loại ticket, dịch song song, và tự chọn tool trong vòng lặp agent của bạn.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Một hệ thống gọi model 3 lần theo thứ tự cố định trong code. Ở lần gọi thứ hai, model được chọn 1 trong 4 tool để tra dữ liệu, rồi code luôn chuyển sang bước thứ ba. Hệ thống này là gì?', options: ['Agent, vì model được tự chọn tool', 'Workflow, vì code vẫn quyết định bước tiếp theo', 'Agent, vì có nhiều hơn một lần gọi model', 'Không phải cả hai, chỉ là augmented language model'], answer: 1, explain: 'Dấu hiệu không phải là có dùng tool hay không: "The real question is who owns the next decision." Ở đây code luôn quyết định bước kế tiếp nên đây là workflow.' },
    { q: 'Câu nào SAI?', options: ['Cả workflow lẫn agent đều có thể dùng tool', 'Trong workflow, model có thể được gọi nhiều lần', 'Hệ thống có dùng tool thì có thể xem là agent', 'Trong agent, model chọn hành động tiếp theo lúc đang chạy'], answer: 2, explain: '"The tell isn\'t whether tools get used. Both use tools." Dùng tool không biến hệ thống thành agent.' },
    { q: 'Nhóm cần trích 5 trường từ các hóa đơn PDF có định dạng gần giống nhau. Theo bài học, nên bắt đầu từ đâu?', options: ['Một agent có tool OCR để tự xử lý mọi kiểu hóa đơn', 'Prompt chaining 5 bước, mỗi bước trích một trường', 'Routing theo nhà cung cấp, mỗi nhánh một prompt riêng', 'Một lần gọi model, kèm ngữ cảnh liên quan và vài ví dụ mẫu'], answer: 3, explain: '"Most of the time, a single call with good retrieval and a couple of examples already solves the problem. Start there."' },
    { q: 'Một việc có không gian mở, nhưng lần nào cũng đúng 3 bước và luôn dùng đúng một tool cố định. Theo hướng dẫn trong bài, nên chọn gì?', options: ['Workflow, vì chỉ có một tín hiệu bật', 'Agent, vì không gian mở là đủ để chọn agent', 'Agent, vì việc này có dùng tool', 'Multi-agent, để phòng khi việc mở rộng sau này'], answer: 0, explain: 'Bài học khuyên thường cần hơn một tín hiệu: "you usually want more than one before you commit". Số bước biết trước và tool cố định nghĩa là hai tín hiệu còn lại đều tắt.' },
    { q: 'Trợ lý nghiên cứu nhận câu hỏi bất kỳ, không biết trước cần tìm kiếm bao nhiêu lần, và phải tự chọn giữa tool tìm kiếm, máy tính và chạy code. Có bao nhiêu tín hiệu agent đang bật?', options: ['Một, vì chỉ riêng việc tự chọn tool mới là tín hiệu', 'Hai, vì số lần tìm kiếm không tính là tín hiệu', 'Ba tín hiệu đều bật', 'Không tín hiệu nào, vì tìm kiếm là việc lặp lại quen thuộc'], answer: 2, explain: 'Cả ba tín hiệu cùng bật. "When two or three light up together, that\'s your cue to build an agent."' },
    { q: 'Request đến rẽ nhánh nhiều kiểu, nhưng mọi nhánh đều thuộc 4 loại đã biết và mỗi loại có một cách xử lý cố định. Nên chọn gì?', options: ['Agent, vì request rẽ nhánh nhiều kiểu khác nhau', 'Routing workflow: phân loại rồi gửi tới bộ xử lý có sẵn', 'Parallelization: chạy cả 4 cách xử lý rồi chọn kết quả tốt nhất', 'Prompt chaining: đưa request qua lần lượt cả 4 bộ xử lý'], answer: 1, explain: 'Agent đáng dùng khi request "keeps branching in ways you can\'t script". Nhánh lập trình trước được thì routing là đủ.' },
    { q: 'Model hay bịa nội dung chính sách đổi trả của công ty. Khả năng nào của augmented language model nhắm đúng vấn đề này?', options: ['Memory', 'Tools', 'Parallelization', 'Retrieval'], answer: 3, explain: 'Retrieval đưa thông tin liên quan vào để model "answers from real information instead of guessing".' },
    { q: 'Trong một nhiệm vụ dài, model cần nhớ mình đã xử lý tới file nào. Khả năng nào phục vụ việc này?', options: ['Memory', 'Retrieval', 'Tools', 'Routing'], answer: 0, explain: 'Memory giúp model "carry state across a task". Routing là một hình dạng workflow, không phải khả năng của augmented LLM.' },
    { q: 'Câu nào đúng về quan hệ giữa augmented language model với workflow và agent?', options: ['Agent thay augmented LLM bằng một vòng lặp tự quyết định', 'Workflow chỉ cần model gốc, còn agent mới cần augmented LLM', 'Cả workflow lẫn agent đều được xây trên augmented LLM, không thay thế nó', 'Augmented LLM là một hình dạng workflow, giống routing'], answer: 2, explain: '"You build agents and workflows on top of this block, not instead of it."' },
    { q: 'Đặc điểm nào thuộc đầu "code quyết định" của trục kiểm soát?', options: ['Thích nghi được với những input không lường trước', 'Đọc source là thấy toàn bộ đường đi', 'Model chọn thứ tự dựa trên những gì nó quan sát được', 'Số bước tự điều chỉnh theo độ khó của từng input'], answer: 1, explain: 'Ở đầu này: "You can read the whole path in your source, top to bottom." Ba phương án còn lại thuộc đầu model quyết định.' },
    { q: 'Prototype một lần gọi model cho kết quả đúng 85% trên dữ liệu thử. Bước tiếp theo đúng tinh thần bài học là gì?', options: ['Chuyển ngay sang agent vì 85% chưa đạt yêu cầu production', 'Thêm voting 5 lần để đẩy độ chính xác lên cho chắc', 'Viết lại thành nhiều agent chuyên biệt cho từng loại lỗi', 'Đo trên dữ liệu thật rồi mới quyết định'], answer: 3, explain: '"Start with the plainest design that could work, measure it, and only climb the complexity ladder when the results demand it."' },
    { q: 'Chuỗi gồm bước 1 tạo dàn ý và bước 2 viết bài. Bạn muốn chặn dàn ý thiếu mục trước khi tốn tiền viết bài. Nên thêm gì?', options: ['Một bước kiểm tra (gate) giữa hai bước', 'Routing dàn ý theo chủ đề bài viết', 'Voting: tạo dàn ý 3 lần rồi lấy bản tốt', 'Chuyển bước 2 thành agent tự sửa dàn ý'], answer: 0, explain: 'Prompt chaining cho phép "add a simple check between steps to catch problems early".' },
    { q: 'Ba lời gọi model chạy cùng lúc trên một đoạn code: một lời gọi soát bảo mật, một soát hiệu năng, một soát phong cách. Đây là gì?', options: ['Parallelization kiểu voting, vì có nhiều lời gọi', 'Routing, vì mỗi lời gọi xử lý một loại vấn đề', 'Parallelization kiểu chia phần', 'Prompt chaining, vì cùng xử lý một đoạn code'], answer: 2, explain: 'Chia một việc thành các phần độc lập rồi chạy cùng lúc là sectioning. Voting là chạy cùng một việc nhiều lần rồi so sánh.' },
    { q: 'Chạy cùng một prompt phân loại nội dung độc hại 5 lần rồi lấy kết quả đa số. Đây là gì?', options: ['Parallelization kiểu chia phần', 'Parallelization kiểu voting', 'Routing', 'Một agent tự kiểm tra'], answer: 1, explain: 'Đó là "running the same task a few times and comparing results".' },
    { q: 'Trong routing, chính model là bên phân loại request. Vì sao routing vẫn là workflow?', options: ['Vì routing không cho model dùng tool nào cả', 'Vì routing chỉ gọi model đúng một lần cho mỗi request', 'Vì kết quả phân loại lần nào cũng giống hệt nhau', 'Vì code nắm các nhánh và đường đi'], answer: 3, explain: '"In all three, you defined the structure. The model fills in the reasoning, but your code still owns the path."' },
    { q: 'Pipeline gồm: kiểm tra input, nghiên cứu một chủ đề mở (không biết trước số bước), rồi định dạng báo cáo. Thiết kế phù hợp nhất là gì?', options: ['Workflow cố định, đặt một agent nhỏ ở riêng bước nghiên cứu', 'Biến toàn bộ pipeline thành một agent duy nhất', 'Workflow thuần, viết cứng các bước nghiên cứu', 'Routing để chọn chạy một trong ba bước'], answer: 0, explain: '"A common, powerful design wraps a small agent inside a single workflow stage", để phần cố định vẫn cố định.' },
    { q: 'Tech lead muốn dựng hệ thống nhiều agent cho một việc 2 bước cố định, vì "trông hiện đại hơn". Phản hồi đúng tinh thần bài học là gì?', options: ['Đồng ý, vì agent dễ mở rộng nếu sau này yêu cầu thay đổi', 'Đồng ý, nhưng giới hạn tối đa hai agent cho đỡ tốn', 'Chọn theo bài toán hiện tại: workflow là đủ', 'Dùng agent cho bước 1 và workflow cho bước 2 để cân bằng'], answer: 2, explain: '"Match the design to the task in front of you, not to the architecture you wish you were building."' },
    { q: 'Điều nào KHÔNG phải tín hiệu để chọn agent?', options: ['Không gian mở, không liệt kê trước được hướng đi', 'Hệ thống cần gọi tool', 'Không dự đoán được số hành động cần làm', 'Giá trị nằm ở việc model tự chọn tool nào, khi nào'], answer: 1, explain: 'Cần gọi tool thì workflow cũng làm được. Tín hiệu đúng là để model tự chọn tool, không phải bản thân việc dùng tool.' },
    { q: 'Một việc chỉ bật đúng tín hiệu "model tự chọn tool". Theo bài học, kết luận hợp lý nhất là gì?', options: ['Nên làm agent ngay vì đã có tín hiệu', 'Nên làm multi-agent', 'Không bao giờ được dùng agent cho việc này', 'Thường chưa đủ; hãy thử workflow trước'], answer: 3, explain: 'Thường cần từ hai tín hiệu trở lên. "Chưa đủ" không có nghĩa là "không bao giờ".' },
    { q: 'Thứ tự đúng khi một yêu cầu tính năng mới đến là gì?', options: ['Thử workflow trước, chỉ làm agent khi nó không đáp ứng được', 'Làm agent trước, đo kết quả, rồi đơn giản hóa thành workflow', 'Làm cả hai song song rồi so sánh để chọn cái tốt hơn', 'Hỏi người dùng muốn agent hay workflow rồi làm theo'], answer: 0, explain: '"Prove the workflow can\'t do the job before you pay for an agent."' },
    { q: 'Câu nào gần nhất với quan điểm của bài học về sự đơn giản?', options: ['Đơn giản phù hợp cho prototype, production thì cần phức tạp hơn', 'Nên bắt đầu đầy đủ tính năng rồi cắt bớt những phần thừa', 'Đơn giản là một ưu điểm thật sự, không phải sự nhượng bộ', 'Có đủ ngân sách thì agent luôn là lựa chọn tốt hơn'], answer: 2, explain: '"Simple is a feature, not a compromise."' },
    { q: 'Cặp định nghĩa nào chính xác nhất?', options: ['Workflow không gọi tool; agent thì gọi tool để hành động', 'Workflow: code nắm luồng; agent: model nắm luồng', 'Workflow gọi model một lần; agent gọi model nhiều lần liên tiếp', 'Workflow dùng model nhỏ cho rẻ; agent cần model lớn để suy luận'], answer: 1, explain: 'Hai bên khác nhau ở chỗ ai nắm luồng điều khiển, không phải ở số lần gọi, loại tool hay cỡ model.' },
    { q: 'Trong một agent, điều gì kết thúc vòng lặp?', options: ['Code chạy hết bước cuối cùng đã viết sẵn trong pipeline', 'Model đã gọi qua hết mọi tool trong danh sách', 'Người dùng xác nhận từng bước rồi bấm kết thúc', 'Model đánh giá việc đã xong nên không chọn hành động tiếp'], answer: 3, explain: 'Model chọn hành động tiếp theo "in a loop until the job is done". Chạy hết bước viết sẵn là cách workflow kết thúc.' },
    { q: 'Chatbot đặt lịch luôn làm theo trình tự: hỏi ngày, kiểm tra lịch qua tool, rồi xác nhận. Thiết kế phù hợp là gì?', options: ['Workflow kiểu prompt chaining', 'Agent, vì có tool kiểm tra lịch', 'Agent, vì phải trò chuyện với người dùng', 'Parallelization kiểu voting'], answer: 0, explain: 'Viết được các bước theo thứ tự, và cùng loại input luôn đi cùng một đường: workflow là đủ.' },
    { q: 'Việc nào hợp với agent nhất?', options: ['Dịch email sang 3 ngôn ngữ cố định rồi gửi cho 3 nhóm', 'Phân loại ticket vào 5 nhóm có sẵn rồi gửi tới đúng nhóm', 'Tái cấu trúc một repo lạ, chưa biết trước phải sửa những file nào', 'Tóm tắt biên bản họp theo mẫu có sẵn của công ty'], answer: 2, explain: 'Tái cấu trúc repo lạ có không gian mở, không biết số bước, và model phải tự chọn đọc, chạy, sửa cái gì.' },
    { q: 'Hệ thống phải cho ra hành vi giống hệt nhau ở mọi lần chạy để qua kiểm thử hồi quy. Nên đặt thiết kế ở đâu trên trục kiểm soát?', options: ['Gần đầu model quyết định', 'Gần đầu code quyết định', 'Chính giữa trục', 'Trục không liên quan tới yêu cầu này'], answer: 1, explain: '"A fixed path is predictable and easy to test because it does the same thing every time."' },
    { q: 'Hệ thống phải xử lý những input rất đa dạng mà nhóm không thể lường trước. Đầu nào của trục kiểm soát phù hợp hơn?', options: ['Đầu code quyết định, vì dễ test và dễ đoán hơn', 'Không đầu nào, chỉ routing mới xử lý được input đa dạng', 'Đầu code quyết định, thêm nhiều nhánh if-else cho đủ trường hợp', 'Đầu model quyết định, vì thích nghi được với input không lường trước'], answer: 3, explain: '"A model-driven path is flexible because it can adapt to inputs you didn\'t anticipate."' },
    { q: 'Theo bài học, câu hỏi đầu tiên nên đặt ra khi nhận một yêu cầu tính năng là gì?', options: ['Một workflow cố định có làm được không?', 'Cần bao nhiêu agent để chia nhỏ việc này?', 'Model nào mạnh nhất hiện nay cho việc này?', 'Cần khai báo những tool nào cho agent?'], answer: 0, explain: '"Run the cheap test first. Ask whether a deterministic workflow could handle it before you reach for a loop."' },
    { q: 'Vì sao bài học gọi agent là "lựa chọn đắt"?', options: ['Vì agent bắt buộc phải dùng model lớn và đắt nhất', 'Vì agent phải thuê hạ tầng riêng để chạy vòng lặp', 'Vì mỗi lượt thêm tốn token và thời gian', 'Vì mỗi tool agent dùng đều bị tính phí theo lần gọi'], answer: 2, explain: '"Every extra turn spends tokens and adds latency."' },
    { q: 'Câu nào mô tả đúng nhất vai trò của model trong workflow?', options: ['Quyết định thứ tự các bước để tối ưu kết quả cuối', 'Điền nội dung cho từng bước', 'Chọn khi nào dừng dựa trên chất lượng kết quả', 'Không tham gia gì, mọi bước do code tự chạy'], answer: 1, explain: '"The steps run in a fixed order you laid out in code, and the model just fills in each step."' },
  ],
};
