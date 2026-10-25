window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Ý chính của cả bài:</strong> Gọi <code>query()</code> thì Claude không trả lời một lần mà chạy một <strong>vòng lặp</strong>:
suy luận, gọi tool, đọc kết quả, rồi lặp lại, cho tới khi trả lời mà <strong>không gọi tool nào</strong>. Mặc định vòng lặp
<strong>không có giới hạn</strong>, nên đặt max turns (và ngân sách) là việc của bạn. Khi đọc kết quả, luôn <strong>kiểm tra subtype trước</strong>.</p>

<h3>1. Đi qua vòng lặp một lượt</h3>
<ul>
  <li>Claude nhận prompt của bạn, cùng system prompt, định nghĩa các tool và lịch sử (nếu có). SDK phát ra message init, đánh dấu lần chạy đã mở.</li>
  <li>Claude trả lời: đôi khi là chữ thường, nhưng thường là yêu cầu gọi tool.</li>
  <li>SDK chạy các tool đó và đưa kết quả lại cho Claude.</li>
  <li>Chu kỳ lặp lại: Claude đọc kết quả, suy luận tiếp, có thể gọi thêm tool.</li>
  <li>Vòng lặp tiếp tục cho tới khi Claude trả lời <strong>không kèm lời gọi tool nào</strong>. Câu trả lời không có tool đó là tín hiệu kết thúc.</li>
</ul>

<h3>2. "Lượt" (turn) nghĩa là gì?</h3>
<p>Một lượt là <strong>một vòng khứ hồi</strong>: Claude yêu cầu một số tool, SDK chạy chúng, kết quả quay về, tất cả mà không trả quyền điều khiển cho code của bạn ở giữa.
Lượt kết thúc khi kết quả tool quay về. Nếu Claude nhìn kết quả rồi gọi thêm tool, đó là lượt tiếp theo bắt đầu.
Các lượt cứ chồng lên nhau chừng nào Claude còn với lấy tool. Vòng lặp chỉ kết thúc khi Claude trả lời không gọi tool nào.</p>

<h3>3. Năm loại message có kiểu</h3>
<ul>
  <li><strong>System</strong> mở đầu lần chạy, với subtype <em>init</em> là thứ đầu tiên bạn thấy.</li>
  <li><strong>Assistant</strong> mang output của Claude: chữ và các lời gọi tool.</li>
  <li><strong>User</strong> đưa kết quả tool trở lại vòng lặp, khép lại vòng khứ hồi.</li>
  <li><strong>Stream event</strong> chỉ xuất hiện khi bạn bật streaming từng phần, cho các mảnh nhỏ theo từng token.</li>
  <li><strong>Result</strong> đóng lần chạy, mang tổng chi phí, lượng token và trạng thái cuối.</li>
</ul>
<p>Nắm năm loại này thì luồng message không còn là "nhiễu" mà đọc như một bản ghi chép của vòng lặp.</p>

<h3>4. Hai giới hạn và mặc định "không giới hạn"</h3>
<ul>
  <li><strong>Max turns:</strong> giới hạn số lượt dùng tool.</li>
  <li><strong>Max budget USD:</strong> giới hạn số đô la một lần chạy được tiêu. Ngân sách được kiểm tra <strong>giữa các lần gọi</strong>,
  nên chi phí thật có thể vượt trần tối đa bằng chi phí của <strong>một lần gọi</strong>.</li>
</ul>
<p>Vượt một trong hai, vòng lặp dừng và trả về một kết quả lỗi cho biết bạn chạm giới hạn nào.</p>
<p><strong>Điều gây bất ngờ:</strong> mặc định không có giới hạn nào cả. Để trống thì một lần chạy có thể lặp mãi chừng nào Claude còn gọi tool.
Đặt giới hạn là việc của bạn. Với việc tự động hoặc tốn kém, một max turns hợp lý là khác biệt giữa agent được kiểm soát và agent chạy mất kiểm soát.</p>

<h3>5. Đọc message result</h3>
<p>Mỗi result có một <strong>subtype</strong>: <em>success</em> nghĩa là kết thúc gọn gàng; các subtype lỗi cho biết giới hạn nào đã dừng nó
(<em>error_max_turns</em> hoặc <em>error_max_budget_usd</em>). Đi kèm là phần kế toán: tổng chi phí USD, usage (token), num turns (số lượt), và session ID nếu muốn nối lại sau.</p>
<p><strong>Điều cần thuộc lòng:</strong> chỉ subtype success mới mang text kết quả. Với subtype lỗi, trường result <strong>rỗng</strong>.
Đọc result mà không kiểm tra subtype trước thì bạn có thể âm thầm nhận về chuỗi rỗng mà không hề hay biết.</p>
<p>Tuy vậy, kết quả lỗi <strong>vẫn có đầy đủ chi phí và usage</strong>: một lần chạy chạm trần lượt vẫn cho bạn biết nó đã tiêu bao nhiêu.
Bài học đơn giản: <strong>rẽ nhánh theo subtype trước</strong>, chỉ đọc text khi biết chắc là success.</p>

<h3>6. Single-shot và streaming input xử lý giới hạn khác nhau</h3>
<p>Khi một lần query dạng single-shot (một chuỗi đầu vào) chạm trần lượt: nó phát ra message result lỗi trước, <strong>rồi ném một exception</strong>
với nội dung kiểu "đã đạt số lượt tối đa". Điều này là cố ý, nhưng nếu không chuẩn bị, exception sẽ dừng chương trình đột ngột.
Vì vậy hãy bọc lần chạy single-shot trong try/except khi muốn bắt giới hạn và chạy tiếp.</p>
<p>Phiên streaming input thì khác: nó <strong>không ném lỗi mà vẫn sống</strong>, nên bạn có thể xem result rồi gửi tin nhắn khác.
Cùng một vòng lặp bên dưới, nhưng chế độ nhập quyết định giới hạn đến với code của bạn theo cách nào.</p>

<h3>7. Ba trường giúp hiểu chuyện gì đã xảy ra</h3>
<ul>
  <li><strong>Stop reason:</strong> vì sao model kết thúc một lượt: <em>end_turn</em> là kết thúc bình thường, <em>max_tokens</em> là hết chỗ, hoặc <em>refusal</em> là từ chối.</li>
  <li><strong>Num turns:</strong> số lượt thật sự đã chạy. Một lần chạy cứ tiến sát tới trần là dấu hiệu agent đang "quay vòng" không hiệu quả.</li>
  <li><strong>Session ID:</strong> định danh cả lần chạy, để nối lại sau hoặc truy vết khi debug.</li>
</ul>
<p>Ba trường này biến một lần chạy đã xong từ "hộp đen" thành thứ bạn đọc được, kiểm toán được, và tiếp tục được.</p>

<h3>8. Tóm tắt</h3>
<ul>
  <li>Vòng lặp agent là một chu kỳ: suy luận, gọi tool, đọc kết quả, lặp lại, rồi trả lời.</li>
  <li>Mỗi phần báo cáo qua một message có kiểu, và mỗi lượt là một vòng khứ hồi tool.</li>
  <li>Vòng lặp không có trần trừ khi bạn đặt: max turns là lưới an toàn của bạn.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">round trip</em>: vòng khứ hồi.</li>
  <li><em class="en">hand control to</em>: trao quyền điều khiển cho.</li>
  <li><em class="en">reach for tools</em>: với lấy tool, chọn dùng tool.</li>
  <li><em class="en">overshoot the cap</em>: vượt quá mức trần.</li>
  <li><em class="en">runaway</em>: chạy mất kiểm soát.</li>
  <li><em class="en">report for duty</em>: trình diện, báo cáo.</li>
  <li><em class="en">stop your program cold</em>: làm chương trình dừng phắt.</li>
  <li><em class="en">churning</em>: quay vòng, khuấy đảo mà không tiến triển.</li>
  <li><em class="en">safety net</em>: lưới an toàn.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/lesson07/Lesson07.java</code> (dùng lại các kiểu message của bài 06). Có 5 bài: tính chi phí theo giá mỗi triệu token,
đếm số lượt trong luồng message, viết vòng lặp có cả max turns lẫn ngân sách (kiểm tra giữa các lần gọi, chấp nhận vượt một lần gọi),
chỉ đọc kết quả khi success, và viết dòng chẩn đoán từ subtype, số lượt và session ID.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="07"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="07 --live"</code>: cùng một việc chạy ba lần với ba kiểu giới hạn,
bạn thấy rõ lúc chạm trần lượt, lúc chạm ngân sách, và lúc thành công.</p>
`,

  quiz: [
    { q: 'Sau khi gọi query(), Claude làm gì?', options: ['Trả lời đúng một lần rồi dừng', 'Chạy một vòng lặp: suy luận, gọi tool, đọc kết quả, lặp lại', 'Chờ người dùng xác nhận từng bước', 'Chỉ gọi tool, không trả lời'], answer: 1, explain: 'Claude chạy một vòng lặp chứ không trả lời một lần.' },
    { q: 'Khi bắt đầu, Claude nhận những gì?', options: ['Prompt, system prompt, định nghĩa tool và lịch sử nếu có', 'Chỉ prompt', 'Chỉ danh sách tool', 'Toàn bộ ổ đĩa của bạn'], answer: 0, explain: 'Đó là đầu vào của lượt đầu tiên.' },
    { q: 'Ai chạy các tool mà Claude yêu cầu trong query()?', options: ['Người dùng', 'Claude tự chạy trong đầu', 'SDK chạy rồi đưa kết quả lại cho Claude', 'Không ai'], answer: 2, explain: 'SDK thực thi tool và đưa kết quả trở lại vòng lặp.' },
    { q: 'Tín hiệu nào cho biết vòng lặp đã xong?', options: ['Claude gọi tool cuối cùng', 'Hết thời gian', 'Người dùng bấm dừng', 'Claude trả lời không kèm lời gọi tool nào'], answer: 3, explain: 'Câu trả lời không có tool là tín hiệu kết thúc.' },
    { q: 'Một "lượt" (turn) là gì?', options: ['Một vòng khứ hồi: Claude yêu cầu tool, SDK chạy, kết quả quay về', 'Một câu của người dùng', 'Một token', 'Một lần khởi động lại'], answer: 0, explain: 'Một lượt là một vòng khứ hồi tool, không trả quyền cho code của bạn ở giữa.' },
    { q: 'Khi nào một lượt kết thúc?', options: ['Khi Claude bắt đầu suy nghĩ', 'Khi kết quả tool quay về', 'Khi người dùng gửi tin mới', 'Khi hết token'], answer: 1, explain: 'Lượt kết thúc khi kết quả tool quay về; gọi thêm tool là lượt mới.' },
    { q: 'Message nào là thứ đầu tiên bạn thấy trong luồng?', options: ['Result', 'Assistant', 'System với subtype init', 'User'], answer: 2, explain: 'Message system init mở đầu lần chạy.' },
    { q: 'Message user trong luồng dùng để làm gì?', options: ['Chứa câu hỏi mới của người dùng ở mỗi lượt', 'Báo lỗi', 'Đóng lần chạy', 'Đưa kết quả tool trở lại vòng lặp, khép lại vòng khứ hồi'], answer: 3, explain: 'Message user mang kết quả tool về cho Claude.' },
    { q: 'Stream event xuất hiện khi nào?', options: ['Chỉ khi bật streaming từng phần, cho các mảnh nhỏ theo token', 'Luôn luôn', 'Khi có lỗi', 'Khi dùng ClaudeSDKClient'], answer: 0, explain: 'Stream event chỉ có khi bật partial streaming.' },
    { q: 'Message result mang những gì?', options: ['Chỉ text', 'Tổng chi phí, usage và trạng thái cuối', 'Danh sách tool', 'Mã nguồn'], answer: 1, explain: 'Result đóng lần chạy với chi phí, token và trạng thái.' },
    { q: 'Hai giới hạn có thể đặt cho vòng lặp là gì?', options: ['Max tokens và temperature', 'Max users và max sessions', 'Max turns và max budget USD', 'Max tools và max files'], answer: 2, explain: 'Một giới hạn số lượt, một giới hạn số tiền.' },
    { q: 'Ngân sách (max budget USD) được kiểm tra khi nào?', options: ['Trước khi bắt đầu', 'Sau khi kết thúc', 'Liên tục từng token', 'Giữa các lần gọi model'], answer: 3, explain: 'Vì kiểm tra giữa các lần gọi, chi phí có thể vượt trần một chút.' },
    { q: 'Chi phí thật có thể vượt ngân sách tối đa bao nhiêu?', options: ['Bằng chi phí của khoảng một lần gọi', 'Không bao giờ vượt', 'Gấp đôi ngân sách', 'Không giới hạn'], answer: 0, explain: 'Vượt trần tối đa bằng chi phí của một lần gọi.' },
    { q: 'Mặc định, vòng lặp có giới hạn lượt không?', options: ['Có, 10 lượt', 'Không có giới hạn nào', 'Có, 100 lượt', 'Có, theo ngân sách tài khoản'], answer: 1, explain: 'Để trống thì một lần chạy có thể lặp mãi chừng nào Claude còn gọi tool.' },
    { q: 'Ai chịu trách nhiệm đặt giới hạn cho vòng lặp?', options: ['Claude', 'Anthropic', 'Lập trình viên', 'Người dùng cuối'], answer: 2, explain: 'Đặt giới hạn là việc của bạn.' },
    { q: 'Vượt max turns hoặc ngân sách thì điều gì xảy ra?', options: ['Vòng lặp tiếp tục nhưng chậm hơn', 'Claude tự giảm chất lượng', 'Tài khoản bị khóa', 'Vòng lặp dừng và trả về kết quả lỗi cho biết giới hạn nào'], answer: 3, explain: 'Kết quả lỗi cho biết bạn chạm giới hạn nào.' },
    { q: 'Subtype nào cho biết lần chạy kết thúc gọn gàng?', options: ['success', 'error_max_turns', 'error_max_budget_usd', 'init'], answer: 0, explain: 'Success là đường đi thuận lợi.' },
    { q: 'Với subtype lỗi, trường result chứa gì?', options: ['Câu trả lời dở dang', 'Rỗng', 'Thông báo lỗi chi tiết', 'Câu trả lời của lượt trước'], answer: 1, explain: 'Chỉ success mới mang text kết quả.' },
    { q: 'Rủi ro khi đọc result mà không kiểm tra subtype là gì?', options: ['Chương trình chạy chậm', 'Tốn thêm token', 'Có thể âm thầm nhận chuỗi rỗng mà không hay biết', 'Bị tính phí gấp đôi'], answer: 2, explain: 'Luôn rẽ nhánh theo subtype trước.' },
    { q: 'Kết quả lỗi có cho biết chi phí đã tiêu không?', options: ['Không, chỉ success mới có', 'Chỉ có số lượt', 'Chỉ có session ID', 'Có, vẫn đầy đủ chi phí và usage'], answer: 3, explain: 'Ngay cả lần chạy chạm trần vẫn cho biết đã tiêu bao nhiêu.' },
    { q: 'Một lần query single-shot chạm trần lượt thì sao?', options: ['Phát ra result lỗi trước, rồi ném exception', 'Chỉ trả result success', 'Im lặng dừng', 'Tự tăng trần và chạy tiếp'], answer: 0, explain: 'Exception là cố ý, nên cần bọc try/except.' },
    { q: 'Vì sao nên bọc lần chạy single-shot trong try/except?', options: ['Để chạy nhanh hơn', 'Để bắt giới hạn và chạy tiếp thay vì để chương trình dừng phắt', 'Để giảm chi phí', 'Vì API yêu cầu'], answer: 1, explain: 'Không chuẩn bị thì exception dừng chương trình.' },
    { q: 'Phiên streaming input xử lý việc chạm giới hạn thế nào?', options: ['Ném exception như single-shot', 'Tự đóng phiên', 'Không ném lỗi mà vẫn sống, bạn xem result rồi gửi tin nhắn khác', 'Xóa lịch sử'], answer: 2, explain: 'Cùng vòng lặp, nhưng chế độ nhập quyết định cách giới hạn đến với code.' },
    { q: 'Stop reason "max_tokens" nghĩa là gì?', options: ['Kết thúc bình thường', 'Model từ chối', 'Chạm max turns', 'Model hết chỗ để viết tiếp'], answer: 3, explain: 'End_turn là bình thường, max_tokens là hết chỗ, refusal là từ chối.' },
    { q: 'Num turns tiến sát tới trần là dấu hiệu gì?', options: ['Agent đang quay vòng không hiệu quả', 'Agent làm việc rất tốt', 'Model bị lỗi', 'Cần tăng trần ngay'], answer: 0, explain: 'Số lượt cứ tăng tới trần cho thấy agent đang khuấy đảo.' },
    { q: 'Session ID dùng để làm gì?', options: ['Tính tiền', 'Nối lại lần chạy sau hoặc truy vết khi debug', 'Mã hóa dữ liệu', 'Chọn model'], answer: 1, explain: 'Session ID định danh cả lần chạy.' },
    { q: 'Ba trường stop reason, num turns, session ID giúp gì?', options: ['Làm agent nhanh hơn', 'Giảm chi phí', 'Biến lần chạy từ hộp đen thành thứ đọc được, kiểm toán được, tiếp tục được', 'Không có tác dụng'], answer: 2, explain: 'Chúng giúp hiểu chuyện gì đã xảy ra.' },
    { q: 'Tình huống: bạn đặt ngân sách 0,010 USD, mỗi lần gọi tốn 0,006 USD. Lần chạy dừng ở chi phí bao nhiêu?', options: ['0,006 USD', '0,010 USD đúng bằng trần', '0,018 USD', '0,012 USD, vì ngân sách chỉ được kiểm tra giữa các lần gọi'], answer: 3, explain: 'Sau lần gọi thứ hai, chi phí 0,012 đã vượt trần nên vòng lặp dừng trước lần gọi thứ ba.' },
    { q: 'Với việc tự động hoặc tốn kém, điều gì phân biệt agent được kiểm soát với agent chạy mất kiểm soát?', options: ['Một giới hạn max turns hợp lý', 'Model đắt hơn', 'Prompt dài hơn', 'Nhiều tool hơn'], answer: 0, explain: 'Max turns là lưới an toàn của bạn.' },
    { q: 'Câu chốt của bài về vòng lặp là gì?', options: ['Vòng lặp tự dừng sau 10 lượt', 'Vòng lặp không có trần trừ khi bạn đặt, max turns là lưới an toàn', 'Vòng lặp chỉ chạy một lượt', 'Vòng lặp không thể giới hạn'], answer: 1, explain: 'Đặt giới hạn là trách nhiệm của bạn.' },
  ],
};
