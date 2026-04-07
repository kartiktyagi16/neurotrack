require("dotenv").config()
const express = require('express')
const cors = require('cors')
const notesRoutes = require('./routes/notes')
const quizRoutes = require('./routes/quiz')
const roadmapRoutes = require('./routes/roadmap')
const authRoutes = require('./routes/auth')



const app = express()
app.use(cors({
  origin: "http://localhost:5173"
}))
const PORT = process.env.PORT || 5001

// Middleware
app.use(cors())
app.use(express.json())

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

// ── Original AI Routes (UNCHANGED) ──
app.use('/api/generate-notes', notesRoutes)
app.use('/api/generate-quiz', quizRoutes)
app.use('/api/generate-roadmap', roadmapRoutes)

// ── New Auth Routes ──
app.use('/api/auth', authRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'NeuroTrack API', version: '2.0.0' })
})

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`\n🚀 NeuroTrack API running on http://localhost:${PORT}`)
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`)
  if (!process.env.SMTP_HOST) {
    console.log(`   ⚠️  SMTP not configured — running in demo OTP mode\n`)
  }
})
