window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Không ai viết code được từ một mong muốn chung chung như "xử lý ticket nhanh gấp đôi".
Bạn phải đi ba bước: <strong>nhu cầu kinh doanh</strong> → <strong>yêu cầu chức năng</strong> (đầu vào nào, đầu ra nào) →
<strong>tiêu chí nghiệm thu</strong> (điều kiện cụ thể để kiểm tra đạt hay không). Sau đó chọn cách đơn giản nhất để Claude làm việc đó.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Business need (nhu cầu kinh doanh):</strong> kết quả mà người đặt hàng thật sự muốn, ví dụ giảm một nửa thời gian phân loại ticket. Có giá trị, nhưng chưa nói app phải làm gì.</li>
  <li><strong>Functional requirement (yêu cầu chức năng):</strong> một hành vi cụ thể của app, viết dưới dạng "đưa vào cái này, nhận lại cái kia".</li>
  <li><strong>Acceptance criteria (tiêu chí nghiệm thu):</strong> các điều kiện cụ thể chứng minh yêu cầu đã đạt. Lập trình viên code theo chúng, QA kiểm tra từng cái.</li>
  <li><strong>Capability (năng lực):</strong> một việc người dùng <strong>nhìn thấy</strong> app làm, ví dụ "phân loại ticket".</li>
  <li><strong>Tier (mức):</strong> cách Claude làm một capability: một lần gọi, workflow, hoặc agent.</li>
</ul>

<h3>Ba bước từ mong muốn đến thứ kiểm tra được</h3>
<div class="box">🏠 <strong>Hình dung thế này:</strong> Khách nói với kiến trúc sư "tôi muốn một ngôi nhà ấm cúng". Đó là <strong>nhu cầu</strong>.
Kiến trúc sư chuyển thành "phòng khách 25m², cửa sổ hướng nam". Đó là <strong>yêu cầu</strong>.
Khi nghiệm thu, người ta đo: "phòng đúng 25m², cửa sổ đúng hướng nam". Đó là <strong>tiêu chí nghiệm thu</strong>.
Không ai đo được "ấm cúng", nhưng ai cũng đo được 25m².</div>
<p>Đi từ trái sang phải, mỗi bước lại <strong>dễ kiểm tra hơn</strong> bước trước.</p>

<h3>Đi theo thứ tự: kết quả → capability → lần gọi Claude</h3>
<ol>
  <li><strong>Viết ra kết quả</strong> mà doanh nghiệp muốn, bằng lời thường.</li>
  <li><strong>Tách kết quả thành các capability</strong> người dùng nhìn thấy. Với mục tiêu phân loại ticket: phân loại, chuyển đúng bộ phận, soạn câu trả lời nháp.</li>
  <li><strong>Gắn mỗi capability với một lần làm việc với Claude</strong>.</li>
</ol>
<p>Đi đúng thứ tự này thì mọi yêu cầu đều <strong>truy ngược được về một nhu cầu thật</strong>, và bạn không xây những tính năng "thông minh" mà chẳng ai yêu cầu.</p>

<h3>Cảm giác khác với hành vi</h3>
<ul>
  <li><strong>Ý định kinh doanh</strong> là cảm giác: nhanh, đáng tin, dễ dùng. Nó định hướng thiết kế nhưng chưa code hay test được.</li>
  <li><strong>Hành vi chức năng</strong> là hợp đồng: "trả về một object JSON hợp lệ gồm tên, email và gói dịch vụ của người gọi".</li>
</ul>
<p>Việc của bạn: <strong>nghe</strong> cảm giác, <strong>tôn trọng</strong> nó, rồi <strong>dịch</strong> nó thành hành vi cụ thể.</p>

<h3>Tách capability thế nào cho đúng?</h3>
<ul>
  <li>Đi qua trải nghiệm của người dùng, liệt kê từng việc họ <strong>thấy</strong> app làm.</li>
  <li>Mỗi mục phải <strong>chỉ tay vào được</strong>, không phải chuyện bên trong như "gọi model nào".</li>
  <li>Mỗi capability đủ nhỏ để <strong>một lần làm việc với Claude</strong> đáp ứng được. Thấy quá to để test một lần thì tách tiếp.</li>
</ul>

<h3>Ba mức Claude có thể làm</h3>
<ul>
  <li><strong>Một lần gọi (single call):</strong> một yêu cầu vào, một câu trả lời ra. Đủ cho rất nhiều việc: phân loại, tóm tắt, trích xuất, hỏi đáp.</li>
  <li><strong>Workflow:</strong> chuỗi bước cố định do bạn viết sẵn trong code. Đường đi được quyết định lúc thiết kế.</li>
  <li><strong>Agent:</strong> vòng lặp mở, model tự chọn bước tiếp theo lúc đang chạy cho tới khi xong.</li>
</ul>
<p>Càng lên cao càng mạnh, nhưng cũng <strong>càng đắt và càng phức tạp</strong>.</p>

<h3>Quy tắc vàng: chọn mức đơn giản nhất đủ dùng</h3>
<div class="box">🪜 <strong>Hình dung thế này:</strong> Leo thang từ bậc thấp nhất. Một lần gọi làm được chưa? Chưa thì workflow làm được chưa?
Chỉ khi cả hai thật sự không đủ mới leo lên agent. Hãy để <strong>yêu cầu</strong> đẩy bạn lên, không phải sự hào hứng với agent.</div>
<p>Mức đơn giản rẻ hơn, nhanh hơn, và dễ test hơn nhiều vì hành vi của nó đoán trước được.</p>

<h3>Bốn câu hỏi trước khi chọn agent</h3>
<ol>
  <li><strong>Độ phức tạp:</strong> việc có thật sự nhiều bước và khó viết sẵn kịch bản không, hay workflow cố định làm được?</li>
  <li><strong>Giá trị:</strong> kết quả có xứng với chi phí cao hơn và phản hồi chậm hơn của agent không?</li>
  <li><strong>Khả thi:</strong> Claude có thật sự làm được việc mở như bạn tưởng tượng không?</li>
  <li><strong>Giá của lỗi:</strong> nếu agent đi sai một bước, có sửa lại được không, hay là thảm họa?</li>
</ol>
<p>Chỉ cần <strong>một câu yếu</strong> là nên làm ở mức đơn giản hơn. Phải <strong>đạt cả bốn</strong> mới xứng đáng dùng agent.</p>

<h3>Cái bẫy: hạ tầng đội lốt hành vi</h3>
<p>Người đặt hàng nói "app chậm quá", bạn viết yêu cầu "làm Claude trả lời nhanh hơn". Nghe như hành vi, nhưng <strong>không phải</strong>.
Thứ thật sự quyết định là <strong>ngân sách độ trễ</strong>, <strong>vùng đặt server</strong>, hoặc <strong>giới hạn thông lượng</strong>.
Sửa câu chữ trong prompt không giải quyết được những thứ đó; chúng được giải quyết trong <strong>kiến trúc</strong> và thuộc về yêu cầu hạ tầng (bài 003).</p>
<p>🧪 Khi một yêu cầu có "mùi" tốc độ, chi phí, hay sức chứa, hãy hỏi: "Đây là một hành vi, hay là một ràng buộc vận hành đang đội lốt?"</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Nhu cầu → yêu cầu → tiêu chí nghiệm thu; mỗi yêu cầu phải truy ngược được về một nhu cầu.</li>
  <li>Luôn bắt đầu từ mức đơn giản nhất; agent phải vượt qua cả bốn câu hỏi.</li>
  <li>Yêu cầu về tốc độ, chi phí, sức chứa thường là hạ tầng đội lốt, không sửa bằng prompt.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">You can't code against a goal</em>: không thể viết code dựa trên một mục tiêu chung chung.</li>
  <li><em class="en">trace a business need down to a testable spec</em>: lần từ nhu cầu kinh doanh xuống một đặc tả kiểm thử được.</li>
  <li><em class="en">keep them straight</em>: phân biệt rõ, không nhầm lẫn.</li>
  <li><em class="en">keeps a project honest</em>: giữ cho dự án đi đúng hướng, không tự lừa mình.</li>
  <li><em class="en">user-observable capabilities</em>: những năng lực người dùng quan sát được.</li>
  <li><em class="en">trips up a lot of specs</em>: làm nhiều bản đặc tả bị vấp.</li>
  <li><em class="en">One is a feeling, the other is a contract</em>: một bên là cảm giác, bên kia là hợp đồng.</li>
  <li><em class="en">saves you the most grief</em>: giúp bạn đỡ khổ nhất.</li>
  <li><em class="en">reach for the simplest tier</em>: dùng tới mức đơn giản nhất.</li>
  <li><em class="en">hides in plain sight</em>: nằm ngay trước mắt mà không ai để ý.</li>
  <li><em class="en">wearing a disguise</em>: đang đội lốt.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson01/Lesson01.java</code>. Có 4 bài: liệt kê các check agent không đạt, chọn tier đơn giản nhất,
tìm yêu cầu không truy về được nhu cầu kinh doanh, và nhận ra yêu cầu hạ tầng đội lốt hành vi.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-01"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-01 --live"</code>: Claude tách nhu cầu "giảm một nửa thời gian phân loại ticket"
thành các capability kèm hợp đồng đầu vào/đầu ra, code của bạn chọn tier cho từng cái và bắt được tính năng thừa; sau đó so cách bạn
phân loại các câu của người đặt hàng (hành vi hay hạ tầng) với nhận xét của Claude.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Người đặt hàng nói: "Chúng tôi muốn giảm một nửa thời gian phân loại ticket." Câu này thuộc loại nào?', options: ['Functional requirement', 'Business need', 'Acceptance criterion', 'Infrastructure requirement'], answer: 1, explain: 'Đó là kết quả người đặt hàng muốn, có giá trị thật nhưng "names no behavior", nên chưa code được.' },
    { q: 'Câu nào là functional requirement đúng nghĩa?', options: ['Ứng dụng phải mang lại cảm giác đáng tin cậy cho mọi khách hàng', 'Giảm 50% thời gian xử lý ticket trong quý này', 'Nhận nội dung ticket, trả về một nhãn trong {billing, bug, account}', 'Claude phải trả lời nhanh hơn hẳn so với phiên bản hiện tại'], answer: 2, explain: 'Yêu cầu chức năng là "a specific behavior your application delivers, written as an input and the output you expect back".' },
    { q: 'Thứ tự đúng để đi từ nhu cầu đến thứ kiểm tra được là gì?', options: ['Tiêu chí nghiệm thu → yêu cầu → nhu cầu', 'Nhu cầu → tiêu chí nghiệm thu → yêu cầu', 'Yêu cầu → nhu cầu → tiêu chí nghiệm thu', 'Nhu cầu → yêu cầu → tiêu chí nghiệm thu'], answer: 3, explain: '"Need, requirement, criteria. You move left to right and each step gets more testable than the last."' },
    { q: 'Acceptance criteria cần được viết sao cho đạt điều gì?', options: ['Lập trình viên code thẳng theo được và QA kiểm tra được từng cái', 'Người đặt hàng đọc thấy hào hứng và đồng ý ký duyệt', 'Mô tả chi tiết prompt và model sẽ dùng để gọi Claude', 'Ngắn gọn trong một câu để người đặt hàng dễ nhớ'], answer: 0, explain: 'Tiêu chí được viết "so a developer can code straight to them and QA can verify each one".' },
    { q: 'Theo bài học, sau khi viết ra kết quả kinh doanh bằng lời thường, bước TIẾP THEO là gì?', options: ['Chọn model phù hợp và viết ngay prompt đầu tiên để thử', 'Tách kết quả thành các capability người dùng quan sát được', 'Gắn ngay mỗi kết quả với một agent riêng để tự xử lý', 'Viết test tự động đo kết quả kinh doanh đó hằng tuần'], answer: 1, explain: '"Then break that outcome into user-observable capabilities, the things a user would see the app do." Gắn với lần gọi Claude là bước cuối.' },
    { q: 'Với mục tiêu phân loại ticket, ví dụ capability nào được nêu trong bài?', options: ['Chọn model rẻ, bật prompt cache, đặt timeout cho API', 'Đọc database, gọi API, ghi log', 'Phân loại ticket, chuyển đúng nơi, soạn câu trả lời nháp', 'Huấn luyện lại model, đánh giá offline, triển khai bản mới'], answer: 2, explain: '"For a triage goal, that might be classify the ticket, route it, and draft a reply."' },
    { q: 'Đi theo thứ tự "kết quả trước, capability sau, lần gọi Claude cuối" giúp tránh điều gì?', options: ['Tránh phải viết acceptance criteria cho từng capability', 'Tránh phải chọn giữa workflow và agent ở từng bước', 'Tránh trả phí token cho các lần gọi thử nghiệm ban đầu', 'Tránh xây tính năng hay ho mà không ai yêu cầu'], answer: 3, explain: '"Your scope stays tied to real value and you avoid building clever features nobody asked for."' },
    { q: 'Một danh sách capability có mục "gọi Opus với temperature thấp". Vấn đề là gì?', options: ['Đó là chi tiết bên trong, người dùng không nhìn thấy', 'Thiếu số liệu đo được kèm theo, nên QA chưa kiểm tra được', 'Opus quá đắt cho một việc đơn giản như phân loại ticket', 'Capability phải luôn bắt đầu bằng động từ tiếng Anh'], answer: 0, explain: 'Capability phải "observable, something a person could point at, not internal plumbing like which model you called".' },
    { q: '"Sản phẩm phải nhanh, đáng tin, dễ dùng." Đây là gì theo bài học?', options: ['Acceptance criteria đầy đủ, chỉ cần giao cho QA kiểm tra', 'Ý định kinh doanh, chưa phải hành vi để build hay test', 'Functional behavior có thể giao cho QA', 'Yêu cầu hạ tầng đã có đủ số liệu đo đạc cụ thể'], answer: 1, explain: '"Business intent is how the product should feel... it doesn\'t yet name a behavior you can build or test."' },
    { q: 'Câu tóm gọn sự khác nhau giữa ý định và hành vi trong bài là gì?', options: ['Một bên là chi phí, một bên là lợi ích', 'Một bên cho người dùng, một bên cho máy', 'Một bên là cảm giác, một bên là hợp đồng', 'Một bên là bản nháp, một bên là bản cuối'], answer: 2, explain: '"One is a feeling, the other is a contract."' },
    { q: 'Vai trò của "cảm giác" (fast, trustworthy...) trong đặc tả là gì?', options: ['Bỏ hẳn khỏi đặc tả vì không đo được bằng con số nào', 'Ghi nguyên văn vào acceptance criteria để QA tự đánh giá', 'Chuyển hết sang yêu cầu hạ tầng để đội vận hành xử lý', 'Định hướng thiết kế; hành vi mới là thứ để code và giao QA'], answer: 3, explain: '"Feelings guide the design. Behaviors are what you actually write code against and hand to QA."' },
    { q: 'Một capability quá lớn để kiểm tra trong một lần. Nên làm gì?', options: ['Tách nhỏ tiếp', 'Chuyển nó sang agent', 'Bỏ acceptance criteria cho capability đó', 'Gộp với capability khác cho gọn'], answer: 0, explain: '"If a capability feels too big to test in one shot, split it further."' },
    { q: 'Mỗi capability nên có kích cỡ thế nào?', options: ['Đủ lớn để bao trọn một nhu cầu kinh doanh', 'Vừa đúng một lần làm việc với Claude', 'Đúng bằng một màn hình giao diện', 'Đủ để một lập trình viên làm trong một ngày'], answer: 1, explain: '"Size each capability so it maps cleanly to a single interaction with Claude."' },
    { q: 'Ba mức Claude có thể đáp ứng một capability, theo thứ tự tăng dần sức mạnh, là gì?', options: ['Workflow, single call, agent', 'Agent, workflow, single call', 'Single call, workflow, agent', 'Single call, agent, workflow'], answer: 2, explain: '"Single call, workflow, agent. They climb in power, but they also climb in cost and complexity."' },
    { q: 'Điểm phân biệt workflow với agent là gì?', options: ['Workflow được dùng tool còn agent thì không bao giờ dùng tool', 'Agent luôn rẻ hơn vì số bước ít hơn và không cần viết code', 'Workflow chỉ được gọi model đúng một lần trong cả quy trình', 'Đường đi của workflow định sẵn lúc thiết kế; agent tự chọn lúc chạy'], answer: 3, explain: 'Workflow là "a fixed sequence of steps you author in code where you decide the path at design time"; agent "chooses each next action at runtime".' },
    { q: 'Việc nào sau đây thường chỉ cần một lần gọi (single call)?', options: ['Trích xuất các trường từ một email', 'Sửa lỗi trong codebase lạ, chưa biết cần mấy bước', 'Điều tra sự cố qua nhiều hệ thống khác nhau', 'Lên kế hoạch và tự thực hiện chuyến đi nhiều chặng'], answer: 0, explain: 'Một lần gọi "covers a huge amount of real work, classification, summarization, extraction, a direct question".' },
    { q: 'Vì sao bài học nói agent KHÔNG phải lựa chọn mặc định?', options: ['Vì agent không dùng được tool tùy chỉnh do bạn tự viết', 'Vì mức đơn giản rẻ, nhanh và dễ test hơn do hành vi đoán trước được', 'Vì agent chỉ chạy được trên Agent SDK, không chạy trên API thường', 'Vì agent không bao giờ trả về được JSON đúng schema yêu cầu'], answer: 1, explain: '"Simpler tiers are cheaper to run, faster to respond, and far easier to test because their behavior is predictable."' },
    { q: 'Theo bài học, điều gì nên đẩy bạn lên mức cao hơn?', options: ['Sự hào hứng của cả team với công nghệ agent mới nhất', 'Độ hiện đại của kiến trúc', 'Yêu cầu, khi mức thấp hơn thật sự không đủ', 'Ngân sách của dự án còn dư nhiều trong quý này'], answer: 2, explain: '"Let the requirement, not your enthusiasm, be the thing that pushes you higher."' },
    { q: 'Câu nào KHÔNG thuộc bốn câu hỏi kiểm tra trước khi dùng agent?', options: ['Giá trị kết quả có xứng với chi phí và độ chậm không?', 'Claude có thật sự làm được việc mở này không?', 'Bước sai có sửa lại được không?', 'Agent có trông hiện đại hơn workflow không?'], answer: 3, explain: 'Bốn câu là complexity, value, viability và cost of error. "Hiện đại" không phải tiêu chí.' },
    { q: 'Câu hỏi "complexity" thực chất hỏi điều gì?', options: ['Việc có thật sự nhiều bước, khó viết sẵn kịch bản, hay workflow cố định làm được?', 'Prompt và tài liệu đính kèm có dài vượt quá giới hạn context của model không?', 'Code của vòng lặp agent có quá nhiều dòng để team bảo trì lâu dài không?', 'Người dùng cuối có đọc hiểu được câu trả lời mà agent đưa ra không?'], answer: 0, explain: '"Is the task genuinely multi-step and hard to script in advance, or could a fixed workflow handle it?"' },
    { q: 'Agent đạt complexity, value và viability, nhưng một bước sai có thể xóa dữ liệu khách hàng không khôi phục được. Kết luận đúng là gì?', options: ['Dùng agent vì đã đạt ba trên bốn', 'Làm ở mức đơn giản hơn, vì cost of error không đạt', 'Dùng agent nhưng tăng max turns', 'Dùng agent và viết lại prompt cho kỹ hơn'], answer: 1, explain: '"If any one of those four comes back weak, the honest answer is to meet the requirement at a simpler tier."' },
    { q: 'Câu hỏi "viability" kiểm tra điều gì?', options: ['Kết quả mang lại có đáng với số tiền phải trả không', 'Việc này có dễ viết sẵn kịch bản từ trước không', 'Claude có thật sự đủ sức làm việc mở đang hình dung không', 'Nếu đi sai một bước thì có khôi phục lại được không'], answer: 2, explain: '"Third, viability. Is Claude actually capable of the open-ended task you\'re imagining?"' },
    { q: 'Điều gì "kiếm được" quyền dùng agent?', options: ['Đạt ít nhất hai trong bốn câu', 'Đạt câu value là đủ', 'Có ngân sách dư', 'Đạt cả bốn câu'], answer: 3, explain: '"Passing all four is what earns the agent."' },
    { q: 'Người đặt hàng nói app có cảm giác chậm. Bạn viết yêu cầu "làm Claude trả lời nhanh hơn". Sai ở đâu?', options: ['Đây là ràng buộc hạ tầng đội lốt hành vi, sửa bằng kiến trúc chứ không phải prompt', 'Thiếu số giây cụ thể, thêm vào là thành yêu cầu chức năng chuẩn', 'Nên viết thành acceptance criterion thay vì requirement', 'Không sai, chỉ cần tối ưu câu chữ của prompt'], answer: 0, explain: '"That reads like functional behavior, but it isn\'t. The real driver is a latency budget, or a hosting region, or a throughput ceiling. None of those get fixed by rewording a prompt."' },
    { q: 'Yêu cầu nào có khả năng cao là hạ tầng đội lốt?', options: ['Trả về JSON gồm tên, email và gói dịch vụ', 'Xử lý được 300 ticket mỗi phút lúc cao điểm', 'Phân loại ticket vào một trong ba nhãn', 'Soạn câu trả lời có trích dẫn bài viết hỗ trợ'], answer: 1, explain: 'Khi yêu cầu "smells like performance, cost, or capacity", hãy hỏi đó có phải "an operating constraint in disguise" không.' },
    { q: 'Ràng buộc kiểu độ trễ, vùng hosting, giới hạn thông lượng được giải quyết ở đâu?', options: ['Trong câu chữ của system prompt, viết lại cho rõ ràng hơn', 'Trong acceptance criteria của từng capability', 'Trong kiến trúc, và ghi vào yêu cầu hạ tầng', 'Trong phần mô tả ý định kinh doanh của người đặt hàng'], answer: 2, explain: '"They get fixed in the architecture, and they belong in infrastructure requirements."' },
    { q: 'Theo phần tóm tắt, ba việc biến nhu cầu kinh doanh thành đặc tả kiểm thử được là gì?', options: ['Viết prompt thật kỹ, chọn model mạnh nhất, rồi đo số token tiêu tốn', 'Phỏng vấn người dùng, thiết kế giao diện, rồi viết test end-to-end', 'Chọn agent, thêm thật nhiều tool, rồi đặt max turns cho an toàn', 'Tách kết quả, phân biệt hành vi với ý định, chọn mức đơn giản nhất'], answer: 3, explain: '"By decomposing the outcome, telling behavior from intent, and picking the simplest tier."' },
    { q: 'Một requirement "Viết bài thơ động viên đội hỗ trợ mỗi sáng" không gắn với nhu cầu nào. Theo nguyên tắc truy vết, nên làm gì?', options: ['Gắn cờ: nó không truy về được nhu cầu kinh doanh nào', 'Giữ lại vì nó tạo thêm giá trị tinh thần cho đội hỗ trợ khách hàng', 'Chuyển nó sang một agent riêng để linh hoạt hơn', 'Chuyển nó thành yêu cầu hạ tầng cho đội vận hành'], answer: 0, explain: '"Every functional requirement should trace back to a business need." Không truy được là dấu hiệu của tính năng không ai yêu cầu.' },
    { q: 'Cuối quá trình tách capability, bạn nên có gì?', options: ['Một agent duy nhất đủ mạnh để bao trọn mọi việc của nhu cầu kinh doanh', 'Danh sách ngắn các capability nhỏ, nhìn thấy được, mỗi cái thành một yêu cầu kiểm tra riêng được', 'Một prompt thật dài mô tả toàn bộ sản phẩm để Claude tự hiểu và làm theo', 'Danh sách đầy đủ các model, tool và thư viện sẽ dùng trong từng bước'], answer: 1, explain: '"A short list of small, visible capabilities, and each one becomes a testable requirement you can verify on its own."' },
    { q: 'Một capability có đường đi cố định 3 bước, đạt cả bốn câu hỏi agent. Nên dùng mức nào?', options: ['Agent, vì đã vượt qua cả bốn câu hỏi kiểm tra', 'Single call, vì một lần gọi luôn rẻ nhất trong mọi trường hợp', 'Workflow, vì đường đi biết trước lúc thiết kế', 'Hai agent chạy song song để chia đôi khối lượng công việc'], answer: 2, explain: 'Luôn chọn mức thấp nhất đủ dùng: "Ask whether a single call gets the job done. If it can\'t, ask whether a fixed workflow can." Đường đi cố định thì workflow đủ.' },
  ],
};
