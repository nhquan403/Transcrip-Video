window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> <strong>Client tool</strong> và <strong>server tool</strong> khác nhau đúng một điểm: <strong>code chạy ở đâu</strong>.
Client tool chạy trong ứng dụng của bạn, nên bạn phải chạy và trả <strong>tool_result</strong> sau khi Claude dừng với <strong>stop_reason: tool_use</strong>.
Server tool chạy trên hạ tầng của Anthropic, kết quả có sẵn ngay trong response.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Client tool</strong>: tool chạy <strong>trong ứng dụng của bạn</strong>, dù bạn tự định nghĩa hay dùng schema Anthropic cung cấp.</li>
  <li><strong>Server tool</strong>: tool chạy trên <strong>hạ tầng Anthropic</strong>, không có handler nào của bạn.</li>
  <li><strong>stop_reason: tool_use</strong>: tín hiệu Claude muốn một client tool được chạy và đang <strong>chờ bạn</strong>.</li>
  <li><strong>Handler</strong>: đoạn code thực thi tool; chỉ client tool mới cần.</li>
  <li><strong>Mixed batch</strong>: nhóm gọi song song có cả client tool lẫn server tool.</li>
  <li><strong>Tool use system prompt cost</strong>: chi phí token cố định phải trả ngay khi bạn cung cấp tools.</li>
</ul>

<h3>Câu hỏi duy nhất: máy của ai chạy tool này?</h3>
<div class="box">🏠 <strong>Hình dung thế này:</strong> <strong>Client tool</strong> giống <strong>nấu ở nhà</strong>: Claude đưa công thức, nhưng bếp nhà bạn mới là nơi nấu; bạn không nấu thì không ai có ăn.
<strong>Server tool</strong> giống <strong>gọi đồ ăn giao tận nơi</strong>: nhà hàng (Anthropic) nấu xong, món đến cùng đơn hàng, bạn không cần đụng tay. Nhưng nhà hàng không vào được tủ lạnh nhà bạn.</div>
<ul>
  <li><strong>Client tool</strong>: Claude trả <strong>stop_reason: tool_use</strong> kèm tên tool và input → app của bạn chạy hàm thật → đóng gói output vào <strong>tool_result block</strong> gửi ở message kế tiếp → Claude trả lời hoặc gọi tool khác. <strong>Không có gì chạy cho đến khi code bạn hành động.</strong></li>
  <li><strong>Server tool</strong>: không handler, <strong>không pause tool_use</strong>, không phải dựng tool_result. Claude gọi, Anthropic chạy, kết quả về thẳng trong response.</li>
</ul>

<h3>Ai nằm bên nào?</h3>
<ul>
  <li><strong>Client tool có schema của Anthropic</strong> (4 cái): <strong>Bash</strong> (chạy lệnh shell), <strong>Text Editor</strong> (xem, sửa file), <strong>Memory</strong> (đọc, ghi ghi chú lâu dài qua các lượt), <strong>Computer use</strong> (điều khiển màn hình, chuột, bàn phím).</li>
  <li>Cả 4 chạy <strong>trong môi trường của bạn</strong>. Truyền Bash mà không nối shell executor → cuộc hội thoại <strong>kẹt ở pause tool_use</strong>, chờ một tool_result mà app không bao giờ tạo ra.</li>
  <li>Schema dựng sẵn tiết kiệm công thiết kế, nhưng <strong>trách nhiệm runtime, kể cả sandboxing</strong>, vẫn là của bạn.</li>
  <li><strong>Server tool</strong>: <strong>web search</strong> và <strong>web fetch</strong> (lấy nội dung web trực tiếp), <strong>code execution</strong> (chạy code trong sandbox được host), <strong>tool search</strong> (cho Claude tìm tool phù hợp khi cần thay vì nạp hết từ đầu).</li>
</ul>

<h3>Ngoại lệ: nhóm gọi song song lẫn lộn</h3>
<p>Bình thường server tool chạy bên Anthropic, không pause. Nhưng nếu một server tool bị <strong>gộp song song với một client tool</strong> trong cùng nhóm,
<strong>cả nhóm quay về stop_reason: tool_use</strong>. Claude trả cả nhóm về cho bạn, và vòng lặp của bạn lái việc thực thi <strong>mọi lời gọi</strong>, kể cả server tool lẽ ra tự chạy.
Quy tắc: <strong>mixed batch luôn dừng chờ code của bạn</strong>; nghi ngờ thì coi như hành vi client tool thắng.</p>

<h3>3 hệ quả khi xây hệ thống, và cách chọn</h3>
<ul>
  <li><strong>Ít handler hơn bạn nghĩ</strong>: chỉ client tool cần code thực thi.</li>
  <li><strong>Kết quả về theo 2 đường</strong>: client → bạn tự dựng tool_result gửi lại; server → có sẵn inline trong response.</li>
  <li><strong>Tool không miễn phí kể cả khi không dùng</strong>: cứ cung cấp tools là trả một khoản tool use system prompt cost, <strong>với mọi tool_choice, kể cả none</strong>.</li>
  <li>Năng lực Anthropic đã host (tìm web, chạy code) → <strong>server tool</strong>, khỏi viết code thực thi.</li>
  <li>Cần chạm vào hệ thống của bạn (database, internal API, file) → <strong>client tool</strong>, vì chỉ app của bạn với tới được. Server tool <strong>không thấy môi trường riêng hay dữ liệu nội bộ</strong> của bạn.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề nói dùng Bash/text editor mà hội thoại "đứng im" → đáp án: <strong>app chưa chạy tool và chưa trả tool_result</strong> (client tool).</li>
  <li>Đề hỏi có cần viết handler / gửi tool_result cho web search không → <strong>không</strong>, server tool trả kết quả trong response.</li>
  <li>Đề có web search chạy song song với một custom tool → cả nhóm <strong>stop_reason: tool_use</strong>, code bạn xử lý hết.</li>
  <li>Đề cần truy cập database nội bộ → <strong>client tool</strong>; server tool không thấy dữ liệu riêng.</li>
  <li>Đề hỏi đặt tool_choice none có hết chi phí tool không → <strong>không</strong>, vẫn trả system prompt cost khi có tools.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Schema do Anthropic định nghĩa thì Anthropic chạy" → <strong>sai</strong>, Bash, Text Editor, Memory, Computer use đều chạy phía bạn.</li>
  <li>"Server tool cũng cần gửi tool_result" → <strong>sai</strong>, kết quả đã được tính và trả về sẵn.</li>
  <li>"Server tool trong nhóm song song vẫn tự chạy" → <strong>sai</strong>, gộp với client tool thì cả nhóm chờ code bạn.</li>
  <li>"Web search của Anthropic đọc được wiki nội bộ công ty" → <strong>sai</strong>, server tool không thấy môi trường riêng.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Nấu ở nhà thì tự nấu, gọi giao hàng thì chờ món tới.</strong> Luôn hỏi: <strong>máy của ai chạy tool này?</strong></p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
