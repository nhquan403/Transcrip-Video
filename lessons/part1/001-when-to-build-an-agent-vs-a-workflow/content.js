window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Có hai cách để dùng AI làm việc. <strong>Workflow</strong>: bạn viết sẵn các bước, AI chỉ làm từng bước.
<strong>Agent</strong>: bạn giao mục tiêu, AI tự quyết định làm gì tiếp theo. Hãy luôn thử cách đơn giản trước, chỉ dùng agent khi thật sự cần.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Model:</strong> chính là AI (ví dụ Claude), thứ đọc chữ và viết chữ.</li>
  <li><strong>Tool:</strong> một "công cụ" bạn cho AI dùng, như tra cơ sở dữ liệu, đọc file, gửi email.</li>
  <li><strong>Workflow:</strong> quy trình mà <em>bạn</em> viết sẵn thứ tự các bước.</li>
  <li><strong>Agent:</strong> AI được tự quyết định bước tiếp theo, cứ làm, xem kết quả, rồi làm tiếp cho tới khi xong.</li>
</ul>

<h3>Workflow và agent khác nhau chỗ nào?</h3>
<div class="box">🍳 <strong>Hình dung thế này:</strong> Workflow giống <strong>công thức nấu ăn</strong> in sẵn: bước 1 rửa rau, bước 2 xào, bước 3 nêm. Đầu bếp (AI) chỉ làm theo.
Agent giống bạn nói với đầu bếp: <strong>"nấu giúp tôi bữa tối"</strong>. Đầu bếp tự mở tủ lạnh, tự chọn món, nếm thử rồi điều chỉnh.</div>
<p>Chỉ có <strong>một câu hỏi</strong> để phân biệt: <strong>ai quyết định bước tiếp theo?</strong></p>
<ul>
  <li>Code của bạn quyết định: đó là <strong>workflow</strong>.</li>
  <li>AI tự quyết định trong lúc chạy: đó là <strong>agent</strong>.</li>
</ul>
<p>⚠️ <strong>Hiểu nhầm hay gặp:</strong> "Có dùng tool thì là agent". <strong>Sai.</strong> Workflow cũng dùng tool được. Dùng tool hay không không quan trọng; quan trọng là ai cầm lái.</p>

<h3>Nền móng chung: AI được "gắn thêm đồ"</h3>
<p>Cả workflow lẫn agent đều dựa trên một AI được gắn thêm ba thứ (bài học gọi là <em>augmented language model</em>):</p>
<ul>
  <li><strong>Tra cứu (retrieval):</strong> đưa tài liệu thật cho AI đọc, để nó trả lời dựa trên dữ liệu chứ không đoán.</li>
  <li><strong>Công cụ (tools):</strong> cho AI làm việc thật, như tra đơn hàng hay tạo ticket.</li>
  <li><strong>Trí nhớ (memory):</strong> giúp AI nhớ mình đang làm tới đâu trong một việc dài.</li>
</ul>
<p>💡 Rất nhiều việc chỉ cần <strong>hỏi AI một lần</strong>, kèm tài liệu và vài ví dụ mẫu, là xong. Đừng vội làm phức tạp.</p>

<h3>Một thanh trượt: ai cầm lái?</h3>
<p>Hãy tưởng tượng một thanh trượt. Đầu trái: <strong>code cầm lái hoàn toàn</strong>. Đầu phải: <strong>AI cầm lái hoàn toàn</strong>.</p>
<ul>
  <li>Càng về phía code: <strong>dễ đoán, dễ kiểm tra</strong>, vì lần nào cũng chạy y như nhau.</li>
  <li>Càng về phía AI: <strong>linh hoạt</strong>, xử lý được cả những tình huống bạn không lường trước.</li>
</ul>
<p>Mỗi khi thiết kế, hãy hỏi: hệ thống của mình nên nằm ở đâu trên thanh trượt này?</p>

<h3>Vì sao nên bắt đầu đơn giản?</h3>
<p>Vì agent <strong>đắt</strong>: mỗi lần AI "nghĩ thêm một bước" là tốn thêm tiền và thêm thời gian chờ.
Cách làm đúng: làm phiên bản đơn giản nhất, <strong>đo xem nó tốt tới đâu</strong>, rồi chỉ thêm độ phức tạp khi kết quả cho thấy thật sự cần.
Đơn giản không phải là làm ẩu; đơn giản là một <strong>ưu điểm</strong>.</p>

<h3>Khi nào thì nên dùng agent?</h3>
<p>Có <strong>3 dấu hiệu</strong>. Thường cần thấy <strong>từ 2 dấu hiệu trở lên</strong>:</p>
<ul>
  <li><strong>Việc mở:</strong> có thể rẽ theo nhiều hướng, bạn không liệt kê trước được.</li>
  <li><strong>Không biết trước cần mấy bước.</strong></li>
  <li><strong>Cần AI tự chọn công cụ</strong> nào và lúc nào.</li>
</ul>
<p>🧪 <strong>Phép thử nhanh:</strong> Bạn có viết được các bước ra giấy theo thứ tự không? Cùng một đầu vào có luôn đi cùng một đường không?
Nếu cả hai đều "có" thì workflow là đủ.</p>

<h3>Ba kiểu workflow hay dùng</h3>
<ul>
  <li><strong>Nối chuỗi (prompt chaining):</strong> bước sau dùng kết quả bước trước. Ví dụ: viết dàn ý, kiểm tra dàn ý, rồi viết bài. Có thể chèn một bước kiểm tra ở giữa để bắt lỗi sớm.</li>
  <li><strong>Phân loại rồi chuyển (routing):</strong> như lễ tân: đọc yêu cầu, xếp loại, rồi chuyển cho đúng bộ phận.</li>
  <li><strong>Làm song song (parallelization):</strong> chia việc thành nhiều phần làm cùng lúc, hoặc làm cùng một việc vài lần rồi so kết quả.</li>
</ul>
<p>Cả ba vẫn là workflow, vì <strong>code nắm đường đi</strong>; AI chỉ lo phần suy nghĩ ở mỗi bước.</p>

<h3>Không cần chọn một kiểu cho cả hệ thống</h3>
<p>Cách hay nhất thường là <strong>kết hợp</strong>: phần lớn hệ thống là workflow cố định, chỉ riêng một bước thật sự mở thì đặt một agent nhỏ vào đó.
Phần cần chắc chắn thì vẫn chắc chắn, chỉ phần cần linh hoạt mới để AI tự quyết.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Workflow: code quyết định thứ tự. Agent: AI tự quyết định bước tiếp theo.</li>
  <li>Dùng tool không có nghĩa là agent.</li>
  <li>Bắt đầu đơn giản; chỉ dùng agent khi có từ 2 dấu hiệu trở lên.</li>
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
<p>Mở <code>java-app/src/main/java/part1/lesson01/Lesson01.java</code>. Có 5 bài: chọn workflow hay agent theo số tín hiệu,
viết prompt chaining có gate, routing, parallelization, và một vòng lặp agent có giới hạn số bước.
Chấm bài bằng <code>./mvnw -q compile exec:java -Dexec.args="p1-01"</code> (xem hướng dẫn trong <code>docs/java-app.md</code>).</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p1-01 --live"</code> (cần API key): Claude viết đoạn văn qua prompt chain, phân loại ticket, dịch song song, và tự chọn tool trong vòng lặp agent của bạn.</p>
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
