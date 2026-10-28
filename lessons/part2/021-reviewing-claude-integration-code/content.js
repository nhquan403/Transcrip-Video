window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Code gọi Claude cũng đi qua pull request và cần review như mọi code khác. Ba chỗ cần soi kỹ:
<strong>xử lý lỗi</strong> (phân loại trước khi retry), <strong>kiểm tra response</strong> (đối chiếu schema và quy tắc nghiệp vụ, sai thì hỏi lại kèm lỗi),
và <strong>parse phòng thủ</strong> (đừng tin một câu trả lời trôi chảy). Claude có thể giúp review, nhưng <strong>người duyệt cuối cùng vẫn là con người</strong>.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Catch-all:</strong> một khối bắt mọi exception rồi xử lý y như nhau.</li>
  <li><strong>Response validation:</strong> kiểm tra câu trả lời theo schema hoặc quy tắc nghiệp vụ sau khi model tạo xong.</li>
  <li><strong>Re-prompt:</strong> gọi lại model, kèm lỗi cụ thể, để nó tự sửa.</li>
  <li><strong>Defensive parsing:</strong> đọc output như thể nó có thể làm bạn bất ngờ: trường thiếu, null, sai kiểu.</li>
  <li><strong>Rubber stamp:</strong> đóng dấu duyệt cho qua mà không xem kỹ.</li>
</ul>

<h3>Ba trọng tâm khi review</h3>
<ol>
  <li><strong>Xử lý lỗi:</strong> phân loại từng lỗi trước khi phản ứng; retry lỗi tạm thời, sửa hoặc chuyển lên trên lỗi vĩnh viễn.</li>
  <li><strong>Kiểm tra response:</strong> đối chiếu schema hoặc quy tắc nghiệp vụ sau khi tạo; trượt thì hỏi lại kèm lỗi để model tự sửa.</li>
  <li><strong>Parse phòng thủ:</strong> lường trước output hỏng hoặc thiếu, để một lần tạo tệ không làm sập cả pipeline.</li>
</ol>

<h3>Xử lý lỗi: chỗ code tích hợp âm thầm sai</h3>
<p>Điều đầu tiên cần tìm: code có <strong>phân loại lỗi trước khi phản ứng</strong> không? Timeout không phải bad request; xử lý như nhau là gốc của rất nhiều hành vi chập chờn.
Mùi code kinh điển: một khối <strong>catch-all</strong> coi mọi exception như nhau rồi retry. Nhìn thì có vẻ vững, nhưng không phải.
Retry bao quanh một bad request chỉ đốt ngân sách và không bao giờ thành công, vì lỗi vĩnh viễn trả cùng một kết quả mỗi lần.</p>
<div class="box">❓ <strong>Một câu hỏi duy nhất khi review mọi chính sách retry:</strong> "Code này có <strong>chỉ</strong> retry những lỗi thật sự tự hết được không?"
Timeout, rate limit, lỗi 5xx: retry có backoff là đúng. Bad request, schema sai, sai xác thực: retry là một <strong>lỗi</strong> đang che vấn đề thật.
Hình dung một job đêm retry một request hỏng 3 lần cho mỗi bản ghi trên cả bộ dữ liệu khổng lồ: log đầy rác thay vì một lỗi rõ ràng mà bạn sửa được trong vài phút.</div>

<h3>Kiểm tra response: nơi bắt câu trả lời tự tin mà sai</h3>
<p>Claude nói một câu sai cũng trôi chảy như một câu đúng, nên review <strong>không thể dừng</strong> ở chỗ "lời gọi có thành công không".
Cần thấy response được kiểm tra theo schema hoặc quy tắc nghiệp vụ sau khi về, và khi trượt thì code <strong>hỏi lại kèm lỗi cụ thể</strong>.
Vòng đầy đủ là <strong>tạo, kiểm tra, hỏi lại</strong>, không phải kiểm tra một lần. Cảnh giác với kiểm tra chỉ xem cú pháp, hoặc chỉ chạy ở tận cuối:
kiểm tra ngữ nghĩa cộng đường sửa mới bắt được kết quả nghe hợp lý nhưng sai.</p>

<h3>Parse phòng thủ: ba điểm cần thấy</h3>
<ul>
  <li><strong>Lấy dữ liệu khoan dung:</strong> đọc trường mà không giả định nó có mặt hay đúng kiểu; xử lý thiếu hoặc null một cách có chủ đích.</li>
  <li><strong>Thất bại rõ ràng:</strong> output không khớp mong đợi thì dừng an toàn và báo to, không chạy tiếp trên dữ liệu dở dang.</li>
  <li><strong>Không tin mù quáng:</strong> kể cả khi bật structured outputs, code phía sau không nên coi một response trông tự tin là hợp đồng được bảo đảm.</li>
</ul>

<h3>Prompt và schema cũng là logic</h3>
<p>Sửa prompt hay schema xứng đáng được soi như logic ứng dụng, không phải đóng dấu cho qua. Prompt đổi thì diff phải cho thấy chính xác cái gì đã dịch chuyển,
vì một chút câu chữ có thể đẩy output đi theo cách người review cần thấy. Schema đổi thì kiểm tra với quy tắc structured output mà tích hợp dựa vào,
để một sửa đổi không âm thầm từ chối response hợp lệ hay làm hỏng parser phía sau.</p>

<h3>Dễ đọc cũng là tiêu chí review</h3>
<ul>
  <li><strong>Tên rõ ràng:</strong> tên nói đúng giá trị hay hàm làm gì, để người review đi theo luồng mà không phải lần từng lời gọi.</li>
  <li><strong>Cấu trúc dễ đọc:</strong> request, lời gọi, kiểm tra và parse đọc từ trên xuống, không trốn trong một khối dày đặc làm mọi thứ một lúc.</li>
  <li><strong>Thay đổi vừa sức review:</strong> một thay đổi nhỏ, tập trung dễ hiểu và dễ duyệt hơn một sửa đổi lan man trộn nhiều mối quan tâm.
  Nếu người review không giữ được nó trong đầu, có lẽ nó quá to.</li>
</ul>

<h3>Claude làm trợ lý review, con người duyệt</h3>
<p>Claude đọc được diff, gắn cờ lỗi có khả năng, chỉ ra chỗ thiếu xử lý lỗi, hay tóm tắt bằng lời thường một thay đổi prompt hoặc schema thật sự làm gì.
Điều đó mở rộng phạm vi review và bắt được thứ một người mệt mỏi đọc lướt qua. Nhưng <strong>quyền duyệt là của con người</strong>: một người xem gợi ý của Claude
và duyệt mọi thay đổi trước khi merge. Kiểu thất bại là để sự tự tin của trợ lý thay cho phán đoán. Một lời giải thích trôi chảy <strong>không phải bằng chứng</strong> thay đổi là đúng.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Phân loại lỗi trước khi retry; chỉ retry cái tự hết được.</li>
  <li>Tạo, kiểm tra, hỏi lại; parse phòng thủ; review diff prompt và schema như logic thật.</li>
  <li>Câu trả lời tự tin không phải câu trả lời đúng; Claude hỗ trợ review, con người duyệt.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">a person still sits in the pipeline</em>: vẫn có một người ngồi trong quy trình.</li>
  <li><em class="en">most review problems surface quickly</em>: phần lớn vấn đề review lộ ra nhanh.</li>
  <li><em class="en">quietly goes wrong</em>: âm thầm sai.</li>
  <li><em class="en">The classic smell</em>: mùi code kinh điển.</li>
  <li><em class="en">looks robust at a glance</em>: thoáng nhìn thì có vẻ vững.</li>
  <li><em class="en">You know the split cold</em>: bạn thuộc lòng sự phân chia đó.</li>
  <li><em class="en">a defect hiding the real problem</em>: một lỗi đang che vấn đề thật.</li>
  <li><em class="en">the log fills with noise</em>: log đầy rác.</li>
  <li><em class="en">confident but wrong output</em>: output tự tin nhưng sai.</li>
  <li><em class="en">a rubber stamp</em>: đóng dấu cho qua.</li>
  <li><em class="en">a tired human skims past</em>: một người mệt mỏi đọc lướt qua.</li>
  <li><em class="en">a confident response is not a correct response</em>: câu trả lời tự tin không phải câu trả lời đúng.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson21/Lesson21.java</code>. Có 4 bài: tìm các status đang bị retry sai, viết vòng tạo, kiểm tra, hỏi lại kèm lỗi,
đọc một trường số nguyên một cách phòng thủ và thất bại rõ ràng, và quyết định một pull request có vừa sức review không.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-21"</code>.</p>
<p>Làm xong, chạy với Claude thật bằng <code>-Dexec.args="p2-21 --live"</code>: vòng tạo, kiểm tra, hỏi lại chạy với một validator nghiệp vụ thật
(đúng 3 ý, mỗi ý ngắn), rồi Claude làm trợ lý review một đoạn code gọi API có catch-all retry, còn quyết định duyệt là của bạn.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Ba trọng tâm khi review code tích hợp Claude là gì?', options: ['Tốc độ, chi phí, giao diện người dùng', 'Xử lý lỗi, kiểm tra response theo schema và nghiệp vụ, parse phòng thủ', 'Model được chọn, độ dài prompt và temperature của từng lời gọi', 'Đặt tên, comment, định dạng code'], answer: 1, explain: '"Error handling, response validation, defensive parsing. Keep those three in view and most review problems surface quickly."' },
    { q: 'Điều đầu tiên cần tìm khi review xử lý lỗi là gì?', options: ['Số lần retry tối đa', 'Thời gian chờ giữa các lần', 'Lỗi có được phân loại trước không', 'Code có ghi log đầy đủ mọi request và response không'], answer: 2, explain: '"The first thing I look for is whether the code classifies the error before it reacts."' },
    { q: '"Mùi code kinh điển" trong xử lý lỗi là gì?', options: ['Một catch-all retry mọi thứ', 'Một switch rẽ nhánh theo từng status code khác nhau', 'Một hàm retry có backoff', 'Một log ghi lỗi chi tiết'], answer: 0, explain: '"The classic smell is a single catch-all block that treats every exception identically and retries it. That looks robust at a glance but it isn\'t."' },
    { q: 'Retry bao quanh một bad request (400) dẫn tới điều gì?', options: ['Sớm muộn cũng thành công ở lần thứ ba hoặc thứ tư', 'Server tự sửa request', 'Không ảnh hưởng gì', 'Đốt ngân sách và không bao giờ thành công, vì lỗi vĩnh viễn lặp lại y hệt'], answer: 3, explain: '"A retry loop wrapped around a bad request just burns budget and never succeeds because a permanent failure returns the same answer on every attempt."' },
    { q: 'Câu hỏi duy nhất nên đặt cho mọi chính sách retry là gì?', options: ['Có retry đủ 5 lần chưa?', 'Code có chỉ retry những lỗi thật sự tự hết được không?', 'Có dùng thư viện retry chuẩn?', 'Có retry song song không?'], answer: 1, explain: '"In review it compresses into one question. Is the code only retrying the errors that can actually clear?"' },
    { q: 'Một chính sách retry các status {429, 500, 401, 400}. Status nào bị retry SAI?', options: ['429 và 500', 'Chỉ 500', '401 và 400', 'Không cái nào'], answer: 2, explain: '"A bad request, a malformed schema, or an auth failure returns the same result every time so a retry wrapped around one is a defect."' },
    { q: 'Job đêm retry một request hỏng 3 lần cho mỗi bản ghi. Hậu quả bài học nêu là gì?', options: ['Log đầy rác', 'Dữ liệu hỏng tự được sửa sau vài lần thử lại', 'Job chạy nhanh hơn', 'Batch được giảm giá'], answer: 0, explain: '"Every attempt fails the same way and the log fills with noise instead of one clear error you could have fixed in minutes."' },
    { q: 'Vì sao review không thể dừng ở "lời gọi trả về thành công"?', options: ['Vì API hay trả sai status', 'Vì response thành công thì không bao giờ có trường usage đi kèm', 'Vì SDK che lỗi', 'Vì câu sai cũng trôi chảy như câu đúng'], answer: 3, explain: '"Claude states a wrong answer with the same fluency as a right one so review can\'t stop at whether the call returned successfully."' },
    { q: 'Vòng kiểm tra response đầy đủ là gì?', options: ['Tạo rồi trả về ngay', 'Tạo, kiểm tra, hỏi lại', 'Tạo hai lần, chọn cái dài hơn', 'Kiểm tra cú pháp ở cuối'], answer: 1, explain: '"The full loop is generate, validate, and reprompt not a one-shot check."' },
    { q: 'Khi response trượt kiểm tra, code nên làm gì?', options: ['Trả về response đó kèm cảnh báo', 'Bỏ qua và dùng giá trị mặc định', 'Hỏi lại kèm lỗi cụ thể', 'Đổi sang model khác ngay'], answer: 2, explain: '"On failure the code should reprompt with the specific error so the model gets a chance to correct itself."' },
    { q: 'Kiểu kiểm tra nào bài học cảnh báo là CHƯA đủ?', options: ['Chỉ kiểm tra cú pháp, hoặc chỉ ở tận cuối', 'Kiểm tra ngữ nghĩa kết hợp với một đường sửa lỗi', 'Kiểm tra theo quy tắc nghiệp vụ', 'Kiểm tra theo schema rồi hỏi lại'], answer: 0, explain: '"Watch for validation that only checks syntax or that only runs at the very end. Semantic checks plus a correction path are what actually catch a plausible but wrong result."' },
    { q: '"Tolerant extraction" nghĩa là gì?', options: ['Bỏ qua mọi lỗi parse', 'Chấp nhận mọi output', 'Tự đoán một giá trị hợp lý mỗi khi thiếu trường', 'Đọc trường mà không giả định nó có mặt hay đúng kiểu, xử lý thiếu có chủ đích'], answer: 3, explain: '"The code reads fields without assuming they\'re present or well typed and it handles a missing or null value on purpose."' },
    { q: 'Output không khớp mong đợi của parser. Code nên làm gì?', options: ['Chạy tiếp với phần đọc được', 'Dừng an toàn và báo to', 'Lặng lẽ trả chuỗi rỗng', 'Tự điền giá trị hợp lý'], answer: 1, explain: '"When the output doesn\'t match what the parser expected it fails safely and loudly rather than proceeding on half-formed data."' },
    { q: 'Đã bật structured outputs. Code phía sau có nên coi response là hợp đồng được bảo đảm?', options: ['Có, structured outputs đảm bảo mọi thứ', 'Có, nếu model đủ mạnh', 'Không, vẫn không tin mù quáng vì JSON đúng hình dạng chưa chắc đúng giá trị', 'Chỉ khi temperature bằng 0'], answer: 2, explain: '"Even with structured outputs turned on downstream code shouldn\'t treat a confident looking response as a guaranteed contract."' },
    { q: 'Sửa prompt và sửa schema nên được review thế nào?', options: ['Như logic ứng dụng', 'Đóng dấu cho qua vì chỉ là cấu hình', 'Không cần review', 'Chỉ cần người viết tự kiểm tra'], answer: 0, explain: '"Prompt edits and schema edits deserve the same scrutiny as application logic not a rubber stamp."' },
    { q: 'Khi schema đổi, người review cần kiểm tra gì?', options: ['Độ dài của schema', 'Tên các trường trong schema có viết bằng tiếng Anh chuẩn không', 'Số trường bắt buộc', 'Có làm hỏng response hợp lệ hay parser không'], answer: 3, explain: '"Check it against the structured output rules your integration relies on so an edit doesn\'t quietly reject valid responses or break a downstream parser."' },
    { q: '"Cái bẫy" về prompt và schema là gì?', options: ['Viết prompt quá ngắn', 'Coi chúng là cấu hình nằm ngoài review', 'Version chúng bằng Git', 'Diff chúng trong pull request như mọi thay đổi code khác'], answer: 1, explain: '"The trap is treating prompts and schemas as configuration that lives outside code review."' },
    { q: 'Câu nào là tiêu chí "dễ đọc" trong review?', options: ['Code càng ngắn càng tốt', 'Mỗi hàm làm mọi việc một lúc cho gọn và ít file', 'Request, lời gọi, kiểm tra và parse đọc lần lượt từ trên xuống dưới', 'Dùng tên viết tắt cho nhanh'], answer: 2, explain: '"The request, the call, the validation, and the parse should read top to bottom not hide inside one dense block."' },
    { q: 'Dấu hiệu một thay đổi quá to là gì?', options: ['Không giữ được nó trong đầu', 'Nó có hơn một commit trong lịch sử của branch', 'Nó có test kèm theo', 'Nó sửa cả prompt'], answer: 0, explain: '"If a reviewer can\'t hold the change in their head it\'s probably too big."' },
    { q: 'Claude giúp được gì khi review?', options: ['Tự merge thay đổi đúng', 'Thay hoàn toàn người review', 'Đảm bảo chắc chắn thay đổi không còn bug nào trước khi merge', 'Gắn cờ lỗi, tóm tắt thay đổi prompt'], answer: 3, explain: '"Claude can read a diff and flag likely defects, point out missing error handling, or summarize what a prompt or schema change actually does in plain language."' },
    { q: 'Ai duyệt thay đổi cuối cùng?', options: ['Claude, nếu nó tự tin', 'Một con người', 'CI tự động', 'Người viết code'], answer: 1, explain: '"But the approval stays human. A person reviews Claude\'s suggestions and approves every change before it merges."' },
    { q: 'Kiểu thất bại khi dùng Claude làm trợ lý review là gì?', options: ['Claude đọc quá chậm', 'Claude thường bỏ sót các lỗi chính tả trong comment', 'Để sự tự tin của trợ lý thay cho phán đoán', 'Claude không đọc được diff'], answer: 2, explain: '"The failure mode is letting the assistant\'s confidence stand in for judgment."' },
    { q: 'Theo bài học, một lời giải thích trôi chảy của Claude là gì?', options: ['Không phải', 'Bằng chứng thay đổi đúng', 'Đủ để duyệt', 'Thay được test'], answer: 0, explain: '"Remember, a fluent explanation isn\'t proof the change is correct."' },
    { q: 'Timeout và bad request nên được xử lý thế nào?', options: ['Như nhau, đều retry', 'Như nhau, đều báo lỗi ngay cho người dùng cuối', 'Đều bỏ qua', 'Khác nhau: timeout thì retry có backoff, bad request thì sửa hoặc chuyển lên trên'], answer: 3, explain: '"A timeout isn\'t a bad request and treating them the same is the root of a lot of flaky behavior."' },
    { q: 'Code review cho phát hiện: response được kiểm tra schema nhưng sai thì code im lặng dùng giá trị mặc định. Nên góp ý gì?', options: ['Ổn, vì không làm sập pipeline', 'Thất bại rõ ràng hoặc hỏi lại kèm lỗi', 'Nên tắt kiểm tra schema đi cho pipeline chạy nhanh hơn', 'Nên tăng max_tokens'], answer: 1, explain: 'Parse phòng thủ yêu cầu "fails safely and loudly"; kiểm tra response cần "reprompt with the specific error". Im lặng dùng mặc định che mất lỗi.' },
    { q: 'Câu chốt cuối bài là gì?', options: ['Retry mọi lỗi là an toàn', 'Structured outputs đã giải quyết mọi vấn đề về độ đúng của câu trả lời', 'Tự tin không có nghĩa là đúng', 'Claude nên tự duyệt code của nó'], answer: 2, explain: '"Keep in mind a confident response is not a correct response."' },
    { q: 'Vì sao một thay đổi nhỏ, tập trung được ưa hơn?', options: ['Dễ hiểu và dễ duyệt hơn một sửa đổi lan man trộn nhiều mối quan tâm', 'Vì tốn ít token hơn', 'Vì CI chạy nhanh hơn', 'Vì Git không cho commit lớn'], answer: 0, explain: '"A small focused change is easier to reason about and approve than a sprawling edit that mixes many concerns."' },
    { q: 'Vì sao một chút câu chữ trong prompt cần được người review thấy rõ?', options: ['Vì prompt có bản quyền', 'Vì độ dài prompt quyết định giá của mỗi lời gọi API', 'Vì nó làm hỏng JSON', 'Vì đẩy output đi'], answer: 3, explain: '"When a prompt changes I want the diff to show exactly what shifted because a small wording tweak can move the model\'s output in ways a reviewer needs to see."' },
    { q: 'Lợi ích của Claude làm trợ lý review là gì?', options: ['Bỏ được hẳn bước con người duyệt để merge nhanh hơn', 'Mở rộng phạm vi, bắt thứ người mệt bỏ sót', 'Thay được test tự động', 'Đảm bảo không còn bug'], answer: 1, explain: '"That widens your review coverage and it catches things a tired human skims past."' },
    { q: 'Câu nào tóm tắt đúng bài học?', options: ['Chỉ cần kiểm tra lời gọi trả về thành công là đủ để duyệt', 'Prompt không cần review', 'Phân loại lỗi, kiểm tra và hỏi lại, parse phòng thủ', 'Để Claude tự duyệt mọi PR'], answer: 2, explain: '"Classify errors before you retry. Validate responses and re-prompt on failure. Parse output defensively and review prompt and schema diffs like real logic."' },
  ],
};
