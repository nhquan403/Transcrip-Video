window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Mọi agent tốt đều dùng hai cách làm. <strong>Vòng lặp tool</strong>: AI làm một việc, xem kết quả, rồi làm tiếp.
<strong>Agent phụ (subagent)</strong>: tách phần việc rườm rà ra cho agent khác làm, để agent chính gọn gàng. Agent giỏi dùng <strong>cả hai cùng lúc</strong>.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Vòng lặp tool:</strong> AI xin dùng tool, tool chạy, AI xem kết quả, rồi quyết định tiếp.</li>
  <li><strong>Tool chỉ đọc:</strong> tool chỉ xem, không thay đổi gì (đọc file, tìm kiếm).</li>
  <li><strong>Tool có ghi:</strong> tool làm thay đổi một thứ gì đó (ghi file, sửa code, chạy lệnh).</li>
  <li><strong>Subagent:</strong> agent phụ được giao một phần việc, làm riêng và chỉ báo lại kết quả cuối.</li>
</ul>

<h3>Vòng lặp tool: động cơ của mọi agent</h3>
<p>Không có tool, AI chỉ viết được chữ. Có tool, AI làm được việc thật. Mỗi vòng: AI xem việc, xin dùng một tool, chương trình chạy tool rồi đưa kết quả lại,
AI xem kết quả và quyết định tiếp. Khi AI <strong>trả lời bằng chữ mà không xin tool nữa</strong> là xong.</p>

<h3>Tool nào chạy cùng lúc được?</h3>
<div class="box">📚 <strong>Hình dung thế này:</strong> Ba người cùng <strong>đọc</strong> ba cuốn sách thì không ai vướng ai, làm cùng lúc được.
Nhưng ba người cùng <strong>sửa</strong> một tài liệu thì phải lần lượt, nếu không sẽ ghi đè lên nhau.</div>
<ul>
  <li><strong>Tool chỉ đọc:</strong> chạy <strong>cùng lúc</strong> được, tiết kiệm thời gian.</li>
  <li><strong>Tool có ghi:</strong> chạy <strong>lần lượt từng cái</strong> để tránh xung đột.</li>
  <li>⚠️ Tool bạn tự viết mặc định được coi là tool có ghi (chạy lần lượt). Nếu nó chỉ đọc, hãy <strong>đánh dấu chỉ đọc</strong> để nó được chạy cùng lúc.</li>
</ul>
<p>Ví dụ: ba lần đọc file, mỗi lần 500ms, chạy cùng lúc thì mất khoảng 500ms. Ba lần ghi file thì phải mất 1.500ms.</p>

<h3>Subagent: giữ cho agent chính gọn gàng</h3>
<p>Khi giao một phần việc cho subagent, mọi thứ lộn xộn ở giữa (các lần thử, ngõ cụt, kết quả dài dòng) <strong>ở lại bên subagent</strong>.
Agent chính chỉ nhận <strong>một bản tóm tắt</strong>. Nếu chỉ nhớ một điều về subagent, hãy nhớ: nó giúp <strong>giữ rác ra khỏi đầu agent chính</strong>.</p>

<h3>Bốn lý do dùng subagent</h3>
<ul>
  <li><strong>Gọn gàng:</strong> phần việc rườm rà không lọt vào agent chính.</li>
  <li><strong>Nhanh hơn:</strong> nhiều subagent độc lập chạy cùng lúc; cả nhóm xong khi người <strong>chậm nhất</strong> xong.</li>
  <li><strong>Ít quyền hơn:</strong> mỗi subagent chỉ có đúng tool nó cần, nên khó làm sai.</li>
  <li><strong>Chuyên môn hơn:</strong> mỗi subagent có lời dặn riêng cho đúng một việc.</li>
</ul>

<h3>Giao việc cho subagent cần nhớ gì?</h3>
<ul>
  <li>Subagent <strong>bắt đầu từ con số 0</strong>, không biết gì về chuyện của agent chính. Cần gì phải nói rõ khi giao.</li>
  <li>Hai subagent chạy song song <strong>không thấy kết quả của nhau</strong>. Nếu người thứ hai cần kết quả của người thứ nhất,
  agent chính phải <strong>tự chuyển</strong> kết quả đó sang.</li>
  <li>Vì mỗi subagent chỉ gửi về bản tóm tắt, agent chính có thể giao nhiều việc mà không bị ngợp.</li>
</ul>

<h3>Khi nào dùng cách nào?</h3>
<ul>
  <li>Cần làm, xem kết quả, rồi làm tiếp: <strong>vòng lặp tool</strong>.</li>
  <li>Một phần việc sẽ tạo ra cả núi thông tin trung gian: giao cho <strong>subagent</strong>.</li>
  <li>Có nhiều việc độc lập: chạy nhiều <strong>subagent cùng lúc</strong>.</li>
  <li>Ở đâu cũng vậy: chỉ cho mỗi agent đúng những tool nó cần.</li>
</ul>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Tool chỉ đọc chạy cùng lúc; tool có ghi chạy lần lượt.</li>
  <li>Subagent giúp agent chính gọn gàng; chạy nhanh hơn chỉ là lợi ích thêm.</li>
  <li>Đừng chọn một trong hai cách: hãy dùng cả hai.</li>
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
<p>Mở <code>java-app/src/main/java/part1/lesson12/Lesson12.java</code>. Có 4 bài: chia các tool call thành đợt (tool chỉ đọc liền nhau gom chung, tool ghi đứng riêng,
tool tự viết chưa đánh dấu thì coi là ghi), chạy các đợt (song song trong đợt chỉ đọc, kết quả đúng thứ tự), tính thời gian thực,
và để manager mang kết quả từ worker này sang worker kia. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p1-12"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p1-12 --live"</code>: Claude yêu cầu đọc nhiều file cùng lúc,
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
