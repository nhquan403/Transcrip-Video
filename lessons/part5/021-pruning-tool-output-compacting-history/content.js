window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Trong agent loop dùng nhiều tool, thứ làm nổ context window nhanh nhất là <strong>tool output thô</strong> chồng chất qua từng lượt.
Có ba cách lấy lại token: <strong>pruning</strong> (cắt tool output, luôn làm trước), <strong>tool result clearing</strong> (máy móc, không tốn inference) và <strong>compaction</strong> (dùng model tóm tắt, tốn phí và mất chi tiết).
Chọn đúng công cụ theo đúng tình huống mới là điểm mấu chốt.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Tool output pruning</strong>: cắt, tóm tắt hoặc bỏ tool result dài dòng, chỉ giữ các field sẽ dùng ở bước sau. Đây là đòn bẩy chính.</li>
  <li><strong>Tool result clearing</strong>: thay tool result cũ bằng <strong>placeholder</strong>, giữ nguyên tool call và reasoning. Không chạy model, không tốn inference.</li>
  <li><strong>Context compaction</strong>: dùng model nén các lượt cũ thành một bản tóm tắt ngắn rồi chạy tiếp từ đó.</li>
  <li><strong>keep</strong>: số cặp tool use/result gần nhất được giữ nguyên (mặc định <strong>3</strong>).</li>
  <li><strong>trigger</strong>: ngưỡng input token để kích hoạt việc dọn.</li>
  <li><strong>exclude tools</strong>: danh sách tool không bao giờ bị clear, ví dụ <strong>memory tool</strong>.</li>
  <li><strong>Lossy</strong>: có mất mát – tóm tắt sẽ bỏ chi tiết nhỏ và câu chữ nguyên văn.</li>
</ul>

<h3>Pruning: bước đầu tiên, thắng lớn nhất</h3>
<ul>
  <li>Một lần đọc file hay một API response có thể đổ vào <strong>hàng chục nghìn token</strong>, phần lớn là nhiễu bạn không bao giờ nhìn lại.</li>
  <li>Cách làm: <strong>trước khi</strong> kết quả nằm vĩnh viễn trong lịch sử, cắt nó xuống các field "chịu lực": giá trị, trạng thái, đúng đoạn bạn cần. Giữ chúng, bỏ phần còn lại.</li>
  <li>Vì tool dump thô là nguồn bloat nhanh nhất, pruning cho nhiều chỗ trống nhất với ít công nhất. <strong>Dùng nó trước khi nghĩ tới công cụ nặng hơn.</strong></li>
</ul>

<h3>Clearing vs compaction: nghe giống nhưng khác hẳn</h3>
<div class="box">🗄️ <strong>Hình dung thế này:</strong> Bàn làm việc ngập giấy. <strong>Clearing</strong> giống cất bản in dày vào tủ và để lại tờ ghi chú "đã in báo cáo X" – bạn vẫn biết việc đã làm, cần thì in lại.
<strong>Compaction</strong> giống nhờ một trợ lý đọc hết đống giấy rồi viết bản tóm tắt một trang – gọn hơn nhiều, nhưng phải trả công trợ lý và có chi tiết nhỏ bị mất.</div>
<ul>
  <li><strong>Clearing</strong>: thuần máy móc. Server thay tool result cũ bằng placeholder, <strong>không đụng</strong> tới tool call, lượt user hay reasoning. Không có model → <strong>không tốn inference</strong>.</li>
  <li>Lưu ý: sửa prefix làm <strong>prompt cache mất hiệu lực từ điểm đó</strong>, lần gọi sau phải ghi lại cache. Nên clear đủ nhiều một lần cho đáng.</li>
  <li>Clearing hợp nhất khi bloat chủ yếu là <strong>kết quả lớn, có thể lấy lại (refetchable)</strong>.</li>
  <li><strong>Compaction</strong>: chạy model để tóm tắt context cũ thành một block gọn rồi chạy tiếp. Tốn một lượt inference, nhưng thu nhỏ được <strong>mọi thứ</strong>, kể cả hội thoại và reasoning.</li>
</ul>

<h3>Cấu hình clearing: keep, trigger, exclude</h3>
<ul>
  <li>Cấu hình như một <strong>context management edit</strong>, theo dõi số input token.</li>
  <li><strong>trigger</strong>: vượt ngưỡng thì clearing chạy.</li>
  <li><strong>keep</strong>: mặc định giữ <strong>3 cặp tool use/result gần nhất</strong>, để việc đang làm không bị xóa. Cũ hơn thì result bị thay bằng placeholder.</li>
  <li><strong>exclude tools</strong>: bảo vệ tool luôn cần hiển thị, như memory tool.</li>
  <li>Model vẫn thấy tool <strong>đã chạy</strong>, chỉ không thấy payload khổng lồ nó trả về.</li>
</ul>

<h3>Compaction: cái gì sống sót, khi nào kích hoạt</h3>
<ul>
  <li><strong>Giữ được</strong>: các fact cốt lõi của task, các quyết định kiến trúc đã chốt, các câu hỏi còn bỏ ngỏ.</li>
  <li><strong>Mất</strong>: chi tiết nhỏ, cụ thể hiếm gặp, <strong>câu chữ nguyên văn</strong>. Khó đoán trước chính xác cái gì sẽ mất.</li>
  <li>Trigger mặc định: <strong>150,000 input token</strong>, không thể đặt <strong>thấp hơn 50,000</strong>.</li>
  <li>Khi chạy, API tóm tắt phần cũ và ở các request sau <strong>tự bỏ mọi thứ trước block tóm tắt</strong> – bạn không phải tự xóa.</li>
  <li>Luật vàng: <strong>lưu lại thứ cần nguyên văn trước khi compaction chạy</strong>.</li>
</ul>

<h3>Lựa chọn thứ tư: mở context window mới</h3>
<p>Khi session quá lớn, đôi khi sạch hơn là <strong>bắt đầu window mới</strong> thay vì tóm tắt. Agent giỏi có thể tự tìm lại trạng thái từ bên ngoài nhanh hơn một bản tóm tắt: đọc <strong>git log</strong>, một <strong>progress file</strong>, hoặc chạy <strong>tests</strong>.
Mạch hội thoại thật sự quan trọng → <strong>compact</strong>. Trạng thái thật nằm trên đĩa, hội thoại chủ yếu là nhiễu → <strong>fresh window</strong>. Dù chọn gì, vẫn <strong>prune</strong> dọc đường để không bao giờ overflow.</p>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có agent nhiều tool, context phình vì file read/API dump → bước đầu là <strong>pruning</strong>.</li>
  <li>Đề muốn giảm token <strong>không tốn inference</strong>, kết quả có thể lấy lại → <strong>tool result clearing</strong>.</li>
  <li>Đề nói cả hội thoại và reasoning đã quá lớn → <strong>compaction</strong> (tốn phí, lossy).</li>
  <li>Đề muốn một tool (như memory) không bao giờ bị xóa → <strong>exclude tools</strong>.</li>
  <li>Đề có trạng thái lưu trong git/progress file/tests → cân nhắc <strong>fresh context window</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Clearing dùng model tóm tắt tool result" → <strong>sai</strong>, nó chỉ thay bằng placeholder, không có inference.</li>
  <li>"Clearing xóa luôn tool call" → <strong>sai</strong>, tool call và reasoning giữ nguyên.</li>
  <li>"Compaction miễn phí và không mất gì" → <strong>sai</strong>, nó tốn một lượt model và lossy.</li>
  <li>"Đặt trigger compaction 20,000 cho sớm" → <strong>sai</strong>, tối thiểu là 50,000.</li>
  <li>"Clearing không ảnh hưởng prompt cache" → <strong>sai</strong>, sửa prefix làm cache mất hiệu lực từ đó.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>"Tỉa trước, cất sau, tóm tắt cuối."</strong> Clearing = <strong>keep, trigger, exclude</strong>, miễn phí; compaction = <strong>150K mặc định, sàn 50K</strong>, tốn phí và mất chữ nguyên văn.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
