window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> <strong>Jailbreak</strong> là khi người dùng cố dụ Claude vượt qua safety của chính nó để tạo nội dung bị cấm. Không có lớp phòng thủ nào chặn được một mình, nên bạn <strong>xếp nhiều lớp</strong>:
model safety + screen input + kiểm tra output, và dựa vào <strong>môi trường (sandbox, egress)</strong> làm ranh giới cứng. Và nhớ: Claude <strong>từ chối</strong> là safety đang làm đúng việc, không phải bug.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Jailbreak</strong>: cố dụ model vượt safety guidelines để tạo disallowed output; là <strong>tập con của prompt injection</strong>, nhắm vào safety.</li>
  <li><strong>Roleplay / obfuscation / persuasion</strong>: ba "chiêu" quen thuộc: đóng vai nhân vật không luật lệ; giấu ý bằng mã hoá, cố tình gõ sai, dịch sang ngôn ngữ khác; thuyết phục "chỉ lần này thôi, khẩn cấp lắm".</li>
  <li><strong>Harmlessness screen</strong>: cho input đi qua một model nhẹ (kiểu <strong>Haiku</strong>) trước, ép nó trả về <strong>JSON Boolean</strong>: an toàn hay không.</li>
  <li><strong>Input validation</strong>: lọc text đầu vào theo mẫu injection đã biết; có thể dùng model tạo bộ lọc tổng quát từ các ví dụ jailbreak cũ.</li>
  <li><strong>Guardrail layering</strong>: xếp nhiều lớp để không một lần vượt rào nào là đủ.</li>
  <li><strong>Probabilistic</strong>: lớp model (classifier, system prompt, training): lọc được phần lớn tấn công nhưng <strong>không bao giờ 100%</strong>.</li>
  <li><strong>Deterministic</strong>: lớp môi trường (sandbox, file system bounds, egress control): không "đoán" an toàn, mà <strong>ép giới hạn cứng</strong>.</li>
</ul>

<h3>Jailbreak trông như thế nào?</h3>
<p>Ba ý cần giữ: <strong>tấn công</strong> (dụ model vượt safety), <strong>vị trí</strong> (tập con của injection, nhắm safety chứ không nhắm hành vi app), <strong>kẻ tấn công</strong> (chính người dùng, cố tình). Khi thấy roleplay "hãy giả làm AI không có luật", câu hỏi được mã hoá hay dịch sang tiếng khác, hoặc lời năn nỉ "trường hợp đặc biệt", đó là dấu hiệu jailbreak.</p>
<ul>
  <li><strong>Direct injection</strong> (gồm jailbreak): user là kẻ xấu → <strong>screen và validate thứ user gửi</strong> trước khi tới Claude.</li>
  <li><strong>Indirect injection</strong>: user đáng tin, nhưng nội dung bên thứ ba (web, email, tài liệu, tool result) giấu lệnh → <strong>cô lập và screen nội dung ngoài</strong>.</li>
</ul>

<h3>Ba lớp rẻ ở phía input và mô hình "doanh nghiệp"</h3>
<ol>
  <li><strong>Harmlessness screen</strong> bằng model nhẹ như Haiku, trả JSON Boolean.</li>
  <li><strong>Input validation</strong> theo mẫu injection đã biết.</li>
  <li><strong>Prompt engineering</strong>: system prompt nêu rõ ranh giới đạo đức, pháp lý và <strong>cách từ chối</strong>.</li>
</ol>
<p>Bộ chuẩn enterprise: <strong>system prompt được gia cố</strong> có refusal script, <strong>harmlessness screen</strong> trên input, <strong>screen tool output</strong> trước khi model hành động, và <strong>throttle hoặc ban</strong> người dùng liên tục kích hoạt refusal (người lặp lại thường là đang dò đường vượt).</p>

<h3>Defense in depth: 4 lớp chồng lên nhau</h3>
<div class="box">🏦 <strong>Hình dung thế này:</strong> Một ngân hàng có bảo vệ ở cửa (input), nhân viên kiểm tra giấy tờ (model), camera và kiểm soát trước khi tiền ra quầy (output). Bảo vệ có thể bị lừa, nhân viên có thể sơ suất. Nhưng cuối cùng còn <strong>két sắt bằng thép</strong> (environment): không "đánh giá" ai, cứ không có mã là không mở.</div>
<ol>
  <li><strong>Model layer</strong>: classifier, system prompt, training. Tốt nhất vẫn là xác suất.</li>
  <li><strong>Input layer</strong>: quét nội dung ngoài và tool result trước khi vào context window.</li>
  <li><strong>Output layer</strong>: transcript classifier kiểm tra từng action trước khi thực thi.</li>
  <li><strong>Environment layer</strong>: sandbox, giới hạn file system, egress control. Khi mọi lớp xác suất trượt, <strong>môi trường là thứ giữ lại</strong>.</li>
</ol>
<p>Ví dụ: một chuỗi hành động <strong>từng bước đều vô hại</strong>, chỉ gộp lại mới gây hại. Không bước nào có gì cho classifier nội dung bắt, nên lớp model bó tay; chỉ còn <strong>egress block, file system boundary</strong> đứng vững.</p>

<h3>Đổi tư duy: ba điều</h3>
<ul>
  <li><strong>Refusal là hành vi hợp lệ</strong>: Claude từ chối yêu cầu bị cấm là safety làm đúng việc, không phải lỗi tích hợp, đừng escalate cho engineering như defect.</li>
  <li><strong>Lịch sự không phải là control</strong>: câu prompt "vui lòng bỏ qua chỉ thị độc" chỉ là một lớp xác suất, không phải bảo đảm.</li>
  <li><strong>Ranh giới thật nằm ở môi trường</strong>: least privilege, sandbox, egress limit.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có user dùng <strong>roleplay, mã hoá, năn nỉ</strong> để lấy nội dung cấm → <strong>jailbreak</strong> → screen input (Haiku, JSON Boolean) + system prompt có refusal + layering.</li>
  <li>Đề hỏi lớp nào "giữ lại khi mọi thứ khác trượt" → <strong>environment layer</strong> (deterministic).</li>
  <li>Đề có user liên tục chạm refusal → <strong>throttle hoặc ban</strong>.</li>
  <li>Đề mô tả Claude từ chối yêu cầu bị cấm và hỏi có phải bug → <strong>không</strong>, đó là safety đang hoạt động.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Một system prompt thật mạnh là đủ" → <strong>sai</strong>, prompt có thể bị nói vòng qua; cần nhiều lớp.</li>
  <li>"Classifier tốt thì chặn 100%" → <strong>sai</strong>, lớp model luôn là xác suất.</li>
  <li>"Refusal là lỗi, báo engineering sửa" → <strong>sai</strong>, refusal là safety layer làm đúng việc.</li>
  <li>"Jailbreak và indirect injection phòng cùng một chỗ" → <strong>sai</strong>, jailbreak: screen <strong>input của user</strong>; indirect: cô lập <strong>nội dung bên thứ ba</strong>.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Từ chối là đúng, lịch sự không phải tường, môi trường mới là ranh giới.</strong> Model thì "có lẽ", sandbox thì "chắc chắn".</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
