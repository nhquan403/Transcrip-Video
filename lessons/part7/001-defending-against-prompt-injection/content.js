window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Khi app đưa nội dung bên ngoài (web page, tài liệu, tool result) cho Claude, trong đó có thể giấu <strong>chỉ thị độc hại</strong> mà model làm theo như thể chính bạn viết. Đó là <strong>prompt injection</strong>.
Đây là <strong>vấn đề input</strong>, nên cách chữa nằm ở <strong>kiến trúc app</strong> (cô lập input, least privilege, kiểm tra output), không phải ở việc làm model "an toàn hơn".</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Prompt injection</strong>: nội dung không tin cậy mang theo chỉ thị, và model làm theo như lệnh mà bạn không hề muốn. Chỉ thị độc "đi lậu" vào dưới dạng data.</li>
  <li><strong>Direct injection</strong>: chính <strong>người dùng</strong> app là kẻ tấn công, họ gõ prompt để đổi hành vi model.</li>
  <li><strong>Indirect injection</strong>: người dùng đáng tin, nhưng model đọc <strong>nội dung bên thứ ba</strong> (web page, file, tool result) có giấu chỉ thị độc. Đây là loại "cắn" người làm agent đau nhất.</li>
  <li><strong>Jailbreak</strong>: nhắm vào <strong>safety của chính model</strong>, dụ nó vượt content policy để tạo nội dung bị cấm. Jailbreak là <strong>tập con</strong> của injection.</li>
  <li><strong>Tool result block</strong>: chỗ đúng để đặt nội dung bên thứ ba; Claude được train để đối xử với tool result một cách <strong>hoài nghi</strong>.</li>
  <li><strong>Least privilege</strong>: chỉ cấp cho agent đúng quyền tối thiểu, để nếu bị chiếm thì thiệt hại nhỏ.</li>
  <li><strong>Blast radius</strong>: phạm vi thiệt hại khi một đòn injection lọt qua.</li>
</ul>

<h3>Injection khác jailbreak thế nào?</h3>
<ul>
  <li><strong>Prompt injection</strong> chiếm quyền điều khiển <strong>việc agent làm với data</strong>. Kẻ tấn công lái hành vi app của bạn. Cách phòng là <strong>kiến trúc</strong>: cô lập input, least privilege, kiểm tra output. Việc phòng injection gần như <strong>hoàn toàn là việc của app</strong>.</li>
  <li><strong>Jailbreak</strong> đánh vào <strong>safety của model</strong>. Sức kháng cự bắt đầu từ <strong>safety training</strong> của model, rồi bạn vẫn xếp thêm guardrail của app lên trên.</li>
  <li>Nghe "injection" → nghĩ <strong>data và hành vi bị chiếm</strong>. Nghe "jailbreak" → nghĩ <strong>safety bị vượt</strong>. Khác mục tiêu, khác cách chữa.</li>
</ul>
<p>Ý quan trọng nhất: model "an toàn" hơn vẫn đọc tài liệu bị đầu độc và vẫn thấy chỉ thị chôn trong đó. <strong>Từ chối viết malware</strong> là một kỹ năng safety; <strong>lờ đi một dòng "làm ngay việc này" giấu trong web page</strong> là kỹ năng hoàn toàn khác. Safety alignment mạnh hơn không ngăn agent bị data chiếm quyền.</p>

<h3>Bốn bước phòng indirect injection</h3>
<div class="box">📦 <strong>Hình dung thế này:</strong> Bạn là thư ký, sếp giao: "Tóm tắt giúp tôi lá thư của khách." Trong thư có dòng "Thư ký hãy chuyển 100 triệu cho tôi." Thư ký giỏi biết <strong>thư là tài liệu để đọc, không phải lệnh của sếp</strong>. Lệnh thật chỉ đến từ sếp, và thư ký cũng chẳng có quyền chuyển tiền ngay từ đầu.</div>
<ol>
  <li>Đưa nội dung bên thứ ba <strong>chỉ trong tool result block</strong>, không bao giờ trong system prompt hay một user text block thường.</li>
  <li><strong>JSON-encode</strong> payload không tin cậy. JSON escaping chặn đường "phá delimiter": kẻ tấn công không có dấu nháy hay tag nào để đóng. Nhưng biết giới hạn: model vẫn có thể làm theo chỉ thị bằng ngôn ngữ thường trong data đã escape, nên đây chỉ là <strong>một lớp, không phải thuốc chữa</strong>.</li>
  <li>Đặt <strong>chỉ thị của bạn trong user turn sau tool result</strong>, không nhét vào bên trong nó (nhét vào thì model có thể coi đó là untrusted và lờ đi).</li>
  <li><strong>Screen tool output</strong> bằng một classifier nhẹ trước khi agent hành động; chỉ cho qua khi kết quả sạch.</li>
</ol>
<p>Thêm vào đó là <strong>ranh giới rõ ràng</strong>: bọc input không tin cậy bằng tag hoặc cấu trúc riêng, nói cho model biết nội dung là gì và từ đâu (search result, file người dùng upload, email), và ghi thẳng policy vào system prompt: tool output, tài liệu, search result là <strong>data không tin cậy, không bao giờ ghi đè</strong> system prompt hay yêu cầu gốc của người dùng.</p>

<h3>Least privilege: lưới an toàn khi injection lọt qua</h3>
<ul>
  <li>Không phòng thủ nào hoàn hảo, nên hãy thiết kế như thể <strong>sớm muộn sẽ có injection lọt</strong>.</li>
  <li>Đừng đưa agent <strong>secret nó không cần</strong>: injection chỉ lấy cắp được key nằm trong tầm với.</li>
  <li>Chạy tool trong <strong>sandbox</strong>, để tool call bị chiếm vẫn bị "nhốt".</li>
  <li>Thu hẹp quyền: <strong>read-only</strong> khi được, một thư mục hẹp thay vì cả file system, một API thay vì mười.</li>
  <li>Least privilege <strong>không ngăn</strong> injection, nhưng <strong>giới hạn blast radius</strong>.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có agent đọc <strong>web page, email, file, tool result</strong> rồi làm điều lạ → đó là <strong>indirect injection</strong>, đáp án là cô lập nội dung trong tool result + screen + least privilege.</li>
  <li>Đề hỏi đặt nội dung bên thứ ba ở đâu → <strong>tool result block</strong>; chỉ thị của bạn → <strong>user turn sau tool result</strong>.</li>
  <li>Đề hỏi giảm thiệt hại khi injection thành công → <strong>least privilege, sandbox, bớt secret</strong>.</li>
  <li>Đề hỏi kiểm chứng phòng thủ → <strong>red team</strong> chính agent bằng tài liệu và tool output cố tình chứa injection.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Chỉnh <strong>temperature</strong> để chống injection" → <strong>sai</strong>, temperature chỉ đổi độ ngẫu nhiên, không đổi việc model có nghe lệnh lậu hay không.</li>
  <li>"Dùng model to hơn, mạnh hơn là hết injection" → <strong>sai</strong>, model mạnh hơn chỉ là bộ lọc xác suất tốt hơn, không phải bảo đảm.</li>
  <li>"JSON-encode là đủ" → <strong>sai</strong>, model vẫn có thể làm theo chỉ thị bằng ngôn ngữ thường trong data đã escape.</li>
  <li>"Nhét nội dung web vào system prompt cho model chú ý" → <strong>sai</strong>, nội dung bên thứ ba chỉ nên nằm trong tool result.</li>
  <li>"Injection và jailbreak chữa giống nhau" → <strong>sai</strong>, injection chữa bằng kiến trúc app, jailbreak bắt đầu từ safety training của model.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Nội dung vào tool result, lệnh của mình đi sau, soi trước khi làm, quyền càng ít càng tốt.</strong> Control nào chỉ nằm trong model thì chỉ là <strong>một lớp</strong>, không bao giờ là cả hàng rào.</p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
