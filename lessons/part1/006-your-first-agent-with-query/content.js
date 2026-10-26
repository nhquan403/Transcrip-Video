window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> <strong>Agent SDK</strong> là một thư viện giúp bạn chạy một agent ngay trong chương trình của mình.
Hàm chính là <code>query()</code>: đưa vào một yêu cầu, nó tự chạy agent và gửi lại từng bước cho bạn xem.
Mỗi lần gọi là <strong>một phiên mới</strong>, không nhớ lần trước.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Agent SDK:</strong> bộ thư viện chứa đúng "bộ máy" đang chạy bên trong Claude Code, dùng được từ Python hoặc TypeScript.</li>
  <li><strong>query():</strong> hàm chính để chạy agent.</li>
  <li><strong>Phiên (session):</strong> một cuộc làm việc từ lúc bắt đầu tới lúc xong.</li>
  <li><strong>Luồng message:</strong> các mẩu tin agent gửi ra lần lượt trong lúc làm việc.</li>
</ul>

<h3>Agent SDK là gì?</h3>
<div class="box">📦 <strong>Hình dung thế này:</strong> Claude Code là một chiếc xe hoàn chỉnh. Agent SDK là <strong>động cơ của chiếc xe đó</strong>,
được tháo ra đóng hộp để bạn lắp vào sản phẩm của mình.</div>
<ul>
  <li>Không cần cài thêm Claude Code. Chỉ cần cài thư viện là chạy được.</li>
  <li>Python cần bản 3.10 trở lên; TypeScript cài từ npm.</li>
  <li>Đăng nhập chỉ bằng một biến môi trường: <code>ANTHROPIC_API_KEY</code>. Nếu công ty dùng Claude qua Amazon Bedrock hay Google Vertex thì bật cờ tương ứng.</li>
</ul>

<h3>query() và ClaudeSDKClient: chọn cái nào?</h3>
<p>Nhiều người tưởng đây là hai bộ máy khác nhau. <strong>Không phải.</strong> Chúng là hai cánh cửa đi vào <strong>cùng một bộ máy</strong>.</p>
<ul>
  <li><strong>query():</strong> mỗi lần gọi là một việc riêng, phiên mới. Dùng cái này trước tiên.</li>
  <li><strong>ClaudeSDKClient:</strong> giữ một phiên mở qua nhiều lần hỏi, và cho phép <strong>bấm dừng</strong> giữa chừng.</li>
</ul>
<p>💡 Chỉ chuyển sang client khi bạn cần nhớ hội thoại liên tục hoặc cần ngắt giữa chừng.</p>

<h3>Điều khiển agent bằng các tùy chọn</h3>
<ul>
  <li><strong>System prompt:</strong> vai trò và lời dặn mà agent luôn làm theo.</li>
  <li><strong>Danh sách tool:</strong> những việc agent <em>được phép</em> làm. Đây mới là thứ thật sự giới hạn hành động.</li>
  <li><strong>Model:</strong> chọn phiên bản Claude nào chạy.</li>
  <li><strong>Max turns:</strong> số lượt dùng tool tối đa. Không đặt thì agent có thể chạy lâu hơn bạn tưởng rất nhiều.</li>
</ul>

<h3>Kết quả trả về không phải một câu trả lời, mà là một luồng</h3>
<p>Gọi <code>query()</code>, bạn không đợi một cục kết quả cuối, mà nhận từng mẩu tin ngay khi agent làm tới đâu. Nhờ vậy bạn thấy agent đang làm gì.</p>
<ul>
  <li><strong>init:</strong> mẩu đầu tiên, báo cấu hình (model nào, tool nào).</li>
  <li><strong>assistant:</strong> AI nói gì, muốn dùng tool nào.</li>
  <li><strong>kết quả tool:</strong> tool chạy xong trả về gì. Hai loại này qua lại nhiều lần.</li>
  <li><strong>result:</strong> mẩu cuối, cho biết thành công hay chạm giới hạn, tốn bao nhiêu tiền và token.</li>
</ul>

<h3>Mỗi lần gọi là một phiên mới</h3>
<p>Gọi <code>query("Tên tôi là An")</code> rồi gọi <code>query("Tên tôi là gì?")</code>: lần hai sẽ <strong>không biết</strong>.
Muốn agent nhớ hội thoại cũ, bạn phải <strong>chủ động bật</strong> tính năng nối phiên.</p>

<h3>Bắt đầu thế nào?</h3>
<ul>
  <li><strong>Bước 1:</strong> gọi thử thật đơn giản, chỉ một câu hỏi, rồi in từng mẩu tin ra để xem agent chạy.</li>
  <li><strong>Bước 2:</strong> thêm tool để agent làm được việc thật.</li>
  <li><strong>Bước 3:</strong> trước khi giao việc dài hoặc tốn tiền, đặt <strong>max turns</strong> để agent không chạy mãi.</li>
</ul>
<p>Suốt quá trình, bạn vẫn dùng đúng một hàm <code>query()</code>.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li><code>query()</code> chạy agent ngay trong chương trình của bạn, không cần cài Claude Code.</li>
  <li>Kết quả đến dần từng mẩu; mẩu cuối (result) cho biết thành công hay không.</li>
  <li>Mỗi lần gọi là phiên mới; <code>query()</code> và client dùng chung một bộ máy.</li>
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
Mở <code>java-app/src/main/java/part1/lesson06/Lesson06.java</code>: viết vòng lặp đẩy ra lần lượt các message init, assistant, user (kết quả tool), result;
phiên mới mỗi lần gọi; chỉ chạy tool được phép; dừng khi chạm max turns; và đọc kết quả an toàn.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p1-06"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p1-06 --live"</code>: query() của bạn điều khiển, Claude là model bên trong,
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
