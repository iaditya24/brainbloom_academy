# BrainBloom Academy — Setup Guide (v2)

Your site now has: real accounts, a message inbox, notes, video lectures, and
quizzes with scoring — all powered by **Firebase** (Google's free backend) —
plus a Team section (Aditya Singh, Pari Soni, Yuvika Saini) and a redesigned
Gallery with custom illustrations. Firebase is used instead of a custom
Node/Express server so you don't have to rent, run, or maintain a separate
server — Netlify hosts your site, Firebase handles logins and data storage,
and both have generous free tiers.

You need to do **one thing** before login/admin/notes/videos/quizzes work:
create a free Firebase project and paste its config into the code. Takes
about 5 minutes. Until you do this, the homepage (including the new Team and
Gallery sections) works perfectly fine — only login/signup/admin need it.

## 1. Create your Firebase project

1. Go to https://console.firebase.google.com and sign in with Google.
2. Click **Add project** → name it (e.g. `brainbloom-academy`) → skip Google
   Analytics if you want (not needed) → **Create project**.
3. Once created, click the **Web** icon (`</>`) to register a web app.
   Give it any nickname → **Register app**. It will show you a code block
   with a `firebaseConfig` object — copy it.

## 2. Paste your config

Open `src/firebase.js` in this project and replace the placeholder values
in `firebaseConfig` with the ones Firebase just gave you. It looks like:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "brainbloom-academy.firebaseapp.com",
  projectId: "brainbloom-academy",
  storageBucket: "brainbloom-academy.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
};
```

## 3. Turn on Authentication

In the Firebase console sidebar: **Build → Authentication → Get started →
Sign-in method** tab → click **Email/Password** → enable it → **Save**.

## 4. Turn on Firestore (the database)

**Build → Firestore Database → Create database** → choose **Start in test
mode** (allows read/write for 30 days — good enough to launch; tighten with
the rules below whenever you're ready) → pick a region close to India (e.g.
`asia-south1`) → **Enable**.

## 5. (Recommended) Lock down the database properly

Test mode is open to anyone for 30 days. Before that expires, go to
**Firestore Database → Rules** and paste this instead:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }
    match /messages/{id} {
      allow create: if true;
      allow read, delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    match /notes/{id} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    match /videos/{id} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    match /quizzes/{id} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    match /results/{id} {
      allow create: if request.auth != null;
      allow read: if request.auth != null &&
        (resource.data.uid == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin");
    }
  }
}
```

## 6. Who becomes admin?

`src/firebase.js` has:

```js
export const ADMIN_EMAIL = "adityarajput2734@gmail.com";
```

Whoever **signs up** with this exact email automatically gets the admin
role and can see `/admin`. Sign up with this email first thing. Everyone
else who signs up becomes a regular student. To change the admin email
later, just edit this one line and redeploy.

## 7. Run it locally to test

```bash
npm install
npm run dev
```

Sign up with your admin email, log in, go to `/admin`, and try adding a
note, a video, a quiz, and check the Messages tab after submitting the
Contact form on the homepage.

## 8. Deploy

Push to GitHub, Netlify rebuilds automatically. `netlify.toml` already has
the redirect rule needed for the new routes (`/notes`, `/login`, `/admin`,
etc.) to work properly on refresh/direct visit.

## What's new in this update

- **Team section**: Pari Soni (Co-Founder — Technical) and Yuvika Saini
  (Co-Founder — Teacher) now appear alongside Aditya Singh, each with an
  initials avatar in the site's brand colors. Edit the `TEAM` array near the
  top of `src/pages/Home.jsx` to change names, roles, or tags.
- **Gallery section**: replaced with six custom, brand-colored illustrations
  (`src/assets/gallery/*.svg`) — no stock photos, so there's nothing to
  license. Swap in real photos any time by replacing those files or the
  `GALLERY_IMAGES` array in `src/pages/Home.jsx`.
- **Admin panel** (`/admin`): only reachable by the account signed up with
  `ADMIN_EMAIL`. Tabs for Messages (contact form inbox), Notes, Videos, and
  Quizzes — all backed by Firestore, no extra server needed.
- **Contact form** now saves submissions straight to Firestore's `messages`
  collection, visible in the admin Messages tab.

## What's the same as before

| Route | Who can see it | What it does |
|---|---|---|
| `/` | Everyone | Homepage — now with Team + Gallery. Contact form saves to Firestore. |
| `/login`, `/signup` | Everyone | Email/password auth. |
| `/notes` | Logged-in users | Notes admin has added, opens the file link. |
| `/videos` | Logged-in users | YouTube video lectures admin has added. |
| `/quizzes` | Logged-in users | List of quizzes → attempt → instant score. |
| `/dashboard` | Logged-in students | Their own quiz history and average score. |
| `/admin` | Admin only | Tabs: Messages inbox, add/remove Notes, Videos, Quizzes. |

## Notes on file uploads

To keep this free and simple, **notes are added as a link** (e.g. a Google
Drive share link or any public PDF URL) rather than direct file upload.
Google Drive works well: upload the PDF, right-click → "Get link" → set to
"Anyone with the link" → paste that link into the admin Notes form.

If you'd rather have real file uploads hosted on Firebase Storage directly,
that's a bigger addition (Storage has its own free tier but needs a billing
account attached, even at $0) — ask Claude if you want that added next.
