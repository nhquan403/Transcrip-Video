window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Ứng dụng Claude là code, nên mọi thói quen Git vẫn áp dụng: commit, branch, tag, pull request và review.
Điểm mới quan trọng: <strong>prompt, schema và cấu hình cũng là source</strong>. Thứ gì định hướng hành vi của app thì nằm trong repo,
và một dòng prompt bị sửa phải được review kỹ như một thay đổi code.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Commit:</strong> ảnh chụp các file, được đặt tên bằng <strong>hash của nội dung</strong>; cùng hash luôn chỉ đúng một trạng thái.</li>
  <li><strong>Branch:</strong> một con trỏ di chuyển được tới một dòng công việc, để làm thay đổi riêng rồi merge lại khi xong.</li>
  <li><strong>Tag:</strong> nhãn cố định gắn vào một commit, đánh dấu một bản phát hành để sau này dựng lại đúng phiên bản đó.</li>
  <li><strong>Pull request (PR):</strong> một nhóm commit đề xuất, mở ra để review trước khi merge.</li>
  <li><strong>Diff:</strong> bản so sánh từng dòng: cái gì bị bỏ, cái gì được thêm.</li>
</ul>

<h3>Ba viên gạch của Git</h3>
<div class="box">📸 <strong>Hình dung thế này:</strong> Commit là <strong>ảnh chụp</strong>, branch là <strong>ngón tay chỉ</strong> vào ảnh mới nhất của một nhánh công việc,
tag là <strong>nhãn dán</strong> cố định lên một tấm ảnh (ví dụ "bản 1.2 phát hành"). Ảnh chụp, con trỏ, nhãn: phần còn lại của Git là biến thể của ba thứ này.</div>

<h3>Vì sao đưa app Claude vào version control?</h3>
<ul>
  <li>Mỗi thay đổi có <strong>tác giả, thời gian, và lời giải thích vì sao</strong>; không phải đoán ai đã đụng vào đâu.</li>
  <li>Prompt mới làm model cư xử tệ? <strong>Quay về commit tốt gần nhất</strong> trong vài giây thay vì cố nhớ lại.</li>
  <li>Lịch sử cho thấy <strong>chính xác lúc nào hành vi đổi</strong>, vô giá khi "tuần trước còn chạy, hôm nay thì không".</li>
</ul>
<p>Không gì trong số này đặc biệt cho Claude. Prompt chỉ là text, và Git theo dõi text rất giỏi.</p>

<h3>Merge hay rebase?</h3>
<ul>
  <li><strong>Merge:</strong> gộp hai nhánh và ghi một merge commit nối chúng. Lịch sử giữ đúng như đã xảy ra, trung thực, nhưng có thể rối khi nhiều việc song song.</li>
  <li><strong>Rebase:</strong> phát lại các commit của bạn lên trên nhánh khác, lịch sử thành một đường thẳng. Trông gọn hơn, nhưng bạn đã <strong>viết lại</strong> các commit đó.</li>
</ul>
<p>Viết lại trên nhánh riêng thì ổn; trên nhánh chung thì có vấn đề vì bạn đổi lịch sử người khác đã có. Quy tắc: <strong>rebase việc riêng, merge việc chung</strong>.</p>

<h3>Vòng làm việc hằng ngày</h3>
<ol>
  <li><strong>Tạo branch</strong> từ nhánh chính để công việc tách biệt.</li>
  <li><strong>Commit nhỏ, tập trung</strong>, message rõ ràng, thay vì một commit khổng lồ cuối cùng.</li>
  <li><strong>Push branch và mở pull request</strong>: "đây là một thay đổi, hãy review diff".</li>
  <li>Đồng đội review, kiểm tra tự động qua, rồi <strong>merge</strong> vào nhánh chính.</li>
</ol>
<p>Branch, commit, request, merge: nhịp tim của làm việc nhóm, giống hệt nhau dù thay đổi là code hay prompt.</p>

<h3>Prompt, schema, cấu hình đều là source</h3>
<p>Source không chỉ là code ứng dụng. <strong>Prompt</strong> định hình mọi câu trả lời là source. <strong>Schema</strong> của tool và output là source.
<strong>File cấu hình</strong> đặt hành vi và quyền của model cũng là source. Tất cả là text thuần, đúng thứ Git sinh ra để theo dõi.</p>
<p>⚠️ Bản năng "commit code Python, còn prompt để trong một tài liệu đâu đó, cấu hình thì dán vào chat" là bản năng phải bỏ.
<strong>Nếu nó ảnh hưởng tới cách app cư xử, nó thuộc về repo</strong>, được version cạnh code.</p>

<h3>Ba từ của quy trình review</h3>
<ul>
  <li><strong>Pull request:</strong> cửa kiểm soát, nơi một thay đổi phải chứng minh nó xứng đáng được vào.</li>
  <li><strong>Diff:</strong> góc nhìn từng dòng. Đây là phần "thần kỳ" với prompt: một chỉ dẫn được viết lại hiện ra thành <strong>trước và sau</strong> chính xác, không phải mô tả mơ hồ.</li>
  <li><strong>Code review:</strong> đồng đội đọc diff để bắt lỗi, logic khó hiểu, hay câu chữ rủi ro trước khi nó vào nhánh chính.</li>
</ul>

<h3>Phần thưởng lớn nhất: sửa prompt trở nên review được</h3>
<p>Sửa system prompt thì chỉ dẫn mới hiện thành diff: <strong>đỏ là phần đi, xanh là phần đến</strong>. Người review thấy trước hành vi sắp đổi trước khi nó tới người dùng.
Và vì mỗi sửa đổi gắn với một commit, lịch sử chỉ ra chính xác thay đổi nào đã đổi một câu trả lời, nên debug regression không còn là đoán mò.
Không còn những lần <strong>sửa lặng lẽ</strong> vào thứ đang lái cả ứng dụng: mọi chữ đều được ghi lại.</p>

<h3>Prompt và cấu hình được đối xử y như code</h3>
<p>Bạn không bao giờ merge code mà không review. Thay đổi prompt và cấu hình xứng đáng <strong>y hệt như vậy</strong>.
Dễ nghĩ prompt "chỉ là chữ" rồi cho qua, nhưng <strong>một dòng viết lại có thể đổi hành vi model nhiều hơn cả trăm dòng code</strong>.
Lúc bạn miễn review cho prompt là lúc hành vi bắt đầu trôi đi mà không ai để ý.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Commit là ảnh chụp đặt tên bằng hash, branch là con trỏ, tag là nhãn phát hành; rebase việc riêng, merge việc chung.</li>
  <li>Prompt, schema, cấu hình là source: nếu nó định hướng hành vi, nó thuộc về repo.</li>
  <li>Sửa prompt đi qua pull request, diff và review như code, không có ngoại lệ.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">the same moves carry over</em>: các thao tác quen thuộc vẫn dùng được.</li>
  <li><em class="en">Nothing drifts</em>: không có gì trôi đi.</li>
  <li><em class="en">in isolation</em>: tách biệt.</li>
  <li><em class="en">Snapshot, pointer, label</em>: ảnh chụp, con trỏ, nhãn.</li>
  <li><em class="en">you get it for free</em>: bạn có nó miễn phí.</li>
  <li><em class="en">reconstruct it from memory</em>: dựng lại từ trí nhớ.</li>
  <li><em class="en">which is priceless</em>: điều đó vô giá.</li>
  <li><em class="en">Rebase local work, merge shared work</em>: rebase việc riêng, merge việc chung.</li>
  <li><em class="en">the heartbeat of team development</em>: nhịp tim của làm việc nhóm.</li>
  <li><em class="en">earn its way in</em>: chứng minh xứng đáng để được vào.</li>
  <li><em class="en">without slowing to a crawl</em>: mà không chậm như rùa bò.</li>
  <li><em class="en">wave it through</em>: cho qua mà không xem xét.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson19/Lesson19.java</code>. Có 4 bài: tính object id mà Git gán cho một nội dung (giống <code>git hash-object</code>),
chọn rebase hay merge, viết diff theo dòng bằng dãy con chung dài nhất (LCS) để review prompt, và nhận ra file nào là "source" phải qua review.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-19"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-19 --live"</code>: code của bạn tạo diff giữa hai phiên bản system prompt,
rồi Claude đóng vai người review pull request, chỉ ra hành vi sẽ thay đổi thế nào và có nên duyệt không.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Một commit được đặt tên bằng gì?', options: ['Tên tác giả', 'Hash của nội dung', 'Số thứ tự tăng dần', 'Ngày giờ commit'], answer: 1, explain: '"A commit is a saved snapshot of your files, and it\'s named by a content hash, so the same hash always points to the exact same state."' },
    { q: 'Branch là gì?', options: ['Một bản sao toàn bộ repo', 'Một nhãn cố định trên commit', 'Con trỏ di chuyển được', 'Một file cấu hình'], answer: 2, explain: '"A branch is just a movable pointer to a line of work, which lets you develop a change in isolation and merge it back when it\'s ready."' },
    { q: 'Tag dùng để làm gì?', options: ['Đánh dấu bản phát hành', 'Lưu thay đổi tạm', 'Gộp hai nhánh', 'Viết lại lịch sử'], answer: 0, explain: '"A tag is a fixed label pinned to one commit, and you use it to mark a release, so later you can find and rebuild that exact version."' },
    { q: 'Ba viên gạch của Git theo bài học là gì?', options: ['Clone, pull, push', 'Add, commit, push', 'Fork, star, watch', 'Ảnh, con trỏ, nhãn'], answer: 3, explain: '"Snapshot, pointer, label. Learn those three, and the rest of Git is variations on them."' },
    { q: 'Một prompt mới làm model cư xử tệ. Git giúp gì?', options: ['Tự sửa prompt', 'Quay về commit tốt', 'Báo lỗi cho Anthropic', 'Tự chạy test'], answer: 1, explain: '"If a new prompt makes the model behave badly, you roll back to the last good commit in seconds instead of trying to reconstruct it from memory."' },
    { q: 'Vì sao lịch sử Git "vô giá" với app Claude?', options: ['Vì nó giảm chi phí token', 'Vì nó tăng rate limit', 'Chỉ ra lúc hành vi đổi', 'Vì nó lưu câu trả lời của model'], answer: 2, explain: '"The history shows you exactly when behavior shifted, which is priceless when something worked last week and doesn\'t today."' },
    { q: 'Merge làm gì với lịch sử?', options: ['Giữ nguyên, thêm merge commit', 'Viết lại các commit thành một đường thẳng', 'Xóa nhánh cũ', 'Gộp mọi commit làm một'], answer: 0, explain: '"A merge combines two branches and records a merge commit that ties them together. Your history keeps every branch exactly as it happened."' },
    { q: 'Rebase làm gì?', options: ['Ghi một merge commit', 'Xóa các commit lỗi', 'Tạo tag mới', 'Phát lại, viết lại commit'], answer: 3, explain: '"It replays your commits on top of another branch, so the history reads as one straight line... You rewrote those commits."' },
    { q: 'Vì sao rebase trên nhánh chung là vấn đề?', options: ['Vì chậm hơn merge', 'Đổi lịch sử chung', 'Vì xóa mất code', 'Vì không chạy trên CI'], answer: 1, explain: '"That\'s fine on your own branch, and it\'s a problem on a shared one because you\'re changing history other people already have."' },
    { q: 'Quy tắc đơn giản về rebase và merge là gì?', options: ['Luôn rebase', 'Luôn merge', 'Rebase việc riêng, merge việc chung', 'Merge việc riêng, rebase việc chung'], answer: 2, explain: '"So the simple rule is rebase local work, merge shared work."' },
    { q: 'Thứ tự đúng của vòng làm việc hằng ngày là gì?', options: ['Branch, commit, pull request, merge', 'Merge, commit, branch, review', 'Commit lên main, rồi review', 'Pull request, branch, commit, merge'], answer: 0, explain: '"Branch, commit, request, merge. That loop is the heartbeat of team development."' },
    { q: 'Theo bài học, nên commit thế nào?', options: ['Một commit lớn cuối ngày', 'Không cần message', 'Commit thẳng lên nhánh chính', 'Nhỏ, tập trung, rõ ràng'], answer: 3, explain: '"You save small, focused commits with clear messages as you build the change, rather than one giant commit at the end."' },
    { q: 'Vòng branch, commit, request, merge áp dụng cho loại thay đổi nào?', options: ['Chỉ code', 'Cả code lẫn prompt', 'Chỉ prompt', 'Chỉ cấu hình'], answer: 1, explain: '"It works identically, whether the change is code or a prompt."' },
    { q: 'Thứ nào KHÔNG được bài học coi là "source"?', options: ['Prompt', 'Schema của tool và output', 'Ghi chú cá nhân', 'File cấu hình quyền và hành vi'], answer: 2, explain: 'Source gồm code, "the prompts... the tool schemas and output schemas... the config files." Quy tắc là "if it influences how your application behaves, it belongs in the repository".' },
    { q: 'Bản năng nào bài học bảo phải bỏ?', options: ['Để prompt ngoài repo', 'Viết message commit rõ ràng', 'Review trước khi merge', 'Tạo branch cho mỗi thay đổi'], answer: 0, explain: '"The instinct to commit your Python and leave the prompt in a doc somewhere or paste config into a chat is the instinct to break."' },
    { q: 'Quy tắc quyết định thứ gì thuộc về repo là gì?', options: ['Thứ gì dài hơn 100 dòng', 'Thứ gì do lập trình viên viết', 'Thứ gì có đuôi .java hay .py', 'Thứ định hướng hành vi'], answer: 3, explain: '"If it influences how your application behaves, it belongs in the repository, versioned right alongside the code."' },
    { q: 'Pull request là gì?', options: ['Lệnh tải code về máy', 'Commit đề xuất chờ review', 'Một bản phát hành', 'Một nhánh đã merge'], answer: 1, explain: '"A pull request is a proposed set of commits opened up for review before it merges. Think of it as the gate."' },
    { q: 'Vì sao diff "thần kỳ" với prompt?', options: ['Vì nó tự sửa prompt', 'Vì nó dịch prompt', 'Vì thấy rõ trước và sau', 'Vì nó chạy prompt thử'], answer: 2, explain: '"This is the part that\'s magic for prompts, because a reworded instruction shows up as an exact before and after, not a vague description."' },
    { q: 'Code review bắt những gì?', options: ['Lỗi và câu chữ rủi ro', 'Chỉ lỗi chính tả', 'Chỉ lỗi định dạng', 'Chỉ vấn đề hiệu năng'], answer: 0, explain: '"A teammate reading that diff to catch defects, unclear logic, or risky wording before it lands in the main line."' },
    { q: 'Trong diff của system prompt, màu đỏ và xanh nghĩa là gì?', options: ['Lỗi và cảnh báo', 'Cũ và đã test', 'Của bạn và của đồng đội', 'Bỏ đi và thêm vào'], answer: 3, explain: '"That reworded instruction shows up as a plain diff, red for what left and green for what arrived."' },
    { q: 'Vì sao debug regression "không còn là đoán mò"?', options: ['Vì model tự báo lỗi', 'Vì mỗi sửa đổi gắn commit', 'Vì có log của API', 'Vì không còn regression'], answer: 1, explain: '"Because every edit is tied to a commit, the history pins down exactly which change altered a given response. So debugging a regression stops being guesswork."' },
    { q: 'Vì sao sửa một dòng prompt cũng cần review như code?', options: ['Vì prompt dài', 'Vì luật yêu cầu', 'Vì một dòng đổi được nhiều', 'Vì prompt chạy chậm'], answer: 2, explain: '"A single reworded line can swing the model\'s behavior more than a hundred lines of code."' },
    { q: 'Điều gì xảy ra khi team miễn review cho prompt?', options: ['Hành vi bắt đầu trôi đi mà không ai để ý', 'Team làm việc nhanh hơn mà không ảnh hưởng gì', 'Chi phí giảm', 'Model ổn định hơn'], answer: 0, explain: '"The moment you exempt prompts from review is the moment behavior starts drifting unnoticed."' },
    { q: 'Prompt hỗ trợ đổi "Chỉ trả lời về hóa đơn" thành "Trả lời mọi câu hỏi". Trong PR, người review nên làm gì?', options: ['Duyệt luôn vì chỉ là chữ', 'Bỏ qua vì không phải code', 'Chỉ kiểm tra chính tả', 'Đánh giá hành vi sẽ đổi'], answer: 3, explain: '"A reviewer can look at it and see the behavior shift coming before it ever ships to users."' },
    { q: 'Phát biểu nào ĐÚNG về Git và prompt?', options: ['Git không theo dõi được prompt', 'Git theo dõi text rất giỏi', 'Phải dùng công cụ riêng cho prompt', 'Prompt nên lưu trong database'], answer: 1, explain: '"A prompt is just text, and Git tracks text beautifully."' },
    { q: 'Cùng một nội dung file thì hash của nó thế nào?', options: ['Khác nhau mỗi lần commit', 'Phụ thuộc người commit', 'Luôn giống nhau', 'Phụ thuộc thời gian'], answer: 2, explain: '"It\'s named by a content hash, so the same hash always points to the exact same state. Nothing drifts."' },
    { q: 'Bạn đang làm một thay đổi chỉ trên nhánh riêng, chưa ai kéo về. Muốn lịch sử gọn, nên dùng gì?', options: ['Rebase', 'Xóa nhánh', 'Force push lên main', 'Merge vào nhánh của đồng đội'], answer: 0, explain: '"Rebase local work": viết lại commit trên nhánh của riêng bạn thì ổn.' },
    { q: 'Câu nào là tóm tắt đúng của bài?', options: ['Git chỉ dành cho code ứng dụng', 'Prompt nên sửa trực tiếp trên production', 'Review chỉ cần cho code', 'Định hướng hành vi thì vào repo'], answer: 3, explain: '"It matters because prompts and config are source, so they earn the same review as code. Just remember, if it steers behavior, it belongs in the repository."' },
    { q: 'Điều gì giúp team giữ chất lượng mà không chậm như rùa bò?', options: ['Bỏ review cho thay đổi nhỏ', 'Pull request, diff và review', 'Commit thẳng lên main', 'Một người duyệt mọi thứ'], answer: 1, explain: '"Pull request, diff, review. Together, they\'re how a team keeps quality up without slowing to a crawl."' },
    { q: 'Mỗi thay đổi trong Git mang theo những thông tin gì?', options: ['Chỉ nội dung', 'Chỉ thời gian', 'Tác giả, thời gian, lý do', 'Số token đã dùng'], answer: 2, explain: '"Every change now has an author, a timestamp, and a message explaining why, so you\'re never guessing who touched what."' },
  ],
};
