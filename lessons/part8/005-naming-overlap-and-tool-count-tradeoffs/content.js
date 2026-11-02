window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Ba quyết định âm thầm quyết định Claude có chọn đúng tool hay không: <strong>đặt tên</strong>, <strong>độ chồng chéo (overlap)</strong> và <strong>số lượng tool</strong>.
Tên phải rõ và có namespace, tool không được giẫm chân nhau, và mỗi tool đều <strong>tốn token</strong> nên phải "xứng đáng" được giữ lại.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Action-oriented name</strong>: tên nói rõ tool làm gì, ví dụ <code>BillingListInvoices</code> thay vì <code>list</code>.</li>
  <li><strong>Namespacing</strong>: thêm tiền tố tên service để tool cùng nhóm đứng gần nhau và không đụng tên.</li>
  <li><strong>Overlap</strong>: hai tool có mô tả hoặc phạm vi chồng lên nhau, khiến Claude chọn nhầm.</li>
  <li><strong>Tool use system prompt</strong>: đoạn system prompt API tự chèn vào mỗi request khi có tools.</li>
  <li><strong>Pruning</strong>: cắt bớt tool không đáng giữ.</li>
  <li><strong>Tool search tool</strong>: cho Claude tìm tool khi cần, thay vì giữ mọi định nghĩa trong context.</li>
  <li><strong>defer_loading: true</strong>: đánh dấu tool ít dùng, chỉ nạp khi Claude cần tới.</li>
  <li><strong>Programmatic tool calling</strong>: Claude điều phối tool bằng code, giữ kết quả trung gian ngoài context.</li>
</ul>

<h3>Đặt tên và tránh chồng chéo</h3>
<ul>
  <li>Tên là thứ Claude quét <strong>đầu tiên</strong>. Mỗi tên phải <strong>riêng biệt, hướng hành động</strong>.</li>
  <li>Nhiều service → <strong>namespace</strong> bằng tiền tố service, dùng pattern <strong>service + resource</strong> nhất quán. Điều này càng quan trọng khi dùng tool search.</li>
  <li><strong>Description vẫn là tín hiệu routing chính</strong>, nhưng trong setup nhiều server, tên có namespace xoá mơ hồ <strong>trước cả khi</strong> đọc description.</li>
  <li>Thêm tool <strong>không bao giờ miễn phí</strong>: tool mới chồng lên tool cũ sẽ thêm mơ hồ cho mọi quyết định gần đó. Nếu chồng chéo → <strong>gộp, đừng chồng thêm</strong>.</li>
</ul>
<p>Gọi nhầm tool thường do <strong>3 nguồn</strong>: <strong>tên giống nhau</strong>, <strong>description cạnh tranh nhau</strong>, và <strong>phạm vi mơ hồ</strong> (tool "làm mọi thứ" khớp quá nhiều request).
Cách sửa chung: <strong>làm sắc tên, tách description, siết phạm vi</strong> cho tới khi lựa chọn nào cũng hiển nhiên.</p>

<h3>Tool có giá: chi phí token</h3>
<div class="box">🎒 <strong>Hình dung thế này:</strong> Mỗi tool là một món đồ trong ba lô bạn đeo suốt chuyến đi. Không lấy ra dùng thì vẫn phải đeo nặng.
Chỉ khi <strong>không bỏ vào ba lô</strong> thì mới không nặng. Đồ ít dùng thì để ở kho, cần mới lấy (defer loading).</div>
<ul>
  <li>Hễ có tools, API chèn một <strong>tool use system prompt</strong> vào mỗi request (bài giảng nêu khoảng <strong>290 token</strong> overhead trên model được dùng làm ví dụ). Tên, description, schema của tool cũng tính là <strong>input tokens</strong>.</li>
  <li>Bẫy: đặt <strong>tool_choice = none</strong> <strong>vẫn trả chi phí này</strong> khi tools có mặt. Muốn thật sự 0 token → <strong>không truyền tool nào</strong>.</li>
  <li>Không phải "tránh dùng tool", mà là: bộ tool lớn tốn context trước cả khi hội thoại bắt đầu.</li>
</ul>

<h3>Khi nào cắt, và cách mở rộng khi cần nhiều tool</h3>
<ul>
  <li>3 tín hiệu để <strong>prune</strong>: <strong>rarely correct</strong> (eval cho thấy hiếm khi là lựa chọn đúng), <strong>redundant</strong> (tool khác đã làm được → gộp), <strong>unused surface</strong> (mỗi tool thừa là thêm <strong>attack surface</strong>).</li>
  <li>Cần hàng chục tool? Dùng <strong>tool search tool</strong>: đánh dấu tool ít dùng <strong>defer_loading: true</strong>, giữ vài tool hay dùng luôn được nạp.</li>
  <li>Hai đòn bẩy thêm: <strong>programmatic tool calling</strong> (chỉ có trên <strong>first-party API</strong>, không có trên Bedrock hay Vertex) và <strong>tool use examples</strong> (đính kèm vài input mẫu khi tham số phức tạp).</li>
  <li>Khi nào dùng <strong>MCP</strong>? Câu hỏi quyết định <strong>không phải số lượng tool</strong> mà là năng lực có cần <strong>dùng chung cho nhiều client</strong> không. Có → MCP server; chỉ một app → custom tool cục bộ, đơn giản hơn.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có nhiều server, tool trùng tên như <code>list</code>, <code>search</code> → đáp án là <strong>namespace theo service</strong>.</li>
  <li>Đề có "tool_choice none nhưng vẫn tốn token" → đúng, muốn 0 token phải <strong>bỏ hẳn tools</strong>.</li>
  <li>Đề có agent cần rất nhiều tool, context bị đầy → <strong>tool search + defer_loading</strong>.</li>
  <li>Đề có tool hiếm khi đúng hoặc trùng chức năng → <strong>prune / gộp</strong>.</li>
  <li>Đề hỏi khi nào chọn MCP → khi <strong>nhiều client cần dùng lại</strong> cùng bộ tool.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Tắt tool bằng tool_choice none là hết tốn token" → <strong>sai</strong>, chỉ bỏ hẳn tools mới bằng 0.</li>
  <li>"Có nhiều tool thì chuyển sang MCP" → <strong>sai</strong>, tiêu chí là dùng chung giữa nhiều client.</li>
  <li>"Thêm tool chỉ cộng thêm năng lực" → <strong>sai</strong>, tool chồng chéo cộng thêm mơ hồ.</li>
  <li>"Programmatic tool calling dùng được ở mọi nền tảng" → <strong>sai</strong>, không có trên Bedrock/Vertex.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Tên rõ, không giẫm chân, ba lô nhẹ.</strong> Đồ ít dùng để kho (defer), đồ dùng chung thì mở cửa hàng (MCP).</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
