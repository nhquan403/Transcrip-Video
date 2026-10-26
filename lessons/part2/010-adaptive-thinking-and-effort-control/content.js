window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Các model mới xử lý việc "suy nghĩ trước khi trả lời" khác hẳn model cũ.
<strong>Adaptive thinking</strong> là cách hiện tại: bạn bật nó, Claude tự quyết nghĩ khi nào và bao nhiêu.
<strong>Effort</strong> là một núm riêng, nằm ở <code>output_config.effort</code>. Kiểu cũ <strong>budget_tokens</strong> đang bị bỏ dần.
Và quan trọng nhất: hành vi <strong>khác nhau theo từng model</strong>, nên luôn phải nêu tên model.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Adaptive thinking:</strong> dạng hiện tại của extended thinking. Đặt <code>thinking: {type: "adaptive"}</code>, không đưa ngân sách token; Claude tự cân.</li>
  <li><strong>Effort:</strong> mức công sức model bỏ vào câu trả lời: low, medium, high (mặc định), xhigh, max.</li>
  <li><strong>budget_tokens:</strong> kiểu cũ: <code>thinking: {type: "enabled", budget_tokens: N}</code>.</li>
  <li><strong>display:</strong> cách hiện phần suy nghĩ: <code>omitted</code> (ẩn) hoặc <code>summarized</code> (tóm tắt).</li>
  <li><strong>Redacted thinking:</strong> phần suy nghĩ đã mã hóa, trả về khi có nội dung bị lọc; cũng mang signature.</li>
</ul>

<h3>Mặc định khác nhau theo model</h3>
<div class="box">🚗 <strong>Hình dung thế này:</strong> Ba chiếc xe có ba kiểu đèn pha. Xe A phải tự bật đèn. Xe B tự bật, muốn tắt phải gạt công tắc.
Xe C luôn sáng, không tắt được. Hỏi "đèn có bật không?" mà không nói xe nào thì không ai trả lời đúng được.</div>
<ul>
  <li><strong>Opus 4.8 và Opus 4.7:</strong> adaptive là chế độ thinking duy nhất, và <strong>tắt trừ khi bạn bật</strong>. Không gửi trường thinking thì trả lời không có suy luận mở rộng.
  Bật bằng <code>type: adaptive</code>; từ đó Claude tự xen suy nghĩ giữa các lần gọi tool.</li>
  <li><strong>Sonnet 5:</strong> ngược lại, <strong>không gửi thinking thì nó tự chạy adaptive</strong>. Không muốn thì phải gửi <code>type: disabled</code>.</li>
  <li><strong>Fable 5:</strong> <strong>luôn bật</strong>, không có cách tắt.</li>
</ul>

<h3>Effort: đặt đúng chỗ</h3>
<ul>
  <li>Effort tách biệt với việc bật thinking; nó quyết định model làm việc vất vả cỡ nào.</li>
  <li>Lỗi phổ biến nhất: đặt sai chỗ. Effort nằm ở <code>output_config.effort</code>, <strong>không</strong> ở gốc request. Đặt ở gốc là không có tác dụng.</li>
  <li>Giá trị: low, medium, <strong>high (mặc định)</strong>, xhigh, max. <strong>xhigh</strong> có trên Fable 5, Opus 4.8, Opus 4.7 và Sonnet 5.</li>
  <li>Coi effort như núm vặn chỉnh cho từng route.</li>
</ul>

<h3>Adaptive so với kiểu cũ</h3>
<ul>
  <li><strong>Adaptive:</strong> <code>type: adaptive</code>, không có ngân sách cố định. Claude tự định cỡ suy nghĩ theo việc. Đây là đường hiện tại trên các model mới.</li>
  <li><strong>Kiểu cũ:</strong> <code>type: enabled</code> cùng một con số <code>budget_tokens</code>. Trên các model frontier hiện tại, request này trả về <strong>lỗi 400</strong>.</li>
</ul>
<p>Cùng ý định (suy nghĩ trước khi trả lời), nhưng cách diễn đạt cũ bị từ chối. Code còn gửi budget_tokens tới model hiện tại là <strong>bug di chuyển</strong> đang chờ lộ ra.</p>

<h3>Bậc thang budget_tokens</h3>
<ul>
  <li><strong>Fable 5, Sonnet 5, Opus 4.8, Opus 4.7:</strong> trả về 400.</li>
  <li><strong>Opus 4.6:</strong> giai đoạn chuyển tiếp: vẫn chạy như lối thoát đã bị đánh dấu ngừng, trong lúc bạn di chuyển.</li>
  <li><strong>Sonnet 4.5 và Opus 4.5:</strong> không chỉ được phép mà là <strong>cách duy nhất</strong> để bật thinking, vì không có adaptive.</li>
</ul>
<p>Đừng bao giờ nói budget_tokens "chạy" hay "không chạy" mà không nói <strong>model nào</strong>.</p>

<h3>Hiện suy nghĩ và trả tiền là hai chuyện khác nhau</h3>
<p>Trên các model mới nhất (Fable 5, Opus 4.8, Opus 4.7, Sonnet 5), display mặc định là <strong>omitted</strong>: block thinking vẫn được stream nhưng text bên trong rỗng.
Muốn đọc được thì đặt <code>display: summarized</code> để Claude hiện một bản tóm tắt.
<strong>Display chỉ đổi thứ hiện ra, không đổi chi phí</strong>: suy nghĩ bị tính tiền như nhau dù ẩn hay hiện.</p>

<h3>Gửi lại thinking block thế nào?</h3>
<ul>
  <li>Thinking block trong <strong>lượt assistant mới nhất</strong> phải gửi lại <strong>đúng như nhận</strong>, kể cả redacted thinking và signature. Sửa hay bỏ là lời gọi tiếp theo trả 400.</li>
  <li>Các lượt <strong>cũ hơn</strong> dễ tính hơn: bạn có thể bỏ thinking của chúng, nhưng nếu giữ thì giữ nguyên, không sửa.</li>
</ul>

<h3>Thinking cùng tool: chỉ auto hoặc none</h3>
<p>Bình thường có bốn lựa chọn <code>tool_choice</code>. Khi extended thinking đang bật, chỉ <strong>auto</strong> và <strong>none</strong> được phép.
Ép gọi tool bằng <code>any</code> hay chỉ đích danh một tool sẽ bị lỗi. Hãy thiết kế vòng lặp tool dựa vào auto, để Claude tự quyết khi nào gọi,
và không bao giờ sửa thinking nó đưa lại giữa các bước.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Adaptive là đường hiện tại; Opus 4.8/4.7 tắt cho tới khi bạn bật, Sonnet 5 bật sẵn, Fable 5 luôn bật.</li>
  <li>Effort nằm ở output_config.effort; budget_tokens bị từ chối trên model mới.</li>
  <li>Luôn nêu tên model; gửi lại thinking của lượt mới nhất nguyên vẹn; có thinking thì tool_choice chỉ auto hoặc none.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">the change trips up developers</em>: thay đổi làm lập trình viên vấp.</li>
  <li><em class="en">on the way out</em>: đang bị loại bỏ dần.</li>
  <li><em class="en">mid-deprecation</em>: đang giữa quá trình ngừng hỗ trợ.</li>
  <li><em class="en">rejected outright</em>: bị từ chối thẳng.</li>
  <li><em class="en">flips that default</em>: đảo ngược mặc định đó.</li>
  <li><em class="en">Key it at the top level, and it simply won't take</em>: đặt ở cấp gốc thì nó không có tác dụng.</li>
  <li><em class="en">a dial you retune per route</em>: núm vặn chỉnh lại cho từng route.</li>
  <li><em class="en">a migration bug waiting to surface</em>: bug di chuyển đang chờ lộ ra.</li>
  <li><em class="en">escape hatch</em>: lối thoát tạm thời.</li>
  <li><em class="en">flip it to summarized freely</em>: cứ thoải mái chuyển sang summarized.</li>
  <li><em class="en">Prior turns are more forgiving</em>: các lượt cũ dễ tính hơn.</li>
  <li><em class="en">hard require a tool</em>: bắt buộc cứng phải gọi một tool.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson10/Lesson10.java</code>. Có 4 bài: thinking mặc định theo từng model, bậc thang budget_tokens,
kiểm tra một request (effort đặt sai chỗ, xhigh không có, budget_tokens bị từ chối, tắt thinking trên Fable 5, ép tool khi có thinking),
và chuẩn bị lịch sử: giữ nguyên lượt assistant mới nhất, bỏ thinking ở lượt cũ. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-10"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-10 --live"</code>: chương trình bật adaptive thinking với display summarized và effort đặt đúng chỗ,
in từng block (thinking tóm tắt và câu trả lời), rồi gửi thật hai request sai (effort ở gốc, budget_tokens) để bạn thấy model hiện tại phản hồi thế nào.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Adaptive thinking được bật bằng cách nào?', options: ['thinking: {type: "enabled", budget_tokens: 8000}', 'thinking: {type: "adaptive"}', 'effort: "max" ở gốc request', 'stream: true'], answer: 1, explain: '"You set thinking type to adaptive, you don\'t hand it a token budget, and Claude decides when to think and how much."' },
    { q: 'Effort nằm ở đâu trong request?', options: ['Ở gốc request, cạnh model', 'Trong trường thinking', 'Ở output_config.effort', 'Trong header HTTP'], answer: 2, explain: '"It lives at output config.effort, not at the top of your request."' },
    { q: 'Bạn đặt "effort": "high" ở gốc request. Điều gì xảy ra theo bài học?', options: ['Không có tác dụng', 'Effort được áp dụng bình thường', 'Effort được nâng lên max', 'Thinking tự bật'], answer: 0, explain: '"Key it at the top level, and it simply won\'t take."' },
    { q: 'Trên Opus 4.8, bạn không gửi trường thinking. Claude sẽ thế nào?', options: ['Tự chạy adaptive thinking', 'Báo lỗi thiếu trường thinking', 'Chạy thinking với budget mặc định', 'Trả lời không có suy luận mở rộng'], answer: 3, explain: '"On Opus 4.8 and Opus 4.7, adaptive is the only thinking mode, and it\'s off unless you explicitly turn it on."' },
    { q: 'Trên Sonnet 5, không gửi trường thinking thì sao?', options: ['Không có thinking', 'Tự chạy adaptive', 'Báo lỗi 400', 'Chạy budget_tokens mặc định'], answer: 1, explain: '"Sonnet 5 flips that default, omit the thinking field there, and it runs adaptive on its own, so if you don\'t want thinking, you pass thinking type disabled explicitly."' },
    { q: 'Model nào luôn bật thinking và không có cách tắt?', options: ['Opus 4.8', 'Sonnet 5', 'Fable 5', 'Opus 4.6'], answer: 2, explain: '"And Fable 5 is always on with no way to switch it off."' },
    { q: 'Vì sao bài học nhấn mạnh "luôn nêu tên model"?', options: ['Vì hành vi khác nhau tùy model', 'Vì API bắt buộc trường model', 'Vì tên model quyết định giá', 'Vì model mặc định luôn là model rẻ nhất'], answer: 0, explain: '"The default behavior depends entirely on which model you\'re calling, which is exactly why you always name the model."' },
    { q: 'Giá trị effort mặc định là gì?', options: ['low', 'medium', 'max', 'high'], answer: 3, explain: '"The values run from low to medium to high, which is the default, and then up to x high and max."' },
    { q: 'effort "xhigh" có trên những model nào?', options: ['Mọi model đang được hỗ trợ trên Claude API', 'Fable 5, Opus 4.8, Opus 4.7, Sonnet 5', 'Chỉ Opus 4.5 và Sonnet 4.5', 'Chỉ Opus 4.6'], answer: 1, explain: '"That x high setting is available on Fable 5, Opus 4.8, Opus 4.7, and Sonnet 5."' },
    { q: 'Câu nào ĐÚNG về effort và thinking?', options: ['Effort chính là cách bật thinking', 'Đặt effort max thì thinking tự bật', 'Effort là núm riêng', 'Effort chỉ có tác dụng khi tắt thinking'], answer: 2, explain: '"Now the effort control, which is separate from turning thinking on. Effort decides how much work the model puts into a response."' },
    { q: 'Request thinking: {type: "enabled", budget_tokens: 4000} gửi tới Opus 4.7. Kết quả?', options: ['Lỗi 400', 'Chạy bình thường với 4.000 token suy nghĩ', 'Tự đổi sang adaptive', 'Chạy nhưng có cảnh báo'], answer: 0, explain: '"On Fable 5, Sonnet 5, Opus 4.8, and Opus 4.7, budget tokens returns a 400 today."' },
    { q: 'Trên Opus 4.6, budget_tokens ở trạng thái nào?', options: ['Bị từ chối 400', 'Cách duy nhất để bật thinking', 'Chưa từng được hỗ trợ', 'Chuyển tiếp, đã bị đánh dấu ngừng'], answer: 3, explain: '"On Opus 4.6, it\'s transitional, still working as a deprecated escape hatch while you migrate."' },
    { q: 'Trên Sonnet 4.5 và Opus 4.5, budget_tokens là gì?', options: ['Bị từ chối', 'Cách duy nhất để bật thinking', 'Tùy chọn phụ bên cạnh adaptive', 'Không liên quan tới thinking'], answer: 1, explain: '"On Sonnet 4.5 and Opus 4.5, it\'s not just allowed. It\'s the only way to enable thinking, since those models have no adaptive mode."' },
    { q: 'Code cũ vẫn gửi budget_tokens tới model hiện tại. Bài học gọi đó là gì?', options: ['Một tối ưu chi phí', 'Một cấu hình an toàn', 'Bug di chuyển', 'Một tính năng nâng cao'], answer: 2, explain: '"If your code still sends budget tokens to a current model, that\'s a migration bug waiting to surface."' },
    { q: 'Trên các model mới nhất, display của thinking mặc định là gì?', options: ['omitted', 'summarized: luôn hiện bản tóm tắt suy nghĩ', 'full', 'disabled'], answer: 0, explain: '"On the newest models... thinking display defaults to omitted. The thinking blocks still stream. They just come through with empty text."' },
    { q: 'Đặt display: "summarized" thay đổi điều gì về chi phí?', options: ['Rẻ hơn vì chỉ hiện tóm tắt', 'Đắt hơn vì phải tóm tắt', 'Miễn phí phần thinking', 'Không đổi gì'], answer: 3, explain: '"Display only changes what\'s shown to you. It has no effect on cost. The thinking is billed the same either way."' },
    { q: 'Muốn đọc được phần suy nghĩ của Claude trên model mới, bạn làm gì?', options: ['Tăng effort lên max', 'Đặt display: summarized', 'Đặt budget_tokens', 'Tắt streaming để nhận toàn bộ thinking một lần'], answer: 1, explain: '"If you want a readable version, set display to summarized, and Claude surfaces a summary of what it worked through."' },
    { q: 'Thinking block trong lượt assistant MỚI NHẤT phải được gửi lại thế nào?', options: ['Rút gọn còn câu cuối', 'Bỏ signature cho nhẹ', 'Nguyên văn', 'Chuyển thành text block'], answer: 2, explain: '"The thinking blocks in the latest assistant message have to go back to the API exactly as you received them, untouched."' },
    { q: 'Bạn xóa signature khỏi thinking block của lượt assistant mới nhất. Lời gọi tiếp theo trả về gì?', options: ['Lỗi 400', 'Chạy bình thường', 'Cảnh báo nhưng vẫn chạy', 'Một thinking block mới'], answer: 0, explain: '"If you edit or strip a thinking block or its signature in that latest turn, your next call returns a 400."' },
    { q: 'Với thinking ở các lượt assistant CŨ hơn, bạn được phép làm gì?', options: ['Sửa nội dung cho gọn', 'Đổi thứ tự các block', 'Đổi signature mới', 'Bỏ được; giữ thì không sửa'], answer: 3, explain: '"Prior turns are more forgiving. You can drop their thinking, but if you keep it, keep it unmodified."' },
    { q: 'Redacted thinking là gì?', options: ['Thinking bị lỗi định dạng', 'Suy nghĩ đã mã hóa', 'Thinking đã bị người dùng xóa', 'Bản tóm tắt của thinking'], answer: 1, explain: '"That includes redacted thinking, which is encrypted reasoning. Claude returns when some content is filtered. It carries a signature."' },
    { q: 'Khi extended thinking đang bật, tool_choice nào được phép?', options: ['any và tool', 'Cả bốn lựa chọn', 'auto và none', 'Chỉ tool'], answer: 2, explain: '"With extended thinking active, only auto and none are allowed."' },
    { q: 'Bạn bật adaptive thinking và đặt tool_choice: {type: "tool", name: "lookup"}. Kết quả?', options: ['Request bị lỗi', 'Claude buộc gọi lookup', 'Thinking tự tắt', 'Claude bỏ qua tool_choice'], answer: 0, explain: '"If you try to force a call, either with any or by naming a specific tool, the request errors out."' },
    { q: 'Thiết kế vòng lặp tool khi có thinking nên thế nào?', options: ['Dùng tool_choice any cho chắc', 'Tắt thinking ở mỗi bước có tool', 'Sửa thinking cho gọn giữa các bước', 'Dùng auto, không sửa thinking'], answer: 3, explain: '"Plan your tool loop so it leans on auto, lets Claude decide when to call, and never mutates the thinking it hands you back between steps."' },
    { q: 'Trên Opus 4.8 khi đã bật adaptive, Claude làm gì với thinking quanh các lần gọi tool?', options: ['Chỉ nghĩ một lần ở đầu', 'Xen suy nghĩ giữa các lần gọi tool', 'Không nghĩ khi có tool', 'Chỉ nghĩ ở cuối'], answer: 1, explain: '"To get it, you set thinking type to adaptive, and from there Claude interleaves its thinking between tool calls on its own."' },
    { q: 'Gửi thinking: {type: "disabled"} tới Fable 5. Theo bài học, điều này hợp lý không?', options: ['Hợp lý, Fable 5 sẽ tắt thinking', 'Hợp lý, nhưng chỉ khi effort low', 'Không, vì không tắt được', 'Hợp lý nếu không có tool'], answer: 2, explain: '"Fable 5 is always on with no way to switch it off."' },
    { q: 'Request cho Opus 4.8: thinking adaptive, output_config.effort "xhigh", tool_choice auto. Có vấn đề gì không?', options: ['Không có vấn đề', 'xhigh không có trên Opus 4.8', 'tool_choice auto bị cấm khi có thinking', 'Adaptive không có trên Opus 4.8'], answer: 0, explain: 'Adaptive là chế độ của Opus 4.8, xhigh có trên Opus 4.8, effort đặt đúng chỗ, và auto được phép khi có thinking.' },
    { q: 'Trạng thái của budget_tokens trên tổng thể là gì?', options: ['Cách khuyến nghị cho mọi model', 'Mới được thêm vào', 'Thay thế adaptive', 'Kiểu cũ, đang bị bỏ dần'], answer: 3, explain: '"The legacy budget tokens mode. That\'s the older approach, and it\'s mid-deprecation, rejected outright on the newest models."' },
    { q: 'Câu nào ĐÚNG về adaptive so với kiểu cũ?', options: ['Adaptive cần ngân sách token cố định', 'Adaptive để Claude tự định cỡ suy nghĩ', 'Kiểu cũ là đường hiện tại trên model mới', 'Hai kiểu giống hệt nhau, chỉ khác tên'], answer: 1, explain: '"Adaptive is thinking type adaptive with no fixed budget. You hand control to Claude, and it sizes its own reasoning for the task."' },
    { q: 'Câu tổng kết cuối bài là gì?', options: ['Effort nằm ở gốc request, budget_tokens là đường hiện tại', 'Thinking luôn bật trên mọi model', 'Adaptive theo từng model, effort ở output_config, luôn nêu tên model', 'Mọi model đều hỗ trợ budget_tokens'], answer: 2, explain: '"Adaptive thinking is the current model-specific reasoning path. On Opus 4.8 and 4.7, it\'s off until you set it. Effort lives under output config... always name the model in your code."' },
  ],
};
