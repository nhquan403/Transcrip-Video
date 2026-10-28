window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Một thay đổi prompt có thể <strong>lặng lẽ làm hỏng hành vi</strong> y như một thay đổi code. Vì vậy hãy coi
<strong>prompt, model ID và config là một khối được version hóa</strong>: commit trong source control, review như pull request,
chạy qua <strong>frozen eval set</strong> trước khi promote, và <strong>rollback trong vài giây</strong> khi có sự cố.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Prompt versioning:</strong> coi prompt là artifact có version, nằm trong source control, gắn với một model version cụ thể.</li>
  <li><strong>Regression eval set:</strong> bộ input kiểm thử <strong>đóng băng</strong> cùng output mong đợi; mọi version mới đều chạy qua nó.</li>
  <li><strong>anthropic-version header:</strong> header bắt buộc ghim hành vi request/response của API vào một version có ngày.</li>
  <li><strong>Regression:</strong> hành vi tệ đi so với version trước.</li>
  <li><strong>Semver:</strong> version dạng MAJOR.MINOR.PATCH mà plugin Claude Code khai báo.</li>
  <li><strong>Commit SHA fallback:</strong> khi plugin không đặt version, SHA của commit trở thành version.</li>
</ul>

<h3>Prompt là code, và prompt đi theo cặp với model</h3>
<p>Prompt trực tiếp định hình ứng dụng làm gì. Điểm mới của bài là <strong>ghép cặp</strong>: gắn mỗi version prompt với <strong>đúng model ID</strong> nó được tinh chỉnh,
vì prompt và model cư xử như một cặp. Đem câu chữ tinh chỉnh cho model này chạy trên model khác, cùng prompt có thể <strong>đổi giọng, đổi định dạng, đổi cách chọn tool</strong>.
Thứ bạn test và ship là <strong>cái cặp</strong>.</p>
<ul>
  <li>Giữ mọi system prompt trong source control, <strong>không dán tùy hứng vào console</strong>.</li>
  <li>Review sửa prompt như review pull request, có người khác nhìn diff.</li>
  <li>Prompt hay hỏng âm thầm nhất là prompt <strong>ai đó sửa trực tiếp mà không ghi lại</strong>.</li>
</ul>

<h3>Version hóa cái gì? Ba thứ đi cùng nhau</h3>
<ol>
  <li><strong>Prompt text:</strong> mọi system prompt và khối chỉ dẫn được commit thành file.</li>
  <li><strong>Model ID:</strong> đúng ID đã ghim mà prompt được tinh chỉnh, đặt ngay cạnh prompt.</li>
  <li><strong>Config:</strong> settings.json, permissions, hooks, tất cả được commit.</li>
</ol>
<p>Khi ba thứ đi thành <strong>một đơn vị</strong>, ai cũng có thể checkout một commit và có <strong>đúng hành vi</strong> mà commit đó đã ship.</p>

<h3>anthropic-version header</h3>
<p>Mỗi request đều mang header này; nó ghim hành vi request và response vào một version API có ngày. Nó <strong>bắt buộc</strong>,
nhưng SDK chính thức tự đặt giúp nên bạn hiếm khi gõ tay. Trong một version, Anthropic <strong>chỉ thêm</strong> (input tùy chọn mới, giá trị output mới, loại event mới),
không phá các trường bạn đang dựa vào. Version mới hơn có thể đổi hợp đồng, version cũ dần bị deprecate. Vì thế: <strong>ghim rõ version bạn đã build</strong>,
và coi việc lên version mới là <strong>một lần nâng cấp có chủ đích, có test</strong>.</p>

<div class="box">🍳 <strong>Hình dung thế này:</strong> Prompt là <strong>công thức nấu ăn</strong>, model là <strong>cái lò</strong>, config là <strong>bếp và dụng cụ</strong>.
Công thức chỉnh cho lò này đem sang lò khác có thể cháy khét. Nhà hàng tử tế ghi công thức vào sổ có ngày, ghi rõ lò nào, cho bếp trưởng nếm thử trước
(<strong>eval set</strong>) rồi mới đưa món lên thực đơn. Món mới dở thì <strong>lật lại trang sổ cũ</strong>, không ai phải nhớ "hôm qua mình nêm thế nào".</div>

<h3>Ad hoc và versioned</h3>
<ul>
  <li><strong>Ad hoc:</strong> ai đó sửa prompt đang chạy để vá một case khó chịu. Không ghi chép, không review; tuần sau hỏng thì <strong>không cách nào tái hiện</strong> hành vi hôm qua.</li>
  <li><strong>Versioned:</strong> cùng sửa đổi đó thành một <strong>commit đã review</strong>, gắn với model ID đã test. Lịch sử cho thấy đổi gì, khi nào, và <strong>rollback về trạng thái tốt trong vài giây</strong>.</li>
</ul>
<p>Một bên là đoán mò, một bên là thay đổi có kiểm soát và đảo ngược được.</p>

<h3>Quy tắc chống regression: không promote thẳng</h3>
<ol>
  <li>Không bao giờ đưa model mới hay prompt mới <strong>thẳng vào production</strong>.</li>
  <li>Chạy candidate trên <strong>frozen eval set</strong>, cùng input cố định mỗi lần.</li>
  <li>So output với version production hiện tại trên <strong>cùng các case đó</strong>.</li>
  <li><strong>Bằng hoặc hơn</strong> thì promote; thụt lùi dù chỉ ở vài case quan trọng thì <strong>ở lại staging</strong>.</li>
</ol>
<p>Frozen eval set biến một phỏng đoán lo lắng thành <strong>quyết định dựa trên bằng chứng</strong>.</p>

<h3>Ba cách version được theo dõi</h3>
<ul>
  <li><strong>Source control:</strong> commit của bạn là bản ghi chính; prompt, model ID, config đều trong Git, lịch sử commit chính là version log.</li>
  <li><strong>Semver trong plugin:</strong> plugin Claude Code khai báo trường version dạng major.minor.patch để người dùng ghim hoặc theo dõi có chủ đích.</li>
  <li><strong>Commit SHA fallback:</strong> plugin bỏ trống version thì SHA của commit tự thành version, nghĩa là <strong>mỗi commit là một version mới</strong>.</li>
</ul>
<p>Ba cơ chế, một mục tiêu: <strong>tái lập được (reproducibility)</strong>.</p>

<h3>Khi release làm hành vi tệ đi: rollback</h3>
<ol>
  <li><strong>Trỏ pin</strong> về model ID tốt gần nhất.</li>
  <li><strong>Khôi phục prompt</strong> khớp cặp với ID đó từ source control.</li>
  <li><strong>Xác nhận rollback</strong> bằng chính eval set đã bắt được regression.</li>
</ol>
<p>Rollback là <strong>một lần revert</strong>, không phải một cuộc chạy loạn.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Prompt, model ID và config là một đơn vị version hóa, đảo ngược được; prompt và model đi theo cặp.</li>
  <li>Test mọi version trên frozen eval set trước khi promote; bằng hoặc hơn mới lên production.</li>
  <li>Ghim anthropic-version và coi nâng version là nâng cấp có test; plugin dùng semver, bỏ trống thì SHA thành version.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">a prompt change can quietly regress behavior</em>: một thay đổi prompt có thể lặng lẽ làm hành vi thụt lùi.</li>
  <li><em class="en">traceable and reversible</em>: truy vết được và đảo ngược được.</li>
  <li><em class="en">a frozen collection of test inputs</em>: một bộ input kiểm thử đóng băng.</li>
  <li><em class="en">so the contract doesn't shift under you</em>: để hợp đồng không xê dịch dưới chân bạn.</li>
  <li><em class="en">a prompt and a model behave as a pair</em>: prompt và model cư xử như một cặp.</li>
  <li><em class="en">pasted ad hoc into a console</em>: dán tùy hứng vào console.</li>
  <li><em class="en">someone else's eyes on the diff</em>: có mắt người khác nhìn vào diff.</li>
  <li><em class="en">move as one versioned unit</em>: di chuyển như một đơn vị có version.</li>
  <li><em class="en">a deliberate tested upgrade, not a surprise</em>: một lần nâng cấp có chủ đích, có test, không phải bất ngờ.</li>
  <li><em class="en">roll back to any known good state in seconds</em>: quay về bất kỳ trạng thái tốt đã biết trong vài giây.</li>
  <li><em class="en">it stays in staging</em>: nó ở lại môi trường staging.</li>
  <li><em class="en">rolling back is a revert, not a scramble</em>: rollback là một lần revert, không phải chạy loạn.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson34/Lesson34.java</code>. Có 5 bài: tìm phần còn thiếu trong đơn vị version (prompt, model ID, config),
tính version của plugin (semver hợp lệ, hoặc commit SHA khi trường version bỏ trống), dựng header request với <code>anthropic-version</code> bắt buộc,
chạy một frozen eval set (mỗi case một lần, so sánh sau khi chuẩn hóa), và quyết định "promote" hay "stay in staging" khi so candidate với production.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-34"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-34 --live"</code>: gửi cùng một request có và không có header <code>anthropic-version</code> (HTTP 200 so với 400),
rồi chạy cùng frozen eval set cho prompt production (chỉ trả tên thủ đô) và một prompt candidate "thân thiện hơn", để code của bạn quyết định promote hay giữ ở staging.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Vì sao bài học muốn "ghim mọi thứ quanh model", không chỉ model?', options: ['Vì model ID thay đổi mỗi tuần', 'Sửa prompt cũng có thể gây regression', 'Vì config chiếm nhiều token nhất', 'Vì SDK không hỗ trợ ghim model'], answer: 1, explain: '"Now let\'s pin everything around it because a prompt change can quietly regress behavior just like a code change."' },
    { q: 'Prompt versioning theo định nghĩa của bài gồm những gì?', options: ['Đặt tên file prompt kèm ngày tháng', 'Lưu prompt trong cơ sở dữ liệu của app', 'Prompt trong source control, gắn với model version', 'Ghi chú mọi thay đổi prompt vào CLAUDE.md của dự án'], answer: 2, explain: '"Treating your prompts as versioned artifacts, tracked in source control, and tied to a specific model version so a change is reviewable, reproducible, and safe to roll back."' },
    { q: 'Regression eval set là gì?', options: ['Input cố định kèm output mong đợi', 'Log toàn bộ request production gần đây', 'Bộ prompt mẫu cho từng model', 'Bảng điểm benchmark công khai của model'], answer: 0, explain: '"A frozen collection of test inputs and the outputs you expect and you run every new version against it to catch a behavior regression before your users ever see it."' },
    { q: 'anthropic-version header dùng để làm gì?', options: ['Chọn model mặc định cho request', 'Ghi lại version của prompt đang dùng', 'Bật các tính năng beta mới nhất', 'Ghim hợp đồng API vào một version có ngày'], answer: 3, explain: '"A required request header that pins the API\'s request and response behavior to a dated version so the contract doesn\'t shift under you."' },
    { q: 'Prompt đã tinh chỉnh kỹ cho model A được chuyển sang model B mà không test. Rủi ro bài học nêu là gì?', options: ['Request bị API từ chối vì sai version', 'Prompt bị cắt ngắn do khác context window', 'Đổi giọng, định dạng hoặc cách chọn tool của model', 'Chi phí tăng gấp đôi ngay lập tức'], answer: 2, explain: '"Run wording tuned for one pinned model against a different one and the same prompt can shift tone, formatting, or tool choices so the pair is what you actually test and ship."' },
    { q: 'Theo bài, thứ bạn thực sự test và ship là gì?', options: ['Riêng prompt', 'Cặp prompt và model', 'Riêng model ID', 'Riêng file config của dự án'], answer: 1, explain: '"So the pair is what you actually test and ship."' },
    { q: 'Loại prompt nào thường bị hỏng âm thầm nhất?', options: ['Prompt bị sửa trực tiếp, không ghi lại', 'Prompt dài hơn một nghìn token', 'Prompt có nhiều ví dụ few-shot', 'Prompt viết xen kẽ nhiều ngôn ngữ khác nhau'], answer: 0, explain: '"The prompts that regress silently are almost always the ones somebody edited live with no record."' },
    { q: 'Một kỹ sư sửa system prompt trực tiếp trên console production để vá một lỗi nhỏ. Bài học khuyên làm gì thay vào đó?', options: ['Sửa nhanh rồi ghi chú vào chat nhóm', 'Đợi model mới rồi mới sửa', 'Thêm câu vá vào cuối prompt production cho an toàn hơn', 'Commit vào source control, review như PR'], answer: 3, explain: '"Keeping every system prompt in source control, not pasted ad hoc into a console, and reviewing prompt edits the way you\'d review a pull request with someone else\'s eyes on the diff."' },
    { q: 'Ba thứ cần version hóa cùng nhau theo bài là gì?', options: ['Prompt, log, dashboard', 'Prompt, model ID, config', 'Model ID, API key, region', 'Config, secrets, test data'], answer: 1, explain: '"Prompt, model ID, config. When those three move as one versioned unit, anyone can check out a commit and get exactly the behavior it shipped with."' },
    { q: 'Vì sao model ID được version hóa ngay cạnh prompt?', options: ['Để SDK tự đọc model từ file prompt', 'Để giảm số file trong repo', 'Vì hai thứ chỉ có nghĩa khi đi thành một cặp với nhau', 'Vì API yêu cầu gửi chúng cùng một trường'], answer: 2, explain: '"The exact pinned ID that prompt was tuned against, versioned right next to the prompt because the two only make sense as a pair."' },
    { q: 'Đội bạn commit prompt và model ID nhưng hooks và permissions chỉ cấu hình tay trên từng máy. Vấn đề là gì?', options: ['Không có vấn đề, config không ảnh hưởng hành vi', 'Prompt sẽ bị lỗi cú pháp khi chạy', 'Model ID sẽ không được nhận diện', 'Thiết lập hành vi không tái lập được từ repo'], answer: 3, explain: '"Third, the config. Your settings.json, your permissions, your hooks, all committed so the whole behavioral setup is reproducible from the repo."' },
    { q: 'Lợi ích khi prompt, model ID và config đi thành một đơn vị version là gì?', options: ['Checkout là có lại hành vi đã ship', 'Không cần chạy eval set nào nữa trước khi release', 'Model tự động được nâng cấp lên bản mới nhất', 'Giảm chi phí mỗi request'], answer: 0, explain: '"When those three move as one versioned unit, anyone can check out a commit and get exactly the behavior it shipped with."' },
    { q: 'Bạn dùng SDK chính thức và chưa bao giờ gõ anthropic-version. Điều gì đúng?', options: ['Request của bạn đang thiếu header', 'SDK tự đặt header này cho bạn', 'Header này chỉ cần cho streaming', 'Header là tùy chọn, có hay không như nhau'], answer: 1, explain: '"It\'s required, though in practice the official SDKs set it for you automatically so you rarely type it by hand."' },
    { q: 'Trong một version API nhất định, Anthropic có thể làm gì?', options: ['Đổi tên một trường mà bạn đang dùng hằng ngày', 'Xóa loại event cũ', 'Chỉ thêm input, output, event mới', 'Đổi kiểu dữ liệu của một trường có sẵn trong response'], answer: 2, explain: '"Within a given version, Anthropic only adds things. New optional inputs, new output values, new event types, but it won\'t break the fields you already rely on."' },
    { q: 'Cách tiếp cận đúng khi muốn chuyển lên anthropic-version mới hơn là gì?', options: ['Coi đó là nâng cấp có chủ đích và có test', 'Luôn để header ở version mới nhất để có tính năng mới', 'Bỏ header để API tự chọn', 'Đổi version ngay khi có thông báo'], answer: 0, explain: '"So pin the version you built against explicitly and treat moving to a newer one as a deliberate tested upgrade, not a surprise."' },
    { q: 'Câu nào KHÔNG đúng về anthropic-version?', options: ['Version mới hơn có thể thay đổi hợp đồng của API', 'Version cũ dần bị deprecate', 'Nên ghim rõ version mà bạn đã build và test', 'Trong một version, trường cũ bị bỏ'], answer: 3, explain: '"It won\'t break the fields you already rely on. Newer versions can change the contract and older ones eventually get deprecated."' },
    { q: 'Trong "thế giới ad hoc", điều gì xảy ra khi có sự cố tuần sau?', options: ['Rollback trong vài giây', 'Không cách nào tái hiện hành vi hôm qua', 'Eval set tự động báo lỗi', 'Git log chỉ ra chính xác người đã sửa dòng nào'], answer: 1, explain: '"There\'s no record, no review, and when something breaks next week, no way to reproduce what yesterday\'s behavior even was."' },
    { q: 'Theo bài, "phần thưởng thật sự" của thế giới versioned là gì?', options: ['Prompt ngắn hơn và rẻ hơn', 'Không còn ai sửa được prompt', 'Rollback về trạng thái tốt trong vài giây', 'Model tự học từ lịch sử commit để không lặp lỗi cũ'], answer: 2, explain: '"Because every version is captured, you can roll back to any known good state in seconds."' },
    { q: 'Có model mới và bạn muốn dùng ngay vì benchmark tốt hơn. Bước đúng tiếp theo là gì?', options: ['Đổi model trong production rồi theo dõi sát sao', 'Cho 10% người dùng dùng thử trước, chưa cần test gì', 'Đổi model và sửa prompt cùng lúc', 'Chạy candidate trên frozen eval set trước'], answer: 3, explain: '"Never promote a new model or a new prompt version straight into production. Run the candidate against your frozen eval set first, the same fixed inputs every time."' },
    { q: 'Khi so candidate với production, phải so trên cái gì?', options: ['Cùng các case trong eval set', 'Các câu hỏi mới nhất của người dùng', 'Benchmark công khai của model', 'Một bộ input ngẫu nhiên mới mỗi lần'], answer: 0, explain: '"Then compare its outputs to what the current production version produces on those same cases."' },
    { q: 'Candidate tốt hơn tổng thể nhưng trượt vài case quan trọng mà production đang đạt. Quyết định đúng?', options: ['Promote, vì tổng điểm cao hơn', 'Promote rồi vá sau', 'Ở lại staging', 'Bỏ các case đó khỏi eval set'], answer: 2, explain: '"If it regresses on even a few important cases, it stays in staging, not in front of users."' },
    { q: 'Candidate đạt đúng bằng production trên mọi case. Bài học nói gì?', options: ['Không promote vì không có cải thiện', 'Promote, vì bằng hoặc hơn là đủ', 'Phải mở rộng eval set rồi mới quyết', 'Chạy lại cho tới khi candidate hơn'], answer: 1, explain: '"Does the new version match or beat what you\'ve already got? If it does, promote it."' },
    { q: 'Vai trò của frozen eval set trong quyết định promote là gì?', options: ['Biến phỏng đoán thành quyết định có bằng chứng', 'Giúp model học các case khó', 'Thay thế hoàn toàn việc code review', 'Giảm chi phí chạy production'], answer: 0, explain: '"That frozen eval set is what turns a nervous guess about a new version into an actual evidence-based decision."' },
    { q: 'Cơ chế nào là bản ghi version CHÍNH theo bài?', options: ['Trường version khai báo trong plugin manifest', 'anthropic-version header', 'Nhật ký chỉnh sửa trên console của nhà cung cấp', 'Commit của bạn trong source control'], answer: 3, explain: '"First, plain source control. Your own commits are the primary record... so your commit history is the version log."' },
    { q: 'Plugin Claude Code khai báo version theo dạng nào để người dùng ghim có chủ đích?', options: ['Ngày phát hành', 'Semver major.minor.patch', 'Tên model mà plugin được tinh chỉnh cùng', 'Số build tăng dần mỗi lần CI chạy'], answer: 1, explain: '"A Claude Code plugin declares a version field using major, minor, patch, so anyone consuming it can pin or track it deliberately."' },
    { q: 'Một plugin bỏ trống trường version. Điều gì xảy ra?', options: ['Plugin không cài được', 'Version mặc định là 0.0.0', 'Commit SHA thành version, mỗi commit một version', 'Version lấy theo ngày commit gần nhất'], answer: 2, explain: '"When a plugin leaves its version field unset, the Git commit SHA becomes the version automatically, which means every single commit counts as a brand new version."' },
    { q: 'Ba cơ chế theo dõi version (source control, semver, SHA fallback) cùng phục vụ mục tiêu nào?', options: ['Giảm dung lượng repo', 'Tăng tốc độ phản hồi', 'Bảo mật API key', 'Khả năng tái lập'], answer: 3, explain: '"Source control, semver, and the SHA fallback. Three mechanisms. One goal, reproducibility."' },
    { q: 'Một release làm hành vi tệ đi. Bước ĐẦU TIÊN của rollback là gì?', options: ['Trỏ pin về model ID tốt gần nhất', 'Viết lại prompt từ đầu cho model mới nhất hiện có', 'Tạo eval set mới cho lỗi này', 'Tắt toàn bộ hooks'], answer: 0, explain: '"First, repoint your pin to the last known good model ID."' },
    { q: 'Sau khi trỏ lại model ID, vì sao phải khôi phục đúng prompt version khớp với nó?', options: ['Vì prompt mới luôn có lỗi cú pháp', 'Vì prompt và model ID chỉ đúng khi đi theo cặp', 'Vì API từ chối prompt mới', 'Vì config chỉ đọc prompt cũ'], answer: 1, explain: '"Second, restore the matching prompt version straight from source control, the one that pairs with that ID."' },
    { q: 'Làm sao xác nhận rollback đã thành công theo bài học?', options: ['Hỏi người dùng có còn phàn nàn không', 'Kiểm tra log lỗi production trong suốt một tuần tới', 'Chạy lại chính eval set đã bắt regression', 'So sánh độ dài câu trả lời'], answer: 2, explain: '"Third, confirm the rollback by running it against the same eval set that caught the regression in the first place."' }
  ]
};
