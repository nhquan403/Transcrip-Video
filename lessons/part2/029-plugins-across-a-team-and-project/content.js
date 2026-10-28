window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Plugin chỉ giúp cả nhóm khi bạn <strong>chọn scope có chủ đích</strong> và <strong>chia sẻ cấu hình qua version control</strong>.
Có bốn scope: <strong>user</strong> (mặc định, chỉ mình bạn, mọi project), <strong>project</strong> (ghi vào settings file của repo, cả nhóm nhận),
<strong>local</strong> (chỉ bạn, chỉ repo này) và <strong>managed</strong> (admin cài, bạn không sửa được). Và nhớ: plugin <strong>chạy với toàn quyền của bạn</strong>, nên phải tin nguồn và audit trước khi dùng.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Scope:</strong> phạm vi áp dụng của một plugin khi cài: ai nhận được nó, ở những project nào.</li>
  <li><strong>Project settings file:</strong> file cấu hình nằm trong repo, được commit cùng code; scope project ghi vào đây.</li>
  <li><strong>Managed settings:</strong> cấu hình do quản trị viên đặt tập trung và khóa lại cho cả tổ chức.</li>
  <li><strong>Marketplace:</strong> "danh mục" nơi plugin được lấy về; ngoài marketplace chính thức còn có marketplace khác.</li>
  <li><strong>enabledPlugins / extraKnownMarketplaces / pluginConfigs:</strong> ba khóa settings ghi plugin nào bật, marketplace nào được tin, và cấu hình riêng của từng plugin.</li>
  <li><strong>Reload plugins:</strong> lệnh làm phiên đang chạy cập nhật ngay sau khi bạn bật/tắt/gỡ.</li>
</ul>

<h3>Bốn scope: plugin nên áp rộng tới đâu?</h3>
<ul>
  <li><strong>User</strong> (mặc định): có ở mọi project của bạn, nhưng <strong>chỉ cho bạn</strong>.</li>
  <li><strong>Project</strong>: ghi vào settings file của project, nên <strong>mọi cộng tác viên</strong> trên repo đó đều có plugin.</li>
  <li><strong>Local</strong>: hẹp hơn: chỉ bạn, chỉ repo này. Hợp để <strong>thử nghiệm</strong> mà không ảnh hưởng việc khác.</li>
  <li><strong>Managed</strong>: scope bị khóa; admin cài qua managed settings, bạn <strong>không tự sửa hay gỡ</strong> được.</li>
</ul>

<h3>Scope project: môi trường đi theo repo</h3>
<p>Cài ở scope project thì cấu hình plugin được ghi vào settings file của project. File đó nằm trong repo và được commit ngay cạnh code.
Khi đồng đội pull, họ không chỉ nhận code mới mà còn nhận <strong>cùng marketplace đã đăng ký và cùng plugin đã cấu hình</strong>.
Không ai phải đọc tài liệu cài đặt hay cài tay. Kết quả: cả nhóm có <strong>đúng cùng năng lực</strong>, hành vi nhất quán trên toàn project.</p>

<div class="box">🎒 <strong>Hình dung thế này:</strong> Scope user giống <strong>hộp bút riêng trong cặp của bạn</strong>: bạn mang đến lớp nào cũng có, nhưng bạn cùng bàn không dùng được.
Scope project giống <strong>bộ dụng cụ để sẵn trong phòng thí nghiệm</strong>: ai vào phòng (clone repo) cũng thấy đúng bộ đó.
Scope managed là <strong>nội quy an toàn nhà trường</strong>: không học sinh nào tự gỡ được. Còn local là <strong>tờ nháp của riêng bạn cho môn này</strong>.</div>

<h3>Hai họ scope</h3>
<ul>
  <li><strong>Cá nhân: user và local.</strong> Ở lại với bạn, không bao giờ chạm source control, đồng đội không thấy gì; mỗi người tự quản lý.</li>
  <li><strong>Chia sẻ: project và managed.</strong> Tới cả nhóm nhưng theo đường rất khác: project đi qua repo (tự nguyện, <strong>nhìn thấy trong commit</strong>);
  managed do admin đặt tập trung và <strong>khóa</strong>, cá nhân không đổi được.</li>
</ul>
<p>Câu hỏi đầu tiên khi cài: <strong>cái này chỉ cho tôi hay cho mọi người?</strong></p>

<h3>Ba khóa settings đáng nhớ tên</h3>
<ul>
  <li><strong>enabledPlugins</strong>: plugin nào đang bật trong một scope, để đúng plugin kích hoạt khi project nạp.</li>
  <li><strong>extraKnownMarketplaces</strong>: các marketplace project tin ngoài marketplace chính thức, để đồng đội tới được cùng plugin không chính thức bạn đang dùng.</li>
  <li><strong>pluginConfigs</strong>: giá trị cấu hình của từng plugin, giữ tùy chọn nhất quán cho mọi người dùng chung file.</li>
</ul>
<p>Hiếm khi sửa tay, nhưng biết chúng giúp bạn hiểu <strong>thứ gì thực sự được chia sẻ</strong>.</p>

<h3>Audit trước khi tin (nhất là repo vừa clone)</h3>
<ol>
  <li>Chạy lệnh <strong>list</strong>: thấy mọi plugin đã cài và trạng thái của nó.</li>
  <li>Lọc theo <strong>enabled / disabled</strong>: plugin nào thực sự chạy, plugin nào chỉ nằm im.</li>
  <li>Xem <strong>scope</strong> của từng plugin: nó ảnh hưởng chỉ bạn hay mọi cộng tác viên.</li>
  <li>Quan trọng nhất: xem <strong>mỗi plugin được phép làm gì</strong> trước khi dựa vào nó.</li>
</ol>

<h3>Lời nghiêm túc về niềm tin</h3>
<p>Plugin chạy với <strong>toàn bộ quyền của bạn</strong>: nó làm được mọi thứ bạn làm được trên máy. Vì vậy plugin độc hại hoặc cẩu thả rất nguy hiểm.
Quy tắc: chỉ cài từ marketplace và tác giả bạn <strong>thật sự tin</strong>, và soi plugin kỹ như soi <strong>bất kỳ dependency bên thứ ba</strong> nào.
Với tổ chức, admin có thể <strong>giới hạn marketplace được phép</strong> bằng managed settings để mọi người ở trong tập nguồn đã duyệt.</p>

<h3>Dọn dẹp: có một cái bẫy</h3>
<ul>
  <li><strong>Disable</strong>: tạm dừng nhưng vẫn giữ cài đặt; hợp khi có thể cần lại.</li>
  <li><strong>Uninstall</strong>: xóa plugin và file của nó hẳn.</li>
  <li><strong>Gỡ marketplace</strong>: <strong>cũng gỡ mọi plugin đến từ nó</strong>. Xóa một danh mục không phải dọn dẹp vô hại; nó mang plugin theo.</li>
</ul>
<p>Đổi gì thì cũng chạy <strong>reload plugins</strong> sau đó, để phiên đang chạy phản ánh ngay và không còn tham chiếu hỏng tới thứ đã mất.</p>

<h3>Checklist cho nhóm</h3>
<ol>
  <li><strong>Commit cấu hình</strong>: đưa settings file của project vào source control để thiết lập plugin đi cùng code.</li>
  <li><strong>Ghi chú marketplace</strong>: nếu dùng marketplace ngoài chính thức, ghi lại để đồng đội biết plugin đến từ đâu.</li>
  <li><strong>Audit lại khi pull</strong>: mỗi lần pull, xem plugin mới hoặc được cập nhật trước khi chạy, vì chúng chạy với quyền của bạn.</li>
</ol>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Bốn scope: user (mặc định, riêng bạn), project (qua repo tới cả nhóm), local (riêng bạn, một repo), managed (admin khóa).</li>
  <li>Gỡ marketplace là gỡ luôn mọi plugin của nó; disable thì chỉ tạm dừng; xong việc thì reload plugins.</li>
  <li>Plugin chạy với toàn quyền của bạn: chỉ cài từ nguồn tin cậy, audit khi clone và mỗi lần pull.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">everyone ends up with a slightly different setup</em>: rốt cuộc mỗi người một thiết lập hơi khác nhau.</li>
  <li><em class="en">how widely should this plugin apply?</em>: plugin này nên áp dụng rộng tới đâu?</li>
  <li><em class="en">Let's zero in on the project scope</em>: hãy tập trung vào scope project.</li>
  <li><em class="en">The environment travels with the repo</em>: môi trường đi theo repo.</li>
  <li><em class="en">sharing is opt-in and visible in your commits</em>: chia sẻ là tự nguyện và thấy được trong commit.</li>
  <li><em class="en">it's worth taking stock of what's actually there</em>: đáng để kiểm kê xem thực sự có gì.</li>
  <li><em class="en">just sitting there dormant</em>: chỉ nằm im, không hoạt động.</li>
  <li><em class="en">powerful in a way that cuts both ways</em>: mạnh theo kiểu con dao hai lưỡi.</li>
  <li><em class="en">it runs with your full privileges</em>: nó chạy với toàn bộ quyền của bạn.</li>
  <li><em class="en">the same scrutiny you'd give any third-party dependency</em>: sự soi xét giống như với bất kỳ dependency bên thứ ba nào.</li>
  <li><em class="en">removing a catalog isn't a harmless cleanup</em>: gỡ một danh mục không phải dọn dẹp vô hại.</li>
  <li><em class="en">re-audit on pull</em>: kiểm tra lại mỗi khi pull.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson29/Lesson29.java</code>. Có 5 bài: chọn scope cài đặt từ nhu cầu (admin khóa, cả nhóm, chỉ repo này, hay riêng bạn),
xác định tính chất của mỗi scope (chia sẻ? commit vào repo? tự sửa được?), dựng phần settings của project với <code>enabledPlugins</code>, <code>extraKnownMarketplaces</code>, <code>pluginConfigs</code>,
tính xem disable / uninstall / gỡ marketplace thực sự gỡ những plugin nào, và liệt kê plugin mới hoặc đổi version cần audit sau khi pull.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-29"</code>.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Bạn cài một plugin mà không chỉ định scope. Nó sẽ áp dụng thế nào?', options: ['Cho cả nhóm trên repo hiện tại', 'Mọi project của bạn, chỉ bạn', 'Chỉ repo hiện tại, chỉ cho bạn', 'Cho mọi máy trong tổ chức của bạn'], answer: 1, explain: '"User is the default. The plugin becomes available across all of your own projects, but only for you."' },
    { q: 'Bạn muốn thử một plugin lạ trên đúng một repo, không ảnh hưởng các project khác và không làm phiền đồng đội. Scope nào hợp nhất?', options: ['User', 'Project', 'Local', 'Managed'], answer: 2, explain: '"Local is narrower, just you and just this one repository, which is handy for trying something without affecting your other work."' },
    { q: 'Cả nhóm cần cùng một plugin lint trên repo backend. Cách nào giúp người mới clone là có ngay, không cần tài liệu cài đặt?', options: ['Cài ở scope project rồi commit settings file', 'Mỗi người tự cài ở scope user trên máy mình', 'Gửi link marketplace qua chat nhóm', 'Cài ở scope local trên máy trưởng nhóm'], answer: 0, explain: '"When a teammate pulls the latest changes, they don\'t just get your code updates, they also get the same registered marketplaces and the same plugins already configured."' },
    { q: 'Một plugin được cài qua managed settings. Bạn muốn gỡ nó trên máy mình. Điều gì xảy ra?', options: ['Gỡ được bằng lệnh uninstall thông thường', 'Gỡ được nếu chuyển nó sang scope local', 'Gỡ được nếu gỡ marketplace chứa nó', 'Không gỡ hay sửa được, nó do admin khóa'], answer: 3, explain: '"Administrators install these through managed settings, and you can\'t modify or remove them yourself."' },
    { q: 'Bốn scope cài đặt plugin thực chất trả lời câu hỏi nào?', options: ['Plugin nào chạy nhanh nhất trên máy tôi?', 'Plugin này nên áp dụng rộng tới đâu?', 'Plugin lấy từ marketplace nào?', 'Plugin được phép dùng tool nào?'], answer: 1, explain: '"So the four scopes really answer one question, how widely should this plugin apply?"' },
    { q: 'Khi cài ở scope project, cấu hình plugin được ghi vào đâu?', options: ['Thư mục cấu hình cá nhân trong home của bạn', 'Biến môi trường trong shell của từng người', 'Settings file của project, nằm trong repo', 'Managed settings do admin của tổ chức giữ'], answer: 2, explain: '"When you install a plugin at project scope, the plugin settings get written into the project\'s settings file. That file lives in the repository."' },
    { q: 'Nhóm scope nào KHÔNG bao giờ chạm vào source control?', options: ['User và local', 'Project và managed', 'Project và local', 'User và managed'], answer: 0, explain: '"You have the personal scopes, user and local. These stay with you. They never touch source control, so your teammates see nothing."' },
    { q: 'Project và managed đều tới cả nhóm. Điểm khác nhau cốt lõi giữa chúng là gì?', options: ['Project chỉ dùng được các marketplace chính thức', 'Managed đi qua repo, project do admin đặt', 'Cả hai đều do admin quản lý tập trung', 'Project qua repo; managed do admin đặt, khóa lại'], answer: 3, explain: '"Project travels through the repository, so sharing is opt-in and visible in your commits. Managed is set centrally by administrators and locked."' },
    { q: 'Câu hỏi đầu tiên nên tự hỏi khi quyết định cài plugin ở đâu là gì?', options: ['Plugin này có miễn phí không?', 'Cái này chỉ cho tôi hay cho mọi người?', 'Plugin này có bao nhiêu sao?', 'Plugin này được viết bằng ngôn ngữ lập trình nào?'], answer: 1, explain: '"When you\'re deciding where to install something, this is the first question. Is this just for me or for everyone?"' },
    { q: 'Đồng đội clone repo nhưng không tải được plugin nội bộ bạn dùng, vì nó nằm ở marketplace riêng của công ty. Khóa settings nào giải quyết việc này?', options: ['enabledPlugins', 'pluginConfigs', 'extraKnownMarketplaces', 'permissions.allow'], answer: 2, explain: '"Extra known marketplaces... lists the marketplaces a project trusts beyond the official one, which is how a teammate can reach the same non-official plugins you\'re using."' },
    { q: 'Hai người dùng cùng plugin formatter nhưng mỗi người một độ rộng dòng khác nhau. Khóa nào giữ tùy chọn này nhất quán qua settings file chung?', options: ['pluginConfigs', 'enabledPlugins', 'extraKnownMarketplaces', 'Không khóa nào, phải sửa tay từng máy'], answer: 0, explain: '"The third is plugin configs, which holds the per-plugin configuration values, keeping each plugin\'s options consistent for everyone who shares the file."' },
    { q: 'Khóa enabledPlugins dùng để làm gì?', options: ['Liệt kê marketplace được tin ngoài bản chính thức', 'Lưu giá trị cấu hình riêng của từng plugin', 'Chặn plugin không được admin duyệt', 'Ghi plugin nào bật trong một scope'], answer: 3, explain: '"The first is enabled plugins. It records which plugins are turned on in a given scope, so the right ones activate when the project loads."' },
    { q: 'Bạn vừa clone một repo có sẵn cấu hình plugin. Bước audit đầu tiên theo bài là gì?', options: ['Bật hết mọi plugin để xem chúng làm gì', 'Chạy lệnh list xem plugin đã cài và trạng thái', 'Gỡ mọi marketplace lạ trước cho chắc ăn và an toàn', 'Chuyển mọi plugin sang scope user cho chắc chắn'], answer: 1, explain: '"Start with the list command. It shows you every plugin installed and the state each one is in."' },
    { q: 'Trong các bước audit, bước nào được bài gọi là quan trọng nhất?', options: ['Đếm tổng số plugin đã cài trên máy', 'Lọc plugin theo enabled hoặc disabled', 'Xem mỗi plugin được phép làm gì', 'Xem plugin được cập nhật lần cuối khi nào'], answer: 2, explain: '"And finally, and this is the important one, review what each plugin is actually permitted to do before you rely on it."' },
    { q: 'Vì sao nên kiểm tra scope của từng plugin khi audit?', options: ['Vì nó cho biết plugin ảnh hưởng tới ai', 'Vì scope quyết định plugin chạy nhanh hay chậm', 'Vì scope quyết định giá của plugin', 'Vì plugin scope user không bao giờ chạy được'], answer: 0, explain: '"Then check each plugin\'s scope, because that tells you who it affects, just you or every collaborator."' },
    { q: 'Vì sao một plugin độc hại hoặc cẩu thả lại nguy hiểm?', options: ['Vì nó luôn gửi code của bạn ra ngoài', 'Vì nó làm hỏng CLAUDE.md của dự án', 'Vì nó chỉ chạy được trong sandbox giới hạn', 'Vì nó chạy với toàn bộ quyền của bạn'], answer: 3, explain: '"When a plugin runs, it runs with your full privileges. That means a plugin can do anything you can do on your machine, which is exactly why a malicious or careless one is dangerous."' },
    { q: 'Thái độ đúng khi đánh giá một plugin mới là gì?', options: ['Tin ngay nếu nó nằm trong một marketplace bất kỳ', 'Soi kỹ như với mọi dependency bên thứ ba', 'Chỉ cần đọc tên và mô tả là đủ', 'Cài ở scope local thì không cần soi'], answer: 1, explain: '"Install only from marketplaces and authors you actually trust, and give a plugin the same scrutiny you\'d give any third-party dependency you pull into a project."' },
    { q: 'Công ty muốn mọi lập trình viên chỉ được cài plugin từ một tập nguồn đã duyệt. Cơ chế nào phù hợp?', options: ['Ghi chú trong README của từng repo', 'Nhắc mọi người qua email hàng tháng về danh sách nguồn', 'Dùng managed settings giới hạn marketplace được phép', 'Mỗi người tự đặt extraKnownMarketplaces rỗng'], answer: 2, explain: '"Administrators can restrict which marketplaces are allowed at all using managed settings, so the whole organization stays inside an approved set of sources."' },
    { q: 'Bạn tạm không cần một plugin nhưng có thể dùng lại tuần sau. Hành động nào phù hợp nhất?', options: ['Disable plugin đó', 'Uninstall plugin đó', 'Gỡ marketplace của nó', 'Xóa settings file của project'], answer: 0, explain: '"Disabling a plugin pauses it while keeping it installed, which is perfect when you might want it back."' },
    { q: 'Một đồng nghiệp gỡ một marketplace "cho gọn" vì nghĩ chỉ là dọn danh mục. Hậu quả thực tế là gì?', options: ['Không có gì, plugin đã cài vẫn giữ nguyên', 'Các plugin chỉ bị disable tạm thời', 'Chỉ plugin chưa bật mới bị xóa đi', 'Mọi plugin đến từ marketplace đó bị gỡ'], answer: 3, explain: '"If you remove a marketplace, that also uninstalls every plugin that came from it. So removing a catalog isn\'t a harmless cleanup, it takes its plugins with it."' },
    { q: 'Sau khi bật, tắt hoặc gỡ plugin, nên làm gì để tránh tham chiếu hỏng trong phiên đang chạy?', options: ['Khởi động lại máy', 'Chạy reload plugins', 'Xóa thư mục cache thủ công', 'Chờ phiên sau tự cập nhật'], answer: 1, explain: '"Whichever change you make, run reload plugins afterward, so the running session reflects it right away, and you don\'t end up with broken references."' },
    { q: 'Câu nào phân biệt đúng uninstall và disable?', options: ['Cả hai đều giữ file plugin trên máy', 'Disable xóa file, uninstall chỉ tạm dừng', 'Uninstall xóa hẳn, disable chỉ dừng', 'Cả hai đều gỡ luôn marketplace nguồn'], answer: 2, explain: '"Disabling a plugin pauses it while keeping it installed... Uninstalling deletes the plugin and its files for good."' },
    { q: 'Mục đầu tiên trong checklist nhóm là gì?', options: ['Commit settings file của project', 'Ghi chú marketplace ngoài bản chính thức', 'Audit lại plugin mỗi lần pull', 'Chuyển mọi plugin sang scope managed'], answer: 0, explain: '"First, commit the config. Put the project\'s settings file into source control, so your plugin setup ships right along with the code."' },
    { q: 'Project của bạn dựa vào một marketplace ngoài bản chính thức. Checklist khuyên làm gì thêm?', options: ['Đổi tên marketplace cho dễ nhớ', 'Cài plugin của nó ở scope managed', 'Không cần làm gì thêm, settings file đã chứa đủ mọi thứ', 'Ghi chú lại để đồng đội biết plugin đến từ đâu'], answer: 3, explain: '"Second, document the marketplace. If your project relies on any marketplace beyond the official one, make a note of it so teammates understand where the plugins are coming from."' },
    { q: 'Vì sao checklist yêu cầu xem lại plugin mới hoặc được cập nhật mỗi lần pull?', options: ['Vì plugin cũ tự hết hạn sau mỗi lần pull', 'Vì chúng thực thi với quyền của bạn', 'Vì pull làm reset scope của plugin', 'Vì pull luôn gỡ các marketplace cũ đã đăng ký'], answer: 1, explain: '"Every time you pull new changes, take a moment to review any new or updated plugins before you run them, because remember, they execute with your privileges."' },
    { q: 'Câu nào sau đây là SAI về scope project?', options: ['Nó được ghi vào settings file của project', 'Nó đi qua repo và thấy được trong commit', 'Đồng đội không thấy gì vì nó ở lại máy bạn', 'Đồng đội pull về là có cùng plugin'], answer: 2, explain: 'Sai vì "đồng đội không thấy gì" là đặc điểm của scope cá nhân: "Personal scopes stay with you, while project scope travels through source control to everyone."' },
    { q: 'Nhóm của bạn mỗi người một bộ plugin hơi khác nhau, kết quả review code lệch nhau. Gốc rễ mà bài học chỉ ra là gì?', options: ['Plugin không được scope và chia sẻ có chủ đích', 'Model trả lời ngẫu nhiên khác nhau giữa các máy trong nhóm', 'Marketplace chính thức bị lỗi', 'Mọi người dùng quá nhiều plugin'], answer: 0, explain: '"Plugins give a team shared capabilities, but only if you scope and share them deliberately." Không làm vậy thì "everyone ends up with a slightly different setup."' },
    { q: 'Câu nào mô tả đúng nhất việc sửa tay ba khóa enabledPlugins, extraKnownMarketplaces, pluginConfigs?', options: ['Phải sửa tay mỗi khi cài plugin', 'Sửa tay là cách duy nhất để chia sẻ plugin', 'Chỉ admin mới đọc được các khóa này', 'Hiếm sửa tay, nhưng nên biết chúng chia sẻ gì'], answer: 3, explain: '"You rarely edit these by hand, but knowing they exist helps you understand what\'s actually being shared."' },
    { q: 'Một plugin đang ở trạng thái disabled trong danh sách. Theo bài, cách hiểu đúng là gì?', options: ['Nó đã bị gỡ khỏi máy', 'Nó vẫn được cài nhưng đang nằm im', 'Nó bị admin khóa vĩnh viễn trên máy này', 'Nó đang chạy ngầm với quyền hạn chế'], answer: 1, explain: '"Filter by enabled or disabled, so you can see at a glance which plugins are actually active versus just sitting there dormant."' },
    { q: 'Bạn thích một plugin ghi chú cá nhân và muốn có nó trong mọi repo mình mở, nhưng không áp lên đồng đội. Lựa chọn nào đúng?', options: ['Scope project ở từng repo', 'Scope managed', 'Scope user', 'Scope local ở từng repo'], answer: 2, explain: '"User is the default. The plugin becomes available across all of your own projects, but only for you."' }
  ]
};
