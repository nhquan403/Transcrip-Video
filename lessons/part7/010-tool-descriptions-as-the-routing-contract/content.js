window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Claude chọn tool dựa vào <strong>yêu cầu của người dùng</strong> và <strong>description của tool</strong>. Description là <strong>yếu tố quan trọng nhất</strong> quyết định tool hoạt động tốt hay không.
Khi Claude chọn sai hoặc bỏ qua tool, <strong>sửa description trước</strong>, không phải đổi tên, chỉnh temperature hay đổi sang model lớn hơn.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Tool definition</strong>: gồm 3 phần: <strong>name</strong>, <strong>description</strong>, <strong>input schema</strong>.</li>
  <li><strong>Name</strong>: định danh duy nhất để code và API gọi tool; chỉ gồm chữ, số, gạch dưới và gạch ngang.</li>
  <li><strong>Description</strong>: văn xuôi nói tool làm gì, khi nào dùng, hoạt động ra sao; phần Claude <strong>đọc để quyết định có gọi hay không</strong>.</li>
  <li><strong>Input schema</strong>: một <strong>JSON Schema</strong> khai báo tham số Claude được truyền và kiểu dữ liệu.</li>
  <li><strong>Routing</strong>: việc Claude chọn tool nào cho một yêu cầu.</li>
  <li><strong>Misrouting</strong>: chọn nhầm tool hoặc bỏ qua tool đúng; nguyên nhân hàng đầu là <strong>description mơ hồ</strong>.</li>
</ul>

<h3>Ba phần, ba việc khác nhau</h3>
<ul>
  <li><strong>Name để invoke</strong>: code dùng nó để gọi tool, API dùng nó để khớp lời gọi trả về với function của bạn. Đó là việc <strong>thực thi</strong>, không phải việc <strong>chọn đường</strong>.</li>
  <li><strong>Description để route</strong>: tín hiệu ngôn ngữ tự nhiên mà Claude thật sự suy luận khi chọn giữa nhiều tool.</li>
  <li><strong>Schema để định hình tham số</strong>: nói cái gì <strong>hợp lệ về cấu trúc</strong>: field này là string, field kia bắt buộc, số này phải là integer.</li>
</ul>
<p>Schema <strong>không</strong> diễn đạt được <strong>cách dùng</strong>: khi nào gọi mới hợp lý, nên kèm field tuỳ chọn nào trong tình huống nào. Phần "khi nào và vì sao" đó <strong>chỉ sống trong description</strong>. Schema ràng buộc <strong>hình dạng</strong> đối số, description điều khiển <strong>quyết định gọi</strong>. Cần cả hai, mỗi cái một việc.</p>
<div class="box">🧑‍💼 <strong>Hình dung thế này:</strong> Description giống <strong>ghi chú bàn giao cho nhân viên mới</strong> chưa từng thấy công cụ này. Chỉ đưa một cái nhãn "Xử lý" thì họ không biết khi nào dùng.
Họ cần bối cảnh: dùng cho việc gì, khi nào nên dùng, khi nào <strong>đừng</strong> dùng vì có công cụ khác hợp hơn, và cần lưu ý gì. Tên gọi hay đến mấy cũng không thay được những ghi chú đó.</div>

<h3>Một description tốt có 4 thứ</h3>
<ol>
  <li><strong>What it does</strong>: tool làm gì, nói bằng ngôn ngữ dễ hiểu.</li>
  <li><strong>When to use it</strong>: loại yêu cầu và tình huống nào thì tool này là lựa chọn đúng.</li>
  <li><strong>When NOT to use it</strong>: phần hay bị bỏ qua. Nếu một tool khác hợp hơn cho trường hợp gần giống, nói rõ ra, để tránh nhầm giữa các tool tương tự.</li>
  <li><strong>Caveats and limits</strong>: ý nghĩa từng tham số, <strong>side effect</strong>, và giới hạn model cần tôn trọng.</li>
</ol>
<p>Viết <strong>ít nhất 3 đến 4 câu</strong>, nhiều hơn nếu tool phức tạp. Giải thích từng tham số ảnh hưởng hành vi ra sao, nêu rõ <strong>edge case</strong> thay vì hy vọng Claude tự suy ra từ cái tên. Phản xạ viết tên thật gọn kèm mô tả một dòng là thứ phải cưỡng lại: <strong>văn xuôi chi tiết luôn thắng cái tên khéo</strong>, vì tên gần như vô hình với việc routing.</p>

<h3>Ví dụ: cùng code, hành vi khác hẳn</h3>
<ul>
  <li>Tool tên <strong>GetData</strong>, description chỉ có "Data tool": Claude không biết dữ liệu gì, từ đâu, khi nào thì nên dùng nó thay vì tool khác, nên hoặc <strong>bỏ qua</strong>, hoặc <strong>gọi bừa</strong>.</li>
  <li>Tool tên <strong>SearchOrders</strong>, description "lấy các đơn hàng của một khách, dùng cho câu hỏi hỗ trợ về các lần mua trước": route gọn gàng, Claude biết khi nào dùng và truyền gì vào.</li>
  <li>Khác biệt <strong>không nằm ở code</strong>, mà hoàn toàn ở việc bạn mô tả rõ tool để làm gì và khi nào dùng.</li>
</ul>

<h3>Claude cứ bỏ qua tool? Sửa chữ trước</h3>
<ul>
  <li>Tool bị bỏ qua gần như luôn có description <strong>mỏng, thiếu thông tin</strong>.</li>
  <li>Thêm <strong>ý định</strong>, nêu rõ <strong>điều kiện áp dụng</strong>, và cho <strong>một hai ví dụ</strong> về loại yêu cầu nên kích hoạt tool.</li>
  <li>Làm việc này <strong>trước khi</strong> chỉnh temperature hay đổi sang model lớn hơn: những thứ đó hiếm khi sửa được lỗi routing.</li>
  <li>Đổi tên tool cũng hiếm khi giúp: <strong>name cho thực thi, description cho routing</strong>.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có Claude <strong>chọn nhầm tool</strong> hoặc <strong>không gọi tool</strong> → đáp án đúng thường là <strong>viết lại description</strong> rõ hơn (what, when, when not, caveats).</li>
  <li>Đề đưa lựa chọn "đổi tên tool", "tăng temperature", "dùng model lớn hơn" để sửa routing → thường là <strong>bẫy</strong>; sửa description trước.</li>
  <li>Đề có hai tool giống nhau hay bị nhầm → thêm <strong>"when not to use"</strong> chỉ sang tool kia.</li>
  <li>Đề hỏi phần nào của tool definition quyết định việc chọn tool → <strong>description</strong>, không phải name hay schema.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Đặt tên tool thật rõ là đủ" → <strong>sai</strong>, name là định danh cho thực thi, gần như vô hình với routing.</li>
  <li>"Schema chi tiết thì không cần description dài" → <strong>sai</strong>, schema chỉ nói cấu trúc hợp lệ, không nói khi nào nên gọi.</li>
  <li>"Description một dòng cho gọn" → <strong>sai</strong>, nên ít nhất 3 đến 4 câu, như ghi chú bàn giao.</li>
  <li>"Routing sai thì đổi model lớn hơn" → <strong>sai</strong>, hiếm khi sửa được; viết lại chữ trước.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>"Tên để gọi, mô tả để chọn, schema để nắn."</strong> Routing sai → <strong>sửa chữ trước khi sửa gì khác</strong>.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
