window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> Refactoring = sắp xếp lại code đang chạy cho dễ đọc, dễ bảo trì <strong>mà không đổi hành vi</strong>.
Với ứng dụng Claude: <strong>isolate API call sau một client</strong>, <strong>extract shared prompts/config</strong>, <strong>reduce coupling</strong>.</p>

<h3>🔑 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Behavior preserving</strong>: output trước và sau như nhau; người dùng không nhận ra gì.</li>
  <li><strong>Tests as safety net</strong>: xác nhận hành vi không đổi để refactor tự tin.</li>
  <li><strong>Keep it separate</strong>: refactor và feature change <strong>không chung commit</strong>.</li>
  <li><strong>Single client module</strong>: model name, headers, retry policy, error handling ở một chỗ.</li>
  <li><strong>Seam / clean interface</strong>: app phụ thuộc interface của bạn, không phụ thuộc raw API.</li>
  <li><strong>Shared named fragment</strong>: đoạn chỉ dẫn lặp lại rút thành một đơn vị dùng chung, test riêng được.</li>
  <li><strong>Coupling</strong>: mức một thay đổi ở chỗ này ép thay đổi ở chỗ khác.</li>
</ul>

<h3>🎯 Trọng tâm thi</h3>
<ul>
  <li>Refactor giá trị nhất: <strong>isolate the API call behind one clean interface</strong> → đổi model/header/retry là <strong>one module edit</strong>.</li>
  <li>4 target: <strong>duplicated prompts</strong> → shared fragment; <strong>inline config</strong> → config module; <strong>repeated call logic</strong> → single client; <strong>tangled concerns</strong> (build prompt + call + parse trong một hàm) → tách ra.</li>
  <li>Tight coupling là lý do pin model biến thành <strong>20-file edit</strong>; low coupling → <strong>make change local</strong>.</li>
  <li>Small refactor (rename, extract helper, xoá block trùng): rủi ro thấp, làm liên tục. Large refactor (module boundaries, client layer): dựa vào tests, <strong>small reviewable steps</strong>, không giant rewrite.</li>
  <li>Claude làm refactoring partner: spot duplication, đề xuất client interface, draft phần cơ học; <strong>tests + human sign-off</strong> vẫn bắt buộc.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Refactor kèm luôn tính năng mới cho tiện" → <strong>sai</strong>, khó review và rollback.</li>
  <li>"Copy-paste model name rồi tìm-thay khi đổi" → <strong>sai</strong>, sẽ sót một chỗ → bug.</li>
  <li>"Prompt là string literal rải rác" → <strong>sai</strong>, prompt là reusable asset.</li>
  <li>"Claude đề xuất refactor tự tin thì không cần test" → <strong>sai</strong>, có thể đổi output tinh vi.</li>
  <li>"Large refactor nên làm một lần cho xong" → <strong>sai</strong>, đi từng bước nhỏ.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p><code>part2/lesson22/Lesson22.java</code>: tìm dòng prompt bị chép, rút thành tham chiếu <code>{{name}}</code>, dựng prompt từ fragment (thiếu thì báo lỗi), đếm file hard-code tên model, dùng test chứng minh refactor giữ hành vi.
Chấm: <code>./mvnw -q compile exec:java -Dexec.args="p2-22"</code> (chỉ chấm offline).</p>
`,

  // answer = index of the correct option (options are shuffled on screen); an array means "Choose TWO".
  quiz: [
    { q: "Which statement BEST defines refactoring?", options: ["Rewriting code to add new features faster", "Restructuring working code, same behavior", "Replacing an SDK with raw HTTP calls", "Optimizing code to cut API latency and token cost"], answer: 1, explain: "\"Refactoring is restructuring working code to make it more readable and maintainable without changing what it does.\"" },
    { q: "A developer wants to refactor the Claude client and also add a new summarization feature. How should they commit the work?", options: ["One commit, so the history stays short", "One commit, with a long message", "Commit the feature first, refactor never", "Separate commits for each"], answer: 3, explain: "\"A refactor and a feature change shouldn't share a commit because mixing them makes review and rollback painful.\"" },
    { q: "What gives a developer confidence that a refactor did not change behavior?", options: ["Tests that confirm behavior is unchanged", "A code review by Claude alone", "A shorter file length after the change is done", "A new model ID"], answer: 0, explain: "\"Tests are your safety net. They confirm behavior didn't change so you can restructure with confidence.\"" },
    { q: "A Claude integration has raw SDK calls scattered across forty files. What is the HIGHEST value refactor?", options: ["Add comments above each call site", "Rename the files for clarity", "Wrap the calls behind one client module", "Raise the retry count everywhere"], answer: 2, explain: "\"The highest value refactor in most Claude integrations is isolating the API call behind one clean interface.\"" },
    { q: "Which TWO things should live inside the single client module? (Choose TWO.)", options: ["The retry policy", "Each feature's UI layout", "The model name", "End-user session data", "The test fixtures"], answer: [0, 2], explain: "\"The model name, the headers, the retry policy, and the error handling all live in that one place.\"" },
    { q: "After calls are isolated behind a client, what does swapping to a new model require?", options: ["A search across the whole project", "A one module edit", "A change in every caller", "A rewrite of all prompts"], answer: 1, explain: "\"Swapping to a new model, adjusting a header, or tweaking retry behavior becomes a one module edit instead of a hunt across the whole project.\"" },
    { q: "In the scattered version, a team must pin a new model in every file. What is the MOST likely risk?", options: ["The new model rejects old headers", "Prompt caching stops working", "The tests run slower", "They miss one spot, creating a bug"], answer: 3, explain: "\"You're editing every one of them and you will miss one. That missed spot is a bug waiting to happen.\"" },
    { q: "Which statement about the scattered and consolidated versions is accurate?", options: ["They behave the same, but one makes change cheap", "Only the consolidated version is correct", "The scattered version is faster at runtime overall", "They behave differently under load"], answer: 0, explain: "\"Same behavior either way, but one of them makes change cheap and the other makes it dangerous.\"" },
    { q: "The same block of instructions appears in five call sites, and only two were updated last month. What is the MOST appropriate refactor?", options: ["Update the remaining three copies", "Add a comment linking all five copies", "Extract one shared named fragment", "Move all five into one long prompt"], answer: 2, explain: "\"Pull that repeated instruction text into one shared named fragment... Then each call site references the shared fragment instead of carrying its own copy.\"" },
    { q: "What problem does duplicated prompt text cause over time?", options: ["Higher token cost on every request", "Inconsistent behavior across paths", "Slower API responses", "Failed schema validation"], answer: 1, explain: "\"One copy gets updated, the others don't, and now your behavior is inconsistent depending on which path ran.\"" },
    { q: "Which TWO practices match the lesson's advice for prompt text? (Choose TWO.)", options: ["Keep prompts as inline string literals", "Store reusable system prompts as testable units", "Copy prompts into each caller for speed", "Treat prompt text as a reusable asset", "Let each team member keep their own copy"], answer: [1, 3], explain: "\"Store reusable system prompts as units you can test on their own\" and \"treat prompt text as a reusable asset, not as string literals scattered around.\"" },
    { q: "Model names are hard-coded at each call site. Where should they go?", options: ["Into the system prompt", "Into each test file", "Into a code comment", "Into one config module"], answer: 3, explain: "Inline config means \"model names, and settings hard-coded at each call site which belong in one config module.\"" },
    { q: "One function builds the prompt, calls the API, and parses the result. Which refactoring target is this?", options: ["Tangled concerns", "Duplicated prompts", "Inline config", "Repeated call logic"], answer: 0, explain: "Tangled concerns are \"where prompt building, the API call, and parsing all live in one function which you split apart.\"" },
    { q: "The same request, retry, and parse code is copied everywhere. What is the fix?", options: ["Split it into more functions per file", "Move it into the system prompt", "Wrap it behind a single client", "Delete the retry logic"], answer: 2, explain: "Repeated call logic is \"the same request, retry, and parse code copied everywhere which you wrap behind a single client.\"" },
    { q: "Which of the following is NOT one of the four refactoring targets in the lesson?", options: ["Duplicated prompts", "Slow test suites", "Inline config", "Tangled concerns"], answer: 1, explain: "The four targets: \"duplicated prompts, inline config, repeated call logic, tangled concerns.\"" },
    { q: "Which statement about coupling is accurate?", options: ["It is how many tests a module has", "It is how often the model is called", "It is the number of files in a module", "How much one change forces others"], answer: 3, explain: "\"Coupling is how much a change in one place forces changes somewhere else.\"" },
    { q: "A simple model pin keeps turning into a 20-file edit. What is the root cause?", options: ["Tight coupling", "Too many tests", "A slow CI pipeline", "Missing tags"], answer: 0, explain: "\"Tight coupling is why a simple model pin turns into a 20-file edit.\"" },
    { q: "Which TWO outcomes come from reducing coupling in a Claude integration? (Choose TWO.)", options: ["Every caller sets its own retry policy", "Each file keeps its own model name", "A model pin update lives in the client", "Config tweaks need edits in many places", "A prompt version bump changes one fragment"], answer: [2, 4], explain: "\"A model pin update lives in the client. A prompt version bump changes one shared fragment.\"" },
    { q: "Why does low coupling let a team move fast?", options: ["It removes the need for tests", "It lets every file pick its own model", "A change touches one place instead of many", "It skips the review process"], answer: 2, explain: "\"The change touches one place instead of many\", so swapping a model or rolling a prompt version \"becomes cheap and low risk.\"" },
    { q: "Which TWO are examples of small, everyday refactors? (Choose TWO.)", options: ["Extract a helper", "Redraw module boundaries", "Introduce a client layer", "Rename a confusing variable", "Rewrite the whole service"], answer: [0, 3], explain: "Small refactors: \"Rename a confusing variable, extract a helper, delete a duplicated block.\"" },
    { q: "A team plans to introduce a client layer across the codebase. How should they approach it?", options: ["One giant rewrite over a weekend", "Use tests and small, reviewable steps", "Skip tests to move faster", "Combine it with the next feature release"], answer: 1, explain: "Large refactors \"carry more risk so you lean hard on tests and move in small, reviewable steps rather than one giant rewrite.\"" },
    { q: "Which rule applies to BOTH small and large refactors?", options: ["Always ask Claude to approve them before merge", "Only do them before a release", "Skip tests for small ones", "Preserve behavior; keep features separate"], answer: 3, explain: "\"You preserve behavior and you keep the refactor out of any commit that also changes a feature.\"" },
    { q: "A developer asks Claude to find duplication in the codebase. Which statement is accurate?", options: ["Claude can spot duplication and suggest an extraction", "Claude cannot read code across files", "Claude's suggestions never need tests", "Claude should merge its own refactors"], answer: 0, explain: "Claude \"can spot duplication you've stopped noticing and suggest a clean extraction.\"" },
    { q: "Claude proposes a confident refactor of the client layer. What should happen BEFORE it lands?", options: ["It is merged since the suggestion is confident", "It is deployed to production for real feedback", "Tests verify behavior and a human approves each step", "The model ID is bumped to match"], answer: 2, explain: "\"A confident refactor suggestion can still change output in a subtle way and you review each step and approve it before it lands.\"" },
    { q: "Which TWO safeguards keep Claude-assisted refactoring trustworthy? (Choose TWO.)", options: ["Higher temperature settings", "Tests that verify behavior", "Longer prompts", "Fewer commits", "Human sign-off on each step"], answer: [1, 4], explain: "Claude \"doesn't replace the tests or the human sign-off that make refactoring trustworthy.\"" },
    { q: "After a refactor, users report that responses look different. What does this indicate?", options: ["The refactor worked exactly as it was intended", "It changed behavior, so it was not a refactor", "The model was silently upgraded by the provider", "Users need to clear their local browser cache"], answer: 1, explain: "Refactoring is behavior preserving: \"The output is the same before and after... Nobody using the system should notice a thing.\"" },
    { q: "What should the rest of the application depend on after isolating calls?", options: ["The raw API directly", "Each feature's own SDK copy", "Hard-coded HTTP headers", "Your client interface"], answer: 3, explain: "\"Everything else depends on your interface, not on the raw API.\"" },
    { q: "A prompt typo is fixed in a shared fragment. Which callers get the fix?", options: ["Every caller, at the same time", "Only the caller that was edited", "Only callers redeployed manually", "None until the model is re-pinned"], answer: 0, explain: "\"Fix the wording once and every caller gets the corrected version at the same time.\"" },
    { q: "Which part of a large refactor is Claude especially quick at drafting?", options: ["The final approval", "The release notes", "The mechanical parts", "The business requirements"], answer: 2, explain: "Claude \"can draft the mechanical parts of a large refactor quickly.\"" },
    { q: "Which statement BEST summarizes the lesson?", options: ["Refactoring is mainly about making code run faster", "It keeps change easy without changing behavior", "Prompts should stay inline for clarity", "Claude can replace tests during refactors"], answer: 1, explain: "\"Refactoring keeps a Claude integration easy to change without changing what it does.\"" }
  ]
};
