# CCDV-F: cấu trúc đề thi và keyword cần nắm

Ngày nghiên cứu: 2026-10-28. Nguồn là các trang luyện thi bên thứ ba trích lại Exam Guide v1.0 của Anthropic; chưa đọc được bản gốc của Anthropic, nên con số tỉ trọng cần đối chiếu lại với guide chính thức.

## Kết luận nhanh

- Khóa "CCDV" trong repo khớp với kỳ thi **Claude Certified Developer – Foundations (CCDV-F)**.
- Đề có 53 câu trong 120 phút. Câu hỏi có hai dạng: chọn một đáp án, hoặc chọn nhiều (đề ghi rõ số đáp án cần chọn). Điểm đạt là 720/1000 theo thang quy đổi, không phải 72%.
- Đề có 8 domain, chia thành 25 sub-skill.
- Bộ bài trong repo phủ trọn domain lớn nhất (Applications and Integration, 33.1%), cùng với Agents and Workflows (14.7%) và Claude Code (3.1%). Tổng cộng khoảng 51% đề, cộng thêm một phần của Security, Model Selection và Prompt/Context.
- Ba vùng còn mỏng: **Model Selection and Optimization** (16.8%), **Tools and MCPs** (10.6%) và **Prompt and Context Engineering** (11%).

## 8 domain và chỗ chúng nằm trong khóa học

### 1. Applications and Integration — 33.1% (khoảng 17–18 câu)

**Understanding Requirements (3.4%): Phần 2, bài 1–4**
- business requirement chuyển thành testable spec
- functional và non-functional requirement
- latency, throughput, region/data residency budget
- chọn kiến trúc khớp với yêu cầu

**Systems Life Cycle (2.8%): Phần 2, bài 5–6**
- develop, implement, operate, maintain
- monitoring, model version pinning, rollout/rollback

**Claude API Mechanics (6.8%): Phần 2, bài 7–14**
- Messages API: turns, content blocks, roles; system là tham số riêng chứ không phải một role
- stop_reason: end_turn, max_tokens, tool_use, stop_sequence, pause_turn, refusal
- usage: input_tokens, output_tokens, cache_creation_input_tokens, cache_read_input_tokens
- streaming SSE: message_start, content_block_delta, message_stop
- vision input
- adaptive thinking và effort
- prompt caching: cache_control, breakpoint, TTL 5 phút và 1 giờ, prefix phải khớp hoàn toàn
- Message Batches: custom_id, kết quả không theo thứ tự, tối đa 24 giờ, giảm khoảng 50% chi phí; chọn realtime hay batch
- Amazon Bedrock và Vertex AI (third-party vendor access)

**Software Engineering Foundations (7.4%): Phần 2, bài 15–22**
- REST: method, status code (400, 401, 403, 404, 413, 429, 500, 529 overloaded), header x-api-key và anthropic-version
- JSON body
- async/await, concurrency, backpressure
- retry với exponential backoff và jitter
- git workflow
- code review và refactor prompt/code

**Claude Application Design (8.6%, sub-skill nặng nhất): Phần 2, bài 23–29**
- surfaces: raw API, Agent SDK, Claude Code, claude.ai, Desktop
- system prompt preset và setting sources
- CLAUDE.md được nạp như một lượt user
- content boundaries và untrusted input
- schema design
- session hygiene: /clear, /compact, khi nào nên mở phiên mới
- quản lý plugin

**Configuration Management (4.1%): Phần 2, bài 30–36**
- thứ tự ưu tiên của CLAUDE.md (enterprise/managed, project, user, local)
- settings.json: permissions allow/ask/deny, hooks
- các lớp cấu hình user, project và local
- versioning prompt và config, pin model version
- phụ thuộc giữa các plugin

### 2. Model Selection and Optimization — 16.8% (khoảng 9 câu, phủ một phần)

- **LLM Fundamentals (5.2%):**
  - token, context window, sampling (temperature), non-determinism, next-token generation
  - fast mode, extended/adaptive thinking, effort levels
  - zero-shot, one-shot, multi-shot
- **Technical Fundamentals (6.1%):** SDK bọc REST API, websockets
- **Cost and Token Management (2.8%):** theo dõi usage, cost modelling, prompt caching, cache checkpointing (Phần 2, bài 8 và 11)
- **Model Selection and Tradeoffs (2.7%):**
  - Opus, Sonnet và Haiku ứng với chất lượng, độ trễ và chi phí
  - breaking behavior changes giữa các bản model, vì thế cần pin version

### 3. Agents and Workflows — 14.7% (khoảng 8 câu): Phần 1

- **Agent Architecture (4.5%), Phần 1 bài 1–5:**
  - workflow hay agent
  - các mẫu prompt chaining, routing, parallelization, orchestrator-worker, evaluator-optimizer
  - cấu trúc manager/supervisor, subagent, context isolation
- **Agent Construction (5.3%), Phần 1 bài 6–11:**
  - Claude Agent SDK: hàm query, vòng lặp agent
  - streaming input và single-message input
  - custom agent loop, harness (turns, state, control)
  - self-hosted hay Anthropic-hosted
  - hooks cho hành động tất định
- **Agent Patterns (4.9%), Phần 1 bài 12 và Phần 2 bài 38:**
  - tool-use loop, subagent, memory, quản lý context window
  - các framework Strands, LangGraph, PydanticAI (chỉ cần biết tên và vai trò)

### 4. Prompt and Context Engineering — 11% (khoảng 6 câu, phủ một phần)

- **Prompt Engineering (4.6%):**
  - chỉ dẫn rõ ràng, few-shot
  - đặt nội dung ở system hay user
  - output constraints, XML tags, prefill, lặp để tinh chỉnh
  - input sanitization
- **Context Engineering (3.8%):**
  - quản lý context window, tỉa bớt tool output
  - compaction, cô lập context bằng subagent (Phần 2 bài 26–27, Phần 1 bài 5)
- **Output Handling (2.6%):**
  - structured outputs, response validation, defensive parsing
  - hoài nghi với output nghe rất tự tin: JSON đúng hình dạng vẫn có thể chứa giá trị sai (Phần 2 bài 25)

### 5. Tools and MCPs — 10.6% (khoảng 5–6 câu; vùng mỏng nhất)

- **Tool Implementation (4.4%):**
  - tool use / function calling, input_schema, viết tool description tốt
  - tool_choice: auto, any, tool, none
  - trả lỗi bằng tool_result với is_error
  - client tools và server tools (web search, code execution)
  - approval patterns
  - parallel tool calls
- **Agentic Customization (4.1%):** khi nào dùng built-in tools, custom tools, Skills hay MCP
- **MCP Server Development (2.1%):**
  - MCP có ba primitive: tools, resources, prompts
  - transport: stdio và streamable HTTP
  - quan hệ client và server

### 6. Security and Safety — 8.1% (khoảng 4 câu)

- **AI Application Security (3.2%), Phần 2 bài 25:**
  - prompt injection, jailbreak, untrusted input (kể cả tool result)
  - data leakage, PII redaction
  - authentication và authorization (authN/authZ)
- **Guardrails (2.3%):** content policy, nhiều lớp guardrail, least privilege, IAM
- **Secrets và Keys (1.6%):**
  - API key đặt trong biến môi trường hoặc secret manager, không commit
  - tách key cho dev và prod, rotate key
- **Claude Hooks (1.0%):** hook PreToolUse chặn hành động phá hoại; dùng exit code để chặn

### 7. Claude Code — 3.1% (khoảng 1–2 câu): Phần 2 bài 30–38

- rules, Skills, slash commands, subagents, agent memory
- headless mode (`-p`), auto mode
- thứ bậc CLAUDE.md và settings.json

### 8. Eval, Testing, and Debugging — 2.6% (khoảng 1–2 câu)

- phân loại lỗi và chọn cách khôi phục: retry lỗi 429/529, không retry lỗi 400
- trace analysis
- khoanh vùng lỗi do tầng tích hợp hay do output của model; thử lại trên raw API (Phần 2 bài 23–24)

## Lời khuyên ôn thi

1. Ưu tiên theo tỉ trọng. Riêng Applications and Integration cộng Model Selection đã chiếm khoảng 50% đề, nên học kỹ hai domain này trước.
2. Bù ba vùng mỏng: Tools/MCP, Model Selection và Prompt/Context. Nên có thêm một phần bài học bổ sung cho chúng.
3. Đề là dạng tình huống với các đáp án nhiễu hợp lý. Hãy luyện cách loại đáp án, ví dụ "đúng nhưng không phải cách tốt nhất", thay vì học thuộc định nghĩa.
4. Với câu chọn nhiều, đọc kỹ số đáp án cần chọn.

## Câu hỏi chưa giải quyết

- Chưa có bản PDF Exam Guide chính thức của Anthropic để xác nhận tỉ trọng của 25 sub-skill.
- Tên một số domain hơi khác nhau giữa các nguồn, nhưng 8 con số tỉ trọng thì giống nhau.

## Nguồn

- https://dev.to/poorna_reddy/claude-certified-developer-foundations-ccdv-f-exam-domains-weights-and-topics-26n
- https://findskill.ai/blog/claude-certified-developer-exam-cost-format-domains/
- https://claudecertificationguide.com/blog/claude-certified-developer-foundations-exam-guide
- https://www.claudecertifiedarchitects.com/blog/ccdv-f-study-plan/
- https://tutorialsdojo.com/tag/ccdv-f/
