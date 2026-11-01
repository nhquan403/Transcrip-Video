window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Prompt caching chỉ "trúng" khi phần <strong>prefix</strong> của request giống nhau <strong>từng byte</strong> giữa các lần gọi.
Prefix luôn được ghép theo thứ tự cố định <strong>tools → system → messages</strong>, và bạn đánh dấu chỗ kết thúc phần cache bằng <strong>cache_control breakpoint</strong> (tối đa 4 cái mỗi request).
Bật cache mà hóa đơn không giảm, <strong>cache read</strong> cứ bằng 0 → gần như chắc chắn có một byte nào đó đang thay đổi trong prefix.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Cache control breakpoint</strong>: dấu mốc bạn gắn lên một block, "khóa" phần prefix có thể cache ngay tại điểm đó. Tối đa <strong>4</strong> cái mỗi request.</li>
  <li><strong>Rendered prefix</strong>: toàn bộ nội dung từ đầu request tới breakpoint, được ghép theo thứ tự <strong>tools → system → messages</strong>.</li>
  <li><strong>Cache key</strong>: chính là các byte đã render của prefix. So khớp <strong>byte-for-byte</strong>, không bao giờ "gần đúng", và chỉ khớp theo <strong>prefix</strong>.</li>
  <li><strong>Frozen prefix</strong>: nửa đầu ổn định (tools, system prompt, lịch sử hội thoại đã "chốt") – cache một lần, dùng lại nhiều lần.</li>
  <li><strong>Volatile tail</strong>: nửa sau hay đổi: lượt user mới nhất, dữ liệu riêng từng request.</li>
  <li><strong>Minimum cacheable length</strong>: số token tối thiểu để prefix được cache, tùy model.</li>
  <li><strong>cache_read_input_tokens</strong>: trường usage cho biết bao nhiêu token được đọc từ cache – thước đo để chứng minh cache đang chạy.</li>
</ul>

<h3>Thứ tự render: tools → system → messages</h3>
<p>Trước khi tìm cache, API luôn ghép request theo <strong>một thứ tự cố định</strong>: <strong>tools</strong> đứng đầu, rồi <strong>system prompt</strong>, cuối cùng là <strong>messages</strong> theo thứ tự hội thoại. Thứ tự này không bao giờ đổi.</p>
<ul>
  <li>Hệ quả hữu ích: đặt <strong>một breakpoint ở block system cuối cùng</strong> là bạn cache được <strong>cả tools lẫn toàn bộ system prompt</strong> trong một khối, vì tools đã render trước system.</li>
  <li>Vì vậy thứ tự không phải chuyện vặt: nó cho biết chính xác một breakpoint sẽ kéo cái gì vào cache và không kéo cái gì.</li>
  <li>Người ta hay nhớ ngược (system trước tools) – đề thi rất thích bẫy chỗ này.</li>
</ul>

<h3>Đặt breakpoint ở đâu: ổn định ở trước, hay đổi ở sau</h3>
<div class="box">📚 <strong>Hình dung thế này:</strong> Prefix giống một chồng sách xếp theo thứ tự. Thủ thư chỉ nhận ra "chồng này đã có rồi" khi <strong>từng cuốn, từ dưới lên, giống y hệt</strong>.
Bạn chỉ được thay đổi những cuốn <strong>trên cùng</strong> (sau breakpoint cuối). Rút hay đổi một cuốn ở giữa là mọi cuốn phía trên nó coi như mới hoàn toàn.</div>
<ul>
  <li>Quy tắc đặt: <strong>đặt breakpoint ở chỗ nội dung ngừng thay đổi</strong>. System prompt lớn và tools là vị trí tự nhiên vì hiếm khi đổi giữa các lần gọi.</li>
  <li>Đẩy <strong>mọi thứ hay đổi ra sau breakpoint cuối cùng</strong>: lượt user hiện tại, biến riêng từng request.</li>
  <li>Lý do: một thay đổi <strong>bất kỳ chỗ nào trong prefix</strong> làm cache mất hiệu lực <strong>từ điểm đó trở về sau</strong>.</li>
  <li>Cả bài gói gọn trong việc vạch một đường ranh rõ ràng: <strong>frozen prefix</strong> trước breakpoint, <strong>volatile tail</strong> sau breakpoint. Trộn lẫn thì request nào cũng chạm vào prefix và mất cache hit.</li>
</ul>

<h3>Hội thoại dài: dời breakpoint theo và nhớ giới hạn ~20 block</h3>
<ul>
  <li>Lúc đầu prefix ngắn. Khi chat dài ra, các lượt cũ "chốt lại", không đổi nữa → bạn <strong>dời breakpoint về phía trước</strong> để cache luôn phần lịch sử đó.</li>
  <li>Giới hạn cơ học: một breakpoint chỉ <strong>nhìn ngược khoảng 20 content block</strong> để tìm bản cache trước đó.</li>
  <li>Trong agent chạy dài với nhiều tool call và tool result, rất dễ vượt 20 block giữa hai mốc → thêm <strong>breakpoint trung gian</strong> để mỗi đoạn nằm trong cửa sổ lookback.</li>
</ul>

<h3>Ngưỡng token tối thiểu và cách kiểm chứng</h3>
<ul>
  <li>Prefix phải đạt <strong>số token tối thiểu</strong> mới được cache, và ngưỡng này <strong>tùy model</strong>. Theo bài giảng: <strong>1024 token trên Opus 4.8</strong>, thấp hơn ở một số model khác, ví dụ <strong>512 trên Fable 5</strong>.</li>
  <li>Cùng một prefix có thể cache tốt trên model này nhưng <strong>âm thầm không cache</strong> trên model kia. Dưới ngưỡng thì <strong>không có lỗi</strong>, chỉ thấy cache creation bằng 0. Luôn nói rõ đang gọi model nào.</li>
  <li>Kiểm chứng: gửi hai request có prefix giống hệt, ở lần hai <strong>cache_read_input_tokens</strong> phải tăng. Nếu cứ bằng 0 → có gì đó đang phá prefix.</li>
  <li>Tổng kích thước prompt = <strong>input chưa cache + cache creation tokens + cache read tokens</strong>, không chỉ trường input.</li>
</ul>

<h3>4 lỗi "âm thầm" phá cache (không báo lỗi gì)</h3>
<ol>
  <li><strong>Nội dung hay đổi trong system prompt</strong>: timestamp, UUID, session ID → byte đổi mỗi lần, không bao giờ khớp.</li>
  <li><strong>JSON không sắp xếp key</strong>: serialize tools/dữ liệu với thứ tự key khác nhau → nội dung như nhau nhưng byte khác.</li>
  <li><strong>Bộ tools thay đổi</strong>: tools ở đầu prefix, thêm hay đổi thứ tự một tool là vô hiệu hóa mọi thứ phía sau.</li>
  <li><strong>Đổi model</strong>: cache gắn với từng model, chuyển cùng prefix sang model khác là miss hoàn toàn.</li>
</ol>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có "bật caching nhưng cache read luôn bằng 0" → tìm <strong>byte thay đổi trong prefix</strong>: timestamp, JSON không sort, tool set đổi, đổi model, hoặc prefix dưới ngưỡng.</li>
  <li>Đề hỏi "một breakpoint ở system block cuối cache được gì" → <strong>tools + system</strong>, vì thứ tự là tools → system → messages.</li>
  <li>Đề có agent dài nhiều tool call, cache không trúng phần lịch sử → <strong>thêm breakpoint trung gian</strong> (lookback ~20 block).</li>
  <li>Đề hỏi cách chứng minh cache hoạt động → xem <strong>cache_read_input_tokens</strong> ở lần gọi thứ hai.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Thứ tự là system → tools → messages" → <strong>sai</strong>, tools luôn đứng đầu.</li>
  <li>"Cache khớp gần đúng, khác một chút vẫn được" → <strong>sai</strong>, khớp byte-for-byte và chỉ theo prefix.</li>
  <li>"Prefix ngắn quá thì API báo lỗi" → <strong>sai</strong>, nó im lặng không cache, cache creation = 0.</li>
  <li>"Cache dùng chung giữa các model" → <strong>sai</strong>, cache gắn với từng model.</li>
  <li>"Cứ thêm thật nhiều breakpoint" → <strong>sai</strong>, tối đa 4 mỗi request, đặt ở chỗ nội dung ổn định.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>"Tools – System – Messages; đóng băng phía trước, để thay đổi phía sau."</strong> Cache read bằng 0 thì đi tìm <strong>một byte đang nhúc nhích</strong>.</p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
