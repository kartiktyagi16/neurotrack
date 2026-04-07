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

## 📁 Folder Structure

```
neurotrack/
│
├── client/                     # React frontend
│   ├── src/
│   │   ├── pages/              # Home, Dashboard, Notes, Quiz, Timetable, Roadmap, Analytics
│   │   ├── components/         # Navbar, DashboardLayout (sidebar)
│   │   ├── styles/             # global.css (design system)
│   │   ├── App.jsx             # Router setup
│   │   └── main.jsx            # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Node.js backend
│   ├── routes/
│   │   ├── notes.js            # POST /api/generate-notes
│   │   ├── quiz.js             # POST /api/generate-quiz
│   │   └── roadmap.js          # POST /api/generate-roadmap
│   ├── server.js               # Express app entry
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18+
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/kartik/neurotrack.git
cd neurotrack
```

### 2. Setup & run the frontend
```bash
cd client
npm install
npm run dev
# → http://localhost:5173
```

### 3. Setup & run the backend
```bash
cd ../server
npm install
npm run dev   # uses nodemon
# → http://localhost:5000
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🤖 How to Integrate AI API

The backend routes are pre-structured with clear TODO comments for AI integration.

### Using OpenAI (GPT-4)

1. Install the SDK:
```bash
cd server && npm install openai
```

2. Set your API key in a `.env` file:
```
OPENAI_API_KEY=sk-your-key-here
```

3. In `server/routes/notes.js`, replace the mock data block:
```js
const OpenAI = require('openai')
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const prompt = `Generate structured study notes for the topic "${topic}" in "${subject}" at ${difficulty} difficulty. Return JSON with: definition, keyPoints (array), examples (array), summary.`

const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: prompt }],
  response_format: { type: 'json_object' }
})

const data = JSON.parse(completion.choices[0].message.content)
res.json({ success: true, data })
```

4. Apply the same pattern to `quiz.js` and `roadmap.js`.

---

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
