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

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Claude yêu cầu lần lượt: đọc file A, đọc file B, sửa file C, đọc file D. Runtime chia đợt đúng là gì?', options: ['Một đợt gồm cả bốn, chạy song song cho nhanh', '[A, B] song song, rồi C, rồi D', '[A, B, D] song song, rồi C', 'Bốn đợt, mỗi lệnh một đợt riêng'], answer: 1, explain: 'Lệnh đọc liền nhau gom chung; lệnh ghi đứng riêng; giữ đúng thứ tự (D đứng sau C nên không được kéo lên trước).' },
    { q: 'Ba lần đọc file mất 300ms, 500ms và 400ms, chạy cùng một đợt song song. Đợt đó mất khoảng bao lâu?', options: ['300ms', '400ms', '500ms', '1.200ms'], answer: 2, explain: 'Đợt song song xong khi lệnh chậm nhất xong: 500ms.' },
    { q: 'Đợt 1 gồm hai lần đọc (400ms, 600ms) chạy song song; đợt 2 là một lần ghi 500ms. Tổng thời gian thực khoảng bao nhiêu?', options: ['600ms', '1.100ms', '1.500ms', '500ms'], answer: 1, explain: 'Đợt 1 mất 600ms (lệnh chậm nhất), đợt 2 mất 500ms, các đợt nối tiếp: 1.100ms.' },
    { q: 'Bạn viết một tool tùy chỉnh "tra_cứu_giá" chỉ đọc dữ liệu, nhưng chưa đánh dấu gì. Runtime sẽ chạy nó thế nào?', options: ['Song song, vì nó chỉ đọc', 'Tuần tự', 'Song song, nếu model gọi nhiều lần', 'Không chạy được vì thiếu đánh dấu loại tool'], answer: 1, explain: '"Your own custom tools default to sequential. If a custom tool only reads, mark it read-only, so it can join the parallel group."' },
    { q: 'Vì sao runtime được phép chạy tool chỉ đọc cùng lúc?', options: ['Vì chúng luôn nhanh hơn tool ghi', 'Vì chúng không có tác dụng phụ', 'Vì chúng chạy trên máy chủ Anthropic', 'Vì model đã yêu cầu runtime chạy chúng song song'], answer: 1, explain: '"Because they can\'t step on each other, the runtime is free to run several of them at once."' },
    { q: 'Lệnh nào phải chạy tuần tự?', options: ['Tìm kiếm trong codebase', 'Chạy một truy vấn đọc', 'Sửa nội dung của một file', 'Đọc file cấu hình'], answer: 2, explain: '"Anything that writes a file, edits code, or runs a shell command changes the world. So the runtime runs those one at a time."' },
    { q: 'Câu nào SAI về subagent?', options: ['Nó chạy trong cuộc hội thoại riêng', 'Chỉ câu trả lời cuối của nó quay về', 'Nó thấy kết quả của subagent khác', 'Nó có thể có system prompt riêng, khác với manager'], answer: 2, explain: '"Neither one sees what the other found." Trạng thái không tự rò giữa các subagent.' },
    { q: 'Worker 1 tìm ra hàm cần sửa nằm ở file nào. Worker 2 (chạy sau) cần thông tin đó để viết test. Cách đúng là gì?', options: ['Worker 2 tự đọc context của worker 1', 'Manager mang kết quả sang', 'Hai worker dùng chung một cửa sổ context', 'Worker 2 tự đoán tên file dựa trên quy ước đặt tên'], answer: 1, explain: '"If worker two needs worker one\'s result, the manager has to carry it across in the next handoff."' },
    { q: 'Lý do quan trọng nhất để dùng subagent theo bài học là gì?', options: ['Chạy song song cho nhanh', 'Giữ cửa sổ chính sạch', 'Dùng được nhiều model khác nhau trong cùng một việc', 'Giảm số lần gọi API'], answer: 1, explain: '"Their value isn\'t just parallelism, it\'s keeping junk out of your main window."' },
    { q: 'Một subagent thử nhiều hướng, gặp nhiều ngõ cụt, đọc output tool rất dài. Context của agent cha tăng thêm bao nhiêu?', options: ['Toàn bộ transcript của subagent', 'Đúng một bản tóm tắt', 'Một nửa transcript', 'Phần output tool, không gồm suy luận'], answer: 1, explain: '"The parent\'s context grows by that one summary, instead of the entire transcript."' },
    { q: 'Bốn subagent độc lập chạy song song, mất lần lượt 20, 35, 15 và 30 giây. Cả loạt xong sau khoảng bao lâu?', options: ['15 giây', '35 giây', '25 giây', '100 giây'], answer: 1, explain: '"A batch of subtasks finishes in the time of the slowest one, not the sum of all of them."' },
    { q: 'Bốn lý do dùng subagent (cộng dồn với nhau) là gì?', options: ['Cô lập, song song, giới hạn tool, prompt riêng', 'Rẻ hơn, nhanh hơn, đẹp hơn, bền hơn', 'Retrieval, tools, memory, routing', 'Đọc file, ghi file, chạy shell và gọi API bên ngoài'], answer: 0, explain: '"Isolation, parallelism, restriction, focus, that\'s the case for delegating."' },
    { q: 'Câu nào nhầm lẫn khái niệm?', options: ['Model tăng cường là model nối với retrieval, tool và memory', 'Vòng lặp tool kết thúc khi model trả lời không gọi tool', 'Subagent thừa hưởng lịch sử của manager để làm nhanh hơn', 'Tool chỉ đọc có thể chạy song song'], answer: 2, explain: '"That sub-agent starts completely fresh. It doesn\'t inherit the manager\'s conversation or history."' },
    { q: 'Vì sao agent có thể mở rộng tới việc lớn nhiều bước mà cửa sổ không phình to?', options: ['Vì model có context vô hạn', 'Vì subagent chỉ trả về tóm tắt', 'Vì kết quả của tool chỉ đọc không bị tính vào token', 'Vì runtime tự xóa lịch sử cũ'], answer: 1, explain: '"Because each sub-agent returns only a summary, the parent\'s context grows slowly."' },
    { q: 'Tình huống: một phần việc sẽ sinh ra cả núi token trung gian mà agent chính không cần. Nên làm gì?', options: ['Để agent chính tự làm cho nhanh', 'Giao phần đó cho một subagent', 'Tăng giới hạn context của model', 'Bỏ phần việc đó'], answer: 1, explain: '"When a piece of work would generate a mountain of intermediate tokens you don\'t want in your main window, that\'s your cue to hand it to a sub-agent."' },
    { q: 'Tình huống: model cần đọc một file, xem nội dung, rồi quyết định có đọc file khác không. Pattern nào đang làm việc?', options: ['Subagent', 'Vòng lặp tool', 'Parallelization cố định', 'Routing'], answer: 1, explain: '"When the model needs to act, look at what happened and act again. That\'s the tool use loop doing its job."' },
    { q: 'Trong vòng lặp tool, tín hiệu nào cho biết vòng lặp đã xong?', options: ['Model gọi tool cuối cùng trong danh sách', 'Model trả lời bằng chữ, không gọi tool nào', 'Runtime chạy hết các đợt', 'Tool trả về chuỗi rỗng'], answer: 1, explain: '"This repeats turn after turn until the model responds with plain text and no tool call."' },
    { q: 'Không có tool, model làm được gì?', options: ['Mọi việc như khi có tool', 'Chỉ tạo được chữ', 'Đọc được file nhưng không ghi được', 'Gọi API nhưng không đọc file được'], answer: 1, explain: '"Without tools, a model can only produce text. Give it tools, and it can act."' },
    { q: 'Giới hạn tool cho mỗi subagent mang lại điều gì?', options: ['Làm subagent chạy nhanh hơn', 'Thu nhỏ bề mặt sai sót và giữ nó đúng việc', 'Giảm số token của manager', 'Cho phép subagent dùng chung tool với nhau'], answer: 1, explain: '"You give each sub-agent only the tools its job needs, which shrinks the surface for mistakes and keeps it on task."' },
    { q: 'Ba lần sửa ba file khác nhau, mỗi lần 500ms. Runtime chạy chúng mất khoảng bao lâu?', options: ['500ms, vì là ba file khác nhau', '1.500ms', '1.000ms', '250ms'], answer: 1, explain: 'Tool thay đổi trạng thái chạy từng cái một: 3 × 500ms = 1.500ms, dù là ba file khác nhau.' },
    { q: 'Model tăng cường (augmented model) được nối với những gì?', options: ['Retrieval, tool, memory', 'Routing, chaining, voting', 'Một model khác để kiểm tra', 'Một cơ sở dữ liệu vector duy nhất'], answer: 0, explain: '"A model wired up with retrieval, tools, and memory, so it does more than generate."' },
    { q: 'Câu nào đúng về cách dùng hai pattern trong agent tốt?', options: ['Chọn vòng lặp tool hoặc subagent, không dùng cả hai', 'Xếp lớp cả hai', 'Chỉ dùng subagent cho mọi việc', 'Chỉ dùng vòng lặp tool để đơn giản'], answer: 1, explain: '"The best agents don\'t pick one pattern, they layer all of them."' },
    { q: 'Subagent được giao việc nhưng không được truyền đường dẫn thư mục cần đọc. Điều gì có khả năng xảy ra?', options: ['Nó lấy đường dẫn từ lịch sử manager', 'Nó thiếu thông tin', 'Nó tự hỏi người dùng', 'Nó tự đọc toàn bộ ổ đĩa để tìm thư mục phù hợp'], answer: 1, explain: '"It sees only the prompt you hand it. So, anything it needs... you pass in explicitly."' },
    { q: 'Prompt chuyên biệt cho subagent có lợi gì?', options: ['Giảm số tool cần khai báo cho cả hệ thống', 'Mỗi subagent được tinh chỉnh cho đúng một việc', 'Cho phép subagent đọc system prompt của manager', 'Giúp subagent chạy song song'], answer: 1, explain: '"Each sub-agent gets its own system prompt and instructions, tuned for one job it does well."' },
    { q: 'Câu nào SAI về thứ tự thực thi?', options: ['Tool ghi chạy từng cái một', 'Tool chỉ đọc có thể chạy cùng lúc', 'Được dồn mọi lệnh đọc lên trước lệnh ghi', 'Thứ tự ban đầu của các lời gọi tool phải được giữ nguyên khi chia đợt'], answer: 2, explain: 'Một lệnh đọc đứng sau lệnh ghi có thể cần kết quả của lệnh ghi đó; kéo nó lên trước là đổi nghĩa.' },
    { q: 'Vai trò của manager trong pattern subagent là gì?', options: ['Tự làm mọi việc con để kiểm soát chất lượng', 'Chia mục tiêu, phát việc và ghép các câu trả lời', 'Chỉ đếm token và chi phí cho các subagent', 'Chạy các tool chỉ đọc cho subagent'], answer: 1, explain: '"The lead agent that breaks the goal into scoped sub-tasks, hands them out, and stitches the answers back together."' },
    { q: 'Có ba việc con độc lập. Thiết kế nào thu gọn thời gian thực tốt nhất?', options: ['Một subagent làm lần lượt cả ba', 'Ba subagent chạy song song', 'Agent chính làm cả ba', 'Ba subagent chạy tuần tự'], answer: 1, explain: '"When you\'ve got several independent sub-tasks, run them as parallel sub-agents and collapse the wall clock time."' },
    { q: 'Ngay cả khi không cần chạy song song, subagent vẫn có ích nhờ điều gì?', options: ['Nhờ dùng model rẻ hơn', 'Nhờ cô lập context', 'Nhờ có nhiều tool hơn', 'Nhờ không tốn token'], answer: 1, explain: 'Giá trị của subagent "isn\'t just parallelism, it\'s keeping junk out of your main window".' },
    { q: 'Bên dưới mọi pattern, nguyên tắc nào luôn áp dụng?', options: ['Cấp cho mỗi agent mọi tool có thể', 'Tool của mỗi agent đúng phạm vi', 'Luôn dùng tool chỉ đọc', 'Không dùng tool tùy chỉnh, chỉ dùng tool có sẵn'], answer: 1, explain: '"Underneath all of it, keep each agent\'s tools scoped to just what its job requires."' },
    { q: 'Câu nào là điều cần nhớ cuối bài?', options: ['Chọn một trong hai pattern cho mỗi agent', 'Xếp lớp cả hai pattern', 'Subagent chỉ để chạy song song', 'Vòng lặp tool đã lỗi thời so với subagent'], answer: 1, explain: '"Just remember, you layer them, you don\'t choose between them."' },
  ],
};
