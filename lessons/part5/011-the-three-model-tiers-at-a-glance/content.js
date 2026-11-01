window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Claude là một <strong>gia đình model</strong> với ba tier: <strong>Opus</strong> (mạnh nhất), <strong>Sonnet</strong> (cân bằng), <strong>Haiku</strong> (nhanh và rẻ nhất),
cộng thêm <strong>Fable 5</strong> đứng trên cùng cho việc khó nhất. <strong>Năng lực, độ trễ và giá tăng cùng nhau</strong>, nên tier nhẹ nhất mà vẫn làm được việc thường là lựa chọn mặc định khôn ngoan.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Tier</strong>: "hạng" model: Opus, Sonnet, Haiku.</li>
  <li><strong>Opus 5</strong>: tier mạnh cho việc khó hằng ngày; Anthropic khuyên dùng làm <strong>điểm bắt đầu mặc định</strong> khi task phức tạp.</li>
  <li><strong>Sonnet 5</strong>: tier cân bằng, "best combination of speed and intelligence".</li>
  <li><strong>Haiku 4.5</strong>: model nhanh nhất, trí thông minh <strong>near frontier</strong>, giá thấp nhất.</li>
  <li><strong>Fable 5</strong>: model mạnh nhất Anthropic phát hành rộng rãi, cho việc khó nhất và agent chạy dài.</li>
  <li><strong>Context window</strong>: lượng token model "nhìn" được trong một request.</li>
  <li><strong>Latency</strong>: độ trễ phản hồi.</li>
  <li><strong>Per-token cost</strong>: giá theo token; <strong>output token đắt hơn input token</strong>.</li>
</ul>

<h3>Ba tier, một hình dạng</h3>
<div class="box">🚚 <strong>Hình dung thế này:</strong> Một đội xe giao hàng. <strong>Haiku</strong> là xe máy: nhanh, rẻ, chở gói nhỏ cực nhiều chuyến.
<strong>Sonnet</strong> là xe tải nhỏ: chở được phần lớn đơn hàng hằng ngày, vừa nhanh vừa đủ sức. <strong>Opus</strong> là xe tải lớn cho hàng nặng, khó.
<strong>Fable</strong> là xe chuyên dụng cho chuyến khó nhất. Không ai dùng xe tải lớn để giao một lá thư.</div>
<ul>
  <li><strong>Opus</strong>: mạnh nhất trong ba tier, cho suy luận khó, coding nặng, agentic work. Câu trả lời tốt nhất nhưng <strong>giá mỗi token cao nhất</strong> và thường <strong>chậm nhất</strong>.</li>
  <li><strong>Sonnet</strong>: đổi một phần năng lực lấy tốc độ và giá thấp hơn; nhắm tới <strong>production khối lượng lớn</strong> vẫn cần chất lượng tốt.</li>
  <li><strong>Haiku</strong>: nhanh nhất, rẻ nhất, cho task đơn giản cần throughput cao hoặc nhạy độ trễ: <strong>classification, routing, extraction</strong>.</li>
  <li>Trong code bạn gọi <strong>tên model cụ thể</strong>, không gọi tier. Bản đồ 4 tên: <strong>Fable 5 và Opus 5</strong> ở đầu mạnh, <strong>Sonnet 5</strong> ở giữa, <strong>Haiku 4.5</strong> cho tốc độ và khối lượng.</li>
</ul>

<h3>Mỗi tier mạnh ở đâu?</h3>
<ul>
  <li><strong>Opus</strong>: suy luận nhiều bước phức tạp, coding nghiêm túc như <strong>refactor lớn qua nhiều file</strong>, và là xương sống cho <strong>agent tự chạy hàng giờ</strong> không cần người. Khi <strong>độ chính xác quan trọng hơn chi phí</strong>, Opus là tier vượt được ngưỡng; sau đó có thể tối ưu xuống tier nhẹ hơn.</li>
  <li><strong>Sonnet</strong>: "workhorse", nơi rất nhiều việc production rơi vào: code generation, data analysis, content creation, agentic tool use hằng ngày, với giá và độ trễ <strong>thấp hơn nhiều so với Opus</strong>.</li>
  <li><strong>Haiku</strong>: tốc độ (hợp app real-time), giá token thấp nhất (hợp deploy khối lượng lớn), và hợp task nhỏ gọn: classification, routing, extraction, các bước <strong>sub-agent</strong> nhanh trong hệ thống lớn.</li>
  <li>Sai lầm hay gặp: loại Haiku vì "yếu nhất". Với đúng task, yếu nhất lại chính là điểm mạnh: không ai trả giá Opus chỉ để <strong>route một support ticket</strong>.</li>
</ul>

<h3>Context window: ràng buộc cứng đầu tiên</h3>
<ul>
  <li><strong>Fable 5, Opus 5, Sonnet 5</strong>: tới <strong>1 triệu token</strong> (hơn nửa triệu từ một chút trong một request).</li>
  <li><strong>Haiku 4.5</strong>: <strong>200.000 token</strong>, khoảng một phần năm. Vẫn lớn, nhưng chật hơn rõ rệt.</li>
  <li>Cùng một prompt quá khổ có thể chạy trơn trên Opus nhưng <strong>tràn</strong> trên Haiku. Với job nặng context, <strong>kích thước window có thể quyết định trước cả năng lực</strong>.</li>
</ul>

<h3>Tốc độ và giá: quan hệ nghịch</h3>
<ul>
  <li><strong>Tốc độ</strong> (nhanh → chậm): <strong>Haiku 4.5</strong> nhanh nhất → <strong>Sonnet 5</strong> nhanh, sau Haiku một bước → <strong>Opus 5</strong> vừa phải → <strong>Fable 5</strong> chậm nhất vì nghĩ lâu nhất trước khi trả lời.</li>
  <li><strong>Giá</strong> (tương đối): Haiku thấp nhất, là mốc → Sonnet <strong>vài lần</strong> giá input của Haiku → Opus <strong>nhiều lần</strong> hơn nữa → Fable còn cao hơn.</li>
  <li>Ở mọi tier: <strong>output token tính giá cao hơn input token</strong> theo một hệ số cố định, nên câu trả lời dài dòng tốn hơn câu trả lời ngắn.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có "classification / routing / extraction, khối lượng lớn, cần nhanh, rẻ" → đáp án thường là <strong>Haiku</strong>.</li>
  <li>Đề có "production khối lượng lớn nhưng cần chất lượng tốt" → <strong>Sonnet</strong>.</li>
  <li>Đề có "suy luận khó, refactor lớn, agent tự chạy hàng giờ, độ chính xác quan trọng hơn giá" → <strong>Opus</strong> (hoặc <strong>Fable</strong> cho mức khó nhất).</li>
  <li>Đề có "prompt vượt 200K token" → loại <strong>Haiku 4.5</strong>, chọn model có window <strong>1M</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Haiku yếu nhất nên không bao giờ nên dùng" → <strong>sai</strong>, cho task đơn giản khối lượng lớn nó là lựa chọn đúng.</li>
  <li>"Mọi model đều có cùng context window" → <strong>sai</strong>, Haiku 4.5 chỉ 200K, ba model kia tới 1M.</li>
  <li>"Model mạnh hơn thì cũng nhanh hơn" → <strong>sai</strong>, năng lực càng cao thường độ trễ càng lớn.</li>
  <li>"Input và output token cùng giá" → <strong>sai</strong>, output luôn đắt hơn.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Mạnh hơn = chậm hơn = đắt hơn.</strong> Haiku xe máy, Sonnet xe tải nhỏ, Opus xe tải lớn, Fable xe chuyên dụng; Haiku chỉ có <strong>200K</strong>, còn lại <strong>1M</strong>.</p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
