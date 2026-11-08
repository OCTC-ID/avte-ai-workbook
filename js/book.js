/* AI and Your Teaching: workbook behavior.
   Everything stays in this browser. Nothing is sent anywhere. */
(function () {
  'use strict';

  /* ---- Table of contents (edit this list as chapters go live) ---- */
  var TOC = [
    { part: 'Start here' },
    { href: 'index.html', title: 'Cover and how this works' },
    { part: 'Part 1 · Before we meet' },
    { n: 1, href: 'chapters/01-what-ai-can-and-cant-do.html', title: 'What AI tools can and can’t do' },
    { n: 2, href: 'chapters/02-try-it-for-you.html', title: 'Try it on something just for you' },
    { n: 3, href: 'chapters/03-let-ai-take-your-test.html', title: 'Let AI take one of your tests' },
    { sub: true, href: 'resources/sample-assignment.html', title: 'Ready-made case assignment' },
    { part: 'Part 2 · When we meet' },
    { n: 4, title: 'Your clinical eye and your teaching eye', when: 'Dec 1' },
    { n: 5, title: 'Make your assignment stronger', when: 'Dec 1' },
    { n: 6, title: 'Tell your students where AI fits', when: 'Dec 1' },
    { part: 'Part 3 · Back in your course' },
    { n: 7, title: 'There’s a name for this', when: 'Soon' },
    { n: 8, title: 'Label your assignments', when: 'Soon' },
    { n: 9, title: 'Help your students use AI well', when: 'Soon' },
    { n: 10, title: 'Talk with your students about AI', when: 'Soon' },
    { n: 11, title: 'Try these with your mentor group or class', when: 'Soon' },
    { n: 12, title: 'AI and what you’ve learned this fall', when: 'Soon' }
  ];

  var root = document.documentElement.getAttribute('data-root') || '';
  var here = location.pathname.replace(/\/$/, '/index.html');
  var tocNav = document.getElementById('toc');

  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

  if (tocNav) {
    var html = '<ol>';
    TOC.forEach(function (item) {
      if (item.part) { html += '<li class="toc-part">' + esc(item.part) + '</li>'; return; }
      var num = '<span class="n">' + (item.n || '') + '</span>';
      if (!item.href) {
        html += '<li><span class="toc-soon">' + num + '<span>' + esc(item.title) + '</span>' +
          (item.when ? '<span class="when">' + esc(item.when) + '</span>' : '') + '</span></li>';
        return;
      }
      var current = here.slice(-item.href.length) === item.href;
      html += '<li' + (item.sub ? ' class="sub"' : '') + '><a href="' + root + item.href + '"' +
        (current ? ' aria-current="page"' : '') + '>' + (item.sub ? '' : num) + '<span>' + esc(item.title) + '</span></a></li>';
    });
    tocNav.innerHTML = html + '</ol>';
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
  function copyText(text, button) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      say(button, ok ? 'Copied. Paste it into your AI tool.' : 'Copy didn’t work here. Select the text above and copy it yourself.');
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        say(button, 'Copied. Paste it into your AI tool.');
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
    if (copyBtn) copyBtn.addEventListener('click', function () { copyText(out.textContent, copyBtn); });
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

  /* ---- Saving not possible? Say so once, quietly ---- */
  if (!store('_test', '1')) {
    Array.prototype.forEach.call(document.querySelectorAll('.save-note'), function (n) {
      n.textContent = 'This browser isn’t saving your answers. Print or save a PDF before you leave the page.';
    });
  } else { store('_test', null); }
})();
