window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Nhận được câu trả lời mới là một nửa công việc. Đọc đúng cách gồm ba việc:
<strong>duyệt content theo type</strong> (đừng lấy block đầu tiên rồi đoán), <strong>rẽ nhánh theo stop_reason</strong> (nó bảo bạn làm gì tiếp),
và <strong>đọc usage</strong> (nó bảo bạn tốn bao nhiêu). Thêm hai thói quen: gửi lại block thinking và tool <strong>nguyên vẹn</strong>,
và chỉ đọc <code>stop_details</code> sau khi đã chắc stop_reason là refusal.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>content:</strong> danh sách block model trả về (text, tool_use, thinking...).</li>
  <li><strong>stop_reason:</strong> một trường nói lý do model dừng ở lượt này.</li>
  <li><strong>usage:</strong> phần kế toán token của lời gọi: vào bao nhiêu, ra bao nhiêu, cache bao nhiêu.</li>
  <li><strong>stop_details:</strong> trường giải thích thêm lý do dừng, <strong>chỉ có dữ liệu khi bị refusal</strong>, còn lại là null.</li>
</ul>

<h3>Ba phần của mọi response</h3>
<ul>
  <li><strong>content</strong> cho biết Claude <strong>nói gì</strong>.</li>
  <li><strong>stop_reason</strong> cho biết bạn <strong>làm gì tiếp</strong>.</li>
  <li><strong>usage</strong> cho biết lời gọi <strong>tốn bao nhiêu</strong>.</li>
</ul>

<h3>Duyệt content theo type, đừng lấy theo vị trí</h3>
<div class="box">📦 <strong>Hình dung thế này:</strong> Bạn nhận một thùng hàng gồm nhiều gói. Gói nằm trên cùng <strong>không phải lúc nào cũng</strong> là thứ bạn đặt;
đôi khi là phiếu giao hàng hay gói quà tặng. Bạn mở và xem nhãn từng gói, chứ không xé gói trên cùng rồi tin chắc đó là món của mình.</div>
<p>content là một danh sách, nên hãy <strong>lặp qua nó</strong> và rẽ nhánh theo trường <code>type</code> của từng block.
Thứ tự <strong>không được đảm bảo</strong>: block thinking hoặc tool_use có thể đứng trước text bạn mong đợi.
Code lấy <code>content[0]</code> rồi coi là text sẽ chạy tốt lúc test, rồi <strong>hỏng trên production</strong> lần đầu có thứ khác chen lên trước.
Xử lý text, tool và thinking mỗi thứ một nhánh, thì cùng một hàm xử lý chạy được với mọi hình dạng câu trả lời.</p>

<h3>Bảy giá trị stop_reason</h3>
<ul>
  <li><strong>end_turn:</strong> Claude tự hoàn thành. Lấy text, xong.</li>
  <li><strong>max_tokens:</strong> chạm trần output. Nâng trần, hoặc viết tiếp ở request sau.</li>
  <li><strong>tool_use:</strong> Claude dừng để xin dùng tool. Chạy tool rồi gửi kết quả lại.</li>
  <li><strong>refusal:</strong> Claude từ chối vì lý do an toàn. Đây là trường hợp <strong>duy nhất</strong> stop_details có dữ liệu.</li>
  <li><strong>stop_sequence:</strong> một chuỗi dừng bạn tự đặt vừa xuất hiện.</li>
  <li><strong>model_context_window_exceeded:</strong> response chạm giới hạn cửa sổ context của model.</li>
  <li><strong>pause_turn:</strong> một lượt dài tạm dừng; bạn gửi lại nội dung assistant để nó tiếp tục.</li>
</ul>
<p>⚠️ Vòng lặp chỉ chờ <code>end_turn</code> có thể âm thầm hỏng khi gặp <code>pause_turn</code>.</p>

<h3>Vòng tool_use: đọc, chạy, nối, gọi lại</h3>
<ol>
  <li><strong>Đọc</strong> block tool_use để lấy tên tool và input.</li>
  <li><strong>Chạy</strong> tool trong ứng dụng của bạn. Không có gì chạy ở phía Anthropic cả.</li>
  <li><strong>Nối</strong> một block tool_result chứa output vào hội thoại.</li>
  <li><strong>Gọi lại</strong> API. Claude tiếp tục từ chỗ đã dừng.</li>
</ol>
<p>Lặp bao nhiêu lần cũng được, và kết thúc khi stop_reason cuối cùng là <code>end_turn</code>.</p>
<div class="box">🚪 <strong>Mô hình tư duy:</strong> <code>end_turn</code> là <strong>lối ra</strong>: đọc câu trả lời, dừng vòng lặp, trả kết quả.
<code>tool_use</code> là <strong>nhường lượt</strong>: hội thoại tạm treo và chờ code của bạn. Phân biệt hai cái này ngay lập tức thì phần còn lại tự vào chỗ.</div>

<h3>Đọc usage để hiểu chi phí</h3>
<ul>
  <li><strong>input_tokens:</strong> chỉ đếm token input <strong>không được cache</strong>, tức phần còn lại không đọc từ cache. Đây là điều hay gây bất ngờ: nó <strong>không phải</strong> cả prompt.</li>
  <li><strong>output_tokens:</strong> mọi token model sinh ra; chính là phần mà max_tokens giới hạn.</li>
  <li><strong>Hai trường cache:</strong> số token ghi vào cache và số token đọc từ cache.</li>
</ul>
<p>Quy tắc thực tế: <strong>cỡ prompt đầy đủ = input_tokens + token ghi cache + token đọc cache</strong>.</p>

<h3>Kiểm tra trước, đọc sau với stop_details</h3>
<p><code>stop_details</code> chỉ có dữ liệu khi stop_reason là <strong>refusal</strong> (trên Opus 4.7 trở về sau), gồm category và lời giải thích.
Với mọi stop_reason khác nó là <strong>null</strong>. Đọc nó trên một câu trả lời bình thường là đọc một giá trị null và có thể gây lỗi.
Luôn: kiểm tra stop_reason trước, xác nhận là refusal, rồi mới đọc stop_details.</p>

<h3>Gửi lại block nguyên vẹn</h3>
<ul>
  <li><strong>Thinking:</strong> nếu câu trả lời có thinking, gửi lại các block đó ở lượt assistant mới nhất <strong>không sửa gì</strong>, kể cả signature. Sửa dù chỉ một chút là request bị từ chối.</li>
  <li><strong>Tool:</strong> mang tool_use và tool_result đi tiếp đúng như cũ, không cắt bớt hay định dạng lại. Bỏ hay đổi là lời gọi tiếp theo hỏng vì model không ghép lại được hội thoại.</li>
</ul>
<p>Coi những block có cấu trúc ở lượt assistant mới nhất là <strong>chỉ đọc</strong>.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Lặp qua content theo type; đừng lấy theo vị trí.</li>
  <li>Rẽ nhánh theo stop_reason: end_turn là lối ra, tool_use là nhường lượt, đừng quên pause_turn.</li>
  <li>Cỡ prompt = input_tokens + hai trường cache; chỉ đọc stop_details sau khi chắc là refusal.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">Getting a reply back is only half the job</em>: nhận được câu trả lời mới là một nửa công việc.</li>
  <li><em class="en">reaching for the first one and hoping</em>: chộp lấy cái đầu tiên rồi cầu may.</li>
  <li><em class="en">the order isn't guaranteed</em>: thứ tự không được đảm bảo.</li>
  <li><em class="en">the first time something else lands in front</em>: lần đầu có thứ khác chen lên trước.</li>
  <li><em class="en">round out the roster</em>: hoàn thiện danh sách.</li>
  <li><em class="en">silently break</em>: âm thầm hỏng.</li>
  <li><em class="en">Read, run, append, recall</em>: đọc, chạy, nối, gọi lại.</li>
  <li><em class="en">End turn is an exit, and tool use is a yield</em>: end_turn là lối ra, tool_use là nhường lượt.</li>
  <li><em class="en">falls into place naturally</em>: tự vào đúng chỗ.</li>
  <li><em class="en">Guard first, read second</em>: kiểm tra trước, đọc sau.</li>
  <li><em class="en">Treat those blocks as read-only</em>: coi những block đó là chỉ đọc.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson08/Lesson08.java</code>. Có 5 bài: lấy text bằng cách duyệt mọi block theo type, lọc các tool_use,
rẽ nhánh theo đủ bảy stop_reason, tính cỡ prompt đầy đủ từ usage, và chỉ đọc stop_details khi là refusal.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-08"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-08 --live"</code>: response JSON thô được đọc bằng code của bạn trong một vòng
đọc, chạy, nối, gọi lại thật (Claude xin tra đơn hàng, code chạy tool rồi gửi tool_result), in usage từng lời gọi, rồi một lời gọi max_tokens nhỏ để thấy câu trả lời bị cắt.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Ba phần của response cần đọc mỗi lần là gì?', options: ['id, model, role', 'content, stop_reason, usage', 'headers, body và status code của HTTP', 'text, image, audio'], answer: 1, explain: '"Content tells you what Claude said, stop reason tells you what to do, and usage tells you what it cost."' },
    { q: 'Cách đọc content đúng là gì?', options: ['Lấy content[0] vì đó luôn là text', 'Lấy phần tử cuối cùng', 'Lặp và rẽ nhánh theo type', 'Nối mọi block thành chuỗi rồi đọc'], answer: 2, explain: '"The content field is a list, so you read it by looping over it, never by grabbing a fixed index. As you loop, you branch on each block\'s type field."' },
    { q: 'Code dùng content[0].text chạy tốt khi test. Vì sao nó có thể hỏng trên production?', options: ['Vì thinking/tool_use có thể đứng trước', 'Vì production dùng model khác', 'Vì content luôn rỗng trên production', 'Vì text chỉ có ở block cuối'], answer: 0, explain: '"A thinking block or a tool use block can easily come before the text you were expecting... it will work in testing. And then break in production."' },
    { q: 'stop_reason "end_turn" nghĩa là gì?', options: ['Claude xin chạy tool', 'Câu trả lời bị cắt', 'Claude từ chối', 'Đã xong; lấy text'], answer: 3, explain: '"An end turn means Claude finished on its own, so you take the text and you\'re done."' },
    { q: 'stop_reason "max_tokens" nên xử lý thế nào?', options: ['Chạy tool rồi gửi kết quả', 'Nâng trần, hoặc viết tiếp ở request sau', 'Xem lại chính sách an toàn và prompt của ứng dụng', 'Bỏ qua, coi như đã xong'], answer: 1, explain: '"A max tokens means the reply hit your output cap, so raise the cap or continue it in a follow-up request."' },
    { q: 'Khi stop_reason là "tool_use", ai chạy tool?', options: ['Server của Anthropic', 'Claude tự chạy', 'Ứng dụng của bạn', 'Không ai, tool đã chạy xong'], answer: 2, explain: '"Second, you run that tool inside your own application. Nothing runs on Anthropic\'s side here."' },
    { q: 'stop_details có dữ liệu trong trường hợp nào?', options: ['Chỉ khi stop_reason là refusal', 'Mọi response', 'Khi stop_reason là max_tokens hoặc stop_sequence', 'Khi có tool_use'], answer: 0, explain: '"A refusal means Claude declined on safety grounds. The single case where stop details gets filled in. For every other value, it stays empty."' },
    { q: 'stop_reason nào báo một chuỗi dừng do bạn đặt vừa xuất hiện?', options: ['end_turn', 'pause_turn', 'model_context_window_exceeded', 'stop_sequence'], answer: 3, explain: '"Stop sequence when a custom stop string fires."' },
    { q: 'Response chạm giới hạn cửa sổ context tổng của model. stop_reason là gì?', options: ['max_tokens', 'model_context_window_exceeded', 'refusal', 'stop_sequence'], answer: 1, explain: '"Model context window exceeded when the response hits the model\'s total window."' },
    { q: 'Gặp stop_reason "pause_turn", bạn làm gì?', options: ['Coi như xong, trả kết quả', 'Chạy tool rồi gửi tool_result', 'Gửi lại nội dung assistant', 'Đổi sang model khác'], answer: 2, explain: '"Pause turn when a long turn pauses. So you send the assistant content back to continue."' },
    { q: 'Vì sao vòng lặp chỉ chờ "end_turn" là nguy hiểm?', options: ['Âm thầm hỏng khi gặp pause_turn', 'Nó tốn gấp đôi token', 'Nó không xử lý được text', 'Nó luôn bị rate limit'], answer: 0, explain: '"A loop that only waits for end turn can silently break on pause turn."' },
    { q: 'Thứ tự đúng của vòng tool_use là gì?', options: ['Chạy, đọc, gọi lại, nối', 'Gọi lại, đọc, chạy, nối', 'Nối, chạy, đọc, gọi lại', 'Đọc, chạy, nối, gọi lại'], answer: 3, explain: '"Read, run, append, recall. That\'s the whole pattern."' },
    { q: 'Vòng tool_use kết thúc khi nào?', options: ['Sau đúng 3 lần gọi', 'Khi stop_reason là end_turn', 'Khi tool trả về rỗng', 'Khi usage vượt 10.000 token'], answer: 1, explain: '"That cycle repeats as many times as needed, and it ends when stop reason finally comes back as end turn instead."' },
    { q: 'Mô hình tư duy "end_turn là exit, tool_use là yield" nghĩa là gì?', options: ['Cả hai đều kết thúc hội thoại', 'Cả hai đều yêu cầu code của bạn chạy tool rồi gọi lại API', 'end_turn kết thúc; tool_use chờ bạn', 'end_turn chờ code của bạn; tool_use kết thúc'], answer: 2, explain: '"One ends the conversation, the other suspends it and waits on your code."' },
    { q: 'input_tokens trong usage đếm gì?', options: ['Chỉ phần input không được cache', 'Toàn bộ prompt, kể cả phần cache', 'Toàn bộ prompt cộng output', 'Chỉ system prompt'], answer: 0, explain: '"This counts the uncached input tokens the call billed, meaning only the remainder that wasn\'t served from the cache."' },
    { q: 'usage: input_tokens 150, cache_creation_input_tokens 0, cache_read_input_tokens 12.000, output_tokens 300. Cỡ prompt đầy đủ là bao nhiêu?', options: ['150', '12.450', '300', '12.150'], answer: 3, explain: 'Cỡ prompt đầy đủ = input_tokens + hai trường cache = 150 + 0 + 12.000 = 12.150. output_tokens không thuộc prompt.' },
    { q: 'output_tokens là phần bị giới hạn bởi trường nào?', options: ['temperature', 'max_tokens', 'stop_sequences', 'top_p'], answer: 1, explain: '"The second is output tokens, every token the model generated in its reply. That\'s the part your max token\'s ceiling limits."' },
    { q: 'Muốn biết cỡ prompt đầy đủ, bạn cộng những gì?', options: ['input_tokens và output_tokens', 'Chỉ cache_read_input_tokens', 'Cả ba con số input', 'output_tokens và token đọc cache'], answer: 2, explain: '"To get the full prompt size, you add all three input figures together. The uncached input plus both cache counts."' },
    { q: 'Thứ tự kiểm tra đúng trước khi đọc stop_details là gì?', options: ['Kiểm tra stop_reason là refusal, rồi mới đọc', 'Đọc stop_details trước cho nhanh, rồi mới xem stop_reason để xác nhận', 'Đọc cả hai cùng lúc', 'Chỉ đọc stop_details, bỏ qua stop_reason'], answer: 0, explain: '"Always check stop reason first, confirm it\'s a refusal, and only then read stop details. Guard first, read second."' },
    { q: 'Với stop_reason "max_tokens", stop_details có giá trị gì?', options: ['Category "length"', 'Số token còn thiếu', 'Lý do cắt chi tiết', 'null'], answer: 3, explain: '"For every other stop reason, whether that\'s end turn or tool use or max tokens, stop details comes back null."' },
    { q: 'Khi stop_reason là refusal (trên model hỗ trợ), stop_details chứa gì?', options: ['Số token đã dùng', 'Category và lời giải thích', 'Model dự phòng mà server đã tự động chọn để trả lời thay', 'Một block thinking'], answer: 1, explain: '"Stop details fills in with a category and an explanation of what was declined."' },
    { q: 'Câu trả lời có block thinking. Ở lượt tiếp theo, bạn xử lý block đó thế nào?', options: ['Rút gọn nội dung thinking cho nhẹ', 'Đổi type thành text', 'Gửi lại nguyên vẹn, kể cả signature', 'Xóa signature vì không cần nữa'], answer: 2, explain: '"You pass those blocks back unmodified on the latest assistant turn, keeping the signature and everything else exactly intact. Editing them, even slightly, gets the call rejected."' },
    { q: 'Bạn "dọn dẹp" block tool_use bằng cách bỏ các trường không cần trước khi gửi lại. Hậu quả là gì?', options: ['Lời gọi tiếp theo hỏng', 'Tiết kiệm token mà không ảnh hưởng gì', 'Claude chạy tool lại một lần nữa', 'Claude tự khôi phục các trường bị thiếu'], answer: 0, explain: '"If you drop them or change them, the very next call fails because the model can\'t reconcile the conversation."' },
    { q: 'Nên coi các block có cấu trúc ở lượt assistant mới nhất là gì?', options: ['Bản nháp để chỉnh', 'Dữ liệu tạm có thể xóa', 'Gợi ý không bắt buộc', 'Chỉ đọc'], answer: 3, explain: '"Whatever structured blocks came back on the latest assistant turn, you send them back untouched. Treat those blocks as read-only."' },
    { q: 'Response content = [thinking, tool_use(lookup_order), text "Chờ chút"]. stop_reason = tool_use. Bước tiếp theo đúng là gì?', options: ['Trả "Chờ chút" cho người dùng và kết thúc', 'Chạy tool, nối kết quả, gọi lại', 'Bỏ thinking, gửi lại để xin câu trả lời cuối', 'Báo lỗi vì text không đứng đầu'], answer: 1, explain: 'tool_use là "a yield": "you execute the requested tool, append the result as a block, and recall so Claude can keep going."' },
    { q: 'Vì sao một hàm xử lý duyệt theo type "chạy được với mọi hình dạng câu trả lời"?', options: ['Vì nó chỉ đọc block cuối', 'Vì API luôn trả cùng thứ tự', 'Vì mỗi loại block có nhánh riêng', 'Vì nó bỏ qua mọi block trừ text'], answer: 2, explain: '"Handle text, tool calls, and thinking each in their own branch. And the same handler works no matter what shape the reply takes."' },
    { q: 'Điều "hay gây bất ngờ" về input_tokens là gì?', options: ['Nó không phải cả prompt', 'Nó luôn bằng output_tokens', 'Nó bao gồm cả output', 'Nó không bao giờ bằng 0'], answer: 0, explain: '"That\'s a common surprise, so remember input tokens isn\'t your whole prompt."' },
    { q: 'stop_reason nào KHÔNG thuộc danh sách trong bài?', options: ['pause_turn', 'stop_sequence', 'refusal', 'timeout'], answer: 3, explain: 'Bảy giá trị là end_turn, max_tokens, tool_use, refusal, stop_sequence, model_context_window_exceeded và pause_turn. Không có "timeout".' },
    { q: 'Theo bài học, response handler thường "âm thầm hỏng" vì đâu?', options: ['Vì dùng quá nhiều tool', 'Lấy block theo vị trí, đọc sai stop_reason', 'Vì gửi system prompt quá dài', 'Vì dùng streaming'], answer: 1, explain: '"Indexing blindly or misreading the stop reason is where response handlers quietly break down."' },
    { q: 'Câu chốt cuối bài là gì?', options: ['Luôn đọc stop_details trước tiên', 'Bỏ hết thinking trước khi gửi lại để hội thoại nhẹ hơn và rẻ hơn', 'Gửi lại block nguyên vẹn; kiểm tra refusal trước stop_details', 'Chỉ cần đọc content[0]'], answer: 2, explain: '"Just remember, pass thinking and tool blocks back unchanged, and guard stop details behind a refusal check."' },
  ],
};
