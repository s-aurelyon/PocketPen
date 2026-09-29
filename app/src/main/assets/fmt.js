/* Pocket Pen — lightweight formatters (re-indent + tidy) for HTML, CSS and JS. */
(function (g) {
  'use strict';

  function rep(unit, n) { var s = ''; for (var i = 0; i < n; i++) s += unit; return s; }

  // Scan code, tracking strings/comments. For every "code" char calls fn(ch, i).
  // Returns nothing; state across the whole text.
  function scanCode(src, lang, fn) {
    var i = 0, n = src.length, q = null;
    while (i < n) {
      var c = src[i], d = src[i + 1];
      if (q) {
        if (c === '\\') { i += 2; continue; }
        if (c === q) q = null;
        i++; continue;
      }
      if (c === '/' && d === '*') { var e = src.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; continue; }
      if (lang === 'js' && c === '/' && d === '/') { var e2 = src.indexOf('\n', i); i = e2 < 0 ? n : e2; continue; }
      if (c === '"' || c === "'" || (lang === 'js' && c === '`')) { q = c; i++; continue; }
      fn(c, i);
      i++;
    }
  }

  // Re-indent code by bracket depth. Lines that are inside a multi-line
  // template string or block comment are left untouched.
  function reindent(src, lang, unit) {
    var lines = src.replace(/\r\n?/g, '\n').split('\n');
    var out = [], depth = 0, q = null, inCom = false;
    for (var li = 0; li < lines.length; li++) {
      var raw = lines[li];
      var keepRaw = q === '`' || inCom;
      var line = keepRaw ? raw.replace(/\s+$/, '') : raw.trim();
      // leading closers
      var lead = 0;
      if (!keepRaw) {
        var mm = /^[\]})]+/.exec(line.replace(/^(\*\/)/, ''));
        if (mm) lead = mm[0].length;
      }
      var ind = Math.max(0, depth - lead);
      if (keepRaw) out.push(line);
      else if (line === '') out.push('');
      else if (/^\*/.test(line) && inComStart(lines, li)) out.push(rep(unit, depth) + ' ' + line);
      else out.push(rep(unit, ind) + line);
      // update depth by scanning the line
      for (var i = 0; i < raw.length; i++) {
        var c = raw[i], d = raw[i + 1];
        if (inCom) { if (c === '*' && d === '/') { inCom = false; i++; } continue; }
        if (q) {
          if (c === '\\') { i++; continue; }
          if (c === q) q = null;
          else if (q === '`' && c === '$' && d === '{') { /* ignore nested */ }
          continue;
        }
        if (c === '/' && d === '*') { inCom = true; i++; continue; }
        if (lang === 'js' && c === '/' && d === '/') break;
        if (c === '"' || c === "'" || (lang === 'js' && c === '`')) { q = c; continue; }
        if (c === '{' || c === '[' || c === '(') depth++;
        else if (c === '}' || c === ']' || c === ')') depth = Math.max(0, depth - 1);
      }
      if (q && q !== '`') q = null; // unterminated normal string ends at line end
    }
    return tidy(out.join('\n'));
  }
  function inComStart(lines, li) {
    for (var k = li - 1; k >= 0; k--) {
      if (lines[k].indexOf('*/') >= 0) return false;
      if (lines[k].indexOf('/*') >= 0) return true;
    }
    return false;
  }
  function tidy(s) {
    return s.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').replace(/^\n+/, '').replace(/\s+$/, '') + '\n';
  }

  // CSS: expand one-line / minified rules, then re-indent.
  function formatCSS(src, unit) {
    var out = '', paren = 0, last = 0;
    var s = src.replace(/\r\n?/g, '\n');
    var pieces = [];
    scanCode(s, 'css', function (c, i) {
      if (c === '(') paren++;
      else if (c === ')') paren = Math.max(0, paren - 1);
      else if (paren === 0 && (c === '{' || c === ';' || c === '}')) {
        pieces.push({ i: i, c: c });
      }
    });
    for (var k = 0; k < pieces.length; k++) {
      var p = pieces[k];
      var seg = s.slice(last, p.i);
      if (p.c === '{') out += seg.replace(/\s*$/, '') + ' {\n';
      else if (p.c === ';') out += seg + ';\n';
      else out += seg + '\n}\n';
      last = p.i + 1;
    }
    out += s.slice(last);
    // normalise "prop:value" spacing inside declarations
    out = out.split('\n').map(function (l) {
      var t = l.trim();
      if (/^-?-?[\w-]+\s*:(?!:)/.test(t) && !/[{,]$/.test(t)) return t.replace(/^(-?-?[\w-]+)\s*:\s*/, '$1: ');
      return t;
    }).filter(function (l, idx, arr) { return !(l === '' && arr[idx - 1] === ''); }).join('\n');
    out = out.replace(/}\n(?=[^\n}])/g, '}\n\n');
    out = out.replace(/\n[ \t]*\n(\s*})/g, '\n$1');
    return reindent(out, 'css', unit);
  }

  function formatJS(src, unit) { return reindent(src, 'js', unit); }

  // ---------- HTML ----------
  var VOID = new Set('area base br col embed hr img input link meta source track wbr'.split(' '));
  var INLINE = new Set(('a abbr b bdi bdo br button cite code data dfn em i img input kbd label mark ' +
    'q s samp select small span strong sub sup svg time u var wbr textarea output meter progress').split(' '));
  var RAW = new Set(['script', 'style', 'pre', 'textarea']);

  function parseHTML(s) {
    var root = { tag: '#root', kids: [] }, stack = [root], i = 0, n = s.length;
    function top() { return stack[stack.length - 1]; }
    while (i < n) {
      var lt = s.indexOf('<', i);
      var txtEnd = lt < 0 ? n : lt;
      if (txtEnd > i) top().kids.push({ text: s.slice(i, txtEnd) });
      if (lt < 0) break;
      i = lt;
      if (s.startsWith('<!--', i)) {
        var e = s.indexOf('-->', i); e = e < 0 ? n : e + 3;
        top().kids.push({ raw: s.slice(i, e), comment: true }); i = e; continue;
      }
      if (s.startsWith('<!', i) || s.startsWith('<?', i)) {
        var e2 = s.indexOf('>', i); e2 = e2 < 0 ? n : e2 + 1;
        top().kids.push({ raw: s.slice(i, e2), block: true }); i = e2; continue;
      }
      var m = /^<(\/?)([A-Za-z][\w:.-]*)/.exec(s.slice(i, i + 64));
      if (!m) { top().kids.push({ text: '<' }); i++; continue; }
      // find end of tag respecting quotes
      var j = i + m[0].length, q = null;
      for (; j < n; j++) {
        var c = s[j];
        if (q) { if (c === q) q = null; }
        else if (c === '"' || c === "'") q = c;
        else if (c === '>') break;
      }
      var tagText = s.slice(i, Math.min(j + 1, n));
      i = Math.min(j + 1, n);
      var name = m[2].toLowerCase();
      if (m[1]) { // closing
        for (var k = stack.length - 1; k > 0; k--) {
          if (stack[k].tag === name) { stack[k].closed = true; stack.length = k; break; }
        }
        continue;
      }
      var attrs = tagText.slice(m[0].length).replace(/\/?>$/, '');
      var node = { tag: name, name: m[2], attrs: normAttrs(attrs), kids: [], selfClose: /\/>$/.test(tagText) };
      top().kids.push(node);
      if (VOID.has(name) || node.selfClose) continue;
      if (RAW.has(name)) {
        var re = new RegExp('</' + name + '\\s*>', 'ig'); re.lastIndex = i;
        var cm = re.exec(s);
        node.rawBody = s.slice(i, cm ? cm.index : n);
        node.closed = !!cm;
        i = cm ? cm.index + cm[0].length : n;
        continue;
      }
      stack.push(node);
    }
    return root;
  }
  function normAttrs(a) {
    var out = '', q = null, ws = false;
    for (var i = 0; i < a.length; i++) {
      var c = a[i];
      if (q) { out += c; if (c === q) q = null; continue; }
      if (c === '"' || c === "'") { if (ws) { out += ' '; ws = false; } q = c; out += c; continue; }
      if (/\s/.test(c)) { ws = true; continue; }
      if (ws && c !== '=' && out[out.length - 1] !== '=') out += ' ';
      ws = false; out += c;
    }
    return out.trim() ? ' ' + out.trim() : '';
  }
  function openTag(n) { return '<' + n.name + n.attrs + (n.selfClose ? ' />' : '>'); }
  function closeTag(n) { return (VOID.has(n.tag) || n.selfClose || !n.closed) ? '' : '</' + n.name + '>'; }

  function isInlineNode(n) {
    if (n.text != null) return true;
    if (n.comment || n.block) return false;
    return INLINE.has(n.tag) && n.kids.every(isInlineNode);
  }
  function inlineStr(n) {
    if (n.text != null) return n.text.replace(/\s+/g, ' ');
    if (n.raw) return n.raw;
    if (n.rawBody != null) return openTag(n) + n.rawBody + closeTag(n);
    return openTag(n) + n.kids.map(inlineStr).join('') + closeTag(n);
  }

  function printKids(kids, depth, unit, out) {
    // group consecutive inline nodes into runs
    var run = [];
    function flush() {
      if (!run.length) return;
      var str = run.map(inlineStr).join('').replace(/\s+/g, ' ').trim();
      run = [];
      if (str) out.push(rep(unit, depth) + str);
    }
    kids.forEach(function (k) {
      if (isInlineNode(k) && k.rawBody == null) run.push(k);
      else { flush(); printNode(k, depth, unit, out); }
    });
    flush();
  }

  function printNode(n, depth, unit, out) {
    var pad = rep(unit, depth);
    if (n.raw) { out.push(pad + n.raw.trim()); return; }
    if (n.rawBody != null) {
      var body = n.rawBody;
      if (n.tag === 'pre' || n.tag === 'textarea') { out.push(pad + openTag(n) + body + closeTag(n)); return; }
      var isJS = n.tag === 'script' && !/type\s*=\s*["']?(text\/(template|html|x-template)|application\/(ld\+)?json)/i.test(n.attrs);
      var isCSS = n.tag === 'style';
      if (!body.trim()) { out.push(pad + openTag(n) + closeTag(n)); return; }
      var f = isCSS ? formatCSS(body, unit) : isJS ? formatJS(dedent(body), unit) : dedent(body) + '\n';
      out.push(pad + openTag(n));
      f.replace(/\n$/, '').split('\n').forEach(function (l) { out.push(l ? rep(unit, depth + 1) + l : ''); });
      out.push(pad + closeTag(n));
      return;
    }
    // short element whose children are all inline → one line
    var allInline = n.kids.every(isInlineNode);
    if (allInline) {
      var inner = n.kids.map(inlineStr).join('').replace(/\s+/g, ' ').trim();
      var line = pad + openTag(n) + inner + closeTag(n);
      if (line.length <= 100 || !inner) { out.push(line); return; }
    }
    out.push(pad + openTag(n));
    var inHtml = n.tag === 'html';
    printKids(n.kids, inHtml ? depth : depth + 1, unit, out);
    var c = closeTag(n);
    if (c) out.push(pad + c);
  }

  function dedent(s) {
    var lines = s.replace(/\r\n?/g, '\n').split('\n');
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    var min = Infinity;
    lines.forEach(function (l) { if (l.trim()) min = Math.min(min, /^\s*/.exec(l)[0].length); });
    if (!isFinite(min)) min = 0;
    return lines.map(function (l) { return l.slice(min); }).join('\n');
  }

  function formatHTML(src, unit) {
    var root = parseHTML(src.replace(/\r\n?/g, '\n'));
    var out = [];
    printKids(root.kids, 0, unit, out);
    return tidy(out.join('\n'));
  }

  g.PenFmt = {
    html: formatHTML, css: formatCSS, js: formatJS, dedent: dedent,
    VOID: VOID
  };
})(window);
