window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Thay vì để Agent SDK lo hết, bạn có thể <strong>tự viết vòng lặp</strong> bằng cách gọi thẳng API của Claude:
gửi tin, xem Claude có xin dùng tool không, tự chạy tool, gửi kết quả lại, rồi lặp. Bạn kiểm soát mọi thứ, nhưng phải tự viết và tự bảo trì nhiều code hơn.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Messages API:</strong> cách gọi Claude "trần", không qua thư viện agent nào.</li>
  <li><strong>tool_use:</strong> phần trong câu trả lời của Claude nói "tôi muốn dùng tool X với dữ liệu Y".</li>
  <li><strong>tool_result:</strong> phần bạn gửi lại cho Claude, chứa kết quả của tool đó.</li>
  <li><strong>stop_reason:</strong> nhãn cho biết vì sao Claude dừng lại ở lần trả lời này.</li>
</ul>

<h3>Ba mức tự làm</h3>
<div class="box">🏠 <strong>Hình dung thế này:</strong> Có ba cách có một bữa ăn.
<strong>Tự nấu từ đầu</strong> (Messages API): toàn quyền, nhưng nhiều việc nhất.
<strong>Mua bộ nguyên liệu sơ chế sẵn</strong> (Agent SDK): chỉ cần chọn và lắp.
<strong>Đặt nhà hàng</strong> (Managed Agents): Anthropic lo hết, kể cả chỗ chạy.</div>
<p>Bài này nói về cách thứ nhất: tự nấu.</p>

<h3>Vì sao lại muốn tự làm?</h3>
<ul>
  <li>Bạn muốn <strong>nắm từng bước</strong>: tự quyết chạy tool thế nào, thử lại ra sao, ghi log kiểu gì.</li>
  <li><strong>Ít phụ thuộc</strong> vào thư viện bên ngoài.</li>
  <li>Muốn áp <strong>quy tắc cố định</strong> ở mỗi bước, vì mọi yêu cầu đều đi qua code của bạn.</li>
</ul>
<p>Cái giá: bạn phải tự viết và bảo trì những thứ mà Agent SDK cho sẵn. Không phải ứng dụng nào cũng cần; hãy bắt đầu đơn giản trước.</p>

<h3>Vòng lặp tự viết gồm 4 bước</h3>
<ol>
  <li>Gửi toàn bộ cuộc trò chuyện cho Claude.</li>
  <li>Xem câu trả lời có phần <strong>tool_use</strong> nào không.</li>
  <li>Nếu có, <strong>bạn tự chạy tool</strong> đó.</li>
  <li>Gửi kết quả lại dưới dạng <strong>tool_result</strong>, rồi quay lại bước 1.</li>
</ol>
<p>Lặp cho tới khi Claude trả lời mà không xin tool nào nữa.</p>
<p>⚠️ <strong>Bước hay quên nhất:</strong> gửi tool_result. Mỗi tool_use có một <strong>mã số (id)</strong>; kết quả gửi lại phải ghi đúng mã đó.
Quên gửi, hoặc ghi sai mã, thì lần gọi tiếp theo sẽ <strong>báo lỗi</strong>.</p>

<h3>Đọc nhãn stop_reason</h3>
<ul>
  <li><strong>tool_use:</strong> Claude đang <strong>chờ bạn</strong> chạy tool. Chạy tool rồi gọi tiếp.</li>
  <li><strong>end_turn:</strong> Claude đã xong. Thoát vòng lặp và trả lời.</li>
  <li><strong>Nhãn khác</strong> (ví dụ hết chỗ viết): bạn tự quyết cách xử lý.</li>
</ul>
<div class="box">🚦 <strong>Hiểu nhầm hay gặp:</strong> thấy <code>tool_use</code> rồi tưởng tool đã chạy. <strong>Không.</strong>
Đó chỉ là Claude dừng lại và nói "đến lượt bạn". Trong vòng lặp tự viết, <strong>không có gì tự chạy</strong> nếu code của bạn không chạy nó.</div>

<h3>Tool phía bạn và tool phía Anthropic</h3>
<ul>
  <li><strong>Tool phía bạn (client tool):</strong> chạy trong chương trình của bạn. Bạn phải tự chạy và gửi tool_result.</li>
  <li><strong>Tool phía Anthropic (server tool)</strong>, như tìm kiếm web hay chạy code: Anthropic tự chạy và gửi kèm kết quả. Bạn <strong>không cần</strong> gửi tool_result cho loại này.</li>
</ul>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Tự viết vòng lặp: toàn quyền kiểm soát, đổi lại nhiều code hơn.</li>
  <li>Mỗi tool_use phải có đúng một tool_result cùng mã số.</li>
  <li><code>tool_use</code> nghĩa là Claude đang chờ bạn, không phải tool đã chạy.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">hit a wall</em>: gặp bức tường, bị chặn lại.</li>
  <li><em class="en">take back control</em>: giành lại quyền kiểm soát.</li>
  <li><em class="en">roll your own</em>: tự làm lấy.</li>
  <li><em class="en">outright</em>: hoàn toàn, trọn vẹn.</li>
  <li><em class="en">plumbing</em>: đường ống, phần hạ tầng nối dây.</li>
  <li><em class="en">the deal you're signing up for</em>: thỏa thuận bạn đang chấp nhận.</li>
  <li><em class="en">handshake</em>: cái bắt tay, giao thức khớp nhau.</li>
  <li><em class="en">wiring</em>: nối dây.</li>
  <li><em class="en">fit right in</em>: khớp ngay vào.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part1/lesson09/Lesson09.java</code>. Các kiểu dữ liệu là bản thu gọn của Messages API (tool_use, server tool, tool_result, stop_reason).
Có 4 bài: lọc client tool (bỏ qua server tool), chạy tool và gửi tool_result khớp id (gói lỗi lại thay vì làm sập vòng lặp),
kiểm tra cái bắt tay id, và tự viết vòng lặp rẽ nhánh theo stop_reason. Bộ chấm dùng một API giả lập "khó tính" như API thật:
thiếu hoặc sai tool_result là lỗi 400. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p1-09"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p1-09 --live"</code>: vòng lặp của bạn nói chuyện trực tiếp với Messages API,
và bạn thấy stop_reason của từng lần gọi.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Response trả về stop_reason là tool_use. Điều gì ĐÃ xảy ra?', options: ['Anthropic đã chạy tool và gửi kèm kết quả', 'Claude tạm dừng, chờ code của bạn chạy tool', 'Tool đã chạy nhưng lỗi, cần thử lại', 'Vòng lặp đã xong, có thể trả lời người dùng'], answer: 1, explain: '"A stop reason of tool use means Claude paused and handed control to you. It doesn\'t mean Anthropic ran anything."' },
    { q: 'Vòng lặp tự viết: Claude trả về hai khối tool_use (id A và B). Code chạy cả hai nhưng chỉ gửi lại tool_result cho A. Điều gì xảy ra ở lần gọi kế tiếp?', options: ['Claude tự đoán kết quả của B', 'Lần gọi đó bị lỗi', 'Claude gọi lại B ở lượt sau', 'API bỏ qua B và chạy tiếp'], answer: 1, explain: '"If you skip it or you mismatch its ID, the very next call fails."' },
    { q: 'Response có: một khối text, một khối web search (server tool) kèm kết quả, và hai khối tool_use của client tool. Cần gửi bao nhiêu tool_result?', options: ['1', '2', '3', '4'], answer: 1, explain: 'Chỉ client tool cần tool_result; kết quả server tool "come back to you directly, with no tool result needed from your side".' },
    { q: 'Khối tool_result được gắn về đúng tool_use bằng cách nào?', options: ['Theo thứ tự xuất hiện trong response', 'Bằng id khớp với id của khối tool_use', 'Theo tên tool', 'Theo thời điểm tool chạy xong'], answer: 1, explain: 'Tool_result mang output "tied back to its tool use by a matching ID".' },
    { q: 'Response có stop_reason end_turn. Vòng lặp nên làm gì?', options: ['Chạy các tool còn lại rồi gọi tiếp', 'Thoát và trả về câu trả lời', 'Gọi lại để chắc chắn model đã xong', 'Gửi tool_result rỗng rồi kết thúc'], answer: 1, explain: '"When it comes back as end turn, Claude is finished and your loop should exit and return the answer."' },
    { q: 'Response có stop_reason max_tokens. Vòng lặp tự viết nên xử lý thế nào?', options: ['Coi như end_turn và trả lời luôn', 'Code của bạn tự quyết định', 'Coi như tool_use và chạy tool', 'Bỏ qua và gọi lại model với đúng mảng messages cũ'], answer: 1, explain: '"Other values signal that you hit a cap or an error and your code decides what to do next."' },
    { q: 'Thứ tự đúng của một vòng trong vòng lặp tự viết là gì?', options: ['Chạy tool, gửi messages, tìm tool_use, thêm tool_result rồi gọi lại', 'Gửi messages, tìm tool_use, chạy tool, thêm tool_result', 'Tìm tool_use, gửi messages, thêm tool_result, chạy tool', 'Gửi messages, thêm tool_result, tìm tool_use, chạy tool'], answer: 1, explain: 'Gửi mảng messages, tìm tool_use, chạy tool của bạn, thêm tool_result, rồi gọi lại.' },
    { q: 'Ba thứ tạo nên toàn bộ hợp đồng giữa vòng lặp và model là gì?', options: ['prompt, model, temperature', 'tool_use, tool_result, stop_reason', 'request, response, header', 'system, user, assistant'], answer: 1, explain: '"Those three pieces are the entire contract between your loop and the model."' },
    { q: 'Ba tầng kiểm soát xếp từ nhiều kiểm soát nhất tới ít kiểm soát nhất là gì?', options: ['Managed Agents, Agent SDK, Messages API', 'Messages API, Agent SDK, Managed Agents', 'Agent SDK, Messages API, Managed Agents', 'Messages API, Managed Agents, Agent SDK'], answer: 1, explain: 'Messages API ở dưới cùng, nhiều kiểm soát và nhiều code nhất; Managed Agents ở trên cùng, được host hoàn toàn.' },
    { q: 'Ở tầng nào Anthropic chạy cả vòng lặp, sandbox và các phiên?', options: ['Messages API', 'Agent SDK', 'Managed Agents', 'Client SDK'], answer: 2, explain: '"At the top are managed agents, a fully hosted harness, where Anthropic runs the loop, the sandbox, and the sessions."' },
    { q: 'Lý do nào KHÔNG phải lý do hợp lý để tự viết vòng lặp?', options: ['Cần áp chính sách xác định ở mỗi bước', 'Tích hợp vào runtime có quy ước riêng', 'Muốn có ít phụ thuộc nhất có thể khi chạy production', 'Vì tự viết luôn cho kết quả tốt hơn'], answer: 3, explain: '"Not every application needs a hand-rolled loop, and reaching for one by default is a mistake."' },
    { q: 'Đánh đổi chính khi tự viết vòng lặp là gì?', options: ['Mất khả năng dùng tool', 'Phải tự viết và bảo trì đường ống', 'Không ghi log được', 'Không dùng được các model mới nhất của Anthropic'], answer: 1, explain: '"You\'re now writing and maintaining the plumbing the SDK gave you for free."' },
    { q: 'Vì sao vòng lặp tự viết giúp áp đặt hành vi xác định dễ hơn?', options: ['Vì model trở nên xác định', 'Vì mọi request đi qua code của bạn', 'Vì không dùng tool', 'Vì Messages API có sẵn chế độ chạy xác định riêng'], answer: 1, explain: '"Every request going out and every response coming back passes through code you wrote."' },
    { q: 'Câu nào SAI về server tool?', options: ['Chạy trên hạ tầng của Anthropic', 'Kết quả về thẳng trong response', 'Bạn phải gửi tool_result cho nó', 'Web search là một ví dụ'], answer: 2, explain: 'Server tool không cần tool_result từ phía bạn.' },
    { q: 'Trong vòng lặp tự viết, tool của bạn ném exception khi chạy. Cách xử lý tốt nhất là gì?', options: ['Không gửi gì để Claude tự hiểu là tool đã hỏng', 'Gửi tool_result đánh dấu lỗi', 'Dừng cả chương trình', 'Gửi lại khối tool_use cho Claude'], answer: 1, explain: 'Bỏ tool_result sẽ làm lần gọi sau lỗi; gửi kết quả lỗi để Claude biết mà xử lý tiếp.' },
    { q: 'Với Agent SDK, bạn làm gì thay cho việc tự viết chu kỳ suy luận, hành động, quan sát?', options: ['Viết lại model', 'Cấu hình tool, model, giới hạn lượt', 'Viết nhiều prompt hơn', 'Gọi Messages API song song để vòng lặp nhanh hơn'], answer: 1, explain: '"You configure the tools, the model, and the turn limits instead of writing the reason, act, observe, cycle by hand."' },
    { q: 'Client SDK (Messages API gốc) là lựa chọn đúng khi nào?', options: ['Khi muốn viết ít code nhất', 'Khi cần kiểm soát chi tiết', 'Khi cần Anthropic host sẵn sandbox cho tool', 'Khi không cần tool'], answer: 1, explain: '"The Client SDK is the right call when fine-grained control is the whole point of your build."' },
    { q: 'Một người nói: "stop_reason là tool_use nghĩa là tool đã được chạy, mình chỉ cần đọc kết quả". Điều gì sai?', options: ['Không sai gì', 'Tool chưa chạy, chính code của bạn phải chạy nó', 'Kết quả nằm ở stop_reason chứ không ở content', 'Tool chỉ chạy khi gọi lại lần nữa'], answer: 1, explain: '"In a custom loop, nothing executes unless your code executes it."' },
    { q: 'Vòng lặp tự viết đọc stop_reason ở thời điểm nào?', options: ['Chỉ ở response đầu tiên', 'Ở mọi response', 'Chỉ khi có lỗi', 'Chỉ ở response cuối cùng'], answer: 1, explain: '"The field you inspect on every response."' },
    { q: 'Bước nào hay bị quên nhất trong vòng lặp tự viết?', options: ['Gửi mảng messages', 'Đọc stop_reason', 'Thêm tool_result vào', 'Chọn model'], answer: 2, explain: '"The one step people forget is the tool result."' },
    { q: 'Câu nào đúng về khối tool_use?', options: ['Chứa output của tool', 'Nêu tên tool cùng input để gọi', 'Do code của bạn tạo ra', 'Chỉ xuất hiện với server tool'], answer: 1, explain: '"A block in Claude\'s reply that names a tool and the input to call it with."' },
    { q: 'Sau khi thêm tool_result, bước tiếp theo là gì?', options: ['Kết thúc vòng lặp', 'Gọi lại model', 'Xóa khối tool_use cũ', 'Chạy lại tool lần nữa để kiểm tra kết quả có ổn định không'], answer: 1, explain: '"Append that result as a tool result block and re-invoke the model with the updated conversation."' },
    { q: 'Vòng lặp tự viết dừng khi nào nếu mọi thứ bình thường?', options: ['Khi đã gọi đủ 10 lần', 'Khi model không yêu cầu tool', 'Khi hết tool trong danh sách', 'Khi tool_result đầu tiên đã được gửi lại cho model'], answer: 1, explain: '"The loop keeps spinning until the model answers without asking for a tool."' },
    { q: 'Nhóm đã có runtime riêng với hệ thống log, retry và quy ước gọi dịch vụ. Lý do này nghiêng về lựa chọn nào?', options: ['Agent SDK, vì có sẵn mọi thứ', 'Vòng lặp tự viết', 'Managed Agents, vì được host', 'Không nên dùng Claude trong runtime đó'], answer: 1, explain: '"If you\'re integrating Claude into an existing runtime with its own conventions, owning the loop lets you fit right in."' },
    { q: 'Theo bài học, nên bắt đầu một ứng dụng mới thế nào?', options: ['Luôn bắt đầu bằng vòng lặp tự viết để linh hoạt', 'Bắt đầu từ thứ đơn giản nhất chạy được', 'Luôn bắt đầu bằng Managed Agents', 'Bắt đầu bằng cả ba tầng'], answer: 1, explain: '"Start with the simplest thing that works, and reach for a custom loop only when the control genuinely pays off."' },
    { q: 'Câu nào nhầm lẫn khái niệm?', options: ['Client tool chạy trong ứng dụng của bạn', 'Server tool chạy trên hạ tầng Anthropic', 'Web search là client tool', 'Code execution là server tool'], answer: 2, explain: '"Things like web search and code execution run on Anthropic\'s infrastructure."' },
    { q: 'Vì sao "ít phụ thuộc" là lợi ích của vòng lặp tự viết?', options: ['Vì code ngắn hơn', 'Vì không có framework đứng giữa', 'Vì không cần API key khi gọi trực tiếp Messages API', 'Vì model chạy nhanh hơn'], answer: 1, explain: '"There\'s no framework sitting between your code and the model, so there are fewer dependencies to track and pin."' },
    { q: 'Tình huống: model trả lời "Tôi sẽ kiểm tra thời tiết" kèm một khối tool_use, stop_reason tool_use. Vòng lặp in ra câu đó cho người dùng rồi kết thúc. Lỗi ở đâu?', options: ['Không lỗi, câu trả lời đã có', 'Dừng sớm khi chưa xong', 'Lẽ ra phải bỏ khối text', 'Lẽ ra phải gửi lại khối tool_use cho model xác nhận'], answer: 1, explain: 'Rẽ nhánh theo stop_reason: tool_use nghĩa là chưa xong, phải chạy tool rồi tiếp tục.' },
    { q: 'Câu nào đúng nhất về phần thưởng của vòng lặp tự viết?', options: ['Bạn được miễn phí token', 'Kiểm soát mọi lượt và mọi dòng log', 'Bạn không cần xử lý lỗi', 'Bạn không cần đọc stop_reason ở mỗi response nữa'], answer: 1, explain: '"It matters because you control every turn, tool call, and logline yourself."' },
    { q: 'Câu nào là điều cần nhớ cuối bài?', options: ['tool_use là Anthropic đã chạy tool cho bạn', 'tool_use là Claude tạm dừng chờ code của bạn', 'tool_use là model gặp lỗi', 'tool_use là vòng lặp đã xong'], answer: 1, explain: '"Stop reason tool use is Claude pausing for your code to act, not Anthropic running the tool."' },
  ],
};
