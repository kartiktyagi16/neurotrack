import React, { useState, useEffect } from 'react'
import './Notes.css'

export default function Notes() {
  const [subject, setSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [notes, setNotes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [history, setHistory] = useState([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('nt_notes_history') || '[]')
    setHistory(saved)
  }, [])

  const validate = () => {
    const e = {}
    if (!subject.trim()) e.subject = 'Subject is required'
    if (!topic.trim()) e.topic = 'Topic is required'
    return e
  }

  // 🔥 REAL AI CALL
  const handleGenerate = async () => {
    const e = validate()
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }

    setErrors({})
    setLoading(true)
    setNotes(null)

    try {
      const res = await fetch('http://localhost:5001/api/generate-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topic, difficulty })
      })

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to generate notes")
      }

      const aiNotes = data.data.notes

      const formatted = {
        title: `${topic} – ${subject}`,
        level: difficulty,
        definition: aiNotes.definition,
        keyPoints: aiNotes.key_points,
        examples: aiNotes.examples,
        summary: aiNotes.summary,
      }

      setNotes(formatted)

      // Save history
      const newEntry = {
        id: Date.now(),
        subject,
        topic,
        difficulty,
        timestamp: new Date().toLocaleString()
      }

      const updated = [newEntry, ...history].slice(0, 10)
      setHistory(updated)
      localStorage.setItem('nt_notes_history', JSON.stringify(updated))

      // Stats
      const stats = JSON.parse(localStorage.getItem('nt_stats') || '{}')
      stats.notes = (stats.notes || 0) + 1
      localStorage.setItem('nt_stats', JSON.stringify(stats))

    } catch (err) {
      console.error(err)
      setErrors({ api: "Failed to generate notes. Try again." })
    }

    setLoading(false)
  }

  const loadFromHistory = (item) => {
    setSubject(item.subject)
    setTopic(item.topic)
    setDifficulty(item.difficulty)
  }

  return (
    <div className="notes-page fade-in">
      <div className="dash-page-header">
        <h1 className="section-title">AI Notes Generator</h1>
        <p className="section-subtitle">Generate structured, exam-ready notes instantly.</p>
      </div>

      <div className="notes-layout">
        {/* Form */}
        <div className="notes-form-panel">
          <div className="card">
            <h3 className="card-title">Generate Notes</h3>

            <div className="form-group">
              <label>Subject</label>
              <input
                className="form-input"
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
              {errors.subject && <span className="form-error">{errors.subject}</span>}
            </div>

            <div className="form-group">
              <label>Topic</label>
              <input
                className="form-input"
                value={topic}
                onChange={e => setTopic(e.target.value)}
              />
              {errors.topic && <span className="form-error">{errors.topic}</span>}
            </div>

            <div className="form-group">
              <label>Difficulty</label>
              <select
                className="form-input"
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <button onClick={handleGenerate} disabled={loading}>
              {loading ? "Generating..." : "Generate Notes"}
            </button>

            {errors.api && <span className="form-error">{errors.api}</span>}
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="card">
              <h3>Recent</h3>
              {history.slice(0, 5).map(item => (
                <button key={item.id} onClick={() => loadFromHistory(item)}>
                  {item.topic} ({item.subject})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Output */}
        <div className="notes-output">
          {loading && <p>Generating notes...</p>}

          {notes && (
            <div className="card">
              <h2>{notes.title}</h2>
              <p><b>{notes.level}</b></p>

              <h3>Definition</h3>
              <p>{notes.definition}</p>

              <h3>Key Points</h3>
              <ul>
                {notes.keyPoints.map((p, i) => <li key={i}>{p}</li>)}
              </ul>

              <h3>Examples</h3>
              <ul>
                {notes.examples.map((e, i) => <li key={i}>{e}</li>)}
              </ul>

              <h3>Summary</h3>
              <p>{notes.summary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}