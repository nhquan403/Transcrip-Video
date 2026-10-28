window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> CLAUDE.md không phải một file mà là <strong>một chồng file</strong> ở bốn scope: <strong>managed policy, user, project, local</strong>.
Lúc khởi động, Claude đi ngược lên cây thư mục, gom mọi CLAUDE.md và <strong>nối chúng lại</strong> (không file nào xóa file nào), theo thứ tự <strong>từ gốc xuống thư mục làm việc</strong>,
nên file <strong>gần nhất được đọc cuối</strong> và thường nặng ký nhất. Nhưng đây là <strong>xếp lớp, không phải ghi đè</strong>: nếu hai quy tắc mâu thuẫn, Claude có thể chọn bất kỳ cái nào.
Vì vậy hãy <strong>thiết kế để không có xung đột</strong> và để scope quyết định.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Managed policy:</strong> CLAUDE.md do tổ chức triển khai cho cả máy; nạp đầu tiên; không ai loại bỏ được.</li>
  <li><strong>User scope:</strong> file cá nhân trong thư mục cấu hình home, áp cho mọi project của bạn.</li>
  <li><strong>Project scope:</strong> file ở gốc repo (hoặc thư mục cấu hình project), được commit, cả nhóm dùng chung.</li>
  <li><strong>Local scope:</strong> file cá nhân, git-ignored, chỉ cho một project, không bao giờ commit.</li>
  <li><strong>Concatenate:</strong> nối các file lại với nhau thành một khối trong context.</li>
  <li><strong>Import (@path):</strong> tham chiếu bằng dấu @ và đường dẫn để kéo file khác vào context.</li>
</ul>

<h3>Bốn scope, từ rộng tới hẹp</h3>
<ol>
  <li><strong>Managed policy:</strong> admin triển khai toàn máy, nạp đầu tiên, không user nào loại được.</li>
  <li><strong>User:</strong> file cá nhân trong thư mục cấu hình home, áp cho mọi project.</li>
  <li><strong>Project:</strong> ở gốc repo hoặc thư mục cấu hình project, đã commit, cả nhóm chia sẻ.</li>
  <li><strong>Local:</strong> file cá nhân git-ignored cho một project, ở lại với bạn.</li>
</ol>

<h3>Lúc khởi động: đi ngược lên, gom, rồi nối</h3>
<p>Claude <strong>đi ngược lên cây thư mục</strong> từ chỗ bạn khởi động và gom mọi CLAUDE.md gặp trên đường. Các file được <strong>nối lại, không ghi đè nhau</strong>; không gì bị xóa.
Chúng được xếp <strong>từ gốc hệ thống file xuống thư mục làm việc</strong>, nên file cụ thể nhất (gần chỗ bạn khởi động nhất) được <strong>đọc cuối cùng</strong>.
Và thứ tự đọc là mấu chốt: thứ đến sau cùng nằm <strong>gần sự chú ý của model nhất</strong> và nặng ký nhất khi hành động.</p>

<h3>Ba sự thật về cách xếp lớp</h3>
<ul>
  <li><strong>Nối (concatenation):</strong> mọi file tìm thấy đều được xếp chồng vào context; không file nào xóa file khác.</li>
  <li><strong>Từ gốc xuống:</strong> file gần nhất nằm cuối chồng.</li>
  <li><strong>Kết hợp (composition):</strong> ý đồ thiết kế là xếp lớp, không phải ghi đè chặt. Lưu ý thật thà: nếu quy tắc thực sự mâu thuẫn, Claude <strong>có thể chọn bất kỳ cái nào</strong>,
  nên đừng dựa vào thứ tự ưu tiên để giải quyết xung đột thật.</li>
</ul>

<div class="box">🍰 <strong>Hình dung thế này:</strong> Các file CLAUDE.md như <strong>các lớp bánh</strong> chồng lên nhau, không phải các tờ giấy dán đè che mất nhau.
Lớp dưới cùng là nội quy công ty (managed), rồi thói quen của bạn (user), rồi quy ước nhóm (project), lớp trên cùng gần miệng nhất là ghi chú cho đúng chỗ bạn đang làm.
Bạn nếm thấy mọi lớp; lớp trên cùng thì rõ vị nhất. Nhưng nếu hai lớp có vị trái ngược (một lớp mặn, một lớp ngọt cùng chỗ), không ai chắc bạn sẽ cảm thấy vị nào. Đừng làm bánh như vậy.</div>

<h3>User và project: hai scope bạn chạm nhiều nhất</h3>
<ul>
  <li><strong>User:</strong> nền cá nhân đi theo bạn qua mọi project: sở thích chung, thói quen.</li>
  <li><strong>Project:</strong> nằm trong repo; vì được <strong>đọc sau</strong> file user, nó <strong>thường thắng</strong> khi hai bên bất đồng. Quy ước nhóm, lệnh build, pattern mọi người phải theo nằm ở đây.</li>
</ul>
<p>Quy tắc tư duy: project thường thắng vì đọc sau, <strong>nhưng không có gì bắt buộc điều đó</strong>, nên đừng dựa vào nó. Hãy thiết kế để không có xung đột.
Mặc định cá nhân là <strong>sàn</strong>, quy tắc project <strong>tinh chỉnh</strong> cho công việc cụ thể.</p>

<h3>File lồng trong thư mục con: nạp theo yêu cầu</h3>
<p>Không phải CLAUDE.md nào cũng nạp lúc mở phiên. File nằm <strong>bên dưới</strong> thư mục làm việc (trong thư mục con) <strong>không được chèn lúc khởi động</strong>;
nó chỉ nạp khi Claude <strong>thực sự đọc một file trong thư mục đó</strong>. Lợi ích: quy tắc riêng của thư mục sâu không chiếm context cho tới khi cần,
bạn không trả token và không bị phân tâm khi làm ở chỗ khác. Quy tắc đặt trong thư mục con <strong>tự giới hạn phạm vi</strong> vào đúng công việc ở đó.</p>

<h3>Import bằng @path: ba điều cần biết</h3>
<ol>
  <li><strong>Cú pháp:</strong> dấu @ cùng đường dẫn file sẽ mở rộng file đó vào context lúc khởi động, phân giải <strong>tương đối với file đang import</strong>.</li>
  <li><strong>Giới hạn độ sâu:</strong> import có thể nối chuỗi, nhưng đệ quy dừng ở <strong>tối đa bốn hop</strong>, tránh chuỗi chạy loạn kéo nửa repo vào.</li>
  <li><strong>Chi phí:</strong> file import nạp vào context như quy tắc viết thẳng. Import giúp <strong>tổ chức</strong>, nhưng <strong>không tiết kiệm token</strong>.</li>
</ol>

<h3>Managed policy: scope đứng trên tất cả</h3>
<p>Một CLAUDE.md tổ chức triển khai toàn máy, nạp <strong>trước</strong> cả file user lẫn project, và <strong>không user nào gỡ được</strong>.
Managed có thể nhúng quy tắc qua managed setting, nên policy đi theo máy chứ không theo repo nào. Có cơ chế <strong>exclusion</strong> để bỏ các file tổ tiên không muốn trong monorepo,
nhưng nó <strong>không bao giờ chạm được file managed policy</strong>. Khi công ty cần một quy tắc giữ nguyên cho mọi project, mọi lập trình viên, không ngoại lệ: dùng managed policy.</p>

<h3>Biến thứ bậc thành thói quen thiết kế</h3>
<ul>
  <li>Mặc định cá nhân, rộng: để ở <strong>user</strong>, đi theo bạn khắp nơi.</li>
  <li>Quy tắc của nhóm: để ở file <strong>project đã commit</strong>, ai làm codebase cũng thừa hưởng.</li>
  <li>Quy tắc hẹp cho một thư mục: để trong <strong>CLAUDE.md của thư mục con</strong>, chỉ nạp khi việc ở đó đang diễn ra.</li>
</ul>
<p>Khi mỗi quy tắc nằm đúng chỗ, các lớp hiếm khi mâu thuẫn, và bạn gần như không bao giờ cần dựa vào thứ tự ưu tiên để phân xử.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Bốn scope: managed (nạp đầu, không loại được), user, project (commit), local (git-ignored).</li>
  <li>Các file được nối, từ gốc xuống; file gần nhất đọc cuối và thường nặng ký nhất, nhưng mâu thuẫn thật thì Claude có thể chọn bất kỳ.</li>
  <li>File thư mục con nạp theo yêu cầu; @import tối đa 4 hop và không tiết kiệm token; hãy thiết kế để không có xung đột.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">which file actually wins</em>: file nào thực sự thắng.</li>
  <li><em class="en">It is a stack of them</em>: nó là một chồng file.</li>
  <li><em class="en">no user can exclude it</em>: không người dùng nào loại bỏ được nó.</li>
  <li><em class="en">walks up the directory tree</em>: đi ngược lên cây thư mục.</li>
  <li><em class="en">concatenated, not overwriting each other</em>: được nối lại, không ghi đè nhau.</li>
  <li><em class="en">reading order is the whole game here</em>: thứ tự đọc là mấu chốt ở đây.</li>
  <li><em class="en">layering, not strict override</em>: xếp lớp, không phải ghi đè chặt.</li>
  <li><em class="en">here is the honest caveat</em>: đây là lưu ý thật thà.</li>
  <li><em class="en">it tends to win in practice</em>: trên thực tế nó thường thắng.</li>
  <li><em class="en">Design the conflicts out instead</em>: thay vào đó, hãy thiết kế để loại bỏ xung đột.</li>
  <li><em class="en">a runaway chain</em>: một chuỗi chạy mất kiểm soát.</li>
  <li><em class="en">let scope decide</em>: hãy để scope quyết định.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson31/Lesson31.java</code>. Có 5 bài: xác định scope của một file CLAUDE.md từ đường dẫn,
tính thứ tự nạp lúc khởi động (managed, user, rồi từ gốc xuống thư mục làm việc, áp exclusion nhưng không bao giờ bỏ được managed policy),
tính file lồng nào được nạp khi Claude đọc một file trong thư mục con, phân giải chuỗi <code>@path</code> import tương đối với giới hạn bốn hop,
và chọn nơi đặt từng loại quy tắc để thiết kế bỏ xung đột. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-31"</code>.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Scope CLAUDE.md nào do admin triển khai toàn máy, nạp đầu tiên và không user nào loại được?', options: ['User', 'Managed policy', 'Project', 'Local'], answer: 1, explain: '"First, managed policy. An administrator deploys it machine-wide, it loads first, and no user can exclude it."' },
    { q: 'Bạn muốn ghi chú cá nhân cho một repo mà không bao giờ commit lên. Scope nào phù hợp?', options: ['User', 'Project', 'Local', 'Managed policy'], answer: 2, explain: '"Fourth, local. That is a personal git-ignored file scoped to one project, something that stays with you and never gets committed."' },
    { q: 'Khi khởi động, Claude tìm các file CLAUDE.md bằng cách nào?', options: ['Đi ngược lên cây thư mục', 'Quét mọi thư mục con của repo', 'Chỉ đọc đúng một file ở gốc repo hiện tại', 'Đọc file do biến môi trường chỉ định'], answer: 0, explain: '"Claude walks up the directory tree from wherever you started it. And it gathers every CLAUDE.md it finds along the way."' },
    { q: 'Có ba file CLAUDE.md được tìm thấy lúc khởi động. Chúng kết hợp với nhau thế nào?', options: ['File gần nhất ghi đè hết các file khác', 'Chỉ file đầu tiên tìm thấy được dùng, còn lại bỏ', 'File dài nhất thắng', 'Được nối lại, không xóa nhau'], answer: 3, explain: '"Those files are concatenated, not overwriting each other. Nothing gets erased."' },
    { q: 'Thứ tự các file được xếp trong context là gì?', options: ['Từ thư mục làm việc ngược lên gốc', 'Từ gốc xuống thư mục làm việc', 'Theo thứ tự chữ cái của đường dẫn', 'Theo ngày sửa đổi gần nhất của từng file'], answer: 1, explain: '"They are ordered from the file system root downward toward your working directory."' },
    { q: 'Vì sao file CLAUDE.md gần chỗ bạn khởi động nhất thường nặng ký nhất?', options: ['Vì nó luôn được nạp vào system prompt', 'Vì nó được đánh dấu ưu tiên cao', 'Vì nó được đọc cuối cùng', 'Vì các file khác bị cắt bớt cho vừa context'], answer: 2, explain: '"The most specific file... is read last... What comes last sits nearest the model\'s attention and carries the most weight when it is time to act."' },
    { q: 'File user ghi "dùng 4 space", file project ghi "dùng tab". Theo bài, kết luận nào an toàn nhất?', options: ['Project thường thắng, nhưng nên bỏ xung đột', 'Project luôn thắng tuyệt đối vì nó được commit', 'User luôn thắng vì là của bạn', 'Claude sẽ báo lỗi và dừng lại cho bạn chọn'], answer: 0, explain: '"If rules genuinely contradict each other, Claude may pick either one. So you shouldn\'t lean on precedence to resolve a real conflict."' },
    { q: 'Ý đồ thiết kế của hệ thống CLAUDE.md nhiều tầng là gì?', options: ['Ghi đè chặt theo thứ bậc', 'Chỉ giữ một file duy nhất', 'Ngẫu nhiên hóa quy tắc', 'Xếp lớp, kết hợp các file'], answer: 3, explain: '"Third, composition. The design intent is layering, not strict override."' },
    { q: 'Câu nào sau đây là SAI về ba sự thật xếp lớp?', options: ['Mọi file tìm thấy được xếp chồng vào context', 'File gần nhất ghi đè và xóa nội dung file xa hơn', 'File nạp từ gốc xuống thư mục làm việc', 'Mâu thuẫn thật có thể được giải theo cả hai hướng'], answer: 1, explain: '"Every file Claude discovers gets stacked together into context. No file wipes out another. They simply combine."' },
    { q: 'Sở thích chung của bạn (ví dụ: luôn trả lời ngắn gọn) muốn áp ở mọi repo. Đặt ở đâu?', options: ['CLAUDE.md của project', 'CLAUDE.md thư mục con', 'File CLAUDE.md của user', 'Managed policy'], answer: 2, explain: '"Your user-level file is the personal baseline that follows you across every project. Broad defaults you want in every repository belong there."' },
    { q: 'Lệnh build và pattern mà cả nhóm phải theo cho riêng codebase này nên nằm ở đâu?', options: ['File project đã commit', 'File user của trưởng nhóm', 'File local của mỗi người', 'Agent memory của cả nhóm'], answer: 0, explain: '"Team conventions for this specific codebase live there. The build commands, the patterns, everyone should follow."' },
    { q: 'Vì sao file project thường thắng file user khi hai bên bất đồng?', options: ['Vì project được nạp vào system prompt', 'Vì có cơ chế khóa ưu tiên cho project', 'Vì file user bị bỏ qua khi có file project', 'Vì nó được đọc sau trong chồng file'], answer: 3, explain: '"Because it is read after your user file, it tends to win in practice when the two disagree."' },
    { q: 'Theo bài, quan hệ đúng giữa mặc định cá nhân và quy tắc project là gì?', options: ['Project thay thế hoàn toàn mặc định cá nhân', 'Mặc định là sàn, project tinh chỉnh', 'Mặc định cá nhân luôn ưu tiên hơn', 'Hai loại không bao giờ cùng nạp'], answer: 1, explain: '"Personal defaults set the floor, project rules refine them for the work at hand."' },
    { q: 'Bạn mở phiên ở /repo. File /repo/services/billing/CLAUDE.md được nạp khi nào?', options: ['Ngay lúc mở phiên', 'Không bao giờ, vì nằm dưới thư mục làm việc', 'Khi Claude đọc một file trong thư mục đó', 'Chỉ khi bạn gõ lệnh /memory'], answer: 2, explain: '"Rules that sit below your working directory, down in subfolders, aren\'t injected at launch. Instead a nested file loads only when Claude actually reads a file inside that folder."' },
    { q: 'Lợi ích chính của việc nạp CLAUDE.md thư mục con theo yêu cầu là gì?', options: ['Không tốn token khi làm ở chỗ khác', 'Quy tắc thư mục con ghi đè managed policy', 'Không cần commit file thư mục con', 'Quy tắc thư mục con áp cho mọi repo'], answer: 0, explain: '"It keeps deep folder-specific rules out of your context until the moment they are relevant. You don\'t pay for them, and you aren\'t distracted by them while you work elsewhere."' },
    { q: 'Đường dẫn trong một tham chiếu @path được phân giải tương đối với cái gì?', options: ['Thư mục bạn đang mở phiên làm việc', 'Gốc của repo chứa file đó', 'Thư mục home của bạn', 'File đang import'], answer: 3, explain: '"An at-path reference written with the at sign and a file path expands that other file into context at launch, resolved relative to the importing file."' },
    { q: 'CLAUDE.md import a.md, a.md import b.md, và cứ thế tới f.md. File nào là hop cuối cùng còn được nạp?', options: ['a.md (hop 1)', 'd.md (hop 4)', 'e.md (hop 5)', 'f.md (hop 6)'], answer: 1, explain: '"Imports can chain one file pulling in another, but the recursion stops at a maximum of four hops."' },
    { q: 'Vì sao có giới hạn độ sâu cho chuỗi import?', options: ['Để import chạy nhanh hơn', 'Để ép mọi người dùng ít file', 'Tránh kéo nửa repo vào', 'Vì Markdown không hỗ trợ lồng file sâu hơn'], answer: 2, explain: '"That ceiling keeps a runaway chain from loading half your repository."' },
    { q: 'Đồng nghiệp tách CLAUDE.md 400 dòng thành 5 file rồi @import chúng, mong giảm token. Nhận định nào đúng?', options: ['Đúng, file import chỉ nạp khi cần', 'Đúng, nội dung file import được nén lại', 'Đúng nếu import ít hơn 4 hop', 'Sai: import không đỡ token'], answer: 3, explain: '"Imported files load into context just like inline rules do. So imports help you organize your rules across several files, but they don\'t save you any tokens."' },
    { q: 'Managed policy nạp ở vị trí nào so với file user và project?', options: ['Trước cả file user lẫn project', 'Sau file project', 'Giữa file user và project', 'Chỉ khi không có file project'], answer: 0, explain: '"This is a CLAUDE.md an organization deploys machine-wide, and it loads before both the user and project files."' },
    { q: 'Trong monorepo, bạn dùng cơ chế exclusion để bỏ các file CLAUDE.md tổ tiên không muốn. Nó tác động thế nào lên managed policy?', options: ['Bỏ được nếu là admin máy đó', 'Bỏ được bằng cách liệt kê đường dẫn', 'Bỏ được trong phiên hiện tại', 'Không bao giờ chạm được file đó'], answer: 3, explain: '"There is an exclusion mechanism that lets you drop ancestor files you don\'t want in a monorepo, it can never touch the managed policy file. That one is always in."' },
    { q: 'Công ty cần một quy tắc bảo mật áp cho mọi project, mọi lập trình viên, không ngoại lệ. Cơ chế nào đúng?', options: ['File project ở mọi repo', 'Managed policy', 'Gửi email yêu cầu thêm vào file user', 'Một file @import dùng chung'], answer: 1, explain: '"When a company needs a standing rule to hold across every project and every developer, no exceptions. Managed policy is exactly how that rule sticks."' },
    { q: 'Vì sao managed policy được nói là "đi theo máy chứ không theo repo"?', options: ['Vì nó nằm trong mọi repo của công ty', 'Vì mỗi repo phải import nó', 'Vì nó được nhúng qua managed setting', 'Vì nó được lưu trong agent memory'], answer: 2, explain: '"Managed can embed its rules directly through a managed setting, so the policy travels with the machine rather than any single repo."' },
    { q: 'Quy tắc "migration SQL phải có rollback" chỉ liên quan tới thư mục db/migrations. Đặt ở đâu tốt nhất?', options: ['CLAUDE.md trong db/migrations', 'File user của bạn', 'Managed policy', 'Đầu file project ở gốc, in đậm cho rõ'], answer: 0, explain: '"Keep narrow, folder-specific rules in subdirectory files, where they load only when that work is active."' },
    { q: 'Theo bài, phần lớn giá trị của việc hiểu thứ bậc nằm ở đâu?', options: ['Thuộc lòng thứ tự nạp', 'Viết thật nhiều file CLAUDE.md', 'Dựa vào thứ tự đọc để phá mọi thế hòa', 'Thói quen thiết kế tránh xung đột'], answer: 3, explain: '"Let\'s turn the hierarchy into a design habit, because knowing the order is only half the value... the safest approach is to avoid conflicts in the first place."' },
    { q: 'Khi mỗi quy tắc nằm đúng scope của nó, điều gì xảy ra?', options: ['Claude bỏ qua các file khác', 'Các lớp hiếm khi mâu thuẫn nhau', 'Managed policy bị tắt', 'Không cần file project nữa'], answer: 1, explain: '"When each rule is scoped to exactly where it belongs, the different layers rarely contradict each other."' },
    { q: 'Một file CLAUDE.md nằm ở thư mục cấu hình project, đã commit, cả nhóm dùng. Nó thuộc scope nào?', options: ['User', 'Local', 'Project', 'Managed policy'], answer: 2, explain: '"Third, the project scope. That file sits at the repository root, or the project config folder, and it is committed, so the whole team shares it."' },
    { q: 'Câu nào tóm tắt đúng bức tranh lớn của bài?', options: ['Xếp lớp rộng tới hẹp, cụ thể đọc cuối', 'File gần nhất ghi đè mọi file khác', 'Managed policy nạp sau cùng', 'Chỉ một CLAUDE.md được nạp trong mỗi phiên làm việc'], answer: 0, explain: '"The hierarchy layers your CLAUDE.md files from broad to specific. Managed policy loads first and can\'t be excluded. Files concatenate, and the most specific one is read last."' },
    { q: 'Bạn mở phiên ở /repo/app. Có /repo/CLAUDE.md, /repo/app/CLAUDE.md và /repo/app/ui/CLAUDE.md. Lúc khởi động nạp những file nào?', options: ['Chỉ /repo/app/CLAUDE.md', 'Cả ba file', '/repo/CLAUDE.md và /repo/app/CLAUDE.md', 'Chỉ /repo/CLAUDE.md'], answer: 2, explain: 'Claude "walks up the directory tree" nên nạp file ở /repo/app và tổ tiên /repo; còn /repo/app/ui nằm dưới thư mục làm việc nên "aren\'t injected at launch".' },
    { q: 'Câu kết "Design for composition, and let scope decide" khuyên điều gì?', options: ['Dựa vào thứ tự đọc để phân xử mọi mâu thuẫn', 'Đặt quy tắc đúng scope của nó', 'Dồn mọi quy tắc vào managed policy', 'Gộp mọi file thành một file duy nhất'], answer: 1, explain: '"Project tends to win over user, because it\'s read later. But don\'t count on it... Design for composition, and let scope decide."' }
  ]
};
