window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Chia sẻ plugin trong nhóm dễ dính bệnh <strong>"máy tôi chạy được mà"</strong>. Cách chữa:
<strong>đơn vị chia sẻ không phải plugin, mà là plugin cộng các phụ thuộc đã resolve của nó</strong>. Commit khai báo phụ thuộc, project settings ghi plugin đã bật,
và dùng <strong>git tag</strong> để resolve tái lập được. Khi hỏng, <strong>đọc mã lỗi trước rồi mới hành động</strong>.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Reproducible (tái lập được):</strong> ai clone repo cũng resolve ra đúng cùng một bộ plugin chạy được.</li>
  <li><strong>Git tag:</strong> nhãn phiên bản trên repo marketplace, mẫu <code>tên-plugin--vPHIÊN-BẢN</code> (ví dụ <code>deploy--v2.1.0</code>).</li>
  <li><strong>plugin tag --push:</strong> lệnh tác giả chạy để tạo và đẩy tag phát hành.</li>
  <li><strong>plugin list --json:</strong> liệt kê plugin; mã lỗi nằm trong <strong>trường errors</strong>.</li>
  <li><strong>Cross-marketplace dependency:</strong> plugin phụ thuộc thứ nằm ở <strong>catalog khác</strong>.</li>
  <li><strong>Allow list:</strong> trường trong marketplace file của marketplace gốc, liệt kê catalog khác được phép.</li>
  <li><strong>Supply chain risk:</strong> rủi ro chuỗi cung ứng, khi kéo code từ nguồn bạn chưa tin.</li>
</ul>

<h3>Tư duy đúng: plugin là "đỉnh của một đồ thị"</h3>
<p>Dễ nghĩ plugin là một chiếc hộp khép kín, thả vào là chạy. Với plugin có phụ thuộc, <strong>sai</strong>. Nó cần các plugin khác
<strong>có mặt, được bật, và ở phiên bản tương thích</strong>. Trên máy bạn, resolve âm thầm gom đủ nên trông như khép kín.
Đưa plugin cho đồng đội mà không chia sẻ thứ nó phụ thuộc, tính năng hỏng ở máy họ.</p>
<div class="box">🍲 <strong>Hình dung thế này:</strong> plugin giống một <strong>món ăn</strong>, phụ thuộc là <strong>nguyên liệu</strong>. Ở bếp nhà bạn tủ lạnh có sẵn mọi thứ nên món "tự nhiên" ngon.
Gửi công thức cho bạn bè mà không ghi danh sách nguyên liệu kèm đúng loại (phiên bản) thì món của họ hỏng. Chia sẻ <strong>công thức + danh sách nguyên liệu</strong>, đừng chỉ chia sẻ tên món.</div>

<h3>Range tìm ra bản thật nhờ git tag</h3>
<ul>
  <li>Pin một phụ thuộc vào range thì Claude Code resolve nó dựa trên <strong>tag trong repo marketplace</strong>, theo mẫu: tên plugin, <strong>hai gạch ngang</strong>, chữ <strong>v</strong>, rồi phiên bản.</li>
  <li>Tác giả plugin tạo các tag này bằng <strong>plugin tag</strong> kèm <strong>push</strong>.</li>
  <li>Resolve duyệt các tag, tìm <strong>tag cao nhất thỏa range</strong> và tải nó.</li>
  <li><strong>Không tag nào khớp</strong>: plugin phụ thuộc bị <strong>tắt</strong> với lỗi <strong>no matching tag</strong>, thay vì đoán đại một bản.</li>
</ul>
<p>Chính cơ chế dựa trên tag này làm cho việc resolve <strong>tái lập được cho mọi người pull repo</strong>.</p>

<h3>Đồng bộ nhóm bằng version control</h3>
<ul>
  <li><strong>Manifest của plugin</strong> mang mảng dependencies; <strong>marketplace file</strong> mang cấu hình riêng của nó. Commit hai file này.</li>
  <li>Plugin đã bật được ghi trong <strong>project settings</strong> mà bạn cũng commit.</li>
  <li>Vậy là môi trường dùng chung <strong>đi theo repository</strong>: clone hay pull là có đúng cùng khai báo.</li>
</ul>
<p>Nguyên tắc y như cấu hình ứng dụng: <strong>hành vi phụ thuộc vào nó thì nó thuộc về version control</strong>, không nằm trong đầu ai đó hay một file cục bộ riêng tư.</p>

<h3>Bốn mã lỗi, bốn tầng hỏng</h3>
<ul>
  <li><strong>dependency unsatisfied:</strong> phụ thuộc bắt buộc <strong>bị thiếu hoặc bị tắt</strong>. Sửa: cài hoặc bật nó.</li>
  <li><strong>dependency version unsatisfied:</strong> đã cài nhưng phiên bản <strong>nằm ngoài range</strong>. Sửa: chỉnh range hoặc nâng bản phát hành.</li>
  <li><strong>no matching tag:</strong> không tag đã phát hành nào thỏa range, thường vì tác giả <strong>chưa push tag</strong>. Sửa: tác giả push tag.</li>
  <li><strong>range conflict:</strong> hai plugin đòi những phiên bản <strong>không hòa giải được</strong>.</li>
</ul>
<p>Đọc chúng từ <strong>plugin list --json</strong>, trong <strong>trường errors</strong>. Khi đồng đội báo "plugin hỏng", đừng <strong>cài lại mù quáng</strong>:
đọc mã lỗi, biết ngay tầng nào hỏng, sửa có mục tiêu thay vì thử-và-sai. Thói quen cần có: <strong>đọc mã lỗi trước, rồi mới hành động</strong>.</p>

<h3>Ranh giới marketplace</h3>
<ul>
  <li>Plugin và phụ thuộc <strong>cùng marketplace</strong>: resolve chạy bình thường.</li>
  <li>Phụ thuộc <strong>khác marketplace</strong>: <strong>bị chặn mặc định</strong>. Phải cho phép rõ ràng: marketplace gốc liệt kê catalog đích trong <strong>allow list</strong> của marketplace file.
    Không có thì cài thất bại với lỗi cross-marketplace.</li>
  <li><strong>Tin cậy không nối chuỗi:</strong> cho phép một marketplace không âm thầm mở rộng sang những marketplace mà nó tham chiếu.</li>
  <li>Lý do: <strong>bảo mật</strong>. Với tay vào catalog chưa liệt kê là rủi ro chuỗi cung ứng, nên mặc định là "không", và bạn opt in có chủ đích.</li>
</ul>

<h3>Vài hành vi nhỏ khi plugin thay đổi liên tục</h3>
<ul>
  <li><strong>default enabled:</strong> phụ thuộc kéo vào để phục vụ plugin đang bật được ghi là <strong>enabled true</strong>, kể cả khi manifest của nó đặt default enabled là false.</li>
  <li><strong>prune:</strong> plugin bị gỡ dần thì phụ thuộc tự cài thành orphan; prune dọn những cái không còn ai trỏ tới.</li>
  <li><strong>allow list:</strong> là chỗ bạn sửa khi một phụ thuộc chéo catalog <strong>hợp lệ</strong> cần được cho phép.</li>
</ul>

<h3>Quản lý phụ thuộc là bảo trì liên tục</h3>
<ul>
  <li><strong>Thêm plugin:</strong> commit khai báo phụ thuộc của nó.</li>
  <li><strong>Nâng phiên bản:</strong> cập nhật range và <strong>tag lại</strong>.</li>
  <li><strong>Bỏ plugin:</strong> prune orphan nó để lại và <strong>commit cả phần dọn dẹp</strong>.</li>
</ul>
<p>Bỏ qua thì <strong>khoảng hở giữa "đã khai báo" và "đã cài"</strong> chính là chỗ lần cài hỏng tiếp theo ẩn nấp.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Đơn vị chia sẻ là plugin + phụ thuộc đã resolve; commit manifest, marketplace file, project settings và tag phiên bản để clone mới resolve ra cùng bộ.</li>
  <li>Range resolve qua tag <code>tên--vX.Y.Z</code>; không tag khớp thì plugin bị tắt với no matching tag. Đọc mã lỗi trong errors của plugin list --json trước khi sửa.</li>
  <li>Phụ thuộc chéo marketplace bị chặn tới khi vào allow list, và tin cậy không nối chuỗi; giữ manifest luôn "sống" bằng commit sau mỗi lần thêm, nâng, bỏ.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">the it-works-on-my-machine problem</em>: vấn đề "máy tôi chạy được mà".</li>
  <li><em class="en">a self-contained box you drop in</em>: một chiếc hộp khép kín cứ thả vào là chạy.</li>
  <li><em class="en">A plugin is really the tip of a graph</em>: plugin thật ra là đỉnh của một đồ thị.</li>
  <li><em class="en">The plugin isn't the unit of sharing</em>: plugin không phải là đơn vị chia sẻ.</li>
  <li><em class="en">rather than guessing at a version</em>: thay vì đoán đại một phiên bản.</li>
  <li><em class="en">the shared environment travels with the repository</em>: môi trường dùng chung đi theo repository.</li>
  <li><em class="en">turns guesswork into diagnosis</em>: biến việc đoán mò thành chẩn đoán.</li>
  <li><em class="en">Instead of reinstalling blindly</em>: thay vì cài lại một cách mù quáng.</li>
  <li><em class="en">trust doesn't chain</em>: tin cậy không nối chuỗi.</li>
  <li><em class="en">you opt in deliberately</em>: bạn chủ động chọn bật có cân nhắc.</li>
  <li><em class="en">rotting into stale mystery state</em>: mục nát thành một trạng thái cũ kỹ khó hiểu.</li>
  <li><em class="en">where the next broken install hides</em>: chỗ lần cài hỏng tiếp theo ẩn nấp.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson36/Lesson36.java</code>. Có 5 bài: resolve một range từ danh sách git tag của repo marketplace
(chỉ nhận tag đúng mẫu <code>plugin--vX.Y.Z</code> của đúng plugin, trả null khi no matching tag), quyết định file nào phải commit để nhóm đồng bộ,
chẩn đoán mã lỗi của một phụ thuộc (thiếu/tắt hay sai phiên bản), ánh xạ mỗi mã lỗi sang cách sửa đúng chỗ,
và kiểm tra phụ thuộc chéo marketplace có được allow list cho phép không (tin cậy không nối chuỗi).
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-36"</code>.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Plugin chạy tốt trên máy bạn nhưng hỏng trên máy đồng đội, dù bạn đã gửi đúng plugin đó. Nguyên nhân gốc theo bài học?', options: ['Đồng đội dùng model Claude khác với model của bạn', 'Plugin bị hỏng khi tải về', 'Thiếu các phụ thuộc của plugin', 'Máy đồng đội thiếu bộ nhớ để nạp plugin'], answer: 2, explain: '"But hand the same plugin to a teammate without sharing what it depends on, and the features break for them."' },
    { q: 'Theo bài học, đơn vị đúng để chia sẻ trong nhóm là gì?', options: ['Plugin cộng các phụ thuộc đã resolve', 'Riêng file manifest của plugin', 'Một bản sao thư mục cache của bạn', 'Riêng plugin chính'], answer: 0, explain: '"The plugin isn\'t the unit of sharing. The plugin plus its resolved dependencies is."' },
    { q: 'Vì sao trên máy bạn plugin có phụ thuộc trông như một chiếc hộp khép kín?', options: ['Vì phụ thuộc được nhúng vào plugin', 'Vì resolve âm thầm gom đủ phụ thuộc', 'Vì Claude Code bỏ qua phụ thuộc cục bộ', 'Vì manifest không có mảng dependencies'], answer: 1, explain: '"When you install it on your own machine, resolution quietly pulls all of that together, so it looks self-contained."' },
    { q: 'Một plugin có phụ thuộc cần điều gì để chạy, theo bài học?', options: ['Chỉ cần phụ thuộc có mặt trên đĩa', 'Phụ thuộc có mặt và cùng marketplace', 'Có mặt, được bật, đúng phiên bản', 'Phụ thuộc được cài ở user scope'], answer: 2, explain: '"It needs other plugins present, enabled, and at compatible versions."' },
    { q: 'Plugin deploy phát hành bản 2.1.0. Tag đúng mẫu để Claude Code resolve là gì?', options: ['release/deploy-v2.1.0', 'deploy--v2.1.0', 'deploy@2.1.0', 'deploy-2.1.0'], answer: 1, explain: '"...named in a specific pattern, the plugin name, two dashes, a V, then the version."' },
    { q: 'Ai tạo các tag phát hành, và bằng cách nào?', options: ['Tác giả plugin, bằng plugin tag kèm push', 'Claude Code tự tạo khi cài', 'Người dùng cuối, bằng git tag tay', 'Marketplace tự sinh mỗi đêm'], answer: 0, explain: '"The plugin author publishes those tags by running plugin tag with push."' },
    { q: 'Range ^2.0, repo có tag deploy--v2.0.0, deploy--v2.4.1, deploy--v3.0.0. Resolve lấy gì?', options: ['2.0.0', '3.0.0', '2.4.1', 'Báo no matching tag'], answer: 2, explain: '"Resolution then walks the tags, finds the highest one satisfying your range, and fetches it."' },
    { q: 'Range của một phụ thuộc không khớp tag nào trong repo marketplace. Claude Code làm gì?', options: ['Lấy tag mới nhất có sẵn', 'Lấy nhánh main hiện tại', 'Hỏi người dùng chọn một phiên bản gần nhất', 'Tắt plugin, báo no matching tag'], answer: 3, explain: '"And if no tag matches, the dependent plugin is disabled with a no matching tag error, rather than guessing at a version."' },
    { q: 'Điều gì làm việc resolve tái lập được cho mọi người pull repo?', options: ['Cơ chế resolve dựa trên git tag', 'Cache cục bộ trên từng máy', 'Luôn lấy nhánh main mới nhất', 'Dùng tên trần cho mọi phụ thuộc'], answer: 0, explain: '"That tag-based scheme is exactly what makes a resolve reproducible for everyone who pulls the repo."' },
    { q: 'Để đồng đội clone repo là có đúng cùng khai báo phụ thuộc, bạn commit gì?', options: ['Thư mục plugin đã tải về', 'Manifest plugin và marketplace file', 'File settings.local.json của bạn', 'Lịch sử chat với Claude'], answer: 1, explain: '"The plugin manifest carries its dependencies array, and the marketplace file carries its own settings. Commit those..."' },
    { q: 'Danh sách plugin đã bật của nhóm nên được ghi ở đâu?', options: ['Trong đầu trưởng nhóm', 'Trong file local riêng của mỗi người', 'Trong project settings đã commit', 'Trong biến môi trường CI'], answer: 2, explain: '"Enabled plugins are recorded in project settings that you commit to. So the shared environment travels with the repository."' },
    { q: 'Nguyên tắc nào quyết định thứ gì phải vào version control?', options: ['Chỉ commit code, cấu hình để mỗi người tự giữ trên máy', 'Commit mọi file trên máy cho chắc', 'Chỉ commit khi có lỗi', 'Hành vi dựa vào nó thì commit nó'], answer: 3, explain: '"If behavior depends on it, it belongs in version control, not in someone\'s head or a private local file."' },
    { q: 'Mã lỗi nào báo phụ thuộc bắt buộc bị thiếu HOẶC đang bị tắt?', options: ['dependency unsatisfied', 'dependency version unsatisfied', 'no matching tag', 'range conflict'], answer: 0, explain: '"Dependency unsatisfied means a required dependency is missing or disabled."' },
    { q: 'Phụ thuộc đã cài và đang bật, nhưng bản 3.0.0 nằm ngoài range ^2.0 đã khai báo. Mã lỗi nào?', options: ['dependency unsatisfied', 'dependency version unsatisfied', 'range conflict', 'no matching tag'], answer: 1, explain: '"Dependency version unsatisfied means it\'s installed, but the version sits outside the declared range."' },
    { q: 'Lỗi no matching tag thường có nguyên nhân nào nhất?', options: ['Hai plugin đòi range khác nhau', 'Phụ thuộc bị người dùng tắt', 'Tác giả chưa bao giờ push tag', 'Marketplace bị chặn'], answer: 2, explain: '"No matching tag means no published tag satisfies the range at all, often because the author never pushed one."' },
    { q: 'Hai plugin yêu cầu cùng một phụ thuộc với phiên bản không thể hòa giải. Mã lỗi là gì?', options: ['no matching tag', 'dependency version unsatisfied', 'cross-marketplace', 'range conflict'], answer: 3, explain: '"And range conflict means two plugins asked for versions that can\'t be reconciled."' },
    { q: 'Bạn đọc các mã lỗi phụ thuộc ở đâu?', options: ['Trường errors của plugin list --json', 'Log của git push', 'Trong CLAUDE.md', 'Trường warnings của marketplace file'], answer: 0, explain: '"You read these straight from plugin list with the JSON flag under an errors field."' },
    { q: 'Đồng đội báo "plugin hỏng rồi". Bước đầu tiên tốt nhất?', options: ['Gỡ plugin ra rồi cài lại ngay từ đầu', 'Đọc errors của plugin list --json', 'Xóa toàn bộ plugin rồi cài lại', 'Nâng mọi range lên >=0.0'], answer: 1, explain: '"Instead of reinstalling blindly, you run plugin list with the JSON flag and read the errors field."' },
    { q: 'Trường errors báo dependency unsatisfied. Cách sửa đúng chỗ?', options: ['Đẩy thêm một tag mới', 'Nới range của phụ thuộc', 'Thêm marketplace vào allow list', 'Cài hoặc bật phụ thuộc đó'], answer: 3, explain: '"Missing means install or enable it."' },
    { q: 'Trường errors báo dependency version unsatisfied. Cách sửa phù hợp?', options: ['Bật phụ thuộc lên', 'Chỉnh range hoặc nâng bản phát hành', 'Chạy plugin prune', 'Thêm vào allow list'], answer: 1, explain: '"Wrong version means adjust the range or bump the release."' },
    { q: 'Plugin ở marketplace team phụ thuộc một plugin ở marketplace community, chưa cấu hình gì thêm. Cài sẽ ra sao?', options: ['Chạy bình thường như cùng marketplace', 'Cài nhưng tự tắt phụ thuộc', 'Thất bại với lỗi cross-marketplace', 'Hỏi người dùng có tin community không'], answer: 2, explain: '"But a cross-marketplace dependency... is blocked by default... Without that, the install fails with a cross-marketplace error."' },
    { q: 'Để cho phép một phụ thuộc chéo catalog hợp lệ, bạn sửa gì?', options: ['Allow list của marketplace gốc', 'Trường marketplace trong manifest của plugin phụ thuộc', 'settings.local.json của từng người', 'Tag của plugin phụ thuộc'], answer: 0, explain: '"The root marketplace lists the target in an allow list field in its marketplace file."' },
    { q: 'Marketplace A allow list B; B allow list C. Plugin ở A phụ thuộc thứ ở C. Kết quả?', options: ['Được phép, vì tin cậy truyền qua B', 'Được phép nếu C cùng tác giả', 'Bị chặn, vì tin cậy không nối chuỗi', 'Được phép nếu dùng tên trần'], answer: 2, explain: '"And trust doesn\'t chain, so listing one marketplace doesn\'t quietly extend to others it references."' },
    { q: 'Lý do phụ thuộc chéo marketplace bị chặn mặc định là gì?', options: ['Giảm băng thông tải', 'Tránh trùng tên plugin giữa các catalog khác nhau', 'Tăng tốc resolve', 'Rủi ro supply chain'], answer: 3, explain: '"The reasoning is security. Reaching into an unlisted catalog is a supply chain risk. So the default is no, and you opt in deliberately."' },
    { q: 'Phụ thuộc có default enabled false được kéo vào để phục vụ một plugin đang bật. Nó được ghi thế nào?', options: ['enabled false, vì manifest của chính nó quyết định', 'enabled true', 'Không ghi gì, chờ người dùng bật', 'enabled true chỉ ở user scope'], answer: 1, explain: '"A dependency pulled in to satisfy an active plugin is written as enabled true, even when its own manifest sets default enabled to false."' },
    { q: 'Điều nào KHÔNG thuộc thói quen bảo trì phụ thuộc mà bài học khuyên?', options: ['Thêm plugin thì commit khai báo phụ thuộc', 'Nâng phiên bản thì cập nhật range và tag lại', 'Bỏ plugin thì prune và commit phần dọn dẹp', 'Thiết lập một lần rồi để yên'], answer: 3, explain: '"Dependency management isn\'t a one-time setup. It\'s ongoing maintenance."' },
    { q: 'Bạn vừa nâng một phụ thuộc lên bản mới. Theo bài học, cần làm gì?', options: ['Cập nhật range và tag lại', 'Chỉ báo đồng đội qua chat', 'Xóa tag cũ, giữ range cũ', 'Chạy prune là đủ'], answer: 0, explain: '"When you bump a version, update the range and re-tag."' },
    { q: 'Theo bài học, lần cài hỏng tiếp theo thường "ẩn nấp" ở đâu?', options: ['Trong cache của Claude Code', 'Trong mạng chậm của đồng đội', 'Khoảng hở giữa đã khai báo và đã cài', 'Trong system prompt'], answer: 2, explain: '"Skip it, and the gap between declared and installed is exactly where the next broken install hides."' },
    { q: 'Bạn gỡ một plugin khỏi dự án. Bước nào hoàn tất đúng quy trình?', options: ['Không cần làm gì thêm', 'Prune orphan rồi commit', 'Xóa marketplace file', 'Tắt mọi phụ thuộc của nó bằng tay rồi để nguyên'], answer: 1, explain: '"When you retire a plugin, prune the orphans it leaves behind and commit that cleanup too."' },
    { q: 'Nhóm muốn mọi clone mới resolve ra cùng bộ plugin. Tổ hợp nào là đủ theo bài học?', options: ['Chỉ commit project settings', 'Chỉ dặn mọi người dùng range ^', 'Chia sẻ thư mục plugin đã cài qua một ổ mạng dùng chung', 'Khai báo, settings đã bật, tag phiên bản'], answer: 3, explain: '"Commit the declarations, the enabled plugin settings, and the version tags so a fresh clone resolves the same set."' },
  ],
};
