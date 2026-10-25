// Video player with SRT/VTT subtitle import. Files stay on the viewer's machine.
// Usage: mountPlayer(element, { subUrl: 'path/to/default.srt' })
(function () {
  // Try UTF-8 first; old Vietnamese SRT files are often Windows-1258.
  function decode(buf) {
    try {
      return new TextDecoder('utf-8', { fatal: true }).decode(buf);
    } catch {
      return new TextDecoder('windows-1258').decode(buf);
    }
  }

  function parseTime(s) {
    const m = s.trim().match(/(?:(\d+):)?(\d{1,2}):(\d{1,2})[,.](\d{1,3})/);
    if (!m) return null;
    return (+(m[1] || 0)) * 3600 + (+m[2]) * 60 + (+m[3]) + (+m[4].padEnd(3, '0')) / 1000;
  }

  // Parses both SRT and VTT cue blocks.
  function parseSubs(text) {
    const blocks = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n').split(/\n{2,}/);
    const out = [];
    for (const block of blocks) {
      const lines = block.split('\n');
      const i = lines.findIndex(l => l.includes('-->'));
      if (i < 0) continue;
      const [a, b] = lines[i].split('-->');
      const start = parseTime(a), end = parseTime(b);
      if (start == null || end == null) continue;
      const body = lines.slice(i + 1).join('\n')
        .replace(/\{\\[^}]*\}/g, '')          // ASS override tags like {\an8}
        .replace(/<\/?font[^>]*>/gi, '')       // <font> is not valid in VTT
        .trim();
      if (body) out.push({ start, end, text: body });
    }
    return out;
  }

  function fmt(t, withMs = true) {
    t = Math.max(0, t);
    const h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), s = Math.floor(t % 60);
    const p = (n, w = 2) => String(n).padStart(w, '0');
    if (!withMs) return (h ? p(h) + ':' : '') + p(m) + ':' + p(s);
    const ms = Math.min(999, Math.round((t - Math.floor(t)) * 1000));
    return `${p(h)}:${p(m)}:${p(s)}.${p(ms, 3)}`;
  }

  const TEMPLATE = `
    <div class="drop">
      Kéo thả file video và file .srt vào đây, hoặc chọn file:
      <div class="pickers">
        <label class="btn">🎬 Chọn video <input type="file" data-role="video" accept="video/*,.mkv"></label>
        <label class="btn">💬 Import phụ đề (.srt) <input type="file" data-role="sub" accept=".srt,.vtt"></label>
      </div>
    </div>
    <div class="status"></div>
    <video controls playsinline></video>
    <div class="controls">
      <label><input type="checkbox" data-role="show" checked> Hiện phụ đề</label>
      <span>
        Lệch sub:
        <button data-shift="-0.5">−0.5s</button>
        <output>0.0s</output>
        <button data-shift="0.5">+0.5s</button>
        <button data-role="reset">Đặt lại</button>
      </span>
      <label>Cỡ chữ <input type="range" data-role="size" min="14" max="60" value="28"></label>
    </div>
    <div class="transcript card" hidden></div>
    <p class="muted" style="font-size:13px">Phím tắt: <b>G</b> / <b>H</b> = sub sớm hơn / trễ hơn 0.1s. Bấm vào một dòng transcript để tua tới đó.</p>`;

  function mountPlayer(root, opts = {}) {
    root.innerHTML = TEMPLATE;
    const $ = sel => root.querySelector(sel);
    const video = $('video'), statusEl = $('.status'), offsetOut = $('output');
    const showSub = $('[data-role="show"]'), transcript = $('.transcript');

    let cues = [], offset = 0, videoUrl = null, trackUrl = null;
    let videoName = '', subName = '', activeIndex = -1;

    function setStatus() {
      statusEl.textContent = [
        videoName ? `Video: ${videoName}` : 'Chưa có video',
        subName ? `Phụ đề: ${subName} (${cues.length} dòng)` : 'Chưa có phụ đề',
      ].join(' · ');
    }

    function toVtt() {
      return 'WEBVTT\n\n' + cues.map(c =>
        `${fmt(c.start + offset)} --> ${fmt(c.end + offset)}\n${c.text.replace(/-->/g, '→')}`
      ).join('\n\n') + '\n';
    }

    // A <track> element keeps subtitles visible in native fullscreen.
    // It is rebuilt whenever the offset changes.
    function rebuildTrack() {
      video.querySelectorAll('track').forEach(t => t.remove());
      if (trackUrl) URL.revokeObjectURL(trackUrl);
      trackUrl = null;
      if (!cues.length) return;
      trackUrl = URL.createObjectURL(new Blob([toVtt()], { type: 'text/vtt' }));
      const track = document.createElement('track');
      Object.assign(track, { kind: 'subtitles', label: 'Subtitles', src: trackUrl, default: true });
      video.appendChild(track);
      track.addEventListener('load', applyVisibility);
      applyVisibility();
    }

    function applyVisibility() {
      for (const t of video.textTracks) t.mode = showSub.checked ? 'showing' : 'hidden';
    }

    function renderTranscript() {
      transcript.hidden = !cues.length;
      transcript.replaceChildren(...cues.map((c, i) => {
        const p = document.createElement('p');
        const time = document.createElement('time');
        time.textContent = fmt(c.start, false);
        p.append(time, c.text.replace(/<[^>]+>/g, '').replace(/\n/g, ' '));
        p.addEventListener('click', () => { video.currentTime = c.start + offset + 0.01; });
        p.dataset.i = i;
        return p;
      }));
      activeIndex = -1;
    }

    function highlight() {
      const t = video.currentTime - offset;
      const i = cues.findIndex(c => t >= c.start && t < c.end);
      if (i === activeIndex) return;
      transcript.querySelector('p.active')?.classList.remove('active');
      activeIndex = i;
      if (i < 0) return;
      const p = transcript.children[i];
      p.classList.add('active');
      // Scroll only the transcript box, never the page.
      transcript.scrollTop = p.offsetTop - transcript.offsetTop - transcript.clientHeight / 3;
    }

    function setSubs(text, name) {
      cues = parseSubs(text);
      subName = name;
      rebuildTrack();
      renderTranscript();
      setStatus();
    }

    function setOffset(v) {
      offset = Math.round(v * 10) / 10;
      offsetOut.textContent = (offset > 0 ? '+' : '') + offset.toFixed(1) + 's';
      rebuildTrack();
    }

    async function loadFiles(files) {
      for (const file of files) {
        const name = file.name.toLowerCase();
        if (name.endsWith('.srt') || name.endsWith('.vtt')) {
          setSubs(decode(await file.arrayBuffer()), file.name);
        } else if (file.type.startsWith('video/') || /\.(mp4|m4v|webm|mkv|mov)$/.test(name)) {
          if (videoUrl) URL.revokeObjectURL(videoUrl);
          videoUrl = URL.createObjectURL(file);
          video.src = videoUrl;
          videoName = file.name;
          rebuildTrack();
        }
      }
      setStatus();
    }

    root.querySelectorAll('input[type="file"]').forEach(inp =>
      inp.addEventListener('change', e => loadFiles(e.target.files)));

    const drop = $('.drop');
    root.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('over'); });
    root.addEventListener('dragleave', () => drop.classList.remove('over'));
    root.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('over'); loadFiles(e.dataTransfer.files); });

    showSub.addEventListener('change', applyVisibility);
    root.querySelectorAll('[data-shift]').forEach(b =>
      b.addEventListener('click', () => setOffset(offset + parseFloat(b.dataset.shift))));
    $('[data-role="reset"]').addEventListener('click', () => setOffset(0));
    $('[data-role="size"]').addEventListener('input', e =>
      document.documentElement.style.setProperty('--sub-size', e.target.value + 'px'));
    video.addEventListener('timeupdate', highlight);

    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'g' || e.key === 'G') setOffset(offset - 0.1);
      if (e.key === 'h' || e.key === 'H') setOffset(offset + 0.1);
    });

    setStatus();

    // Preload the lesson's transcript. fetch() fails on file:// pages; import still works there.
    if (opts.subUrl) {
      fetch(opts.subUrl)
        .then(r => (r.ok ? r.arrayBuffer() : Promise.reject(r.status)))
        .then(buf => { if (!subName) setSubs(decode(buf), opts.subUrl.split('/').pop()); })
        .catch(() => {});
    }
  }

  window.mountPlayer = mountPlayer;
})();
