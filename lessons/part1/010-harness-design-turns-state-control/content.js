window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Một vòng lặp trần (gọi AI, chạy tool) thì dễ hỏng. <strong>Harness</strong> là phần khung bao quanh để nó chạy an toàn:
<strong>đếm lượt</strong>, <strong>giữ trạng thái</strong>, <strong>xử lý lỗi</strong>, và <strong>biết khi nào dừng</strong>.
Giới hạn số lượt phải nằm trong code của bạn, đừng trông vào việc AI tự giác dừng.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Harness:</strong> toàn bộ phần code bao quanh vòng lặp: chuẩn bị dữ liệu, chạy tool, ghi log, đặt giới hạn.</li>
  <li><strong>Lượt (turn):</strong> một vòng xin tool, chạy tool, nhận kết quả.</li>
  <li><strong>Điều kiện dừng:</strong> quy tắc rõ ràng để kết thúc vòng lặp.</li>
  <li><strong>Lỗi thoáng qua:</strong> lỗi tạm thời, thử lại có thể được, như mạng chập chờn.</li>
</ul>

<h3>Vòng lặp và harness khác nhau thế nào?</h3>
<div class="box">🚗 <strong>Hình dung thế này:</strong> Vòng lặp là <strong>động cơ</strong>. Harness là <strong>cả chiếc xe</strong> quanh động cơ:
khung xe, vô lăng, phanh, dây an toàn. Có động cơ mà không có phanh thì không ai dám lái.</div>

<h3>Bốn việc harness phải lo</h3>
<ul>
  <li><strong>Đếm lượt:</strong> đếm từng vòng dùng tool, đủ số thì dừng.</li>
  <li><strong>Giữ trạng thái:</strong> giữ cuộc trò chuyện đang dài dần và dữ liệu cần mang qua các lượt.</li>
  <li><strong>Xử lý lỗi:</strong> tool hỏng thì quyết định <strong>thử lại</strong>, <strong>bỏ qua</strong>, hay <strong>dừng hẳn</strong>.</li>
  <li><strong>Biết khi nào dừng:</strong> xong việc, chạm giới hạn, hoặc gặp lỗi không thể tiếp tục.</li>
</ul>
<p>Thiếu một trong bốn thì vòng lặp vẫn chạy, nhưng chạy <strong>không an toàn</strong>.</p>

<h3>Rào chắn quan trọng nhất: giới hạn số lượt</h3>
<p>Dặn AI "làm tối đa 5 bước thôi nhé" là <strong>không đủ</strong>: nó có thể nghe, có thể không.
Hãy đếm bằng code, đủ số là dừng và trả về những gì đang có. Một vòng lặp không giới hạn không phải là "linh hoạt", mà là <strong>lỗi</strong>.</p>

<h3>Tự viết harness hay dùng của Agent SDK?</h3>
<ul>
  <li><strong>Tự viết:</strong> kiểm soát nhiều hơn, ít phụ thuộc hơn; nhưng bạn tự viết và bảo trì từng dòng.</li>
  <li><strong>Dùng của Agent SDK:</strong> có sẵn hết, viết ít code; nhưng phải theo cách framework làm.</li>
</ul>
<p>Hệ thống càng cần chắc chắn tuyệt đối thì tự viết càng đáng công.</p>

<h3>Chi tiết hay làm người mới vấp: dữ liệu đến từng mẩu</h3>
<p>Khi bật chế độ nhận dần, dữ liệu gửi cho tool không đến một lần mà đến <strong>từng mẩu nhỏ</strong>, ví dụ <code>{"cust</code> rồi <code>omer": "An"}</code>.
Mẩu dở dang chưa đọc được. Cách làm đúng: <strong>gom đủ các mẩu, đợi xong hẳn rồi mới đọc một lần</strong>. Khi đã xong, dữ liệu luôn đầy đủ.</p>

<h3>Ba chỗ để bạn cài quy tắc riêng</h3>
<ul>
  <li><strong>Trước khi tool chạy:</strong> kiểm tra và <strong>chặn</strong> nếu nguy hiểm. Ví dụ: chặn mọi lệnh xóa cơ sở dữ liệu.</li>
  <li><strong>Trong lúc tool chạy:</strong> thêm <strong>thử lại</strong> và <strong>giới hạn thời gian</strong>. Ví dụ: API mạng hay chập chờn thì thử lại 2 tới 3 lần.</li>
  <li><strong>Sau khi có kết quả:</strong> <strong>ghi log</strong> và đếm lượt trước khi đưa kết quả cho AI.</li>
</ul>
<p>💡 Chỉ thử lại với <strong>lỗi thoáng qua</strong>. Lỗi kiểu "dữ liệu sai" thì thử lại bao nhiêu lần vẫn sai.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Harness lo bốn việc: đếm lượt, giữ trạng thái, xử lý lỗi, biết khi nào dừng.</li>
  <li>Giới hạn số lượt phải đếm bằng code, không dặn bằng lời.</li>
  <li>Đổi lại sự kiểm soát, bạn phải tự viết và bảo trì code.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">fragile</em>: mong manh, dễ vỡ.</li>
  <li><em class="en">blur them</em>: làm mờ ranh giới, nhập nhằng.</li>
  <li><em class="en">audit trail</em>: vết kiểm toán.</li>
  <li><em class="en">goodwill</em>: thiện chí.</li>
  <li><em class="en">a defect</em>: một khiếm khuyết, một lỗi.</li>
  <li><em class="en">bites people</em>: "cắn" người, gây rắc rối cho người ta.</li>
  <li><em class="en">dangling</em>: lơ lửng, dở dang.</li>
  <li><em class="en">seams</em>: đường nối, điểm chèn.</li>
  <li><em class="en">drift</em>: trôi dạt, lệch dần.</li>
  <li><em class="en">flaky</em>: chập chờn, lúc được lúc không.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part1/lesson10/Lesson10.java</code> (dùng lại các kiểu Messages API của bài 09). Có 3 bài: gom các mảnh JSON dở dang rồi parse một lần,
thử lại lỗi thoáng qua (lỗi khác thì ném ngay), và dựng harness đầy đủ: đếm lượt từ runtime, chặn trước bằng chính sách, thử lại quanh lúc chạy,
ghi nhật ký sau, dừng DONE, MAX_TURNS hoặc ERROR. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p1-10"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p1-10 --live"</code>: bạn thấy các mảnh partial JSON thật từ stream,
và harness của bạn chặn lệnh xóa bảng, tự thử lại khi mạng timeout, ghi nhật ký từng lượt.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Trong hình ảnh động cơ và chiếc xe, harness tương ứng với gì?', options: ['Động cơ biến output của model thành hành động', 'Chiếc xe', 'Nhiên liệu là token đưa vào mỗi lượt', 'Tài xế là người dùng cuối ra lệnh cho agent'], answer: 1, explain: '"The loop is the engine... The harness is the car built around it, the frame, the controls, and the safety features."' },
    { q: 'Việc nào KHÔNG thuộc bốn việc của harness?', options: ['Đếm từng lượt dùng tool', 'Theo dõi trạng thái giữa các lượt', 'Chọn model cho từng câu hỏi', 'Định nghĩa điều kiện dừng rõ ràng'], answer: 2, explain: 'Bốn việc là: đếm lượt, theo dõi trạng thái, xử lý lỗi, điều kiện dừng.' },
    { q: 'System prompt viết "hãy dừng sau tối đa 5 bước". Harness KHÔNG đếm lượt. Đánh giá đúng theo bài học là gì?', options: ['Đủ an toàn, vì model sẽ tuân theo chỉ dẫn', 'Chưa an toàn, cần đếm bằng code', 'Đủ an toàn nếu dùng model mạnh nhất', 'An toàn hơn đếm bằng code vì linh hoạt hơn'], answer: 1, explain: '"Ask it to stop after a handful of steps, and it might or it might not." Giới hạn phải "live in your runtime, not in the model\'s goodwill".' },
    { q: 'Bài học gọi một vòng lặp không giới hạn là gì?', options: ['Một tính năng linh hoạt để model tự quyết', 'Một khiếm khuyết', 'Một tối ưu cho việc dài', 'Một lựa chọn hợp lý khi có nhiều ngân sách'], answer: 1, explain: '"An unbounded loop isn\'t a clever feature you left in for flexibility. It\'s a defect."' },
    { q: 'Harness đếm được 8 lượt, trần là 8, và model lại đòi gọi tool. Harness nên làm gì?', options: ['Cho chạy thêm một lượt để model làm xong', 'Dừng và trả về những gì đang có', 'Hỏi model xem có muốn tiếp tục không', 'Tăng trần lên 16 rồi chạy tiếp'], answer: 1, explain: '"The moment the count hits your cap, you stop the loop and return whatever you have."' },
    { q: 'Theo dõi trạng thái (state tracking) giữ những gì?', options: ['Chỉ câu trả lời cuối của model', 'Mảng messages và dữ liệu giữa các lượt', 'Danh sách mọi model đã dùng trong tuần', 'Cấu hình máy chủ chạy harness'], answer: 1, explain: '"You hold the growing messages array and any data the loop carries from one turn to the next."' },
    { q: 'Tool hỏng giữa chừng. Ba lựa chọn mà code của bạn có thể chọn là gì?', options: ['Thử lại, bỏ qua, hoặc hủy', 'Chuyển model, chuyển tool, hoặc chuyển người dùng', 'Ghi log, gửi email, hoặc khởi động lại máy', 'Hỏi model, hỏi người dùng, hoặc hỏi Anthropic'], answer: 0, explain: '"When a tool fails or the model errors, your code decides whether to retry, skip, or abort."' },
    { q: 'Khi streaming, input của tool đến từng mảnh qua input_json_delta. Mảnh đầu là {"cust, mảnh hai là omer": "An"}. Harness nên làm gì khi nhận mảnh đầu?', options: ['Parse ngay để bắt đầu chạy tool sớm', 'Gom lại, chờ khối đóng', 'Bỏ mảnh đó vì không hợp lệ', 'Báo lỗi cho model vì JSON hỏng'], answer: 1, explain: '"It parses only when the block closes, not before, because a half-arrived chunk isn\'t valid JSON yet."' },
    { q: 'Khi khối tool_use đã đóng, input cuối của tool có thể ở dạng nào?', options: ['Một chuỗi dở dang cần sửa tay', 'Luôn là một object hoàn chỉnh', 'Có thể thiếu trường bắt buộc', 'Luôn là một chuỗi rỗng'], answer: 1, explain: '"The final tool input is always a complete object once the block finishes. It\'s never a dangling string."' },
    { q: 'Quy tắc xử lý partial JSON đúng là gì?', options: ['Parse sau mỗi mảnh để phát hiện lỗi sớm', 'Gom lại, parse đúng một lần ở cuối', 'Parse mảnh đầu và mảnh cuối', 'Không parse, gửi nguyên chuỗi cho tool'], answer: 1, explain: '"Buffer the partial JSON and parse it exactly once at the end."' },
    { q: 'Bạn muốn chặn mọi lệnh DELETE vào cơ sở dữ liệu trước khi nó chạy. Điểm chèn nào phù hợp?', options: ['Sau khi có kết quả', 'Bao quanh lúc chạy', 'Trước khi tool chạy', 'Không chèn được, phải dặn trong prompt'], answer: 2, explain: '"Your loop can inspect the call, log it, or block it outright before anything executes, and that\'s where deterministic policy lives."' },
    { q: 'API mạng hay timeout ngẫu nhiên. Điểm chèn nào nên thêm thử lại và timeout?', options: ['Trước khi tool chạy', 'Bao quanh lúc chạy tool', 'Sau khi có kết quả', 'Ở system prompt'], answer: 1, explain: '"You wrap each tool call with retries and timeouts, so a transient failure doesn\'t take down the whole run."' },
    { q: 'Điểm chèn "sau khi có kết quả" dùng để làm gì?', options: ['Chặn tool nguy hiểm', 'Thử lại khi tool lỗi', 'Ghi log output và số lượt', 'Sửa input của tool trước khi nó được thực thi'], answer: 2, explain: '"You log the output and record your turn count before feeding the result to the model."' },
    { q: 'Tool trả lỗi "input không hợp lệ: thiếu trường id". Harness có nên thử lại cùng input không?', options: ['Có, thử lại tối đa 3 lần', 'Không, vì đây không phải lỗi thoáng qua', 'Có, thử lại tới khi thành công', 'Có, nhưng đổi sang model khác để model sửa input'], answer: 1, explain: 'Thử lại chỉ có ích cho lỗi thoáng qua; thử lại cùng input sai vẫn sai.' },
    { q: 'Câu nào SAI về việc thêm thử lại (retry)?', options: ['Nên đặt ở chỗ có điểm hỏng thật', 'Ví dụ tốt là API mạng chập chờn', 'Nên bật thử lại cho mọi tool', 'Thử lại nằm ở điểm chèn bao quanh lúc chạy tool'], answer: 2, explain: 'Thêm thử lại "exactly where the real failure points are... Not everywhere by default."' },
    { q: 'Ba điều kiện dừng được bài học nêu là gì?', options: ['Xong việc, chạm trần, lỗi', 'Hết token, hết tiền, hết giờ', 'Người dùng dừng, model dừng, máy dừng', 'Lượt đầu, lượt giữa, lượt cuối'], answer: 0, explain: '"Whether the task is done, the turn cap is hit, or an error forces you out."' },
    { q: 'Harness tự viết khác harness của Agent SDK ở điểm nào?', options: ['Harness tự viết không đếm được lượt', 'Bạn tự bảo trì từng dòng', 'Harness của SDK không có giới hạn lượt nào cả', 'Harness tự viết không dùng được tool'], answer: 1, explain: '"You get more control and fewer dependencies, but you own every line and you maintain it."' },
    { q: 'Khi nào harness tự viết xứng với chi phí của nó?', options: ['Khi muốn viết ít code nhất', 'Khi độ tin cậy cần kiểm soát không thỏa hiệp', 'Khi nhóm chưa quen cách dùng Agent SDK', 'Khi dự án chỉ là demo'], answer: 1, explain: '"The more your reliability depends on control you can\'t compromise, the more a hand-rolled harness earns its cost."' },
    { q: 'Đổi lại việc viết ít code, harness của Agent SDK bắt bạn chấp nhận điều gì?', options: ['Không được dùng tool tùy chỉnh', 'Hình dạng và cập nhật của framework', 'Không có giới hạn lượt', 'Phải chạy harness trên máy chủ của Anthropic'], answer: 1, explain: '"In exchange, you accept the framework\'s shape and its updates."' },
    { q: 'Vì sao chặn lệnh xóa bằng code ở điểm chèn trước tốt hơn dặn model?', options: ['Vì code chạy nhanh hơn model', 'Vì nó chặn ở mọi lần chạy', 'Vì model không hiểu lệnh xóa', 'Vì dặn model trong prompt tốn nhiều token hơn'], answer: 1, explain: '"A destructive call, like a database delete, gets blocked in code every single time."' },
    { q: 'Nhóm muốn mọi lời gọi tool ghi ra dạng JSON lines để đổ vào hệ thống giám sát có sẵn. Lợi ích này đến từ đâu?', options: ['Từ model tự ghi log', 'Từ việc sở hữu vòng lặp', 'Từ Agent SDK bật log mặc định', 'Từ system prompt yêu cầu ghi log'], answer: 1, explain: '"You log and audit every tool call in whatever format your team needs."' },
    { q: 'Ba điểm chèn chính sách là thứ bạn nhận được nhờ đâu?', options: ['Nhờ dùng model mạnh hơn', 'Nhờ sở hữu vòng lặp', 'Nhờ Managed Agents', 'Nhờ viết prompt chi tiết'], answer: 1, explain: '"These three seams are exactly what you gave up the SDK to get."' },
    { q: 'Câu nào nhầm lẫn giữa vòng lặp và harness?', options: ['Vòng lặp là lời gọi model', 'Harness gom và định dạng context', 'Harness chính là lời gọi model', 'Harness ghi lại chuyện đã xảy ra'], answer: 2, explain: '"The model call is the loop. The harness is everything around it."' },
    { q: 'Thiếu một trong bốn việc của harness thì vòng lặp thế nào?', options: ['Không chạy được', 'Vẫn chạy được nhưng không an toàn', 'Tự bổ sung phần thiếu', 'Chạy nhanh hơn vì ít việc hơn'], answer: 1, explain: '"Miss any one of these and the loop still runs, but it runs unsafely."' },
    { q: 'Đếm lượt nhằm để ai áp ngân sách?', options: ['Model', 'Runtime của bạn', 'Người dùng cuối', 'Anthropic'], answer: 1, explain: '"Counting each tool use round trip, so your runtime, not the model, enforces a budget."' },
    { q: 'Gọi API thì nhận lỗi 503 quá tải. Harness đã định nghĩa điều kiện dừng ERROR. Hành vi phù hợp nhất là gì?', options: ['Lặp vô hạn tới khi API hết quá tải', 'Ghi log rồi dừng với lý do lỗi', 'Bỏ qua lỗi và trả về câu trả lời rỗng như thành công', 'Đổi sang tool khác'], answer: 1, explain: 'Điều kiện dừng phải rõ ràng: lỗi buộc phải thoát thì dừng có ghi nhận, không lặp mãi hay giả vờ thành công.' },
    { q: 'Mục đích của việc ghi log và vết kiểm toán trong harness là gì?', options: ['Giảm chi phí token', 'Có dữ liệu khi có sự cố', 'Giúp model nhớ lâu hơn', 'Thay thế cho đếm lượt'], answer: 1, explain: 'Harness "records what happened so you have logging and an audit trail when something goes wrong".' },
    { q: 'Câu nào đúng về chính sách xác định trong harness tự viết?', options: ['Hành vi trôi theo "tâm trạng" của model', 'Hành vi không đổi theo model', 'Chính sách chỉ áp được qua prompt', 'Chính sách chỉ có trong Managed Agents'], answer: 1, explain: '"You inject deterministic policy at each step, so behavior doesn\'t drift with the model\'s mood."' },
    { q: 'Trong harness tự viết, tool đọc dữ liệu bị timeout lần đầu và thành công lần thứ hai. Nhật ký nên phản ánh điều gì?', options: ['Không ghi gì vì cuối cùng đã thành công', 'Tool đã chạy được ở lượt đó', 'Lượt đó thất bại và phải dừng', 'Model đã tự sửa lỗi'], answer: 1, explain: 'Thử lại nằm ở điểm chèn bao quanh; sau khi thành công, điểm chèn sau ghi lại tool đã chạy.' },
    { q: 'Câu nào là điều cần nhớ cuối bài?', options: ['Harness là miễn phí, không có cái giá nào phải trả', 'Được kiểm soát, phải bảo trì code', 'Chỉ cần đếm lượt là đủ an toàn', 'Harness chỉ dành cho hệ thống lớn'], answer: 1, explain: '"The payoff is control, but the cost is code that you have to own and maintain."' },
  ],
};
