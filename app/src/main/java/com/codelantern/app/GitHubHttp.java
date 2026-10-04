package com.codelantern.app;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.ProtocolException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.function.Predicate;

/** Minimal HTTPS client for the GitHub API. Only talks to GitHub hosts, and
 *  re-checks the host on every redirect so a token is never sent elsewhere. */
final class GitHubHttp {

    static final class Result {
        final int status;
        final String body;
        Result(int status, String body) { this.status = status; this.body = body; }
    }

    static boolean isGitHub(URL u) {
        String h = u.getHost();
        return "https".equals(u.getProtocol()) && ("api.github.com".equals(h) || "github.com".equals(h));
    }

    static Result request(String method, String url, Map<String, String> headers, String body) throws IOException {
        return request(GitHubHttp::isGitHub, method, url, headers, body);
    }

    static Result request(Predicate<URL> allowed, String method, String url, Map<String, String> headers, String body) throws IOException {
        for (int hop = 0; hop < 4; hop++) {
            URL u = new URL(url);
            if (!allowed.test(u)) throw new IOException("Blocked host: " + u.getHost());
            HttpURLConnection c = (HttpURLConnection) u.openConnection();
            try {
                c.setConnectTimeout(20000);
                c.setReadTimeout(40000);
                c.setInstanceFollowRedirects(false);
                try {
                    c.setRequestMethod(method);
                } catch (ProtocolException e) {
                    // some HttpURLConnection builds refuse PATCH; GitHub honours the override header
                    c.setRequestMethod("POST");
                    c.setRequestProperty("X-HTTP-Method-Override", method);
                }
                c.setRequestProperty("User-Agent", "CodeLantern");
                if (headers != null) for (Map.Entry<String, String> e : headers.entrySet()) c.setRequestProperty(e.getKey(), e.getValue());
                if (body != null && !body.isEmpty()) {
                    byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
                    c.setDoOutput(true);
                    c.setFixedLengthStreamingMode(bytes.length);
                    try (OutputStream out = c.getOutputStream()) { out.write(bytes); }
                } else if (!"GET".equals(method)) {
                    c.setDoOutput(true);
                    c.setFixedLengthStreamingMode(0);
                    c.getOutputStream().close();
                }
                int status = c.getResponseCode();
                if (status >= 300 && status < 400 && c.getHeaderField("Location") != null && ("GET".equals(method) || status == 307 || status == 308)) {
                    url = new URL(u, c.getHeaderField("Location")).toString();
                    continue;
                }
                InputStream in = status >= 400 ? c.getErrorStream() : c.getInputStream();
                return new Result(status, in == null ? "" : readAll(in));
            } finally {
                c.disconnect();
            }
        }
        throw new IOException("Too many redirects");
    }

    private static String readAll(InputStream in) throws IOException {
        try (InputStream i = in) {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[8192];
            int n;
            while ((n = i.read(buf)) >= 0) out.write(buf, 0, n);
            return new String(out.toByteArray(), StandardCharsets.UTF_8);
        }
    }
}
