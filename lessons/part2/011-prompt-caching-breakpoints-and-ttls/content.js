window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Mỗi lần gửi một system prompt dài hay một bộ tool lớn, model xử lý lại toàn bộ và bạn trả tiền cho toàn bộ.
<strong>Prompt caching</strong> cho phép dùng lại phần đầu prompt (prefix) đã xử lý. Bạn đánh dấu chỗ kết thúc phần ổn định bằng <strong>breakpoint</strong>,
chọn <strong>thời gian sống</strong> (5 phút hoặc 1 giờ), và nó chỉ có lời khi phần đó <strong>được dùng lại đủ nhiều</strong>.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Prefix:</strong> phần đầu của prompt sau khi render, tính tới chỗ bạn đánh dấu.</li>
  <li><strong>cache_control breakpoint:</strong> dấu đặt trên một block, khép lại một prefix có thể cache. Tối đa <strong>4</strong> cái mỗi request.</li>
  <li><strong>TTL (time to live):</strong> thời gian sống của một mục cache: mặc định 5 phút (ephemeral), có tùy chọn 1 giờ.</li>
  <li><strong>Cache write / cache read:</strong> ghi vào cache (lần đầu) và đọc từ cache (các lần sau).</li>
</ul>

<h3>Khớp prefix chính xác từng byte, theo thứ tự cố định</h3>
<p>Model render prefix theo thứ tự: <strong>tools</strong>, rồi <strong>system</strong>, rồi <strong>messages</strong>. Khóa cache là chính các byte đã render của prefix tới chỗ bạn đánh dấu.</p>
<div class="box">📚 <strong>Hình dung thế này:</strong> Cache giống một cuốn sách đã đánh dấu trang. Chỉ cần sửa <strong>một chữ</strong> ở trang 3,
mọi trang từ trang 3 trở đi phải in lại. Không có "gần giống", không có điểm khuyến khích: phải giống hệt từng byte, và chỉ tính từ đầu sách.</div>
<p>Vì vậy thứ tự và độ ổn định của phần đầu rất quan trọng. Sắp đúng thì cache làm việc lặng lẽ.</p>

<h3>Đặt breakpoint ở đâu?</h3>
<ul>
  <li>Đặt ở <strong>ranh giới ổn định</strong>: nơi nội dung thôi thay đổi.</li>
  <li>Mẹo hay: một breakpoint ở <strong>block system cuối cùng</strong> cache luôn cả tools lẫn system thành một khối, vì tools render trước system.</li>
  <li>Quy tắc thiết kế: <strong>ổn định ở trước, thay đổi ở sau</strong>. Nội dung hay đổi (như lượt user hiện tại) phải nằm <strong>sau</strong> breakpoint cuối, để không chạm vào prefix đã cache.</li>
</ul>

<h3>Hai thời gian sống</h3>
<ul>
  <li><strong>5 phút (mặc định, ephemeral):</strong> mỗi lần đọc làm mới hạn. Lưu lượng đều đặn thì prefix luôn "ấm".</li>
  <li><strong>1 giờ:</strong> khi các lần gọi cách xa nhau, đặt type ephemeral với TTL 1 giờ. Sống qua khoảng trống dài hơn, nhưng <strong>ghi đắt hơn</strong>.</li>
</ul>
<p>Không cái nào "tốt hơn"; đó là đánh đổi giữa cần mục cache sống bao lâu và chịu trả bao nhiêu để ghi. Chọn TTL theo nhịp lưu lượng.</p>

<h3>Tính giá (theo bội số giá input cơ bản)</h3>
<ul>
  <li><strong>Đọc cache:</strong> 10% giá cơ bản (khoảng một phần mười).</li>
  <li><strong>Ghi cache 5 phút:</strong> đắt hơn 25% (một khoản phụ phí một lần).</li>
  <li><strong>Ghi cache 1 giờ:</strong> gấp đôi giá cơ bản.</li>
</ul>
<p>Hình dạng là: ghi đắt hơn một chút, đọc rẻ hơn rất nhiều. Đừng đảo ngược. Chiến lược chỉ có lời vì đọc rẻ, lặp đủ lần, sẽ bù lại phụ phí ghi một lần.</p>

<h3>Khi nào thật sự đáng cache?</h3>
<ul>
  <li>Khi prefix ổn định chiếm <strong>phần lớn</strong> request và được <strong>dùng lại nhiều lần</strong>.</li>
  <li>Với TTL 5 phút, mục cache gần như <strong>hoàn vốn sau khoảng một lần dùng lại</strong>: 1,25 (ghi) + 0,1 (đọc) rẻ hơn 2 lần trả đủ giá.</li>
  <li>Ngược lại, prefix hầu như không được dùng lại thì cache <strong>đắt hơn</strong> gửi lại bình thường.</li>
</ul>

<h3>Ngưỡng tối thiểu và phạm vi theo model</h3>
<ul>
  <li>Prefix phải đạt một số token tối thiểu mới được cache, và mức này <strong>tùy model</strong>: 1024 token với Opus 4.8, 2048 token với Opus 4.7.</li>
  <li>Dưới ngưỡng thì <strong>không có lỗi nào</strong>; bạn chỉ thấy <code>cache_creation_input_tokens</code> bằng 0, rất dễ bỏ qua.</li>
  <li>Cache gắn với <strong>một model cụ thể</strong>. Đổi model giữa chừng là trượt cache hoàn toàn.</li>
</ul>

<h3>Kiểm chứng cache đang chạy</h3>
<p>Theo dõi <code>cache_read_input_tokens</code> trong usage. Gọi hai lần với cùng prefix, lần thứ hai con số này phải tăng.
Nếu nó cứ bằng 0 qua nhiều lần gọi giống nhau, có thứ gì đó đang âm thầm phá prefix. Nghi phạm quen thuộc:</p>
<ul>
  <li>Một <strong>dấu ngày giờ</strong> nhét trong system prompt.</li>
  <li><strong>JSON không sắp xếp khóa</strong> giống nhau mỗi lần.</li>
  <li>Một <strong>bộ tool thay đổi</strong> giữa các lần gọi (tools nằm ngay đầu prefix).</li>
</ul>
<p>Đóng băng mọi thứ ở đầu, giữ giống hệt từng byte, và lượt đọc cache sẽ xuất hiện đúng chỗ.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Cache khớp prefix chính xác từng byte theo thứ tự tools → system → messages; ổn định trước, thay đổi sau breakpoint cuối.</li>
  <li>Đọc 0,1; ghi 1,25 (5 phút) hoặc 2 (1 giờ); chỉ có lời khi dùng lại đủ nhiều.</li>
  <li>Ngưỡng tối thiểu tùy model; kiểm chứng bằng cache_read_input_tokens.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">how you stop that waste</em>: cách bạn chấm dứt sự lãng phí đó.</li>
  <li><em class="en">carry the whole lesson</em>: gánh cả bài học.</li>
  <li><em class="en">There's no fuzzy matching and no partial credit</em>: không có khớp gần đúng, không có điểm cho phần đúng một nửa.</li>
  <li><em class="en">does its job quietly</em>: làm việc lặng lẽ.</li>
  <li><em class="en">stability boundaries</em>: ranh giới ổn định.</li>
  <li><em class="en">knocks it out</em>: đánh bật nó ra, làm mất nó.</li>
  <li><em class="en">Stable first, volatile last</em>: ổn định trước, hay đổi sau cùng.</li>
  <li><em class="en">stays warm</em>: luôn ấm, luôn sẵn trong cache.</li>
  <li><em class="en">where caching earns its keep</em>: nơi caching chứng minh giá trị của nó.</li>
  <li><em class="en">Don't invert that</em>: đừng đảo ngược điều đó.</li>
  <li><em class="en">catches people off guard</em>: làm người ta bất ngờ.</li>
  <li><em class="en">The usual suspects</em>: những nghi phạm quen thuộc.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson11/Lesson11.java</code>. Có 5 bài: render prefix đúng thứ tự, đếm phần prefix còn khớp sau một thay đổi,
kiểm tra cách đặt breakpoint (tối đa 4, nội dung thay đổi phải nằm sau breakpoint cuối), tính chi phí có cache theo TTL,
và quyết định có đáng cache không (kể cả ngưỡng tối thiểu theo model). Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-11"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-11 --live"</code>: chương trình gửi cùng một system prompt dài (có cache_control) hai lần
để bạn thấy token ghi cache rồi token đọc cache, sau đó nhét giờ hiện tại vào đầu system để thấy cache bị phá.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Prompt caching giải quyết vấn đề gì?', options: ['Câu trả lời bị cắt giữa chừng', 'Trả tiền lại cho phần prompt lặp lại', 'Lỗi 429 khi gọi quá nhanh', 'Câu trả lời không đúng định dạng JSON'], answer: 1, explain: '"Every time you send a long system prompt or a big set of tools, the model reprocesses all of it, and you pay for all of it. Prompt caching is how you stop that waste."' },
    { q: 'Mỗi request được đặt tối đa bao nhiêu cache_control breakpoint?', options: ['1', '2', '4', 'Không giới hạn'], answer: 2, explain: '"You get up to four of them per request, each one closing off a cacheable prefix."' },
    { q: 'TTL mặc định của một mục cache là bao lâu?', options: ['5 phút', '1 giờ', '24 giờ', '30 giây'], answer: 0, explain: '"The default is a five-minute ephemeral window, and there\'s a longer one-hour option when you need it."' },
    { q: 'Prefix được render theo thứ tự nào?', options: ['messages, system, tools', 'system, messages, tools', 'system, tools, messages', 'tools, system, messages'], answer: 3, explain: '"The model renders tools first, then the system prompt, then the messages."' },
    { q: 'Bạn sửa một ký tự trong system prompt (đứng sau tools). Phần nào còn dùng được cache?', options: ['Toàn bộ prompt', 'Chỉ phần tools phía trước', 'Chỉ phần messages phía sau', 'Không phần nào vì đổi system thì đổi cả tools'], answer: 1, explain: '"Change a single byte anywhere inside the prefix, and you invalidate everything from that point on." Tools nằm trước nên vẫn khớp; từ system trở đi thì không.' },
    { q: 'Câu nào ĐÚNG về cách cache so khớp?', options: ['Khớp gần đúng theo ý nghĩa', 'Khớp theo các từ khóa quan trọng xuất hiện ở bất kỳ đâu trong prompt', 'Chính xác từng byte, và chỉ tính từ đầu', 'Khớp mọi đoạn giống nhau ở bất kỳ đâu'], answer: 2, explain: '"There\'s no fuzzy matching and no partial credit. It\'s byte exact, and it\'s prefix only."' },
    { q: 'Breakpoint nên đặt ở đâu?', options: ['Ở ranh giới ổn định', 'Ở cuối lượt user mới nhất', 'Ở giữa mỗi đoạn văn dài', 'Ở trước mọi tool'], answer: 0, explain: '"You put them at stability boundaries, the points where content stops changing."' },
    { q: 'Một breakpoint đặt ở block system cuối cùng sẽ cache những gì?', options: ['Chỉ block system đó', 'Chỉ messages', 'Toàn bộ request kể cả lượt user mới', 'Tools và system cùng nhau'], answer: 3, explain: '"A breakpoint on your last system block caches your tools and your system prompt together as one chunk, since tools render before system."' },
    { q: 'Lượt user hiện tại (thay đổi mỗi lần) nên nằm ở đâu so với breakpoint?', options: ['Trước breakpoint đầu tiên', 'Sau breakpoint cuối cùng', 'Giữa hai breakpoint', 'Trong system prompt'], answer: 1, explain: '"Push anything volatile, like the current user turn, after your final breakpoint. That way, the changing content never reaches into the cached prefix."' },
    { q: 'Với TTL 5 phút, điều gì giữ cho prefix "ấm" khi lưu lượng đều?', options: ['Server tự gia hạn mỗi giờ', 'Bạn phải gửi request làm mới riêng', 'Mỗi lần đọc làm mới thời hạn', 'TTL 5 phút không bao giờ hết hạn'], answer: 2, explain: '"By default, an entry uses the five-minute ephemeral window, and every read refreshes it. So under steady traffic, your prefix just stays warm."' },
    { q: 'Khi nào nên chọn TTL 1 giờ?', options: ['Khi các lần gọi cách nhau xa hơn 5 phút', 'Khi muốn ghi cache rẻ hơn', 'Khi prefix dưới ngưỡng tối thiểu', 'Khi dùng nhiều model khác nhau'], answer: 0, explain: '"When your calls are spaced further apart, you can opt into the one-hour window... It survives those longer gaps, but it costs more to write."' },
    { q: 'Đọc cache tốn bao nhiêu so với giá input cơ bản?', options: ['125%', '200%', '50%', '10%'], answer: 3, explain: '"A cache read, a hit, costs 10% the cost, so served from cache tokens are roughly a tenth of the normal price."' },
    { q: 'Ghi một mục cache 5 phút tốn bao nhiêu?', options: ['Bằng giá cơ bản', 'Đắt hơn 25%', 'Gấp đôi', 'Miễn phí'], answer: 1, explain: '"Writing a five-minute entry costs 25% more, a small one-time premium."' },
    { q: 'Ghi một mục cache 1 giờ tốn bao nhiêu?', options: ['10% giá cơ bản', 'Đắt hơn 25%', 'Gấp đôi giá cơ bản', 'Gấp mười giá cơ bản'], answer: 2, explain: '"Writing a one-hour entry costs double, the price of the longer window."' },
    { q: 'Vì sao chiến lược caching có lời?', options: ['Vì đọc rẻ bù lại phí ghi', 'Vì ghi cache được giảm giá', 'Vì cache làm câu trả lời ngắn hơn', 'Vì token output được miễn phí'], answer: 0, explain: '"The whole strategy only works because a cheap read at 10% the cost, repeated enough times, more than pays back the premium you spent writing the entry once."' },
    { q: 'Với TTL 5 phút, mục cache hoàn vốn sau khoảng bao nhiêu lần dùng lại?', options: ['Khoảng 10 lần', 'Khoảng 5 lần', 'Không bao giờ', 'Khoảng một lần'], answer: 3, explain: '"With the five-minute window, an entry roughly pays for itself after about one reuse, because a write at 25% more plus a read at 10% the cost beats paying full price twice."' },
    { q: 'Prefix 10.000 token, gọi 3 lần, TTL 5 phút, cache còn sống suốt. Chi phí input của prefix (theo token quy đổi) là bao nhiêu?', options: ['30.000', '14.500', '12.500', '22.000'], answer: 1, explain: 'Lần đầu ghi: 10.000 × 1,25 = 12.500; hai lần sau đọc: 2 × 10.000 × 0,1 = 2.000. Tổng 14.500, so với 30.000 nếu không cache.' },
    { q: 'Một prefix hầu như không bao giờ được dùng lại. Bật caching cho nó thì sao?', options: ['Vẫn rẻ hơn vì đọc chỉ 10%', 'Không đổi chi phí', 'Đắt hơn gửi lại bình thường', 'Bị API từ chối'], answer: 2, explain: '"If a prefix is barely reused, caching it costs you more than just resending it."' },
    { q: 'Prefix dài 1.500 token gửi tới Opus 4.7. Điều gì xảy ra?', options: ['Không được cache, không báo lỗi', 'Được cache bình thường', 'API trả lỗi 400', 'Được cache một nửa'], answer: 0, explain: '"It\'s 1024 tokens on Opus 4.8 and 2048 on Opus 4.7. Come in under the floor and nothing gets cached. You won\'t see an error."' },
    { q: 'Dấu hiệu nào cho thấy prefix dưới ngưỡng nên không được cache?', options: ['HTTP 400', 'stop_reason "cache_miss"', 'Một cảnh báo trong header', 'cache_creation_input_tokens bằng 0'], answer: 3, explain: '"You\'ll just see cache creation input tokens come back as zero, which is easy to miss."' },
    { q: 'Bạn đang có cache "nóng" trên một model rồi chuyển sang model khác giữa chừng. Kết quả?', options: ['Cache được chuyển sang model mới', 'Trượt cache hoàn toàn', 'Cache dùng được một nửa', 'Model mới đọc cache với giá 25%'], answer: 1, explain: '"Caches are tied to a specific model. Switch models mid-flow and you take a full miss."' },
    { q: 'Trường usage nào cần theo dõi để chứng minh cache đang chạy?', options: ['output_tokens', 'input_tokens', 'cache_read_input_tokens', 'stop_reason'], answer: 2, explain: '"The one to watch is cache read input tokens. Make two calls with an identical prefix, and on the second you should see that number climb."' },
    { q: 'Hai lần gọi giống hệt nhau nhưng cache_read_input_tokens vẫn bằng 0. Nghi phạm nào KHÔNG thuộc danh sách trong bài?', options: ['Dùng TTL 5 phút thay vì 1 giờ', 'Dấu ngày giờ trong system prompt', 'JSON không sắp xếp khóa giống nhau', 'Bộ tool thay đổi giữa các lần gọi'], answer: 0, explain: 'Nghi phạm quen thuộc: "a date time stamp baked into your system prompt, JSON whose keys aren\'t sorted the same way each time, or a tool set that shifts between calls."' },
    { q: 'Vì sao một bộ tool thay đổi giữa các lần gọi đặc biệt tai hại cho cache?', options: ['Vì tool không được cache', 'Vì tool làm tăng output', 'Vì tool chỉ cache được 1 giờ', 'Vì tools nằm ngay đầu prefix'], answer: 3, explain: '"A tool set that shifts between calls, since tools sit at the very front of the prefix."' },
    { q: 'Quy tắc thiết kế gói gọn nhất của bài là gì?', options: ['Càng nhiều breakpoint càng tốt', 'Ổn định trước, thay đổi sau', 'Luôn dùng TTL 1 giờ', 'Đặt lượt user lên đầu'], answer: 1, explain: '"Stable first, volatile last."' },
    { q: 'System prompt bắt đầu bằng "Hôm nay là 2026-10-26 14:03". Có vấn đề gì?', options: ['Không có vấn đề', 'Model không hiểu định dạng ngày', 'Prefix đổi mỗi lần, không khớp cache', 'Ngày giờ làm tăng token output'], answer: 2, explain: 'Dấu ngày giờ là "usual suspect": nó đổi mỗi lần gọi và nằm sớm trong prefix, nên mọi thứ từ đó trở đi không còn khớp.' },
    { q: 'Prefix 5.000 token, gọi 2 lần trong 5 phút, trên Opus 4.8. Chọn TTL nào thì caching có lời?', options: ['5 phút', '1 giờ', 'Cả hai đều có lời như nhau', 'Không TTL nào có lời'], answer: 0, explain: '5 phút: 1,25 + 0,1 = 1,35 lần giá, rẻ hơn 2 lần. 1 giờ: 2 + 0,1 = 2,1 lần giá, đắt hơn gửi lại bình thường.' },
    { q: 'Ngưỡng tối thiểu để cache trên Opus 4.8 là bao nhiêu token?', options: ['512', '4096', '2048', '1024'], answer: 3, explain: '"It\'s 1024 tokens on Opus 4.8 and 2048 on Opus 4.7."' },
    { q: 'Câu nào là phần tổng kết đúng của bài?', options: ['Cache khớp theo ý nghĩa và luôn có lời', 'Khớp prefix chính xác, tối đa 4 breakpoint, TTL 5 phút hoặc 1 giờ, có lời khi dùng lại', 'Mỗi request chỉ cần một breakpoint ở đầu', 'TTL 1 giờ luôn rẻ hơn TTL 5 phút'], answer: 1, explain: '"Prompt caching reuses a byte exact prefix over the tools system messages order. You mark it with up to four break points, pick a five minute or one hour time to live, and it pays off when cheap reads outweigh the write cost."' },
    { q: 'Vì sao bài học nhắc "name the model for the minimum prefix"?', options: ['Vì giá đọc cache khác nhau theo model', 'Vì TTL khác nhau theo model', 'Vì ngưỡng token tối thiểu để cache phụ thuộc model', 'Vì số breakpoint tối đa khác nhau theo model'], answer: 2, explain: '"A prefix has to reach a minimum token count before it caches at all, and that minimum depends on the model."' },
  ],
};
