window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Ý chính của cả bài:</strong> Agent SDK đóng gói đúng vòng lặp agent đang chạy bên trong Claude Code thành một thư viện.
Hàm <code>query()</code> là cửa vào chính: gọi nó là có một agent chạy ngay trong chương trình của bạn.
Ba đặc điểm cần nhớ: <strong>độc lập</strong> (không cần cài Claude Code CLI), <strong>dạng luồng</strong> (message chảy ra dần),
và <strong>gắn với phiên</strong> (mỗi lần gọi là một phiên mới).</p>

<h3>1. Các mảnh ghép</h3>
<ul>
  <li><strong>Agent SDK</strong> là một thư viện, đóng gói cùng bộ tool, vòng lặp agent và cách quản lý context của Claude Code. Có cho Python và TypeScript.</li>
  <li><strong>query()</strong> là cửa vào chính của thư viện: bạn gọi nó, nó chạy vòng lặp agent cho bạn.</li>
  <li>Điều nhiều người bỏ lỡ: SDK <strong>độc lập</strong>. Bạn không cần cài công cụ dòng lệnh Claude Code ở đâu cả. Import gói, gọi query, thế là có agent.</li>
  <li>Mặc định, <strong>mỗi lần gọi query là một phiên mới</strong>, không nhớ gì về lần gọi trước. Đây là điều bạn phải thiết kế xoay quanh.</li>
</ul>

<h3>2. Cài đặt và xác thực</h3>
<ul>
  <li>Python: cài gói <code>claude-agent-sdk</code> bằng pip, cần Python 3.10 trở lên.</li>
  <li>TypeScript: cài gói <code>@anthropic-ai/claude-agent-sdk</code> từ npm.</li>
  <li>Xác thực chỉ là một biến môi trường: đặt <code>ANTHROPIC_API_KEY</code> là xong.</li>
  <li>Nếu công ty chạy Claude qua nhà cung cấp đám mây, bạn bật một cờ môi trường thay thế: có cờ cho Amazon Bedrock và Google Vertex.</li>
</ul>
<p>Để ý điều bạn <em>không</em> làm: không cài thêm công cụ dòng lệnh nào. Một import, một thông tin xác thực, và cả vòng lặp agent đã sẵn sàng.</p>

<h3>3. query() và ClaudeSDKClient không phải hai thiết kế đối nghịch</h3>
<p>Bạn sẽ nghe SDK có hai cửa vào: <code>query()</code> và <code>ClaudeSDKClient</code>. Chúng <strong>không phải hai vòng lặp khác nhau</strong>,
mà là hai cách đi vào cùng một vòng lặp.</p>
<ul>
  <li><strong>query():</strong> hàm dùng nhiều nhất. Chạy một việc, mỗi lần gọi là một phiên mới.</li>
  <li><strong>ClaudeSDKClient:</strong> một đối tượng giữ một phiên mở qua nhiều lần gọi, và cho phép ngắt một lần chạy đang diễn ra.</li>
</ul>
<p>Khác biệt thật nằm ở <strong>vòng đời phiên và khả năng ngắt</strong>, không phải động cơ bên dưới.
Dùng query trước, chỉ chuyển sang client khi cần phiên lâu dài hoặc ngắt trực tiếp.</p>

<h3>4. Điều khiển agent bằng options</h3>
<ul>
  <li><strong>System prompt:</strong> vai trò và chỉ dẫn agent tuân theo ở mọi lượt.</li>
  <li><strong>Danh sách tool:</strong> quyết định model được phép làm những hành động nào, từ đọc file tới gọi hàm của bạn.</li>
  <li><strong>Model:</strong> chọn model Claude nào chạy vòng lặp.</li>
  <li><strong>Max turns:</strong> giới hạn số lượt dùng tool trước khi vòng lặp dừng.</li>
</ul>
<p>Giới hạn cuối quan trọng hơn vẻ ngoài: không có giới hạn, agent có thể lặp lâu hơn nhiều so với ý bạn.
Cùng một hàm query, cấu hình khác nhau, cho ra những agent rất khác nhau.</p>

<h3>5. Kết quả trả về là một luồng</h3>
<p>Gọi query, thứ trả về <strong>không phải một chuỗi hoàn chỉnh</strong> mà là một <strong>async iterator</strong>.
Bạn lặp qua nó, đọc từng message ngay khi agent tạo ra: suy luận, lời gọi tool, rồi câu trả lời cuối.
Chính dạng luồng này làm SDK có cảm giác "sống": bạn xem lần chạy diễn ra thay vì chờ một khối trả lời lớn.</p>
<p>Các message có kiểu và đến theo đúng thứ tự:</p>
<ul>
  <li><strong>init:</strong> mở đầu lần chạy, báo cấu hình đã chốt (model, tool, system prompt).</li>
  <li><strong>assistant:</strong> suy luận của model và các lời gọi tool, tiếp theo là kết quả tool trả về. Cứ qua lại như vậy khi agent làm việc.</li>
  <li><strong>result:</strong> đóng lần chạy, mang tổng chi phí, lượng token dùng, và trạng thái thành công hay chạm giới hạn.</li>
</ul>

<h3>6. Phiên mới mỗi lần gọi</h3>
<p>Mỗi lần gọi mở một phiên mới, không nhớ lần gọi trước. Muốn agent nhớ cuộc hội thoại cũ, đó là thứ bạn <strong>chủ động bật</strong>,
không phải thứ được cho không. Cả lần chạy diễn ra ngay trong tiến trình của bạn, không có công cụ dòng lệnh nào chạy phía sau.</p>

<h3>7. Lộ trình bắt đầu</h3>
<ul>
  <li>Lần gọi đầu có thể rất nhỏ: một prompt, options mặc định, lặp qua các message để xem vòng lặp chạy từ đầu tới cuối.</li>
  <li>Chạy được rồi thì thêm tool để agent làm hành động thật thay vì chỉ trả lời bằng chữ.</li>
  <li>Trước khi giao việc dài hoặc tốn kém, thêm giới hạn max turns để một lần chạy bị kẹt không quay mãi.</li>
</ul>
<p>Bạn không đổi cửa vào lần nào: cùng một query chạy ví dụ hai dòng cũng là query chạy agent dùng tool. Nó lớn lên cùng bạn.</p>

<h3>8. Tóm tắt</h3>
<ul>
  <li>query() chạy vòng lặp agent của Agent SDK ngay trong code của bạn.</li>
  <li>Một hàm, cấu hình bằng prompt, tool và giới hạn lượt, đưa bạn từ lần gọi đầu tới một agent thật.</li>
  <li>query và client dùng chung một vòng lặp, không phải hai.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">entry point</em>: cửa vào, điểm bắt đầu.</li>
  <li><em class="en">standalone</em>: độc lập, không phụ thuộc thứ khác.</li>
  <li><em class="en">rival designs</em>: các thiết kế cạnh tranh nhau.</li>
  <li><em class="en">session lifecycle</em>: vòng đời của phiên.</li>
  <li><em class="en">standing instructions</em>: chỉ dẫn thường trực, áp dụng mọi lúc.</li>
  <li><em class="en">unfold</em>: diễn ra, mở ra dần.</li>
  <li><em class="en">opt into</em>: chủ động chọn tham gia, bật lên.</li>
  <li><em class="en">spin forever</em>: quay mãi không dừng.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Agent SDK thật chỉ có cho Python và TypeScript, nên ở bài này bạn tự dựng một <code>query()</code> thu nhỏ bằng Java để hiểu nó làm gì bên trong.
Mở <code>java-app/src/main/java/lesson06/Lesson06.java</code>: viết vòng lặp đẩy ra lần lượt các message init, assistant, user (kết quả tool), result;
phiên mới mỗi lần gọi; chỉ chạy tool được phép; dừng khi chạm max turns; và đọc kết quả an toàn.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="06"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="06 --live"</code>: query() của bạn điều khiển, Claude là model bên trong,
và bạn theo dõi luồng message trực tiếp.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Một lập trình viên muốn chạy Agent SDK trong một container chỉ có Python. Có cần cài thêm Claude Code CLI không?', options: ['Có, SDK gọi CLI ở bên dưới', 'Không, SDK độc lập', 'Có, nhưng chỉ khi dùng tool', 'Chỉ cần nếu dùng ClaudeSDKClient'], answer: 1, explain: '"The SDK is standalone. You don\'t need the Claude Code command line tool installed anywhere."' },
    { q: 'Câu nào SAI về Agent SDK?', options: ['Nó đóng gói vòng lặp agent của Claude Code', 'Nó có cho Python và TypeScript', 'Mỗi lần gọi query() tiếp tục phiên trước', 'Nó chạy cả vòng lặp ngay trong tiến trình của bạn'], answer: 2, explain: '"By default, every call to Query starts a fresh session, with no memory of any earlier call."' },
    { q: 'Gọi query("Tên tôi là An") rồi gọi query("Tên tôi là gì?") với options mặc định. Lần gọi thứ hai sẽ thế nào?', options: ['Trả lời "An" vì cùng một tiến trình', 'Không biết tên, vì mỗi lần gọi là phiên mới', 'Trả lời "An" nếu hai lần gọi cách nhau dưới 1 phút', 'Báo lỗi vì thiếu session ID'], answer: 1, explain: 'Mỗi lần gọi query là một phiên mới. Muốn nhớ, bạn phải chủ động bật tính năng nối phiên.' },
    { q: 'Python cần phiên bản tối thiểu nào để dùng Agent SDK theo bài học?', options: ['3.8', '3.9', '3.10', '3.12'], answer: 2, explain: '"You need Python 3.10 or newer."' },
    { q: 'Công ty chạy Claude qua Amazon Bedrock. Theo bài học, cách kết nối Agent SDK là gì?', options: ['Bật cờ môi trường dành cho Bedrock', 'Đổi sang một SDK khác cho Bedrock', 'Viết lại vòng lặp trên Bedrock API', 'Dùng ANTHROPIC_API_KEY của Bedrock'], answer: 0, explain: '"There are flags for Amazon Bedrock and for Google\'s Vertex platform."' },
    { q: 'Khác biệt THẬT giữa query() và ClaudeSDKClient là gì?', options: ['Hai vòng lặp agent khác nhau', 'Một cái cho Python, một cái cho TypeScript', 'Vòng đời phiên và khả năng ngắt', 'Một cái dùng tool, một cái không'], answer: 2, explain: '"The real difference is session lifecycle and interrupts, not the underlying engine."' },
    { q: 'Ứng dụng chat cần nút "Dừng" để ngắt câu trả lời đang chạy, và giữ hội thoại qua nhiều tin nhắn. Nên dùng gì?', options: ['query() với max turns nhỏ', 'ClaudeSDKClient', 'query() gọi lại cho mỗi tin nhắn', 'Gọi Messages API trực tiếp'], answer: 1, explain: 'ClaudeSDKClient "holds one session open across several calls and lets you interrupt a run in progress".' },
    { q: 'Một hàm xử lý mỗi request độc lập, không cần nhớ gì, không cần ngắt. Nên dùng gì?', options: ['ClaudeSDKClient để giữ phiên', 'query()', 'Managed Agents', 'Cả hai cùng lúc để dự phòng'], answer: 1, explain: '"Reach for Query first, and move to the client when you need a persistent session or live interruption."' },
    { q: 'Option nào quyết định model được phép làm những hành động nào?', options: ['System prompt mô tả vai trò', 'Danh sách tool', 'Tên model được chọn', 'Số lượt tối đa (max turns)'], answer: 1, explain: '"The tools list decides which actions the model is even allowed to take."' },
    { q: 'Bạn viết vào system prompt "chỉ được đọc file", nhưng vẫn để tool ghi file trong danh sách tool. Option nào mới thật sự giới hạn hành động?', options: ['System prompt mô tả vai trò', 'Danh sách tool', 'Tên model được chọn', 'Số lượt tối đa (max turns)'], answer: 1, explain: 'System prompt là chỉ dẫn; danh sách tool mới quyết định hành động nào model có thể làm.' },
    { q: 'Vì sao bài học nhấn mạnh max turns "quan trọng hơn vẻ ngoài"?', options: ['Vì nó giảm độ trễ mạng', 'Vì thiếu nó, agent có thể lặp mãi', 'Vì SDK bắt buộc phải đặt nó thì mới chạy được', 'Vì nó làm model trả lời ngắn hơn'], answer: 1, explain: '"Without a bound, an agent can loop far longer than you intended."' },
    { q: 'Gọi query() thì nhận về thứ gì?', options: ['Một chuỗi hoàn chỉnh', 'Một async iterator', 'Một đối tượng phiên', 'Một file log'], answer: 1, explain: '"What comes back isn\'t a finished string. It is an async iterator."' },
    { q: 'Thứ tự các message đúng trong một lần chạy có dùng tool là gì?', options: ['init, kết quả tool, assistant, assistant, result', 'init, assistant, kết quả tool, assistant, result', 'init, assistant, assistant, kết quả tool, result', 'assistant, init, kết quả tool, assistant, result'], answer: 1, explain: 'Init mở đầu; assistant yêu cầu tool; kết quả tool quay về; assistant trả lời không kèm tool; result đóng lần chạy.' },
    { q: 'Message init mang thông tin gì?', options: ['Tổng chi phí của lần chạy', 'Cấu hình đã chốt của lần chạy', 'Câu trả lời đầu tiên của model', 'Danh sách lỗi đã gặp ở các phiên trước'], answer: 1, explain: '"It opens the run, and reports the resolved configuration, the model, the tools, the system prompt."' },
    { q: 'Message nào cho biết lần chạy thành công hay chạm giới hạn?', options: ['init', 'assistant', 'kết quả tool', 'result'], answer: 3, explain: 'Result mang tổng chi phí, lượng token và trạng thái.' },
    { q: 'Câu nào SAI về message result?', options: ['Nó đóng lần chạy', 'Nó mang tổng chi phí', 'Nó mang lượng token đã dùng', 'Nó xuất hiện đầu tiên'], answer: 3, explain: 'Message đầu tiên là init; result là message cuối.' },
    { q: 'Vì sao dạng luồng (streaming) làm SDK có cảm giác "sống"?', options: ['Vì SDK chạy trên máy chủ riêng', 'Vì bạn xem lần chạy diễn ra từng bước', 'Vì SDK dùng WebSocket thay cho HTTP', 'Vì model trả lời nhanh hơn'], answer: 1, explain: '"You watch the run unfold instead of blocking on one big response."' },
    { q: 'Ba đặc điểm của một lần chạy query() là gì?', options: ['Độc lập, dạng luồng, theo phiên', 'Đồng bộ, khóa, toàn cục', 'Nhanh, rẻ, chính xác', 'Có trạng thái, đơn luồng, chặn chờ kết quả'], answer: 0, explain: '"It\'s a standalone, streaming, session-scoped call into one well-defined agent loop."' },
    { q: 'Muốn agent nhớ cuộc hội thoại cũ khi dùng query(), điều nào đúng?', options: ['Tự động nhớ nếu cùng system prompt', 'Phải chủ động bật nối phiên', 'Không thể làm được khi dùng hàm query()', 'Chỉ cần đặt max turns lớn hơn'], answer: 1, explain: '"That persistence is something you opt into, not something you get for free."' },
    { q: 'Theo lộ trình của bài, bước ĐẦU TIÊN khi làm quen với query() là gì?', options: ['Thêm tool để agent làm được hành động thật', 'Một lần gọi nhỏ, options mặc định', 'Đặt max turns trước tiên', 'Chuyển sang ClaudeSDKClient'], answer: 1, explain: '"Pass a prompt, take the default options, and loop over the messages just to watch the agent loop run end-to-end."' },
    { q: 'Theo lộ trình, nên thêm max turns vào lúc nào?', options: ['Ngay từ lần gọi đầu tiên', 'Trước khi giao cho agent việc dài hoặc tốn kém', 'Chỉ khi chuyển sang ClaudeSDKClient', 'Không cần, SDK đã có mặc định an toàn'], answer: 1, explain: '"Before you hand it anything long or expensive, add a maxTurns bound so a stuck run can\'t spin forever."' },
    { q: 'Khi agent lớn dần (thêm tool, thêm giới hạn), bạn có phải đổi cửa vào không?', options: ['Có, phải chuyển sang ClaudeSDKClient', 'Không, cùng một query() là đủ', 'Có, phải viết vòng lặp riêng', 'Có, phải chuyển sang Managed Agents'], answer: 1, explain: '"The same query call that ran your two-line example is the one that runs a tool-using agent."' },
    { q: 'Câu nào đúng về quan hệ giữa query() và ClaudeSDKClient?', options: ['Client là phiên bản mới thay thế query()', 'Chúng là hai cửa vào cùng một vòng lặp', 'query() chỉ dùng cho việc không có tool', 'Client chạy vòng lặp khác, tối ưu hơn'], answer: 1, explain: '"They aren\'t two separate loops. They are two Python ways into the exact same agent loop."' },
    { q: 'Đội vận hành lo ngại "cài SDK sẽ kéo theo cả Claude Code CLI chạy nền". Phản hồi đúng là gì?', options: ['Đúng, CLI chạy nền để quản lý phiên và tool', 'Sai, cả lần chạy diễn ra trong tiến trình của bạn', 'Đúng, nhưng chỉ khi dùng tool', 'Sai, vì SDK chạy trên máy chủ Anthropic'], answer: 1, explain: '"The whole run happens inside your own process, with no command line tool running behind it."' },
    { q: 'Cách xác thực đơn giản nhất cho Agent SDK là gì?', options: ['Đăng nhập trình duyệt mỗi lần chạy', 'Đặt biến môi trường ANTHROPIC_API_KEY', 'Truyền mật khẩu vào system prompt', 'Cài chứng chỉ riêng cho từng máy'], answer: 1, explain: '"Authentication is just an environment variable. Set anthropic API key, and you are ready."' },
    { q: 'Cùng một hàm query(), nhưng một nhóm cấu hình 2 tool đọc và max turns 3, nhóm khác cấu hình 10 tool và không giới hạn. Nhận định nào đúng?', options: ['Hai agent gần như giống nhau vì cùng query()', 'Đây là hai agent rất khác nhau', 'Nhóm thứ hai sẽ lỗi vì thiếu max turns', 'Nhóm thứ nhất không thể dùng tool'], answer: 1, explain: '"The same query function, configured differently, gives you very different agents."' },
    { q: 'Lần chạy query() có tool. Bạn chỉ đọc message cuối cùng mà bỏ qua các message trước. Bạn đang bỏ lỡ điều gì?', options: ['Không bỏ lỡ gì, vì message cuối đã chứa đủ mọi thứ', 'Diễn biến của agent trong lúc chạy', 'Chi phí của lần chạy', 'Câu trả lời cuối cùng'], answer: 1, explain: 'Chi phí và câu trả lời nằm ở result; các message trước cho bạn theo dõi quá trình "message by message".' },
    { q: 'Vì sao bài học nói query() "hết giống phép thuật" khi hiểu ba đặc điểm của nó?', options: ['Vì nó không thật sự dùng model mà dùng luật cố định', 'Vì nó chỉ là lời gọi vào một vòng lặp rõ ràng', 'Vì nó chạy chậm hơn mong đợi', 'Vì nó chỉ trả về chuỗi'], answer: 1, explain: '"Hold those three together and Query stops feeling like magic."' },
    { q: 'Câu nào đúng về nội dung assistant message?', options: ['Chỉ chứa câu trả lời cuối', 'Suy luận của model và các lời gọi tool', 'Chỉ chứa kết quả tool', 'Chỉ xuất hiện đúng một lần trong mỗi lần chạy'], answer: 1, explain: '"Then you see assistant messages carrying the model\'s reasoning and any tool calls."' },
    { q: 'Câu nào là điều cần nhớ cuối bài?', options: ['query() và client là hai vòng lặp, chọn cái phù hợp', 'query() và client dùng chung một vòng lặp', 'query() đã lỗi thời, nên dùng client', 'client chỉ dùng cho TypeScript'], answer: 1, explain: '"Just remember, query and the client share a single loop, not two."' },
  ],
};
