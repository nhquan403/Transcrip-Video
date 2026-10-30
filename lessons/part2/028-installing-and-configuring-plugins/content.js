window.LESSON_CONTENT = {
  explanation: `
<p class="key"><strong>Nói ngắn gọn:</strong> <strong>Plugin</strong> là một thư mục tự chứa, cài như <strong>một đơn vị</strong>, gói nhiều năng lực cùng lúc.
Cài đặt luôn là <strong>2 bước</strong>: thêm marketplace (chỉ đăng ký catalog, <strong>không cài gì</strong>) rồi install plugin theo tên.</p>

<h3>🔑 Keyword cần nhớ</h3>
<ul class="terms">
  <li><strong>Plugin</strong>: thư mục tự chứa mở rộng Claude Code; install và update <strong>như một bộ</strong>.</li>
  <li><strong>plugin.json</strong>: manifest định danh plugin và khai báo nó cung cấp gì.</li>
  <li><strong>Marketplace</strong>: catalog liệt kê plugin; thêm từ repo, URL hoặc local path.</li>
  <li><strong>Official marketplace</strong>: có sẵn mặc định; chỉ tự thêm marketplace community/custom.</li>
  <li><strong>Plugin contents</strong>: slash commands, skills, subagents, hooks, MCP servers, LSP servers, background monitors.</li>
  <li><strong>Disable / Uninstall</strong>: disable tạm dừng nhưng vẫn cài; uninstall gỡ plugin và file hoàn toàn.</li>
  <li><strong>/reload-plugins</strong>: áp thay đổi ngay giữa phiên, không cần restart Claude Code.</li>
  <li><strong>Scope</strong>: chọn khi cài, quyết định plugin dành cho bạn hay cả project.</li>
</ul>

<h3>🎯 Trọng tâm thi</h3>
<ul>
  <li>Flow: <strong>marketplace add</strong> (đăng ký) → <strong>install name@marketplace</strong> (cài theo tên, gắn với marketplace nguồn).</li>
  <li>Thêm marketplace mà không thấy gì mới → <strong>bình thường</strong>, còn phải install plugin cụ thể.</li>
  <li><code>/plugin</code> không tham số → interactive manager 4 tab: <strong>Discover, Installed, Marketplaces, Errors</strong> (Errors = plugin load lỗi).</li>
  <li><strong>list</strong> = inventory, lọc enabled/disabled. Tạm dừng → disable; bỏ hẳn → uninstall.</li>
  <li>Cấu hình plugin được <strong>lưu lại</strong>, giữ qua các phiên.</li>
  <li>Phân vai: <strong>plugin</strong> = capability (commands, skills, tools); <strong>CLAUDE.md</strong> = natural language instruction; <strong>settings.json</strong> = permissions và option máy đọc được.</li>
</ul>

<h3>⚠️ Bẫy hay gặp</h3>
<ul>
  <li>"Thêm marketplace là cài luôn các plugin của nó" → <strong>sai</strong>, chỉ đăng ký catalog.</li>
  <li>"Phải thêm official marketplace thủ công" → <strong>sai</strong>, nó có sẵn.</li>
  <li>"Disable xóa file plugin" → <strong>sai</strong>, vẫn cài, bật lại ngay không tải lại.</li>
  <li>"Cài/bật plugin giữa phiên thì phải restart" → <strong>sai</strong>, dùng reload plugins.</li>
  <li>"Plugin chỉ thêm slash command" → <strong>sai</strong>, còn skills, hooks, MCP/LSP servers...</li>
</ul>

<h3>💻 Bài tập Java</h3>
<p><code>part2/lesson28/Lesson28.java</code>: mô phỏng plugin manager (marketplace add, install, enable/disable/uninstall, list có lọc), đọc <code>plugin.json</code> bằng Jackson, chọn plugin/CLAUDE.md/settings.json.
Chấm: <code>./mvnw -q compile exec:java -Dexec.args="p2-28"</code>.</p>
`,

  // answer = index of the correct option (options are shuffled on screen); an array means "Choose TWO".
  quiz: [
    { q: "A developer adds a community marketplace to Claude Code, but no new commands or skills appear. What is the MOST likely explanation?", options: ["The marketplace failed to load and must be re-added", "Adding a marketplace installs nothing; the plugin must be installed next", "Claude Code must be fully restarted before a new marketplace takes effect", "Community marketplaces only work at managed scope"], answer: 1, explain: "\"Adding the marketplace installs nothing on its own. It's just registering where plugins live.\" Installing the plugin is \"a distinct second step.\"" },
    { q: "Which file identifies a plugin and declares what it provides?", options: ["CLAUDE.md", "settings.json", "MEMORY.md", "plugin.json"], answer: 3, explain: "\"Inside that directory sits a manifest, the plugin.json file, and that's what identifies the plugin and declares what it provides.\"" },
    { q: "A team wants to use a plugin from the official marketplace. What is the FIRST step they need to take?", options: ["Install the plugin by name", "Add the official marketplace by URL", "Clone the marketplace repository locally", "Enable the managed scope for the project"], answer: 0, explain: "\"The official marketplace is already available out of the box. So you only add the community or custom ones yourself.\" They can go straight to installing." },
    { q: "Which TWO can a single plugin bundle? (Choose TWO.)", options: ["MCP servers", "A replacement model", "Hooks", "Extra context window tokens", "An API key for each user"], answer: [0, 2], explain: "A plugin can bring \"slash commands and skills\", \"sub-agents and hooks\", and \"MCP servers, LSP servers for language intelligence, and background monitors.\"" },
    { q: "Why is packaging capabilities as one plugin useful?", options: ["They each load in a separate session", "They bypass permission rules", "They install and update as a set", "They no longer need a plugin.json manifest"], answer: 2, explain: "\"Because everything lives in one package, it installs as a set and updates as a set. You're not chasing down five separate pieces.\"" },
    { q: "When installing a plugin by name, why is it scoped to the marketplace it came from?", options: ["To bill the marketplace owner", "So Claude Code knows exactly which plugin you mean", "To disable other marketplaces", "So the plugin can run without any permission prompts"], answer: 1, explain: "\"You install the plugin by name, scoped to the marketplace it came from. So Claude Code knows exactly which one you mean.\"" },
    { q: "Which sources can a marketplace be added from?", options: ["Only the official Anthropic catalog", "Only a private npm registry mirror", "Only a local zip file", "A repo, a URL, or a local path"], answer: 3, explain: "\"You add the marketplace. Pointing it at a repo, a URL, or even a local path, and that registers the catalog.\"" },
    { q: "A developer wants to pause a plugin for a week and turn it back on later without re-downloading. What should they do?", options: ["Disable the plugin", "Uninstall the plugin", "Remove its marketplace", "Delete its plugin.json"], answer: 0, explain: "\"The nice thing about disabling is that it keeps the plugin installed. So flipping it back on later is instant with no re-download.\"" },
    { q: "A developer is completely done with a capability and wants its files gone. Which command is MOST appropriate?", options: ["Disable", "List", "Uninstall", "Reload plugins"], answer: 2, explain: "\"When you're genuinely done with a capability, uninstall removes the plugin and its files completely.\"" },
    { q: "Which TWO statements about the list command are correct? (Choose TWO.)", options: ["It installs missing plugins automatically", "It shows every installed plugin", "It lists only plugins from the official marketplace", "It can filter to only enabled or only disabled plugins", "It removes plugins that failed to load"], answer: [1, 3], explain: "\"The list command is your inventory. It shows every plugin you have installed and whether each one is currently enabled or disabled. And you can filter.\"" },
    { q: "A developer runs the plugin command with no arguments. What happens?", options: ["It prints a usage error", "It opens an interactive manager", "It lists the official marketplace only", "It reinstalls all plugins from scratch"], answer: 1, explain: "\"If you run the plugin command on its own with no arguments, it opens an interactive manager. And it's organized into four tabs.\"" },
    { q: "A plugin silently stopped working. In the interactive manager, which tab should the developer check FIRST?", options: ["Discover", "Marketplaces", "Installed", "Errors"], answer: 3, explain: "The Errors tab \"surfaces any plugins that failed to load. So you have one place to go when something isn't working.\"" },
    { q: "Which of the following is NOT one of the four tabs of the interactive plugin manager?", options: ["Permissions", "Discover", "Installed", "Marketplaces"], answer: 0, explain: "The four tabs are Discover, Installed, Marketplaces, and Errors." },
    { q: "In the interactive manager, where do you browse plugins you could add from registered marketplaces?", options: ["Installed", "Errors", "Discover", "Marketplaces"], answer: 2, explain: "\"The first is Discover, where you browse plugins you could add from your registered marketplaces.\"" },
    { q: "A developer installs a new plugin mid-session and wants it active right away. What is the BEST approach?", options: ["Restart Claude Code", "Run reload plugins", "Start a new session", "Uninstall and reinstall it"], answer: 1, explain: "\"Whenever you enable, disable, or install something mid-session, Reload plugins applies the change immediately. So you don't have to restart.\"" },
    { q: "Which TWO actions mid-session are applied immediately by reload plugins? (Choose TWO.)", options: ["Changing the model", "Editing the system prompt", "Enabling a plugin", "Rotating the API key", "Installing a plugin"], answer: [2, 4], explain: "\"Whenever you enable, disable, or install something mid-session, Reload plugins applies the change immediately.\"" },
    { q: "What does choosing a scope at install time decide?", options: ["Which model the plugin uses", "How many tokens the plugin may use", "Which marketplace it comes from", "Who the plugin is for"], answer: 3, explain: "\"When you install a plugin, you choose a scope. And that decides who the plugin is for, whether it's just you or the whole project.\"" },
    { q: "A plugin accepts configuration values. What happens to those values between sessions?", options: ["They are stored and persist", "They reset every session", "They are written into CLAUDE.md", "They are kept only in the context window"], answer: 0, explain: "\"Some plugins accept configuration values that tune how they behave. And those get stored. So the settings stick from one session to the next.\"" },
    { q: "A team wants to add a new slash command and a review skill to their project. Where does this change belong?", options: ["In CLAUDE.md", "In settings.json", "In a plugin", "In MEMORY.md"], answer: 2, explain: "\"Plugins add new capabilities. The actual commands, skills, and tools you can invoke.\"" },
    { q: "A team wants Claude to follow a naming convention described in plain language. Where does this belong?", options: ["In a plugin manifest", "In CLAUDE.md", "In settings.json", "In the marketplace catalog"], answer: 1, explain: "CLAUDE.md \"gives natural language instructions that Claude reads as context, guidance rather than machinery.\"" },
    { q: "A team wants to control what Claude is allowed to do, such as permissions. Which file is the right home?", options: ["CLAUDE.md", "plugin.json", "A marketplace", "settings.json"], answer: 3, explain: "settings.json \"sets permissions and other machine-readable options, like what Claude is allowed to do.\"" },
    { q: "Which TWO pairings of file or mechanism and role are correct? (Choose TWO.)", options: ["Plugins: capability", "CLAUDE.md: permissions", "Plugins: natural language guidance", "settings.json: configuration", "settings.json: team coding style prose"], answer: [0, 3], explain: "\"Plugins for capability. Claude.md for instruction. And settings.json for configuration.\"" },
    { q: "Which statement about a marketplace is accurate?", options: ["It is a catalog that lists available plugins", "It is one large plugin that holds many commands", "It installs every plugin it lists when added", "It replaces the plugin.json manifest"], answer: 0, explain: "A marketplace is \"just a catalog that lists available plugins so you can browse and install from a source you trust.\"" },
    { q: "What does an LSP server bundled in a plugin provide?", options: ["Billing reports", "Session retention", "Language intelligence", "Context compaction"], answer: 2, explain: "A plugin can package \"MCP servers, LSP servers for language intelligence, and background monitors that watch for things.\"" },
    { q: "Which statement BEST describes what a plugin is?", options: ["A single slash command file", "A self-contained directory installed as one unit", "A single setting stored inside the project settings.json", "A section of CLAUDE.md"], answer: 1, explain: "A plugin is \"a self-contained directory that extends Claude Code with new capabilities, packaged so you install the whole thing as one unit.\"" },
    { q: "A developer wants to see which marketplaces they have registered so far. Which tab of the interactive manager fits?", options: ["Discover", "Errors", "Installed", "Marketplaces"], answer: 3, explain: "\"The third is Marketplaces, listing the catalogs you've registered so far.\"" },
    { q: "How does a developer hand-wire the capabilities of a plugin into Claude Code?", options: ["They do not; the manifest tells Claude Code what is inside", "They edit settings.json for each command", "They copy each skill into CLAUDE.md", "They register each hook and skill in the marketplace by hand"], answer: 0, explain: "\"You don't handwire anything. The manifest tells Claude Code what's in the package.\"" },
    { q: "Which TWO statements about disabling versus uninstalling are correct? (Choose TWO.)", options: ["Disabling removes the plugin files", "Disabling keeps the plugin installed", "Uninstalling keeps files for a quick restore", "Both require a full restart of Claude Code", "Uninstalling removes the plugin and its files"], answer: [1, 4], explain: "\"Disable to pause and uninstall to remove for good.\" Disabling keeps it installed; uninstall \"removes the plugin and its files completely.\"" },
    { q: "In the interactive manager, which tab shows plugins you already have and the state each one is in?", options: ["Discover", "Errors", "Installed", "Marketplaces"], answer: 2, explain: "\"The second is Installed, which shows what you already have and the state each one is in.\"" },
    { q: "Which statement BEST summarizes the lesson?", options: ["Adding a marketplace is enough to get every new tool it lists", "Adding a catalog and installing a plugin are separate steps", "Plugins replace CLAUDE.md and settings.json", "Plugins must be restarted after any change"], answer: 1, explain: "\"Registering a marketplace and installing a plugin are separate steps, and adding a catalog installs nothing by itself.\"" }
  ]
};
