window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Một yêu cầu tốt cho tính năng dùng Claude là một <strong>hợp đồng</strong>: đưa vào cái gì, nhận lại hình dạng gì,
và có một <strong>phép kiểm tra máy chấm được</strong> để biết đạt hay không. Đừng ghi prompt vào yêu cầu. Và phải tính trước cả những
"đường không vui": input lạ, Claude từ chối, câu hỏi ngoài phạm vi, câu hỏi mơ hồ.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Acceptance criteria:</strong> điều kiện cụ thể, kiểm tra được, đánh dấu yêu cầu đã xong. Lập trình viên và QA phải đọc ra cùng một nghĩa.</li>
  <li><strong>Hợp đồng đầu vào/đầu ra (input-output contract):</strong> nói rõ cái gì đi vào và hình dạng nào đi ra, ví dụ một object JSON đúng schema.</li>
  <li><strong>Tín hiệu đo được (measurable signal):</strong> một phép kiểm tra quan sát được để chấm output đạt hay không.</li>
  <li><strong>Structured outputs:</strong> tính năng của API buộc câu trả lời đúng một JSON schema cho trước.</li>
  <li><strong>stop_reason:</strong> lý do Claude dừng. "refusal" nghĩa là bộ lọc an toàn đã chặn.</li>
</ul>

<h3>Ba viên gạch của mọi yêu cầu</h3>
<p><strong>Tiêu chí</strong> (thế nào là xong), <strong>hợp đồng</strong> (vào gì, ra gì), <strong>tín hiệu</strong> (chấm bằng gì).
Ghép lại, chúng biến một mong muốn mơ hồ thành thứ bạn xây được và <strong>chứng minh được</strong> là đã giao.</p>

<h3>Đừng ghi prompt vào yêu cầu</h3>
<div class="box">🍽️ <strong>Hình dung thế này:</strong> Bạn gọi món "phở bò tái, nước trong, ra trong 10 phút". Đó là hợp đồng.
Bạn không bắt đầu bếp phải nêm mắm trước hay muối trước. Cách nấu là việc của bếp. Prompt cũng vậy: nó là <strong>cách làm</strong>, không phải <strong>yêu cầu</strong>.</div>
<p>Hãy viết: "câu trả lời là object JSON với đúng các trường này", rồi để <strong>structured outputs</strong> ép schema thay vì cố dỗ định dạng bằng câu chữ khéo léo.
Lợi ích là tự do: miễn hợp đồng còn giữ, bạn đổi prompt, đổi cách làm, tinh chỉnh gì bên dưới cũng được mà yêu cầu vẫn đạt.</p>

<h3>Tiêu chí yếu và tiêu chí mạnh</h3>
<ul>
  <li><strong>Yếu:</strong> "câu trả lời phải đẹp và hữu ích". Nghe hợp lý, nhưng không ai code theo được, và hai người duyệt sẽ cãi nhau mãi.</li>
  <li><strong>Mạnh:</strong> "câu trả lời là JSON hợp lệ theo schema và có trích dẫn tài liệu nguồn". Một script chấm được đạt/trượt, lần nào cũng như nhau.</li>
</ul>
<p>🧪 Mẹo thử: nếu bạn hình dung được một câu lệnh <code>assert</code> cho tiêu chí đó, nó kiểm tra được. Chưa hình dung được thì viết lại.</p>

<h3>Tách tính năng thành ba cột: lượt, output, check</h3>
<ol>
  <li><strong>Lượt của người dùng:</strong> họ gửi gì ở mỗi bước.</li>
  <li><strong>Output mong đợi:</strong> Claude phải trả gì cho lượt đó.</li>
  <li><strong>Phép kiểm tra:</strong> quy tắc cụ thể chấm output đó đúng hay sai.</li>
</ol>
<p>Cách này còn lộ ra lỗ hổng ngay: nếu bạn <strong>không ghi được</strong> output mong đợi hay phép kiểm tra cho một lượt, bạn vừa tìm ra chỗ thủng của đặc tả trước khi viết dòng code nào.</p>

<h3>Bốn "đường không vui" phải viết vào yêu cầu</h3>
<ul>
  <li><strong>Edge case:</strong> trường rỗng, input khổng lồ, định dạng lạ. Quyết định trước app phải làm gì.</li>
  <li><strong>Từ chối (refusal):</strong> Claude có thể từ chối yêu cầu không an toàn. App làm gì khi đó?</li>
  <li><strong>Ngoài phạm vi:</strong> yêu cầu không thuộc việc của tính năng này. Định nghĩa một cách từ chối nhẹ nhàng để phạm vi không phình ra.</li>
  <li><strong>Mơ hồ:</strong> thiếu chi tiết. Ghi rõ Claude sẽ hỏi lại, hay dùng một giá trị mặc định đã ghi trong tài liệu.</li>
</ul>

<h3>Từ chối là một yêu cầu, không phải ghi chú bên lề</h3>
<p>Claude có <strong>hai cách</strong> từ chối:</p>
<ul>
  <li>Bộ lọc an toàn chặn: response có <code>stop_reason</code> là <strong>refusal</strong>.</li>
  <li>Claude từ chối <strong>bằng lời</strong> trong câu trả lời, với <code>stop_reason</code> bình thường là <strong>end_turn</strong>.</li>
</ul>
<p>Chỉ rẽ nhánh theo "refusal" sẽ <strong>bỏ sót</strong> kiểu thứ hai. Trong đặc tả, hãy quyết định: câu thông báo chính xác cho người dùng, có đường dự phòng không,
và <strong>ghi log mọi lần từ chối</strong> để đo xem nó xảy ra bao nhiêu trên production.</p>
<div class="box">🎯 <strong>Cùng một sự kiện, hai kết cục:</strong> từ chối đã được tính trước và xử lý gọn gàng là một <strong>tính năng</strong>.
Từ chối lọt qua và hiện lỗi thô cho người dùng là một <strong>bug</strong>. Yêu cầu bạn viết quyết định bạn giao cái nào.</div>

<h3>Ba tín hiệu đo phổ biến</h3>
<ul>
  <li><strong>Format:</strong> output có parse được và đúng schema không? Một bộ kiểm JSON trả lời tự động, không cần người.</li>
  <li><strong>Grounding:</strong> câu trả lời có dựa vào nguồn được đưa không? Kiểm tra đoạn trích có thật sự nằm trong tài liệu.</li>
  <li><strong>Behavior:</strong> app có làm đúng hành động, chuyển đúng nơi, từ chối khi cần không? So với một tập ví dụ đã gán nhãn.</li>
</ul>

<h3>Vì sao yêu cầu nào cũng cần tín hiệu đo?</h3>
<p>Để <strong>giữ phạm vi</strong>. Không chấm được thì không biết khi nào xong, và yêu cầu cứ phình ra mãi, dự án trễ.
Khi mọi yêu cầu có phép kiểm tra, một yêu cầu mới hoặc có tín hiệu hoặc không, nên việc phình phạm vi lộ ra ngay.
Thêm nữa: mỗi phép kiểm tra sau này thành một <strong>test thật</strong> trong bộ test của bạn.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Đặc tả hợp đồng đầu vào/đầu ra, không đặc tả prompt.</li>
  <li>Mỗi lượt có output mong đợi và phép kiểm tra; tính trước bốn đường không vui, nhất là hai kiểu từ chối.</li>
  <li>Không chấm được thì chưa xong.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">treating edge cases as first class</em>: coi edge case là chuyện chính, không phải chuyện phụ.</li>
  <li><em class="en">read them exactly the same way</em>: đọc ra đúng cùng một nghĩa.</li>
  <li><em class="en">an implementation detail</em>: một chi tiết của cách làm.</li>
  <li><em class="en">coax the right format</em>: dỗ ra đúng định dạng.</li>
  <li><em class="en">Specify the what and leave the how</em>: nói rõ cái gì, để lại cách làm.</li>
  <li><em class="en">this is where most specs leak</em>: đây là chỗ hầu hết đặc tả bị rò.</li>
  <li><em class="en">argue forever</em>: cãi nhau không dứt.</li>
  <li><em class="en">unhappy paths</em>: những tình huống không như ý.</li>
  <li><em class="en">not as afterthoughts</em>: không phải nghĩ tới sau cùng.</li>
  <li><em class="en">slips through</em>: lọt qua.</li>
  <li><em class="en">quietly balloons</em>: âm thầm phình to.</li>
  <li><em class="en">If you can't grade it, it isn't done</em>: không chấm được thì chưa xong.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson02/Lesson02.java</code>. Có 5 bài: format signal (parse JSON và đối chiếu schema),
grounding signal (mọi trích dẫn phải có trong tài liệu), behavior signal (tỉ lệ khớp nhãn), phân loại phản hồi
(refusal, bị cắt, phá hợp đồng) và tìm lỗ hổng trong bảng lượt/output/check.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-02"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-02 --live"</code>. Bạn sẽ thấy chỉ dặn "trả về JSON" bằng lời thì câu hỏi ngoài phạm vi
dễ nhận lại một lời từ chối bằng chữ (end_turn) và code của bạn phải bắt được nó. Sau đó structured outputs giữ đúng hợp đồng,
grounding kiểm tra trích dẫn, và behavior đo độ chính xác trên một tập câu hỏi gán nhãn sẵn.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Ba viên gạch dùng cho mọi yêu cầu trong bài là gì?', options: ['Prompt mẫu, model được chọn và temperature cho từng lời gọi', 'Acceptance criteria, hợp đồng đầu vào/đầu ra, tín hiệu đo được', 'Business need, danh sách capability và tier cho mỗi capability', 'Latency, throughput, cost'], answer: 1, explain: '"Criteria, contract, signal. Together, they turn a vague wish into something you can build against and prove you delivered."' },
    { q: 'Một functional requirement ghi: "Dùng prompt: Bạn là trợ lý thân thiện, hãy trả lời ngắn". Vấn đề là gì?', options: ['Prompt quá ngắn, cần thêm vài ví dụ minh họa cho Claude', 'Thiếu số liệu chi phí cho mỗi lần gọi', 'Prompt là chi tiết cách làm, không thuộc về yêu cầu', 'Prompt phải viết bằng tiếng Anh thì Claude mới hiểu đúng'], answer: 2, explain: '"A prompt is an implementation detail, and implementation details don\'t belong in requirements."' },
    { q: 'Thay vì ghi prompt, yêu cầu nên đặc tả điều gì?', options: ['Cái gì đi vào và hình dạng gì đi ra', 'Model nào sẽ được dùng ở production', 'Số lần thử prompt trước khi chốt', 'Giọng điệu Claude nên dùng khi trả lời'], answer: 0, explain: '"What you actually want to specify is the contract. State what goes in and what shape comes back."' },
    { q: 'Theo bài học, nên dùng gì để đảm bảo câu trả lời đúng schema JSON?', options: ['Viết prompt thật khéo để dỗ đúng định dạng', 'Nhắc lại yêu cầu định dạng ba lần trong prompt', 'Hạ temperature xuống 0', 'Structured outputs ép schema'], answer: 3, explain: '"Let structured outputs enforce that schema for you instead of leaning on clever wording to coax the right format."' },
    { q: 'Lợi ích lớn nhất của việc đặc tả hợp đồng thay vì prompt là gì?', options: ['Prompt sẽ ngắn hơn nên mỗi lần gọi rẻ hơn hẳn', 'Đổi prompt hay cách làm thoải mái mà yêu cầu vẫn đạt', 'Không cần viết test tự động cho tính năng đó nữa', 'QA không phải đọc đặc tả trước khi kiểm thử'], answer: 1, explain: '"As long as the contract holds, you can rewrite the prompt, swap an approach, or tune anything underneath, and the requirement is still satisfied."' },
    { q: 'Tiêu chí nào là tiêu chí MẠNH theo bài học?', options: ['Câu trả lời phải đẹp và thật sự hữu ích', 'Câu trả lời phải làm khách hàng hài lòng ở mọi tình huống', 'Câu trả lời là JSON hợp lệ theo schema và trích dẫn tài liệu nguồn', 'Câu trả lời phải chuyên nghiệp như một nhân viên hỗ trợ giỏi nhất'], answer: 2, explain: 'Tiêu chí kiểm tra được: "the response is valid JSON matching the schema, and it cites the source document." Một script chấm được.' },
    { q: 'Vấn đề của tiêu chí "câu trả lời phải đẹp và hữu ích" là gì?', options: ['Không ai code theo được, người duyệt sẽ cãi nhau', 'Quá dài để đưa vào đặc tả, nên cần rút gọn lại', 'Chỉ áp dụng được khi câu trả lời viết bằng tiếng Anh', 'Nó mô tả hạ tầng chứ không phải hành vi'], answer: 0, explain: '"It feels reasonable, but nobody can code to it, and two reviewers will argue forever about whether a given answer passed."' },
    { q: 'Mẹo nhanh để biết một tiêu chí có kiểm tra được không là gì?', options: ['Đọc to tiêu chí trong buổi họp để cả team cùng góp ý', 'Đếm số từ của tiêu chí, càng ngắn càng dễ kiểm tra', 'Hỏi Claude xem tiêu chí có hợp lý không', 'Thử hình dung xem có viết được một câu lệnh assert cho tiêu chí đó không'], answer: 3, explain: '"If you can picture writing an assert statement for the criterion, it\'s testable. If you can\'t, keep rewriting until you can."' },
    { q: '"Cái ngưỡng" (the bar) cho một tiêu chí, theo bài học, là gì?', options: ['Hai người duyệt độc lập cùng đồng ý với nhau', 'Một cái máy chấm được, lần nào cũng như nhau', 'Người đặt hàng đọc và ký xác nhận vào biên bản', 'Claude tự chấm câu trả lời của chính nó là đạt'], answer: 1, explain: '"A script can now grade that pass or fail the same way every single time. That\'s the bar. Push it until a machine could judge it."' },
    { q: 'Ba cột dùng để tách một tính năng thành yêu cầu là gì?', options: ['Input, model được chọn và chi phí của mỗi lời gọi', 'Vai trò người dùng, vai trò admin, và hệ thống nền', 'Lượt, output mong đợi, phép kiểm tra', 'Ý tưởng ban đầu, bản thiết kế, và kế hoạch triển khai'], answer: 2, explain: '"Decompose the feature into three columns, turns, outputs, and checks."' },
    { q: 'Khi điền bảng lượt/output/check, bạn không viết được phép kiểm tra cho lượt thứ ba. Điều đó cho biết gì?', options: ['Đặc tả có lỗ hổng, tìm ra trước khi viết code', 'Lượt đó nên giao cho một agent tự quyết lúc chạy', 'Lượt đó không cần test vì Claude sẽ tự xử lý', 'Nên bỏ hẳn lượt đó khỏi tính năng cho đơn giản'], answer: 0, explain: '"If you can\'t name the expected output for a turn, or you can\'t write its check, you\'ve found a hole in the spec before you wrote a line of code."' },
    { q: 'Thứ phân biệt một đặc tả cho demo với một đặc tả cho production là gì?', options: ['Số lượng tính năng được liệt kê trong bản đặc tả', 'Độ dài và độ chi tiết của system prompt', 'Model được chọn cho môi trường production', 'Các đường không vui (unhappy paths) được viết thẳng vào yêu cầu'], answer: 3, explain: '"Now, the part that separates a demo spec from a production one, the unhappy paths."' },
    { q: 'Câu nào KHÔNG thuộc bốn loại đường không vui được nêu?', options: ['Edge case như trường rỗng hay input khổng lồ', 'Claude trả lời đúng ngay lần đầu', 'Yêu cầu ngoài phạm vi', 'Yêu cầu mơ hồ, thiếu chi tiết'], answer: 1, explain: 'Bốn loại là edge cases, refusal handling, out-of-scope inputs và ambiguous requests.' },
    { q: 'Với yêu cầu ngoài phạm vi của tính năng, đặc tả nên quy định gì?', options: ['Cố gắng trả lời bằng mọi giá để khách hàng hài lòng', 'Chuyển sang một model mạnh hơn để xử lý cho chắc', 'Một cách từ chối nhẹ nhàng, định nghĩa trước, để phạm vi tính năng không phình ra', 'Bỏ qua, không trả lời gì để tiết kiệm token'], answer: 2, explain: '"Third, out-of-scope inputs. Requests outside this feature\'s job. Define a graceful decline so your scope stays bounded."' },
    { q: 'Với yêu cầu mơ hồ, đặc tả nên ghi rõ điều gì?', options: ['Claude hỏi lại, hay dùng giá trị mặc định đã ghi trong tài liệu', 'Luôn chọn phương án rẻ nhất mà không cần hỏi lại người dùng', 'Luôn trả về lỗi 400 để người dùng tự gửi lại yêu cầu rõ hơn', 'Để Claude tự quyết lúc chạy, không cần ghi vào đặc tả'], answer: 0, explain: '"Specify whether Claude asks for clarification or falls back on a documented default."' },
    { q: 'Claude có thể từ chối theo những cách nào?', options: ['Chỉ qua stop_reason "refusal" trong mọi trường hợp', 'Chỉ bằng lời trong câu trả lời, không bao giờ qua stop_reason', 'Qua mã lỗi HTTP 403 kèm thông báo về chính sách an toàn', 'Qua stop_reason "refusal", hoặc từ chối bằng lời trong câu trả lời với end_turn bình thường'], answer: 3, explain: '"The response comes back with a refusal stop reason. But Claude can also decline conversationally in the reply text with a normal end turn, so plan for both."' },
    { q: 'Code chỉ rẽ nhánh khi stop_reason == "refusal". Lỗ hổng là gì?', options: ['Không có lỗ hổng, vì refusal là cách duy nhất Claude từ chối', 'Bỏ sót những lần Claude từ chối bằng lời', 'Bắt nhầm cả lỗi 429 rate limit thành một lần từ chối', 'Làm tăng chi phí token vì phải kiểm tra mỗi phản hồi'], answer: 1, explain: '"Branching only on refusal misses those conversational declines."' },
    { q: 'Tính năng có hợp đồng JSON. Claude trả về câu "Xin lỗi, tôi chỉ hỗ trợ câu hỏi về hoàn tiền" với end_turn. Tín hiệu nào bắt được trường hợp này?', options: ['Grounding signal, vì câu từ chối không trích dẫn tài liệu nào', 'Kiểm tra stop_reason == "refusal"', 'Format signal: output không phải JSON đúng schema', 'Đếm số token output, vì câu từ chối thường ngắn hơn'], answer: 2, explain: 'stop_reason là end_turn nên nhánh refusal không bắt. Nhưng câu từ chối bằng lời không phải JSON hợp lệ, nên format check báo trượt.' },
    { q: 'Ba thứ đặc tả cần quyết định cho trường hợp từ chối là gì?', options: ['Câu thông báo cho người dùng, đường dự phòng, và log mọi lần từ chối', 'Model dự phòng, thời gian chờ giữa các lần, và số lần retry tối đa', 'Người duyệt tính năng, ngày phát hành, và tên hiển thị của tính năng', 'Prompt mới cho lần thử lại, vài ví dụ mẫu, và temperature thấp hơn'], answer: 0, explain: '"Decide the exact user-facing message. Decide whether there\'s a fallback path. And log every refusal, so you can measure how often it happens in production."' },
    { q: 'Theo bài học, điều gì khiến một lần từ chối trở thành bug?', options: ['Claude từ chối một yêu cầu không an toàn', 'Lần từ chối được ghi log để đội vận hành theo dõi', 'App hiện một thông báo thân thiện đã soạn sẵn', 'Nó lọt qua và hiện lỗi thô cho người dùng'], answer: 3, explain: '"A refusal you planned for and handled cleanly is a feature. A refusal that slips through and shows the user a raw error is a bug."' },
    { q: 'Format signal kiểm tra điều gì?', options: ['Câu trả lời có trích dẫn đúng tài liệu được cung cấp không', 'Output có parse được và đúng schema không', 'App có chuyển ticket đến đúng bộ phận phụ trách không', 'Câu trả lời có lịch sự và đúng giọng thương hiệu không'], answer: 1, explain: '"The first is a format signal. Does the output parse and match the schema? A JSON validator answers that automatically."' },
    { q: 'Grounding signal được kiểm tra bằng cách nào?', options: ['Hỏi lại Claude xem nó có chắc chắn với câu trả lời không', 'Đếm số câu trong câu trả lời và so với giới hạn cho phép', 'Đối chiếu từng đoạn trích xem có thật sự nằm nguyên văn trong tài liệu đã đưa không', 'So câu trả lời với một tập ví dụ đã gán nhãn trước'], answer: 2, explain: '"You check that the quoted spans actually appear in the document you supplied."' },
    { q: 'Muốn biết app có chuyển ticket đúng nơi và từ chối đúng lúc không, dùng tín hiệu nào?', options: ['Behavior signal', 'Format signal, kiểm tra output có đúng schema JSON không', 'Grounding signal, kiểm tra trích dẫn có nằm trong tài liệu không', 'Đo độ trễ trung bình'], answer: 0, explain: '"The third is a behavior signal. Did the app take the right action, route correctly, or refuse when it should have? You compare its choices against a labeled set of examples."' },
    { q: 'App phân loại 4 ticket ra [billing, bug, bug, refuse], nhãn đúng là [billing, bug, account, refuse]. Behavior signal cho kết quả bao nhiêu?', options: ['50%', '100%', '25%', '75%'], answer: 3, explain: '3 trên 4 lựa chọn khớp nhãn, tức 75%.' },
    { q: 'Vì sao yêu cầu không có tín hiệu đo được khiến dự án trễ?', options: ['Vì phải gọi API nhiều lần hơn để thử các cách khác nhau', 'Vì không biết khi nào xong, nên yêu cầu phình ra mãi', 'Vì QA không có việc gì để làm cho tới cuối dự án', 'Vì model phải chạy chậm hơn để suy nghĩ kỹ hơn'], answer: 1, explain: '"If you can\'t grade a requirement, you genuinely can\'t tell when it\'s done, which means it can expand forever and the project slips."' },
    { q: 'Khi mọi yêu cầu đều có phép kiểm tra, việc phình phạm vi (scope creep) thay đổi thế nào?', options: ['Biến mất hoàn toàn vì không ai được thêm yêu cầu mới nữa', 'Khó phát hiện hơn vì có quá nhiều phép kiểm tra cần theo dõi', 'Lộ ra gần như ngay: yêu cầu mới hoặc có tín hiệu hoặc không', 'Chỉ còn xảy ra ở giai đoạn cuối, khi đã chạy toàn bộ test'], answer: 2, explain: '"When every requirement carries a concrete check, scope creep becomes visible almost immediately. Because a new ask either has a signal or it doesn\'t."' },
    { q: '"Phần thưởng thêm" của việc viết phép kiểm tra cho từng yêu cầu là gì?', options: ['Sau này chúng thành test thật', 'Claude chạy nhanh hơn vì đã biết trước tiêu chí chấm', 'Không cần viết acceptance criteria riêng cho từng yêu cầu nữa', 'Giảm số token output vì câu trả lời được định hình rõ hơn'], answer: 0, explain: '"Each of those success checks becomes a real test in your suite later. So the work you do defining criteria pays you back during implementation."' },
    { q: 'Câu tóm gọn cuối bài là gì?', options: ['Prompt hay thì sản phẩm chắc chắn sẽ hay', 'Agent là lựa chọn mặc định cho mọi tính năng mới', 'Mọi lần từ chối đều là lỗi cần loại bỏ khỏi sản phẩm', 'Không chấm được thì chưa xong: yêu cầu nào cũng cần một phép kiểm tra'], answer: 3, explain: '"Just remember, if you can\'t grade it, it isn\'t done."' },
    { q: 'Một yêu cầu mạnh, theo phần tổng kết, là gì?', options: ['Một prompt đã được thử kỹ trên nhiều input', 'Hợp đồng có phép kiểm tra, gồm cả edge case', 'Một mô tả cảm giác người dùng mong muốn', 'Một danh sách tính năng được sắp xếp theo độ ưu tiên kinh doanh'], answer: 1, explain: '"A strong functional requirement is a contract with a testable check, edge cases included."' },
    { q: 'Claude được dặn trả JSON bằng lời trong prompt, và trả về JSON đúng nhưng bọc trong khối ```json. Format signal nên cho kết quả gì nếu hợp đồng là "chỉ một object JSON"?', options: ['Đạt, vì nội dung bên trong khối code vẫn là JSON đúng schema', 'Đạt, vì người đọc vẫn hiểu được câu trả lời một cách dễ dàng', 'Trượt: output không phải object JSON thuần', 'Không xác định được, phải để QA xem xét từng trường hợp cụ thể'], answer: 2, explain: 'Hợp đồng là "what shape comes back". Output có code fence không parse thẳng được, nên trượt. Đây chính là chỗ "let structured outputs enforce that schema" giúp.' },
  ],
};
