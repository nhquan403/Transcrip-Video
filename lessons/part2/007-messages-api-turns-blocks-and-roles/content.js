window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Mọi request tới Claude đi qua <strong>một endpoint</strong> với <strong>cùng một hình dạng</strong>:
ba trường bắt buộc (<code>model</code>, <code>max_tokens</code>, <code>messages</code>), các lượt có vai trò user/assistant theo thứ tự,
nội dung là chuỗi hoặc danh sách block, và system prompt nằm ở <strong>cấp cao nhất</strong>. API <strong>không nhớ gì</strong> giữa các lần gọi,
nên lần nào bạn cũng gửi lại toàn bộ lịch sử.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Turn (lượt):</strong> một phần tử trong mảng <code>messages</code>, có <code>role</code> và <code>content</code>.</li>
  <li><strong>Role:</strong> <code>user</code> (bạn gửi) hoặc <code>assistant</code> (Claude trả lời).</li>
  <li><strong>Content block:</strong> một mẩu nội dung có kiểu: text, image, tool_use, tool_result, thinking...</li>
  <li><strong>Stateless (không trạng thái):</strong> server không nhớ các lần gọi trước; mọi trạng thái nằm trong request bạn gửi.</li>
  <li><strong>System prompt:</strong> chỉ dẫn đứng: vai trò, giọng điệu, quy tắc cho cả cuộc hội thoại.</li>
</ul>

<h3>Ba trường không được thiếu</h3>
<ul>
  <li><strong>model:</strong> tên model (một chuỗi), quyết định tier năng lực của lời gọi.</li>
  <li><strong>max_tokens:</strong> trần số token câu trả lời được dùng; chạm trần là dừng. Đặt vừa với output bạn thật sự cần.</li>
  <li><strong>messages:</strong> mảng các lượt có thứ tự, chứa toàn bộ cuộc trao đổi mà model suy luận dựa trên đó.</li>
</ul>
<p>Thiếu một trong ba thì lời gọi không chạy nổi. Mọi thứ khác đều là tùy chọn thêm vào.</p>

<h3>Các lượt xếp hàng thế nào?</h3>
<ul>
  <li>Lượt <strong>đầu tiên luôn phải là user</strong>. Bắt đầu bằng assistant thì request bị từ chối.</li>
  <li>Hai lượt <strong>cùng role liền nhau</strong> sẽ được API âm thầm <strong>gộp làm một</strong>.</li>
  <li>Model đọc từ trên xuống để biết ai nói gì và khi nào. Thứ tự sạch sẽ thì hội thoại nhiều lượt mới có nghĩa.</li>
</ul>

<h3>Hai dạng nội dung</h3>
<ul>
  <li><strong>Chuỗi:</strong> content chỉ là text. Đủ cho một câu hỏi đơn giản, không kèm gì.</li>
  <li><strong>Danh sách block:</strong> content là mảng các block có kiểu, nên một lượt trộn được text, ảnh và kết quả tool.</li>
</ul>
<p>Cả hai đều hợp lệ trên <strong>cùng endpoint</strong>: bạn không đổi API, chỉ dùng trường content phong phú hơn. Bắt đầu bằng chuỗi, chuyển sang block khi một lượt cần mang nhiều hơn chữ.</p>

<h3>Các loại block hay dùng</h3>
<ul>
  <li><strong>text:</strong> chữ thường, phổ biến nhất ở cả hai phía.</li>
  <li><strong>image:</strong> ảnh gắn vào lượt user cho model nhìn, đi kèm text.</li>
  <li><strong>tool_use:</strong> Claude phát ra, nêu tên tool và input muốn code bạn chạy.</li>
  <li><strong>tool_result:</strong> bạn gửi lại, mang output của tool, gắn với yêu cầu gốc bằng <strong>id trùng khớp</strong>.</li>
</ul>

<h3>API không nhớ gì</h3>
<div class="box">📞 <strong>Hình dung thế này:</strong> Mỗi lần gọi là một cuộc điện thoại tới một tổng đài viên <strong>mới tinh</strong>, không có sổ ghi chép.
Muốn họ hiểu chuyện, bạn phải <strong>đọc lại toàn bộ</strong> những gì đã nói từ đầu. Bỏ bớt đoạn nào để tiết kiệm là họ không biết đoạn đó.</div>
<p>Server coi mỗi lời gọi là hoàn toàn mới. Bản ghi hội thoại là <strong>của bạn</strong>, bạn giữ và mang theo; nó không nằm chờ trên server của Anthropic.
Hiểu điều này thì hội thoại nhiều lượt hết bí ẩn: bạn chỉ đang dựng lại và gửi lại một danh sách dài dần.</p>

<h3>Giữ trạng thái: nối lượt, đừng làm phẳng</h3>
<p>Mỗi request mới: lấy danh sách cũ, <strong>nối thêm câu trả lời assistant vừa nhận</strong> và <strong>lượt user mới</strong>.</p>
<p>⚠️ Chỗ tinh tế: giữ nguyên các block của assistant <strong>đúng dạng block</strong>, đừng làm phẳng thành một chuỗi.
Làm phẳng là mất các block tool và thinking. Thinking block mang một <strong>signature</strong> phải gửi lại nguyên vẹn;
mất nó thì lời gọi tiếp theo hỏng vì model đi tìm những block không còn đó.</p>

<h3>System prompt nằm ở đâu?</h3>
<ul>
  <li>Ở <strong>cấp cao nhất</strong> của request, tách khỏi mảng messages.</li>
  <li>Là chỉ dẫn đứng: vai trò, giọng điệu, quy tắc, áp dụng cho <strong>mọi lượt</strong>.</li>
  <li><strong>Không phải</strong> một lượt user hay assistant; không nhét nó vào messages như một role riêng.</li>
  <li>Truyền dưới dạng chuỗi, hoặc danh sách text block khi cần kiểm soát kỹ hơn.</li>
</ul>
<p>System prompt trả lời câu "<strong>bạn nên cư xử thế nào?</strong>". Nội dung messages trả lời câu "<strong>ta đang nói về chuyện gì?</strong>".
Quy tắc bền vững để ở system, cuộc trò chuyện đang diễn ra để ở messages.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Ba trường bắt buộc: model, max_tokens, messages; lượt đầu luôn là user.</li>
  <li>Content là chuỗi hoặc danh sách block; giữ nguyên block khi gửi lại.</li>
  <li>API không trạng thái: mỗi lần gọi gửi lại toàn bộ lịch sử; system prompt nằm ở cấp cao nhất.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">Get that shape wrong, and nothing else works</em>: sai hình dạng đó thì không gì chạy được.</li>
  <li><em class="en">the call won't even get off the ground</em>: lời gọi còn chẳng cất cánh nổi.</li>
  <li><em class="en">back-to-back</em>: liền nhau.</li>
  <li><em class="en">quietly merges them into one</em>: âm thầm gộp chúng làm một.</li>
  <li><em class="en">reach for blocks</em>: chuyển sang dùng block.</li>
  <li><em class="en">rides in the same content list</em>: đi chung trong cùng danh sách content.</li>
  <li><em class="en">This next point trips up a lot of developers</em>: điểm tiếp theo làm nhiều lập trình viên vấp.</li>
  <li><em class="en">The transcript is yours to own and carry forward</em>: bản ghi hội thoại là của bạn, bạn giữ và mang theo.</li>
  <li><em class="en">Once this clicks</em>: một khi hiểu ra điều này.</li>
  <li><em class="en">flattened into a plain string</em>: bị làm phẳng thành một chuỗi thường.</li>
  <li><em class="en">standing instructions</em>: chỉ dẫn đứng, áp dụng suốt.</li>
  <li><em class="en">frames the entire conversation from above</em>: định khung cả cuộc hội thoại từ bên trên.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson07/Lesson07.java</code>. Có 4 bài: kiểm tra request (ba trường bắt buộc, lượt đầu là user,
không có role system trong messages), gộp các lượt cùng role liền nhau như API làm, nối lượt assistant (giữ nguyên block) và lượt user mới,
và dựng body JSON với system ở cấp cao nhất. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-07"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-07 --live"</code>: body do code của bạn dựng được gửi thẳng tới REST endpoint.
Bạn thấy Claude quên tên bạn khi không gửi lại lịch sử và nhớ khi có, thấy API thật trả lỗi khi lượt đầu là assistant, và thấy hai câu hỏi liền nhau được đọc như một lượt.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Ba trường bắt buộc của mọi request tới Messages API là gì?', options: ['model, system, messages', 'model, max_tokens, messages', 'messages, temperature, tools', 'model, max_tokens, system và stream'], answer: 1, explain: 'Bài học nêu ba trường không được thiếu: model, max tokens và messages. "Miss any one of these three, and the call won\'t even get off the ground."' },
    { q: 'Trường model quyết định điều gì?', options: ['Ngôn ngữ của câu trả lời', 'Số lượt tối đa', 'Tier năng lực của lời gọi', 'Vùng server xử lý request'], answer: 2, explain: '"That\'s the Claude model that answers, named as a string, and it picks the capability tier your call runs on."' },
    { q: 'max_tokens làm gì?', options: ['Đặt trần token của câu trả lời', 'Giới hạn độ dài prompt bạn gửi', 'Đặt số token tối đa trong ngày của tài khoản', 'Quy định số token cache được ghi'], answer: 0, explain: '"It caps how many tokens the reply is allowed to use, and the response stops once it hits that ceiling."' },
    { q: 'messages là gì?', options: ['Danh sách các model dự phòng', 'Lịch sử lưu trên server của Anthropic', 'Một chuỗi duy nhất chứa câu hỏi', 'Mảng các lượt có thứ tự'], answer: 3, explain: '"The ordered array of conversation turns. It carries the full exchange the model reasons over."' },
    { q: 'Hai giá trị hợp lệ của role trong messages là gì?', options: ['system và user', 'user và assistant', 'human và ai', 'client và server'], answer: 1, explain: '"That role is either user, meaning something you sent, or assistant, meaning something Claude said back."' },
    { q: 'Một request có lượt đầu tiên là assistant. Điều gì xảy ra?', options: ['API tự thêm một lượt user trống phía trước', 'Claude bỏ qua lượt đó và trả lời bình thường', 'Request bị từ chối', 'API đổi lượt đó thành system prompt'], answer: 2, explain: '"The very first turn always has to be a user turn. If you lead with an assistant turn, the call is rejected."' },
    { q: 'Hai lượt user liền nhau trong messages. API xử lý thế nào?', options: ['Âm thầm gộp làm một', 'Trả lỗi 400 ngay lập tức', 'Chỉ đọc lượt thứ hai', 'Tự chèn một lượt assistant trống vào giữa'], answer: 0, explain: '"If you stack two turns with the same role back-to-back, the API quietly merges them into one."' },
    { q: 'Hai dạng của trường content là gì?', options: ['JSON và XML', 'Văn bản thuần, hoặc file âm thanh ghi âm câu hỏi', 'Base64 và URL', 'Chuỗi, hoặc danh sách block có kiểu'], answer: 3, explain: '"Content comes in two shapes": plain string form, và "a list of content blocks... an array of typed blocks."' },
    { q: 'Khi nào nên chuyển từ content dạng chuỗi sang danh sách block?', options: ['Khi câu hỏi dài hơn 100 từ', 'Khi một lượt cần mang nhiều hơn chữ', 'Khi dùng model mới', 'Khi muốn trả lời nhanh hơn'], answer: 1, explain: '"Start with a string when that\'s all you need, and reach for blocks the moment one turn has to carry more than words."' },
    { q: 'Muốn gửi ảnh kèm câu hỏi, bạn có phải dùng một API khác không?', options: ['Có, phải dùng Vision API riêng với endpoint và cách xác thực khác', 'Có, phải dùng Files API', 'Không, cùng endpoint, chỉ dùng content dạng block', 'Có, phải dùng Batches API'], answer: 2, explain: '"Both forms are valid on the same endpoint, so you\'re never picking a different API, just a richer content field."' },
    { q: 'Block nào do CLAUDE phát ra để nhờ code của bạn chạy một tool?', options: ['tool_use', 'tool_result', 'image', 'system'], answer: 0, explain: '"A tool use block is one Claude emits, naming a tool and the input it wants your code to run."' },
    { q: 'tool_result được gắn với yêu cầu tool gốc bằng gì?', options: ['Bằng tên tool', 'Bằng thứ tự trong mảng', 'Bằng thời điểm gửi', 'Bằng id trùng khớp'], answer: 3, explain: '"A tool result block is the one you send back, carrying that tool\'s output, and tied to its original request by a matching ID."' },
    { q: 'Câu nào ĐÚNG về trạng thái của Claude API?', options: ['Server nhớ 10 lượt gần nhất', 'Không giữ trạng thái giữa các lần gọi', 'Server nhớ lịch sử trong 24 giờ', 'Chỉ cần gửi lượt mới nhất'], answer: 1, explain: '"The Claude API is stateless. It keeps no memory of your past calls. Every bit of conversation state lives in the request you send."' },
    { q: 'Để tiết kiệm token, bạn bỏ bớt các lượt đầu của hội thoại. Hậu quả là gì?', options: ['Không ảnh hưởng gì vì server vẫn nhớ', 'Claude trả lời nhanh và chính xác hơn', 'Model không còn biết đoạn đó', 'API báo lỗi thiếu lịch sử'], answer: 2, explain: '"If you drop earlier turns to save space, you erase what the model knows about the conversation."' },
    { q: 'Bản ghi hội thoại (transcript) nằm ở đâu?', options: ['Do bạn giữ và mang theo', 'Trên server của Anthropic', 'Trong system prompt', 'Trong API key'], answer: 0, explain: '"The transcript is yours to own and carry forward, not something sitting on Anthropic\'s servers waiting for you."' },
    { q: 'Mỗi request mới trong hội thoại nhiều lượt được dựng thế nào?', options: ['Chỉ gửi câu hỏi mới', 'Gửi câu hỏi mới kèm id của lần gọi trước', 'Gửi tóm tắt do server tạo', 'Lịch sử cũ + lượt assistant + lượt user mới'], answer: 3, explain: '"Each new request, you rebuild the array by appending the last assistant reply and your new user input onto what you already had."' },
    { q: 'Khi nối câu trả lời assistant vào lịch sử, nên làm gì với các block của nó?', options: ['Ghép thành một chuỗi cho gọn', 'Giữ nguyên dạng block', 'Chỉ giữ block text', 'Xóa block thinking cho nhẹ'], answer: 1, explain: '"You keep those assistant blocks intact, passing them back as structured blocks, not flattened into a plain string."' },
    { q: 'Làm phẳng câu trả lời assistant thành chuỗi thì mất gì?', options: ['Mất định dạng in đậm và gạch đầu dòng trong câu trả lời', 'Mất phần usage', 'Mất block tool và block thinking', 'Không mất gì'], answer: 2, explain: '"If you flatten the reply to text, you drop any tool blocks and thinking blocks it contained."' },
    { q: 'Thinking block mang theo thứ gì phải gửi lại nguyên vẹn?', options: ['Một signature', 'Một API key', 'Một model ID', 'Một custom_id'], answer: 0, explain: '"Thinking blocks... carry a signature you must pass back untouched."' },
    { q: 'Nếu làm mất thinking block khi gửi lại, lời gọi tiếp theo sẽ sao?', options: ['Vẫn chạy bình thường nhưng chậm hơn vì phải suy nghĩ lại từ đầu', 'Chạy bình thường nhưng tốn hơn', 'Tự động bật lại thinking', 'Hỏng, vì model đi tìm những block không còn đó'], answer: 3, explain: '"Flatten them away and the very next call breaks because the model goes looking for blocks that are no longer there."' },
    { q: 'System prompt nằm ở đâu trong request?', options: ['Là lượt đầu tiên trong messages, với role system', 'Ở cấp cao nhất, tách khỏi messages', 'Trong header HTTP', 'Trong mỗi lượt user'], answer: 1, explain: '"It sits at the top level of the request, completely separate from the messages array."' },
    { q: 'Câu nào SAI về system prompt?', options: ['Nó đặt vai trò, giọng điệu và quy tắc', 'Nó áp dụng cho mọi lượt', 'Nó là một lượt có role system trong messages', 'Nó có thể là chuỗi hoặc danh sách text block'], answer: 2, explain: '"What it isn\'t is a user or assistant turn. You don\'t stuff it into the messages list as its own role."' },
    { q: 'System prompt có thể được truyền dưới dạng nào?', options: ['Chuỗi, hoặc danh sách text block', 'Chỉ chuỗi', 'Chỉ file đính kèm', 'Chỉ một JSON schema mô tả hành vi mong muốn của model'], answer: 0, explain: '"You pass it in its own top level field, either as a plain string or as a list of text blocks when you want finer control."' },
    { q: 'System prompt và nội dung messages lần lượt trả lời câu hỏi nào?', options: ['"Model nào?" và "Bao nhiêu token?"', '"Ai đang nói?" và "Nói khi nào?"', '"Tốn bao nhiêu?" và "Nhanh cỡ nào?"', '"Cư xử thế nào?" và "Nói về gì?"'], answer: 3, explain: '"The system prompt answers, how should you behave? While the message content answers, what are we actually talking about?"' },
    { q: 'Nên đặt quy tắc "luôn trả lời bằng tiếng Việt, tối đa 3 câu" ở đâu?', options: ['Ở lượt user đầu tiên', 'Ở system prompt', 'Ở mọi lượt assistant', 'Ở header anthropic-version'], answer: 1, explain: '"Keep the durable rules in the system prompt and keep the live conversation in the message content."' },
    { q: 'Request: model có, max_tokens = 1024, messages = [{assistant: "Chào"}, {user: "Hỏi"}]. Có hợp lệ không?', options: ['Hợp lệ, vì đủ ba trường', 'Hợp lệ, vì API tự sắp xếp lại các lượt theo đúng thứ tự user trước', 'Không hợp lệ: lượt đầu phải là user', 'Không hợp lệ: thiếu system prompt'], answer: 2, explain: 'Đủ ba trường nhưng lượt đầu là assistant: "If you lead with an assistant turn, the call is rejected."' },
    { q: 'Lượt user nào sau đây hợp lệ nhất khi muốn hỏi về một ảnh?', options: ['content: [image, text]', 'content: chuỗi chứa đường dẫn ảnh', 'system: block image', 'role: image, content: base64'], answer: 0, explain: 'Một lượt mang được nhiều loại nội dung khi content là danh sách block: "a single turn can mix text with images and tool results all together."' },
    { q: 'Vì sao model cần các lượt được sắp xếp sạch sẽ?', options: ['Để tính giá chính xác', 'Để API nén dữ liệu tốt hơn', 'Để prompt cache hoạt động đúng giữa các lần gọi liên tiếp', 'Để theo dõi ai nói gì và khi nào'], answer: 3, explain: '"The model reads this order top to bottom to track who said what and when."' },
    { q: 'SDK có cho phép làm điều mà Messages API thô không làm được không, ví dụ nhớ lịch sử giúp bạn trên server?', options: ['Có, SDK lưu lịch sử trên server', 'Không, lịch sử vẫn do bạn gửi lại', 'Có, nếu bật chế độ session', 'Có, với model mới nhất'], answer: 1, explain: 'Bài học nhấn mạnh API "keeps no memory of your past calls"; dù dùng công cụ gì, "you resend the full history every single time."' },
    { q: 'Câu tóm tắt cuối bài là gì?', options: ['Dùng system prompt cho mọi thứ', 'Mỗi lượt nên là một request riêng, và server tự ghép chúng lại thành hội thoại', 'Ba trường bắt buộc, lượt đầu là user, system ở cấp cao nhất, gửi lại toàn bộ lịch sử', 'Chỉ cần gửi lượt mới nhất vì API nhớ phần còn lại'], answer: 2, explain: '"You set the model, max tokens and messages, order the turns so the first is a user turn... with the system prompt at the top level. Keep in mind the API is stateless."' },
  ],
};
