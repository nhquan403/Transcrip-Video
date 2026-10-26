window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Ý chính của cả bài:</strong> Mỗi subagent bắt đầu với một cuộc hội thoại <strong>hoàn toàn mới</strong>.
Nó không thừa hưởng gì từ manager, và chỉ <strong>câu trả lời cuối</strong> của nó quay về. Vì vậy mọi thứ nó cần đều phải được
truyền vào một cách rõ ràng. Sự cô lập này là <strong>tính năng</strong>, không phải lỗi: nó giữ context của manager gọn gàng
và giới hạn quyền hạn.</p>

<h3>1. Ba điều cơ bản định nghĩa sự cô lập</h3>
<ul>
  <li><strong>Cuộc hội thoại mới:</strong> context window của subagent tách biệt hoàn toàn với manager, là một tờ giấy trắng chứ không phải bản sao.</li>
  <li><strong>Không thừa hưởng lịch sử:</strong> hội thoại của manager, các kết quả tool trước đó, và system prompt của manager đều không được mang sang.
  Subagent chỉ có prompt riêng của nó và những gì bạn truyền vào.</li>
  <li><strong>Chỉ câu trả lời cuối quay về:</strong> mọi suy luận và lời gọi tool ở giữa nằm lại trong subagent.
  Manager chỉ nhận kết quả cuối, dưới dạng output của tool.</li>
</ul>

<h3>2. Vì sao phải "xây tường" quanh subagent?</h3>
<p>Thử tưởng tượng không có cô lập: toàn bộ transcript của mọi subagent đổ ngược về manager. Context của manager sẽ phình to với chi tiết nó không cần
và đầy rất nhanh. Cô lập mang lại ba thứ:</p>
<ul>
  <li><strong>Context của manager sạch và tập trung</strong> vào mục tiêu.</li>
  <li><strong>Số token tăng có giới hạn:</strong> thêm việc con thứ năm hay thứ mười, manager chỉ trả tiền cho mỗi bản tóm tắt ngắn quay về.</li>
  <li><strong>Subagent tập trung:</strong> chỉ thấy phần việc của mình nên không bị phân tâm bởi những thứ khác đang diễn ra.</li>
</ul>

<h3>3. Subagent thật sự có gì trong tay?</h3>
<p><strong>Có:</strong> system prompt riêng của nó, file CLAUDE.md của dự án, định nghĩa các tool bạn cấp, và mọi thứ bạn truyền rõ ràng trong việc giao
(dữ liệu và hướng dẫn cụ thể cho phần việc này).</p>
<p><strong>Không bao giờ có:</strong> lịch sử hội thoại của manager, kết quả tool trước đó của manager, system prompt của manager.</p>
<p>Quy tắc thực tế: <strong>nếu subagent cần một dữ kiện để làm việc, bạn phải đưa dữ kiện đó cho nó.</strong>
Giả định rằng nó "đã biết" chính là lỗi cô lập cần đề phòng.</p>

<h3>4. Bốn thứ phải có trong việc giao</h3>
<p>Vì context bị cô lập, việc giao là <strong>kênh duy nhất</strong> để chuẩn bị cho subagent thành công:</p>
<ul>
  <li><strong>Hướng dẫn công việc:</strong> nói chính xác cần làm gì và kết quả hoàn chỉnh trông thế nào.</li>
  <li><strong>Dữ liệu liên quan:</strong> các dữ kiện, file, giá trị mà việc con phụ thuộc vào, vì subagent không tự lấy được từ manager.</li>
  <li><strong>Định dạng output:</strong> tóm tắt, danh sách hay dữ liệu có cấu trúc.</li>
  <li><strong>Bộ tool có phạm vi hẹp:</strong> chỉ những tool việc này cần, không gì mở rộng tầm với của nó.</li>
</ul>
<p>Làm đúng bốn thứ này, subagent có đủ mọi thứ ngay từ lần đầu.</p>

<h3>5. Giả định sai và hành vi thật</h3>
<p><strong>Giả định sai:</strong> subagent dùng chung toàn bộ context của manager, thấy mọi thứ manager đã thấy và đã làm.
Lập trình viên tạo subagent rồi viết việc giao ngầm dựa vào "kiến thức chung" đó.</p>
<p><strong>Hành vi thật:</strong> subagent chỉ thấy prompt của nó và những gì bạn truyền vào. Context dùng chung là ngoại lệ bạn <strong>cố ý tạo ra</strong>
bằng cách truyền vào, không phải mặc định được cho không.</p>
<p>Mỗi lần giao việc, hãy tự hỏi: <em>subagent này đã có trong input của nó mọi thứ nó cần chưa?</em> Nếu chưa, thì giả định đang làm việc thay bạn, và nó sẽ hỏng.</p>

<h3>6. Góc nhìn chi phí</h3>
<p>Khi subagent xong việc, thứ duy nhất rơi vào context của manager là bản tóm tắt cuối. Suy luận dài, output tool ồn ào, các lần thử lại đều nằm lại bên trong.
Khi thêm việc con, context của manager tăng <strong>đều đặn, có thể đoán trước</strong> (mỗi lần một bản tóm tắt nhỏ) thay vì bùng nổ.
Một subagent có thể "nhai" một tài liệu khổng lồ hoặc một vòng lặp tool rối rắm mà manager gần như không cảm thấy gì.</p>
<p>Ví dụ: ba subagent, mỗi cái tốn 40.000, 25.000 và 60.000 token bên trong nhưng chỉ trả về 300, 200 và 250 token tóm tắt.
Có cô lập, manager nhận 750 token. Không cô lập, manager nhận 125.000 token.</p>

<h3>7. Cô lập cả quyền hạn: ba ranh giới</h3>
<ul>
  <li><strong>Quyền tối thiểu:</strong> subagent chỉ giữ quyền mà việc của nó cần, đọc hoặc ghi đúng thứ cần và không gì khác.</li>
  <li><strong>Hạn chế tác dụng phụ:</strong> không ghi, không hành động gì ngoài việc được giao. Nếu subagent tóm tắt mà gửi được email, phạm vi đã quá rộng.</li>
  <li><strong>Giới hạn vùng thiệt hại (blast radius):</strong> khi một subagent làm sai (sớm muộn sẽ có), phạm vi hẹp và bộ tool nhỏ giữ thiệt hại ở cục bộ, dễ truy vết.</li>
</ul>
<p>Thiết kế quyền hạn giống như thiết kế context: <strong>trao tối thiểu, không hơn.</strong></p>

<h3>8. Cái bẫy: coi subagent chỉ là mẹo tăng tốc</h3>
<p>Chạy song song là lợi ích thật, nhưng là lợi ích <strong>nhỏ hơn nhiều</strong>. Lý do sâu xa để giao việc là cô lập context.
Dấu hiệu rõ nhất: dùng subagent vẫn đáng ngay cả khi bạn chỉ tạo <strong>một</strong> subagent, chạy tuần tự, chỉ để giữ context của việc con đó ra ngoài manager.
Chỉ nghĩ tới tốc độ thì bạn sẽ bỏ lỡ một nửa giá trị, và bỏ qua subagent đúng lúc nó giúp nhiều nhất.</p>

<h3>9. Tóm tắt</h3>
<ul>
  <li>Mỗi subagent bắt đầu mới, nên mọi thứ nó cần phải được truyền vào.</li>
  <li>Cô lập là lý do để giao việc, không phải hạn chế: nó giới hạn số token tăng thêm và giới hạn quyền hạn.</li>
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
