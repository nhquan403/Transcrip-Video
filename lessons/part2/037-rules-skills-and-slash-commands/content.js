window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> <strong>Rule</strong> luôn bật (always-on), <strong>skill</strong> nạp theo nhu cầu (on-demand) khi description khớp task.
<strong>Custom slash command</strong> thực chất chỉ là một skill gọi bằng tên.</p>

<h3>🔑 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Rules</strong>: chỉ dẫn thường trực trong CLAUDE.md, nạp khi session bắt đầu (hoặc khi chạm file đúng path scope), áp mọi turn.</li>
  <li><strong>Skill</strong>: năng lực tái sử dụng, folder chứa <strong>SKILL.md</strong> có <strong>YAML frontmatter</strong>.</li>
  <li><strong>description</strong>: phần duy nhất của skill luôn nằm trong context; model so khớp với task để quyết định dùng.</li>
  <li><strong>Body</strong>: phần hướng dẫn của skill, chỉ nạp khi được invoke → skill dài vẫn <strong>rẻ</strong>.</li>
  <li><strong>Built-in commands</strong>: <code>/init</code>, <code>/clear</code>, <code>/help</code>, <code>/model</code>; logic cố định, không sửa được.</li>
  <li><strong>Custom commands</strong>: file markdown bạn viết; tên file thành keyword sau dấu slash.</li>
  <li><strong>Path-scoped rule</strong>: rule nạp khi bạn chạm vào file thuộc path của nó.</li>
</ul>

<h3>🎯 Trọng tâm thi</h3>
<ul>
  <li><strong>Always-on vs on-demand</strong>: rule không bao giờ phải gọi; skill chỉ nạp body khi được invoke.</li>
  <li>Tên command lấy từ <strong>tên folder</strong>, không từ field trong file: folder <code>deploy</code> → <code>/deploy</code>.</li>
  <li>Frontmatter là optional: name mặc định = tên folder, description fallback = <strong>đoạn đầu</strong> của file; nhưng thiếu description rõ → match kém.</li>
  <li><code>.claude/commands/name.md</code> và <code>.claude/skills/name/SKILL.md</code> đều tạo <code>/name</code>; trùng tên → <strong>skill thắng</strong>; skills là đường khuyến nghị.</li>
  <li>Scope theo vị trí: <code>.claude/</code> trong project → cả team (qua repo); <code>~/.claude/</code> → cá nhân, mọi project. Không có bước đăng ký.</li>
  <li>CLAUDE.md lớn → tách thành <strong>topic files</strong> cho dễ đọc.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Gõ slash để kích hoạt rule" → <strong>sai</strong>: rule tự nạp.</li>
  <li>"Rule đảm bảo chặn hành động" → <strong>sai</strong>: rule là context; cần chặn cứng → <strong>permissions/hooks</strong>.</li>
  <li>"File markdown trần ở đâu cũng thành skill" → <strong>sai</strong>: phải nằm trong folder skills/commands được scan và có description rõ.</li>
  <li>"Slash command và skill là hai hệ thống riêng" → <strong>sai</strong>: đã gộp thành một.</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p><code>part2/lesson37/Lesson37.java</code>: tính token rule/skill trong context trước và sau khi gọi, rule path-scoped đã nạp chưa, <code>/name</code> chạy cái gì, description thực tế và cảnh báo, scope của custom command theo vị trí file.
Chấm: <code>./mvnw -q compile exec:java -Dexec.args="p2-37"</code>.</p>
`,

  // answer = index of the correct option (options are shuffled on screen); an array means "Choose TWO".
  quiz: [
    { q: "A team wants a coding convention applied on every turn without anyone having to invoke it. Where should it go?", options: ["A skill with a detailed description", "A rule in CLAUDE.md", "A custom slash command", "A built-in command"], answer: 1, explain: "Rules are \"standing, always-on instructions that live in CLAUDE.md and load into context when your session starts. They apply to every turn, and you never call them up.\"" },
    { q: "A developer writes a 3,000-word deployment procedure that is needed only occasionally. Which mechanism keeps context cost lowest until it is needed?", options: ["A rule in CLAUDE.md", "A section in the system prompt", "An output style", "A skill"], answer: 3, explain: "For a skill, \"only its description sits in context\" and the body \"loads only when you or the model invoke it. That's what makes skills cheap.\"" },
    { q: "Which part of a skill sits in context before the skill is invoked?", options: ["Only its description", "The entire SKILL.md body", "Nothing at all", "The folder's file listing"], answer: 0, explain: "\"Only its description sits in context, just enough for Claude to know the skill exists.\"" },
    { q: "A developer expects to type a slash to trigger a rule. What is accurate?", options: ["Rules must be invoked with /rule", "Rules load only when the model decides", "Rules load on their own at session start or on scoped paths", "Rules load only after /init"], answer: 2, explain: "\"A rule loads on its own, either when your session starts or when you touch files whose paths it's scoped to. You never type a slash to fire a rule.\"" },
    { q: "A team adds \"never delete the migrations folder\" to CLAUDE.md, but needs a hard guarantee. What is the MOST appropriate addition?", options: ["A stronger wording of the rule", "A permission rule or hook", "A skill that repeats the rule", "A custom slash command"], answer: 1, explain: "\"Rules are context, not enforcement... If you need a hard block, that's a job for permissions, or hooks, not a rule.\"" },
    { q: "A skill lives in the folder .claude/skills/deploy, and its file has a name field set to ship. How is it invoked?", options: ["/ship", "/skill-deploy", "/ship-deploy", "/deploy"], answer: 3, explain: "\"The command name comes from the folder name, not from any field inside the file. So if the folder is called deploy, you invoke it by typing slash deploy.\"" },
    { q: "A developer drops a bare markdown file with instructions into a skills folder, with no frontmatter. Why might it fire unreliably?", options: ["It has no clear description to match against", "Skills without frontmatter are rejected", "The file is loaded as a rule instead", "Bare files are only used by built-in commands"], answer: 0, explain: "\"A skill with no clear description matches poorly, so it fires unreliably, if at all. The description is doing the real work.\"" },
    { q: "A skill has no description field. What does Claude Code use instead?", options: ["The folder name", "The file name", "The first paragraph of the file", "Nothing, so it can never fire"], answer: 2, explain: "\"The name defaults to the folder name, and the description falls back to the file's first paragraph.\"" },
    { q: "Which TWO statements about SKILL.md frontmatter are accurate? (Choose TWO.)", options: ["The fields are technically optional", "The name field sets the slash command name", "The description is what the model matches against", "Frontmatter must list every tool used", "Frontmatter is loaded only after invocation"], answer: [0, 2], explain: "\"The front matter fields are technically optional\", and the description is \"what the model matches against to decide the skill is relevant.\" The command name comes from the folder." },
    { q: "A developer writes a well-described skill file in a docs folder that Claude Code does not scan. What happens?", options: ["It works like any other skill", "It is just a note", "It loads as a rule", "It becomes a built-in command"], answer: 1, explain: "\"The file has to live in a skills or commands folder that Claude actually scans. A note sitting anywhere else is just a note.\"" },
    { q: "Which statement about slash commands and skills in current Claude Code is accurate?", options: ["They are two separate features", "Commands replaced skills", "Skills cannot be invoked by name", "They were merged into one system"], answer: 3, explain: "\"In current Claude Code, they were merged into one system.\"" },
    { q: "Both .claude/commands/review.md and .claude/skills/review/SKILL.md exist. A user types /review. What runs?", options: ["The skill", "The command", "Both, one after another", "Neither, an error is shown"], answer: 0, explain: "\"If a skill and a command ever share a name, the skill is the one that wins.\"" },
    { q: "Which form does the lesson recommend for new custom commands?", options: ["The .claude/commands/name.md form", "Built-in commands", "Skills", "Rules in CLAUDE.md"], answer: 2, explain: "\"The older commands form still works, but skills are the recommended path now.\"" },
    { q: "Which TWO are built-in slash commands mentioned in the lesson? (Choose TWO.)", options: ["/deploy", "/clear", "/review", "/model", "/prune"], answer: [1, 3], explain: "\"Think of slash init, slash clear, slash help, slash model. You can't edit what they do.\"" },
    { q: "A developer wants to change what /help does. What is accurate?", options: ["Edit its markdown file in .claude", "Built-in commands run fixed logic and cannot be edited", "Override it with a rule", "Add a description to its frontmatter"], answer: 1, explain: "Built-in commands \"are coded right into the tool, and they run fixed logic... You can't edit what they do.\"" },
    { q: "A team wants a custom command that every teammate gets after pulling the repo. Where should the file be saved?", options: ["In the home ~/.claude folder", "In settings.local.json", "In the system prompt", "Under .claude in the project"], answer: 3, explain: "\"Put the file under .claude in your project, and it ships with the repo, so your whole team gets it once they pull.\"" },
    { q: "A developer wants a personal command available in every project, but only for themselves. Where should it go?", options: ["Under the .claude folder in the home directory", "Under .claude in one project", "In the project CLAUDE.md", "In the managed settings"], answer: 0, explain: "\"Put it under the Claude folder in your home directory instead and it's personal, available across every project you work on, but only for you.\"" },
    { q: "What sets the scope of a custom command?", options: ["A registration step in settings.json", "A scope field in the frontmatter", "The file's location", "The command's name length"], answer: 2, explain: "\"There's no registration step, no config to flip... The file's location is what sets the scope.\"" },
    { q: "Which TWO statements about rules are accurate? (Choose TWO.)", options: ["They load only when their description matches", "They must be invoked by name", "They apply to every turn", "They guarantee Claude's behavior", "They can be scoped to file paths"], answer: [2, 4], explain: "Rules \"apply to every turn\" and load \"when you touch files whose paths it's scoped to.\" They are context, not enforcement." },
    { q: "A CLAUDE.md file has grown long and hard to read. What does the lesson suggest?", options: ["Convert it into one large skill", "Split it into separate topic files", "Move it into the system prompt", "Delete older rules"], answer: 1, explain: "\"As your CLAUDE.md grows, you can split it into separate topic files, one per subject, so it stays readable.\"" },
    { q: "A file at .claude/commands/lint.md exists. How is it invoked?", options: ["/commands-lint", "/lint.md", "Only by the model, not by the user", "/lint"], answer: 3, explain: "\"A file at .claude commands name.md creates a command you invoke as slash name.\"" },
    { q: "Which statement BEST describes the difference between rules and skills?", options: ["Rules are always-on; skills load on demand", "Rules are cheap; skills are expensive", "Rules load on demand; skills are always-on", "Both load fully at session start"], answer: 0, explain: "\"Always-on versus on-demand. That's the line to remember.\"" },
    { q: "Why can a long, detailed skill cost almost nothing in context?", options: ["Skills are compressed by the model", "Skills are cached in the system prompt", "Its body loads only when invoked", "Skills share one token budget with rules"], answer: 2, explain: "\"You can write a long, detailed skill, and it costs you almost nothing until the moment it's actually needed.\"" },
    { q: "Which TWO paths create a command invoked as /name? (Choose TWO.)", options: [".claude/commands/name.md", ".claude/rules/name.md", "CLAUDE.md with a name heading", ".claude/skills/name/SKILL.md", ".claude/settings.json name key"], answer: [0, 3], explain: "\"A file at .claude commands name.md creates a command you invoke as slash name. A skill folder at .claude skills name with a SKILL.md inside creates the very same slash name.\"" },
    { q: "What is the single most important thing to write for a skill to be found reliably?", options: ["A long body", "A clear description", "A version number", "A list of examples"], answer: 1, explain: "\"The one thing you really need is a clear description, so the model can find it.\"" },
    { q: "Which of the following is NOT true of custom commands?", options: ["You write them as markdown files", "The file name becomes the keyword", "They tell Claude what to do", "They run fixed logic coded into the tool"], answer: 3, explain: "Fixed logic describes built-in commands. Custom commands are markdown files where \"the file name becomes the keyword\" and \"whatever you put in that file is what the command tells Claude to do.\"" },
    { q: "A team member says a custom slash command is a different feature from a skill. What is the BEST correction?", options: ["A custom command is really a skill invoked by name", "Commands run on a separate model", "Commands are rules invoked by name", "Commands are always-on context"], answer: 0, explain: "\"A custom command is really just a skill you invoke by name.\"" },
    { q: "When does a skill's body load?", options: ["At session start", "When CLAUDE.md is edited", "When you or the model invoke it", "After every tool call"], answer: 2, explain: "\"The body, all the actual instructions, loads only when you or the model invoke it.\"" },
    { q: "How does a team ensure everyone uses the exact same project command?", options: ["Each member copies it to their home folder", "Check it into version control", "Paste it into the chat each session", "Register it with a settings flag"], answer: 1, explain: "\"Because the project version lives in version control, checking it in is how you make sure everyone on the team is working with the exact same command.\"" },
    { q: "Which TWO statements about where custom commands live are accurate? (Choose TWO.)", options: ["Home-folder commands are shared with the team", "Project commands ship with the repo", "A settings flag must enable each command", "Project commands apply only to their author", "Home-folder commands are personal across projects"], answer: [1, 4], explain: "Under .claude in the project \"it ships with the repo\"; under the home folder \"it's personal, available across every project you work on, but only for you.\"" }
  ]
};
