window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Một plugin hiếm khi chạy một mình; nó <strong>dựa vào plugin khác</strong>. Claude Code cho bạn khai báo những thứ nó cần
trong <strong>mảng dependencies của manifest</strong>. Từ đó: <strong>cài</strong> và <strong>bật</strong> thì tự lan theo đồ thị phụ thuộc,
<strong>tắt</strong> thì được canh giữ để không làm vỡ plugin khác, và <strong>plugin prune</strong> dọn sạch phần thừa một cách an toàn.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Dependency (phụ thuộc):</strong> một plugin khác mà plugin này <strong>bắt buộc phải có</strong> mới chạy được.</li>
  <li><strong>Manifest:</strong> file mô tả plugin; trong đó có <strong>mảng dependencies</strong>.</li>
  <li><strong>Version range:</strong> khoảng phiên bản chấp nhận được, viết theo semver (ví dụ <code>~2.1.0</code>, <code>^2.0</code>, <code>&gt;=1.4</code>).</li>
  <li><strong>Transitive (bắc cầu):</strong> phụ thuộc của phụ thuộc, "xuống hết chuỗi".</li>
  <li><strong>Constraint intersection:</strong> giao các range mà nhiều plugin yêu cầu cho cùng một phụ thuộc.</li>
  <li><strong>Range conflict:</strong> lỗi khi các range không thể hòa giải.</li>
  <li><strong>Orphan (mồ côi):</strong> plugin được cài tự động mà nay không còn ai trỏ tới.</li>
  <li><strong>plugin prune:</strong> lệnh dọn các phụ thuộc mồ côi.</li>
</ul>

<h3>Khai báo phụ thuộc ở đâu?</h3>
<p>Plugin liệt kê những gì nó cần trong <strong>mảng dependencies trong manifest</strong>. Mỗi phần tử là tên một plugin khác, và Claude Code đọc danh sách này <strong>mỗi khi bạn cài</strong>.</p>
<ul>
  <li>Khi cài, Claude Code <strong>resolve</strong> mảng đó và <strong>tự kéo về mọi phụ thuộc</strong>; bạn không phải đi tìm từng cái.</li>
  <li>Output của lệnh cài <strong>in ra chính xác những gì được thêm</strong>, nên bạn thấy trọn bộ đã "hạ cánh".</li>
</ul>

<h3>Hai dạng phần tử: tên trần và object</h3>
<ul>
  <li><strong>Tên trần (bare name):</strong> chỉ là chuỗi tên plugin, nghĩa là "theo bất cứ bản nào marketplace đang cung cấp". Luôn mới, không tốn công,
    nhưng phiên bản bạn nhận <strong>có thể đổi giữa hai lần cài</strong>.</li>
  <li><strong>Object:</strong> tên + <strong>version range</strong>, để resolve khóa vào một bản tương thích thay vì trôi dạt. Claude Code lấy
    <strong>bản có tag cao nhất thỏa range, không mới hơn</strong>. Đổi một chút "độ mới" lấy <strong>tính tái lập</strong>: ai cài cũng ra cùng bản.</li>
  <li><strong>Trường marketplace:</strong> object có thể thêm tên marketplace khi phụ thuộc nằm ở <strong>catalog khác</strong> với plugin khai báo.</li>
</ul>
<p>Coi nó như một dải: tên trần khi muốn theo bản mới nhất, object khi phiên bản quan trọng, trường marketplace <strong>chỉ khi</strong> vươn sang catalog khác.
Phần lớn phần tử vẫn để đơn giản. Khi hành vi plugin cần ổn định cho cả nhóm, đáng để pin.</p>

<h3>Đọc version range</h3>
<ul>
  <li><code>~2.1.0</code> (tilde): <strong>chỉ bản vá (patch)</strong>. Bạn ở dòng 2.1 và nhận bản sửa lỗi.</li>
  <li><code>^2.0</code> (caret): mở cho <strong>minor và patch</strong>, miễn major vẫn là 2.</li>
  <li><code>&gt;=1.4</code> (comparator): <strong>lỏng nhất</strong>; nhận mọi bản từ mức sàn trở lên, nên <strong>ít bảo vệ nhất</strong> trước breaking change.</li>
</ul>
<p>Range càng chặt càng ổn định; range càng lỏng càng ít ma sát nhưng rủi ro hơn.</p>

<h3>Bật (enable) lan truyền</h3>
<ul>
  <li>Bật một plugin thì Claude Code <strong>bật luôn các phụ thuộc của nó, ở cùng scope</strong>, tự động.</li>
  <li>Làm <strong>bắc cầu</strong>: phụ thuộc có phụ thuộc riêng thì cũng được bật, xuống hết chuỗi.</li>
  <li>Điểm tinh tế: phụ thuộc bật theo cách này <strong>vẫn bật dù manifest của nó nói mặc định là tắt</strong>. Plugin đang hoạt động cần nó thì plugin đó thắng.</li>
</ul>
<p>Vì vậy bạn hiếm khi bật phụ thuộc bằng tay: bật thứ bạn quan tâm, mọi thứ nó dựa vào thức dậy cùng nó thành <strong>một khối chạy được</strong>.</p>

<h3>Tắt (disable) có canh giữ</h3>
<p>Nếu bạn tắt một plugin trong khi <strong>một plugin đang bật khác vẫn phụ thuộc vào nó</strong>, Claude Code <strong>chặn</strong> thao tác. Và nó giúp bạn:
thông báo lỗi in ra <strong>một lệnh nối chuỗi</strong> tắt plugin phụ thuộc trước, rồi mới tắt plugin bạn nhắm tới. Khi không còn plugin đang bật nào trỏ vào nó, lệnh tắt đi qua êm.</p>
<div class="box">🧶 <strong>Hình dung thế này:</strong> đồ thị phụ thuộc như một chiếc áo len. Rút một sợi chỉ (tắt một plugin) có thể làm tuột cả mảng khác.
Lớp canh giữ của Claude Code giống người bạn giữ tay bạn lại và nói: "khoan, sợi này đang giữ ống tay áo, tháo ống tay trước đã".
Còn <strong>prune</strong> giống dọn tủ: chỉ vứt những móc treo trống do cửa hàng tặng kèm, <strong>không bao giờ</strong> vứt áo bạn tự mua.</div>

<h3>Hai plugin đòi hai range khác nhau</h3>
<ul>
  <li>Claude Code <strong>không chọn ngẫu nhiên</strong>. Nó <strong>giao các range</strong> và tìm một bản thỏa <strong>mọi ràng buộc cùng lúc</strong>, rồi lấy bản cao nhất vừa vặn.</li>
  <li>Nếu thực sự không hòa giải được (một bên đòi bản 1, bên kia đòi bản 3): <strong>range conflict error</strong>, cài đặt thất bại,
    cấu hình hiện có <strong>để nguyên</strong>. Không có gì được áp một nửa.</li>
  <li>Trong mọi range, resolve luôn lấy <strong>bản có tag mới nhất còn vừa</strong>: <strong>highest compatible wins</strong>. Hiểu điều này là đoán trước được bản nào sẽ về.</li>
</ul>

<h3>Dọn dẹp: plugin prune</h3>
<ul>
  <li>Gỡ một plugin thì <strong>các phụ thuộc nó kéo vào không đi theo</strong>; chúng ở lại vì có thể thứ khác còn cần.</li>
  <li>Để yên, chúng thành <strong>orphan</strong>: plugin tự cài mà không còn ai trỏ tới.</li>
  <li>Chạy <strong>plugin prune</strong> để quét sạch orphan, lấy lại một tập tối giản.</li>
  <li>Bảo đảm an toàn: prune <strong>không bao giờ xóa plugin bạn cài trực tiếp</strong>, chỉ xóa phần được kéo vào tự động và nay không dùng.</li>
</ul>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Khai báo trong mảng dependencies của manifest: tên trần để theo bản mới, object có range để tái lập; ~ chỉ patch, ^ minor + patch, &gt;= lỏng nhất.</li>
  <li>Cài và bật đều lan tự động (bắc cầu, cùng scope, thắng cả default off); tắt bị chặn khi còn plugin đang bật phụ thuộc, kèm lệnh nối chuỗi gợi ý.</li>
  <li>Range được giao nhau, bản cao nhất vừa thắng; không hòa giải được là range conflict, không áp một nửa; prune chỉ dọn orphan, không đụng plugin cài trực tiếp.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">it leans on other plugins</em>: nó dựa vào các plugin khác.</li>
  <li><em class="en">enabling and disabling cascade through the graph</em>: bật và tắt lan truyền qua đồ thị.</li>
  <li><em class="en">You don't hunt them down by hand</em>: bạn không phải đi lùng từng cái bằng tay.</li>
  <li><em class="en">instead of drifting</em>: thay vì trôi dạt.</li>
  <li><em class="en">when you reach across catalogs</em>: khi bạn vươn sang catalog khác.</li>
  <li><em class="en">can shift out from under you</em>: có thể thay đổi mà bạn không hay.</li>
  <li><em class="en">You trade a little freshness for reproducibility</em>: đổi một chút độ mới lấy tính tái lập.</li>
  <li><em class="en">the least protection from a breaking change</em>: ít bảo vệ nhất trước thay đổi phá vỡ.</li>
  <li><em class="en">all the way down the chain</em>: xuống hết chuỗi.</li>
  <li><em class="en">as a single working unit</em>: như một khối chạy được duy nhất.</li>
  <li><em class="en">Nothing half applies</em>: không có gì được áp dụng nửa vời.</li>
  <li><em class="en">Highest compatible wins</em>: bản tương thích cao nhất thắng.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson35/Lesson35.java</code>. Có 5 bài: kiểm tra một phiên bản có thỏa range <code>~</code>, <code>^</code>, <code>&gt;=</code> hay không,
giao nhiều range rồi chọn bản cao nhất vừa với tất cả (hoặc báo <code>range-conflict</code>), tính tập plugin được bật lan truyền xuống hết chuỗi,
dựng thứ tự lệnh tắt mà lỗi disable gợi ý (tắt plugin phụ thuộc trước, target sau), và tìm các orphan mà <code>plugin prune</code> sẽ dọn.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-35"</code>.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Một plugin cần hai plugin khác mới chạy được. Tác giả nên khai báo nhu cầu này ở đâu để Claude Code tự xử lý khi cài?', options: ['Trong CLAUDE.md của plugin', 'Mảng dependencies trong manifest', 'Một file README hướng dẫn cài tay', 'Biến môi trường của người dùng'], answer: 1, explain: '"It lists those needs in a dependencies array, inside its manifest."' },
    { q: 'Bạn cài một plugin có ba phụ thuộc. Điều gì xảy ra?', options: ['Claude Code hỏi lần lượt từng phụ thuộc', 'Chỉ plugin chính được cài, phụ thuộc phải tự cài', 'Phụ thuộc được cài nhưng ẩn khỏi output', 'Tự kéo về, output in ra những gì được thêm'], answer: 3, explain: '"When you install a plugin, Claude Code resolves that array and pulls in every dependency automatically." Output in ra chính xác những gì được thêm.' },
    { q: 'Phần tử dependencies chỉ là chuỗi tên plugin (bare name). Rủi ro chính là gì?', options: ['Phiên bản nhận được có thể đổi giữa hai lần cài', 'Cài đặt luôn thất bại khi có bản mới', 'Plugin bị khóa mãi ở bản đầu tiên', 'Claude Code từ chối resolve tên trần'], answer: 0, explain: '"But the version you actually get can shift out from under you between installs."' },
    { q: 'Nhóm cần mọi người cài ra cùng một bản tương thích của một phụ thuộc. Lựa chọn tốt nhất?', options: ['Dùng tên trần cho gọn', 'Dặn mọi người cài cùng ngày', 'Dùng object có version range', 'Thêm trường marketplace cho mọi phần tử'], answer: 2, explain: '"You trade a little freshness for reproducibility. Everyone who installs resolves the same compatible version."' },
    { q: 'Khi nào mới cần thêm trường marketplace vào object phụ thuộc?', options: ['Khi muốn pin phiên bản chặt', 'Khi phụ thuộc nằm ở catalog khác', 'Khi phụ thuộc mặc định tắt', 'Với mọi phụ thuộc, cho chắc'], answer: 1, explain: '"...a marketplace name, when the dependency lives in a different catalog than the plugin declaring it."' },
    { q: 'Range ~2.1.0 chấp nhận phiên bản nào sau đây?', options: ['2.2.0', '2.1.7', '2.0.9', '3.1.0'], answer: 1, explain: '"A tilde like ~2.1.0 allows patch updates only. You stay on the 2.1 line and pick up bug fixes."' },
    { q: 'Range ^2.0 KHÔNG chấp nhận phiên bản nào?', options: ['2.9.4', '2.0.1', '3.0.0', '2.4.0'], answer: 2, explain: '"A caret like ^2.0 opens things up to minor and patch releases... as long as the major version stays at 2."' },
    { q: 'Trong ba range ~2.1.0, ^2.0 và >=1.4, range nào bảo vệ kém nhất trước breaking change?', options: ['>=1.4', '~2.1.0', '^2.0', 'Cả ba như nhau'], answer: 0, explain: '"It accepts anything at or above that floor, which gives you the least protection from a breaking change."' },
    { q: 'Phụ thuộc pin ^2.0, marketplace có tag 2.0.0, 2.3.1, 2.5.0 và 3.0.0. Claude Code lấy bản nào?', options: ['2.0.0, bản đầu tiên vừa range', '2.5.0, bản cao nhất vừa range', '3.0.0, bản mới nhất', 'Hỏi người dùng chọn'], answer: 1, explain: '"Claude Code fetches the highest tagged release that satisfies your range and nothing newer."' },
    { q: 'Nhận định nào đúng về độ chặt của range?', options: ['Range lỏng luôn an toàn hơn vì nhận bản vá', 'Độ chặt không hề ảnh hưởng tới tính ổn định của bản cài', 'Range chặt giảm ma sát và rủi ro cùng lúc', 'Chặt: ổn định hơn; lỏng: ít ma sát, rủi ro hơn'], answer: 3, explain: '"Tighter ranges mean more stability. Looser ranges mean less friction, but more risk."' },
    { q: 'Bạn bật plugin A ở project scope; A phụ thuộc B, B phụ thuộc C. Kết quả?', options: ['Chỉ A được bật', 'A và B bật, C phải bật tay', 'A, B, C cùng bật ở project scope', 'A bật ở project, B và C ở user scope'], answer: 2, explain: '"When you enable a plugin, Claude Code also enables its dependencies, at the same scope, automatically. And it does this transitively."' },
    { q: 'Manifest của phụ thuộc D đặt mặc định là tắt. Plugin đang bật P cần D. Điều gì xảy ra với D?', options: ['D vẫn được bật vì plugin đang cần nó thắng', 'D giữ trạng thái tắt, P bị lỗi', 'Claude Code hỏi bạn có muốn bật D không', 'P tự tắt để tôn trọng D'], answer: 0, explain: '"A dependency enabled this way is turned on even if its own manifest says it should default to off. The active plugin that needs it wins."' },
    { q: 'Cách làm hợp với thiết kế của Claude Code khi bạn muốn dùng một plugin có nhiều phụ thuộc?', options: ['Bật từng phụ thuộc trước rồi mới bật plugin', 'Sửa manifest phụ thuộc thành default on', 'Bật plugin bạn cần; phụ thuộc tự bật theo', 'Cài lại phụ thuộc ở user scope'], answer: 2, explain: '"So you rarely flip dependencies on by hand. You enable the thing you care about, and everything it relies on wakes up with it."' },
    { q: 'Bạn tắt plugin X trong khi plugin Y đang bật vẫn phụ thuộc X. Claude Code làm gì?', options: ['Tắt X ngay lập tức và để Y tự chạy lỗi sau đó', 'Chặn, gợi ý lệnh tắt Y rồi X', 'Tắt cả X và Y không cần hỏi', 'Gỡ cài đặt Y để tắt được X'], answer: 1, explain: '"If you try to disable a plugin while another enabled plugin still depends on it, Claude Code blocks the action... The error prints a chained command that disables the dependent first, then the plugin you targeted."' },
    { q: 'Plugin Z từng được Y phụ thuộc, nhưng Y đã bị tắt. Giờ bạn tắt Z. Kết quả?', options: ['Vẫn bị chặn vì Y còn cài', 'Phải gỡ hẳn Y khỏi máy trước rồi mới tắt được Z', 'Bị chặn cho tới khi chạy prune', 'Tắt êm, không còn gì trỏ vào Z'], answer: 3, explain: '"Once nothing enabled points at it anymore, the disable goes through cleanly."' },
    { q: 'Lý do chính Claude Code canh giữ thao tác disable là gì?', options: ['Tránh làm vỡ plugin đang dựa vào nó', 'Tiết kiệm băng thông khi phải tải lại plugin sau này', 'Ngăn người dùng tắt plugin của marketplace', 'Giữ system prompt cache ổn định'], answer: 0, explain: '"Without that guard, you could silently break a plugin that quietly relied on the one you just switched off."' },
    { q: 'Plugin A cần lib ^2.0, plugin B cần lib ~2.1.0. Tag có 2.1.2, 2.1.5, 2.4.0. Bản nào được lấy?', options: ['2.4.0', '2.1.2', 'Range conflict', '2.1.5'], answer: 3, explain: '"It intersects their ranges and looks for a single version that satisfies every constraint at once, then fetches the highest one that fits."' },
    { q: 'Hai plugin cùng phụ thuộc một thứ với range khác nhau. Mô tả nào sai về cách Claude Code xử lý?', options: ['Giao các range lại với nhau', 'Chọn ngẫu nhiên một trong hai range', 'Tìm một bản thỏa mọi ràng buộc', 'Lấy bản cao nhất vừa phần giao'], answer: 1, explain: '"Claude Code doesn\'t just pick one at random. It intersects their ranges..."' },
    { q: 'Plugin mới đòi lib bản 1, plugin đã cài đòi lib bản 3. Cài plugin mới sẽ ra sao?', options: ['Cài plugin mới nhưng bỏ qua lib', 'Lib hạ xuống bản 1 và plugin đã cài trước đó bị hỏng', 'Range conflict; cấu hình cũ để nguyên', 'Cài cả hai bản lib song song'], answer: 2, explain: '"You get a range conflict error, the install fails, and your existing setup is left untouched. Nothing half applies."' },
    { q: 'Sau một lần range conflict, đồng đội lo cấu hình bị cài dở dang. Câu trả lời đúng?', options: ['Không, không có gì được áp một nửa', 'Có, cần chạy prune để dọn', 'Có, phụ thuộc đã kéo về vẫn ở lại', 'Tùy scope của plugin'], answer: 0, explain: '"...your existing setup is left untouched. Nothing half applies."' },
    { q: 'Nguyên tắc nào giúp bạn đoán trước bản nào sẽ được cài trong một range?', options: ['Bản được tải nhiều nhất thắng', 'Bản cũ nhất ổn định nhất thắng', 'Bản mới nhất bất kể range', 'Bản có tag cao nhất còn vừa range thắng'], answer: 3, explain: '"Within any single range, resolution always reaches for the newest tagged release that still fits. Highest compatible wins."' },
    { q: 'Bạn gỡ plugin A; A từng kéo vào B và C. Ngay sau khi gỡ, B và C thế nào?', options: ['Bị gỡ theo A', 'Vẫn được cài, vì thứ khác có thể còn cần', 'Bị tắt nhưng vẫn cài', 'Bị đánh dấu lỗi dependency'], answer: 1, explain: '"When you remove a plugin, the dependencies it dragged in don\'t leave with it. They stay installed because something else might still need them."' },
    { q: 'Trường hợp nào sau đây là một orphan mà plugin prune sẽ dọn?', options: ['Plugin cài trực tiếp nhưng đang tắt', 'Plugin có range conflict', 'Plugin tự cài mà không còn gì trỏ tới', 'Plugin nằm ở marketplace khác'], answer: 2, explain: '"Left alone, those become orphans. Auto-installed plugins with nothing pointing at them anymore."' },
    { q: 'Bạn cài trực tiếp plugin L, sau đó plugin K (cũng cài trực tiếp) từng phụ thuộc L bị gỡ. Chạy plugin prune thì L thế nào?', options: ['Bị xóa vì không còn ai phụ thuộc', 'Bị tắt nhưng vẫn giữ lại trên máy', 'Prune báo lỗi và dừng', 'Được giữ lại'], answer: 3, explain: '"Prune never removes a plugin you installed directly. Only the extras that got pulled in automatically and are now unused."' },
    { q: 'Lệnh nào phù hợp để dọn các phụ thuộc tự cài nay không còn dùng?', options: ['plugin prune', 'plugin disable cho từng cái', 'Xóa thư mục plugin bằng tay', 'Cài lại toàn bộ plugin'], answer: 0, explain: '"To clear them, you run plugin prune. It sweeps away orphaned auto-installed dependencies and reclaims a clean, minimal set."' },
    { q: 'Điều nào KHÔNG đúng về cách Claude Code xử lý đồ thị phụ thuộc?', options: ['Cài và bật đều lan tự động', 'Tắt được canh giữ khi còn plugin đang bật phụ thuộc', 'Gỡ plugin thì gỡ luôn mọi phụ thuộc của nó', 'Prune dọn orphan an toàn'], answer: 2, explain: '"...install and enable both cascade automatically, and disable is guarded..." Còn gỡ plugin thì phụ thuộc ở lại cho tới khi prune.' },
    { q: 'Bạn muốn một phụ thuộc theo sát bản mới nhất marketplace mà không cần chăm. Chọn dạng nào?', options: ['Object với range ~', 'Object với range ^ và marketplace', 'Object với phiên bản chính xác', 'Tên trần'], answer: 3, explain: '"So think of it as a spectrum, bare when you want to follow the latest, an object when a specific version matters."' },
    { q: 'Theo bài học, phần lớn phần tử trong mảng dependencies nên ở dạng nào?', options: ['Object kèm marketplace', 'Đơn giản (tên trần)', 'Object với >=', 'Object với phiên bản chính xác'], answer: 1, explain: '"...and the marketplace field only when you reach across catalogs. Most entries stay simple."' },
    { q: 'Phụ thuộc pin ~2.1.0. Tác giả phát hành 2.2.0 có tính năng mới. Lần cài kế tiếp sẽ ra sao?', options: ['Vẫn ở dòng 2.1, chỉ nhận bản vá', 'Nhảy lên 2.2.0 vì là bản mới nhất', 'Cài thất bại với range conflict', 'Hỏi bạn có muốn lên 2.2.0'], answer: 0, explain: '"A tilde like ~2.1.0 allows patch updates only. You stay on the 2.1 line and pick up bug fixes."' },
    { q: 'Khi nào việc pin phiên bản đáng công nhất?', options: ['Khi plugin chỉ dùng thử một lần', 'Khi muốn luôn có tính năng mới nhất của tác giả', 'Khi cả nhóm cần hành vi ổn định', 'Khi phụ thuộc cùng marketplace'], answer: 2, explain: '"When a plugin\'s behavior has to stay stable across a team, that predictability is worth pinning for."' },
  ],
};
