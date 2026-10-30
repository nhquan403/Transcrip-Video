window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> <strong>Prompt caching</strong> tái dùng một <strong>prefix byte-exact</strong> theo thứ tự <strong>tools → system → messages</strong>.
Đánh dấu bằng tối đa <strong>4 breakpoint</strong>, chọn TTL <strong>5 phút</strong> hoặc <strong>1 giờ</strong>; lợi khi read rẻ bù được write premium.</p>

<h3>🔑 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>cache_control breakpoint</strong>: marker đặt trên block, đóng một cacheable prefix; tối đa <strong>4 / request</strong>.</li>
  <li><strong>Cache key</strong>: rendered bytes chính xác của prefix tới breakpoint; đổi 1 byte → invalidate từ điểm đó trở đi.</li>
  <li><strong>TTL 5 phút (ephemeral, default)</strong>: mỗi read làm mới; traffic đều thì prefix luôn warm.</li>
  <li><strong>TTL 1 giờ</strong>: <code>type: "ephemeral"</code> + <code>ttl: "1h"</code>; sống qua khoảng nghỉ dài, write đắt hơn.</li>
  <li><strong>Pricing</strong> (bội số base input): read <strong>0.1×</strong>, write 5 phút <strong>1.25×</strong>, write 1 giờ <strong>2×</strong>.</li>
  <li><strong>Minimum prefix</strong>: theo model, vd <strong>1024</strong> token (Opus 4.8), <strong>2048</strong> (Opus 4.7).</li>
  <li><strong>cache_read_input_tokens</strong>: trường usage chứng minh cache hit; <code>cache_creation_input_tokens</code> = token ghi cache.</li>
</ul>

<h3>🎯 Trọng tâm thi</h3>
<ul>
  <li>Breakpoint trên <strong>last system block</strong> → cache cả tools + system thành một chunk.</li>
  <li>Đặt breakpoint ở <strong>stability boundaries</strong>: stable trước, volatile (user turn hiện tại) <strong>sau breakpoint cuối</strong>.</li>
  <li>Gọi thưa → TTL 1 giờ; traffic đều → 5 phút. Chọn theo traffic pattern.</li>
  <li>TTL 5 phút hoà vốn sau khoảng <strong>1 lần reuse</strong>; prefix ít dùng lại → cache tốn hơn gửi lại.</li>
  <li>Dưới ngưỡng tối thiểu → <strong>không lỗi</strong>, chỉ thấy cache_creation_input_tokens = 0.</li>
  <li>Cache gắn với <strong>model</strong>: đổi model giữa chừng → full miss.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Cache match gần đúng / partial credit" → <strong>sai</strong>, byte-exact và prefix-only.</li>
  <li>"Write rẻ hơn base, read đắt hơn" → <strong>sai</strong>, ngược lại.</li>
  <li>cache_read_input_tokens luôn 0 → thủ phạm: <strong>timestamp</strong> trong system, <strong>JSON key không sort</strong>, <strong>tool set thay đổi</strong>.</li>
  <li>"1 giờ luôn tốt hơn 5 phút" → <strong>sai</strong>, là trade-off thời gian sống vs giá write.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p><code>part2/lesson11/Lesson11.java</code>: render prefix đúng thứ tự, đếm phần prefix còn khớp, kiểm tra breakpoint (tối đa 4, volatile sau cùng), tính cost theo TTL, quyết định có nên cache.
Chấm: <code>./mvnw -q compile exec:java -Dexec.args="p2-11"</code>; chạy thật: thêm <code>--live</code>.</p>
`,

  // answer = index of the correct option (options are shuffled on screen); an array means "Choose TWO".
  quiz: [
    { q: "In what order is the cacheable prefix rendered?", options: ["system, tools, messages", "tools, system, messages", "messages, system, tools", "system, messages, tools"], answer: 1, explain: "\"The model renders tools first, then the system prompt, then the messages.\"" },
    { q: "A team changes one word in the middle of a cached system prompt. What happens to the cache?", options: ["Only that sentence is re-cached later", "The cache matches with partial credit", "Nothing, since caching is fuzzy", "All of it after that point is invalidated"], answer: 3, explain: "\"Change a single byte anywhere inside the prefix, and you invalidate everything from that point on. There's no fuzzy matching and no partial credit.\"" },
    { q: "What is the maximum number of cache_control breakpoints per request?", options: ["Four", "One", "Two", "Eight"], answer: 0, explain: "\"You get up to four of them per request, each one closing off a cacheable prefix.\"" },
    { q: "A developer wants to cache both the tool definitions and the system prompt as one chunk with a single breakpoint. Where should it go?", options: ["On the first tool definition", "On the current user turn", "On the last system block", "On the first message"], answer: 2, explain: "\"A breakpoint on your last system block caches your tools and your system prompt together as one chunk, since tools render before system.\"" },
    { q: "A chatbot places its only breakpoint after the current user turn, and cache hits never appear. What is the BEST fix?", options: ["Switch the TTL to one hour", "Move the user turn after the breakpoint", "Add more breakpoints inside the user turn", "Lower the max_tokens value"], answer: 1, explain: "\"Push anything volatile, like the current user turn, after your final breakpoint. That way, the changing content never reaches into the cached prefix.\"" },
    { q: "What is the default TTL of a cache entry?", options: ["One hour", "Twenty-four hours", "One minute", "Five minutes"], answer: 3, explain: "\"The default is a five-minute ephemeral window, and there's a longer one-hour option when you need it.\"" },
    { q: "Under steady traffic, a five-minute cache entry stays warm for hours. Why?", options: ["Every read refreshes the entry", "Entries auto-upgrade to one hour", "The API pins popular prefixes", "Writes are repeated every minute"], answer: 0, explain: "\"By default, an entry uses the five-minute ephemeral window, and every read refreshes it. So under steady traffic, your prefix just stays warm.\"" },
    { q: "A batch job calls the API with the same large prefix about every 30 minutes. Which TTL is the MOST appropriate?", options: ["The default five-minute window", "No caching at all", "The one-hour window", "A five-minute window with more breakpoints"], answer: 2, explain: "\"When your calls are spaced further apart, you can opt into the one-hour window... It survives those longer gaps.\"" },
    { q: "How do you request the one-hour cache window?", options: ["Set ttl to 1h without a type", "Set type ephemeral and TTL one hour", "Add a fifth breakpoint", "Set cache_duration to 3600"], answer: 1, explain: "\"You can opt into the one-hour window by setting type to ephemeral and TTL to one hour.\"" },
    { q: "Relative to the base input price, what does a cache read cost?", options: ["1.25 times base", "2 times base", "The same as base", "0.1 times base"], answer: 3, explain: "\"A cache read, a hit, costs 10% the cost, so served from cache tokens are roughly a tenth of the normal price.\"" },
    { q: "Relative to the base input price, what does writing a five-minute cache entry cost?", options: ["1.25 times base", "0.1 times base", "2 times base", "0.5 times base"], answer: 0, explain: "\"Writing a five-minute entry costs 25% more, a small one-time premium.\"" },
    { q: "Relative to the base input price, what does writing a one-hour cache entry cost?", options: ["1.25 times base", "0.1 times base", "2 times base", "1.5 times base"], answer: 2, explain: "\"Writing a one-hour entry costs double, the price of the longer window.\"" },
    { q: "With the five-minute window, roughly when does a cache entry pay for itself?", options: ["After about ten reuses", "After about one reuse", "Only with the one-hour TTL", "Never on short prompts"], answer: 1, explain: "\"An entry roughly pays for itself after about one reuse, because a write at 25% more plus a read at 10% the cost beats paying full price twice.\"" },
    { q: "A team caches a large prompt that is used once and never again. What is the MOST likely effect on cost?", options: ["Lower cost from the read discount", "No change in cost", "Cost drops after the TTL ends", "Higher cost than resending it"], answer: 3, explain: "\"If a prefix is barely reused, caching it costs you more than just resending it.\"" },
    { q: "A developer caches an 800-token system prompt on Opus 4.8. No error appears, but cache_creation_input_tokens is zero. What is the MOST likely cause?", options: ["The prefix is under the model's minimum", "The TTL expired before the write", "Four breakpoints were exceeded", "The API key lacks prompt cache access"], answer: 0, explain: "The minimum is \"1024 tokens on Opus 4.8... Come in under the floor and nothing gets cached. You won't see an error.\"" },
    { q: "What is the minimum cacheable prefix on Opus 4.7, according to the lesson?", options: ["512 tokens", "1024 tokens", "2048 tokens", "4096 tokens"], answer: 2, explain: "\"It's 1024 tokens on Opus 4.8 and 2048 on Opus 4.7.\"" },
    { q: "An app warms a cache on one model, then switches to another model for the next call with the same prefix. What happens?", options: ["The cache carries over", "It takes a full cache miss", "Only the system part is reused", "The TTL resets to one hour"], answer: 1, explain: "\"Caches are tied to a specific model. Switch models mid-flow and you take a full miss.\"" },
    { q: "Which usage field should you watch to prove the cache is being hit?", options: ["input_tokens", "output_tokens", "cache_creation_input_tokens", "cache_read_input_tokens"], answer: 3, explain: "\"The one to watch is cache read input tokens. Make two calls with an identical prefix, and on the second you should see that number climb.\"" },
    { q: "Two identical calls show cache_read_input_tokens of zero both times. The system prompt starts with \"Current time: ...\". What is the MOST likely cause?", options: ["The timestamp alters the prefix", "The model does not support caching", "The TTL is too short for two calls", "Reads are delayed by one call"], answer: 0, explain: "\"The usual suspects are a date time stamp baked into your system prompt\", which silently invalidates the byte-exact prefix." },
    { q: "Why does a tool set that changes between calls hurt caching so much?", options: ["Tools are billed at 2 times base", "Tools disable breakpoints", "Tools sit at the very front of the prefix", "Tools use a separate cache"], answer: 2, explain: "A shifting tool set breaks caching \"since tools sit at the very front of the prefix.\"" },
    { q: "When does caching pay off according to the lesson?", options: ["When most of the prompt changes every call", "When a large stable prefix is reused", "When the prefix is under the minimum", "When calls use different models"], answer: 1, explain: "\"Caching pays off when a stable prefix makes up the bulk of your request, and you hit it again and again.\"" },
    { q: "Which statement about choosing a TTL is accurate?", options: ["One hour is always cheaper", "Five minutes is always better", "The TTL has no effect on the price", "It trades lifetime against write cost"], answer: 3, explain: "\"The choice isn't about one being better, it's a trade-off between how long you need the entry to live, and what you're willing to pay to write it.\"" },
    { q: "Which of the following is NOT a usual suspect when cache reads stay at zero?", options: ["A stable prefix above the minimum", "A timestamp in the system prompt", "Unsorted JSON keys", "A shifting tool set"], answer: 0, explain: "The usual suspects are \"a date time stamp... JSON whose keys aren't sorted the same way each time, or a tool set that shifts between calls.\"" },
    { q: "Which statement about how the cache matches a prefix is accurate?", options: ["It matches semantically similar text", "It matches any block with a breakpoint", "It is byte exact and prefix only", "It ignores whitespace differences"], answer: 2, explain: "\"It's byte exact, and it's prefix only, which is why the order and the stability of what you put up front matter so much.\"" },
    { q: "Which design rule does the lesson give for placing content around breakpoints?", options: ["Volatile first, stable last", "Stable first, volatile last", "Alternate stable and volatile", "Put everything after the last breakpoint"], answer: 1, explain: "\"Keep the stable stuff up front, behind your breakpoints... Stable first, volatile last.\"" },
    { q: "Which TWO are common causes of a cache that silently never hits? (Choose TWO.)", options: ["JSON keys serialized in varying order", "A breakpoint on the last system block", "A tool set that changes between calls", "Calls within the five-minute window", "Two calls with identical prefixes"], answer: [0, 2], explain: "Usual suspects include \"JSON whose keys aren't sorted the same way each time, or a tool set that shifts between calls.\"" },
    { q: "Which TWO statements about cache pricing are correct? (Choose TWO.)", options: ["A cache read costs more than base", "A cache read costs 10% of base", "A one-hour write costs the same as base", "A five-minute write costs 25% more", "Writes are cheaper than reads"], answer: [1, 3], explain: "A read \"costs 10% the cost\" and \"writing a five-minute entry costs 25% more.\" \"Writes cost a bit more than base, reads cost far less.\"" },
    { q: "Which TWO actions can cause a full or partial cache miss on the next call? (Choose TWO.)", options: ["Reading the cache within five minutes", "Keeping the prefix byte identical", "Switching to a different model", "Placing the user turn after the breakpoint", "Editing a byte inside the prefix"], answer: [2, 4], explain: "\"Switch models mid-flow and you take a full miss\", and changing a byte \"invalidate[s] everything from that point on.\"" },
    { q: "Which TWO facts about the minimum cacheable prefix are correct? (Choose TWO.)", options: ["It depends on the model", "It is the same for every model", "Falling below it returns an error", "Falling below it caches nothing silently", "It applies only to one-hour TTLs"], answer: [0, 3], explain: "\"That minimum depends on the model... Come in under the floor and nothing gets cached. You won't see an error.\"" },
    { q: "Which TWO statements about TTL options are correct? (Choose TWO.)", options: ["The one-hour window is free to write", "The default window is five minutes", "Reads do not refresh the TTL", "TTL is set per request header", "The one-hour window survives longer gaps"], answer: [1, 4], explain: "\"The default is a five-minute ephemeral window\", and the one-hour entry \"survives those longer gaps, but it costs more to write.\"" }
  ]
};
