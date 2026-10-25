window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Ý chính của cả bài:</strong> Một vòng lặp trần (gọi model, chạy tool) tự nó rất mong manh. <strong>Harness</strong> là mọi thứ bao quanh vòng lặp
để nó chạy an toàn, gồm bốn việc: <strong>đếm lượt</strong>, <strong>theo dõi trạng thái</strong>, <strong>xử lý lỗi</strong>, và <strong>điều kiện dừng</strong>.
Giới hạn lượt phải nằm trong <strong>runtime của bạn</strong>, không dựa vào thiện chí của model.</p>

<h3>1. Ba thuật ngữ</h3>
<ul>
  <li><strong>Harness:</strong> vòng lặp cộng toàn bộ hạ tầng xung quanh: code gom context, gửi request, chạy tool, đưa kết quả lại.</li>
  <li><strong>Đếm lượt (turn accounting):</strong> đếm từng vòng khứ hồi tool_use, để chính runtime (không phải model) áp ngân sách.</li>
  <li><strong>Điều kiện dừng (stop condition):</strong> một quy tắc rõ ràng kết thúc vòng lặp: việc đã xong, chạm trần lượt, hoặc một lỗi buộc phải thoát.</li>
</ul>

<h3>2. Vòng lặp và harness khác nhau</h3>
<p>Lời gọi model là <strong>vòng lặp</strong>. Harness là <strong>mọi thứ xung quanh</strong>: gom và định dạng context gửi vào, chạy tool và lấy output,
ghi lại chuyện đã xảy ra để có log và vết kiểm toán khi có sự cố.</p>
<p>Hình ảnh dễ nhớ: <strong>động cơ và chiếc xe</strong>. Vòng lặp là động cơ biến output của model thành hành động.
Harness là chiếc xe xây quanh nó: khung, bộ điều khiển, các tính năng an toàn khiến nó lái được. Cần cả hai cùng hoạt động.</p>

<h3>3. Bốn việc harness đảm nhận</h3>
<ul>
  <li><strong>Đếm lượt:</strong> đếm mọi vòng khứ hồi tool_use và dừng khi chạm ngân sách.</li>
  <li><strong>Theo dõi trạng thái:</strong> giữ mảng messages đang lớn dần và mọi dữ liệu vòng lặp mang từ lượt này sang lượt sau.</li>
  <li><strong>Xử lý lỗi:</strong> khi tool hỏng hoặc model lỗi, code của bạn quyết định <strong>thử lại, bỏ qua, hay hủy</strong>.</li>
  <li><strong>Điều kiện dừng:</strong> định nghĩa chính xác khi nào vòng lặp kết thúc để nó không bao giờ chạy vô hạn.</li>
</ul>
<p>Thiếu một trong bốn thì vòng lặp vẫn chạy, nhưng chạy <strong>không an toàn</strong>. Cùng nhau, chúng phân biệt bản demo với thứ đưa lên production được.</p>

<h3>4. Rào chắn quan trọng nhất: ngân sách lượt</h3>
<p>Vòng lặp agent cần một giới hạn cứng, và giới hạn đó phải nằm <strong>trong runtime của bạn</strong>. Bạn đếm lượt khi chúng diễn ra,
và ngay khi số đếm chạm trần thì dừng vòng lặp và trả về những gì đang có.</p>
<p>Điều không bao giờ làm: <strong>tin model tự giới hạn</strong>. Bảo nó dừng sau vài bước, nó có thể nghe hoặc không.
Một vòng lặp không giới hạn không phải tính năng linh hoạt mà là <strong>một lỗi</strong>: cách đốt ngân sách và thời gian mà không được gì. Áp giới hạn bằng code.</p>

<h3>5. Tự viết harness hay dùng harness của Agent SDK?</h3>
<ul>
  <li><strong>Tự viết:</strong> bạn viết đếm lượt, theo dõi trạng thái và logic dừng. Nhiều kiểm soát hơn, ít phụ thuộc hơn, nhưng bạn sở hữu từng dòng và bảo trì khi nhu cầu đổi.</li>
  <li><strong>Harness của Agent SDK:</strong> vòng lặp, chạy tool, quản lý context và giới hạn lượt đều có sẵn. Viết ít code hơn nhiều; đổi lại bạn chấp nhận hình dạng và các bản cập nhật của framework.</li>
</ul>
<p>Không có đáp án chung. Độ tin cậy của bạn càng phụ thuộc vào sự kiểm soát không thể thỏa hiệp, harness tự viết càng xứng với chi phí.</p>

<h3>6. Chi tiết hay "cắn" người mới: input tool đến từng mảnh</h3>
<p>Khi streaming, tham số của tool <strong>không đến một lần</strong> mà đến từng mảnh: các delta kiểu <code>input_json_delta</code>, mỗi cái mang một đoạn JSON dở dang.
Harness gom các mảnh khi chúng đến, và <strong>chờ</strong>. Chỉ parse khi khối đã đóng, không sớm hơn, vì một mảnh đến nửa chừng chưa phải JSON hợp lệ.</p>
<p>Điều đáng yên tâm: input cuối của tool luôn là một object hoàn chỉnh khi khối kết thúc. Quy tắc đơn giản: <strong>gom JSON dở dang, parse đúng một lần ở cuối</strong>.</p>

<h3>7. Ba điểm chèn chính sách khi bạn sở hữu vòng lặp</h3>
<ul>
  <li><strong>Trước khi tool chạy:</strong> xem lời gọi, ghi log, hoặc chặn hẳn trước khi bất cứ thứ gì thực thi. Đây là nơi chính sách xác định sống.</li>
  <li><strong>Bao quanh lúc chạy:</strong> bọc mỗi lời gọi tool bằng thử lại và timeout, để một lỗi thoáng qua không làm sập cả lần chạy.</li>
  <li><strong>Sau khi có kết quả:</strong> ghi log output và ghi số lượt trước khi đưa kết quả cho model.</li>
</ul>
<p>Ba điểm này chính là thứ bạn từ bỏ SDK để có được. Hãy dùng chúng có chủ đích.</p>

<h3>8. Phần thưởng: mọi đòn bẩy độ tin cậy nằm trong tay bạn</h3>
<ul>
  <li>Áp chính sách xác định ở mỗi bước để hành vi không trôi theo "tâm trạng" của model.</li>
  <li>Một lệnh phá hoại, như xóa cơ sở dữ liệu, bị chặn bằng code <strong>mọi lần</strong>.</li>
  <li>Ghi log và kiểm toán mọi lời gọi tool theo định dạng nhóm bạn cần, ví dụ JSON lines đổ thẳng vào hệ thống giám sát.</li>
  <li>Thêm thử lại <strong>đúng chỗ</strong> có điểm hỏng thật, ví dụ một API mạng chập chờn, không phải mặc định ở khắp nơi.</li>
</ul>

<h3>9. Tóm tắt</h3>
<ul>
  <li>Đếm lượt giới hạn vòng lặp từ runtime.</li>
  <li>Theo dõi trạng thái giữ hội thoại đang lớn dần.</li>
  <li>Xử lý lỗi quyết định thử lại, bỏ qua, hay hủy.</li>
  <li>Điều kiện dừng kết thúc vòng lặp một cách xác định.</li>
  <li>Phần thưởng là kiểm soát; cái giá là code bạn phải sở hữu và bảo trì.</li>
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
<p>Mở <code>java-app/src/main/java/lesson10/Lesson10.java</code> (dùng lại các kiểu Messages API của bài 09). Có 3 bài: gom các mảnh JSON dở dang rồi parse một lần,
thử lại lỗi thoáng qua (lỗi khác thì ném ngay), và dựng harness đầy đủ: đếm lượt từ runtime, chặn trước bằng chính sách, thử lại quanh lúc chạy,
ghi nhật ký sau, dừng DONE, MAX_TURNS hoặc ERROR. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="10"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="10 --live"</code>: bạn thấy các mảnh partial JSON thật từ stream,
và harness của bạn chặn lệnh xóa bảng, tự thử lại khi mạng timeout, ghi nhật ký từng lượt.</p>
`,

  quiz: [
    { q: 'Vì sao một vòng lặp trần cần harness?', options: ['Vì tự nó rất mong manh, harness giúp nó chạy an toàn', 'Vì vòng lặp không gọi được model', 'Vì harness làm model thông minh hơn', 'Vì API bắt buộc'], answer: 0, explain: 'Harness là mọi thứ bao quanh vòng lặp để nó an toàn.' },
    { q: 'Harness được định nghĩa là gì?', options: ['Chỉ lời gọi model', 'Vòng lặp cộng toàn bộ hạ tầng xung quanh: gom context, gửi request, chạy tool, đưa kết quả lại', 'Một loại tool', 'Một file cấu hình'], answer: 1, explain: 'Vòng lặp là động cơ, harness là cả chiếc xe.' },
    { q: 'Đếm lượt (turn accounting) là gì?', options: ['Đếm số người dùng', 'Đếm số ký tự', 'Đếm từng vòng khứ hồi tool_use để runtime áp ngân sách', 'Đếm số model'], answer: 2, explain: 'Runtime, không phải model, áp giới hạn.' },
    { q: 'Điều kiện dừng có thể là những gì?', options: ['Chỉ khi người dùng bấm dừng', 'Chỉ khi hết tiền', 'Chỉ khi máy tắt', 'Việc đã xong, chạm trần lượt, hoặc lỗi buộc phải thoát'], answer: 3, explain: 'Một quy tắc rõ ràng kết thúc vòng lặp.' },
    { q: 'Trong hình ảnh "động cơ và chiếc xe", harness là gì?', options: ['Chiếc xe: khung, điều khiển, tính năng an toàn', 'Động cơ', 'Nhiên liệu', 'Tài xế'], answer: 0, explain: 'Vòng lặp là động cơ biến output thành hành động.' },
    { q: 'Bốn việc harness đảm nhận là gì?', options: ['Đọc, ghi, xóa, sửa', 'Đếm lượt, theo dõi trạng thái, xử lý lỗi, điều kiện dừng', 'Prompt, model, tool, memory', 'Nhanh, rẻ, đẹp, bền'], answer: 1, explain: 'Bốn việc này phân biệt demo với production.' },
    { q: 'Theo dõi trạng thái nghĩa là gì?', options: ['Theo dõi người dùng', 'Theo dõi giá cổ phiếu', 'Giữ mảng messages đang lớn dần và dữ liệu mang qua các lượt', 'Theo dõi nhiệt độ máy chủ'], answer: 2, explain: 'Harness giữ hội thoại và dữ liệu giữa các lượt.' },
    { q: 'Khi tool hỏng, harness có những lựa chọn nào?', options: ['Chỉ có thể dừng', 'Chỉ có thể bỏ qua', 'Gọi lại người dùng', 'Thử lại, bỏ qua, hoặc hủy'], answer: 3, explain: 'Code của bạn quyết định.' },
    { q: 'Thiếu một trong bốn việc của harness thì sao?', options: ['Vòng lặp vẫn chạy nhưng chạy không an toàn', 'Vòng lặp không chạy được', 'Model từ chối trả lời', 'Không ảnh hưởng gì'], answer: 0, explain: 'Nó vẫn chạy, chỉ là không an toàn.' },
    { q: 'Giới hạn lượt của vòng lặp agent nên nằm ở đâu?', options: ['Trong prompt', 'Trong runtime của bạn', 'Trong thiện chí của model', 'Trong file README'], answer: 1, explain: 'Đừng dựa vào thiện chí của model.' },
    { q: 'Vì sao không nên tin model tự giới hạn số bước?', options: ['Vì model không đọc được prompt', 'Vì model luôn dừng quá sớm', 'Vì bảo nó dừng sau vài bước, nó có thể nghe hoặc không', 'Vì model không đếm được'], answer: 2, explain: 'Giới hạn phải được áp bằng code.' },
    { q: 'Một vòng lặp không giới hạn được bài học gọi là gì?', options: ['Một tính năng linh hoạt', 'Một tối ưu thông minh', 'Một thiết kế hiện đại', 'Một lỗi: cách đốt ngân sách và thời gian mà không được gì'], answer: 3, explain: 'Vòng lặp vô hạn là khiếm khuyết.' },
    { q: 'Khi số lượt chạm trần, harness nên làm gì?', options: ['Dừng vòng lặp và trả về những gì đang có', 'Tăng trần lên gấp đôi', 'Hỏi model có muốn tiếp không', 'Xóa lịch sử và chạy lại'], answer: 0, explain: 'Dừng ngay và trả về kết quả hiện có.' },
    { q: 'Ưu điểm của harness tự viết là gì?', options: ['Viết ít code hơn', 'Nhiều kiểm soát hơn và ít phụ thuộc hơn', 'Không cần bảo trì', 'Tự cập nhật theo framework'], answer: 1, explain: 'Đổi lại bạn sở hữu và bảo trì từng dòng.' },
    { q: 'Đánh đổi khi dùng harness của Agent SDK là gì?', options: ['Phải tự viết đếm lượt', 'Không có giới hạn lượt', 'Viết ít code hơn nhưng chấp nhận hình dạng và cập nhật của framework', 'Không chạy được tool'], answer: 2, explain: 'Bạn khớp ứng dụng theo cách framework hoạt động.' },
    { q: 'Khi nào harness tự viết xứng với chi phí của nó?', options: ['Luôn luôn', 'Không bao giờ', 'Khi muốn viết ít code', 'Khi độ tin cậy phụ thuộc vào sự kiểm soát không thể thỏa hiệp'], answer: 3, explain: 'Không có đáp án chung; tùy mức kiểm soát bạn cần.' },
    { q: 'Khi streaming, input của tool đến như thế nào?', options: ['Từng mảnh, qua các delta kiểu input_json_delta', 'Một lần, nguyên vẹn', 'Qua email', 'Không bao giờ đến'], answer: 0, explain: 'Mỗi delta mang một đoạn JSON dở dang.' },
    { q: 'Khi nào nên parse JSON input của tool trong lúc streaming?', options: ['Ngay khi mảnh đầu tiên đến', 'Chỉ khi khối đã đóng, parse đúng một lần ở cuối', 'Sau mỗi mảnh', 'Không bao giờ parse'], answer: 1, explain: 'Mảnh đến nửa chừng chưa phải JSON hợp lệ.' },
    { q: 'Vì sao không parse từng mảnh JSON khi chúng đến?', options: ['Vì tốn token', 'Vì chậm', 'Vì một mảnh đến nửa chừng chưa phải JSON hợp lệ', 'Vì API cấm'], answer: 2, explain: 'Gom lại rồi parse một lần.' },
    { q: 'Input cuối của tool khi khối kết thúc có đặc điểm gì?', options: ['Có thể là chuỗi dở dang', 'Luôn rỗng', 'Có thể thiếu trường', 'Luôn là một object hoàn chỉnh'], answer: 3, explain: 'Không bao giờ là chuỗi lơ lửng.' },
    { q: 'Điểm chèn "trước khi tool chạy" dùng để làm gì?', options: ['Xem lời gọi, ghi log, hoặc chặn hẳn trước khi thực thi', 'Thử lại tool', 'Ghi số lượt', 'Định dạng output'], answer: 0, explain: 'Đây là nơi chính sách xác định sống.' },
    { q: 'Điểm chèn "bao quanh lúc chạy" dùng để làm gì?', options: ['Chặn lệnh nguy hiểm', 'Bọc lời gọi tool bằng thử lại và timeout', 'Ghi log kết quả', 'Đổi model'], answer: 1, explain: 'Để lỗi thoáng qua không làm sập cả lần chạy.' },
    { q: 'Điểm chèn "sau khi có kết quả" dùng để làm gì?', options: ['Chặn tool', 'Thử lại tool', 'Ghi log output và ghi số lượt trước khi đưa kết quả cho model', 'Xóa kết quả'], answer: 2, explain: 'Ghi lại rồi mới đưa cho model.' },
    { q: 'Ba điểm chèn chính sách là thứ bạn có được nhờ đâu?', options: ['Nhờ model mạnh hơn', 'Nhờ prompt dài hơn', 'Nhờ dùng Managed Agents', 'Nhờ từ bỏ SDK để sở hữu vòng lặp'], answer: 3, explain: 'Hãy dùng chúng có chủ đích.' },
    { q: 'Một lệnh xóa cơ sở dữ liệu nên được xử lý thế nào trong harness tự viết?', options: ['Bị chặn bằng code mọi lần', 'Nhờ model tự nhớ không chạy', 'Cho chạy rồi khôi phục sau', 'Ghi log sau khi chạy'], answer: 0, explain: 'Chặn xác định, không phụ thuộc tâm trạng của model.' },
    { q: 'Nên thêm cơ chế thử lại ở đâu?', options: ['Ở khắp mọi nơi theo mặc định', 'Đúng chỗ có điểm hỏng thật, ví dụ API mạng chập chờn', 'Chỉ ở lời gọi model', 'Không ở đâu cả'], answer: 1, explain: 'Thử lại có chủ đích, không phải mặc định ở mọi nơi.' },
    { q: 'Tình huống: lần gọi tool đầu bị timeout mạng, lần thứ hai thành công. Harness tốt sẽ làm gì?', options: ['Hủy cả lần chạy', 'Bỏ qua tool đó', 'Thử lại vì đây là lỗi thoáng qua, rồi dùng kết quả lần thứ hai', 'Hỏi người dùng'], answer: 2, explain: 'Lỗi thoáng qua đáng thử lại.' },
    { q: 'Tình huống: tool báo lỗi "input không hợp lệ". Có nên thử lại không?', options: ['Có, thử lại mãi', 'Có, thử lại ba lần', 'Có, đổi model rồi thử lại', 'Không, đây không phải lỗi thoáng qua; thử lại vẫn sai'], answer: 3, explain: 'Chỉ lỗi thoáng qua mới đáng thử lại.' },
    { q: 'Ghi log mọi lời gọi tool theo định dạng như JSON lines giúp gì?', options: ['Đổ thẳng vào hệ thống giám sát hiện có của nhóm', 'Làm model nhanh hơn', 'Giảm chi phí token', 'Không giúp gì'], answer: 0, explain: 'Kiểm toán theo đúng định dạng nhóm cần.' },
    { q: 'Câu chốt của bài về harness là gì?', options: ['Harness là không cần thiết', 'Phần thưởng là kiểm soát; cái giá là code bạn phải sở hữu và bảo trì', 'Harness luôn miễn phí', 'Chỉ cần đếm lượt là đủ'], answer: 1, explain: 'Bốn phần khung cho vòng lặp, kèm trách nhiệm bảo trì.' },
  ],
};
