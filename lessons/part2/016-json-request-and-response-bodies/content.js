window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Lời gọi REST đã chạy mà request vẫn bị từ chối, hoặc không tìm thấy câu trả lời trong response?
Gần như luôn là chuyện <strong>body JSON</strong>. Một lời gọi Claude là <strong>một object JSON đi</strong> và <strong>một object JSON về</strong>.
Hiểu ba viên gạch của JSON và hình dạng hai object đó, code tự viết ra được.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Object:</strong> cặp khóa và giá trị trong ngoặc nhọn <code>{ }</code>. Cả request là một object lớn.</li>
  <li><strong>Array:</strong> danh sách có thứ tự trong ngoặc vuông <code>[ ]</code>, như mảng messages.</li>
  <li><strong>Scalar:</strong> giá trị lá: string, number, boolean, null.</li>
  <li><strong>UTF-8:</strong> cách mã hóa chữ thành byte; JSON đi trên đường truyền dưới dạng text UTF-8.</li>
  <li><strong>Base64:</strong> cách biến dữ liệu nhị phân (ảnh, tài liệu) thành chuỗi chữ.</li>
</ul>

<h3>Ba viên gạch của JSON</h3>
<div class="box">🪆 <strong>Hình dung thế này:</strong> Như búp bê Nga lồng nhau. Object chứa array, array chứa object, và trong cùng là các giá trị đơn giản (scalar).
Sự lồng nhau đó chính là toàn bộ "ngôn ngữ" JSON.</div>
<ul>
  <li><strong>Object:</strong> cả request bạn gửi là một object lớn; các khóa như <code>model</code>, <code>messages</code> nằm bên trong.</li>
  <li><strong>Array:</strong> mảng messages giữ các lượt theo thứ tự, và content trong mỗi lượt cũng là một array.</li>
  <li><strong>Scalar:</strong> điền dữ liệu thật như nội dung tin nhắn hay số token.</li>
</ul>

<h3>Object request</h3>
<ul>
  <li><strong>Ba khóa cốt lõi</strong> gần như mọi lời gọi cần: <code>model</code> (chuỗi tên model), <code>messages</code> (mảng các lượt),
  và <code>max_tokens</code> (trần độ dài câu trả lời), cái mà <strong>người ta hay quên</strong>.</li>
  <li><strong>Khóa tùy chọn</strong> mở thêm hành vi: <code>system</code> (system prompt), <code>temperature</code> (độ ngẫu nhiên), <code>tools</code> (các hàm Claude gọi được).</li>
</ul>
<p>Hình dung đơn giản: một object JSON, vài khóa bắt buộc, vài khóa tùy chọn thêm khi cần.</p>

<h3>Mảng messages: chỗ người mới hay mô hình sai</h3>
<ul>
  <li>Mỗi phần tử là <strong>một lượt</strong>, gồm <strong>role</strong> (user hoặc assistant) và <strong>content</strong>.</li>
  <li>Điều mấu chốt: content <strong>không phải một chuỗi trơn</strong> mà là danh sách <strong>block có kiểu</strong>: text, image, tool_use, tool_result.
  Nhờ vậy một lượt trộn được chữ với ảnh, hay mang một lời gọi tool cạnh câu trả lời.</li>
  <li>Thứ tự quan trọng: Claude đọc các lượt theo thứ tự mảng. Muốn nói tiếp thì <strong>nối</strong> lượt user và assistant mới vào cuối.</li>
</ul>

<h3>Object response: ba trường gánh việc</h3>
<ul>
  <li><strong>content:</strong> cũng là mảng block. Chữ của model nằm trong <strong>trường text của block text</strong>, không phải một chuỗi ở cấp cao nhất.</li>
  <li><strong>stop_reason:</strong> lý do dừng: <code>end_turn</code> (xong tự nhiên), <code>max_tokens</code> (hết chỗ), <code>tool_use</code> (muốn gọi tool, đang chờ bạn), <code>stop_sequence</code> (chuỗi dừng của bạn vừa xuất hiện).</li>
  <li><strong>usage:</strong> số token vào và ra, dùng để theo dõi chi phí và tính ngân sách context.</li>
</ul>

<h3>Ba bước đọc response</h3>
<ol>
  <li><strong>Duyệt mảng content</strong>, tìm các block có type là text; có nhiều thì nối lại.</li>
  <li><strong>Kiểm tra stop_reason</strong> trước khi tin output: max_tokens nghĩa là bị cắt (có thể viết tiếp); tool_use nghĩa là code của bạn còn việc phải làm.</li>
  <li><strong>Đọc usage</strong> và ghi log số token.</li>
</ol>
<p>Làm đủ ba bước mỗi lần là bạn đang đối xử với body như <strong>dữ liệu có cấu trúc</strong>, thay vì hy vọng chuỗi nằm đúng chỗ.</p>

<h3>Request và response soi gương nhau</h3>
<ul>
  <li><strong>Request:</strong> bạn nắm quyền: model, messages, max_tokens, các tham số tùy chọn. Mọi trường là thứ bạn quyết định.</li>
  <li><strong>Response:</strong> bạn đọc thứ server tạo ra: mảng content, stop_reason, usage, và metadata như id của message và model đã thật sự chạy.</li>
</ul>
<p>Cả hai đều là object JSON, đều dùng mảng block cho content, và lồng nhau theo cùng một kiểu. Hiểu ra điều đó thì lời gọi Claude hết "phép màu".</p>

<h3>Mã hóa và kích thước body</h3>
<p>JSON là text thuần, <code>content-type: application/json</code>, đi trên đường truyền dưới dạng <strong>UTF-8</strong>. Với chữ thì ổn.
Ảnh hay tài liệu là dữ liệu nhị phân, không nhét thẳng vào text được, nên phải <strong>mã hóa Base64</strong> thành chuỗi trước.
⚠️ Base64 làm dữ liệu <strong>to thêm khoảng một phần ba</strong>, nên vài ảnh độ phân giải cao có thể làm request phình rất nhanh.
Thu nhỏ ảnh khi được, và đừng ngạc nhiên khi một bức ảnh chiếm chỗ trong body nhiều hơn hẳn một đoạn văn.</p>

<h3>Từ JSON thô tới code</h3>
<p>Ngôn ngữ của bạn biến JSON thành cấu trúc gốc: object thành dictionary trong Python (hoặc class có kiểu nếu dùng SDK), array thành list để lặp.
Lấy câu trả lời chỉ là <strong>điều hướng</strong>: vào list content, lấy block text, đọc trường text. SDK còn trao object có thuộc tính đặt tên để editor tự gợi ý.
Dù cách nào, bài học vẫn vậy: <strong>từ trên xuống dưới đều là dữ liệu có cấu trúc</strong>.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Đi ra: model, messages, max_tokens. Trở về: content, stop_reason, usage.</li>
  <li>Content là mảng block, không phải chuỗi: duyệt theo type để lấy text.</li>
  <li>Ảnh đi dưới dạng Base64, to hơn khoảng một phần ba; để ý tổng kích thước request.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">every builder hits early</em>: ai làm cũng gặp từ sớm.</li>
  <li><em class="en">Let's ground JSON in three building blocks</em>: hãy neo JSON vào ba viên gạch.</li>
  <li><em class="en">That nesting is the whole language</em>: sự lồng nhau đó là toàn bộ ngôn ngữ.</li>
  <li><em class="en">piece by piece</em>: từng mảnh một.</li>
  <li><em class="en">layered on when you need them</em>: chồng thêm khi cần.</li>
  <li><em class="en">this is where beginners model things wrong</em>: đây là chỗ người mới hay mô hình sai.</li>
  <li><em class="en">carry the weight</em>: gánh phần chính.</li>
  <li><em class="en">reaching for those three fields</em>: quen tay lấy ba trường đó.</li>
  <li><em class="en">hoping a string is where you left it</em>: hy vọng chuỗi vẫn nằm chỗ bạn để.</li>
  <li><em class="en">balloon your request</em>: làm request phình to.</li>
  <li><em class="en">It's structured data all the way down</em>: từ trên xuống dưới đều là dữ liệu có cấu trúc.</li>
  <li><em class="en">the code writes itself</em>: code gần như tự viết ra.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson16/Lesson16.java</code>. Có 5 bài: nhận loại của một giá trị JSON, tìm khóa cốt lõi bị thiếu,
lấy câu trả lời từ JSON thô bằng cách duyệt content, tính độ dài Base64, và ước lượng kích thước body (byte UTF-8 của chữ cộng Base64 của ảnh).
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-16"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-16 --live"</code>: chương trình tự dựng body JSON có một ảnh Base64, cho thấy kích thước body,
phát hiện thiếu max_tokens trước khi gửi, rồi đọc câu trả lời từ JSON thô bằng code của bạn.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Request bị từ chối hoặc không tìm thấy câu trả lời trong response. Theo bài học, nguyên nhân thường nằm ở đâu?', options: ['Ở mạng chập chờn', 'Ở body JSON', 'Ở model quá tải', 'Ở API key hết hạn'], answer: 1, explain: '"The request keeps getting rejected, or you can\'t find the model\'s answer in what comes back. Almost always, it points to the JSON body."' },
    { q: 'Ba viên gạch của JSON là gì?', options: ['Header, body, footer', 'Model, messages, max_tokens', 'Object, array, scalar', 'String, number, boolean'], answer: 2, explain: '"First, objects... Second, arrays... Third, scalars." Ba thứ đó lồng nhau tạo nên mọi lời gọi Claude.' },
    { q: 'Toàn bộ request gửi cho Claude là gì về mặt JSON?', options: ['Một object lớn', 'Một array các chuỗi', 'Một chuỗi dài', 'Nhiều object rời nhau'], answer: 0, explain: '"The entire request you send is one big object, and keys, like model and messages, live inside it."' },
    { q: 'Giá trị nào là scalar?', options: ['{"role": "user"}', '[1, 2, 3]', 'Một lượt trong messages', 'null'], answer: 3, explain: '"Those are the simple leaf values. Strings, numbers, booleans, and null."' },
    { q: 'Khóa cốt lõi nào người ta HAY QUÊN nhất?', options: ['model', 'max_tokens', 'messages', 'role trong từng lượt'], answer: 1, explain: '"The third one people forget is max tokens, which caps how long the reply can get."' },
    { q: 'Khóa nào là TÙY CHỌN trong request?', options: ['model (tên model)', 'messages', 'temperature', 'max_tokens'], answer: 2, explain: '"On top of that, you\'ve got optional keys that unlock more behavior. A system field... Temperature nudges randomness. A tools array..."' },
    { q: 'Mỗi phần tử trong mảng messages gồm hai phần nào?', options: ['role (user/assistant) và content', 'model và text', 'id và value', 'user và assistant'], answer: 0, explain: '"Each item in the array is one turn, and every turn has two parts. A role... and content."' },
    { q: '"Điều mấu chốt" về content của một lượt là gì?', options: ['Content luôn là một chuỗi trơn', 'Content chỉ chứa được text', 'Content phải viết bằng tiếng Anh', 'Danh sách block có kiểu'], answer: 3, explain: '"Here\'s the key insight. Content isn\'t a plain string. It\'s a list of typed blocks."' },
    { q: 'Thiết kế content dạng block cho phép điều gì?', options: ['Gửi nhiều model trong một request', 'Trộn chữ, ảnh, tool trong một lượt', 'Bỏ qua max_tokens', 'Không cần role'], answer: 1, explain: '"That design is what lets a single turn mix text and images, or carry a tool call alongside a reply."' },
    { q: 'Muốn tiếp tục hội thoại, bạn làm gì với mảng messages?', options: ['Thay mảng bằng lượt mới nhất', 'Chèn lượt mới lên đầu', 'Nối lượt mới vào cuối', 'Gộp mọi lượt thành một chuỗi'], answer: 2, explain: '"Claude reads the turns in array order. So to continue a conversation, you append each new user and assistant message on to the end."' },
    { q: 'Chữ trả lời của Claude nằm ở đâu trong response?', options: ['Trong block text của content', 'Trong một trường "completion" ở cấp cao nhất', 'Trong usage, cạnh số token', 'Trong stop_reason'], answer: 0, explain: '"The model\'s text sits inside a text block in its text field. You pull the answer out of there, not from some top-level string."' },
    { q: 'stop_reason "stop_sequence" nghĩa là gì?', options: ['Claude muốn gọi tool', 'Hết chỗ output', 'Claude từ chối', 'Gặp chuỗi dừng tự đặt'], answer: 3, explain: '"And stop sequence means one of your custom stop strings fired."' },
    { q: 'usage dùng để làm gì?', options: ['Chọn model', 'Theo dõi chi phí', 'Đặt giới hạn rate', 'Lưu lịch sử hội thoại'], answer: 1, explain: '"Third, usage. That\'s your input and output token counts, which you read for cost tracking and for budgeting context."' },
    { q: 'Bước đầu tiên khi đọc response là gì?', options: ['Đọc usage', 'Đọc id của message', 'Duyệt content lấy text', 'Đọc model đã chạy'], answer: 2, explain: '"Step one, loop over the content array and find the blocks with type text. That\'s where the answer lives."' },
    { q: 'Vì sao phải kiểm tra stop_reason trước khi tin output?', options: ['Vì output có thể bị cắt hoặc còn việc', 'Vì stop_reason chứa câu trả lời', 'Vì stop_reason quyết định giá', 'Vì không kiểm tra thì API báo lỗi'], answer: 0, explain: '"Step two, check stop reason before you trust the output. If it says max tokens, your reply got cut off... If it says tool use, your code has work to do."' },
    { q: 'Response có content = [thinking, text "REST là ", tool_use, text "phong cách API."]. Câu trả lời đầy đủ là gì?', options: ['"REST là "', '"phong cách API."', 'Không lấy được vì block đầu là thinking', '"REST là phong cách API."'], answer: 3, explain: 'Duyệt cả mảng, lấy mọi block text và "concatenate them if there\'s more than one".' },
    { q: 'Request và response giống nhau ở điểm nào?', options: ['Cùng do bạn quyết định mọi trường', 'Cùng là object JSON, content đều là mảng block lồng nhau', 'Cùng có trường usage', 'Cùng có trường max_tokens'], answer: 1, explain: '"Notice the symmetry. Both are JSON objects, both use arrays of blocks for content, and both nest the same way."' },
    { q: 'Metadata nào có trong response mà bài học nhắc tới?', options: ['API key của bạn', 'Temperature đã dùng', 'Id message và model đã chạy', 'Địa chỉ IP của server'], answer: 2, explain: '"Some metadata, like the message ID and which model actually ran."' },
    { q: 'JSON đi trên đường truyền dưới dạng gì?', options: ['Text UTF-8', 'Nhị phân nén', 'XML', 'Base64'], answer: 0, explain: '"The content type is application slash JSON, and the body goes over the wire as UTF-8 text."' },
    { q: 'Vì sao ảnh phải Base64 trước khi gửi trong JSON?', options: ['Để nén ảnh nhỏ hơn', 'Để mã hóa bảo mật', 'Để Claude đọc nhanh hơn', 'Vì JSON là text, ảnh là nhị phân'], answer: 3, explain: '"You can\'t drop raw binary into text, so those get Base64 encoded into a string first."' },
    { q: 'Base64 làm dữ liệu thay đổi kích thước thế nào?', options: ['Nhỏ đi một nửa', 'To hơn ~1/3', 'Giữ nguyên', 'To gấp đôi'], answer: 1, explain: '"Base64 makes data bigger, roughly a third larger than the original bytes."' },
    { q: 'Ảnh 3 MB gửi dạng Base64 chiếm khoảng bao nhiêu trong body?', options: ['Khoảng 1,5 MB vì Base64 nén ảnh', '3 MB', 'Khoảng 4 MB', '6 MB'], answer: 2, explain: 'Base64 to hơn khoảng một phần ba: 3 MB × 4/3 ≈ 4 MB.' },
    { q: 'Khi làm prompt nhiều ảnh, nên chú ý điều gì?', options: ['Tổng kích thước request', 'Chỉ dùng ảnh GIF', 'Đặt ảnh sau text', 'Tắt max_tokens'], answer: 0, explain: '"When you\'re building multimodal prompts, keep an eye on total request size. Resize images when you can."' },
    { q: 'Trong Python không dùng SDK, object JSON của response thành gì?', options: ['Một chuỗi', 'Một list', 'Một tuple bất biến các cặp khóa', 'Một dictionary'], answer: 3, explain: '"A JSON object becomes a dictionary in Python, or a typed class if you\'re using the SDK. Arrays become lists you can loop over."' },
    { q: 'Lấy câu trả lời từ response, về bản chất là việc gì?', options: ['Tìm kiếm toàn văn', 'Điều hướng theo cấu trúc', 'Dùng regex trên chuỗi thô', 'Gọi thêm một API khác'], answer: 1, explain: '"So reaching Claude\'s answer is just navigation. You go into the content list, grab the first text block, and read its text field."' },
    { q: 'SDK giúp thêm gì khi đọc response?', options: ['Bỏ qua stop_reason', 'Tự gộp mọi block thành một chuỗi', 'Trao object có kiểu', 'Tự retry mọi lỗi 400'], answer: 2, explain: '"The SDK smooths this further by handing you typed objects with named attributes, so your editor auto-completes the fields."' },
    { q: '"Cái bẫy" mà bài học cảnh báo cuối cùng là gì?', options: ['Coi content như một chuỗi trơn ở cấp cao nhất', 'Dùng quá nhiều khóa tùy chọn', 'Đặt max_tokens quá lớn', 'Dùng temperature'], answer: 0, explain: '"The trap is treating content like a string."' },
    { q: 'Body thiếu khóa nào? {"model": "...", "messages": [...], "system": "..."}', options: ['model', 'messages (mảng các lượt)', 'system (tùy chọn)', 'max_tokens'], answer: 3, explain: 'Ba khóa cốt lõi là model, messages, max_tokens. system là tùy chọn; ở đây thiếu max_tokens.' },
    { q: 'Câu "Xin chào" chiếm bao nhiêu byte UTF-8 so với số ký tự?', options: ['Bằng số ký tự', 'Nhiều hơn, vì chữ có dấu chiếm 2-3 byte', 'Ít hơn số ký tự', 'Luôn đúng 2 byte mỗi ký tự'], answer: 1, explain: 'Body đi dưới dạng UTF-8; chữ ASCII 1 byte, chữ có dấu như "à" chiếm nhiều byte hơn, nên "Xin chào" nhiều byte hơn 8.' },
    { q: 'Câu tổng kết của bài là gì?', options: ['Một lời gọi gồm nhiều object JSON rời rạc', 'Câu trả lời luôn ở cấp cao nhất', 'Một object đi, một object về', 'JSON chỉ dùng cho request'], answer: 2, explain: '"A Claude call is one JSON object out and another back. Look for model, messages, and max tokens going out, and content, stop reason, and usage coming back."' },
  ],
};
