window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Một call Claude là <strong>I/O-bound</strong>: gần như toàn bộ thời gian là chờ mạng. <strong>async/await</strong> cho phép
nhường thời gian chờ đó cho việc khác, trên <strong>một thread</strong>: được <strong>concurrency</strong>, không phải parallelism.</p>

<h3>🔑 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Blocking call</strong>: mặc định; chương trình đứng chờ trọn response rồi mới chạy dòng tiếp.</li>
  <li><strong>Non-blocking call</strong>: phát request, <code>await</code>, runtime làm việc khác trong lúc chờ.</li>
  <li><strong>Coroutine</strong>: hàm <code>async</code>, có thể tạm dừng giữa chừng và tiếp tục đúng chỗ.</li>
  <li><strong>Event loop</strong>: bộ lập lịch; khi một coroutine chờ mạng, nó chạy coroutine khác đã sẵn sàng.</li>
  <li><strong>await</strong>: điểm coroutine <strong>yield</strong>, tạm dừng mà không chặn thread.</li>
  <li><strong>I/O-bound</strong>: thời gian dành cho chờ mạng, không phải CPU.</li>
  <li><strong>Concurrency</strong>: cấu trúc, nhiều task cùng đang dở, thay phiên nhau.</li>
  <li><strong>Parallelism</strong>: chạy <strong>cùng một lúc</strong> thật sự, cần nhiều core/máy.</li>
</ul>

<h3>🎯 Trọng tâm thi</h3>
<ul>
  <li>Một async call: (1) gọi method async → nhận ngay <strong>coroutine</strong>, (2) <code>await</code> → loop "park" task, (3) response về → loop đánh thức, chạy tiếp với kết quả.</li>
  <li>Không có <strong>busy loop</strong>, không <strong>polling</strong>: loop đánh thức đúng lúc kết quả về.</li>
  <li>Càng nhiều call cùng bay, càng thu hồi nhiều thời gian chờ, <strong>không cần thêm thread</strong>.</li>
  <li>Async = một cách đạt concurrency; <strong>concurrency ≠ parallelism</strong>.</li>
  <li>Hàm <strong>không có await</strong> không bao giờ cho loop cơ hội chuyển task.</li>
  <li>3 bẫy làm hỏng async: gọi <strong>blocking library</strong> trong coroutine; <strong>quên await</strong>; <strong>việc CPU nặng</strong> trên loop.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Async nghĩa là parallel" → <strong>sai</strong>, nó xen kẽ trên một thread.</li>
  <li>"await làm chặn chương trình" → <strong>sai</strong>, await là chỗ nhường quyền.</li>
  <li>"Quên await sẽ báo lỗi" → <strong>sai</strong>, việc đó im lặng không chạy.</li>
  <li>"Async giúp tăng tốc việc CPU nặng" → <strong>sai</strong>, việc CPU chặn cả loop.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p><code>part2/lesson17/Lesson17.java</code>: bọc lời gọi chặn thành <code>CompletableFuture</code>, chạy tuần tự, chạy đồng thời giữ thứ tự kết quả, ước tính thời gian hai cách.
Chấm: <code>./mvnw -q compile exec:java -Dexec.args="p2-17"</code>; chạy thật: thêm <code>--live</code>.</p>
`,

  // answer = index of the correct option (options are shuffled on screen); an array means "Choose TWO".
  quiz: [
    { q: "A developer calls Claude 50 times in a loop with blocking calls. Each call is slow, and the CPU is mostly idle. What is the MOST likely explanation?", options: ["The model is CPU-bound on the client", "The calls are I/O-bound and run serially", "The event loop is running too many tasks", "The API rejects parallel requests"], answer: 1, explain: "\"A request to the API is IO bound\", and with blocking calls \"if you have 50 to make they run strictly one after another.\"" },
    { q: "Why is a Claude API call a good fit for async?", options: ["It needs heavy CPU work on the client", "It must run on multiple cores", "It returns results in fixed order", "It mostly waits on the network"], answer: 3, explain: "\"A request to the API is IO bound which means it spends almost all of its time waiting on the network not burning CPU on your machine.\"" },
    { q: "What happens the moment a coroutine reaches await on a Claude call?", options: ["It pauses and control returns to the event loop", "The thread spins until the response arrives", "A new OS thread is created for the call", "The loop polls the server every few milliseconds"], answer: 0, explain: "\"Right there your coroutine pauses. Control returns to the event loop. The loop finds another coroutine that's ready to make progress and runs that one instead.\"" },
    { q: "A team claims that async makes their API calls run in parallel on multiple cores. Which statement is accurate?", options: ["Correct, async uses a thread per task", "Correct, but only for I/O-bound work", "Async interleaves tasks on one thread", "Async runs tasks on all cores by default"], answer: 2, explain: "\"On a single thread async interleaves your tasks... only one is ever actually running at a given instant.\"" },
    { q: "A developer believes that await blocks the program until the result is ready. What should you tell them?", options: ["Correct, await blocks the whole thread", "await is where the code yields to the loop", "Correct, but only inside the event loop", "await only blocks when the call fails"], answer: 1, explain: "\"The await point is precisely where your code yields.\" \"Await isn't the thing that blocks you. It's the thing that lets you not block.\"" },
    { q: "A developer calls an async client method but never awaits the result. What happens?", options: ["The call runs in the background anyway", "The runtime raises an error immediately", "The call runs synchronously instead", "The work quietly never runs"], answer: 3, explain: "\"If you call an async function but never await the coroutine it returns that work just quietly never runs. No error, no result.\"" },
    { q: "An async service freezes all in-flight Claude requests whenever one coroutine calls a synchronous HTTP library. What is the cause?", options: ["The blocking call stalls the event loop", "The API rate limits concurrent calls", "The coroutine was awaited twice", "The event loop ran out of threads"], answer: 0, explain: "\"Calling a blocking library from inside a coroutine. If that call doesn't yield it stalls the entire event loop and every other task freezes along with it.\"" },
    { q: "An async app runs a long CPU-heavy computation inside a coroutine with no awaits. What is the effect?", options: ["It runs on a spare core automatically", "The loop pauses it at each network call", "It blocks every other task on the loop", "It speeds up because of async"], answer: 2, explain: "\"A long computation with no awaits blocks everything because the loop can't switch away mid-calculation.\"" },
    { q: "Which TWO are classic traps that undo the benefit of async? (Choose TWO.)", options: ["Calling a blocking library in a coroutine", "Awaiting each Claude call", "Forgetting to await a coroutine", "Using one event loop", "Running many I/O-bound calls concurrently"], answer: [0, 2], explain: "The traps: \"calling a blocking library from inside a coroutine\", \"forgetting to await\", and \"doing heavy CPU work on the loop.\"" },
    { q: "What do you get back immediately when you call the async version of a client method?", options: ["The finished response", "A coroutine to be awaited", "A thread handle", "A status code"], answer: 1, explain: "\"Instead of the finished response you immediately get back a coroutine. A promise of work to be done.\"" },
    { q: "Which component decides which coroutine runs next while others wait on the network?", options: ["The coroutine", "The await keyword", "The HTTP client", "The event loop"], answer: 3, explain: "The event loop is \"a scheduler. It runs your coroutines and the instant one of them is waiting on the network it advances another that's ready to go.\"" },
    { q: "What is a coroutine?", options: ["A function that can pause and resume later", "A thread that runs on its own dedicated CPU core", "A loop that polls for responses", "A callback fired by the server"], answer: 0, explain: "A coroutine is \"a function you write with async and it can pause part way through, hand control back, and resume later right where it stopped.\"" },
    { q: "Which statement about concurrency and parallelism is accurate?", options: ["They mean the same thing in async code", "Parallelism is about structure only", "Async gives concurrency, not parallelism", "Async always gives true multi-core parallelism"], answer: 2, explain: "\"Async gives you concurrency but not necessarily parallelism.\"" },
    { q: "Which TWO statements about parallelism are accurate? (Choose TWO.)", options: ["It is what async gives by default", "It needs multiple cores or machines", "It is only about code structure", "Tasks execute at the same instant", "It requires an event loop"], answer: [1, 3], explain: "Parallelism \"means tasks literally execute at the same instant which requires multiple cores or machines.\" Async gives concurrency, \"not necessarily parallelism.\"" },
    { q: "Which TWO statements about async on a single thread are accurate? (Choose TWO.)", options: ["Tasks run on different CPU cores at once", "A new thread starts per task", "Only one task runs at a given instant", "Awaits block the thread", "Tasks switch at await points"], answer: [2, 4], explain: "Async \"rapidly switches between them at the await points but only one is ever actually running at a given instant.\"" },
    { q: "While a coroutine awaits a Claude response, what does it cost?", options: ["One full CPU core", "Nothing while it waits", "A dedicated OS thread", "A polling request per second"], answer: 1, explain: "\"Your paused coroutine sits there costing nothing waiting for its response.\"" },
    { q: "How does the event loop know when to resume a paused coroutine?", options: ["It polls the response every few ms", "A busy loop checks a flag", "The coroutine wakes itself on a timer", "It wakes it when the result lands"], answer: 3, explain: "\"Nothing is spinning in a busy loop and nothing is polling to check if it's done. The loop wakes you when it's time not a moment before.\"" },
    { q: "A function contains no await expressions. What is true?", options: ["It never lets the loop switch", "It runs in parallel with other tasks", "It yields after every line", "It is automatically non-blocking"], answer: 0, explain: "\"A function with no awaits in it never gives the loop a chance to switch.\"" },
    { q: "Why does the payoff of async grow as more calls are in flight?", options: ["Each call gets a bigger CPU share", "The API speeds up batched requests", "More idle waiting time is reclaimed", "More threads are created automatically"], answer: 2, explain: "\"The more calls you have in flight the more of that idle time you reclaim and the bigger the payoff.\"" },
    { q: "Which TWO are the building blocks of async described in the lesson? (Choose TWO.)", options: ["The coroutine", "The thread pool", "The busy loop", "The event loop", "The callback queue"], answer: [0, 3], explain: "\"Coroutine, event loop, await. Once those three click everything else is just applying them.\"" },
    { q: "Which of the following is NOT one of the three steps of a single async call?", options: ["Call the async method and get a coroutine", "Spawn a thread to poll for the result", "Await it so the loop parks the task", "Resume with the result when it arrives"], answer: 1, explain: "The cycle is call, await, resume; \"at no point is a thread frozen solid or stuck in a busy wait.\"" },
    { q: "How does async reclaim waiting time compared with spinning up threads?", options: ["It needs one thread per request", "It doubles the number of threads", "It moves work to the server", "It avoids extra threads entirely"], answer: 3, explain: "Async hands the waiting time to other work \"and it does that without spinning up extra threads.\"" },
    { q: "When is a blocking call acceptable according to the lesson?", options: ["For one request", "For 50 requests", "For CPU-heavy work", "Never"], answer: 0, explain: "A blocking call is \"fine for one request but one slow call freezes everything behind it.\"" },
    { q: "In the timeline of a single Claude request, what is the large stretch that async reuses?", options: ["Preparing the request", "Parsing the JSON", "Waiting for bytes over the network", "Encrypting the body"], answer: 2, explain: "\"A tiny sliver is your code preparing the request then a long stretch of just waiting for bytes to come back over the wire.\"" },
    { q: "Which statement BEST defines concurrency?", options: ["Tasks run at the exact same instant on many cores", "Many tasks in progress at once, taking turns", "One task finishes before the next starts", "Each task runs on its own machine"], answer: 1, explain: "\"Concurrency is about structure. It means you've arranged your work so many tasks are in progress at once taking turns even if only one thread is doing the work.\"" },
    { q: "Which TWO actions keep the event loop free for network waiting? (Choose TWO.)", options: ["Run heavy CPU math on the loop", "Await every async call you start", "Call a sync HTTP library in a coroutine", "Skip await to save time", "Use non-blocking client methods"], answer: [1, 4], explain: "The theme is to \"keep the event loop free to do the one thing it's great at, waiting on the network\": await your coroutines and avoid blocking calls." },
    { q: "A developer replaces blocking calls with async ones but sees no speedup with a single request. Why?", options: ["Async is slower for the first call", "The API ignores async clients", "await adds a fixed delay", "Async gains come from overlapping waits"], answer: 3, explain: "Async lets the caller do other work while waiting; with one call there is nothing to overlap. \"The more calls you have in flight... the bigger the payoff.\"" },
    { q: "Which is the BEST description of what await does?", options: ["Suspends without blocking the thread", "Starts a new thread", "Polls until done", "Retries the call"], answer: 0, explain: "Await \"suspends a coroutine until the thing it's waiting on is ready and crucially it does that without blocking the whole thread.\"" },
    { q: "What is the core shift that async introduces?", options: ["From threads to processes", "From REST to WebSockets", "From waiting to yielding", "From JSON to binary"], answer: 2, explain: "\"That single shift from waiting to yielding is what the rest of this lesson builds on.\"" },
    { q: "Which statement BEST summarizes the lesson?", options: ["Async gives true parallelism for API calls", "Async keeps an I/O-bound app working", "Async removes the need to handle errors", "Async makes each single call faster"], answer: 1, explain: "\"Async lets a network-bound app issue a Claude call and keep working instead of freezing on it.\"" }
  ]
};
