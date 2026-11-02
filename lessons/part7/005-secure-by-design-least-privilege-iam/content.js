window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Bảo mật xây <strong>từ đầu</strong> thì rẻ, vá <strong>về sau</strong> thì đau. Hãy thiết kế agent theo <strong>least privilege</strong>: quyền không cần thì <strong>không cấp</strong>, chứ không phải cấp rồi ngồi canh.
<strong>IAM</strong> chia quyền theo <strong>từng user, từng agent, từng tool</strong>, và mọi request phải được authenticate rồi authorize.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Secure by design</strong>: đưa privacy, identity, access control vào làm <strong>mặc định kiến trúc</strong> ngay từ đầu, không đợi có sự cố.</li>
  <li><strong>Least privilege</strong>: chỉ cấp cho agent, tool, identity <strong>quyền tối thiểu</strong> cần cho việc; bỏ hết phần còn lại, để attack surface nhỏ.</li>
  <li><strong>IAM</strong> (Identity and Access Management): hệ thống và policy xác định mỗi identity là ai và được chạm tới đâu.</li>
  <li><strong>Bolt-on security</strong>: bảo mật "gắn thêm" sau khi sản phẩm chạy rồi: filter, review, monitoring phủ lên kiến trúc vốn cấp quyền rộng.</li>
  <li><strong>Built-in security</strong>: least privilege, isolation, ranh giới cứng có mặt từ ngày đầu.</li>
  <li><strong>Confidentiality / Integrity / Privacy</strong>: ai được đọc / ai được sửa / dùng dữ liệu cá nhân hợp pháp, tối thiểu, có đồng ý.</li>
  <li><strong>Authentication vs authorization</strong>: xác minh <strong>bạn là ai</strong> vs quyết định <strong>bạn được làm gì</strong>.</li>
</ul>

<h3>Vì sao thời điểm quan trọng: bolt-on vs built-in</h3>
<p>Nếu bạn xây agent giả định có quyền truy cập rộng, các đường injection và leakage đã được <strong>thiết kế sẵn vào</strong> trước khi có control nào. Giai đoạn "hardening" về sau thường chỉ <strong>lọc triệu chứng</strong>: thêm một bước kiểm tra nội dung chỗ này, một dòng log chỗ kia, trong khi kiến trúc bên dưới vẫn trao nhiều quyền hơn mức cần. Và quyền rộng đã cấp sớm thì <strong>gần như không bao giờ bị thu lại</strong>.</p>
<ul>
  <li><strong>Bolt-on</strong>: luôn hỏi "làm sao <strong>canh</strong> cái quyền nguy hiểm này".</li>
  <li><strong>Built-in</strong>: quyền đó <strong>chưa từng được cấp</strong>, nên chẳng có gì nguy hiểm để canh. Hãy thiết kế theo kiểu này.</li>
</ul>

<h3>Least privilege làm thật như thế nào</h3>
<ul>
  <li>Mỗi tool chỉ có <strong>scope nó cần</strong>: tool đọc lịch thì không có quyền ghi vào database.</li>
  <li><strong>Giữ lại secret và permission</strong> mà task không đụng tới: model không thể làm lộ API key mà nó chưa từng được đưa.</li>
  <li>Ưu tiên <strong>tool hẹp, đúng mục đích</strong> hơn tool mở: một shell chạy được mọi thứ rủi ro lớn hơn nhiều so với một tool nhỏ làm đúng một việc.</li>
  <li>Kết quả: agent bị chiếm chỉ thừa hưởng <strong>đúng những gì bạn đã cấp</strong>.</li>
</ul>
<div class="box">🔑 <strong>Hình dung thế này:</strong> Bạn thuê người giúp việc tưới cây. Đưa họ <strong>chìa khoá cả nhà lẫn két sắt</strong> rồi lắp camera theo dõi (log) hay dặn "mở két thì gọi tôi trước" (hỏi xác nhận) đều là canh chừng. Cách đúng là <strong>chỉ đưa chìa khoá cổng sau ra vườn</strong>. Két không có chìa thì chẳng có gì để canh.</div>
<p>Sai lầm hay gặp nhất, với ví dụ agent có quyền <strong>xoá rộng</strong>:</p>
<ol>
  <li><strong>Log lại</strong> mỗi lần dùng: quyền vẫn nằm đó cho kẻ tấn công tiếp theo; log sau sự việc không chặn được gì. (yếu)</li>
  <li><strong>Hỏi user xác nhận</strong> trước khi chạy: đó là ma sát, không phải ranh giới; người ta bấm approve theo quán tính. (yếu)</li>
  <li><strong>Bỏ hẳn quyền đó</strong>: không còn gì để giám sát, không còn gì cho injection lạm dụng. (đúng)</li>
</ol>

<h3>IAM trong hệ agent: chia ba cấp</h3>
<ul>
  <li><strong>Per user</strong>: người gọi chỉ chạm được dữ liệu của chính mình, không đọc được hồ sơ người khác.</li>
  <li><strong>Per agent</strong>: một agent bị chiếm chỉ thừa hưởng vai trò hẹp của nó.</li>
  <li><strong>Per tool</strong>: mỗi tool chỉ tới đúng backend nó được xây để dùng.</li>
  <li><strong>Anti-pattern</strong>: một <strong>service identity rộng dùng chung</strong> cho mọi tool và agent; một lần bị chiếm là mở toang mọi thứ.</li>
</ul>
<p>Ba thuộc tính đừng gộp làm một: lộ dữ liệu được bảo vệ, dù bằng cách nào, phá <strong>confidentiality</strong>; sửa trộm một record, dù không đọc, phá <strong>integrity</strong>; <strong>privacy</strong> là dùng dữ liệu đúng mục đích người ta đồng ý. Control bảo vệ một thuộc tính <strong>không tự động</strong> bảo vệ hai cái kia. Còn identity bạn đã chia theo user/agent/tool chỉ có ý nghĩa khi <strong>mọi request được authenticate</strong> là một trong số đó và <strong>mọi thao tác được authorize</strong> theo vai trò hẹp. Agent bị chiếm dù cầm credential hợp lệ vẫn thấy vai trò của nó gần như không cho làm gì.</p>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề hỏi "agent có quyền nguy hiểm không cần thiết, làm gì" → <strong>gỡ bỏ quyền</strong>, không phải thêm log hay hộp thoại xác nhận.</li>
  <li>Đề có một service account chung cho mọi tool/agent → đó là <strong>anti-pattern</strong>, đáp án là scope <strong>per user, per agent, per tool</strong>.</li>
  <li>Đề hỏi khi nào đưa bảo mật vào → <strong>từ phiên bản thiết kế đầu tiên</strong> (secure by design).</li>
  <li>Đề có caller đã đăng nhập hợp lệ đòi làm việc ngoài vai trò → <strong>authorization</strong> vẫn phải chặn.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Log mọi lần agent xoá là đủ least privilege" → <strong>sai</strong>, đó là giám sát, quyền vẫn còn đó.</li>
  <li>"Hỏi user xác nhận là ranh giới an toàn" → <strong>sai</strong>, đó là ma sát, người ta approve theo quán tính.</li>
  <li>"Làm tính năng trước, hardening sau" → <strong>sai</strong>, hardening sau chỉ lọc triệu chứng, quyền rộng hiếm khi được thu lại.</li>
  <li>"Đã authenticate thì được phép" → <strong>sai</strong>, authentication không bao giờ tự là permission.</li>
  <li>"Bảo vệ confidentiality là bảo vệ luôn integrity" → <strong>sai</strong>, ba thuộc tính cần control riêng.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Đừng canh con dao, đừng đưa con dao.</strong> Authentication chứng minh bạn là ai, authorization vẫn gác <strong>từng</strong> hành động.</p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
