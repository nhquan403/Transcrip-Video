window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Một request hỏng và một câu trả lời tệ nhìn từ ngoài giống hệt nhau, nhưng chúng nằm ở <strong>hai tầng khác nhau</strong>: <strong>integration layer</strong> (code của bạn) và <strong>model output</strong> (thứ Claude sinh ra).
Hãy đọc <strong>trace</strong> từ ngoài vào trong để <strong>cô lập tầng bị lỗi trước</strong>, rồi mới sửa đúng chỗ đó.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Trace</strong>: bản ghi theo thứ tự mọi thứ đã xảy ra: prompt, tool call, tool result, thinking, lỗi.</li>
  <li><strong>Trace analysis</strong>: đọc trace từ trên xuống để tìm điểm đầu tiên hành vi lệch khỏi ý định.</li>
  <li><strong>Problem origin isolation</strong>: khoanh vùng lỗi vào <strong>một tầng</strong> trước khi sửa dòng code nào.</li>
  <li><strong>Origin evidence</strong>: dấu hiệu giữa trace chỉ ra tầng bị lỗi: tool argument sai, tool result rỗng, response bị cắt.</li>
  <li><strong>Integration layer</strong>: mọi thứ bao quanh model: API request, endpoint, auth, parse response, tool harness.</li>
  <li><strong>Model output</strong>: chính phần sinh ra, đi trên một response <strong>200</strong> thành công.</li>
  <li><strong>stop_reason</strong>: trên một 200 sạch, cho biết model kết thúc tự nhiên, hết token, từ chối hay dừng vì lý do khác.</li>
</ul>

<h3>Hai tầng, cùng một kết quả tệ</h3>
<ul>
  <li><strong>Integration layer</strong> hỏng → bạn nhận <strong>HTTP status từ 400 trở lên</strong>, hoặc một <strong>lỗi transport trong event stream</strong>. Request không tạo ra câu trả lời dùng được.</li>
  <li><strong>Model output</strong> hỏng → integration chạy tốt, response 200, nhưng nội dung hoặc stop_reason cho thấy câu trả lời sai, bị từ chối hoặc bị cắt.</li>
  <li>Cách sửa phụ thuộc hoàn toàn vào việc bạn đang ở tầng nào.</li>
</ul>
<div class="box">🩺 <strong>Hình dung thế này:</strong> Bạn gọi đồ ăn mà nhận được món dở. Có thể <strong>shipper làm đổ</strong> hoặc giao nhầm địa chỉ (integration: đường đi hỏng), cũng có thể <strong>bếp nấu dở</strong> (model output: đường đi ổn, món ăn mới có vấn đề). Đổi shipper không làm món ngon hơn, và dạy lại đầu bếp không giúp shipper hết làm đổ. Kiểm tra từ ngoài vào: gói hàng còn nguyên không, rồi mới nếm món.</div>

<h3>Đọc trace từ ngoài vào trong, từng checkpoint</h3>
<ol>
  <li><strong>HTTP status</strong>: 4xx hoặc 5xx → integration layer; rẽ nhánh theo error type để chọn cách khắc phục.</li>
  <li>Nếu là <strong>200, đừng dừng</strong>: đọc <strong>event stream</strong>. Khi streaming, status code trả về <strong>ngay từ đầu</strong>, trước khi sinh xong, nên lỗi giữa chừng chỉ hiện được <strong>bên trong stream</strong>. Lỗi đó vẫn là integration failure dù status nói 200.</li>
  <li>200 sạch có nội dung → xem <strong>stop_reason</strong> và thứ model thật sự trả về.</li>
  <li>Có <strong>tool call ném exception hoặc trả về rỗng</strong> → chỉ thẳng về <strong>harness của bạn</strong>.</li>
</ol>
<p>Dừng ở <strong>checkpoint đầu tiên giải thích được sự lệch hướng</strong>. Checkpoint đó là origin.</p>

<h3>Ba giá trị stop_reason báo lỗi ở model output</h3>
<ul>
  <li><strong>max_tokens</strong>: chạm giới hạn bạn đặt; bị cắt nhưng hợp lệ.</li>
  <li><strong>model_context_window_exceeded</strong>: lấp đầy tổng context window của model, không phải giới hạn bạn yêu cầu.</li>
  <li><strong>refusal</strong>: Claude từ chối vì chính sách; <strong>stop_details</strong> chứa category.</li>
</ul>
<p>Bài này chỉ cần <strong>nhận ra tín hiệu</strong>: thấy một trong ba giá trị này là đã cô lập lỗi vào tầng model output.</p>

<h3>Thủ phạm thường gặp ở mỗi tầng</h3>
<ul>
  <li><strong>Integration</strong>: request sai định dạng, gọi nhầm endpoint, <strong>parse response sai</strong> làm hỏng câu trả lời trước khi app thấy, lỗi auth, billing, rate limit, và với agent là <strong>tool ném exception hoặc trả rỗng</strong>. Model có thể đã làm hoàn hảo, nên sửa harness, <strong>đừng vội viết lại prompt</strong>.</li>
  <li><strong>Model output</strong>: chọn kế hoạch sai dù đủ thông tin, đọc nhầm tool result rồi đưa giá trị sai vào bước sau, chọn tool argument sai, refusal, hoặc output bị cắt. Không có HTTP error nào, nên <strong>retry mạng vô ích</strong>. Đây là vấn đề <strong>prompt và eval</strong>: cải thiện instruction, thêm ví dụ, siết context, chạy eval để đo thay đổi có giúp không.</li>
</ul>

<h3>Eval fail: agent sai hay grader sai?</h3>
<ul>
  <li><strong>Agent sai thật</strong>: transcript cho thấy suy luận lỗi, tool call sai, đọc nhầm kết quả → sửa prompt hoặc model.</li>
  <li><strong>Agent đúng nhưng grader/harness chấm sai</strong> → đó là <strong>integration bug trong eval</strong>, không phải lỗi model.</li>
  <li>Cách phân biệt đáng tin: <strong>đọc transcript</strong>, kiểm tra cả <strong>quá trình</strong> agent làm và <strong>kết quả cuối</strong> trong môi trường.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có <strong>HTTP 4xx/5xx</strong> → integration layer, rẽ nhánh theo error type.</li>
  <li>Đề có "streaming, status 200 nhưng lỗi giữa chừng" → <strong>streamed error event</strong>, vẫn là integration.</li>
  <li>Đề có "200 sạch nhưng stop_reason là max_tokens / refusal / model_context_window_exceeded" → <strong>model output</strong>.</li>
  <li>Đề có "tool trả rỗng hoặc ném exception" → sửa <strong>harness</strong>, không sửa prompt.</li>
  <li>Đề có "eval fail nhưng câu trả lời có vẻ đúng" → <strong>đọc transcript</strong>, có thể grader sai.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Chỉ cần kiểm tra status 200 là đủ" → <strong>sai</strong>, lỗi có thể tới muộn trong stream.</li>
  <li>"Câu trả lời trông sai thì viết lại prompt" → <strong>sai</strong> nếu lỗi do parse response hoặc tool harness.</li>
  <li>"Model chọn sai kế hoạch thì retry request" → <strong>sai</strong>, retry y nguyên chỉ ra lại câu trả lời cũ; đây là việc của prompt và eval.</li>
  <li>"Eval fail nghĩa là model kém" → <strong>sai</strong>, grader có thể chấm sai một câu trả lời hợp lệ.</li>
  <li>"Chỉ cần xem output cuối cùng" → <strong>sai</strong>, bằng chứng nằm trong cả trace.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Shipper làm đổ thì sửa đường giao, bếp nấu dở thì sửa công thức.</strong> Status và stream → integration; stop_reason trên 200 → model; <strong>cô lập trước, sửa sau</strong>.</p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
