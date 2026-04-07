import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

function getStoredStats(email) {
  try {
    const profile = JSON.parse(localStorage.getItem(`nt_profile_${email}`) || '{}')
    return profile.stats || {}
  } catch { return {} }
}

function generateHeatmapData(email) {
  const data = []
  const now = new Date()
  const stored = JSON.parse(localStorage.getItem(`nt_heatmap_${email}`) || '{}')
  for (let i = 364; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    data.push({ date: key, count: stored[key] ?? Math.floor(Math.random() * 5) })
  }
  return data
}

const growthData = [
  { day: 'Mon', score: 42 }, { day: 'Tue', score: 55 }, { day: 'Wed', score: 50 },
  { day: 'Thu', score: 68 }, { day: 'Fri', score: 72 }, { day: 'Sat', score: 65 },
  { day: 'Sun', score: 80 }, { day: 'Mon', score: 75 }, { day: 'Tue', score: 88 },
  { day: 'Wed', score: 84 }, { day: 'Thu', score: 91 }, { day: 'Fri', score: 95 },
]

const marksData = [
  { quiz: 'Q1', marks: 6 }, { quiz: 'Q2', marks: 8 }, { quiz: 'Q3', marks: 5 },
  { quiz: 'Q4', marks: 9 }, { quiz: 'Q5', marks: 7 }, { quiz: 'Q6', marks: 10 },
  { quiz: 'Q7', marks: 8 }, { quiz: 'Q8', marks: 6 },
]

const GOAL_LABELS = {
  placement: '🎯 Campus Placement',
  exam: '📝 Competitive Exam',
  webdev: '🌐 Web Dev',
  ai: '🤖 AI / ML',
  dsa: '⚡ DSA',
  other: '🔭 Exploring',
}

export default function Dashboard() {
  const { user, theme } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ notes: 0, quizzes: 0, avgScore: 0, hours: 0 })
  const [heatmap, setHeatmap] = useState([])

  const tooltipStyle = {
    backgroundColor: theme === 'light' ? '#fff' : '#1f2128',
    border: `1px solid ${theme === 'light' ? '#dde0e8' : '#2c2f38'}`,
    borderRadius: '8px',
    color: theme === 'light' ? '#111318' : '#f0f1f3',
    fontSize: '13px',
  }

  useEffect(() => {
    if (!user) return
    const s = getStoredStats(user.email)
    setStats({
      notes: s.notes || 0,
      quizzes: s.quizzes || 0,
      avgScore: s.avgScore || 0,
      hours: s.hours || 0,
    })
    setHeatmap(generateHeatmapData(user.email))
  }, [user])

  const heatColor = (count) => {
    if (theme === 'light') {
      if (count === 0) return '#ecedf2'
      if (count === 1) return '#bfdbfe'
      if (count === 2) return '#93c5fd'
      if (count === 3) return '#3b82f6'
      return '#1d4ed8'
    }
    if (count === 0) return '#1e2028'
    if (count === 1) return '#1a3a5c'
    if (count === 2) return '#1e5799'
    if (count === 3) return '#2980d4'
    return '#3ea6ff'
  }

  const statCards = [
    { label: 'Notes Generated', value: stats.notes, icon: '✎', color: '#3ea6ff', delta: 'Start generating notes →' },
    { label: 'Quizzes Taken', value: stats.quizzes, icon: '◈', color: '#a78bfa', delta: 'Take a quiz to start →' },
    { label: 'Avg Score %', value: stats.avgScore + '%', icon: '◉', color: '#34d399', delta: stats.avgScore > 0 ? 'Keep it up!' : 'No quizzes yet' },
    { label: 'Study Hours', value: stats.hours, icon: '◷', color: '#fbbf24', delta: 'Track your sessions →' },
  ]

  const weeks = []
  for (let i = 0; i < heatmap.length; i += 7) weeks.push(heatmap.slice(i, i + 7))

  // Greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.name?.split(' ')[0] || 'Student'

  return (
    <div className="dashboard fade-in">
      {/* Personalized header */}
      <div className="dash-page-header dash-welcome-row">
        <div>
          <h1 className="section-title">{greeting}, {firstName} 👋</h1>
          <p className="section-subtitle">
            {user?.goal ? `Goal: ${GOAL_LABELS[user.goal]}` : 'Here\'s your learning overview.'}&nbsp;·&nbsp;
            Member since {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—'}
          </p>
        </div>
        {user?.subjects?.length > 0 && (
          <div className="dash-subject-pills">
            {user.subjects.slice(0, 4).map(s => (
              <span className="dash-subject-pill" key={s}>{s}</span>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions — shown if stats are all zero (new user) */}
      {stats.notes === 0 && stats.quizzes === 0 && (
        <div className="dash-quickstart card">
          <div className="quickstart-inner">
            <div className="quickstart-text">
              <span className="quickstart-emoji">🚀</span>
              <div>
                <div className="quickstart-title">You're all set, {firstName}!</div>
                <div className="quickstart-sub">Start by generating your first AI notes or taking a quiz to populate your dashboard.</div>
              </div>
            </div>
            <div className="quickstart-btns">
              <button className="btn-primary" onClick={() => navigate('/dashboard/notes')}>Generate Notes →</button>
              <button className="btn-ghost" onClick={() => navigate('/dashboard/quiz')}>Take a Quiz</button>
            </div>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="stat-grid">
        {statCards.map(s => (
          <div className="stat-card" key={s.label} style={{ '--stat-color': s.color }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-body">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-delta">{s.delta}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="card heatmap-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Learning Heatmap</h3>
            <p className="card-sub">Your study activity over the past year</p>
          </div>
          <div className="streak-badge">🔥 {user?.streak || 0} day streak</div>
        </div>
        <div className="heatmap-scroll">
          <div className="heatmap-grid">
            {weeks.map((week, wi) => (
              <div className="heatmap-col" key={wi}>
                {week.map((day, di) => (
                  <div
                    key={di}
                    className="heatmap-cell"
                    style={{ background: heatColor(day.count) }}
                    title={`${day.date}: ${day.count} session${day.count !== 1 ? 's' : ''}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="heatmap-legend">
          <span>Less</span>
          {[0,1,2,3,4].map(c => (
            <div key={c} className="heatmap-cell-sm" style={{ background: heatColor(c) }} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Charts row */}
      <div className="charts-row">
        <div className="card chart-card">
          <h3 className="card-title">Score Growth</h3>
          <p className="card-sub">Your quiz performance over time</p>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} domain={[0,100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="score" stroke="var(--accent)" strokeWidth={2}
                  dot={{ fill: 'var(--accent)', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <h3 className="card-title">Quiz Marks</h3>
          <p className="card-sub">Marks scored per quiz session</p>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={marksData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="quiz" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} domain={[0, 10]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="marks" fill="var(--purple)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
