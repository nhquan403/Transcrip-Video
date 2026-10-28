window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Claude Code có ba cách quan trọng nhất để định hình cách nó làm việc: <strong>rules</strong>, <strong>skills</strong> và <strong>slash commands</strong>.
Rule thì <strong>luôn bật</strong> (nạp khi phiên bắt đầu, áp cho mọi lượt); skill thì <strong>theo yêu cầu</strong> (chỉ có description nằm sẵn trong context, phần thân nạp khi được gọi).
Còn custom slash command thực chất <strong>chỉ là một skill</strong> mà bạn gọi bằng tên.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Rule:</strong> chỉ dẫn thường trực, luôn bật, nằm trong CLAUDE.md, nạp vào context khi phiên bắt đầu. Bạn không bao giờ "gọi" nó.</li>
  <li><strong>Skill:</strong> một năng lực dùng lại được, đóng gói thành file <code>SKILL.md</code> có YAML front matter; Claude chỉ nạp khi task khớp với description.</li>
  <li><strong>Slash command:</strong> lối tắt bạn gõ sau dấu <code>/</code>. Có loại built-in, có loại tự viết.</li>
  <li><strong>YAML front matter:</strong> khối khai báo ở đầu file, trong đó quan trọng nhất là <code>description</code>.</li>
  <li><strong>Always-on / on-demand:</strong> luôn có mặt / chỉ nạp khi cần. Đây là ranh giới giữa rule và skill.</li>
  <li><strong>Scope (phạm vi):</strong> ai dùng được một custom command; do <strong>vị trí file</strong> quyết định.</li>
</ul>

<h3>Ranh giới then chốt: always-on và on-demand</h3>
<ul>
  <li><strong>Rule:</strong> nạp vào context <strong>ngay khi phiên bắt đầu</strong> và ở đó cho mọi lượt. Bạn không bao giờ invoke nó.</li>
  <li><strong>Skill:</strong> ngược lại. Chỉ <strong>description</strong> nằm trong context, vừa đủ để Claude biết skill tồn tại.
  <strong>Phần thân</strong> (toàn bộ hướng dẫn thật) chỉ nạp khi bạn hoặc model gọi nó.</li>
  <li>Vì thế skill <strong>rẻ</strong>: bạn viết skill dài, chi tiết mà gần như không tốn gì cho tới lúc thật sự cần.</li>
</ul>
<div class="box">🍜 <strong>Hình dung thế này:</strong> Rule giống <strong>bảng nội quy treo trong bếp</strong>: ai vào bếp cũng thấy, lúc nào cũng áp dụng.
Skill giống <strong>cuốn sổ công thức trên kệ</strong>: trên gáy chỉ ghi tên món (description). Đầu bếp chỉ lấy cuốn sổ xuống mở ra khi có khách gọi đúng món đó.
Gáy sách ghi mơ hồ thì chẳng ai biết mà lấy xuống.</div>

<h3>Rule: nhầm lẫn kinh điển</h3>
<ul>
  <li>Nhiều người tưởng rule giống skill, phải chủ động kích hoạt. <strong>Không phải.</strong> Rule tự nạp: khi phiên bắt đầu, hoặc khi bạn
  <strong>chạm vào file có đường dẫn</strong> mà rule được giới hạn (scoped) tới. Không ai gõ slash để chạy một rule.</li>
  <li>Khi CLAUDE.md lớn dần, bạn có thể <strong>tách thành các file theo chủ đề</strong>, mỗi chủ đề một file, cho dễ đọc.</li>
  <li><strong>Rule là context, không phải cưỡng chế.</strong> Nó định hướng điều Claude có xu hướng làm, nhưng không bảo đảm. Cần chặn cứng thì dùng
  <strong>permissions</strong> hoặc <strong>hooks</strong>, không dùng rule.</li>
</ul>

<h3>Bên trong một skill</h3>
<ul>
  <li>Skill thực chất là một <strong>thư mục nhỏ</strong> Claude có thể nhặt lên khi liên quan. Bên trong có file <code>SKILL.md</code> chứa hướng dẫn.</li>
  <li>Đầu file là YAML front matter; phần chính là <strong>description</strong>, thứ Claude đọc để quyết định skill có hợp với task trước mặt không.</li>
  <li>Chi tiết hay vấp: <strong>tên lệnh lấy từ tên thư mục</strong>, không từ field nào trong file. Thư mục tên <code>deploy</code> thì gõ <code>/deploy</code>.</li>
</ul>

<h3>Lỗi gặp nhiều nhất: một file markdown trơn</h3>
<ul>
  <li>Ai đó viết file markdown trơn, thả hướng dẫn vào, rồi mong nó chạy ổn định như một skill.</li>
  <li>Sắc thái: các field front matter <strong>về kỹ thuật là tùy chọn</strong>. Name mặc định là tên thư mục, description rơi về <strong>đoạn văn đầu tiên</strong> của file.</li>
  <li>Nhưng skill không có description rõ ràng thì <strong>khớp kém</strong>, nên chạy thất thường, thậm chí không chạy. Vậy nên <strong>luôn viết description</strong>.</li>
  <li><strong>Vị trí</strong> cũng quan trọng: file phải nằm trong thư mục <code>skills</code> hoặc <code>commands</code> mà Claude thật sự quét. Ở chỗ khác thì chỉ là một ghi chú.</li>
</ul>

<h3>Slash command và skill đã hợp nhất</h3>
<ul>
  <li>Hướng dẫn cũ hay mô tả chúng như hai tính năng riêng. Trong Claude Code hiện tại, chúng đã <strong>gộp thành một hệ thống</strong>.</li>
  <li><code>.claude/commands/name.md</code> tạo lệnh <code>/name</code>; thư mục <code>.claude/skills/name/</code> có <code>SKILL.md</code> bên trong cũng tạo đúng <code>/name</code>. Cả hai chạy như nhau.</li>
  <li>Dạng commands cũ vẫn chạy, nhưng <strong>skills là con đường được khuyên dùng</strong>. Nếu skill và command <strong>trùng tên</strong>, <strong>skill thắng</strong>.</li>
</ul>

<h3>Hai họ slash command</h3>
<ul>
  <li><strong>Built-in:</strong> code sẵn trong công cụ, chạy logic cố định, bạn không sửa được: <code>/init</code>, <code>/clear</code>, <code>/help</code>, <code>/model</code>.</li>
  <li><strong>Custom:</strong> của bạn. Viết một file markdown, <strong>tên file</strong> thành từ khóa sau dấu slash, nội dung file là điều lệnh bảo Claude làm.</li>
</ul>
<p>Cùng một dấu slash, hai nguồn rất khác nhau: hành vi của công cụ và hành vi do bạn viết.</p>

<h3>Lưu ở đâu thì ai dùng được</h3>
<ul>
  <li>Không có bước đăng ký, không có config phải bật. <strong>Vị trí file quyết định phạm vi.</strong></li>
  <li>Đặt dưới <code>.claude/</code> trong dự án: đi theo repo, <strong>cả nhóm có</strong> sau khi pull.</li>
  <li>Đặt dưới thư mục <code>.claude</code> ở <strong>home</strong>: cá nhân, dùng được ở mọi dự án, nhưng <strong>chỉ mình bạn</strong>.</li>
  <li>Bản dự án nằm trong version control, nên <strong>commit nó</strong> là cách bảo đảm cả nhóm dùng đúng cùng một lệnh.</li>
</ul>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Rule luôn bật, tự nạp (lúc bắt đầu phiên hoặc khi chạm file khớp đường dẫn), là context chứ không phải cưỡng chế.</li>
  <li>Skill chỉ để description trong context, thân nạp khi được gọi; description rõ ràng và đúng thư mục được quét là bắt buộc trên thực tế.</li>
  <li>Custom command = skill gọi bằng tên; skill thắng khi trùng tên; vị trí file (<code>.claude/</code> dự án hay home) quyết định ai dùng được.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">the mix-up people make most often</em>: sự nhầm lẫn người ta mắc nhiều nhất.</li>
  <li><em class="en">the whole lesson turns on keeping them straight</em>: cả bài xoay quanh việc phân biệt rõ chúng.</li>
  <li><em class="en">standing, always-on instructions</em>: chỉ dẫn thường trực, luôn bật.</li>
  <li><em class="en">it's the one people get backwards</em>: đó là điều người ta hay hiểu ngược.</li>
  <li><em class="en">Always-on versus on-demand</em>: luôn bật so với theo yêu cầu.</li>
  <li><em class="en">Rules are context, not enforcement</em>: rule là ngữ cảnh, không phải sự cưỡng chế.</li>
  <li><em class="en">a detail people trip on</em>: một chi tiết người ta hay vấp.</li>
  <li><em class="en">it fires unreliably, if at all</em>: nó chạy thất thường, nếu có chạy.</li>
  <li><em class="en">A note sitting anywhere else is just a note</em>: ghi chú nằm ở chỗ khác thì chỉ là ghi chú.</li>
  <li><em class="en">straight out of the box</em>: dùng được ngay, không cần cài đặt gì.</li>
  <li><em class="en">There's no registration step, no config to flip</em>: không có bước đăng ký, không có cấu hình nào phải bật.</li>
  <li><em class="en">The file's location is what sets the scope</em>: chính vị trí file đặt ra phạm vi.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson37/Lesson37.java</code>. Có 5 bài: tính số token một rule và một skill chiếm trong context (trước và sau khi skill được gọi),
quyết định một rule có giới hạn đường dẫn đã được nạp chưa dựa trên các file đã chạm, tìm xem gõ <code>/name</code> thì cái gì chạy (built-in, skill thắng command trùng tên, tên lấy từ thư mục),
tính description thực tế và liệt kê cảnh báo khiến skill khó kích hoạt, và xác định phạm vi của một custom command theo vị trí file.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-37"</code>.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Một nhóm viết quy tắc "luôn dùng tiếng Việt trong commit message" vào CLAUDE.md. Câu nào mô tả đúng cách quy tắc này đi vào context?', options: ['Chỉ nạp khi ai đó gõ /commit', 'Nạp khi phiên bắt đầu và có mặt ở mọi lượt', 'Chỉ description nằm sẵn, thân nạp khi khớp task', 'Nạp khi model tự thấy task có liên quan'], answer: 1, explain: '"Those are standing, always-on instructions that live in CLAUDE.md and load into context when your session starts."' },
    { q: 'Bạn có một skill dài 6.000 token và chưa ai gọi nó trong phiên. Phần nào của skill đang chiếm chỗ trong context?', options: ['Toàn bộ 6.000 token', 'Không có gì cả, kể cả tên', 'Chỉ description của skill', 'Nửa đầu của phần thân, phần còn lại nạp sau'], answer: 2, explain: '"Only its description sits in context, just enough for Claude to know the skill exists. The body, all the actual instructions, loads only when you or the model invoke it."' },
    { q: 'Vì sao bài học nói skill là "rẻ"?', options: ['Phần thân chỉ tốn khi được gọi', 'Skill chạy trên model nhỏ hơn model chính', 'Skill được nén trước khi nạp vào context', 'Skill được cache nên không bao giờ tính token'], answer: 0, explain: '"That\'s what makes skills cheap. You can write a long, detailed skill, and it costs you almost nothing until the moment it\'s actually needed."' },
    { q: 'Một lập trình viên mới hỏi: "Gõ lệnh gì để kích hoạt rule về coding style?". Câu trả lời đúng nhất là gì?', options: ['Gõ /rules rồi chọn tên rule cần chạy', 'Gõ /init để nạp lại toàn bộ rule', 'Nhắc tên rule bằng @ trong prompt', 'Không cần gõ gì; rule tự nạp'], answer: 3, explain: '"A rule loads on its own, either when your session starts or when you touch files whose paths it\'s scoped to. You never type a slash to fire a rule."' },
    { q: 'Một rule được giới hạn cho đường dẫn src/api/**. Trong phiên bạn mới chỉ sửa README.md. Điều gì đúng?', options: ['Rule đã nạp từ đầu phiên như mọi rule khác', 'Rule chỉ nạp khi bạn gõ tên nó sau dấu slash', 'Chưa nạp; nó chờ bạn chạm file khớp', 'Rule bị bỏ qua vĩnh viễn trong phiên này'], answer: 2, explain: '"A rule loads on its own, either when your session starts or when you touch files whose paths it\'s scoped to."' },
    { q: 'CLAUDE.md của dự án đã dài vài trăm dòng, khó đọc. Bài học gợi ý cách nào?', options: ['Chuyển toàn bộ sang một skill duy nhất', 'Tách thành các file theo chủ đề', 'Xóa bớt rule và nhắc lại bằng tin nhắn mỗi phiên', 'Chuyển rule sang thư mục home cho gọn repo'], answer: 1, explain: '"As your CLAUDE.md grows, you can split it into separate topic files, one per subject, so it stays readable."' },
    { q: 'Nhóm bạn tuyệt đối không cho Claude chạy lệnh xóa thư mục production. Lựa chọn nào phù hợp nhất?', options: ['Dùng permissions hoặc hooks để chặn cứng', 'Viết rule thật rõ trong CLAUDE.md', 'Viết một skill tên no-delete có description chi tiết', 'Tạo custom command /safe và nhắc mọi người gõ'], answer: 0, explain: '"Rules are context, not enforcement. They shape what Claude tends to do, but they don\'t guarantee it. If you need a hard block, that\'s a job for permissions, or hooks, not a rule."' },
    { q: 'Câu nào KHÔNG đúng về rule?', options: ['Rule có thể được giới hạn theo đường dẫn file', 'Rule định hướng điều Claude có xu hướng làm', 'Rule áp dụng cho mọi lượt sau khi đã nạp', 'Rule bảo đảm Claude không bao giờ vi phạm'], answer: 3, explain: '"They shape what Claude tends to do, but they don\'t guarantee it."' },
    { q: 'Trong một skill, phần nào Claude đọc để quyết định skill có hợp với task trước mặt không?', options: ['Tên file SKILL.md', 'Field description trong YAML front matter', 'Dòng cuối cùng của phần thân', 'Danh sách tool khai báo trong thân'], answer: 1, explain: '"At the top of it sits YAML front matter, and the key piece there is the description. That description is what Claude reads to decide whether the skill fits the task in front of it."' },
    { q: 'Thư mục skill tên ship-it, trong SKILL.md có front matter ghi name: release. Theo bài học, lệnh nào bạn gõ để gọi skill này?', options: ['/release, vì field trong file được ưu tiên', '/SKILL, vì tên file là SKILL.md', '/ship-it, vì tên lệnh lấy từ tên thư mục', 'Cả /release và /ship-it đều chạy'], answer: 2, explain: '"The command name comes from the folder name, not from any field inside the file. So if the folder is called deploy, you invoke it by typing slash deploy."' },
    { q: 'Một SKILL.md không có YAML front matter nào. Điều gì xảy ra theo bài học?', options: ['Claude báo lỗi cú pháp và không nạp skill', 'Skill bị coi là rule và nạp khi phiên bắt đầu', 'Skill chỉ chạy được qua cờ --skill lúc khởi động', 'Name theo thư mục, description theo đoạn đầu'], answer: 3, explain: '"The front matter fields are technically optional. The name defaults to the folder name, and the description falls back to the file\'s first paragraph."' },
    { q: 'Skill của bạn có front matter nhưng description chỉ ghi "helper". Hậu quả có khả năng nhất là gì?', options: ['Khớp kém, chạy thất thường hoặc không chạy', 'Skill bị nạp toàn bộ vào context ở mọi lượt', 'Claude tự viết lại description cho rõ hơn', 'Skill vẫn chạy ổn định vì tên thư mục đủ rõ'], answer: 0, explain: '"A skill with no clear description matches poorly, so it fires unreliably, if at all... A weak description means almost nothing to match, so always write one."' },
    { q: 'Bạn lưu hướng dẫn deploy tốt vào docs/deploy-skill.md với front matter đầy đủ. Vì sao Claude không bao giờ dùng nó như một skill?', options: ['Description quá dài nên không khớp được task nào', 'Tên file phải viết hoa toàn bộ là SKILL.md mới được', 'Nằm ngoài thư mục skills/commands được quét', 'Skill phải đăng ký trong settings.json trước khi dùng'], answer: 2, explain: '"The file has to live in a skills or commands folder that Claude actually scans. A note sitting anywhere else is just a note."' },
    { q: 'Một tutorial cũ nói slash command và skill là hai tính năng tách biệt. Theo bài học, mô tả nào đúng với Claude Code hiện tại?', options: ['Chúng vẫn tách biệt nhưng dùng chung thư mục', 'Đã gộp làm một; custom command là một skill', 'Slash command đã bị bỏ, chỉ còn skill', 'Skill đã bị bỏ, chỉ còn slash command'], answer: 1, explain: '"In current Claude Code, they were merged into one system... So a custom slash command really is just a skill in a slightly different shape."' },
    { q: 'Repo có cả .claude/commands/deploy.md và .claude/skills/deploy/SKILL.md. Khi gõ /deploy, cái nào chạy?', options: ['Skill trong .claude/skills/deploy', 'Command trong .claude/commands/deploy.md', 'Cả hai chạy lần lượt, command trước', 'Claude hỏi bạn muốn chạy cái nào'], answer: 0, explain: '"And if a skill and a command ever share a name, the skill is the one that wins."' },
    { q: 'Nhóm đang có nhiều file trong .claude/commands/. Bài học khuyên gì cho lệnh mới?', options: ['Bắt buộc chuyển hết sang skills vì commands đã ngừng chạy', 'Dạng commands vẫn chạy, nhưng skills là đường được khuyên', 'Giữ nguyên commands vì skills chỉ dùng cho model gọi', 'Đặt lệnh mới trong CLAUDE.md để luôn có mặt'], answer: 1, explain: '"The older commands form still works, but skills are the recommended path now."' },
    { q: 'Đâu là cặp đúng về hai họ slash command?', options: ['Built-in do nhóm viết; custom do công cụ cung cấp', 'Built-in sửa được qua file markdown; custom thì không', 'Built-in có logic cố định; custom do bạn viết', 'Cả hai đều phải đăng ký trong config trước khi dùng'], answer: 2, explain: '"So built in commands are the tool\'s own behavior, and custom commands are behavior you author. Same slash, two very different sources."' },
    { q: 'Lệnh nào sau đây KHÔNG phải ví dụ built-in được nêu trong bài?', options: ['/init', '/clear', '/model', '/deploy'], answer: 3, explain: '"Think of slash init, slash clear, slash help, slash model. You can\'t edit what they do." (/deploy là ví dụ custom/skill trong bài.)' },
    { q: 'Bạn muốn đổi cách /clear hoạt động cho dự án của mình. Theo bài học, điều gì đúng?', options: ['Không sửa được; built-in chạy logic cố định', 'Tạo .claude/commands/clear.md để ghi đè', 'Sửa field description của /clear trong settings', 'Thêm rule vào CLAUDE.md để định nghĩa lại /clear'], answer: 0, explain: '"These are coded right into the tool, and they run fixed logic... You can\'t edit what they do."' },
    { q: 'Với custom command dạng file markdown, từ khóa bạn gõ sau dấu slash đến từ đâu?', options: ['Dòng tiêu đề đầu tiên trong file', 'Tên file', 'Field command trong settings.json', 'Tên người tạo file'], answer: 1, explain: '"You write a markdown file, and the file name becomes the keyword you type after the slash."' },
    { q: 'Bạn muốn cả nhóm có lệnh /review giống hệt nhau sau khi pull. Lưu file ở đâu?', options: ['Trong thư mục .claude ở home của bạn', 'Trong thư mục docs/ của repo', 'Dưới .claude/ của dự án, rồi commit vào repo', 'Gửi nội dung lệnh qua chat cho từng người'], answer: 2, explain: '"Put the file under .claude in your project, and it ships with the repo, so your whole team gets it once they pull."' },
    { q: 'Bạn có một lệnh /standup chỉ mình bạn dùng nhưng cần ở mọi dự án. Chỗ đặt hợp lý nhất là gì?', options: ['.claude/commands/ của từng repo', 'Trong CLAUDE.md của mỗi dự án', 'Trong một skill không có description', 'Thư mục .claude trong home của bạn'], answer: 3, explain: '"Put it under the Claude folder in your home directory instead and it\'s personal, available across every project you work on, but only for you."' },
    { q: 'Theo bài học, điều gì quyết định ai dùng được một custom command?', options: ['Vị trí lưu file', 'Bước đăng ký trong /help', 'Một cờ bật trong settings.json', 'Field scope trong front matter'], answer: 0, explain: '"There\'s no registration step, no config to flip... The file\'s location is what sets the scope."' },
    { q: 'Vì sao commit file command của dự án vào version control lại quan trọng?', options: ['Vì Claude chỉ đọc file đã được commit', 'Để mọi người trong nhóm dùng đúng cùng một lệnh', 'Vì lệnh chưa commit sẽ bị coi là built-in', 'Để lệnh tự chuyển thành rule luôn bật'], answer: 1, explain: '"Because the project version lives in version control, checking it in is how you make sure everyone on the team is working with the exact same command."' },
    { q: 'Bạn có quy trình release 40 bước chỉ dùng vài lần mỗi tháng. Đặt nó ở đâu để tiết kiệm context nhất?', options: ['Rule trong CLAUDE.md để không bao giờ quên', 'Một rule tách riêng thành file chủ đề release', 'Một skill có description rõ ràng', 'Dán vào tin nhắn đầu tiên của mỗi phiên'], answer: 2, explain: '"You can write a long, detailed skill, and it costs you almost nothing until the moment it\'s actually needed."' },
    { q: 'Câu nào tóm tắt đúng nhất khác biệt giữa rule và skill?', options: ['Rule do model viết, skill do bạn viết', 'Rule chỉ dùng cho team, skill chỉ dùng cá nhân', 'Rule cưỡng chế cứng, skill chỉ là gợi ý', 'Rule luôn bật; skill nạp khi khớp task'], answer: 3, explain: '"A rule is always on, applied every turn. A skill loads only when its description matches the task."' },
    { q: 'Bạn muốn một skill được Claude tự chọn đúng lúc. Việc nào ĐÁNG LÀM nhất?', options: ['Viết thân skill thật dài', 'Viết một description rõ ràng, cụ thể', 'Đặt tên file khác SKILL.md cho dễ nhận', 'Lặp lại hướng dẫn skill trong CLAUDE.md'], answer: 1, explain: '"The one thing you really need is a clear description, so the model can find it."' },
    { q: 'Tình huống nào cho thấy người dùng đã hiểu NGƯỢC khác biệt rule/skill như bài học cảnh báo?', options: ['Họ gõ /apply-style mỗi lượt để rule chạy', 'Họ tách CLAUDE.md thành nhiều file chủ đề', 'Họ viết description cho từng skill', 'Họ giới hạn một rule theo thư mục src/db'], answer: 0, explain: '"People assume a rule works like a skill, something you trigger on purpose. It doesn\'t."' },
    { q: 'Lệnh /audit được tạo bằng .claude/commands/audit.md ở repo A, và bằng thư mục .claude/skills/audit/ có SKILL.md ở repo B. Khi gõ /audit, hai lệnh này chạy khác nhau thế nào?', options: ['Bản commands chỉ nạp khi phiên bắt đầu', 'Bản skills chỉ chạy khi model tự chọn, không gõ được', 'Không khác: cả hai tạo cùng /audit và chạy như nhau', 'Bản commands luôn bị bỏ qua trong bản hiện tại'], answer: 2, explain: '"A file at .claude/commands/name.md creates a command you invoke as slash name. A skill folder at .claude/skills/name with a SKILL.md inside creates the very same slash name. Both run the same way."' },
    { q: 'Câu nào đúng nhất về mối quan hệ giữa custom slash command và skill?', options: ['Custom command nạp như rule ở mọi lượt', 'Custom command chạy nhanh hơn vì không có front matter', 'Skill chỉ được model gọi, không gõ tay được', 'Custom command thực chất là skill bạn gọi bằng tên'], answer: 3, explain: '"And a custom command is really just a skill you invoke by name."' },
  ],
};
