<div align="center">

**🌐 [English](./README.md) | Deutsch**

# ⏱️ Zeitra

### Deine Zeit-App mit Timer, Games und mehr.

Eine Web-App mit Stopwatch, Countdown und 6 verschiedenen Zeit-Reflex-Games.
Sammle Münzen, kauf coole Titel und Username-Effekte im Shop und kämpfe dich an die Spitze der Leaderboards.

[**🚀 Live Demo →**](https://zeitra.web.app)

![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

## ✨ Features

### ⏱️ Timer-Tools
- **Stopwatch** mit Millisekunden-Präzision
- **Countdown** mit individueller Sekunden-Eingabe

### 🎮 6 Games
| Spiel | Beschreibung |
|---|---|
| 🎯 **Zeitgefühl** | Stoppe die Uhr bei genau dem Ziel — 10 Levels von 3s bis 90s |
| ⚡ **Reaktionstest** | Klick sobald der Bildschirm grün wird — Reflexe in Millisekunden |
| 🛑 **Stop the Clock** | 5 Levels, ab Level 3 wird die Anzeige versteckt |
| 🥁 **BPM Tap** | Halte den vorgegebenen Takt — 80/100/120/140 BPM |
| 🔢 **Blind Counter** | Zähle 10-60 Sekunden ohne Uhr |
| 🧠 **Sequence Memory** | Simon-Says — jede Runde wird länger |

### 🪙 Münzen-System
- Sammle Coins durch erfolgreiches Spielen
- Belohnungen skalieren mit Schwierigkeit und Genauigkeit
- Animierter Coin-Reward Toast bei jedem Erfolg

### 🛒 Shop
Gib deine Münzen aus für:
- **Avatar-Rahmen** (Blau, Lila, Grün, Rot, Gold, Rainbow)
- **Avatar-Glows** (animierter Rainbow-Glow!)
- **Titel** — 19 Stück in 4 Tiers (Common bis Legendary)
- **Username-Effekte** — Gold, Rainbow-Flow, Pulse-Glow, Sparkle...

### 🏆 Leaderboards
- Pro Spiel + Level separates Ranking
- Top 10 mit Gold/Silber/Bronze Highlights
- Animierte Titel und Username-Styles in der Anzeige

### 👤 Profile
- Profilbild + Banner Upload (Cloudinary)
- Bio mit klickbaren Links
- Username-Suche mit Live-Profil-Vorschau

### 🔧 Admin-Panel
- Versteckt hinter `Strg+F` und Passwort
- Münzen-Management für eigenen + andere Accounts
- Leaderboard-Cleanup
- Email-basierte Admin-Authentifizierung über Firestore Rules

---

## 🛠️ Tech Stack

- **Framework:** Angular 21 (Standalone Components, kein NgModule)
- **Sprache:** TypeScript
- **Backend:** Firebase Auth + Firestore
- **Image-Hosting:** Cloudinary (unsigned uploads)
- **Styling:** Plain CSS mit Custom Animations
- **Hosting:** Firebase Hosting

---

## 🚀 Local Development

```bash
# Repo klonen
git clone https://github.com/fullyerik/zeitra.git
cd zeitra

# Dependencies installieren
npm install

# Dev-Server starten
ng serve
```

App läuft auf `http://localhost:4200`

> **Hinweis:** Kopiere `src/environments/environment.example.ts` zu `environment.ts` und `environment.prod.ts` und trage deine eigenen Firebase- und Cloudinary-Credentials ein.

---

## 📦 Build & Deploy

```bash
# Production-Build
ng build --configuration production

# Deploy zu Firebase Hosting
firebase deploy
```

Siehe [DEPLOYMENT.md](./DEPLOYMENT.md) für eine ausführliche Anleitung.

---

## 🔒 Security

Firestore-Regeln in [`firestore.rules`](./firestore.rules) verhindern unauthorisierte Datenmanipulation:
- User können nur ihr eigenes Profil schreiben
- Leaderboard-Einträge nur mit eigener UID
- Admin-Aktionen nur für whitelisted Emails

---

## 🗂️ Projekt-Struktur

```
src/
├── app/
│   ├── app.ts                  # Root Component (RouterOutlet)
│   ├── app.config.ts           # provideRouter
│   ├── app.routes.ts           # Alle Routen
│   ├── firebase.service.ts     # Auth, Firestore, Cloudinary
│   └── timer/
│       ├── timer.ts            # Haupt-Component
│       ├── timer.html          # Komplettes Template
│       └── timer.css           # Komplettes Styling
├── assets/
│   └── zeitra-logo.png
├── styles.css                  # Globaler Reset
└── main.ts                     # Bootstrap
```

---

## 📜 License

MIT — siehe [LICENSE](./LICENSE)

---

<div align="center">

Made with ☕ and a bit of obsession with time.

⭐ **Star** this repo wenn dir die App gefällt!

</div>
