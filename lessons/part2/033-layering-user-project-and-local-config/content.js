window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Cấu hình Claude Code đến từ <strong>bốn lớp</strong>: <strong>user</strong>, <strong>project</strong>, <strong>local</strong> và <strong>managed</strong>.
Khi cùng một thiết lập xuất hiện ở nhiều lớp, <strong>precedence</strong> quyết định giá trị nào thắng: <strong>managed thắng tất cả</strong>, rồi đối số dòng lệnh,
rồi <strong>local &gt; project &gt; user</strong>. Và nhớ cặp quan trọng: <strong>project được commit</strong> (dùng chung), <strong>local bị gitignore</strong> (của riêng bạn).</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>User settings:</strong> <code>~/.claude/settings.json</code> trong thư mục home, theo bạn vào mọi dự án trên máy.</li>
  <li><strong>Project settings:</strong> <code>.claude/settings.json</code> trong repo, được commit nên cả nhóm cùng thừa hưởng.</li>
  <li><strong>Local settings:</strong> <code>.claude/settings.local.json</code> trong repo, tự động gitignore, chỉ của riêng bạn.</li>
  <li><strong>Managed settings:</strong> file policy do IT triển khai, áp cho cả máy, bạn <strong>không thể ghi đè</strong>.</li>
  <li><strong>Precedence:</strong> thứ tự ưu tiên quyết định giá trị nào có hiệu lực khi nhiều lớp cùng định nghĩa.</li>
  <li><strong>Workspace trust:</strong> bước xác nhận tin tưởng thư mục làm việc trước khi allow rule dùng chung có hiệu lực.</li>
</ul>

<h3>Bốn lớp, từ rộng nhất tới bị khóa chặt nhất</h3>
<ul>
  <li><strong>User:</strong> ở thư mục <code>.claude</code> trong home, áp cho <strong>mọi dự án</strong> của bạn.</li>
  <li><strong>Project:</strong> ở thư mục <code>.claude</code> của repo, <strong>được commit</strong>, cả nhóm dùng chung.</li>
  <li><strong>Local:</strong> cũng ở repo, nhưng trong <code>settings.local.json</code>, <strong>bị gitignore</strong>, của riêng bạn.</li>
  <li><strong>Managed:</strong> policy do IT triển khai, áp toàn máy, <strong>không thể bị ghi đè</strong>.</li>
</ul>
<p>Mỗi lớp trả lời một câu hỏi khác nhau: <strong>thiết lập này áp cho ai?</strong> Project và local nằm <strong>cùng một thư mục</strong> nhưng cách chia sẻ hoàn toàn khác nhau.</p>

<h3>Ai thắng? Precedence</h3>
<ol>
  <li><strong>Managed policy</strong>: đứng trên cùng, thắng mọi thứ, không ghi đè được (đúng điều đội IT muốn).</li>
  <li><strong>Đối số dòng lệnh</strong>: đứng kế tiếp, theo tài liệu.</li>
  <li><strong>Local</strong> ghi đè <strong>project</strong>.</li>
  <li><strong>Project</strong> ghi đè <strong>user</strong>.</li>
</ol>
<p>Quy luật dễ nhớ: lớp <strong>càng cụ thể, ưu tiên càng cao</strong> thì càng thắng các lớp rộng hơn bên dưới. Managed ở đỉnh, user ở đáy.</p>

<div class="box">🏫 <strong>Hình dung thế này:</strong> User là <strong>thói quen riêng của bạn</strong> mang theo mọi lớp học. Project là <strong>nội quy lớp</strong> dán trên bảng,
cả lớp cùng đọc. Local là <strong>tờ ghi chú trong cặp của bạn</strong>: chỉnh nội quy cho hợp với bạn, không ai khác thấy.
Còn managed là <strong>quy định của Bộ Giáo dục</strong>: nội quy lớp hay ghi chú riêng đều không thể làm trái. Khi có mâu thuẫn, đi từ trên xuống là biết ai thắng.</div>

<h3>Committed và gitignored: cặp phải nhớ</h3>
<ul>
  <li><strong>Project</strong> (<code>.claude/settings.json</code>) được commit: đi theo repo, ai pull về cũng thừa hưởng cùng permissions, hooks, cấu hình. Đó là cách cả nhóm nhất quán.</li>
  <li><strong>Local</strong> (<code>settings.local.json</code>) ngược lại: tự gitignore, ở lại máy bạn, không bao giờ vào repo chung. Đúng chỗ cho ghi đè cá nhân.</li>
</ul>
<p><strong>Committed nghĩa là chia sẻ với mọi người. Gitignored nghĩa là của riêng bạn.</strong></p>

<h3>Vì sao chuyện này quan trọng: trust và bảo mật</h3>
<ul>
  <li>Rule dùng chung trong project đi tới cả nhóm, nên Claude Code yêu cầu <strong>workspace trust</strong> trước khi allow rule của nó có hiệu lực.</li>
  <li>Rule local là của riêng bạn, <strong>không cần trust prompt</strong>, vì chính bạn sở hữu file đó.</li>
  <li><strong>Secret, token, giá trị riêng của máy</strong> thuộc về file local, không phải file commit, vì thứ gì đã commit thì ai có repo cũng thấy.</li>
</ul>

<h3>Quy trình debug khi một thiết lập "không nghe lời"</h3>
<ol>
  <li><strong>Kiểm tra mọi lớp:</strong> liệt kê thiết lập đang được định nghĩa ở đâu, từ user tới managed.</li>
  <li><strong>Áp precedence:</strong> lớp ưu tiên cao nhất thắng; local thắng project, project thắng user.</li>
  <li><strong>Mẹo tiết kiệm thời gian nhất:</strong> nếu một giá trị sửa thế nào cũng không đổi, <strong>nghi managed policy trước</strong>, vì đó là lớp duy nhất bạn không ghi đè được.</li>
</ol>
<p>Đừng đoán. Đi qua các lớp <strong>từ trên xuống</strong>; giá trị bất ngờ thường chỉ là một lớp cao hơn đang lặng lẽ làm đúng việc của nó.</p>

<h3>Ba thói quen</h3>
<ol>
  <li><strong>Commit cấu hình dùng chung:</strong> permissions và hooks của cả nhóm vào <code>.claude/settings.json</code>.</li>
  <li><strong>Gitignore file local:</strong> để <code>.claude/settings.local.json</code> ngoài repo (mặc định đã tự gitignore).</li>
  <li><strong>Giữ secret khỏi git hoàn toàn:</strong> giá trị riêng máy và thứ nhạy cảm vào file local, không bao giờ vào file commit.</li>
</ol>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Bốn lớp: user (home), project (repo, commit), local (repo, gitignore), managed (IT, không ghi đè được).</li>
  <li>Precedence: managed &gt; dòng lệnh &gt; local &gt; project &gt; user; lớp cụ thể hơn thắng lớp rộng hơn.</li>
  <li>Giá trị không chịu đổi: nghi managed trước. Secret và ghi đè cá nhân vào local; quy ước chung vào project.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">knowing which wins is a real skill</em>: biết lớp nào thắng là một kỹ năng thật sự.</li>
  <li><em class="en">broadest to most locked down</em>: từ rộng nhất tới bị khóa chặt nhất.</li>
  <li><em class="en">impossible for you to override</em>: bạn không thể ghi đè.</li>
  <li><em class="en">the paths tell you a lot</em>: đường dẫn nói lên rất nhiều điều.</li>
  <li><em class="en">Here's the part that trips people up</em>: đây là chỗ người ta hay vấp.</li>
  <li><em class="en">precedence decides which value actually applies</em>: thứ tự ưu tiên quyết định giá trị nào thực sự áp dụng.</li>
  <li><em class="en">worth tattooing on your brain</em>: đáng "xăm" vào đầu, phải nhớ thật kỹ.</li>
  <li><em class="en">Committed means shared with everyone</em>: đã commit nghĩa là chia sẻ với mọi người.</li>
  <li><em class="en">It's not just tidiness</em>: không chỉ là chuyện gọn gàng.</li>
  <li><em class="en">suspect a managed policy first</em>: hãy nghi managed policy trước tiên.</li>
  <li><em class="en">a higher layer quietly doing its job</em>: một lớp cao hơn đang lặng lẽ làm đúng việc của nó.</li>
  <li><em class="en">shared where it should be and private where it needs to be</em>: chia sẻ ở chỗ nên chia sẻ, riêng tư ở chỗ cần riêng tư.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson33/Lesson33.java</code>. Có 5 bài: nhận ra lớp từ đường dẫn file settings,
lớp nào được commit và lớp nào cần workspace trust, giải precedence để tìm giá trị có hiệu lực cùng nguồn của nó (managed &gt; CLI &gt; local &gt; project &gt; user),
liệt kê từ trên xuống các lớp đang định nghĩa một key (bước đầu của quy trình debug), và chọn lớp đúng cho từng loại thiết lập (rule nhóm, token, ghi đè cá nhân, policy công ty).
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-33"</code>.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Bốn lớp cấu hình mà bài học nêu là gì?', options: ['System, user, assistant, tool', 'User, project, local, managed', 'Global, team, branch, session', 'Default, custom, override, admin'], answer: 1, explain: '"Four layers, user, project, local, and managed. Each one answers a different question about who a setting applies to."' },
    { q: 'Bạn muốn một thiết lập theo mình vào mọi dự án trên máy. Đặt nó ở đâu?', options: ['.claude/settings.json trong repo', '.claude/settings.local.json trong repo', '~/.claude/settings.json trong home', 'Một file managed policy của IT'], answer: 2, explain: '"User settings are the file at your home .claude settings.json. It\'s personal to you, and follows you into every project on the machine."' },
    { q: 'Một đồng đội clone repo và tự có cùng permissions như bạn. File nào làm điều đó?', options: ['.claude/settings.json (được commit)', '~/.claude/settings.json của bạn', '.claude/settings.local.json của bạn', 'Biến môi trường trong shell của bạn'], answer: 0, explain: '"This one is committed to git, so when a teammate clones the repo, they inherit the same configuration you have."' },
    { q: 'Điều gì đúng về .claude/settings.local.json?', options: ['Nó được commit để cả nhóm dùng', 'Nó nằm trong thư mục home', 'Nó do IT triển khai cho cả máy', 'Nó tự động được gitignore'], answer: 3, explain: '"And local settings are the .claude settings.local.json file, again inside the repo, but this one is auto git ignored."' },
    { q: 'Project settings và local settings giống và khác nhau thế nào?', options: ['Khác thư mục, cùng cách chia sẻ', 'Cùng là file trong home, khác tên', 'Cùng thư mục, cách chia sẻ rất khác', 'Cùng được commit, khác độ ưu tiên'], answer: 2, explain: '"Same folder for the last two, but very different sharing behavior."' },
    { q: 'Lớp nào thắng mọi lớp khác và không thể bị ghi đè?', options: ['Local settings', 'Managed policy', 'Đối số dòng lệnh', 'Project settings'], answer: 1, explain: '"At the very top sits managed policy. It wins over everything and can\'t be overridden, which is exactly what an IT team wants."' },
    { q: 'Theo tài liệu được dẫn trong bài, nguồn nào đứng ngay sau managed policy về độ ưu tiên?', options: ['Đối số dòng lệnh', 'Local settings', 'User settings', 'CLAUDE.md'], answer: 0, explain: '"Command line arguments come next, according to the docs."' },
    { q: 'Cùng một key được đặt ở user, project và local (không có managed, không có CLI). Giá trị nào có hiệu lực?', options: ['Giá trị ở user', 'Giá trị ở project', 'Giá trị được đặt gần nhất', 'Giá trị ở local'], answer: 3, explain: '"Then, in order, local overrides project and project overrides user."' },
    { q: 'Quy luật chung của precedence theo bài là gì?', options: ['Lớp được sửa gần nhất luôn thắng', 'Lớp cụ thể, ưu tiên cao hơn thắng lớp rộng hơn', 'Lớp rộng nhất thắng để giữ nhất quán', 'Mọi lớp được gộp, giá trị lớn nhất thắng'], answer: 1, explain: '"The more specific and higher priority the layer, the more it takes precedence over the broader ones underneath it."' },
    { q: 'Bạn muốn ghi đè một thiết lập của nhóm chỉ trên máy mình mà không ảnh hưởng ai. Chỗ đúng là đâu?', options: ['Sửa thẳng .claude/settings.json', '~/.claude/settings.json', '.claude/settings.local.json', 'Nhờ IT thêm managed policy'], answer: 2, explain: '"That makes local the right home for personal overrides and anything you don\'t want teammates to inherit."' },
    { q: 'Bạn cần lưu một API token cho hook chạy trên máy mình. Nên đặt ở đâu?', options: ['Project settings, để cả nhóm có token', 'CLAUDE.md của dự án để Claude biết', 'Managed policy cho an toàn hơn', 'Local settings, không commit'], answer: 3, explain: '"Secrets, tokens, and machine-specific values belong in your local file, not in the committed one because anything committed is visible to everyone with the repo."' },
    { q: 'Vì sao allow rule trong project settings cần workspace trust trước khi có hiệu lực?', options: ['Vì đó là rule dùng chung, đi tới cả nhóm', 'Vì file project luôn chứa secret', 'Vì project settings chạy trên server', 'Vì Claude không đọc được file đã commit vào git'], answer: 0, explain: '"Shared project rules travel to the whole team, so Claude Code treats them as needing workspace trust before their allow rules take effect."' },
    { q: 'Vì sao rule trong local settings không cần trust prompt?', options: ['Vì local luôn có độ ưu tiên cao nhất', 'Vì bạn sở hữu chính file định nghĩa nó', 'Vì local không chứa allow rule nào', 'Vì local được IT duyệt sẵn'], answer: 1, explain: '"Personal local rules are yours alone, so they need no trust prompt because you own the file that defines them."' },
    { q: 'Theo bài, chuyện committed và personal quan trọng vì lý do nào?', options: ['Chỉ để thư mục repo gọn gàng hơn', 'Nó làm Claude chạy nhanh hơn', 'Nó thay đổi cách trust và chia sẻ hoạt động', 'Nó giảm số token mỗi request'], answer: 2, explain: '"It\'s not just tidiness. It actually changes how trust and sharing work."' },
    { q: 'Một giá trị sửa ở mọi file của bạn mà vẫn không đổi. Theo mẹo trong bài, nên nghi gì trước?', options: ['Managed policy', 'Lỗi cú pháp ở user settings', 'Cache của Claude Code', 'Đối số dòng lệnh cũ'], answer: 0, explain: '"If a value simply won\'t change, no matter what you edit, suspect a managed policy first because that\'s the one layer you can\'t override from your own settings."' },
    { q: 'Bước ĐẦU TIÊN của quy trình debug một thiết lập là gì?', options: ['Xóa file local rồi thử lại', 'Khởi động lại máy cho chắc', 'Hỏi đội IT xem có managed policy nào đang áp không', 'Kiểm tra mọi lớp nơi nó được định nghĩa'], answer: 3, explain: '"Start by checking every layer. List where the setting is actually defined, from user all the way up to managed policy, so you can see the full picture."' },
    { q: 'Một permission được đặt ở project là allow và ở local là deny. Không có managed. Kết quả là gì?', options: ['Allow, vì project được commit', 'Deny, vì local ghi đè project', 'Hỏi người dùng vì hai lớp mâu thuẫn', 'Lỗi cấu hình, Claude Code từ chối chạy'], answer: 1, explain: '"A value set in your local file overrides the same value in the committed project file."' },
    { q: 'Managed policy đặt một giá trị, còn local đặt giá trị khác. Câu nào đúng?', options: ['Local thắng vì cụ thể hơn', 'Tùy file nào được sửa sau', 'Managed thắng, không ngoại lệ', 'Hai giá trị được gộp lại'], answer: 2, explain: '"A managed policy overrides all of them every single time with no exceptions."' },
    { q: 'Khi giá trị có hiệu lực làm bạn bất ngờ, bài khuyên làm gì?', options: ['Đoán lớp nào sai rồi sửa thử', 'Đi qua các lớp từ trên xuống', 'Xóa hết các lớp, cấu hình lại', 'Chuyển mọi thứ sang user settings'], answer: 1, explain: '"So when the effective setting surprises you, don\'t guess. Walk the layers from the top down and the conflict almost always explains itself."' },
    { q: 'Theo bài, một giá trị bất ngờ thường được giải thích thế nào?', options: ['Một lớp cao hơn đang làm đúng việc của nó', 'Claude Code có lỗi khi đọc file JSON nhiều tầng', 'Model tự diễn giải lại cấu hình', 'File cấu hình bị hỏng khi đồng bộ'], answer: 0, explain: '"Usually a value you didn\'t expect is just a higher layer quietly doing its job."' },
    { q: 'Hook format code mà cả nhóm phải dùng nên đặt ở đâu?', options: ['~/.claude/settings.json của từng người', '.claude/settings.local.json', 'Một ghi chú trong README', '.claude/settings.json, commit vào repo'], answer: 3, explain: '"First, commit your shared config. Put team-wide permissions and hooks in the project\'s .claude settings.json so everyone on the team works from the exact same rules."' },
    { q: 'Thói quen thứ hai trong ba thói quen của bài là gì?', options: ['Commit file local để có backup', 'Đặt mọi thứ trong user settings', 'Gitignore file local', 'Xin IT tạo managed policy'], answer: 2, explain: '"Second, git ignore the local file. Leave .claude settings.local.json out of the repo, and since it\'s auto git ignored by default, your personal overrides stay yours without any effort."' },
    { q: 'Một đồng nghiệp đề xuất đặt đường dẫn riêng của máy anh ấy vào .claude/settings.json "cho tiện". Phản hồi tốt nhất?', options: ['Đồng ý, vì project thắng user', 'Đặt vào managed policy thay vào đó', 'Đặt vào CLAUDE.md để Claude tự hiểu và dùng đúng đường dẫn', 'Không, giá trị riêng máy thuộc về file local'], answer: 3, explain: '"Store machine-specific values and anything sensitive in the local file, never in the committed one."' },
    { q: 'Câu nào KHÔNG đúng về managed settings?', options: ['Do IT triển khai', 'Áp cho toàn máy', 'Có thể ghi đè bằng local', 'Đứng đầu precedence'], answer: 2, explain: '"And managed settings are policy files deployed by IT, applied machine-wide, and impossible for you to override."' },
    { q: 'Quy tắc tổng kết về precedence trong phần bottom line là gì?', options: ['Managed thắng, lớp cụ thể thắng lớp rộng', 'User thắng vì gần người dùng nhất', 'Project thắng vì cả nhóm đã duyệt', 'Lớp nào nạp sau cùng thì thắng'], answer: 0, explain: '"Managed wins overall, and more specific layers beat broader ones."' },
    { q: 'Thứ tự nào đúng từ ưu tiên CAO xuống THẤP?', options: ['User, project, local, managed', 'Managed, CLI, local, project, user', 'Managed, project, local, user', 'CLI, managed, user, project, local'], answer: 1, explain: '"At the very top sits managed policy... Command line arguments come next... Then, in order, local overrides project and project overrides user."' },
    { q: 'Bạn thích một theme riêng cho mọi repo mình mở. Lớp nào hợp nhất?', options: ['Project settings', 'Managed policy', 'Local của từng repo', 'User settings'], answer: 3, explain: '"User settings live at your home .claude folder and apply across all your projects."' },
    { q: 'Công ty cần cấm một tính năng trên mọi máy và nhân viên không được tắt. Lớp nào?', options: ['Managed', 'Project', 'User', 'Local'], answer: 0, explain: '"Managed policy... wins over everything and can\'t be overridden, which is exactly what an IT team wants."' },
    { q: 'Đâu là "điểm cần để ý" mà phần bottom line nhắc lại?', options: ['Local được commit, project bị gitignore', 'Project được commit, local bị gitignore', 'Cả hai đều được commit vào repo', 'Cả hai đều nằm trong thư mục home'], answer: 1, explain: '"One thing to watch, project settings are committed while local settings are git ignored."' },
    { q: 'Kết quả mong muốn khi làm đủ ba thói quen của bài là gì?', options: ['Mọi cấu hình nằm gọn trong một file', 'Không còn cần managed policy', 'Chia sẻ đúng chỗ, riêng tư đúng chỗ', 'Không phải dùng git nữa'], answer: 2, explain: '"Follow those three and your config is both shared where it should be and private where it needs to be."' }
  ]
};
