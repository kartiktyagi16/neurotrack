# NeuroTrack – Smart AI Learning Dashboard

> **Track. Learn. Evolve.**

A production-grade EdTech platform built with React + Node.js, inspired by YouTube Dark Mode UI and LeetCode's dashboard layout. Designed to look and feel like a real funded startup product.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 AI Notes Generator | Generate structured notes with definitions, key points, examples, and summaries |
| ◈ Smart Quiz Builder | Auto-generate MCQs, score yourself, and track quiz history |
| 📅 Timetable Generator | Input subjects + exam date → get a daily study schedule |
| 🗺️ Roadmap Builder | Select a goal (Placement/AI/Web Dev/DSA) → get a 4-week checklist roadmap |
| 📊 Growth Analytics | Area charts, bar charts, and subject-level performance breakdowns |
| 🔥 Learning Heatmap | GitHub-style activity grid showing daily study streak |

---

## 🛠 Tech Stack

**Frontend**
- React 18 (Vite)
- React Router v6
- Recharts (data visualization)
- Vanilla CSS3 with CSS variables
- localStorage for persistence

**Backend**
- Node.js + Express
- REST API architecture
- Ready for OpenAI / Anthropic AI integration

---

## 📁 Project Structure

```
neurotrack/
├── client/                          # React frontend (Vite)
│   └── src/
│       ├── context/AuthContext.jsx  # Global auth + theme state
│       ├── pages/
│       │   ├── Home.jsx             # Landing page
│       │   ├── Auth.jsx             # Login + Signup + OTP
│       │   ├── Dashboard.jsx        # Stats dashboard
│       │   ├── Notes.jsx            # AI notes generator
│       │   ├── Quiz.jsx             # Quiz builder
│       │   ├── Timetable.jsx        # Study schedule
│       │   ├── Roadmap.jsx          # Week-by-week roadmap
│       │   ├── Analytics.jsx        # Performance charts
│       │   └── StudentProfile.jsx   # Per-student profile
│       ├── components/
│       │   ├── Navbar.jsx           # Top nav
│       │   └── DashboardLayout.jsx  # Sidebar shell
│       ├── styles/global.css        # CSS variables, dark/light theme
│       ├── App.jsx                  # Routes + auth guards
│       └── main.jsx                 # React entry point
│
└── server/                          # Node.js + Express backend
    ├── routes/
    │   ├── notes.js                 # POST /api/generate-notes
    │   ├── quiz.js                  # POST /api/generate-quiz
    │   ├── roadmap.js               # POST /api/generate-roadmap
    │   └── auth.js                  # POST /api/auth/send-otp & verify-otp
    ├── server.js                    # Express app + middleware
    ├── .env.example                 # Environment variable template
    └── package.json
```

---

## 🚀 How to Run

### Backend
```bash
cd server
npm install
npm run dev        # runs on http://localhost:5001
```

### Frontend
```bash
cd client
npm install
npm run dev        # runs on http://localhost:5173
```

### Enable Real OTP Emails (optional)
```bash
cd server
cp .env.example .env
# Fill in SMTP_HOST, SMTP_USER, SMTP_PASS
```
Without this, the app runs in **demo mode** — OTP appears on screen.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Auth + OTP | Login/Signup with 6-digit email verification |
| 📝 AI Notes | Generate structured notes on any topic |
| 🧠 Smart Quiz | Auto-generate MCQ quizzes with scoring |
| 📊 Analytics | Score growth charts and quiz performance bars |
| 🗓️ Timetable | Personalised study schedule generator |
| 🗺️ Roadmap | Weekly plans: Placement, AI, Web Dev, DSA |
| 🔥 Heatmap | GitHub-style 365-day activity tracker |
| 👤 Student Profile | Unique profile created on first login |
| ☀️ Light / Dark Mode | Full theme switch, persisted in localStorage |

---

## 🔐 Auth Flow

```
/auth page
 ├── SIGNUP
 │    Step 1 → Name, Email, Password
 │    Step 2 → Goal, Subjects
 │    → Server generates OTP → emailed (or shown in demo)
 │    → User enters OTP → profile created → redirect /dashboard
 │
 └── LOGIN
      Email + Password → verified against stored profile
      → Server generates OTP → emailed (or shown in demo)
      → User enters OTP → redirect /dashboard
```

---

## 🗄️ Data Storage (localStorage)

| Key | Stores |
|---|---|
| `nt_user` | Logged-in user object |
| `nt_profile_{email}` | Full student profile (unique per email) |
| `nt_theme` | `"dark"` or `"light"` |
| `nt_heatmap_{email}` | Daily study session counts |
| `nt_stats` | Notes/quizzes/score/hours counts |

---

## 🌐 API Endpoints

### AI Routes (original — untouched)
| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/generate-notes` | `{ subject, topic, difficulty }` |
| POST | `/api/generate-quiz` | `{ topic, difficulty, count }` |
| POST | `/api/generate-roadmap` | `{ goal, duration }` |
| GET | `/api/health` | — |

### Auth Routes (new)
| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/auth/send-otp` | `{ email, name }` |
| POST | `/api/auth/verify-otp` | `{ email, otp }` |

---

## 🎨 Tech Stack

**Frontend:** React 18, Vite, React Router v6, Recharts, CSS Variables
**Backend:** Node.js, Express.js, Nodemailer, CORS

---

## 👨‍💻 Built By
Made with ♥ by Kartik · © 2026 NeuroTrack

## 🔮 Future Improvements

- [ ] User authentication (JWT / OAuth)
- [ ] PostgreSQL / MongoDB database integration
- [ ] Real-time collaborative notes
- [ ] AI-powered personalized roadmaps
- [ ] Spaced repetition system for flashcards
- [ ] PDF export for notes and roadmaps
- [ ] Notifications and study reminders
- [ ] Mobile app (React Native)
- [ ] Leaderboard and social features

---

## 👨‍💻 Author

**Kartik**  
Built with ♥ as a full-stack portfolio project.

- GitHub: [github.com/kartik](https://github.com/kartik)
- LinkedIn: [linkedin.com/in/kartik](https://linkedin.com/in/kartik)

---

© 2026 NeuroTrack. All rights reserved.
