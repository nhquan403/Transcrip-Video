window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Dù bạn gọi Claude bằng ngôn ngữ nào, thực chất bạn chỉ đang gửi <strong>một loại HTTP request</strong>:
một lệnh <strong>POST</strong> tới <strong>Messages endpoint</strong>, JSON vào và JSON ra. SDK chỉ là một "client thân thiện" gọi đúng endpoint đó,
và API là <strong>stateless</strong>: nó không nhớ gì giữa các lần gọi.</p>

<h3>📌 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>REST API</strong>: dịch vụ web gọi qua HTTP: gửi request tới một URL (có verb, headers, body), nhận về response có cấu trúc.</li>
  <li><strong>JSON</strong>: định dạng dữ liệu của cả request lẫn response.</li>
  <li><strong>Messages endpoint</strong>: "con ngựa thồ", gần như mọi việc đều đi qua một lệnh POST tới endpoint này.</li>
  <li><strong>messages array</strong>: cuộc hội thoại đã gắn vai trò (<strong>user</strong> / <strong>assistant</strong>), xếp đúng thứ tự.</li>
  <li><strong>Content blocks</strong>: phần thân của response, là các khối có kiểu (text hoặc tool call), kèm metadata như <strong>stop reason</strong> và <strong>token usage</strong>.</li>
  <li><strong>Stateless</strong>: endpoint không nhớ gì giữa các lần gọi; mỗi request tự đứng một mình.</li>
  <li><strong>OpenAPI specification</strong>: bản mô tả máy đọc được của mọi endpoint, là nguồn để sinh ra các SDK.</li>
  <li><strong>Wire level</strong>: mức "trên dây", tức request/response thô thực sự đi qua mạng.</li>
</ul>

<h3>Một request gồm những gì?</h3>
<p>Hãy coi một request là <strong>mọi thứ Claude cần để xử lý một lượt</strong>, gói vào một JSON body:</p>
<ul>
  <li><strong>model</strong>: nói cho dịch vụ biết bạn muốn dùng Claude nào.</li>
  <li><strong>messages</strong>: cuộc hội thoại tới giờ, lượt user và lượt assistant theo thứ tự.</li>
  <li>Vài <strong>generation parameters</strong>, ví dụ <code>max_tokens</code> để giới hạn độ dài câu trả lời.</li>
</ul>
<p>Response trả về cũng có cấu trúc: một danh sách <strong>content blocks</strong> có kiểu (text thật hoặc tool call), bọc thêm metadata như <strong>stop reason</strong> và số token đã dùng.</p>

<h3>Hai cách gọi, cùng một điểm đến</h3>
<div class="box">📮 <strong>Hình dung thế này:</strong> Gửi thư tới cùng một địa chỉ. Cách 1 (<strong>raw REST</strong>): bạn tự mua phong bì, tự viết địa chỉ, tự dán tem, tự mở thư trả lời.
Cách 2 (<strong>SDK</strong>): bạn đưa nội dung cho bưu điện, họ đóng gói giúp và đưa lại thư trả lời đã mở sẵn. Lá thư đi trên đường <strong>giống hệt nhau</strong>,
chỉ khác bạn phải tự làm bao nhiêu việc.</div>
<ul>
  <li><strong>Raw REST</strong>: tự đặt headers, tự chuyển dữ liệu thành chuỗi JSON, POST tới endpoint, rồi tự parse JSON trả về.</li>
  <li><strong>SDK</strong>: viết kiểu <code>client.messages.create(...)</code> với tham số có kiểu; SDK ráp <strong>đúng y request đó</strong>, gửi đi, và trả về một <strong>typed response object</strong>.</li>
  <li>Cùng endpoint, cùng body trên dây. Khác biệt duy nhất: <strong>bạn phải tự viết bao nhiêu</strong>.</li>
</ul>

<h3>Một endpoint, nhiều tính năng</h3>
<ul>
  <li><strong>Tools</strong>, <strong>structured output</strong>, <strong>extended thinking</strong>, <strong>prompt caching</strong> không phải dịch vụ riêng. Chúng là <strong>các field</strong> thêm vào cùng một Messages call.</li>
  <li>Vì vậy khi Anthropic ra tính năng mới, thường nó chỉ là <strong>thêm một field</strong> trên lời gọi bạn đã biết.</li>
  <li>Có vài <strong>endpoint phụ</strong> cùng phong cách REST + JSON:
    <strong>Batches</strong> (gửi nhiều request không gấp, xử lý bất đồng bộ, <strong>giá bằng một nửa</strong>),
    <strong>Files</strong> (upload tài liệu một lần, dùng lại nhiều lần),
    <strong>Models</strong> (liệt kê model tài khoản bạn dùng được),
    <strong>Count tokens</strong> (đo kích thước request <strong>trước khi tốn tiền</strong> để tính chi phí và context).</li>
</ul>

<h3>Stateless: API không nhớ bạn là ai</h3>
<ul>
  <li>Mỗi request <strong>đứng một mình</strong>. Không có session token, không có bộ nhớ phía server giữ hội thoại hộ bạn.</li>
  <li>Hội thoại nhiều lượt → bạn phải <strong>gửi lại toàn bộ lịch sử</strong> mỗi lần.</li>
  <li>Khi Claude trả lời, <strong>bạn</strong> phải tự <strong>append</strong> câu trả lời đó vào messages array trước lần gọi tiếp theo.</li>
  <li>Đây là lý do <strong>context management</strong> quan trọng: cuộc hội thoại chỉ tồn tại vì bạn gửi lại nó, và mọi thứ trong đó đều tính vào <strong>context window</strong>.</li>
</ul>

<h3>SDK và REST khớp nhau chính xác ra sao?</h3>
<ul>
  <li>SDK được <strong>sinh ra từ một OpenAPI spec duy nhất</strong> → tính năng mới xuất hiện ở Python, TypeScript và các client khác <strong>cùng lúc</strong>.</li>
  <li>Field <strong>map một-một</strong>: field JSON trong API thành tham số SDK, chỉ khác kiểu đặt tên (snake_case hay camelCase).</li>
  <li>Hành vi trên dây <strong>giống hệt</strong>: không có gì "thêm" xảy ra trên mạng.</li>
  <li>Lợi ích: debug ở <strong>wire level</strong> (log raw request/response), dùng thẳng <strong>API docs</strong> cho code SDK, và nếu SDK không hỗ trợ gọn một edge case thì <strong>hạ xuống raw HTTP</strong> cho riêng request đó mà không mất gì.</li>
</ul>

<h3>🎯 Cách nhận ra trong đề thi</h3>
<ul>
  <li>Đề hỏi "Claude nhớ hội thoại thế nào" → đáp án đúng: API <strong>stateless</strong>, client phải <strong>gửi lại toàn bộ lịch sử</strong> mỗi lần.</li>
  <li>Đề hỏi muốn dùng tools / caching / thinking thì gọi dịch vụ nào → đáp án: <strong>cùng Messages endpoint</strong>, chỉ thêm field.</li>
  <li>Đề có "nhiều request không gấp, muốn rẻ" → <strong>Batches</strong> (bất đồng bộ, nửa giá); "muốn biết request lớn cỡ nào trước khi gửi" → <strong>Count tokens</strong>.</li>
  <li>Đề hỏi SDK khác raw REST ra sao → đáp án: <strong>cùng request trên dây</strong>, SDK chỉ là lớp tiện lợi.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Server giữ session nên chỉ cần gửi tin nhắn mới" → <strong>sai</strong>, API stateless, phải gửi lại cả lịch sử.</li>
  <li>"Tool use là một API riêng" → <strong>sai</strong>, nó chỉ là field trên Messages call.</li>
  <li>"SDK gửi request khác, có quyền năng riêng" → <strong>sai</strong>, cùng một request, SDK chỉ là convenience layer.</li>
  <li>"Python có tính năng mới trước, TypeScript cập nhật sau" → <strong>sai</strong>, các SDK sinh từ cùng một OpenAPI spec nên cập nhật cùng nhau.</li>
</ul>

<h3>💡 Mẹo nhớ</h3>
<p><strong>Một endpoint, JSON vào JSON ra, không nhớ gì.</strong> SDK chỉ là người đóng gói hộ, lá thư trên đường vẫn y hệt.</p>
`,

  // Explanation-only lesson: no quiz.
  quiz: []
};
