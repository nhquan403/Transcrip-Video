window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Ship xong chưa phải là hết việc. <strong>Operate</strong> là giữ hệ thống đang chạy khỏe <strong>hôm nay</strong>:
theo dõi độ trễ, token, tỉ lệ lỗi và từ chối, đọc "chữ ký" của từng loại lỗi. <strong>Maintain</strong> là giữ nó an toàn <strong>về sau</strong>:
chuyển model có kiểm soát, version prompt và schema, và chạy regression test trên một bộ ví dụ đóng băng trước mọi thay đổi.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Operate:</strong> vận hành hằng ngày, phản ứng với sự cố ngay khi xảy ra.</li>
  <li><strong>Maintain:</strong> bảo trì theo thời gian, theo kịp nền tảng đang thay đổi bên dưới.</li>
  <li><strong>Failure signature (chữ ký lỗi):</strong> dấu hiệu cho biết loại lỗi, ví dụ status 429 hay stop_reason "refusal".</li>
  <li><strong>Frozen evaluation set (bộ đánh giá đóng băng):</strong> một bộ input cố định kèm kết quả mong đợi, dùng lại cho mọi lần so sánh.</li>
  <li><strong>Regression test:</strong> chạy lại bộ đó để xem hành vi giữ được hay bị tụt.</li>
  <li><strong>Deprecation / retirement:</strong> model cũ bị ngừng hỗ trợ; quá ngày đó là phải chuyển.</li>
</ul>

<h3>Operate: ba tín hiệu cần đo từ ngày đầu</h3>
<ul>
  <li><strong>Độ trễ:</strong> mỗi lời gọi mất bao lâu từ lúc gửi tới lúc nhận. Độ trễ tăng dần thường là <strong>cảnh báo sớm nhất</strong>.</li>
  <li><strong>Token:</strong> mỗi response báo token vào và ra. Token quyết định chi phí và gián tiếp cả độ trễ.</li>
  <li><strong>Tỉ lệ lỗi và từ chối:</strong> bao nhiêu lời gọi thất bại hẳn, hoặc Claude từ chối trả lời. Đây là thước đo trực tiếp sức khỏe thật.</li>
</ul>
<p>Đo đủ ba thứ này từ ngày đầu thì production thôi là một <strong>hộp đen</strong>.</p>

<h3>Đọc chữ ký trước khi phản ứng</h3>
<div class="box">🩺 <strong>Hình dung thế này:</strong> Bác sĩ không kê cùng một loại thuốc cho mọi cơn đau. Sốt, gãy tay, dị ứng: mỗi triệu chứng chỉ ra một cách chữa.
Lỗi cũng vậy: <strong>chữ ký gọi tên cách sửa</strong>.</div>
<ul>
  <li><strong>429:</strong> rate limit. Chờ (backoff) rồi thử lại.</li>
  <li><strong>stop_reason "refusal":</strong> bộ lọc an toàn đã can thiệp. Claude cũng có thể từ chối <strong>bằng lời</strong> với end_turn bình thường; hãy tính cả hai.
  Dù kiểu nào, đây là chuyện <strong>prompt hoặc chính sách</strong>, không phải chuyện retry.</li>
  <li><strong>stop_reason "max_tokens":</strong> câu trả lời bị cắt giữa chừng vì chạm giới hạn output. Nâng giới hạn, hoặc yêu cầu câu trả lời ngắn hơn.</li>
</ul>

<h3>Operate và maintain khác nhau thế nào?</h3>
<ul>
  <li><strong>Operate là chuyện bây giờ:</strong> giữ hệ thống đang chạy khỏe hôm nay, xử lý sự cố ngay khi xảy ra.</li>
  <li><strong>Maintain là chuyện theo thời gian:</strong> chuyển model mới, version prompt và schema, regression test các bản nâng cấp, để một thay đổi không âm thầm làm hỏng production.</li>
</ul>
<p>Một bên giữ <strong>hôm nay ổn định</strong>, một bên giữ <strong>ngày mai an toàn</strong>. Nhầm hai việc này là cách một team chỉ lo chữa cháy thay vì lên kế hoạch.</p>

<h3>Ba việc bảo trì lặp đi lặp lại</h3>
<ol>
  <li><strong>Chuyển model:</strong> model bị ngừng hoặc có bản tốt hơn; bạn chuyển một cách có chủ đích.</li>
  <li><strong>Version prompt và schema:</strong> coi chúng là tài sản có phiên bản, được theo dõi và review, không sửa trực tiếp trên production rồi quên.</li>
  <li><strong>Regression test:</strong> trước khi ship mọi thay đổi, chạy trên bộ ví dụ đóng băng để thấy hành vi giữ được hay tụt.</li>
</ol>
<p>Ứng dụng đã triển khai <strong>không bao giờ đứng yên</strong>, vì nền tảng bên dưới luôn thay đổi. Lên kế hoạch trước thì việc này thành thường lệ, không thành cấp cứu.</p>

<h3>Ba sự thật về model ID</h3>
<ul>
  <li>Một ID như Claude Opus 4.8 là <strong>snapshot cố định</strong>, không phải alias luôn trỏ tới bản mới nhất.</li>
  <li><strong>Model mới, ID mới:</strong> Anthropic không bao giờ thay trọng số đằng sau một ID đã có; bản cải tiến luôn ra với ID mới mà bạn tự chọn dùng.</li>
  <li>Trọng số cố định, nhưng <strong>hạ tầng phục vụ</strong> xung quanh có thể thay đổi, nên đôi khi có khác biệt nhỏ về hành vi ngay cả trên ID ổn định.</li>
</ul>
<p>Ghim đúng ID bạn đã test, và bạn quyết định <strong>khi nào</strong> chuyển, thay vì bị bất ngờ.</p>

<h3>Chuyển model an toàn</h3>
<p>Thường bị kích hoạt bởi một <strong>deprecation</strong>: model cũ bị ngừng, hoặc một chế độ thinking cũ biến mất. Trình tự an toàn:</p>
<ol>
  <li>Đừng chỉ đổi ID rồi ship.</li>
  <li>Chạy model mới trên <strong>bộ đánh giá đóng băng</strong>, đúng những input đã dùng để duyệt model cũ.</li>
  <li><strong>So output cạnh nhau</strong>, chỉ chuyển khi chất lượng rõ ràng giữ được.</li>
  <li>Nếu có chỗ tụt, <strong>chỉnh prompt cho model mới</strong> trước.</li>
</ol>
<p>Đổi model là một thay đổi code có thể làm hỏng hành vi, vì đúng là như vậy.</p>

<h3>Vòng phản hồi nối cả vòng đời</h3>
<ol>
  <li><strong>Quan sát:</strong> production lộ ra những thứ bộ test chưa từng thấy: độ trễ thật, chi phí thật, những lần từ chối và lỗi chỉ xuất hiện với người dùng thật.</li>
  <li><strong>Đưa ngược lại:</strong> những quan sát đó không nằm im trên dashboard mà chảy ngược vào yêu cầu.</li>
  <li><strong>Lặp:</strong> vòng sau cập nhật prompt, schema, xử lý lỗi, rồi vòng lặp bắt đầu lại.</li>
</ol>
<p>Bảo trì không phải checklist làm xong là thôi; đó là <strong>vòng lặp</strong> chạy suốt thời gian app còn sống.</p>

<h3>Version prompt và schema như version code</h3>
<ul>
  <li>Lưu mọi prompt trong source control và <strong>gắn mỗi prompt với model</strong> mà nó được tinh chỉnh, để luôn biết prompt nào chạy với model nào.</li>
  <li>Version cả <strong>schema output</strong>: khi hình dạng response đổi, code phía sau đọc nó vẫn khớp thay vì âm thầm hỏng.</li>
  <li>Trước khi ship bất kỳ thay đổi nào, chạy lại trên bộ đánh giá đóng băng. Đó là lưới an toàn của bạn.</li>
</ul>
<div class="box">✏️ <strong>Tư duy cần mang theo:</strong> sửa một dòng prompt có thể làm tụt hành vi y như sửa một dòng code,
nên nó xứng đáng được review, version và test như code.</div>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Operate: đo độ trễ, token, lỗi và từ chối; đọc chữ ký lỗi trước khi phản ứng.</li>
  <li>Maintain: chuyển model có kiểm soát, version prompt và schema gắn với model.</li>
  <li>Mọi thay đổi (model, prompt, schema) đều chạy regression trên bộ đánh giá đóng băng.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">Don't let the complexity of this slide fool you</em>: đừng để độ phức tạp của slide này đánh lừa bạn.</li>
  <li><em class="en">Miss a retirement date</em>: bỏ lỡ ngày ngừng hỗ trợ.</li>
  <li><em class="en">degrade your app overnight</em>: làm app tệ đi chỉ sau một đêm.</li>
  <li><em class="en">your earliest warning that something is off</em>: cảnh báo sớm nhất rằng có gì đó không ổn.</li>
  <li><em class="en">production stops being a black box</em>: production thôi là hộp đen.</li>
  <li><em class="en">The signature names the fix</em>: chữ ký gọi tên cách sửa.</li>
  <li><em class="en">read it before you react</em>: đọc kỹ trước khi phản ứng.</li>
  <li><em class="en">firefighting instead of planning ahead</em>: chữa cháy thay vì lên kế hoạch trước.</li>
  <li><em class="en">evergreen alias</em>: alias luôn trỏ tới bản mới nhất.</li>
  <li><em class="en">you opt into</em>: bạn tự chọn dùng.</li>
  <li><em class="en">cut over</em>: chuyển hẳn sang hệ thống/model mới.</li>
  <li><em class="en">That frozen set is your safety net</em>: bộ ví dụ đóng băng là lưới an toàn của bạn.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson06/Lesson06.java</code>. Có 5 bài: tính ba tín hiệu vận hành từ log (p95 độ trễ, tổng token,
tỉ lệ lỗi và từ chối), đọc chữ ký lỗi ra cách sửa, tìm regression trên bộ đánh giá đóng băng, quyết định có được chuyển model không,
và chọn đúng phiên bản prompt cho đúng model. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-06"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-06 --live"</code>: chương trình chạy một bộ ví dụ phân loại ticket đóng băng trên model hiện tại
và một model ứng viên (đặt bằng biến môi trường <code>CANDIDATE_MODEL</code>), ghi log từng lời gọi, rồi code của bạn quyết định có nên chuyển hay chưa.
Cuối cùng, một lời gọi với max_tokens quá nhỏ cho bạn thấy chữ ký "max_tokens" thật.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Theo bài học, điều gì có thể xảy ra nếu bỏ lỡ ngày ngừng hỗ trợ (retirement date) của một model?', options: ['Không sao, API tự chuyển giúp mà không đổi hành vi', 'App có thể tệ đi chỉ sau một đêm', 'Hóa đơn tự động giảm một nửa', 'Rate limit được nâng lên'], answer: 1, explain: '"Miss a retirement date, and a model change can degrade your app overnight."' },
    { q: 'Ba tín hiệu cần đo từ ngày đầu khi vận hành là gì?', options: ['Số người dùng, số tính năng, số lỗi giao diện', 'Độ dài prompt, temperature, model', 'Độ trễ, token, tỉ lệ lỗi và từ chối', 'CPU, RAM, dung lượng ổ đĩa'], answer: 2, explain: '"Latency, tokens, errors. Instrument those three from day one, and production stops being a black box."' },
    { q: 'Tín hiệu nào thường là cảnh báo sớm nhất rằng có gì đó không ổn?', options: ['Độ trễ tăng dần', 'Số người dùng mới giảm', 'Token output giảm', 'Số commit trong tuần tăng'], answer: 0, explain: '"When latency starts climbing, that\'s often your earliest warning that something is off."' },
    { q: 'Vì sao phải theo dõi token sát sao?', options: ['Vì số token quyết định thứ hạng của ứng dụng trên kết quả tìm kiếm', 'Vì token càng nhiều câu trả lời càng đúng', 'Vì vượt token là bị khóa tài khoản ngay', 'Vì token quyết định chi phí và gián tiếp cả độ trễ'], answer: 3, explain: '"Those tokens drive both your cost and indirectly your latency, so you track them closely."' },
    { q: 'Tỉ lệ lỗi và từ chối cho bạn biết điều gì?', options: ['Chất lượng giao diện người dùng', 'Sức khỏe thật của app ngoài đời', 'Tốc độ mạng của người dùng', 'Số model đang chạy song song'], answer: 1, explain: '"That rate is a direct read on your app\'s real-world health."' },
    { q: 'Gặp lỗi 429 trên production, bạn nên làm gì?', options: ['Sửa prompt cho ngắn hơn', 'Xem lại chính sách nội dung', 'Chờ (backoff) rồi thử lại', 'Tăng max_tokens'], answer: 2, explain: '"The 429 you can read on site by now. Rate limiting, back off, and retry."' },
    { q: 'Response trả về stop_reason "refusal". Phản ứng đúng là gì?', options: ['Xem lại prompt hoặc chính sách', 'Retry ngay ba lần với backoff', 'Tăng max_tokens rồi gửi lại', 'Chuyển sang vùng server khác'], answer: 0, explain: '"Either way, it\'s a prompt or policy question, not a retry."' },
    { q: 'Ngoài stop_reason "refusal", Claude còn có thể từ chối theo cách nào?', options: ['Trả về HTTP 451', 'Đóng kết nối giữa chừng', 'Trả về content rỗng với stop_reason "error"', 'Từ chối bằng lời, với end_turn'], answer: 3, explain: '"Claude can also decline conversationally in the reply text under a normal end turn, so plan for both."' },
    { q: 'stop_reason "max_tokens" nghĩa là gì và sửa thế nào?', options: ['Bị rate limit; chờ rồi thử lại', 'Bị cắt vì chạm giới hạn output; nâng giới hạn hoặc hỏi ngắn hơn', 'Model bị quá tải; đổi model', 'Prompt quá dài; xóa bớt lịch sử'], answer: 1, explain: '"A max token stop reason means the reply got cut off mid-answer because it hit the output limit, so you raise the limit or ask for something shorter."' },
    { q: 'Nguyên tắc chung khi gặp các chữ ký lỗi là gì?', options: ['Retry mọi lỗi cho chắc', 'Báo ngay cho người dùng mọi lỗi', 'Đọc chữ ký lỗi trước khi phản ứng', 'Chờ người dùng phàn nàn rồi mới xử lý'], answer: 2, explain: '"Same idea across all of them. The signature names the fix, so read it before you react."' },
    { q: 'Câu nào mô tả đúng OPERATE?', options: ['Giữ hệ thống chạy khỏe hôm nay', 'Chuyện theo thời gian: chuyển model và version prompt', 'Chuyện thiết kế: chọn tier và viết đặc tả', 'Chuyện bán hàng: tìm khách hàng mới'], answer: 0, explain: '"Operate is about right now. You\'re keeping the live system healthy today..."' },
    { q: 'Câu nào mô tả đúng MAINTAIN?', options: ['Theo dõi dashboard độ trễ từng phút', 'Phản ứng với sự cố đang diễn ra', 'Thử prompt lần đầu với Messages API', 'Theo kịp nền tảng đang thay đổi'], answer: 3, explain: '"Maintain is about over time. You\'re keeping the system current as the platform moves under you..."' },
    { q: '"Một bên giữ hôm nay ổn định, một bên giữ ngày mai an toàn." Nhầm hai bên dẫn tới điều gì?', options: ['Chi phí token tăng gấp đôi', 'Chỉ lo chữa cháy', 'Model tự động bị ngừng hỗ trợ', 'Không thể dùng streaming'], answer: 1, explain: '"Confusing them is how a team ends up firefighting instead of planning ahead."' },
    { q: 'Ba việc bảo trì lặp đi lặp lại là gì?', options: ['Viết test UI, tối ưu CSS, nén ảnh', 'Thêm tool mới, tăng max turns, và đổi temperature cho từng tính năng', 'Chuyển model, version prompt/schema, regression', 'Đổi API key, đổi vùng, đổi nhà cung cấp'], answer: 2, explain: '"Three recurring jobs": model migration, prompt and schema versioning, and regression testing.' },
    { q: 'Theo bài học, nên đối xử với prompt và schema output thế nào?', options: ['Như tài sản có phiên bản', 'Như ghi chú tạm, sửa trực tiếp trên production', 'Như bí mật, không ai được xem', 'Như dữ liệu người dùng, xóa sau 30 ngày'], answer: 0, explain: '"You treat your prompts and your output schemas as versioned artifacts, tracked and reviewable, not edited, live, and forgotten."' },
    { q: 'Vì sao một ứng dụng đã triển khai không bao giờ thật sự "đứng yên"?', options: ['Vì người dùng luôn đòi tính năng mới', 'Vì code tự xuống cấp theo thời gian', 'Vì API key hết hạn mỗi tháng', 'Vì nền tảng bên dưới liên tục thay đổi'], answer: 3, explain: '"A deployed app is never truly static, because the platform keeps evolving underneath it."' },
    { q: 'Một model ID như "Claude Opus 4.8" là gì?', options: ['Một alias luôn trỏ tới bản Opus mới nhất', 'Một snapshot cố định, chỉ đúng một model', 'Một nhóm model cùng giá', 'Một tên gọi marketing, không dùng trong API'], answer: 1, explain: '"A model ID like Claude Opus 4.8 is a pinned snapshot. It isn\'t an evergreen alias that quietly points at whatever\'s newest."' },
    { q: 'Khi Anthropic cải tiến một model, điều gì xảy ra với ID cũ?', options: ['Trọng số đằng sau ID cũ được cập nhật âm thầm', 'ID cũ bị xóa ngay lập tức', 'ID cũ giữ nguyên; bản mới có ID mới', 'ID cũ tự chuyển sang trỏ tới model mới'], answer: 2, explain: '"New model, new ID. Anthropic never rewrites the weights behind an existing ID, so an improved model always ships under a brand new ID that you opt into."' },
    { q: 'Trên cùng một ID ổn định, vì sao đôi khi vẫn có khác biệt nhỏ về hành vi?', options: ['Vì hạ tầng phục vụ có thể đổi', 'Vì trọng số được tinh chỉnh hằng tuần', 'Vì prompt của bạn tự đổi', 'Vì API key khác nhau cho kết quả khác nhau'], answer: 0, explain: '"The weights stay fixed, but serving infrastructure around them can shift over time, which can produce small behavior differences even on a stable ID."' },
    { q: 'Ghim đúng model ID đã test mang lại điều gì?', options: ['Giảm giá token', 'Tăng rate limit', 'Không cần regression test nữa', 'Tự quyết định thời điểm chuyển'], answer: 3, explain: '"Pin the ID you tested, and you control exactly when migration happens instead of being surprised by it."' },
    { q: 'Thường điều gì kích hoạt việc chuyển model?', options: ['Một bài blog mới', 'Một deprecation', 'Người dùng đổi trình duyệt', 'Đổi tên công ty'], answer: 1, explain: '"The trigger is usually a deprecation. Anthropic retires an older model, or a legacy thinking mode goes away, and that forces you to move."' },
    { q: 'Trình tự chuyển model AN TOÀN là gì?', options: ['Đổi ID rồi ship ngay, sau đó theo dõi phàn nàn của người dùng trong vài tuần', 'Đổi ID trên production cho 50% người dùng trước', 'Chạy bộ đánh giá đóng băng, so cạnh nhau, rồi mới chuyển', 'Viết lại toàn bộ prompt từ đầu rồi ship'], answer: 2, explain: '"You regress and test the new model against a frozen evaluation set... compare the outputs side by side, and you only cut over once quality clearly holds."' },
    { q: 'Bộ đánh giá dùng để test model mới phải là gì?', options: ['Đúng input đã duyệt model cũ', 'Bộ input mới hoàn toàn để công bằng', 'Lấy ngẫu nhiên từ log hôm nay', 'Do model mới tự sinh ra'], answer: 0, explain: '"The same inputs you validated the old one on."' },
    { q: 'Model mới làm trượt vài ví dụ mà model cũ làm đúng. Bước tiếp theo theo bài học là gì?', options: ['Ship luôn vì tỉ lệ chung vẫn cao', 'Bỏ những ví dụ đó khỏi bộ đánh giá', 'Giữ model cũ vĩnh viễn', 'Chỉnh prompt cho model mới trước, rồi chạy lại'], answer: 3, explain: '"If something slipped, you adjust the prompt for the new model first."' },
    { q: 'Bài học nói nên coi việc đổi model như thế nào?', options: ['Như một thay đổi cấu hình nhỏ', 'Như bất kỳ thay đổi code nào có thể làm hỏng hành vi', 'Như một việc của nhà cung cấp, không phải của bạn', 'Như một cập nhật bảo mật tự động'], answer: 1, explain: '"Treat a model change exactly like any code change that could break behavior, because that\'s precisely what it is."' },
    { q: 'Ba bước của vòng phản hồi (feedback loop) là gì?', options: ['Thiết kế, code, ship', 'Đo, báo cáo, lưu trữ', 'Quan sát, đưa ngược vào yêu cầu, lặp', 'Mua, dùng, thay'], answer: 2, explain: '"First, you observe... Second, you feed back... Third, you iterate."' },
    { q: 'Production cho bạn thấy những gì mà bộ test chưa từng thấy?', options: ['Độ trễ, chi phí, từ chối và lỗi thật', 'Danh sách tính năng còn thiếu', 'Lỗi chính tả trong tài liệu', 'Màu sắc giao diện chưa đẹp'], answer: 0, explain: '"Production surfaces things your test set never did. The real latency, the real cost, the refusals and failures that only show up with real users and real traffic."' },
    { q: 'Vì sao phải gắn mỗi prompt với phiên bản model mà nó được tinh chỉnh?', options: ['Để tiết kiệm token', 'Để rate limit cao hơn', 'Để model tự chọn prompt', 'Để luôn biết prompt nào chạy với model nào'], answer: 3, explain: '"Tie each one to the model version it was tuned for, so you always know which prompt ran against which model."' },
    { q: 'Vì sao phải version cả schema output?', options: ['Để JSON ngắn hơn', 'Để code phía sau không âm thầm hỏng', 'Để Claude trả lời nhanh hơn', 'Để không cần structured outputs'], answer: 1, explain: '"Version your output schema too, so when the shape of a response changes, the downstream code that consumes it stays in sync instead of silently breaking."' },
    { q: 'Tư duy cuối bài về việc sửa prompt là gì?', options: ['Sửa prompt an toàn hơn sửa code, nên không cần test', 'Chỉ cần review prompt nếu nó dài hơn 1.000 token', 'Sửa prompt cũng cần review, version, test như code', 'Prompt nên do một người duy nhất sửa'], answer: 2, explain: '"A prompt edit can regress behavior every bit as much as a code edit, so it earns the same review, versioning, and testing."' },
  ],
};
