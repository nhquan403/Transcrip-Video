window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Muốn chặn agent chạy lệnh phá hoại (như <code>rm -rf</code>), đừng chỉ viết một câu "hãy cẩn thận" trong prompt rồi hy vọng model nghe lời.
Hãy dùng <strong>hook</strong>: một đoạn code chạy <strong>ngoài model</strong>, bắn ra <strong>trước khi</strong> tool chạy (<strong>PreToolUse</strong>) và có quyền <strong>chặn</strong> hành động.
Hook đặt trên nền <strong>least privilege</strong> sẽ cho bạn hai lớp bảo vệ độc lập.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Hook</strong>: script <strong>deterministic</strong> (chạy giống hệt nhau mọi lần) đăng ký trong <code>settings.json</code>, chạy tại các mốc cố định trong vòng đời agent, hoàn toàn ngoài model.</li>
  <li><strong>Hooks as guardrails</strong>: dùng hook để <strong>deny</strong> hoặc <strong>ask</strong> một hành động nguy hiểm <strong>trước khi</strong> nó chạy.</li>
  <li><strong>PreToolUse</strong>: sự kiện bắn ra <strong>trước</strong> khi tool chạy; có thể chặn, hỏi người dùng, hoặc <strong>sửa (rewrite)</strong> tham số.</li>
  <li><strong>PostToolUse</strong>: sự kiện bắn ra <strong>sau</strong> khi tool đã chạy; chỉ log, kiểm tra kết quả, kích hoạt việc tiếp theo, <strong>không ngăn được gì</strong>.</li>
  <li><strong>permissionDecision</strong>: trường mà hook PreToolUse trả về, có <strong>4 giá trị</strong>: allow, deny, ask, defer.</li>
  <li><strong>Exit code 2</strong>: lối tắt, hook thoát với mã 2 là chặn lệnh và gửi thông điệp của nó về như lỗi.</li>
  <li><strong>Least privilege</strong>: chỉ cấp cho tool hay identity đúng những quyền thật sự cần, bỏ hết phần còn lại.</li>
  <li><strong>Defense in depth</strong>: nhiều lớp bảo vệ độc lập chồng lên nhau.</li>
</ul>

<h3>Vì sao hook mạnh hơn một câu trong prompt?</h3>
<p>Hook là <strong>code bạn đăng ký</strong>, không phải lời khuyên bạn mong model làm theo. Vì là code thật, nó chạy <strong>y hệt nhau mỗi lần</strong>, bất kể model vừa sinh ra gì ở lượt đó. Đó là ý nghĩa của <strong>deterministic</strong>: kết quả lặp lại được và bạn suy luận về nó một cách tự tin.</p>
<p>Ngược lại, một câu trong system prompt kiểu "hãy cẩn thận với lệnh xoá" thì model <strong>có thể</strong> nghe, cũng có thể không, tuỳ input; dưới áp lực nó có thể hiểu lỏng hoặc bỏ qua. Hook xoá bỏ sự không chắc chắn đó. Nó là <strong>enforcement</strong> (cưỡng chế), và guardrail đúng nghĩa phải là cưỡng chế.</p>
<div class="box">🚪 <strong>Hình dung thế này:</strong> Prompt giống tấm biển "Vui lòng không vào phòng máy chủ" dán trên cửa: người ta có thể đọc, cũng có thể lờ đi.
Hook giống <strong>bảo vệ đứng chặn ở cửa</strong>: ai muốn vào đều bị kiểm tra <strong>trước khi bước qua</strong>. Còn camera ghi hình (PostToolUse) chỉ cho bạn xem lại sau khi kẻ gian đã vào rồi.</div>

<h3>Thời điểm là tất cả: PreToolUse vs PostToolUse</h3>
<ul>
  <li><strong>PreToolUse</strong> chạy <strong>trước</strong> khi tool thực thi. Vì chưa có gì xảy ra, nó có thể <strong>deny</strong>, <strong>ask</strong> người dùng, hoặc <strong>rewrite / sanitize</strong> tham số đang chờ. Đây là <strong>điểm guardrail</strong>.</li>
  <li>PreToolUse là <strong>sự kiện tool duy nhất</strong> có thể sửa tham số trước khi chạy. Nghĩa là nó không chỉ chặn lệnh xấu mà còn có thể <strong>thay bằng phiên bản an toàn hơn</strong>.</li>
  <li><strong>PostToolUse</strong> chạy <strong>sau</strong> khi tool đã chạy: log, kiểm tra kết quả, kích hoạt follow-up. Nhưng nó <strong>quá muộn để ngăn chặn</strong>: file đã bị xoá rồi.</li>
  <li>Quy tắc: mục tiêu là <strong>ngăn chặn</strong> thì dùng <strong>PreToolUse và chỉ PreToolUse</strong>. Gắn kiểm tra an toàn vào sự kiện "sau khi" thì guardrail xuất hiện khi thiệt hại đã xong.</li>
</ul>

<h3>4 giá trị của permissionDecision (không phải 3!)</h3>
<ol>
  <li><strong>allow</strong>: cho lệnh chạy như yêu cầu.</li>
  <li><strong>deny</strong>: chặn hẳn, hành động dừng trước khi chạy.</li>
  <li><strong>ask</strong>: đẩy lên người dùng qua <strong>permission dialog</strong>, để người duyệt.</li>
  <li><strong>defer</strong>: trả quyết định về <strong>luồng permission bình thường</strong>.</li>
</ol>
<p>Người ta hay nhớ allow, deny, ask và <strong>quên defer</strong>. Có <strong>bốn</strong> giá trị, và defer là cái hay làm sai.</p>

<h3>Ví dụ kinh điển: chặn rm -rf</h3>
<ul>
  <li>Agent sắp chạy kiểu <code>rm -rf</code> lên một thư mục quan trọng.</li>
  <li>Một <strong>matcher</strong> thu hẹp hook để nó <strong>chỉ bắn với tool Bash</strong>, không phải soi mọi hành động.</li>
  <li>Hook đọc <strong>lệnh thực tế</strong> và so với các pattern bạn quan tâm, ví dụ xoá đệ quy kiểu force.</li>
  <li>Nếu khớp, hook trả về <strong>deny</strong> kèm <strong>lý do rõ ràng</strong> được hiển thị lại, giải thích vì sao bị chặn.</li>
  <li>Lối tắt: hook <strong>exit code 2</strong> cũng chặn lệnh và chuyển thông điệp của nó thành lỗi, thay vì trả JSON.</li>
  <li>Cách nào thì lệnh cũng bị dừng <strong>trước khi một file nào bị xoá</strong>.</li>
</ul>

<h3>Đừng dựa vào một lớp duy nhất: hook + least privilege</h3>
<p>Hook chặn hành động là tốt, nhưng còn tốt hơn nếu <strong>năng lực nguy hiểm vốn không có</strong> ngay từ đầu. Đó là <strong>least privilege</strong>: bỏ những quyền agent không cần, để nó có ít thứ để thử hơn. Khi đó hook trở thành <strong>lớp thứ hai</strong>, không phải phòng tuyến duy nhất.</p>
<p>Nếu một năng lực vừa <strong>vắng mặt theo thiết kế</strong>, vừa <strong>bị hook chặn</strong> khi có gì đó với tới, kẻ tấn công phải vượt <strong>hai rào chắn độc lập</strong>. Đó là defense in depth thật sự.</p>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề hỏi cách <strong>ngăn</strong> agent chạy lệnh nguy hiểm một cách <strong>chắc chắn</strong> → đáp án đúng là <strong>hook PreToolUse</strong> trả <strong>deny</strong>, không phải thêm câu vào system prompt.</li>
  <li>Đề có lựa chọn PostToolUse để "chặn" xoá file → <strong>sai thời điểm</strong>; PostToolUse chỉ log, chọn <strong>PreToolUse</strong>.</li>
  <li>Đề muốn <strong>sửa</strong> tham số thành bản an toàn trước khi chạy → <strong>PreToolUse</strong> (sự kiện tool duy nhất rewrite được).</li>
  <li>Đề hỏi "permissionDecision có những giá trị nào" → <strong>allow, deny, ask, defer</strong> (đủ 4).</li>
  <li>Đề muốn người duyệt trước một lệnh rủi ro → <strong>ask</strong> (mở permission dialog).</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Viết rõ trong system prompt là đủ để chặn lệnh xoá" → <strong>sai</strong>, prompt là lời khuyên, model có thể bỏ qua; hook mới là cưỡng chế.</li>
  <li>"PostToolUse cũng chặn được, chỉ là chạy sau" → <strong>sai</strong>, chạy sau nghĩa là hành động đã xảy ra, không ngăn được gì.</li>
  <li>"permissionDecision có 3 giá trị allow/deny/ask" → <strong>sai</strong>, còn <strong>defer</strong>.</li>
  <li>"Có hook rồi thì cứ cấp agent toàn quyền" → <strong>sai</strong>, hook nên là lớp thứ hai trên nền <strong>least privilege</strong>.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>"Pre thì chặn, Post thì chép"</strong>, và quyết định có <strong>4 cửa: Allow, Deny, Ask, Defer</strong>.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
