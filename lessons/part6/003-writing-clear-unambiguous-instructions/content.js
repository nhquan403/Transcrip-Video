window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Độ tin cậy của một ứng dụng Claude nằm ở <strong>sự rõ ràng của chỉ dẫn</strong>.
Chỉ dẫn tốt có ba dấu hiệu: <strong>specific, unambiguous, ordered</strong>. Khi output thất thường, hãy nghi <strong>câu hỏi của bạn</strong> trước,
siết lại chỉ dẫn trước khi nghĩ tới sampling settings hay thêm ví dụ.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Specific</strong>: nói cụ thể muốn gì: định dạng output, các field, giới hạn cần tôn trọng.</li>
  <li><strong>Unambiguous</strong>: chỉ hiểu được một cách. Thước đo: đưa cho đồng nghiệp ít context đọc thử.</li>
  <li><strong>Ordered</strong>: khi thứ tự quan trọng hoặc cần làm đủ mọi bước → dùng <strong>numbered list</strong>.</li>
  <li><strong>Positive framing</strong>: nói Claude <strong>nên làm gì</strong>, thay vì liệt kê điều không được làm.</li>
  <li><strong>XML tags</strong>: yêu cầu Claude đặt câu trả lời trong thẻ có tên, vừa rõ "khung" vừa dễ trích xuất.</li>
  <li><strong>Motivation / the why</strong>: kèm lý do của luật để Claude khái quát hóa sang các trường hợp chưa nêu.</li>
  <li><strong>Sampling knobs</strong>: các tham số lấy mẫu – không phải chỗ đầu tiên cần chỉnh khi output thất thường.</li>
</ul>

<h3>Golden rule và hình mẫu "nhân viên mới"</h3>
<ul>
  <li><strong>Golden rule</strong>: đưa prompt cho một đồng nghiệp ít biết về task và nhờ họ làm theo. <strong>Họ bối rối thì Claude cũng bối rối.</strong></li>
  <li>Hình dung Claude là một <strong>nhân viên mới rất giỏi</strong> nhưng <strong>không có chút context nào</strong> về chuẩn mực, quy trình, cách làm của team bạn.</li>
  <li>Hãy nói rõ các quy ước bạn sẽ giải thích trong tuần đầu tiên; đừng giả định jargon chung hay "house style" mà Claude chưa từng thấy.</li>
  <li>Muốn Claude làm <strong>vượt mức</strong> so với nghĩa đen của yêu cầu → nói thẳng ra, vì nhân viên mới cẩn thận thường làm <strong>đúng y những gì được viết</strong>.</li>
</ul>
<div class="box">☕ <strong>Hình dung thế này:</strong> Bạn nhờ một người mới "pha cà phê giúp". Không nói đen hay sữa, đường bao nhiêu, cho ai uống – mỗi lần họ pha một kiểu.
Nói "một ly cà phê sữa ít đường cho khách ở bàn 3" thì lần nào cũng giống nhau. Vấn đề không nằm ở người pha, mà ở <strong>yêu cầu còn chỗ trống</strong>.</div>

<h3>Trước và sau: lấp các chỗ trống</h3>
<ul>
  <li>Mơ hồ: <em>"Summarize this ticket."</em> Dài bao nhiêu? Giọng gì? Ai đọc? Chi tiết nào quan trọng? Không nói gì → mỗi lần model lấp chỗ trống một kiểu, hai lần chạy hiếm khi giống nhau.</li>
  <li>Cụ thể: <em>"Summarize this ticket in two sentences for an on-call engineer and list the affected service."</em> → độ dài cố định, người đọc có tên, field bắt buộc được nêu.</li>
  <li>Cụ thể thắng mơ hồ <strong>không phải vì dài hơn</strong>, mà vì nó <strong>đóng các khoảng trống</strong>.</li>
</ul>

<h3>Ba đòn bẩy định dạng và sức mạnh của "vì sao"</h3>
<ol>
  <li><strong>Positive framing</strong>: thay vì "đừng dùng markdown, đừng dùng bullet, đừng dùng header" (mô tả một cái hố và mong model né), hãy nói <em>"Your response should be composed of flowing prose paragraphs."</em> Chuyển từng điều cấm thành một điều nên làm; chỉ giữ câu phủ định cho <strong>giới hạn cứng thật sự</strong>.</li>
  <li><strong>XML tags</strong>: ví dụ yêu cầu viết bản tóm tắt bên trong các thẻ prose paragraph – một "hộp đựng" rõ ràng và dễ tách ra ở phía code.</li>
  <li><strong>Match prompt style</strong>: viết chính prompt bằng văn xuôi sạch, không markdown, Claude có xu hướng trả lời cùng phong cách.</li>
</ol>
<p><strong>Thêm lý do cho luật</strong>: "Never use ellipses" yếu hơn "Câu trả lời sẽ được đọc bằng text-to-speech engine, nên không bao giờ dùng dấu ba chấm". Hiểu <strong>vì sao</strong>, Claude áp dụng được cho cả "họ" các trường hợp mà lý do đó ngụ ý; luật trơn chỉ phủ đúng một trường hợp. Bonus: lý do cũng ghi lại ý định cho developer sau.</p>

<h3>Checklist 3 bước và thứ tự sửa khi output thất thường</h3>
<ul>
  <li><strong>Name the format</strong>: JSON, prose, table hay list? Nếu có cấu trúc, nêu đúng các field.</li>
  <li><strong>Bound the length</strong>: giới hạn cụ thể – hai câu, năm bullet, số từ tối đa – để output không dần dài ra.</li>
  <li><strong>Sequence the steps</strong>: nhiều phần → numbered list để không bỏ sót và giữ đúng thứ tự.</li>
  <li>Output không nhất quán → đừng đổ lỗi model hay vặn sampling settings. Đọc lại chỉ dẫn như người không biết gì: chỗ nào hiểu được hai cách? Siết lời và ràng buộc trước (bài giảng còn lưu ý các model hiện tại không còn nhận sampling knobs).</li>
  <li>Chỉ khi chỉ dẫn đã thật rõ mới thêm <strong>examples</strong> – ví dụ đặt trên một yêu cầu mù mờ chỉ dạy model sự rối của bạn.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có "output mỗi lần một kiểu, không nhất quán" → đáp án đúng là <strong>làm rõ chỉ dẫn</strong> (format, độ dài, các bước), không phải chỉnh sampling.</li>
  <li>Đề có prompt toàn "don't…" về định dạng → <strong>positive framing</strong>: mô tả output mong muốn.</li>
  <li>Đề có một luật bị áp dụng quá hẹp → <strong>thêm lý do (the why)</strong> để Claude khái quát hóa.</li>
  <li>Đề cần lấy output dễ dàng bằng code → <strong>XML tags</strong>.</li>
  <li>Đề hỏi thêm examples hay sửa chỉ dẫn trước → <strong>sửa chỉ dẫn trước</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Output thất thường thì chỉnh sampling settings" → <strong>sai</strong>, thường do yêu cầu mơ hồ hoặc mâu thuẫn.</li>
  <li>"Prompt dài hơn thì rõ hơn" → <strong>sai</strong>, rõ là do đóng khoảng trống, không do độ dài.</li>
  <li>"Liệt kê thật nhiều điều cấm là cách điều khiển format tốt nhất" → <strong>sai</strong>, nói điều nên làm hiệu quả hơn.</li>
  <li>"Claude sẽ tự biết house style của team" → <strong>sai</strong>, nó như nhân viên mới không có context.</li>
  <li>"Thêm ví dụ là cách sửa đầu tiên" → <strong>sai</strong>, ví dụ trên yêu cầu mù mờ chỉ nhân lên sự rối.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>"Nói như dặn nhân viên mới: định dạng gì, dài bao nhiêu, làm theo thứ tự nào – và vì sao."</strong> Output trôi → <strong>siết yêu cầu trước</strong>.</p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
