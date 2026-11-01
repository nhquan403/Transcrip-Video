window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Muốn đổi model mà không làm vỡ app, hãy <strong>pin đúng model ID</strong>, coi migration là <strong>việc bảo trì định kỳ</strong> (vì model sẽ bị deprecate),
và luôn <strong>test model mới trên một frozen eval set</strong> trước khi chuyển. Quy trình: <strong>pin → freeze → test → cut over</strong>.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Model ID</strong>: chuỗi chính xác đặt tên một model, quyết định cả weights lẫn hành vi bạn nhận được.</li>
  <li><strong>Version pinning</strong>: ghi đúng một model ID cố định trong app, thay vì alias "trôi nổi".</li>
  <li><strong>Snapshot</strong>: một phiên bản model đóng băng; weights phía sau ID không bao giờ đổi.</li>
  <li><strong>Floating alias</strong>: chuỗi "di động" (chỉ có ở model trước 4.6) luôn trỏ tới snapshot mới nhất.</li>
  <li><strong>Deprecation</strong>: Anthropic đánh dấu model sẽ nghỉ hưu vào một ngày định sẵn; sau đó gọi sẽ lỗi <strong>404</strong>.</li>
  <li><strong>Frozen eval set</strong>: bộ prompt + output mong đợi cố định, để so model cũ và mới trên cùng input.</li>
  <li><strong>Regression test</strong>: chạy lại eval trên model mới để bắt hành vi bị xấu đi.</li>
  <li><strong>Prompt versioning</strong>: quản lý prompt như artifact có version, gắn với model version, lưu trong source control.</li>
</ul>

<h3>Pinned snapshot vs floating alias</h3>
<div class="box">💊 <strong>Hình dung thế này:</strong> Pin model ID giống ghi đơn thuốc với <strong>đúng tên và hàm lượng</strong>: lần nào mua cũng ra đúng viên đó.
Floating alias giống ghi "thuốc đau đầu loại mới nhất": tiện, nhưng một hôm nhà thuốc đổi loại mà bạn không hề hay biết.</div>
<ul>
  <li>Từ <strong>thế hệ 4.6 trở đi</strong>, model ID là một <strong>snapshot cố định</strong>: Anthropic không cập nhật weights dưới ID cũ; model tốt hơn ra mắt dưới <strong>ID mới</strong>.</li>
  <li>Pin đúng ID → mọi lần gọi, hôm nay hay tháng sau, đều là cùng một model. Hành vi chỉ đổi khi <strong>bạn tự đổi ID</strong>.</li>
  <li>Floating alias tiện cho thử nghiệm nhanh, nhưng một bản release bạn không yêu cầu có thể <strong>đổi kết quả qua đêm</strong>. Chỉ dùng cho script vứt đi.</li>
</ul>

<h3>Hai định dạng ID</h3>
<ul>
  <li><strong>4.6 trở đi</strong>: dạng <strong>không có ngày</strong> (claude, tên, số version, ví dụ Claude Opus 4.8). Điểm hay bị hiểu nhầm: ID không ngày này <strong>chính là bản pin</strong>, không phải con trỏ "latest".</li>
  <li><strong>Trước 4.6</strong>: dạng <strong>có ngày</strong> ở cuối (ví dụ Claude Sonnet 4.5 kèm ngày); phần ngày đánh dấu đúng snapshot.</li>
  <li>Model cũ có thêm <strong>alias không ngày</strong> trỏ tới snapshot mới nhất của version đó: tự nhận bản sửa mới, nhưng <strong>mất tính tái lập</strong>.</li>
  <li>Alias kiểu này <strong>chỉ có trước 4.6</strong>. Với ID không ngày thì không có gì để "resolve", đừng đi tìm alias cho model mới.</li>
</ul>

<h3>Quy trình bốn bước và vì sao phải làm thường xuyên</h3>
<ol>
  <li><strong>Pin</strong> model hiện tại để không gì thay đổi trong lúc chuẩn bị.</li>
  <li><strong>Freeze</strong> một eval set đại diện, có output mong đợi, và không sửa nó.</li>
  <li><strong>Test</strong> model ứng viên trên eval đó, so sánh song song với model hiện tại.</li>
  <li><strong>Cut over</strong>: kết quả ổn thì đổi pinned ID trong <strong>một thay đổi đã review</strong>, rồi theo dõi production.</li>
</ol>
<p>Migration <strong>không phải việc làm một lần</strong>. Deprecation tạo ra nhịp: hết ngày retirement, gọi model sẽ lỗi <strong>404</strong> và app không migrate sẽ ngừng chạy.
Ví dụ trong bài: <strong>Opus 4.1</strong> đã bị deprecate có ngày nghỉ hưu; <strong>Sonnet 3.7</strong> và <strong>Haiku 3.5</strong> đã nghỉ hưu. Hãy đặt migration vào lịch bảo trì, cạnh cập nhật dependency và bản vá bảo mật.</p>

<h3>Những thứ đổi ngay cả khi request vẫn "xanh"</h3>
<ul>
  <li><strong>Tokenizer mới</strong> trên Opus 4.7 trở đi, cùng Fable 5 và Sonnet 5, đếm <strong>khoảng 30% token nhiều hơn</strong> cho cùng văn bản → max output, ước tính chi phí, context budget có thể lệch.</li>
  <li><strong>Thinking display</strong> giờ mặc định là <strong>omitted</strong> trên model hiện tại → giao diện từng hiện reasoning có thể trống trơn.</li>
  <li>Sau khi migrate: <strong>rebaseline token count</strong> và kiểm tra lại output.</li>
  <li>Pin cố định <strong>weights</strong>, nhưng hạ tầng phục vụ xung quanh (request routing, safety classifiers) vẫn có thể đổi → hành vi quan sát được có thể dịch chuyển. Nên <strong>chạy lại frozen eval theo lịch</strong>, không chỉ lúc migrate.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có <strong>"kết quả tự nhiên thay đổi sau một bản release mới"</strong> → nguyên nhân: dùng floating alias; đáp án: <strong>pin đúng model ID</strong>.</li>
  <li>Đề có <strong>"model sắp bị deprecate, làm sao chuyển an toàn"</strong> → <strong>pin → freeze eval → test → cut over</strong>.</li>
  <li>Đề có <strong>"app bỗng lỗi 404 khi gọi model"</strong> → model đã qua ngày retirement.</li>
  <li>Đề có <strong>"sau migration chi phí / max tokens lệch dù không lỗi"</strong> → tokenizer mới đếm nhiều token hơn, cần rebaseline.</li>
  <li>Đề có <strong>"đã pin mà hành vi vẫn hơi dịch"</strong> → hạ tầng phục vụ đổi; chạy lại eval định kỳ.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"ID không ngày như Claude Opus 4.8 là alias trôi nổi" → <strong>sai</strong>, từ 4.6 trở đi ID không ngày chính là snapshot cố định.</li>
  <li>"Migration làm xong một lần lúc phát triển" → <strong>sai</strong>, deprecation biến nó thành việc định kỳ.</li>
  <li>"Pin rồi thì không gì có thể thay đổi" → <strong>sai</strong>, routing và safety classifiers vẫn có thể đổi.</li>
  <li>"Request không lỗi nghĩa là migrate xong xuôi" → <strong>sai</strong>, token count và thinking display có thể đã khác.</li>
  <li>"Sửa eval set cho hợp model mới" → <strong>sai</strong>, input phải giữ cố định thì so sánh mới có nghĩa.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Pin, freeze, test, cut over</strong> — và nhớ: <strong>pin khóa weights, không khóa cả thế giới</strong>, nên eval phải chạy lại theo lịch.</p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
