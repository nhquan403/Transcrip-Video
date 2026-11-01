window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> SDK lo phần "ống nước" nhàm chán giúp bạn: <strong>authentication, retries, typing, streaming parsing</strong>.
Nhưng nó vạch một ranh giới cứng: SDK <strong>không thêm năng lực nào</strong> mà REST API không có. API không hỗ trợ thì SDK cũng không hỗ trợ.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>x-api-key</strong>: header chứa API key của bạn.</li>
  <li><strong>anthropic-version</strong>: header "ghim" phiên bản API để code chạy ổn định khi nền tảng thay đổi.</li>
  <li><strong>anthropic-beta</strong>: header thêm vào khi dùng tính năng beta.</li>
  <li><strong>Transient error</strong>: lỗi tạm thời, ví dụ <strong>429</strong> rate limit hay lỗi server <strong>5xx</strong>.</li>
  <li><strong>Exponential backoff</strong>: chờ lâu dần giữa các lần retry để không "dội" vào dịch vụ.</li>
  <li><strong>Timeout</strong>: thời gian tối đa một request được chạy; mặc định của SDK khoảng <strong>10 phút</strong>.</li>
  <li><strong>Typed objects</strong>: tham số và response có kiểu, editor tự gợi ý và bắt lỗi sớm.</li>
  <li><strong>Convenience layer</strong>: lớp tiện lợi, không phải sản phẩm khác có quyền năng khác.</li>
</ul>

<h3>Bốn việc SDK làm hộ bạn</h3>
<div class="box">🧑‍🍳 <strong>Hình dung thế này:</strong> SDK giống một người phụ bếp giỏi: rửa rau, mài dao, dọn bàn, bày đĩa giúp bạn.
Nhưng người phụ bếp <strong>không thể nấu món mà nhà bếp không có nguyên liệu</strong>. Nhà bếp (REST API) không có thì phụ bếp (SDK) cũng chịu.</div>
<ol>
  <li><strong>Authentication</strong>: đọc API key, gắn đúng headers vào mọi request. Bạn đặt credentials một lần rồi quên đi.</li>
  <li><strong>Retries</strong>: gặp lỗi tạm thời (429, 5xx) thì tự retry với exponential backoff.</li>
  <li><strong>Typing</strong>: tham số và response có kiểu, nên sai tên field hay sai kiểu dữ liệu sẽ báo lỗi ngay trong editor.</li>
  <li><strong>Streaming</strong>: parse luồng event thô thành các message object gọn gàng, bạn không phải tự viết parser.</li>
</ol>

<h3>Authentication: các header bắt buộc</h3>
<ul>
  <li>Mọi request tới Claude phải mang vài header: <strong>x-api-key</strong>, <strong>anthropic-version</strong>, <strong>content-type</strong>, và <strong>anthropic-beta</strong> nếu dùng tính năng beta.</li>
  <li>SDK đặt tất cả từ <strong>client bạn cấu hình một lần lúc khởi động</strong>. Truyền key ở một chỗ, từ đó mọi call đều được xác thực đúng.</li>
  <li>Việc nhỏ, nhưng xoá hẳn một nhóm lỗi setup.</li>
</ul>

<h3>Retries và timeouts: mặc định hợp lý, chỉnh được</h3>
<ul>
  <li>SDK biết lỗi nào là tạm thời (<strong>429</strong>, <strong>5xx</strong>) và tự chờ rồi retry bằng exponential backoff.</li>
  <li>Mặc định SDK <strong>retry 2 lần</strong> rồi mới trả lỗi về cho bạn.</li>
  <li><strong>Timeout</strong> mặc định khoảng <strong>10 phút</strong>. Với generation rất dài, SDK muốn bạn <strong>stream</strong> thay vì chờ một câu trả lời khổng lồ, vì request non-streaming quá lớn có thể vượt giới hạn đó.</li>
  <li>Cả hai đều là default có thể <strong>tune</strong>.</li>
</ul>

<h3>Typing và streaming: tiết kiệm thời gian thật</h3>
<ul>
  <li>Response là <strong>typed object</strong>, không phải dictionary thô đọc bằng key dạng chuỗi rồi "cầu may". Bạn đọc <code>result.content</code> và tool cho biết chính xác có gì.</li>
  <li>Autocomplete trở thành tài liệu sống: ít phải lật docs, cả một nhóm lỗi runtime ngớ ngẩn biến mất.</li>
  <li>Với streaming, Claude gửi output thành nhiều event nhỏ trên một kết nối. Ở mức thô, bạn phải tự cộng dồn text delta, theo dõi content block bắt đầu/kết thúc, rồi ráp message cuối. SDK làm hết.</li>
  <li>Quan trọng: <strong>event trên dây giống hệt nhau</strong>. SDK không đổi protocol, nó chỉ <strong>đọc giúp</strong> bạn.</li>
</ul>

<h3>Ranh giới: SDK không thêm năng lực</h3>
<ul>
  <li>SDK chỉ lộ ra những gì <strong>REST API bên dưới hỗ trợ</strong>. Endpoint không làm được thì không có method SDK nào làm được.</li>
  <li>Điều này quan trọng khi năng lực <strong>khác nhau theo hosting surface</strong>: nếu một server-side tool không có trên surface bạn đang dùng, nó cũng không có trong SDK client của surface đó.</li>
  <li>Khi phân vân, đừng hỏi "SDK có method này không?", hãy hỏi <strong>"REST API có hỗ trợ không?"</strong>.</li>
</ul>

<h3>Khi nào dùng SDK, khi nào raw REST?</h3>
<ul>
  <li><strong>Mặc định dùng SDK</strong>, nhất là với Python hoặc TypeScript: gần như không có nhược điểm.</li>
  <li>Dùng <strong>raw REST</strong> khi: ngôn ngữ của bạn <strong>không có SDK chính thức</strong>, cần <strong>dependency tối thiểu</strong> (môi trường bị giới hạn), hoặc đang <strong>debug</strong> và muốn xem đúng từng byte trên dây.</li>
  <li>Có thể <strong>trộn cả hai</strong> trong một hệ thống vì cùng gọi một endpoint; không bị khoá, đổi qua lại gần như không tốn gì.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề hỏi "SDK có cho làm X mà API không hỗ trợ không" → đáp án: <strong>không</strong>, SDK không thêm capability.</li>
  <li>Đề có "ngôn ngữ không có SDK chính thức / cần ít dependency / xem bytes trên dây" → đáp án: <strong>raw REST</strong>.</li>
  <li>Đề có "generation rất dài, request bị timeout" → đáp án: <strong>dùng streaming</strong>.</li>
  <li>Đề hỏi SDK tự retry lỗi nào → <strong>429 và 5xx</strong> (lỗi tạm thời), với exponential backoff.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Server-side tool không có trên surface này, nhưng đổi SDK là dùng được" → <strong>sai</strong>, SDK gọi cùng endpoint bị giới hạn.</li>
  <li>"SDK dùng protocol streaming riêng" → <strong>sai</strong>, event trên dây giống hệt, SDK chỉ parse giúp.</li>
  <li>"Chọn SDK rồi thì không thể gọi raw REST nữa" → <strong>sai</strong>, có thể trộn tự do.</li>
  <li>"SDK retry vô hạn cho tới khi thành công" → <strong>sai</strong>, mặc định retry 2 lần rồi trả lỗi.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>"Auth, Retry, Type, Stream": SDK lo ống nước, không xây thêm phòng.</strong> API không có thì SDK cũng không có.</p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
