window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Ý chính của cả bài:</strong> Khi cần tự định hình từng lượt, bạn có thể bỏ Agent SDK và tự viết vòng lặp trên <strong>Messages API</strong>:
gửi mảng messages, đọc <code>stop_reason</code>, tự chạy tool, gửi <code>tool_result</code> khớp id, rồi gọi lại. Kiểm soát tối đa, nhưng bạn phải tự viết và bảo trì
phần "đường ống". Nhớ kỹ: <code>stop_reason</code> là <em>tool_use</em> nghĩa là Claude <strong>tạm dừng chờ code của bạn</strong>, không phải Anthropic đã chạy gì.</p>

<h3>1. Ba tầng kiểm soát</h3>
<ul>
  <li><strong>Messages API</strong> (tầng dưới cùng): endpoint model gốc. Bạn gọi, đọc stop reason, tự chạy tool, gọi lại. Kiểm soát nhiều nhất, code nhiều nhất.</li>
  <li><strong>Agent SDK</strong> (tầng giữa): Claude Code đóng gói thành thư viện. Nó chạy vòng lặp, thực thi tool, quản lý context; bạn cấu hình thay vì viết.</li>
  <li><strong>Managed Agents</strong> (tầng trên): bộ khung được host hoàn toàn, Anthropic chạy vòng lặp, sandbox và các phiên.</li>
</ul>
<p>Bài này sống ở tầng dưới cùng.</p>

<h3>2. Vì sao từ bỏ sự tiện lợi của SDK?</h3>
<p>Vì đôi khi bạn cần <strong>sở hữu trọn vẹn từng lượt</strong>. Tự viết vòng lặp thì bạn nắm hoàn toàn việc chạy tool, thử lại và ghi log.
Không có framework đứng giữa code và model, nên ít phụ thuộc phải theo dõi và ghim phiên bản. Mọi request đi và mọi response về đều đi qua code bạn viết,
nên dễ áp đặt hành vi xác định. Đánh đổi là thật: bạn phải tự viết và bảo trì phần đường ống mà SDK cho không. Với nhiều ứng dụng, điều đó hoàn toàn đáng.</p>

<h3>3. Client SDK và Agent SDK đặt cạnh nhau</h3>
<ul>
  <li><strong>Client SDK</strong> (Messages API gốc): bạn tự viết vòng lặp tool: gọi API, xem stop reason, chạy các khối tool_use, thêm tool_result, gọi lại.
  Kiểm soát tối đa và code tối đa. Là lựa chọn đúng khi kiểm soát chi tiết chính là mục đích.</li>
  <li><strong>Agent SDK</strong>: Claude lo vòng lặp; bạn cấu hình tool, model, giới hạn lượt thay vì tự viết chu kỳ suy luận, hành động, quan sát.
  Ít kiểm soát hơn, ít code hơn rất nhiều.</li>
</ul>

<h3>4. Chu kỳ mà mọi vòng lặp tự viết lặp lại</h3>
<ul>
  <li>Gửi mảng messages tới model.</li>
  <li>Xem câu trả lời và tìm các khối tool_use trong đó.</li>
  <li>Chạy từng tool mà code của bạn sở hữu, lấy kết quả.</li>
  <li>Thêm kết quả dưới dạng khối tool_result rồi gọi lại model với hội thoại đã cập nhật.</li>
</ul>
<p>Lặp cho tới khi model trả lời mà không yêu cầu tool nào. Bước hay bị quên nhất là <strong>tool_result</strong>:
bỏ qua nó hoặc sai id thì <strong>lần gọi kế tiếp sẽ lỗi</strong>. Làm đúng cái "bắt tay" này là toàn bộ công việc.</p>

<h3>5. Ba khối là toàn bộ hợp đồng</h3>
<ul>
  <li><strong>tool_use:</strong> khối trong câu trả lời của Claude, nêu tên tool và input để gọi. Là tín hiệu model muốn code của bạn hành động.</li>
  <li><strong>tool_result:</strong> khối bạn thêm vào, mang output của tool, gắn về tool_use bằng <strong>id khớp nhau</strong>, trước khi gọi lại.</li>
  <li><strong>stop_reason:</strong> trường bạn kiểm tra ở mọi câu trả lời. Giá trị <em>tool_use</em> nghĩa là Claude đã tạm dừng và chờ bạn chạy tool.</li>
</ul>
<p>Thuộc ba thứ này thì phần còn lại chỉ là nối dây.</p>

<h3>6. Rẽ nhánh theo stop_reason ở mọi lượt</h3>
<ul>
  <li><strong>tool_use:</strong> chạy tool được yêu cầu và tiếp tục hội thoại.</li>
  <li><strong>end_turn:</strong> Claude đã xong, vòng lặp thoát và trả về câu trả lời.</li>
  <li><strong>Giá trị khác:</strong> bạn chạm giới hạn hoặc gặp lỗi, và code của bạn quyết định làm gì tiếp.</li>
</ul>
<p><strong>Cái bẫy:</strong> stop_reason là tool_use nghĩa là Claude <strong>tạm dừng và trao quyền cho bạn</strong>, không có nghĩa Anthropic đã chạy gì.
Trong vòng lặp tự viết, không gì chạy cả trừ khi code của bạn chạy nó.</p>

<h3>7. Client tool và server tool</h3>
<ul>
  <li><strong>Client tool</strong> chạy trong ứng dụng của bạn: Claude trả stop_reason tool_use, và bạn chịu trách nhiệm chạy tool rồi gửi tool_result.</li>
  <li><strong>Server tool</strong> như web search hay code execution chạy trên hạ tầng của Anthropic: kết quả về thẳng cho bạn, <strong>không cần gửi tool_result</strong>.</li>
</ul>
<p>Trong vòng lặp tự viết, việc của bạn là client tool. Biết tool nào chạy ở phía nào là biết chính xác code của bạn phải làm việc ở đâu.</p>

<h3>8. Khi nào đây là lựa chọn đúng?</h3>
<p>Không phải ứng dụng nào cũng cần vòng lặp tự viết, và mặc định chọn nó là sai lầm. Nhưng có những trường hợp thật sự hưởng lợi:</p>
<ul>
  <li>Cần áp chính sách xác định ở <strong>mỗi bước</strong>: vòng lặp tự viết cho bạn chỗ để móc vào.</li>
  <li>Tích hợp Claude vào một runtime sẵn có với quy ước riêng: sở hữu vòng lặp giúp bạn khớp vào.</li>
  <li>Muốn <strong>ít phụ thuộc</strong> khi chạy production: ít bộ phận chuyển động là một ưu điểm.</li>
</ul>
<p>Hướng dẫn đơn giản: bắt đầu từ thứ đơn giản nhất chạy được, chỉ dùng vòng lặp tự viết khi sự kiểm soát thật sự đáng giá.</p>

<h3>9. Tóm tắt</h3>
<ul>
  <li>Vòng lặp tự viết cho bạn model gốc phía sau Agent SDK.</li>
  <li>Bạn kiểm soát mọi lượt, mọi lời gọi tool, mọi dòng log.</li>
  <li>stop_reason tool_use là Claude tạm dừng để code của bạn hành động, không phải Anthropic chạy tool.</li>
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
<p>Mở <code>java-app/src/main/java/lesson09/Lesson09.java</code>. Các kiểu dữ liệu là bản thu gọn của Messages API (tool_use, server tool, tool_result, stop_reason).
Có 4 bài: lọc client tool (bỏ qua server tool), chạy tool và gửi tool_result khớp id (gói lỗi lại thay vì làm sập vòng lặp),
kiểm tra cái bắt tay id, và tự viết vòng lặp rẽ nhánh theo stop_reason. Bộ chấm dùng một API giả lập "khó tính" như API thật:
thiếu hoặc sai tool_result là lỗi 400. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="09"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="09 --live"</code>: vòng lặp của bạn nói chuyện trực tiếp với Messages API,
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
