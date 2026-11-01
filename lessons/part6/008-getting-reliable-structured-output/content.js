window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Có nhiều cách xin Claude trả JSON, nhưng độ tin cậy khác nhau: có cách chỉ <strong>"nhắc khéo"</strong> hình dạng, có cách <strong>đảm bảo</strong> nó.
Hãy hình dung một <strong>reliability ladder</strong> ba bậc và chỉ leo cao tới mức việc thật sự cần. Nhớ kỹ: <strong>JSON hợp lệ không có nghĩa là đúng schema</strong>.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Reliability ladder</strong>: thang ba bậc: format instructions → few-shot examples → schema enforcement.</li>
  <li><strong>Schema compliance</strong>: output đúng field, đúng type, đúng giá trị cho phép; khác với chỉ "parse được".</li>
  <li><strong>Constrained decoding</strong>: cơ chế ép response phải khớp schema khi model sinh ra từng token.</li>
  <li><strong>JSON outputs</strong> (structured outputs): đặt <code>output_config.format</code> là một JSON schema, <strong>toàn bộ response</strong> theo hình dạng đó.</li>
  <li><strong>Strict tool use</strong>: đặt <code>strict: true</code> trên tool, <strong>input schema</strong> của tool được enforce theo grammar.</li>
  <li><strong>Enum</strong>: giới hạn field phân loại vào một tập giá trị cố định.</li>
  <li><strong>additionalProperties: false</strong>: bắt buộc với object trong schema, không cho thêm field lạ.</li>
  <li><strong>Prefill</strong>: điền sẵn đầu câu trả lời của assistant (ví dụ dấu mở ngoặc); từ Claude 4.6 trở đi, prefill turn cuối trả về <strong>lỗi 400</strong>.</li>
</ul>

<h3>Thang độ tin cậy ba bậc</h3>
<ol>
  <li><strong>Format instructions</strong>: yêu cầu bằng lời, kiểu "return only JSON". Định hình output, thường chạy được, nhưng chỉ là <strong>best effort</strong>.</li>
  <li><strong>Few-shot examples</strong>: cho vài cặp input-output; dẫn dắt hình dạng mạnh hơn lời nói, nhưng vẫn <strong>không đảm bảo</strong> gì.</li>
  <li><strong>Schema enforcement</strong>: structured outputs hoặc strict tool use, nơi <strong>constrained decoding</strong> ép response khớp schema.</li>
</ol>
<div class="box">🏗️ <strong>Hình dung thế này:</strong> Bạn muốn khách điền thông tin đúng mẫu. Bậc 1: <strong>dặn miệng</strong> "ghi đủ họ tên, ngày sinh nhé".
Bậc 2: <strong>cho xem tờ mẫu đã điền</strong>. Bậc 3: <strong>form online</strong> có ô bắt buộc, ô ngày chỉ nhận ngày, ô tỉnh là dropdown: không thể nộp sai hình dạng.</div>
<p>Với prose request, model thường làm theo, nhưng không gì ngăn nó bọc JSON trong một câu chào thân thiện hay bỏ mất một field, và parser giả định input sạch sẽ hỏng.
Với enforcement, bạn nhận output hợp lệ, có type <strong>mọi lần</strong>, không phải "đa số lần".</p>

<h3>Valid JSON khác với schema compliance</h3>
<ul>
  <li>Một response có thể <strong>parse hoàn hảo</strong> mà vẫn sai với bạn: thiếu field code cần, đúng key nhưng <strong>sai type</strong> (số thay vì chuỗi), hoặc <strong>bịa ra category</strong> bạn chưa từng định nghĩa.</li>
  <li>Tất cả những thứ đó vẫn là JSON hợp lệ, nhưng không phải thứ bạn yêu cầu.</li>
  <li>Quy tắc: <strong>chọn cơ chế theo yêu cầu</strong>, không theo cái gõ nhanh nhất. Field bắt buộc phải đúng → prose request là không đủ.</li>
</ul>

<h3>Hai cơ chế enforce: dùng cái nào khi nào</h3>
<ul>
  <li><strong>JSON outputs</strong>: đặt <code>output_config.format</code> là JSON schema; dùng khi <strong>câu trả lời cuối cùng</strong> chính là object dữ liệu, ví dụ một record sắp ghi vào database.</li>
  <li><strong>Strict tool use</strong>: đặt <code>strict: true</code> trên tool; dùng khi Claude <strong>gọi vào code của bạn</strong> và argument phải hợp lệ ngay lần đầu.</li>
  <li>Cùng một "động cơ đảm bảo" bên dưới, hai lối vào: một cái định hình <strong>response</strong>, một cái định hình <strong>lời gọi</strong>. Có thể dùng riêng hoặc cả hai trong một request.</li>
</ul>

<h3>Thiết kế schema để model điền sạch</h3>
<ul>
  <li><strong>Tên và type chính xác</strong>: tên mơ hồ dẫn tới giá trị mơ hồ.</li>
  <li><strong>Required vs optional</strong>: chỉ đánh dấu required những field thật sự phải có; với object, <strong>additionalProperties phải là false</strong>.</li>
  <li><strong>Enum + description</strong>: field phân loại dùng enum để model chọn trong tập của bạn, kèm mô tả ngắn để giá trị mong muốn rõ ràng.</li>
  <li>Kết quả khi enforce: luôn là JSON hợp lệ (hết lỗi parse), field có type và đủ key required, <strong>không cần retry loop</strong> chỉ để sửa lỗi schema. Bạn dồn công validate vào chuyện câu trả lời <strong>có ý nghĩa</strong> hay không.</li>
  <li>Code cũ ép JSON bằng <strong>prefill</strong> dấu mở ngoặc: trên Claude 4.6 trở đi, prefill turn cuối trả <strong>400</strong>. Đừng vá, hãy <strong>thay bằng structured outputs</strong>.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có code downstream <strong>phụ thuộc vào field và type cụ thể</strong> → đáp án đúng là <strong>structured outputs</strong>, không phải prose request.</li>
  <li>Đề có giá trị phải nằm trong tập cố định (open, pending, closed) → <strong>enum</strong> trong schema hoặc <strong>strict tool use</strong>.</li>
  <li>Đề có Claude gọi function và argument phải đúng ngay lần đầu → <strong>strict: true</strong> trên tool.</li>
  <li>Đề có code dùng <strong>prefill</strong> để ép JSON và gặp 400 → thay bằng <strong>structured outputs</strong>.</li>
  <li>Đề nói "JSON parse được nhưng thiếu field / sai type" → vấn đề là <strong>schema compliance</strong>, cần enforcement.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Parse được là đúng schema" → <strong>sai</strong>, valid JSON và schema compliance là hai mức khác nhau.</li>
  <li>"Few-shot đủ để đảm bảo hình dạng" → <strong>sai</strong>, mạnh hơn lời nói nhưng vẫn không đảm bảo.</li>
  <li>"Prose request nhanh hơn nên chọn nó" → <strong>sai</strong>, tiện lợi không phải tiêu chí; tiết kiệm 30 giây giờ có thể tốn cả buổi debug sau.</li>
  <li>"Vá lại prefill cho chạy" → <strong>sai</strong>, prefill turn cuối bị đóng từ Claude 4.6; dùng schema.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Dặn miệng → cho xem mẫu → form bắt buộc.</strong> Leo vừa đủ cao; field phải đúng thì <strong>enforce bằng schema</strong>, vì <strong>parse được ≠ đúng schema</strong>.</p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
