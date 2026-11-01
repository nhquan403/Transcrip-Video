window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Output của model có thể về <strong>hỏng định dạng, bị cắt, hoặc thiếu field</strong>, và parse "ngây thơ" sẽ làm sập cả pipeline.
<strong>Defensive parsing</strong> là đọc output theo kiểu luôn chờ bất ngờ: <strong>kiểm tra stop_reason trước</strong>, guard từng field ở <strong>ranh giới</strong>,
để một response xấu <strong>hỏng an toàn</strong> với một thông báo rõ ràng, thay vì nổ tung ba hàm sâu bên trong.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Defensive parsing</strong>: đọc output của model sao cho một response xấu chỉ <strong>degrade gracefully</strong>, không làm sập pipeline.</li>
  <li><strong>Tolerant extraction</strong>: lấy field cần thiết mà không giả định cả payload đều chuẩn.</li>
  <li><strong>Explicit failure handling</strong>: quyết định <strong>trước</strong> chuyện gì xảy ra khi output hỏng; không bao giờ có crash không được xử lý.</li>
  <li><strong>No blind trust</strong>: coi mọi field đều có thể <strong>thiếu</strong> hoặc <strong>sai type</strong>.</li>
  <li><strong>Boundary</strong>: điểm nơi output của model đi vào code của bạn; mọi check nên nằm ở đây.</li>
  <li><strong>Fail loud / fall back / re-prompt</strong>: ba cách phản ứng an toàn khi parse hoặc validate hỏng.</li>
  <li><strong>Silent failure</strong>: trả về success, parse sạch, nhưng nội dung sai; guard về hình dạng không bắt được.</li>
</ul>

<h3>Ba thói quen và "valid JSON ≠ valid data"</h3>
<ul>
  <li><strong>Tolerant</strong>: đọc cái đang có, xoay xở khi thiếu.</li>
  <li><strong>Explicit</strong>: luôn có đường xử lý định sẵn: parse có bọc, fallback, re-prompt.</li>
  <li><strong>Distrustful</strong>: không tin mù quáng bất kỳ field nào.</li>
</ul>
<p>Một response có thể parse sạch mà vẫn không đúng hình dạng code mong đợi. Vì vậy: <strong>kiểm tra field bắt buộc có tồn tại</strong> trước khi đọc,
<strong>kiểm tra type</strong> trước khi làm toán với số hay xử lý chuỗi, và coi <strong>empty / null</strong> là trường hợp thật sự sẽ gặp. Có guard thì lỗi xuất hiện ngay tại check bạn viết, kèm thông báo rõ;
không có guard thì nó nổ ba hàm sâu bên trong, nguyên nhân thành bí ẩn.</p>
<p>Đây không phải chuyện nghi ngờ trí thông minh của model. Ngay cả model giỏi cũng <strong>non-deterministic</strong>; parse phòng thủ là cách làm cho một nguồn output mang tính xác suất trở nên an toàn để xây lên trên.</p>

<h3>Ca debug: ticket triage extractor sập lúc nửa đêm</h3>
<div class="box">🔍 <strong>Hình dung thế này:</strong> Đèn trong nhà tắt phụt. Chỗ bạn thấy tối (crash site) không phải nguyên nhân; nguyên nhân có thể là cầu dao ở tận ngoài cửa.
Thợ điện giỏi đi <strong>từ nguồn điện vào</strong>, không đứng nhìn bóng đèn mãi.</div>
<p>Một extractor lấy <strong>priority</strong> và <strong>summary</strong> từ mỗi ticket, chạy êm nhiều ngày. Rồi một batch đêm sập với <strong>key error</strong> ở priority, ba hàm sâu trong pipeline.
Stack trace chỉ cho biết chỗ thiệt hại lộ ra; câu hỏi thật là <strong>model đã trả về gì</strong>.</p>
<ol>
  <li><strong>Đọc stop_reason</strong> của response lỗi: là <strong>max_tokens</strong>, không phải end_turn. Model chưa viết xong object.</li>
  <li><strong>Xem raw payload</strong>: một ticket dài bất thường ăn gần hết token budget, JSON kết thúc giữa chừng, thiếu dấu đóng ngoặc.</li>
  <li><strong>Gọi tên guard bị thiếu</strong>: code nhảy thẳng vào parse và đọc field mà không hỏi vì sao model dừng. Một edge case đã được tài liệu hoá biến thành crash bí ẩn.</li>
</ol>

<h3>Bản đã gia cố, và ba phản ứng an toàn</h3>
<ul>
  <li><strong>Rẽ nhánh theo stop_reason</strong>: refusal → đường refusal; max_tokens → retry với <strong>budget lớn hơn</strong> hoặc truncation handler; chỉ <strong>end_turn</strong> mới được parse.</li>
  <li><strong>Guard từng lần truy cập</strong>: đọc field <strong>theo tên</strong>, xác nhận tồn tại, kiểm tra type trước khi dùng.</li>
  <li>So sánh enum <strong>không phân biệt hoa thường</strong>.</li>
  <li>Chạy lại batch: cùng response xấu giờ chỉ tạo <strong>một dòng log rõ ràng</strong> về response bị cắt, không còn crash.</li>
</ul>
<p>Khi parse hoặc validate hỏng, chọn có chủ đích một trong ba: <strong>fail loud</strong> (raise lỗi rõ ngay tại ranh giới), <strong>fall back</strong> (giá trị an toàn, kết quả cache, chế độ giảm cấp),
hoặc <strong>re-prompt</strong> (gửi lại kèm mô tả lỗi). Điều không bao giờ làm: để output không đọc được <strong>đi tiếp như thể ổn</strong>.</p>
<p>Giới hạn: nếu extractor gán một ticket <strong>outage</strong> là <strong>low priority</strong>, mọi field đủ, type đúng, stop_reason là end_turn, thì mọi guard ở bài này đều cho qua.
Bắt được nó cần một <strong>semantic gate</strong> nhắm vào ý nghĩa, không phải hình dạng.</p>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có <strong>KeyError / crash sâu trong pipeline</strong> với response lạ → đáp án đúng bắt đầu bằng <strong>đọc stop_reason và raw payload</strong>, không phải sửa chỗ crash.</li>
  <li>Đề có stop_reason là <strong>max_tokens</strong> và JSON bị cắt → <strong>retry với budget lớn hơn</strong> hoặc truncation handler, không parse.</li>
  <li>Đề hỏi đặt check ở đâu → ở <strong>boundary</strong>, trước khi đọc bất kỳ field nào.</li>
  <li>Đề có output parse được, đủ field nhưng <strong>ý nghĩa sai</strong> → cần <strong>semantic gate</strong>, guard hình dạng không đủ.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"JSON parse được thì dữ liệu dùng được" → <strong>sai</strong>, valid JSON không nhất thiết là valid data.</li>
  <li>"Đã dùng structured output thì khỏi guard" → <strong>sai</strong>, vẫn có refusal, truncation, enum case, thứ tự property.</li>
  <li>"Debug bắt đầu từ dòng crash trong stack trace" → <strong>sai</strong>, crash site không phải nguyên nhân; xem model trả về gì trước.</li>
  <li>"Output lỗi thì cứ cho đi tiếp, bước sau sẽ lo" → <strong>sai</strong>, phải fail loud, fall back hoặc re-prompt.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Hỏi "vì sao dừng" trước khi hỏi "nói gì".</strong> stop_reason → guard theo tên và type ở ranh giới → fail loud / fall back / re-prompt.</p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
