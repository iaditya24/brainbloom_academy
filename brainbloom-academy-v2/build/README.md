# BrainBloom Academy

A premium, animated coaching institute website built with React, Vite,
Tailwind CSS, lucide-react icons, React Router, and Firebase (auth + database).

**Important:** before login, signup, or the admin panel will work, follow
`SETUP.md` — it's a 5-minute Firebase setup with copy-paste steps.

## 1. Run it locally

Requires [Node.js](https://nodejs.org) (v18+) installed on your computer.

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`) in your browser.

## 2. Put it on GitHub

```bash
git init
git add .
git commit -m "BrainBloom Academy v2: team, gallery, auth, admin"
```

Then create a new empty repository on [github.com/new](https://github.com/new), and run the two commands it shows you, something like:

```bash
git remote add origin https://github.com/YOUR_USERNAME/brainbloom-academy.git
git branch -M main
git push -u origin main
```

## 3. Deploy it live (free)

**Netlify (recommended — this project already has a `netlify.toml`)**
1. Go to [netlify.com](https://netlify.com) and sign up with GitHub.
2. "Add new site" → "Import an existing project" → pick your repo.
3. Build settings are auto-detected from `netlify.toml` (build command
   `npm run build`, publish directory `dist`). Click **Deploy site**.

**Vercel** also works: import the repo at [vercel.com](https://vercel.com),
leave defaults (auto-detects Vite), click Deploy.

Both give you a free URL immediately, and let you attach your own domain
later from the project's Domain settings.

## Project structure

```
brainbloom-academy/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── netlify.toml
├── SETUP.md              # Firebase setup — do this first
├── public/
│   └── _redirects        # SPA routing fallback for Netlify
└── src/
    ├── main.jsx           # React entry point + router
    ├── App.jsx            # Route definitions
    ├── firebase.js         # Firebase config + ADMIN_EMAIL — edit this
    ├── theme.js             # Shared colors / fonts
    ├── index.css
    ├── context/
    │   └── AuthContext.jsx  # Login state, signup/login/logout, role lookup
    ├── components/
    │   ├── TopBar.jsx        # Nav bar used on inner pages
    │   └── RouteGuards.jsx   # ProtectedRoute / AdminRoute
    ├── pages/
    │   ├── Home.jsx          # The full homepage (all sections)
    │   ├── Login.jsx / Signup.jsx
    │   ├── Notes.jsx / Videos.jsx / Quizzes.jsx / QuizAttempt.jsx
    │   ├── Dashboard.jsx     # Student's own quiz history
    │   ├── Admin.jsx         # Admin-only: Messages, Notes, Videos, Quizzes
    │   └── NotFound.jsx
    └── assets/gallery/       # Custom SVG illustrations used in the Gallery
```

## Customizing

- **Colors / fonts**: edit `src/theme.js`.
- **Homepage content**: course lists, testimonials, FAQs, study materials,
  and the **Team** array (co-founders) are near the top of `src/pages/Home.jsx`.
- **Gallery images**: swap the SVGs in `src/assets/gallery/` for real
  photos any time (update the `GALLERY_IMAGES` list in `Home.jsx` if you
  rename files).
- **Contact details / WhatsApp number**: search for `+91 98765 43210` and
  the `wa.me` link in `src/pages/Home.jsx` and replace with your real number.
- **Admin email**: `ADMIN_EMAIL` in `src/firebase.js`.
