window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Ý chính của cả bài:</strong> Gọi <code>query()</code> thì Claude không trả lời một lần mà chạy một <strong>vòng lặp</strong>:
suy luận, gọi tool, đọc kết quả, rồi lặp lại, cho tới khi trả lời mà <strong>không gọi tool nào</strong>. Mặc định vòng lặp
<strong>không có giới hạn</strong>, nên đặt max turns (và ngân sách) là việc của bạn. Khi đọc kết quả, luôn <strong>kiểm tra subtype trước</strong>.</p>

<h3>1. Đi qua vòng lặp một lượt</h3>
<ul>
  <li>Claude nhận prompt của bạn, cùng system prompt, định nghĩa các tool và lịch sử (nếu có). SDK phát ra message init, đánh dấu lần chạy đã mở.</li>
  <li>Claude trả lời: đôi khi là chữ thường, nhưng thường là yêu cầu gọi tool.</li>
  <li>SDK chạy các tool đó và đưa kết quả lại cho Claude.</li>
  <li>Chu kỳ lặp lại: Claude đọc kết quả, suy luận tiếp, có thể gọi thêm tool.</li>
  <li>Vòng lặp tiếp tục cho tới khi Claude trả lời <strong>không kèm lời gọi tool nào</strong>. Câu trả lời không có tool đó là tín hiệu kết thúc.</li>
</ul>

<h3>2. "Lượt" (turn) nghĩa là gì?</h3>
<p>Một lượt là <strong>một vòng khứ hồi</strong>: Claude yêu cầu một số tool, SDK chạy chúng, kết quả quay về, tất cả mà không trả quyền điều khiển cho code của bạn ở giữa.
Lượt kết thúc khi kết quả tool quay về. Nếu Claude nhìn kết quả rồi gọi thêm tool, đó là lượt tiếp theo bắt đầu.
Các lượt cứ chồng lên nhau chừng nào Claude còn với lấy tool. Vòng lặp chỉ kết thúc khi Claude trả lời không gọi tool nào.</p>

<h3>3. Năm loại message có kiểu</h3>
<ul>
  <li><strong>System</strong> mở đầu lần chạy, với subtype <em>init</em> là thứ đầu tiên bạn thấy.</li>
  <li><strong>Assistant</strong> mang output của Claude: chữ và các lời gọi tool.</li>
  <li><strong>User</strong> đưa kết quả tool trở lại vòng lặp, khép lại vòng khứ hồi.</li>
  <li><strong>Stream event</strong> chỉ xuất hiện khi bạn bật streaming từng phần, cho các mảnh nhỏ theo từng token.</li>
  <li><strong>Result</strong> đóng lần chạy, mang tổng chi phí, lượng token và trạng thái cuối.</li>
</ul>
<p>Nắm năm loại này thì luồng message không còn là "nhiễu" mà đọc như một bản ghi chép của vòng lặp.</p>

<h3>4. Hai giới hạn và mặc định "không giới hạn"</h3>
<ul>
  <li><strong>Max turns:</strong> giới hạn số lượt dùng tool.</li>
  <li><strong>Max budget USD:</strong> giới hạn số đô la một lần chạy được tiêu. Ngân sách được kiểm tra <strong>giữa các lần gọi</strong>,
  nên chi phí thật có thể vượt trần tối đa bằng chi phí của <strong>một lần gọi</strong>.</li>
</ul>
<p>Vượt một trong hai, vòng lặp dừng và trả về một kết quả lỗi cho biết bạn chạm giới hạn nào.</p>
<p><strong>Điều gây bất ngờ:</strong> mặc định không có giới hạn nào cả. Để trống thì một lần chạy có thể lặp mãi chừng nào Claude còn gọi tool.
Đặt giới hạn là việc của bạn. Với việc tự động hoặc tốn kém, một max turns hợp lý là khác biệt giữa agent được kiểm soát và agent chạy mất kiểm soát.</p>

<h3>5. Đọc message result</h3>
<p>Mỗi result có một <strong>subtype</strong>: <em>success</em> nghĩa là kết thúc gọn gàng; các subtype lỗi cho biết giới hạn nào đã dừng nó
(<em>error_max_turns</em> hoặc <em>error_max_budget_usd</em>). Đi kèm là phần kế toán: tổng chi phí USD, usage (token), num turns (số lượt), và session ID nếu muốn nối lại sau.</p>
<p><strong>Điều cần thuộc lòng:</strong> chỉ subtype success mới mang text kết quả. Với subtype lỗi, trường result <strong>rỗng</strong>.
Đọc result mà không kiểm tra subtype trước thì bạn có thể âm thầm nhận về chuỗi rỗng mà không hề hay biết.</p>
<p>Tuy vậy, kết quả lỗi <strong>vẫn có đầy đủ chi phí và usage</strong>: một lần chạy chạm trần lượt vẫn cho bạn biết nó đã tiêu bao nhiêu.
Bài học đơn giản: <strong>rẽ nhánh theo subtype trước</strong>, chỉ đọc text khi biết chắc là success.</p>

<h3>6. Single-shot và streaming input xử lý giới hạn khác nhau</h3>
<p>Khi một lần query dạng single-shot (một chuỗi đầu vào) chạm trần lượt: nó phát ra message result lỗi trước, <strong>rồi ném một exception</strong>
với nội dung kiểu "đã đạt số lượt tối đa". Điều này là cố ý, nhưng nếu không chuẩn bị, exception sẽ dừng chương trình đột ngột.
Vì vậy hãy bọc lần chạy single-shot trong try/except khi muốn bắt giới hạn và chạy tiếp.</p>
<p>Phiên streaming input thì khác: nó <strong>không ném lỗi mà vẫn sống</strong>, nên bạn có thể xem result rồi gửi tin nhắn khác.
Cùng một vòng lặp bên dưới, nhưng chế độ nhập quyết định giới hạn đến với code của bạn theo cách nào.</p>

<h3>7. Ba trường giúp hiểu chuyện gì đã xảy ra</h3>
<ul>
  <li><strong>Stop reason:</strong> vì sao model kết thúc một lượt: <em>end_turn</em> là kết thúc bình thường, <em>max_tokens</em> là hết chỗ, hoặc <em>refusal</em> là từ chối.</li>
  <li><strong>Num turns:</strong> số lượt thật sự đã chạy. Một lần chạy cứ tiến sát tới trần là dấu hiệu agent đang "quay vòng" không hiệu quả.</li>
  <li><strong>Session ID:</strong> định danh cả lần chạy, để nối lại sau hoặc truy vết khi debug.</li>
</ul>
<p>Ba trường này biến một lần chạy đã xong từ "hộp đen" thành thứ bạn đọc được, kiểm toán được, và tiếp tục được.</p>

<h3>8. Tóm tắt</h3>
<ul>
  <li>Vòng lặp agent là một chu kỳ: suy luận, gọi tool, đọc kết quả, lặp lại, rồi trả lời.</li>
  <li>Mỗi phần báo cáo qua một message có kiểu, và mỗi lượt là một vòng khứ hồi tool.</li>
  <li>Vòng lặp không có trần trừ khi bạn đặt: max turns là lưới an toàn của bạn.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">round trip</em>: vòng khứ hồi.</li>
  <li><em class="en">hand control to</em>: trao quyền điều khiển cho.</li>
  <li><em class="en">reach for tools</em>: với lấy tool, chọn dùng tool.</li>
  <li><em class="en">overshoot the cap</em>: vượt quá mức trần.</li>
  <li><em class="en">runaway</em>: chạy mất kiểm soát.</li>
  <li><em class="en">report for duty</em>: trình diện, báo cáo.</li>
  <li><em class="en">stop your program cold</em>: làm chương trình dừng phắt.</li>
  <li><em class="en">churning</em>: quay vòng, khuấy đảo mà không tiến triển.</li>
  <li><em class="en">safety net</em>: lưới an toàn.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/lesson07/Lesson07.java</code> (dùng lại các kiểu message của bài 06). Có 5 bài: tính chi phí theo giá mỗi triệu token,
đếm số lượt trong luồng message, viết vòng lặp có cả max turns lẫn ngân sách (kiểm tra giữa các lần gọi, chấp nhận vượt một lần gọi),
chỉ đọc kết quả khi success, và viết dòng chẩn đoán từ subtype, số lượt và session ID.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="07"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="07 --live"</code>: cùng một việc chạy ba lần với ba kiểu giới hạn,
bạn thấy rõ lúc chạm trần lượt, lúc chạm ngân sách, và lúc thành công.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Theo bài học, tín hiệu nào cho biết vòng lặp agent đã xong?', options: ['Model đã gọi tool cuối cùng trong danh sách được cấp', 'Model trả lời không kèm lời gọi tool', 'SDK nhận được stop reason max_tokens từ model', 'Kết quả tool cuối cùng đã được gửi về cho model'], answer: 1, explain: '"This continues until Claude answers with no tool call at all. That tool-free answer is the signal the loop is done."' },
    { q: 'Một "lượt" (turn) trong bài học được định nghĩa thế nào?', options: ['Một tin nhắn của người dùng cùng câu trả lời của model', 'Một vòng khứ hồi tool', 'Một lần SDK phát ra message bất kỳ trong luồng', 'Một lần model sinh token cho tới khi dừng'], answer: 1, explain: 'Claude yêu cầu tool, SDK chạy, kết quả quay về: "That whole exchange counts as one turn."' },
    { q: 'Một lần chạy: model gọi tool A; nhận kết quả; gọi tool B và C cùng lúc; nhận kết quả; rồi trả lời không kèm tool. Có bao nhiêu lượt?', options: ['1 lượt', '2 lượt', '3 lượt', '4 lượt'], answer: 1, explain: 'Mỗi vòng khứ hồi tool là một lượt, dù trong đó gọi một hay nhiều tool. Câu trả lời cuối không gọi tool nên không tạo lượt mới.' },
    { q: 'Câu nào SAI về lượt (turn)?', options: ['Lượt kết thúc khi kết quả tool quay về', 'Trong một lượt, code của bạn không nhận lại quyền điều khiển ở giữa', 'Mỗi tool được gọi tính là một lượt riêng', 'Lượt mới bắt đầu nếu Claude gọi thêm tool sau khi xem kết quả'], answer: 2, explain: 'Một lượt là một vòng khứ hồi; nhiều tool trong cùng một vòng vẫn là một lượt.' },
    { q: 'Message nào CHỈ xuất hiện khi bạn bật streaming từng phần?', options: ['System init', 'Assistant', 'Stream event', 'Result'], answer: 2, explain: '"A stream event shows up only when you turn on partial streaming, giving you token-by-token deltas."' },
    { q: 'Trong luồng message, kết quả tool được đưa trở lại vòng lặp qua loại message nào?', options: ['Assistant', 'System', 'User', 'Result'], answer: 2, explain: '"A user message delivers the tool results back into the loop, closing that round trip."' },
    { q: 'Mặc định (không đặt gì), một lần chạy query() có giới hạn số lượt không?', options: ['Có, giới hạn ở 10 lượt', 'Có, giới hạn theo ngân sách tài khoản', 'Không có giới hạn nào', 'Có, giới hạn ở 100 lượt'], answer: 2, explain: '"By default, there is no cap at all. Left unset, a run can loop as long as Claude keeps calling tools."' },
    { q: 'Ngân sách 0,05 USD. Mỗi lần gọi tốn khoảng 0,02 USD. Ngân sách được kiểm tra giữa các lần gọi. Lần chạy dừng khi chi phí đạt khoảng bao nhiêu?', options: ['0,04 USD', '0,05 USD', '0,06 USD', '0,10 USD'], answer: 2, explain: 'Sau 2 lần gọi: 0,04 (dưới trần) nên gọi lần 3; sau lần 3: 0,06 (đã vượt) nên dừng. Chi phí có thể vượt trần tối đa một lần gọi.' },
    { q: 'Vì sao chi phí thật có thể vượt max budget USD?', options: ['Vì SDK làm tròn giá lên', 'Vì ngân sách chỉ được kiểm tra giữa các lần gọi', 'Vì chi phí tool không được tính vào ngân sách', 'Vì ngân sách tính theo giờ, không theo lần chạy'], answer: 1, explain: '"That budget is checked between calls, so actual spend can overshoot the cap by up to one call\'s worth."' },
    { q: 'Lần chạy kết thúc với subtype error_max_turns. Trường result chứa gì?', options: ['Câu trả lời dở dang của lượt cuối', 'Rỗng', 'Thông báo lỗi chi tiết của SDK', 'Câu trả lời của lượt gần nhất có text'], answer: 1, explain: '"Only the success subtype carries the final result text. On an error subtype, that result field is empty."' },
    { q: 'Câu nào SAI về một kết quả lỗi (error subtype)?', options: ['Nó không có text kết quả', 'Nó vẫn có tổng chi phí đã tiêu tính tới lúc dừng', 'Nó vẫn có usage', 'Nó không có thông tin chi phí'], answer: 3, explain: '"It still carries full cost and usage accounting."' },
    { q: 'Đoạn code đọc thẳng result.result rồi lưu vào cơ sở dữ liệu mà không kiểm tra gì. Rủi ro lớn nhất là gì?', options: ['Code chạy chậm hơn', 'Âm thầm lưu chuỗi rỗng', 'Bị tính phí gấp đôi', 'SDK ném lỗi ngay vì code đọc trường result khi chưa có'], answer: 1, explain: '"If you read the result text without checking the subtype first, you can quietly get nothing back and never notice."' },
    { q: 'Thứ tự xử lý message result đúng là gì?', options: ['Đọc text trước, kiểm tra subtype sau', 'Kiểm tra subtype trước, success mới đọc text', 'Chỉ đọc chi phí, bỏ qua subtype', 'Đọc text trước, nếu rỗng thì gọi lại query() với cùng prompt'], answer: 1, explain: '"Branch on the subtype first, then read the result text only when you know it\'s a success."' },
    { q: 'Một lần query single-shot chạm trần lượt. Điều gì xảy ra theo đúng thứ tự?', options: ['Ném exception, rồi phát result lỗi', 'Phát result lỗi trước, rồi mới ném exception', 'Chỉ phát result lỗi, không ném gì', 'Chỉ ném exception, không phát result'], answer: 1, explain: '"It first yields the error result message... Then it raises an error with text like reached maximum number of turns."' },
    { q: 'Cùng một lần chạm trần lượt, phiên streaming input khác single-shot ở điểm nào?', options: ['Streaming input cũng ném exception nhưng muộn hơn', 'Streaming input không ném lỗi, phiên vẫn còn sống', 'Streaming input tự tăng trần rồi chạy tiếp', 'Streaming input xóa lịch sử rồi bắt đầu lại'], answer: 1, explain: '"A streaming input session behaves differently. It doesn\'t raise, it stays alive."' },
    { q: 'Script batch dùng query() single-shot cho 100 tài liệu. Tài liệu thứ 7 chạm trần lượt và cả script dừng. Cách sửa đúng là gì?', options: ['Bỏ max turns để lần chạy không bao giờ chạm trần nữa', 'Bọc mỗi lần chạy trong try/except', 'Chuyển sang đọc result trước khi kiểm tra', 'Tăng max budget USD lên gấp đôi'], answer: 1, explain: '"Wrap a single-shot run in try and except when you want to catch that limit and keep going." Bỏ giới hạn thì lại mất lưới an toàn.' },
    { q: 'Stop reason của một lượt là max_tokens. Điều đó nghĩa là gì?', options: ['Đã chạm max turns', 'Model hết chỗ để viết tiếp', 'Đã chạm max budget USD', 'Model từ chối yêu cầu'], answer: 1, explain: 'End_turn là kết thúc bình thường, max_tokens là hết chỗ, refusal là từ chối. Max turns được báo bằng subtype của result, không phải stop reason.' },
    { q: 'Câu nào nhầm lẫn giữa hai khái niệm?', options: ['Subtype nằm ở message result', 'Stop reason cho biết vì sao model kết thúc một lượt', 'error_max_turns là một stop reason do model trả về', 'num_turns là số lượt đã chạy'], answer: 2, explain: 'error_max_turns là subtype của result, do SDK đặt khi chạm trần; stop reason là của từng lượt model (end_turn, max_tokens, refusal).' },
    { q: 'Nhiều lần chạy gần đây có num_turns tiến sát trần đã đặt. Điều này gợi ý gì?', options: ['Agent đang làm việc rất hiệu quả', 'Agent có thể đang quay vòng', 'Nên bỏ trần để agent có đủ chỗ làm xong việc', 'Model đang bị lỗi mạng'], answer: 1, explain: '"A run that keeps climbing toward your cap is a sign the agent is churning."' },
    { q: 'Muốn tiếp tục một lần chạy cũ hoặc truy vết khi debug, bạn cần trường nào?', options: ['stop_reason', 'num_turns', 'session_id', 'total_cost_usd'], answer: 2, explain: '"Session ID... identifies the whole run so you can resume it later or trace it when you\'re debugging."' },
    { q: 'Ba trường stop reason, num turns, session ID giúp bạn điều gì?', options: ['Giảm chi phí của lần chạy sau', 'Đọc, kiểm toán và tiếp tục lần chạy', 'Tăng tốc vòng lặp', 'Cho phép bỏ qua bước kiểm tra subtype khi đọc kết quả'], answer: 1, explain: '"Together, these three turn a finished run from a black box into something you can read, audit, and pick back up."' },
    { q: 'Hai giới hạn có thể đặt cho vòng lặp là gì?', options: ['Max tokens và temperature', 'Max turns và max budget', 'Max tools và max sessions', 'Max messages và timeout cho mỗi lần gọi'], answer: 1, explain: '"Max turns limits how many tool-using turns... Max budget USD limits how many dollars a run may spend."' },
    { q: 'Vượt max turns hoặc max budget thì lần chạy kết thúc ra sao?', options: ['Kết quả success kèm cảnh báo', 'Kết quả lỗi nêu giới hạn đã chạm', 'Treo cho tới khi người dùng xác nhận', 'Tự đổi sang model rẻ hơn rồi chạy tiếp cho xong việc'], answer: 1, explain: '"Cross either one, and the loop halts, and hands back an error result that tells you which limit you hit."' },
    { q: 'Ai chịu trách nhiệm đặt giới hạn cho vòng lặp?', options: ['Model, vì nó biết khi nào nên dừng', 'Lập trình viên', 'Anthropic, qua cấu hình tài khoản', 'Người dùng cuối, qua nút dừng'], answer: 1, explain: '"So setting a bound is on you, the developer."' },
    { q: 'Ở lượt đầu tiên, Claude nhận những gì?', options: ['Chỉ prompt của bạn', 'Prompt, system prompt, tool và lịch sử', 'Prompt cùng toàn bộ kết quả tool của lần chạy trước', 'Chỉ system prompt và danh sách tool'], answer: 1, explain: '"It starts when Claude receives your prompt, along with the system prompt, the tool definitions, and any history."' },
    { q: 'Ai thực thi tool mà Claude yêu cầu trong vòng lặp của query()?', options: ['Claude, trong lúc suy luận', 'SDK', 'Code của bạn, viết riêng cho mỗi tool call', 'Máy chủ của Anthropic'], answer: 1, explain: '"The SDK executes those tools and feeds the results back to Claude."' },
    { q: 'Câu nào mô tả đúng cách đọc luồng message sau khi nắm 5 loại message?', options: ['Như nhiễu cần lọc bỏ', 'Như bản ghi chép của vòng lặp', 'Như log lỗi của SDK', 'Như danh sách lệnh cần chạy'], answer: 1, explain: '"Learn these five, and the stream stops looking like noise. It reads like a transcript of the loop."' },
    { q: 'Một lần chạy lỗi vì chạm trần lượt. Bạn có biết nó đã tiêu bao nhiêu tiền không?', options: ['Không, chỉ success mới có chi phí', 'Có, kết quả lỗi vẫn có chi phí', 'Chỉ biết số lượt, không biết chi phí', 'Phải đợi xem hóa đơn API cuối tháng mới biết được'], answer: 1, explain: '"Even a run that blew its turn cap tells you what it spent."' },
    { q: 'Với một agent tự động chạy đêm, cấu hình nào an toàn nhất theo bài học?', options: ['Không đặt giới hạn để agent làm xong việc', 'Đặt max turns hợp lý', 'Chỉ dặn trong prompt "đừng chạy quá lâu"', 'Đặt max tokens thật lớn'], answer: 1, explain: '"On anything autonomous or expensive, a sensible max turns is the difference between a controlled agent and a runaway one."' },
    { q: 'Câu nào là điều cần nhớ cuối bài?', options: ['Vòng lặp tự dừng khi model thấy đủ, nên không cần giới hạn', 'Vòng lặp không có trần trừ khi bạn đặt', 'Max turns chỉ cần cho agent có nhiều tool', 'Chỉ cần kiểm tra stop reason là đủ'], answer: 1, explain: '"The loop has no cap unless you set one, so max turns is your safety net."' },
  ],
};
