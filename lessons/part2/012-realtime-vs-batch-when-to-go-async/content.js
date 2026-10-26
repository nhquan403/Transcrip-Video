window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Có hai "cửa" để gọi Claude. <strong>Messages API đồng bộ</strong> trả lời ngay, stream được, tính đủ giá.
<strong>Message Batches API</strong> nhận cả lô request, chạy nền, trả kết quả sau, và tính <strong>một nửa giá</strong>. Chọn cửa theo câu hỏi:
<strong>có ai đang chờ câu trả lời này không?</strong></p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Synchronous (đồng bộ):</strong> gửi request, code chờ, nhận response.</li>
  <li><strong>Asynchronous (bất đồng bộ):</strong> gửi việc đi, làm việc khác, quay lại lấy kết quả sau.</li>
  <li><strong>custom_id:</strong> nhãn duy nhất bạn gắn cho từng request trong batch (học kỹ ở bài 013).</li>
  <li><strong>Poll:</strong> hỏi lại định kỳ xem batch đã xong chưa.</li>
  <li><strong>Zero data retention (ZDR):</strong> chế độ lưu dữ liệu nghiêm ngặt mà một số tổ chức bắt buộc.</li>
</ul>

<h3>Hai bề mặt</h3>
<ul>
  <li><strong>Messages API đồng bộ:</strong> gửi một request, code chờ, Claude trả lời. Dành cho việc tương tác, và là <strong>bề mặt duy nhất stream được</strong>.</li>
  <li><strong>Message Batches API:</strong> gói nhiều request vào một job, gửi đi; Claude xử lý nền và trả mọi thứ khi xong.</li>
</ul>
<p>Khác biệt lớn nhất là <strong>giá</strong>: batch tính <strong>50%</strong> giá chuẩn, cho cả input lẫn output. Bạn đổi câu trả lời tức thì lấy một khoản giảm giá lớn.</p>

<h3>Ba điều cơ bản của batch</h3>
<ol>
  <li><strong>Endpoint:</strong> bạn POST job tới endpoint batches; mỗi entry ghép một <strong>custom_id</strong> với <strong>params</strong>, mà params chỉ là một body Messages API bình thường.
  Mỗi item là một request đầy đủ mà lẽ ra bạn đã có thể gửi riêng.</li>
  <li><strong>Giá:</strong> nửa giá, lý do tồn tại của Batches API.</li>
  <li><strong>Bất đồng bộ:</strong> không ngồi chờ lời gọi. Gửi job, <strong>poll</strong> xem xong chưa, rồi lấy toàn bộ kết quả.</li>
</ol>

<h3>Đánh đổi chi phí</h3>
<div class="box">🧺 <strong>Hình dung thế này:</strong> Giặt ủi lấy ngay trong 1 giờ thì giá cao; gửi giặt lấy ngày mai thì rẻ một nửa.
Áo cần mặc tối nay thì phải trả giá lấy ngay. Một túi đồ không cần gấp thì gửi giặt thường cho rẻ.</div>
<p>Vài request thì tiết kiệm chẳng đáng là bao; hàng chục nghìn request thì là tiền thật. Đổi lại bạn mất: <strong>câu trả lời ngay</strong> và <strong>streaming</strong>.
Với thứ có người đang xem, đó là không chấp nhận được. Với job lớn chạy qua đêm, đổi tốc độ lấy nửa hóa đơn thường là lựa chọn dễ.</p>

<h3>Thời gian: ba điều phải nắm chắc</h3>
<ul>
  <li><strong>Tốc độ:</strong> phần lớn batch xong <strong>dưới một giờ</strong>, nhưng đó là <strong>best effort</strong>, không phải cam kết. Đừng xây hạn chót cứng trên nó.</li>
  <li><strong>Cửa sổ xử lý:</strong> batch phải xong trong <strong>24 giờ</strong>. Request nào chưa xong trong cửa sổ đó thì <strong>hết hạn</strong>, và request hết hạn <strong>không bị tính tiền</strong>.</li>
  <li><strong>Khi nào có kết quả:</strong> ngay khi mọi request xong, hoặc tới mốc 24 giờ, cái nào tới trước.</li>
</ul>
<p>Lên kế hoạch cho độ trễ tới một ngày; trường hợp dưới một giờ là phần thưởng thêm, không phải lời hứa.</p>

<h3>Hai cửa sổ, đừng gộp làm một</h3>
<ul>
  <li><strong>Cửa sổ xử lý: 24 giờ.</strong> Hạn để job chạy xong. Quá hạn thì request chưa xử lý hết hạn, không tính tiền. Nó quyết định batch có xong hay không.</li>
  <li><strong>Cửa sổ lưu kết quả: 29 ngày</strong>, tính từ lúc tạo batch. Sau 29 ngày batch vẫn xem được, nhưng <strong>không tải kết quả được nữa</strong>.</li>
</ul>
<p>Một cái là chuyện làm xong việc, cái kia là chuyện bạn có bao lâu để lấy kết quả về.</p>

<h3>Giới hạn cứng</h3>
<ul>
  <li>Một batch tối đa <strong>100.000 request</strong> hoặc <strong>256 MB</strong> tổng dữ liệu, cái nào chạm trước. Lớn hơn thì chia thành nhiều batch.</li>
  <li>Batch <strong>không đủ điều kiện zero data retention</strong>. Tổ chức bắt buộc ZDR thì không dùng batch được, phải chạy đồng bộ.</li>
</ul>

<h3>Khi nào ở lại realtime?</h3>
<ul>
  <li>Có <strong>người đang chờ</strong> câu trả lời: chat, trợ lý code trực tiếp, mọi thứ tương tác.</li>
  <li>Cần <strong>stream</strong> token (batch không stream được).</li>
  <li>Việc <strong>bị ràng buộc độ trễ</strong>, nơi thời gian trả lời là một phần của sản phẩm.</li>
</ul>
<p>Phép thử đơn giản: nếu một người hay một hệ thống phía sau <strong>đang bị chặn chờ</strong> câu trả lời, gửi realtime. Đừng batch thứ có người đang nhìn.</p>

<h3>Khi nào dùng batch?</h3>
<p>Khi <strong>khối lượng quan trọng hơn sự tức thì</strong>: chạy bộ eval qua hàng nghìn ca, phân loại một đống tồn đọng khổng lồ, xử lý chồng tài liệu mà không ai chờ từng kết quả.
Việc không nhạy độ trễ và có nhiều, giảm 50% cộng dồn rất nhanh.</p>
<p>⚠️ Bắn nhiều lời gọi đồng bộ <strong>song song</strong> không phải là batch: vẫn đủ giá và còn đè lên rate limit. Batches API là một job riêng, giảm giá, bất đồng bộ.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Đồng bộ: trả lời ngay, stream được, đủ giá. Batch: bất đồng bộ, nửa giá, không stream.</li>
  <li>Xử lý trong 24 giờ (phần quá hạn không tính tiền); kết quả tải được trong 29 ngày.</li>
  <li>Có người chờ thì realtime; khối lượng lớn không ai chờ thì batch. Batch không dùng được khi bắt buộc ZDR.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">different territory</em>: hai vùng khác hẳn nhau.</li>
  <li><em class="en">on its own schedule</em>: theo lịch riêng của nó.</li>
  <li><em class="en">your code blocks</em>: code của bạn bị chặn lại chờ.</li>
  <li><em class="en">the headline difference</em>: khác biệt nổi bật nhất.</li>
  <li><em class="en">pocket change</em>: tiền lẻ, không đáng kể.</li>
  <li><em class="en">nothing's free</em>: chẳng có gì miễn phí.</li>
  <li><em class="en">a deal-breaker</em>: điều không thể chấp nhận.</li>
  <li><em class="en">best effort</em>: cố gắng hết sức nhưng không cam kết.</li>
  <li><em class="en">treat the under-an-hour case as a bonus, not a promise</em>: coi chuyện xong dưới một giờ là phần thưởng, không phải lời hứa.</li>
  <li><em class="en">Don't let them collapse into one number</em>: đừng gộp chúng thành một con số.</li>
  <li><em class="en">force your hand</em>: buộc bạn phải chọn.</li>
  <li><em class="en">people conflate these</em>: người ta hay lẫn lộn hai thứ này.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson12/Lesson12.java</code>. Có 4 bài: chọn realtime hay batch cho một công việc, tính chi phí khi chạy batch,
chia request thành nhiều batch theo giới hạn số lượng và dung lượng, và xác định trạng thái batch theo hai cửa sổ 24 giờ và 29 ngày.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-12"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-12 --live"</code>: chương trình phân loại vài ticket bằng lời gọi đồng bộ thật,
cộng token thật, rồi dùng code của bạn tính nếu chạy cùng việc qua batch thì tốn bao nhiêu (và khi nhân lên 100.000 ticket). Bài 013 sẽ gửi một batch thật.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Message Batches API tính giá thế nào so với chuẩn?', options: ['Bằng giá chuẩn', '50% cho cả input và output', 'Giảm 50% chỉ cho token input, output giữ nguyên giá', '90% cho output'], answer: 1, explain: '"Batch work bills at 50% of the standard rate, both input and output."' },
    { q: 'Bề mặt nào là bề mặt DUY NHẤT stream được token?', options: ['Message Batches API', 'Files API', 'Messages API đồng bộ', 'Cả hai đều stream được'], answer: 2, explain: '"It\'s built for interactive work, and it\'s the only surface that streams tokens as they generate."' },
    { q: 'Mỗi entry trong batch gồm những gì?', options: ['custom_id và params', 'Một prompt và một số thứ tự', 'Một model và một callback URL', 'Một file JSONL và một API key'], answer: 0, explain: '"Each entry inside pairs a custom ID with params, which is just a normal messages request body."' },
    { q: 'Quy trình làm việc với batch là gì?', options: ['Gửi và chờ trên cùng một kết nối', 'Gửi, nhận stream, đóng', 'Gửi từng request một rồi gộp', 'Gửi, poll, rồi lấy kết quả'], answer: 3, explain: '"You submit the job, poll to see when it\'s finished, and then retrieve all the results together."' },
    { q: 'Khi chọn batch, bạn đánh đổi những gì?', options: ['Chất lượng câu trả lời và tool use', 'Câu trả lời ngay và streaming', 'Vision và thinking', 'System prompt và multi-turn'], answer: 1, explain: '"You don\'t get an immediate response, and you can\'t stream."' },
    { q: 'Batch thường xong trong bao lâu, và có được đảm bảo không?', options: ['Dưới 1 phút, có đảm bảo', 'Đúng 24 giờ, có đảm bảo', 'Thường dưới một giờ, không đảm bảo', 'Luôn dưới 10 phút'], answer: 2, explain: '"Most batches finish in under an hour. That\'s great, but it\'s best effort. Not a guaranteed service level, so never build a hard deadline on it."' },
    { q: 'Cửa sổ xử lý của một batch là bao lâu?', options: ['24 giờ', '1 giờ', '29 ngày', '7 ngày'], answer: 0, explain: '"A batch has to complete within 24 hours."' },
    { q: 'Request trong batch chưa xong khi hết 24 giờ thì sao?', options: ['Được tính tiền gấp đôi', 'Được chạy tiếp trong 24 giờ nữa', 'Chuyển sang API đồng bộ', 'Hết hạn và không bị tính tiền'], answer: 3, explain: '"Any request that doesn\'t finish inside that window expires, and expired requests are unbilled."' },
    { q: 'Kết quả batch có sẵn khi nào?', options: ['Từng kết quả ngay khi mỗi request xong, qua stream', 'Khi xong hết, hoặc ở mốc 24 giờ', 'Luôn đúng sau 24 giờ', 'Sau 29 ngày'], answer: 1, explain: '"They become available the moment every request completes, or at the 24-hour mark, whichever comes first."' },
    { q: 'Kết quả của batch tải về được trong bao lâu?', options: ['24 giờ kể từ khi xong', '1 giờ', '29 ngày từ lúc tạo', 'Vĩnh viễn'], answer: 2, explain: '"The retention window is 29 days. That\'s how long your finished results stay downloadable, counting from when you created the batch."' },
    { q: 'Sau 29 ngày kể từ lúc tạo, chuyện gì xảy ra với batch?', options: ['Xem được, nhưng không tải được kết quả', 'Batch bị xóa hoàn toàn', 'Kết quả được gửi qua email', 'Batch tự chạy lại'], answer: 0, explain: '"After 29 days, the batch is still viewable, but you can\'t pull the results anymore."' },
    { q: 'Câu nào phân biệt ĐÚNG hai cửa sổ thời gian?', options: ['Cả hai đều là hạn xử lý', 'Cả hai đều là hạn lưu kết quả', '29 ngày là hạn xử lý, 24 giờ là hạn lưu', '24 giờ để xử lý, 29 ngày để tải'], answer: 3, explain: '"One window is about getting the work done, and the other is about how long you have to collect it."' },
    { q: 'Giới hạn kích thước của một batch là gì?', options: ['1.000 request hoặc 10 MB', '100.000 request hoặc 256 MB', 'Không giới hạn', '1 triệu request hoặc 1 GB'], answer: 1, explain: '"A single batch holds up to 100,000 requests, or 256 megabytes of total payload, whichever you hit first."' },
    { q: 'Job có 250.000 request. Làm thế nào?', options: ['Gửi một batch duy nhất', 'Chuyển sang API đồng bộ', 'Chia thành nhiều batch', 'Nén dữ liệu cho vừa'], answer: 2, explain: '"If your job is bigger than that, you split it across multiple batches."' },
    { q: 'Tổ chức của bạn bắt buộc zero data retention. Với job phân loại lớn, bạn làm gì?', options: ['Chạy đồng bộ', 'Dùng batch bình thường', 'Dùng batch với TTL 1 giờ', 'Chia nhỏ batch để được ZDR'], answer: 0, explain: '"Batches aren\'t eligible for zero data retention. So, if your organization requires that stricter retention posture, the Batches API is off the table, and you\'d run that work synchronously."' },
    { q: 'Phép thử đơn giản để chọn realtime là gì?', options: ['Job có hơn 100 request không?', 'Có dùng tool không?', 'Có dùng ảnh không?', 'Có ai đang chờ câu trả lời không?'], answer: 3, explain: '"If a person or a downstream system is blocked, waiting on that answer, you send it in real-time. Don\'t batch something someone is watching."' },
    { q: 'Việc nào hợp với batch nhất?', options: ['Trợ lý code trả lời trực tiếp', 'Chạy bộ eval trên hàng nghìn ca kiểm thử', 'Trả lời tin nhắn chat của khách hàng đang mở cửa sổ hỗ trợ', 'Autocomplete khi người dùng gõ'], answer: 1, explain: '"The classic fits are large offline workloads, running an eval suite across thousands of test cases, bulk-classifying a giant backlog..."' },
    { q: 'Một app chat cần hiện chữ dần dần cho người dùng. Bề mặt nào?', options: ['Batch, vì rẻ hơn', 'Batch với poll mỗi giây', 'API đồng bộ có stream', 'Files API'], answer: 2, explain: 'Có người đang chờ và cần stream: "It\'s also your only option when you want to stream tokens as they generate, since batches can\'t stream at all."' },
    { q: 'Bắn 10.000 lời gọi đồng bộ song song có phải là "batching" không?', options: ['Không phải', 'Có, và được giảm 50%', 'Có, nếu dùng cùng một API key', 'Có, nếu gửi trong cùng một phút'], answer: 0, explain: '"Firing off many parallel real-time calls isn\'t the same thing as batching. That\'s still full price, and it leans on your rate limits."' },
    { q: 'Vì sao không nên đặt hạn chót cứng 30 phút dựa trên batch?', options: ['Vì batch luôn mất đúng 24 giờ', 'Vì batch không trả kết quả', 'Vì batch chỉ chạy ban đêm', 'Vì chỉ là best effort'], answer: 3, explain: '"Plan for up to a day of latency, and treat the under-an-hour case as a bonus, not a promise."' },
    { q: 'Batch tốn 40 USD. Cùng việc đó chạy đồng bộ (không cache) tốn khoảng bao nhiêu?', options: ['20 USD', '80 USD', '40 USD', '60 USD'], answer: 1, explain: 'Batch tính 50% giá chuẩn cho cả input và output, nên giá chuẩn gấp đôi: khoảng 80 USD.' },
    { q: 'Với job chỉ vài request, giảm giá batch có ý nghĩa không?', options: ['Rất lớn, luôn nên dùng batch', 'Không áp dụng cho job nhỏ', 'Không đáng kể', 'Bị tính phí tối thiểu cao hơn'], answer: 2, explain: '"On a handful of requests, that\'s pocket change. On a job with tens of thousands of them, it\'s real money saved."' },
    { q: 'Việc nào thuộc nhóm "latency-bound" nên ở lại realtime?', options: ['Nút "Gợi ý" người dùng bấm rồi chờ', 'Tóm tắt toàn bộ kho tài liệu cũ', 'Đánh giá lại 50.000 câu trả lời của model', 'Phân loại log của tháng trước'], answer: 0, explain: '"Any latency-bound work, where the time to answer is part of the product, belongs here."' },
    { q: 'Câu nào ĐÚNG về params trong mỗi entry batch?', options: ['Là một định dạng riêng chỉ dành cho batch', 'Chỉ được chứa prompt dạng chuỗi', 'Không được có system prompt', 'Một body Messages API đầy đủ'], answer: 3, explain: '"Every item in the batch is a full request you could have sent on its own."' },
    { q: 'Ba điều cơ bản định nghĩa batch là gì?', options: ['Model, prompt, tool', 'Endpoint, giá và tính bất đồng bộ của job', 'Stream, cache, thinking', 'User, assistant, system'], answer: 1, explain: '"Endpoint, price, asynchronous. Those three frame everything else."' },
    { q: 'Job phân loại 80.000 ticket tồn đọng, không ai chờ, không yêu cầu ZDR. Lựa chọn hợp lý?', options: ['Messages API đồng bộ chạy song song', 'Một vòng lặp agent', 'Message Batches API', 'Streaming từng ticket'], answer: 2, explain: '"If the work is latency-insensitive, and there\'s a lot of it, that 50% discount adds up fast."' },
    { q: 'Bạn chuyển code đồng bộ sang batch nhưng vẫn để "stream": true. Theo bài học, bạn mất gì khi dùng batch?', options: ['Streaming', 'Tool use', 'Vision', 'System prompt'], answer: 0, explain: '"For anything a person is watching in real time... you can\'t stream." Batch chạy nền, không có kết nối sống để stream.' },
    { q: 'Câu tổng kết đúng của bài là gì?', options: ['Realtime và batch là một API với một công tắc', 'Batch luôn tốt hơn vì rẻ', 'Realtime luôn tốt hơn vì nhanh', 'Hai công cụ, chọn theo độ trễ chấp nhận được'], answer: 3, explain: '"Real-time and batching aren\'t one API with a toggle. They\'re different tools... Match the surface to the latency the work can tolerate."' },
    { q: 'Batch tạo lúc 9 giờ sáng ngày 1. Ngày 20 bạn mới nhớ ra cần tải kết quả. Có tải được không?', options: ['Không, vì đã quá 24 giờ', 'Có, vẫn trong 29 ngày', 'Không, kết quả chỉ giữ 7 ngày', 'Chỉ tải được nếu chạy lại batch'], answer: 1, explain: 'Hạn 24 giờ là cho xử lý; kết quả "stay downloadable" 29 ngày kể từ lúc tạo batch.' },
    { q: 'Vì sao Batches API tồn tại, theo bài học?', options: ['Để stream nhanh hơn', 'Để vượt rate limit', 'Vì nửa giá', 'Để dùng được nhiều model cùng lúc'], answer: 2, explain: '"The price, that half-rate discount you just met, which is the entire reason the batch\'s API exists."' },
  ],
};
