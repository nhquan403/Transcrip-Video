window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Tích hợp Claude lớn dần thì cùng một tên model, cùng một đoạn prompt, cùng một logic retry bị chép khắp hàng chục file;
đổi một thứ là phải sửa tất cả. <strong>Refactor</strong> là sắp xếp lại code đang chạy cho dễ đọc, dễ đổi, <strong>mà không đổi hành vi</strong>:
gom lời gọi API sau <strong>một client</strong>, rút prompt dùng chung thành <strong>fragment</strong>, và giảm <strong>coupling</strong> để mỗi thay đổi chỉ chạm một chỗ.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>Refactor:</strong> tái cấu trúc code đang chạy cho dễ đọc, dễ bảo trì, giữ nguyên output.</li>
  <li><strong>Seam (đường nối):</strong> một ranh giới sạch, như một interface, mà phần còn lại của app phụ thuộc vào.</li>
  <li><strong>Fragment:</strong> một đoạn chỉ dẫn được đặt tên, dùng chung ở nhiều chỗ gọi.</li>
  <li><strong>Coupling:</strong> mức độ một thay đổi ở chỗ này buộc phải sửa ở chỗ khác.</li>
</ul>

<h3>Refactor có kỷ luật: ba ý neo</h3>
<ul>
  <li><strong>Giữ nguyên hành vi:</strong> output trước và sau như nhau; bạn chỉ đổi cách tổ chức. Người dùng không được nhận ra gì.</li>
  <li><strong>Test là lưới an toàn:</strong> test xác nhận hành vi không đổi, để bạn tái cấu trúc tự tin.</li>
  <li><strong>Để riêng:</strong> refactor và thay đổi tính năng <strong>không chung một commit</strong>, vì trộn lẫn làm review và rollback khổ sở.</li>
</ul>

<h3>Refactor đáng giá nhất: cô lập lời gọi API sau một client</h3>
<div class="box">🔌 <strong>Hình dung thế này:</strong> Cả tòa nhà đi dây điện thẳng từ cột điện vào từng phòng; muốn đổi nguồn là phải đi lại dây từng phòng.
Gắn một <strong>tủ điện</strong> ở giữa: mọi phòng chỉ nối vào tủ, đổi nguồn chỉ làm ở tủ. Client dùng chung chính là cái tủ điện đó.</div>
<p>Thay vì rải lời gọi SDK thô khắp codebase, bọc chúng trong <strong>một module client</strong> mà phần còn lại của app gọi tới.
Tên model, header, chính sách retry, xử lý lỗi đều nằm ở <strong>một chỗ</strong>. Mọi thứ khác phụ thuộc vào interface của bạn, không phụ thuộc API thô.
Lợi ích hiện ra ngay khi cần đổi: chuyển model mới, chỉnh một header, hay sửa retry thành <strong>sửa một module</strong> thay vì lùng khắp dự án.</p>

<h3>Rải rác và gom lại</h3>
<ul>
  <li><strong>Rải rác:</strong> tên model, header, retry bị copy-paste qua nhiều file. Ghim model mới là sửa từng file, và <strong>bạn sẽ sót một cái</strong>: một bug đang chờ xảy ra.</li>
  <li><strong>Gom lại:</strong> mọi lời gọi đi qua một client dùng chung. Ghim model, đổi header, chỉnh retry xảy ra <strong>đúng một lần</strong>, mọi chỗ gọi tự nhận.</li>
</ul>
<p>Hành vi như nhau, nhưng một bên làm thay đổi <strong>rẻ</strong>, bên kia làm thay đổi <strong>nguy hiểm</strong>.</p>

<h3>Prompt cũng bị trùng lặp, và cách sửa cũng vậy</h3>
<p>Cùng một khối chỉ dẫn xuất hiện ở nhiều chỗ gọi là trùng lặp <strong>đang chờ trôi</strong>: một bản được sửa, các bản khác không, và hành vi thành không nhất quán tùy đường nào chạy.
Cách sửa: rút đoạn chỉ dẫn lặp lại thành <strong>một fragment dùng chung có tên</strong>, lưu system prompt dùng lại như những đơn vị test được riêng.
Mỗi chỗ gọi tham chiếu fragment thay vì giữ bản sao riêng. Sửa câu chữ một lần, mọi chỗ gọi nhận bản đúng cùng lúc.
Coi text prompt là <strong>tài sản dùng lại</strong>, không phải chuỗi literal rải rác.</p>

<h3>Bốn mục tiêu refactor hay gặp</h3>
<ol>
  <li><strong>Prompt trùng lặp:</strong> rút thành một fragment dùng chung.</li>
  <li><strong>Cấu hình viết cứng:</strong> tên model, thiết lập ở từng chỗ gọi, chuyển về một module cấu hình.</li>
  <li><strong>Logic gọi lặp lại:</strong> cùng request, retry, parse chép khắp nơi, bọc sau một client.</li>
  <li><strong>Mối quan tâm rối vào nhau:</strong> dựng prompt, gọi API, parse cùng nằm trong một hàm, tách ra.</li>
</ol>

<h3>Mọi thứ quy về một nguyên tắc: giảm coupling</h3>
<p>Coupling chặt là lý do một lần ghim model biến thành <strong>sửa 20 file</strong>. Khi cô lập lời gọi sau một client và rút prompt thành fragment,
bạn làm thay đổi trở nên <strong>cục bộ</strong>: ghim model nằm trong client, tăng version prompt chỉ đổi một fragment, chỉnh cấu hình chảy ra từ một nguồn.
Đổi model hay tung version prompt mới trở nên rẻ và ít rủi ro. Coupling thấp là thứ cho bạn đi nhanh mà không làm hỏng tích hợp mỗi lần.</p>

<h3>Hai cỡ refactor</h3>
<ul>
  <li><strong>Nhỏ, hằng ngày:</strong> đổi tên biến khó hiểu, tách một hàm phụ, xóa khối trùng. Rủi ro thấp, làm liên tục khi chạm vào code.</li>
  <li><strong>Lớn:</strong> vẽ lại ranh giới module, đưa lớp client vào. Rủi ro cao hơn, nên dựa mạnh vào test và đi từng bước nhỏ review được, không viết lại một lèo.</li>
</ul>
<p>Ở cỡ nào cũng vậy: giữ nguyên hành vi, và không để refactor chung commit với thay đổi tính năng.</p>

<h3>Claude là bạn đồng hành refactor, cùng một ranh giới</h3>
<p>Claude giỏi tìm trùng lặp bạn đã quen mắt không thấy, đề xuất cách rút gọn, nhìn các chỗ gọi rải rác rồi đề xuất một interface client, và soạn nhanh phần cơ học của một refactor lớn.
Hai thứ giữ bạn an toàn: <strong>test</strong> vẫn xác nhận hành vi y nguyên (một đề xuất refactor tự tin vẫn có thể đổi output một cách tinh vi),
và <strong>bạn review, duyệt</strong> từng bước trước khi nó vào. Claude tăng tốc công việc, không thay test hay chữ ký duyệt của con người.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>Refactor giữ nguyên hành vi, có test che chắn, và tách riêng khỏi thay đổi tính năng.</li>
  <li>Cô lập lời gọi API sau một client; rút prompt và cấu hình dùng chung thành đơn vị tái sử dụng.</li>
  <li>Giảm coupling để đổi model hay prompt chỉ chạm một chỗ; Claude giúp, test và người duyệt giữ an toàn.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">every growing integration hits</em>: tích hợp nào lớn dần cũng gặp.</li>
  <li><em class="en">people use the word loosely</em>: người ta dùng từ này lỏng lẻo.</li>
  <li><em class="en">Nobody using the system should notice a thing</em>: người dùng hệ thống không được nhận ra gì.</li>
  <li><em class="en">makes review and rollback painful</em>: làm review và rollback khổ sở.</li>
  <li><em class="en">a hunt across the whole project</em>: một cuộc lùng sục khắp dự án.</li>
  <li><em class="en">One clean seam is worth a lot</em>: một đường nối sạch đáng giá rất nhiều.</li>
  <li><em class="en">a bug waiting to happen</em>: một bug đang chờ xảy ra.</li>
  <li><em class="en">That's the whole argument for the seam</em>: đó là toàn bộ lý lẽ cho đường nối.</li>
  <li><em class="en">duplication waiting to drift</em>: trùng lặp đang chờ trôi lệch.</li>
  <li><em class="en">tangled concerns</em>: các mối quan tâm rối vào nhau.</li>
  <li><em class="en">one giant rewrite</em>: một lần viết lại khổng lồ.</li>
  <li><em class="en">the human sign-off</em>: chữ ký duyệt của con người.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson22/Lesson22.java</code>. Có 5 bài: tìm dòng prompt bị chép ở nhiều chỗ gọi, rút đoạn trùng thành tham chiếu
<code>{{name}}</code>, dựng prompt hoàn chỉnh từ fragment (thiếu fragment thì báo lỗi), đếm số file hard-code tên model (đo coupling),
và dùng test để chứng minh refactor giữ nguyên hành vi. Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-22"</code>. Bài này chỉ có bộ chấm offline.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Vấn đề mở đầu bài học là gì?', options: ['Model trả lời ngày càng chậm', 'Cùng model, prompt, retry bị chép khắp nhiều file', 'Rate limit quá thấp khi số lượng người dùng của app tăng nhanh', 'Prompt quá dài so với context window'], answer: 1, explain: '"The same model name, the same prompt text, and the same retry logic end up copied across dozens of files. Then a single change means editing all of them."' },
    { q: 'Refactor là gì?', options: ['Thêm tính năng mới cho app', 'Viết lại toàn bộ ứng dụng bằng một ngôn ngữ lập trình khác', 'Sắp xếp lại code', 'Sửa bug theo báo cáo người dùng'], answer: 2, explain: '"Refactoring is restructuring working code to make it more readable and maintainable without changing what it does."' },
    { q: 'Ba ý neo của refactor có kỷ luật là gì?', options: ['Giữ nguyên hành vi, có test che chắn, và để riêng khỏi tính năng', 'Nhanh, rẻ, đẹp', 'Đổi model, đổi prompt, đổi schema', 'Viết lại, xóa cũ, deploy ngay'], answer: 0, explain: '"Behavior preserving, test backed, and kept separate. That\'s a disciplined refactor."' },
    { q: 'Vai trò của test khi refactor là gì?', options: ['Làm code chạy nhanh hơn', 'Thay hoàn toàn cho việc review code của đồng đội', 'Tự động viết lại code cho gọn', 'Lưới an toàn: xác nhận hành vi không đổi'], answer: 3, explain: '"Second, tests are your safety net. They confirm behavior didn\'t change so you can restructure with confidence."' },
    { q: 'Vì sao không gộp refactor và thay đổi tính năng vào một commit?', options: ['Vì Git không cho phép', 'Review và rollback khổ sở', 'Vì commit sẽ quá lớn để push', 'Vì CI chỉ chạy được một loại'], answer: 1, explain: '"A refactor and a feature change shouldn\'t share a commit because mixing them makes review and rollback painful."' },
    { q: 'Refactor đáng giá nhất trong phần lớn tích hợp Claude là gì?', options: ['Đổi tên mọi biến cho ngắn', 'Chuyển toàn bộ lời gọi sang Batches API cho rẻ hơn một nửa', 'Cô lập lời gọi API sau một client', 'Xóa toàn bộ xử lý lỗi cho gọn'], answer: 2, explain: '"The highest value refactor in most Claude integrations is isolating the API call behind one clean interface."' },
    { q: 'Những gì nên nằm trong module client dùng chung?', options: ['Tên model, header, chính sách retry và xử lý lỗi', 'Giao diện người dùng', 'Dữ liệu khách hàng', 'Toàn bộ prompt của mọi tính năng'], answer: 0, explain: '"The model name, the headers, the retry policy, and the error handling all live in that one place."' },
    { q: 'Sau khi có client dùng chung, đổi sang model mới thì sao?', options: ['Phải sửa từng file gọi API', 'Không đổi được nữa', 'Phải viết lại client từ đầu', 'Chỉ sửa một module'], answer: 3, explain: '"Swapping to a new model, adjusting a header, or tweaking retry behavior becomes a one module edit instead of a hunt across the whole project."' },
    { q: 'Ở phiên bản "rải rác", ghim model mới dẫn tới rủi ro gì?', options: ['Không có rủi ro nào', 'Sót một file: bug đang chờ', 'Model mới chạy chậm hơn model cũ ở mọi file', 'Chi phí tăng gấp đôi'], answer: 1, explain: '"When you need to pin a new model, you\'re editing every one of them and you will miss one. That missed spot is a bug waiting to happen."' },
    { q: 'So sánh rải rác và gom lại, câu nào ĐÚNG?', options: ['Gom lại đổi hành vi của app', 'Rải rác an toàn hơn vì mỗi file độc lập, sửa file này không ảnh hưởng file kia', 'Hành vi như nhau, nhưng gom lại làm thay đổi rẻ', 'Gom lại chỉ dùng được cho app nhỏ'], answer: 2, explain: '"Same behavior either way, but one of them makes change cheap and the other makes it dangerous."' },
    { q: 'Cùng một khối chỉ dẫn xuất hiện ở nhiều chỗ gọi. Vì sao đó là vấn đề?', options: ['Trùng lặp đang chờ trôi lệch', 'Vì tốn thêm token mỗi lần gọi', 'Vì Claude không đọc được chỉ dẫn lặp', 'Vì vi phạm bản quyền prompt'], answer: 0, explain: '"That\'s duplication waiting to drift. One copy gets updated, the others don\'t, and now your behavior is inconsistent."' },
    { q: 'Cách sửa prompt trùng lặp là gì?', options: ['Xóa hết các bản trừ một chỗ gọi', 'Viết lại mỗi bản cho khác nhau', 'Chuyển hết prompt vào database', 'Rút thành một fragment có tên'], answer: 3, explain: '"The refactor is to pull that repeated instruction text into one shared named fragment... Then each call site references the shared fragment."' },
    { q: 'Lợi ích của fragment dùng chung là gì?', options: ['Prompt ngắn hơn', 'Sửa một lần, mọi chỗ gọi đều nhận', 'Claude trả lời nhanh hơn', 'Không cần version prompt trong Git nữa'], answer: 1, explain: '"Fix the wording once and every caller gets the corrected version at the same time."' },
    { q: 'Theo bài học, nên đối xử với text prompt thế nào?', options: ['Như chuỗi literal tại chỗ gọi', 'Như dữ liệu người dùng', 'Như tài sản dùng lại', 'Như bí mật không cần version'], answer: 2, explain: '"Treat prompt text as a reusable asset, not as string literals scattered around."' },
    { q: 'Mục nào KHÔNG thuộc bốn mục tiêu refactor hay gặp?', options: ['Màu giao diện', 'Prompt trùng lặp', 'Cấu hình viết cứng', 'Logic gọi lặp lại'], answer: 0, explain: 'Bốn mục tiêu là "duplicated prompts, inline config, repeated call logic, tangled concerns".' },
    { q: 'Một hàm vừa dựng prompt, vừa gọi API, vừa parse. Đây là mục tiêu refactor nào?', options: ['Prompt trùng lặp', 'Cấu hình viết cứng', 'Logic gọi lặp lại', 'Rối mối quan tâm'], answer: 3, explain: '"Tangled concerns where prompt building, the API call, and parsing all live in one function which you split apart."' },
    { q: 'Coupling là gì?', options: ['Số dòng code của một file', 'Đổi chỗ này buộc sửa chỗ khác', 'Số model app dùng', 'Số lần gọi API mỗi phút'], answer: 1, explain: '"Coupling is how much a change in one place forces changes somewhere else."' },
    { q: 'Vì sao một lần ghim model biến thành sửa 20 file?', options: ['Vì model mới khó dùng', 'Vì Git chậm', 'Vì coupling chặt giữa các chỗ gọi', 'Vì thiếu test'], answer: 2, explain: '"Tight coupling is why a simple model pin turns into a 20-file edit."' },
    { q: 'Sau khi giảm coupling, tăng version một prompt chạm tới đâu?', options: ['Đúng một fragment dùng chung có tên', 'Mọi file có gọi API', 'Toàn bộ client', 'Cấu hình của từng người'], answer: 0, explain: '"A model pin update lives in the client. A prompt version bump changes one shared fragment."' },
    { q: 'Refactor nhỏ hằng ngày gồm những gì?', options: ['Vẽ lại ranh giới module', 'Đưa lớp client mới vào', 'Viết lại toàn bộ hệ thống trong một commit lớn', 'Đổi tên, tách hàm phụ, xóa khối trùng'], answer: 3, explain: '"Small refactors are the everyday kind. Rename a confusing variable, extract a helper, delete a duplicated block."' },
    { q: 'Refactor lớn nên làm thế nào?', options: ['Viết lại một lèo trong một commit', 'Dựa vào test, đi từng bước nhỏ', 'Không cần test vì đã có kinh nghiệm', 'Gộp chung với tính năng mới cho tiện'], answer: 1, explain: '"They carry more risk so you lean hard on tests and move in small, reviewable steps rather than one giant rewrite."' },
    { q: 'Quy tắc chung cho mọi cỡ refactor là gì?', options: ['Refactor càng to càng tốt', 'Luôn kèm tính năng mới', 'Giữ hành vi, tách khỏi tính năng', 'Chỉ refactor khi có bug được người dùng báo cáo'], answer: 2, explain: '"You preserve behavior and you keep the refactor out of any commit that also changes a feature."' },
    { q: 'Claude giúp refactor ở những việc nào?', options: ['Tìm trùng lặp bạn đã quen mắt, đề xuất một interface client', 'Tự duyệt và merge refactor', 'Thay hoàn toàn bộ test', 'Đảm bảo refactor không đổi hành vi'], answer: 0, explain: '"It can spot duplication you\'ve stopped noticing and suggest a clean extraction. It can look at scattered call sites and propose a client interface."' },
    { q: 'Vì sao vẫn cần test khi Claude đề xuất refactor?', options: ['Vì Claude không viết được Java', 'Vì test chạy nhanh hơn Claude', 'Vì luật yêu cầu', 'Vì vẫn có thể đổi output'], answer: 3, explain: '"Tests still verify that behavior stayed exactly the same because a confident refactor suggestion can still change output in a subtle way."' },
    { q: 'Claude thay thế được điều gì trong refactor?', options: ['Test', 'Không thay cái nào', 'Người duyệt', 'Cả test lẫn người duyệt'], answer: 1, explain: '"Claude accelerates the work. It doesn\'t replace the tests or the human sign-off that make refactoring trustworthy."' },
    { q: 'Ba file đang hard-code "claude-opus-4-8". Sau khi gom vào client, có bao nhiêu file còn chứa chuỗi đó?', options: ['3', '0', '1', '4'], answer: 2, explain: 'Tên model chỉ còn nằm trong client dùng chung, "the model name... all live in that one place".' },
    { q: 'Refactor đúng phải đảm bảo điều gì về prompt cuối cùng gửi cho Claude?', options: ['Giống hệt trước', 'Ngắn hơn trước', 'Dùng model mới', 'Có thêm ví dụ'], answer: 0, explain: 'Refactor là "behavior preserving. The output is the same before and after." Prompt cuối cùng gửi đi phải giống hệt.' },
    { q: 'Người dùng hệ thống nên nhận ra gì sau một refactor?', options: ['Giao diện mới', 'Tính năng mới', 'Tốc độ chậm hơn', 'Không gì cả'], answer: 3, explain: '"You\'ve only reshaped how the code is organized. Nobody using the system should notice a thing."' },
    { q: 'Lợi ích của coupling thấp là gì?', options: ['Ít file hơn', 'Đi nhanh mà không làm hỏng tích hợp mỗi lần', 'Không cần test', 'Không cần version control'], answer: 1, explain: '"Low coupling is what lets you move fast without breaking the integration every time."' },
    { q: 'Câu tổng kết đúng của bài là gì?', options: ['Refactor để thêm tính năng nhanh hơn', 'Chép prompt ra từng file cho độc lập', 'Cô lập lời gọi, rút phần dùng chung', 'Để Claude refactor rồi merge thẳng'], answer: 2, explain: '"Isolate your API calls behind one clean client. Extract shared prompts and config into reusable units and reduce coupling so a model or prompt change touches a single place."' },
  ],
};
