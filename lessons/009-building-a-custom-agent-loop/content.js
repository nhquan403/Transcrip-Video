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

  quiz: [
    { q: 'Ba tầng kiểm soát khi xây agent, từ dưới lên, là gì?', options: ['Messages API, Agent SDK, Managed Agents', 'Agent SDK, Messages API, Managed Agents', 'Managed Agents, Agent SDK, Messages API', 'CLI, IDE, Web'], answer: 0, explain: 'Messages API là tầng gốc; Managed Agents là tầng được host hoàn toàn.' },
    { q: 'Ở tầng Messages API, bạn phải làm gì?', options: ['Chỉ cấu hình tool', 'Gọi API, đọc stop reason, tự chạy tool, rồi gọi lại', 'Không làm gì, Anthropic lo hết', 'Chỉ viết system prompt'], answer: 1, explain: 'Kiểm soát nhiều nhất và code nhiều nhất.' },
    { q: 'Managed Agents là gì?', options: ['Một thư viện Python', 'Endpoint model gốc', 'Bộ khung được host hoàn toàn, Anthropic chạy vòng lặp, sandbox và phiên', 'Một loại tool'], answer: 2, explain: 'Đó là tầng trên cùng.' },
    { q: 'Lý do chính để từ bỏ sự tiện lợi của Agent SDK là gì?', options: ['SDK đắt hơn', 'SDK không dùng được tool', 'SDK chậm hơn', 'Cần sở hữu trọn vẹn từng lượt: chạy tool, thử lại, ghi log'], answer: 3, explain: 'Đôi khi bạn cần toàn quyền với mỗi lượt.' },
    { q: 'Đánh đổi lớn nhất khi tự viết vòng lặp là gì?', options: ['Phải tự viết và bảo trì phần đường ống mà SDK cho không', 'Không dùng được Claude', 'Mất khả năng gọi tool', 'Không ghi log được'], answer: 0, explain: 'Bạn nhận kiểm soát và gánh thêm code.' },
    { q: 'Vì sao vòng lặp tự viết giúp dễ áp đặt hành vi xác định?', options: ['Vì model trở nên xác định', 'Vì mọi request và response đều đi qua code bạn viết', 'Vì không dùng tool', 'Vì API có chế độ xác định'], answer: 1, explain: 'Không có framework đứng giữa code và model.' },
    { q: 'Bước đầu tiên trong chu kỳ của vòng lặp tự viết là gì?', options: ['Chạy tool', 'Thêm tool_result', 'Gửi mảng messages tới model', 'Đọc file cấu hình'], answer: 2, explain: 'Gửi messages, tìm tool_use, chạy tool, thêm tool_result, gọi lại.' },
    { q: 'Bước hay bị quên nhất trong vòng lặp là gì?', options: ['Gửi messages', 'Đọc stop_reason', 'Chọn model', 'Thêm tool_result với id khớp'], answer: 3, explain: 'Bỏ qua hoặc sai id thì lần gọi kế tiếp lỗi.' },
    { q: 'Thiếu tool_result hoặc sai id thì điều gì xảy ra?', options: ['Lần gọi kế tiếp lỗi', 'Claude tự đoán kết quả', 'Không sao cả', 'Vòng lặp tự sửa'], answer: 0, explain: 'Cái bắt tay phải khớp, nếu không API báo lỗi.' },
    { q: 'Khối tool_use mang thông tin gì?', options: ['Kết quả của tool', 'Tên tool và input để gọi', 'Chi phí', 'Lý do dừng'], answer: 1, explain: 'Đó là tín hiệu model muốn code của bạn hành động.' },
    { q: 'Khối tool_result gắn về tool_use bằng cách nào?', options: ['Theo thứ tự thời gian', 'Theo tên tool', 'Bằng id khớp nhau', 'Không cần gắn'], answer: 2, explain: 'Id của tool_result phải khớp id của tool_use tương ứng.' },
    { q: 'Ba thứ tạo nên toàn bộ hợp đồng giữa vòng lặp và model là gì?', options: ['Prompt, model, nhiệt độ', 'Input, output, log', 'Request, response, header', 'tool_use, tool_result, stop_reason'], answer: 3, explain: 'Thuộc ba thứ này thì phần còn lại chỉ là nối dây.' },
    { q: 'stop_reason là tool_use nghĩa là gì?', options: ['Claude đã tạm dừng, chờ code của bạn chạy tool', 'Anthropic đã chạy tool xong', 'Tool bị lỗi', 'Hết token'], answer: 0, explain: 'Không gì chạy cả trừ khi code của bạn chạy nó.' },
    { q: 'stop_reason là end_turn thì vòng lặp nên làm gì?', options: ['Chạy thêm tool', 'Thoát và trả về câu trả lời', 'Gọi lại model', 'Báo lỗi'], answer: 1, explain: 'Claude đã xong việc.' },
    { q: 'stop_reason mang giá trị khác tool_use và end_turn thì sao?', options: ['Bỏ qua và gọi lại', 'Luôn coi là thành công', 'Bạn chạm giới hạn hoặc lỗi, và code của bạn quyết định làm gì', 'Khởi động lại máy'], answer: 2, explain: 'Ví dụ max_tokens hay refusal cần xử lý riêng.' },
    { q: 'Trong vòng lặp tự viết, ai chạy client tool?', options: ['Anthropic', 'Claude', 'Người dùng cuối', 'Code của bạn'], answer: 3, explain: 'Client tool chạy trong ứng dụng của bạn.' },
    { q: 'Server tool khác client tool ở điểm nào?', options: ['Chạy trên hạ tầng Anthropic, kết quả về thẳng, không cần bạn gửi tool_result', 'Chạy trên máy bạn', 'Không có kết quả', 'Chỉ dùng được trong Agent SDK'], answer: 0, explain: 'Ví dụ web search, code execution.' },
    { q: 'Ví dụ nào là server tool?', options: ['Một hàm đọc file bạn tự viết', 'Web search', 'Hàm truy vấn cơ sở dữ liệu của bạn', 'Hàm gửi email của bạn'], answer: 1, explain: 'Web search và code execution chạy phía Anthropic.' },
    { q: 'Trong vòng lặp tự viết, phần việc của bạn tập trung vào loại tool nào?', options: ['Server tool', 'Cả hai như nhau', 'Client tool: chạy và đưa kết quả lại vào messages', 'Không loại nào'], answer: 2, explain: 'Server tool đã được Anthropic lo.' },
    { q: 'Có nên mặc định chọn vòng lặp tự viết cho mọi ứng dụng không?', options: ['Có, luôn tốt hơn', 'Có, vì rẻ hơn', 'Có, vì nhanh hơn', 'Không, đó là sai lầm; chỉ dùng khi kiểm soát thật sự đáng giá'], answer: 3, explain: 'Bắt đầu từ thứ đơn giản nhất chạy được.' },
    { q: 'Trường hợp nào hưởng lợi từ vòng lặp tự viết?', options: ['Cần áp chính sách xác định ở mỗi bước', 'Chỉ cần một câu trả lời đơn giản', 'Muốn có sẵn mọi tool tích hợp', 'Không muốn viết code'], answer: 0, explain: 'Vòng lặp tự viết cho bạn chỗ móc chính sách vào mỗi bước.' },
    { q: 'Tích hợp Claude vào runtime sẵn có với quy ước riêng thì vòng lặp tự viết giúp gì?', options: ['Không giúp gì', 'Sở hữu vòng lặp giúp bạn khớp vào quy ước đó', 'Làm runtime chậm đi', 'Bắt buộc đổi runtime'], answer: 1, explain: 'Bạn điều chỉnh vòng lặp theo runtime thay vì ngược lại.' },
    { q: 'Vì sao "ít phụ thuộc" là ưu điểm khi chạy production?', options: ['Vì code dài hơn', 'Vì model mạnh hơn', 'Vì ít bộ phận chuyển động, ít thứ phải theo dõi và ghim phiên bản', 'Vì rẻ hơn'], answer: 2, explain: 'Ít bộ phận là ít điểm hỏng.' },
    { q: 'Với Agent SDK, bạn làm gì thay cho việc tự viết vòng lặp?', options: ['Không làm gì', 'Viết lại model', 'Gọi API thủ công', 'Cấu hình tool, model và giới hạn lượt'], answer: 3, explain: 'Ít kiểm soát hơn, ít code hơn rất nhiều.' },
    { q: 'Tình huống: Claude trả về một khối text, một khối web search (server tool) và hai khối tool_use. Bạn phải gửi bao nhiêu tool_result?', options: ['Hai, cho hai khối tool_use', 'Ba', 'Bốn', 'Không cái nào'], answer: 0, explain: 'Chỉ client tool cần tool_result; server tool đã có kết quả sẵn.' },
    { q: 'Tình huống: một tool của bạn ném lỗi khi chạy. Vòng lặp nên làm gì?', options: ['Dừng toàn bộ chương trình', 'Gửi tool_result đánh dấu lỗi, kèm thông báo, để Claude xử lý tiếp', 'Bỏ qua, không gửi gì', 'Gửi lại tool_use'], answer: 1, explain: 'Bỏ qua tool_result sẽ làm lần gọi sau lỗi; gói lỗi lại cho Claude biết.' },
    { q: 'Sau khi chạy tool và thêm tool_result, bước tiếp theo là gì?', options: ['Kết thúc vòng lặp', 'Xóa lịch sử', 'Gọi lại model với hội thoại đã cập nhật', 'Đổi model'], answer: 2, explain: 'Rồi lặp lại cho tới khi không còn tool nào được yêu cầu.' },
    { q: 'Vì sao một vòng lặp tự viết cũng nên có giới hạn số lần gọi?', options: ['Vì API bắt buộc', 'Vì tool chạy chậm', 'Vì Claude không bao giờ dừng', 'Để tránh lặp vô hạn nếu model cứ đòi tool'], answer: 3, explain: 'Bạn sở hữu vòng lặp thì cũng sở hữu điều kiện dừng.' },
    { q: 'Câu nào đúng về vòng lặp tự viết?', options: ['Nó cho bạn model gốc phía sau Agent SDK và kiểm soát mọi lượt, mọi lời gọi tool, mọi dòng log', 'Nó nhanh hơn Agent SDK trong mọi trường hợp', 'Nó không cần tool_result', 'Nó chỉ dùng được với server tool'], answer: 0, explain: 'Đó là phần thưởng của việc tự viết.' },
    { q: 'Điều cần nhớ nhất về stop_reason tool_use là gì?', options: ['Anthropic đã chạy tool cho bạn', 'Claude tạm dừng để code của bạn hành động', 'Vòng lặp đã xong', 'Model gặp lỗi'], answer: 1, explain: 'Không có gì chạy trừ khi code của bạn chạy nó.' },
  ],
};
