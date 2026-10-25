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

  quiz: [
    { q: 'Khi được tạo ra, context window của subagent như thế nào?', options: ['Một bản sao context của manager', 'Một cuộc hội thoại hoàn toàn mới, tách biệt với manager', 'Dùng chung với các subagent khác', 'Chứa nửa cuối hội thoại của manager'], answer: 1, explain: 'Mỗi subagent chạy trong một cuộc hội thoại mới, là tờ giấy trắng chứ không phải bản sao.' },
    { q: 'Thứ nào sau đây subagent KHÔNG thừa hưởng từ manager?', options: ['Lịch sử hội thoại của manager', 'File CLAUDE.md của dự án', 'System prompt riêng của subagent', 'Dữ liệu được truyền rõ trong việc giao'], answer: 0, explain: 'Lịch sử, kết quả tool trước đó và system prompt của manager đều không được mang sang.' },
    { q: 'Sau khi subagent làm xong, manager nhận lại gì?', options: ['Toàn bộ transcript', 'Tất cả lời gọi tool kèm kết quả', 'Chỉ câu trả lời cuối, dưới dạng output của tool', 'Không nhận gì'], answer: 2, explain: 'Suy luận và lời gọi tool ở giữa nằm lại trong subagent; chỉ kết quả cuối quay về.' },
    { q: 'Subagent có những gì trong tay khi bắt đầu?', options: ['Mọi thứ manager đã thấy', 'Chỉ câu hỏi của người dùng', 'Kết quả tool gần nhất của manager', 'System prompt riêng, CLAUDE.md, định nghĩa tool được cấp, và những gì được truyền rõ'], answer: 3, explain: 'Đó là tập input đã biết và có giới hạn của một subagent.' },
    { q: 'Nếu không có cô lập, điều gì xảy ra với manager?', options: ['Context phình to với chi tiết không cần và đầy rất nhanh', 'Chạy nhanh hơn', 'Tiết kiệm token hơn', 'Không có gì khác'], answer: 0, explain: 'Transcript của mọi subagent đổ về sẽ làm context của manager phình ra.' },
    { q: 'Vì sao cô lập giúp số token tăng có giới hạn?', options: ['Vì subagent dùng model rẻ hơn', 'Vì manager chỉ trả tiền cho mỗi bản tóm tắt ngắn quay về', 'Vì subagent không dùng tool', 'Vì API giảm giá khi dùng subagent'], answer: 1, explain: 'Thêm việc con thứ năm hay thứ mười, manager chỉ nhận thêm một bản tóm tắt nhỏ mỗi lần.' },
    { q: 'Quy tắc thực tế rút ra từ sự cô lập là gì?', options: ['Subagent tự tìm dữ kiện nó cần', 'Nên chia sẻ toàn bộ context cho chắc', 'Nếu subagent cần một dữ kiện, bạn phải đưa dữ kiện đó cho nó', 'Subagent nên hỏi lại manager'], answer: 2, explain: 'Giả định subagent "đã biết" chính là lỗi cô lập cần đề phòng.' },
    { q: 'Việc giao (delegated task) có vai trò gì với subagent?', options: ['Không quan trọng', 'Chỉ để đặt tên subagent', 'Để giới hạn số token', 'Là kênh duy nhất để chuẩn bị cho subagent thành công'], answer: 3, explain: 'Vì context bị cô lập, việc giao là con đường duy nhất để đưa thông tin vào.' },
    { q: 'Bốn thứ nên có trong việc giao là gì?', options: ['Hướng dẫn, dữ liệu liên quan, định dạng output, bộ tool phạm vi hẹp', 'Tên, tuổi, địa chỉ, email', 'Lịch sử, kết quả tool, system prompt, CLAUDE.md của manager', 'Model, nhiệt độ, max tokens, effort'], answer: 0, explain: 'Bốn thứ này giúp subagent có đủ mọi thứ ngay từ lần đầu.' },
    { q: 'Phần "hướng dẫn công việc" trong việc giao cần nói rõ điều gì?', options: ['Lịch sử của dự án', 'Chính xác cần làm gì và kết quả hoàn chỉnh trông thế nào', 'Tên của manager', 'Số token được dùng'], answer: 1, explain: 'Hướng dẫn đứng đầu tiên: việc cần làm và tiêu chí hoàn thành.' },
    { q: 'Vì sao phải truyền "dữ liệu liên quan" vào việc giao?', options: ['Để subagent chạy nhanh hơn', 'Để giảm chi phí', 'Vì subagent không thể tự lấy chúng từ manager', 'Vì API yêu cầu'], answer: 2, explain: 'Subagent không đọc được gì từ phía manager, nên dữ kiện phải được trao tận tay.' },
    { q: 'Giả định sai phổ biến nhất về subagent là gì?', options: ['Subagent luôn chạy song song', 'Subagent không dùng được tool', 'Subagent đắt hơn manager', 'Subagent dùng chung toàn bộ context của manager'], answer: 3, explain: 'Thực tế subagent chỉ thấy prompt của nó và những gì được truyền vào.' },
    { q: 'Context dùng chung giữa manager và subagent là gì?', options: ['Ngoại lệ bạn cố ý tạo ra bằng cách truyền vào', 'Mặc định được cho không', 'Không bao giờ có thể', 'Tự động khi dùng cùng model'], answer: 0, explain: 'Muốn subagent biết gì thì phải chủ động truyền vào.' },
    { q: 'Câu hỏi nên tự đặt ra mỗi lần giao việc là gì?', options: ['Subagent này chạy có nhanh không?', 'Subagent này đã có trong input của nó mọi thứ nó cần chưa?', 'Subagent này dùng model nào?', 'Có nên dùng nhiều subagent hơn không?'], answer: 1, explain: 'Nếu chưa, giả định đang làm việc thay bạn và sẽ hỏng.' },
    { q: 'Thứ gì nằm lại bên trong subagent, không tới được manager?', options: ['Câu trả lời cuối', 'Không có gì', 'Suy luận dài, output tool ồn ào, các lần thử lại', 'Tên subagent'], answer: 2, explain: 'Tất cả phần ở giữa nằm lại; chỉ bản tóm tắt cuối rơi vào context của manager.' },
    { q: 'Khi thêm nhiều việc con, context của manager tăng như thế nào nhờ cô lập?', options: ['Bùng nổ theo cấp số nhân', 'Không đổi', 'Giảm dần', 'Đều đặn, có thể đoán trước, mỗi lần một bản tóm tắt nhỏ'], answer: 3, explain: 'Đó là lý do agent có thể mở rộng mà context không phình to.' },
    { q: 'Ba subagent tốn bên trong 40.000, 25.000 và 60.000 token, trả về 300, 200 và 250 token. Có cô lập, manager nhận bao nhiêu token?', options: ['750', '125.000', '65.000', '300'], answer: 0, explain: 'Chỉ các bản tóm tắt quay về: 300 + 200 + 250 = 750.' },
    { q: 'Cũng tình huống trên, nếu không có cô lập, manager phải nhận bao nhiêu token?', options: ['750', '125.000', '60.000', '40.300'], answer: 1, explain: 'Toàn bộ quá trình bên trong tràn vào: 40.000 + 25.000 + 60.000 = 125.000.' },
    { q: 'Theo bài học, sự cô lập nên mở rộng sang điều gì ngoài context?', options: ['Tốc độ', 'Giao diện người dùng', 'Quyền hạn', 'Giá tiền'], answer: 2, explain: 'Cô lập không chỉ về context mà còn về quyền hạn, với ba ranh giới.' },
    { q: 'Ba ranh giới quyền hạn của subagent là gì?', options: ['Nhanh, rẻ, đẹp', 'Đọc, ghi, xóa', 'Model, prompt, tool', 'Quyền tối thiểu, hạn chế tác dụng phụ, giới hạn vùng thiệt hại'], answer: 3, explain: 'Trao tối thiểu, không gây tác dụng phụ ngoài phạm vi, và giữ thiệt hại ở cục bộ.' },
    { q: 'Một subagent tóm tắt văn bản có thể gửi email. Điều đó cho thấy gì?', options: ['Phạm vi đã quá rộng', 'Subagent rất mạnh', 'Thiết kế tốt', 'Cần thêm tool nữa'], answer: 0, explain: 'Subagent có phạm vi tốt không có hành động nào ngoài việc được giao.' },
    { q: '"Giới hạn vùng thiệt hại" có nghĩa là gì?', options: ['Subagent không bao giờ sai', 'Khi subagent làm sai, phạm vi hẹp và bộ tool nhỏ giữ thiệt hại ở cục bộ, dễ truy vết', 'Subagent tự sửa lỗi', 'Manager chịu mọi thiệt hại'], answer: 1, explain: 'Sớm muộn sẽ có subagent làm sai; phạm vi hẹp giới hạn hậu quả.' },
    { q: 'Nguyên tắc thiết kế quyền hạn cho subagent là gì?', options: ['Trao nhiều để nó tự xoay xở', 'Trao giống hệt manager', 'Trao tối thiểu, không hơn', 'Trao theo yêu cầu của subagent'], answer: 2, explain: 'Thiết kế quyền hạn giống như thiết kế context: tối thiểu.' },
    { q: 'Cái bẫy lớn nhất khi nghĩ về subagent là gì?', options: ['Dùng quá ít tool', 'Viết prompt quá dài', 'Dùng model quá mạnh', 'Coi subagent chỉ là mẹo tăng tốc chạy song song'], answer: 3, explain: 'Song song là lợi ích nhỏ hơn; lý do sâu xa là cô lập context.' },
    { q: 'Dùng một subagent duy nhất, chạy tuần tự, có đáng không?', options: ['Có, vì vẫn giữ context của việc con ra ngoài manager', 'Không, vì không chạy song song', 'Không, vì tốn thêm token', 'Chỉ đáng khi có từ ba subagent'], answer: 0, explain: 'Đây chính là dấu hiệu cho thấy giá trị cốt lõi là cô lập, không phải tốc độ.' },
    { q: 'Nếu chỉ nghĩ tới tốc độ song song, bạn sẽ gặp hậu quả gì?', options: ['Chương trình chạy chậm', 'Bỏ qua subagent đúng lúc nó giúp nhiều nhất', 'Tốn quá nhiều tiền', 'Không có hậu quả'], answer: 1, explain: 'Bạn bỏ lỡ một nửa giá trị của subagent.' },
    { q: 'Vì sao một subagent "nhai" tài liệu khổng lồ mà manager gần như không cảm thấy gì?', options: ['Vì tài liệu bị cắt ngắn', 'Vì manager không đọc', 'Vì chỉ kết quả đã chắt lọc quay về', 'Vì subagent dùng bộ nhớ riêng trên đĩa'], answer: 2, explain: 'Phần đọc nặng nằm trong subagent; manager chỉ nhận bản chắt lọc.' },
    { q: 'Tình huống: bạn giao "Viết dòng trạng thái bắt đầu bằng mã dự án" nhưng không truyền mã dự án. Điều gì xảy ra?', options: ['Subagent tự lấy mã từ lịch sử của manager', 'Subagent hỏi manager', 'Subagent luôn đoán đúng', 'Subagent không biết mã dự án vì nó không thấy lịch sử của manager'], answer: 3, explain: 'Đây chính là lỗi giả định: dữ kiện phải được truyền vào việc giao.' },
    { q: 'Vì sao subagent tập trung tốt hơn khi làm một việc?', options: ['Vì nó chỉ thấy phần việc của mình, không bị phân tâm bởi những thứ khác', 'Vì nó dùng model mạnh hơn', 'Vì nó có nhiều tool hơn', 'Vì nó chạy lâu hơn'], answer: 0, explain: 'Chỉ thấy lát cắt của mình giúp subagent tập trung vào một vấn đề.' },
    { q: 'Câu chốt của bài học về cô lập là gì?', options: ['Cô lập là hạn chế cần khắc phục', 'Cô lập là lý do để giao việc, vì nó giới hạn token và giới hạn quyền hạn', 'Cô lập chỉ dành cho hệ thống lớn', 'Cô lập làm agent chậm đi'], answer: 1, explain: 'Cô lập là tính năng, không phải lỗi.' },
  ],
};
