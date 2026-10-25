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
    { q: "Theo bài học, điểm khác biệt cốt lõi giữa workflow và agent là gì?", options: ["Agent dùng tool, còn workflow thì không","Ai sở hữu quyết định bước tiếp theo","Agent luôn dùng model lớn hơn workflow","Workflow không gọi model, agent thì có"], answer: 1, explain: "\"The real question is who owns the next decision.\" Cả hai đều có thể dùng tool và gọi model." },
    { q: "Trong một workflow, ai viết luồng điều khiển (control flow)?", options: ["Model tự quyết định lúc chạy","Người dùng cuối chọn từng bước","Lập trình viên viết sẵn trong code","Các tool tự sắp xếp thứ tự"], answer: 2, explain: "\"In a workflow, you write the control flow.\" Các bước chạy theo thứ tự cố định bạn đã viết trong code." },
    { q: "Trong workflow, model đóng vai trò gì?", options: ["Làm phần việc bên trong từng bước","Quyết định thứ tự các bước","Quyết định khi nào dừng vòng lặp","Tự chọn tool cho bước tiếp theo"], answer: 0, explain: "\"The model just fills in each step.\" Thứ tự các bước do code quyết định." },
    { q: "Vòng lặp của một agent gồm những gì?", options: ["Chạy một lần duy nhất rồi trả kết quả","Đọc file cấu hình rồi chạy các bước theo thứ tự cố định","Chờ người dùng chọn bước tiếp theo","Suy luận, gọi tool, xem kết quả, chọn hành động tiếp theo, lặp lại tới khi xong"], answer: 3, explain: "\"It reasons, calls a tool, looks at the result, and chooses the following action in a loop until the job is done.\"" },
    { q: "Câu nào đúng về việc dùng tool?", options: ["Chỉ agent mới dùng tool","Chỉ workflow mới dùng tool","Cả workflow và agent đều dùng tool","Hệ thống dùng tool thì chắc chắn là agent"], answer: 2, explain: "\"The tell isn't whether tools get used. Both use tools.\"" },
    { q: "Nếu code của bạn quyết định bước tiếp theo, hệ thống đó là gì?", options: ["Workflow","Agent","Multi-agent","Không phải cả hai"], answer: 0, explain: "\"If your code owns it, that's a workflow. If the model owns it at runtime, that's an agent.\"" },
    { q: "Anthropic gọi khối xây dựng chung của workflow và agent là gì?", options: ["Base model","Augmented language model","Agentic loop","Orchestrator"], answer: 1, explain: "\"Anthropic calls it the augmented language model\", tức model được tăng cường thêm vài khả năng." },
    { q: "Ba khả năng được thêm vào augmented language model là gì?", options: ["Fine-tuning, prompt, temperature","Vision, audio, video","Routing, chaining, parallelization","Retrieval, tools, memory"], answer: 3, explain: "Retrieval để lấy ngữ cảnh, tools để hành động, memory để nhớ trạng thái. Routing, chaining và parallelization là các hình dạng workflow." },
    { q: "Retrieval giúp model điều gì?", options: ["Trả lời dựa trên thông tin thật thay vì đoán","Chạy nhanh hơn","Tự chọn tool tốt hơn","Nhớ cuộc trò chuyện giữa nhiều ngày"], answer: 0, explain: "Retrieval là \"pulling in relevant context so the model answers from real information instead of guessing\"." },
    { q: "Memory trong augmented language model dùng để làm gì?", options: ["Lưu trọng số của model","Cache kết quả để giảm chi phí","Mang trạng thái qua suốt một nhiệm vụ","Ghi log để debug"], answer: 2, explain: "\"Memory, so it can carry state across a task.\"" },
    { q: "Theo bài, trong phần lớn trường hợp bạn nên bắt đầu từ đâu?", options: ["Một agent có nhiều tool","Một lần gọi model với retrieval tốt và vài ví dụ","Một hệ thống multi-agent","Fine-tune một model riêng"], answer: 1, explain: "\"Most of the time, a single call with good retrieval and a couple of examples already solves the problem. Start there.\"" },
    { q: "Mọi hệ thống agentic đều nằm ở đâu đó trên một trục. Trục đó là gì?", options: ["Chi phí","Tốc độ","Kích thước model","Quyền kiểm soát (control)"], answer: 3, explain: "\"Every agentic system sits somewhere on one axis, and that axis is control.\"" },
    { q: "Ưu điểm chính của đường đi cố định (fixed path) là gì?", options: ["Dễ đoán và dễ test vì lần nào cũng chạy giống nhau","Xử lý được mọi input bất ngờ","Tự thích nghi khi môi trường thay đổi","Không cần viết code"], answer: 0, explain: "\"A fixed path is predictable and easy to test because it does the same thing every time.\"" },
    { q: "Ưu điểm chính của đường đi do model điều khiển (model-driven path) là gì?", options: ["Rẻ hơn","Dễ test hơn","Linh hoạt, thích nghi được với input không lường trước","Luôn cho cùng một kết quả"], answer: 2, explain: "\"A model-driven path is flexible because it can adapt to inputs you didn't anticipate.\"" },
    { q: "Vì sao bài học gọi agent là \"lựa chọn đắt\" (the expensive option)?", options: ["Vì phải mua license riêng","Vì mỗi vòng lặp thêm tốn token và thêm độ trễ","Vì agent cần GPU riêng","Vì agent không chạy được trên cloud"], answer: 1, explain: "\"Every extra turn spends tokens and adds latency.\"" },
    { q: "Khi nào bạn nên leo lên \"nấc thang độ phức tạp\" (complexity ladder)?", options: ["Ngay từ đầu, để hệ thống trông ấn tượng","Khi có thêm ngân sách","Khi đồng nghiệp đề xuất","Khi kết quả đo được cho thấy cần thiết"], answer: 3, explain: "\"Start with the plainest design that could work, measure it, and only climb the complexity ladder when the results demand it.\"" },
    { q: "Câu \"Simple is a feature, not a compromise\" có ý nghĩa gì?", options: ["Sự đơn giản là một ưu điểm thật sự, không phải sự thỏa hiệp","Tính năng đơn giản thì không cần test","Nên bỏ bớt tính năng để code ngắn hơn","Thỏa hiệp là cách tốt để làm phần mềm"], answer: 0, explain: "Thiết kế đơn giản mang lại tính dễ đoán, chi phí thấp, dễ test. Đó là lợi ích, không phải điều phải chịu đựng." },
    { q: "Ba tín hiệu cho thấy nên dùng agent là gì?", options: ["Có nhiều dữ liệu, có nhiều tool, có nhiều người dùng","Cần chạy nhanh, cần rẻ, cần dễ test","Không gian mở, không biết trước số bước, model tự chọn tool","Có retrieval, có memory, có tools"], answer: 2, explain: "Open-ended space, unknown steps, model chooses tools." },
    { q: "Nên có bao nhiêu tín hiệu trước khi quyết định xây agent?", options: ["Chỉ cần một là đủ","Thường là từ hai trở lên","Phải đủ cả ba, không ngoại lệ","Không cần tín hiệu nào"], answer: 1, explain: "\"You usually want more than one before you commit... When two or three light up together, that's your cue to build an agent.\"" },
    { q: "Tình huống: mỗi email đến được phân loại thành \"hóa đơn\", \"khiếu nại\" hoặc \"khác\", rồi chuyển cho bộ phận tương ứng. Thiết kế phù hợp nhất là gì?", options: ["Agent tự do","Prompt chaining","Parallelization","Routing workflow"], answer: 3, explain: "Routing phân loại request rồi gửi tới handler chuyên trách, giống ví dụ \"sorting support tickets by type\"." },
    { q: "Tình huống: dịch một bài viết sang tiếng Anh, kiểm tra độ dài bản dịch, rồi tóm tắt bản dịch. Thiết kế phù hợp nhất là gì?", options: ["Prompt chaining","Routing","Agent tự do","Parallelization kiểu voting"], answer: 0, explain: "Chuỗi bước cố định, mỗi bước dùng output của bước trước, có bước kiểm tra ở giữa: đúng là prompt chaining." },
    { q: "Tình huống: cho model review cùng một đoạn code 3 lần độc lập rồi so sánh kết quả để giảm sai sót. Thiết kế này là gì?", options: ["Routing","Prompt chaining","Parallelization (chạy cùng việc nhiều lần rồi so sánh)","Agent"], answer: 2, explain: "Parallelization có kiểu \"running the same task a few times and comparing results\"." },
    { q: "Tình huống: sửa một bug chưa rõ nguyên nhân trong codebase lớn, phải đọc file, chạy test, thử sửa, chạy lại, và không biết trước cần bao nhiêu bước. Nên chọn gì?", options: ["Prompt chaining","Agent","Routing","Một lần gọi model duy nhất"], answer: 1, explain: "Không biết trước số bước, không gian mở, model cần tự chọn tool: cả ba tín hiệu cùng bật nên đây là việc của agent." },
    { q: "\"Bài test rẻ\" trước khi làm agent gồm hai câu hỏi nào?", options: ["Có đủ tiền không? Có đủ người không?","Model có đủ lớn không? Có đủ tool không?","Người dùng có thích không? Có đối thủ nào làm chưa?","Viết được các bước theo thứ tự không? Cùng input có luôn đi cùng đường không?"], answer: 3, explain: "\"Can you write the steps out in order? Does the same input always take the same path? If yes, a workflow is almost certainly enough.\"" },
    { q: "Trong prompt chaining, bước kiểm tra đơn giản đặt giữa các bước dùng để làm gì?", options: ["Bắt lỗi sớm","Làm model chạy nhanh hơn","Để model tự chọn bước tiếp theo","Giảm số token đầu vào"], answer: 0, explain: "\"You can even add a simple check between steps to catch problems early.\"" },
    { q: "Thiết kế lai (hybrid) được bài học khuyến khích là gì?", options: ["Viết lại toàn bộ hệ thống thành agent","Chạy hai hệ thống song song rồi chọn cái tốt hơn","Đặt một agent nhỏ bên trong một bước của workflow","Dùng hai model khác nhau cho mỗi bước"], answer: 2, explain: "\"A common, powerful design wraps a small agent inside a single workflow stage\", để phần cố định vẫn cố định." },
    { q: "Trong cả ba hình dạng workflow, ai định nghĩa cấu trúc?", options: ["Model","Bạn, qua code; model chỉ lo phần suy luận","Người dùng cuối","Không ai"], answer: 1, explain: "Code vẫn nắm đường đi, nên các workflow này dễ đoán." },
    { q: "Nhiều việc trông có vẻ cần agent thực ra là gì?", options: ["Một hệ thống multi-agent","Một model được fine-tune","Một chuỗi lời gọi model cố định cộng thêm chút code nối","Một server tool"], answer: 2, explain: "Hãy chứng minh workflow không làm được rồi mới trả tiền cho agent." },
    { q: "Khi viết nhiệm vụ ra thành chuỗi bước mà không liệt kê được, hoặc request cứ rẽ nhánh theo kiểu không lập trình trước được, thì sao?", options: ["Nên bỏ nhiệm vụ đó","Nên dùng routing","Nên viết thêm code","Đó là lúc agent đáng với chi phí bỏ ra"], answer: 3, explain: "Agent xứng đáng khi các bước không thể liệt kê trước." },
    { q: "Thiết kế nên dựa theo điều gì?", options: ["Bài toán trước mặt","Kiến trúc mình mơ ước","Công nghệ mới nhất","Thứ đồng nghiệp đang dùng"], answer: 0, explain: "Khớp thiết kế với bài toán, không phải với kiến trúc mình muốn xây." },
  ],
};
