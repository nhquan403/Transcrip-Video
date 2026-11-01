window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Một prompt cho ra <strong>một</strong> câu trả lời hay chưa được chứng minh gì cả, nó chỉ <strong>may mắn một lần</strong>.
Độ tin cậy thật đến từ việc chạy prompt trên một <strong>fixed eval set</strong> (bộ input cố định) và tinh chỉnh tới khi hành vi đứng vững trên cả bộ.
Hãy đối xử với prompt như <strong>code có version</strong>: version, pin model, regression test.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Eval set</strong>: bộ input cố định ("đóng băng") dùng để chấm mọi phiên bản prompt.</li>
  <li><strong>Test → observe → adjust</strong>: vòng lặp chạy, quan sát lỗi theo tiêu chí, sửa rồi chạy lại.</li>
  <li><strong>Representative / boundary / adversarial</strong>: ba loại input cần có trong eval set.</li>
  <li><strong>Eyeballing</strong>: sửa xong liếc một output rồi cho là ổn; không so sánh được gì.</li>
  <li><strong>Draft → review → refine</strong>: chuỗi 3 lần gọi: viết nháp, review theo tiêu chí, sửa theo review.</li>
  <li><strong>Self-check</strong>: thêm một dòng cuối prompt yêu cầu Claude tự kiểm tra câu trả lời theo tiêu chí trước khi kết thúc.</li>
  <li><strong>Pin the model</strong>: gắn prompt với một <strong>model ID cụ thể</strong>, không dùng alias trôi nổi.</li>
  <li><strong>Regression test</strong>: mỗi lần sửa, chạy lại cả eval set để chắc không làm hỏng chỗ khác.</li>
</ul>

<h3>Vòng lặp ba bước</h3>
<ol>
  <li><strong>Test</strong>: chạy prompt trên một bộ input cố định phản ánh <strong>đúng những gì production gửi tới</strong>, không phải một input bạn chọn vì biết nó sẽ qua.</li>
  <li><strong>Observe</strong>: xem output hỏng ở đâu, chấm theo <strong>tiêu chí viết rõ ràng</strong>, để đo hành vi thật thay vì ngắm một câu trả lời đẹp.</li>
  <li><strong>Adjust</strong>: sửa prompt cho những lỗi đã thấy, rồi <strong>chạy lại đúng bộ đó</strong> để xác nhận đã sửa được mà không làm hỏng chỗ khác.</li>
</ol>
<p>Lỗi ai cũng mắc lúc đầu: sửa prompt, chạy một lần, thấy đẹp, rồi đi tiếp. Nhưng một ví dụ qua được gần như không nói gì về độ tin cậy.
Còn 50 dạng input khác app của bạn sẽ gặp thì sao? Bằng chứng không phải một lần thắng, mà là <strong>kết quả nhất quán trên cả dải input</strong>.</p>

<h3>Eval set gồm gì, và vì sao phải "đóng băng"</h3>
<ul>
  <li><strong>Representative</strong>: ca hằng ngày app thật sự gặp, xác nhận đường chính chạy tốt.</li>
  <li><strong>Boundary</strong>: ca ở mép: field trống, input khổng lồ, yêu cầu mơ hồ; cho thấy hành vi bắt đầu cong ở đâu trước khi gãy.</li>
  <li><strong>Adversarial</strong>: input cố tình gài bẫy hoặc lén chèn chỉ dẫn; kiểm tra prompt có trụ được dưới áp lực không.</li>
</ul>
<div class="box">⚖️ <strong>Hình dung thế này:</strong> Bạn muốn biết chế độ ăn mới có làm giảm cân không. Nếu mỗi ngày cân trên một cái cân khác nhau (eyeballing),
con số lên xuống chẳng nói lên gì. Dùng <strong>cùng một cái cân</strong>, cùng giờ mỗi ngày (fixed eval set), thì mới thấy thay đổi là thật.</div>
<p>Khi <strong>eyeballing</strong>, mỗi thay đổi được chấm trên một input khác nhau nên bạn không biết cái gì tốt lên, cái gì tệ đi.
Với <strong>fixed eval set</strong>, mọi phiên bản chạy trên cùng input đã đóng băng: bạn thấy được "sửa 3 lỗi, không thêm lỗi nào", hoặc "chỗ này tốt lên, chỗ kia tệ đi".
Chính khả năng so sánh này làm cho thay đổi <strong>an toàn để giữ hoặc rollback</strong>.</p>

<h3>Hai công cụ tinh chỉnh: chuỗi đầy đủ và bản nhẹ</h3>
<ul>
  <li><strong>Draft → review → refine</strong>: Claude viết nháp; lần gọi thứ hai review theo tiêu chí rõ ràng (ví dụ: mọi claim đều có nguồn, dưới 200 từ, không bịa số liệu); lần thứ ba sửa đúng những gì review chỉ ra.
  Tách thành nhiều lần gọi giúp bạn <strong>log từng bước</strong>, đánh giá output trung gian và rẽ nhánh khi cần.</li>
  <li><strong>Self-check</strong>: nếu chuỗi đầy đủ quá nặng, thêm <strong>một dòng</strong> ở cuối prompt yêu cầu Claude kiểm tra câu trả lời theo tiêu chí trước khi xong.
  Cách này bắt lỗi khá đáng tin, đặc biệt mạnh với <strong>coding và math</strong>. Cần độ tin cậy cao hơn mà không muốn pipeline nhiều lần gọi → dùng self-check trước.</li>
</ul>

<h3>Prompt là code: version, pin, regression test</h3>
<ul>
  <li><strong>Version</strong>: để prompt trong <strong>source control</strong>, mọi thay đổi đều review được, tái tạo được, rollback được.</li>
  <li><strong>Pin the model</strong>: gắn với model ID cụ thể, vì bản phát hành mới có thể đổi hành vi mà prompt đã được tune theo; alias trôi nổi sẽ <strong>âm thầm thay đổi</strong>.</li>
  <li><strong>Regression test</strong>: mỗi lần sửa, chạy lại eval set đã đóng băng.</li>
  <li>"Validated" nghĩa là <strong>qua cả bộ, kể cả ca khó</strong>, không phải một demo đẹp.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề nói "sửa prompt, thử một lần thấy tốt nên ship" → đáp án đúng là <strong>chạy lại trên fixed eval set</strong> trước khi ship.</li>
  <li>Đề hỏi eval set nên có gì → <strong>representative + boundary + adversarial</strong>.</li>
  <li>Đề nói hành vi tự nhiên đổi sau khi có model mới → <strong>pin model ID</strong> và regression test.</li>
  <li>Đề muốn tăng độ tin cậy nhưng không muốn pipeline nhiều lần gọi → <strong>self-check một dòng</strong>.</li>
  <li>Đề cần log và đánh giá từng bước trung gian → <strong>draft → review → refine</strong> tách thành nhiều call.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Một output tốt là prompt đã ổn" → <strong>sai</strong>, đó chỉ là may mắn một lần.</li>
  <li>"Mỗi lần sửa thử với input mới cho đa dạng" → <strong>sai</strong>, input thay đổi thì không so sánh được; phải dùng bộ cố định.</li>
  <li>"Dùng alias model mới nhất cho tiện" → <strong>sai</strong>, alias có thể đổi âm thầm và làm lệch hành vi đã tune.</li>
  <li>"Sửa prompt chỉ là sửa chữ, không cần test" → <strong>sai</strong>, sửa prompt là thay đổi code, có thể gây regression như code.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Một lần đẹp là may, cả bộ đều qua mới là thật.</strong> Đóng băng input, rồi: <strong>version → pin → regression test</strong>.</p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
