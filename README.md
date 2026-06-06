<div align="center">

**🌐 English | [Deutsch](./README.de.md)**

# ⏱️ Zeitra

### Your time app with timers, games, and more.

A web app featuring stopwatch, countdown, and 6 different time-reflex games.
Collect coins, buy cool titles and username effects in the shop, and fight your way to the top of the leaderboards.

[**🚀 Live Demo →**](https://zeitra.web.app)

![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

## ✨ Features

### ⏱️ Timer Tools
- **Stopwatch** with millisecond precision
- **Countdown** with custom second input

### 🎮 6 Games
| Game | Description |
|---|---|
| 🎯 **Zeitgefühl** (Sense of Time) | Stop the clock at the exact target — 10 levels from 3s to 90s |
| ⚡ **Reaction Test** | Click as soon as the screen turns green — reflexes in milliseconds |
| 🛑 **Stop the Clock** | 5 levels, from level 3 the display gets hidden |
| 🥁 **BPM Tap** | Keep the given beat — 80/100/120/140 BPM |
| 🔢 **Blind Counter** | Count 10-60 seconds without a clock |
| 🧠 **Sequence Memory** | Simon Says — sequence grows each round |

### 🪙 Coin System
- Earn coins through successful gameplay
- Rewards scale with difficulty and accuracy
- Animated coin reward toast on every win

### 🛒 Shop
Spend your coins on:
- **Avatar Borders** (Blue, Purple, Green, Red, Gold, Rainbow)
- **Avatar Glows** (animated Rainbow Glow!)
- **Titles** — 19 across 4 tiers (Common to Legendary)
- **Username Effects** — Gold, Rainbow-Flow, Pulse-Glow, Sparkle...

### 🏆 Leaderboards
- Separate ranking per game + level
- Top 10 with Gold/Silver/Bronze highlights
- Animated titles and username styles in the display

### 👤 Profile
- Profile picture + banner upload (Cloudinary)
- Bio with clickable links
- Username search with live profile preview

### 🔧 Admin Panel
- Hidden behind a secret keybind and password
- Coin management for your own + other accounts
- Leaderboard cleanup
- Email-based admin authentication via Firestore Rules

---

## 🛠️ Tech Stack

- **Framework:** Angular 21 (Standalone Components, no NgModule)
- **Language:** TypeScript
- **Backend:** Firebase Auth + Firestore
- **Image Hosting:** Cloudinary (unsigned uploads)
- **Styling:** Plain CSS with custom animations
- **Hosting:** Firebase Hosting

---

## 🚀 Local Development

```bash
# Clone the repo
git clone https://github.com/fullyerik/zeitra.git
cd zeitra

# Install dependencies
npm install

# Start dev server
ng serve
```

App runs on `http://localhost:4200`

> **Note:** Copy `src/environments/environment.example.ts` to `environment.ts` and `environment.prod.ts`, then fill in your own Firebase and Cloudinary credentials.

---

## 📦 Build & Deploy

```bash
# Production build
ng build --configuration production

# Deploy to Firebase Hosting
firebase deploy
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for a detailed guide.

---

## 🔒 Security

Firestore rules in [`firestore.rules`](./firestore.rules) prevent unauthorized data manipulation:
- Users can only write their own profile
- Leaderboard entries only with own UID
- Admin actions only for whitelisted emails

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── app.ts                  # Root component (RouterOutlet)
│   ├── app.config.ts           # provideRouter
│   ├── app.routes.ts           # All routes
│   ├── firebase.service.ts     # Auth, Firestore, Cloudinary
│   └── timer/
│       ├── timer.ts            # Main component
│       ├── timer.html          # Full template
│       └── timer.css           # Full styling
├── assets/
│   └── zeitra-logo.png
├── styles.css                  # Global reset
└── main.ts                     # Bootstrap
```

---

## 📜 License

MIT — see [LICENSE](./LICENSE)

---

<div align="center">

Made with ☕ and a bit of obsession with time.

⭐ **Star** this repo if you like the app!

</div>
