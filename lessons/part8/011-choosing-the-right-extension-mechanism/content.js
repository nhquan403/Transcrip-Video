window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Nguyên tắc chọn cơ chế mở rộng Claude là <strong>chọn cơ chế nhẹ nhất mà vẫn làm được việc</strong>.
Thứ tự đi lên: <strong>built-in → custom tool → skill hoặc MCP server</strong>. Skill và MCP <strong>không đối đầu</strong> mà bổ sung cho nhau, và quyết định được áp dụng <strong>cho từng capability</strong>, không phải một lần cho cả agent.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Lightest mechanism</strong>: cơ chế nhẹ nhất đáp ứng đủ yêu cầu; chỉ "lên nấc" khi có lý do cụ thể.</li>
  <li><strong>Built-in tools</strong>: web search, web fetch, code execution, tool search; tốn ít nhất, nhưng dừng lại ở firewall của bạn.</li>
  <li><strong>Custom tool</strong>: "workhorse", một hành động rõ ràng cho một ứng dụng.</li>
  <li><strong>Skill</strong>: đóng gói <strong>procedural knowledge</strong>, tức know-how và quy trình.</li>
  <li><strong>MCP server</strong>: <strong>connectivity</strong>, dây nối chuẩn hóa tới hệ thống, dùng chung nhiều client/team.</li>
  <li><strong>Reach / Reuse scope / Context cost</strong>: ba lực quyết định lựa chọn.</li>
  <li><strong>Per capability</strong>: hỏi lại câu "cơ chế nào nhẹ nhất" cho từng việc riêng.</li>
</ul>

<h3>Vì sao phải chọn "nhẹ nhất"?</h3>
<p>Chọn sai thì hoặc <strong>không làm được việc</strong>, hoặc <strong>làm quá tay</strong>. Lỗi phổ biến là với lấy thứ nặng: dựng MCP server hay viết skill trong khi một built-in hay custom tool đơn giản đã đủ.
Mỗi cơ chế thêm vào đều có giá: <strong>tool definitions tốn context</strong>, còn <strong>server là hạ tầng bạn phải sở hữu và bảo trì</strong>. Nên phản xạ đúng là đi ngược lại: bắt đầu từ thứ đơn giản nhất phù hợp.</p>

<h3>Ba câu hỏi xếp tầng</h3>
<ol>
  <li><strong>Có built-in tool nào đã đáp ứng chưa?</strong> Nếu Anthropic host sẵn (web search, chạy code) → dùng và dừng.</li>
  <li><strong>Đây có phải một hành động cụ thể cho một ứng dụng?</strong> Nếu có → <strong>custom tool</strong> là vừa cỡ.</li>
  <li><strong>Có cần dùng lại, chia sẻ cho nhiều client, team, project?</strong> Lúc đó skill hoặc MCP mới đáng: <strong>skill</strong> nếu thứ dùng lại là <strong>quy trình, know-how</strong>; <strong>MCP server</strong> nếu là <strong>quyền truy cập một hệ thống</strong>.</li>
</ol>
<p>Phần lớn trường hợp bạn đã có câu trả lời ở <strong>câu hỏi thứ hai</strong>.</p>
<div class="box">🪜 <strong>Hình dung thế này:</strong> Cần treo một bức tranh. Nhà có sẵn búa (<strong>built-in</strong>) thì dùng luôn. Tường đặc biệt cần một cái móc riêng thì tự làm một cái (<strong>custom tool</strong>).
Chỉ khi cả khu chung cư đều cần treo tranh thì mới lắp <strong>hệ ray chuẩn</strong> cho mọi căn (<strong>MCP server</strong>), kèm <strong>bản hướng dẫn treo cho đẹp, đều</strong> (<strong>skill</strong>).
Không ai xây hệ ray cho cả tòa nhà chỉ để treo một bức tranh.</div>

<h3>Đi qua từng nhánh</h3>
<ul>
  <li><strong>Built-in</strong>: không handler, không server, không tích hợp phải duy trì. Đủ cho rất nhiều nhu cầu: lấy thông tin công khai, tính toán, xử lý nội dung fetch về. Nhưng có <strong>trần</strong>: chạy trên hạ tầng Anthropic nên <strong>dừng ở firewall</strong> của bạn.</li>
  <li><strong>Custom tool</strong>: khi built-in không với tới và nhu cầu là của riêng app. Ví dụ: tra một khách hàng, tạo một record, gọi một endpoint nội bộ. Tốn công hơn bật built-in nhưng <strong>ít hơn nhiều</strong> so với dựng server hay viết skill. Chỉ app này cần → <strong>dừng ở đây</strong>, đừng chọn MCP chỉ vì nghe "robust" hơn.</li>
  <li><strong>Skill vs MCP</strong>: cặp hay bị nhầm. Skill dạy Claude <strong>cách làm</strong> một workflow; MCP cho Claude <strong>tầm với</strong> tới tools, resources, data. Một bên là know-how, một bên là reach.</li>
</ul>

<h3>Skill + MCP: kết hợp mới "click"</h3>
<ul>
  <li>Anthropic nói rõ: <strong>skills có thể bổ sung cho MCP servers</strong> bằng cách dạy Claude những workflow phức tạp có dùng các tool bên ngoài đó.</li>
  <li>MCP server cho Claude các hành động trên một hệ thống, nhưng chưa biết <strong>cách team bạn dùng chúng</strong>. Thêm skill: gọi tool nào, theo thứ tự nào, theo quy ước gì, xử lý edge case ra sao.</li>
  <li>MCP mang <strong>reach</strong>, skill mang <strong>method</strong>. Nhờ progressive disclosure, skill rẻ về context nên ghép cặp không làm phình mọi request.</li>
</ul>

<h3>Áp ba lực vào một ví dụ</h3>
<p>Cần Claude tạo ticket trong tracker nội bộ cho <strong>một team</strong>:</p>
<ul>
  <li><strong>Reach</strong>: tracker nằm sau firewall → loại built-in.</li>
  <li><strong>Reuse</strong>: chỉ một app → <strong>custom tool</strong> thắng MCP server.</li>
  <li><strong>Context cost</strong> đồng ý: một schema nhỏ thay vì cả catalog của server.</li>
</ul>
<p>Một agent thực tế thường <strong>dùng nhiều cơ chế cùng lúc</strong>: built-in cho web search, custom tool cho một hành động nội bộ, MCP server cho hệ thống dùng chung, và skill kết nối cả quy trình. Chúng <strong>không loại trừ nhau</strong>.</p>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề cần dữ liệu web công khai hoặc chạy phép tính → <strong>built-in tool</strong>, không cần gì nặng hơn.</li>
  <li>Đề có hệ thống nội bộ, <strong>chỉ một app/một team</strong> dùng → <strong>custom tool</strong>, không phải MCP server.</li>
  <li>Đề có hệ thống cần <strong>chia sẻ cho nhiều client, team</strong> → <strong>MCP server</strong>.</li>
  <li>Đề có <strong>quy trình, quy ước</strong> cần làm nhất quán (nhất là quanh tools sẵn có) → <strong>skill</strong>, thường ghép với MCP.</li>
  <li>Đáp án chọn "dựng MCP server" cho nhu cầu nhỏ một app → thường là đáp án <strong>overbuild</strong>, bị loại.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"MCP lúc nào cũng tốt hơn vì robust hơn" → <strong>sai</strong>, server là hạ tầng phải bảo trì và tốn context; chỉ dùng khi cần chia sẻ.</li>
  <li>"Phải chọn skill hoặc MCP, không thể cả hai" → <strong>sai</strong>, chúng bổ sung nhau: skill là cách làm, MCP là tầm với.</li>
  <li>"Một agent chỉ được dùng một cơ chế" → <strong>sai</strong>, quyết định áp dụng cho từng capability.</li>
  <li>"Built-in đủ cho mọi thứ vì không tốn công" → <strong>sai</strong>, nó dừng ở firewall, không chạm dữ liệu riêng.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>"Nhẹ trước, nặng sau: có sẵn → tự làm → dùng chung."</strong> Skill dạy cách, MCP nối dây, và hỏi lại cho <strong>từng</strong> việc.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
