window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Đọc response = <strong>loop content theo type</strong>, <strong>branch theo stop_reason</strong>, xem <strong>usage</strong> để biết cost.
Content cho biết Claude nói gì, stop_reason cho biết làm gì tiếp, usage cho biết tốn bao nhiêu.</p>

<h3>🔑 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>content</strong>: list các block; loop và xử lý theo <code>type</code>, không lấy index cố định.</li>
  <li><strong>stop_reason</strong>: lý do model dừng turn này; code rẽ nhánh theo nó.</li>
  <li><strong>end_turn</strong>: Claude tự xong → lấy text, kết thúc (<strong>exit</strong>).</li>
  <li><strong>tool_use</strong>: Claude dừng để xin tool → chạy tool, trả kết quả (<strong>yield</strong>).</li>
  <li><strong>max_tokens</strong>: chạm output cap → tăng cap hoặc continue ở request sau.</li>
  <li><strong>refusal</strong>: từ chối vì safety; trường hợp duy nhất <strong>stop_details</strong> có dữ liệu (category + explanation).</li>
  <li><strong>stop_sequence / model_context_window_exceeded / pause_turn</strong>: custom stop string / chạm tổng window / turn dài bị tạm dừng.</li>
  <li><strong>usage</strong>: <code>input_tokens</code> (chỉ phần <strong>uncached</strong>), <code>output_tokens</code>, và hai trường cache write / cache read.</li>
</ul>

<h3>🎯 Trọng tâm thi</h3>
<ul>
  <li>Thứ tự block <strong>không đảm bảo</strong>: thinking hoặc tool_use có thể đứng trước text.</li>
  <li>Tool loop: <strong>read → run → append → recall</strong>; tool chạy trong app của bạn, không chạy phía Anthropic; lặp tới khi <code>end_turn</code>.</li>
  <li><code>pause_turn</code> → gửi lại assistant content để tiếp tục; loop chỉ chờ end_turn sẽ vỡ âm thầm.</li>
  <li>Full prompt size = <strong>input_tokens + cache write + cache read</strong>.</li>
  <li><code>output_tokens</code> là phần bị giới hạn bởi max_tokens.</li>
  <li>Guard: kiểm tra <code>stop_reason == refusal</code> <strong>trước</strong>, rồi mới đọc stop_details (các trường hợp khác là null).</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Lấy <code>content[0]</code> là text" → <strong>sai</strong>: chạy được lúc test, vỡ ở production.</li>
  <li>"input_tokens là toàn bộ prompt" → <strong>sai</strong>, chỉ phần không đọc từ cache.</li>
  <li>"Sửa nhẹ hoặc cắt thinking/tool blocks trước khi gửi lại" → <strong>sai</strong>, call bị reject; coi chúng là read-only.</li>
  <li>"stop_details luôn có giá trị" → <strong>sai</strong>, chỉ có khi refusal.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p><code>part2/lesson08/Lesson08.java</code>: lấy text bằng loop theo type, lọc tool_use, branch đủ 7 stop_reason, tính full prompt size từ usage, đọc stop_details chỉ khi refusal.
Chấm: <code>./mvnw -q compile exec:java -Dexec.args="p2-08"</code>; chạy thật: thêm <code>--live</code>.</p>
`,

  // answer = index of the correct option (options are shuffled on screen); an array means "Choose TWO".
  quiz: [
    { q: "A developer's handler reads content[0].text and passes every test, but fails in production on some replies. What is the MOST likely cause?", options: ["The API returned a malformed response", "Another block type came before the text", "Production uses a smaller max_tokens value", "The text block was moved into usage"], answer: 1, explain: "\"The order isn't guaranteed. A thinking block or a tool use block can easily come before the text you were expecting.\" Loop over content by type instead." },
    { q: "What is the MOST robust way to extract the text from a response?", options: ["Read the last block, since text always comes last", "Read the first block and check stop_reason", "Concatenate every block's content as a string", "Loop over content and branch on each block's type"], answer: 3, explain: "\"You read it by looping over it, never by grabbing a fixed index. As you loop, you branch on each block's type field.\"" },
    { q: "A response arrives with stop_reason set to end_turn. What should the application do?", options: ["Read the final content and stop", "Run the requested tool and call again", "Raise max_tokens and retry the request", "Read stop_details for its category"], answer: 0, explain: "\"When stop reason is end turn, the model is finished. You read the final content, stop the loop, and hand the answer back.\"" },
    { q: "A summary is cut off and stop_reason is max_tokens. What is the MOST appropriate next step?", options: ["Treat the reply as a refusal", "Remove the system prompt and retry", "Raise the cap or continue the reply", "Resend the same request unchanged"], answer: 2, explain: "max tokens \"means the reply hit your output cap, so raise the cap or continue it in a follow-up request.\"" },
    { q: "stop_reason comes back as tool_use. Where does the requested tool actually run?", options: ["On Anthropic's servers", "Inside your own application", "In the model's own sandbox", "In the Anthropic API gateway"], answer: 1, explain: "\"You run that tool inside your own application. Nothing runs on Anthropic's side here.\"" },
    { q: "Which sequence correctly describes the tool use loop?", options: ["Run the tool, read stop_details, retry, then stop", "Append a tool_result, read the block, run it, then stop", "Call again first, then run the tool, then read usage", "Read the block, run it, append a result, call again"], answer: 3, explain: "\"Read, run, append, recall. That's the whole pattern.\"" },
    { q: "When does the tool use loop end?", options: ["When stop_reason comes back as end_turn", "After exactly one tool call is made", "When usage reaches max_tokens", "When the tool_result is appended"], answer: 0, explain: "\"That cycle repeats as many times as needed, and it ends when stop reason finally comes back as end turn instead.\"" },
    { q: "Which mental model BEST describes end_turn versus tool_use?", options: ["end_turn is a retry, tool_use is an error", "Both mean the reply is finished", "end_turn is an exit, tool_use is a yield", "end_turn is a yield, tool_use is an exit"], answer: 2, explain: "\"End turn is an exit, and tool use is a yield. One ends the conversation, the other suspends it and waits on your code.\"" },
    { q: "An agent's loop waits only for end_turn and occasionally hangs on long turns. Which stop_reason is it MOST likely missing?", options: ["stop_sequence", "pause_turn", "refusal", "end_turn"], answer: 1, explain: "\"A loop that only waits for end turn can silently break on pause turn.\" On pause_turn you \"send the assistant content back to continue.\"" },
    { q: "How should an application respond to stop_reason pause_turn?", options: ["Treat it as a refusal and stop", "Raise max_tokens and start a new chat", "Discard the partial reply and retry", "Send the assistant content back"], answer: 3, explain: "With pause turn, \"a long turn pauses. So you send the assistant content back to continue.\"" },
    { q: "Which stop_reason indicates that a custom stop string fired?", options: ["stop_sequence", "end_turn_reached", "pause_turn", "max_tokens"], answer: 0, explain: "\"Stop sequence when a custom stop string fires.\"" },
    { q: "A response stops because it reached the model's total context window. Which stop_reason is returned?", options: ["max_tokens_reached", "context_limit_reached", "model_context_window_exceeded", "input_window_exceeded"], answer: 2, explain: "\"Model context window exceeded when the response hits the model's total window.\" max_tokens is your own output cap." },
    { q: "A team's cost dashboard treats input_tokens as the full prompt size and underreports heavily cached prompts. What is accurate?", options: ["input_tokens includes cache reads", "input_tokens counts only uncached input", "input_tokens equals output_tokens", "input_tokens includes the system prompt only"], answer: 1, explain: "input tokens \"counts the uncached input tokens the call billed... remember input tokens isn't your whole prompt.\"" },
    { q: "How do you compute the full prompt size from the usage object?", options: ["input_tokens plus the output_tokens", "input_tokens on its own, unchanged", "output_tokens minus cache reads", "input_tokens plus both cache fields"], answer: 3, explain: "\"To get the full prompt size, you add all three input figures together. The uncached input plus both cache counts.\"" },
    { q: "Which usage field is limited by the max_tokens setting?", options: ["output_tokens", "input_tokens", "cache read tokens", "cache write tokens"], answer: 0, explain: "output tokens is \"every token the model generated in its reply. That's the part your max token's ceiling limits.\"" },
    { q: "A handler reads stop_details on every reply and crashes on normal responses. What is the BEST fix?", options: ["Wrap the call in a retry loop", "Read stop_details only on max_tokens", "Check for refusal stop_reason first", "Default stop_details to end_turn"], answer: 2, explain: "\"Always check stop reason first, confirm it's a refusal, and only then read stop details. Guard first, read second.\"" },
    { q: "What does stop_details contain when it is populated?", options: ["The token counts for the call", "A category and why it was declined", "The tool name and its input", "The full text of the reply"], answer: 1, explain: "On a refusal, \"stop details fills in with a category and an explanation of what was declined.\"" },
    { q: "A developer slightly edits a thinking block before sending it back on the latest assistant turn. What happens?", options: ["The edit is accepted silently", "The thinking block is regenerated", "The edit is merged into the text", "The call gets rejected"], answer: 3, explain: "You pass thinking blocks \"back unmodified... Editing them, even slightly, gets the call rejected.\"" },
    { q: "To shrink the history, a team trims tool_use and tool_result blocks from earlier turns. What is the MOST likely result?", options: ["The next call fails", "Lower cost with no side effects", "The model reruns the tools itself", "The blocks are restored from the cache"], answer: 0, explain: "\"If you drop them or change them, the very next call fails because the model can't reconcile the conversation.\"" },
    { q: "Which statement about stop_details is NOT accurate?", options: ["It is always null on end_turn", "It is always null on tool_use", "It is filled in on max_tokens", "It is filled in on a refusal"], answer: 2, explain: "\"For every other stop reason, whether that's end turn or tool use or max tokens, stop details comes back null.\"" },
    { q: "Which TWO are among the three response parts the lesson says to read every time? (Choose TWO.)", options: ["content", "stop_details", "usage", "system", "signature"], answer: [0, 2], explain: "The three parts are content, stop reason and usage: \"Content tells you what Claude said, stop reason tells you what to do, and usage tells you what it cost.\"" },
    { q: "Which TWO stop_reason values require your code to send something back so Claude can continue? (Choose TWO.)", options: ["end_turn", "tool_use", "refusal", "pause_turn", "stop_sequence"], answer: [1, 3], explain: "On tool use you run the tool and return the result; on pause turn you \"send the assistant content back to continue.\"" },
    { q: "Which TWO figures are added to input_tokens to get the full prompt size? (Choose TWO.)", options: ["output_tokens", "max_tokens", "Cache write tokens", "stop_details length", "Cache read tokens"], answer: [2, 4], explain: "\"Separate counts for tokens written to the cache and tokens read from it\"; the full prompt is \"the uncached input plus both cache counts.\"" },
    { q: "Which TWO block handling rules keep a multi-turn flow stable? (Choose TWO.)", options: ["Pass thinking blocks back unmodified", "Summarize tool results before resending", "Drop thinking blocks after each turn", "Carry tool_use and tool_result blocks forward as they were", "Reformat tool blocks as text"], answer: [0, 3], explain: "\"Whatever structured blocks came back on the latest assistant turn, you send them back untouched. Treat those blocks as read-only.\"" },
    { q: "Which TWO stop_reason values does the lesson pair with the action \"take the text and you're done\" or \"run the tool and return the result\"? (Choose TWO.)", options: ["refusal", "end_turn", "max_tokens", "stop_sequence", "tool_use"], answer: [1, 4], explain: "end turn: \"take the text and you're done\"; tool use: \"Claude paused to ask for a tool, so you run it and return the result.\"" },
    { q: "Which stop_reason means Claude declined on safety grounds?", options: ["end_turn", "refusal", "pause_turn", "stop_sequence"], answer: 1, explain: "\"A refusal means Claude declined on safety grounds. The single case where stop details gets filled in.\"" },
    { q: "Why does the lesson recommend handling text, tool calls, and thinking in separate branches?", options: ["It reduces the token usage of each call", "It makes the API return blocks in order", "It is required to enable caching", "One handler works for any reply shape"], answer: 3, explain: "\"Handle text, tool calls, and thinking each in their own branch. And the same handler works no matter what shape the reply takes.\"" },
    { q: "What does the usage object tell you?", options: ["The token accounting for the call", "Why the model stopped", "Which tools were called in the turn", "The safety category of a refusal"], answer: 0, explain: "Usage is \"the token accounting for the call. It reports how much input and output the request consumed, which is exactly what you watch for cost.\"" },
    { q: "When stop_reason is tool_use, where does the tool name and input come from?", options: ["The stop_details field", "The usage object of the response", "The tool_use block in content", "The system prompt of the request"], answer: 2, explain: "\"First, you read the tool use block to get the tool's name and the input it wants.\"" },
    { q: "According to the lesson, where do response handlers MOST often quietly break down?", options: ["Using too many content blocks", "Blind indexing or misread stop_reason", "Setting max_tokens much too high", "Sending a long system prompt"], answer: 1, explain: "\"Indexing blindly or misreading the stop reason is where response handlers quietly break down.\"" }
  ]
};
