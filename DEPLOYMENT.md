# 🚀 Deployment Guide

Komplette Anleitung um Zeitra **kostenlos und sicher** öffentlich zu hosten.

---

## ⚠️ Bevor du anfängst — WICHTIG!

### 1. Firestore Security Rules deployen — KRITISCH!

Aktuell ist deine Datenbank wahrscheinlich im **Test-Modus**. Das heißt jeder mit DevTools-Kenntnis kann:
- ❌ Alle User-Daten löschen
- ❌ Beliebige Münzen geben/nehmen
- ❌ Leaderboard manipulieren

**Bevor du public gehst**, MUSST du die [`firestore.rules`](./firestore.rules) deployen (Schritt im Firebase Hosting Abschnitt unten).

### 2. Admin-Passwort ist im Code sichtbar

Das `2010` Admin-Passwort in `timer.ts` ist beim Public-Repo sichtbar. **Aber das ist OK**, weil die Firestore Rules (`isAdmin()`-Funktion) die Email-Whitelist-Check machen — selbst wenn jemand das Admin-Panel öffnet, wird Firebase die Schreiboperationen verweigern wenn er nicht mit deiner Admin-Email eingeloggt ist.

**Wichtig:** Trage deine echte Admin-Email in `firestore.rules` ein (ist schon `erikspinnler84@gmail.com` drin — anpassen falls nötig).

---

## Hosting: Firebase Hosting (Empfehlung)

Warum Firebase Hosting?
- ✅ Komplett **gratis** für deinen Use-Case (10GB Bandwidth/Monat)
- ✅ Du nutzt schon Firebase Auth + Firestore
- ✅ Automatisches SSL-Zertifikat
- ✅ Custom Domain möglich
- ✅ Ein Befehl zum Deployen

### Schritt 1: Firebase CLI installieren

```bash
npm install -g firebase-tools
firebase login
```

Browser öffnet sich → Google-Account auswählen.

### Schritt 2: Firebase im Projekt initialisieren

Im Projekt-Ordner:

```bash
firebase init
```

Auswählen (mit **Spacebar** togglen, **Enter** bestätigen):
- ✅ **Hosting: Configure files for Firebase Hosting**
- ✅ **Firestore: Configure security rules and indexes files**

Dann die Fragen beantworten:
- **Use an existing project** → `zeitra-csbe` auswählen
- **Firestore rules file?** → `firestore.rules` (Default)
- **Firestore indexes file?** → `firestore.indexes.json` (Default)
- **What do you want to use as your public directory?** → `dist/timer-app/browser`
- **Configure as single-page app?** → **Yes**
- **Set up automatic builds with GitHub?** → **No** (machen wir später)
- **Overwrite index.html?** → **No**

### Schritt 3: Production-Build

```bash
ng build --configuration production
```

Erstellt einen optimierten Build in `dist/timer-app/browser/`.

### Schritt 4: Firestore Rules deployen

```bash
firebase deploy --only firestore:rules
```

⚠️ **Das machst du JETZT** — bevor du die Website public stellst!

### Schritt 5: Website deployen

```bash
firebase deploy --only hosting
```

Nach 1-2 Minuten bekommst du eine URL wie:
```
https://zeitra.web.app
https://zeitra-csbe.firebaseapp.com
```

Beide URLs sind **live, public und sicher (HTTPS)**.

### Schritt 6: Firebase Authorized Domains

Damit Login auf deiner public URL funktioniert:

1. Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. `zeitra.web.app` ist automatisch drin
3. Falls du eine eigene Domain nutzen willst → hier hinzufügen

---

## GitHub: Public Repo

### Schritt 1: Git initialisieren (falls noch nicht)

```bash
git init
git add .
git commit -m "Initial commit"
```

### Schritt 2: GitHub Repo erstellen

1. Geh auf https://github.com/new
2. Repository name: `zeitra` (oder was du willst)
3. **Public** auswählen
4. **Don't** add README/license/gitignore (haben wir schon)
5. **Create repository**

### Schritt 3: Pushen

```bash
git remote add origin https://github.com/DEIN-USERNAME/zeitra.git
git branch -M main
git push -u origin main
```

### Was ist sicher im Public-Repo?

✅ **Sicher (kann public sein):**
- Firebase Config (apiKey etc.) — Firebase erkennt Anfragen über die autorisierte Domain
- Cloudinary Cloud Name + Upload-Preset (sind "unsigned", schon designed für public)
- Admin-Passwort `2010` — wird durch Firestore Rules (Email-Whitelist) verifiziert
- Komplette Source-Code

❌ **NICHT public werden lassen:**
- `.env` Files (sind in `.gitignore`)
- Service-Account-JSON von Firebase (würdest du nur für Cloud Functions brauchen)
- Persönliche Daten

Das aktuelle Projekt enthält **keine** geheimen Werte → safe to public.

---

## Alternative Hosting-Optionen

Falls Firebase Hosting nicht reicht (z.B. für Custom Domain ohne Setup):

### Vercel
- ✅ Auto-Deploy bei jedem Git-Push
- ✅ 100GB Bandwidth/Monat gratis
- ✅ Sehr einfach
- 🔧 Setup: `vercel.json` mit Angular-Config nötig

### Netlify
- ✅ Ähnlich wie Vercel
- ✅ Auto-Deploy
- 🔧 Setup: `netlify.toml` mit Build-Command

### GitHub Pages
- ✅ Komplett gratis
- 🔧 Etwas mehr Setup für Angular-Routing nötig

Für **deinen** Use-Case empfehle ich **Firebase Hosting** weil's mit Firestore integriert ist.

---

## Was kostet das alles?

**Komplett 0€/Monat** für die normale Nutzung:

| Service | Free Tier | Reicht für |
|---|---|---|
| Firebase Hosting | 10 GB Bandwidth/Monat | ~100k Page Views |
| Firestore | 50k Reads + 20k Writes/Tag | ~100-500 aktive User |
| Firebase Auth | Unlimited (Email-Pw) | Beliebig viele User |
| Cloudinary | 25 GB Storage + 25 GB Bandwidth/Monat | ~50k Avatar-Uploads |

Wenn die App wächst (1000+ aktive User/Tag), könnte Firestore über die Limits gehen — dann brauchst du den **Blaze-Plan** mit Pay-as-you-go (immer noch sehr günstig, ~1-5€/Monat für mittlere Nutzung).

---

## Updates deployen

Wenn du Änderungen machst:

```bash
ng build --configuration production
firebase deploy --only hosting
```

Wenn du `firestore.rules` änderst:

```bash
firebase deploy --only firestore:rules
```

---

## Troubleshooting

**"Permission denied" Errors in der Console nach Rules-Deployment**
→ Logge dich neu ein, bzw. checke ob deine Email in `firestore.rules` als Admin steht.

**Login funktioniert nicht auf der public URL**
→ Firebase Console → Authentication → Settings → Authorized Domains → URL hinzufügen.

**404 bei Seiten-Reload (z.B. /shop)**
→ Beim `firebase init` muss "Configure as single-page app" auf **Yes** gestellt sein. Falls nicht, in `firebase.json` `"rewrites"` checken.
