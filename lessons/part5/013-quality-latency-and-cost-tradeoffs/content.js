window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Mỗi lần chọn model là bạn đang cân <strong>ba thứ cùng lúc</strong>: <strong>quality</strong>, <strong>latency</strong> và <strong>cost</strong>.
Ba thứ này thường "kéo ngược" nhau, nên không có model nào tốt nhất cho mọi việc. Model đúng là <strong>tier nhẹ nhất mà vẫn thỏa mãn mọi ràng buộc của bài toán cùng lúc</strong>.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Quality</strong>: năng lực của model, độ chính xác và độ sâu khi suy luận, viết code, phân tích.</li>
  <li><strong>Latency</strong>: model mất bao lâu để trả lời; quan trọng nhất khi có <strong>người đang chờ</strong> (real-time, interactive).</li>
  <li><strong>Cost</strong>: giá theo token; bị <strong>nhân lên</strong> theo từng lần gọi khi chạy ở production volume.</li>
  <li><strong>Trade-off triangle</strong>: tam giác ba góc, hiếm khi có model đạt max cả ba.</li>
  <li><strong>Binding constraint</strong>: ràng buộc "cứng" nhất của bài toán, thứ quyết định tier nào còn được xét.</li>
  <li><strong>Effort</strong>: núm chỉnh lượng công sức model bỏ ra cho một câu trả lời, <strong>không cần đổi model</strong>.</li>
  <li><strong>max_tokens</strong>: trần số token output, giúp chặn câu trả lời dài dòng tốn tiền.</li>
</ul>

<h3>Tam giác ba góc: chọn góc nào quan trọng cho việc này</h3>
<div class="box">🍜 <strong>Hình dung thế này:</strong> Bạn chọn quán ăn trưa. Quán ngon nhất thì đắt và phải chờ lâu; quán cơm bình dân thì rẻ, ra món nhanh nhưng không đặc sắc.
Nếu chỉ có 15 phút nghỉ, bạn chọn quán nhanh. Nếu đãi khách quan trọng, bạn chấp nhận chờ và trả nhiều hơn. Chọn model cũng vậy: <strong>xem tình huống trước, rồi mới chọn quán</strong>.</div>
<ul>
  <li>Quy luật ổn định: <strong>năng lực cao hơn thường đi kèm cost cao hơn và latency cao hơn</strong>, vì model mạnh làm nhiều việc hơn "bên dưới".</li>
  <li>Các tier nhẹ, rẻ là những tier <strong>trả lời nhanh nhất</strong>.</li>
  <li>Thay vì đuổi theo cả ba, hãy hỏi: đây là <strong>bài khó</strong> (quality thắng), tính năng <strong>real-time</strong> (latency thắng), hay <strong>batch khối lượng lớn</strong> (cost thắng)?</li>
</ul>

<h3>Quality đối đầu tốc độ</h3>
<ul>
  <li>Tier cao (<strong>Opus</strong>, <strong>Fable</strong>): chất lượng hàng đầu cho bài thật sự khó, nhưng latency từ vừa đến chậm vì chúng <strong>suy luận nhiều hơn trước khi trả lời</strong>.</li>
  <li>Tier nhẹ (<strong>Haiku</strong>, <strong>Sonnet</strong>): trả lời nhanh nhất, <strong>Haiku dẫn đầu</strong> về tốc độ, đổi lại trần năng lực thấp hơn.</li>
  <li>Đó không phải lỗi mà là thiết kế: với tính năng real-time, một câu trả lời <strong>"đủ tốt" mà nhanh</strong> thắng câu trả lời tốt hơn chút nhưng chậm. Với phân tích khó, chờ lâu hơn để có kết quả mạnh là đáng.</li>
</ul>

<h3>Cost: lấy Haiku làm mốc, và để ý phía output</h3>
<ul>
  <li>Coi <strong>Haiku là baseline</strong> (giá/token thấp nhất). Sonnet đắt hơn Haiku <strong>vài lần</strong> ở giá input, Opus thì <strong>nhiều lần</strong>.</li>
  <li>Bội số nghe trừu tượng cho tới khi nhân với volume: ở mức <strong>một triệu lần gọi/ngày</strong>, "đắt hơn vài lần" thành một dòng chi phí thật.</li>
  <li><strong>Output token luôn đắt hơn input</strong> ở mọi tier, nên model nói dông dài tốn hơn model trả lời gọn.</li>
  <li>Cách tiết kiệm: đặt <strong>max_tokens hợp lý</strong> và <strong>prompt yêu cầu trả lời ngắn gọn</strong>.</li>
</ul>

<h3>Núm bị quên: chỉnh effort trước khi đổi model</h3>
<ul>
  <li><strong>Effort</strong> điều khiển lượng công sức model bỏ ra, và bạn chỉnh được <strong>mà vẫn giữ nguyên model</strong>.</li>
  <li>Nếu Sonnet "gần đạt" nhưng hơi nông, <strong>tăng effort</strong> có thể đủ, khỏi phải trả tiền Opus.</li>
  <li>Chiều ngược lại: <strong>effort thấp</strong> = latency thấp hơn, cost thấp hơn; <strong>effort cao</strong> = suy luận sâu hơn.</li>
</ul>
<p>Quy tắc chọn cuối cùng: model tốt nhất <strong>không phải mạnh nhất, cũng không phải rẻ nhất</strong>, mà là tier <strong>đáp ứng mọi ràng buộc đã nêu cùng một lúc</strong>.
Tier đạt quality nhưng vượt ngân sách latency → loại. Tier rẻ nhưng không đạt quality → loại. Đọc hết các ràng buộc trong đề trước, rồi mới chọn.</p>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có <strong>"real-time", "người dùng đang chờ", "chatbot tương tác"</strong> → latency là binding constraint → nghiêng về tier nhẹ, nhanh (Haiku/Sonnet).</li>
  <li>Đề có <strong>"bài toán rất khó", "suy luận sâu", "coding phức tạp"</strong> và không gấp → tier cao (Opus/Fable).</li>
  <li>Đề có <strong>"khối lượng lớn", "triệu request/ngày", "ngân sách chặt"</strong> → cost thắng, chọn tier nhẹ nhất vẫn đạt quality.</li>
  <li>Đề nói <strong>"model hiện tại gần đạt nhưng hơi nông"</strong> → đáp án đúng thường là <strong>tăng effort</strong> trước khi lên tier.</li>
  <li>Đề liệt kê nhiều ràng buộc → chọn tier <strong>thỏa mãn tất cả</strong>, không chỉ một.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Cứ chọn Opus vì mạnh nhất" → <strong>sai</strong>, đó là chọn theo "danh tiếng"; phần lớn tác vụ không cần nhiều model đến vậy.</li>
  <li>"Cứ chọn Haiku cho rẻ" → <strong>sai</strong> khi tác vụ rõ ràng cần năng lực cao hơn Haiku.</li>
  <li>"Tối ưu quality/cost là xong" → <strong>sai</strong>, dễ quên mất ngân sách latency real-time mà workload thật sự có.</li>
  <li>"Muốn sâu hơn thì phải đổi sang model lớn hơn" → <strong>sai</strong>, hãy thử chỉnh effort trên model đang dùng trước.</li>
  <li>"Chỉ input mới đáng lo về giá" → <strong>sai</strong>, output đắt hơn input ở mọi tier.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Ba góc cân cùng lúc, chọn tier nhẹ nhất qua hết mọi cửa, và vặn effort trước khi đổi xe.</strong></p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
