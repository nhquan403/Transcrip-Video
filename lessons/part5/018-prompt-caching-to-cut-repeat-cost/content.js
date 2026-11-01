window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Prompt caching cho phép <strong>tái dùng một prefix</strong> model đã xử lý, thay vì trả tiền xử lý lại mỗi lần.
Bạn trả <strong>phụ phí một lần khi ghi</strong> (write), đổi lại <strong>mỗi lần đọc</strong> (read) chỉ tốn <strong>10%</strong> giá input gốc. Nó chỉ có lời khi prefix <strong>lớn, ổn định và được dùng lại đủ nhiều</strong>.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Prompt caching</strong>: tái dùng prefix đã xử lý để không phải dựng lại phần context lớn, ổn định ở mỗi call.</li>
  <li><strong>Cache write</strong>: chi phí một lần để lưu prefix mới, cao hơn giá input gốc.</li>
  <li><strong>Cache read</strong> (cache hit): phục vụ từ prefix đã lưu, <strong>10%</strong> giá input gốc.</li>
  <li><strong>5-minute TTL</strong> (mặc định, ephemeral): ghi tốn <strong>+25%</strong> (1.25×).</li>
  <li><strong>1-hour TTL</strong>: đặt type ephemeral và ttl một giờ; ghi tốn <strong>gấp đôi</strong> (2×).</li>
  <li><strong>Break-even</strong>: điểm mà các lần read rẻ đã bù đủ phụ phí write.</li>
  <li><strong>Minimum token floor</strong>: prefix dưới ngưỡng tối thiểu của model sẽ <strong>âm thầm không được cache</strong>.</li>
</ul>

<h3>Cái gì nên cache?</h3>
<div class="box">🍲 <strong>Hình dung thế này:</strong> Quán phở nấu <strong>nồi nước dùng</strong> một lần từ sáng (tốn công hơn nấu một bát), rồi múc ra cho cả trăm bát cả ngày — mỗi bát rất rẻ.
Nhưng nếu cả ngày chỉ bán đúng một bát, nấu cả nồi là <strong>lỗ</strong>. Nước dùng = prefix ổn định; mỗi bát = một cache read.</div>
<ul>
  <li>Chỉ cache nội dung <strong>đi kèm nguyên vẹn qua nhiều call</strong>: system prompt lớn, bộ tool cố định, tài liệu tham khảo dài mà bạn hỏi đi hỏi lại.</li>
  <li>Khối chung <strong>càng lớn</strong> và <strong>càng được dùng nhiều lần không đổi</strong> thì mỗi read càng tiết kiệm.</li>
  <li>Phần nào <strong>thay đổi mỗi lần</strong> thì <strong>không</strong> phải ứng viên cache.</li>
</ul>

<h3>Con số và hai thời hạn sống</h3>
<ul>
  <li>Mọi con số đều là <strong>bội số của giá input gốc</strong>: read = <strong>0.1×</strong>, write 5 phút = <strong>1.25×</strong>, write 1 giờ = <strong>2×</strong>.</li>
  <li>Hình dạng cần nhớ: <strong>write đắt hơn gốc một chút, read rẻ hơn rất nhiều</strong>. Đừng đảo ngược trong đầu.</li>
  <li><strong>5 phút</strong> là mặc định; <strong>mỗi lần read làm mới đồng hồ</strong>, nên traffic liên tục giữ prefix "ấm" mãi.</li>
  <li><strong>1 giờ</strong> sống qua những khoảng trống dài hơn nhưng ghi tốn gấp đôi.</li>
  <li>Không cái nào "tốt hơn" tuyệt đối: traffic <strong>dồn dập, thường xuyên → 5 phút</strong>; traffic <strong>thưa, rải rác → 1 giờ</strong>.</li>
</ul>

<h3>Khi nào có lời, khi nào phản tác dụng</h3>
<ul>
  <li><strong>5 phút</strong>: hòa vốn sau khoảng <strong>một lần dùng lại</strong>. Ghi 1.25× + đọc 0.1× = <strong>1.35×</strong> cho hai call, rẻ hơn <strong>2×</strong> nếu gửi lại giá đầy đủ hai lần.</li>
  <li><strong>1 giờ</strong>: ngưỡng cao hơn, cần <strong>hai lần read trở lên</strong> mới bù được write gấp đôi.</li>
  <li>Trong cả hai trường hợp, prefix ổn định nên chiếm <strong>phần lớn kích thước request</strong> để tiết kiệm áp dụng lên nhiều token.</li>
  <li>Phản tác dụng khi: prefix chỉ dùng <strong>một lần</strong> (trả phụ phí write mà không có read nào); nội dung <strong>đổi mỗi call</strong> (lần nào cũng là write mới); prefix <strong>dưới minimum token floor</strong> (không cache, không báo).</li>
  <li>Khi prefix hiếm khi dùng lại hoặc liên tục thay đổi, <strong>gửi lại bình thường còn rẻ hơn</strong>. Đừng cache theo phản xạ.</li>
</ul>

<h3>Cộng dồn với các cần gạt khác</h3>
<ul>
  <li><strong>Batch API</strong> giảm <strong>50%</strong> và áp dụng <strong>chồng lên</strong> giá cache: cache + batch cùng lúc thì giảm giá nhân lên.</li>
  <li><strong>Data residency</strong>: hệ số của nó áp lên <strong>mọi loại token</strong>, kể cả token cache.</li>
  <li>Cache read hiện <strong>tách riêng trong usage fields</strong>, khác với input chưa cache → đọc usage để <strong>xác nhận</strong> chi phí thật, đừng chỉ tin vào giả định.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có <strong>"system prompt / tài liệu lớn, giống nhau, gửi liên tục"</strong> → bật <strong>prompt caching</strong>.</li>
  <li>Đề có <strong>"request liên tục, sát nhau"</strong> → <strong>5 phút</strong> (read tự làm mới); <strong>"cách nhau lâu, thưa thớt"</strong> → <strong>1 giờ</strong>.</li>
  <li>Đề hỏi hòa vốn → 5 phút: <strong>~1 lần dùng lại</strong>; 1 giờ: <strong>2+ lần read</strong>.</li>
  <li>Đề có <strong>"nội dung đổi mỗi call"</strong> hoặc <strong>"chỉ gọi một lần"</strong> → caching <strong>không có lợi</strong>, thậm chí lỗ.</li>
  <li>Đề có <strong>"bật cache mà không thấy cache"</strong> với prefix nhỏ → dưới <strong>minimum token floor</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Cache write rẻ, read đắt" → <strong>sai</strong>, ngược lại: write 1.25× hoặc 2×, read 0.1×.</li>
  <li>"Cache mọi thứ cho chắc" → <strong>sai</strong>, prefix dùng một lần hoặc thay đổi liên tục làm bạn tốn hơn.</li>
  <li>"1 giờ lúc nào cũng tốt hơn 5 phút" → <strong>sai</strong>, write gấp đôi; chọn theo nhịp traffic thật.</li>
  <li>"Cache và batch không dùng chung được" → <strong>sai</strong>, giảm giá batch 50% chồng lên giá cache.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Đọc 10%, ghi 5 phút +25%, ghi 1 giờ ×2</strong> — nấu nồi nước dùng chỉ khi bán được nhiều bát: <strong>lớn, ổn định, dùng lại thường xuyên</strong>.</p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
