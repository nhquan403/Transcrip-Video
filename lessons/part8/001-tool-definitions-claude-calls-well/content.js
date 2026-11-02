window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Tool definition chỉ có giá trị bên trong <strong>tool use loop</strong>: Claude gọi, code của bạn trả lời. Bài này nắm 4 thứ:
vòng <strong>round trip</strong> 4 bước, cách trả <strong>tool_result</strong> cho đúng, 4 giá trị của <strong>tool_choice</strong>, và 3 lỗi viết tool definition hay gặp nhất.
Cạm bẫy lớn: tool có schema dựng sẵn như <strong>Bash</strong> vẫn là <strong>client tool</strong>, bạn phải tự chạy.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>tool_use block</strong>: thứ Claude trả về khi muốn gọi tool, gồm <strong>ID</strong>, <strong>tên tool</strong> và <strong>input object</strong> chứa tham số.</li>
  <li><strong>tool_result block</strong>: thứ code của bạn gửi lại sau khi chạy tool, để Claude làm tiếp.</li>
  <li><strong>tool_use_id</strong>: ID nối một tool_result với đúng lần gọi tool_use mà nó trả lời.</li>
  <li><strong>stop_reason: tool_use</strong>: tín hiệu Claude dừng lại, chờ bạn chạy tool.</li>
  <li><strong>Parallel tool use</strong>: Claude gửi <strong>nhiều tool_use block trong một message</strong>; bật mặc định.</li>
  <li><strong>tool_choice</strong>: tham số điều khiển việc gọi tool: <strong>auto, any, tool, none</strong>.</li>
  <li><strong>Input examples</strong>: ví dụ lời gọi hợp lệ thêm vào tool definition cho tham số phức tạp.</li>
</ul>

<h3>Round trip 4 bước</h3>
<ol>
  <li>Bạn gửi request kèm <strong>tool definitions</strong> để Claude biết có gì dùng được.</li>
  <li>Nếu Claude quyết định dùng tool, nó trả về <strong>stop_reason: tool_use</strong> cùng tên tool và input object.</li>
  <li>Code của bạn lấy input, <strong>thực sự chạy tool</strong>, rồi trả về một <strong>tool_result</strong> mang output.</li>
  <li>Claude đọc kết quả để trả lời người dùng, hoặc quyết định lần gọi tool tiếp theo.</li>
</ol>
<p>Bốn bước, và <strong>code của bạn lái hai bước</strong> (bước 1 và bước 3).</p>
<div class="box">🍽️ <strong>Hình dung thế này:</strong> Claude là bồi bàn, code của bạn là nhà bếp. Bồi bàn đưa vào bếp <strong>phiếu order có số bàn</strong> (tool_use + ID).
Bếp nấu xong, đặt món lên khay <strong>ghi đúng số bàn</strong> (tool_result + tool_use_id). Bàn gọi 3 món thì bếp phải ra <strong>đủ 3 món trên cùng một khay</strong>, thiếu một món là cả khay bị trả lại.</div>

<h3>Trả kết quả cho đúng</h3>
<ul>
  <li>Mỗi tool_result có <strong>tool_use_id khớp</strong> với ID của lần gọi nó trả lời.</li>
  <li>Tất cả kết quả nằm trong <strong>một user message duy nhất</strong>, không rải ra nhiều message.</li>
  <li>Claude gọi nhiều tool trong một lượt thì phải có <strong>kết quả cho từng cái</strong>. Bỏ sót một tool_use là <strong>API từ chối cả lượt</strong>.</li>
  <li><strong>Parallel tool use</strong>: gom kết quả của mọi lời gọi, gửi lại thành nhiều tool_result block trong <strong>một</strong> user message.</li>
  <li>Trường hợp đặc biệt: nếu một <strong>server tool</strong> bị gộp song song với một <strong>client tool</strong>, cả lượt quay về <strong>stop_reason: tool_use</strong>, bạn xử lý như client call.</li>
</ul>

<h3>tool_choice: đúng 4 giá trị</h3>
<ul>
  <li><strong>auto</strong>: Claude tự quyết có gọi tool không; là <strong>mặc định khi bạn cung cấp tools</strong>. Claude có thể nói văn xuôi trước khi gọi, hoặc thay vì gọi.</li>
  <li><strong>any</strong>: <strong>bắt buộc</strong> gọi một tool nào đó, không chỉ định cái nào.</li>
  <li><strong>tool</strong>: bắt buộc gọi <strong>một tool cụ thể</strong> theo tên.</li>
  <li><strong>none</strong>: không gọi tool nào; là <strong>mặc định khi không có tools</strong>.</li>
</ul>
<p>Với <strong>any</strong> hoặc <strong>tool</strong>, API prefill lượt assistant để ép lời gọi, nên Claude <strong>không viết chữ nào trước tool_use block</strong>.
Muốn vừa có lời gọi vừa có lời giải thích? Giữ <strong>auto</strong> và thêm chỉ dẫn rõ trong message bảo Claude dùng tool.</p>

<h3>Tool có schema dựng sẵn vẫn do bạn chạy</h3>
<p>Anthropic định nghĩa sẵn schema cho vài client tool: <strong>Bash, text editor, memory, computer use</strong>. Bạn không phải viết definition, nhưng <strong>pre-typed không có nghĩa là Anthropic chạy</strong>.
Chúng chạy trong ứng dụng của bạn: Claude trả tool_use như mọi custom tool, code bạn chạy lệnh hoặc sửa file rồi trả tool_result.</p>

<h3>3 lỗi viết tool definition và cách viết tốt</h3>
<ul>
  <li><strong>Vague descriptions</strong> (thủ phạm số 1): mô tả mỏng làm route sai, Claude bỏ qua tool hoặc gọi nhầm lúc.</li>
  <li><strong>Overbroad schemas</strong>: kiểu lỏng, string mở toang → model điền giá trị bịa hoặc sai định dạng.</li>
  <li><strong>Missing required fields</strong>: field thật sự thiết yếu mà không đánh dấu required → model được phép bỏ qua, lời gọi đến thiếu.</li>
  <li>Tham số phức tạp: thêm vài <strong>input examples</strong>. Ví dụ cho thấy <strong>tổ hợp field nào đi cùng nhau</strong>, điều schema không diễn tả được. Mỗi example <strong>phải validate với schema</strong>, nếu không request bị từ chối.</li>
  <li>Tool tốt = <strong>mô tả chính xác</strong> (làm gì, khi nào dùng, khi nào dùng tool khác) + <strong>schema chặt</strong> (kiểu hẹp, enum) + <strong>chỉ required thứ thiết yếu</strong>.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề nói API báo lỗi khi Claude gọi nhiều tool mà bạn chỉ trả một kết quả → đáp án: <strong>trả đủ tool_result cho mọi tool_use, khớp ID, trong một user message</strong>.</li>
  <li>Đề muốn ép gọi tool <strong>và</strong> vẫn có lời giải thích → <strong>auto + chỉ dẫn rõ</strong>, không phải any/tool.</li>
  <li>Đề có phương án tool_choice lạ (ví dụ "required", "force") → nhớ chỉ có <strong>auto, any, tool, none</strong>.</li>
  <li>Đề cho Bash/text editor rồi hỏi ai chạy → <strong>ứng dụng của bạn</strong> (client tool).</li>
  <li>Đề có tham số lồng nhau khó mô tả → <strong>thêm input examples hợp lệ</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Bash có schema của Anthropic nên Anthropic chạy" → <strong>sai</strong>, đó là client tool, bạn chạy.</li>
  <li>"Dùng any để Claude vừa gọi tool vừa giải thích" → <strong>sai</strong>, any/tool không cho text trước tool_use.</li>
  <li>"Mỗi tool_result gửi trong một message riêng" → <strong>sai</strong>, gom chung vào một user message.</li>
  <li>"Input example chỉ để tham khảo, sai schema cũng không sao" → <strong>sai</strong>, example không hợp lệ làm request bị từ chối.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Claude gửi tool_use, bạn trả tool_result: đủ món, đúng số bàn, một khay.</strong> tool_choice chỉ có <strong>auto · any · tool · none</strong>.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
