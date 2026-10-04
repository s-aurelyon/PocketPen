# Code Lantern

A tiny CodePen / JSFiddle for Android. Paste or write HTML, CSS and JS (Tailwind optional), hit **Run**, and see it half-screen under your code or fullscreen.

## Get the APK (no Android Studio needed)

1. Create a new repository on GitHub (private is fine) and upload everything in this folder, including the hidden `.github` folder.
   - Easiest from a computer: `git init && git add . && git commit -m "Code Lantern" && git branch -M main && git remote add origin <your repo URL> && git push -u origin main`
2. Open the repo's **Actions** tab. The "Build APK" job starts automatically and takes about 3–5 minutes.
3. When it's green, open the repo's **Releases** page on your phone and download **CodeLantern.apk** from the "Code Lantern (latest build)" release.
4. Tap the file to install. Android will ask you to allow installs from your browser or file manager the first time.

Every push rebuilds the APK. All builds are signed with the same key (`pocketpen.keystore`), so a new build installs over the old one and your saved files stay.

> **Upgrading from Pocket Pen:** Code Lantern has a new app id (`com.codelantern.app`), so it installs as a separate app and does not see the old app's files. Before uninstalling Pocket Pen, open each pen and use ⋮ → *Copy as single HTML file* (or share it), then paste it into Code Lantern. From here on, updates install over each other as before.

**Or with Android Studio:** open this folder, let Gradle sync, plug in your phone and press Run.

## Features

**Home**
- Your bookmarked files and folders, with search, sort (recent or name), and breadcrumbs
- **New file** (pick a name, folder, and a starter: blank, HTML page, Tailwind, canvas)
- **Folder** creates a folder inside the one you're in
- **Scratch** opens a quick unsaved editor
- Long-press or ⋮ on any item: rename, move, duplicate, copy/share as a single HTML file, delete

**Editor**
- HTML / CSS / JS tabs with syntax highlighting and line numbers
- ☆ **Bookmark** saves the pen (name + folder). After that it autosaves as you type. Unbookmarked scratch code is also kept, and shows on Home as "Unsaved scratch"
- **TW** toggles Tailwind (v4 or v3 Play CDN, needs internet)
- Symbol key row above the keyboard: undo/redo, cursor ← →, indent/outdent, the brackets and symbols for the current language, Format, Comment, Duplicate line, Find
- Auto-closing brackets, quotes and HTML tags, and smart indent on Enter
- Emmet-style shortcuts in HTML: type `div.card`, `ul>li*3`, `a`, `img` or `!` then tap the indent key (or Tab on a keyboard)
- Format the current tab or all tabs; find & replace
- **Split pasted page**: paste a whole HTML file into the HTML tab and it moves `<style>` to CSS, inline `<script>` to JS, and CDN links into the pen's libraries
- Tailwind & libraries: add any CSS/JS CDN URLs per pen
- Console tab: `console.log/warn/error`, uncaught errors with tappable "JS line N", and a prompt to run JS in the live preview

**Run**
- Tick ⛶ next to Run for fullscreen; untick for split view with a draggable divider (side-by-side on a tablet in landscape)
- Optional live preview that re-runs as you type
- Back button: closes fullscreen → preview → editor → folder

**Settings:** open on the Home screen, straight into the scratch editor, or your last file · fullscreen by default · live preview · Tailwind version · font size · word wrap · line numbers · auto-close · indent size · dark / light / system theme

Also: share text from any app to **Code Lantern** to paste it into a new pen, and long-press the app icon for a **New pen** shortcut.

## GitHub, versions and the AI tag

**AI tag:** tap the **AI** chip in the editor header and type (or pick) the AI that helped. It's optional and yours to set. It shows on Home and is written into exported HTML as `<meta name="generator-ai" content="…">`.

**Versions (offline):** ⋮ → **Versions…** keeps up to 40 snapshots per bookmarked pen. Save one with a note, restore any, rename or delete. Restoring and pulling take an automatic snapshot first.

**GitHub:** the branch icon on Home (or ⋮ → **GitHub…**).
- **Sign in** with GitHub's device flow: the app shows a code, you approve it on github.com. One-time setup: on github.com go to *Settings → Developer settings → OAuth Apps → New OAuth App* (any homepage/callback URL, tick **Enable Device Flow**), and paste its **Client ID** into the app. A fine-grained token also works as a fallback.
- **Add repository** downloads its text files (HTML, CSS, JS, JSON, Markdown…; images are skipped) into a folder, on the branch you pick. Each file opens in its own editor tab.
- **Run** on a repo's HTML page inlines its relative `<script src>` and stylesheet files, so multi-file projects work. For a `.js`/`.css` file, use *Use as the run page* once.
- **Commit changes** sends all edited and new files (new file = a pen named like `foo.js` inside the folder) as one commit. If a changed pen has an AI tag, the message gets an `AI: …` line you can edit.
- **Pull latest** updates unchanged files. If you edited a file that changed on GitHub, your edit is kept and GitHub's copy is saved under Versions.
- **History** per file or repo: load an older version of a file, or load every file from a commit as edits. **Bookmark** commits to find them again under *Bookmarked commits*.

Not covered: deleting or renaming files on GitHub, binary files, merging conflicting edits line by line.

Files are stored privately in the app's storage. Uninstalling the app deletes them.
