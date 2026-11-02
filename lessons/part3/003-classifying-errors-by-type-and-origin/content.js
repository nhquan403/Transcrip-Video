window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Trước khi sửa lỗi, phải <strong>gọi đúng tên lỗi</strong> theo hai góc nhìn: <strong>type</strong> (thử lại có hết không: transient hay permanent) và <strong>origin</strong> (lỗi nằm ở đâu: integration hay model output).
Không phân loại thì không chọn được cách khắc phục. Và nhớ: <strong>HTTP 200 không có nghĩa là đúng</strong>.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Error type identification</strong>: bước chẩn đoán, xếp loại lỗi trước khi động tay sửa; bước này quyết định cách khắc phục.</li>
  <li><strong>Transient error</strong> (lỗi tạm thời): timeout, rate limit, lỗi mạng, lỗi 5xx; dự kiến tự hết, nên retry là hợp lý.</li>
  <li><strong>Permanent error</strong> (lỗi cố định): bad request, sai credentials; retry bao nhiêu cũng không hết, cần sửa, fallback hoặc escalation.</li>
  <li><strong>Model output error</strong>: lỗi trong thứ Claude sinh ra, đi kèm <strong>HTTP 200</strong>.</li>
  <li><strong>Integration error</strong>: lỗi ở code bao quanh (request, auth, endpoint, cách xử lý reply), thường hiện thành HTTP status.</li>
  <li><strong>Silent failure</strong>: 200, không exception, nhưng nội dung sai, thiếu hoặc bị cắt.</li>
  <li><strong>request ID</strong>: mã định danh request, có trong body lỗi và header; luôn lưu lại để mở ticket hỗ trợ.</li>
  <li><strong>Refusal</strong>: Claude cố ý từ chối vì chính sách/an toàn, là hành vi hợp lệ, không phải bug.</li>
</ul>

<h3>Góc nhìn 1: type, thử lại có giúp được không?</h3>
<div class="box">☎️ <strong>Hình dung thế này:</strong> Bạn gọi điện cho một người. <strong>Máy bận</strong> (transient): số đúng, chỉ là sai thời điểm, gọi lại lát nữa là được. <strong>Số không tồn tại</strong> (permanent): gọi trăm lần vẫn vậy, phải kiểm tra lại số. Câu hỏi then chốt: <strong>chờ rồi thử lại có thể giúp không?</strong> Có → transient. Không → phải thay đổi gì đó trước.</div>
<ul>
  <li><strong>Transient</strong>: request vẫn đúng định dạng, hệ thống chỉ tạm không sẵn sàng. Dấu hiệu: <strong>429</strong> (gửi quá giới hạn trong lúc này), <strong>500</strong> (lỗi phía server), <strong>504</strong> (timeout), <strong>529 overloaded</strong> (nền tảng tạm quá tải với mọi người dùng). Không lỗi nào trách payload của bạn → kiên nhẫn, chờ chút, thử lại.</li>
  <li><strong>Permanent</strong>: lỗi nằm trong request. <strong>400</strong> payload hỏng (thiếu field, giá trị sai); <strong>401</strong> key sai, bị thu hồi hoặc hết hạn; <strong>403</strong>; <strong>404</strong>; <strong>413</strong> request quá lớn (Messages API giới hạn một request ở <strong>32 MB</strong>). Cách sửa: thay đổi rồi gửi bản đã sửa.</li>
</ul>

<h3>Đọc body lỗi: ba field quan trọng</h3>
<ul>
  <li><strong>type</strong>: nhãn ổn định, máy đọc được (vd <code>authentication_error</code>, <code>overloaded_error</code>). <strong>Code nên rẽ nhánh theo field này.</strong></li>
  <li><strong>message</strong>: câu mô tả cho người đọc, tốt để log, nhưng <strong>đừng viết logic parse câu chữ</strong> vì nó có thể đổi.</li>
  <li><strong>request ID</strong>: cũng có trong response header; luôn lưu, vì khi mở ticket hỗ trợ, chuỗi này giúp tìm đúng request của bạn.</li>
</ul>

<h3>Góc nhìn 2: origin, lỗi đến từ đâu?</h3>
<ul>
  <li><strong>Model output error</strong>: kế hoạch sai, tool argument sai, câu trả lời bị cắt. Nằm <strong>bên trong response 200</strong>: lời gọi thành công, phần sinh ra mới là vấn đề.</li>
  <li><strong>Integration error</strong>: nằm trong code của bạn (request, auth, endpoint), thường hiện thành <strong>HTTP status</strong>.</li>
  <li>Lưu ý khi <strong>streaming</strong>: lỗi có thể tới <strong>sau 200</strong> dưới dạng một event trong stream. Chỉ kiểm tra status code thì sẽ bỏ sót.</li>
</ul>

<h3>Silent failure và refusal: hai thứ giả dạng "không có câu trả lời"</h3>
<ul>
  <li><strong>Silent failure</strong>: 200, không exception, nội dung lặng lẽ sai: thiếu, hỏng định dạng, <strong>stop_reason là max_tokens</strong> (bị cắt giữa chừng), hoặc parse đúng schema nhưng giá trị sai. Try/except và kiểm tra status đều không bắt được. Cách duy nhất: <strong>validate chính output</strong> (đầy đủ, hợp lý, đúng cấu trúc) trước khi phần sau tin nó.</li>
  <li><strong>Refusal</strong>: Claude cố ý từ chối vì chính sách hoặc an toàn. Đọc <strong>stop_details</strong> để biết lý do; nếu request hợp lệ thì điều chỉnh cách hỏi.</li>
  <li><strong>Bug</strong>: lỗi ngoài ý muốn, ở integration hoặc model output, cần sửa thật. Coi refusal là lỗi hệ thống, hay bỏ qua bug như một lần từ chối bình thường, đều dẫn sai hướng.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có <strong>429, 500, 504, 529, timeout</strong> → <strong>transient</strong>, chờ rồi thử lại.</li>
  <li>Đề có <strong>400, 401, 403, 404, 413</strong> → <strong>permanent</strong>, sửa request rồi mới gửi.</li>
  <li>Đề hỏi "code nên rẽ nhánh theo gì" → field <strong>type</strong>, không phải <strong>message</strong>; "cần gì để mở ticket" → <strong>request ID</strong>.</li>
  <li>Đề có "200 nhưng kết quả sai/thiếu, stop_reason max_tokens" → <strong>silent failure</strong>, cần <strong>validate output</strong>.</li>
  <li>Đề có "streaming, status 200 nhưng vẫn lỗi" → lỗi tới dưới dạng <strong>event trong stream</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Có lỗi là retry trước đã" → <strong>sai</strong>, phải phân loại trước; retry lỗi permanent chỉ làm chậm việc sửa.</li>
  <li>"Status 200 nghĩa là thành công và đúng" → <strong>sai</strong>, có silent failure và lỗi trong stream.</li>
  <li>"Parse câu message để quyết định xử lý" → <strong>sai</strong>, message có thể đổi; rẽ nhánh theo type.</li>
  <li>"Refusal là bug hệ thống, cần escalate" → <strong>sai</strong>, đó là hành vi hợp lệ; đọc stop_details và điều chỉnh cách hỏi.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Máy bận thì gọi lại, sai số thì sửa số.</strong> Transient tự hết, permanent cần thay đổi, model output đi kèm 200, integration hiện thành status.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
