window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Subagent <strong>bắt đầu từ con số 0</strong>: nó không biết gì về những chuyện manager đã làm.
Muốn nó biết gì, bạn phải nói rõ khi giao việc. Đổi lại, khi làm xong nó chỉ gửi về <strong>một bản tóm tắt</strong>, nên manager luôn gọn gàng.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Context (ngữ cảnh):</strong> mọi thứ một agent đang "thấy": hướng dẫn, cuộc trò chuyện, kết quả tool.</li>
  <li><strong>Cô lập (isolation):</strong> mỗi subagent có ngữ cảnh riêng, tách hẳn khỏi manager.</li>
  <li><strong>CLAUDE.md:</strong> file ghi quy ước chung của dự án; mọi agent đều đọc được.</li>
  <li><strong>Quyền tối thiểu:</strong> chỉ cho đúng những quyền cần dùng, không hơn.</li>
</ul>

<h3>Subagent biết gì và không biết gì?</h3>
<div class="box">🧑‍💻 <strong>Hình dung thế này:</strong> Bạn thuê một <strong>người làm tự do</strong> cho một việc nhỏ. Người đó không ngồi trong các cuộc họp của công ty bạn,
không đọc email nội bộ. Họ chỉ biết những gì <strong>bạn ghi trong tờ giao việc</strong>.</div>
<p><strong>Subagent có:</strong></p>
<ul>
  <li>Hướng dẫn riêng của nó (system prompt).</li>
  <li>File CLAUDE.md của dự án.</li>
  <li>Các tool được cấp.</li>
  <li>Những gì bạn ghi rõ trong việc giao.</li>
</ul>
<p><strong>Subagent không có:</strong> cuộc trò chuyện của manager, các kết quả tool manager đã nhận, và hướng dẫn riêng của manager.</p>
<p>⚠️ <strong>Lỗi hay gặp:</strong> nghĩ rằng subagent "chắc đã biết". Ví dụ: mã dự án chỉ được nhắc trong cuộc trò chuyện của manager,
giao việc mà không ghi mã đó vào thì subagent sẽ không biết.</p>

<h3>Khi làm xong, subagent gửi về cái gì?</h3>
<p>Chỉ <strong>câu trả lời cuối</strong>. Mọi suy nghĩ, mọi lần thử, mọi kết quả dài dòng ở giữa đều ở lại bên trong subagent.</p>
<div class="box">📊 <strong>Ví dụ con số:</strong> ba subagent, mỗi cái đọc rất nhiều (40.000, 25.000 và 60.000 token) nhưng chỉ gửi về bản tóm tắt
khoảng 300, 200 và 250 token. Manager chỉ nhận <strong>750 token</strong>. Nếu không tách riêng, manager sẽ phải nhận <strong>125.000 token</strong>.</div>
<p>Nhờ vậy, thêm bao nhiêu việc con thì ngữ cảnh của manager cũng chỉ tăng chậm, mỗi lần thêm một bản tóm tắt nhỏ.</p>

<h3>Tờ giao việc cần có 4 thứ</h3>
<ul>
  <li><strong>Việc cần làm:</strong> nói rõ làm gì, và thế nào là xong.</li>
  <li><strong>Thông tin cần thiết:</strong> các dữ kiện, file, giá trị mà việc này cần, vì subagent không tự lấy được từ manager.</li>
  <li><strong>Hình dạng kết quả:</strong> muốn nhận một đoạn tóm tắt, một danh sách, hay dữ liệu có cấu trúc.</li>
  <li><strong>Công cụ vừa đủ:</strong> chỉ những tool việc này cần.</li>
</ul>
<p>🧪 Trước khi giao, tự hỏi: <strong>"Trong tờ giao việc đã có đủ mọi thứ nó cần chưa?"</strong></p>

<h3>Cô lập cả quyền hạn</h3>
<ul>
  <li><strong>Quyền tối thiểu:</strong> chỉ đọc hoặc ghi đúng thứ cần.</li>
  <li><strong>Không làm ngoài phần việc:</strong> agent tóm tắt mà gửi được email là đã cho quá nhiều quyền.</li>
  <li><strong>Hỏng thì hỏng gọn:</strong> nếu một subagent làm sai, phạm vi nhỏ giúp thiệt hại nhỏ và dễ tìm nguyên nhân.</li>
</ul>

<h3>Đừng chỉ coi subagent là cách chạy nhanh</h3>
<p>Chạy song song cho nhanh là có thật, nhưng chỉ là <strong>lợi ích phụ</strong>. Lợi ích chính là <strong>giữ cho manager gọn gàng</strong>.
Vì vậy, kể cả khi chỉ có <strong>một</strong> việc con, chạy lần lượt, việc tách ra một subagent vẫn đáng, nếu việc đó phải đọc rất nhiều thứ.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Subagent bắt đầu từ con số 0: cần gì phải ghi rõ khi giao việc.</li>
  <li>Chỉ bản tóm tắt cuối cùng quay về, nên manager không bị ngợp.</li>
  <li>Cô lập cả thông tin lẫn quyền hạn: đưa vừa đủ, không hơn.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">territory</em>: lãnh thổ, phạm vi (ở đây: hai chuyện khác hẳn nhau).</li>
  <li><em class="en">a clean slate</em>: tờ giấy trắng, bắt đầu lại từ đầu.</li>
  <li><em class="en">carry over</em>: mang sang.</li>
  <li><em class="en">walled off</em>: được ngăn cách bằng tường.</li>
  <li><em class="en">in flight</em>: đang diễn ra.</li>
  <li><em class="en">falls out of this</em>: rút ra từ điều này.</li>
  <li><em class="en">chew through</em>: nhai qua, xử lý một khối lượng lớn.</li>
  <li><em class="en">blow your token budget</em>: làm vỡ ngân sách token.</li>
  <li><em class="en">blast radius</em>: bán kính vụ nổ, phạm vi thiệt hại.</li>
  <li><em class="en">misread</em>: hiểu sai.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/lesson05/Lesson05.java</code>. Có 5 bài: dựng đúng những dòng subagent được thấy (không lọt gì từ manager),
kiểm tra bốn phần của việc giao, tìm dữ kiện đang bị giả định, tính token đổ vào manager khi có và không có cô lập, và tìm tool thừa.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="05"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="05 --live"</code>: bạn sẽ thấy subagent không biết mã dự án khi bạn quên truyền,
biết ngay khi truyền vào, và số token manager tiết kiệm được nhờ cô lập.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Thứ nào subagent CÓ nhận được khi bắt đầu?', options: ['System prompt của manager', 'Kết quả tool gần nhất của manager', 'File CLAUDE.md của dự án', 'Ba lượt hội thoại gần nhất của manager'], answer: 2, explain: '"It inherits its own system prompt, the project CLAUDE.md file, and the tool definitions you gave it."' },
    { q: 'Câu nào SAI về subagent?', options: ['Context window của nó tách biệt với manager', 'Nó thừa hưởng system prompt của manager', 'Chỉ câu trả lời cuối của nó quay về manager', 'Nó nhận những gì được truyền rõ trong việc giao'], answer: 1, explain: '"The manager\'s conversation, its earlier tool results, and its system prompt don\'t carry over."' },
    { q: 'Manager đã đọc một file log 5.000 dòng ở lượt trước. Giờ manager giao subagent "tìm nguyên nhân lỗi trong log đó" mà không đính kèm log. Điều gì xảy ra?', options: ['Subagent đọc lại log từ context của manager', 'Subagent không có log trong tay', 'Subagent tự động nhận một bản tóm tắt của log', 'Agent SDK tự chuyển kết quả tool cũ sang subagent'], answer: 1, explain: 'Kết quả tool trước đó của manager không được mang sang. "Assuming it already knows is the isolation bug to watch for."' },
    { q: 'Câu nào mô tả chính xác thứ manager nhận về từ một subagent?', options: ['Toàn bộ suy luận và các lời gọi tool', 'Câu trả lời cuối, dưới dạng output của tool', 'Bản tóm tắt do Agent SDK tự tạo từ transcript', 'Danh sách các tool subagent đã dùng kèm kết quả'], answer: 1, explain: '"The manager receives just the final result as the tool output."' },
    { q: 'Ba subagent tốn bên trong lần lượt 30.000, 50.000 và 20.000 token, mỗi cái trả về 400 token tóm tắt. Có cô lập, context của manager tăng thêm bao nhiêu token?', options: ['100.000', '1.200', '400', '101.200'], answer: 1, explain: 'Chỉ các bản tóm tắt quay về: 3 × 400 = 1.200 token.' },
    { q: 'Cũng tình huống trên nhưng không có cô lập (toàn bộ quá trình tràn về). Manager phải nhận thêm bao nhiêu token?', options: ['1.200', '50.000', '100.000', '400'], answer: 2, explain: '30.000 + 50.000 + 20.000 = 100.000 token tràn vào context của manager.' },
    { q: 'Trong bốn phần của một việc giao tốt, phần nào giúp subagent biết "khi nào là xong"?', options: ['Dữ liệu liên quan tới việc con', 'Hướng dẫn công việc', 'Bộ tool phạm vi hẹp', 'Định dạng output'], answer: 1, explain: '"State exactly what the subagent should do and what a finished result looks like."' },
    { q: 'Việc giao có hướng dẫn rõ, định dạng output rõ, bộ tool hẹp, nhưng không kèm mã khách hàng mà việc con cần. Phần nào đang thiếu?', options: ['Hướng dẫn công việc', 'Dữ liệu liên quan tới việc con', 'Định dạng output', 'Bộ tool phạm vi hẹp'], answer: 1, explain: '"Hand over the specific facts, files, or values the subtask depends on, since the subagent can\'t pull them from the manager."' },
    { q: 'Subagent tóm tắt được cấp tool đọc file và tool gửi email. Phần nào của việc giao đang làm sai?', options: ['Dữ liệu liên quan tới việc con', 'Định dạng output', 'Bộ tool phạm vi hẹp', 'Hướng dẫn công việc'], answer: 2, explain: '"Give it only the tools this task needs and nothing that widens its reach."' },
    { q: 'Theo bài, "context dùng chung" giữa manager và subagent là gì?', options: ['Mặc định có sẵn khi dùng cùng một model', 'Ngoại lệ do bạn cố ý tạo ra', 'Tính năng phải bật trong cấu hình SDK', 'Điều không thể làm được về mặt kỹ thuật'], answer: 1, explain: '"Shared context is the exception you deliberately build by passing things in, not a default you get for free."' },
    { q: 'Câu hỏi nên tự đặt ra mỗi lần giao việc là gì?', options: ['Subagent này có chạy nhanh hơn manager không?', 'Input của subagent đã đủ mọi thứ chưa?', 'Có nên tạo thêm subagent để chạy song song không?', 'Subagent này nên dùng model nào là rẻ nhất?'], answer: 1, explain: '"Does this subagent already have, in its own inputs, everything it needs? If not, the assumption is doing the work and it will break."' },
    { q: 'Thêm subagent thứ mười vào một manager đang có 9 subagent. Có cô lập, context của manager tăng như thế nào?', options: ['Tăng theo cấp số nhân vì phải phối hợp nhiều hơn', 'Tăng thêm đúng một bản tóm tắt nhỏ', 'Không tăng gì cả', 'Tăng thêm toàn bộ transcript của subagent mới'], answer: 1, explain: '"The manager\'s context grows predictably. One small summary at a time instead of exploding."' },
    { q: 'Nhóm chỉ có MỘT việc con, chạy tuần tự, nhưng việc đó phải đọc một tài liệu rất dài. Có đáng dùng subagent không?', options: ['Không, vì không có gì để chạy song song', 'Có, để phần đọc dài nằm ngoài manager', 'Không, vì tốn thêm một lần gọi model', 'Chỉ đáng khi có từ ba việc con trở lên'], answer: 1, explain: '"Reaching for a subagent pays off even when you only spin up one, run sequentially, purely to keep that subtask\'s context out of the parent."' },
    { q: 'Lợi ích nào được bài học xem là NHỎ HƠN khi nói về subagent?', options: ['Cô lập context', 'Giới hạn số token tăng thêm', 'Chạy song song cho nhanh', 'Giới hạn quyền hạn'], answer: 2, explain: '"Parallel speed is real and it\'s genuinely useful, but it\'s the smaller benefit by far."' },
    { q: 'Ba ranh giới quyền hạn của subagent là gì?', options: ['Quyền đọc, quyền ghi và quyền xóa file trong dự án', 'Quyền tối thiểu, ít tác dụng phụ, khoanh vùng thiệt hại', 'Nhanh, rẻ, chính xác', 'Model riêng, prompt riêng và bộ tool riêng cho mỗi subagent'], answer: 1, explain: '"Least privilege... keep side effects limited... a contained blast radius."' },
    { q: 'Một subagent làm sai và xóa nhầm vài file trong thư mục tạm của nó. Nhờ ranh giới nào mà thiệt hại dễ khoanh vùng và truy vết?', options: ['Cô lập context', 'Giới hạn vùng thiệt hại', 'Chạy song song', 'Kiểm tra định dạng output'], answer: 1, explain: '"Its narrow scope and small tool set keep the damage local and easy to trace."' },
    { q: 'Câu nào SAI về cô lập và chi phí?', options: ['Retries bên trong subagent không đi vào context của manager', 'Output tool ồn ào nằm lại trong subagent', 'Subagent đọc tài liệu lớn thì manager trả tiền cho cả tài liệu', 'Manager chỉ trả cho bản tóm tắt quay về'], answer: 2, explain: 'Tài liệu lớn nằm trong context của subagent; manager "barely feels it because only the distilled result comes back".' },
    { q: 'Vì sao subagent tập trung tốt hơn khi làm một việc?', options: ['Vì nó luôn dùng model mạnh hơn manager', 'Vì nó chỉ thấy phần việc của mình', 'Vì nó có nhiều tool hơn manager', 'Vì nó được chạy lâu hơn'], answer: 1, explain: '"Each subagent, seeing only its own slice, can focus hard on one problem."' },
    { q: 'Bạn giao: "Viết dòng trạng thái, bắt đầu bằng mã dự án". Mã dự án chỉ có trong lịch sử của manager. Cách sửa đúng là gì?', options: ['Bảo subagent hỏi lại manager khi cần', 'Đưa mã dự án vào dữ liệu của việc giao', 'Cho subagent đọc toàn bộ lịch sử của manager', 'Dùng chung một context cho cả hai'], answer: 1, explain: '"If a subagent needs a fact to do its job, you have to hand that fact over."' },
    { q: 'Cách làm nào phá vỡ đúng lợi ích của cô lập?', options: ['Chỉ truyền đúng dữ kiện việc con cần', 'Gửi transcript của mọi subagent về manager', 'Yêu cầu subagent trả về định dạng ngắn gọn', 'Cấp cho subagent bộ tool tối thiểu'], answer: 1, explain: 'Khi đó "the manager\'s context would balloon with detail it never needs".' },
    { q: 'Theo bài học, nên thiết kế quyền hạn cho subagent theo nguyên tắc nào?', options: ['Cấp như manager để khỏi thiếu', 'Trao tối thiểu, không hơn', 'Cấp theo những gì subagent yêu cầu', 'Cấp đủ rồi theo dõi bằng log'], answer: 1, explain: '"Design authority the same way you design context, hand over the minimum, and no more."' },
    { q: 'Dấu hiệu nào cho thấy phạm vi của subagent đã quá rộng?', options: ['Nó trả về kết quả đúng định dạng', 'Nó làm được việc ngoài phần được giao', 'Nó dùng ít token hơn dự kiến', 'Nó hoàn thành việc trong một lượt'], answer: 1, explain: '"A well-scoped subagent produces no writes and no actions outside its assigned subtask."' },
    { q: 'Câu nào đúng về những gì subagent KHÔNG BAO GIỜ thấy?', options: ['Định nghĩa tool được cấp cho nó', 'System prompt riêng của nó', 'Lịch sử hội thoại của manager', 'File CLAUDE.md của dự án'], answer: 2, explain: '"It doesn\'t get the manager\'s conversation history, the manager\'s earlier tool results, or the manager\'s system prompt."' },
    { q: 'Vì sao bài học gọi cô lập là "tính năng, không phải lỗi"?', options: ['Vì nó giúp subagent chạy nhanh hơn', 'Vì nó giới hạn cả token lẫn quyền hạn', 'Vì nó giúp tiết kiệm tiền cho subagent', 'Vì nó cho phép subagent tự đọc lịch sử khi cần'], answer: 1, explain: '"Isolation is the reason to delegate, not a limitation, since it bounds token growth and contains authority."' },
    { q: 'Subagent làm việc trên một vòng lặp tool rối rắm với nhiều lần thử lại. Những lần thử lại đó đi đâu?', options: ['Vào context của manager để manager học từ lỗi', 'Ở lại trong context của subagent', 'Vào log của Agent SDK, rồi gửi kèm kết quả', 'Bị xóa trước khi subagent trả lời'], answer: 1, explain: '"The long reasoning, the noisy tool output, the retries, all of that stays inside the subagent."' },
    { q: 'Phần nào của việc giao giúp manager ghép kết quả của nhiều subagent dễ dàng nhất?', options: ['Dữ liệu liên quan tới việc con', 'Bộ tool phạm vi hẹp', 'Định dạng output', 'Mô tả của subagent'], answer: 2, explain: '"Name the format you want back, whether that\'s a summary, a list, or structured data."' },
    { q: 'Một lập trình viên nói: "Subagent của tôi thấy được mọi thứ tôi đã làm với manager, nên tôi chỉ cần viết một dòng hướng dẫn". Đây là ví dụ của điều gì?', options: ['Cách giao việc gọn và hiệu quả', 'Giả định sai về context chung', 'Nguyên tắc quyền tối thiểu', 'Thiết kế song song hợp lý'], answer: 1, explain: '"The wrong assumption is that a subagent shares the manager\'s full context."' },
    { q: 'Nếu chỉ coi subagent là cách tăng tốc, nhóm sẽ có xu hướng làm gì sai?', options: ['Dùng subagent cho mọi việc nhỏ', 'Bỏ qua subagent đúng lúc cần nhất', 'Cấp quá ít tool cho subagent', 'Viết việc giao quá chi tiết'], answer: 1, explain: '"You\'ll miss half of what subagents are for and you\'ll skip them exactly when they\'d help most."' },
    { q: 'Câu nào đúng nhất về thứ được truyền vào subagent qua việc giao?', options: ['Chỉ cần tên việc, phần còn lại subagent tự suy ra', 'Là kênh duy nhất tới subagent', 'Nên chứa toàn bộ lịch sử để đề phòng thiếu', 'Chỉ có tác dụng khi chạy song song'], answer: 1, explain: '"The delegated task is your one channel to set a subagent up to succeed."' },
    { q: 'Câu nào là điều cần nhớ cuối bài?', options: ['Subagent nên dùng chung context để làm việc nhóm', 'Subagent bắt đầu mới, cần gì phải truyền vào', 'Cô lập chỉ quan trọng khi hệ thống lớn', 'Chạy song song là lý do chính để dùng subagent'], answer: 1, explain: '"Each subagent starts fresh, so anything it needs has to be passed in."' },
  ],
};
