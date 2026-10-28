window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Plugin là cách <strong>mở rộng Claude Code mà không phải xây lại gì</strong>: một gói duy nhất mang vào lệnh, skill,
subagent, hook, MCP server... và <strong>cài như một khối, cập nhật như một khối</strong>. Điều hay bị nhầm nhất: <strong>thêm marketplace không cài gì cả</strong>;
luồng luôn là <strong>hai bước</strong>: đăng ký catalog, rồi cài plugin cụ thể từ đó.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Plugin:</strong> một thư mục tự chứa (self-contained) mở rộng Claude Code bằng năng lực mới, đóng gói để cài như <strong>một đơn vị</strong>.</li>
  <li><strong>Manifest (<code>plugin.json</code>):</strong> file trong thư mục plugin, <strong>nhận diện plugin</strong> và <strong>khai báo nó cung cấp gì</strong>. Bạn không phải tự nối dây.</li>
  <li><strong>Marketplace:</strong> một <strong>catalog</strong> liệt kê các plugin có sẵn để bạn duyệt và cài từ nguồn mình tin.</li>
  <li><strong>Scope:</strong> phạm vi khi cài: plugin dành cho riêng bạn hay cho cả dự án.</li>
  <li><strong>LSP server:</strong> server cung cấp "trí tuệ ngôn ngữ" (language intelligence) như nhảy tới định nghĩa, gợi ý.</li>
  <li><strong>Reload plugins:</strong> lệnh áp dụng thay đổi plugin ngay giữa phiên, không cần khởi động lại.</li>
</ul>

<h3>Ba ý nền: thư mục, manifest, marketplace</h3>
<ul>
  <li><strong>Thư mục:</strong> plugin là một thư mục tự chứa, cài nguyên khối.</li>
  <li><strong>Manifest:</strong> <code>plugin.json</code> cho Claude Code biết trong gói có gì.</li>
  <li><strong>Marketplace:</strong> catalog để duyệt và cài từ nguồn bạn tin.</li>
</ul>

<h3>Một plugin có thể mang những gì?</h3>
<ul>
  <li><strong>Slash command và skill:</strong> workflow mới.</li>
  <li><strong>Subagent và hook:</strong> chạy tự động trong lúc bạn làm việc.</li>
  <li><strong>MCP server, LSP server</strong> (trí tuệ ngôn ngữ) và <strong>background monitor</strong> (theo dõi sự kiện).</li>
</ul>
<p>Điểm chính: tất cả <strong>đi cùng nhau</strong>. Vì nằm trong một gói nên <strong>cài như một bộ, cập nhật như một bộ</strong>; bạn không phải đi gom năm mảnh rời.
Thêm plugin là mọi năng lực của nó cùng "lên sóng".</p>

<h3>Marketplace khác plugin: luồng hai bước</h3>
<div class="box">🏬 <strong>Hình dung thế này:</strong> marketplace giống như <strong>đăng ký nhận catalog</strong> của một cửa hàng nội thất. Catalog về nhà rồi,
nhưng <strong>chưa có cái ghế nào</strong> trong phòng bạn. Muốn có ghế, bạn phải <strong>đặt mua đúng món</strong> trong catalog đó.
Thêm marketplace mà thấy "chẳng có gì mới" là <strong>bình thường</strong>: bạn mới nhận catalog thôi.</div>
<ol>
  <li><strong>Thêm marketplace:</strong> trỏ tới một repo, một URL, hoặc cả một đường dẫn local; việc này <strong>đăng ký catalog</strong>, không cài gì.</li>
  <li><strong>Cài plugin theo tên</strong>, <strong>gắn với marketplace nó đến từ</strong> (dạng <code>name@marketplace</code>), để Claude Code biết chính xác bạn muốn cái nào.</li>
</ol>
<p>Tiện ích: <strong>marketplace chính thức có sẵn</strong> ngay từ đầu, bạn chỉ phải tự thêm marketplace cộng đồng hoặc tùy chỉnh.
Cài xong, plugin, lệnh và skill <strong>sẵn sàng dùng ngay</strong>.</p>

<h3>Quản lý hằng ngày</h3>
<ul>
  <li><strong>list:</strong> kiểm kê; hiện mọi plugin đã cài và đang <strong>enabled hay disabled</strong>; lọc được chỉ enabled hoặc chỉ disabled.</li>
  <li><strong>enable / disable:</strong> bật/tắt tại chỗ. Disable <strong>vẫn giữ plugin đã cài</strong>, bật lại tức thì, không tải lại.</li>
  <li><strong>uninstall:</strong> gỡ plugin <strong>và file của nó</strong> hoàn toàn.</li>
</ul>
<p>Hãy nghĩ như một dải: <strong>disable để tạm dừng</strong>, <strong>uninstall để gỡ hẳn</strong>.</p>

<h3>Trình quản lý tương tác: 4 tab</h3>
<p>Chạy lệnh <code>/plugin</code> <strong>không kèm tham số</strong> sẽ mở trình quản lý tương tác:</p>
<ol>
  <li><strong>Discover:</strong> duyệt plugin có thể thêm từ các marketplace đã đăng ký.</li>
  <li><strong>Installed:</strong> những gì bạn đã có và trạng thái của từng cái.</li>
  <li><strong>Marketplaces:</strong> các catalog đã đăng ký.</li>
  <li><strong>Errors:</strong> plugin nào <strong>nạp lỗi</strong>; chỗ duy nhất cần tới khi có gì đó không chạy.</li>
</ol>

<h3>"Configuring": scope, giá trị cấu hình, reload</h3>
<ul>
  <li>Khi cài, bạn <strong>chọn scope</strong>: plugin cho riêng bạn hay cho cả dự án (bài sau đi sâu).</li>
  <li>Một số plugin nhận <strong>giá trị cấu hình</strong> để chỉnh hành vi; các giá trị này <strong>được lưu</strong> nên giữ nguyên từ phiên này sang phiên khác.</li>
  <li><strong>Reload plugins:</strong> sau khi enable, disable hay install giữa phiên, lệnh này áp dụng thay đổi <strong>ngay lập tức</strong>, không phải khởi động lại Claude Code.</li>
</ul>

<h3>Ba thứ định hình hành vi: đừng gộp làm một</h3>
<ul>
  <li><strong>Plugin:</strong> thêm <strong>năng lực</strong>: lệnh, skill, tool thật sự gọi được.</li>
  <li><strong>CLAUDE.md:</strong> <strong>chỉ dẫn</strong> bằng ngôn ngữ tự nhiên mà Claude đọc như ngữ cảnh; là lời hướng dẫn, không phải "máy móc".</li>
  <li><strong>settings.json:</strong> <strong>cấu hình</strong>: permissions và các tùy chọn máy đọc được, như Claude được phép làm gì.</li>
</ul>
<p>Một dự án có thể có cả ba cùng lúc. Nhớ rõ vai trò giúp bạn biết <strong>một thay đổi thuộc về đâu</strong>.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Plugin là một thư mục tự chứa có manifest <code>plugin.json</code>, gói nhiều năng lực, cài và cập nhật như một khối.</li>
  <li>Thêm marketplace chỉ đăng ký catalog, không cài gì; cài plugin theo tên gắn với marketplace là bước thứ hai.</li>
  <li>Disable để tạm dừng, uninstall để gỡ hẳn, reload plugins để áp thay đổi ngay; plugin cho năng lực, CLAUDE.md cho chỉ dẫn, settings.json cho cấu hình.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">without rebuilding anything</em>: mà không phải xây lại gì.</li>
  <li><em class="en">a handful of moving parts</em>: vài bộ phận chuyển động cần hiểu.</li>
  <li><em class="en">a self-contained directory</em>: một thư mục tự chứa, đủ mọi thứ bên trong.</li>
  <li><em class="en">You don't handwire anything</em>: bạn không phải tự nối dây thủ công.</li>
  <li><em class="en">falls into place pretty naturally</em>: tự vào đúng chỗ khá tự nhiên.</li>
  <li><em class="en">bring to the table</em>: mang lại, đóng góp.</li>
  <li><em class="en">installs as a set and updates as a set</em>: cài như một bộ và cập nhật như một bộ.</li>
  <li><em class="en">a distinction that trips people up constantly</em>: một khác biệt khiến người ta vấp hoài.</li>
  <li><em class="en">Adding the marketplace installs nothing on its own</em>: tự việc thêm marketplace không cài gì cả.</li>
  <li><em class="en">out of the box</em>: có sẵn ngay, không cần cài thêm.</li>
  <li><em class="en">Disable to pause and uninstall to remove for good</em>: tắt để tạm dừng, gỡ cài đặt để bỏ hẳn.</li>
  <li><em class="en">saves a lot of head-scratching</em>: đỡ được rất nhiều lần gãi đầu bối rối.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson28/Lesson28.java</code>. Có 5 bài, mô phỏng trình quản lý plugin: thực hiện lệnh
<code>marketplace add</code> và <code>install name@marketplace</code> (thêm marketplace không cài gì, cài từ marketplace chưa đăng ký thì lỗi,
marketplace chính thức có sẵn); thêm <code>enable</code>, <code>disable</code> (vẫn còn cài) và <code>uninstall</code> (gỡ hẳn);
lệnh <code>list</code> có lọc all/enabled/disabled; đọc manifest <code>plugin.json</code> bằng Jackson để ra id <code>name@marketplace</code>;
và quyết định một thay đổi thuộc về plugin, CLAUDE.md hay settings.json. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-28"</code>.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Mô tả nào đúng nhất về một plugin của Claude Code?', options: ['Một file cấu hình nằm trong settings.json', 'Một thư mục tự chứa, cài như một đơn vị', 'Một đoạn chỉ dẫn trong CLAUDE.md', 'Một lệnh shell chạy trước mỗi phiên'], answer: 1, explain: '"At its core, it\'s a self-contained directory that extends Claude Code with new capabilities, packaged so you install the whole thing as one unit."' },
    { q: 'File nào nhận diện plugin và khai báo plugin đó cung cấp gì?', options: ['CLAUDE.md trong thư mục plugin', 'settings.json của dự án', 'plugin.json, tức manifest', 'marketplace.json của catalog'], answer: 2, explain: '"Inside that directory sits a manifest, the plugin.json file, and that\'s what identifies the plugin and declares what it provides."' },
    { q: 'Vì sao bạn không phải "nối dây" thủ công từng lệnh của plugin vào Claude Code?', options: ['Manifest cho Claude Code biết trong gói có gì', 'Claude tự quét toàn bộ repo để tìm lệnh', 'Marketplace tự sửa settings.json giúp bạn', 'Lệnh plugin luôn trùng tên với lệnh có sẵn trong Claude Code'], answer: 0, explain: '"You don\'t handwire anything. The manifest tells Claude Code what\'s in the package."' },
    { q: 'Thứ nào KHÔNG nằm trong danh sách những gì một plugin có thể mang theo?', options: ['Slash command và skill', 'Subagent và hook', 'MCP server và LSP server', 'Lịch sử chat cũ'], answer: 3, explain: '"It can add slash commands and skills... It can bring sub-agents and hooks... And it can package MCP servers, LSP servers for language intelligence, and background monitors."' },
    { q: 'Một plugin mang theo 1 lệnh, 2 skill và 1 MCP server. Khi cập nhật plugin thì sao?', options: ['Phải cập nhật từng phần riêng rẽ', 'Tất cả được cập nhật như một bộ', 'Chỉ MCP server tự cập nhật', 'Skill phải cài lại bằng tay'], answer: 1, explain: '"Because everything lives in one package, it installs as a set and updates as a set. You\'re not chasing down five separate pieces."' },
    { q: 'Bạn vừa thêm một marketplace cộng đồng nhưng không thấy lệnh mới nào xuất hiện. Đánh giá đúng?', options: ['Marketplace bị lỗi, nên gỡ ra thêm lại', 'Phải khởi động lại máy để thấy lệnh', 'Bình thường: bạn vẫn phải cài plugin cụ thể', 'Plugin bị disable mặc định ngay sau khi thêm marketplace'], answer: 2, explain: '"If you add a marketplace and wonder why nothing new showed up, that\'s expected. You still have to install the specific plugin you want."' },
    { q: 'Việc "thêm một marketplace" thực chất làm gì?', options: ['Đăng ký nơi plugin nằm, không cài gì', 'Cài mọi plugin trong catalog đó', 'Cài plugin phổ biến nhất của catalog', 'Tải về rồi bật sẵn mọi skill'], answer: 0, explain: '"Adding the marketplace installs nothing on its own. It\'s just registering where plugins live."' },
    { q: 'Thứ tự đúng để có một plugin từ marketplace của công ty?', options: ['Cài plugin trước, rồi mới thêm marketplace của nó', 'Chỉ cần cài plugin theo tên', 'Thêm marketplace là đủ', 'Thêm marketplace, rồi cài plugin từ đó'], answer: 3, explain: '"So the flow is always two moves, register the catalog, then install from it."' },
    { q: 'Khi thêm marketplace, bạn có thể trỏ tới những nguồn nào?', options: ['Chỉ các repo GitHub công khai có gắn sao', 'Một repo, một URL, hoặc đường dẫn local', 'Chỉ marketplace chính thức của Anthropic', 'Chỉ một file zip đã ký'], answer: 1, explain: '"First, you add the marketplace. Pointing it at a repo, a URL, or even a local path, and that registers the catalog."' },
    { q: 'Hai marketplace đều có plugin tên "formatter". Làm sao Claude Code biết bạn muốn cái nào?', options: ['Nó chọn cái được thêm gần nhất', 'Nó hỏi bạn sau khi cài cả hai', 'Bạn cài theo tên gắn với marketplace gốc', 'Nó chọn bản có số phiên bản lớn hơn trong hai bản'], answer: 2, explain: '"Then you install the plugin by name, scoped to the marketplace it came from. So Claude Code knows exactly which one you mean."' },
    { q: 'Muốn cài một plugin từ marketplace chính thức, bạn có phải thêm marketplace đó trước không?', options: ['Không, nó đã có sẵn từ đầu', 'Có, như mọi marketplace khác', 'Có, nhưng chỉ lần đầu mỗi dự án', 'Chỉ khi dùng scope dự án'], answer: 0, explain: '"The official marketplace is already available out of the box. So you only add the community or custom ones yourself."' },
    { q: 'Lệnh nào cho bạn thấy plugin nào đã cài và cái nào đang bị tắt?', options: ['install', 'enable', 'uninstall', 'list'], answer: 3, explain: '"The list command is your inventory. It shows every plugin you have installed and whether each one is currently enabled or disabled."' },
    { q: 'Một plugin gây nhiễu trong tuần này nhưng tuần sau bạn sẽ cần lại. Lựa chọn tốt nhất?', options: ['Uninstall rồi cài lại sau', 'Disable nó', 'Gỡ marketplace chứa nó', 'Xóa thư mục plugin bằng tay'], answer: 1, explain: '"The nice thing about disabling is that it keeps the plugin installed. So flipping it back on later is instant with no re-download."' },
    { q: 'Điều nào đúng về uninstall?', options: ['Chỉ tắt plugin, file vẫn còn', 'Gỡ luôn marketplace chứa plugin', 'Gỡ plugin và file của nó hoàn toàn', 'Chỉ áp dụng cho plugin chính thức'], answer: 2, explain: '"And when you\'re genuinely done with a capability, uninstall removes the plugin and its files completely."' },
    { q: 'Câu nào tóm đúng "dải" quản lý plugin trong bài?', options: ['Disable để tạm dừng, uninstall để gỡ hẳn', 'Uninstall để tạm dừng, disable để gỡ hẳn', 'Disable và uninstall giống hệt nhau', 'Chỉ có uninstall, không thể tạm dừng'], answer: 0, explain: '"So think of it as a spectrum. Disable to pause and uninstall to remove for good."' },
    { q: 'Làm sao mở trình quản lý plugin tương tác?', options: ['Chạy /plugin với tham số list', 'Mở file plugin.json bằng editor', 'Thêm cờ --ui vào lệnh install', 'Chạy plugin không tham số'], answer: 3, explain: '"If you run the plugin command on its own with no arguments, it opens an interactive manager."' },
    { q: 'Bạn muốn duyệt những plugin có thể thêm từ các marketplace đã đăng ký. Mở tab nào?', options: ['Installed', 'Discover', 'Marketplaces', 'Errors'], answer: 1, explain: '"The first is Discover, where you browse plugins you could add from your registered marketplaces."' },
    { q: 'Một plugin vừa cài nhưng lệnh của nó không xuất hiện. Tab nào là chỗ đầu tiên nên xem?', options: ['Discover', 'Installed', 'Errors', 'Marketplaces'], answer: 2, explain: '"And the fourth is Errors, which surfaces any plugins that failed to load. So you have one place to go when something isn\'t working."' },
    { q: 'Tab Marketplaces của trình quản lý hiển thị gì?', options: ['Các catalog bạn đã đăng ký', 'Mọi plugin trên toàn internet', 'Plugin bị lỗi khi nạp', 'Plugin đang bật trong phiên'], answer: 0, explain: '"The third is Marketplaces, listing the catalogs you\'ve registered so far."' },
    { q: 'Khi cài plugin, lựa chọn "scope" quyết định điều gì?', options: ['Plugin chạy bằng model nào', 'Plugin được cập nhật bao lâu một lần', 'Plugin có được bật mặc định không', 'Plugin dành cho riêng bạn hay cả dự án'], answer: 3, explain: '"When you install a plugin, you choose a scope. And that decides who the plugin is for, whether it\'s just you or the whole project."' },
    { q: 'Bạn chỉnh giá trị cấu hình của một plugin hôm nay. Ngày mai mở phiên mới thì sao?', options: ['Giá trị trở về mặc định', 'Giá trị vẫn giữ vì đã được lưu', 'Phải nhập lại ở mỗi phiên', 'Chỉ giữ nếu không đổi scope khi cài lại'], answer: 1, explain: '"Some plugins accept configuration values that tune how they behave. And those get stored. So the settings stick from one session to the next."' },
    { q: 'Giữa phiên bạn vừa cài và bật một plugin. Cách nhanh nhất để thay đổi có hiệu lực?', options: ['Thoát và mở lại Claude Code', 'Mở phiên mới và re-ground', 'Chạy lệnh reload plugins', 'Đợi tới lần compaction kế tiếp'], answer: 2, explain: '"Whenever you enable, disable, or install something mid-session, Reload plugins applies the change immediately. So you don\'t have to restart Claude Code just to pick up your new setup."' },
    { q: 'Nhóm muốn mọi người có lệnh /deploy và một MCP server nội bộ. Nên đặt chúng ở đâu?', options: ['Trong một plugin', 'Trong CLAUDE.md của dự án', 'Trong settings.json', 'Trong tin nhắn đầu phiên'], answer: 0, explain: '"Plugins add new capabilities. The actual commands, skills, and tools you can invoke."' },
    { q: 'Nhóm muốn Claude luôn viết commit message theo Conventional Commits. Chỗ phù hợp nhất?', options: ['Một plugin mới', 'Quyền trong settings.json', 'Một MCP server', 'CLAUDE.md'], answer: 3, explain: '"Claude.md is different. It gives natural language instructions that Claude reads as context, guidance rather than machinery."' },
    { q: 'Bạn muốn chặn Claude chạy lệnh rm -rf. Thay đổi này thuộc về đâu?', options: ['CLAUDE.md, như một lời nhắc', 'settings.json, như một permission', 'Một plugin, như một skill', 'Manifest plugin.json'], answer: 1, explain: '"And settings.json is different again. It sets permissions and other machine-readable options, like what Claude is allowed to do."' },
    { q: 'Câu nào KHÔNG đúng về plugin, CLAUDE.md và settings.json?', options: ['Một dự án có thể dùng cả ba cùng lúc', 'Plugin thêm năng lực có thể gọi được', 'CLAUDE.md là máy móc thực thi quyền hạn', 'settings.json chứa tùy chọn máy đọc được'], answer: 2, explain: '"It gives natural language instructions that Claude reads as context, guidance rather than machinery." Quyền hạn thuộc về settings.json.' },
    { q: 'Theo bài, việc nhớ rõ vai trò của ba thứ (plugin, CLAUDE.md, settings.json) giúp ích chủ yếu ở đâu?', options: ['Quyết định một thay đổi thật sự thuộc về đâu', 'Giảm số token mỗi request', 'Tăng tốc độ cài plugin', 'Tránh phải đăng ký marketplace cho từng dự án'], answer: 0, explain: '"Keeping those roles straight in your head saves a lot of head-scratching when you\'re deciding where a given change actually belongs."' },
    { q: 'Đồng nghiệp nói: "Tôi đã thêm marketplace của team rồi, nên plugin code-review chắc đã được cài." Nhận định đúng?', options: ['Đúng, thêm marketplace là cài mọi plugin', 'Đúng, nếu marketplace là repo nội bộ', 'Đúng sau khi chạy reload plugins', 'Sai, vẫn phải cài plugin đó riêng'], answer: 3, explain: '"It matters because registering a marketplace and installing a plugin are separate steps, and adding a catalog installs nothing by itself."' },
    { q: 'Bạn cần biết plugin nào đang bật trong số hai chục plugin đã cài, không cần xem cái đã tắt. Cách gọn nhất?', options: ['Mở từng thư mục plugin', 'Dùng list và lọc chỉ plugin enabled', 'Xem tab Marketplaces trong trình quản lý', 'Đọc lại settings.json'], answer: 1, explain: '"The list command is your inventory... And you can filter to just the enabled or just the disabled ones."' },
    { q: 'Vì sao bài gọi marketplace là "nguồn bạn tin"?', options: ['Vì nó tự quét mã độc trong plugin', 'Vì nó chỉ chứa plugin chính thức', 'Vì bạn duyệt và cài từ catalog bạn chọn đăng ký', 'Vì nó ký số mọi plugin bằng khóa của Anthropic'], answer: 2, explain: '"A marketplace, which is just a catalog that lists available plugins so you can browse and install from a source you trust."' },
  ],
};
