window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Khi agent chạy lâu, context của agent cha bị lấp đầy bởi file read, search dump và các ngả rẽ cụt.
<strong>Subagent</strong> làm phần việc "bừa bộn" đó ở một context riêng và chỉ trả về một <strong>bản tóm tắt gọn</strong>.
Giá trị thật của subagent là <strong>context isolation</strong>, không phải chạy song song cho nhanh.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Context isolation</strong>: giao một subtask có phạm vi rõ cho subagent, nó chỉ trả về kết quả, token trung gian không lọt vào window của cha.</li>
  <li><strong>Distilled summary</strong>: thứ thực sự được trả về, thường khoảng <strong>1,000–2,000 token</strong>, không phải toàn bộ working trace.</li>
  <li><strong>Working trace</strong>: toàn bộ quá trình làm việc bên trong subagent (đọc file, search, suy luận) – có thể rất lớn.</li>
  <li><strong>Blast radius</strong>: một bước trung gian sai có thể lan xa tới đâu. Isolation giới hạn nó trong một subagent.</li>
  <li><strong>Contract</strong>: bản tóm tắt trả về là "hợp đồng" để cha xây tiếp, là giao diện giữa hai agent.</li>
  <li><strong>Fresh context</strong>: subagent <strong>không thừa hưởng</strong> hội thoại của cha, chỉ thấy task bạn giao.</li>
</ul>

<h3>Vì sao isolation tiết kiệm token</h3>
<ul>
  <li>Trong hầu hết agent run, token đắt nhất không phải câu trả lời cuối mà là <strong>discovery</strong>: đọc file, query dữ liệu, chạy search.</li>
  <li>Những thứ đó đổ rất nhiều output thô vào context, phần lớn là "giàn giáo" không bao giờ cần lại.</li>
  <li>Giao việc khám phá cho subagent → tất cả nằm trong window <strong>của subagent</strong>. Context cha chỉ tăng thêm một bản tóm tắt ngắn, không phải cả transcript.</li>
  <li>Bản chất: đổi một trace trung gian khổng lồ lấy <strong>một câu trả lời nhỏ, giàu tín hiệu</strong>.</li>
</ul>
<div class="box">🕵️ <strong>Hình dung thế này:</strong> Bạn là trưởng nhóm, nhờ một thực tập sinh lục kho hồ sơ để trả lời một câu hỏi. Bạn không muốn họ khuân cả chục thùng hồ sơ lên bàn mình,
bạn muốn một tờ giấy ghi câu trả lời. Nhưng nhớ: thực tập sinh <strong>không nghe được</strong> cuộc họp trước đó của bạn – bạn phải dặn rõ tìm gì, ở đâu, thế nào là xong.</div>

<h3>Lỗi bàn giao phổ biến nhất: tưởng subagent biết hết</h3>
<ul>
  <li>Subagent <strong>bắt đầu từ trang trắng</strong>, chỉ thấy task bạn giao. Nó không đọc được lịch sử hay suy nghĩ của bạn.</li>
  <li>Mọi thứ nó cần – <strong>file paths, constraints, goal</strong> – phải ghi <strong>rõ ràng trong delegated prompt</strong>.</li>
  <li>Giới hạn phạm vi chặt, nói rõ <strong>"done" trông như thế nào</strong>, đưa đúng các input cần thiết.</li>
  <li>Isolation là hành vi <strong>mặc định</strong>, không phải thứ bạn phải tự thiết kế.</li>
</ul>

<h3>Khi nào nên dùng subagent: 3 dấu hiệu</h3>
<ol>
  <li><strong>Verbose discovery</strong>: subtask đọc/search nhiều, tạo output mà cha không cần giữ.</li>
  <li><strong>Independent workstream</strong>: bước đó chạy được một mình, không phải trao đổi state qua lại với agent chính.</li>
  <li><strong>Bounded blast radius</strong>: muốn một bước "chưa chắc" bị cô lập, nếu sai thì lỗi không lan vào context cha.</li>
</ol>
<p>Không thấy các dấu hiệu này → làm <strong>inline</strong> thường đơn giản và nhanh hơn. Nếu các chi tiết của bước đó sẽ còn được dùng ở sau, giữ inline tốt hơn vì bản tóm tắt sẽ làm rơi thứ bạn cần. Một lookup đơn lẻ, nhanh → gọi trực tiếp, vì delegation có <strong>overhead</strong> thật.</p>

<h3>Sau khi subagent trả về: giữ ranh giới sạch</h3>
<ul>
  <li><strong>Validate</strong> bản tóm tắt ở phía cha trước khi hành động – kết quả trông tự tin vẫn có thể sai.</li>
  <li>Đừng cố "với" vào working trace để soi lại – trace đó <strong>đã biến mất theo thiết kế</strong>.</li>
  <li>Chạy nhiều subagent → thu thập kết quả và <strong>tổng hợp (synthesize)</strong> cho bước tiếp theo.</li>
</ul>

<h3>Ba anti-pattern</h3>
<ul>
  <li><strong>Overly broad scope</strong>: giao task mơ hồ, lan man → subagent đi lạc, trả về tóm tắt khó tin.</li>
  <li><strong>Starved context</strong>: giấu bớt dữ kiện cần thiết → subagent làm mù, kết quả yếu.</li>
  <li><strong>Parallel-only thinking</strong>: coi subagent chỉ là worker chạy song song, quên rằng giá trị thật là <strong>isolation</strong>, không phải tốc độ.</li>
</ul>
<p>Hai cái đầu là hai thái cực ngược nhau (quá nhiều phạm vi, quá ít context); cách sửa chung là một <strong>task chặt chẽ, được cung cấp đủ</strong>.</p>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề có context cha bị đầy bởi file read, search dump → <strong>giao exploration cho subagent</strong>, nhận về distilled summary.</li>
  <li>Đề nói subagent trả kết quả sai vì "không biết" ràng buộc → lỗi là <strong>không truyền rõ context trong delegated prompt</strong>.</li>
  <li>Đề hỏi giá trị chính của subagent → <strong>context isolation</strong> (và giới hạn blast radius), không phải tốc độ.</li>
  <li>Đề có chi tiết sẽ cần dùng lại ở bước sau, hoặc chỉ là một lookup nhỏ → <strong>làm inline</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Subagent thừa hưởng hội thoại của cha" → <strong>sai</strong>, nó bắt đầu fresh.</li>
  <li>"Nên lấy cả working trace của subagent về để kiểm tra" → <strong>sai</strong>, chỉ dùng summary làm contract và validate nó.</li>
  <li>"Subagent chủ yếu để chạy song song cho nhanh" → <strong>sai</strong>, giá trị thật là isolation.</li>
  <li>"Bước nào cũng nên tách thành subagent" → <strong>sai</strong>, delegation có overhead, phải "đáng tiền".</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>"Làm bừa ở phòng bên, mang về một tờ giấy."</strong> Subagent bắt đầu trắng trơn – <strong>dặn đủ, giao gọn, nhận tóm tắt, kiểm tra lại</strong>.</p>
`,

  // Parts 3–6 have explanations only, no quiz.
  quiz: []
};
