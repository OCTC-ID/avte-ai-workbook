/* Assignment label maker: draws a No AI / AI-supported / AI-integrated label
   with paw prints on a canvas and saves it as a PNG. Runs only in the browser. */
(function () {
  'use strict';
  var canvas = document.getElementById('lm-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var LABELS = {
    'no-ai':      { text: 'No AI',         fill: '#c8102e', ink: '#ffffff', paw: 'rgba(255,255,255,0.28)', light: '#c8102e',
                    note: 'Do this work without AI.' },
    'supported':  { text: 'AI-supported',  fill: '#144b8e', ink: '#ffffff', paw: 'rgba(255,255,255,0.25)', light: '#144b8e',
                    note: 'AI can help along the way. The work is yours.' },
    'integrated': { text: 'AI-integrated', fill: '#8db8ec', ink: '#0d3466', paw: 'rgba(13,52,102,0.22)',  light: '#0d3466',
                    note: 'Using AI is part of the task. Show how you used it.' }
  };
  var SIZES = { badge: [600, 200], wide: [1200, 200], square: [400, 400] };
  var SANS = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

  function pick(name) {
    var el = document.querySelector('[name="' + name + '"]:checked') || document.querySelector('[name="' + name + '"]');
    return el ? el.value : '';
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  // One paw print: a main pad and four toes, centered on (x, y)
  function paw(x, y, s, angle, color) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.fillStyle = color;
    ctx.beginPath(); ctx.ellipse(0, s * 0.28, s * 0.42, s * 0.34, 0, 0, Math.PI * 2); ctx.fill();
    [[-0.5, -0.12, -0.35], [-0.2, -0.42, -0.12], [0.2, -0.42, 0.12], [0.5, -0.12, 0.35]].forEach(function (t) {
      ctx.beginPath(); ctx.ellipse(t[0] * s, t[1] * s, s * 0.15, s * 0.2, t[2], 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
  }

  function fitText(text, maxW, start, weight) {
    var size = start;
    do { ctx.font = weight + ' ' + size + 'px ' + SANS; size -= 2; } while (ctx.measureText(text).width > maxW && size > 12);
    return size + 2;
  }

  function wrap(text, maxW, size) {
    ctx.font = '600 ' + size + 'px ' + SANS;
    var words = text.split(/\s+/), lines = [], line = '';
    words.forEach(function (w) {
      var test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }

  function draw() {
    var L = LABELS[pick('lm-label')] || LABELS['no-ai'];
    var size = SIZES[pick('lm-size')] || SIZES.badge;
    var light = pick('lm-style') === 'light';
    var W = size[0], H = size[1], square = W === H;
    var line = (document.getElementById('lm-line').value || '').trim();
    if (!line && document.getElementById('lm-default').checked) line = L.note;

    canvas.width = W; canvas.height = H;
    ctx.clearRect(0, 0, W, H);

    // Background
    roundRect(2, 2, W - 4, H - 4, 22);
    if (light) {
      ctx.fillStyle = '#ffffff'; ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = L.light; ctx.stroke();
      ctx.save(); roundRect(2, 2, W - 4, H - 4, 22); ctx.clip();
      ctx.fillStyle = L.fill; ctx.fillRect(0, 0, 18, H); ctx.restore();
    } else { ctx.fillStyle = L.fill; ctx.fill(); }
    var ink = light ? L.light : L.ink;
    var pawColor = light ? (L.fill === '#8db8ec' ? 'rgba(13,52,102,0.18)' : hexA(L.fill, 0.2)) : L.paw;

    // Paw-print trail
    if (square) {
      for (var q = 0; q < 4; q++) paw(W * 0.22 + q * W * 0.19, H * (q % 2 ? 0.80 : 0.89), 30, 1.2, pawColor);
    } else {
      var n = W > 800 ? 6 : 3, step = W > 800 ? 70 : 58, x0 = W - 42 - (n - 1) * step;
      for (var i = 0; i < n; i++) paw(x0 + i * step, H * (i % 2 ? 0.34 : 0.68), 36, 1.2, pawColor);
    }

    // Text
    var left = light ? 46 : 36, textW = square ? W - 72 : W - left - (W > 800 ? 460 : 196);
    ctx.fillStyle = ink; ctx.textBaseline = 'alphabetic';
    ctx.font = '700 ' + (square ? 22 : 20) + 'px ' + SANS;
    var kicker = 'AI USE';
    if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '3px';
    var top = square ? 70 : (line ? 52 : 68);
    ctx.fillText(kicker, left, top);
    if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';
    var big = fitText(L.text, textW, square ? 64 : 62, '800');
    ctx.font = '800 ' + big + 'px ' + SANS;
    var y = top + big + 6;
    ctx.fillText(L.text, left, y);
    if (line) {
      var lineW = square ? W - left - 30 : (W > 800 ? textW + 80 : textW);
      var lsz = square ? 26 : 22, lines = wrap(line, lineW, lsz);
      if (!square && lines.length > 2) { lsz = 19; lines = wrap(line, lineW, lsz); }
      lines = lines.slice(0, square ? 4 : 2);
      ctx.font = '600 ' + lsz + 'px ' + SANS;
      lines.forEach(function (ln, k) { ctx.fillText(ln, left, y + 14 + lsz * (k + 1) * 1.15); });
    }

    // Alt text
    var alt = 'AI use: ' + L.text + '.' + (line ? ' ' + line : '');
    document.getElementById('lm-alt').textContent = alt;
    canvas.setAttribute('aria-label', 'Preview of your label. ' + alt);
  }

  function hexA(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  document.getElementById('label-maker').addEventListener('input', draw);
  document.getElementById('label-maker').addEventListener('change', draw);
  draw();

  function say(text) {
    var s = document.getElementById('lm-status'); s.textContent = text;
    clearTimeout(s._t); s._t = setTimeout(function () { s.textContent = ''; }, 5000);
  }

  document.getElementById('lm-download').addEventListener('click', function () {
    draw();
    var name = 'ai-label-' + pick('lm-label') + '.png';
    canvas.toBlob(function (blob) {
      if (!blob) { say('This browser couldn’t make the file. Try another browser.'); return; }
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = name;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
      say('Saved as ' + name + '. Check your downloads.');
    }, 'image/png');
  });

  document.getElementById('lm-copy-alt').addEventListener('click', function () {
    var t = document.getElementById('lm-alt').textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(function () { say('Alt text copied.'); }, function () { say('Select the alt text and copy it yourself.'); });
    } else say('Select the alt text and copy it yourself.');
  });
})();
