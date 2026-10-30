window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Một call Claude = <strong>một JSON object gửi đi</strong> (model, messages, max_tokens) và <strong>một JSON object nhận về</strong> (content, stop_reason, usage).
Bẫy lớn nhất: coi <strong>content là một string</strong>; thực ra nó là <strong>mảng typed blocks</strong>.</p>

<h3>🔑 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Object / array / scalar</strong>: key-value trong <code>{}</code>; danh sách có thứ tự trong <code>[]</code>; string, number, boolean, null.</li>
  <li><strong>model, messages, max_tokens</strong>: 3 khóa cốt lõi của request; quên <code>max_tokens</code> là lỗi hay gặp.</li>
  <li><strong>system, temperature, tools</strong>: khóa tùy chọn (system prompt, độ ngẫu nhiên, hàm cho Claude gọi).</li>
  <li><strong>role</strong>: <code>user</code> hoặc <code>assistant</code>.</li>
  <li><strong>Content blocks</strong>: text, image, tool_use, tool_result; cho phép một lượt trộn chữ và ảnh.</li>
  <li><strong>stop_reason</strong>: vì sao dừng sinh.</li>
  <li><strong>usage</strong>: số input/output tokens, dùng theo dõi chi phí và ngân sách context.</li>
  <li><strong>Base64</strong>: mã hóa ảnh/tài liệu nhị phân thành string, lớn hơn khoảng <strong>1/3</strong>.</li>
</ul>

<h3>🎯 Trọng tâm thi</h3>
<ul>
  <li>Đọc câu trả lời: <strong>duyệt mảng content</strong>, lấy các block <code>type: "text"</code>, nối nếu nhiều hơn một; đọc field <code>text</code>.</li>
  <li><strong>Kiểm tra stop_reason trước khi tin output</strong>: <code>end_turn</code> xong tự nhiên; <code>max_tokens</code> bị cắt; <code>tool_use</code> code của bạn phải chạy tool; <code>stop_sequence</code> chuỗi dừng tùy chỉnh đã kích hoạt.</li>
  <li>Mỗi response: (1) lấy text blocks, (2) check stop_reason, (3) log usage.</li>
  <li>Hội thoại nhiều lượt: Claude đọc theo <strong>thứ tự mảng</strong> → append lượt user/assistant mới vào cuối.</li>
  <li>Body là text <strong>UTF-8</strong>, <code>application/json</code>; ảnh lớn → resize để giảm kích thước request.</li>
  <li>Response còn có metadata: <strong>message ID</strong> và <strong>model đã chạy</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Câu trả lời nằm ở một string cấp cao nhất" → <strong>sai</strong>, nằm trong text block.</li>
  <li>"content của một turn luôn là string" → <strong>sai</strong>, là list typed blocks.</li>
  <li>"Có response là output đầy đủ" → <strong>sai</strong>, có thể bị cắt (<code>max_tokens</code>).</li>
  <li>"Gửi bytes ảnh thô trong JSON" → <strong>sai</strong>, phải Base64.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p><code>part2/lesson16/Lesson16.java</code>: nhận loại giá trị JSON, tìm khóa cốt lõi bị thiếu, lấy câu trả lời bằng cách duyệt content, tính độ dài Base64, ước lượng kích thước body.
Chấm: <code>./mvnw -q compile exec:java -Dexec.args="p2-16"</code>; chạy thật: thêm <code>--live</code>.</p>
`,

  // answer = index of the correct option (options are shuffled on screen); an array means "Choose TWO".
  quiz: [
    { q: "A developer's code reads response.text and gets nothing, although the call succeeded. Where is Claude's answer?", options: ["In a top-level completion string field", "In text blocks of the content array", "In the stop_reason field", "In the usage object"], answer: 1, explain: "\"The output is an array of blocks, and the model's text sits inside a text block in its text field. You pull the answer out of there, not from some top-level string.\"" },
    { q: "A request keeps getting rejected. It includes model and messages. Which core key is MOST likely missing?", options: ["system", "temperature", "tools", "max_tokens"], answer: 3, explain: "Model, messages, and max tokens are \"the core you need on nearly every call\", and max tokens is \"the one people forget\". The others are optional." },
    { q: "A response comes back with stop_reason set to max_tokens. What does this mean?", options: ["The reply was cut off", "Claude finished its answer naturally", "A custom stop string was matched", "Claude is waiting for a tool result"], answer: 0, explain: "\"Max tokens means it ran out of room.\" \"If it says max tokens, your reply got cut off, and you may want to continue it.\"" },
    { q: "A response has stop_reason tool_use. What should the application do?", options: ["Display the text as the final answer", "Resend the request with more tokens", "Run the requested tool before continuing", "Treat it as a server error and retry"], answer: 2, explain: "\"Tool use means it wants to call a tool and is waiting on you.\" \"Your code has work to do before the conversation moves on.\"" },
    { q: "Which stop_reason means Claude finished naturally?", options: ["stop_sequence", "end_turn", "max_tokens", "tool_use"], answer: 1, explain: "\"End turn means Claude finished naturally.\"" },
    { q: "Which stop_reason indicates that one of your custom stop strings fired?", options: ["end_turn", "max_tokens", "tool_use", "stop_sequence"], answer: 3, explain: "\"Stop sequence means one of your custom stop strings fired.\"" },
    { q: "A finance team wants to track cost per call. Which response field should they log?", options: ["usage", "stop_reason", "content", "role"], answer: 0, explain: "Usage holds \"your input and output token counts, which you read for cost tracking and for budgeting context.\"" },
    { q: "A developer models a turn as {role: \"user\", content: \"hi\"} and now needs to send an image in the same turn. What is the key insight?", options: ["Images must go in a separate request", "Images belong in the system field", "Content is a list of typed blocks", "Each image needs its own user role"], answer: 2, explain: "\"Content isn't a plain string. It's a list of typed blocks.\" \"That design is what lets a single turn mix text and images.\"" },
    { q: "How do you continue a multi-turn conversation in the messages array?", options: ["Replace the array with the newest turn", "Append each new message to the end", "Put new turns at the start of the array", "Store prior turns in the system field"], answer: 1, explain: "\"Claude reads the turns in array order. So to continue a conversation, you append each new user and assistant message on to the end.\"" },
    { q: "Which roles can a turn in the messages array have?", options: ["user or system", "assistant or tool", "client or server", "user or assistant"], answer: 3, explain: "Each turn has \"a role, which is either user or assistant, telling Claude who spoke, and content.\"" },
    { q: "A developer needs to send a PDF document inside a JSON request. What must they do?", options: ["Base64-encode it into the content", "Attach the raw bytes after the JSON", "Send it as a multipart file field", "Put the file path in the system field"], answer: 0, explain: "\"You can't drop raw binary into text, so those get Base64 encoded into a string first, and you send that string as part of the content.\"" },
    { q: "A request with several high-resolution images becomes surprisingly large. Why?", options: ["JSON adds a fixed header per image", "Images are sent twice for caching", "Base64 makes data about a third larger", "UTF-8 doubles the size of any binary data"], answer: 2, explain: "\"Base64 makes data bigger, roughly a third larger than the original bytes. So a few high-resolution images can balloon your request.\"" },
    { q: "A multimodal request is close to size limits. What is the MOST practical fix suggested in the lesson?", options: ["Switch the body to XML", "Resize images when you can", "Remove the max_tokens key", "Send images as raw binary"], answer: 1, explain: "\"When you're building multimodal prompts, keep an eye on total request size. Resize images when you can.\"" },
    { q: "Which statement about the request body encoding is accurate?", options: ["It is raw binary with JSON headers added", "It is UTF-16 with text/plain", "It is Base64 for the whole body", "It is UTF-8 text with application/json"], answer: 3, explain: "\"The content type is application slash JSON, and the body goes over the wire as UTF-8 text.\"" },
    { q: "A response has two text blocks in its content array. How should you build the answer?", options: ["Concatenate the text blocks", "Use only the first text block", "Use only the last text block", "Read the top-level text field"], answer: 0, explain: "\"Loop over the content array and find the blocks with type text. That's where the answer lives, and concatenate them if there's more than one.\"" },
    { q: "According to the lesson, what should you do BEFORE you trust a response's output?", options: ["Count the content blocks", "Compare it with the prompt", "Check stop_reason", "Verify the message ID format"], answer: 2, explain: "\"Step two, check stop reason before you trust the output.\"" },
    { q: "In Python without the SDK, what does a JSON object from the response become?", options: ["A tuple", "A dictionary", "A string", "A list"], answer: 1, explain: "\"A JSON object becomes a dictionary in Python, or a typed class if you're using the SDK.\"" },
    { q: "What extra benefit does the SDK give when reading responses?", options: ["It hides stop_reason from you", "It converts all content into one plain string", "It removes the need to read usage", "It returns typed objects with attributes"], answer: 3, explain: "\"The SDK smooths this further by handing you typed objects with named attributes, so your editor auto-completes the fields.\"" },
    { q: "Which statement BEST describes how request and response bodies relate?", options: ["They mirror each other", "They use different formats", "Only the request uses blocks", "Only the response is JSON"], answer: 0, explain: "\"Both are JSON objects, both use arrays of blocks for content, and both nest the same way.\"" },
    { q: "Which value is a JSON scalar?", options: ["The messages array", "A content block", "A token count", "The whole request"], answer: 2, explain: "Scalars are \"strings, numbers, booleans, and null\", like \"the text of a message, or a token count.\"" },
    { q: "What does the temperature key do in a request?", options: ["Caps the reply length", "Nudges randomness", "Sets the system prompt", "Lists callable tools"], answer: 1, explain: "\"Temperature nudges randomness.\" max_tokens caps length, system sets the prompt, tools hands Claude functions." },
    { q: "Which of the following is NOT a content block type mentioned in the lesson?", options: ["text", "image", "tool_result", "stop_sequence"], answer: 3, explain: "\"A block might be text, but it could also be an image, a tool use block, or a tool result.\" stop_sequence is a stop_reason value." },
    { q: "What is the main trap the lesson warns about when reading responses?", options: ["Treating content like a string", "Reading usage on every call", "Checking stop_reason first", "Looping over content blocks"], answer: 0, explain: "\"The trap is treating content like a string.\"" },
    { q: "A developer's code reads only the first text block and ignores stop_reason. Long answers look truncated. What is the BEST fix?", options: ["Raise temperature", "Add a system prompt", "Check stop_reason for max_tokens", "Switch to a larger, smarter model"], answer: 2, explain: "Checking stop reason tells you if \"your reply got cut off, and you may want to continue it.\"" },
    { q: "Which part of the request is entirely under your control?", options: ["The usage counts", "The messages array", "The stop_reason", "The message ID"], answer: 1, explain: "\"On the request side, you're in control. You send the model, the messages array, max tokens, and any optional params.\" The rest are produced by the server." },
    { q: "Which TWO keys are optional in a Claude request? (Choose TWO.)", options: ["system", "model", "tools", "messages", "max_tokens"], answer: [0, 2], explain: "Model, messages, and max tokens are the core. \"A system field sets the system prompt\" and \"a tools array hands Claude functions\" are optional keys." },
    { q: "Which TWO fields are part of a Claude response? (Choose TWO.)", options: ["max_tokens", "stop_reason", "temperature", "usage", "system"], answer: [1, 3], explain: "\"Content, stop reason, and usage coming back.\" max_tokens, temperature, and system are request keys." },
    { q: "Which TWO block types can appear in a turn's content array? (Choose TWO.)", options: ["role", "usage", "image", "stop_reason", "tool_use"], answer: [2, 4], explain: "A block \"might be text, but it could also be an image, a tool use block, or a tool result.\" Role, usage, and stop_reason are fields, not blocks." },
    { q: "Which TWO are metadata a response can include besides content, stop_reason, and usage? (Choose TWO.)", options: ["The message ID", "The API key used", "The client IP address", "The model that actually ran", "The request's temperature"], answer: [0, 3], explain: "You get \"some metadata, like the message ID and which model actually ran.\"" },
    { q: "Which TWO steps belong to the lesson's routine for reading every response? (Choose TWO.)", options: ["Re-sort the content blocks by length", "Log the usage token counts", "Strip images from the content", "Retry if stop_reason is end_turn", "Find and join the text blocks"], answer: [1, 4], explain: "The three steps: find and concatenate the text blocks, check stop reason, and \"read the usage field and log those token counts.\"" }
  ]
};
