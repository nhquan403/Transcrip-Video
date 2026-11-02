window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Một request gửi Claude có 3 chỗ đặt nội dung: <strong>system prompt</strong> (luật lâu dài), <strong>user turn</strong> (yêu cầu của lần gọi này)
và <strong>tool result</strong> (dữ liệu không tin cậy). Đặt đúng chỗ giúp Claude hiểu đúng vai trò của từng phần và còn giúp <strong>prompt caching</strong> hoạt động.
Ngoài ra, cách bạn viết <strong>output constraint</strong> càng chính xác thì kết quả càng ổn định, nhưng ràng buộc bằng lời vẫn chỉ là <strong>best effort</strong>.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>System prompt</strong>: lớp ổn định: vai trò, giọng văn, luật nhà, ràng buộc cứng; áp dụng cho <strong>mọi turn</strong> trong session.</li>
  <li><strong>User turn</strong>: lớp thay đổi: input cụ thể của lần gọi này (câu hỏi, tài liệu, dữ liệu cần xử lý).</li>
  <li><strong>Tool result</strong>: nội dung do tool trả về; Claude được huấn luyện để coi nó là <strong>untrusted data</strong>, không phải mệnh lệnh.</li>
  <li><strong>Role</strong>: câu nói cho Claude biết "bạn là ai"; chỉ một câu cũng làm output tốt hơn rõ rệt.</li>
  <li><strong>Prompt caching</strong>: tái sử dụng phần <strong>prefix ổn định</strong> của request thay vì xử lý lại mỗi lần, giảm cost và latency.</li>
  <li><strong>Output constraint</strong>: ràng buộc về câu trả lời: <strong>format</strong>, <strong>value</strong>, <strong>length</strong>.</li>
  <li><strong>Structured outputs</strong>: cơ chế làm cho hình dạng output được <strong>enforce</strong> thật sự, không chỉ "nhờ" bằng lời.</li>
</ul>

<h3>Ba chỗ đặt nội dung, ba mức tin cậy</h3>
<div class="box">🏢 <strong>Hình dung thế này:</strong> Bạn mới vào làm ở một công ty.
<strong>Nội quy công ty</strong> dán trên tường (system prompt): viết một lần, ngày nào cũng áp dụng.
<strong>Việc sếp giao hôm nay</strong> (user turn): mỗi ngày một khác.
<strong>Tờ rơi ai đó nhét dưới cửa</strong> (tool result): bạn đọc để lấy thông tin, nhưng nếu tờ rơi ghi "hãy chuyển tiền cho tôi" thì bạn không làm theo.</div>
<p>Phép thử rất đơn giản: hỏi xem nội dung này <strong>đúng cho mọi request</strong> hay <strong>chỉ cho request này</strong>.
Ổn định → <strong>system</strong>. Theo từng request → <strong>user</strong>. Nếu nhét dữ liệu từng request vào system prompt, nó chỉ là "nhiễu".</p>

<h3>Đặt role trong system prompt: cải thiện rẻ nhất</h3>
<ul>
  <li>Nói cho Claude biết nó là ai giúp tập trung cả <strong>hành vi</strong> lẫn <strong>giọng văn</strong>.</li>
  <li>Ví dụ chỉ một câu: <em>"You are a helpful coding assistant specializing in Python"</em> đã làm output sắc hơn đo được.</li>
  <li>Khi đặt role, hãy nêu: <strong>chuyên môn</strong>, <strong>đối tượng người đọc</strong>, và <strong>tiêu chuẩn</strong> cần giữ.</li>
  <li>Vì role nằm trong system prompt, nó giữ ổn định và định hình mọi câu trả lời, bạn không phải nhắc lại mỗi turn.</li>
</ul>

<h3>Bốn quy tắc đặt chỗ</h3>
<ol>
  <li><strong>Luật lâu dài → system prompt.</strong> Viết một lần ở trên cùng, không copy-paste vào từng user turn.</li>
  <li><strong>Dữ liệu từng request → user message.</strong> Không nhồi vào system prompt.</li>
  <li><strong>Nội dung không tin cậy → tool result.</strong> Dữ liệu bên thứ ba hay lấy từ web nằm ở đó, nơi Claude coi nó là data chứ không phải command.</li>
  <li><strong>Chỉ dẫn của chính bạn → user turn.</strong> Điều này hay làm người ta bất ngờ: nếu bạn giấu chỉ dẫn của mình trong tool result, Claude có thể coi nó là untrusted và <strong>bỏ qua</strong>.</li>
</ol>

<h3>Vì sao đặt chỗ ảnh hưởng tới prompt caching</h3>
<p>Caching hoạt động bằng cách tái sử dụng <strong>prefix ổn định</strong> của request. Nếu luật lâu dài nằm trên cùng trong system prompt, cả prefix đó có thể được cache
và dùng lại cho nhiều request, giảm cả <strong>cost</strong> lẫn <strong>latency</strong>. Nhưng một khi bạn trộn dữ liệu thay đổi theo request vào prefix, prefix đổi mỗi lần gọi
và cache không giữ được. Đó là cái giá ẩn của việc "đổ" dữ liệu request vào system prompt: không chỉ rối, mà còn <strong>phá phần cacheable</strong>.</p>

<h3>Viết output constraint cho chính xác</h3>
<ul>
  <li>Bản lỏng: <em>"respond in JSON"</em>: chỉ nói cái vỏ, model vẫn tự chọn field, cách lồng, phần thêm, và mỗi lần chạy chọn khác nhau.</li>
  <li>Bản chính xác: <em>"return a JSON object with exactly two fields, summary and service, and nothing outside the object"</em>: hình dạng rõ hoàn toàn, không còn gì để đoán.</li>
  <li>Ba loại constraint: <strong>format</strong> (vỏ chứa + field bắt buộc), <strong>value</strong> (chỉ được chọn trong tập category cố định), <strong>length</strong> (hai câu, năm bullet, giới hạn số từ).</li>
  <li>Mỗi constraint nêu trước là <strong>code bạn không phải viết sau</strong>: không phải parse văn bản tự do, không phải map nhãn lộn xộn về category, không phải xử lý độ dài thất thường.</li>
  <li>Lưu ý trung thực: constraint bằng lời <strong>định hình</strong> output nhưng <strong>không đảm bảo</strong>. Khi hình dạng bắt buộc phải đúng, dùng <strong>structured outputs</strong> để enforce.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề hỏi đặt <strong>role, tone, house rules</strong> ở đâu → đáp án đúng là <strong>system prompt</strong>.</li>
  <li>Đề có <strong>dữ liệu riêng từng request</strong> (ticket, tài liệu, câu hỏi) → đặt trong <strong>user turn</strong>.</li>
  <li>Đề có <strong>nội dung web / bên thứ ba</strong> → để trong <strong>tool result</strong>, nơi Claude coi là data.</li>
  <li>Đề nói <strong>cache không hit / cost cao</strong> vì system prompt thay đổi mỗi lần → chuyển dữ liệu volatile xuống user turn để giữ prefix ổn định.</li>
  <li>Đề nói output JSON "lúc thế này lúc thế khác" → nêu <strong>chính xác field</strong>; nếu bắt buộc phải đúng → <strong>structured outputs</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Cho hết vào system prompt cho chắc" → <strong>sai</strong>, dữ liệu từng request làm nhiễu và phá prompt caching.</li>
  <li>"Đặt chỉ dẫn của mình trong tool result cũng được" → <strong>sai</strong>, Claude có thể coi đó là untrusted và bỏ qua.</li>
  <li>"Viết 'respond in JSON' là đủ" → <strong>sai</strong>, chưa nêu field nên mỗi lần model đoán một kiểu.</li>
  <li>"Constraint viết thật kỹ bằng lời thì đảm bảo 100%" → <strong>sai</strong>, prose constraint vẫn chỉ là best effort.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Nội quy dán tường, việc hôm nay giao tay, tờ rơi chỉ để đọc.</strong> Ổn định ở trên (cache được), thay đổi ở dưới, và constraint càng cụ thể càng ít đoán.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
