/* AI and Your Teaching: workbook behavior.
   Everything stays in this browser. Nothing is sent anywhere. */
(function () {
  'use strict';

  /* ---- Edition: change these two lines when you publish an update ---- */
  var VERSION = 'Fall 2026';
  var LAST_UPDATED = 'November 8, 2026';
  Array.prototype.forEach.call(document.querySelectorAll('[data-version]'), function (el) { el.textContent = VERSION; });
  Array.prototype.forEach.call(document.querySelectorAll('[data-updated]'), function (el) { el.textContent = LAST_UPDATED; });

  /* ---- Which parts are open. Set a part to true to hide it from the contents
     panel and the cover until it opens. Add ?preview=1 to any page address to
     see locked parts in this browser anyway (?preview=0 turns that off). ---- */
  var LOCKED = { part2: false, part3: false };
  try {
    var pv = /[?&]preview=([01])/.exec(location.search);
    if (pv) localStorage.setItem('avte-wb:preview', pv[1]);
  } catch (e) {}
  function previewing() { try { return localStorage.getItem('avte-wb:preview') === '1'; } catch (e) { return false; } }
  function isLocked(lock) { return !!(lock && LOCKED[lock] && !previewing()); }

  /* ---- Table of contents (edit this list as chapters go live) ---- */
  var TOC = [
    { part: 'Start here' },
    { href: 'index.html', title: 'Cover and how this works' },
    { part: 'Part 1 · Before we meet' },
    { n: 1, track: true, href: 'chapters/01-what-ai-can-and-cant-do.html', title: 'What AI tools can and can’t do' },
    { n: 2, track: true, href: 'chapters/02-try-it-for-you.html', title: 'Try it on something just for you' },
    { n: 3, track: true, href: 'chapters/03-let-ai-take-your-test.html', title: 'Let AI take one of your tests' },
    { sub: true, href: 'resources/sample-assignment.html', title: 'Ready-made case assignment' },
    { n: 4, track: true, href: 'chapters/04-a-quick-look-at-tilt.html', title: 'A quick look at TILT' },
    { part: 'Part 2 · When we meet' },
    { n: 5, track: true, href: 'chapters/05-clinical-eye-and-teaching-eye.html', lock: 'part2', title: 'Your clinical eye and your teaching eye', when: 'Dec 1' },
    { n: 6, track: true, href: 'chapters/06-make-your-assignment-stronger.html', lock: 'part2', title: 'Make your assignment stronger', when: 'Dec 1' },
    { n: 7, track: true, href: 'chapters/07-tell-your-students-where-ai-fits.html', lock: 'part2', title: 'Tell your students where AI fits', when: 'Dec 1' },
    { href: 'chapters/week7-takeaway.html', lock: 'part2', title: 'Your Week 7 takeaway', when: 'Dec 1', track: true },
    { part: 'Part 3 · Back in your course' },
    { n: 8, track: true, href: 'chapters/08-theres-a-name-for-this.html', lock: 'part3', title: 'There’s a name for this', when: 'Soon' },
    { n: 9, track: true, href: 'chapters/09-label-the-assignments-that-count.html', lock: 'part3', title: 'Label the assignments that count', when: 'Soon' },
    { n: 10, track: true, href: 'chapters/10-help-your-students-use-ai-well.html', lock: 'part3', title: 'Help your students use AI well', when: 'Soon' },
    { n: 11, track: true, href: 'chapters/11-talk-with-your-students-about-ai.html', lock: 'part3', title: 'Talk with your students about AI', when: 'Soon' },
    { n: 12, track: true, href: 'chapters/12-try-these-with-your-group-or-class.html', lock: 'part3', title: 'Try these with your mentor group or class', when: 'Soon' },
    { part: 'Appendix' },
    { href: 'resources/label-maker.html', title: 'Assignment label maker' },
    { href: 'resources/keep-learning.html', title: 'Keep learning' },
    { href: 'index.html#download', title: 'Download as PDF or EPUB' }
  ];

  var root = document.documentElement.getAttribute('data-root') || '';
  var here = location.pathname.replace(/\/$/, '/index.html');
  var tocNav = document.getElementById('toc');

  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

  /* ---- Progress: opened and done, kept in this browser ---- */
  var CHECK = '<svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" width="12" height="12"><path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function getStatus(href) { try { return localStorage.getItem('avte-wb:status:' + href) || ''; } catch (e) { return ''; } }
  function setStatus(href, v) { try { if (v) localStorage.setItem('avte-wb:status:' + href, v); else localStorage.removeItem('avte-wb:status:' + href); } catch (e) {} }
  var STATUS_TEXT = { '': 'not started', started: 'opened', done: 'done' };

  var currentItem = null;
  TOC.forEach(function (item) {
    if (item.href && here.slice(-item.href.length) === item.href) currentItem = item;
  });
  if (currentItem && currentItem.track && getStatus(currentItem.href) !== 'done') setStatus(currentItem.href, 'started');

  function renderToc() {
    if (!tocNav) return;
    var tracked = TOC.filter(function (i) { return i.track && i.href && !isLocked(i.lock); });
    var done = tracked.filter(function (i) { return getStatus(i.href) === 'done'; }).length;
    var pct = tracked.length ? Math.round(done / tracked.length * 100) : 0;
    var html = '<div class="progress"><span class="progress-label">Your progress</span>' +
      '<span class="progress-count">' + done + ' of ' + tracked.length + ' done</span>' +
      '<span class="progress-bar" aria-hidden="true"><i style="width:' + pct + '%"></i></span></div><ol>';
    TOC.forEach(function (item) {
      if (item.part) { html += '<li class="toc-part">' + esc(item.part) + '</li>'; return; }
      if (!item.href || isLocked(item.lock)) {
        html += '<li><span class="toc-soon"><span class="n">' + (item.n || '') + '</span><span>' + esc(item.title) + '</span>' +
          (item.when ? '<span class="when">' + esc(item.when) + '</span>' : '') + '</span></li>';
        return;
      }
      var st = item.track ? getStatus(item.href) : null;
      var num;
      if (st === null) num = '<span class="n">' + (item.n || '') + '</span>';
      else num = '<span class="n status' + (st ? ' ' + st : '') + '">' + (st === 'done' ? CHECK : (item.n || '&bull;')) + '</span>';
      var sr = st === null ? '' : '<span class="visually-hidden"> (' + STATUS_TEXT[st] + ')</span>';
      var current = item === currentItem;
      html += '<li' + (item.sub ? ' class="sub"' : '') + '><a href="' + root + item.href + '"' +
        (current ? ' aria-current="page"' : '') + '>' + (item.sub ? '' : num) + '<span>' + esc(item.title) + sr + '</span></a></li>';
    });
    tocNav.innerHTML = html + '</ol>';
  }
  renderToc();

  // Locked parts look like "coming soon" on the cover
  Array.prototype.forEach.call(document.querySelectorAll('.chapter[data-lock]'), function (li) {
    if (!isLocked(li.getAttribute('data-lock'))) return;
    li.classList.add('pending');
    var link = li.querySelector('h3 a');
    if (link) link.parentNode.textContent = link.textContent;
  });

  // Same marks on the cover's contents cards
  function renderCover() {
    Array.prototype.forEach.call(document.querySelectorAll('.chapter h3 a[href]'), function (a) {
      var href = a.getAttribute('href');
      var cn = a.closest('.chapter').querySelector('.cnum');
      if (!cn || !/^chapters\//.test(href)) return;
      if (!cn.hasAttribute('data-n')) cn.setAttribute('data-n', cn.textContent);
      var st = getStatus(href);
      cn.classList.toggle('started', st === 'started');
      cn.classList.toggle('done', st === 'done');
      cn.innerHTML = st === 'done' ? CHECK : esc(cn.getAttribute('data-n'));
      var old = a.querySelector('.visually-hidden'); if (old) old.remove();
      if (st) a.insertAdjacentHTML('beforeend', '<span class="visually-hidden"> (' + STATUS_TEXT[st] + ')</span>');
    });
  }
  renderCover();

  // "Mark this chapter done" at the bottom of each tracked chapter
  var toolsRow = document.querySelector('.page-tools .btn-row');
  if (currentItem && currentItem.track && toolsRow) {
    var doneBtn = document.createElement('button');
    doneBtn.type = 'button';
    doneBtn.className = 'btn done-btn';
    var paint = function () {
      var isDone = getStatus(currentItem.href) === 'done';
      doneBtn.setAttribute('aria-pressed', isDone ? 'true' : 'false');
      doneBtn.innerHTML = isDone ? CHECK + ' Done' : 'Mark this chapter done';
      doneBtn.title = isDone ? 'Select to mark this chapter not done' : '';
    };
    doneBtn.addEventListener('click', function () {
      var isDone = getStatus(currentItem.href) === 'done';
      setStatus(currentItem.href, isDone ? 'started' : 'done');
      paint(); renderToc();
    });
    paint();
    toolsRow.insertBefore(doneBtn, toolsRow.firstChild);
  }

  /* ---- Home button, upper right on every page except the cover ---- */
  if (!document.body.classList.contains('home-page')) {
    var home = document.createElement('a');
    home.className = 'home-corner';
    home.href = root + 'index.html';
    home.setAttribute('aria-label', 'Workbook home');
    home.title = 'Workbook home';
    home.innerHTML = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1z" fill="currentColor"/></svg><span>Home</span>';
    var skip = document.querySelector('.skip-link');
    if (skip && skip.nextSibling) document.body.insertBefore(home, skip.nextSibling);
    else document.body.insertBefore(home, document.body.firstChild);
    // On phones, the house sits to the left of the Contents button instead
    var bar = document.querySelector('.mobilebar');
    if (bar) {
      var mhome = home.cloneNode(true);
      mhome.className = 'home-mobile';
      bar.insertBefore(mhome, bar.firstChild);
    }
  }

  /* ---- Contents drawer on phones ---- */
  var sidebar = document.getElementById('sidebar');
  var toggle = document.querySelector('.toc-toggle');
  var scrim = document.querySelector('.scrim');
  function setOpen(open) {
    if (!sidebar || !toggle) return;
    sidebar.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (scrim) scrim.hidden = !open;
    if (open) { var first = sidebar.querySelector('a'); if (first) first.focus(); }
    else toggle.focus();
  }
  if (toggle) toggle.addEventListener('click', function () { setOpen(!sidebar.classList.contains('open')); });
  if (scrim) scrim.addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) setOpen(false);
  });

  var PREFIX = 'avte-wb:' + location.pathname.replace(/index\.html$/, '') + ':';

  function store(key, value) {
    try {
      if (value === null) localStorage.removeItem(PREFIX + key);
      else localStorage.setItem(PREFIX + key, value);
      return true;
    } catch (e) { return false; }
  }
  function load(key) {
    try { return localStorage.getItem(PREFIX + key); } catch (e) { return null; }
  }

  /* ---- Answers saved on another chapter page (same browser) ---- */
  function loadFrom(stem, key) {
    var hit = null;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k.indexOf('avte-wb:') !== 0) continue;
        if (k.indexOf('/' + stem) === -1) continue;
        if (k.slice(-(key.length + 1)) !== ':' + key) continue;
        hit = localStorage.getItem(k);
      }
    } catch (e) {}
    return hit;
  }
  var LABELS = {
    passed: 'Passed', partly: 'Partly', failed: 'Failed',
    purpose: 'Why it matters (Purpose)', task: 'What to do (Task)', criteria: 'What good looks like (Criteria)',
    'no-ai': 'No AI', supported: 'AI-supported', integrated: 'AI-integrated'
  };
  function fromSpec(spec) {
    // "stem:key" or "stem:key|stem:key" (first one with an answer wins)
    var parts = spec.split('|');
    for (var i = 0; i < parts.length; i++) {
      var bits = parts[i].split(':');
      var v = loadFrom(bits[0], bits[1]);
      if (v && v.trim()) return LABELS[v] || v.trim();
    }
    return '';
  }
  function fillPulled() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-from]'), function (el) {
      var v = fromSpec(el.getAttribute('data-from'));
      el.textContent = v || el.getAttribute('data-empty') || 'Not filled in yet.';
      el.classList.toggle('empty', !v);
    });
  }
  fillPulled();
  window.addEventListener('pageshow', fillPulled);

  var fields = Array.prototype.slice.call(document.querySelectorAll('[data-save]'));

  /* ---- Print copies: textareas don't print well, so mirror them ---- */
  function mirror(el) {
    if (el.tagName !== 'TEXTAREA') return;
    var copy = el.nextElementSibling;
    if (!copy || !copy.classList.contains('print-copy')) {
      copy = document.createElement('div');
      copy.className = 'print-copy';
      copy.setAttribute('aria-hidden', 'true');
      el.parentNode.insertBefore(copy, el.nextSibling);
    }
    copy.textContent = el.value;
  }

  /* ---- Restore and autosave ---- */
  fields.forEach(function (el) {
    var key = el.getAttribute('data-save');
    var saved = load(key);
    if (el.type === 'checkbox') {
      if (saved !== null) el.checked = saved === '1';
    } else if (el.type === 'radio') {
      if (saved !== null) el.checked = saved === el.value;
    } else if (saved !== null) {
      el.value = saved;
    } else if (el.getAttribute('data-prefill')) {
      el.value = fromSpec(el.getAttribute('data-prefill'));
    }
    mirror(el);
    var evt = (el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'radio') ? 'change' : 'input';
    el.addEventListener(evt, function () {
      var v = el.type === 'checkbox' ? (el.checked ? '1' : '0') : el.value;
      if (el.type === 'radio' && !el.checked) return;
      store(key, v);
      mirror(el);
    });
  });
  window.addEventListener('beforeprint', function () { fields.forEach(mirror); });

  /* ---- Status messages ---- */
  function say(near, text) {
    var box = near && near.closest('.btn-row') && near.closest('.btn-row').querySelector('.status');
    if (!box) return;
    box.textContent = text;
    clearTimeout(box._t);
    box._t = setTimeout(function () { box.textContent = ''; }, 5000);
  }

  /* ---- Copy with fallbacks ---- */
  function copyText(text, button, msg) {
    msg = msg || 'Copied. Paste it into your AI tool.';
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      say(button, ok ? msg : 'Copy didn’t work here. Select the text above and copy it yourself.');
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        say(button, msg);
      }, fallback);
    } else { fallback(); }
  }

  /* ---- Prompt builders ---- */
  function val(scope, name) {
    var el = scope.querySelector('[name="' + name + '"]:checked') || scope.querySelector('[name="' + name + '"]');
    return el ? el.value.trim() : '';
  }

  var builders = {
    personal: function (b) {
      var topic = val(b, 'p-topic');
      var details = val(b, 'p-details');
      var shape = val(b, 'p-shape');
      var lines = [];
      lines.push('I’d like some help ' + (topic || 'with something in my life') + '.');
      if (details) lines.push('Here’s what you should know: ' + details);
      lines.push('Please give me ' + (shape || 'a short, practical answer') + '.');
      lines.push('If you need more information first, ask me one or two questions before you start.');
      return lines.join('\n\n');
    },
    student: function (b) {
      var level = val(b, 's-level') || 'first-year';
      var kind = val(b, 's-kind') || 'assignment';
      var way = val(b, 's-way');
      var ask = way === 'blend'
        ? 'Please complete it the way a ' + level + ' student would write it, in a natural student voice, so it doesn’t sound like AI wrote it.'
        : 'Please complete it.';
      return 'I’m a ' + level + ' veterinary technology student. Here is my ' + kind + ' from class. ' + ask +
        '\n\n[Paste the questions or instructions here. Leave out the answer key.]';
    },
    retest: function (b) {
      var level = fromSpec('03-let-ai-take-your-test:s-level') || 'first-year';
      var kind = fromSpec('03-let-ai-take-your-test:s-kind') || 'quiz';
      var way = val(b, 'r-way');
      var ask = way === 'blend'
        ? 'Please complete it the way a ' + level + ' student would write it, in a natural student voice, so it doesn’t sound like AI wrote it.'
        : 'Please complete it.';
      return 'I’m a ' + level + ' veterinary technology student. Here is my ' + kind + ' from class. ' + ask +
        '\n\n[Paste the new version here. Leave out the answer key.]';
    },
    expectation: function (b) {
      var opener = {
        'no-ai': 'In this course, please do your work without AI unless an assignment says otherwise.',
        supported: 'In this course, you may use AI to support your work unless an assignment says otherwise. The thinking and the final work need to be your own.',
        depends: 'Each assignment in this course will tell you whether you can use AI, and how.'
      }[val(b, 'e-default')] || '';
      var welcome = val(b, 'e-welcome'), not = val(b, 'e-not'), tell = val(b, 'e-tell'),
          never = val(b, 'e-never'), why = val(b, 'e-why');
      var lines = [opener];
      if (welcome) lines.push('You’re welcome to use AI for ' + welcome.replace(/\.$/, '') + '.');
      if (not) lines.push('Please don’t use AI for ' + not.replace(/\.$/, '') + '.');
      if (tell) lines.push('When you use AI, ' + tell.replace(/\.$/, '') + '.');
      if (never) lines.push('Never put ' + never.replace(/\.$/, '') + ' into an AI tool.');
      if (why) lines.push(why);
      var text = lines.filter(Boolean).join(' ');
      store('e-draft', text);
      return text || 'Fill in the boxes above and your draft will appear here.';
    },
    clarity: function () {
      var t = (document.getElementById('e-final') || {}).value || load('e-draft') || '[Paste your AI-use expectation here.]';
      return 'Here is an AI-use expectation I wrote for my veterinary technology students. Read it the way a first-year student would. ' +
        'Point out anything that’s unclear or could be read two ways, and tell me what questions a student might still have. ' +
        'Please don’t rewrite it. I want to keep my own wording.\n\n' + t.trim();
    }
  };

  Array.prototype.forEach.call(document.querySelectorAll('.builder[data-builder]'), function (b) {
    var make = builders[b.getAttribute('data-builder')];
    var out = b.querySelector('.prompt-out');
    if (!make || !out) return;
    function update() { out.textContent = make(b); }
    b.addEventListener('input', update);
    b.addEventListener('change', update);
    update();
    var copyBtn = b.querySelector('[data-action="copy-prompt"]');
    if (copyBtn) copyBtn.addEventListener('click', function () { copyText(out.textContent, copyBtn, copyBtn.getAttribute('data-msg')); });
    if (b.getAttribute('data-builder') === 'clarity') {
      var fin = document.getElementById('e-final');
      if (fin) fin.addEventListener('input', update);
    }
  });

  /* ---- Chapter 10: student handout preview ---- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-handout]'), function (form) {
    var out = document.querySelector(form.getAttribute('data-handout'));
    if (!out) return;
    function v(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
    function update() {
      var course = v('h-course');
      var html = '<p class="handout-kicker">' + esc(course || 'Your course') + '</p>' +
        '<h2>Using AI in this course</h2>';
      var exp = v('h-expect');
      if (exp) html += '<h3>What I expect</h3><p>' + esc(exp) + '</p>';
      var habits = Array.prototype.filter.call(form.querySelectorAll('[data-habit]'), function (c) { return c.checked; })
        .map(function (c) { return '<li><strong>' + esc(c.getAttribute('data-habit')) + '</strong> ' + esc(c.getAttribute('data-more')) + '</li>'; });
      var own = v('h-own');
      if (own) habits.push('<li>' + esc(own) + '</li>');
      if (habits.length) html += '<h3>Habits that help you learn</h3><ul>' + habits.join('') + '</ul>';
      var ask = v('h-ask');
      if (ask) html += '<h3>Not sure? Ask</h3><p>' + esc(ask) + '</p>';
      out.innerHTML = html;
    }
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    update();
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-action="print-handout"]'), function (btn) {
    btn.addEventListener('click', function () {
      document.body.classList.add('print-handout');
      window.print();
      setTimeout(function () { document.body.classList.remove('print-handout'); }, 500);
    });
  });
  window.addEventListener('afterprint', function () { document.body.classList.remove('print-handout'); });

  /* ---- Chapter 7: move the generated draft into the editable box ---- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-action="use-draft"]'), function (btn) {
    btn.addEventListener('click', function () {
      var fin = document.getElementById(btn.getAttribute('data-target'));
      var draft = load('e-draft');
      if (!fin || !draft) { say(btn, 'Fill in the boxes above first.'); return; }
      if (fin.value.trim() && !window.confirm('Replace what’s in the box with the new draft?')) return;
      fin.value = draft;
      fin.dispatchEvent(new Event('input'));
      say(btn, 'Draft added. Edit it into your own words.');
    });
  });

  /* ---- Takeaway: copy everything as plain text for the discussion ---- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-action="copy-takeaway"]'), function (btn) {
    btn.addEventListener('click', function () {
      fillPulled();
      var out = ['Week 7 takeaway'];
      Array.prototype.forEach.call(document.querySelectorAll('[data-tk]'), function (el) {
        var head = el.getAttribute('data-tk');
        var input = el.querySelector('input');
        var body = input ? input.value.trim() : (el.querySelector('[data-from]') || {}).textContent;
        if (head.charAt(0) === '#') {
          var obj = el.querySelector('.obj');
          out.push('', head.slice(1).toUpperCase() + (obj ? ': ' + obj.textContent.trim() : ''));
          return;
        }
        out.push('', head + ':', (body || '').trim() || '(not filled in)');
      });
      copyText(out.join('\n'), btn, 'Copied. Paste it into your discussion post.');
    });
  });

  /* ---- Page buttons ---- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-action="print"]'), function (btn) {
    btn.addEventListener('click', function () { fields.forEach(mirror); window.print(); });
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-action="clear"]'), function (btn) {
    btn.addEventListener('click', function () {
      if (!window.confirm('Clear everything you’ve typed on this page? This can’t be undone.')) return;
      fields.forEach(function (el) {
        store(el.getAttribute('data-save'), null);
        if (el.type === 'checkbox' || el.type === 'radio') el.checked = el.defaultChecked;
        else if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else el.value = '';
        mirror(el);
      });
      Array.prototype.forEach.call(document.querySelectorAll('.builder'), function (b) {
        b.dispatchEvent(new Event('change'));
      });
      say(btn, 'Cleared.');
    });
  });

  /* ---- Download placeholders do nothing until the files are added ---- */
  Array.prototype.forEach.call(document.querySelectorAll('a[aria-disabled="true"]'), function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });

  /* ---- Saving not possible? Say so once, quietly ---- */
  if (!store('_test', '1')) {
    Array.prototype.forEach.call(document.querySelectorAll('.save-note'), function (n) {
      n.textContent = 'This browser isn’t saving your answers. Print or save a PDF before you leave the page.';
    });
  } else { store('_test', null); }
})();
