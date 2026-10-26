window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Bài này có hai tính năng khác hẳn nhau. <strong>Streaming</strong> đổi <strong>cách</strong> câu trả lời đến:
từng mẩu, theo một chuỗi sự kiện có thứ tự cố định, thay vì một cục ở cuối. <strong>Vision</strong> đổi <strong>thứ</strong> Claude nhận vào:
bạn gửi ảnh như một block, ngay cạnh text. Vision là <strong>hiểu</strong> ảnh, không phải tạo hay sửa ảnh.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>SSE (Server-Sent Events):</strong> cách server đẩy một chuỗi sự kiện qua một kết nối HTTP. Bật bằng <code>"stream": true</code>.</li>
  <li><strong>Delta:</strong> một mẩu nhỏ của block đang được gửi dần.</li>
  <li><strong>partial JSON:</strong> mẩu chuỗi JSON chưa hoàn chỉnh của input tool khi stream.</li>
  <li><strong>Base64:</strong> cách mã hóa dữ liệu ảnh thành chữ để nhét thẳng vào request.</li>
  <li><strong>Files API:</strong> nơi upload file trước một lần, sau đó tham chiếu bằng <code>file_id</code>.</li>
  <li><strong>Visual token:</strong> mỗi ô 28×28 pixel của ảnh tính là một token.</li>
</ul>

<h3>Streaming trông thế nào trên đường truyền?</h3>
<p>Bật <code>stream: true</code> và bạn nhận một chuỗi sự kiện theo <strong>thứ tự cố định</strong>:</p>
<ol>
  <li><strong>message_start:</strong> một "vỏ" message với content <strong>rỗng</strong>, chưa có chữ nào.</li>
  <li>Với mỗi block: <strong>content_block_start</strong>, rồi nhiều <strong>content_block_delta</strong> mang từng mẩu nội dung, rồi <strong>content_block_stop</strong>.</li>
  <li><strong>message_delta:</strong> mang <strong>stop_reason</strong> và <strong>usage</strong> tổng.</li>
  <li><strong>message_stop:</strong> đóng mọi thứ.</li>
</ol>
<p>Hai sự kiện "dọn dẹp" là <strong>ping</strong> và <strong>error</strong> có thể xuất hiện ở bất kỳ đâu giữa chừng. Biết thứ tự này thì đọc stream không phải đoán.</p>

<h3>Ba chi tiết cứu bạn khỏi bug</h3>
<ul>
  <li><strong>message_start không phải dữ liệu:</strong> content của nó rỗng. Đọc chữ từ đó chỉ nhận được trống không; coi nó là tín hiệu "bắt đầu".</li>
  <li><strong>Delta chỉ là mảnh:</strong> việc của bạn là <strong>nối dần</strong> từng delta cho tới khi block kết thúc.</li>
  <li><strong>Đừng tìm stop_reason và usage sớm:</strong> chúng chỉ tới ở <strong>message_delta</strong> gần cuối.</li>
</ul>

<h3>Tool call khi stream: partial JSON</h3>
<div class="box">🧩 <strong>Hình dung thế này:</strong> Một tấm thiệp được gửi bằng nhiều phong bì, mỗi phong bì một mẩu chữ: <code>{"id": "A</code>, rồi <code>12", "lang</code>, rồi <code>": "vi"}</code>.
Đọc từng mẩu riêng thì vô nghĩa. Bạn <strong>ghép đủ rồi mới đọc một lần</strong>.</div>
<p>Khi một block tool_use được stream, tham số không đến dưới dạng JSON hoàn chỉnh. Mỗi delta có type <code>input_json_delta</code> và trường <code>partial_json</code>
chứa một mẩu nhỏ. Client <strong>nối</strong> các mẩu lại và chỉ <strong>parse ở content_block_stop</strong>, khi block đã đủ.
Input cuối cùng của tool <strong>luôn là một object JSON hoàn chỉnh</strong>, nên đừng cố parse giữa dòng: chờ sự kiện stop, parse một lần.</p>

<h3>Khi nào nên stream?</h3>
<ul>
  <li><strong>Câu trả lời dài:</strong> người dùng thấy chữ hiện dần thay vì nhìn vòng xoay chờ.</li>
  <li><strong>Giao diện chat</strong> hiện từng token.</li>
  <li>Streaming đổi <strong>trải nghiệm</strong>, không đổi <strong>nội dung</strong> câu trả lời.</li>
</ul>
<p>⚠️ <strong>Batches API không hỗ trợ streaming</strong>: batch chạy nền, không có kết nối sống nào để stream. Dùng batch cho việc lớn thì chấp nhận bỏ streaming cho các request đó.
Với mọi thứ tương tác theo thời gian thực, streaming thường là mặc định tốt hơn.</p>

<h3>Vision: ba cách cấp ảnh</h3>
<ul>
  <li><strong>Base64:</strong> nhét thẳng dữ liệu ảnh đã mã hóa, kèm media type như <code>image/png</code>. Chạy được ở mọi nơi.</li>
  <li><strong>URL:</strong> một đường link, hệ thống tự tải về. Request của bạn nhỏ gọn.</li>
  <li><strong>File ID:</strong> tham chiếu một ảnh đã upload trước qua Files API; dùng lại qua nhiều lượt mà không gửi lại byte.</li>
</ul>

<h3>Quy tắc thực hành cho vision</h3>
<ul>
  <li><strong>Định dạng:</strong> JPEG, PNG, GIF, WebP. Ảnh động chỉ được đọc <strong>khung đầu tiên</strong>.</li>
  <li><strong>Vị trí:</strong> đặt <strong>ảnh trước</strong> phần text nói về nó. Ảnh trước, câu hỏi sau cho kết quả tốt nhất.</li>
  <li><strong>Nhiều ảnh:</strong> đánh nhãn "Image 1", "Image 2" để nhắc tới đúng ảnh.</li>
</ul>

<h3>Giới hạn và chi phí</h3>
<ul>
  <li><strong>Trần cứng:</strong> mỗi ảnh tối đa 8000×8000 pixel và 10MB khi gửi base64 qua Claude API. Vượt là <strong>bị từ chối</strong>.</li>
  <li><strong>Tier độ phân giải của model</strong> là giới hạn khác: ảnh có cạnh dài vượt mức chỉ bị <strong>thu nhỏ</strong>, không bị từ chối.
  Model mới như Opus 4.8 nhận cạnh dài tới 2.576 pixel nên giữ nhiều chi tiết hơn.</li>
  <li><strong>Chi phí:</strong> ảnh được chia thành ô 28×28 pixel, mỗi ô là một visual token. Ảnh càng lớn càng tốn.</li>
</ul>

<h3>Vision KHÔNG làm gì?</h3>
<ul>
  <li>Không tạo ảnh mới, không sửa ảnh bạn gửi. Vision là <strong>hiểu</strong>.</li>
  <li>Không lấy metadata ẩn trong file; theo chính sách, không nhận diện hay gọi tên người thật trong ảnh.</li>
  <li>Đếm vật thể hay vị trí chính xác chỉ là <strong>gần đúng</strong>.</li>
  <li>Về riêng tư: ảnh gửi inline trong request chỉ dùng để trả lời rồi bị bỏ, không được lưu.</li>
</ul>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Stream là chuỗi sự kiện từ message_start tới message_stop; stop_reason và usage đến ở message_delta.</li>
  <li>Tool input khi stream là partial JSON: nối dần, parse một lần ở content_block_stop. Batches không stream được.</li>
  <li>Vision nhận ảnh qua base64, URL hoặc file ID; đặt ảnh trước text; chỉ hiểu ảnh, không tạo ảnh.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">arriving live instead of all at once</em>: đến trực tiếp từng phần thay vì một lần.</li>
  <li><em class="en">on the wire</em>: trên đường truyền.</li>
  <li><em class="en">a message shell with empty content</em>: một vỏ message với content rỗng.</li>
  <li><em class="en">housekeeping events</em>: sự kiện dọn dẹp, duy trì kết nối.</li>
  <li><em class="en">without guessing</em>: không phải đoán.</li>
  <li><em class="en">it trips people up</em>: nó làm nhiều người vấp.</li>
  <li><em class="en">don't try to parse midstream</em>: đừng cố parse giữa dòng.</li>
  <li><em class="en">staring at a spinner</em>: nhìn chằm chằm vòng xoay chờ.</li>
  <li><em class="en">Pick whichever fits</em>: chọn cái nào hợp.</li>
  <li><em class="en">None of these are heavy lifts</em>: không cái nào nặng nhọc.</li>
  <li><em class="en">hard caps</em>: giới hạn cứng.</li>
  <li><em class="en">set expectations correctly</em>: đặt kỳ vọng cho đúng.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson09/Lesson09.java</code>. Có 5 bài: lấy tên sự kiện từ SSE thô, kiểm tra thứ tự sự kiện,
ghép stream thành message (text nối dần, partial JSON chỉ parse ở cuối block, stop_reason và usage từ message_delta),
ước tính visual token của ảnh, và dựng block ảnh theo ba cách cấp. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-09"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-09 --live"</code>: chương trình gọi REST với <code>stream: true</code>, đưa SSE thô cho parser của bạn,
in các mảnh partial_json thật rồi object đã ghép; sau đó vẽ một ảnh 5 hình tròn đỏ, gửi base64 (ảnh trước câu hỏi) cho Claude đếm và so với ước tính token của bạn.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Streaming và vision lần lượt thay đổi điều gì?', options: ['Giá token của mỗi lời gọi và tốc độ suy nghĩ của model', 'Cách câu trả lời đến tay bạn, và những thứ Claude nhận được làm đầu vào', 'Model được chọn và vùng server', 'Độ dài prompt và độ dài câu trả lời'], answer: 1, explain: '"Streaming changes how a response reaches you... Vision changes what Claude can take in, letting you send images right alongside your text."' },
    { q: 'Bật streaming bằng cách nào?', options: ['Thêm header x-stream: enabled vào mọi request gửi đi', 'Gọi endpoint /v1/stream', 'Đặt "stream": true trong body', 'Đặt max_tokens bằng 0'], answer: 2, explain: '"You turn it on by setting stream to true, and instead of one final response, you get a series of events in a fixed, predictable order."' },
    { q: 'Sự kiện nào mở đầu một stream?', options: ['message_start', 'content_block_start', 'ping', 'message_delta'], answer: 0, explain: '"It opens with message start, which hands you a message shell with empty content, no text yet."' },
    { q: 'Thứ tự đúng của các sự kiện cho MỘT block là gì?', options: ['content_block_delta → content_block_start → content_block_stop', 'content_block_stop → content_block_delta → content_block_start', 'content_block_start → content_block_stop → content_block_delta', 'content_block_start → nhiều content_block_delta → content_block_stop'], answer: 3, explain: '"For each block of the response, you get a content block start, followed by a run of content block delta events... and finally, a content block stop."' },
    { q: 'stop_reason và usage tổng đến ở sự kiện nào?', options: ['message_start', 'message_delta', 'content_block_stop', 'ping'], answer: 1, explain: '"After the blocks, a message delta arrives with the stop reason and the usage totals, and then message stop closes everything out."' },
    { q: 'Hai sự kiện có thể xuất hiện ở bất kỳ đâu giữa stream là gì?', options: ['message_start và message_stop', 'content_block_start và content_block_stop', 'ping và error', 'message_delta và content_block_delta'], answer: 2, explain: '"Two housekeeping events, ping and error, can show up anywhere in between."' },
    { q: 'Code đọc text từ message.content trong sự kiện message_start. Kết quả là gì?', options: ['Không có gì', 'Toàn bộ câu trả lời', 'Câu đầu tiên của câu trả lời', 'Lỗi 400'], answer: 0, explain: '"Message start gives you a message object, but its content is empty. If you try to read text out of it, you\'ll get nothing, so treat it as a signal."' },
    { q: 'Mỗi content_block_delta chứa gì?', options: ['Toàn bộ nội dung của block đó, đã hoàn chỉnh', 'Toàn bộ message', 'Usage của block', 'Một mảnh nhỏ của block, mà bạn phải nối dần cho tới khi block kết thúc'], answer: 3, explain: '"Each content block delta is only a fragment of the block, so your job is to accumulate them, appending each delta until the block finishes."' },
    { q: 'Khi tool_use được stream, tham số của tool đến dưới dạng gì?', options: ['Một object JSON hoàn chỉnh ở content_block_start', 'Các mẩu partial JSON trong input_json_delta', 'Một chuỗi base64', 'Một file đính kèm'], answer: 1, explain: '"Its arguments don\'t arrive as finished JSON. Instead, they come in as partial JSON. The delta type is input JSON delta, and each one carries a partial JSON field."' },
    { q: 'Khi nào nên parse JSON input của tool trong stream?', options: ['Ngay khi nhận mỗi mẩu', 'Ở message_start', 'Ở content_block_stop', 'Ở mẩu thứ hai, khi đã đủ ngữ cảnh để đoán phần còn lại'], answer: 2, explain: '"You only parse it at content block stop when the block is complete."' },
    { q: 'Bạn nhận ba mẩu partial_json: "{\\"id\\": \\"A", "12\\", \\"lang", "\\": \\"vi\\"}". Cách xử lý đúng là gì?', options: ['Nối lại, parse một lần ở cuối block', 'Parse từng mẩu, bỏ mẩu nào lỗi', 'Chỉ parse mẩu cuối', 'Gửi lại request để nhận JSON đầy đủ'], answer: 0, explain: '"Your client\'s job is to concatenate those chunks as they arrive... Wait for the stop event, then parse once, and you\'ll always get a well-formed object."' },
    { q: 'Input cuối cùng của tool sau khi stream xong luôn là gì?', options: ['Một chuỗi có thể chưa đóng ngoặc', 'Một mảng các mẩu', 'Một chuỗi base64', 'Một object JSON hoàn chỉnh, hợp lệ'], answer: 3, explain: '"The final tool input is always a complete JSON object, never a partial string."' },
    { q: 'Streaming thay đổi điều gì về câu trả lời?', options: ['Nội dung câu trả lời tốt hơn', 'Trải nghiệm', 'Câu trả lời ngắn hơn', 'Chi phí giảm một nửa'], answer: 1, explain: '"When streaming is the right call, because it changes the experience, not the answer itself."' },
    { q: 'Tình huống nào hợp nhất với streaming?', options: ['Phân loại 50.000 ticket chạy qua đêm', 'Một job batch đánh giá mô hình', 'Câu trả lời dài trong giao diện chat', 'Tính tổng hóa đơn trong cơ sở dữ liệu'], answer: 2, explain: '"The classic case is long outputs... streaming lets your users watch it appear instead of staring at a spinner."' },
    { q: 'Câu nào ĐÚNG về Batches API và streaming?', options: ['Batches API không hỗ trợ streaming', 'Batches API stream nhanh hơn sync', 'Batches API chỉ stream được text, không stream được tool_use', 'Batches API stream qua WebSocket'], answer: 0, explain: '"Streaming isn\'t supported inside the Batches API. Batches are built for large, asynchronous jobs that run in the background, so there\'s no live connection to stream over."' },
    { q: 'Ba cách cấp ảnh cho Claude là gì?', options: ['PNG, JPEG, GIF', 'Upload FTP, email, USB', 'Inline SVG, CSS, canvas', 'Base64, URL, file ID'], answer: 3, explain: '"Base64, URL, or file ID. Pick whichever fits how your images are stored."' },
    { q: 'Khi gửi ảnh base64, bạn phải kèm thông tin gì?', options: ['Kích thước file tính bằng byte và chiều rộng, chiều cao', 'Media type, ví dụ image/png', 'Tên file gốc', 'Ngày chụp ảnh'], answer: 1, explain: '"Base64, where you inline the raw image data encoded as Base64 and tell Claude the media type, something like image slash png."' },
    { q: 'Lợi ích của việc dùng file ID là gì?', options: ['Ảnh được nén nhỏ hơn', 'Ảnh không tốn token', 'Upload một lần, dùng lại qua nhiều lượt mà không phải gửi lại byte', 'Ảnh được lưu vĩnh viễn công khai'], answer: 2, explain: '"A file ID, a reference to an image you uploaded ahead of time through the Files API, which you can reuse across turns without sending the bytes again."' },
    { q: 'Định dạng ảnh nào KHÔNG nằm trong danh sách Claude đọc được?', options: ['BMP', 'JPEG', 'WebP', 'GIF'], answer: 0, explain: '"Claude reads the common web image types, JPEG, PNG, GIF, and WebP."' },
    { q: 'Bạn gửi một GIF động 20 khung. Claude đọc gì?', options: ['Cả 20 khung', 'Khung ở giữa, vì thường là khung rõ nét nhất', 'Khung cuối', 'Chỉ khung đầu tiên'], answer: 3, explain: '"If you hand it an animated image, know that only the first frame is actually read, so don\'t rely on animation."' },
    { q: 'Nên đặt ảnh ở đâu so với câu hỏi về ảnh?', options: ['Sau câu hỏi', 'Trước câu hỏi', 'Trong system prompt', 'Ở một lượt riêng sau câu trả lời'], answer: 1, explain: '"As a rule, put the image before the text that talks about it. Leading with the image and then asking your question gives the best results."' },
    { q: 'Gửi nhiều ảnh trong một prompt, nên làm gì?', options: ['Ghép thành một ảnh lớn', 'Chỉ gửi một ảnh mỗi request', 'Đánh nhãn Image 1, Image 2', 'Đặt tên file thật dài'], answer: 2, explain: '"When you\'re sending more than one image in a single prompt, label them something as simple as image one, image two, so you can refer to a specific one later."' },
    { q: 'Ảnh 9000×6000 pixel gửi base64 qua Claude API. Điều gì xảy ra?', options: ['Bị từ chối vì vượt trần cứng 8000 pixel', 'Được thu nhỏ tự động', 'Được cắt thành hai ảnh', 'Chỉ đọc phần 8000×6000 đầu tiên của ảnh'], answer: 0, explain: '"A single image can be up to 8,000 by 8,000 pixels... Go past those hard caps and the image is rejected."' },
    { q: 'Ảnh 4000×3000 pixel (dưới trần cứng) gửi cho model có cạnh dài tối đa 2.576 pixel. Điều gì xảy ra?', options: ['Bị từ chối', 'Bị cắt bớt phần vượt quá 2.576 pixel ở cạnh dài', 'Báo lỗi định dạng', 'Được thu nhỏ, không bị từ chối'], answer: 3, explain: '"The model\'s resolution tier is a different limit. An image over the long edge tier just gets downscaled, not rejected."' },
    { q: 'Chi phí ảnh được tính thế nào?', options: ['Một token cho mỗi ảnh', 'Theo số ô 28×28 pixel', 'Theo dung lượng file', 'Miễn phí nếu dùng URL'], answer: 1, explain: '"It breaks it into patches, each one 28 by 28 pixels, and every patch counts as a single visual token. So bigger images cost more tokens."' },
    { q: 'Ảnh 56×56 pixel tốn khoảng bao nhiêu visual token?', options: ['1', '2', '4', '56'], answer: 2, explain: 'Mỗi ô 28×28 là một token: 56/28 = 2 ô mỗi chiều, 2 × 2 = 4 visual token.' },
    { q: 'Khi độ phân giải thật sự quan trọng, điều gì cũng là một phần của quyết định?', options: ['Chọn model', 'Chọn trình duyệt', 'Chọn định dạng GIF', 'Chọn giờ gửi request'], answer: 0, explain: '"The newer models, like Opus 4.8, handle a longer edge, up to 2,576 pixels... When resolution really matters, the model you choose is part of the decision."' },
    { q: 'Việc nào vision LÀM ĐƯỢC?', options: ['Tạo một ảnh mới theo mô tả', 'Sửa ảnh bạn gửi', 'Gọi tên người thật trong ảnh', 'Diễn giải nội dung ảnh'], answer: 3, explain: '"Vision means understanding images, not creating them. Claude can read and interpret a picture, but it can\'t generate a new image or edit the one you sent."' },
    { q: 'Bạn nhờ Claude đếm số người trong ảnh đám đông và đo vị trí từng người. Nên đối xử với kết quả thế nào?', options: ['Chính xác tuyệt đối', 'Là kết quả gần đúng', 'Sai hoàn toàn, không nên dùng', 'Chính xác nếu ảnh là PNG'], answer: 1, explain: '"When you ask Claude to count objects or give exact positions, treat those answers as approximate, not exact measurements."' },
    { q: 'Ảnh gửi inline trong request được xử lý thế nào về riêng tư?', options: ['Lưu lại 30 ngày để dùng cho việc huấn luyện model', 'Lưu vĩnh viễn trong Files API', 'Dùng xong rồi bỏ, không lưu', 'Công khai qua một URL'], answer: 2, explain: '"The image content you send in line in a request is ephemeral. It\'s used to answer your request and then discarded, not stored."' },
  ],
};
