window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Bộ tool là một <strong>"thực đơn"</strong> mà Claude đọc ở mỗi lượt, nên càng gọn và sắc thì Claude chọn càng đúng.
<strong>Ít tool hơn nhưng mạnh hơn</strong>, thiết kế theo <strong>workflow thật của agent</strong> (không phải theo từng endpoint API), và phải <strong>đo bằng eval</strong> chứ không đoán.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Tool set design</strong>: tinh chỉnh name, description, schema của <strong>tất cả tool cùng lúc</strong>, để mỗi tool đứng vững cạnh các tool "hàng xóm".</li>
  <li><strong>Selection ambiguity</strong>: sự mơ hồ khi chọn tool, vì có nhiều tool trông na ná nhau.</li>
  <li><strong>Consolidation</strong>: gộp nhiều thao tác trên cùng một tài nguyên thành <strong>một tool có tham số</strong>.</li>
  <li><strong>Action parameter</strong>: tham số chọn thao tác, ví dụ <code>action</code> = create / review / merge.</li>
  <li><strong>Thin wrapper</strong>: tool chỉ bọc đúng một endpoint API, hiếm khi là hình dạng phù hợp cho agent.</li>
  <li><strong>High-signal output</strong>: kết quả trả về chỉ gồm những field Claude thật sự cần.</li>
  <li><strong>Stable identifier</strong>: slug hoặc ID bền vững, dễ đọc, để Claude dùng lại ở lần gọi sau.</li>
  <li><strong>Verbosity control</strong>: cho phép chọn kết quả ngắn gọn (concise) hay chi tiết (detailed).</li>
</ul>

<h3>Một định nghĩa "đủ phần" mà phần nào cũng hỏng</h3>
<p>Bài giảng đưa ví dụ tool tên <strong>Billing Lookup</strong>, mô tả chỉ có "Gets Billing Info", schema chỉ có một chuỗi mở tên <code>query</code>. Có đủ name, description, schema, nhưng:</p>
<ul>
  <li><strong>Name</strong> không nói hành động cụ thể nào.</li>
  <li><strong>Description</strong> không cho Claude căn cứ để phân biệt với các tool bên cạnh.</li>
  <li><strong>Schema</strong> là chuỗi mở, dễ khiến Claude "bịa" tham số.</li>
</ul>
<p>Bài học: mỗi định nghĩa phải tốt <strong>khi đặt cạnh các tool khác trong bộ</strong>, không chỉ tốt khi đứng một mình.</p>

<h3>Nguyên tắc cốt lõi: ít mà sắc, thiết kế theo workflow</h3>
<div class="box">🍜 <strong>Hình dung thế này:</strong> Một quán phở có thực đơn 5 món rõ ràng thì khách gọi nhanh và đúng.
Quán có 80 món, trong đó 15 món tên gần giống nhau, thì khách phân vân và hay gọi nhầm. Thêm món chỉ khi thật sự cần, và mỗi món phải "xứng đáng có mặt".</div>
<ul>
  <li>Mỗi tool nên ứng với <strong>một hành động rõ ràng</strong>, input dễ đoán. Năng lực đến từ <strong>phạm vi sắc</strong>, không phải từ số lượng.</li>
  <li>Sai lầm phổ biến: <strong>một tool cho mỗi API endpoint</strong>. Nó chỉ sao chép bề mặt API, bắt agent phải tự xâu chuỗi nhiều lệnh cấp thấp và làm thực đơn đầy những tool gần trùng nhau.</li>
  <li><strong>Gộp (consolidate)</strong>: thay vì ba tool create, review, merge pull request, hãy làm <strong>một tool với tham số action</strong>. Claude chỉ cần chọn một tool rồi điền tham số.</li>
  <li>Ba thói quen: <strong>match real workflows</strong> (tool schedule event tự tìm người và đặt lịch bên trong), <strong>compile context</strong> (một lần gọi gom đủ thông tin thay vì nhiều lần đọc nhỏ), <strong>avoid thin wrappers</strong>.</li>
</ul>

<h3>Description ở cấp độ "bộ" và output tốt</h3>
<ul>
  <li>Khi hai tool đều có thể hợp, dòng <strong>"when not to use"</strong> giữ Claude khỏi chọn nhầm, nhưng nó chỉ có giá trị khi được viết <strong>dựa trên đúng các tool hàng xóm</strong>.</li>
  <li>Giải thích <strong>mỗi tham số thay đổi hành vi thế nào</strong>, vì đó thường là chi tiết tách hai tool trông giống nhau.</li>
  <li>Gọi sai tool trong vòng lặp agent → <strong>viết lại description trước</strong>, trước khi động vào thứ khác. Schema nói cái gì hợp lệ về cấu trúc; description nói khi nào lời gọi phù hợp.</li>
  <li>Output: trả về <strong>high-signal</strong> (không bloat, vì phí context), <strong>stable identifiers</strong> dễ đọc thay vì mã khó hiểu, và có <strong>verbosity control</strong>.</li>
</ul>

<h3>Đo, đừng đoán: eval cho bộ tool</h3>
<ul>
  <li>Đọc thôi thì không phân biệt được bộ tool tốt hay xấu. Hãy tạo một loạt <strong>task thực tế cần nhiều tool</strong> và cho agent chạy.</li>
  <li>Theo dõi không chỉ độ chính xác mà cả <strong>số lần gọi tool, token tiêu thụ, runtime, lỗi</strong>.</li>
  <li>Đọc <strong>reasoning transcript</strong>: đó là nơi lộ ra description mơ hồ (Claude lưỡng lự giữa hai tool, hoặc chọn nhầm).</li>
  <li>Sửa thường chỉ là đổi câu chữ trong description → chạy lại eval → so sánh.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có "agent hay chọn nhầm giữa nhiều tool giống nhau" → đáp án đúng thường là <strong>gộp tool / làm sắc description</strong>, không phải thêm tool.</li>
  <li>Đề có "mỗi endpoint một tool, agent phải gọi nhiều lần" → đáp án là <strong>thiết kế tool theo workflow</strong>.</li>
  <li>Đề có create/review/merge tách rời → đáp án là <strong>một tool + action parameter</strong>.</li>
  <li>Đề hỏi "làm sao biết bộ tool tốt" → <strong>eval với task thực tế, đo call count, tokens, runtime, errors, đọc transcript</strong>.</li>
  <li>Đề có response quá dài làm tốn context → <strong>high-signal output, verbosity control</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Càng nhiều tool, agent càng giỏi" → <strong>sai</strong>, nhiều tool lookalike làm tăng chọn nhầm.</li>
  <li>"Một tool cho mỗi endpoint là linh hoạt nhất" → <strong>sai</strong>, nó bắt agent tự ghép nhiều lệnh cấp thấp.</li>
  <li>"Gọi nhầm tool thì sửa schema trước" → <strong>sai</strong>, viết lại description trước.</li>
  <li>"Đọc kỹ định nghĩa là đủ đánh giá bộ tool" → <strong>sai</strong>, phải đo bằng eval.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Thực đơn ngắn, món rõ, nấu theo bữa ăn thật, nếm thử bằng eval.</strong></p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
