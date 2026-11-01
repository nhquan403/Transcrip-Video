window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Chuyển app sang model Claude mới hơn, một request từng chạy tốt bỗng trả về <strong>400</strong> dù bạn không sửa dòng logic nào.
Lý do: model đời mới <strong>bỏ một số parameter cũ</strong> (sampling, prefill, thinking budget). Cách xử lý là <strong>đổi sang cơ chế thay thế</strong> và <strong>test trên đúng model đích</strong>.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Breaking change</strong>: model đời mới từ chối một parameter mà đời cũ chấp nhận, nên request cũ giờ bị lỗi.</li>
  <li><strong>400 error</strong>: bad request, lỗi ở <strong>input của bạn</strong>, không phải server Anthropic bị sập.</li>
  <li><strong>Model-specific behavior</strong>: parameter nào được chấp nhận tùy vào <strong>đúng model</strong> bạn gọi.</li>
  <li><strong>Sampling parameters</strong>: <code>temperature</code>, <code>top_p</code>, <code>top_k</code>.</li>
  <li><strong>Final-turn prefill</strong>: "mớm chữ" sẵn vào đầu lượt trả lời của assistant ở lượt cuối để ép định dạng.</li>
  <li><strong>Thinking budget</strong> (legacy): bật thinking kiểu <em>enabled</em> kèm số <strong>budget tokens</strong>.</li>
  <li><strong>Adaptive thinking</strong>: model <strong>tự quyết</strong> nghĩ bao nhiêu, không có budget để chỉnh tay.</li>
  <li><strong>Migration notes</strong>: ghi chú chuyển đổi cho model đích, nói parameter nào đã thay đổi.</li>
</ul>

<h3>Vì sao request đang chạy tốt bỗng hỏng?</h3>
<div class="box">🔌 <strong>Hình dung thế này:</strong> Bạn mang cái sạc cũ sang một căn hộ mới. Sạc không hỏng, nhưng ổ cắm ở đây <strong>kiểu khác</strong>, cắm vào là không vừa.
Code của bạn không đổi, <strong>"luật" bên dưới đã đổi</strong>. Bạn cần đúng đầu chuyển (cơ chế thay thế) cho ổ cắm mới.</div>
<ul>
  <li>Anthropic không đóng băng API mãi mãi. Khi model mới ra, một số parameter cũ bị <strong>gỡ bỏ</strong> vì đã có cơ chế tốt hơn thay thế.</li>
  <li>Trên model hiện tại: sampling như temperature <strong>không còn</strong>, final-turn prefill <strong>không còn</strong>, thinking kiểu budget cũ <strong>không còn</strong>.</li>
  <li>Ví dụ: app cũ đặt temperature và prefill phần đầu câu trả lời. Đổi sang <strong>Opus 5</strong>, giữ nguyên request body → nhận <strong>400</strong>. Cùng code, cùng prompt, khác model, khác luật.</li>
</ul>

<h3>Ba "nghi phạm" hay gây 400 nhất</h3>
<p>Cả ba đều bị từ chối trên cùng bốn model hiện tại: <strong>Fable 5, Opus 5, Opus 4.8, Sonnet 5</strong>.</p>
<ol>
  <li><strong>Sampling</strong> (temperature, top_p, top_k) → 400.</li>
  <li><strong>Final-turn prefill</strong> → bị từ chối.</li>
  <li><strong>Legacy thinking budget</strong> (enabled + budget tokens) → 400.</li>
</ol>
<p>Thêm một "huyền thoại" cần bỏ: đặt <strong>temperature = 0</strong> để có output giống hệt nhau mỗi lần. Điều đó <strong>chưa bao giờ được đảm bảo thật sự</strong>, kể cả trên model cũ. Nên đừng bám vào núm sampling để có tính tất định.</p>

<h3>Ba cặp thay thế cần thuộc</h3>
<ul>
  <li><strong>Sampling → effort</strong>: thay vì chỉnh temperature, đặt <strong>effort level</strong> và dựa vào prompt để định hình hành vi.</li>
  <li><strong>Budget → adaptive</strong>: thay vì budget tokens, dùng <strong>adaptive thinking</strong>, model tự quyết lượng suy nghĩ.</li>
  <li><strong>Prefill → structured</strong>: thay vì mớm chữ vào lượt assistant, yêu cầu <strong>structured output format</strong> hoặc đặt chỉ dẫn vào <strong>system prompt</strong>.</li>
</ul>

<h3>Thinking: mỗi model một kiểu, không được port mù</h3>
<ul>
  <li><strong>Opus 5 và Sonnet 5</strong>: dùng adaptive thinking; gửi kiểu enabled + budget cũ → <strong>400</strong>.</li>
  <li><strong>Haiku 4.5</strong>: ngược lại, <strong>vẫn dùng budget tokens</strong> và <strong>không có</strong> adaptive thinking.</li>
  <li><strong>Fable 5</strong>: thinking <strong>luôn bật</strong>, cố tắt nó sẽ bị từ chối.</li>
  <li>Vì vậy cùng một đoạn code thinking có thể đúng trên model này và hỏng trên model kế tiếp: luôn <strong>kiểm tra model đích hỗ trợ gì</strong> rồi khớp request theo.</li>
</ul>

<h3>Thói quen an toàn khi migrate</h3>
<ul>
  <li><strong>Test trên đúng model</strong> sẽ dùng ở production, không phải model "na ná".</li>
  <li>Gặp <strong>400 ngay sau migration</strong> → đừng debug logic của mình trước; status này thường chỉ vào <strong>parameter bị gỡ hoặc không hỗ trợ</strong>.</li>
  <li><strong>Đọc migration notes</strong> của model đích trước khi chuyển.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có <strong>"vừa đổi sang model mới, code không đổi, giờ bị 400"</strong> → đáp án: parameter đã bị gỡ (temperature/prefill/budget), không phải lỗi server.</li>
  <li>Đề hỏi thay temperature trên model hiện tại → <strong>effort + prompting</strong>.</li>
  <li>Đề hỏi thay prefill để ép định dạng → <strong>structured output</strong> hoặc <strong>system prompt</strong>.</li>
  <li>Đề có cấu hình thinking chạy trên Haiku 4.5 rồi mang sang Opus 5 (hoặc ngược lại) → đáp án: <strong>thinking là model-specific</strong>, phải kiểm tra model đích.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"400 sau migration nghĩa là Anthropic đang sự cố, retry đi" → <strong>sai</strong>, 400 là lỗi input, retry y nguyên vẫn hỏng.</li>
  <li>"temperature = 0 đảm bảo output giống hệt" → <strong>sai</strong>, chưa bao giờ được đảm bảo.</li>
  <li>"Cấu hình thinking chạy được ở model này thì chạy ở mọi model" → <strong>sai</strong>, Opus 5/Sonnet 5, Haiku 4.5 và Fable 5 mỗi nơi một kiểu.</li>
  <li>"Test trên một model tương tự là đủ" → <strong>sai</strong>, phải test trên đúng model production.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Sampling → effort, budget → adaptive, prefill → structured.</strong> Thấy 400 sau khi đổi model: nghi parameter trước, nghi code sau.</p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
