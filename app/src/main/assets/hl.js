/* Code Lantern — tiny syntax highlighters for HTML, CSS and JS.
   Each returns escaped HTML with <span class="t-*"> tokens. */
(function (g) {
  'use strict';
  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function sp(cls, s) { return '<span class="t-' + cls + '">' + esc(s) + '</span>'; }

  // ---------- JavaScript ----------
  var JS_KW = new Set(('break case catch class const continue debugger default delete do else export ' +
    'extends finally for function if import in instanceof let new return super switch this throw try ' +
    'typeof var void while with yield async await of static get set from as').split(' '));
  var JS_LIT = new Set('null undefined true false NaN Infinity'.split(' '));
  var JS_RE = /(\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$))|("(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?|`(?:[^`\\]|\\[\s\S])*`?)|(\b0[xX][\da-fA-F_]+n?\b|\b\d[\d_]*(?:\.[\d_]+)?(?:[eE][+-]?\d+)?n?\b|\.\d+\b)|([A-Za-z_$][\w$]*)|(=>|[{}()[\];,.<>=!+\-*/%&|^~?:])/g;

  function hlJS(s) {
    var out = '', last = 0, m;
    JS_RE.lastIndex = 0;
    while ((m = JS_RE.exec(s))) {
      if (m.index > last) out += esc(s.slice(last, m.index));
      var t = m[0];
      if (m[1]) out += sp('com', t);
      else if (m[2]) out += sp('str', t);
      else if (m[3]) out += sp('num', t);
      else if (m[4]) {
        if (JS_KW.has(t)) out += sp('kw', t);
        else if (JS_LIT.has(t)) out += sp('num', t);
        else {
          var rest = s.slice(JS_RE.lastIndex, JS_RE.lastIndex + 40);
          if (/^\s*\(/.test(rest)) out += sp('fn', t);
          else if (/^[A-Z]/.test(t)) out += sp('cls', t);
          else out += esc(t);
        }
      } else out += sp('punc', t);
      last = JS_RE.lastIndex;
    }
    return out + esc(s.slice(last));
  }

  // ---------- CSS ----------
  var CSS_RE = /(\/\*[\s\S]*?(?:\*\/|$))|("(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?)|(@[\w-]+)|([{}])|(;)|(:)|(#[\da-fA-F]{3,8}\b)|(-?(?:\d+\.?\d*|\.\d+)(?:[a-zA-Z%]+)?)|(!important)|(-{0,2}[A-Za-z_][\w-]*)|([\s\S])/g;

  function hlCSS(s) {
    var out = '', m, depth = 0, expectProp = false, inValue = false;
    CSS_RE.lastIndex = 0;
    while ((m = CSS_RE.exec(s))) {
      var t = m[0];
      if (m[1]) out += sp('com', t);
      else if (m[2]) out += sp('str', t);
      else if (m[3]) out += sp('at', t);
      else if (m[4]) {
        if (t === '{') { depth++; expectProp = true; inValue = false; }
        else { depth = Math.max(0, depth - 1); expectProp = depth > 0; inValue = false; }
        out += sp('punc', t);
      } else if (m[5]) { expectProp = depth > 0; inValue = false; out += sp('punc', t); }
      else if (m[6]) out += sp('punc', t);
      else if (m[7]) out += sp(inValue ? 'num' : 'sel', t);
      else if (m[8]) out += sp(inValue ? 'num' : 'sel', t);
      else if (m[9]) out += sp('kw', t);
      else if (m[10]) {
        if (depth === 0 && !inValue) out += sp('sel', t);
        else if (expectProp && isProp(s, CSS_RE.lastIndex)) {
          out += sp('prop', t); expectProp = false; inValue = true;
        } else if (inValue) out += sp(/^[\w-]+$/.test(t) && s.charAt(CSS_RE.lastIndex) === '(' ? 'fn' : 'val', t);
        else out += sp('sel', t);
      } else {
        if (!/\s/.test(t) && expectProp && depth > 0) { /* e.g. & or . starting nested selector */ }
        out += esc(t);
      }
    }
    return out;
  }
  // property if followed by ':' and the declaration ends before a '{'
  function isProp(s, i) {
    var r = /^\s*:/.exec(s.slice(i, i + 20));
    if (!r) return false;
    var j = i + r[0].length;
    for (; j < s.length; j++) {
      var c = s.charAt(j);
      if (c === ';' || c === '}' || c === '\n') return true;
      if (c === '{') return false;
    }
    return true;
  }

  // ---------- HTML ----------
  var TAG_RE = /<(\/?)([A-Za-z][\w:.-]*)/y;
  var ATTR_RE = /(\s+)|(\/?>)|("[^"]*"?|'[^']*'?)|(=)|([^\s=>"'\/]+|\/)/y;

  function hlHTML(s) {
    var out = '', i = 0, n = s.length;
    while (i < n) {
      var lt = s.indexOf('<', i);
      if (lt < 0) { out += text(s.slice(i)); break; }
      if (lt > i) out += text(s.slice(i, lt));
      i = lt;
      if (s.startsWith('<!--', i)) {
        var e = s.indexOf('-->', i + 4); e = e < 0 ? n : e + 3;
        out += sp('com', s.slice(i, e)); i = e; continue;
      }
      if (s.startsWith('<!', i)) {
        var e2 = s.indexOf('>', i); e2 = e2 < 0 ? n : e2 + 1;
        out += sp('at', s.slice(i, e2)); i = e2; continue;
      }
      TAG_RE.lastIndex = i;
      var m = TAG_RE.exec(s);
      if (!m) { out += '&lt;'; i++; continue; }
      var closing = m[1] === '/', name = m[2].toLowerCase();
      out += sp('punc', '<' + m[1]) + sp('tag', m[2]);
      i = TAG_RE.lastIndex;
      var ended = false, prevEq = false;
      while (i < n) {
        ATTR_RE.lastIndex = i;
        var a = ATTR_RE.exec(s);
        if (!a) break;
        if (a[1]) out += a[1];
        else if (a[2]) { out += sp('punc', a[2]); i = ATTR_RE.lastIndex; ended = true; break; }
        else if (a[3]) out += sp('str', a[3]);
        else if (a[4]) out += sp('punc', a[4]);
        else if (a[5]) out += sp(prevEq ? 'str' : 'attr', a[5]);
        prevEq = !!a[4];
        i = ATTR_RE.lastIndex;
        if (a[5] && a[5].indexOf('<') >= 0) break;
      }
      if (ended && !closing && (name === 'script' || name === 'style')) {
        var re = new RegExp('</' + name, 'ig'); re.lastIndex = i;
        var cm = re.exec(s), end = cm ? cm.index : n;
        var body = s.slice(i, end);
        out += name === 'style' ? hlCSS(body) : hlJS(body);
        i = end;
      }
    }
    return out;
  }
  function text(t) {
    return esc(t).replace(/&amp;[#\w]+;/g, function (x) { return '<span class="t-num">' + x + '</span>'; });
  }

  g.PenHL = { html: hlHTML, css: hlCSS, js: hlJS, esc: esc };
})(window);
