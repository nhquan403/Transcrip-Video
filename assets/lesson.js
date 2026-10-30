// Renders lesson.html?part=N&id=XXX from lessons/registry.js and lessons/<folder>/content.js.
// Links without `part` (from before the course had parts) open Part 1.
(function () {
  const params = new URLSearchParams(location.search);
  const partId = Number(params.get('part')) || 1;
  const id = params.get('id');
  const lesson = window.LESSONS.find(l => l.part === partId && l.id === id) || window.LESSONS[0];
  const part = window.PARTS.find(p => p.id === lesson.part);
  const base = `lessons/${lesson.folder}/`;

  document.title = `${part.title} · Bài ${lesson.id}: ${lesson.title}`;
  document.getElementById('lessonNo').textContent = `${part.title}: ${part.name} · Bài ${lesson.id}`;
  document.getElementById('back').href = `index.html#part-${part.id}`;
  renderPager(document.getElementById('pager'));
  document.getElementById('title').textContent = lesson.title;
  document.getElementById('titleVi').textContent = lesson.titleVi;

  mountPlayer(document.getElementById('player'), { subUrl: base + 'transcript.en.srt' });

  // content.js is loaded as a script so it also works when opened from file://.
  const script = document.createElement('script');
  script.src = base + 'content.js';
  script.onload = () => {
    const content = window.LESSON_CONTENT;
    document.getElementById('explanation').innerHTML = content.explanation;
    if (content.quiz.length) {
      renderQuiz(document.getElementById('quizRoot'), content.quiz, window.quizKey(lesson));
    } else {
      document.querySelectorAll('#quiz, #quizRoot, a[href="#quiz"]').forEach(el => { el.hidden = true; });
    }
  };
  script.onerror = () => {
    document.getElementById('explanation').innerHTML =
      '<p class="key">Phần giải thích và trắc nghiệm của bài này đang được soạn. Bạn vẫn xem được video kèm transcript ở trên.</p>';
    document.querySelectorAll('#quiz, #quizRoot, a[href="#quiz"]').forEach(el => { el.hidden = true; });
  };
  document.body.appendChild(script);

  function renderPager(nav) {
    const siblings = window.LESSONS.filter(l => l.part === lesson.part);
    const i = siblings.indexOf(lesson);
    for (const [other, label] of [[siblings[i - 1], '← Bài trước'], [siblings[i + 1], 'Bài sau →']]) {
      if (!other) { nav.append(document.createElement('span')); continue; }
      const a = document.createElement('a');
      a.className = 'card';
      a.href = window.lessonUrl(other);
      a.innerHTML = '<div class="muted"></div><strong></strong>';
      a.querySelector('.muted').textContent = `${label} · Bài ${other.id}`;
      a.querySelector('strong').textContent = other.titleVi;
      nav.append(a);
    }
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function load(key) {
    try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
  }

  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }

  // A short fingerprint of the questions, so progress saved for an older version of a quiz is ignored.
  function quizVersion(quiz) {
    let h = 0;
    for (const ch of quiz.map(q => q.q + q.options.join('|')).join('\n')) h = (h * 31 + ch.charCodeAt(0)) | 0;
    return h.toString(36);
  }

  // Answers are stored by the option's original index, so the shuffled display order
  // can change between visits without breaking saved progress.
  // A multiple-response question ("Choose TWO") has an array `answer`; its saved answer is a sorted index array.
  function isCorrect(q, picked) {
    if (!Array.isArray(q.answer)) return q.answer === picked;
    return Array.isArray(picked) && picked.length === q.answer.length && q.answer.every(i => picked.includes(i));
  }

  function renderQuiz(root, quiz, key) {
    const version = quizVersion(quiz);
    const saved = load(key);
    let answers = saved.version === version ? saved.answers || {} : {};

    root.innerHTML = `
      <div class="card score">
        <span data-role="score"></span>
        <button data-role="retry">Làm lại từ đầu</button>
      </div>
      <div data-role="questions"></div>`;
    const scoreEl = root.querySelector('[data-role="score"]');
    const list = root.querySelector('[data-role="questions"]');

    function updateScore() {
      const done = Object.keys(answers).length;
      const correct = Object.entries(answers).filter(([i, a]) => isCorrect(quiz[i], a)).length;
      scoreEl.textContent = `Đã làm ${done}/${quiz.length} · Đúng ${correct}/${done || 0}`
        + (done === quiz.length ? ` · Kết quả: ${Math.round(correct / quiz.length * 100)}%` : '');
      save(key, { version, answers, correct, total: quiz.length });
    }

    function renderQuestion(q, qi) {
      const box = document.createElement('div');
      box.className = 'card question';
      const title = document.createElement('div');
      title.className = 'q';
      title.textContent = `Câu ${qi + 1}. ${q.q}`;
      const why = document.createElement('div');
      why.className = 'why';
      why.hidden = true;
      why.textContent = '💡 ' + q.explain;
      box.append(title);

      const multi = Array.isArray(q.answer);
      const chosen = new Set();
      const submit = document.createElement('button');
      submit.className = 'submit';
      submit.textContent = multi ? `Trả lời (chọn đủ ${q.answer.length} đáp án)` : '';
      submit.disabled = true;
      submit.hidden = !multi;
      submit.addEventListener('click', () => { answers[qi] = [...chosen].sort((x, y) => x - y); reveal(); updateScore(); });

      const buttons = shuffle(q.options.map((text, oi) => ({ text, oi }))).map(({ text, oi }) => {
        const b = document.createElement('button');
        b.className = 'opt';
        b.textContent = text;
        b.dataset.oi = oi;
        b.addEventListener('click', () => {
          if (!multi) { answers[qi] = oi; reveal(); updateScore(); return; }
          if (chosen.has(oi)) chosen.delete(oi);
          else if (chosen.size < q.answer.length) chosen.add(oi);
          b.classList.toggle('chosen', chosen.has(oi));
          submit.disabled = chosen.size !== q.answer.length;
        });
        box.append(b);
        return b;
      });
      box.append(submit, why);

      function reveal() {
        const picked = answers[qi];
        if (picked === undefined) return;
        const right = multi ? q.answer : [q.answer];
        const pickedList = Array.isArray(picked) ? picked : [picked];
        for (const b of buttons) {
          const oi = +b.dataset.oi;
          b.disabled = true;
          b.classList.remove('chosen');
          if (right.includes(oi)) b.classList.add('right');
          else if (pickedList.includes(oi)) b.classList.add('wrong');
        }
        submit.hidden = true;
        why.hidden = false;
      }
      reveal();
      return box;
    }

    function renderAll() {
      list.replaceChildren(...quiz.map(renderQuestion));
      updateScore();
    }

    root.querySelector('[data-role="retry"]').addEventListener('click', () => {
      answers = {};
      renderAll();
    });
    renderAll();
  }
})();
