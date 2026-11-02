window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> <strong>Zero-shot</strong> là chỉ nêu yêu cầu, không đưa ví dụ nào; <strong>one-shot</strong> là đưa <strong>đúng một</strong> ví dụ input kèm output mong muốn.
Đây <strong>không phải</strong> cái thang "yếu lên mạnh": nhiều ví dụ hơn không tự động cho câu trả lời tốt hơn. Kỹ năng là <strong>chọn đúng kiểu cho từng task</strong>, vì mỗi ví dụ tốn input token ở <strong>mọi</strong> lần gọi.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Zero-shot</strong>: chỉ có chỉ dẫn, model dựa vào kiến thức đã được huấn luyện và độ rõ ràng của câu chữ.</li>
  <li><strong>One-shot / single-shot</strong>: thêm đúng <strong>một</strong> ví dụ (input + output mong muốn) để định nghĩa pattern.</li>
  <li><strong>Multi-shot</strong>: nhiều ví dụ (học ở bài sau).</li>
  <li><strong>Shot</strong>: một <strong>màn trình diễn</strong>: input mẫu đi kèm <strong>output hoàn chỉnh</strong> bạn muốn. "Show, don't tell".</li>
  <li><strong>Instruction</strong>: lời <strong>mô tả</strong> việc cần làm hoặc luật (vd. "dưới 50 từ", "giọng trang trọng", "trả JSON hợp lệ"), không cho thấy kết quả mẫu.</li>
  <li><strong>Message history</strong>: nơi đặt shot: các cặp input/output đứng trước request thật.</li>
  <li><strong>Input tokens</strong>: mỗi ví dụ thêm vào làm tăng input token ở mọi lần gọi.</li>
</ul>

<h3>Zero-shot: điểm xuất phát mặc định</h3>
<ul>
  <li>Prompt zero-shot là <strong>chỉ dẫn thuần</strong>: mô tả task, có thể thêm chút ngữ cảnh, không có ví dụ.</li>
  <li>Vì không có ví dụ, prompt <strong>gọn</strong> và bạn trả <strong>ít input token</strong> hơn.</li>
  <li>Hợp với task <strong>quen thuộc, phổ biến</strong> mà model đã gặp vô số lần: <strong>tóm tắt, viết lại, dịch, phân loại đơn giản</strong>, trả lời câu hỏi.</li>
  <li>Hợp khi <strong>format đã hiển nhiên từ yêu cầu</strong>: bảo "cho tôi 3 gạch đầu dòng" thì model không cần ví dụ để biết gạch đầu dòng trông ra sao.</li>
  <li>Quy tắc: <strong>bắt đầu bằng một chỉ dẫn sạch</strong>. Nếu ra đúng, xong, tốn ít token nhất. Chỉ khi zero-shot hụt mới nghĩ tới ví dụ.</li>
</ul>

<h3>Instruction khác shot thế nào?</h3>
<div class="box">🍳 <strong>Hình dung thế này:</strong> Dạy ai đó làm trứng ốp la. <strong>Instruction</strong> là nói "chiên vừa, lòng đỏ còn chảy, rắc tiêu".
<strong>Shot</strong> là <strong>đặt một đĩa trứng làm sẵn lên bàn</strong> và nói "làm giống thế này". Nói thêm bao nhiêu câu cũng chưa thành "đĩa mẫu".</div>
<ul>
  <li><strong>Một ví dụ hoàn chỉnh</strong>: input mẫu đặt cạnh output thành phẩm. Cặp đôi đó mới là shot.</li>
  <li><strong>Một luật không phải shot</strong>: "giữ ngắn gọn" chỉ là hướng dẫn. Không có output mẫu đi kèm thì không có shot. Nói "đã thêm one-shot" mà thật ra chỉ thêm một câu chỉ dẫn → <strong>chưa có shot nào cả</strong>.</li>
  <li><strong>Shot nằm ở đâu</strong>: trong <strong>message history</strong>, dưới dạng các lượt input/output trước đó mà model đọc trước khi tới request thật. Shot <strong>không phải một tham số đặc biệt</strong>.</li>
</ul>

<h3>One-shot: một mẫu để chép theo</h3>
<ul>
  <li>Chủ yếu dùng để <strong>chốt một output format</strong> mà lời nói khó mô tả: thay vì một đoạn văn mô tả layout, cho xem <strong>một ví dụ điền sẵn</strong>.</li>
  <li>Cũng dùng để <strong>neo giọng văn hoặc cấu trúc</strong> bằng một trường hợp cụ thể, thường nhanh và chắc hơn giải thích.</li>
  <li>Trường hợp điển hình: <strong>một hình dạng JSON cụ thể</strong> mà mọi response phải khớp; <strong>giọng văn đặc biệt</strong> khó diễn tả bằng lời; <strong>format hiếm</strong> model ít khi tự tạo ra.</li>
  <li>Kỷ luật là <strong>kiềm chế</strong>: nếu một ví dụ đã truyền đạt đủ, ví dụ thứ hai chỉ thêm token mà không thêm độ rõ. <strong>Một ví dụ khớp thì dừng.</strong></li>
</ul>

<h3>Ba tín hiệu để chọn</h3>
<ol>
  <li><strong>Độ quen thuộc của task</strong>: model đã làm việc này hàng ngàn lần → <strong>zero-shot</strong>.</li>
  <li><strong>Độ chính xác của format</strong>: hình dạng output khó tả bằng lời → <strong>one-shot</strong> chốt nhanh hơn cả một bức tường luật.</li>
  <li><strong>Token budget</strong>: mỗi ví dụ tốn input token ở <strong>mọi</strong> lần gọi, nên ví dụ phải <strong>xứng đáng với chỗ của nó</strong>.</li>
</ol>
<p>Khi phân vân: <strong>bắt đầu gọn</strong>, chỉ thêm một ví dụ nếu bản thuần bị trượt.</p>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có <strong>tóm tắt, dịch, viết lại, phân loại đơn giản</strong> → đáp án đúng thường là <strong>zero-shot</strong> với chỉ dẫn rõ ràng.</li>
  <li>Đề có <strong>"cần mọi response khớp một JSON shape cụ thể"</strong> hoặc <strong>giọng văn khó mô tả</strong> → <strong>one-shot</strong> với một ví dụ hoàn chỉnh.</li>
  <li>Đề hỏi <strong>"cái nào là một shot?"</strong> → chọn phương án có <strong>input mẫu + output thành phẩm</strong>, không phải một câu luật.</li>
  <li>Đề nhắc <strong>chi phí token / prompt phình to</strong> → bỏ ví dụ thừa; ví dụ phải tạo thêm giá trị.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Càng nhiều ví dụ càng tốt" → <strong>sai</strong>, đây là việc khớp với task, không phải thang chất lượng.</li>
  <li>"Thêm câu 'giữ ngắn gọn' là đã có one-shot" → <strong>sai</strong>, không có output mẫu thì không phải shot.</li>
  <li>"Shot là một tham số riêng trong API" → <strong>sai</strong>, shot là các lượt ví dụ trong message history.</li>
  <li>"Ví dụ chỉ tốn token một lần" → <strong>sai</strong>, nó đi kèm prompt ở <strong>mọi</strong> lần gọi.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Quen việc thì nói (zero-shot), khó tả thì cho xem một mẫu (one-shot).</strong> Bắt đầu gọn, ví dụ phải tự trả được tiền vé.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
