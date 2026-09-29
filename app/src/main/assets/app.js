/* Pocket Pen — app logic */
(function () {
  'use strict';

  // ================= icons =================
  var P = {
    back: '<path d="M15 18l-6-6 6-6"/>',
    gear: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    sort: '<path d="M3 6h13M3 12h9M3 18h5M18 9v11M15 17l3 3 3-3"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    folderPlus: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M12 10.5v5M9.5 13h5"/>',
    code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    bookmark: '<path d="M6 3.5h12v17l-6-4-6 4z"/>',
    bookmarkOn: '<path d="M6 3.5h12v17l-6-4-6 4z" fill="currentColor"/>',
    dots: '<circle cx="12" cy="5" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.7" fill="currentColor" stroke="none"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    play: '<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>',
    up: '<path d="M6 15l6-6 6 6"/>', down: '<path d="M6 9l6 6 6-6"/>',
    left: '<path d="M15 6l-6 6 6 6"/>', right: '<path d="M9 6l6 6-6 6"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    reload: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
    split: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 12h18"/>',
    undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
    redo: '<path d="M15 14l5-5-5-5"/><path d="M20 9H10a6 6 0 0 0 0 12h3"/>',
    indent: '<path d="M3 5h18M11 10h10M11 14h10M3 19h18M3 9l4 3-4 3"/>',
    outdent: '<path d="M3 5h18M11 10h10M11 14h10M3 19h18M7 9l-4 3 4 3"/>',
    wand: '<path d="M4 20L15 9M17 3l.9 2.1L20 6l-2.1.9L17 9l-.9-2.1L14 6l2.1-.9zM19 13l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    move: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/>',
    scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 7.5L20 18M8.5 16.5L20 6"/>',
    box: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
    comment: '<path d="M10 4L6 20M18 4l-4 16"/>',
    file: '<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5"/>',
    open: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
    find: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    wrap: '<path d="M4 6h16M4 12h13a3 3 0 0 1 0 6h-4M4 18h5M15 16l-2 2 2 2"/>'
  };
  function icon(n) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (P[n] || '') + '</svg>';
  }
  function paintIcons(root) {
    (root || document).querySelectorAll('[data-i]').forEach(function (el) { el.innerHTML = icon(el.getAttribute('data-i')) + el.innerHTML.replace(/^<svg[\s\S]*?<\/svg>/, ''); });
  }

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = window.PenHL.esc;
  function escAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

  // ================= storage =================
  var B = window.Android || null, TOKEN = '';
  try { if (B) TOKEN = B.token() || ''; } catch (e) { B = null; }
  var store = {
    get: function (k) {
      try { if (B) { var v = B.get(TOKEN, k); return v == null ? null : v; } } catch (e) {}
      try { return localStorage.getItem('pp:' + k); } catch (e) { return null; }
    },
    set: function (k, v) {
      try { if (B) return B.set(TOKEN, k, v); } catch (e) { return false; }
      try { localStorage.setItem('pp:' + k, v); return true; } catch (e) { return false; }
    },
    remove: function (k) {
      try { if (B) return B.remove(TOKEN, k); } catch (e) { return false; }
      try { localStorage.removeItem('pp:' + k); } catch (e) {}
      return true;
    },
    keys: function (prefix) {
      try { if (B) return JSON.parse(B.keys(TOKEN, prefix) || '[]'); } catch (e) { return []; }
      var out = [];
      try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k.indexOf('pp:' + prefix) === 0) out.push(k.slice(3)); } } catch (e) {}
      return out;
    },
    json: function (k, d) { try { var v = store.get(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  };

  // ================= settings =================
  var DEF = {
    launch: 'home', fullscreen: false, autorun: false, twv: '4', fs: 14, wrap: false, lines: true,
    autoclose: true, tab: 2, theme: 'dark', immersive: true, sort: 'recent', split: 50, lastPen: null, clearOnRun: true
  };
  var S = Object.assign({}, DEF, store.json('settings', {}));
  function saveSettings() { store.set('settings', JSON.stringify(S)); }
  function applySettings() {
    var root = document.documentElement;
    var light = S.theme === 'light' || (S.theme === 'system' && window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches);
    root.classList.toggle('light', light);
    if (B) try { B.setBars(TOKEN, light ? '#ffffff' : '#151821', light); } catch (e) {}
    root.style.setProperty('--fs', S.fs + 'px');
    root.style.setProperty('--tab', S.tab);
    $('#work').style.setProperty('--split', S.split + '%');
    Object.keys(eds).forEach(function (l) {
      var ed = eds[l];
      ed.el.classList.toggle('wrap', !!S.wrap);
      ed.el.classList.toggle('nolines', !S.lines || !!S.wrap);
      ed.ta.setAttribute('wrap', S.wrap ? 'soft' : 'off');
      paint(ed, true);
    });
    $('#fsChk').checked = !!S.fullscreen;
  }
  function unit() { return '          '.slice(0, S.tab); }

  // ================= data =================
  var pens = new Map(), folders = [];
  function loadData() {
    folders = store.json('folders', []);
    pens.clear();
    store.keys('pen:').forEach(function (k) {
      var p = store.json(k, null);
      if (p && p.id) pens.set(p.id, p);
    });
    // any folder referenced by a pen but missing from the list
    pens.forEach(function (p) { if (p.folder) ensureFolder(p.folder, true); });
  }
  function saveFolders() { folders.sort(); store.set('folders', JSON.stringify(folders)); }
  function ensureFolder(path, noSave) {
    var parts = path.split('/'), acc = '';
    parts.forEach(function (part) { acc = acc ? acc + '/' + part : part; if (folders.indexOf(acc) < 0) folders.push(acc); });
    if (!noSave) saveFolders();
  }
  function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function writePen(p, touch) {
    if (touch !== false) p.updated = Date.now();
    pens.set(p.id, p);
    if (!store.set('pen:' + p.id, JSON.stringify(p))) toast('Could not save “' + p.name + '”');
  }
  function deletePen(id) { pens.delete(id); store.remove('pen:' + id); }
  function parentOf(path) { var i = path.lastIndexOf('/'); return i < 0 ? '' : path.slice(0, i); }
  function baseOf(path) { return path.slice(path.lastIndexOf('/') + 1); }
  function cleanName(s) { return String(s || '').replace(/[\/\\]/g, '-').replace(/\s+/g, ' ').trim().slice(0, 80); }
  function blankPen() { return { id: null, name: '', folder: '', html: '', css: '', js: '', tw: false, libs: '', tab: 'html' }; }
  function hasContent(p) { return !!(p && ((p.html || '').trim() || (p.css || '').trim() || (p.js || '').trim())); }

  // ================= ui helpers =================
  var sheetEl = $('#sheet'), scrim = $('#scrim'), sheetCb = null;
  var ui = {
    open: function (html, cb) {
      if (sheetCb) { var old = sheetCb; sheetCb = null; old(null); }
      sheetEl.innerHTML = '<div class="grab"></div>' + html;
      paintIcons(sheetEl);
      sheetEl.hidden = false; scrim.hidden = false; sheetCb = cb || null;
      sheetEl.scrollTop = 0;
    },
    close: function (res) {
      if (sheetEl.hidden) return;
      sheetEl.hidden = true; scrim.hidden = true; sheetEl.innerHTML = '';
      var cb = sheetCb; sheetCb = null; if (cb) cb(res === undefined ? null : res);
    },
    isOpen: function () { return !sheetEl.hidden; },
    menu: function (title, items) {
      return new Promise(function (resolve) {
        var h = (title ? '<h2>' + esc(title) + '</h2>' : '') + '<div class="menu">' + items.map(function (it) {
          if (it === '-') return '<hr>';
          return '<button data-id="' + it.id + '" class="' + (it.danger ? 'danger' : '') + '"><span data-i="' + (it.icon || 'file') + '"></span>' + esc(it.label) + '</button>';
        }).join('') + '</div>';
        ui.open(h, resolve);
        $$('.menu button', sheetEl).forEach(function (b) { b.onclick = function () { ui.close(b.getAttribute('data-id')); }; });
      });
    },
    prompt: function (o) {
      return new Promise(function (resolve) {
        ui.open('<h2>' + esc(o.title) + '</h2><label class="field"><span>' + esc(o.label || 'Name') + '</span><input type="text" id="pIn" value="' + escAttr(o.value || '') + '" placeholder="' + escAttr(o.placeholder || '') + '" autocomplete="off" spellcheck="false"></label>' +
          '<div class="acts"><button class="btn" id="pNo">Cancel</button><button class="btn primary" id="pOk">' + esc(o.ok || 'OK') + '</button></div>', resolve);
        var inp = $('#pIn');
        setTimeout(function () { inp.focus(); inp.select(); }, 60);
        $('#pNo').onclick = function () { ui.close(null); };
        $('#pOk').onclick = function () { ui.close(inp.value); };
        inp.onkeydown = function (e) { if (e.key === 'Enter') ui.close(inp.value); };
      });
    },
    confirm: function (title, msg, ok, danger) {
      return new Promise(function (resolve) {
        ui.open('<h2>' + esc(title) + '</h2><p class="muted" style="margin:0">' + esc(msg || '') + '</p><div class="acts"><button class="btn" id="cNo">Cancel</button><button class="btn ' + (danger ? 'danger' : 'primary') + '" id="cOk">' + esc(ok || 'OK') + '</button></div>', function (r) { resolve(!!r); });
        $('#cNo').onclick = function () { ui.close(false); };
        $('#cOk').onclick = function () { ui.close(true); };
      });
    }
  };
  scrim.onclick = function () { ui.close(null); };

  var toastT = 0;
  function toast(msg, action, fn) {
    var t = $('#toast');
    t.innerHTML = '<span>' + esc(msg) + '</span>' + (action ? '<button>' + esc(action) + '</button>' : '');
    t.hidden = false;
    if (action) t.querySelector('button').onclick = function () { t.hidden = true; fn(); };
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.hidden = true; }, action ? 5000 : 2200);
  }

  function folderOptions(sel, exclude) {
    var opts = '<option value="">Home (top level)</option>';
    folders.slice().sort().forEach(function (f) {
      if (exclude && (f === exclude || f.indexOf(exclude + '/') === 0)) return;
      var d = f.split('/').length - 1;
      opts += '<option value="' + escAttr(f) + '"' + (f === sel ? ' selected' : '') + '>' + '   '.repeat(d) + esc(baseOf(f)) + '</option>';
    });
    return opts + '<option value="__new">+ New folder…</option>';
  }
  function wireFolderSelect(selEl) {
    var prev = selEl.value;
    selEl.onchange = function () {
      if (selEl.value !== '__new') { prev = selEl.value; return; }
      var name = cleanName(window.prompt('New folder name (inside ' + (prev || 'Home') + ')') || '');
      if (!name) { selEl.value = prev; return; }
      var path = prev ? prev + '/' + name : name;
      ensureFolder(path);
      selEl.innerHTML = folderOptions(path);
      prev = path;
    };
  }
  function pickFolder(title, current, exclude) {
    return new Promise(function (resolve) {
      ui.open('<h2>' + esc(title) + '</h2><label class="field"><span>Folder</span><select id="fSel">' + folderOptions(current, exclude) + '</select></label>' +
        '<div class="acts"><button class="btn" id="fNo">Cancel</button><button class="btn primary" id="fOk">Move here</button></div>', resolve);
      var s = $('#fSel'); wireFolderSelect(s);
      $('#fNo').onclick = function () { ui.close(null); };
      $('#fOk').onclick = function () { ui.close({ folder: s.value === '__new' ? '' : s.value }); };
    });
  }

  function ago(t) {
    if (!t) return '';
    var s = (Date.now() - t) / 1000;
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    if (s < 86400 * 7) return Math.floor(s / 86400) + 'd ago';
    var d = new Date(t); return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: d.getFullYear() === new Date().getFullYear() ? undefined : 'numeric' });
  }

  // ================= HOME =================
  var cwd = '', screen = 'home';
  var homeEl = $('#home'), editorEl = $('#editor');

  function showHome() {
    if (screen === 'editor') leaveEditor();
    screen = 'home';
    editorEl.classList.add('hidden'); homeEl.classList.remove('hidden');
    renderHome();
  }

  function renderHome() {
    var q = $('#search').value.trim().toLowerCase();
    $('#homeTitle').textContent = cwd && !q ? baseOf(cwd) : 'Pocket Pen';
    $('#upBtn').hidden = !cwd || !!q;
    // crumbs
    var cr = $('#crumbs');
    if (cwd && !q) {
      var parts = cwd.split('/'), acc = '', h = '<button data-p="">Home</button>';
      parts.forEach(function (p) { acc = acc ? acc + '/' + p : p; h += '<span>/</span><button data-p="' + escAttr(acc) + '">' + esc(p) + '</button>'; });
      cr.innerHTML = h; cr.hidden = false;
      $$('button', cr).forEach(function (b) { b.onclick = function () { cwd = b.getAttribute('data-p'); renderHome(); }; });
    } else cr.hidden = true;
    // draft card
    var dc = $('#draftCard'), scratch = store.json('scratch', null);
    if (!cwd && !q && hasContent(scratch)) {
      dc.innerHTML = '<div class="item draft" id="draftItem"><div class="ico">' + icon('code') + '</div><div class="meta"><div class="name">Unsaved scratch</div><div class="sub">' + dots(scratch) + '<span>Tap to continue · bookmark to keep</span></div></div><button class="ib" id="draftX" aria-label="Discard">' + icon('x') + '</button></div>';
      $('#draftItem').onclick = function (e) { if (e.target.closest('#draftX')) return; openScratch(false); };
      $('#draftX').onclick = function () {
        ui.confirm('Discard scratch?', 'The unsaved scratch code will be deleted.', 'Discard', true).then(function (ok) {
          if (ok) { store.remove('scratch'); renderHome(); }
        });
      };
      dc.style.marginTop = '8px';
    } else { dc.innerHTML = ''; }

    var list = $('#list'), html = '';
    var fl, pl;
    if (q) {
      fl = folders.filter(function (f) { return baseOf(f).toLowerCase().indexOf(q) >= 0; });
      pl = Array.from(pens.values()).filter(function (p) { return (p.name || '').toLowerCase().indexOf(q) >= 0; });
    } else {
      fl = folders.filter(function (f) { return parentOf(f) === cwd; });
      pl = Array.from(pens.values()).filter(function (p) { return (p.folder || '') === cwd; });
    }
    fl.sort(function (a, b) { return baseOf(a).localeCompare(baseOf(b)); });
    if (S.sort === 'name') pl.sort(function (a, b) { return (a.name || '').localeCompare(b.name || ''); });
    else pl.sort(function (a, b) { return (b.updated || 0) - (a.updated || 0); });

    fl.forEach(function (f) {
      var n = folders.filter(function (x) { return parentOf(x) === f; }).length + Array.from(pens.values()).filter(function (p) { return p.folder === f; }).length;
      html += '<div class="item folder" data-folder="' + escAttr(f) + '"><div class="ico">' + icon('folder') + '</div><div class="meta"><div class="name">' + esc(baseOf(f)) + '</div><div class="sub">' + (q && parentOf(f) ? esc(parentOf(f)) + ' · ' : '') + n + (n === 1 ? ' item' : ' items') + '</div></div><button class="ib more" aria-label="Options">' + icon('dots') + '</button></div>';
    });
    pl.forEach(function (p) {
      html += '<div class="item" data-pen="' + escAttr(p.id) + '"><div class="ico">&lt;/&gt;</div><div class="meta"><div class="name">' + esc(p.name || 'Untitled') + '</div><div class="sub">' + dots(p) + '<span>' + (q && p.folder ? esc(p.folder) + ' · ' : '') + ago(p.updated) + '</span></div></div><button class="ib more" aria-label="Options">' + icon('dots') + '</button></div>';
    });
    list.innerHTML = html;
    $('#empty').hidden = !!(fl.length || pl.length || $('#draftCard').innerHTML);
    $('#empty p').textContent = q ? 'No matches.' : 'Nothing bookmarked here yet.';
    $$('.item[data-folder], .item[data-pen]', list).forEach(wireItem);
  }
  function dots(p) {
    var s = '';
    if ((p.html || '').trim()) s += '<b class="dot h">HTML</b>';
    if ((p.css || '').trim()) s += '<b class="dot c">CSS</b>';
    if ((p.js || '').trim()) s += '<b class="dot j">JS</b>';
    if (p.tw) s += '<b class="dot t">TW</b>';
    return s;
  }
  function wireItem(el) {
    var t = 0, long = false, sx = 0, sy = 0;
    var folder = el.getAttribute('data-folder'), penId = el.getAttribute('data-pen');
    function act() { if (folder != null) { cwd = folder; $('#search').value = ''; renderHome(); } else openPen(pens.get(penId)); }
    function menu() { if (folder != null) folderMenu(folder); else penMenu(pens.get(penId)); }
    el.addEventListener('pointerdown', function (e) {
      long = false; sx = e.clientX; sy = e.clientY;
      clearTimeout(t); t = setTimeout(function () { long = true; if (navigator.vibrate) navigator.vibrate(12); menu(); }, 480);
    });
    el.addEventListener('pointermove', function (e) { if (Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) > 10) clearTimeout(t); });
    el.addEventListener('pointerup', function () { clearTimeout(t); });
    el.addEventListener('pointercancel', function () { clearTimeout(t); });
    el.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    el.addEventListener('click', function (e) {
      if (long) { long = false; return; }
      if (e.target.closest('.more')) { menu(); return; }
      act();
    });
  }

  function penMenu(p) {
    if (!p) return;
    ui.menu(p.name, [
      { id: 'open', label: 'Open', icon: 'open' },
      { id: 'run', label: 'Run fullscreen', icon: 'play' },
      { id: 'rename', label: 'Rename', icon: 'edit' },
      { id: 'move', label: 'Move to folder', icon: 'move' },
      { id: 'dup', label: 'Duplicate', icon: 'copy' },
      '-',
      { id: 'copy', label: 'Copy as single HTML file', icon: 'copy' },
      { id: 'share', label: 'Share as HTML', icon: 'share' },
      '-',
      { id: 'del', label: 'Delete', icon: 'trash', danger: true }
    ]).then(function (a) {
      if (a === 'open') openPen(p);
      else if (a === 'run') { openPen(p); run('full'); }
      else if (a === 'rename') renamePen(p).then(renderHome);
      else if (a === 'move') pickFolder('Move “' + p.name + '”', p.folder).then(function (r) { if (r) { p.folder = r.folder; writePen(p, false); renderHome(); toast('Moved to ' + (r.folder || 'Home')); } });
      else if (a === 'dup') { var c = Object.assign({}, p, { id: newId(), name: p.name + ' copy' }); writePen(c); renderHome(); toast('Duplicated'); }
      else if (a === 'copy') copyText(buildDoc(p, true), 'HTML copied');
      else if (a === 'share') shareText(p.name, buildDoc(p, true));
      else if (a === 'del') ui.confirm('Delete “' + p.name + '”?', 'This can’t be undone.', 'Delete', true).then(function (ok) { if (ok) { deletePen(p.id); renderHome(); toast('Deleted'); } });
    });
  }
  function renamePen(p) {
    return ui.prompt({ title: 'Rename', value: p.name, ok: 'Rename' }).then(function (v) {
      v = cleanName(v); if (!v) return;
      p.name = v; writePen(p, false);
      if (cur && cur.id === p.id) { cur.name = v; updateHeader(); }
    });
  }
  function folderMenu(f) {
    ui.menu(baseOf(f), [
      { id: 'open', label: 'Open', icon: 'open' },
      { id: 'newin', label: 'New file here', icon: 'plus' },
      { id: 'rename', label: 'Rename', icon: 'edit' },
      { id: 'move', label: 'Move', icon: 'move' },
      '-',
      { id: 'del', label: 'Delete folder and contents', icon: 'trash', danger: true }
    ]).then(function (a) {
      if (a === 'open') { cwd = f; renderHome(); }
      else if (a === 'newin') { cwd = f; renderHome(); newFileDialog(); }
      else if (a === 'rename') ui.prompt({ title: 'Rename folder', value: baseOf(f), ok: 'Rename' }).then(function (v) {
        v = cleanName(v); if (!v) return; var np = parentOf(f) ? parentOf(f) + '/' + v : v;
        if (np !== f && folders.indexOf(np) >= 0) return toast('A folder with that name already exists');
        relocateFolder(f, np);
      });
      else if (a === 'move') pickFolder('Move folder “' + baseOf(f) + '”', parentOf(f), f).then(function (r) {
        if (!r) return; var np = r.folder ? r.folder + '/' + baseOf(f) : baseOf(f);
        if (np === f) return;
        if (folders.indexOf(np) >= 0) return toast('That folder already exists there');
        relocateFolder(f, np);
      });
      else if (a === 'del') {
        var inside = Array.from(pens.values()).filter(function (p) { return p.folder === f || (p.folder || '').indexOf(f + '/') === 0; });
        ui.confirm('Delete “' + baseOf(f) + '”?', inside.length ? 'This deletes the folder and ' + inside.length + ' file' + (inside.length === 1 ? '' : 's') + ' inside it.' : 'The folder is empty.', 'Delete', true).then(function (ok) {
          if (!ok) return;
          inside.forEach(function (p) { deletePen(p.id); });
          folders = folders.filter(function (x) { return x !== f && x.indexOf(f + '/') !== 0; });
          saveFolders(); renderHome(); toast('Folder deleted');
        });
      }
    });
  }
  function relocateFolder(from, to) {
    folders = folders.map(function (x) { return x === from ? to : x.indexOf(from + '/') === 0 ? to + x.slice(from.length) : x; });
    ensureFolder(parentOf(to) || to, true);
    if (folders.indexOf(to) < 0) folders.push(to);
    saveFolders();
    pens.forEach(function (p) {
      if (p.folder === from || (p.folder || '').indexOf(from + '/') === 0) { p.folder = to + p.folder.slice(from.length); writePen(p, false); }
    });
    if (cwd === from || cwd.indexOf(from + '/') === 0) cwd = to + cwd.slice(from.length);
    renderHome();
  }

  var TEMPLATES = {
    blank: { label: 'Blank', desc: 'Empty tabs', html: '', css: '', js: '' },
    page: {
      label: 'HTML page', desc: 'Markup + CSS + JS',
      html: '<main>\n  <h1>Hello 👋</h1>\n  <p>Edit me, then hit Run.</p>\n  <button id="btn">Click me</button>\n</main>\n',
      css: 'body {\n  font-family: system-ui, sans-serif;\n  margin: 0;\n  padding: 24px;\n  background: #f5f6fa;\n  color: #1a1e29;\n}\n\nbutton {\n  padding: 10px 16px;\n  border: 0;\n  border-radius: 10px;\n  background: #4e6cf5;\n  color: white;\n  font-size: 16px;\n}\n',
      js: 'const btn = document.getElementById("btn");\nlet clicks = 0;\n\nbtn.addEventListener("click", () => {\n  clicks++;\n  btn.textContent = `Clicked ${clicks}×`;\n  console.log("clicks:", clicks);\n});\n'
    },
    tailwind: {
      label: 'Tailwind', desc: 'Utility classes, no build', tw: true,
      html: '<div class="min-h-screen grid place-items-center bg-slate-100 p-6">\n  <div class="max-w-sm rounded-2xl bg-white p-6 shadow-xl">\n    <h1 class="text-2xl font-bold text-slate-900">Tailwind card</h1>\n    <p class="mt-2 text-slate-600">Style everything with classes.</p>\n    <button class="mt-4 rounded-xl bg-indigo-500 px-4 py-2 font-semibold text-white active:scale-95">\n      Nice\n    </button>\n  </div>\n</div>\n',
      css: '', js: ''
    },
    canvas: {
      label: 'Canvas', desc: 'Animation loop starter',
      html: '<canvas id="c"></canvas>\n',
      css: 'html, body {\n  margin: 0;\n  height: 100%;\n  background: #0e1016;\n  overflow: hidden;\n}\n\ncanvas {\n  display: block;\n}\n',
      js: 'const c = document.getElementById("c");\nconst ctx = c.getContext("2d");\nlet w, h, t = 0;\n\nfunction resize() {\n  w = c.width = innerWidth;\n  h = c.height = innerHeight;\n}\naddEventListener("resize", resize);\nresize();\n\nfunction frame() {\n  t += 0.02;\n  ctx.fillStyle = "rgba(14,16,22,0.2)";\n  ctx.fillRect(0, 0, w, h);\n  for (let i = 0; i < 12; i++) {\n    const a = t + i * Math.PI / 6;\n    ctx.beginPath();\n    ctx.arc(w / 2 + Math.cos(a) * 100, h / 2 + Math.sin(a * 1.3) * 100, 8, 0, Math.PI * 2);\n    ctx.fillStyle = `hsl(${i * 30 + t * 40}, 80%, 65%)`;\n    ctx.fill();\n  }\n  requestAnimationFrame(frame);\n}\nframe();\n'
    }
  };

  function newFileDialog() {
    var sel = 'blank';
    ui.open('<h2>New file</h2><label class="field"><span>Name</span><input type="text" id="nfName" placeholder="Untitled" autocomplete="off" spellcheck="false"></label>' +
      '<label class="field"><span>Folder</span><select id="nfFolder">' + folderOptions(cwd) + '</select></label>' +
      '<div class="field"><span>Start from</span><div class="tpls">' + Object.keys(TEMPLATES).map(function (k) {
        return '<button class="tpl' + (k === sel ? ' sel' : '') + '" data-t="' + k + '"><b>' + TEMPLATES[k].label + '</b><small>' + TEMPLATES[k].desc + '</small></button>';
      }).join('') + '</div></div>' +
      '<div class="acts"><button class="btn" id="nfNo">Cancel</button><button class="btn primary" id="nfOk">Create</button></div>');
    wireFolderSelect($('#nfFolder'));
    $$('.tpl', sheetEl).forEach(function (b) { b.onclick = function () { sel = b.getAttribute('data-t'); $$('.tpl', sheetEl).forEach(function (x) { x.classList.toggle('sel', x === b); }); }; });
    setTimeout(function () { $('#nfName').focus(); }, 60);
    $('#nfNo').onclick = function () { ui.close(); };
    function create() {
      var t = TEMPLATES[sel], f = $('#nfFolder').value;
      if (f === '__new') f = '';
      var p = blankPen();
      p.id = newId(); p.name = cleanName($('#nfName').value) || 'Untitled'; p.folder = f;
      p.html = t.html; p.css = t.css; p.js = t.js; p.tw = !!t.tw;
      writePen(p);
      ui.close();
      openPen(p);
    }
    $('#nfOk').onclick = create;
    $('#nfName').onkeydown = function (e) { if (e.key === 'Enter') create(); };
  }

  $('#newFileBtn').onclick = newFileDialog;
  $('#scratchBtn').onclick = function () { openScratch(false); };
  $('#newFolderBtn').onclick = function () {
    ui.prompt({ title: 'New folder', label: cwd ? 'Inside ' + cwd : 'Folder name', placeholder: 'e.g. Experiments', ok: 'Create' }).then(function (v) {
      v = cleanName(v); if (!v) return;
      var path = cwd ? cwd + '/' + v : v;
      if (folders.indexOf(path) >= 0) return toast('That folder already exists');
      ensureFolder(path); renderHome();
    });
  };
  $('#upBtn').onclick = function () { cwd = parentOf(cwd); renderHome(); };
  $('#search').addEventListener('input', renderHome);
  $('#sortBtn').onclick = function () {
    ui.menu('Sort by', [{ id: 'recent', label: (S.sort === 'recent' ? '✓ ' : '') + 'Recently edited', icon: 'sort' }, { id: 'name', label: (S.sort === 'name' ? '✓ ' : '') + 'Name', icon: 'sort' }]).then(function (v) {
      if (v) { S.sort = v; saveSettings(); renderHome(); }
    });
  };
  $('#homeSettingsBtn').onclick = settingsSheet;

  // ================= EDITOR =================
  var eds = {}, cur = null, guard = false, activeTab = 'html', dirtyT = 0, autoT = 0;
  $$('.ed').forEach(function (el) {
    var lang = el.getAttribute('data-lang');
    var ed = { el: el, lang: lang, ta: $('textarea', el), pre: $('pre', el), nums: $('.nums', el), lines: 0, raf: 0 };
    eds[lang] = ed;
    ed.ta.addEventListener('input', function (e) {
      if (!guard) handleTyped(ed, e);
      changed(ed);
    });
    ed.ta.addEventListener('scroll', function () { syncScroll(ed); });
    ed.ta.addEventListener('keydown', function (e) { keydown(ed, e); });
  });

  function paint(ed, now) {
    if (ed.raf) { cancelAnimationFrame(ed.raf); ed.raf = 0; }
    function go() {
      ed.raf = 0;
      var v = ed.ta.value;
      if (v.length > 150000) { ed.el.classList.add('plain'); ed.pre.textContent = ''; }
      else { ed.el.classList.remove('plain'); ed.pre.innerHTML = window.PenHL[ed.lang](v) + '\n\n'; }
      var n = 1; for (var i = 0; i < v.length; i++) if (v.charCodeAt(i) === 10) n++;
      if (n !== ed.lines) {
        ed.lines = n; var s = '';
        for (var j = 1; j <= n; j++) s += j + '\n';
        ed.nums.textContent = s;
      }
      syncScroll(ed);
    }
    if (now) go(); else ed.raf = requestAnimationFrame(go);
  }
  function syncScroll(ed) {
    ed.pre.scrollTop = ed.ta.scrollTop;
    ed.pre.scrollLeft = ed.ta.scrollLeft;
    ed.nums.style.transform = 'translateY(' + (-ed.ta.scrollTop) + 'px)';
  }
  function changed(ed) {
    if (!cur) return;
    cur[ed.lang] = ed.ta.value;
    paint(ed);
    clearTimeout(dirtyT); dirtyT = setTimeout(saveCurrent, 500);
    if (S.autorun && !$('#previewPane').hidden) { clearTimeout(autoT); autoT = setTimeout(function () { run('keep'); }, 900); }
  }
  function saveCurrent() {
    clearTimeout(dirtyT);
    if (!cur) return;
    Object.keys(eds).forEach(function (l) { cur[l] = eds[l].ta.value; });
    cur.tab = activeTab === 'console' ? (cur.tab || 'html') : activeTab;
    if (cur.id) {
      var p = pens.get(cur.id);
      var changedAny = !p || ['html', 'css', 'js', 'tw', 'libs', 'name', 'folder'].some(function (k) { return p[k] !== cur[k]; });
      var copy = JSON.parse(JSON.stringify(cur));
      if (p && !changedAny) copy.updated = p.updated;
      writePen(copy, changedAny);
      cur.updated = copy.updated;
    } else {
      if (hasContent(cur) || cur.libs) store.set('scratch', JSON.stringify(cur));
      else store.remove('scratch');
    }
  }

  // ---- insertion helpers (keep native undo) ----
  function ins(ta, text) {
    guard = true;
    try {
      if (document.activeElement !== ta) ta.focus({ preventScroll: true });
      var ok = false;
      // execCommand keeps the native undo stack, but only works on the focused (visible) textarea
      if (document.activeElement === ta) try { ok = document.execCommand('insertText', false, text); } catch (e) {}
      if (!ok) {
        ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, 'end');
        ta.dispatchEvent(new Event('input'));
      }
    } finally { guard = false; }
  }
  function delRange(ta, a, b) {
    guard = true;
    try {
      ta.setSelectionRange(a, b);
      var ok = false; if (document.activeElement === ta) try { ok = document.execCommand('delete'); } catch (e) {}
      if (!ok) { ta.setRangeText('', a, b, 'end'); ta.dispatchEvent(new Event('input')); }
    } finally { guard = false; }
  }
  function replaceRange(ta, a, b, text) { ta.focus({ preventScroll: true }); ta.setSelectionRange(a, b); ins(ta, text); }
  function setValueUndoable(ta, val) {
    var st = ta.scrollTop;
    ta.focus({ preventScroll: true });
    ta.select();
    ins(ta, val);
    ta.scrollTop = st;
  }
  function insertAfter(ta, text) { var p = ta.selectionStart; ins(ta, text); ta.setSelectionRange(p, p); }

  // ---- smart typing ----
  var PAIRS = { '(': ')', '[': ']', '{': '}' };
  function handleTyped(ed, e) {
    var t = e.inputType, d = e.data;
    if (t === 'insertLineBreak' || t === 'insertParagraph' || (t === 'insertText' && d === '\n')) { autoIndent(ed); return; }
    if (t === 'insertText' && d && d.length === 1) afterChar(ed, d);
  }
  function afterChar(ed, ch) {
    if (!S.autoclose) return;
    var ta = ed.ta, v = ta.value, p = ta.selectionStart;
    if (p !== ta.selectionEnd) return;
    var next = v.charAt(p), prev = v.charAt(p - 2);
    var isQ = ch === '"' || ch === "'" || (ch === '`' && ed.lang !== 'html');
    // typed a closer that already exists → step over it
    if ((ch === ')' || ch === ']' || ch === '}' || isQ) && next === ch) { delRange(ta, p, p + 1); return; }
    if (PAIRS[ch]) {
      if (next === '' || /[\s)\]}>;,:]/.test(next)) insertAfter(ta, PAIRS[ch]);
      return;
    }
    if (isQ) {
      if (/\w/.test(next)) return;
      if (ed.lang === 'html') {
        if (prev === '=' && insideTag(v, p - 1)) insertAfter(ta, ch);
      } else if (!/[\w\\]/.test(prev)) insertAfter(ta, ch);
      return;
    }
    if (ed.lang === 'html') {
      if (ch === '>') autoCloseTag(ta, v, p);
      else if (ch === '/' && prev === '<') completeCloseTag(ta, v, p);
    }
  }
  function insideTag(v, p) {
    var lt = v.lastIndexOf('<', p), gt = v.lastIndexOf('>', p - 1);
    return lt > gt;
  }
  function autoCloseTag(ta, v, p) {
    var before = v.slice(Math.max(0, p - 3000), p);
    var m = /<([A-Za-z][\w:-]*)(?:\s(?:[^<>"']|"[^"]*"|'[^']*')*)?>$/.exec(before);
    if (!m || /\/>$/.test(before)) return;
    var name = m[1];
    if (window.PenFmt.VOID.has(name.toLowerCase())) return;
    if (v.slice(p, p + name.length + 2).toLowerCase() === '</' + name.toLowerCase()) return;
    insertAfter(ta, '</' + name + '>');
  }
  function openTagsBefore(v) {
    var re = /<!--[\s\S]*?-->|<(\/?)([A-Za-z][\w:-]*)((?:[^<>"']|"[^"]*"|'[^']*')*)>/g, st = [], m;
    while ((m = re.exec(v))) {
      if (!m[2]) continue;
      var n = m[2].toLowerCase();
      if (m[1]) { var i = st.lastIndexOf(n); if (i >= 0) st.length = i; }
      else if (!window.PenFmt.VOID.has(n) && !/\/$/.test(m[3])) {
        st.push(n);
        if (n === 'script' || n === 'style') { // skip raw content
          var endRe = new RegExp('</' + n + '\\s*>', 'ig'); endRe.lastIndex = re.lastIndex;
          var em = endRe.exec(v);
          if (!em) break;
          st.pop(); re.lastIndex = em.index + em[0].length;
        }
      }
    }
    return st;
  }
  function completeCloseTag(ta, v, p) {
    var st = openTagsBefore(v.slice(0, p - 2));
    if (!st.length) return;
    var name = st[st.length - 1];
    if (v.slice(p, p + name.length).toLowerCase() === name) return;
    ins(ta, name + '>');
  }
  function lineStart(v, p) { return v.lastIndexOf('\n', p - 1) + 1; }
  function autoIndent(ed) {
    var ta = ed.ta, v = ta.value, p = ta.selectionStart;
    if (p !== ta.selectionEnd) return;
    var ls = lineStart(v, p - 1), prevLine = v.slice(ls, p - 1);
    var ind = /^[ \t]*/.exec(prevLine)[0], t = prevLine.replace(/\s+$/, '');
    var opens = /[{[(]$/.test(t);
    if (ed.lang === 'html' && !opens) {
      var m = /<([A-Za-z][\w:-]*)(?:\s(?:[^<>"']|"[^"]*"|'[^']*')*)?>$/.exec(t);
      if (m && !window.PenFmt.VOID.has(m[1].toLowerCase())) opens = true;
    }
    var after = v.slice(p, p + 80);
    var closerNext = /^[ \t]*([}\])]|<\/)/.test(after);
    if (opens && closerNext) {
      // drop whitespace that sat before the closer
      var ws = /^[ \t]*/.exec(after)[0];
      if (ws) delRange(ta, p, p + ws.length);
      ins(ta, ind + unit());
      var here = ta.selectionStart;
      ins(ta, '\n' + ind);
      ta.setSelectionRange(here, here);
    } else if (opens) ins(ta, ind + unit());
    else if (ind) ins(ta, ind);
  }

  function selLines(ta) {
    var v = ta.value, a = ta.selectionStart, b = ta.selectionEnd;
    if (b > a && v.charAt(b - 1) === '\n') b--;
    var s = lineStart(v, a), e = v.indexOf('\n', b); if (e < 0) e = v.length;
    return { s: s, e: e, text: v.slice(s, e) };
  }
  function doTab(ed, shift) {
    var ta = ed.ta, v = ta.value, a = ta.selectionStart, b = ta.selectionEnd, u = unit();
    var multi = v.slice(a, b).indexOf('\n') >= 0;
    if (!shift && !multi && a === b) {
      if (ed.lang === 'html' && emmet(ed)) return;
      ins(ta, u); return;
    }
    var L = selLines(ta), lines = L.text.split('\n');
    var out = lines.map(function (l) {
      if (!shift) return l.length ? u + l : l;
      var m = /^( {1,10}|\t)/.exec(l); if (!m) return l;
      var cut = m[0] === '\t' ? 1 : Math.min(m[0].length, u.length);
      return l.slice(cut);
    }).join('\n');
    if (out === L.text) return;
    replaceRange(ta, L.s, L.e, out);
    if (multi) ta.setSelectionRange(L.s, L.s + out.length);
    else { var np = Math.max(L.s, a + (out.length - L.text.length)); ta.setSelectionRange(np, np); }
  }
  function toggleComment(ed) {
    var ta = ed.ta, v = ta.value, a = ta.selectionStart, b = ta.selectionEnd;
    if (ed.lang === 'js') {
      var L = selLines(ta), lines = L.text.split('\n');
      var all = lines.filter(function (l) { return l.trim(); }).every(function (l) { return /^\s*\/\//.test(l); });
      var minInd = Math.min.apply(null, lines.filter(function (l) { return l.trim(); }).map(function (l) { return /^\s*/.exec(l)[0].length; }).concat([1e9]));
      var out = lines.map(function (l) {
        if (!l.trim()) return l;
        return all ? l.replace(/^(\s*)\/\/ ?/, '$1') : l.slice(0, minInd) + '// ' + l.slice(minInd);
      }).join('\n');
      replaceRange(ta, L.s, L.e, out);
      ta.setSelectionRange(L.s, L.s + out.length);
      return;
    }
    var o = ed.lang === 'css' ? '/* ' : '<!-- ', c = ed.lang === 'css' ? ' */' : ' -->';
    var s, e;
    if (a === b) { var L2 = selLines(ta); var ind = /^\s*/.exec(L2.text)[0].length; s = L2.s + ind; e = L2.e; } else { s = a; e = b; }
    var seg = v.slice(s, e);
    var re = ed.lang === 'css' ? /^\/\*\s?([\s\S]*?)\s?\*\/$/ : /^<!--\s?([\s\S]*?)\s?-->$/;
    var m = re.exec(seg);
    var out2 = m ? m[1] : o + seg + c;
    replaceRange(ta, s, e, out2);
    ta.setSelectionRange(s, s + out2.length);
  }
  function duplicateLine(ed) {
    var ta = ed.ta, L = selLines(ta), a = ta.selectionStart, b = ta.selectionEnd;
    ta.setSelectionRange(L.e, L.e);
    ins(ta, '\n' + L.text);
    var off = L.text.length + 1;
    ta.setSelectionRange(a + off, b + off);
  }

  // ---- emmet-lite (HTML tab, press Tab) ----
  var KNOWN = new Set(('a abbr address article aside audio b blockquote body br button canvas caption code col dd details dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hr html i iframe img input label legend li link main mark meta nav noscript object ol optgroup option output p picture pre progress q section select small source span strong style sub summary sup svg table tbody td template textarea tfoot th thead time title tr u ul video').split(' '));
  var IMPLICIT = { ul: 'li', ol: 'li', table: 'tr', tbody: 'tr', thead: 'tr', tr: 'td', select: 'option', dl: 'dt' };
  var DEFATTR = { a: ' href=""', img: ' src="" alt=""', input: ' type="text"', link: ' rel="stylesheet" href=""', script: ' src=""', form: ' action=""', label: ' for=""', iframe: ' src=""', video: ' src="" controls', audio: ' src="" controls' };
  var BOILER = '<!DOCTYPE html>\n<html lang="en">\n<head>\n' + '  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>\u0001Document</title>\n</head>\n<body>\n  \u0000\n</body>\n</html>';
  function emmet(ed) {
    var ta = ed.ta, v = ta.value, p = ta.selectionStart;
    var m = /[\w.#*>+\-!$:\[\]="]+$/.exec(v.slice(Math.max(0, p - 200), p));
    if (!m) return false;
    var abbr = m[0], start = p - abbr.length;
    if (start > 0 && /[<\/\w"'=]/.test(v.charAt(start - 1))) return false;
    if (insideTag(v, start)) return false;
    var base = /^[ \t]*/.exec(v.slice(lineStart(v, start), start))[0];
    var text;
    if (abbr === '!') text = BOILER.replace('\u0001', '');
    else {
      text = expandAbbr(abbr);
      if (text == null) return false;
      text = text.split('\n').map(function (l, i) { return i ? base + l : l; }).join('\n');
    }
    var cpos = text.indexOf('\u0000');
    var clean = text.replace(/[\u0000\u0001]/g, '');
    replaceRange(ta, start, p, clean);
    if (cpos >= 0) ta.setSelectionRange(start + cpos, start + cpos);
    return true;
  }
  function expandAbbr(abbr) {
    var parts = abbr.split(/([>+])/);
    var root = { kids: [] }, parent = root, last = null, stack = [];
    var special = /[.#*>+\[]/.test(abbr);
    for (var i = 0; i < parts.length; i += 2) {
      var tok = parts[i], op = parts[i - 1];
      if (!tok) return null;
      var m = /^([A-Za-z][\w-]*)?((?:[#.][\w$-]+|\[[^\]]*\])*)(?:\*(\d{1,3}))?$/.exec(tok);
      if (!m) return null;
      if (m[1] && !special && !KNOWN.has(m[1].toLowerCase())) return null;
      if (!m[1] && !m[2]) return null;
      if (op === '>' && last) { stack.push(parent); parent = last; }
      var el = { tag: m[1] || IMPLICIT[parent.tag] || 'div', mods: m[2] || '', n: +m[3] || 1, kids: [] };
      if (el.tag.toLowerCase() !== el.tag && !m[1]) el.tag = 'div';
      parent.kids.push(el); last = el;
    }
    var u = unit(), placed = false;
    function attrs(el, idx) {
      var id = '', cls = [], extra = '';
      (el.mods.match(/[#.][\w$-]+|\[[^\]]*\]/g) || []).forEach(function (mod) {
        var val = mod.slice(1).replace(/\$/g, idx);
        if (mod[0] === '#') id = val;
        else if (mod[0] === '.') cls.push(val);
        else extra += ' ' + mod.slice(1, -1).replace(/\$/g, idx).replace(/=([^"'][^\s]*)/g, '="$1"');
      });
      var s = (id ? ' id="' + id + '"' : '') + (cls.length ? ' class="' + cls.join(' ') + '"' : '') + extra;
      if (!extra && DEFATTR[el.tag]) s += DEFATTR[el.tag];
      if (!placed && /""/.test(s)) { s = s.replace('""', '"\u0000"'); placed = true; }
      return s;
    }
    function render(list, depth) {
      var lines = [];
      list.forEach(function (el) {
        for (var k = 1; k <= el.n; k++) {
          var pad = u.repeat(depth), a = attrs(el, k);
          if (window.PenFmt.VOID.has(el.tag)) { lines.push(pad + '<' + el.tag + a + '>'); continue; }
          if (el.kids.length) {
            lines.push(pad + '<' + el.tag + a + '>');
            lines = lines.concat(render(el.kids, depth + 1));
            lines.push(pad + '</' + el.tag + '>');
          } else {
            var inner = placed ? '' : '\u0000'; placed = true;
            lines.push(pad + '<' + el.tag + a + '>' + inner + '</' + el.tag + '>');
          }
        }
      });
      return lines;
    }
    return render(root.kids, 0).join('\n');
  }

  // ---- physical keyboard ----
  function keydown(ed, e) {
    var mod = e.ctrlKey || e.metaKey;
    if (e.key === 'Tab' && !mod && !e.altKey) { e.preventDefault(); doTab(ed, e.shiftKey); return; }
    if (mod && e.key === 'Enter') { e.preventDefault(); run(); return; }
    if (mod && (e.key === 's' || e.key === 'S')) { e.preventDefault(); if (cur.id) { saveCurrent(); toast('Saved'); } else bookmark(); return; }
    if (mod && e.key === '/') { e.preventDefault(); toggleComment(ed); return; }
    if (mod && !e.shiftKey && (e.key === 'f' || e.key === 'F')) { e.preventDefault(); openFind(); return; }
    if ((mod || e.altKey) && e.shiftKey && (e.key === 'f' || e.key === 'F')) { e.preventDefault(); formatTab(); return; }
    if (mod && (e.key === 'd' || e.key === 'D')) { e.preventDefault(); duplicateLine(ed); return; }
    if (e.key === 'Escape') { if (!$('#findBar').hidden) closeFind(); }
  }

  // ---- key row ----
  var SYMS = {
    html: ['<', '>', '/', '=', '"', "'", '!', '-', '{', '}', '(', ')', ';', ':', '.', '#', '&'],
    css: ['{', '}', ':', ';', '.', '#', '-', '%', '(', ')', '"', "'", ',', '>', '*', '!', '@'],
    js: ['{', '}', '(', ')', '[', ']', ';', '=', '=>', '.', '"', "'", '`', '$', '!', '&', '|', '+', '<', '>', ':', '?', ',']
  };
  function buildKeys(lang) {
    var k = $('#keys');
    if (lang === 'console') { k.hidden = true; return; }
    k.hidden = false;
    var h = '<button data-k="undo">' + icon('undo') + '</button><button data-k="redo">' + icon('redo') + '</button>' +
      '<button data-k="left">' + icon('left') + '</button><button data-k="right">' + icon('right') + '</button>' +
      '<button data-k="tab">' + icon('indent') + '</button><button data-k="untab">' + icon('outdent') + '</button><span class="sepk"></span>';
    SYMS[lang].forEach(function (s) { h += '<button data-s="' + escAttr(s) + '">' + esc(s) + '</button>'; });
    h += '<span class="sepk"></span><button class="w" data-k="fmt">Format</button><button class="w" data-k="cmt">Comment</button><button class="w" data-k="dup">Dup line</button><button class="w" data-k="find">Find</button>';
    k.innerHTML = h;
    k.scrollLeft = 0;
  }
  (function wireKeys() {
    var k = $('#keys'), sx = 0, moved = false;
    // keep the textarea focused (and the keyboard up) while tapping keys
    k.addEventListener('pointerdown', function (e) { sx = e.clientX; moved = false; if (e.target.closest('button')) e.preventDefault(); });
    k.addEventListener('pointermove', function (e) { if (Math.abs(e.clientX - sx) > 8) moved = true; });
    k.addEventListener('mousedown', function (e) { e.preventDefault(); });
    k.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || moved) return;
      var ed = eds[activeTab]; if (!ed) return;
      var ta = ed.ta, s = b.getAttribute('data-s'), a = b.getAttribute('data-k');
      if (document.activeElement !== ta) ta.focus({ preventScroll: true });
      if (s) { ins(ta, s); if (s.length === 1) afterChar(ed, s); return; }
      var p = ta.selectionStart;
      if (a === 'undo') { try { document.execCommand('undo'); } catch (x) {} }
      else if (a === 'redo') { try { document.execCommand('redo'); } catch (x) {} }
      else if (a === 'left') ta.setSelectionRange(Math.max(0, p - 1), Math.max(0, p - 1));
      else if (a === 'right') { var q = ta.selectionEnd === p ? p + 1 : ta.selectionEnd; ta.setSelectionRange(q, q); }
      else if (a === 'tab') doTab(ed, false);
      else if (a === 'untab') doTab(ed, true);
      else if (a === 'fmt') formatTab();
      else if (a === 'cmt') toggleComment(ed);
      else if (a === 'dup') duplicateLine(ed);
      else if (a === 'find') openFind();
    });
    // long-press ← → to repeat
    var rep = 0;
    k.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('[data-k="left"],[data-k="right"]'); if (!b) return;
      clearInterval(rep);
      var start = Date.now();
      rep = setInterval(function () { if (Date.now() - start > 400) b.click(); }, 60);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { k.addEventListener(ev, function () { clearInterval(rep); }); });
  })();

  // ---- tabs ----
  function showTab(t) {
    activeTab = t;
    $$('.tab').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-tab') === t); });
    Object.keys(eds).forEach(function (l) { eds[l].el.hidden = l !== t; });
    $('#console').hidden = t !== 'console';
    if (t === 'console') { conSeen(); $('#findBar').hidden = true; }
    else { paint(eds[t], true); if (!$('#findBar').hidden) findUpdate(); }
    buildKeys(t);
  }
  $$('.tab').forEach(function (b) { b.onclick = function () { showTab(b.getAttribute('data-tab')); }; });

  // ---- open / leave ----
  function loadIntoEditor(p) {
    cur = JSON.parse(JSON.stringify(p));
    ['html', 'css', 'js'].forEach(function (l) { eds[l].ta.value = cur[l] || ''; eds[l].ta.scrollTop = 0; eds[l].ta.scrollLeft = 0; eds[l].lines = 0; paint(eds[l], true); });
    closePreview(); clearConsole(true); closeFind();
    screen = 'editor';
    homeEl.classList.add('hidden'); editorEl.classList.remove('hidden');
    showTab(cur.tab && eds[cur.tab] ? cur.tab : 'html');
    updateHeader();
  }
  function openPen(p) {
    if (!p) return;
    if (screen === 'editor') saveCurrent();
    S.lastPen = p.id; saveSettings();
    loadIntoEditor(p);
  }
  function stashScratch() {
    var s = store.json('scratch', null);
    if (!hasContent(s)) return false;
    ensureFolder('Drafts');
    var d = new Date();
    s.id = newId(); s.folder = 'Drafts';
    s.name = 'Draft ' + d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) + ' ' + d.toTimeString().slice(0, 5);
    writePen(s);
    store.remove('scratch');
    return true;
  }
  function openScratch(fresh, html) {
    if (screen === 'editor') saveCurrent();
    var stashed = false;
    if (fresh) stashed = stashScratch();
    var s = fresh ? null : store.json('scratch', null);
    var p = s && typeof s === 'object' ? Object.assign(blankPen(), s, { id: null }) : blankPen();
    if (html != null) p.html = html;
    loadIntoEditor(p);
    if (html != null) saveCurrent();
    if (stashed) toast('Your previous scratch was saved to Drafts');
  }
  function leaveEditor() {
    saveCurrent();
    closePreview();
    cur = null;
    try { document.activeElement.blur(); } catch (e) {}
  }
  function updateHeader() {
    if (!cur) return;
    $('#penName').textContent = cur.id ? (cur.name || 'Untitled') : 'Scratch';
    $('#penSub').textContent = cur.id ? (cur.folder || 'Home') : 'not saved · tap ☆ to bookmark';
    var bb = $('#bookmarkBtn');
    bb.innerHTML = icon(cur.id ? 'bookmarkOn' : 'bookmark');
    bb.classList.toggle('on', !!cur.id);
    $('#twBtn').classList.toggle('on', !!cur.tw);
  }
  $('#backBtn').onclick = showHome;

  // ---- bookmark ----
  function suggestName() {
    var h = cur.html || '';
    var m = /<title[^>]*>([^<]{1,60})<\/title>/i.exec(h) || /<h1[^>]*>([^<]{1,60})<\/h1>/i.exec(h);
    return m ? cleanName(m[1]) : '';
  }
  function bookmark() {
    if (!cur) return;
    if (cur.id) {
      ui.menu(cur.name, [
        { id: 'rename', label: 'Rename', icon: 'edit' },
        { id: 'move', label: 'Move to folder', icon: 'move' },
        { id: 'dup', label: 'Save a copy', icon: 'copy' },
        '-',
        { id: 'remove', label: 'Remove bookmark', icon: 'trash', danger: true }
      ]).then(function (a) {
        if (a === 'rename') { saveCurrent(); renamePen(pens.get(cur.id)); }
        else if (a === 'move') pickFolder('Move “' + cur.name + '”', cur.folder).then(function (r) { if (r) { cur.folder = r.folder; saveCurrent(); updateHeader(); toast('Moved to ' + (r.folder || 'Home')); } });
        else if (a === 'dup') {
          saveCurrent();
          var c = JSON.parse(JSON.stringify(cur)); c.id = newId(); c.name = cur.name + ' copy'; writePen(c);
          openPen(c); toast('Now editing the copy');
        } else if (a === 'remove') ui.confirm('Remove bookmark?', 'The file is deleted from your bookmarks. The code stays open here as unsaved scratch.', 'Remove', true).then(function (ok) {
          if (!ok) return;
          saveCurrent();
          var id = cur.id;
          stashScratch();
          deletePen(id);
          cur.id = null; cur.name = ''; cur.folder = '';
          saveCurrent(); updateHeader(); toast('Bookmark removed');
        });
      });
      return;
    }
    ui.open('<h2>Bookmark this pen</h2><label class="field"><span>Name</span><input type="text" id="bmName" value="' + escAttr(suggestName()) + '" placeholder="Untitled" autocomplete="off" spellcheck="false"></label>' +
      '<label class="field"><span>Folder</span><select id="bmFolder">' + folderOptions(cwd) + '</select></label>' +
      '<div class="acts"><button class="btn" id="bmNo">Cancel</button><button class="btn primary" id="bmOk">Save</button></div>');
    wireFolderSelect($('#bmFolder'));
    setTimeout(function () { var i = $('#bmName'); i.focus(); i.select(); }, 60);
    function save() {
      var f = $('#bmFolder').value; if (f === '__new') f = '';
      cur.name = cleanName($('#bmName').value) || 'Untitled';
      cur.folder = f; cur.id = newId();
      store.remove('scratch');
      saveCurrent();
      S.lastPen = cur.id; saveSettings();
      ui.close(); updateHeader();
      toast('Bookmarked in ' + (f || 'Home'));
    }
    $('#bmNo').onclick = function () { ui.close(); };
    $('#bmOk').onclick = save;
    $('#bmName').onkeydown = function (e) { if (e.key === 'Enter') save(); };
  }
  $('#bookmarkBtn').onclick = bookmark;
  $('#penTitle').onclick = function () { if (cur && cur.id) { saveCurrent(); renamePen(pens.get(cur.id)); } else bookmark(); };
  $('#twBtn').onclick = function () {
    cur.tw = !cur.tw; updateHeader(); saveCurrent();
    toast(cur.tw ? 'Tailwind on (v' + S.twv + ', loads from CDN)' : 'Tailwind off');
    if (!$('#previewPane').hidden) run('keep');
  };

  // ---- more menu ----
  $('#moreBtn').onclick = function () {
    var inCode = !!eds[activeTab];
    ui.menu('', [
      inCode ? { id: 'fmt', label: 'Format ' + activeTab.toUpperCase(), icon: 'wand' } : null,
      inCode ? { id: 'fmtall', label: 'Format all tabs', icon: 'wand' } : null,
      inCode ? { id: 'find', label: 'Find & replace', icon: 'find' } : null,
      { id: 'split', label: 'Split pasted page into HTML / CSS / JS', icon: 'scissors' },
      { id: 'pen', label: 'Tailwind & libraries', icon: 'box' },
      { id: 'wrap', label: (S.wrap ? 'Turn off' : 'Turn on') + ' word wrap', icon: 'wrap' },
      '-',
      { id: 'copy', label: 'Copy as single HTML file', icon: 'copy' },
      { id: 'share', label: 'Share as HTML', icon: 'share' },
      '-',
      { id: 'settings', label: 'Settings', icon: 'gear' }
    ].filter(Boolean)).then(function (a) {
      if (a === 'fmt') formatTab();
      else if (a === 'fmtall') formatAll();
      else if (a === 'find') openFind();
      else if (a === 'split') splitPasted();
      else if (a === 'pen') penSettings();
      else if (a === 'wrap') { S.wrap = !S.wrap; saveSettings(); applySettings(); }
      else if (a === 'copy') { saveCurrent(); copyText(buildDoc(cur, true), 'HTML copied'); }
      else if (a === 'share') { saveCurrent(); shareText(cur.name || 'pen', buildDoc(cur, true)); }
      else if (a === 'settings') settingsSheet();
    });
  };

  function formatTab(lang) {
    var ed = eds[lang || activeTab]; if (!ed) return;
    var v = ed.ta.value; if (!v.trim()) return;
    var out;
    try { out = window.PenFmt[ed.lang](v, unit()); } catch (e) { toast('Could not format: ' + e.message); return; }
    if (out === v) { if (!lang) toast('Already tidy'); return; }
    var lineNo = v.slice(0, ed.ta.selectionStart).split('\n').length;
    setValueUndoable(ed.ta, out);
    var lines = out.split('\n'), pos = 0;
    for (var i = 0; i < Math.min(lineNo - 1, lines.length); i++) pos += lines[i].length + 1;
    ed.ta.setSelectionRange(pos, pos);
    if (!lang) toast('Formatted');
  }
  function formatAll() {
    var at = activeTab;
    ['html', 'css', 'js'].forEach(function (l) { if (eds[l].ta.value.trim()) { showTab(l); formatTab(l); } });
    showTab(at); toast('Formatted all tabs');
  }

  function splitPasted() {
    var h = eds.html.ta.value, css = [], js = [], libs = [], tw = false;
    if (!/<(style|script|link|html|head|body)\b/i.test(h)) { toast('Nothing to split — no <style>, <script> or page wrapper in HTML'); return; }
    h = h.replace(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi, function (m, body) { css.push(window.PenFmt.dedent(body)); return ''; });
    h = h.replace(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi, function (m, attrs, body) {
      var src = /\bsrc\s*=\s*["']?([^"'\s>]+)/i.exec(attrs);
      if (src) {
        if (/cdn\.tailwindcss\.com|@tailwindcss\/browser/.test(src[1])) tw = true; else libs.push(src[1]);
        return '';
      }
      if (/type\s*=\s*["']?(module|text\/template|text\/x-|application\/(ld\+)?json)/i.test(attrs)) return m;
      if (/tailwind\.config\s*=/.test(body)) { js.unshift('// Tailwind config (only used by Tailwind v3)\n' + window.PenFmt.dedent(body)); return ''; }
      js.push(window.PenFmt.dedent(body)); return '';
    });
    h = h.replace(/<link\b[^>]*>/gi, function (m) {
      if (!/rel\s*=\s*["']?stylesheet/i.test(m)) return /rel\s*=\s*["']?(preconnect|icon|manifest)/i.test(m) ? '' : m;
      var href = /href\s*=\s*["']?([^"'\s>]+)/i.exec(m); if (href) libs.push(href[1]); return '';
    });
    var body = /<body\b[^>]*>([\s\S]*?)(<\/body>|$)/i.exec(h);
    if (body) h = body[1];
    else h = h.replace(/<!doctype[^>]*>/i, '').replace(/<\/?html\b[^>]*>/gi, '').replace(/<head\b[^>]*>[\s\S]*?<\/head>/i, '');
    h = h.replace(/<\/?(head|body)\b[^>]*>/gi, '');
    var addCss = css.filter(function (s) { return s.trim(); }).join('\n\n'), addJs = js.filter(function (s) { return s.trim(); }).join('\n\n');
    function merge(ta, add) { if (!add) return; var v = ta.value.trim(); setValueUndoable(ta, (v ? v + '\n\n' : '') + add + '\n'); }
    setValueUndoable(eds.html.ta, window.PenFmt.dedent(h) + '\n');
    merge(eds.css.ta, addCss); merge(eds.js.ta, addJs);
    if (libs.length) { var have = (cur.libs || '').split('\n').filter(Boolean); libs.forEach(function (l) { if (have.indexOf(l) < 0) have.push(l); }); cur.libs = have.join('\n'); }
    if (tw) cur.tw = true;
    updateHeader(); saveCurrent(); showTab('html');
    toast('Split into tabs' + (libs.length ? ' · ' + libs.length + ' librar' + (libs.length > 1 ? 'ies' : 'y') + ' added' : '') + (tw ? ' · Tailwind on' : ''));
  }

  function penSettings() {
    ui.open('<h2>Tailwind & libraries</h2>' +
      '<div class="opt"><div class="ol">Tailwind CSS<small>Loads the Tailwind v' + S.twv + ' play CDN in the preview (needs internet). Change version in Settings.</small></div><label class="switch"><input type="checkbox" id="psTw"' + (cur.tw ? ' checked' : '') + '><i></i></label></div>' +
      '<label class="field" style="margin-top:12px"><span>External CSS / JS — one URL per line (.css → stylesheet, anything else → script)</span><textarea id="psLibs" spellcheck="false" autocapitalize="off" placeholder="https://cdn.jsdelivr.net/npm/animate.css@4/animate.min.css\nhttps://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js">' + esc(cur.libs || '') + '</textarea></label>' +
      '<div class="acts"><button class="btn primary" id="psOk">Done</button></div>');
    $('#psOk').onclick = function () {
      cur.tw = $('#psTw').checked; cur.libs = $('#psLibs').value.trim();
      ui.close(); updateHeader(); saveCurrent();
      if (!$('#previewPane').hidden) run('keep');
    };
  }

  // ---- find & replace ----
  var find = { cs: false, idx: -1, matches: [] };
  function openFind() {
    if (!eds[activeTab]) showTab('html');
    var fb = $('#findBar'); fb.hidden = false;
    var ta = eds[activeTab].ta, sel = ta.value.slice(ta.selectionStart, ta.selectionEnd);
    if (sel && sel.indexOf('\n') < 0) $('#findIn').value = sel;
    $('#findIn').focus(); $('#findIn').select();
    findUpdate();
  }
  function closeFind() { $('#findBar').hidden = true; find.matches = []; }
  function findUpdate() {
    var ed = eds[activeTab], q = $('#findIn').value;
    find.matches = [];
    if (ed && q) {
      var v = ed.ta.value, hay = find.cs ? v : v.toLowerCase(), needle = find.cs ? q : q.toLowerCase(), i = 0;
      while ((i = hay.indexOf(needle, i)) >= 0 && find.matches.length < 5000) { find.matches.push(i); i += needle.length || 1; }
    }
    var p = ed ? ed.ta.selectionStart : 0;
    find.idx = find.matches.findIndex(function (m) { return m >= p; });
    if (find.idx < 0 && find.matches.length) find.idx = 0;
    $('#findCount').textContent = find.matches.length ? (find.idx + 1) + '/' + find.matches.length : '0/0';
  }
  function findGo(dir) {
    var ed = eds[activeTab]; if (!ed) return;
    var q = $('#findIn').value;
    findUpdate();
    if (!find.matches.length) return;
    var ta = ed.ta, p = ta.selectionStart;
    if (dir > 0) { find.idx = find.matches.findIndex(function (m) { return m > p || (m === p && ta.selectionEnd === p); }); if (find.idx < 0) find.idx = 0; }
    else { find.idx = -1; for (var i = find.matches.length - 1; i >= 0; i--) if (find.matches[i] < p) { find.idx = i; break; } if (find.idx < 0) find.idx = find.matches.length - 1; }
    var a = find.matches[find.idx];
    ta.focus({ preventScroll: true });
    ta.setSelectionRange(a, a + q.length);
    scrollToPos(ed, a);
    $('#findCount').textContent = (find.idx + 1) + '/' + find.matches.length;
  }
  function scrollToPos(ed, pos) {
    var ta = ed.ta, v = ta.value, before = v.slice(0, pos), line = before.split('\n').length - 1;
    var col = pos - lineStart(v, pos), lh = S.fs * 1.55;
    ta.scrollTop = Math.max(0, line * lh - ta.clientHeight / 3);
    if (!S.wrap) ta.scrollLeft = Math.max(0, col * S.fs * 0.6 - ta.clientWidth / 2);
    syncScroll(ed);
  }
  function jumpToLine(lang, line) {
    showTab(lang);
    var ed = eds[lang], v = ed.ta.value, lines = v.split('\n'), pos = 0;
    for (var i = 0; i < Math.min(line - 1, lines.length - 1); i++) pos += lines[i].length + 1;
    ed.ta.focus({ preventScroll: true });
    ed.ta.setSelectionRange(pos, pos + (lines[line - 1] || '').length);
    scrollToPos(ed, pos);
  }
  $('#findIn').addEventListener('input', findUpdate);
  $('#findIn').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); findGo(e.shiftKey ? -1 : 1); } if (e.key === 'Escape') closeFind(); });
  $('#findNext').onclick = function () { findGo(1); };
  $('#findPrev').onclick = function () { findGo(-1); };
  $('#findClose').onclick = closeFind;
  $('#findCase').onclick = function () { find.cs = !find.cs; this.classList.toggle('on', find.cs); findUpdate(); };
  $('#replOne').onclick = function () {
    var ed = eds[activeTab]; if (!ed) return;
    var q = $('#findIn').value, r = $('#replIn').value, ta = ed.ta;
    var sel = ta.value.slice(ta.selectionStart, ta.selectionEnd);
    if (q && (find.cs ? sel === q : sel.toLowerCase() === q.toLowerCase())) ins(ta, r);
    findGo(1);
  };
  $('#replAll').onclick = function () {
    var ed = eds[activeTab]; if (!ed) return;
    var q = $('#findIn').value, r = $('#replIn').value; if (!q) return;
    var re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), find.cs ? 'g' : 'gi');
    var n = (ed.ta.value.match(re) || []).length; if (!n) return toast('No matches');
    setValueUndoable(ed.ta, ed.ta.value.replace(re, function () { return r; }));
    findUpdate(); toast('Replaced ' + n);
  };

  // ================= PREVIEW / RUN =================
  var frame = $('#frame'), pane = $('#previewPane'), work = $('#work'), runN = 0;
  var PRELUDE = '<script>(function(){var P=window.parent;' +
    'function f(v){try{if(v===undefined)return"undefined";if(v===null)return"null";var t=typeof v;if(t==="string")return v;if(t==="function")return"ƒ "+(v.name||"anonymous")+"()";if(t==="symbol"||t==="bigint")return String(v)+(t==="bigint"?"n":"");' +
    'if(v instanceof Error)return(v.name||"Error")+": "+v.message;if(typeof Node!=="undefined"&&v instanceof Node)return v.outerHTML?(v.outerHTML.length>400?v.outerHTML.slice(0,400)+"…":v.outerHTML):String(v.nodeName);' +
    'if(t==="object"){var seen=[];var rp=function(k,x){if(typeof x==="function")return"ƒ "+(x.name||"")+"()";if(x===undefined)return"undefined";if(typeof x==="object"&&x!==null){if(seen.indexOf(x)>=0)return"[Circular]";seen.push(x)}return x};var s=JSON.stringify(v,rp);if(s&&s.length>70){seen=[];s=JSON.stringify(v,rp,2)}if(s===undefined)return String(v);return(v.constructor&&v.constructor.name&&v.constructor.name!=="Object"&&v.constructor.name!=="Array"?v.constructor.name+" ":"")+s}return String(v)}catch(e){try{return String(v)}catch(e2){return"[object]"}}}' +
    'function send(t,a,x){try{var m={__pen:1,type:t,args:Array.prototype.map.call(a,f)};if(x)for(var k in x)m[k]=x[k];P.postMessage(m,"*")}catch(e){}}' +
    '["log","info","warn","error","debug"].forEach(function(k){var o=console[k];console[k]=function(){send(k,arguments);if(o)try{o.apply(console,arguments)}catch(e){}}});' +
    'console.table=function(){send("log",arguments)};console.clear=function(){send("clear",[])};' +
    'var tm={};console.time=function(l){tm[l||"default"]=performance.now()};console.timeEnd=function(l){l=l||"default";if(tm[l]!=null){send("log",[l+": "+(performance.now()-tm[l]).toFixed(2)+" ms"]);delete tm[l]}};' +
    'console.assert=function(c){if(!c)send("error",["Assertion failed: "].concat(Array.prototype.slice.call(arguments,1)))};' +
    'window.addEventListener("error",function(e){if(e.message==null)return;send("error",[e.message],{line:e.lineno||0,src:e.filename||""})});' +
    'window.addEventListener("unhandledrejection",function(e){send("error",["Uncaught (in promise) "+f(e.reason)])});' +
    'window.addEventListener("message",function(e){var d=e.data;if(d&&d.__penEval){try{var r=(0,eval)(d.code);send("log",[r],{ret:1})}catch(err){send("error",[String(err)])}}});' +
    'function mem(){var m={};return{getItem:function(k){return Object.prototype.hasOwnProperty.call(m,k)?m[k]:null},setItem:function(k,v){m[k]=String(v)},removeItem:function(k){delete m[k]},clear:function(){m={}},key:function(i){return Object.keys(m)[i]||null},get length(){return Object.keys(m).length}}}' +
    '["localStorage","sessionStorage"].forEach(function(n){try{window[n].length}catch(e){try{Object.defineProperty(window,n,{value:mem(),configurable:true})}catch(e2){}}});' +
    '})();<\/script>';

  function buildDoc(p, exporting) {
    var libs = (p.libs || '').split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    var bits = '';
    if (p.tw) bits += S.twv === '3' ? '<script src="https://cdn.tailwindcss.com"><\/script>' : '<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"><\/script>';
    libs.forEach(function (u) {
      if (/\.css([?#]|$)/i.test(u) || /fonts\.googleapis\.com\/css/i.test(u)) bits += '<link rel="stylesheet" href="' + escAttr(u) + '">';
      else bits += '<script src="' + escAttr(u) + '"><\/script>';
    });
    var cssTxt = p.css || '', jsTxt = p.js || '';
    var twCss = p.tw && /@(apply|theme|tailwind|layer|config|plugin|utility|variant|custom-variant|source)\b/.test(cssTxt);
    var css = cssTxt.trim() ? '<style' + (twCss ? ' type="text/tailwindcss"' : '') + '>\n' + cssTxt.replace(/<\/style/gi, '<\\/style') + '\n</style>' : '';
    var isMod = /^\s*(import|export)\s/m.test(jsTxt);
    var js = jsTxt.trim() ? '<script' + (isMod ? ' type="module"' : '') + '>' + jsTxt.replace(/<\/script/gi, '<\\/script') + (exporting ? '\n' : '\n//# sourceURL=pen.js\n') + '<\/script>' : '';
    var pre = exporting ? '' : PRELUDE;
    var html = p.html || '';
    if (/<html[\s>]|<!doctype/i.test(html)) {
      var headRe = /<head(\s[^>]*)?>/i, htmlRe = /<html(\s[^>]*)?>/i;
      if (headRe.test(html)) html = html.replace(headRe, function (m) { return m + pre + bits; });
      else if (htmlRe.test(html)) html = html.replace(htmlRe, function (m) { return m + '<head>' + pre + bits + '</head>'; });
      else html = html.replace(/<!doctype[^>]*>/i, function (m) { return m + pre + bits; });
      var lower = html.toLowerCase(), hi = lower.indexOf('</head>');
      if (hi >= 0) html = html.slice(0, hi) + css + html.slice(hi); else html = html.replace(/(<\/head>|<body[^>]*>)/i, function (m) { return css + m; });
      lower = html.toLowerCase();
      var bi = lower.lastIndexOf('</body>');
      if (bi < 0) bi = lower.lastIndexOf('</html>');
      html = bi >= 0 ? html.slice(0, bi) + js + html.slice(bi) : html + js;
      return markJs(html, js);
    }
    return markJs('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
      (exporting ? '<title>' + esc(p.name || 'Pen') + '</title>\n' : '') + pre + bits + css + '\n</head>\n<body>\n' + html + '\n' + js + '\n</body>\n</html>\n', js);
  }
  // remember which document line the JS tab starts on (for syntax-error line numbers)
  var jsLine = 0;
  function markJs(doc, js) {
    jsLine = 0;
    if (js) { var at = doc.lastIndexOf(js); if (at >= 0) jsLine = doc.slice(0, at + js.indexOf('>') + 1).split('\n').length; }
    return doc;
  }

  function run(mode) {
    if (!cur) return;
    saveCurrent();
    var full = mode === 'full' ? true : mode === 'split' ? false : mode === 'keep' ? pane.classList.contains('full') : $('#fsChk').checked;
    if (S.clearOnRun) clearConsole(true);
    runN++;
    frame.srcdoc = buildDoc(cur) + '<!-- run ' + runN + ' -->';
    showPreview(full);
  }
  function isSide() { return screen && window.screen && window.screen.width > window.screen.height && window.innerWidth >= 700; }
  function showPreview(full) {
    pane.hidden = false;
    if (full) {
      pane.classList.add('full'); work.classList.remove('split'); $('#divider').hidden = true;
      try { document.activeElement.blur(); } catch (e) {}
      if (B && S.immersive) try { B.setImmersive(TOKEN, true); } catch (e) {}
    } else {
      pane.classList.remove('full'); work.classList.add('split'); $('#divider').hidden = false;
      work.classList.toggle('side', isSide());
      if (B) try { B.setImmersive(TOKEN, false); } catch (e) {}
    }
  }
  function closePreview() {
    if (pane.hidden) return;
    pane.hidden = true; pane.classList.remove('full');
    work.classList.remove('split', 'side'); $('#divider').hidden = true;
    frame.removeAttribute('srcdoc'); frame.src = 'about:blank';
    if (B) try { B.setImmersive(TOKEN, false); } catch (e) {}
  }
  $('#runBtn').onclick = function () { run(); };
  $('#fsChk').onchange = function () { S.fullscreen = this.checked; saveSettings(); };
  $('#pvReload').onclick = $('#fsReload').onclick = function () { run('keep'); };
  $('#pvFull').onclick = function () { showPreview(true); };
  $('#fsSplit').onclick = function () { showPreview(false); };
  $('#pvClose').onclick = $('#fsClose').onclick = closePreview;
  window.addEventListener('resize', function () { if (!pane.hidden && !pane.classList.contains('full')) work.classList.toggle('side', isSide()); });

  (function divider() {
    var d = $('#divider'), drag = false;
    d.addEventListener('pointerdown', function (e) { drag = true; d.setPointerCapture(e.pointerId); frame.style.pointerEvents = 'none'; e.preventDefault(); });
    d.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var r = work.getBoundingClientRect(), side = work.classList.contains('side');
      var f = side ? (e.clientX - r.left) / r.width : (e.clientY - r.top) / r.height;
      f = Math.max(0.15, Math.min(0.85, f));
      S.split = Math.round(f * 100);
      work.style.setProperty('--split', S.split + '%');
    });
    function end() { if (!drag) return; drag = false; frame.style.pointerEvents = ''; saveSettings(); }
    d.addEventListener('pointerup', end); d.addEventListener('pointercancel', end);
  })();

  // ---- console ----
  var conCount = 0, conErr = 0, conN = 0;
  window.addEventListener('message', function (e) {
    if (e.source !== frame.contentWindow) return;
    var d = e.data; if (!d || !d.__pen) return;
    if (d.type === 'clear') { clearConsole(); return; }
    addLog(d.type, d.args || [], d);
  });
  function addLog(type, args, d) {
    var list = $('#conList');
    var empty = $('.conempty', list); if (empty) empty.remove();
    var row = document.createElement('div');
    row.className = 'cl ' + type;
    var txt = esc(args.join(' '));
    if (d && d.line) {
      if (/pen\.js$/.test(d.src || '')) txt += ' <span class="ln" data-l="js" data-n="' + d.line + '">JS line ' + d.line + '</span>';
      else if (jsLine && d.line >= jsLine && d.line - jsLine < eds.js.lines) txt += ' <span class="ln" data-l="js" data-n="' + (d.line - jsLine + 1) + '">JS line ' + (d.line - jsLine + 1) + '</span>';
      else txt += ' <span class="muted">(page line ' + d.line + ')</span>';
    }
    row.innerHTML = '<span class="k">' + (d && d.ret ? '←' : type === 'log' ? '' : type) + '</span><span class="v">' + txt + '</span>';
    var ln = $('.ln', row); if (ln) ln.onclick = function () { jumpToLine('js', +ln.getAttribute('data-n')); };
    list.appendChild(row);
    conN++;
    while (conN > 400) { list.removeChild(list.firstChild); conN--; }
    list.scrollTop = list.scrollHeight;
    if (activeTab !== 'console') { conCount++; if (type === 'error') conErr++; badge(); }
  }
  function badge() {
    var b = $('#conBadge');
    b.hidden = !conCount; b.textContent = conCount > 99 ? '99+' : conCount;
    b.className = conErr ? '' : 'info';
  }
  function conSeen() { conCount = 0; conErr = 0; badge(); }
  function clearConsole(silent) {
    $('#conList').innerHTML = '<div class="muted conempty">Console output from your preview shows up here.</div>';
    conN = 0; conSeen();
  }
  $('#conClear').onclick = function () { clearConsole(); };
  $('#conInput').addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var code = this.value.trim(); if (!code) return;
    if (pane.hidden) { addLog('sys', ['Run the pen first — the console talks to the live preview.']); return; }
    addLog('sys', ['› ' + code]);
    try { frame.contentWindow.postMessage({ __penEval: 1, code: code }, '*'); } catch (x) {}
    this.value = '';
  });

  // ================= share / copy =================
  function copyText(t, msg) {
    var ok = false;
    try { if (B) { B.copy(TOKEN, t); ok = true; } } catch (e) {}
    if (!ok) {
      try { navigator.clipboard.writeText(t); ok = true; } catch (e) {}
    }
    toast(ok ? msg : 'Copy failed');
  }
  function shareText(name, t) {
    try { if (B) { B.share(TOKEN, name, t); return; } } catch (e) {}
    if (navigator.share) navigator.share({ title: name, text: t }).catch(function () {});
    else copyText(t, 'Sharing not available — HTML copied instead');
  }

  // ================= settings =================
  function settingsSheet() {
    function sw(id, label, small, on) { return '<div class="opt"><div class="ol">' + label + (small ? '<small>' + small + '</small>' : '') + '</div><label class="switch"><input type="checkbox" id="' + id + '"' + (on ? ' checked' : '') + '><i></i></label></div>'; }
    function sel(id, label, small, val, opts) { return '<div class="opt"><div class="ol">' + label + (small ? '<small>' + small + '</small>' : '') + '</div><select id="' + id + '">' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (String(val) === String(o[0]) ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></div>'; }
    ui.open('<h2>Settings</h2>' +
      sel('sLaunch', 'When the app opens', 'Jump straight into the editor if you like', S.launch, [['home', 'Home screen'], ['scratch', 'Scratch editor'], ['last', 'Last opened file']]) +
      sw('sFull', 'Run in fullscreen', 'Same as the ⛶ tick next to Run', S.fullscreen) +
      sw('sAuto', 'Live preview', 'Re-run automatically while you type (when the preview is open)', S.autorun) +
      sw('sClear', 'Clear console on each run', '', S.clearOnRun) +
      sw('sImm', 'Hide status bar in fullscreen', '', S.immersive) +
      sel('sTw', 'Tailwind version', 'Play CDN, needs internet', S.twv, [['4', 'v4 (latest)'], ['3', 'v3']]) +
      '<div class="opt"><div class="ol">Font size</div><div class="stepper"><button class="ib sm" id="sFsM">A−</button><b id="sFs">' + S.fs + '</b><button class="ib sm" id="sFsP">A+</button></div></div>' +
      sw('sWrap', 'Word wrap', 'Line numbers hide while wrap is on', S.wrap) +
      sw('sLines', 'Line numbers', '', S.lines) +
      sw('sClose', 'Auto-close brackets, quotes & tags', 'Also: Tab expands div.card, ul>li*3, ! …', S.autoclose) +
      sel('sTab', 'Indent size', '', S.tab, [['2', '2 spaces'], ['4', '4 spaces']]) +
      sel('sTheme', 'Theme', '', S.theme, [['dark', 'Dark'], ['light', 'Light'], ['system', 'System']]) +
      '<p class="muted" style="font-size:12px;margin:14px 2px 0">Pocket Pen · your files are stored privately on this device.</p>');
    function bind(id, key, conv) { $('#' + id).onchange = function () { S[key] = conv ? conv(this) : this.checked; saveSettings(); applySettings(); }; }
    bind('sLaunch', 'launch', function (e) { return e.value; });
    bind('sFull', 'fullscreen'); bind('sAuto', 'autorun'); bind('sClear', 'clearOnRun'); bind('sImm', 'immersive');
    bind('sTw', 'twv', function (e) { return e.value; });
    bind('sWrap', 'wrap'); bind('sLines', 'lines'); bind('sClose', 'autoclose');
    bind('sTab', 'tab', function (e) { return +e.value; });
    bind('sTheme', 'theme', function (e) { return e.value; });
    function fs(d) { S.fs = Math.max(10, Math.min(24, S.fs + d)); $('#sFs').textContent = S.fs; saveSettings(); applySettings(); }
    $('#sFsM').onclick = function () { fs(-1); }; $('#sFsP').onclick = function () { fs(1); };
  }

  // ================= back / lifecycle =================
  function back() {
    if (ui.isOpen()) { ui.close(null); return true; }
    if (!$('#toast').hidden) $('#toast').hidden = true;
    if (screen === 'editor') {
      if (pane.classList.contains('full')) { if (work.classList.contains('split') || $('#fsChk').checked === false) showPreview(false); else closePreview(); return true; }
      if (!$('#findBar').hidden) { closeFind(); return true; }
      if (!pane.hidden) { closePreview(); return true; }
      showHome(); return true;
    }
    if ($('#search').value) { $('#search').value = ''; renderHome(); return true; }
    if (cwd) { cwd = parentOf(cwd); renderHome(); return true; }
    return false;
  }
  function takeStart() {
    var st = { action: '', text: null };
    try { if (B) { st = JSON.parse(B.takeStart(TOKEN) || '{}'); } } catch (e) {}
    if (!B && location.hash === '#new') st.action = 'new';
    return st;
  }
  function onIntent() {
    var st = takeStart();
    if (!st.action) return;
    ui.close(null);
    if (st.action === 'new') openScratch(true);
    else if (st.action === 'shared') { openScratch(true, st.text || ''); toast('Pasted into a new scratch pen', 'Split into tabs', splitPasted); }
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden && screen === 'editor') saveCurrent(); });
  window.addEventListener('pagehide', function () { if (screen === 'editor') saveCurrent(); });
  if (window.matchMedia) try { matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () { if (S.theme === 'system') applySettings(); }); } catch (e) {}

  window.App = {
    back: back,
    flush: function () { if (screen === 'editor') saveCurrent(); return true; },
    onIntent: onIntent,
    _debug: { buildDoc: function (p) { return buildDoc(p || cur); }, get cur() { return cur; }, eds: eds, run: run, emmet: expandAbbr }
  };

  // ================= init =================
  paintIcons();
  applySettings();
  loadData();
  var st = takeStart();
  if (st.action === 'new') openScratch(true);
  else if (st.action === 'shared') { openScratch(true, st.text || ''); toast('Pasted into a new scratch pen', 'Split into tabs', splitPasted); }
  else if (S.launch === 'scratch') openScratch(false);
  else if (S.launch === 'last' && S.lastPen && pens.has(S.lastPen)) openPen(pens.get(S.lastPen));
  else showHome();
})();
