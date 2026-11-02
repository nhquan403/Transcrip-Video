window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> <strong>Effort</strong> là núm chỉnh "Claude làm việc chăm chỉ tới mức nào" cho một response, gồm 5 mức từ <strong>low</strong> tới <strong>max</strong>.
Bỏ trống thì mặc định là <strong>high</strong> (đã ở nửa trên, không phải ở giữa). Effort nằm <strong>lồng bên trong output config</strong>, không phải field cấp cao nhất,
và hai mức trên cùng <strong>xhigh, max</strong> không có trên mọi model.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Effort</strong>: mức công sức model bỏ ra cho một response: tăng lên thì suy luận nhiều hơn, chậm hơn, đắt hơn; giảm xuống thì ngược lại.</li>
  <li><strong>Output config</strong>: nơi chứa thiết lập effort; effort là <strong>nested setting</strong>, không đặt ở gốc request.</li>
  <li><strong>low / medium / high</strong>: ba mức an toàn, dùng được gần như ở mọi model; <strong>high là mặc định</strong>.</li>
  <li><strong>xhigh</strong>: làm thêm nhiều hơn high, <strong>bị giới hạn</strong> ở một số model.</li>
  <li><strong>max</strong>: mức nhiều công sức nhất, có danh sách model hỗ trợ <strong>riêng</strong>.</li>
  <li><strong>Latency / cost trade-off</strong>: đánh đổi giữa chất lượng câu trả lời với thời gian và tiền.</li>
</ul>

<h3>Cái thang 5 bậc</h3>
<ol>
  <li><strong>low</strong>: ít công sức nhất, nhanh nhất, rẻ nhất.</li>
  <li><strong>medium</strong>: mức giữa.</li>
  <li><strong>high</strong>: <strong>mặc định</strong>, đã nằm ở dải trên, không phải chính giữa.</li>
  <li><strong>xhigh</strong>: thêm công sức, chỉ trên một số model.</li>
  <li><strong>max</strong>: nhiều công sức nhất model có thể bỏ ra.</li>
</ol>
<p>Điều cần thấm: đây <strong>không phải</strong> các bậc chất lượng "tốt, tốt hơn, tốt nhất" của các model khác nhau. Đây là các bậc <strong>công sức và chi phí trên cùng một model</strong>.
Mỗi bậc lên mua thêm sự kỹ lưỡng, và bạn trả bằng <strong>thời gian và tiền</strong>.</p>
<div class="box">🏃 <strong>Hình dung thế này:</strong> Effort như bảo cùng một nhân viên "làm nhanh gọn" hay "làm kỹ từng chi tiết".
Phân loại email đơn giản thì bảo làm kỹ hết mức là phí tiền; còn sửa một con bug khó thì đáng để họ đào sâu.</div>

<h3>Kéo núm effort thì thay đổi gì?</h3>
<ul>
  <li><strong>Effort cao</strong>: model suy luận nhiều hơn; trong agent, nó gọi tool <strong>kỹ hơn</strong>, khám phá nhiều hơn, viết nhiều hơn rồi mới hài lòng. Đổi lại: <strong>thêm latency và cost</strong>.</li>
  <li><strong>Effort thấp</strong>: model chủ động làm ít hơn: <strong>gộp các lần gọi tool</strong> thay vì gọi cả chục lần, bớt phần dạo đầu, trả lời <strong>nhanh và rẻ hơn</strong>. Đổi lại: mất chút chiều sâu.</li>
  <li>Không đầu nào "đúng" một cách chung chung: <strong>khớp núm với độ khó của việc</strong>.</li>
</ul>

<h3>Đỉnh thang không phổ biến ở mọi model</h3>
<ul>
  <li><strong>xhigh</strong>: có trên <strong>Fable 5, Opus 5, Opus 4.8, Sonnet 5</strong>. Dùng trên model cũ hơn → request <strong>lỗi</strong>.</li>
  <li><strong>max</strong>: có trên <strong>Sonnet 5, Sonnet 4.6, Fable 5, Opus 4.6 trở lên</strong>.</li>
  <li>Chú ý sự <strong>bất đối xứng</strong>: max "với" về các model cũ xa hơn xhigh; hai mức có <strong>danh sách hỗ trợ độc lập</strong>.</li>
  <li>Dùng mức không được hỗ trợ → nhận <strong>lỗi</strong>, <strong>không</strong> bị hạ cấp lặng lẽ.</li>
</ul>

<h3>Lỗi phổ biến nhất: đặt effort sai chỗ</h3>
<ul>
  <li>Nhiều người đặt effort <strong>ở gốc request</strong>, cạnh <code>model</code> và <code>messages</code>. <strong>Sai chỗ</strong>: nó phải <strong>lồng dưới output config</strong>.</li>
  <li>Bỏ trống effort = <strong>high</strong>, nên <strong>im lặng không phải trung lập</strong>.</li>
  <li>Checklist ngắn: <strong>gọi tên model → chọn mức → lồng đúng chỗ</strong>.</li>
</ul>

<h3>Ba đòn bẩy và thứ tự dùng</h3>
<ul>
  <li><strong>Fast mode</strong> tối ưu <strong>latency</strong> (giá premium, không đổi năng lực). <strong>Thinking</strong> tối ưu <strong>chất lượng suy luận</strong>. <strong>Effort</strong> tối ưu <strong>bên trong một model</strong>, đánh đổi trí tuệ với latency và cost. Có thể kết hợp chúng.</li>
  <li>Task chưa đủ tốt? <strong>Tăng effort trước</strong> (nhẹ, thường rẻ và đơn giản hơn), <strong>đổi sang model mạnh hơn sau</strong> khi effort không đủ.</li>
  <li>Thực tế: <strong>real-time / nhạy chi phí / khối lượng lớn</strong> → effort thấp, model nhẹ hơn, hoặc cả hai. <strong>Cần chất lượng model lớn nhưng chậm</strong> → fast mode trên Opus 5. <strong>Suy luận khó, debug thật</strong> → bật adaptive thinking + tăng effort.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có <strong>"đặt effort nhưng không có tác dụng"</strong> → đáp án đúng là <strong>chuyển effort vào trong output config</strong>.</li>
  <li>Đề có <strong>"không đặt effort thì model dùng mức nào?"</strong> → <strong>high</strong>.</li>
  <li>Đề có <strong>"dùng xhigh/max trên model cũ bị lỗi"</strong> → model đó <strong>không hỗ trợ</strong>; kiểm tra danh sách hỗ trợ.</li>
  <li>Đề có <strong>"chất lượng chưa đủ, chọn bước đầu tiên"</strong> → <strong>tăng effort</strong> trước khi đổi model.</li>
  <li>Đề có <strong>"phân loại nhanh, khối lượng lớn, nhạy chi phí"</strong> → <strong>effort thấp</strong> và/hoặc model nhẹ.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Effort là field cấp cao nhất cạnh model" → <strong>sai</strong>, nó nằm trong output config.</li>
  <li>"Bỏ trống effort là mức trung bình" → <strong>sai</strong>, mặc định là <strong>high</strong>.</li>
  <li>"Dùng mức không hỗ trợ thì tự hạ xuống" → <strong>sai</strong>, request <strong>lỗi</strong>.</li>
  <li>"Chất lượng chưa tốt thì đổi ngay model to hơn" → <strong>chưa tối ưu</strong>, tăng effort thường là đòn bẩy đầu tiên tốt hơn.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Low → medium → HIGH (mặc định) → xhigh → max.</strong> Effort ở <strong>trong output config</strong>, và <strong>effort trước, đổi model sau</strong>.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
