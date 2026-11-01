window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Mỗi <strong>session</strong> của Claude Code được <strong>lưu xuống đĩa</strong>, gắn với thư mục project, nên bạn mở lại được bằng <strong>--continue</strong> hoặc <strong>--resume</strong>.
<strong>/compact</strong> thì tóm tắt lịch sử, <strong>/clear</strong> thì xoá sạch context đang dùng, nhưng <strong>cả hai đều không xoá lịch sử</strong> đã lưu.
Claude Code <strong>không tự nhớ</strong> session trước: sự liên tục phải được bạn thiết lập có chủ đích.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Session</strong>: một cuộc hội thoại gắn với thư mục project lúc bạn khởi động, được ghi xuống đĩa liên tục.</li>
  <li><strong>Slash command</strong>: lệnh tắt gõ với dấu <code>/</code> ở đầu, từ xoá context tới chạy cả một workflow của team.</li>
  <li><strong>Compaction</strong> (<code>/compact</code>): thay phần lịch sử cũ bằng một bản tóm tắt ngắn, giải phóng chỗ mà vẫn giữ mạch việc hiện tại.</li>
  <li><strong>/clear</strong>: reset cứng, làm trống context và bắt đầu hội thoại mới với "trang giấy trắng".</li>
  <li><strong>--continue</strong>: mở lại session <strong>gần nhất</strong> trong thư mục hiện tại, không cần chọn.</li>
  <li><strong>--resume</strong>: mở danh sách (picker) các session cũ, hoặc gọi thẳng tên session bạn muốn.</li>
  <li><strong>Retention window</strong>: thời gian giữ session cũ trước khi dọn, chỉnh trong settings, mặc định <strong>30 ngày</strong>.</li>
  <li><strong>Custom command</strong>: lệnh do team tự viết dưới dạng file; tên file chính là tên lệnh.</li>
</ul>

<h3>Session là một bản ghi thật, không chỉ là chữ trên màn hình</h3>
<ul>
  <li>Mỗi session <strong>gắn với thư mục project</strong> bạn khởi động nó, nên khi mở lại nó quay về đúng ngữ cảnh.</li>
  <li>Transcript được <strong>ghi liên tục</strong> khi bạn làm việc: đóng terminal hay thậm chí bị crash cũng không mất hội thoại.</li>
  <li>Session cũ được dọn sau <strong>retention window</strong> (mặc định <strong>30 ngày</strong>, chỉnh trong settings).</li>
  <li>Coi file transcript thô là <strong>nội bộ</strong>: đừng tự parse bằng tay, hãy mở lại qua các lệnh.</li>
</ul>

<h3>Ba cách lấy lại session cũ</h3>
<ol>
  <li><strong>--continue</strong>: mở lại session gần nhất trong thư mục hiện tại, đưa bạn về đúng chỗ đang dở.</li>
  <li><strong>--resume</strong>: hiện picker để chọn, hoặc gọi thẳng tên session nếu đã biết.</li>
  <li><strong>Resume ngay trong session đang chạy</strong>: chuyển sang một hội thoại cũ khác mà không cần thoát.</li>
</ol>
<p>Lưu ý: việc tìm session <strong>chỉ trong phạm vi thư mục project hiện tại</strong> (và các worktree của nó), nên hãy chạy lệnh từ đúng chỗ.</p>

<h3>/compact và /clear: hai lệnh hay bị nhầm</h3>
<div class="box">📒 <strong>Hình dung thế này:</strong> Bạn ghi chép trong một cuốn vở.
<strong>/compact</strong> giống như chép gọn mấy trang cũ thành vài dòng tóm tắt rồi viết tiếp, mạch việc vẫn còn.
<strong>/clear</strong> giống như lật sang một trang trắng để bắt đầu chuyện khác. Nhưng trong cả hai trường hợp, <strong>cuốn vở cũ vẫn nằm trên giá</strong>: bạn lấy lại được bằng resume.</div>
<ul>
  <li><strong>/compact</strong> là cách nhẹ nhàng: thay các lượt cũ bằng tóm tắt, <strong>giữ lại quyết định gần đây và task hiện tại</strong>.</li>
  <li><strong>/clear</strong> là reset cứng: không có gì từ trước được mang sang phần sau.</li>
  <li>Điểm hay bẫy: <strong>/clear không xoá hội thoại</strong>. Lịch sử vẫn lưu trên đĩa và vẫn resume được. Bạn chỉ làm trống <strong>live context</strong>.</li>
</ul>

<h3>Claude Code không tự nhớ hôm qua</h3>
<p>Mỗi session mới bắt đầu <strong>trống</strong>, mặc định không thấy gì từ hội thoại hôm qua. Đó là thiết kế có chủ ý. Có ba cách mang sự liên tục sang:</p>
<ul>
  <li><strong>CLAUDE.md</strong>: nạp lại quy tắc và convention cố định ở <strong>mỗi lần khởi động</strong>.</li>
  <li><strong>Resume</strong>: kéo một session cụ thể quay lại khi thật sự cần lịch sử đó.</li>
  <li><strong>Auto memory</strong>: khôi phục những điều Claude đã tự lưu lại qua các session.</li>
</ul>

<h3>Built-in command và custom command</h3>
<ul>
  <li><strong>Built-in command</strong> đi kèm CLI. Nhớ theo <strong>4 nhóm</strong> thay vì thuộc danh sách: (1) <strong>session và context</strong> (resume, clear, compact); (2) <strong>model và config</strong> (đổi model, effort level, setting); (3) <strong>setup và memory</strong> (init, memory); (4) <strong>quality và workflow</strong> (skill đóng gói sẵn như code review, planning). Tên cụ thể có thể đổi theo thời gian.</li>
  <li><strong>Custom command</strong> do team viết: <strong>tên file = tên lệnh</strong>; <strong>vị trí = phạm vi</strong> (thư mục project, chia sẻ qua version control; thư mục home, chỉ cho riêng bạn).</li>
  <li>Ví dụ: lưu checklist review thành <code>review.md</code> trong <code>.claude/commands</code> của repo; đồng đội pull về là gõ <code>/review</code> được ngay, cùng một quy trình.</li>
  <li>Custom command và <strong>skill giờ là một hệ thống</strong>: một file là đủ, không cần bước đăng ký.</li>
</ul>

<h3>Vòng lặp "vệ sinh session"</h3>
<ol>
  <li><strong>Tỉa tool output cũ</strong> (file to, kết quả search đã dùng xong) vì nó chỉ tốn token.</li>
  <li><strong>Compact</strong> khi window đầy mà mạch việc vẫn quan trọng.</li>
  <li><strong>Clear</strong> hoặc bắt đầu mới khi context đã thành "hành lý thừa".</li>
  <li><strong>Resume</strong> khi thật sự cần lại lịch sử trước đó.</li>
</ol>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có "quay lại đúng chỗ đang làm dở, session gần nhất" → <strong>--continue</strong>.</li>
  <li>Đề có "chọn một session cũ cụ thể" → <strong>--resume</strong> (picker hoặc gọi tên).</li>
  <li>Đề có "context đầy nhưng vẫn cần giữ task hiện tại" → <strong>/compact</strong>; "context toàn rác, muốn làm việc khác" → <strong>/clear</strong>.</li>
  <li>Đề hỏi "làm sao để mọi session đều biết quy tắc của team" → <strong>CLAUDE.md</strong> (kèm auto memory, resume có chủ đích).</li>
  <li>Đề có "cả team dùng chung một quy trình bằng lệnh /" → <strong>custom command</strong> trong thư mục project, check vào version control.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"/clear xoá vĩnh viễn hội thoại" → <strong>sai</strong>, lịch sử vẫn trên đĩa và resume được.</li>
  <li>"Claude Code tự nhớ session hôm qua" → <strong>sai</strong>, session mới bắt đầu trống; liên tục phải qua CLAUDE.md, auto memory, resume.</li>
  <li>"Đọc trực tiếp file transcript để lấy lại việc cũ" → <strong>sai</strong>, transcript là nội bộ, hãy dùng lệnh resume.</li>
  <li>"Chạy --resume ở thư mục nào cũng thấy hết session" → <strong>sai</strong>, nó chỉ tìm trong project hiện tại và worktree.</li>
  <li>"Custom command phải đăng ký mới dùng được" → <strong>sai</strong>, chỉ cần một file đặt đúng chỗ.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Compact là tóm tắt, Clear là trang trắng, cuốn vở cũ vẫn còn trên giá.</strong> Muốn nhớ lâu thì ghi vào CLAUDE.md, muốn đọc lại thì resume.</p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
