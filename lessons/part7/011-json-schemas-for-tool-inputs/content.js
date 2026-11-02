window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> <strong>Input schema</strong> của một tool là "hợp đồng tham số": nó khai báo <strong>các field</strong>, <strong>kiểu</strong> của từng field, và field nào <strong>required</strong>.
Schema càng chặt thì Claude trả về tham số càng sạch. Nhưng nhớ: tham số <strong>đúng schema</strong> chưa chắc là tham số <strong>đúng</strong>, tool vẫn có thể lỗi lúc chạy.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Input schema</strong>: bản mô tả JSON các tham số tool nhận: tên field, kiểu, field nào bắt buộc.</li>
  <li><strong>Types</strong>: kiểu của field: string, integer, boolean, array, object.</li>
  <li><strong>Required</strong>: danh sách field Claude <strong>không được bỏ qua</strong>; mọi field khác là optional.</li>
  <li><strong>Enum</strong>: danh sách giá trị hợp lệ cố định; model chỉ được chọn trong danh sách đó.</li>
  <li><strong>Per-property description</strong>: mô tả ngắn cho từng field: nó nghĩa là gì, điền thế nào.</li>
  <li><strong>strict: true</strong>: đặt trên tool definition để tham số Claude sinh ra <strong>chắc chắn khớp schema</strong>.</li>
  <li><strong>Grammar-constrained sampling</strong>: cơ chế bên dưới strict: model không thể sinh ra giá trị vi phạm schema.</li>
</ul>

<h3>Schema làm 3 việc, và Claude trả về JSON chứ không phải câu văn</h3>
<ol>
  <li><strong>Khai báo field</strong>: liệt kê mọi tham số tool nhận, mỗi cái có tên để Claude điền vào.</li>
  <li><strong>Gán kiểu</strong>: string, integer, boolean, array hay object, để model biết đúng "hình dạng" cần đưa.</li>
  <li><strong>Đánh dấu required</strong>: những gì không có trong danh sách required đều là optional.</li>
</ol>
<p>Điểm hay làm người mới bối rối: khi Claude gọi tool, nó <strong>không</strong> gửi một câu kiểu "tôi muốn tra đơn hàng số 42". Nó gửi một <strong>JSON object khớp với schema</strong> bạn định nghĩa.
Mỗi key ứng với một field bạn khai báo, đúng kiểu bạn khai báo. Vì vậy code của bạn <strong>parse dữ liệu có cấu trúc</strong>, không phải "đào" giá trị ra từ văn bản tự do.</p>
<div class="box">📝 <strong>Hình dung thế này:</strong> Schema giống một <strong>tờ đơn in sẵn</strong> ở ngân hàng. Có ô "Số tài khoản" (chỉ điền số), ô "Loại giao dịch" với vài ô tick sẵn (enum),
ô có dấu sao đỏ là bắt buộc (required), và dòng chữ nhỏ hướng dẫn dưới mỗi ô (description). Đơn in càng rõ, người điền càng ít sai. Nhưng điền đúng mẫu chưa có nghĩa là tài khoản đó tồn tại.</div>

<h3>3 viên gạch xây schema: types, enums, descriptions</h3>
<ul>
  <li><strong>Narrow the type</strong> (thu hẹp kiểu): luôn chọn kiểu <strong>chặt nhất</strong> hợp với dữ liệu. Giá trị luôn là số thì dùng <strong>integer</strong>, đừng dùng string, để khỏi phải parse và validate lại.</li>
  <li><strong>Constrain with enums</strong>: field có tập giá trị cố định thì dùng enum thay vì string mở. Ví dụ field <code>status</code> kiểu string: Claude có thể gửi "active", "Active", "enabled"… và code bạn phải xử lý hết. Dùng enum thì model <strong>chỉ chọn được trong list</strong>.
  Ứng viên điển hình: <strong>status, priority, region code</strong>.</li>
  <li><strong>Describe each property</strong>: một mô tả ngắn cho từng field giúp giảm mạnh tham số mơ hồ hoặc sai định dạng.</li>
</ul>

<h3>Đừng đánh dấu required quá tay</h3>
<ul>
  <li>Chỉ để vào required những field <strong>không có giá trị mặc định an toàn</strong>, thứ tool thật sự không chạy được nếu thiếu. Ví dụ: <strong>user ID</strong> cho một lookup.</li>
  <li>Field có default hợp lý, hoặc tool vẫn chạy được khi thiếu → để <strong>optional</strong>.</li>
  <li>Lý do: nếu field là required mà Claude không có giá trị rõ ràng, model sẽ <strong>dừng lại hỏi người dùng</strong> thay vì làm tiếp. Required quá nhiều biến một lần gọi trơn tru thành một lần bị ngắt.</li>
</ul>

<h3>strict: từ "định hướng mạnh" thành "bảo đảm cứng"</h3>
<ul>
  <li>Không có strict: schema tốt <strong>định hướng mạnh</strong> tham số, nhưng chưa phải bảo đảm.</li>
  <li><strong>strict: true</strong>: dùng grammar-constrained sampling, nên <strong>thiếu field required</strong> và <strong>sai kiểu</strong> đơn giản là không xảy ra.</li>
  <li>Có thể kết hợp với <strong>forcing tool use</strong>: vừa bảo đảm tool được gọi, vừa bảo đảm input hợp lệ theo schema.</li>
  <li>Đáng dùng khi việc xử lý một lần gọi sai định dạng <strong>tốn kém</strong>.</li>
</ul>
<p><strong>Nhưng:</strong> schema-valid chỉ nghĩa là đúng kiểu và đủ field required. Claude vẫn có thể gửi một <strong>customer ID hợp lệ nhưng không tồn tại</strong>, hoặc một action hợp lệ nhưng <strong>không được phép ở trạng thái hiện tại</strong>.
Đó là <strong>hai lớp kiểm tra khác nhau</strong>: schema kiểm tra hình dạng, còn runtime mới biết kết quả có thành công không.</p>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có field nhận giá trị kiểu "active / Active / enabled" lộn xộn → đáp án đúng là <strong>dùng enum</strong>.</li>
  <li>Đề nói Claude <strong>cứ dừng lại hỏi người dùng</strong> dù tool có thể dùng default → đáp án là <strong>bớt field required</strong>, để optional.</li>
  <li>Đề cần <strong>bảo đảm</strong> tham số luôn khớp schema (không thiếu field, không sai kiểu) → <strong>strict: true</strong>, có thể kèm forcing tool use.</li>
  <li>Đề có tham số đúng schema nhưng tool vẫn fail (ID không tồn tại) → đáp án nhấn mạnh <strong>schema-valid ≠ correct</strong>, vẫn phải xử lý lỗi runtime.</li>
  <li>Đề có giá trị luôn là số nhưng khai báo string → <strong>narrow the type</strong> sang integer.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Claude trả về một câu mô tả, code tự trích giá trị ra" → <strong>sai</strong>, Claude trả về JSON object khớp schema.</li>
  <li>"Đánh dấu required hết cho an toàn" → <strong>sai</strong>, required thừa khiến model dừng lại hỏi người dùng.</li>
  <li>"Bật strict là tool chắc chắn chạy thành công" → <strong>sai</strong>, strict chỉ bảo đảm hình dạng, không bảo đảm kết quả runtime.</li>
  <li>"Status để string là đủ, mô tả kỹ là được" → <strong>sai</strong>, giá trị phân loại cố định nên dùng enum để chặn từ tầng schema.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Types định hình, enums khóa lựa chọn, required giữ thứ thiết yếu, strict biến tất cả thành bảo đảm.</strong> Nhưng <strong>đúng mẫu đơn ≠ giao dịch thành công</strong>.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
