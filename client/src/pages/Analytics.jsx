import React, { useState, useEffect } from 'react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import './Analytics.css'

const TOOLTIP_STYLE = {
  backgroundColor: '#1f1f1f',
  border: '1px solid #2a2a2a',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '13px',
}

const weeklyData = [
  { week: 'W1', score: 55, hours: 8, notes: 4 },
  { week: 'W2', score: 62, hours: 10, notes: 6 },
  { week: 'W3', score: 58, hours: 7, notes: 3 },
  { week: 'W4', score: 71, hours: 12, notes: 8 },
  { week: 'W5', score: 75, hours: 11, notes: 7 },
  { week: 'W6', score: 80, hours: 14, notes: 9 },
  { week: 'W7', score: 86, hours: 13, notes: 10 },
  { week: 'W8', score: 91, hours: 15, notes: 12 },
]

const subjectData = [
  { subject: 'DSA', score: 88, quizzes: 5 },
  { subject: 'Math', score: 74, quizzes: 4 },
  { subject: 'OS', score: 81, quizzes: 3 },
  { subject: 'DBMS', score: 66, quizzes: 2 },
  { subject: 'Networks', score: 79, quizzes: 3 },
]

export default function Analytics() {
  const [quizResults, setQuizResults] = useState([])
  const [stats, setStats] = useState({})

  useEffect(() => {
    const r = JSON.parse(localStorage.getItem('nt_quiz_results') || '[]')
    setQuizResults(r)
    const s = JSON.parse(localStorage.getItem('nt_stats') || '{}')
    setStats(s)
  }, [])

  const liveData = quizResults.slice(0, 8).reverse().map((r, i) => ({
    quiz: `Q${i+1}`,
    score: r.pct,
    subject: r.topic,
  }))

  return (
    <div className="analytics-page fade-in">
      <div className="dash-page-header">
        <h1 className="section-title">Analytics</h1>
        <p className="section-subtitle">Deep insights into your learning performance.</p>
      </div>

      {/* Top KPIs */}
      <div className="kpi-row">
        {[
          { label: 'Total Study Time', value: `${stats.hours || 48}h`, sub: '+4h this week', color: '#3ea6ff' },
          { label: 'Avg Quiz Score', value: `${stats.avgScore || 87}%`, sub: 'Across all quizzes', color: '#34d399' },
          { label: 'Learning Streak', value: '7 days', sub: 'Personal best: 12 days', color: '#fbbf24' },
          { label: 'Completion Rate', value: '73%', sub: 'Tasks finished on time', color: '#a78bfa' },
        ].map(k => (
          <div key={k.label} className="kpi-card card" style={{ '--kpi-color': k.color }}>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Area chart - weekly growth */}
      <div className="card chart-full">
        <h3 className="card-title">Weekly Progress Overview</h3>
        <p className="card-sub">Score, study hours, and notes generated per week</p>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3ea6ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3ea6ff" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
              <XAxis dataKey="week" stroke="#444" tick={{ fontSize: 12 }} />
              <YAxis stroke="#444" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#666' }} />
              <Area type="monotone" dataKey="score" stroke="#3ea6ff" fill="url(#scoreGrad)" strokeWidth={2} name="Score %" />
              <Area type="monotone" dataKey="hours" stroke="#a78bfa" fill="url(#hoursGrad)" strokeWidth={2} name="Hours" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts-two">
        {/* Subject breakdown */}
        <div className="card">
          <h3 className="card-title">Subject Performance</h3>
          <p className="card-sub">Average score per subject</p>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={subjectData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" horizontal={false} />
                <XAxis type="number" stroke="#444" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <YAxis type="category" dataKey="subject" stroke="#444" tick={{ fontSize: 11 }} width={55} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="score" fill="#3ea6ff" radius={[0,4,4,0]} name="Score %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent quiz performance */}
        <div className="card">
          <h3 className="card-title">Recent Quiz Scores</h3>
          <p className="card-sub">Your last {liveData.length || 8} quiz results</p>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={liveData.length ? liveData : weeklyData.map((w,i) => ({ quiz: w.week, score: w.score }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                <XAxis dataKey="quiz" stroke="#444" tick={{ fontSize: 11 }} />
                <YAxis stroke="#444" tick={{ fontSize: 11 }} domain={[0,100]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Line type="monotone" dataKey="score" stroke="#34d399" strokeWidth={2} dot={{ fill: '#34d399', r: 4 }} name="Score %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Subject cards */}
      <div className="subject-breakdown">
        {subjectData.map(s => (
          <div key={s.subject} className="subject-row card">
            <div className="subject-name">{s.subject}</div>
            <div className="subject-bar-track">
              <div className="subject-bar-fill" style={{ width: `${s.score}%` }} />
            </div>
            <div className="subject-score">{s.score}%</div>
            <div className="subject-quizzes">{s.quizzes} quizzes</div>
          </div>
        ))}
      </div>
    </div>
  )
}
