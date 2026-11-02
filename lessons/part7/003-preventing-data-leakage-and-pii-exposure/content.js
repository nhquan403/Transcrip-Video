window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Dữ liệu nhạy cảm không chỉ rò qua câu trả lời của Claude. Nó còn rò qua <strong>tool arguments, logs, error messages</strong>, và qua <strong>context dùng chung giữa các user</strong>.
Cách thắng là kiểm soát cả vòng đời: <strong>thu ít, redact ngay khi vào, giới hạn quyền, log sạch, chặn egress</strong>. Lọc output chỉ là lưới cuối.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Leakage paths</strong>: mọi đường dữ liệu nhạy cảm có thể thoát ra, không chỉ câu trả lời của model.</li>
  <li><strong>Shared context bleed</strong>: dữ liệu của user này hiện ra trong session của user khác vì context không được tách.</li>
  <li><strong>Sensitive information disclosure</strong>: lộ ngoài ý muốn dữ liệu cá nhân, credentials, hay dữ liệu kinh doanh mật, qua response hoặc qua hệ thống xung quanh.</li>
  <li><strong>PII</strong>: thông tin định danh cá nhân, ví dụ email, số điện thoại.</li>
  <li><strong>Redact / tokenize</strong>: che giá trị thật, hoặc thay bằng placeholder để model vẫn làm việc được với "bản thế chỗ".</li>
  <li><strong>Input minimization</strong>: giảm và redact dữ liệu trước khi vào prompt; là <strong>phòng tuyến chính</strong>.</li>
  <li><strong>Output filtering</strong>: quét response tìm giá trị nhạy cảm trước khi gửi ra; chỉ là <strong>backstop</strong>.</li>
  <li><strong>Egress control</strong>: quy định app được gửi dữ liệu đi đâu, chặn mọi chỗ còn lại.</li>
</ul>

<h3>Rò qua "đường ống", không phải qua câu trả lời</h3>
<div class="box">🚰 <strong>Hình dung thế này:</strong> Nhà bạn bị rò nước. Ai cũng nhìn vòi nước (câu trả lời), nhưng nước thật ra đang rỉ từ <strong>ống ngầm trong tường</strong>: tool arguments, logs, error messages. Muốn hết rò, phải lần theo cả đường ống chứ không chỉ khoá vòi.</div>
<ul>
  <li><strong>Tool arguments</strong>: truyền PII thô làm tham số → dữ liệu đi tới một service vốn không cần thấy nó, và giờ nằm cả trong log của hệ thống thứ hai.</li>
  <li><strong>Logs và traces</strong>: debug output ghi đầy đủ prompt và tool payload mang dữ liệu nhạy cảm đi xa hơn task, và log thì <strong>sống lâu</strong>.</li>
  <li><strong>Error messages</strong>: stack trace hay chuỗi lỗi có thể lộ giá trị lẽ ra phải ở trong hệ thống, đôi khi ngay trước mắt user.</li>
</ul>
<p>Thói quen nên luyện: <strong>lần theo một field</strong>, ví dụ một địa chỉ email, đi qua prompt, vào từng tool call, log line, error handler. Chỗ nào nó xuất hiện làm bạn bất ngờ, chỗ đó là leakage path.</p>

<h3>Shared context bleed: sửa bằng thiết kế</h3>
<ul>
  <li>Cách ly giữa user được bảo đảm bởi <strong>per-user session</strong> và lớp <strong>identity / authorization</strong>.</li>
  <li>Quy tắc cứng: <strong>không bao giờ dùng lại một context window cho nhiều user khác nhau</strong>.</li>
  <li><strong>Subagent</strong> giải bài toán khác, nhỏ hơn: trong <strong>một</strong> session, giao subtask cho subagent giữ dữ liệu subtask trong cửa sổ riêng, giảm rò lẫn bên trong session. Đó là <strong>context hygiene</strong>, không phải cơ chế tách user.</li>
</ul>

<h3>Bảo vệ PII theo vòng đời: kiểm soát càng sớm càng tốt</h3>
<ol>
  <li><strong>Thu ít</strong>: chỉ đưa vào dữ liệu cá nhân mà task thật sự cần.</li>
  <li><strong>Redact hoặc tokenize khi vào</strong>: model suy luận trên placeholder thay vì dữ liệu thật.</li>
  <li><strong>Giới hạn truy cập</strong> bằng least privilege: chỉ người và thành phần thật sự cần mới chạm được.</li>
</ol>
<p>Thứ tự: <strong>giảm thứ thu → biến đổi thứ còn lại → khoá ai được chạm</strong>. Mỗi bước là ít thứ để rò hơn.</p>
<ul>
  <li><strong>Logging</strong>: strip hoặc mask PII trước khi vào log; giữ <strong>raw prompt và full tool payload ngoài persistent log</strong>. Log chỉ cần đủ để debug: <strong>identifiers, timings, outcomes</strong>, không phải nội dung nhạy cảm.</li>
  <li><strong>Input minimization vs output filtering</strong>: dữ liệu chưa từng vào context thì không thể rò sau đó. Sai lầm hay gặp là dựa hết vào lọc output trong khi đổ PII thô vào prompt.</li>
  <li><strong>Egress</strong>: dữ liệu có thể đi ra qua <strong>kênh hợp lệ</strong> (API endpoint được duyệt, domain được phép) vì trông như traffic bình thường, và kiểm tra ở lớp model không thấy được dữ liệu lặng lẽ đi qua tool call. Control phải nằm ở <strong>môi trường</strong>: quy định nơi được gửi, chặn phần còn lại, áp least privilege cho outbound.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có user A thấy dữ liệu user B → đáp án: <strong>per-user session</strong>, không dùng chung context window (không phải "dùng subagent").</li>
  <li>Đề có PII xuất hiện trong <strong>log, trace, stack trace</strong> → mask trước khi log, chỉ log identifiers, timings, outcomes.</li>
  <li>Đề hỏi phòng tuyến <strong>chính</strong> chống rò PII → <strong>input minimization + redact/tokenize</strong>; lọc output chỉ là backstop.</li>
  <li>Đề có dữ liệu thoát qua <strong>endpoint hợp lệ</strong> → <strong>egress control</strong> ở môi trường.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Chỉ cần lọc câu trả lời của model là đủ" → <strong>sai</strong>, dữ liệu còn rò qua tool args, log, error, và lọc output chỉ là lưới cuối.</li>
  <li>"Subagent là cách tách dữ liệu giữa các user" → <strong>sai</strong>, tách user là việc của per-user session và identity/authorization.</li>
  <li>"Log đầy đủ prompt để debug cho dễ" → <strong>sai</strong>, log sống lâu và mang dữ liệu đi quá xa.</li>
  <li>"Domain được phép thì an toàn" → <strong>sai</strong>, kênh hợp lệ vẫn có thể thành đường exfiltration.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Thứ không vào thì không thể ra.</strong> Thu ít → che khi vào → khoá quyền → log sạch → chặn cửa ra; lọc output đứng cuối cùng.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
