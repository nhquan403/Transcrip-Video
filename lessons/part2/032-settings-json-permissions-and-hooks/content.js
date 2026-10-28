window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> <strong>settings.json</strong> là chỗ cho những thiết lập mà model <strong>không được tự diễn giải lại</strong>.
Ba thứ quan trọng nhất trong đó: <strong>permissions</strong> (allow, deny, ask), <strong>hooks</strong> (script tất định chạy ở các thời điểm cố định)
và <strong>environment</strong> (biến môi trường, chọn model). Đây là <strong>cài đặt, không phải gợi ý</strong>: model không thể "nói khéo" để vượt qua một deny rule.</p>

<h3>📌 Từ cần biết</h3>
<ul class="terms">
  <li><strong>settings.json:</strong> file cấu hình máy đọc được của Claude Code: permissions, hooks, env, model.</li>
  <li><strong>Permission rule:</strong> quy tắc khớp với một tool call và cho ra một trong ba quyết định: allow, deny, ask.</li>
  <li><strong>Hook:</strong> script tất định (deterministic) gắn vào một thời điểm trong vòng đời agent, chạy <strong>bên ngoài model</strong>.</li>
  <li><strong>Lifecycle event:</strong> thời điểm hook có thể chạy, ví dụ PreToolUse, PostToolUse, Notification, Stop, SessionStart.</li>
  <li><strong>permissionDecision:</strong> trường mà một PreToolUse hook đặt để quyết định số phận tool call: allow, deny, ask, defer.</li>
  <li><strong>Fallback model:</strong> model dự phòng dùng khi model mặc định không sẵn sàng.</li>
</ul>

<h3>Trong settings.json có gì?</h3>
<ul>
  <li><strong>Permissions:</strong> quy tắc cho phép, chặn, hoặc hỏi trước khi Claude chạy một tool, để hành động rủi ro <strong>bị chặn cửa</strong> thay vì cứ thế được tin.</li>
  <li><strong>Hooks:</strong> script tất định đăng ký ngay trong file này, chạy ở các sự kiện cố định để <strong>thực thi, ghi log hoặc tự động hóa</strong>.</li>
  <li><strong>Environment:</strong> biến môi trường và lựa chọn model đặt qua config, để mọi phiên đều dùng cùng giá trị mà không phải hard-code trong app.</li>
</ul>

<h3>Permissions: allow, deny, ask</h3>
<ul>
  <li><strong>Allow:</strong> lời gọi khớp được chạy tự động, không hỏi, vì bạn đã quyết định trước là an toàn.</li>
  <li><strong>Deny:</strong> chặn thẳng, hành động nguy hiểm <strong>không bao giờ chạy</strong>.</li>
  <li><strong>Ask:</strong> dừng lại hỏi bạn duyệt hay từ chối, giữ con người trong vòng lặp cho phần "vùng xám".</li>
</ul>
<p>Cách dùng phổ biến: <strong>allow</strong> cho tool thường lệ, <strong>deny</strong> cho vài thứ không bao giờ được xảy ra, <strong>ask</strong> cho phần ở giữa.</p>

<div class="box">🏢 <strong>Hình dung thế này:</strong> settings.json là <strong>hệ thống thẻ từ của tòa nhà</strong>. Allow là cửa quẹt thẻ là vào,
deny là cửa khóa cứng, ask là cửa có bảo vệ gọi hỏi bạn. Còn CLAUDE.md là <strong>tấm bảng "vui lòng giữ yên lặng"</strong>:
người ta đọc và thường làm theo, nhưng không có ổ khóa nào cả. Muốn chắc chắn ai đó không vào phòng máy chủ, bạn khóa cửa, không dán thêm bảng.</div>

<h3>Hooks: khai báo trong config, không phải trong văn xuôi</h3>
<p>Mỗi hook nêu <strong>sự kiện</strong> kích hoạt nó và trỏ tới <strong>lệnh</strong> sẽ chạy khi sự kiện đó xảy ra. Vì hook nằm trong config chứ không nằm trong
suy luận của model, nó chạy <strong>giống hệt nhau mọi lần</strong>, bất kể Claude quyết định gì. Tính tất định đó là toàn bộ lý do tồn tại của hook:
cần điều gì xảy ra chắc chắn thì hook cho bạn một <strong>bảo đảm</strong> mà một chỉ dẫn không bao giờ cho được.</p>

<h3>Năm thời điểm hook đáng biết</h3>
<ul>
  <li><strong>PreToolUse:</strong> trước khi tool call chạy, lúc bạn <strong>còn kịp chặn</strong>.</li>
  <li><strong>PostToolUse:</strong> sau khi tool call xong, khi đã có kết quả.</li>
  <li><strong>Notification:</strong> khi Claude đưa ra một thông báo cho bạn.</li>
  <li><strong>Stop:</strong> khi một câu trả lời hoàn tất.</li>
  <li><strong>SessionStart:</strong> khi một phiên mới bắt đầu, tiện cho việc chuẩn bị.</li>
</ul>
<p>Không cần dùng cả năm. Chọn thời điểm mà hành động bạn quan tâm <strong>tự nhiên nằm ở đó</strong>.</p>

<h3>PreToolUse và PostToolUse: đừng nhầm</h3>
<ul>
  <li><strong>PreToolUse</strong> chạy trước khi tool call đang chờ được thực thi, nên có thể <strong>deny hoặc ask</strong> và chặn thật sự. Guardrail thuộc về đây.</li>
  <li><strong>PostToolUse</strong> chạy khi lời gọi đã xong: tốt cho ghi log hoặc phản ứng với kết quả, nhưng <strong>không chặn được</strong> thứ đã chạy rồi.</li>
</ul>
<p>Muốn <strong>ngăn</strong> hành động rủi ro: PreToolUse. Muốn <strong>ghi lại hoặc phản ứng sau sự việc</strong>: PostToolUse.</p>

<h3>permissionDecision: bốn giá trị</h3>
<ul>
  <li><strong>allow:</strong> duyệt, cho chạy.</li>
  <li><strong>deny:</strong> chặn, không bao giờ chạy.</li>
  <li><strong>ask:</strong> chuyển quyết định cho bạn.</li>
  <li><strong>defer:</strong> không ép kết quả, <strong>rơi về permission rule thường</strong> của bạn.</li>
</ul>
<p>Nếu hook trả về <strong>object rỗng</strong>, lời gọi được giữ nguyên, cư xử như allow.</p>

<h3>Phần "ống nước": env, model, effort</h3>
<ul>
  <li>Biến môi trường mà tool và hook đọc lúc chạy (endpoint, cờ bật tắt) nằm trong config, không rải khắp code.</li>
  <li>Model mặc định cho phiên, và một <strong>fallback</strong> khi model đầu không sẵn sàng.</li>
  <li>Effort level và các tùy chọn harness khác.</li>
</ul>
<p>Chủ đề chung: <strong>đặt giá trị một lần, ở một chỗ</strong>, mọi phiên trong phạm vi đó tự nhận.</p>

<h3>Thay đổi này thuộc về đâu?</h3>
<ul>
  <li><strong>settings.json:</strong> config máy đọc được: permissions, hooks, env.</li>
  <li><strong>CLAUDE.md:</strong> chỉ dẫn ngôn ngữ tự nhiên, Claude đọc như ngữ cảnh hướng dẫn chứ không phải máy móc.</li>
</ul>
<p>Quy tắc đơn giản: <strong>permissions và hooks vào settings.json, không bao giờ vào văn xuôi</strong>, vì văn xuôi là gợi ý còn config được thực thi.</p>
<p><strong>Về nạp lại:</strong> phần lớn key (permissions, hooks, env) có hiệu lực ngay; riêng <strong>model</strong> và <strong>output style</strong> cần khởi động lại hoặc một slash command.</p>

<h3>✅ Nhớ 3 điều</h3>
<ul>
  <li>settings.json chứa permissions (allow/deny/ask), hooks và env/model: là cài đặt được thực thi, không phải gợi ý.</li>
  <li>Muốn chặn thì dùng PreToolUse (permissionDecision: allow, deny, ask, defer); PostToolUse chỉ ghi log/phản ứng sau khi đã chạy.</li>
  <li>Permissions và hooks ở settings.json; hướng dẫn bằng lời ở CLAUDE.md. Model và output style cần restart để nhận thay đổi.</li>
</ul>

<h3>🇬🇧 Cụm từ tiếng Anh đáng nhớ trong bài</h3>
<ul>
  <li><em class="en">a model shouldn't be free to reinterpret</em>: model không được tự do diễn giải lại.</li>
  <li><em class="en">risky actions are gated instead of just trusted</em>: hành động rủi ro bị chặn cửa thay vì cứ thế được tin.</li>
  <li><em class="en">these are settings, not suggestions</em>: đây là cài đặt, không phải gợi ý.</li>
  <li><em class="en">The model can't talk its way past a deny rule</em>: model không thể nói khéo để lách qua một deny rule.</li>
  <li><em class="en">keeping a human in the loop</em>: giữ con người trong vòng lặp ra quyết định.</li>
  <li><em class="en">the gray area</em>: vùng xám, phần không rõ trắng đen.</li>
  <li><em class="en">That determinism is the entire point</em>: tính tất định đó chính là toàn bộ lý do.</li>
  <li><em class="en">a guarantee that an instruction never can</em>: một bảo đảm mà chỉ dẫn không bao giờ cho được.</li>
  <li><em class="en">That's exactly where guardrails belong</em>: đó chính là chỗ của rào chắn an toàn.</li>
  <li><em class="en">after the fact</em>: sau khi sự việc đã xảy ra.</li>
  <li><em class="en">the plumbing you'd otherwise hard code</em>: phần "ống nước" mà nếu không thì bạn phải hard-code.</li>
  <li><em class="en">prose is a suggestion and config is enforced</em>: văn xuôi là gợi ý, còn config thì được thực thi.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p>Mở <code>java-app/src/main/java/part2/lesson32/Lesson32.java</code>. Có 5 bài: đọc khối <code>permissions</code> của một settings.json thật (JSON) và quyết định
ALLOW / DENY / ASK cho một tool call (deny xét trước, rồi ask, rồi allow, hỗ trợ rule dạng <code>Bash(npm run test:*)</code>),
chọn đúng sự kiện hook cho từng mục tiêu và biết sự kiện nào còn kịp chặn tool call, áp <code>permissionDecision</code> của một PreToolUse hook
(gồm defer và object rỗng), xếp từng thay đổi vào settings.json hay CLAUDE.md, và key nào có hiệu lực ngay hay cần khởi động lại.
Chấm bằng <code>./mvnw -q compile exec:java -Dexec.args="p2-32"</code>.</p>
`,

  // answer = index of the correct option in `options` (options are shuffled on screen).
  quiz: [
    { q: 'Theo bài học, ba nhóm thiết lập quan trọng nhất trong settings.json là gì?', options: ['Prompts, examples, tools', 'Permissions, hooks, environment', 'Memory, skills, subagents', 'Themes, keybindings, aliases, fonts'], answer: 1, explain: '"Permissions, hooks, environment. Hold those three and the rest of the file makes sense."' },
    { q: 'Một đồng đội viết vào CLAUDE.md: "Tuyệt đối không chạy rm -rf". Bạn muốn bảo đảm lệnh đó không bao giờ chạy. Lựa chọn tốt nhất là gì?', options: ['Viết lại câu đó bằng chữ in hoa và đặt ở đầu file', 'Nhắc lại quy tắc ở đầu mỗi phiên làm việc', 'Thêm deny rule tương ứng trong settings.json', 'Chuyển câu đó sang output style của phiên'], answer: 2, explain: '"Notice these are settings, not suggestions. The model can\'t talk its way past a deny rule." Văn xuôi chỉ là gợi ý.' },
    { q: 'Một permission rule khớp với tool call. Quyết định nào cho lời gọi chạy ngay mà không hỏi?', options: ['Allow', 'Ask', 'Defer', 'Deny'], answer: 0, explain: '"Allow lets a matching call run automatically with no prompt because you\'ve already decided that action is safe."' },
    { q: 'Với một lệnh nhạy cảm như git push, bạn muốn con người vẫn duyệt từng lần. Nên dùng gì?', options: ['Allow rule để chạy nhanh', 'Deny rule để chặn hẳn', 'Một dòng nhắc trong CLAUDE.md', 'Ask rule để hỏi trước'], answer: 3, explain: '"And ask pauses and prompts you to approve or reject the call, keeping a human in the loop for the sensitive stuff in between."' },
    { q: 'Cách bố trí permission phổ biến mà bài học mô tả là gì?', options: ['Deny mọi thứ rồi ask từng lệnh một cách thủ công', 'Ask cho mọi tool để an toàn tuyệt đối mọi lúc', 'Allow việc thường lệ, deny vài thứ cấm, ask vùng xám', 'Allow mọi thứ rồi dựa vào hook để dọn dẹp'], answer: 2, explain: '"Most setups lean on allow for routine tools and deny for the handful of things you never want to happen with ask covering the gray area."' },
    { q: 'Theo bài học, điểm then chốt về NƠI khai báo một hook là gì?', options: ['Trong system prompt', 'Trong settings.json', 'Trong CLAUDE.md', 'Trong một skill'], answer: 1, explain: '"You put it in settings.json, not in prose."' },
    { q: 'Vì sao một hook chạy giống hệt nhau mọi lần, bất kể Claude nghĩ gì?', options: ['Vì nó nằm trong config, ngoài suy luận của model', 'Vì Claude được huấn luyện để luôn nghe lời hook', 'Vì hook được nhắc lại trong mỗi lượt user gửi đi', 'Vì hook dùng model riêng có temperature bằng 0'], answer: 0, explain: '"Because the hook lives in config rather than in the model\'s reasoning, it fires the same way every single time no matter what Claude decides to do in the moment."' },
    { q: 'Một hook trong settings.json được mô tả bởi hai thành phần nào?', options: ['Một prompt và một model', 'Một tool và một permission', 'Một biến môi trường và một cờ', 'Một sự kiện và một lệnh'], answer: 3, explain: '"Each hook names the event that should trigger it and points to the command that runs when that event happens."' },
    { q: 'Bạn cần chặn một lệnh shell nguy hiểm trước khi nó kịp chạy. Sự kiện hook nào phù hợp?', options: ['PostToolUse', 'PreToolUse', 'Notification', 'Stop'], answer: 1, explain: '"Pre-tool use fires before a tool call runs, which is the moment you can still stop something."' },
    { q: 'Bạn viết một PostToolUse hook để chặn ghi file vào thư mục production. Vấn đề là gì?', options: ['PostToolUse không đọc được tên tool', 'PostToolUse chỉ chạy một lần mỗi phiên làm việc', 'Nó chạy khi lời gọi đã xong, không chặn được', 'PostToolUse chỉ áp cho tool MCP'], answer: 2, explain: '"It fires after the call has already finished, so it\'s great for logging or reacting to a result, but it can\'t block something that has already run."' },
    { q: 'Bạn muốn chạy script chuẩn bị môi trường mỗi khi mở phiên mới. Sự kiện nào hợp nhất?', options: ['PreToolUse', 'Stop', 'Notification', 'SessionStart'], answer: 3, explain: '"Session start fires when a new session begins, handy for setup work."' },
    { q: 'Bạn muốn ghi audit log kết quả của mọi tool call sau khi chúng chạy xong. Sự kiện nào phù hợp?', options: ['PostToolUse', 'PreToolUse', 'SessionStart', 'Notification'], answer: 0, explain: '"Post-tool use fires after a tool call finishes, once the result is in." Hợp cho "logging or reacting to a result".' },
    { q: 'Sự kiện Stop được kích hoạt khi nào?', options: ['Khi người dùng nhấn Ctrl+C', 'Khi một tool call bị deny', 'Khi một câu trả lời hoàn tất', 'Khi phiên bị đóng do hết token'], answer: 2, explain: '"Stop fires when a response completes and session start fires when a new session begins."' },
    { q: 'Câu nào KHÔNG đúng về năm sự kiện hook trong bài?', options: ['Chúng là những điểm hook phổ biến', 'Phải dùng đủ cả năm thì hook mới chạy', 'Chọn sự kiện nơi hành động tự nhiên nằm', 'Mỗi sự kiện là chỗ để thực thi hoặc ghi log'], answer: 1, explain: '"You don\'t have to use all of them. You just pick the moment where the action you care about naturally lives."' },
    { q: 'Một PreToolUse hook muốn can thiệp vào tool call. Nó đặt trường nào?', options: ['permissionDecision', 'stopReason', 'toolChoice', 'hookEventName'], answer: 0, explain: '"When a pre-tool use hook does weigh in on a tool call, it sets a field called permission decision and that field has four possible values."' },
    { q: 'Giá trị nào KHÔNG thuộc bốn giá trị của permissionDecision?', options: ['allow', 'defer', 'ask', 'retry'], answer: 3, explain: '"Allow, deny, ask, defer. Each value maps directly to how the pending call is handled."' },
    { q: 'Hook của bạn chỉ muốn ý kiến ở vài lệnh, còn lại để permission rule thường xử lý. Nó nên trả permissionDecision nào cho phần còn lại?', options: ['allow', 'defer', 'deny', 'ask'], answer: 1, explain: '"The fourth value is defer, which falls back to your normal permission rules instead of forcing an outcome right there."' },
    { q: 'Một PreToolUse hook trả về object rỗng {}. Tool call sẽ thế nào?', options: ['Bị chặn vì hook không trả quyết định', 'Bị hỏi lại người dùng để chắc chắn', 'Giữ nguyên, cư xử như allow', 'Hook bị coi là lỗi và chạy lại'], answer: 2, explain: '"If a hook returns an empty object, the call is simply left unchanged, which behaves like allow."' },
    { q: 'Vì sao bài học nói kết quả của hook quyết định số phận tool call một cách tất định?', options: ['Vì hook luôn hỏi lại Claude trước khi trả lời', 'Vì Claude tự chọn có nghe hook hay không', 'Mỗi giá trị trả về ánh xạ thẳng tới cách xử lý', 'Vì hook chỉ chạy khi model đồng ý'], answer: 2, explain: '"Each value maps directly to how the pending call is handled, so the hook\'s return decides the outcome deterministically."' },
    { q: 'Hook của bạn cần biết URL của một endpoint nội bộ. Nên đặt giá trị đó ở đâu?', options: ['Biến môi trường trong settings.json', 'Hard-code trong từng script hook', 'Một dòng hướng dẫn trong CLAUDE.md của dự án', 'Gõ vào chat mỗi phiên'], answer: 0, explain: '"You can set environment variables that your tools and hooks read at runtime, so a value like an endpoint or a flag lives in config, not scattered through your code."' },
    { q: 'Ngoài model mặc định, settings.json còn cho đặt gì liên quan tới model?', options: ['Giá token của từng model', 'Danh sách model bị cấm dùng', 'Trọng số fine-tune riêng của dự án', 'Fallback khi model đầu không sẵn sàng'], answer: 3, explain: '"You can name a default model for the session and a fallback to use if the first one isn\'t available."' },
    { q: 'Chủ đề chung của phần env, model, effort trong settings.json là gì?', options: ['Mỗi phiên tự đặt lại giá trị cho linh hoạt', 'Đặt một lần ở một chỗ, mọi phiên tự nhận', 'Để model tự chọn giá trị phù hợp nhất', 'Đặt giá trị trong code để dễ review'], answer: 1, explain: '"Set the value once in one place and every session in that scope picks it up instead of you repeating yourself or hard coding it."' },
    { q: 'Thay đổi nào thuộc về CLAUDE.md thay vì settings.json?', options: ['Quy ước đặt tên biến', 'Rule deny cho rm -rf', 'Hook format code', 'Biến môi trường API_URL'], answer: 0, explain: '"CLAUDE.md holds natural language instructions that Claude reads as context guidance rather than machinery."' },
    { q: 'Bài học đưa ra lý do nào cho quy tắc "permissions và hooks không bao giờ nằm trong văn xuôi"?', options: ['Văn xuôi tốn nhiều token hơn JSON', 'CLAUDE.md không được commit vào git', 'Văn xuôi là gợi ý, config được thực thi', 'CLAUDE.md chỉ đọc lúc khởi động'], answer: 2, explain: '"Permissions and hooks go in settings.json, never in prose because prose is a suggestion and config is enforced."' },
    { q: 'Bạn vừa sửa một deny rule trong settings.json khi phiên đang chạy. Điều gì xảy ra?', options: ['Cần khởi động lại Claude Code', 'Phải chạy một slash command riêng', 'Chỉ áp dụng cho phiên kế tiếp', 'Thay đổi có hiệu lực ngay'], answer: 3, explain: '"Most settings.json keys like permissions, hooks, and environment take effect live."' },
    { q: 'Bạn đổi model mặc định trong settings.json nhưng phiên hiện tại vẫn dùng model cũ. Giải thích đúng là gì?', options: ['File bị lỗi cú pháp JSON', 'Model cần restart hoặc slash command', 'Managed policy đang khóa trường model lại', 'Model mới chưa được phát hành'], answer: 1, explain: '"But a couple, model, and output style need a restart or a slash command to pick up."' },
    { q: 'Cặp key nào cần khởi động lại hoặc slash command để nhận thay đổi?', options: ['permissions và hooks', 'env và permissions', 'model và output style', 'hooks và env'], answer: 2, explain: '"A couple, model, and output style need a restart or a slash command to pick up."' },
    { q: 'Theo phần tổng kết, vì sao settings.json quan trọng?', options: ['Nó chứa kiểm soát được thực thi, không phải gợi ý', 'Nó giúp Claude trả lời nhanh và rẻ hơn', 'Nó thay thế hoàn toàn cho CLAUDE.md', 'Nó là nơi duy nhất Claude đọc lúc khởi động'], answer: 0, explain: '"It matters because these are enforced controls, not suggestions the model can interpret."' },
    { q: 'Một hook PreToolUse trả "ask" cho lệnh deploy. Điều gì xảy ra?', options: ['Lệnh chạy ngay, chỉ ghi log lại', 'Lệnh bị chặn và không bao giờ chạy', 'Rơi về permission rule thường', 'Bạn được hỏi duyệt hay từ chối'], answer: 3, explain: '"Ask hands the decision to you to approve or reject."' },
    { q: 'Bạn cần cả hai: chặn lệnh nguy hiểm và ghi lại kết quả các lệnh đã chạy. Thiết kế nào đúng?', options: ['Một PostToolUse hook cho cả hai việc', 'PreToolUse để chặn, PostToolUse để ghi log', 'Một Stop hook kiểm tra toàn bộ phiên', 'Ghi cả hai yêu cầu vào CLAUDE.md thật rõ ràng'], answer: 1, explain: '"If your goal is to prevent a risky action, reach for pre-tool use. If your goal is to record or respond after the fact, post-tool use is the right tool."' }
  ]
};
