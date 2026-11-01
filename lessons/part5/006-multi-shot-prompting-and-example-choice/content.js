window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> <strong>Multi-shot</strong> (few-shot) là đưa từ <strong>hai ví dụ trở lên</strong> để model thấy một <strong>pattern</strong> và tổng quát hóa.
Thứ quyết định kết quả <strong>không phải số lượng</strong> mà là <strong>chọn ví dụ tốt</strong>: liên quan, đa dạng, tách bạch rõ. <strong>Chất lượng thắng số lượng</strong>, và ví dụ đặt trong <strong>message history</strong>.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Multi-shot / few-shot</strong>: dùng nhiều ví dụ hoàn chỉnh để dạy một pattern.</li>
  <li><strong>Relevant</strong>: ví dụ sát với use case thật, để pattern chuyển được sang input thật.</li>
  <li><strong>Diverse</strong>: ví dụ đủ khác nhau để phủ các <strong>edge case</strong>.</li>
  <li><strong>Delimiters</strong>: ký hiệu/thẻ tách ví dụ khỏi chỉ dẫn, để model coi đó là mẫu để bắt chước, không phải lệnh.</li>
  <li><strong>Overfit</strong>: model bám vào một hình dạng hẹp, gặp input khác là vấp.</li>
  <li><strong>Coverage vs clutter</strong>: phủ được dải input thật vs nhồi nhiều ví dụ na ná nhau.</li>
  <li><strong>Diminishing returns</strong>: lợi ích giảm dần: vài ví dụ đầu mang phần lớn giá trị.</li>
  <li><strong>Assistant prefill</strong>: kỹ thuật cũ "viết sẵn phần đầu câu trả lời của model", <strong>bị từ chối</strong> trên Claude hiện tại.</li>
</ul>

<h3>Multi-shot làm được gì mà một ví dụ không làm được?</h3>
<ul>
  <li>Nhiều ví dụ <strong>củng cố output format</strong> qua nhiều trường hợp, để model thấy đó không phải chuyện một lần.</li>
  <li>Chúng minh họa <strong>giọng văn, cấu trúc, hay cả cách suy luận</strong> bạn muốn model bắt chước; lặp lại qua các ví dụ giúp phong cách "dính".</li>
  <li>Quan trọng nhất: cho model thấy <strong>cách xử lý sự khác biệt</strong> giữa các input, thứ mà một ví dụ đơn lẻ che mất.</li>
  <li><strong>Một ví dụ dạy một trường hợp. Nhiều ví dụ dạy quy luật bên dưới.</strong></li>
</ul>

<h3>Ba dấu hiệu của ví dụ tốt, và chất lượng thắng số lượng</h3>
<ol>
  <li><strong>Relevant</strong>: phản chiếu sát use case thật.</li>
  <li><strong>Diverse</strong>: đủ khác nhau để phủ edge case, tránh overfit.</li>
  <li><strong>Structured</strong>: tách rõ khỏi chỉ dẫn bằng <strong>delimiters</strong>.</li>
</ol>
<p>Khi few-shot chưa ổn, phản xạ thường là thêm ví dụ, và <strong>điều đó thường phản tác dụng</strong>. Vài ví dụ đa dạng, chọn kỹ sẽ thắng một danh sách dài các bản gần trùng nhau,
vì bản trùng dạy đi dạy lại một điều mà không phủ thêm gì. <strong>Mỗi ví dụ phải dạy điều mà các ví dụ khác chưa dạy.</strong> Hướng dẫn của Anthropic cũng vậy: một tập <strong>nhỏ, chọn kỹ</strong>, không phải đổ hết mọi trường hợp.</p>
<div class="box">🗺️ <strong>Hình dung thế này:</strong> Dạy ai nhận biết "con chó" mà chỉ cho xem 10 ảnh chó Corgi giống hệt nhau, họ sẽ ngỡ ngàng khi thấy chó Husky.
Cho xem 4 ảnh: Corgi, Husky, chó Phú Quốc, chó con lông xù, là đủ để họ hiểu "chó" rộng tới đâu. Đó là <strong>coverage</strong>, còn 10 ảnh Corgi là <strong>clutter</strong>.</div>

<h3>Coverage vs clutter và điểm dừng</h3>
<ul>
  <li><strong>Coverage tốt</strong>: ví dụ trải khắp dải input thật, kể cả edge case khó, nên model tổng quát tốt.</li>
  <li><strong>Clutter</strong>: chồng nhiều ví dụ giống nhau của trường hợp dễ: làm prompt phình, tốn token mỗi lần gọi, và có thể <strong>overfit vào happy path</strong>: giỏi với input hiển nhiên, gãy với input lạ.</li>
  <li><strong>Diminishing returns</strong>: vài ví dụ đầu mang phần lớn giá trị; khi tập đã phủ dải input, ví dụ mới chủ yếu lặp lại mà vẫn tốn tiền ở <strong>mọi</strong> lần gọi.</li>
  <li>Tín hiệu thực tế: <strong>theo dõi chất lượng output</strong> khi thêm ví dụ. Khi chất lượng đi ngang và ví dụ mới không đổi kết quả, <strong>dừng lại</strong> và tỉa những ví dụ không xứng chỗ.</li>
</ul>

<h3>Đặt ví dụ ở đâu?</h3>
<ul>
  <li>Đặt trong <strong>message history</strong> như các lượt input/output trước đó, <strong>đứng trước request thật</strong>.</li>
  <li><strong>Delimit</strong> từng ví dụ rõ ràng để model biết đâu là ví dụ, đâu là chỉ dẫn.</li>
  <li><strong>Bỏ assistant prefill</strong>: trên Claude hiện tại nó bị <strong>từ chối hẳn</strong>. Thay vào đó dùng few-shot để định hình, và khi cần format cứng thì dùng <strong>structured output</strong>.</li>
  <li>Kết hợp <strong>vài ví dụ chọn kỹ + structured output</strong> → format đáng tin mà không phải nhồi prompt.</li>
</ul>

<h3>Ba thói quen: curate, test, place</h3>
<ul>
  <li><strong>Curate, đừng dump</strong>: chọn một tập nhỏ <strong>canonical examples</strong> thể hiện rõ hành vi mong muốn.</li>
  <li><strong>Test tập ví dụ</strong>: hỏi thẳng từng ví dụ có relevant và diverse không, bỏ cái không thêm coverage. Có thể <strong>nhờ chính model kiểm tra</strong>.</li>
  <li><strong>Đặt đúng chỗ</strong>: là các lượt trước đó, có delimiter.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có <strong>"few-shot chưa tốt, nên làm gì?"</strong> → đáp án đúng là <strong>chọn ví dụ đa dạng, phủ edge case</strong>, không phải "thêm thật nhiều ví dụ".</li>
  <li>Đề có <strong>"tốt với input thường, hỏng với input lạ"</strong> → ví dụ <strong>thiếu đa dạng / overfit happy path</strong>.</li>
  <li>Đề có <strong>"dùng assistant prefill để ép format trên model hiện tại"</strong> → <strong>không hợp lệ</strong>; dùng few-shot + <strong>structured output</strong>.</li>
  <li>Đề có <strong>"model làm theo ví dụ như thể đó là lệnh"</strong> → thiếu <strong>delimiters</strong> tách ví dụ khỏi chỉ dẫn.</li>
  <li>Đề có <strong>"thêm ví dụ mà chất lượng không đổi, chi phí tăng"</strong> → <strong>diminishing returns</strong>, dừng và tỉa bớt.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Càng nhiều ví dụ càng chính xác" → <strong>sai</strong>, ví dụ gần trùng chỉ thêm token, không thêm coverage.</li>
  <li>"Nhiều ví dụ cùng kiểu dễ là an toàn" → <strong>sai</strong>, dễ overfit vào happy path.</li>
  <li>"Prefill câu trả lời vẫn là mẹo ép format tốt" → <strong>sai</strong>, Claude hiện tại từ chối prefill.</li>
  <li>"Ví dụ trộn chung với chỉ dẫn cũng được" → <strong>sai</strong>, cần delimiter để model coi là mẫu, không phải lệnh.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Ít mà chất: Relevant, Diverse, Delimited.</strong> Curate → test → đặt trong message history; cần format cứng thì <strong>structured output</strong>, đừng prefill.</p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
