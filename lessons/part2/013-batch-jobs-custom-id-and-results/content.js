window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Mỗi entry của batch = <strong>custom_id</strong> + <strong>params</strong> (một Messages request bình thường).
Kết quả về <strong>không theo thứ tự gửi</strong>, nên luôn ghép theo <strong>custom_id</strong>, không bao giờ theo vị trí.</p>

<h3>🔑 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Batch entry</strong>: cặp <code>custom_id</code> + <code>params</code>.</li>
  <li><strong>params</strong>: body Messages chuẩn (model, max_tokens, messages, tools...).</li>
  <li><strong>custom_id</strong>: nhãn duy nhất, 1–64 ký tự, chỉ chữ, số, <code>-</code>, <code>_</code>.</li>
  <li><strong>Uniqueness</strong>: custom_id trùng → kết quả mơ hồ, việc ghép hỏng.</li>
  <li><strong>Unordered results</strong>: kết quả về theo thứ tự bất kỳ.</li>
  <li><strong>Silent corruption</strong>: ghép theo index không báo lỗi, chỉ gắn nhãn sai input.</li>
  <li><strong>Best-effort caching</strong>: request chạy song song, thứ tự bất kỳ, nên cache không chắc trúng.</li>
  <li><strong>1-hour cache</strong>: nên dùng khi các entry chung prefix lớn.</li>
</ul>

<h3>🎯 Trọng tâm thi</h3>
<ul>
  <li>Ghép kết quả → nạp input vào <strong>dictionary keyed by custom_id</strong>, duyệt kết quả và tra theo custom_id.</li>
  <li>Nên đặt custom_id <strong>có nghĩa</strong>: primary key của row, document ID.</li>
  <li><strong>Bị từ chối</strong> trong batch: <code>stream</code>, <code>speed</code> (fast mode), thread params (<code>store</code>, previous thread), cache hint / context hint, <code>max_tokens</code> &lt; 1.</li>
  <li><strong>Vẫn chạy</strong>: vision, tool use (cả server tools: web search, web fetch, code execution), system, multi-turn, adaptive thinking.</li>
  <li>Chuyển code sync sang batch → <strong>xóa stream=true</strong> và các field cấm.</li>
  <li>Entry chung system prompt lớn → chọn <strong>1-hour cache</strong> thay vì cache ngắn mặc định.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Kết quả thứ 3 ứng với input thứ 3" → <strong>sai</strong>.</li>
  <li>"Batch là chế độ rút gọn, không có tool use/vision" → <strong>sai</strong>, gần như đủ tính năng.</li>
  <li>"Batch chỉ hỗ trợ client tools" → <strong>sai</strong>, server tools cũng chạy.</li>
  <li>"Prompt caching không chạy trong batch" → <strong>sai</strong>, chạy nhưng best effort.</li>
  <li>"Ghép sai sẽ báo lỗi" → <strong>sai</strong>, nó im lặng.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p><code>part2/lesson13/Lesson13.java</code>: kiểm tra định dạng custom_id, validate cả batch, chuyển request sync thành params, ghép kết quả theo custom_id.
Chấm: <code>./mvnw -q compile exec:java -Dexec.args="p2-13"</code>; chạy thật: thêm <code>--live</code>.</p>
`,

  // answer = index of the correct option (options are shuffled on screen); an array means "Choose TWO".
  quiz: [
    { q: "A developer submits 1,000 support tickets as a batch and writes the labels back by zipping inputs and outputs by position. No errors appear. What is the MOST likely outcome?", options: ["Results are correct because batches preserve order", "Labels are silently attached to the wrong tickets", "The API rejects the results file", "Only the first 64 results are matched"], answer: 1, explain: "Batch results \"aren't returned in submission order\", so a positional zip \"will happily produce garbage, stapling each label to the wrong ticket, and it won't throw a single error.\"" },
    { q: "What is the BEST way to match batch results back to their inputs?", options: ["Sort results by creation time, then match by index", "Match each result to the input with the most similar text", "Submit entries one at a time so order is preserved", "Key inputs by custom ID and look up each result"], answer: 3, explain: "\"Load your inputs into a dictionary keyed by custom ID, then walk the results and look each one up by the custom ID it carries.\"" },
    { q: "What does each entry in a batch request consist of?", options: ["A custom ID and a standard Messages body", "A model name and a prompt string", "A sequence number and a messages array", "A custom ID and a webhook callback URL for results"], answer: 0, explain: "\"Each entry pairs a custom ID with params\", and \"the params is just a standard messages request body.\"" },
    { q: "Which custom ID is valid?", options: ["order 4471", "tickets/4471", "ticket_4471", "ticket#4471"], answer: 2, explain: "Allowed characters are \"letters, numbers, hyphens, and underscores. Nothing else. No spaces. No slashes. No special symbols.\"" },
    { q: "What are the length limits for a custom ID?", options: ["1 to 32 characters", "1 to 64 characters", "8 to 128 characters", "No limit if it is unique"], answer: 1, explain: "The custom ID \"has to be between one and 64 characters long.\"" },
    { q: "A team reuses the same custom ID for two entries in one batch. What is the main consequence?", options: ["The second entry overwrites the first input", "The batch runs at full price", "The two requests share one cached prefix", "Results become ambiguous to match"], answer: 3, explain: "\"Every custom ID in the batch has to be unique. If you reuse one, your results get ambiguous, and the whole matching step falls apart.\"" },
    { q: "Which custom ID choice does the lesson recommend?", options: ["The source row's primary key", "A random UUID per entry", "The position of the entry in the batch", "A timestamp of submission"], answer: 0, explain: "\"Make your custom ID something meaningful. Like the primary key of the database row that request came from, or a document ID.\"" },
    { q: "A developer converts synchronous request code into batch entries and every entry fails validation. What is the MOST likely cause?", options: ["The entries include image inputs", "The entries include a system message", "A leftover stream: true flag", "The entries define client tools"], answer: 2, explain: "Synchronous code \"often sets stream to true\", which batches reject. Images, system messages, and tools are all fine in a batch." },
    { q: "Which TWO parameters cause a batch entry to fail validation? (Choose TWO.)", options: ["speed", "system", "stream", "tools", "messages"], answer: [0, 2], explain: "\"Streaming is out\" and \"the speed parameter, the fast mode flag, isn't allowed either.\" System, tools, and messages are normal params." },
    { q: "Which TWO features work inside a batch? (Choose TWO.)", options: ["Streaming responses", "Server tools such as web search", "The fast mode speed flag", "Image inputs (vision)", "max_tokens set to 0"], answer: [1, 3], explain: "\"Vision works\" and \"tool use works, and that includes every server tool, web search, web fetch, and code execution.\" Streaming, speed, and max_tokens of 0 are rejected." },
    { q: "A team believes batches drop tool use and vision, so they plan a separate sync pipeline for those requests. What should you tell them?", options: ["Correct, batches only support plain text", "Batches support tool use and vision", "Correct for vision, but tools work", "Only client tools work in batches"], answer: 1, explain: "\"The mental model to drop is that batches lack tool use or vision. They don't.\" A batch is \"a normal request that happens to run asynchronously and cheaply.\"" },
    { q: "Which statement about thinking in batches is accurate?", options: ["Thinking is disabled in all batch requests", "Only legacy extended thinking is allowed", "Thinking requires streaming, so it fails", "Adaptive thinking runs inside batches"], answer: 3, explain: "\"Adaptive thinking runs inside batches too, along with legacy extended thinking on the older models that still accept it.\"" },
    { q: "Why is prompt caching only best effort inside a batch?", options: ["Requests run concurrently, in any order", "Batches ignore cache_control markers", "Caching is billed separately in batches", "Each entry uses a different model"], answer: 0, explain: "\"Requests in a batch execute concurrently and in any order. So caching is best effort.\"" },
    { q: "Batch entries share a large policy document as a system prompt. Which setting gives the BEST chance of cache hits?", options: ["Use the default short cache lifetime", "Disable caching for the batch", "Use the one-hour cache lifetime", "Add a cache hint parameter to each entry"], answer: 2, explain: "\"Prefer the one-hour cache lifetime instead of the default short one when your batch entries share a common prefix.\" Cache hint parameters are rejected in batches." },
    { q: "Which max_tokens value is rejected in a batch entry?", options: ["1", "0", "1024", "4096"], answer: 1, explain: "\"Max tokens has to be at least one, never zero.\"" },
    { q: "Which TWO request fields belong to the rejected list for batch entries? (Choose TWO.)", options: ["A multi-turn messages array", "A tools array with code execution", "The store thread parameter", "A model name", "The context hint parameter"], answer: [2, 4], explain: "\"Thread-related params, like store and the previous thread reference, are rejected. And so are the cache hint and context hint parameters.\"" },
    { q: "Why is position-based matching especially dangerous with batches?", options: ["It throws an error that stops the job", "It doubles the cost of the batch", "It only works for batches under 100 entries", "It fails silently with wrong answers"], answer: 3, explain: "\"Silently is the dangerous part. Nothing errors. You just get answers stapled to the wrong inputs.\"" },
    { q: "Which statement BEST describes a batch?", options: ["A normal request run async and cheaply", "A reduced mode without tools or vision", "A streaming request split into chunks", "A real-time request at full price"], answer: 0, explain: "\"A batch is a normal request that happens to run asynchronously and cheaply.\"" },
    { q: "Which of the following is NOT one of the three things the lesson says trip people up with batches?", options: ["Unordered results", "Limited parameters", "No system messages", "Still full-featured"], answer: 2, explain: "The three: \"Unordered results, limited params, still full-featured.\" System messages \"carry straight over\"." },
    { q: "A developer processes batch results in the order they arrive and stores each one at results[i]. What should they change FIRST?", options: ["Sort inputs alphabetically before submitting", "Key results by custom ID instead of index", "Use a shorter custom ID format", "Switch to streaming"], answer: 1, explain: "\"Treat the arrival order as meaningless, because it is, and build your mapping from that key every time.\"" },
    { q: "A team migrates a sync workload to batches. Which TWO parts of their requests carry straight over? (Choose TWO.)", options: ["System messages", "The stream: true flag", "The store thread parameter", "Full multi-turn conversations", "max_tokens set to 0"], answer: [0, 3], explain: "\"System messages and full multi-turn conversations carry straight over.\" Stream, thread params, and max_tokens of zero are rejected." },
    { q: "Which item does every batch result carry so it can be matched?", options: ["Its submission index", "A hash of the prompt", "The input token count only", "The custom ID you assigned"], answer: 3, explain: "\"Every result carries the custom ID you assigned. So you use that key to look up which input it belongs to.\"" },
    { q: "A batch entry includes a code execution server tool. What happens?", options: ["It works as it would synchronously", "It fails because server tools need streaming", "It is converted to a client tool", "The tool is silently dropped"], answer: 0, explain: "Tool use in batches \"includes every server tool, web search, web fetch, and code execution. Not just client tools.\"" },
    { q: "Which custom ID is invalid?", options: ["doc_2024_17", "row-88412", "invoice 77", "ABC123"], answer: 2, explain: "Spaces are not allowed: \"No spaces. No slashes. No special symbols.\"" },
    { q: "A pipeline validates batch entries before submission. Which check is NOT required by the API rules in the lesson?", options: ["custom ID is unique across the batch", "Entries are sorted by custom ID", "custom ID is 1 to 64 allowed characters", "max_tokens is at least 1"], answer: 1, explain: "Uniqueness, format, and max_tokens of at least one are enforced. Order is irrelevant because results are matched by key." },
    { q: "Which TWO statements about prompt caching in batches are accurate? (Choose TWO.)", options: ["It is rejected like stream", "It works but is best effort", "It always hits for shared prefixes", "It requires the cache hint parameter", "A one-hour lifetime helps shared prefixes"], answer: [1, 4], explain: "\"Prompt caching does work in a batch\" but \"caching is best effort\", so \"prefer the one-hour cache lifetime\" for shared prefixes. Cache hint parameters are rejected." },
    { q: "Which parameter is described as \"the fast mode flag\"?", options: ["stream", "store", "max_tokens", "speed"], answer: 3, explain: "\"The speed parameter, the fast mode flag, isn't allowed either.\"" },
    { q: "What is the single habit that makes batches reliable, according to the lesson?", options: ["Always keying on custom ID", "Retrying failed entries immediately", "Keeping batches under 64 entries", "Submitting entries in a fixed order"], answer: 0, explain: "\"Always key on custom ID.\" \"Get that one habit right, and batches become reliable.\"" },
    { q: "Why does a short cache lifetime often fail to help a batch?", options: ["Short caches are disabled in batches", "Batches bill cache writes twice", "It expires before later entries run", "It applies only to the first entry"], answer: 2, explain: "\"A short cache lifetime can easily expire before the requests that would have shared it actually run.\"" },
    { q: "According to the bottom line, what do batches drop compared with normal requests?", options: ["Tool use and image vision inputs", "Streaming and a few parameters", "Thinking and system messages", "Multi-turn conversation history"], answer: 1, explain: "\"Batches still support tool use, vision, and thinking. They only drop streaming and a few parameters.\"" }
  ]
};
