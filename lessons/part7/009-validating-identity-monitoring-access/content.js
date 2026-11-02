window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Trước khi agent làm một việc có quyền cao, phải <strong>chứng minh ai đang gọi</strong> (authentication) và <strong>quyết định người đó được làm gì</strong> (authorization), rồi <strong>xin người duyệt</strong> nếu việc đó rủi ro.
<strong>Monitoring</strong> chỉ <strong>phát hiện</strong> lạm dụng, không <strong>ngăn</strong> được nó: monitoring là chuông báo động, authorization mới là ổ khoá.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Authentication (AuthN)</strong>: xác minh <strong>ai</strong> đang gọi, qua login, token hoặc key.</li>
  <li><strong>Authorization (AuthZ)</strong>: quyết định identity đã xác minh <strong>được làm gì</strong>, kiểm từng hành động theo quyền.</li>
  <li><strong>Access approval</strong>: thao tác nhạy cảm cần <strong>người ký duyệt rõ ràng</strong> trước khi chạy.</li>
  <li><strong>Human in the loop</strong>: một người xác nhận hành động tác động lớn trước khi nó chạy.</li>
  <li><strong>Per-action authorization</strong>: kiểm quyền cho <strong>từng</strong> lời gọi nhạy cảm, tại hệ thống downstream.</li>
  <li><strong>SSO (single sign-on)</strong>: tập trung đăng nhập, quản lý identity ở một nơi.</li>
  <li><strong>Role-based permissions</strong>: mỗi identity có role chỉ cấp những năng lực cần thiết.</li>
  <li><strong>Audit trail</strong>: bản ghi ai truy cập gì, khi nào; dùng cho compliance và phát hiện bất thường.</li>
</ul>

<h3>AuthN hỏi "ai", AuthZ hỏi "được làm gì": cần cả hai</h3>
<ul>
  <li><strong>Authentication</strong> chỉ trả lời câu hỏi danh tính, <strong>không nói gì về quyền</strong>.</li>
  <li><strong>Authorization</strong> là câu hỏi thứ hai: identity này có được làm <strong>đúng hành động đang yêu cầu</strong> không.</li>
  <li>Chỉ làm bước một thì bạn biết ai đang gọi, nhưng chưa nói gì về việc họ có được phép không. Đó là chỗ rắc rối bắt đầu.</li>
  <li>Gộp hai khái niệm này làm một là <strong>lỗ hổng phổ biến nhất</strong>.</li>
</ul>

<h3>Bẫy lớn: đăng nhập hợp lệ ≠ có quyền truy cập</h3>
<p>Nhiều developer coi việc đăng nhập thành công là "đèn xanh" cho mọi thứ tiếp theo. Sai. <strong>Login hợp lệ chứng minh danh tính, không chứng minh quyền</strong> làm một hành động cụ thể.</p>
<ul>
  <li>Hãy <strong>kiểm quyền cho từng hành động nhạy cảm</strong>, mỗi lần đều hỏi: identity này có được làm việc này không.</li>
  <li>Kiểm tại <strong>hệ thống downstream</strong>, nơi thật sự giữ dữ liệu hay năng lực, chứ <strong>không tin model tự kiểm soát</strong>.</li>
  <li>Model có thể bị dụ để <strong>xin</strong> một thứ; chính lớp kiểm quyền downstream mới <strong>từ chối phục vụ</strong>.</li>
</ul>
<div class="box">🏨 <strong>Hình dung thế này:</strong> Ở khách sạn, quầy lễ tân kiểm <strong>CMND</strong> của bạn (authentication). Nhưng thẻ phòng chỉ mở <strong>đúng phòng bạn thuê</strong> (authorization), không mở phòng người khác hay két của khách sạn.
Muốn vào kho tiền thì phải có <strong>quản lý ký duyệt</strong> (approval). Còn camera hành lang (monitoring) chỉ ghi lại, không chặn ai mở cửa.</div>

<h3>Thứ tự ba cổng: validate → authorize → approve</h3>
<ol>
  <li><strong>Validate identity</strong>: xác nhận người gọi bằng credential đã được chứng minh.</li>
  <li><strong>Authorize the action</strong>: kiểm identity cụ thể này có được làm thao tác cụ thể này không, thu hẹp theo <strong>least privilege</strong>.</li>
  <li><strong>Approve when warranted</strong>: với thao tác rủi ro cao như <strong>xoá dữ liệu, chuyển tiền, thay đổi ai có quyền truy cập</strong>, chuyển cho người duyệt <strong>trước khi</strong> chạy, thường bằng cách đẩy lên <strong>permission dialog</strong>.</li>
</ol>
<p>Mỗi bước là <strong>một cổng riêng</strong>, mỗi cổng tự dừng được hành động. Bỏ một cổng là để hở một cánh cửa mà hai cổng còn lại không đóng thay được. Lưu ý: <strong>approval là enforcement và phải xảy ra trước</strong>. Ký duyệt sau khi đã làm thì không phải approval, chỉ là một bản ghi.</p>

<h3>Quản lý identity trong thực tế</h3>
<ul>
  <li><strong>Single sign-on</strong>: tập trung login, kèm <strong>domain capture</strong> và <strong>managed policy</strong> trên gói enterprise, thay vì login rải rác không ai audit được.</li>
  <li><strong>Role-based permissions</strong>: role hẹp chỉ tạo được một loại key hẹp, role đầy đủ làm được nhiều hơn. Đó là least privilege ở tầng identity.</li>
  <li><strong>Least privilege</strong>: chỉ cấp tối thiểu, nên nếu identity bị chiếm thì nó thừa hưởng rất ít để lạm dụng.</li>
</ul>

<h3>Monitoring: phát hiện, không kiểm soát</h3>
<ul>
  <li>Logging ai truy cập gì cho bạn <strong>biết</strong> về lạm dụng, nhưng <strong>không ngăn</strong> nó. Passive logging không bao giờ chặn hành động.</li>
  <li>Nếu thứ duy nhất đứng giữa agent và thao tác nguy hiểm là "sau này sẽ thấy trong log", bạn <strong>không có kiểm soát nào</strong>, chỉ có <strong>bản ghi thiệt hại</strong>.</li>
  <li>Monitoring vẫn có giá trị: tạo <strong>audit trail</strong> cho compliance và trả lời câu hỏi sau sự cố, và theo dõi <strong>bất thường</strong> trong truy cập được phép, kể cả khi từng hành động trông hợp lệ.</li>
  <li>Một cổng <strong>chặn</strong> việc sửa cấu hình giữa phiên là <strong>enforcement</strong>, không phải monitoring. Hễ chặn là đã thành enforcement.</li>
  <li>Log chỉ có ích khi <strong>có người đọc</strong>: review định kỳ, vì audit log không ai xem thì không bắt được gì.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có user đã login rồi làm được việc vượt quyền → đáp án đúng là thêm <strong>per-action authorization</strong> tại downstream.</li>
  <li>Đề có thao tác <strong>xoá dữ liệu, chuyển tiền, đổi quyền</strong> → <strong>human approval trước khi chạy</strong> (permission dialog).</li>
  <li>Đề đề xuất "chỉ cần log lại để phát hiện" làm biện pháp ngăn chặn → <strong>sai</strong>; cần <strong>authorization / enforcement</strong>, monitoring chỉ là lớp phát hiện ở trên.</li>
  <li>Đề hỏi thứ tự → <strong>validate → authorize → approve</strong>, rồi <strong>monitor</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Đã authenticate thì được phép làm" → <strong>sai</strong>, login hợp lệ không phải quyền truy cập.</li>
  <li>"Để model tự kiểm tra quyền trong prompt" → <strong>sai</strong>, model có thể bị dụ; kiểm ở hệ thống downstream.</li>
  <li>"Ghi log sau khi thực hiện cũng tính là approval" → <strong>sai</strong>, approval phải xảy ra trước, sau đó chỉ là bản ghi.</li>
  <li>"Có monitoring đầy đủ là đủ an toàn" → <strong>sai</strong>, monitoring chỉ phát hiện; và log không ai đọc thì vô dụng.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>"Ai → Được gì → Ai duyệt → Ai xem lại."</strong> Monitoring là <strong>chuông báo</strong>, authorization là <strong>ổ khoá</strong>.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
