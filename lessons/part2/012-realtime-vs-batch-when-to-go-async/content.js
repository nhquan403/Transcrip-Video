window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> <strong>Synchronous Messages API</strong> trả lời ngay, stream được, giá đầy đủ.
<strong>Message Batches API</strong> chạy <strong>asynchronous</strong>, giá <strong>50%</strong>, không stream. Chọn surface theo độ trễ mà công việc chịu được.</p>

<h3>🔑 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Synchronous Messages API</strong>: gửi request, code block, nhận response; surface duy nhất <strong>stream</strong> token.</li>
  <li><strong>Message Batches API</strong>: gom nhiều request thành một job, xử lý nền.</li>
  <li><strong>custom_id + params</strong>: mỗi entry trong batch; params là một messages request body bình thường.</li>
  <li><strong>50% discount</strong>: cả input và output token; là lý do Batches API tồn tại.</li>
  <li><strong>Submit → poll → retrieve</strong>: luồng async; lấy tất cả kết quả cùng lúc.</li>
  <li><strong>Processing window 24h</strong>: hạn để job xong; request chưa xong thì <strong>expire, không tính tiền</strong>.</li>
  <li><strong>Retention window 29 ngày</strong>: kết quả tải được, tính từ lúc <strong>tạo batch</strong>; sau đó batch vẫn xem được nhưng không lấy được result.</li>
</ul>

<h3>🎯 Trọng tâm thi</h3>
<ul>
  <li>Người dùng/hệ thống downstream đang chờ, cần stream, latency-bound → <strong>real-time</strong>.</li>
  <li>Khối lượng lớn, không ai chờ từng kết quả (eval suite, bulk classify, xử lý tài liệu) → <strong>batch</strong>.</li>
  <li>Đa số batch xong <strong>dưới 1 giờ</strong> nhưng là <strong>best effort</strong>; lên kế hoạch cho tới 24h.</li>
  <li>Kết quả có khi <strong>mọi request xong</strong> hoặc tới mốc <strong>24h</strong>, cái nào tới trước.</li>
  <li>Giới hạn 1 batch: <strong>100,000 request</strong> hoặc <strong>256 MB</strong>, cái nào chạm trước → lớn hơn thì chia nhiều batch.</li>
  <li>Batch <strong>không đủ điều kiện zero data retention</strong> → tổ chức cần ZDR thì chạy synchronous.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Nhiều call real-time song song = batching" → <strong>sai</strong>: vẫn full price và tốn rate limit.</li>
  <li>"Batch đảm bảo xong trong 1 giờ" → <strong>sai</strong>, không phải SLA.</li>
  <li>"24h và 29 ngày là cùng một window" → <strong>sai</strong>: một là xử lý, một là lưu kết quả.</li>
  <li>"Request expire vẫn bị tính tiền" → <strong>sai</strong>, unbilled.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p><code>part2/lesson12/Lesson12.java</code>: chọn realtime hay batch, tính cost batch, chia request theo giới hạn số lượng và dung lượng, xác định trạng thái theo window 24h và 29 ngày.
Chấm: <code>./mvnw -q compile exec:java -Dexec.args="p2-12"</code>; chạy thật: thêm <code>--live</code>.</p>
`,

  // answer = index of the correct option (options are shuffled on screen); an array means "Choose TWO".
  quiz: [
    { q: "A support chat shows replies to customers as they type questions. Which surface is MOST appropriate?", options: ["The Message Batches API", "The Synchronous Messages API", "A nightly batch with polling", "Parallel batches of one request"], answer: 1, explain: "\"You stay on the Synchronous Messages API whenever speed is the requirement. The clearest signal is a user waiting on the response right now.\"" },
    { q: "A team runs an eval suite of 20,000 test cases overnight. Nobody waits on any single result. Which surface is the BEST fit?", options: ["The Synchronous Messages API with streaming", "Many parallel real-time calls", "A single long real-time request", "The Message Batches API"], answer: 3, explain: "Classic batch fits include \"running an eval suite across thousands of test cases... where nobody is waiting on any single result.\"" },
    { q: "How are tokens billed in the Message Batches API compared to the standard rate?", options: ["50% for both input and output", "50% for input only", "50% for output only", "25% for both input and output"], answer: 0, explain: "\"Batch work bills at 50% of the standard rate, both input and output.\"" },
    { q: "A developer wants to stream tokens from a batch job to show progress. What should they know?", options: ["Streaming works after polling", "Streaming needs a custom_id", "Batches cannot stream at all", "Streaming is limited to output"], answer: 2, explain: "The synchronous API is \"your only option when you want to stream tokens as they generate, since batches can't stream at all.\"" },
    { q: "What does each entry in a batch submission contain?", options: ["A prompt string and a priority", "A custom_id and params", "A model name and a deadline", "A file ID and a callback URL"], answer: 1, explain: "\"Each entry inside pairs a custom ID with params, which is just a normal messages request body.\"" },
    { q: "What is the correct workflow for a batch job?", options: ["Stream, then retrieve each result", "Submit, block, then read the response", "Poll first, then submit each request", "Submit, poll, then retrieve results"], answer: 3, explain: "\"You submit the job, poll to see when it's finished, and then retrieve all the results together.\"" },
    { q: "A product manager wants to promise customers batch results within one hour. What is the BEST advice?", options: ["Don't; it is only best effort", "Yes; batches finish within one hour", "Yes, if the batch is under 256 MB", "Yes, if fewer than 1,000 requests"], answer: 0, explain: "\"Most batches finish in under an hour. That's great, but it's best effort. Not a guaranteed service level, so never build a hard deadline on it.\"" },
    { q: "Some requests in a batch are still unprocessed when the 24-hour window ends. What happens to them?", options: ["They are billed at full price", "They roll into a new batch", "They expire and are not billed", "They keep running for 29 days"], answer: 2, explain: "\"Any request that doesn't finish inside that window expires, and expired requests are unbilled.\"" },
    { q: "When do batch results become available?", options: ["Only once the 24-hour mark is reached", "When all finish, or at 24 hours if sooner", "Always within one hour of submission", "After the 29-day retention ends"], answer: 1, explain: "\"They become available the moment every request completes, or at the 24-hour mark, whichever comes first.\"" },
    { q: "A team returns to download batch results 35 days after creating the batch. What should they expect?", options: ["Results are still downloadable", "The batch was deleted after 24 hours", "Results are re-run at full price", "Viewable, but results can't be pulled"], answer: 3, explain: "\"After 29 days, the batch is still viewable, but you can't pull the results anymore.\"" },
    { q: "From when is the 29-day retention window counted?", options: ["From when the batch is created", "From when the last request finishes", "From the first poll", "From the first result download"], answer: 0, explain: "Results stay downloadable for 29 days, \"counting from when you created the batch.\"" },
    { q: "Which statement about the two batch windows is accurate?", options: ["Both are 24 hours long", "Retention decides if the batch completes", "Processing is 24 hours, retention is 29 days", "Processing lasts 29 days, retention 24 hours"], answer: 2, explain: "\"The processing window is 24 hours... The retention window is 29 days... one window is about getting the work done, and the other is about how long you have to collect it.\"" },
    { q: "A job has 250,000 requests. What is the MOST appropriate approach?", options: ["Submit it as one batch", "Split it across multiple batches", "Send them as parallel real-time calls", "Compress it under 256 MB in one batch"], answer: 1, explain: "\"A single batch holds up to 100,000 requests, or 256 megabytes... If your job is bigger than that, you split it across multiple batches.\"" },
    { q: "A batch of 60,000 requests totals 300 MB. Can it be submitted as one batch?", options: ["Yes, it is under 100,000 requests", "Yes, size limits apply only to output", "No, the limit is 50,000 requests", "No, it exceeds the 256 MB limit"], answer: 3, explain: "The ceiling is \"100,000 requests, or 256 megabytes of total payload, whichever you hit first.\"" },
    { q: "An organization requires zero data retention for all Claude traffic. It wants to run a large offline classification job. What is the MOST appropriate choice?", options: ["Run it synchronously instead", "Use the Batches API with ZDR enabled", "Split it into small batches", "Use the Batches API overnight"], answer: 0, explain: "\"Batches aren't eligible for zero data retention. So, if your organization requires that stricter retention posture... you'd run that work synchronously instead.\"" },
    { q: "To save money, a team fires 10,000 parallel real-time calls instead of using a batch. Which statement is accurate?", options: ["It gets the batch discount automatically", "It is the same thing as batching", "It is full price and uses rate limits", "It avoids rate limits"], answer: 2, explain: "\"Firing off many parallel real-time calls isn't the same thing as batching. That's still full price, and it leans on your rate limits.\"" },
    { q: "A downstream service blocks until it receives Claude's classification of each event. Which surface should be used?", options: ["The Message Batches API", "The Synchronous Messages API", "A nightly batch job", "A batch polled every minute"], answer: 1, explain: "\"If a person or a downstream system is blocked, waiting on that answer, you send it in real-time.\"" },
    { q: "What is the primary reason the Message Batches API exists?", options: ["To support streaming at scale", "To bypass the 24-hour window", "To enable zero data retention", "The half-rate discount"], answer: 3, explain: "The half-rate discount \"is the entire reason the batch's API exists.\"" },
    { q: "How long should a team plan for batch latency?", options: ["Up to a day", "Under one minute", "Exactly one hour", "Up to 29 days"], answer: 0, explain: "\"Plan for up to a day of latency, and treat the under-an-hour case as a bonus, not a promise.\"" },
    { q: "Which statement about real-time versus batching is accurate?", options: ["They are one API with a toggle", "Batches stream tokens at half price", "They are different tools", "Real-time calls bill at half price"], answer: 2, explain: "\"Real-time and batching aren't one API with a toggle. They're different tools.\" Match the surface to the latency the work can tolerate." },
    { q: "A team must process a backlog of 80,000 support tickets for tagging by next week. Nobody is waiting on any single ticket. What is the MOST cost-effective choice?", options: ["Synchronous calls with streaming", "The Message Batches API", "Parallel real-time calls", "One real-time call per hour"], answer: 1, explain: "\"If the work is latency-insensitive, and there's a lot of it, that 50% discount adds up fast.\" Bulk-classifying a backlog is a classic batch fit." },
    { q: "Which of the following is NOT a trade-off you accept when choosing the Batches API?", options: ["No immediate response", "No token streaming", "Up to a day of latency", "Paying full input price"], answer: 3, explain: "Batch input and output both bill at 50%. \"You don't get an immediate response, and you can't stream.\"" },
    { q: "What does the params field of a batch entry contain?", options: ["A normal messages request body", "Only the user prompt text", "The batch's polling interval", "The custom_id and a deadline"], answer: 0, explain: "params \"is just a normal messages request body. So every item in the batch is a full request you could have sent on its own.\"" },
    { q: "A live coding assistant suggests edits while a developer types. A teammate proposes moving it to batches to halve costs. What is the BEST response?", options: ["Agree, since batches finish in an hour", "Agree, if requests stay under 256 MB", "Disagree; a user is watching live", "Agree, but poll every few seconds"], answer: 2, explain: "\"For anything a person is watching in real time, that's a deal-breaker... Don't batch something someone is watching.\"" },
    { q: "Which window decides whether a batch completes at all?", options: ["The 29-day retention window", "The 24-hour processing window", "The one-hour typical speed", "The batch's polling interval"], answer: 1, explain: "The 24-hour processing window \"decides whether your batch completes at all.\"" },
    { q: "Which TWO workloads are good fits for the Message Batches API? (Choose TWO.)", options: ["Bulk-classifying a large backlog", "A live chat reply", "Running a large offline eval suite", "A streaming coding assistant", "A request a user is waiting on"], answer: [0, 2], explain: "Classic batch fits are \"running an eval suite across thousands of test cases, bulk-classifying a giant backlog.\"" },
    { q: "Which TWO are hard ceilings for a single batch? (Choose TWO.)", options: ["1,000 requests", "100,000 requests", "10 MB of payload", "256 MB of total payload", "One hour of processing"], answer: [1, 3], explain: "\"A single batch holds up to 100,000 requests, or 256 megabytes of total payload, whichever you hit first.\"" },
    { q: "Which TWO capabilities does the Synchronous Messages API offer that the Batches API does not? (Choose TWO.)", options: ["A 50% discount", "Results kept for 29 days", "Streaming tokens", "Bundling many requests", "An immediate response"], answer: [2, 4], explain: "The synchronous API \"answers immediately, streams, and bills at full price.\" Batches give up both." },
    { q: "Which TWO statements about expired batch requests and windows are correct? (Choose TWO.)", options: ["Expired requests are unbilled", "Expired requests bill at 50%", "Results stay downloadable for 24 hours", "Results stay downloadable for 29 days", "The batch is deleted after 29 days"], answer: [0, 3], explain: "\"Expired requests are unbilled\", and \"the retention window is 29 days\"; after that the batch \"is still viewable\" but results cannot be pulled." },
    { q: "Which TWO signals indicate a job should stay on the Synchronous Messages API? (Choose TWO.)", options: ["The job has tens of thousands of items", "A person is waiting on the answer now", "Nobody needs results until tomorrow", "Cost matters more than speed", "Tokens must stream as they generate"], answer: [1, 4], explain: "Real-time fits \"a user waiting on the response right now\", and it is \"your only option when you want to stream tokens.\"" }
  ]
};
