window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Claude chọn từng token bằng cách <strong>sampling</strong> (rút ngẫu nhiên có trọng số) từ một phân phối xác suất,
nên cùng một prompt gửi hai lần vẫn có thể ra hai câu trả lời khác nhau. Trên các model hiện tại, các "núm vặn" cũ như <strong>temperature, top_p, top_k</strong>
đã bị bỏ: gửi lên là nhận <strong>HTTP 400</strong>. Cách đúng là <strong>thiết kế hệ thống chấp nhận output thay đổi</strong> và kiểm tra (validate) mọi câu trả lời.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Sampling</strong>: quá trình chọn token tiếp theo bằng cách "rút" từ phân phối xác suất của model.</li>
  <li><strong>Probability distribution</strong>: danh sách các phỏng đoán của model cho token tiếp theo, mỗi phỏng đoán kèm một xác suất.</li>
  <li><strong>Non-determinism</strong>: tính không tất định: cùng prompt nhưng mỗi lần gọi có thể ra output khác.</li>
  <li><strong>Temperature</strong>: núm cũ chỉnh độ "ngẫu nhiên": tăng lên thì đa dạng hơn, giảm về 0 thì bám vào token có xác suất cao nhất.</li>
  <li><strong>top_p</strong>: chỉ giữ các token có xác suất cao, cộng dồn tới một ngưỡng xác suất, rồi rút trong nhóm đó.</li>
  <li><strong>top_k</strong>: chỉ giữ đúng <strong>k</strong> token đứng đầu làm ứng viên.</li>
  <li><strong>Effort</strong>: thiết lập "mức công sức" của model, một trong những đòn bẩy thay thế cho các núm sampling cũ.</li>
  <li><strong>Structured outputs</strong>: ép câu trả lời theo một khuôn định dạng chặt, dùng khi format chính xác thật sự quan trọng.</li>
</ul>

<h3>Sampling là gì và vì sao output thay đổi?</h3>
<p>Ở mỗi bước, model không "biết chắc" từ tiếp theo. Nó đưa ra một <strong>bảng xếp hạng các phỏng đoán</strong>, mỗi cái có một xác suất.
Bộ sampler sau đó <strong>rút</strong> một token từ bảng này, chứ không phải lúc nào cũng lấy cái đứng đầu. Vì vậy output <strong>không được đảm bảo giống hệt từng byte</strong> giữa các lần chạy.</p>
<div class="box">🎲 <strong>Hình dung thế này:</strong> Bạn hỏi một người bạn "Hôm nay ăn gì?" hai lần. Ý chính vẫn là "ăn phở",
nhưng lần đầu bạn ấy nói "Đi ăn phở đi!", lần sau lại nói "Phở nhé, gần nhà có quán ngon". <strong>Ý nghĩa ổn định, câu chữ thay đổi</strong>. Claude cũng vậy.</div>

<h3>Ngày xưa và bây giờ: núm vặn sampling đã bị bỏ</h3>
<ul>
  <li><strong>Cách cũ (legacy)</strong>: chỉnh độ ngẫu nhiên trực tiếp bằng <strong>temperature, top_p, top_k</strong>. Vẫn hợp lệ trên các model đời cũ như <strong>Sonnet 4.5, Haiku 4.5</strong> và trước đó.</li>
  <li>Trên các model <strong>Claude 4</strong>, bạn chỉ được truyền <strong>một trong hai</strong>: temperature <em>hoặc</em> top_p, <strong>không bao giờ cả hai cùng lúc</strong>.</li>
  <li><strong>Cách mới</strong>: trên <strong>Fable 5, Opus 5, Opus 4.8, Sonnet 5</strong>, truyền temperature, top_p hay top_k sẽ bị trả <strong>HTTP 400</strong>. Model <strong>không lặng lẽ bỏ qua</strong>, nó <strong>từ chối hẳn request</strong>.</li>
  <li>Ngoại lệ nhỏ trên <strong>Sonnet 5</strong>: giá trị <strong>mặc định</strong> vẫn được chấp nhận, chỉ giá trị <strong>khác mặc định</strong> mới bị 400. Code cũ có dòng <code>temperature: 0.7</code> theo thói quen sẽ hỏng.</li>
  <li>Đòn bẩy thay thế không phải một núm khác, mà là <strong>prompt rõ ràng hơn</strong> và <strong>effort</strong>: viết chỉ dẫn chặt hơn, cho thấy format mong muốn, để chính khả năng suy luận của model định hình output.</li>
  <li>Quy tắc thực tế: <strong>gọi tên model trước</strong>, rồi mới biết các núm sampling có còn dùng được không.</li>
</ul>

<h3>Ba nguồn gây biến động</h3>
<ol>
  <li><strong>Probabilistic sampling</strong>: mỗi token được rút từ phân phối, nên thỉnh thoảng một token xếp hạng thấp hơn vẫn xuất hiện.</li>
  <li><strong>Hạ tầng phục vụ (serving infrastructure)</strong>: router, safety classifier và logic sampling nằm giữa bạn và trọng số model; bất kỳ phần nào cũng có thể "đẩy nhẹ" hành vi.</li>
  <li><strong>Trọng số cố định không có nghĩa là output cố định</strong>: bạn có thể ghim (pin) model ID để weights không đổi, nhưng output quan sát được vẫn có thể trôi theo thời gian.</li>
</ol>

<h3>Cái bẫy "temperature = 0"</h3>
<p>Nhiều người tin rằng đặt <strong>temperature = 0</strong> là có output <strong>hoàn toàn tất định</strong>, lặp lại y hệt mọi lần. <strong>Không đúng.</strong>
Ngay cả trên các model cũ chấp nhận tham số này, temperature 0 chỉ làm output <strong>tất định hơn</strong>, chứ <strong>chưa bao giờ đảm bảo giống hệt</strong>.
Còn trên model hiện tại, bạn thậm chí <strong>không đặt được</strong> nó nữa. Nếu pipeline của bạn dựa vào temperature 0 như một lời hứa lặp lại, lời hứa đó <strong>chưa từng tồn tại</strong>.</p>

<h3>Xây pipeline chấp nhận sự thay đổi</h3>
<ul>
  <li><strong>Validate và parse mọi câu trả lời một cách phòng thủ</strong> (defensively).</li>
  <li><strong>Đừng</strong> viết code so sánh output với <strong>một chuỗi chính xác từng byte</strong>: test đó sẽ có ngày fail trên một câu trả lời hoàn toàn đúng nhưng diễn đạt khác.</li>
  <li>Khi format chính xác thật sự quan trọng: dùng <strong>structured outputs</strong>, thêm <strong>bước validation</strong>, và có <strong>retry nếu parse lỗi</strong>.</li>
  <li>Coi model như một linh kiện có "hình dạng output" có thể lệch nhẹ giữa các lần gọi, và <strong>canh gác ranh giới</strong> nơi text của nó đi vào hệ thống của bạn.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có <strong>"code cũ đặt temperature / top_p / top_k, chuyển sang Opus 5 / Sonnet 5 / Fable 5 thì lỗi 400"</strong> → đáp án đúng là <strong>bỏ các tham số đó</strong>, điều khiển bằng <strong>prompt + effort</strong>.</li>
  <li>Đề có <strong>"cùng prompt nhưng output khác nhau"</strong> → đáp án đúng giải thích bằng <strong>sampling xác suất + serving infrastructure</strong>, và đề xuất <strong>validate/parse phòng thủ</strong>.</li>
  <li>Đề có <strong>"cần format chính xác, ổn định"</strong> → đáp án đúng là <strong>structured outputs + validation + retry khi parse lỗi</strong>.</li>
  <li>Đề có <strong>"test so sánh chuỗi exact match thỉnh thoảng fail"</strong> → đáp án đúng là <strong>kiểm tra ý nghĩa / cấu trúc</strong>, không so từng byte.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Đặt temperature = 0 là output luôn giống hệt" → <strong>sai</strong>, chưa bao giờ đảm bảo, và model hiện tại còn từ chối tham số này.</li>
  <li>"Model mới chỉ lặng lẽ bỏ qua temperature" → <strong>sai</strong>, nó trả <strong>HTTP 400</strong>, từ chối cả request.</li>
  <li>"Pin model ID là output cố định" → <strong>sai</strong>, weights cố định nhưng output quan sát được vẫn có thể thay đổi.</li>
  <li>"Trên Claude 4 có thể đặt cả temperature lẫn top_p" → <strong>sai</strong>, chỉ được một trong hai.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Ý nghĩa ổn định, câu chữ thay đổi.</strong> Model mới: <strong>bỏ núm sampling, dùng prompt + effort, và luôn validate output</strong>.</p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
