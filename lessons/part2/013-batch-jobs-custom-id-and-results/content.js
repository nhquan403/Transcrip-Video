window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Kết quả batch <strong>không về theo thứ tự bạn gửi</strong>. Vì vậy mỗi request mang một <strong>custom_id</strong> duy nhất,
và bạn <strong>ghép kết quả theo custom_id, không bao giờ theo vị trí</strong>. Batch vẫn hỗ trợ gần như mọi thứ (tool, vision, thinking, system);
chỉ bỏ streaming và vài tham số.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>custom_id:</strong> nhãn duy nhất bạn gắn cho từng request trong batch; kết quả mang lại đúng nhãn đó.</li>
  <li><strong>params:</strong> body Messages API bình thường của request (model, max_tokens, messages, tools...).</li>
  <li><strong>Server tools:</strong> tool chạy phía Anthropic: web search, web fetch, code execution.</li>
  <li><strong>Best effort:</strong> cố gắng nhưng không cam kết.</li>
</ul>

<h3>Một entry của batch gồm gì?</h3>
<ul>
  <li><strong>custom_id:</strong> nhãn duy nhất của request. Giữ ý này trong đầu, nó là chìa khóa của mọi thứ phía sau.</li>
  <li><strong>params:</strong> body Messages API chuẩn: model, max_tokens, messages, tools như một lời gọi thường.</li>
  <li><strong>Quy tắc:</strong> mọi custom_id trong batch phải <strong>duy nhất</strong>. Dùng lại một id là kết quả mập mờ và bước ghép sụp đổ.</li>
</ul>

<h3>Định dạng custom_id (API kiểm tra chặt)</h3>
<ul>
  <li>Dài từ <strong>1 tới 64 ký tự</strong>.</li>
  <li>Chỉ gồm <strong>chữ cái, chữ số, gạch ngang (-), gạch dưới (_)</strong>. Không dấu cách, không gạch chéo, không ký hiệu đặc biệt.</li>
  <li><strong>Duy nhất</strong> trong cả batch.</li>
</ul>
<p>💡 Mẹo: đặt custom_id <strong>có ý nghĩa</strong>, ví dụ khóa chính của dòng dữ liệu hay mã tài liệu. Khi kết quả về, ghép với nguồn trở nên dễ dàng.
Id ngẫu nhiên hay dùng lại chỉ làm bạn khổ lúc ghép.</p>

<h3>Quy tắc quan trọng nhất: ghép theo custom_id, không theo vị trí</h3>
<div class="box">🧥 <strong>Hình dung thế này:</strong> Gửi áo ở phòng gửi đồ, bạn nhận một <strong>thẻ số</strong>. Lúc lấy, nhân viên tìm theo số trên thẻ,
không phải "áo thứ ba trên giá là của người thứ ba xếp hàng". Kết quả batch là áo, custom_id là thẻ.</div>
<p>Mỗi kết quả mang custom_id bạn đã gán; dùng nó để tra input tương ứng, dù kết quả về theo thứ tự nào.
Cái bẫy: nghĩ rằng kết quả thứ ba khớp với input thứ ba. <strong>Không phải.</strong> Ghép theo chỉ số sẽ <strong>âm thầm làm hỏng dữ liệu</strong>,
và "âm thầm" là phần nguy hiểm: không có lỗi nào, chỉ có câu trả lời bị dán nhầm sang input khác.</p>

<h3>Một ví dụ thất bại</h3>
<p>Bạn batch 1.000 ticket để phân loại, rồi viết vòng lặp <strong>zip</strong> input với output theo vị trí. Nó vui vẻ dán từng nhãn vào sai ticket,
không ném lỗi nào. Mỗi dòng ghi ngược lại đều có một câu trả lời <strong>trông hợp lý nhưng sai</strong>, và không gì phía sau phát hiện được.</p>
<p><strong>Cách sửa chỉ là một nếp kỷ luật:</strong> nạp input vào một dictionary có khóa là custom_id, rồi đi qua kết quả và tra từng cái theo custom_id nó mang.
Coi thứ tự về là vô nghĩa, vì nó đúng là vô nghĩa.</p>

<h3>Batch KHÔNG phải chế độ rút gọn</h3>
<ul>
  <li><strong>Vision</strong> chạy bình thường.</li>
  <li><strong>Tool use</strong> chạy, kể cả mọi <strong>server tool</strong>: web search, web fetch, code execution, không chỉ client tool.</li>
  <li><strong>System message</strong> và <strong>hội thoại nhiều lượt</strong> giữ nguyên.</li>
  <li><strong>Adaptive thinking</strong> chạy trong batch, cùng extended thinking kiểu cũ trên những model cũ còn nhận.</li>
</ul>
<p>Batch là một request bình thường, chỉ là chạy bất đồng bộ và rẻ.</p>

<h3>Cái gì KHÔNG chạy trong batch?</h3>
<ul>
  <li><strong>stream:</strong> batch chạy nền nên stream vô nghĩa và bị từ chối.</li>
  <li><strong>Tham số speed</strong> (cờ fast mode) cũng không được.</li>
  <li>Các tham số liên quan tới <strong>thread</strong> (như store và tham chiếu thread trước) bị từ chối; các tham số <strong>cache hint</strong> và <strong>context hint</strong> cũng vậy.</li>
  <li><strong>max_tokens</strong> phải ít nhất là 1, không bao giờ bằng 0.</li>
</ul>
<p>⚠️ Lỗi hay gặp: tái dùng code tạo request đồng bộ để dựng entry batch, mà code đó hay đặt <code>stream: true</code>, và cờ sót lại làm hỏng entry. Hãy <strong>bỏ những trường đó</strong> khi chuyển một lời gọi thành entry batch.</p>

<h3>Prompt caching trong batch</h3>
<p>Caching <strong>có chạy</strong>, nhưng các request trong batch chạy <strong>đồng thời và theo thứ tự bất kỳ</strong>, nên caching chỉ là best effort:
mục cache 5 phút có thể hết hạn trước khi các request cần dùng chung kịp chạy.
Khi các entry có chung một prefix lớn (system prompt dài, tài liệu chính sách), hãy chọn <strong>TTL 1 giờ</strong> để ngữ cảnh chung còn ấm đủ lâu. Một thiết lập nhỏ, tác động chi phí thật khi quy mô lớn.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Kết quả không theo thứ tự: ghép theo custom_id, không theo vị trí.</li>
  <li>Tham số bị giới hạn: bỏ stream, speed, tham số thread và cache/context hint; max_tokens ≥ 1.</li>
  <li>Batch vẫn đầy đủ tính năng: tool (kể cả server tool), vision, system, thinking.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">that can bite you</em>: có thể làm bạn "dính đòn".</li>
  <li><em class="en">they don't line up</em>: chúng không khớp hàng.</li>
  <li><em class="en">Hold on to that idea</em>: giữ ý đó trong đầu.</li>
  <li><em class="en">falls apart</em>: sụp đổ.</li>
  <li><em class="en">enforces it strictly</em>: kiểm tra nó rất chặt.</li>
  <li><em class="en">matching each one to its source is trivial</em>: ghép từng cái với nguồn trở nên dễ ợt.</li>
  <li><em class="en">silently corrupts your data</em>: âm thầm làm hỏng dữ liệu.</li>
  <li><em class="en">stapling each label to the wrong ticket</em>: dập ghim từng nhãn vào sai ticket.</li>
  <li><em class="en">a plausible, but wrong, answer</em>: một câu trả lời nghe hợp lý nhưng sai.</li>
  <li><em class="en">one line of discipline</em>: một dòng kỷ luật.</li>
  <li><em class="en">a stripped-down mode</em>: một chế độ bị cắt bớt.</li>
  <li><em class="en">keep the shared context warm</em>: giữ ngữ cảnh chung còn ấm.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson13/Lesson13.java</code>. Có 4 bài: kiểm tra định dạng custom_id, kiểm tra cả batch trước khi gửi
(id sai, id trùng, stream hay speed sót lại, max_tokens nhỏ hơn 1), chuyển một request đồng bộ thành params của batch,
và ghép kết quả về đúng input theo custom_id kèm danh sách cần chạy lại. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-13"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-13 --live"</code>: chương trình gửi một Message Batch thật gồm 4 ticket (custom_id là mã ticket),
chờ tối đa 3 phút, tải kết quả JSONL, in thứ tự kết quả thật sự về, rồi ghép bằng code của bạn. Nếu batch chưa xong, chương trình in id để bạn xem sau.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Vấn đề chính bài học muốn giải quyết là gì?', options: ['Batch quá đắt cho job nhỏ', 'Kết quả không theo thứ tự gửi', 'Batch không hỗ trợ tool use', 'Batch không dùng được system prompt'], answer: 1, explain: '"You submit requests in a careful order, get results back, and they don\'t line up. Batches don\'t return results in the order that you sent them."' },
    { q: 'Một entry trong batch gồm những gì?', options: ['prompt và priority', 'model và callback', 'custom_id và params', 'id ngẫu nhiên do server cấp và nội dung'], answer: 2, explain: '"A batch is a list of entries, and each entry pairs a custom ID with params."' },
    { q: 'params của một entry là gì?', options: ['Một body Messages API chuẩn', 'Một định dạng riêng của batch, khác Messages API', 'Chỉ chuỗi prompt', 'Danh sách các custom_id liên quan'], answer: 0, explain: '"The params is just a standard messages request body. The same model, max tokens, messages, and tools you\'d send on a normal call."' },
    { q: 'Điều gì xảy ra nếu hai entry dùng cùng một custom_id?', options: ['API tự đổi tên id thứ hai', 'Không sao, kết quả vẫn rõ ràng', 'Hai request được gộp làm một', 'Kết quả mập mờ'], answer: 3, explain: '"Every custom ID in the batch has to be unique. If you reuse one, your results get ambiguous, and the whole matching step falls apart."' },
    { q: 'custom_id phải dài bao nhiêu ký tự?', options: ['Đúng 32 ký tự', 'Từ 1 tới 64', 'Từ 8 tới 128', 'Không giới hạn'], answer: 1, explain: '"It has to be between one and 64 characters long."' },
    { q: 'custom_id nào HỢP LỆ?', options: ['ticket 1042', 'orders/1042', 'ticket_1042', 'ticket#1042'], answer: 2, explain: '"The allowed characters are letters, numbers, hyphens, and underscores. Nothing else. No spaces. No slashes. No special symbols."' },
    { q: 'Theo bài học, custom_id tốt nên là gì?', options: ['Khóa chính hoặc mã tài liệu', 'Một số ngẫu nhiên', 'Số thứ tự trong danh sách gửi', 'Thời gian gửi request'], answer: 0, explain: '"Make your custom ID something meaningful. Like the primary key of the database row that request came from, or a document ID."' },
    { q: 'Quy tắc quan trọng nhất của bài là gì?', options: ['Ghép kết quả theo thời gian hoàn thành', 'Ghép kết quả theo vị trí', 'Ghép theo độ dài câu trả lời', 'Ghép theo custom_id'], answer: 3, explain: '"When results come back, you match them by custom ID, never by position."' },
    { q: 'Vì sao ghép kết quả theo chỉ số (index) đặc biệt nguy hiểm?', options: ['Vì API trả lỗi 400', 'Vì không báo lỗi gì', 'Vì tốn gấp đôi token', 'Vì batch bị hủy'], answer: 1, explain: '"Lining them up by index silently corrupts your data. And silently is the dangerous part. Nothing errors."' },
    { q: 'Bạn batch 1.000 ticket rồi zip input và output theo vị trí. Kết quả là gì?', options: ['Lỗi ngay ở dòng đầu', 'Batch tự sắp xếp lại cho khớp', 'Sai nhãn, không lỗi', 'Chỉ mất vài kết quả cuối'], answer: 2, explain: '"It will happily produce garbage, stapling each label to the wrong ticket, and it won\'t throw a single error while doing it."' },
    { q: 'Cách sửa đúng cho việc ghép kết quả là gì?', options: ['Tra từng kết quả theo custom_id', 'Sắp xếp kết quả theo thời gian rồi zip', 'Gửi lại batch cho tới khi thứ tự đúng', 'Chỉ gửi batch một request'], answer: 0, explain: '"Load your inputs into a dictionary keyed by custom ID, then walk the results and look each one up by the custom ID it carries."' },
    { q: 'Theo bài học, nên coi thứ tự kết quả về là gì?', options: ['Thứ tự gửi', 'Thứ tự ưu tiên', 'Thứ tự độ khó', 'Vô nghĩa'], answer: 3, explain: '"Treat the arrival order as meaningless, because it is."' },
    { q: 'Hiểu lầm nào bài học muốn sửa nhất?', options: ['Batch nhanh hơn API đồng bộ', 'Batch là chế độ rút gọn', 'Batch đắt hơn API đồng bộ', 'Batch cần API key riêng'], answer: 1, explain: '"People assume a batch is a stripped-down mode that drops the good features. It isn\'t. Batches keep almost everything."' },
    { q: 'Trong batch, tool nào chạy được?', options: ['Chỉ client tool', 'Không tool nào', 'Mọi tool, kể cả server tool', 'Chỉ web search'], answer: 2, explain: '"Tool use works, and that includes every server tool, web search, web fetch, and code execution. Not just client tools."' },
    { q: 'Adaptive thinking trong batch thì sao?', options: ['Chạy được', 'Bị từ chối', 'Chỉ chạy với budget_tokens', 'Chỉ chạy khi stream'], answer: 0, explain: '"Adaptive thinking runs inside batches too, along with legacy extended thinking on the older models that still accept it."' },
    { q: 'Tham số nào bị từ chối trong batch?', options: ['system', 'tools', 'thinking', 'stream'], answer: 3, explain: '"Streaming is out. Since a batch runs in the background, stream has no meaning and gets rejected."' },
    { q: 'Ngoài stream, nhóm tham số nào cũng bị từ chối trong batch?', options: ['model và max_tokens', 'speed, thread, cache/context hint', 'system và messages', 'tools và tool_choice'], answer: 1, explain: '"The speed parameter, the fast mode flag, isn\'t allowed either. Thread-related params, like store... are rejected. And so are the cache hint and context hint parameters."' },
    { q: 'Entry có max_tokens: 0. Kết quả?', options: ['Chạy bình thường, trả câu rỗng', 'Server tự đặt 1024', 'Không qua kiểm tra', 'Chỉ trả về usage'], answer: 2, explain: '"And max tokens has to be at least one, never zero. Send any of those. And the request fails validation."' },
    { q: 'Vì sao lỗi "stream sót lại" hay xảy ra khi chuyển sang batch?', options: ['Do tái dùng code đồng bộ', 'Vì batch tự thêm stream', 'Vì SDK bắt buộc stream', 'Vì custom_id chứa chữ stream'], answer: 0, explain: '"This tends to bite when you build batch entries by reusing your synchronous request code, because that code often sets stream to true."' },
    { q: 'Khi chuyển một lời gọi đồng bộ thành entry batch, bạn nên làm gì?', options: ['Thêm stream: true cho nhanh', 'Bỏ system prompt', 'Bỏ tools vì batch không hỗ trợ', 'Bỏ các trường batch không nhận'], answer: 3, explain: '"Strip those fields when you convert a call into a batch entry. But notice what\'s not on this list. Tool use, vision, thinking, and system messages are all fine."' },
    { q: 'Prompt caching trong batch hoạt động thế nào?', options: ['Không chạy', 'Chạy, nhưng chỉ best effort', 'Luôn trúng cache 100%', 'Chỉ chạy với TTL 5 phút'], answer: 1, explain: '"Prompt caching does work in a batch... Requests in a batch execute concurrently and in any order. So caching is best effort."' },
    { q: 'Các entry trong batch dùng chung một system prompt dài. Nên chọn TTL nào?', options: ['5 phút', 'Không cache', '1 giờ', 'TTL càng ngắn càng tốt'], answer: 2, explain: '"The practical move is to prefer the one-hour cache lifetime instead of the default short one when your batch entries share a common prefix."' },
    { q: 'Vì sao TTL 5 phút dễ trượt cache trong batch?', options: ['Có thể hết hạn trước khi dùng tới', 'Vì batch không đọc được cache 5 phút', 'Vì 5 phút đắt hơn 1 giờ', 'Vì batch luôn đổi model'], answer: 0, explain: '"A short cache lifetime can easily expire before the requests that would have shared it actually run."' },
    { q: 'Batch có hỗ trợ hội thoại nhiều lượt và system message không?', options: ['Không hỗ trợ cả hai', 'Chỉ system', 'Chỉ nhiều lượt', 'Có, cả hai'], answer: 3, explain: '"System messages and full multi-turn conversations carry straight over."' },
    { q: 'Ba điều "hay làm người ta vấp" được tóm lại là gì?', options: ['Giá, tốc độ, model', 'Không theo thứ tự, ít tham số, đủ tính năng', 'Stream, cache, thinking', 'Endpoint, header, status'], answer: 1, explain: '"Unordered results, limited params, still full-featured. Those three keep you out of trouble."' },
    { q: 'Kết quả về theo thứ tự [TCK-3, TCK-1, TCK-2]. Bạn gửi theo thứ tự [TCK-1, TCK-2, TCK-3]. Nhãn đầu tiên trong kết quả thuộc về ticket nào?', options: ['TCK-1, vì là ticket gửi đầu tiên', 'Không xác định được', 'TCK-3, theo custom_id nó mang', 'TCK-2, vì nằm giữa'], answer: 2, explain: 'Thứ tự về là vô nghĩa; mỗi kết quả "carries the custom ID you assigned", nên nó thuộc TCK-3.' },
    { q: 'custom_id "đơn-hàng-1" có hợp lệ không?', options: ['Không hợp lệ', 'Có, vì không có dấu cách', 'Có, vì dưới 64 ký tự', 'Có, vì có gạch ngang'], answer: 0, explain: 'Chỉ cho phép "letters, numbers, hyphens, and underscores". Chữ có dấu như "đ", "ơ", "à" nằm ngoài tập ký tự chuẩn đó.' },
    { q: 'Mô hình tư duy đúng về một batch là gì?', options: ['Một API khác hoàn toàn với định dạng riêng', 'Một chế độ thử nghiệm', 'Một bản rút gọn chỉ cho văn bản', 'Request thường, chạy nền, rẻ'], answer: 3, explain: '"A batch is a normal request that happens to run asynchronously and cheaply."' },
    { q: 'Vì sao chọn TTL cache đúng trong batch "có tác động chi phí thật"?', options: ['Vì batch tính phí cache gấp đôi', 'Prefix chung được đọc lại nhiều lần', 'Vì TTL quyết định giá output', 'Vì TTL quyết định số request tối đa'], answer: 1, explain: '"That keeps the shared context warm long enough that later requests in the job can hit the cache. It\'s a small setting with a real cost impact at scale."' },
    { q: 'Câu chốt cuối bài là gì?', options: ['Batch bỏ tool use và vision', 'Batch luôn trả kết quả theo thứ tự', 'Vẫn đủ tool, vision, thinking', 'Batch chỉ dùng cho phân loại'], answer: 2, explain: '"Just remember, batches still support tool use, vision, and thinking. They only drop streaming and a few parameters."' },
  ],
};
