window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Ý chính của cả bài:</strong> Agent SDK đóng gói đúng vòng lặp agent đang chạy bên trong Claude Code thành một thư viện.
Hàm <code>query()</code> là cửa vào chính: gọi nó là có một agent chạy ngay trong chương trình của bạn.
Ba đặc điểm cần nhớ: <strong>độc lập</strong> (không cần cài Claude Code CLI), <strong>dạng luồng</strong> (message chảy ra dần),
và <strong>gắn với phiên</strong> (mỗi lần gọi là một phiên mới).</p>

<h3>1. Các mảnh ghép</h3>
<ul>
  <li><strong>Agent SDK</strong> là một thư viện, đóng gói cùng bộ tool, vòng lặp agent và cách quản lý context của Claude Code. Có cho Python và TypeScript.</li>
  <li><strong>query()</strong> là cửa vào chính của thư viện: bạn gọi nó, nó chạy vòng lặp agent cho bạn.</li>
  <li>Điều nhiều người bỏ lỡ: SDK <strong>độc lập</strong>. Bạn không cần cài công cụ dòng lệnh Claude Code ở đâu cả. Import gói, gọi query, thế là có agent.</li>
  <li>Mặc định, <strong>mỗi lần gọi query là một phiên mới</strong>, không nhớ gì về lần gọi trước. Đây là điều bạn phải thiết kế xoay quanh.</li>
</ul>

<h3>2. Cài đặt và xác thực</h3>
<ul>
  <li>Python: cài gói <code>claude-agent-sdk</code> bằng pip, cần Python 3.10 trở lên.</li>
  <li>TypeScript: cài gói <code>@anthropic-ai/claude-agent-sdk</code> từ npm.</li>
  <li>Xác thực chỉ là một biến môi trường: đặt <code>ANTHROPIC_API_KEY</code> là xong.</li>
  <li>Nếu công ty chạy Claude qua nhà cung cấp đám mây, bạn bật một cờ môi trường thay thế: có cờ cho Amazon Bedrock và Google Vertex.</li>
</ul>
<p>Để ý điều bạn <em>không</em> làm: không cài thêm công cụ dòng lệnh nào. Một import, một thông tin xác thực, và cả vòng lặp agent đã sẵn sàng.</p>

<h3>3. query() và ClaudeSDKClient không phải hai thiết kế đối nghịch</h3>
<p>Bạn sẽ nghe SDK có hai cửa vào: <code>query()</code> và <code>ClaudeSDKClient</code>. Chúng <strong>không phải hai vòng lặp khác nhau</strong>,
mà là hai cách đi vào cùng một vòng lặp.</p>
<ul>
  <li><strong>query():</strong> hàm dùng nhiều nhất. Chạy một việc, mỗi lần gọi là một phiên mới.</li>
  <li><strong>ClaudeSDKClient:</strong> một đối tượng giữ một phiên mở qua nhiều lần gọi, và cho phép ngắt một lần chạy đang diễn ra.</li>
</ul>
<p>Khác biệt thật nằm ở <strong>vòng đời phiên và khả năng ngắt</strong>, không phải động cơ bên dưới.
Dùng query trước, chỉ chuyển sang client khi cần phiên lâu dài hoặc ngắt trực tiếp.</p>

<h3>4. Điều khiển agent bằng options</h3>
<ul>
  <li><strong>System prompt:</strong> vai trò và chỉ dẫn agent tuân theo ở mọi lượt.</li>
  <li><strong>Danh sách tool:</strong> quyết định model được phép làm những hành động nào, từ đọc file tới gọi hàm của bạn.</li>
  <li><strong>Model:</strong> chọn model Claude nào chạy vòng lặp.</li>
  <li><strong>Max turns:</strong> giới hạn số lượt dùng tool trước khi vòng lặp dừng.</li>
</ul>
<p>Giới hạn cuối quan trọng hơn vẻ ngoài: không có giới hạn, agent có thể lặp lâu hơn nhiều so với ý bạn.
Cùng một hàm query, cấu hình khác nhau, cho ra những agent rất khác nhau.</p>

<h3>5. Kết quả trả về là một luồng</h3>
<p>Gọi query, thứ trả về <strong>không phải một chuỗi hoàn chỉnh</strong> mà là một <strong>async iterator</strong>.
Bạn lặp qua nó, đọc từng message ngay khi agent tạo ra: suy luận, lời gọi tool, rồi câu trả lời cuối.
Chính dạng luồng này làm SDK có cảm giác "sống": bạn xem lần chạy diễn ra thay vì chờ một khối trả lời lớn.</p>
<p>Các message có kiểu và đến theo đúng thứ tự:</p>
<ul>
  <li><strong>init:</strong> mở đầu lần chạy, báo cấu hình đã chốt (model, tool, system prompt).</li>
  <li><strong>assistant:</strong> suy luận của model và các lời gọi tool, tiếp theo là kết quả tool trả về. Cứ qua lại như vậy khi agent làm việc.</li>
  <li><strong>result:</strong> đóng lần chạy, mang tổng chi phí, lượng token dùng, và trạng thái thành công hay chạm giới hạn.</li>
</ul>

<h3>6. Phiên mới mỗi lần gọi</h3>
<p>Mỗi lần gọi mở một phiên mới, không nhớ lần gọi trước. Muốn agent nhớ cuộc hội thoại cũ, đó là thứ bạn <strong>chủ động bật</strong>,
không phải thứ được cho không. Cả lần chạy diễn ra ngay trong tiến trình của bạn, không có công cụ dòng lệnh nào chạy phía sau.</p>

<h3>7. Lộ trình bắt đầu</h3>
<ul>
  <li>Lần gọi đầu có thể rất nhỏ: một prompt, options mặc định, lặp qua các message để xem vòng lặp chạy từ đầu tới cuối.</li>
  <li>Chạy được rồi thì thêm tool để agent làm hành động thật thay vì chỉ trả lời bằng chữ.</li>
  <li>Trước khi giao việc dài hoặc tốn kém, thêm giới hạn max turns để một lần chạy bị kẹt không quay mãi.</li>
</ul>
<p>Bạn không đổi cửa vào lần nào: cùng một query chạy ví dụ hai dòng cũng là query chạy agent dùng tool. Nó lớn lên cùng bạn.</p>

<h3>8. Tóm tắt</h3>
<ul>
  <li>query() chạy vòng lặp agent của Agent SDK ngay trong code của bạn.</li>
  <li>Một hàm, cấu hình bằng prompt, tool và giới hạn lượt, đưa bạn từ lần gọi đầu tới một agent thật.</li>
  <li>query và client dùng chung một vòng lặp, không phải hai.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">entry point</em>: cửa vào, điểm bắt đầu.</li>
  <li><em class="en">standalone</em>: độc lập, không phụ thuộc thứ khác.</li>
  <li><em class="en">rival designs</em>: các thiết kế cạnh tranh nhau.</li>
  <li><em class="en">session lifecycle</em>: vòng đời của phiên.</li>
  <li><em class="en">standing instructions</em>: chỉ dẫn thường trực, áp dụng mọi lúc.</li>
  <li><em class="en">unfold</em>: diễn ra, mở ra dần.</li>
  <li><em class="en">opt into</em>: chủ động chọn tham gia, bật lên.</li>
  <li><em class="en">spin forever</em>: quay mãi không dừng.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Agent SDK thật chỉ có cho Python và TypeScript, nên ở bài này bạn tự dựng một <code>query()</code> thu nhỏ bằng Java để hiểu nó làm gì bên trong.
Mở <code>java-app/src/main/java/lesson06/Lesson06.java</code>: viết vòng lặp đẩy ra lần lượt các message init, assistant, user (kết quả tool), result;
phiên mới mỗi lần gọi; chỉ chạy tool được phép; dừng khi chạm max turns; và đọc kết quả an toàn.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="06"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="06 --live"</code>: query() của bạn điều khiển, Claude là model bên trong,
và bạn theo dõi luồng message trực tiếp.</p>
`,

  quiz: [
    { q: 'Agent SDK là gì?', options: ['Một thư viện đóng gói cùng bộ tool, vòng lặp agent và quản lý context của Claude Code', 'Một ứng dụng web', 'Một model mới', 'Một trình soạn thảo code'], answer: 0, explain: 'Agent SDK là Claude Code được đóng gói thành thư viện, có cho Python và TypeScript.' },
    { q: 'query() đóng vai trò gì trong Agent SDK?', options: ['Một hàm truy vấn cơ sở dữ liệu', 'Cửa vào chính: gọi nó là vòng lặp agent chạy cho bạn', 'Một công cụ dòng lệnh', 'Một loại tool'], answer: 1, explain: 'query() là điểm vào chính của thư viện.' },
    { q: 'Để dùng Agent SDK, có cần cài công cụ dòng lệnh Claude Code không?', options: ['Có, bắt buộc', 'Có, nếu dùng Python', 'Không, SDK độc lập', 'Chỉ khi dùng tool'], answer: 2, explain: 'Import gói, gọi query là có agent, không cần CLI.' },
    { q: 'Mặc định, mỗi lần gọi query() thì sao?', options: ['Tiếp tục phiên trước', 'Nhớ ba lần gọi gần nhất', 'Dùng chung phiên với mọi người dùng', 'Bắt đầu một phiên mới, không nhớ lần gọi trước'], answer: 3, explain: 'Phiên mới là mặc định bạn cần thiết kế xoay quanh.' },
    { q: 'Phiên bản Python tối thiểu để dùng Agent SDK là bao nhiêu?', options: ['3.10', '2.7', '3.6', '3.12'], answer: 0, explain: 'Bài học nói cần Python 3.10 trở lên.' },
    { q: 'Cách xác thực đơn giản nhất cho Agent SDK là gì?', options: ['Đăng nhập bằng trình duyệt mỗi lần chạy', 'Đặt biến môi trường ANTHROPIC_API_KEY', 'Gửi email cho Anthropic', 'Cài chứng chỉ SSL'], answer: 1, explain: 'Xác thực chỉ là một biến môi trường.' },
    { q: 'Công ty chạy Claude qua nhà cung cấp đám mây thì làm sao?', options: ['Không dùng được SDK', 'Phải viết lại vòng lặp', 'Bật cờ môi trường tương ứng, ví dụ cho Amazon Bedrock hoặc Google Vertex', 'Dùng một SDK khác'], answer: 2, explain: 'Có cờ riêng để đi qua nhà cung cấp mà hạ tầng đang dùng.' },
    { q: 'query() và ClaudeSDKClient khác nhau thế nào?', options: ['Hai vòng lặp hoàn toàn khác nhau', 'Một cái cho Python, một cái cho Java', 'Một cái nhanh, một cái chậm', 'Hai cách đi vào cùng một vòng lặp, khác ở vòng đời phiên và khả năng ngắt'], answer: 3, explain: 'Chúng không phải hai thiết kế đối nghịch mà dùng chung một động cơ.' },
    { q: 'Khi nào nên chuyển từ query() sang ClaudeSDKClient?', options: ['Khi cần giữ phiên mở qua nhiều lần gọi hoặc ngắt trực tiếp một lần chạy', 'Luôn luôn', 'Khi muốn tiết kiệm token', 'Khi dùng nhiều tool'], answer: 0, explain: 'Dùng query trước, chuyển sang client khi cần phiên lâu dài hoặc ngắt.' },
    { q: 'Option nào quyết định model được phép làm những hành động nào?', options: ['System prompt', 'Danh sách tool', 'Model', 'Max turns'], answer: 1, explain: 'Danh sách tool giới hạn những hành động model có thể làm.' },
    { q: 'System prompt trong options dùng để làm gì?', options: ['Chọn model', 'Giới hạn chi phí', 'Đặt vai trò và chỉ dẫn agent tuân theo ở mọi lượt', 'Đặt tên phiên'], answer: 2, explain: 'System prompt là vai trò và chỉ dẫn thường trực.' },
    { q: 'Max turns giới hạn điều gì?', options: ['Số người dùng', 'Số ký tự của câu trả lời', 'Số model được dùng', 'Số lượt dùng tool trước khi vòng lặp dừng'], answer: 3, explain: 'Max turns giới hạn số lượt dùng tool.' },
    { q: 'Vì sao giới hạn max turns quan trọng hơn vẻ ngoài?', options: ['Vì không có giới hạn, agent có thể lặp lâu hơn nhiều so với ý bạn', 'Vì nó làm model thông minh hơn', 'Vì API bắt buộc', 'Vì nó giảm độ trễ mạng'], answer: 0, explain: 'Không có giới hạn, một lần chạy có thể quay mãi.' },
    { q: 'Gọi query() thì nhận lại gì?', options: ['Một chuỗi hoàn chỉnh', 'Một async iterator để đọc từng message khi agent tạo ra', 'Một file log', 'Một số nguyên mã lỗi'], answer: 1, explain: 'Kết quả là một luồng, không phải một khối trả lời.' },
    { q: 'Vì sao dạng luồng làm SDK có cảm giác "sống"?', options: ['Vì nó chạy trên máy chủ riêng', 'Vì nó dùng giọng nói', 'Vì bạn xem lần chạy diễn ra thay vì chờ một khối trả lời lớn', 'Vì nó nhanh hơn API'], answer: 2, explain: 'Bạn đọc từng message ngay khi chúng xuất hiện.' },
    { q: 'Message đầu tiên trong luồng là gì?', options: ['result', 'assistant', 'tool result', 'init, báo cấu hình đã chốt'], answer: 3, explain: 'Message init mở đầu lần chạy và báo model, tool, system prompt.' },
    { q: 'Message result ở cuối mang những thông tin gì?', options: ['Tổng chi phí, lượng token, và trạng thái thành công hay chạm giới hạn', 'Chỉ câu trả lời', 'Danh sách tool', 'Mật khẩu phiên'], answer: 0, explain: 'Result đóng lần chạy với chi phí, usage và trạng thái.' },
    { q: 'Giữa init và result, những message nào lặp lại?', options: ['Chỉ init', 'Assistant (suy luận và lời gọi tool) rồi kết quả tool, qua lại khi agent làm việc', 'Chỉ result', 'Không có gì'], answer: 1, explain: 'Đó là phần qua lại của vòng lặp.' },
    { q: 'Muốn agent nhớ cuộc hội thoại trước thì sao?', options: ['Tự động có', 'Không thể', 'Phải chủ động bật tính năng lưu phiên', 'Phải dùng model lớn hơn'], answer: 2, explain: 'Sự ghi nhớ là thứ bạn chủ động bật, không được cho không.' },
    { q: 'Ba đặc điểm của một lần chạy query() là gì?', options: ['Nhanh, rẻ, đẹp', 'Đọc, ghi, xóa', 'Đồng bộ, khóa, toàn cục', 'Độc lập, dạng luồng, gắn với phiên'], answer: 3, explain: 'Ba đặc điểm này khiến query hết còn giống phép thuật.' },
    { q: 'Lần chạy query() diễn ra ở đâu?', options: ['Ngay trong tiến trình của bạn', 'Trên một CLI chạy nền', 'Trên trình duyệt của người dùng', 'Trên máy của Anthropic qua SSH'], answer: 0, explain: 'Thư viện mang cả vòng lặp vào tiến trình của bạn.' },
    { q: 'Bước đầu tiên được khuyên khi bắt đầu với query() là gì?', options: ['Viết ngay agent phức tạp nhiều tool', 'Một lần gọi nhỏ: một prompt, options mặc định, lặp qua các message để xem vòng lặp chạy', 'Cài Claude Code CLI', 'Viết vòng lặp riêng'], answer: 1, explain: 'Lần gọi đầu có thể rất nhỏ.' },
    { q: 'Sau khi lần gọi đầu chạy được, bước tiếp theo là gì?', options: ['Đổi sang ClaudeSDKClient', 'Xóa system prompt', 'Thêm tool để agent làm hành động thật', 'Tắt luồng message'], answer: 2, explain: 'Thêm tool để agent hành động thay vì chỉ trả lời bằng chữ.' },
    { q: 'Trước khi giao cho agent một việc dài hoặc tốn kém, nên làm gì?', options: ['Tăng model', 'Bỏ tool', 'Đổi ngôn ngữ', 'Thêm giới hạn max turns'], answer: 3, explain: 'Để một lần chạy bị kẹt không quay mãi.' },
    { q: 'Khi agent lớn dần (thêm tool, thêm giới hạn), bạn có phải đổi cửa vào không?', options: ['Không, cùng một query() chạy cả ví dụ nhỏ lẫn agent dùng tool', 'Có, phải đổi sang client', 'Có, phải viết vòng lặp riêng', 'Có, phải đổi model'], answer: 0, explain: 'query lớn lên cùng bạn khi việc lớn dần.' },
    { q: 'Tình huống: một hàm xử lý mỗi request độc lập, không cần nhớ gì. Nên dùng gì?', options: ['ClaudeSDKClient để giữ phiên', 'query(), mỗi lần gọi một phiên mới', 'Không dùng SDK', 'Managed Agents'], answer: 1, explain: 'Phiên mới mỗi lần gọi chính là điều việc này cần.' },
    { q: 'Tình huống: ứng dụng chat cần ngắt câu trả lời khi người dùng bấm dừng. Nên dùng gì?', options: ['query() với max turns bằng 0', 'Gọi API trực tiếp không có SDK', 'ClaudeSDKClient, vì nó cho phép ngắt lần chạy đang diễn ra', 'Không làm được'], answer: 2, explain: 'Ngắt trực tiếp là lý do để chuyển sang client.' },
    { q: 'Vì sao nói query() "hết giống phép thuật" khi hiểu ba đặc điểm của nó?', options: ['Vì nó không dùng AI', 'Vì nó chạy chậm', 'Vì nó chỉ trả về chuỗi', 'Vì nó chỉ là một lời gọi độc lập, dạng luồng, gắn với phiên vào một vòng lặp rõ ràng'], answer: 3, explain: 'Hiểu ba đặc điểm thì query là một cơ chế rõ ràng.' },
    { q: 'Cùng một hàm query() nhưng cấu hình khác nhau thì sao?', options: ['Cho ra những agent rất khác nhau', 'Luôn cho cùng kết quả', 'Báo lỗi', 'Phải khởi động lại máy'], answer: 0, explain: 'Prompt, tool, model và giới hạn lượt quyết định agent trông như thế nào.' },
    { q: 'Điều cần ghi nhớ cuối bài về query() và client là gì?', options: ['Client mạnh hơn query', 'query và client dùng chung một vòng lặp, không phải hai', 'query đã lỗi thời', 'Client chỉ dùng cho TypeScript'], answer: 1, explain: 'Hai cửa vào, một động cơ.' },
  ],
};
