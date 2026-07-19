# ∑ MathMaster

> A premium, fully-responsive **mathematics learning platform** built with vanilla HTML5, CSS3, and JavaScript (ES6+). No frameworks, no build step — just open and run.

Master math from arithmetic to probability through interactive lessons, step-by-step solutions, unlimited procedurally-generated practice, timed quizzes, XP & achievements, and a full admin dashboard.

![MathMaster](assets/images/og-cover.svg)

---

## ✨ Features

### 📚 Learning
- **13 math topics** — Arithmetic, Fractions, Decimals, Percentages, Algebra, Equations, Inequalities, Factoring, Expanding, Coordinate Geometry, Geometry, Statistics, Probability
- **40+ interactive lessons** with worked examples and key formulas
- **Step-by-step solution reveal** — try first, then uncover one step at a time
- **Lightweight LaTeX-style math rendering** (fractions, exponents, √, π, ∫, ∑ — no dependency)

### 🎯 Practice & Assessment
- **Infinite procedural questions** — every topic has a generator that produces fresh, fully-solved problems
- **Instant feedback** with explanations
- **Timed quizzes** with instant or exam modes
- **Daily Challenge** — 5 questions, deterministic per day, +60 XP bonus

### 🏆 Gamification
- **XP & Levels** with a smooth progression curve
- **Streaks** with daily tracking
- **12 achievement badges** that unlock automatically
- **Leaderboard** sortable by XP, streak, accuracy, or lessons
- **Activity heatmap** (GitHub-style) on the Progress page

### 🎨 Design
- **Dark & Light mode** with system preference detection
- **Glassmorphism** UI with backdrop blur
- **Smooth animations** and reveal-on-scroll
- **Synthesized sound effects** via Web Audio (no audio files needed)
- **Confetti** on wins 🎉
- **Fully responsive** — mobile, tablet, desktop
- **Reduced-motion** support for accessibility

### 🛠 Admin Dashboard (`admin/dashboard.html`)
- Overview with live stats & platform status
- **CRUD for lessons** (add, edit, delete custom lessons)
- **CRUD for questions** (custom question bank)
- **User management** — change roles, delete users
- **Analytics** — engagement, signups, accuracy
- **Content editor** — announcements & branding
- **Media library** — upload images (stored locally)

### ♿ Accessibility & Performance
- Semantic HTML, ARIA labels, keyboard navigation
- Skip links, focus-visible styles, screen-reader text
- `/` keyboard shortcut focuses search
- No build tools, no external JS frameworks
- Lazy-loaded images, optimized SVG assets
- SEO meta tags + Open Graph on every page

---

## 🚀 Quick Start

### Option 1 — Open directly
Just double-click `index.html`. That's it. ✨

### Option 2 — Local server (recommended)
A local server avoids browser security restrictions on some features.

**Python 3** (built-in on macOS/Linux):
```bash
cd mathmaster
python3 -m http.server 8000
```
Then visit **http://localhost:8000**

**Node.js** (if installed):
```bash
cd mathmaster
npx serve .
# or
npx http-server -p 8000
```

**VS Code**: Install the *Live Server* extension → right-click `index.html` → **Open with Live Server**.

### Option 3 — Deploy
The site is 100% static. Drop the `mathmaster/` folder onto any host:
- **GitHub Pages** — push to a repo, enable Pages in Settings
- **Netlify** — drag-and-drop the folder at app.netlify.com/drop
- **Vercel** — `vercel --prod` in the folder
- **Cloudflare Pages**, **Surge**, **S3**, any static host

---

## 📁 Project Structure

```
mathmaster/
├── index.html                  # Landing page (Home)
├── 404.html                    # Not-found page
├── README.md                   # You are here
├── INSTALL.md                  # Detailed install guide
│
├── css/
│   ├── style.css               # Design tokens, reset, typography, theme vars
│   ├── components.css          # Buttons, cards, nav, forms, quiz UI, modals…
│   └── responsive.css          # Breakpoints (1024 / 768 / 560)
│
├── js/
│   ├── app.js                  # Bootstrap: load order, global init, demo seed
│   ├── modules/
│   │   ├── utils.js            # DOM helpers, format, random, math eval, fractions
│   │   ├── storage.js          # localStorage layer, XP/level, progress, achievements
│   │   ├── theme.js            # Dark/Light toggle + persistence
│   │   ├── sound.js            # Web Audio synthesized SFX
│   │   ├── auth.js             # Client-side auth (register/login/demo/roles)
│   │   ├── components.js       # Nav, footer, toasts, modals, confetti, math render
│   │   ├── lessonsData.js      # 13 topics + 40+ structured lessons
│   │   └── mathEngine.js       # Procedural question generators for all topics
│   └── pages/
│       ├── home.js             # Topics grid
│       ├── lessons.js          # Listing, search, filter, bookmark
│       ├── lesson.js           # Single lesson reader + step-by-step examples
│       ├── exercises.js        # Practice mode
│       ├── quizzes.js          # Full quiz engine
│       ├── leaderboard.js      # Ranked board + podium
│       ├── progress.js         # Stats dashboard + heatmap
│       ├── profile.js          # User profile + edit
│       ├── auth.js             # Login & register handlers
│       ├── settings.js         # Preferences
│       ├── about.js            # Team + FAQ
│       ├── contact.js          # Contact form
│       └── admin.js            # Admin dashboard logic
│
├── pages/
│   ├── lessons.html  lesson.html  exercises.html  quizzes.html
│   ├── leaderboard.html  progress.html  profile.html
│   ├── login.html  register.html  settings.html
│   └── about.html  contact.html
│
├── admin/
│   └── dashboard.html          # Admin SPA (sidebar nav)
│
└── assets/
    └── images/
        ├── favicon.svg
        ├── logo.svg
        ├── og-cover.svg
        └── placeholder.svg
```

---

## 🎮 Trying It Out

### As a Student
1. Open the site → click **Start Learning**
2. Pick any topic card → open a lesson → try the inline examples
3. Hit **Practice** for unlimited questions, or **Quizzes** for a timed challenge
4. Track your XP, streak, and badges on the **Progress** page
5. Check the **Leaderboard** to see your rank

### Demo Accounts (no signup)
On the **Login** page:
- **🚀 Continue as Demo Student** — instant student access
- **🛠 Try Admin Demo** — instant admin access

### Admin Access
Either:
- Use the **Try Admin Demo** button on the login page, **or**
- **Register** — the *first* account created becomes admin automatically

Then visit **admin/dashboard.html** (a link appears in the nav + profile when signed in as admin).

---

## ⚙️ How It Works

- **No backend.** All state (users, progress, XP, custom content, uploaded media) lives in `localStorage` under the key `mathmaster.v1`.
- **No build step.** ES6+ modules are loaded via plain `<script>` tags in dependency order.
- **Question generation.** Each topic in `js/modules/mathEngine.js` has a generator function producing `{ prompt, type, options?, answer, accept?, solution }`. Daily challenges use a seeded RNG so every visitor sees the same set on a given day.
- **Math rendering.** `components.js → renderMath()` converts a small LaTeX subset (`\frac{}{}`, `^{}`, `\sqrt{}`, `\pi`, etc.) into styled HTML — no KaTeX/MathJax dependency.
- **Sound.** `sound.js` synthesizes all effects with the Web Audio API at runtime.
- **Security note.** Auth is for demo/educational purposes only (hashing is non-cryptographic, everything client-side). **Do not reuse for production without a real backend.**

---

## 🔧 Customization

| Want to… | Edit |
|---|---|
| Change brand colors / spacing | `css/style.css` → `:root` CSS variables |
| Add a topic | `js/modules/lessonsData.js` → `TOPICS` + a generator in `mathEngine.js` |
| Add a lesson | Admin dashboard, **or** append to `LESSONS` in `lessonsData.js` |
| Add an achievement | `js/modules/components.js` → `ACHIEVEMENTS` array |
| Tweak XP curve | `js/modules/storage.js` → `xpForLevel()` |
| Change demo leaderboard names | `js/app.js` → `seedDemo()` |
| Disable sounds by default | `js/modules/storage.js` → `DEFAULT.settings.sound` |

---

## 🌐 Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge — last 2 versions). Uses:
- ES6+ (modules, arrow fns, destructuring, optional chaining)
- `localStorage`, `sessionStorage`
- Web Audio API (sound) — gracefully degrades if blocked
- IntersectionObserver (reveal animations) — falls back to instant show
- CSS custom properties, `backdrop-filter`, grid, flexbox

---

## 📜 License

MIT — free to use, modify, and distribute. See [LICENSE](LICENSE).

Built with ❤️ for math learners everywhere.

---

## 🙏 Credits

- Fonts: [Inter](https://rsms.me/inter/) & [JetBrains Mono](https://www.jetbrains.com/lp/mono/) via Google Fonts
- Icons: handcrafted inline SVG
- Math content: original, written for this project
- Inspired by the great math educators who make the subject click ✨
