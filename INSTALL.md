# 📦 MathMaster — Installation Guide

MathMaster is a **100% static website** — no server, no database, no build tools required. This guide covers every way to run it locally and deploy it to the web.

---

## ✅ Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- That's it for opening the files directly.

For local development / serving, you'll optionally need **one** of:
- Python 3.x (pre-installed on macOS/Linux)
- Node.js 16+ (for `npx serve`)
- VS Code with the Live Server extension

---

## 🖥 Option 1 — Open the file directly (simplest)

1. Unzip / clone the project folder.
2. Open `mathmaster/index.html` in your browser (double-click it).

> ⚠️ Some browsers restrict `localStorage` and font loading on the `file://` protocol. If you notice missing theme persistence or sounds, use **Option 2** instead.

---

## 🐍 Option 2 — Python local server (recommended)

Python is pre-installed on macOS and most Linux distros.

```bash
# 1. Open a terminal and navigate to the project
cd /path/to/mathmaster

# 2. Start a local server on port 8000
python3 -m http.server 8000

# (Windows users without python3 alias: use `python` instead)
```

3. Open your browser to: **http://localhost:8000**
4. Press `Ctrl + C` in the terminal to stop the server when done.

---

## 🟢 Option 3 — Node.js local server

If you have Node.js installed:

```bash
cd /path/to/mathmaster

# Using `serve` (popular, zero-config)
npx serve .

# OR using `http-server`
npx http-server -p 8000 -o
```

Then visit the URL printed in the terminal (usually http://localhost:3000 or http://localhost:8080).

---

## 🧩 Option 4 — VS Code Live Server

1. Install the free **"Live Server"** extension by Ritwick Dey.
2. Open the `mathmaster/` folder in VS Code.
3. Right-click `index.html` → **Open with Live Server**.
4. Your browser opens automatically at `http://127.0.0.1:5500`.
5. Pages auto-reload on every save. ✨

---

## 🚀 Deploying to the Web

MathMaster is static — host the folder anywhere.

### GitHub Pages (free)
```bash
cd mathmaster
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mathmaster.git
git push -u origin main
```
Then: **Repo → Settings → Pages → Source: Deploy from branch → `main` / `(root)` → Save**.
Your site goes live at `https://YOUR_USERNAME.github.io/mathmaster/` in a minute.

### Netlify (drag & drop, easiest)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the entire `mathmaster/` folder onto the page.
3. Done — you get a live URL instantly.

### Vercel
```bash
npm i -g vercel   # one-time
cd mathmaster
vercel            # follow the prompts
vercel --prod     # deploy to production
```

### Cloudflare Pages
1. Dashboard → **Pages → Create project → Direct Upload**.
2. Drag the `mathmaster/` folder. Deploy.

### Surge.sh
```bash
npm i -g surge
cd mathmaster
surge .           # pick any subdomain
```

### Any traditional web host (Apache/Nginx/cPanel)
Upload the contents of `mathmaster/` to your `public_html/` or `www/` directory via FTP. Ensure `index.html` sits at the root.

---

## 🔍 Verifying Your Install

Once running, check that:

- [x] Home page loads with the animated gradient background and floating math cards
- [x] The **🌙/☀️ theme toggle** in the navbar switches dark/light
- [x] Clicking a **topic card** opens the Lessons page filtered to that topic
- [x] Opening a **lesson** and clicking **Reveal steps** on an example works
- [x] **Practice** generates questions and gives instant feedback + sound
- [x] **Quizzes → Daily Challenge** starts a 5-question timed set
- [x] The **Leaderboard** shows ranked demo users
- [x] **Register** creates an account (the first one becomes admin) and signs you in
- [x] Signed-in admin: **admin/dashboard.html** opens the admin panel

If any of these fail, you're likely on `file://` — switch to a local server (Option 2–4).

---

## 🧹 Resetting Data

All user data lives in your browser's `localStorage` under `mathmaster.v1`. To wipe everything and start fresh:

- **In the app:** Settings → **🗑 Reset all data**, **or**
- **In DevTools:** Application tab → Local Storage → clear `mathmaster.v1`, then reload.

---

## ❓ Troubleshooting

| Problem | Fix |
|---|---|
| Sounds don't play | Browsers block audio until you interact with the page. Click anywhere first. Check **Settings → Sound effects** is on. |
| Theme doesn't persist on reload | You're on `file://`. Use a local server (Option 2+). |
| Math looks like raw `\frac{}` text | JavaScript is disabled or a script failed to load. Open DevTools console for errors. |
| Fonts look generic | Internet connection required to fetch Google Fonts on first load (cached after). |
| Admin page redirects me away | You must be signed in as an admin. Use **Try Admin Demo** on the login page. |
| `python3` command not found (Windows) | Use `py -m http.server 8000` or install Python from python.org. |

---

## 📞 Need More Help?

See the in-app **Contact** page or open an issue on the project repository.

Happy learning! 🚀
