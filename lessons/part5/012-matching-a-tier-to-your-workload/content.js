window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Chọn model là đọc workload theo ba ràng buộc: <strong>task difficulty, latency budget, cost ceiling</strong>.
Nguyên tắc nền: <strong>chọn tier nhẹ nhất mà vẫn vượt được quality bar</strong>. Một pipeline có thể dùng nhiều tier, mỗi bước chạy trên tier nhẹ nhất xử lý được bước đó.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Task difficulty</strong>: suy luận hoặc coding khó tới đâu; càng khó càng đẩy về <strong>Opus</strong>.</li>
  <li><strong>Latency budget</strong>: response phải về nhanh cỡ nào; ngân sách real-time chặt thì nghiêng về tier nhẹ.</li>
  <li><strong>Cost ceiling</strong>: được tiêu bao nhiêu mỗi call khi chạy ở khối lượng lớn.</li>
  <li><strong>Quality bar</strong>: ngưỡng chất lượng tối thiểu mà task cần đạt.</li>
  <li><strong>Start light and upgrade</strong>: bắt đầu bằng Haiku, chỉ nâng tier khi gặp thiếu hụt năng lực thật.</li>
  <li><strong>Start capable and optimize down</strong>: bắt đầu bằng Opus cho đúng trước, rồi hạ xuống tier nhẹ hơn.</li>
  <li><strong>Over-provisioning</strong>: dùng Opus cho mọi thứ, trả quá nhiều.</li>
  <li><strong>Underserving</strong>: luôn dùng Haiku để tiết kiệm, làm "đói" task khó.</li>
</ul>

<h3>Ba ràng buộc và một nguyên tắc</h3>
<ul>
  <li><strong>Difficulty</strong>: càng khó càng về phía Opus; càng đơn giản Haiku càng xử lý được.</li>
  <li><strong>Latency</strong>: real-time chặt → tier nhanh, nhẹ.</li>
  <li><strong>Cost</strong>: throughput cao với giá thấp → chỉ thẳng vào Haiku.</li>
  <li>Nguyên tắc: <strong>lightest tier that clears the quality bar</strong>. Không phải model mạnh nhất với tới được, cũng không phải model rẻ nhất "lách" được.</li>
  <li>Hai hệ quả: <strong>đừng trả tiền cho năng lực task không cần</strong> (Opus cho việc vặt là lãng phí giá và độ trễ), và <strong>đừng bỏ đói task khó</strong> (model rẻ mà cứ hỏng thì không hề rẻ).</li>
</ul>

<h3>Hai chiến lược, hai cách sai</h3>
<div class="box">👟 <strong>Hình dung thế này:</strong> Mua giày cho đúng chân. <strong>Over-provisioning</strong> là mua giày leo núi đắt tiền chỉ để đi chợ.
<strong>Underserving</strong> là đi dép lê leo núi cho tiết kiệm. Cả hai đều trượt mục tiêu, chỉ là từ hai phía ngược nhau. Kỹ năng là chọn <strong>đôi vừa chân</strong>.</div>
<ul>
  <li><strong>Start light and upgrade</strong>: bắt đầu với <strong>Haiku</strong> (tốt cho prototype, latency chặt, việc đơn giản khối lượng lớn), chỉ lên tier khi gặp <strong>capability gap thật</strong>.</li>
  <li><strong>Start capable and optimize down</strong>: bắt đầu với <strong>Opus</strong> cho suy luận phức tạp, nơi độ chính xác dẫn đầu; làm đúng trước, rồi hạ tier để lấy lại chi phí và độ trễ.</li>
  <li>Cả hai đều hợp lệ. Chọn cái nào tuỳ rủi ro lớn hơn của bạn là <strong>tiêu quá tay</strong> hay <strong>giao thiếu chất lượng</strong>.</li>
</ul>

<h3>Mỗi tier thắng ở đâu, và trộn nhiều tier</h3>
<ul>
  <li><strong>Opus</strong>: suy luận khó nhất, refactor quy mô lớn, coding agent tự chạy nhiều giờ, workflow nặng về <strong>vision</strong> hoặc <strong>computer use</strong>.</li>
  <li><strong>Sonnet</strong>: code generation production khối lượng lớn, data analysis, content creation, agentic tool use hằng ngày, "vùng giữa rộng" nơi phần lớn ứng dụng thật sống.</li>
  <li><strong>Haiku</strong>: app real-time, classification / routing / extraction khối lượng lớn, các bước <strong>sub-agent</strong> nhẹ trong hệ thống lớn.</li>
  <li><strong>Một pipeline, nhiều tier</strong>: Haiku route / classify / pre-filter request, rồi giao bước khó cho Opus hoặc Sonnet; hoặc tier nhẹ viết nháp nhanh, tier mạnh review.</li>
  <li>Ghép tier theo <strong>từng sub-task</strong>, không theo bước khó nhất của cả pipeline. Size cả hệ thống theo khoảnh khắc khó nhất là <strong>trả quá tiền cho mọi thứ còn lại</strong>.</li>
</ul>

<h3>Ví dụ: pipeline customer support</h3>
<ul>
  <li>Bước <strong>gắn tag ticket</strong>: đơn giản, khối lượng cực lớn, nhạy giá và độ trễ → <strong>Haiku</strong>.</li>
  <li>Bước <strong>soạn câu trả lời</strong> cho nhân viên duyệt: cần chất lượng tốt hơn, nhưng không cần tier cao nhất → <strong>Sonnet</strong>.</li>
  <li><strong>Opus</strong> để dự phòng cho những ca <strong>escalation</strong> hiếm cần suy luận sâu.</li>
</ul>

<h3>Tín hiệu nên nâng tier</h3>
<ul>
  <li>Chất lượng <strong>trượt quality bar trên bộ eval thật</strong>, không phải theo cảm giác.</li>
  <li>Task rõ ràng cần suy luận sâu hơn: model <strong>mất mạch</strong> ở bài toán nhiều bước.</li>
  <li>Lỗi <strong>dồn vào các input khó nhất</strong> trong khi input dễ vẫn ổn → giới hạn nằm ở trần năng lực, không phải prompt.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có "dùng Opus cho mọi request, chi phí và độ trễ cao" → đáp án: <strong>over-provisioning</strong>, hạ tier cho bước đơn giản.</li>
  <li>Đề có "dùng Haiku cho mọi thứ, task khó cho kết quả sai" → đáp án: <strong>underserving</strong>, nâng tier cho bước khó.</li>
  <li>Đề mô tả pipeline có bước phân loại khối lượng lớn + bước khó → đáp án: <strong>trộn tier</strong>, Haiku cho phân loại, Sonnet/Opus cho bước khó.</li>
  <li>Đề hỏi khi nào nâng tier → đáp án dựa trên <strong>evaluation cases đo được</strong>, không phải linh cảm.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Cứ chọn model mạnh nhất cho chắc" → <strong>sai</strong>, lãng phí giá và độ trễ cho việc đơn giản.</li>
  <li>"Chọn model rẻ nhất là tối ưu chi phí" → <strong>sai</strong>, model rẻ cứ hỏng thì không hề rẻ.</li>
  <li>"Cả pipeline phải dùng một model, chọn theo bước khó nhất" → <strong>sai</strong>, ghép tier theo từng sub-task.</li>
  <li>"Thấy kết quả có vẻ kém thì nâng tier ngay" → <strong>sai</strong>, phải dựa trên eval thật và lỗi dồn ở input khó.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Khó – Nhanh – Rẻ: cân ba thứ, chọn tier nhẹ nhất vượt ngưỡng, và chia việc theo từng bước.</strong></p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
