package com.pocketpen.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * Pocket Pen: a WebView shell around the editor in assets/index.html.
 * The page talks to this activity through the "Android" JavaScript bridge,
 * which stores pens, folders and settings as small files in app storage.
 */
public class MainActivity extends Activity {

    static final String HOME_URL = "file:///android_asset/index.html";
    static final String ACTION_NEW = "com.pocketpen.app.NEW";

    private WebView web;
    private File storeDir;
    private String token;
    private boolean tokenIssued = false;
    private String startAction = "";
    private String startText = null;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window w = getWindow();
        w.setStatusBarColor(Color.parseColor("#151821"));
        w.setNavigationBarColor(Color.parseColor("#151821"));

        storeDir = new File(getFilesDir(), "store");
        if (!storeDir.exists()) storeDir.mkdirs();

        byte[] b = new byte[24];
        new SecureRandom().nextBytes(b);
        StringBuilder sb = new StringBuilder();
        for (byte x : b) sb.append(String.format("%02x", x));
        token = sb.toString();

        if (0 != (getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE)) {
            WebView.setWebContentsDebuggingEnabled(true);
        }

        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#0e1016"));
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setTextZoom(100);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);

        web.addJavascriptInterface(new Bridge(), "Android");
        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                if (!req.isForMainFrame()) return false;
                String url = req.getUrl().toString();
                if (url.startsWith(HOME_URL)) return false;
                openExternal(url);
                return true;
            }

            @Override
            public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
                // a fresh load of the app page may ask for the bridge token again
                if (url != null && url.startsWith(HOME_URL)) tokenIssued = false;
                super.onPageStarted(view, url, favicon);
            }
        });

        readIntent(getIntent());
        web.loadUrl(HOME_URL);
    }

    private void readIntent(Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        if (Intent.ACTION_SEND.equals(action)) {
            CharSequence t = intent.getCharSequenceExtra(Intent.EXTRA_TEXT);
            if (t != null) {
                startAction = "shared";
                startText = t.toString();
            }
        } else if (ACTION_NEW.equals(action)) {
            startAction = "new";
            startText = null;
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        readIntent(intent);
        if (!startAction.isEmpty() && web != null) {
            web.evaluateJavascript("window.App && App.onIntent()", null);
        }
    }

    @Override
    public void onBackPressed() {
        if (web == null) { super.onBackPressed(); return; }
        web.evaluateJavascript("window.App ? App.back() : false", value -> {
            if (!"true".equals(value)) moveTaskToBack(true);
        });
    }

    @Override
    protected void onPause() {
        if (web != null) web.evaluateJavascript("window.App && App.flush()", null);
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        if (web != null) {
            web.destroy();
            web = null;
        }
        super.onDestroy();
    }

    private void openExternal(String url) {
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
        } catch (ActivityNotFoundException e) {
            Toast.makeText(this, "No app can open this link", Toast.LENGTH_SHORT).show();
        }
    }

    // ---------------- storage helpers ----------------

    private File fileFor(String key) throws IOException {
        String name = URLEncoder.encode(key, "UTF-8");
        if (name.length() > 200) throw new IOException("key too long");
        return new File(storeDir, name);
    }

    private static String readAll(File f) throws IOException {
        try (InputStream in = new FileInputStream(f)) {
            byte[] buf = new byte[(int) f.length()];
            int off = 0;
            while (off < buf.length) {
                int n = in.read(buf, off, buf.length - off);
                if (n < 0) break;
                off += n;
            }
            return new String(buf, 0, off, StandardCharsets.UTF_8);
        }
    }

    private boolean immersive = false;
    private boolean lightBars = false;

    private void applyBars() {
        View d = getWindow().getDecorView();
        int flags = View.SYSTEM_UI_FLAG_VISIBLE;
        if (immersive) {
            flags = View.SYSTEM_UI_FLAG_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
        } else if (lightBars) {
            flags = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
        }
        d.setSystemUiVisibility(flags);
    }

    // ---------------- JavaScript bridge ----------------

    /** Every call must carry the token handed to the app page at start-up, so
     *  code running inside a preview iframe cannot touch saved files. */
    class Bridge {
        private boolean ok(String t) {
            return t != null && t.equals(token);
        }

        @JavascriptInterface
        public synchronized String token() {
            if (tokenIssued) return "";
            tokenIssued = true;
            return token;
        }

        @JavascriptInterface
        public String get(String t, String key) {
            if (!ok(t)) return null;
            try {
                File f = fileFor(key);
                return f.exists() ? readAll(f) : null;
            } catch (IOException e) {
                return null;
            }
        }

        @JavascriptInterface
        public synchronized boolean set(String t, String key, String value) {
            if (!ok(t) || value == null) return false;
            try {
                File f = fileFor(key);
                File tmp = new File(storeDir, f.getName() + ".tmp");
                try (OutputStream out = new FileOutputStream(tmp)) {
                    out.write(value.getBytes(StandardCharsets.UTF_8));
                }
                if (!tmp.renameTo(f)) {
                    f.delete();
                    return tmp.renameTo(f);
                }
                return true;
            } catch (IOException e) {
                return false;
            }
        }

        @JavascriptInterface
        public boolean remove(String t, String key) {
            if (!ok(t)) return false;
            try {
                File f = fileFor(key);
                return !f.exists() || f.delete();
            } catch (IOException e) {
                return false;
            }
        }

        @JavascriptInterface
        public String keys(String t, String prefix) {
            JSONArray arr = new JSONArray();
            if (!ok(t)) return arr.toString();
            String[] names = storeDir.list();
            if (names != null) {
                for (String n : names) {
                    if (n.endsWith(".tmp")) continue;
                    try {
                        String k = URLDecoder.decode(n, "UTF-8");
                        if (prefix == null || k.startsWith(prefix)) arr.put(k);
                    } catch (Exception ignored) {
                    }
                }
            }
            return arr.toString();
        }

        @JavascriptInterface
        public String takeStart(String t) {
            JSONObject o = new JSONObject();
            if (!ok(t)) return o.toString();
            try {
                o.put("action", startAction);
                if (startText != null) o.put("text", startText);
            } catch (Exception ignored) {
            }
            startAction = "";
            startText = null;
            return o.toString();
        }

        @JavascriptInterface
        public void setImmersive(String t, boolean on) {
            if (!ok(t)) return;
            runOnUiThread(() -> {
                immersive = on;
                applyBars();
            });
        }

        /** Match the system bars to the app theme ("#rrggbb", light = dark icons). */
        @JavascriptInterface
        public void setBars(String t, String color, boolean light) {
            if (!ok(t)) return;
            runOnUiThread(() -> {
                try {
                    int c = Color.parseColor(color);
                    getWindow().setStatusBarColor(c);
                    getWindow().setNavigationBarColor(c);
                    web.setBackgroundColor(c);
                } catch (Exception ignored) {
                }
                lightBars = light;
                applyBars();
            });
        }

        @JavascriptInterface
        public void copy(String t, String text) {
            if (!ok(t)) return;
            runOnUiThread(() -> {
                ClipboardManager cm = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                if (cm != null) cm.setPrimaryClip(ClipData.newPlainText("Pocket Pen", text));
            });
        }

        @JavascriptInterface
        public void share(String t, String subject, String text) {
            if (!ok(t)) return;
            runOnUiThread(() -> {
                Intent i = new Intent(Intent.ACTION_SEND);
                i.setType("text/plain");
                i.putExtra(Intent.EXTRA_SUBJECT, subject);
                i.putExtra(Intent.EXTRA_TEXT, text);
                try {
                    startActivity(Intent.createChooser(i, "Share " + subject));
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "Could not share", Toast.LENGTH_SHORT).show();
                }
            });
        }

        /** GitHub API / device-flow request run off the UI thread. The result is
         *  handed back to PenGH._http(id, status, body); status 0 means no connection. */
        @JavascriptInterface
        public void http(String t, String id, String method, String url, String headersJson, String body) {
            if (!ok(t) || id == null) return;
            new Thread(() -> {
                int status = 0;
                String out;
                try {
                    Map<String, String> h = new HashMap<>();
                    JSONObject o = new JSONObject(headersJson == null || headersJson.isEmpty() ? "{}" : headersJson);
                    for (Iterator<String> it = o.keys(); it.hasNext(); ) {
                        String k = it.next();
                        h.put(k, o.getString(k));
                    }
                    GitHubHttp.Result r = GitHubHttp.request(method, url, h, body);
                    status = r.status;
                    out = r.body;
                } catch (Exception e) {
                    out = String.valueOf(e.getMessage());
                }
                final String js = "window.PenGH && PenGH._http(" + JSONObject.quote(id) + "," + status + "," + JSONObject.quote(out) + ")";
                runOnUiThread(() -> { if (web != null) web.evaluateJavascript(js, null); });
            }).start();
        }

        @JavascriptInterface
        public void openUrl(String t, String url) {
            if (!ok(t)) return;
            runOnUiThread(() -> openExternal(url));
        }
    }
}
