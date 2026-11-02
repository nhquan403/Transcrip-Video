window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Safety có sẵn của Claude chỉ là <strong>cái sàn</strong>, không phải <strong>content policy</strong> riêng của sản phẩm bạn. Một dòng trong system prompt là <strong>xác suất</strong>, có thể bị nói vòng qua.
Vì vậy bạn xếp ba lớp: <strong>input screening, output checks, code-level enforcement</strong>, để một lớp hỏng thì lớp sau bắt được.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Content policy</strong>: bộ luật app của bạn tự định nghĩa về thứ nó sẽ và không tạo ra hay hành động; thực thi bằng safety của model + guardrail của bạn.</li>
  <li><strong>Guardrail layering</strong>: đặt control ở nhiều điểm (input, output, code) để không một lỗi đơn lẻ nào làm lộ hệ thống.</li>
  <li><strong>Defense in depth</strong>: nguyên tắc chồng các control lên nhau, lớp này bị vượt thì lớp kế bắt.</li>
  <li><strong>Input screening</strong>: screen hoặc delimit nội dung trước khi tới model, dù từ user hay từ tool result.</li>
  <li><strong>Output checks</strong>: kiểm tra response trước khi đưa cho user hoặc chuyển cho tool phía sau.</li>
  <li><strong>Code-level enforcement</strong>: thực thi policy trong code của app, để luật vẫn đứng vững khi model bị vượt. Đây là lớp hay bị quên.</li>
  <li><strong>Over-refusal</strong>: từ chối nhầm cả yêu cầu hợp lệ; tăng nhẹ khi thêm classifier.</li>
</ul>

<h3>Safety của model ≠ content policy của bạn</h3>
<p>Claude có safety thật: được train để từ chối yêu cầu có hại nói chung. Nhưng Claude <strong>không thể biết luật riêng</strong> của deployment của bạn: có thể app không bao giờ được đưa <strong>liều dùng thuốc</strong>, không đụng <strong>thông tin thanh toán</strong> của khách, hoặc không bàn về <strong>đối thủ</strong>. Đó là luật riêng của ứng dụng, chỉ bạn định nghĩa được, và thực thi nó là <strong>việc guardrail của developer</strong>.</p>
<p>Tại sao không viết một luật thật mạnh vào system prompt là xong? Vì guardrail ở mức prompt là <strong>probabilistic</strong>: user quyết tâm có thể diễn đạt lại để lách, nội dung bị inject có thể ghi đè. Model "thường" làm theo, nhưng <strong>thường không phải luôn luôn</strong>. Với sở thích ít rủi ro thì ổn; với ràng buộc rủi ro cao (gây hại thật, vi phạm compliance) thì không đủ.</p>

<h3>Ba lớp bạn sẽ thật sự xây</h3>
<div class="box">✈️ <strong>Hình dung thế này:</strong> Sân bay có <strong>soi hành lý trước khi lên máy bay</strong> (input screening), <strong>kiểm tra lại ở cửa ra</strong> (output checks), và <strong>cửa buồng lái khoá cứng</strong> (code-level enforcement). Dù có người lọt qua hai trạm đầu, cánh cửa khoá vẫn không mở chỉ vì ai đó nói khéo.</div>
<ul>
  <li><strong>Input side</strong>: chạy input qua <strong>classifier nhẹ</strong> tìm mẫu thù địch (câu jailbreak đã biết, injection lộ liễu); <strong>delimit</strong> nội dung không tin cậy để model đọc nó như data; fail thì <strong>reject hoặc sanitize</strong>. Input xấu không tới model thì model không có cơ hội hành động theo.</li>
  <li><strong>Output side</strong>, ba thói quen:
    <ol>
      <li><strong>Validate trước khi release</strong>: so response với policy, chặn thứ bị cấm; lớp cuối trước khi nội dung rời hệ thống.</li>
      <li><strong>Screen trước tool phía sau</strong>: trong agent, response thường kích hoạt tool call hay action thật (chuyển tiền, xoá file), nên validate trước khi nó "nổ".</li>
      <li><strong>Monitor liên tục</strong>: log và review output theo thời gian, tìm dấu hiệu bị tấn công, đưa bài học ngược vào prompt và filter.</li>
    </ol>
  </li>
  <li><strong>Code-level enforcement</strong>: luật nằm trong code của bạn, vẫn giữ kể cả khi model bị vượt.</li>
</ul>

<h3>Thiếu một lớp thì sao? Ví dụ postmortem</h3>
<p>Bộ chuẩn tham khảo (từ bài jailbreak): <strong>system prompt gia cố</strong>, <strong>harmlessness screen hạng Haiku</strong> trên input, và <strong>screen tool output</strong>. Một app thông tin sức khoẻ làm đủ hai lớp đầu nhưng <strong>bỏ screen tool output</strong>. Một tài liệu được retrieve mang chỉ thị bị inject; không ai kiểm tra thứ tool trả về, nên model chuyển tiếp <strong>lời khuyên liều dùng cụ thể</strong> mà policy cấm. Prompt giữ, input screen giữ; sự cố đi qua đúng <strong>lớp không có mặt</strong>.</p>

<h3>Đánh đổi: layering không miễn phí</h3>
<ul>
  <li><strong>Lợi</strong>: classifier input và output xếp lớp lọc được <strong>phần lớn</strong> jailbreak; nghiên cứu của Anthropic cho thấy cách xếp classifier này giảm mạnh jailbreak thành công.</li>
  <li><strong>Chi phí</strong>: thêm <strong>compute overhead</strong> cho mỗi request, tăng nhẹ <strong>over-refusal</strong>, và vẫn không chặn mọi jailbreak.</li>
  <li>Mục tiêu không phải hoàn hảo, mà là chồng đủ lớp "đủ tốt" để vượt qua <strong>tất cả cùng lúc</strong> là rất khó.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có luật riêng của sản phẩm (không tư vấn liều thuốc, không bàn đối thủ) → đáp án: <strong>guardrail của developer</strong>, không trông vào safety có sẵn của model.</li>
  <li>Đề hỏi "một dòng system prompt có đủ cho ràng buộc rủi ro cao không" → <strong>không</strong>, cần layering.</li>
  <li>Đề kể một sự cố lọt qua và hỏi nguyên nhân → tìm <strong>lớp bị bỏ</strong> (thường là screen tool output).</li>
  <li>Đề có agent sắp thực hiện action thật → <strong>validate output trước khi tool chạy</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Claude đã có safety nên không cần content policy riêng" → <strong>sai</strong>, safety là sàn, không biết luật riêng của bạn.</li>
  <li>"Một câu prompt thật mạnh là đủ" → <strong>sai</strong>, prompt là xác suất, có thể bị lách hoặc bị inject ghi đè.</li>
  <li>"Thêm classifier không có nhược điểm" → <strong>sai</strong>, có compute overhead và over-refusal tăng nhẹ.</li>
  <li>"Layering chặn được 100% jailbreak" → <strong>sai</strong>, mục tiêu là làm vượt mọi lớp cùng lúc rất khó, không phải hoàn hảo.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Soi đầu vào, kiểm đầu ra, khoá trong code.</strong> Lớp nào bị bỏ qua thì sự cố sẽ đi qua đúng chỗ đó.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
