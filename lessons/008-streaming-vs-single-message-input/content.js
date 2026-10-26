window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Ý chính của cả bài:</strong> Agent SDK nhận đầu vào theo hai cách. <strong>Streaming input</strong> (mặc định, được khuyên dùng):
agent chạy như một tiến trình sống lâu, bạn đưa tin nhắn vào dần. <strong>Single message input</strong>: một chuỗi vào, một câu trả lời ra, xong.
Cả hai đi vào <strong>cùng một vòng lặp</strong>; khác nhau ở khả năng chúng mở ra. Và đừng nhầm streaming <em>input</em> với streaming <em>output</em>.</p>

<h3>1. Hai chế độ đặt cạnh nhau</h3>
<ul>
  <li><strong>Streaming input:</strong> prompt không phải một chuỗi mà là một chuỗi tin nhắn bất đồng bộ; agent chạy như tiến trình sống lâu mà bạn "nuôi" theo thời gian. Đây là mặc định và được khuyên dùng.</li>
  <li><strong>Single message input:</strong> prompt chỉ là một chuỗi, agent trả lời một lần, lần chạy kết thúc. Hợp với yêu cầu một lần hoặc môi trường không trạng thái, ví dụ hàm serverless khởi động mới cho mỗi lần gọi.</li>
</ul>
<p>Vòng lặp bên dưới giống nhau; khác ở cách prompt đi vào và những gì điều đó mở ra.</p>

<h3>2. Vì sao streaming input là mặc định được khuyên dùng?</h3>
<p>Chạy agent như một tiến trình sống mở ra những thứ mà một chuỗi gửi một lần không làm được:</p>
<ul>
  <li><strong>Đính kèm ảnh</strong> trực tiếp trong tin nhắn, nên dùng được khả năng nhìn ảnh.</li>
  <li><strong>Xếp hàng tin nhắn mới</strong> trong khi một lượt còn đang chạy, đưa thêm thông tin cho agent khi nó đang làm.</li>
  <li><strong>Ngắt một lần chạy</strong> theo thời gian thực qua đối tượng client, thay vì chờ nó xong.</li>
  <li><strong>Ngữ cảnh nhiều lượt tự nhiên:</strong> hội thoại tự được giữ lại mà bạn không phải tự ghép.</li>
</ul>

<h3>3. Công bằng với single message input</h3>
<p>Hình dạng của nó là một chuỗi gửi một lần: đưa prompt, nhận một câu trả lời, không có phiên nào mở lại sau đó.
Đó chính là điều bạn muốn trong môi trường không trạng thái: hàm serverless hoặc job xử lý hàng loạt khởi động, trả lời rồi tắt cho mỗi yêu cầu.
Không có tiến trình lâu dài phải quản lý nên triển khai đơn giản.</p>
<p>Vậy là không bao giờ có trí nhớ? Không hẳn. Vẫn có hành vi nhiều lượt, nhưng chỉ bằng cách dùng tùy chọn <strong>continue</strong> hoặc <strong>resume session</strong>
để nối lại một lần chạy trước. Việc này chủ động hơn so với sự tự nhiên của streaming, nhưng với việc một lần thì đó thường là đánh đổi đúng.</p>

<h3>4. Chọn thế nào?</h3>
<ul>
  <li>Xây thứ gì đó <strong>tương tác, dùng nhiều tool, nhiều lượt</strong>: dùng streaming input.</li>
  <li>Chỉ cần <strong>một câu trả lời</strong>, hoặc triển khai vào hàm không trạng thái thức dậy theo từng request: single message gọn hơn.</li>
  <li>Phép thử nhanh: cần <strong>đính kèm ảnh</strong> hoặc <strong>ngắt lần chạy</strong> khi đang chạy? Cả hai đều chỉ thẳng tới streaming.</li>
  <li>Thật sự phân vân: dựa vào mặc định. Streaming input được khuyên dùng nên bắt đầu ở đó hiếm khi sai.</li>
</ul>

<h3>5. Bốn điều hay bị nhầm</h3>
<ul>
  <li>Streaming và single message là <strong>chế độ nhập</strong> vào một vòng lặp dùng chung, không phải hai động cơ riêng.</li>
  <li>Streaming input <strong>không bắt buộc</strong> dùng đối tượng client: bản thân query nhận được prompt bất đồng bộ. Ngoại lệ duy nhất là <strong>ngắt</strong>: vẫn cần ClaudeSDKClient, kể cả ở chế độ streaming.</li>
  <li>Tách bạch streaming <strong>đầu vào của SDK</strong> với streaming <strong>đầu ra của API</strong>: cờ <code>stream: true</code> khi gọi model trực tiếp là một cơ chế hoàn toàn khác.</li>
  <li>Muốn xem output trực tiếp khi model đang viết, bật <code>include_partial_messages</code>: bạn nhận các stream event theo từng token.</li>
</ul>

<h3>6. Hai chiều của chữ "streaming"</h3>
<p><strong>Streaming input là về gửi:</strong> cách đưa prompt vào vòng lặp dưới dạng chuỗi tin nhắn bất đồng bộ.
<strong>Streaming output là về nhận:</strong> xem token của model đến dần khi được tạo ra thay vì chờ câu trả lời hoàn chỉnh.</p>
<p>Hai lựa chọn này <strong>độc lập</strong> và kết hợp tùy ý: có thể stream input mà không stream output, và có thể stream output trong một lần chạy single message.
Hình dung một giao diện chat: streaming input đưa tin nhắn của người dùng vào, streaming output "vẽ" câu trả lời lên màn hình từng token.</p>

<h3>7. Chốt từ vựng: một chữ, ba việc</h3>
<ul>
  <li><strong>Streaming input:</strong> đưa vào vòng lặp một chuỗi tin nhắn bất đồng bộ. Chế độ nhập mặc định và được khuyên dùng.</li>
  <li><strong>include_partial_messages:</strong> cờ Python bật output trực tiếp qua SDK, đưa token cho bạn dưới dạng stream event khi model đang viết.</li>
  <li><strong>stream: true:</strong> cờ ở cấp API trên một lời gọi model trực tiếp, không liên quan tới chế độ nhập của SDK.</li>
</ul>
<p>Một cái về cách prompt đi vào, một cái về xem output đi ra qua SDK, một cái thuộc về API gốc.</p>

<h3>8. Mặc định nên dùng</h3>
<p>Với phần lớn agent: bắt đầu bằng <strong>streaming input</strong>, giữ nguyên hộp đồ nghề (ảnh, ngắt, xếp hàng tin nhắn, nhiều lượt tự nhiên).
Chỉ chuyển xuống single message khi có lý do thật, thường là việc một lần không trạng thái, nơi một tiến trình lâu dài chỉ là gánh nặng.
Bật thêm streaming output khi có người đang xem câu trả lời hiện ra. Chế độ nhập nên là <strong>một quyết định</strong>, không phải một sự tình cờ.</p>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">draw that line</em>: vạch ranh giới.</li>
  <li><em class="en">long-lived process</em>: tiến trình sống lâu.</li>
  <li><em class="en">on the table</em>: có thể dùng, nằm trong lựa chọn.</li>
  <li><em class="en">stitching it together</em>: tự ghép nối lại.</li>
  <li><em class="en">earns its place</em>: xứng đáng có chỗ đứng.</li>
  <li><em class="en">get tangled</em>: bị rối.</li>
  <li><em class="en">snaps into focus</em>: bỗng trở nên rõ ràng.</li>
  <li><em class="en">a decision, not an accident</em>: một quyết định, không phải sự tình cờ.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/lesson08/Lesson08.java</code>. Có 5 bài: chọn chế độ nhập theo đặc điểm công việc, viết single message (model chỉ thấy một lượt),
viết phiên streaming input (hội thoại tự nối tiếp, tin nhắn được đọc dần), resume một phiên cũ một cách chủ động,
và streaming output (chuyển từng đoạn ngay khi nhận). Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="08"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="08 --live"</code>: single message quên tên bạn, streaming input nhớ,
resume nhớ lại, và bài thơ hiện ra từng chữ qua streaming output.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Chatbot hỗ trợ cho phép người dùng gửi ảnh chụp lỗi, hỏi tiếp nhiều câu, và bấm "Dừng" khi câu trả lời lan man. Chế độ nhập phù hợp là gì?', options: ['Single message, gọi lại cho mỗi câu hỏi', 'Streaming input', 'Single message kèm resume session', 'Single message, gửi ảnh qua đường dẫn'], answer: 1, explain: 'Cần ảnh, nhiều lượt và ngắt giữa chừng: cả ba đều chỉ tới streaming input.' },
    { q: 'Hàm serverless nhận một đoạn văn, trả về bản dịch rồi tắt. Không cần nhớ gì, không cần ngắt. Chế độ phù hợp là gì?', options: ['Streaming input, vì là mặc định', 'Single message input', 'Streaming input kèm ClaudeSDKClient', 'Streaming input kèm include_partial_messages'], answer: 1, explain: 'Việc một lần trong môi trường không trạng thái là chỗ single message "earns its place".' },
    { q: 'Câu nào SAI?', options: ['Streaming input và single message dùng chung một vòng lặp', 'Streaming input bắt buộc phải dùng ClaudeSDKClient', 'Ngắt một lần chạy cần ClaudeSDKClient', 'Single message vẫn có thể nhiều lượt nhờ resume'], answer: 1, explain: '"Streaming Input doesn\'t require the client object. Query itself accepts an async prompt." Chỉ có ngắt mới cần client.' },
    { q: 'Ứng dụng dùng query() với prompt bất đồng bộ (streaming input). Giờ cần thêm nút ngắt lần chạy. Cần thay đổi gì?', options: ['Không cần gì, query() đã ngắt được', 'Chuyển sang dùng ClaudeSDKClient', 'Bật include_partial_messages', 'Đặt stream: true trên lời gọi API'], answer: 1, explain: '"Interrupts are the one exception. They still require Claude SDK Client, even in streaming mode."' },
    { q: 'Cờ stream: true khi gọi Messages API trực tiếp liên quan gì tới streaming input của Agent SDK?', options: ['Chính là cùng một cơ chế', 'Bật nó là bật streaming input', 'Không liên quan', 'Bật nó thì streaming input sẽ bị tắt đi'], answer: 2, explain: '"The stream true flag on a raw model call is a different mechanism entirely."' },
    { q: 'Trong Python, muốn thấy chữ hiện ra từng token qua Agent SDK thì bật gì?', options: ['stream: true', 'include_partial_messages', 'Streaming input', 'max_turns'], answer: 1, explain: 'Include Partial Messages "delivers the model\'s tokens to you as stream event messages while it writes".' },
    { q: 'Ghép đúng: (1) streaming input, (2) include_partial_messages, (3) stream: true.', options: ['(1) cấp API, (2) gửi vào, (3) nhận ra qua SDK', '(1) gửi vào, (2) nhận ra qua SDK, (3) cấp API', '(1) nhận ra qua SDK, (2) cấp API, (3) gửi vào', '(1) gửi vào, (2) cấp API, (3) nhận ra qua SDK'], answer: 1, explain: '"One term is about how prompts go in, one is about watching output come out through the SDK, and one belongs to the raw API."' },
    { q: 'Có thể stream output trong một lần chạy single message không?', options: ['Không, phải dùng streaming input', 'Có, vì hai lựa chọn độc lập nhau', 'Chỉ khi dùng ClaudeSDKClient', 'Chỉ trong TypeScript'], answer: 1, explain: '"The two are independent choices you can mix freely... you can stream output on a single message run."' },
    { q: 'Trong một giao diện chat, chiều nào là của streaming input?', options: ['Vẽ câu trả lời lên màn hình từng token', 'Đưa tin nhắn người dùng vào', 'Lưu lịch sử chat xuống cơ sở dữ liệu', 'Gửi thông báo đẩy khi có câu trả lời'], answer: 1, explain: '"Streaming input carries the user\'s messages in, and output streaming paints the reply on-screen token by token."' },
    { q: 'Single message input muốn có hành vi nhiều lượt thì làm cách nào?', options: ['Không thể, chỉ streaming mới nhớ', 'Dùng continue hoặc resume session', 'Gửi một chuỗi thật dài chứa cả lịch sử', 'Bật include_partial_messages'], answer: 1, explain: '"You can still get multi-turn behavior, but only by using the Continue and Resume Session options to reconnect to a prior run."' },
    { q: 'So với streaming input, việc nhớ hội thoại ở single message khác thế nào?', options: ['Tự nhiên hơn', 'Chủ động hơn', 'Giống hệt nhau', 'Không bao giờ làm được'], answer: 1, explain: '"It\'s more deliberate than Streaming\'s natural persistence."' },
    { q: 'Khả năng nào KHÔNG được bài học liệt kê là thứ streaming input mở ra?', options: ['Đính kèm ảnh trong tin nhắn', 'Xếp hàng tin nhắn mới khi một lượt còn đang chạy', 'Giảm chi phí token', 'Ngữ cảnh nhiều lượt tự nhiên'], answer: 2, explain: 'Bốn khả năng là: ảnh, xếp hàng tin nhắn, ngắt theo thời gian thực, nhiều lượt tự nhiên. Không có giảm chi phí.' },
    { q: 'Người dùng gửi thêm "à, chỉ cần bản tóm tắt thôi" khi agent đang chạy dở một lượt. Khả năng nào cho phép đưa tin nhắn này vào?', options: ['Resume session', 'Xếp hàng tin nhắn', 'include_partial_messages', 'Gửi một single message mới với chuỗi đã sửa'], answer: 1, explain: '"You can queue new messages while a turn is still running, feeding the agent more as it works."' },
    { q: 'Vì sao single message hợp với môi trường không trạng thái?', options: ['Vì nó luôn rẻ hơn', 'Vì không phải quản lý tiến trình nào', 'Vì nó hỗ trợ ảnh tốt hơn', 'Vì nó chạy vòng lặp agent nhanh hơn streaming'], answer: 1, explain: '"There\'s no persistent process to manage, which keeps deployment simple."' },
    { q: 'Khi thật sự phân vân giữa hai chế độ nhập, nên chọn gì?', options: ['Single message vì đơn giản hơn', 'Streaming input vì là mặc định', 'Cả hai cùng lúc rồi so sánh', 'Gọi Messages API trực tiếp'], answer: 1, explain: '"When you\'re genuinely unsure, lean on the default."' },
    { q: 'Phép thử nhanh nào chỉ thẳng tới streaming input?', options: ['Việc có cần trả lời dưới 1 giây không', 'Có cần ảnh hoặc cần ngắt không', 'Có cần dùng hơn ba tool không', 'Có cần chạy trong container Docker hay không'], answer: 1, explain: '"Do you need to attach images or interrupt a run while it\'s live? Both of those point straight at Streaming."' },
    { q: 'Job hàng loạt chạy đêm xử lý 10.000 tài liệu độc lập, mỗi tài liệu một câu trả lời. Nhận định nào đúng?', options: ['Bắt buộc streaming input vì có nhiều tài liệu', 'Single message là lựa chọn gọn, vì mỗi việc chỉ chạy một lần', 'Phải dùng ClaudeSDKClient để giữ phiên qua 10.000 tài liệu', 'Phải bật include_partial_messages để chạy nhanh'], answer: 1, explain: 'Một job batch "spins up, answers, and shuts down for each request": đúng chỗ của single message.' },
    { q: 'Câu nào đúng về động cơ bên dưới hai chế độ nhập?', options: ['Streaming dùng vòng lặp mạnh hơn', 'Cùng một vòng lặp dùng chung', 'Single message không có vòng lặp tool', 'Mỗi chế độ dùng một model khác'], answer: 1, explain: '"Streaming and Single Message are input modes into one shared agent loop. They aren\'t separate engines."' },
    { q: 'Bật include_partial_messages thì bạn nhận thêm loại message nào?', options: ['System init thứ hai', 'Các stream event theo từng token', 'Result trung gian sau mỗi lượt', 'User message chứa bản nháp'], answer: 1, explain: 'Bạn nhận "stream event deltas, token by token, as the agent writes".' },
    { q: 'Câu nào nhầm lẫn khái niệm?', options: ['Streaming input là về cách gửi prompt vào', 'Streaming output là về cách nhận token ra', 'Có streaming input là có streaming output', 'Hai lựa chọn có thể kết hợp tùy ý'], answer: 2, explain: '"You can stream input without streaming output."' },
    { q: 'Theo bài học, khi nào nên bật thêm streaming output?', options: ['Luôn bật cho mọi job', 'Khi có người đang xem trực tiếp', 'Chỉ khi chạy ở chế độ single message input', 'Khi muốn giảm chi phí token'], answer: 1, explain: '"Layer output streaming on top whenever a human is watching responses appear, and you want them live."' },
    { q: 'Ứng dụng A dùng streaming input nhưng không bật streaming output; ứng dụng B dùng single message và bật streaming output. Nhận định nào đúng?', options: ['Chỉ A là hợp lệ', 'Chỉ B là hợp lệ', 'Cả hai đều hợp lệ', 'Cả hai đều sai cấu hình'], answer: 2, explain: 'Input và output streaming độc lập, "you can mix freely".' },
    { q: 'Câu nào mô tả đúng shape của single message input?', options: ['Một chuỗi tin nhắn bất đồng bộ', 'Một chuỗi văn bản gửi một lần', 'Một phiên sống lâu được nuôi dần', 'Một luồng token từ model'], answer: 1, explain: '"Your prompt is just one string, the agent answers once, and the run is done."' },
    { q: 'Câu nào mô tả đúng shape của streaming input?', options: ['Một chuỗi văn bản gửi một lần', 'Chuỗi tin nhắn bất đồng bộ', 'Một file chứa toàn bộ hội thoại', 'Một yêu cầu HTTP tới Messages API có cờ stream: true'], answer: 1, explain: '"Your prompt isn\'t a single string. It\'s an async series of messages, and the agent runs as a persistent, long-lived process."' },
    { q: 'Nhóm chọn single message cho một trợ lý lập trình tương tác, cần sửa code qua nhiều lượt và gửi ảnh chụp màn hình. Hậu quả có khả năng xảy ra nhất?', options: ['Không vấn đề gì, single message làm được hết', 'Phải tự nối phiên, và mất khả năng gửi ảnh', 'Chi phí tăng gấp đôi', 'Agent không dùng được tool'], answer: 1, explain: 'Ảnh là khả năng của streaming input; nhiều lượt ở single message phải nối lại phiên một cách thủ công.' },
    { q: 'Theo bài học, mục tiêu khi chọn chế độ nhập là gì?', options: ['Luôn chọn chế độ cần viết ít code nhất', 'Chọn có chủ đích', 'Luôn chọn chế độ rẻ nhất', 'Để SDK tự chọn'], answer: 1, explain: '"That way, your input mode is a decision, not an accident."' },
    { q: 'Chữ "streaming" trong bài học được dùng cho mấy việc khác nhau?', options: ['Một', 'Hai', 'Ba', 'Bốn'], answer: 2, explain: '"Same word, three jobs."' },
    { q: 'Vì sao streaming input được gọi là chế độ dành cho agent "thật, tương tác"?', options: ['Vì nó luôn nhanh hơn', 'Vì nó giữ đủ ảnh, ngắt, nhiều lượt', 'Vì nó không tốn token', 'Vì nó không cần khai báo tool như single message'], answer: 1, explain: '"Add it up, and Streaming Input is the mode built for real, interactive agents."' },
    { q: 'Câu nào là đánh đổi đúng khi chuyển từ streaming sang single message?', options: ['Triển khai đơn giản hơn, nhưng mất ảnh, ngắt và nhiều lượt tự nhiên', 'Đổi chi phí cao lấy tốc độ nhanh', 'Đổi chất lượng câu trả lời lấy độ an toàn khi chạy production', 'Không có đánh đổi nào vì hai chế độ dùng chung một vòng lặp'], answer: 0, explain: 'Chỉ chuyển "when you have a real reason, usually a stateless one-off job", vì bạn từ bỏ các khả năng của streaming.' },
    { q: 'Câu nào là điều cần nhớ cuối bài?', options: ['Hai chế độ là hai động cơ khác nhau, phải chọn đúng từ đầu', 'Bạn chọn khả năng, không chọn động cơ', 'Streaming input luôn đắt hơn', 'Single message đã lỗi thời'], answer: 1, explain: '"Both feed the same shared loop, so you\'re choosing capability, not a different engine."' },
  ],
};
