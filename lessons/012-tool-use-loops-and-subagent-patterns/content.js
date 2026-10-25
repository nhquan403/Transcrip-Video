window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Ý chính của cả bài:</strong> Mọi agent có năng lực đều dựa trên hai pattern. <strong>Vòng lặp tool</strong>: model hành động,
nhìn kết quả, rồi phản ứng. <strong>Subagent</strong>: giữ phần việc tập trung khỏi làm chật context chính. Agent tốt nhất không chọn một trong hai
mà <strong>xếp lớp</strong> cả hai.</p>

<h3>1. Ba ý tưởng neo giữ</h3>
<ul>
  <li><strong>Vòng lặp tool:</strong> không có tool, model chỉ tạo được chữ. Có tool, nó hành động được: yêu cầu tool, runtime chạy, kết quả quay về, model quyết định bước tiếp.</li>
  <li><strong>Model tăng cường (augmented model):</strong> khối xây dựng thật bên dưới mọi agent, là model được nối với retrieval, tool và memory để làm được nhiều hơn tạo chữ.</li>
  <li><strong>Subagent:</strong> một agent riêng do agent chính tạo ra để lo một phần việc tập trung, chạy trong không gian riêng và chỉ báo lại câu trả lời của nó.</li>
</ul>

<h3>2. Vòng lặp tool: động cơ của mọi agent</h3>
<p>Mỗi vòng, model nhìn nhiệm vụ và quyết định có cần tool không. Nếu cần, nó nêu tên tool và input. Runtime chạy lời gọi đó (đọc file hay gọi API) và đưa kết quả về.
Giờ model có một quan sát mới và quyết định lần nữa: gọi tool khác, hay đã đủ để trả lời. Lặp lại cho tới khi model trả lời bằng chữ thường, không gọi tool.
Câu trả lời chỉ có chữ đó là tín hiệu vòng lặp xong. Không có gì thần bí: <strong>yêu cầu, thực thi, quan sát, lặp lại</strong>.</p>

<h3>3. Không phải tool call nào cũng chạy giống nhau</h3>
<ul>
  <li><strong>Tool chỉ đọc</strong> (đọc file, tìm kiếm, chạy truy vấn) không có tác dụng phụ. Vì chúng không giẫm lên nhau, runtime được phép chạy <strong>nhiều cái cùng lúc</strong>, tiết kiệm thời gian thực.</li>
  <li><strong>Tool thay đổi trạng thái</strong> (ghi file, sửa code, chạy lệnh shell) làm thay đổi thế giới, nên runtime chạy <strong>từng cái một, theo thứ tự</strong> để tránh xung đột.</li>
  <li>Lưu ý với tool tự viết: chúng <strong>mặc định chạy tuần tự</strong>. Nếu tool của bạn chỉ đọc, hãy <strong>đánh dấu chỉ đọc</strong> để nó được vào nhóm chạy song song.</li>
</ul>
<p>Ví dụ: ba lần đọc file mỗi lần 500ms chạy song song mất khoảng 500ms thay vì 1.500ms; còn ba lần ghi vẫn mất 1.500ms vì phải chạy lần lượt.</p>

<h3>4. Subagent và lý do quan trọng nhất: cô lập context</h3>
<p>Khi giao một việc con cho subagent, nó chạy trong một cuộc hội thoại riêng. Mọi bước ở giữa đầy "nhiễu" (các lần gọi tool thăm dò, ngõ cụt, output tool dài)
nằm lại trong context của subagent. Agent chính không bao giờ thấy chúng. Thứ quay về chỉ là <strong>câu trả lời cuối</strong>, một bản tóm tắt gọn của kết quả.
Vì vậy context của agent cha chỉ tăng thêm đúng một bản tóm tắt, thay vì cả transcript.
Nếu nhớ một điều về subagent, hãy nhớ điều này: giá trị của chúng không chỉ là song song, mà là <strong>giữ rác ra khỏi cửa sổ chính</strong>.</p>

<h3>5. Bốn lý do dùng subagent (chúng cộng dồn)</h3>
<ul>
  <li><strong>Cô lập context:</strong> output tool ở giữa không vào context của agent cha.</li>
  <li><strong>Song song:</strong> các subagent độc lập chạy cùng lúc, nên một loạt việc con xong trong thời gian của <strong>cái chậm nhất</strong>, không phải tổng tất cả.</li>
  <li><strong>Giới hạn tool:</strong> mỗi subagent chỉ có tool việc của nó cần, thu nhỏ bề mặt sai sót và giữ nó đúng việc.</li>
  <li><strong>Prompt chuyên biệt:</strong> mỗi subagent có system prompt và chỉ dẫn riêng, tinh chỉnh cho một việc nó làm tốt.</li>
</ul>

<h3>6. Giao việc cụ thể ra sao</h3>
<p>Agent chính (manager) đang làm một mục tiêu lớn và gặp một phần việc đứng độc lập, ví dụ nghiên cứu một file trong khi việc khác vẫn tiếp tục.
Nó giao phần đó cho subagent như một việc có phạm vi. Điều không được bỏ qua: <strong>subagent bắt đầu hoàn toàn mới</strong>, không thừa hưởng hội thoại hay lịch sử của manager,
chỉ thấy prompt được trao. Mọi thứ nó cần (việc phải làm, ngữ cảnh liên quan, ràng buộc) đều phải truyền vào rõ ràng.
Subagent làm việc trong cô lập và trả về kết quả cuối; manager lấy câu trả lời đó ghép vào việc lớn.</p>

<h3>7. Ba ý tưởng khóa chặt cách cô lập hoạt động</h3>
<ul>
  <li><strong>Manager (orchestrator):</strong> agent dẫn dắt, chia mục tiêu thành việc con có phạm vi, phát việc, rồi ghép câu trả lời.</li>
  <li><strong>Không có context dùng chung:</strong> hai worker song song nghiên cứu hai phần khác nhau của codebase không thấy kết quả của nhau.
  Nếu worker hai cần kết quả của worker một, <strong>manager phải mang sang</strong> trong lần giao việc kế tiếp. Trạng thái không tự rò giữa các subagent.</li>
  <li><strong>Số token tăng có giới hạn:</strong> vì mỗi subagent chỉ trả về bản tóm tắt, context của agent cha tăng chậm ngay cả khi bắn ra nhiều việc con.
  Chính giới hạn đó cho phép agent mở rộng tới những việc lớn nhiều bước mà cửa sổ không phình to.</li>
</ul>

<h3>8. Chọn pattern nào?</h3>
<ul>
  <li>Model cần hành động, xem chuyện gì xảy ra, rồi hành động tiếp: đó là vòng lặp tool đang làm đúng việc của nó.</li>
  <li>Một phần việc sẽ sinh ra cả núi token trung gian bạn không muốn ở cửa sổ chính: giao cho subagent.</li>
  <li>Có nhiều việc con độc lập: chạy chúng thành các subagent song song để gom thời gian thực lại.</li>
  <li>Bên dưới tất cả: giữ tool của mỗi agent trong đúng phạm vi việc của nó.</li>
</ul>
<p>Agent tốt nhất không chọn một pattern, mà xếp lớp tất cả.</p>

<h3>9. Tóm tắt</h3>
<ul>
  <li>Vòng lặp tool cho model hành động, quan sát và lặp cho tới khi trả lời.</li>
  <li>Subagent cô lập việc con, chỉ câu trả lời cuối quay về, mang lại song song, giới hạn tool, context cha sạch và sự tập trung chuyên biệt.</li>
  <li>Hãy xếp lớp chúng, đừng chọn một bỏ một.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">rests on</em>: dựa trên.</li>
  <li><em class="en">crowding your main context</em>: làm chật context chính.</li>
  <li><em class="en">clicks into place</em>: tự khớp vào chỗ, bỗng hiểu ra.</li>
  <li><em class="en">step on each other</em>: giẫm chân lên nhau.</li>
  <li><em class="en">dead ends</em>: ngõ cụt.</li>
  <li><em class="en">they stack</em>: chúng cộng dồn.</li>
  <li><em class="en">stands on its own</em>: tự đứng độc lập.</li>
  <li><em class="en">where it bites</em>: chỗ nó gây rắc rối thật.</li>
  <li><em class="en">a mountain of tokens</em>: cả núi token.</li>
  <li><em class="en">collapse the wall clock time</em>: gom ngắn thời gian thực.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/lesson12/Lesson12.java</code>. Có 4 bài: chia các tool call thành đợt (tool chỉ đọc liền nhau gom chung, tool ghi đứng riêng,
tool tự viết chưa đánh dấu thì coi là ghi), chạy các đợt (song song trong đợt chỉ đọc, kết quả đúng thứ tự), tính thời gian thực,
và để manager mang kết quả từ worker này sang worker kia. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="12"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="12 --live"</code>: Claude yêu cầu đọc nhiều file cùng lúc,
code của bạn chạy chúng song song (mỗi tool giả lập 500ms) và in thời gian tiết kiệm được.</p>
`,

  quiz: [
    { q: 'Hai pattern mà mọi agent có năng lực dựa vào là gì?', options: ['Vòng lặp tool và subagent', 'Prompt và model', 'Đọc và ghi', 'Cache và log'], answer: 0, explain: 'Một để hành động và phản ứng, một để giữ context gọn.' },
    { q: 'Không có tool, model làm được gì?', options: ['Mọi thứ', 'Chỉ tạo được chữ', 'Chỉ đọc file', 'Không làm được gì'], answer: 1, explain: 'Có tool thì model mới hành động được.' },
    { q: 'Model tăng cường (augmented model) gồm những gì?', options: ['Model cộng giao diện web', 'Model cộng cơ sở dữ liệu', 'Model nối với retrieval, tool và memory', 'Hai model chạy song song'], answer: 2, explain: 'Đó là khối xây dựng bên dưới mọi agent.' },
    { q: 'Subagent là gì?', options: ['Một tool có sẵn', 'Một phiên bản nhỏ của model', 'Một file cấu hình', 'Một agent riêng do agent chính tạo ra để lo một phần việc tập trung'], answer: 3, explain: 'Nó chạy trong không gian riêng và chỉ báo lại câu trả lời.' },
    { q: 'Bốn bước của vòng lặp tool là gì?', options: ['Yêu cầu, thực thi, quan sát, lặp lại', 'Đọc, ghi, xóa, sửa', 'Mở, đóng, lưu, thoát', 'Gửi, nhận, mã hóa, giải mã'], answer: 0, explain: 'Không có gì thần bí cả.' },
    { q: 'Tín hiệu nào cho biết vòng lặp tool đã xong?', options: ['Model gọi tool cuối cùng', 'Model trả lời bằng chữ thường, không gọi tool', 'Hết thời gian', 'Runtime báo lỗi'], answer: 1, explain: 'Câu trả lời chỉ có chữ là tín hiệu kết thúc.' },
    { q: 'Vì sao tool chỉ đọc được phép chạy song song?', options: ['Vì chúng nhanh hơn', 'Vì chúng rẻ hơn', 'Vì chúng không có tác dụng phụ, không giẫm lên nhau', 'Vì chúng chạy trên máy chủ Anthropic'], answer: 2, explain: 'Chạy cùng lúc tiết kiệm thời gian thực.' },
    { q: 'Ví dụ nào là tool chỉ đọc?', options: ['Ghi file', 'Sửa code', 'Chạy lệnh shell', 'Tìm kiếm trong file'], answer: 3, explain: 'Đọc file, tìm kiếm, chạy truy vấn là chỉ đọc.' },
    { q: 'Tool thay đổi trạng thái được chạy thế nào?', options: ['Từng cái một, theo thứ tự, để tránh xung đột', 'Tất cả cùng lúc', 'Ngẫu nhiên', 'Không được chạy'], answer: 0, explain: 'Ghi file, sửa code, chạy shell làm thay đổi thế giới.' },
    { q: 'Tool tự viết mặc định chạy thế nào?', options: ['Song song', 'Tuần tự, trừ khi bạn đánh dấu chỉ đọc', 'Không chạy được', 'Chạy trên máy chủ'], answer: 1, explain: 'Đánh dấu chỉ đọc để nó vào nhóm song song.' },
    { q: 'Ba lần đọc file, mỗi lần 500ms, chạy song song mất khoảng bao lâu?', options: ['1.500ms', '1.000ms', '500ms', '250ms'], answer: 2, explain: 'Thời gian bằng lần chậm nhất trong đợt.' },
    { q: 'Ba lần ghi file, mỗi lần 500ms, mất khoảng bao lâu?', options: ['500ms', '250ms', '1.000ms', '1.500ms, vì phải chạy lần lượt'], answer: 3, explain: 'Tool thay đổi trạng thái không chạy song song.' },
    { q: 'Lý do quan trọng nhất để dùng subagent là gì?', options: ['Cô lập context: giữ phần việc ồn ào ra khỏi cửa sổ chính', 'Tiết kiệm tiền', 'Dùng model khác', 'Làm đẹp code'], answer: 0, explain: 'Giá trị không chỉ là song song.' },
    { q: 'Những gì nằm lại trong context của subagent?', options: ['Chỉ câu trả lời cuối', 'Các lần gọi tool thăm dò, ngõ cụt, output tool dài', 'Lịch sử của manager', 'Không có gì'], answer: 1, explain: 'Agent chính không bao giờ thấy phần ở giữa.' },
    { q: 'Context của agent cha tăng thêm bao nhiêu sau một subagent?', options: ['Cả transcript của subagent', 'Không tăng', 'Đúng một bản tóm tắt', 'Gấp đôi'], answer: 2, explain: 'Chỉ câu trả lời cuối quay về.' },
    { q: 'Bốn lý do dùng subagent là gì?', options: ['Nhanh, rẻ, đẹp, bền', 'Đọc, ghi, xóa, sửa', 'Prompt, model, tool, memory', 'Cô lập context, song song, giới hạn tool, prompt chuyên biệt'], answer: 3, explain: 'Bốn lý do này cộng dồn.' },
    { q: 'Một loạt subagent độc lập chạy song song xong trong bao lâu?', options: ['Thời gian của cái chậm nhất', 'Tổng thời gian của tất cả', 'Thời gian của cái nhanh nhất', 'Không đoán được'], answer: 0, explain: 'Song song gom thời gian thực lại.' },
    { q: 'Giới hạn tool cho subagent mang lại lợi ích gì?', options: ['Làm subagent chạy nhanh hơn', 'Thu nhỏ bề mặt sai sót và giữ nó đúng việc', 'Giảm số token', 'Không có lợi ích'], answer: 1, explain: 'Mỗi subagent chỉ có tool việc của nó cần.' },
    { q: 'Prompt chuyên biệt cho subagent có nghĩa là gì?', options: ['Dùng chung prompt với manager', 'Không có prompt', 'Mỗi subagent có system prompt và chỉ dẫn riêng cho một việc', 'Prompt do người dùng viết'], answer: 2, explain: 'Tinh chỉnh cho một việc nó làm tốt.' },
    { q: 'Khi được giao việc, subagent thừa hưởng những gì từ manager?', options: ['Toàn bộ hội thoại', 'Lịch sử tool', 'Một nửa context', 'Không gì cả; chỉ thấy prompt được trao'], answer: 3, explain: 'Mọi thứ nó cần phải được truyền vào rõ ràng.' },
    { q: 'Manager (orchestrator) làm gì?', options: ['Chia mục tiêu thành việc con, phát việc, rồi ghép câu trả lời', 'Tự làm mọi việc con', 'Chỉ đếm token', 'Chỉ chạy tool'], answer: 0, explain: 'Manager điều phối, không tự làm việc con.' },
    { q: 'Hai worker song song có thấy kết quả của nhau không?', options: ['Có, tự động', 'Không; manager phải mang kết quả sang nếu cần', 'Có, nếu dùng cùng model', 'Chỉ khi chạy tuần tự'], answer: 1, explain: 'Trạng thái không tự rò giữa các subagent.' },
    { q: 'Worker hai cần kết quả của worker một thì làm thế nào?', options: ['Worker hai tự đọc context của worker một', 'Worker hai đoán', 'Manager đưa kết quả đó vào lần giao việc kế tiếp', 'Không làm được'], answer: 2, explain: 'Manager là người mang thông tin qua lại.' },
    { q: 'Vì sao agent mở rộng được tới việc lớn nhiều bước mà cửa sổ không phình to?', options: ['Vì model có context vô hạn', 'Vì tool chạy nhanh', 'Vì không dùng subagent', 'Vì mỗi subagent chỉ trả về bản tóm tắt, số token tăng có giới hạn'], answer: 3, explain: 'Context cha tăng chậm dù bắn ra nhiều việc con.' },
    { q: 'Khi model cần hành động, xem kết quả, rồi hành động tiếp, pattern nào đang làm việc?', options: ['Vòng lặp tool', 'Subagent', 'Single message', 'Batch'], answer: 0, explain: 'Đó là đúng việc của vòng lặp tool.' },
    { q: 'Một phần việc sẽ sinh ra cả núi token trung gian. Nên làm gì?', options: ['Để agent chính tự làm', 'Giao cho subagent', 'Bỏ qua phần việc đó', 'Tăng max tokens'], answer: 1, explain: 'Giữ núi token đó ra khỏi cửa sổ chính.' },
    { q: 'Có nhiều việc con độc lập. Cách tốt nhất?', options: ['Làm tuần tự trong agent chính', 'Gộp thành một prompt dài', 'Chạy thành các subagent song song', 'Bỏ bớt việc'], answer: 2, explain: 'Song song gom thời gian thực lại.' },
    { q: 'Tình huống: Claude yêu cầu đọc file A, đọc file B, sửa file C, rồi đọc file D. Chia đợt đúng là gì?', options: ['Một đợt gồm cả bốn', 'Bốn đợt, mỗi cái một đợt', 'Đợt 1: đọc A, sửa C; đợt 2: đọc B, D', 'Đợt 1: đọc A và B; đợt 2: sửa C; đợt 3: đọc D'], answer: 3, explain: 'Lệnh đọc liền nhau gom chung; lệnh ghi đứng riêng; giữ thứ tự.' },
    { q: 'Agent tốt nhất dùng hai pattern như thế nào?', options: ['Xếp lớp cả hai, không chọn một bỏ một', 'Chỉ dùng vòng lặp tool', 'Chỉ dùng subagent', 'Luân phiên từng ngày'], answer: 0, explain: 'Bạn xếp lớp chúng, không chọn giữa chúng.' },
    { q: 'Bên dưới mọi pattern, nguyên tắc nào luôn áp dụng?', options: ['Cho mỗi agent mọi tool có thể', 'Giữ tool của mỗi agent trong đúng phạm vi việc của nó', 'Dùng một agent duy nhất', 'Không dùng tool chỉ đọc'], answer: 1, explain: 'Phạm vi tool hẹp ở mọi tầng.' },
  ],
};
