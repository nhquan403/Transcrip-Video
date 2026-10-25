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

  quiz: [
    { q: 'Agent SDK nhận đầu vào theo mấy cách?', options: ['Một', 'Hai: streaming input và single message input', 'Ba', 'Bốn'], answer: 1, explain: 'Hai chế độ nhập: streaming và single message.' },
    { q: 'Chế độ nhập nào là mặc định và được khuyên dùng?', options: ['Streaming input', 'Single message input', 'Batch input', 'File input'], answer: 0, explain: 'Streaming input là mặc định được khuyên dùng.' },
    { q: 'Ở chế độ streaming input, agent chạy như thế nào?', options: ['Trả lời một lần rồi tắt', 'Chỉ chạy trên trình duyệt', 'Như một tiến trình sống lâu, được đưa tin nhắn vào theo thời gian', 'Chỉ chạy khi có ảnh'], answer: 2, explain: 'Prompt là một chuỗi tin nhắn bất đồng bộ, agent sống lâu.' },
    { q: 'Single message input phù hợp nhất với trường hợp nào?', options: ['Chatbot nhiều lượt', 'Ứng dụng cần ngắt giữa chừng', 'Ứng dụng cần gửi ảnh', 'Yêu cầu một lần hoặc môi trường không trạng thái như hàm serverless'], answer: 3, explain: 'Một chuỗi vào, một câu trả lời ra, xong.' },
    { q: 'Hai chế độ nhập khác nhau ở động cơ bên dưới không?', options: ['Không, cùng một vòng lặp; khác ở cách prompt đi vào và những gì được mở ra', 'Có, hai động cơ khác hẳn', 'Có, streaming dùng model khác', 'Có, single message không dùng tool'], answer: 0, explain: 'Bạn chọn khả năng, không chọn động cơ khác.' },
    { q: 'Khả năng nào sau đây chỉ có ở streaming input?', options: ['Trả lời câu hỏi', 'Đính kèm ảnh trực tiếp trong tin nhắn', 'Dùng system prompt', 'Đếm token'], answer: 1, explain: 'Streaming input mở ra khả năng nhìn ảnh.' },
    { q: '"Xếp hàng tin nhắn mới" trong streaming input nghĩa là gì?', options: ['Gửi tin nhắn sau khi agent đã tắt', 'Gửi email cho agent', 'Đưa thêm tin nhắn trong khi một lượt còn đang chạy', 'Lưu tin nhắn vào file'], answer: 2, explain: 'Bạn có thể đưa thêm thông tin khi agent đang làm việc.' },
    { q: 'Ngắt một lần chạy theo thời gian thực cần gì?', options: ['Chỉ cần single message', 'Không làm được', 'Tắt mạng', 'Đối tượng ClaudeSDKClient, kể cả ở chế độ streaming'], answer: 3, explain: 'Ngắt là ngoại lệ duy nhất vẫn cần client.' },
    { q: 'Ở chế độ streaming input, ngữ cảnh nhiều lượt có được giữ lại không?', options: ['Có, hội thoại tự được giữ mà bạn không phải ghép', 'Không bao giờ', 'Chỉ khi dùng resume', 'Chỉ lượt cuối được giữ'], answer: 0, explain: 'Đó là ngữ cảnh nhiều lượt tự nhiên.' },
    { q: 'Single message input có cách nào để có hành vi nhiều lượt?', options: ['Không có cách nào', 'Dùng tùy chọn continue hoặc resume session để nối lại lần chạy trước', 'Gửi chuỗi thật dài', 'Đổi sang model khác'], answer: 1, explain: 'Chủ động hơn streaming, nhưng vẫn làm được.' },
    { q: 'Ưu điểm của single message input khi triển khai là gì?', options: ['Đính kèm được ảnh', 'Ngắt được giữa chừng', 'Không có tiến trình lâu dài phải quản lý nên triển khai đơn giản', 'Nhớ mọi cuộc hội thoại'], answer: 2, explain: 'Khởi động, trả lời, tắt cho mỗi yêu cầu.' },
    { q: 'Xây một ứng dụng tương tác, dùng nhiều tool, nhiều lượt thì nên chọn gì?', options: ['Single message', 'Không dùng SDK', 'Gọi API trực tiếp', 'Streaming input'], answer: 3, explain: 'Streaming input được xây cho agent tương tác.' },
    { q: 'Phép thử nhanh nào chỉ thẳng tới streaming input?', options: ['Cần đính kèm ảnh hoặc cần ngắt lần chạy khi đang chạy', 'Cần trả lời nhanh', 'Cần tiết kiệm tiền', 'Cần dùng Python'], answer: 0, explain: 'Cả hai đều cần streaming.' },
    { q: 'Khi thật sự phân vân giữa hai chế độ, nên làm gì?', options: ['Chọn single message cho an toàn', 'Dựa vào mặc định là streaming input', 'Dùng cả hai cùng lúc', 'Hỏi người dùng'], answer: 1, explain: 'Bắt đầu từ mặc định hiếm khi sai.' },
    { q: 'Streaming input có bắt buộc phải dùng đối tượng client không?', options: ['Có, luôn luôn', 'Có, với TypeScript', 'Không, query nhận được prompt bất đồng bộ; chỉ ngắt mới cần client', 'Không, nhưng phải dùng stream: true'], answer: 2, explain: 'Query tự nhận prompt dạng bất đồng bộ.' },
    { q: 'Cờ stream: true khi gọi model trực tiếp liên quan thế nào tới chế độ nhập của SDK?', options: ['Chính là streaming input', 'Bật cả hai chế độ', 'Tắt streaming input', 'Không liên quan, đó là cơ chế khác ở cấp API'], answer: 3, explain: 'Cùng chữ nhưng là cơ chế hoàn toàn khác.' },
    { q: 'Muốn xem output trực tiếp từng token qua SDK (Python) thì bật gì?', options: ['include_partial_messages', 'stream: true', 'max_turns', 'resume'], answer: 0, explain: 'Cờ này cho stream event theo từng token.' },
    { q: 'Streaming input là về chiều nào?', options: ['Nhận', 'Gửi: cách đưa prompt vào vòng lặp', 'Lưu trữ', 'Mã hóa'], answer: 1, explain: 'Input streaming là về gửi.' },
    { q: 'Streaming output là về chiều nào?', options: ['Gửi', 'Lưu trữ', 'Nhận: xem token đến dần khi model đang tạo', 'Xác thực'], answer: 2, explain: 'Output streaming là về nhận.' },
    { q: 'Có thể stream output trong một lần chạy single message không?', options: ['Không, phải dùng streaming input', 'Chỉ trên TypeScript', 'Chỉ khi có ảnh', 'Có, hai lựa chọn độc lập và kết hợp tùy ý'], answer: 3, explain: 'Input và output streaming là hai lựa chọn độc lập.' },
    { q: 'Trong một giao diện chat, streaming input và streaming output đóng vai trò gì?', options: ['Input đưa tin nhắn người dùng vào; output vẽ câu trả lời lên màn hình từng token', 'Cả hai đều đưa tin nhắn vào', 'Cả hai đều vẽ câu trả lời', 'Không dùng được trong chat'], answer: 0, explain: 'Một chiều gửi, một chiều nhận.' },
    { q: 'Cờ nào thuộc về API gốc, không phải SDK?', options: ['include_partial_messages', 'stream: true', 'Streaming input', 'max_turns'], answer: 1, explain: 'Stream true là cờ phản hồi ở cấp API.' },
    { q: 'Câu nào đúng về ba thuật ngữ streaming input, include_partial_messages, stream: true?', options: ['Cả ba là một', 'Hai cái đầu giống nhau', 'Một chữ, ba việc: cách prompt đi vào, xem output qua SDK, và cờ của API gốc', 'Chỉ có streaming input là thật'], answer: 2, explain: 'Cùng chữ "stream", ba việc khác nhau.' },
    { q: 'Với phần lớn agent, nên bắt đầu bằng chế độ nào?', options: ['Single message', 'Batch', 'Không dùng SDK', 'Streaming input'], answer: 3, explain: 'Giữ nguyên hộp đồ nghề: ảnh, ngắt, xếp hàng, nhiều lượt.' },
    { q: 'Khi nào nên chuyển xuống single message?', options: ['Khi có lý do thật, thường là việc một lần không trạng thái', 'Khi muốn nhanh hơn', 'Khi dùng nhiều tool', 'Khi cần ngắt'], answer: 0, explain: 'Ở đó tiến trình lâu dài chỉ là gánh nặng.' },
    { q: 'Khi nào nên bật thêm streaming output?', options: ['Không bao giờ', 'Khi có người đang xem câu trả lời hiện ra và muốn thấy ngay', 'Chỉ trong job hàng loạt', 'Chỉ khi chạy serverless'], answer: 1, explain: 'Streaming output dành cho trải nghiệm xem trực tiếp.' },
    { q: 'Tình huống: một hàm serverless dịch một câu cho mỗi request. Chế độ phù hợp?', options: ['Streaming input với ClaudeSDKClient', 'Streaming input với ảnh', 'Single message input', 'Không dùng được SDK'], answer: 2, explain: 'Một lần, không trạng thái: single message gọn hơn.' },
    { q: 'Tình huống: trợ lý cho phép người dùng gửi ảnh chụp màn hình lỗi rồi hỏi tiếp nhiều câu. Chế độ phù hợp?', options: ['Single message', 'Single message với resume', 'Batch', 'Streaming input'], answer: 3, explain: 'Cần ảnh và nhiều lượt: streaming input.' },
    { q: 'Single message nhớ lại cuộc trò chuyện trước bằng cách nào so với streaming?', options: ['Chủ động hơn, qua continue hoặc resume', 'Tự nhiên hơn', 'Không thể nhớ', 'Giống hệt nhau'], answer: 0, explain: 'Streaming nhớ tự nhiên; single message phải chủ động nối lại.' },
    { q: 'Câu chốt của bài về chế độ nhập là gì?', options: ['Luôn dùng single message', 'Chế độ nhập nên là một quyết định, không phải sự tình cờ', 'Chế độ nhập không quan trọng', 'Chỉ chuyên gia mới cần chọn'], answer: 1, explain: 'Bắt đầu từ mặc định, hiểu mỗi chế độ đánh đổi gì, và chuyển có chủ đích.' },
  ],
};
