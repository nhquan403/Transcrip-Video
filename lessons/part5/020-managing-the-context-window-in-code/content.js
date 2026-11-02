window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Mỗi request tới Claude dùng chung <strong>một context window</strong> có giới hạn token, và <strong>bạn</strong> là người quản lý nó, không phải model.
Context <strong>chỉ cộng dồn</strong>: không có gì tự bị bỏ đi nếu ứng dụng của bạn không prune hay compact.
Mục tiêu không phải nhét được nhiều nhất, mà là giữ <strong>tập token nhỏ nhất nhưng giàu thông tin nhất</strong> – "informative yet tight".</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Context window</strong>: số token tối đa model "nhìn" được trong một request, gồm system prompt, tool definitions, lịch sử, tool results và cả phần đang sinh ra.</li>
  <li><strong>Context window management</strong>: chủ động kiểm soát cái gì chiếm chỗ trong ngân sách đó – là việc kỹ thuật của bạn, không phải hành vi model tự làm.</li>
  <li><strong>Attention budget</strong>: giống trí nhớ làm việc; mỗi token thêm vào đều làm hao nó, nên nhiều context không tự động là giỏi hơn.</li>
  <li><strong>Context rot</strong>: token càng nhiều, khả năng model nhớ chính xác một chi tiết càng giảm.</li>
  <li><strong>Drift / Bloat / Overflow</strong>: ba kiểu hỏng của session dài không được quản lý.</li>
  <li><strong>Regrounding</strong>: nhắc lại mục tiêu và ràng buộc quan trọng một cách gọn gàng để chỉ dẫn lấy lại "sức nặng".</li>
  <li><strong>Windowing</strong>: chỉ giữ một lát lịch sử gần đây, để các lượt cũ rơi đi – cách đơn giản thay cho tóm tắt.</li>
  <li><strong>High-signal context</strong>: tập token nhỏ nhất vẫn đủ dẫn tới kết quả.</li>
</ul>

<h3>Cái gì đang ăn ngân sách token?</h3>
<ul>
  <li><strong>System prompt</strong>: có mặt trong mọi lần gọi.</li>
  <li><strong>Tool definitions</strong>, và nếu nối với <strong>MCP server</strong> thì cả schema của chúng.</li>
  <li><strong>Toàn bộ lịch sử hội thoại</strong>: mọi lượt user và câu trả lời trước.</li>
  <li><strong>Tool results</strong> bạn đưa lại cho model – các bản dump thô thường là <strong>nguồn lớn nhất</strong>.</li>
  <li><strong>Câu trả lời đang được sinh ra</strong> ngay lúc này.</li>
</ul>
<p>Cộng lại sẽ thấy vì sao một session lúc đầu nhỏ lại âm thầm phình to. Biết các thành phần là bước đầu để cắt tỉa chúng.</p>

<h3>Hiểu lầm lớn: "model sẽ tự quên chuyện cũ"</h3>
<div class="box">🎒 <strong>Hình dung thế này:</strong> Context window như một chiếc ba lô. Mỗi lượt bạn lại nhét thêm đồ vào, và ba lô <strong>không tự vứt</strong> thứ gì cả.
Đi lâu, ba lô nặng trĩu, món đồ quan trọng (chỉ dẫn chính) bị vùi dưới đống giấy tờ cũ. Không phải người đi bộ "mệt", mà là bạn chưa bao giờ dọn ba lô.</div>
<ul>
  <li>Nhiều dev nghĩ model sẽ để chi tiết cũ phai dần như con người. <strong>Không phải vậy.</strong></li>
  <li>Context là <strong>cộng dồn (additive)</strong>: model không tự cắt, và <strong>API không tự tóm tắt</strong> giùm khi window đầy.</li>
  <li>Session dài xuống chất lượng không phải vì model "mệt" hay "quên", mà vì bạn cứ append và tín hiệu hữu ích bị chôn vùi. <strong>Trách nhiệm thuộc về bạn.</strong></li>
  <li><strong>Context rot</strong> và <strong>attention budget</strong>: model liên hệ mọi token với mọi token khác, nên chi phí và độ loãng tăng nhanh hơn số token. Context lớn hơn <strong>không phải nâng cấp miễn phí</strong> – "tight beats large".</li>
</ul>

<h3>Ba kiểu hỏng: drift, bloat, overflow</h3>
<ol>
  <li><strong>Drift</strong>: model dần mất mạch, các nhánh phụ và kết quả cũ làm loãng chỉ dẫn, nó quay về giả định cũ.</li>
  <li><strong>Bloat</strong>: window đầy token giá trị thấp (tool dump dài dòng, lịch sử trùng lặp) → tăng chi phí, tăng latency, hết chỗ để suy luận.</li>
  <li><strong>Overflow</strong>: vượt giới hạn token → <strong>lỗi cứng</strong>, phải phòng trước vì API không tự tóm tắt để cứu bạn.</li>
</ol>
<p>Triệu chứng khác nhau, <strong>cùng một gốc</strong>: window không được quản lý.</p>

<h3>Sửa drift: reground và prune, không phải "la to hơn"</h3>
<ul>
  <li>Phản xạ thường gặp: thêm một chỉ dẫn gắt hơn, to hơn lên trên. Việc này <strong>thường làm tệ hơn</strong> vì lại thêm token vào window vốn đã loãng.</li>
  <li>Drift là <strong>vấn đề bố cục context</strong>, không phải lỗi của model.</li>
  <li>Cách sửa đúng: <strong>reground</strong> (nhắc lại mục tiêu hiện tại gọn gàng) và <strong>prune</strong> (cắt các lượt cũ, tool output đã chết).</li>
  <li>Quyết định trước lịch sử sẽ bị giới hạn thế nào: <strong>windowing</strong>, <strong>pruning</strong>, hay một lượt <strong>tóm tắt</strong>. Trước khi append một tool result khổng lồ, hỏi: model cần gì từ nó ở bước sau? Chỉ giữ phần đó.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề nói "session dài, model bắt đầu bỏ qua ràng buộc gần đây" → <strong>drift</strong> → đáp án là <strong>reground + prune</strong>, không phải thêm chỉ dẫn mạnh hơn.</li>
  <li>Đề hỏi "ai chịu trách nhiệm bỏ bớt context cũ" → <strong>ứng dụng của bạn</strong>; model và API không tự làm.</li>
  <li>Đề có chi phí/latency tăng do tool dump dài → <strong>bloat</strong> → chỉ giữ phần cần dùng.</li>
  <li>Đề hỏi giải pháp đơn giản, có giới hạn cho lịch sử → <strong>windowing</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Model tự quên lượt cũ không quan trọng" → <strong>sai</strong>, context chỉ cộng dồn.</li>
  <li>"API tự tóm tắt khi window đầy" → <strong>sai</strong>, vượt giới hạn là lỗi cứng.</li>
  <li>"Context window càng lớn càng tốt, cứ nhét hết vào" → <strong>sai</strong>, context rot làm giảm khả năng nhớ chính xác.</li>
  <li>"Model drift thì viết chỉ dẫn IN HOA, mạnh hơn" → <strong>sai</strong>, thêm token làm loãng thêm; phải reground và prune.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>"Ba lô không tự dọn – informative yet tight."</strong> Drift thì <strong>nhắc lại gọn + cắt bớt</strong>, đừng hét to hơn.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
