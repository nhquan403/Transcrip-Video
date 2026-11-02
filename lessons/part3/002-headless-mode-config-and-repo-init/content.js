window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Muốn Claude Code chạy trong script, CI/CD hay cron job thì dùng <strong>headless mode</strong> với cờ <strong>-p</strong> (print): nhận prompt, chạy hết, in kết quả ra <strong>stdout</strong> rồi thoát.
Khi bỏ bước hỏi duyệt từng hành động, <strong>guardrail không biến mất mà chuyển chỗ</strong>: sang permissions trong settings.json và hooks.
Hướng dẫn nằm ở <strong>CLAUDE.md</strong> (gợi ý), còn sự cưỡng chế nằm ở <strong>settings.json</strong>.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Headless mode</strong>: chạy Claude Code không tương tác với cờ <strong>-p</strong>, chạy xong thì in kết quả và thoát.</li>
  <li><strong>Interactive mode</strong>: chế độ mặc định, làm việc từng lượt và duyệt hành động khi Claude đề xuất.</li>
  <li><strong>Output format</strong>: <strong>text</strong> (mặc định), <strong>json</strong> (object có kết quả, session ID, token usage, tổng chi phí), <strong>stream-json</strong> (sự kiện JSON từng dòng, phát ra trong lúc chạy).</li>
  <li><strong>Permission mode</strong>: mức Claude được tự làm mà không hỏi; có 6 mode, cần biết 4: <strong>default</strong>, <strong>acceptEdits</strong>, <strong>plan</strong>, <strong>dontAsk</strong>.</li>
  <li><strong>settings.json</strong>: file JSON chứa permissions, hooks, biến môi trường; xếp lớp user, project, local.</li>
  <li><strong>settings.local.json</strong>: tuỳ chỉnh cá nhân, <strong>không</strong> commit vào version control.</li>
  <li><strong>CLAUDE.md</strong>: hướng dẫn markdown nạp vào context đầu mỗi session, ghép nối theo thứ tự phạm vi.</li>
  <li><strong>/init</strong>: quét codebase và soạn sẵn một CLAUDE.md nháp.</li>
</ul>

<h3>Headless mode giải quyết vấn đề gì?</h3>
<ul>
  <li>Tự động hoá cần một lệnh <strong>tự chạy xong</strong>, không ai ngồi gõ phím. Cờ <strong>-p</strong> làm đúng việc đó, như một công cụ dòng lệnh bình thường.</li>
  <li>Nó còn <strong>đọc stdin</strong>: bạn có thể pipe một file vào và redirect output đi chỗ khác.</li>
  <li><strong>Bẫy</strong>: quên cờ -p thì Claude Code mở session tương tác và <strong>chờ bạn gõ</strong>. Trong CI/CD hay cron job, job sẽ <strong>treo mãi</strong>.</li>
</ul>
<div class="box">🚕 <strong>Hình dung thế này:</strong> <strong>Interactive</strong> giống bạn ngồi cạnh tài xế, chỉ đường từng ngã rẽ. <strong>Headless</strong> giống gửi hàng qua dịch vụ giao hàng: đưa địa chỉ một lần, họ tự đi tới nơi rồi báo "đã giao". Có người theo dõi thì ngồi cạnh tài xế; máy chạy lúc 3 giờ sáng thì gửi giao hàng.</div>

<h3>Ba kiểu output khi chạy headless</h3>
<ul>
  <li><strong>text</strong> (mặc định): một khối chữ in ra khi chạy xong.</li>
  <li><strong>json</strong>: object có cấu trúc gồm kết quả, <strong>session ID</strong>, <strong>token usage</strong>, <strong>tổng chi phí</strong>; hợp khi script cần parse kết quả.</li>
  <li><strong>stream-json</strong>: phát các sự kiện JSON <strong>mỗi dòng một sự kiện</strong> ngay trong lúc làm việc. Đi cặp với streaming input, là đường mặc định và được khuyến nghị trong Agent SDK. Job chạy lâu thì caller hiển thị được tiến độ live.</li>
</ul>

<h3>Permission mode: khớp mode với rủi ro</h3>
<ul>
  <li><strong>default</strong> (CLI hiện là "manual"): hỏi trước khi sửa file hay chạy tool. Giám sát tối đa nhưng dừng liên tục, không hợp tự động hoá.</li>
  <li><strong>acceptEdits</strong>: tự áp dụng sửa file và các lệnh file system thông dụng; lệnh shell ngoài nhóm tin cậy đó vẫn hỏi.</li>
  <li><strong>plan</strong>: đề xuất hành động trước, chờ bạn đồng ý; review trước khi làm.</li>
  <li><strong>dontAsk</strong>: mode được tài liệu hoá cho chạy <strong>unattended/CI</strong>: chỉ tool đã pre-approve được chạy, session <strong>không bao giờ chờ prompt</strong>.</li>
</ul>
<p>Tắt bước hỏi duyệt không có nghĩa bỏ guardrail. Ba lớp bảo vệ gánh việc đó: <strong>permissions trong settings.json</strong> (được <strong>cưỡng chế</strong>, không chỉ gợi ý), <strong>hooks</strong> (một <strong>PreToolUse hook</strong> có thể chặn lệnh phá hoại trước khi chạy), và <strong>plan mode</strong> khi cần người xem kế hoạch trước.</p>

<h3>CLAUDE.md xếp lớp, và mỗi dòng đều tốn token</h3>
<ul>
  <li><strong>User file</strong> tại <code>~/.claude/CLAUDE.md</code>: áp cho mọi project, nạp <strong>đầu tiên</strong>, rộng nhất và ưu tiên thấp nhất.</li>
  <li><strong>Project file</strong> ở gốc repo: check vào version control để team dùng chung, được đọc <strong>cuối cùng</strong>.</li>
  <li><strong>Không có gì cưỡng chế thứ tự ưu tiên</strong>: các lớp chỉ được ghép vào context; nếu hai quy tắc mâu thuẫn, Claude có thể chọn bất kỳ cái nào. Hãy giữ các lớp nhất quán.</li>
  <li>CLAUDE.md nằm sâu trong cây thư mục áp quy tắc cho riêng folder đó, nạp khi Claude làm việc với file ở đó.</li>
  <li>Mọi file này đều <strong>tính vào context window</strong>: là token thật, nên viết gọn và cụ thể.</li>
</ul>

<h3>Khởi tạo repo: /init và settings.json</h3>
<ul>
  <li><strong>/init</strong> quét codebase, nhận ra cấu trúc, convention, lệnh build, rồi soạn CLAUDE.md khởi đầu. Đó là <strong>bản nháp</strong>: đọc, sửa, tỉa, đừng tin mù quáng.</li>
  <li><strong>settings.json</strong> trong project: permissions, hooks, env vars, team dùng chung.</li>
  <li>Tuỳ chỉnh cá nhân → <strong>settings.local.json</strong>, nằm ngoài version control.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có "CI/CD, cron job, script chạy không người" → <strong>headless với -p</strong>; "job bị treo" → thường là <strong>quên -p</strong>.</li>
  <li>Đề cần "script parse kết quả, lấy session ID, chi phí" → <strong>--output-format json</strong>; "xem tiến độ job dài" → <strong>stream-json</strong>.</li>
  <li>Đề có "chạy unattended, không được chờ prompt" → <strong>dontAsk</strong> + tool pre-approved; "cần người duyệt kế hoạch trước" → <strong>plan mode</strong>.</li>
  <li>Đề hỏi "chặn chắc chắn một lệnh nguy hiểm" → <strong>permissions/hooks</strong>, không phải thêm dòng vào CLAUDE.md.</li>
  <li>Đề có "tuỳ chỉnh riêng, không muốn commit" → <strong>settings.local.json</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Viết quy tắc vào CLAUDE.md là đủ để cấm lệnh nguy hiểm" → <strong>sai</strong>, CLAUDE.md là gợi ý; cưỡng chế nằm ở permissions và hooks.</li>
  <li>"Project CLAUDE.md luôn thắng user CLAUDE.md" → <strong>sai</strong>, không có precedence được cưỡng chế, chỉ là ghép nối.</li>
  <li>"Tắt approval prompt là hết guardrail" → <strong>sai</strong>, guardrail chuyển sang settings.json và hooks.</li>
  <li>"CLAUDE.md dài thoải mái vì là bộ nhớ miễn phí" → <strong>sai</strong>, mỗi dòng đều tốn token context.</li>
  <li>"CLAUDE.md do /init tạo dùng luôn được" → <strong>sai</strong>, đó là bản nháp cần đọc và sửa.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Người xem thì interactive, máy chạy thì -p.</strong> <strong>CLAUDE.md để dặn, settings.json để cấm.</strong></p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
