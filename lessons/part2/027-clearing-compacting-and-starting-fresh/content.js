window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Phiên chạy quá lâu là nơi chất lượng lặng lẽ "chết": model theo chỉ dẫn kém hơn mà mỗi lời gọi lại đắt hơn.
Bạn có <strong>ba cách reset</strong>, từ nhẹ tới nặng: <strong>compact</strong> (tóm tắt rồi đi tiếp), <strong>clear</strong> (xóa sạch cửa sổ ngay tại chỗ),
và <strong>start fresh</strong> (mở phiên mới, re-ground từ CLAUDE.md và memory). Chỉ <strong>cấu hình bền</strong> sống sót qua mọi reset, nên hãy <strong>handoff một bản tóm tắt trước</strong>.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Compact (nén):</strong> tóm tắt phần lịch sử cũ thành một bản recap gọn, giữ lượt gần đây và quyết định chính, giải phóng nhiều chỗ mà không mất mạch.</li>
  <li><strong>Clear (xóa):</strong> xóa hội thoại, làm lại <strong>cùng phiên</strong> với cửa sổ trống; không gì từ trước được mang theo.</li>
  <li><strong>Start fresh (bắt đầu mới):</strong> mở một phiên mới hoàn toàn và re-ground nó từ CLAUDE.md và memory.</li>
  <li><strong>Lossless:</strong> không mất mát thông tin. Compaction thì <strong>không</strong> lossless.</li>
  <li><strong>Nested CLAUDE.md:</strong> file CLAUDE.md nằm trong thư mục con, không phải ở gốc dự án.</li>
  <li><strong>Handoff (bàn giao):</strong> ghi lại những gì bước tiếp theo cần trước khi reset.</li>
</ul>

<h3>Ba "đòn bẩy", từ nhẹ tới nặng</h3>
<ol>
  <li><strong>Compact:</strong> tóm tắt lịch sử cũ, giữ lượt gần đây và quyết định chính, đi tiếp mà không đứt mạch.</li>
  <li><strong>Clear:</strong> xóa hội thoại, làm lại cùng phiên với cửa sổ trống.</li>
  <li><strong>Start fresh:</strong> phiên mới hoàn toàn, re-ground từ CLAUDE.md và memory; đúng lựa chọn khi phiên cũ đã trôi xa thật sự.</li>
</ol>
<p>Chọn cái nào tùy vào bạn muốn <strong>giữ bao nhiêu</strong> và muốn <strong>bỏ bao nhiêu</strong>.</p>

<h3>Compact và clear: hai thứ nghe giống mà ngược nhau</h3>
<ul>
  <li><strong>Compact giữ sự liên tục:</strong> lượt cũ thành recap, nhưng mạch vẫn chạy, quyết định gần đây và nhiệm vụ hiện tại còn ở dạng cô đọng. Bạn hầu như không thấy "đường nối".</li>
  <li><strong>Clear làm trống hoàn toàn:</strong> trong cùng phiên, không gì từ hội thoại trước được mang theo. Dùng khi ngữ cảnh đã thành <strong>gánh nặng nhiều hơn là giúp</strong>.</li>
</ul>
<p><strong>Phép thử nhanh:</strong> muốn <strong>đi tiếp với ít hành lý hơn</strong>? Compact. Muốn <strong>xóa và làm lại tại chỗ</strong>? Clear.</p>

<h3>Compaction không lossless: cái gì còn, cái gì rơi</h3>
<ul>
  <li><strong>Còn:</strong> CLAUDE.md ở <strong>gốc dự án</strong> (đọc lại từ đĩa và chèn lại sau compaction); <strong>lượt gần đây</strong> và <strong>quyết định chính</strong> (nằm trong bản tóm tắt).</li>
  <li><strong>Có thể rơi:</strong> <strong>chi tiết đầu phiên</strong> (những điểm nhỏ từ lúc mới bắt đầu); <strong>CLAUDE.md lồng trong thư mục con</strong>, vì chúng không tự chèn lại.</li>
</ul>
<p>Bài học: chỉ dẫn nào <strong>bắt buộc phải sống sót</strong> thì đặt vào <strong>config ở gốc dự án</strong>, đừng để trong một tin nhắn đầu phiên mà bản tóm tắt có thể lặng lẽ đánh rơi.</p>

<h3>Ba thứ qua một lần reset</h3>
<ul>
  <li><strong>CLAUDE.md gốc:</strong> đọc lại từ đĩa, chèn lại sau compaction; <strong>thứ đáng tin cậy</strong>.</li>
  <li><strong>CLAUDE.md lồng nhau:</strong> không tự chèn lại; chỉ nạp lại <strong>lần sau Claude đọc một file trong đúng thư mục con đó</strong>. Đừng trông vào chúng giữa phiên.</li>
  <li><strong>Ghi chú chỉ nói trong chat:</strong> không được ghi lại thì <strong>mất</strong>. Quan trọng thì thêm vào CLAUDE.md.</li>
</ul>
<p>Tóm gọn: <strong>config gốc còn, config lồng nạp lại "lười", chat chưa lưu thì mất</strong>.</p>

<h3>Khi nào nên mở phiên mới thay vì compact?</h3>
<ol>
  <li><strong>Drift:</strong> phiên đã đi lạc xa khỏi việc bạn cần; tóm tắt bao nhiêu cũng không kéo về gọn được, làm lại nhanh hơn.</li>
  <li><strong>Runaway bloat:</strong> rác chồng lên nhanh hơn tốc độ bạn prune kịp.</li>
  <li><strong>Đổi việc thật sự:</strong> chuyển sang việc không liên quan, không có ngữ cảnh chung nào hữu ích.</li>
</ol>
<p>Cả ba trường hợp: mở cửa sổ mới, re-ground từ config và memory. Bạn không mất gì quan trọng, vì <strong>thứ bền chưa bao giờ nằm trong cửa sổ</strong>.</p>

<h3>Bốn thiết lập để điều khiển state lâu dài</h3>
<ul>
  <li><strong><code>cleanupPeriodDays</code>:</strong> dữ liệu phiên nằm trên đĩa bao lâu trước khi bị dọn; mặc định <strong>30 ngày</strong>.</li>
  <li><strong>File checkpointing:</strong> bật lên để <strong>tua lại thay đổi file</strong> về một điểm trước đó trong phiên; một tấm lưới an toàn.</li>
  <li><strong>Bật/tắt auto memory:</strong> memory xuyên phiên của Claude chỉ được giữ khi bạn muốn.</li>
  <li><strong>Compaction theo yêu cầu:</strong> không cần đợi cửa sổ đầy; tự kích hoạt compaction ở một điểm nghỉ tự nhiên.</li>
</ul>

<h3>Phiên mới không thật sự "trắng"</h3>
<ul>
  <li><strong>CLAUDE.md</strong> nạp tự động, quy tắc bền quay lại ngay khi phiên bắt đầu.</li>
  <li><strong>Auto memory</strong> cũng nạp, nhưng có giới hạn: chỉ <strong>phần đầu chỉ mục MEMORY.md</strong> vào lúc bắt đầu; các <strong>topic file</strong> được kéo vào khi cần, nên tải ban đầu rẻ.</li>
  <li><strong>settings.json</strong> áp lại permissions, hooks và environment, nên harness cư xử y như trước.</li>
</ul>

<h3>Thói quen gắn tất cả lại: handoff sạch</h3>
<div class="box">🧳 <strong>Hình dung thế này:</strong> bàn giao ca trực ở bệnh viện. Y tá ca trước không đưa cho ca sau cả chồng giấy nháp cả ngày;
họ viết <strong>một tờ bàn giao</strong>: đã quyết gì, bệnh nhân nào còn đang theo dõi. Thông tin cố định (dị ứng thuốc) thì đã nằm sẵn trong
<strong>hồ sơ bệnh án</strong>. Bàn giao xong, giấy nháp vứt đi không tiếc. Reset phiên cũng vậy: tóm tắt + CLAUDE.md, rồi bỏ lịch sử thô.</div>
<ol>
  <li>Trước khi reset, hỏi: <strong>bước tiếp theo thật sự cần gì?</strong> Chỉ mang thứ đó theo.</li>
  <li>Viết <strong>tóm tắt ngắn</strong> các quyết định và những việc còn dở.</li>
  <li>Lưu <strong>sự thật bền</strong> vào CLAUDE.md hoặc memory, đừng chôn trong chat.</li>
  <li>Ghi xong rồi thì <strong>bỏ lịch sử thô</strong> không cần nghĩ lại.</li>
</ol>
<p>Handoff có chủ đích <strong>luôn hơn</strong> việc hy vọng ngữ cảnh cũ tự bám lại. Khi đó reset không còn đáng sợ, mà giống một <strong>checkpoint sạch</strong>.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Compact để thu nhỏ lịch sử và đi tiếp; clear để làm trống cửa sổ tại chỗ; start fresh khi phiên đã trôi, bloat mất kiểm soát hoặc đổi việc.</li>
  <li>Compaction không lossless: CLAUDE.md gốc được chèn lại, CLAUDE.md lồng nhau chỉ nạp lại khi đọc file trong thư mục đó, chat chưa lưu thì mất.</li>
  <li>Chỉ cấu hình bền sống sót, nên handoff một bản tóm tắt và lưu sự thật bền vào CLAUDE.md/memory trước khi reset.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">where quality quietly dies</em>: nơi chất lượng lặng lẽ chết.</li>
  <li><em class="en">from lightest to heaviest</em>: từ nhẹ nhất tới nặng nhất.</li>
  <li><em class="en">without losing the thread</em>: mà không đứt mạch.</li>
  <li><em class="en">You barely feel the seam</em>: bạn hầu như không thấy đường nối.</li>
  <li><em class="en">more baggage than help</em>: gánh nặng nhiều hơn là giúp ích.</li>
  <li><em class="en">a blank slate</em>: một trang trắng, làm lại từ đầu.</li>
  <li><em class="en">It isn't lossless</em>: nó không giữ nguyên vẹn thông tin.</li>
  <li><em class="en">don't count on them mid-session</em>: đừng trông cậy vào chúng giữa phiên.</li>
  <li><em class="en">nested reloads lazily</em>: file lồng nhau nạp lại một cách "lười" (khi cần mới nạp).</li>
  <li><em class="en">a nice safety net</em>: một tấm lưới an toàn tốt.</li>
  <li><em class="en">without a second thought</em>: không cần nghĩ lại, không lăn tăn.</li>
  <li><em class="en">Match the reset to the mess</em>: chọn cách reset hợp với mức độ bừa bộn.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson27/Lesson27.java</code>. Có 5 bài: chọn compact, clear hay start fresh cho một tình huống;
xác định thứ gì còn nguyên sau compaction; kiểm tra một CLAUDE.md lồng nhau đã được nạp lại chưa dựa trên các file Claude đọc sau compaction;
áp <code>cleanupPeriodDays</code> (mặc định 30 ngày) để biết dữ liệu phiên còn được giữ không; và chia ghi chú trước khi reset thành
phần đi vào bản tóm tắt, phần đi vào CLAUDE.md, phần bỏ đi. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-27"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-27 --live"</code>: handoff của bạn được dùng để mở một "phiên mới" chỉ gồm
CLAUDE.md và bản tóm tắt (bỏ hết hội thoại thô), rồi Claude nói lại đã quyết gì và bước tiếp theo là gì.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Xếp ba cách reset theo thứ tự từ nhẹ nhất tới nặng nhất.', options: ['Clear, compact, start fresh', 'Compact, clear, start fresh', 'Start fresh, clear, compact', 'Compact, start fresh, clear'], answer: 1, explain: '"Let\'s start with the three moves you have, from lightest to heaviest. First, compact... Second, clear... Third, start fresh."' },
    { q: 'Bạn đang làm dở một nhiệm vụ, cửa sổ nặng nề nhưng các quyết định gần đây vẫn cần. Nên dùng cách nào?', options: ['Clear, vì nhanh nhất', 'Start fresh với một repo mới', 'Compact để đi tiếp nhẹ hơn', 'Không làm gì, model sẽ tự dọn'], answer: 2, explain: '"So the quick test is this. Do you want to keep going with less weight? Compact. Do you want to wipe and restart in place? Clear."' },
    { q: 'Điều nào mô tả đúng "clear"?', options: ['Làm trống cửa sổ ngay trong phiên này', 'Tóm tắt lịch sử cũ và giữ lượt gần đây', 'Mở phiên mới và nạp lại memory', 'Chỉ xóa tool output, giữ hội thoại'], answer: 0, explain: '"Clearing is the opposite. It empties the window completely in the same session, and nothing from the prior conversation carries forward at all."' },
    { q: 'Vì sao bài nhấn mạnh rằng compaction "không lossless"?', options: ['Vì nó xóa luôn CLAUDE.md ở gốc dự án', 'Vì nó chỉ hoạt động khi cửa sổ đầy', 'Vì nó làm đổi model đang dùng', 'Vì tóm tắt thì bỏ bớt chi tiết'], answer: 3, explain: '"It isn\'t lossless. It\'s a summary, and summaries throw detail away, so you need to know what\'s protected and what isn\'t."' },
    { q: 'Sau compaction, CLAUDE.md ở gốc dự án ra sao?', options: ['Mất cho tới phiên sau', 'Được đọc lại từ đĩa và chèn lại', 'Chỉ còn ở dạng cô đọng trong bản tóm tắt', 'Phải tự dán lại bằng tay sau mỗi lần nén'], answer: 1, explain: '"Your project root Claude.md is safe. It gets re-read from disk and re-injected after a compaction, so your standing rules survive intact."' },
    { q: 'Thứ nào sau đây CÓ THỂ rơi mất khi compaction?', options: ['CLAUDE.md ở gốc dự án', 'Các quyết định chính', 'Chi tiết nhỏ từ đầu phiên', 'Những lượt hội thoại gần đây'], answer: 2, explain: '"What can fall away is early prompt detail, the fine points from the start of the conversation, and nested Claude.md files in subdirectories, which don\'t re-inject on their own."' },
    { q: 'Một quy tắc đặt trong src/api/CLAUDE.md. Sau compaction, khi nào quy tắc đó quay lại?', options: ['Khi Claude đọc file trong src/api', 'Ngay sau compaction, như file ở gốc', 'Chỉ khi bạn mở phiên mới', 'Không bao giờ quay lại nữa'], answer: 0, explain: '"Nested Claude.md files... These aren\'t re-injected automatically. They only reload the next time Claude reads a file in that same subdirectory, so don\'t count on them mid-session."' },
    { q: 'Ở đầu phiên bạn gõ: "Luôn dùng tabs, không dùng spaces." Bạn muốn quy tắc này sống qua mọi lần compaction. Nên làm gì?', options: ['Gõ lại nó sau mỗi lần compaction', 'Đặt nó trong CLAUDE.md của một thư mục con', 'Tắt auto memory để nó không bị ghi đè', 'Đưa nó vào config ở gốc dự án'], answer: 3, explain: '"If a piece of guidance has to survive, put it in your project root config, not in an early message that a summary might quietly drop."' },
    { q: 'Câu nào tóm đúng số phận của ba loại chỉ dẫn qua một lần reset?', options: ['Cả ba đều được giữ nguyên', 'Gốc còn, lồng nạp lại lười, chat chưa lưu thì mất', 'Gốc mất, lồng còn, còn chat thì nằm lại trong bản tóm tắt', 'Chỉ chat còn, vì nó mới nhất'], answer: 1, explain: '"Root config persists, nested reloads lazily, and unsaved chat is gone."' },
    { q: 'Một ghi chú quan trọng bạn chỉ nói trong chat mà chưa ghi lại ở đâu. Khi reset thì sao?', options: ['Được lưu tự động vào CLAUDE.md', 'Luôn nằm trong bản tóm tắt compaction', 'Mất; muốn giữ thì ghi vào CLAUDE.md', 'Được chuyển sang auto memory'], answer: 2, explain: '"Conversation-only notes. Anything you said in chat but never wrote down simply doesn\'t survive. If it matters, add it to Claude.md so it\'s there next time."' },
    { q: 'Tình huống nào là lý do hợp lý để mở phiên mới thay vì compact?', options: ['Phiên đã trôi xa khỏi việc bạn thật sự cần', 'Bạn vừa ra một quyết định quan trọng', 'Bạn muốn giữ nguyên mạch làm việc', 'Cửa sổ mới dùng hết một phần nhỏ'], answer: 0, explain: '"The first is drift. If the session has wandered a long way from the task you actually want done, no amount of summarizing pulls it back cleanly, and a fresh start is faster."' },
    { q: 'Thứ nào KHÔNG nằm trong ba tình huống bài nêu để bắt đầu phiên mới?', options: ['Drift khỏi nhiệm vụ', 'Rác chồng nhanh hơn tốc độ prune', 'Chuyển sang việc không liên quan', 'Muốn đi tiếp với ít hành lý hơn'], answer: 3, explain: '"The second is runaway bloat... And the third is a genuine task switch." Đi tiếp với ít hành lý hơn là tình huống của compact.' },
    { q: 'Vì sao bắt đầu phiên mới không làm bạn mất gì quan trọng (nếu làm đúng)?', options: ['Vì phiên mới tự sao chép phiên cũ', 'Vì thứ bền chưa bao giờ nằm trong cửa sổ', 'Vì compaction chạy tự động trước đó', 'Vì server giữ toàn bộ lịch sử phiên trong 30 ngày'], answer: 1, explain: '"You\'re not losing anything important, because the durable stuff was never in the window to begin with."' },
    { q: 'cleanupPeriodDays điều khiển điều gì?', options: ['Bao lâu thì Claude tự chạy compaction một lần', 'Bao lâu auto memory được bật', 'Thời gian giữ dữ liệu phiên trên đĩa', 'Số ngày giữ checkpoint của file'], answer: 2, explain: '"The first is a retention setting, cleanup period days, which controls how long your session data stays on disk before it\'s cleaned up, defaulting to 30 days."' },
    { q: 'Không đặt cleanupPeriodDays. Dữ liệu phiên cũ 45 ngày có còn trên đĩa không?', options: ['Không, mặc định chỉ giữ 30 ngày', 'Có, mặc định giữ vĩnh viễn', 'Có, mặc định giữ 60 ngày', 'Chỉ còn nếu bật file checkpointing'], answer: 0, explain: '"Cleanup period days... controls how long your session data stays on disk before it\'s cleaned up, defaulting to 30 days."' },
    { q: 'Claude vừa sửa sai nhiều file và bạn muốn quay về trạng thái trước đó trong phiên. Thiết lập nào giúp?', options: ['Bật/tắt auto memory', 'cleanupPeriodDays', 'Compaction theo yêu cầu', 'File checkpointing'], answer: 3, explain: '"The second is file checkpointing. Turn it on and you can rewind file changes to an earlier point in the session, which is a nice safety net."' },
    { q: 'Bạn không muốn Claude giữ những điều nó học được sang các phiên sau. Thiết lập phù hợp?', options: ['Đặt cleanupPeriodDays bằng 0', 'Tắt auto memory', 'Xóa CLAUDE.md ở gốc', 'Tắt file checkpointing'], answer: 1, explain: '"The third is the auto-memory toggle. That switches Claude\'s own cross-session memory on or off, so learnings only persist when you want them to."' },
    { q: 'Bạn vừa xong một tính năng, đang ở điểm nghỉ tự nhiên, cửa sổ còn chưa đầy. Nhận định nào đúng?', options: ['Phải đợi cửa sổ đầy mới compact được', 'Chỉ có thể clear ở thời điểm này', 'Có thể tự kích hoạt compaction ngay bây giờ', 'Compaction chỉ chạy khi mở phiên mới'], answer: 2, explain: '"And the fourth is on-demand compaction. You don\'t have to wait for the window to fill. You can trigger a compaction yourself at a natural break."' },
    { q: 'Khi một phiên mới bắt đầu, phần nào của auto memory được nạp ngay?', options: ['Phần đầu chỉ mục MEMORY.md; topic file nạp khi cần', 'Toàn bộ chỉ mục cùng mọi topic file liên quan tới dự án', 'Không gì cả cho tới khi bạn yêu cầu', 'Chỉ topic file mới sửa gần nhất'], answer: 0, explain: '"Only the top of the memory.md index comes in at start, and topic files get pulled in on demand as they\'re needed, which keeps that load cheap."' },
    { q: 'Ở phiên mới, permissions, hooks và environment của bạn được áp lại nhờ đâu?', options: ['Bản tóm tắt compaction', 'CLAUDE.md ở gốc', 'Auto memory', 'settings.json'], answer: 3, explain: '"And your settings.json reapplies your permissions, hooks, and environment, so the harness behaves exactly the way it did before."' },
    { q: 'Điều nào KHÔNG được tự động mang sang phiên mới?', options: ['Quy tắc trong CLAUDE.md', 'Hội thoại thô của phiên trước', 'Phần đầu chỉ mục MEMORY.md', 'Permissions trong settings.json'], answer: 1, explain: '"Put those together and a fresh session inherits everything that\'s durable, while leaving the disposable conversation behind."' },
    { q: 'Trước khi reset, câu hỏi đầu tiên của một handoff sạch là gì?', options: ['Còn bao nhiêu token trong cửa sổ?', 'Có nên đổi sang model khác không?', 'Bước tiếp theo thật sự cần gì?', 'Nên xóa file nào trong repo?'], answer: 2, explain: '"Before you reset anything, ask what the next step actually needs, and carry only that forward."' },
    { q: 'Trong handoff, thông tin "lệnh chạy test là ./mvnw test" nên đi đâu?', options: ['CLAUDE.md hoặc memory', 'Bản tóm tắt tạm của lần reset này', 'Tin nhắn cuối cùng trong chat', 'Bỏ đi, Claude sẽ tự đoán lại'], answer: 0, explain: '"Save any durable facts to your Claude.md or to memory, not buried in the chat, where a reset will wipe them."' },
    { q: 'Bản tóm tắt handoff nên chứa những gì?', options: ['Toàn bộ log đã đọc trong phiên', 'Mọi tool output để khỏi đọc lại', 'Bản sao của settings.json', 'Quyết định đã ra và những việc còn dở'], answer: 3, explain: '"Write a short summary of the decisions you made, and the threads still open, so the thinking isn\'t lost."' },
    { q: 'Khi nào thì bỏ lịch sử thô "không cần nghĩ lại"?', options: ['Ngay khi cửa sổ dùng quá nửa', 'Khi điều rút ra đã được ghi lại', 'Chỉ khi đã bật file checkpointing từ trước', 'Không bao giờ, nên luôn giữ'], answer: 1, explain: '"Then, once the takeaways are safely recorded, you can drop the raw history without a second thought."' },
    { q: 'Đồng nghiệp nói: "Cứ reset đi, hy vọng Claude vẫn nhớ đủ." Theo bài, phản hồi tốt nhất?', options: ['Đúng, compaction luôn giữ đủ ngữ cảnh', 'Đúng, nếu đặt cleanupPeriodDays lớn', 'Handoff có chủ đích luôn hơn việc hy vọng', 'Sai, tuyệt đối không bao giờ nên reset'], answer: 2, explain: '"A deliberate handoff always beats hoping the old context somehow sticks around."' },
    { q: 'Theo bài, khi bạn handoff có chủ đích, reset trở thành gì?', options: ['Một checkpoint sạch', 'Một rủi ro cần tránh', 'Một bước bắt buộc mỗi giờ', 'Một cách tiết kiệm phí lưu trữ'], answer: 0, explain: '"When you hand off on purpose, resetting stops feeling risky and starts feeling like a clean checkpoint."' },
    { q: 'Điều cần lưu ý duy nhất trong phần recap là gì?', options: ['Clear luôn tốt hơn compact', 'Phiên mới nạp lại toàn bộ hội thoại', 'Compaction giữ được mọi chi tiết', 'Chỉ config bền sống sót, nên handoff tóm tắt trước'], answer: 3, explain: '"One thing to watch. Only durable config survives, so hand off a summary first."' },
    { q: 'Hai phiên chạy song song cho hai việc: sửa CSS và tối ưu truy vấn SQL. Bạn muốn chuyển phiên CSS sang việc SQL. Lựa chọn phù hợp nhất?', options: ['Compact phiên CSS rồi tiếp tục', 'Bắt đầu phiên mới, re-ground từ config và memory', 'Giữ nguyên phiên, chỉ đổi câu hỏi', 'Clear rồi dán lại toàn bộ hội thoại CSS vào phiên'], answer: 1, explain: '"And the third is a genuine task switch, when you\'re moving to something unrelated that shares no useful context with what you were doing. In all three cases, you open a fresh window and re-ground it from your config and memory."' },
    { q: 'Ngữ cảnh hiện tại đã thành gánh nặng, bạn muốn trang trắng nhưng vẫn ở đúng phiên này. Nên chọn?', options: ['Compact', 'Bật file checkpointing', 'Clear', 'Tắt auto memory'], answer: 2, explain: '"Reach for clearing when the current context has become more baggage than help, and you genuinely want a blank slate."' },
  ],
};
