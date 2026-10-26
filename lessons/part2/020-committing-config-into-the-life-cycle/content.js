window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Khi cả team dùng chung một ứng dụng Claude, cấu hình của mỗi người dần lệch nhau, app cư xử hơi khác trên từng máy,
tới mức không ai tái hiện được bug. Cách chữa: đưa cấu hình vào <strong>version control</strong> ngay cạnh code. Cấu hình <strong>chung</strong> thì commit,
cấu hình <strong>cá nhân</strong> thì giữ local, ghim <strong>model ID chính xác</strong>, version prompt bằng <strong>semantic versioning</strong>,
và để <strong>CI</strong> kiểm tra trước khi merge.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Drift (trôi cấu hình):</strong> mỗi máy chạy một biến thể hơi khác mà không ai biết.</li>
  <li><strong>CLAUDE.md của dự án:</strong> chỉ dẫn dự án cho Claude, dùng chung cả team.</li>
  <li><strong>Settings của dự án:</strong> file chứa quyền, hook và model mà mọi người nên dùng.</li>
  <li><strong>Semantic versioning:</strong> version dạng MAJOR.MINOR.PATCH, mỗi số mang một nghĩa.</li>
  <li><strong>CI (continuous integration):</strong> các kiểm tra tự động chạy trước khi một thay đổi được merge.</li>
</ul>

<h3>Đường ranh: commit và không commit</h3>
<ul>
  <li><strong>Commit:</strong> CLAUDE.md của dự án và file settings của dự án. Ai clone repo cũng có cùng chỉ dẫn và cùng quyền mặc định.</li>
  <li><strong>Không commit:</strong> file settings local và <code>CLAUDE.local.md</code> cá nhân. Chúng bị ignore có chủ đích, không bao giờ chia sẻ,
  vì chứa tinh chỉnh riêng; commit chúng là đè lên cấu hình của đồng đội.</li>
</ul>
<p>Quy tắc: <strong>hành vi chung thì commit, sở thích cá nhân thì giữ local</strong>. Chia đúng thì không ai giẫm chân ai.</p>

<h3>Vì sao đáng kỷ luật?</h3>
<div class="box">🎼 <strong>Hình dung thế này:</strong> Một dàn nhạc mà mỗi người tự chỉnh dây đàn theo ý mình thì cả bản nhạc lệch tông, và không ai biết lỗi ở đâu.
Cùng lên dây theo một âm chuẩn thì ai vào chơi cũng hòa. Cấu hình trong repo là "âm chuẩn" của team.</div>
<ul>
  <li>Cả team có <strong>một Claude nhất quán</strong>, không phải nhiều bản hơi khác nhau; không ai chạy một biến thể bí mật.</li>
  <li>Người mới clone dự án là <strong>làm được việc ngay</strong>, vì hành vi đi kèm code thay vì nằm trong đầu ai đó.</li>
  <li>Hành vi <strong>tái lập được</strong>: không phụ thuộc may rủi từng máy hay ai đó tình cờ cấu hình gì.</li>
</ul>

<h3>Ba thứ lần nào cũng đưa vào repo</h3>
<ol>
  <li><strong>CLAUDE.md:</strong> chỉ dẫn dự án định hình cách Claude làm việc trong codebase, để mọi người đọc cùng một trang.</li>
  <li><strong>File settings của dự án:</strong> quyền, hook và lựa chọn model mà ai cũng nên chạy.</li>
  <li><strong>Prompt và schema:</strong> system prompt và schema tool mà app phụ thuộc, version ngay cạnh code dùng chúng.</li>
</ol>
<p>Nếu một thứ chỉ nằm trên laptop của bạn, đồng đội đang chạy <strong>một ứng dụng khác</strong> với bạn, và bạn chỉ biết khi có gì đó hỏng.</p>

<h3>Model ID: ghim chính xác</h3>
<p>Mỗi model ID là một <strong>snapshot cố định</strong>, không phải mục tiêu di động tự nâng cấp dưới chân bạn; trọng số đằng sau ID đó giữ nguyên suốt vòng đời của nó.
Ghim ID đó trong cấu hình đã commit là đảm bảo mọi lần chạy, mọi đồng đội gặp cùng một model với cùng hành vi.
Model mới ra với <strong>ID mới</strong>, không bao giờ bằng cách âm thầm đổi thứ ID cũ trỏ tới. Vì vậy commit đúng ID, không phải một con trỏ "latest" mơ hồ.</p>

<h3>Semantic versioning cho prompt và cấu hình</h3>
<ul>
  <li><strong>MAJOR</strong> (số đầu): thay đổi <strong>phá vỡ</strong> người đang dùng, không tương thích ngược.</li>
  <li><strong>MINOR</strong> (số giữa): <strong>thêm chức năng</strong> mà người đang dùng vẫn chạy được.</li>
  <li><strong>PATCH</strong> (số cuối): sửa nhỏ, tương thích ngược, không nhằm đổi hành vi.</li>
</ul>
<p>⚠️ Cái bẫy: tăng PATCH cho một thay đổi phá vỡ, vì nó âm thầm nói với mọi người "nâng cấp an toàn" trong khi không phải.</p>

<h3>Đi cùng vòng đời phát hành như mọi phần mềm</h3>
<ol>
  <li><strong>Develop</strong> thay đổi trên một branch, gồm cả cấu hình và prompt, không chỉ code.</li>
  <li><strong>Review diff</strong>: nơi bắt được thay đổi hành vi trước khi tới người dùng.</li>
  <li><strong>Test và gate</strong> thay đổi.</li>
  <li><strong>Deploy</strong> kết quả đã merge.</li>
</ol>
<p>Phần làm việc với model không nằm ở một quy trình riêng; một thay đổi prompt đi từ ý tưởng tới production qua đúng các bước kiểm tra như thay đổi code.</p>

<h3>Thay đổi được theo dõi và không được theo dõi</h3>
<ul>
  <li><strong>Được theo dõi:</strong> sửa prompt hay cấu hình nằm trong một commit: có diff, tác giả, lý do, và cách quay lại sạch sẽ nếu nó cư xử tệ.</li>
  <li><strong>Không được theo dõi:</strong> cùng thay đổi đó nằm trong cửa sổ chat hay file cá nhân chưa commit. Không ai thấy, không ai review, không ai tái hiện được.</li>
</ul>
<p>Đó chính là cách drift lẻn vào dự án: <strong>từng tinh chỉnh vô hình một</strong>.</p>

<h3>CI: lưới an toàn cho cấu hình</h3>
<ul>
  <li><strong>Kiểm tra cấu hình:</strong> parse settings và CLAUDE.md, để file hỏng bị bắt ngay chứ không phải trên production.</li>
  <li><strong>Kiểm tra schema:</strong> đối chiếu schema tool và output với đặc tả, để schema sai làm build trượt sớm.</li>
  <li><strong>Gate prompt:</strong> diff và thậm chí lint thay đổi prompt, gắn cờ sửa đổi rủi ro cho người xem trước khi merge.</li>
</ul>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>CLAUDE.md, settings, prompt, schema và model ID đã ghim đều vào Git; file cá nhân thì không.</li>
  <li>Semantic versioning: phá vỡ là MAJOR, thêm tính năng là MINOR, sửa nhỏ là PATCH.</li>
  <li>Một sửa đổi không được theo dõi là drift vô hình; CI kiểm tra cấu hình, schema và prompt trước khi merge.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">Everyone's setup drifts</em>: cấu hình của mỗi người dần lệch đi.</li>
  <li><em class="en">until nobody can reproduce a bug</em>: tới mức không ai tái hiện được bug.</li>
  <li><em class="en">get ignored on purpose</em>: bị ignore có chủ đích.</li>
  <li><em class="en">nobody steps on anybody</em>: không ai giẫm chân ai.</li>
  <li><em class="en">Committing config isn't bureaucracy</em>: commit cấu hình không phải thủ tục rườm rà.</li>
  <li><em class="en">running a secret variation</em>: chạy một biến thể bí mật.</li>
  <li><em class="en">living in someone's head</em>: chỉ nằm trong đầu ai đó.</li>
  <li><em class="en">machine-by-machine luck</em>: may rủi theo từng máy.</li>
  <li><em class="en">reads from the same page</em>: đọc cùng một trang, hiểu như nhau.</li>
  <li><em class="en">a moving target that quietly upgrades under you</em>: mục tiêu di động âm thầm nâng cấp dưới chân bạn.</li>
  <li><em class="en">the difference is night and day</em>: khác nhau một trời một vực.</li>
  <li><em class="en">one invisible tweak at a time</em>: từng tinh chỉnh vô hình một.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson20/Lesson20.java</code>. Có 4 bài: quyết định file nào commit, file nào giữ local, file nào là bí mật;
chọn mức tăng semantic version; tăng version đúng cách; và viết một bước CI kiểm tra cấu hình (JSON hỏng, CLAUDE.md rỗng, model chưa ghim, prompt còn TODO).
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-20"</code>. Bài này chỉ có bộ chấm offline.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Vấn đề mở đầu bài học là gì?', options: ['Model trả lời chậm trên một số máy', 'Cấu hình lệch dần giữa các máy', 'Git không lưu được file cấu hình', 'API key bị lộ trong repo'], answer: 1, explain: '"Everyone\'s setup drifts and the app behaves a little differently on each machine, until nobody can reproduce a bug."' },
    { q: 'File nào được commit vào Git?', options: ['settings.local.json', 'CLAUDE.local.md', 'CLAUDE.md của dự án', 'File .env có API key'], answer: 2, explain: '"On the committed side, your project CLAUDE.md and your project settings file belong in Git."' },
    { q: 'Vì sao không commit settings.local.json?', options: ['Vì sẽ đè cấu hình của đồng đội', 'Vì Git không đọc được JSON', 'Vì file quá lớn để lưu', 'Vì Claude không dùng file đó khi chạy'], answer: 0, explain: '"Those hold individual tweaks, and if you committed them, you\'d override a teammate\'s own setup."' },
    { q: 'Quy tắc ngắn gọn về commit cấu hình là gì?', options: ['Commit mọi thứ cho chắc', 'Không commit bất kỳ file cấu hình nào, kể cả CLAUDE.md', 'Chỉ commit khi có bug xảy ra', 'Hành vi chung thì commit, sở thích cá nhân giữ ở máy mình'], answer: 3, explain: '"The rule is simple, shared behavior gets committed. Personal preferences stay local."' },
    { q: 'Lợi ích của việc commit cấu hình KHÔNG phải là gì?', options: ['Một Claude nhất quán cho cả team', 'Model trả lời nhanh hơn', 'Người mới làm được việc ngay', 'Hành vi tái lập được trên mọi máy'], answer: 1, explain: 'Bài học nêu: một Claude nhất quán, người mới "productive right away", và hành vi "reproducible". Không nói gì về tốc độ model.' },
    { q: 'Vì sao người mới clone dự án làm được việc ngay?', options: ['Vì họ được cấp API key riêng', 'Vì Claude tự học dự án', 'Vì hành vi đi kèm code', 'Vì họ đọc tài liệu kỹ'], answer: 2, explain: '"A brand new teammate clones the project and is productive right away, because the behavior comes with the code instead of living in someone\'s head."' },
    { q: 'Ba thứ lần nào cũng đưa vào repo là gì?', options: ['CLAUDE.md, settings, prompt và schema', 'API key, log, cache', 'File build, ảnh chụp màn hình, ghi chú', 'node_modules, target, .env'], answer: 0, explain: '"CLAUDE.md, settings, prompts, and schemas."' },
    { q: 'File settings của dự án chứa những gì?', options: ['API key và mật khẩu', 'Lịch sử hội thoại', 'Câu trả lời mẫu của model', 'Quyền, hook, model'], answer: 3, explain: '"Second, your project settings file, which holds the permissions, the hooks, and the model choice that everyone should run with."' },
    { q: 'Một system prompt chỉ nằm trên laptop của bạn. Hậu quả?', options: ['Không sao nếu bạn nhớ cập nhật', 'Đồng đội chạy một app khác bạn', 'Prompt chạy nhanh hơn', 'Git tự đồng bộ'], answer: 1, explain: '"If any one of those lives only on your laptop, a teammate is running a different application than you are, and you won\'t find out until something breaks."' },
    { q: 'Câu nào ĐÚNG về một model ID?', options: ['Nó tự nâng cấp khi có model mới', 'Nó luôn trỏ tới bản mới nhất cùng dòng model', 'Snapshot cố định, trọng số không đổi', 'Nó thay đổi theo vùng'], answer: 2, explain: '"Each model ID is a fixed snapshot. It\'s not a moving target that quietly upgrades under you. The weights behind that exact ID stay the same."' },
    { q: 'Khi có model mới, Anthropic làm gì?', options: ['Ra với ID mới', 'Thay trọng số sau ID cũ', 'Xóa ID cũ ngay', 'Đổi tên ID cũ'], answer: 0, explain: '"When a newer model comes along, it ships under a brand new ID, never by silently swapping what your old ID points to."' },
    { q: 'Nên commit model ID dạng nào?', options: ['Một con trỏ "latest" cho luôn mới', 'Không commit, để mỗi người tự chọn', 'Tên model không có số version', 'ID chính xác'], answer: 3, explain: '"That\'s why you commit the exact identifier rather than some vague latest pointer."' },
    { q: 'Trong semantic versioning, số MAJOR tăng khi nào?', options: ['Khi sửa một lỗi chính tả nhỏ trong system prompt', 'Khi thay đổi phá vỡ người đang dùng', 'Khi thêm một ví dụ mới', 'Mỗi tuần một lần'], answer: 1, explain: '"You bump it for a breaking change, one that isn\'t backward compatible with what people were relying on before."' },
    { q: 'Thêm một trường tùy chọn vào schema output, code cũ vẫn chạy. Tăng số nào?', options: ['MAJOR', 'PATCH', 'MINOR', 'Không tăng'], answer: 2, explain: '"The middle number is the minor version. You bump it when you add new functionality that still works for existing callers."' },
    { q: 'Sửa một lỗi chính tả trong prompt, không đổi hành vi. Tăng số nào?', options: ['PATCH', 'MAJOR', 'MINOR', 'Cả ba'], answer: 0, explain: '"The last number is the patch. You bump that for a small, backward compatible fix that isn\'t supposed to change behavior at all."' },
    { q: 'Version 2.4.7, có thay đổi phá vỡ. Version mới là gì?', options: ['2.4.8', '2.5.0', '3.4.7', '3.0.0'], answer: 3, explain: 'Tăng MAJOR thì đặt lại hai số sau về 0: 2.4.7 thành 3.0.0.' },
    { q: 'Vì sao tăng PATCH cho thay đổi phá vỡ là cái bẫy?', options: ['Vì Git sẽ từ chối commit có số version sai', 'Vì nó báo sai rằng nâng cấp an toàn', 'Vì CI không chạy', 'Vì số PATCH có giới hạn'], answer: 1, explain: '"The trap to avoid is bumping patch for a breaking change, because that quietly tells everyone it\'s safe to upgrade when it isn\'t."' },
    { q: 'Thay đổi prompt đi qua những bước nào?', options: ['Sửa trực tiếp trên production', 'Một quy trình riêng cho model, tách khỏi code', 'Develop trên branch, review diff, test và gate, rồi deploy', 'Chỉ cần một người duyệt miệng'], answer: 2, explain: '"You develop a change on a branch... You review the diff... Then you test and gate the change, and once it passes, you deploy the merged result."' },
    { q: 'Bước nào là nơi bắt được thay đổi hành vi trước khi tới người dùng?', options: ['Review diff', 'Deploy', 'Viết message commit', 'Tạo tag'], answer: 0, explain: '"You review the diff, which is where behavior shifts get caught before they reach a user."' },
    { q: 'Một "thay đổi được theo dõi" có những gì?', options: ['Chỉ nội dung mới', 'Một tin nhắn mô tả thay đổi gửi trong chat của team', 'Một file trên Desktop', 'Diff, tác giả, lý do trong message, và cách quay lại sạch sẽ'], answer: 3, explain: '"There\'s a diff showing what changed, an author, a reason in the message, and a clean way to roll it back if it misbehaves."' },
    { q: 'Bạn sửa system prompt ngay trong cửa sổ chat của công cụ, không commit. Vấn đề là gì?', options: ['Không có vấn đề', 'Không ai thấy, review hay tái hiện được', 'Prompt bị công cụ tự xóa sau 24 giờ', 'Model từ chối prompt đó'], answer: 1, explain: '"Nobody else can see it, nobody can review it, and nobody can reproduce it later. That\'s exactly how drift creeps into a project."' },
    { q: 'Drift lẻn vào dự án như thế nào?', options: ['Do một commit lớn', 'Do model tự cập nhật hằng tuần mà không báo', 'Qua từng tinh chỉnh vô hình, không ai thấy, không ai review', 'Do CI chạy sai'], answer: 2, explain: '"That\'s exactly how drift creeps into a project, one invisible tweak at a time."' },
    { q: 'CI là gì?', options: ['Kiểm tra tự động', 'Một loại model', 'Một file cấu hình cá nhân', 'Một công cụ chat'], answer: 0, explain: '"Continuous integration, or CI. These are automated checks that run before a change merges."' },
    { q: 'Ba kiểm tra CI quan trọng cho cấu hình là gì?', options: ['Đếm dòng, đếm file, đếm commit', 'Đo tốc độ, đo RAM, đo CPU', 'Kiểm tra chính tả mọi file', 'Cấu hình, schema, prompt'], answer: 3, explain: '"Validate config, check schemas, gate prompts. That\'s your safety net running on every single change."' },
    { q: 'Một file settings bị lỗi cú pháp JSON. Muốn bắt được ở đâu?', options: ['Trên production', 'Ở bước CI', 'Khi người dùng phàn nàn', 'Không cần bắt'], answer: 1, explain: '"A CI step parses your settings and your CLAUDE.md, so a broken file gets caught right there instead of in production."' },
    { q: 'CI "gate" prompt bằng cách nào?', options: ['Chặn mọi thay đổi prompt', 'Tự viết lại prompt', 'Gắn cờ sửa đổi rủi ro', 'Chạy prompt trên mọi model'], answer: 2, explain: '"Automated checks can diff and even lint prompt changes, flagging risky edits for a human before the merge goes through."' },
    { q: 'CLAUDE.local.md của bạn nên được xử lý thế nào?', options: ['Giữ local, ignore', 'Commit để cả team dùng', 'Gửi qua chat cho đồng đội', 'Đặt trong prompts/'], answer: 0, explain: '"Your local settings file and a personal CLAUDE.local.md, stay out of the repo, get ignored on purpose, never team shared."' },
    { q: 'Câu nào là tổng kết đúng của bài?', options: ['Chỉ commit code, cấu hình để mỗi người tự lo', 'Commit cả file cá nhân cho đủ', 'Model ID nên là "latest"', 'Cấu hình chung vào Git, cá nhân thì không'], answer: 3, explain: '"Committing config gives your team one reproducible Claude. Project CLAUDE.md, settings, prompts, and pinned model IDs all go into Git. Personal files stay out."' },
    { q: 'Điều cần nhớ cuối bài là gì?', options: ['CI chậm nên bỏ qua', 'Sửa không theo dõi là drift', 'PATCH dùng cho mọi thay đổi', 'Model ID không quan trọng'], answer: 1, explain: '"One thing to watch, an untracked edit is invisible drift."' },
    { q: 'Vì sao ghim model ID giúp hành vi tái lập được?', options: ['Vì model rẻ hơn', 'Vì CI chạy nhanh hơn', 'Biết đúng model nào trả lời', 'Vì không cần prompt'], answer: 2, explain: '"Reproducible behavior starts with knowing precisely which model answered, and version control is where you record it."' },
  ],
};
