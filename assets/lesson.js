// Renders lesson.html?id=XXX from lessons/registry.js and lessons/<folder>/content.js.
(function () {
  const id = new URLSearchParams(location.search).get('id');
  const lesson = window.LESSONS.find(l => l.id === id) || window.LESSONS[0];
  const base = `lessons/${lesson.folder}/`;

  document.title = `Bài ${lesson.id}: ${lesson.title}`;
  document.getElementById('lessonNo').textContent = `Bài ${lesson.id}`;
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
      renderQuiz(document.getElementById('quizRoot'), content.quiz, 'quiz:' + lesson.id);
    } else {
      document.querySelectorAll('#quiz, #quizRoot, a[href="#quiz"]').forEach(el => { el.hidden = true; });
    }
  };
  document.body.appendChild(script);

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

  // Answers are stored by the option's original index, so the shuffled display order
  // can change between visits without breaking saved progress.
  function renderQuiz(root, quiz, key) {
    let answers = load(key).answers || {};

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
      const correct = Object.entries(answers).filter(([i, a]) => quiz[i].answer === a).length;
      scoreEl.textContent = `Đã làm ${done}/${quiz.length} · Đúng ${correct}/${done || 0}`
        + (done === quiz.length ? ` · Kết quả: ${Math.round(correct / quiz.length * 100)}%` : '');
      save(key, { answers, correct, total: quiz.length });
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

      const buttons = shuffle(q.options.map((text, oi) => ({ text, oi }))).map(({ text, oi }) => {
        const b = document.createElement('button');
        b.className = 'opt';
        b.textContent = text;
        b.dataset.oi = oi;
        b.addEventListener('click', () => { answers[qi] = oi; reveal(); updateScore(); });
        box.append(b);
        return b;
      });
      box.append(why);

      function reveal() {
        const picked = answers[qi];
        if (picked === undefined) return;
        for (const b of buttons) {
          const oi = +b.dataset.oi;
          b.disabled = true;
          if (oi === q.answer) b.classList.add('right');
          else if (oi === picked) b.classList.add('wrong');
        }
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
