window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Secret (API key, token, mật khẩu) phải sống trong <strong>kho được bảo vệ</strong>: environment variable, credential store của hệ điều hành, hoặc secret manager.
Nó <strong>không bao giờ</strong> xuất hiện trong code, prompt, CLAUDE.md, log hay ảnh chụp màn hình. Kết hợp <strong>least privilege</strong> và <strong>rotation</strong> để một key bị lộ gần như vô giá trị.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Secret</strong>: bất kỳ credential nào app dùng để xác thực: API key, token, password. Lộ một cái là người khác có thể <strong>hành động như bạn</strong>.</li>
  <li><strong>API key</strong>: chuỗi <strong>sống lâu</strong> chứng minh bạn là ai với một service, mang theo mọi quyền mà <strong>scope</strong> của nó cho phép.</li>
  <li><strong>Rotation</strong>: thay key định kỳ, hoặc <strong>ngay lập tức</strong> khi nghi bị lộ; key cũ ngừng hoạt động.</li>
  <li><strong>Environment variable / secret store</strong>: nơi nạp secret lúc <strong>runtime</strong>.</li>
  <li><strong>OS credential store</strong>: kho credential do hệ điều hành bảo vệ, nơi Claude Code cất credentials.</li>
  <li><strong>apiKeyHelper</strong>: setting của Claude Code trỏ tới một shell script trả về key khi cần, để lấy token ngắn hạn từ vault.</li>
  <li><strong>Least privilege</strong>: mỗi key chỉ có đúng quyền công việc cần.</li>
  <li><strong>Secret scanning</strong>: quét commit để phát hiện key lỡ lọt vào.</li>
</ul>

<h3>Quy tắc số 1: nơi secret "sống" khác nơi nó được "xuất hiện"</h3>
<p>Đây là quy tắc hay bị phá nhất. Secret <strong>không bao giờ</strong> ở nơi người khác có thể đọc hoặc chia sẻ:</p>
<ul>
  <li><strong>Không hard-code</strong> key vào source code, và càng không <strong>commit</strong>: một khi đã vào <strong>git history</strong>, coi như công khai với ai có repo.</li>
  <li>Key cũng <strong>không nằm trong prompt</strong> và <strong>không nằm trong file CLAUDE.md</strong>, vì những file này được chia sẻ và check in.</li>
  <li>Vậy để đâu? Nạp từ <strong>environment variable</strong> hoặc <strong>secret store</strong> lúc runtime.</li>
</ul>
<p>Mô hình tư duy: "secret sống ở đâu" và "secret được phép xuất hiện ở đâu" là <strong>hai câu hỏi riêng</strong>. Câu trả lời cho câu thứ hai là <strong>gần như không ở đâu cả</strong>.</p>
<div class="box">🔑 <strong>Hình dung thế này:</strong> Chìa khoá nhà bạn sống trong <strong>két sắt</strong> có khoá. Bạn không bao giờ dán chìa khoá lên bảng tin chung cư, không chụp ảnh nó đăng nhóm chat, không in nó lên tờ rơi.
Code, prompt, CLAUDE.md, log, screenshot chính là "bảng tin" và "nhóm chat": ai cũng đọc được, nên chìa khoá không được xuất hiện ở đó.</div>

<h3>Claude Code cất credentials ở đâu?</h3>
<p>Claude Code dựa vào <strong>hệ điều hành</strong>, vì OS đã có kho lưu trữ được gia cố cho đúng việc này:</p>
<ul>
  <li><strong>macOS</strong>: vào <strong>Keychain</strong> hệ thống, được mã hoá và OS bảo vệ.</li>
  <li><strong>Linux</strong>: vào một credentials file khoá ở <strong>file mode 0600</strong>, nghĩa là chỉ tài khoản của bạn đọc được.</li>
  <li><strong>Windows</strong>: credentials file nằm trong user profile, mặc định chỉ tài khoản bạn truy cập.</li>
</ul>
<p>Điểm chung: kho được <strong>OS bảo vệ</strong>, <strong>cục bộ, khoá, gắn với bạn</strong>, và <strong>không phải file để commit</strong> lên repo.</p>

<h3>Vì sao key trong prompt là cái bẫy?</h3>
<ul>
  <li>Model có thể <strong>nhắc lại (echo)</strong> key trong output, ví dụ khi tóm tắt cuộc hội thoại, và giờ nó nằm trong một response bạn có thể lưu.</li>
  <li>Prompt <strong>được lưu lại</strong>: transcript và request log ghi toàn bộ văn bản, kể cả secret.</li>
  <li>Ai có quyền đọc log sau này đều <strong>đọc được credential</strong> của bạn.</li>
  <li>Prompt sinh ra để được xử lý, lưu trữ và xem lại, nên quy tắc là <strong>loại secret khỏi context và khỏi log hoàn toàn</strong>.</li>
</ul>

<h3>Key hay đổi: dùng apiKeyHelper</h3>
<ul>
  <li><strong>apiKeyHelper</strong> là một shell script, nhiệm vụ là <strong>trả về key khi cần</strong>.</li>
  <li>Nó cho phép lấy <strong>token ngắn hạn từ vault theo yêu cầu</strong> thay vì ghim một key sống lâu.</li>
  <li>Helper <strong>làm mới theo timer</strong> hoặc <strong>sau khi xác thực thất bại</strong>, nên token hết hạn thì lần gọi sau tự lấy token mới.</li>
  <li>Lợi ích: <strong>rotation xảy ra ở nguồn</strong>. Bạn đổi secret trong vault, code không cần biết, không cần redeploy.</li>
</ul>

<h3>Hai thói quen giảm thiệt hại + vệ sinh hằng ngày</h3>
<ul>
  <li><strong>Least privilege</strong>: key chỉ đọc dữ liệu thì phải là <strong>read-only key</strong>, không kèm quyền xoá hay quản trị. Key làm được ít thì lộ cũng hại ít.</li>
  <li><strong>Rotation</strong>: thay key định kỳ để không có key cũ bị quên nằm đó, và thay <strong>ngay</strong> khi nghi lộ. Key hẹp quyền vừa xoay tuần trước là "chiến lợi phẩm" nhỏ và ngắn hạn.</li>
  <li>Thêm file <strong>.env</strong> vào <strong>.gitignore</strong> để không lỡ tay commit.</li>
  <li>Chạy <strong>secret scanning</strong> trên commit để key lọt qua bị phát hiện sớm.</li>
  <li>Cẩn thận khi chia sẻ: key dán vào log chung, screenshot, tin nhắn chat cũng bị lộ y như trong code.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề hỏi để API key ở đâu → đáp án đúng là <strong>environment variable / OS credential store / secret manager</strong>, không phải code, prompt hay CLAUDE.md.</li>
  <li>Đề hỏi Claude Code lưu credentials thế nào → <strong>OS credential store</strong> (Keychain trên macOS, file 0600 trên Linux).</li>
  <li>Đề có secret <strong>rotate thường xuyên</strong>, không muốn redeploy → <strong>apiKeyHelper</strong> lấy key từ vault.</li>
  <li>Đề hỏi cách hạn chế thiệt hại khi key bị lộ → <strong>least privilege + rotation</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Dán key vào prompt cho Claude dùng cũng được, đằng nào cũng gửi qua HTTPS" → <strong>sai</strong>, key sẽ lộ qua output, transcript và log.</li>
  <li>"Để key trong CLAUDE.md cho tiện" → <strong>sai</strong>, CLAUDE.md được chia sẻ và check in.</li>
  <li>"Lỡ commit key thì xoá dòng đó ở commit sau là xong" → <strong>sai</strong>, nó vẫn nằm trong git history; coi như đã lộ.</li>
  <li>"Một key toàn quyền dùng cho mọi việc cho đơn giản" → <strong>sai</strong>, key rộng quyền là rủi ro lớn; phải scope theo least privilege.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>"Sống trong két, không xuất hiện ở đâu cả"</strong>: hẹp quyền, xoay thường xuyên, để mọi key bị trộm gần như vô giá trị.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
