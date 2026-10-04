/* Code Lantern — GitHub client (no UI). Talks to GitHub through the Android bridge
   (device flow endpoints don't allow browser CORS), or plain fetch in a desktop browser. */
(function () {
  'use strict';

  var B = null, TOKEN = '', pending = {}, seq = 0;
  var enc = new TextEncoder();
  var TEXT_EXT = /\.(html?|css|m?js|cjs|jsx|tsx?|json|md|txt|svg|xml|csv|ya?ml|sh|toml)$/i;
  var MAX_FILE = 400000;

  function init(bridge, token) { B = bridge; TOKEN = token; }

  // ---------- transport ----------
  function http(method, url, headers, body) {
    return new Promise(function (resolve, reject) {
      if (B && B.http) {
        var id = 'h' + (++seq);
        pending[id] = resolve;
        try { B.http(TOKEN, id, method, url, JSON.stringify(headers || {}), body == null ? '' : body); }
        catch (e) { delete pending[id]; reject(e); }
        return;
      }
      fetch(url, { method: method, headers: headers, body: body == null ? undefined : body })
        .then(function (r) { return r.text().then(function (t) { resolve({ status: r.status, body: t }); }); }, reject);
    });
  }
  function deliver(id, status, body) { var r = pending[id]; if (r) { delete pending[id]; r({ status: status, body: body }); } }

  function parse(r) { var j = null; try { j = JSON.parse(r.body); } catch (e) {} return { status: r.status, json: j, text: r.body }; }
  function fail(r, j) {
    if (r.status === 0) return new Error('No connection: ' + r.text);
    var e = new Error((j && (j.message || j.error_description)) || ('GitHub error ' + r.status));
    e.status = r.status; return e;
  }

  function api(token, method, path, body, accept) {
    var h = { 'Accept': accept || 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
    if (token) h.Authorization = 'Bearer ' + token;
    if (body !== undefined) h['Content-Type'] = 'application/json';
    var url = 'https://api.github.com' + path, payload = body === undefined ? null : JSON.stringify(body);
    function go(tries) {
      return http(method, url, h, payload).then(function (raw) {
        var r = parse(raw);
        if (r.status >= 200 && r.status < 300) return accept ? r.text : r.json;
        if (r.status === 0 && method === 'GET' && tries > 0) return new Promise(function (ok) { setTimeout(ok, 1200); }).then(function () { return go(tries - 1); });
        throw fail(r, r.json);
      });
    }
    return go(2);
  }

  // ---------- device flow ----------
  function form(o) { return Object.keys(o).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(o[k]); }).join('&'); }
  function postForm(url, o) {
    return http('POST', url, { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' }, form(o)).then(parse);
  }
  function deviceStart(clientId, scope) {
    return postForm('https://github.com/login/device/code', { client_id: clientId, scope: scope || 'repo' }).then(function (r) {
      if (r.json && r.json.device_code) return r.json;
      if (r.status === 0) throw new Error('No connection: ' + r.text);
      var msg = r.json && (r.json.error_description || r.json.error);
      if (r.json && r.json.error === 'device_flow_disabled') msg = 'Device flow is off for this OAuth app — tick “Enable Device Flow” in its settings.';
      var e = new Error(msg || ('GitHub error ' + r.status)); e.status = r.status; throw e;
    });
  }
  // resolves with an access token; rejects with {cancelled:true} or an Error
  function devicePoll(clientId, dev, isCancelled) {
    var interval = Math.max(5, dev.interval || 5), deadline = Date.now() + (dev.expires_in || 900) * 1000, flaky = 0;
    return new Promise(function (resolve, reject) {
      function tick() {
        if (isCancelled()) return reject({ cancelled: true });
        if (Date.now() > deadline) return reject(new Error('The code expired — start again.'));
        postForm('https://github.com/login/oauth/access_token', {
          client_id: clientId, device_code: dev.device_code, grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
        }).then(function (r) {
          if (isCancelled()) return reject({ cancelled: true });
          var j = r.json || {};
          // no reply at all (e.g. the phone's network was paused while you were in the browser) or a GitHub hiccup: try again
          if (!j.access_token && !j.error && (r.status === 0 || r.status >= 500)) {
            if (++flaky > 12) return reject(new Error(r.status === 0 ? 'No connection: ' + r.text : 'GitHub error ' + r.status));
            return setTimeout(tick, interval * 1000);
          }
          flaky = 0;
          if (j.access_token) return resolve(j.access_token);
          if (j.error === 'authorization_pending') return setTimeout(tick, interval * 1000);
          if (j.error === 'slow_down') { interval = j.interval || interval + 5; return setTimeout(tick, interval * 1000); }
          if (j.error === 'access_denied') return reject(new Error('Sign-in was cancelled on GitHub.'));
          if (j.error === 'expired_token') return reject(new Error('The code expired — start again.'));
          reject(new Error(j.error_description || j.error || ('GitHub error ' + r.status + (r.text ? ': ' + r.text.slice(0, 120) : ''))));
        }, function () { setTimeout(tick, interval * 1000); });   // transient network error: keep trying
      }
      setTimeout(tick, interval * 1000);
    });
  }

  // ---------- helpers ----------
  function refPath(branch) { return branch.split('/').map(encodeURIComponent).join('/'); }
  function filePath(p) { return p.split('/').map(encodeURIComponent).join('/'); }
  function validRepo(s) { return /^[\w.-]+\/[\w.-]+$/.test(s); }

  function sha1hex(bytes) {
    var l = bytes.length, n = (((l + 8) >>> 6) + 1) << 6, buf = new Uint8Array(n);
    buf.set(bytes); buf[l] = 0x80;
    var dv = new DataView(buf.buffer);
    dv.setUint32(n - 8, Math.floor(l / 0x20000000)); dv.setUint32(n - 4, (l << 3) >>> 0);
    var h = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0], w = new Array(80), i, o;
    for (o = 0; o < n; o += 64) {
      for (i = 0; i < 16; i++) w[i] = dv.getUint32(o + i * 4);
      for (i = 16; i < 80; i++) { var x = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]; w[i] = ((x << 1) | (x >>> 31)) >>> 0; }
      var a = h[0], b = h[1], c = h[2], d = h[3], e = h[4];
      for (i = 0; i < 80; i++) {
        var f, k;
        if (i < 20) { f = (b & c) | (~b & d); k = 0x5A827999; }
        else if (i < 40) { f = b ^ c ^ d; k = 0x6ED9EBA1; }
        else if (i < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8F1BBCDC; }
        else { f = b ^ c ^ d; k = 0xCA62C1D6; }
        var t = (((a << 5) | (a >>> 27)) + f + e + k + w[i]) >>> 0;
        e = d; d = c; c = ((b << 30) | (b >>> 2)) >>> 0; b = a; a = t;
      }
      h[0] = (h[0] + a) >>> 0; h[1] = (h[1] + b) >>> 0; h[2] = (h[2] + c) >>> 0; h[3] = (h[3] + d) >>> 0; h[4] = (h[4] + e) >>> 0;
    }
    return h.map(function (x) { return ('00000000' + x.toString(16)).slice(-8); }).join('');
  }
  // the id git itself gives a file with this text
  function blobSha(text) {
    var body = enc.encode(text), head = enc.encode('blob ' + body.length + '\0'), all = new Uint8Array(head.length + body.length);
    all.set(head); all.set(body, head.length);
    return sha1hex(all);
  }
  function decodeBlob(b64) {   // null when the file isn't valid UTF-8 text
    try {
      var bin = atob(b64.replace(/\s/g, '')), bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return new TextDecoder('utf-8', { fatal: true }).decode(bytes).replace(/\r\n/g, '\n');
    } catch (e) { return null; }
  }
  function isTextPath(path, size) {
    return TEXT_EXT.test(path) && (size == null || size <= MAX_FILE) && !/(^|\/)(node_modules|\.git)\//.test(path);
  }
  function pool(items, n, fn) {
    var i = 0, out = new Array(items.length);
    function worker() { if (i >= items.length) return Promise.resolve(); var k = i++; return Promise.resolve(fn(items[k], k)).then(function (v) { out[k] = v; return worker(); }); }
    var ws = []; for (var j = 0; j < Math.min(n, items.length); j++) ws.push(worker());
    return Promise.all(ws).then(function () { return out; });
  }

  // ---------- API calls ----------
  function me(token) { return api(token, 'GET', '/user'); }
  function listRepos(token) { return api(token, 'GET', '/user/repos?per_page=100&sort=pushed&affiliation=owner,collaborator,organization_member'); }
  function repoInfo(token, repo) { return api(token, 'GET', '/repos/' + repo); }
  function branches(token, repo) { return api(token, 'GET', '/repos/' + repo + '/branches?per_page=100'); }
  function headOf(token, repo, branch) { return api(token, 'GET', '/repos/' + repo + '/git/ref/heads/' + refPath(branch)).then(function (r) { return r.object.sha; }); }
  function treeAt(token, repo, commitSha) {
    return api(token, 'GET', '/repos/' + repo + '/git/commits/' + commitSha).then(function (c) {
      return api(token, 'GET', '/repos/' + repo + '/git/trees/' + c.tree.sha + '?recursive=1');
    }).then(function (t) {
      return { truncated: !!t.truncated, files: t.tree.filter(function (e) { return e.type === 'blob' && isTextPath(e.path, e.size); }), skipped: t.tree.filter(function (e) { return e.type === 'blob' && !isTextPath(e.path, e.size); }).length };
    });
  }
  function blob(token, repo, sha) {
    return api(token, 'GET', '/repos/' + repo + '/git/blobs/' + sha).then(function (b) { return b.encoding === 'base64' ? decodeBlob(b.content) : b.content; });
  }
  function fileAt(token, repo, path, ref) {
    return api(token, 'GET', '/repos/' + repo + '/contents/' + filePath(path) + '?ref=' + encodeURIComponent(ref), undefined, 'application/vnd.github.raw+json')
      .then(function (t) { return t.replace(/\r\n/g, '\n'); });
  }
  function history(token, repo, branch, path) {
    var q = '/repos/' + repo + '/commits?per_page=30&sha=' + encodeURIComponent(branch) + (path ? '&path=' + encodeURIComponent(path) : '');
    return api(token, 'GET', q).then(function (list) {
      return list.map(function (c) {
        return { sha: c.sha, message: (c.commit.message || '').split('\n')[0], date: Date.parse(c.commit.author && c.commit.author.date || c.commit.committer.date), author: (c.author && c.author.login) || (c.commit.author && c.commit.author.name) || '' };
      });
    });
  }
  // changes: [{path, content}] → {commit, blobs: {path: blobSha}}
  function commitFiles(token, repo, branch, changes, message) {
    var base = '/repos/' + repo + '/git/', head, blobs = {};
    return headOf(token, repo, branch).then(function (sha) {
      head = sha; return api(token, 'GET', base + 'commits/' + head);
    }).then(function (c) {
      return pool(changes, 3, function (ch) {
        return api(token, 'POST', base + 'blobs', { content: ch.content, encoding: 'utf-8' }).then(function (b) { blobs[ch.path] = b.sha; return { path: ch.path, mode: '100644', type: 'blob', sha: b.sha }; });
      }).then(function (entries) { return api(token, 'POST', base + 'trees', { base_tree: c.tree.sha, tree: entries }); });
    }).then(function (t) {
      return api(token, 'POST', base + 'commits', { message: message, tree: t.sha, parents: [head] });
    }).then(function (c) {
      return api(token, 'PATCH', base + 'refs/heads/' + refPath(branch), { sha: c.sha, force: false }).then(function () { return { commit: c.sha, blobs: blobs }; });
    });
  }

  window.PenGH = {
    init: init, _http: deliver, http: http, api: api,
    deviceStart: deviceStart, devicePoll: devicePoll,
    me: me, listRepos: listRepos, repoInfo: repoInfo, branches: branches, headOf: headOf, treeAt: treeAt,
    blob: blob, fileAt: fileAt, history: history, commitFiles: commitFiles,
    blobSha: blobSha, sha1hex: sha1hex, isTextPath: isTextPath, validRepo: validRepo, pool: pool
  };
})();
