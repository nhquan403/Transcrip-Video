window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Claude API là <strong>REST over HTTP</strong>: gần như mọi thứ là <strong>một POST tới <code>/v1/messages</code></strong> qua HTTPS,
kèm vài header bắt buộc; <strong>chữ số đầu của status code</strong> cho biết lỗi ở phía bạn hay phía server.</p>

<h3>🔑 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Client-server</strong>: code của bạn là client, server Anthropic giữ model; hai bên độc lập.</li>
  <li><strong>Stateless</strong>: server không nhớ gì giữa các call → phải <strong>gửi lại cả hội thoại</strong> mỗi lần.</li>
  <li><strong>Uniform interface</strong>: resource sau URL, thao tác bằng vài verb chuẩn.</li>
  <li><strong>Safe</strong>: không đổi gì trên server (GET).</li>
  <li><strong>Idempotent</strong>: gọi 1 hay nhiều lần, trạng thái cuối như nhau (DELETE).</li>
  <li><strong>x-api-key</strong>: header chứa API key bí mật.</li>
  <li><strong>anthropic-version</strong>: header bắt buộc, ghim request vào một phiên bản API có ngày; SDK tự đặt.</li>
  <li><strong>content-type: application/json</strong>: kiểu của body.</li>
</ul>

<h3>🎯 Trọng tâm thi</h3>
<ul>
  <li><strong>Model không nằm trong URL</strong>: cùng một endpoint phục vụ mọi model, chọn model trong body.</li>
  <li><strong>POST không safe, không idempotent</strong> → retry mù sau timeout có thể sinh <strong>completion thứ hai</strong>.</li>
  <li>Verb: GET đọc, POST tạo/kích hoạt, PUT thay toàn bộ, PATCH sửa một phần, DELETE xóa.</li>
  <li>Status: <strong>2xx</strong> thành công, 3xx redirect (hiếm), <strong>4xx</strong> lỗi phía bạn, <strong>5xx</strong> lỗi server → <strong>retry with backoff</strong>.</li>
  <li><strong>401</strong> thiếu/sai key; <strong>403</strong> key hợp lệ nhưng không có quyền; <strong>429</strong> rate limit → chậm lại, backoff; <strong>400</strong> body hỏng → sửa request, retry vô ích.</li>
  <li>Thiếu key hoặc version header → nhận 400/401, <strong>không có generation</strong>.</li>
  <li>SDK (Python, TypeScript) = <strong>convenience client</strong>: đặt header, gắn key, retry, parse JSON thành typed objects. <strong>Không có "secret powers"</strong>.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Server nhớ hội thoại trước" → <strong>sai</strong>, stateless.</li>
  <li>"Mỗi model có endpoint riêng" → <strong>sai</strong>.</li>
  <li>"401 và 403 giống nhau" → <strong>sai</strong>: 401 là xác thực, 403 là quyền.</li>
  <li>"5xx thì viết lại request" → <strong>sai</strong>, retry với backoff.</li>
  <li>"SDK làm được việc mà REST endpoint không làm được" → <strong>sai</strong>.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p><code>part2/lesson15/Lesson15.java</code>: phân loại safe/idempotent, đọc nhóm status theo chữ số đầu, chọn hành động theo status, quyết định có gửi lại sau timeout.
Chấm: <code>./mvnw -q compile exec:java -Dexec.args="p2-15"</code>; chạy thật: thêm <code>--live</code>.</p>
`,

  // answer = index of the correct option (options are shuffled on screen); an array means "Choose TWO".
  quiz: [
    { q: "A developer sends a follow-up question to Claude without the earlier turns and the reply ignores prior context. What is the MOST likely reason?", options: ["The server-side session expired after a timeout", "The API is stateless, so context must be resent", "The model was switched mid-conversation", "The anthropic-version header was outdated"], answer: 1, explain: "\"Every request has to carry all of its own context, because the server remembers nothing between calls. That's why you resend the whole conversation each time.\"" },
    { q: "A developer wants to switch from one Claude model to another. What must change in the HTTP call?", options: ["The URL path to a model-specific endpoint", "The HTTP verb from POST to PUT", "The anthropic-version header value", "The model field inside the request body"], answer: 3, explain: "\"You don't put the model name in the URL. The same endpoint serves every model. You choose which one you want inside the request body instead.\"" },
    { q: "Which HTTP call matches the core of the Claude API?", options: ["POST /v1/messages over HTTPS", "GET /v1/models/{model}/messages", "PUT /v1/messages over HTTP", "PATCH /v1/conversations/{id}"], answer: 0, explain: "\"Almost everything you do is a single POST request to the messages endpoint. The path is version 1, then messages, and you send it over HTTPS.\"" },
    { q: "A Messages request times out on the client side. A developer adds a blind automatic retry. What risk should they consider?", options: ["The retry returns the same cached completion", "The server rejects duplicates with a 409", "The retry may produce a second, separate completion", "The retry is free because the first one failed"], answer: 2, explain: "\"A POST is neither SAFE nor IDEMPOTENT... each call is a brand new generation. So if a request times out and you blindly retry, you can get a second, separate completion.\"" },
    { q: "Which statement about safe and idempotent methods is accurate?", options: ["POST is idempotent because the body is identical", "GET is safe; DELETE is idempotent; POST is neither", "DELETE is safe because the resource ends up gone", "GET is idempotent but not safe"], answer: 1, explain: "GET \"just reads\" (safe); deleting twice leaves it \"still just gone\" (idempotent); \"a POST is neither SAFE nor IDEMPOTENT.\"" },
    { q: "Which TWO properties does a POST to the Messages endpoint lack? (Choose TWO.)", options: ["Being safe", "Using JSON", "Being idempotent", "Being encrypted over HTTPS", "Having a single path"], answer: [0, 2], explain: "\"A POST is neither SAFE nor IDEMPOTENT, and the Claude messages call is a POST.\"" },
    { q: "A call returns status 401. What is the MOST likely cause?", options: ["The key is valid but lacks permission", "The request body is malformed JSON", "The tier rate limit was exceeded", "The API key is missing or wrong"], answer: 3, explain: "\"A 401 means you aren't authenticated, almost always a missing or wrong API key.\"" },
    { q: "A call returns 403 even though the same key works for other requests. What does this mean?", options: ["The key is valid but not permitted", "The key is missing from the headers", "The server had an internal fault", "The body used the wrong content type"], answer: 0, explain: "\"A 403 is different. It means the key is valid, but you're not permitted to do that particular thing.\"" },
    { q: "A batch script starts receiving 429 responses. What is the BEST next step?", options: ["Rewrite the request body and resend", "Rotate the API key immediately", "Slow down and retry with backoff", "Switch the verb from POST to GET"], answer: 2, explain: "429 is \"a rate limit. You're sending faster than your tier allows, so slow down and retry with BACKOFF instead of hammering the endpoint.\"" },
    { q: "A request returns 400 because the JSON body is malformed. What should the client do?", options: ["Retry the same request with backoff", "Correct the request before sending again", "Wait for the server to recover", "Add a second API key header"], answer: 1, explain: "A 400 \"won't fix itself on retry. You have to correct the request before you send it again.\"" },
    { q: "A request returns a 503. Which response is MOST appropriate?", options: ["Rewrite the prompt to be shorter", "Fix the API key and resend", "Treat it as a permanent client bug", "Retry with backoff"], answer: 3, explain: "\"The 500s mean the fault is on the server. Those aren't your bug, so the right move is to retry with BACKOFF rather than rewriting your request.\"" },
    { q: "Which TWO status codes indicate a problem the client must fix in its request or credentials before resending? (Choose TWO.)", options: ["500", "401", "429", "400", "503"], answer: [1, 3], explain: "401 is \"a missing or wrong API key\" and 400 means \"your request body itself is malformed.\" 429 and 5xx are handled by waiting and retrying with backoff." },
    { q: "Which TWO headers are required on a raw Messages API call? (Choose TWO.)", options: ["x-model-name", "x-request-retry", "x-api-key", "accept-language", "anthropic-version"], answer: [2, 4], explain: "\"XAPI key and Anthropic version are required.\" The model goes in the body, not a header." },
    { q: "What is the purpose of the anthropic-version header?", options: ["It pins the request to a dated API version", "It selects which model generates the reply", "It sets the maximum token budget", "It enables streaming responses"], answer: 0, explain: "It \"pins your request to a dated version of the API, so behavior stays stable even as Anthropic ships changes.\"" },
    { q: "A developer hand-writes an HTTP call and forgets the anthropic-version header. What happens?", options: ["The latest version is used silently", "The model replies with a warning message", "The request fails before any generation", "The SDK version is inferred from the key"], answer: 2, explain: "\"If you forget the key or the version header, you don't get a helpful model reply. You get a 400 or a 401, and the request fails before any generation happens.\"" },
    { q: "A developer uses the Python SDK and never sets anthropic-version. Why does the call still work?", options: ["The header is optional for Python", "The SDK sets it automatically", "The server defaults to the newest version", "The API key embeds the version"], answer: 1, explain: "The version header is \"required, though the SDKs set it for you automatically.\"" },
    { q: "A teammate claims a newer SDK method can do something the raw REST endpoint does not support. Which statement is accurate?", options: ["SDKs unlock private features over gRPC", "The SDK bypasses the anthropic-version rules", "SDKs can call models not exposed by REST", "Anything the SDK does maps to a REST call"], answer: 3, explain: "\"The SDK has no secret powers. Anything it can do maps to a REST call the API already supports. So if the raw endpoint can't do something, no SDK method can either.\"" },
    { q: "Which TWO tasks does the Anthropic SDK handle for you on top of the REST surface? (Choose TWO.)", options: ["Setting headers and attaching your API key", "Remembering conversation state on the server", "Choosing a model-specific URL", "Parsing JSON into typed objects", "Making POST idempotent"], answer: [0, 3], explain: "The SDK \"sets your headers, attaches your API key, handles retries, and parses the JSON response into typed objects.\" It cannot make the server stateful." },
    { q: "How should you read a status code to decide whether to fix your call or try again?", options: ["Look at the first digit", "Look at the last digit", "Compare it with the last response", "Check the response body length"], answer: 0, explain: "\"Learn to read the first digit, and you'll know instantly whether to fix your call or simply try again.\"" },
    { q: "Which status family will you rarely handle directly with the Claude API?", options: ["2xx", "4xx", "3xx", "5xx"], answer: 2, explain: "\"The 300s are redirects, and honestly, you'll rarely touch those directly with the Claude API.\"" },
    { q: "Which REST principle explains why the client and Anthropic's servers can each change without breaking the other?", options: ["Statelessness", "Client-server separation", "Idempotency", "Uniform caching"], answer: 1, explain: "\"Your code is the client, and Anthropic's servers hold the model. The two stay independent, so each side can change without breaking the other.\"" },
    { q: "Which TWO statements about HTTP verbs are accurate? (Choose TWO.)", options: ["PATCH fully replaces a resource", "PUT fully replaces a resource", "GET creates a new resource", "DELETE changes state on each repeat", "PATCH updates part of a resource"], answer: [1, 4], explain: "\"PUT fully replaces a resource, while PATCH updates just part of it.\" GET only reads, and DELETE is idempotent." },
    { q: "Why does generating a response use POST rather than GET or PUT?", options: ["POST requests are cached by default", "GET cannot carry an API key header", "PUT is not allowed over HTTPS", "Each completion is a fresh action"], answer: 3, explain: "\"You almost always use POST, because each completion is a fresh action, rather than a READ or a REPLACE.\"" },
    { q: "Which content type should the request body use?", options: ["application/json", "text/plain", "multipart/form-data", "application/xml"], answer: 0, explain: "\"You send CONTENT TYPE as APPLICATION slash JSON for the body.\"" },
    { q: "A team mixes up 401 and 403 while debugging. Which pairing is correct?", options: ["401 rate limit; 403 server fault", "401 bad body; 403 missing key", "401 not authenticated; 403 not permitted", "401 not permitted; 403 not authenticated"], answer: 2, explain: "401: \"you aren't authenticated\"; 403: \"the key is valid, but you're not permitted.\" \"Getting those two backwards wastes real debugging time.\"" },
    { q: "Which of the following is NOT one of the three core REST ideas in the lesson?", options: ["Client-server", "Server-side sessions", "Stateless", "Uniform interface"], answer: 1, explain: "The three ideas are client-server, stateless, and a uniform interface. Server-side sessions contradict statelessness." },
    { q: "Why is the whole Claude API described as one predictable pattern?", options: ["Each feature has its own separate protocol and URL", "Each model exposes its own verbs", "Features are negotiated per session", "Every feature rides on the same POST call"], answer: 3, explain: "\"Every feature you add later still rides on this same call.\"" },
    { q: "Which status code is the normal OK response whose body is ready to parse?", options: ["200", "201", "301", "429"], answer: 0, explain: "\"A 200 is the normal OK, and your body is ready to parse.\"" },
    { q: "What does the x-api-key header tell the server?", options: ["Which model to run", "Which API version to use", "Who you are and if you are allowed in", "How many tokens to generate"], answer: 2, explain: "It \"carries your secret API key, and it's how the server knows who you are and whether you're allowed in.\"" },
    { q: "Which statement BEST summarizes the Claude API wire format?", options: ["A gRPC stream per model", "REST over HTTP with one POST endpoint", "A stateful WebSocket session", "Many endpoints, one for each feature and model"], answer: 1, explain: "\"The Claude API is REST over HTTP, which gives you one endpoint, a POST, and a handful of headers and status codes.\"" }
  ]
};
