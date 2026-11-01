window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Muốn Claude nhanh hơn hay suy nghĩ sâu hơn, chưa chắc phải đổi model: bạn có thể chỉnh <strong>chính lời gọi</strong>.
<strong>Fast mode</strong> làm <strong>cùng một model</strong> xuất token nhanh hơn (trả giá cao hơn). <strong>Adaptive thinking</strong> cho model <strong>suy luận trước khi trả lời</strong> và tự quyết nghĩ bao nhiêu.
Cả hai đều <strong>phụ thuộc model</strong>, nên luôn <strong>gọi tên model trước</strong>.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Fast mode</strong>: đòn bẩy về <strong>latency/throughput</strong>: cùng model, xuất token nhanh tới khoảng <strong>2,5 lần</strong>, giá <strong>premium</strong>.</li>
  <li><strong>Research preview</strong>: fast mode hiện là bản xem trước, bật bằng <strong>beta flag</strong> và một tùy chọn <strong>speed</strong> ở cấp cao nhất của request.</li>
  <li><strong>Extended thinking</strong>: khái niệm chung: model dùng <strong>thinking tokens</strong> để suy luận trước khi viết câu trả lời nhìn thấy được.</li>
  <li><strong>Adaptive thinking</strong>: kiểu hiện tại: bật lên là model <strong>tự quyết</strong> khi nào nghĩ và nghĩ bao nhiêu, <strong>không có budget</strong> để chỉnh.</li>
  <li><strong>Legacy budget mode</strong>: kiểu cũ: bạn tự đặt <strong>thinking budget</strong> (số token). Chỉ còn trên model cũ.</li>
  <li><strong>Effort</strong>: đòn bẩy thứ ba, chỉnh mức công sức model bỏ ra (học ở bài sau).</li>
</ul>

<h3>Bản đồ: ba cách chỉnh một lời gọi</h3>
<ol>
  <li><strong>Fast mode</strong>: tốc độ. Thay đổi throughput, <strong>không</strong> đổi model bạn gọi.</li>
  <li><strong>Thinking</strong>: cho model suy luận riêng trước khi chốt câu trả lời; cách hiện tại là <strong>adaptive thinking</strong>.</li>
  <li><strong>Effort</strong>: model bỏ bao nhiêu công sức cho một response.</li>
</ol>
<p>Người ta hay trộn lẫn ba thứ này. Hãy tách rõ: <strong>fast mode = tốc độ, thinking = suy luận, effort = mức làm việc</strong>.</p>

<h3>Fast mode: cùng bộ não, nói nhanh hơn</h3>
<div class="box">🗣️ <strong>Hình dung thế này:</strong> Fast mode giống thuê <strong>cùng một chuyên gia</strong> nhưng trả thêm tiền "phí hỏa tốc" để họ nói nhanh hơn.
Kiến thức không đổi, chỉ tốc độ đổi. Còn <strong>đổi sang model nhỏ hơn</strong> (vd. Opus xuống Haiku 4.5) là <strong>thuê người khác</strong>: rẻ hơn, thường nhanh hơn, nhưng năng lực cũng khác.</div>
<ul>
  <li>Fast mode <strong>không làm model thông minh hơn hay kém đi</strong>, không thay model khác. <strong>Same brain, quicker mouth.</strong></li>
  <li>Hỗ trợ hiện nay: <strong>Opus 5</strong> và <strong>Opus 4.8</strong>. Opus 5 là "nhà" chính, xây mới thì xây trên Opus 5.</li>
  <li><strong>Opus 4.7 không còn hỗ trợ</strong>: gửi request fast ở đó sẽ bị <strong>lỗi</strong>.</li>
  <li><strong>Không có</strong> trên <strong>Batch API</strong> (batch vốn tối ưu chi phí, không phải tốc độ) và <strong>không có</strong> trên các nền tảng model bên thứ ba.</li>
  <li>Chọn thế nào: cần <strong>chất lượng của chính model này nhưng nhanh hơn</strong> → fast mode. Model nhẹ hơn làm được việc → <strong>đổi model</strong>, thường rẻ hơn.</li>
</ul>

<h3>Thinking: mỗi model một mặc định khác</h3>
<ul>
  <li><strong>Fable 5</strong>: thinking <strong>luôn bật</strong>, không tắt được.</li>
  <li><strong>Opus 5, Opus 4.8</strong>: hỗ trợ adaptive thinking nhưng <strong>tắt mặc định</strong>. Bỏ trống thiết lập thinking là model <strong>trả lời thẳng, không suy luận</strong>. Muốn suy luận phải <strong>bật adaptive thinking rõ ràng</strong>.</li>
  <li><strong>Sonnet 5</strong>: ngược lại, bỏ trống thì nó <strong>tự chạy adaptive thinking</strong>, nghĩa là bạn đang <strong>trả tiền thinking tokens</strong>. Muốn tắt: truyền <strong>thinking type disabled</strong>. Đặt thủ công kiểu <strong>enabled</strong> sẽ bị <strong>400</strong>.</li>
  <li><strong>Haiku 4.5</strong>: ngoại lệ, <strong>không có adaptive thinking</strong>; vẫn suy luận được nhưng qua <strong>budget mode cũ</strong>.</li>
  <li><strong>Khả năng hiển thị</strong>: kể cả khi thinking bật, phần suy luận <strong>ẩn theo mặc định</strong>; chỉ thấy khi bạn chọn hiện ra, và <strong>chi phí như nhau</strong> dù hiện hay ẩn.</li>
</ul>

<h3>Bẫy khi nâng cấp: budget cũ trên model mới</h3>
<ul>
  <li><strong>Adaptive</strong>: model tự quyết lượng suy luận, không budget, là chế độ hiện tại trên các model frontier.</li>
  <li><strong>Legacy budget</strong>: bạn tự đặt token budget, chỉ còn chạy trên model cũ như <strong>Sonnet 4.5, Opus 4.5</strong>.</li>
  <li>Mang code cũ có <strong>thinking budget</strong> sang model hiện tại: nó <strong>không tự thích nghi</strong>, mà <strong>bị từ chối</strong>. Lên model mới thì <strong>chuyển sang adaptive thinking</strong>. Cùng mục tiêu, khác công tắc.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có <strong>"cần chất lượng Opus nhưng latency quá cao"</strong> → đáp án đúng thường là <strong>fast mode trên Opus 5</strong> (chấp nhận giá premium).</li>
  <li>Đề có <strong>"fast mode + Batch API"</strong> hoặc <strong>"fast mode trên Opus 4.7"</strong> → đó là lựa chọn <strong>không hợp lệ</strong>.</li>
  <li>Đề có <strong>"dùng Opus 5, bỏ trống thinking nhưng model không suy luận"</strong> → phải <strong>bật adaptive thinking rõ ràng</strong>.</li>
  <li>Đề có <strong>"Sonnet 5 tốn thinking tokens ngoài ý muốn"</strong> → đáp án là <strong>thinking type disabled</strong>.</li>
  <li>Đề có <strong>"code cũ đặt thinking budget, lên model mới bị lỗi"</strong> → <strong>chuyển sang adaptive thinking</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Fast mode làm model thông minh hơn" hoặc "đổi sang model khác" → <strong>sai</strong>, cùng model, chỉ nhanh hơn.</li>
  <li>"Adaptive thinking bật mặc định trên mọi model" → <strong>sai</strong>, Opus tắt mặc định, Sonnet 5 bật, Fable 5 luôn bật, Haiku 4.5 không có.</li>
  <li>"Thinking bị ẩn thì không tốn tiền" → <strong>sai</strong>, ẩn hay hiện thì chi phí như nhau.</li>
  <li>"Budget thinking cũ vẫn chạy trên model mới" → <strong>sai</strong>, bị từ chối.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Fast = nói nhanh, Thinking = nghĩ trước.</strong> Opus: <strong>tắt tới khi bật</strong>; Sonnet 5: <strong>bật tới khi tắt</strong>; Fable 5: <strong>luôn bật</strong>. Gọi tên model trước!</p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
