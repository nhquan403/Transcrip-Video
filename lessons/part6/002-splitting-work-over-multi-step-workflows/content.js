window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Một việc dài chạy trong <strong>một session khổng lồ</strong> sẽ tích nhiễu tới mức model mất tập trung.
Chia việc thành <strong>các bước</strong>, mỗi bước chạy trên context gọn của riêng nó và chỉ chuyển tiếp <strong>kết quả đã chưng cất</strong> cho bước sau.
Chỉ chain một cách tường minh khi bạn cần <strong>xem kết quả trung gian, ép cấu trúc pipeline, hoặc tự sửa lỗi</strong>.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Workflow</strong>: chuỗi bước do developer viết sẵn, luồng điều khiển cố định.</li>
  <li><strong>Agent</strong>: để model tự chọn hành động tiếp theo lúc runtime.</li>
  <li><strong>Prompt chaining</strong>: cách dựng workflow từ các lần gọi model; output bước này là input bước sau, nên bạn kiểm tra và điều khiển được pipeline.</li>
  <li><strong>Staged handoff</strong>: chỉ chuyển tiếp <strong>output đã chưng cất</strong> của mỗi stage, không chuyển cả working context.</li>
  <li><strong>Self-correction loop</strong>: <strong>draft → review → refine</strong> thành các lần gọi riêng.</li>
  <li><strong>Overchaining</strong>: chẻ nhỏ những việc mà model tự suy luận bên trong cũng làm tốt → thêm plumbing và latency vô ích.</li>
</ul>
<p>Phân biệt: <strong>chaining là cơ chế</strong>, <strong>staged handoff là kỷ luật</strong> giữ context mỗi bước gọn gàng.</p>

<h3>Vì sao phải chia?</h3>
<ul>
  <li>Cách 1: <strong>một session lớn dần</strong>, mang theo mọi lượt trước, cả nhiễu, tới khi chỉ dẫn quan trọng bị loãng. Ban đầu có vẻ đơn giản, nhưng xuống cấp dần.</li>
  <li>Cách 2: <strong>chuỗi bước tập trung</strong>, mỗi stage bắt đầu với context chặt, liên quan, thay vì toàn bộ lịch sử.</li>
  <li>Mỗi bước chuyển đi output đã chưng cất, không phải bản nháp, nên bước sau <strong>không phải trả tiền cho token nó không dùng</strong>.</li>
</ul>
<div class="box">🏭 <strong>Hình dung thế này:</strong> Một dây chuyền làm bánh. Trạm nhào bột không cần chuyển cả bao bột rơi vãi và dụng cụ bẩn sang trạm nướng – chỉ chuyển <strong>khối bột đã nhào</strong>.
Và trước khi chuyển, có người <strong>kiểm tra</strong> khối bột có đạt chưa, để lỗi không trôi xuống tới lò nướng.</div>

<h3>Trong chain: subagent hay inline?</h3>
<p>Câu hỏi giống bài trước, nhưng giờ nằm trong một chain:</p>
<ul>
  <li><strong>Nhiều nhiễu bỏ đi được + không chia sẻ state</strong> → <strong>subagent</strong>. Ví dụ: một stage nghiên cứu đọc 20 file chỉ để trả lời một câu hỏi; bước sau không cần nội dung file thô, chỉ cần câu trả lời.</li>
  <li><strong>Bước nhỏ mà chi tiết còn quan trọng ở sau</strong> → <strong>inline</strong>, mang state theo. Ví dụ: đổi tên một function tạo ra thay đổi mà mọi bước sau đều chạm tới; tách riêng chỉ buộc bạn phải chuyển state ngược lại.</li>
</ul>

<h3>Handoff mỏng: chuyển kết quả, không chuyển trace</h3>
<ul>
  <li>Một stage đọc 10 file để ra một quyết định → bước sau cần <strong>quyết định</strong>, không cần 10 file.</li>
  <li>Bỏ "giàn giáo" mà các bước sau không bao giờ tham chiếu; mỗi stage chỉ nhận input của chính việc nó làm.</li>
  <li>Workflow bắt đầu ì ạch, thiếu tập trung → <strong>xem lại handoff trước tiên</strong>; thường là bạn đang chuyển đi nhiều hơn mức cần.</li>
</ul>

<h3>Khi nào nên chain tường minh?</h3>
<p>Ngày nay phần lớn suy luận nhiều bước diễn ra <strong>bên trong model</strong>. Chỉ chain rõ ràng khi:</p>
<ol>
  <li>Muốn <strong>kiểm tra output trung gian</strong> trước khi bước sau chạy trên nó.</li>
  <li>Cần <strong>ép một cấu trúc pipeline</strong> lặp lại được, thay vì để model tự ứng biến đường đi.</li>
  <li>Muốn <strong>self-correction</strong>: draft, rồi review theo tiêu chí rõ ràng (như soát bài đồng nghiệp), rồi refine đúng các lỗi review tìm ra. Tách thành các lần gọi riêng cho bạn quyền <strong>log, đánh giá, rẽ nhánh</strong> – thứ mà một lần gọi gộp sẽ che mất.</li>
</ol>
<p>Không rơi vào trường hợp nào → để model tự xử lý các bước bên trong, đỡ phải làm plumbing.</p>

<h3>Ba thói quen cho handoff đáng tin</h3>
<ul>
  <li><strong>Distill before passing</strong>: tóm mỗi stage xuống output "chịu lực" trước khi bước sau thấy.</li>
  <li><strong>Validate between stages</strong>: kiểm tra output theo luật của bạn để lỗi bị bắt sớm, không lan đi.</li>
  <li><strong>Keep steps independent</strong>: mỗi stage chỉ cần input của nó, không cần toàn bộ lịch sử → dễ test, đổi thứ tự, debug.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có một session dài, chỉ dẫn bị loãng, model mất tập trung → <strong>chia thành các stage với staged handoff</strong>.</li>
  <li>Đề muốn xem/kiểm tra kết quả giữa chừng, hoặc ép quy trình cố định → <strong>prompt chaining tường minh</strong>.</li>
  <li>Đề nói về chất lượng tự cải thiện có kiểm soát → <strong>draft → review → refine</strong> thành các call riêng.</li>
  <li>Đề có workflow chậm, thiếu tập trung → kiểm tra <strong>handoff đang chuyển quá nhiều context</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Chuyển toàn bộ working trace sang bước sau cho chắc" → <strong>sai</strong>, kéo nhiễu của mọi bước vào bước sau.</li>
  <li>"Chia càng nhiều bước càng tốt" → <strong>sai</strong>, overchaining thêm plumbing và latency vô ích.</li>
  <li>"Một session lớn đơn giản hơn nên tốt hơn" → <strong>sai</strong>, nó xuống cấp khi nhiễu tích tụ.</li>
  <li>"Bước nào cũng nên tách thành subagent" → <strong>sai</strong>, bước có state mà các bước sau dùng thì nên inline.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>"Chưng cất – kiểm tra – chuyển đi."</strong> Chỉ chain khi cần <strong>xem, ép khuôn, hoặc tự sửa</strong>; chia để có tập trung, không phải theo phản xạ.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
