import React, { useState } from 'react'
import './Roadmap.css'

export default function Roadmap() {
  const [goal, setGoal] = useState('')
  const [duration, setDuration] = useState(4)
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 🔥 AI CALL
  const generateRoadmap = async () => {
    if (!goal.trim()) return

    setLoading(true)
    setRoadmap(null)
    setError(null)

    try {
      const res = await fetch('http://localhost:5001/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, duration })
      })

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to generate roadmap")
      }

      setRoadmap(data.data.weeks)

    } catch (err) {
      console.error(err)
      setError("Failed to generate roadmap")
    }

    setLoading(false)
  }

  return (
    <div className="roadmap-page">

      <h1>AI Roadmap Generator</h1>

      <input
        placeholder="Enter your goal (e.g. Learn DSA, Web Dev)"
        value={goal}
        onChange={e => setGoal(e.target.value)}
      />

      <input
        type="number"
        value={duration}
        onChange={e => setDuration(e.target.value)}
        placeholder="Weeks"
      />

      <button onClick={generateRoadmap} disabled={loading}>
        {loading ? "Generating..." : "Generate Roadmap"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {roadmap && roadmap.map((week, i) => (
        <div key={i} style={{ marginTop: 20 }}>
          <h2>Week {week.week}: {week.title}</h2>

          <ul>
            {week.topics.map((t, j) => (
              <li key={j}>{t}</li>
            ))}
          </ul>
        </div>
      ))}

    </div>
  )
}