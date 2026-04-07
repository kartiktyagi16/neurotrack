import React, { useState, useEffect } from 'react'
import './Timetable.css'

function generateSchedule(subjects, hoursPerDay, examDate) {
  const today = new Date()
  const exam = new Date(examDate)
  const daysLeft = Math.max(1, Math.ceil((exam - today) / (1000 * 60 * 60 * 24)))
  const schedule = []

  for (let d = 0; d < Math.min(daysLeft, 14); d++) {
    const date = new Date(today)
    date.setDate(date.getDate() + d)
    const daySubjects = [...subjects]
    const hoursEach = Math.max(1, Math.floor(hoursPerDay / subjects.length))
    const blocks = daySubjects.map(s => ({
      subject: s,
      hours: hoursEach,
      done: false,
    }))
    schedule.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      blocks,
    })
  }
  return schedule
}

export default function Timetable() {
  const [subjectInput, setSubjectInput] = useState('')
  const [subjects, setSubjects] = useState([])
  const [hours, setHours] = useState(4)
  const [examDate, setExamDate] = useState('')
  const [schedule, setSchedule] = useState(null)
  const [checks, setChecks] = useState({})

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('nt_timetable') || '{}')
    if (saved.schedule) setSchedule(saved.schedule)
    if (saved.checks) setChecks(saved.checks)
  }, [])

  const addSubject = () => {
    if (subjectInput.trim() && !subjects.includes(subjectInput.trim())) {
      setSubjects(prev => [...prev, subjectInput.trim()])
      setSubjectInput('')
    }
  }

  const removeSubject = (s) => setSubjects(prev => prev.filter(x => x !== s))

  const handleGenerate = () => {
    if (!subjects.length || !examDate) return
    const s = generateSchedule(subjects, hours, examDate)
    setSchedule(s)
    localStorage.setItem('nt_timetable', JSON.stringify({ schedule: s, checks }))
  }

  const toggleCheck = (di, bi) => {
    const key = `${di}-${bi}`
    const updated = { ...checks, [key]: !checks[key] }
    setChecks(updated)
    localStorage.setItem('nt_timetable', JSON.stringify({ schedule, checks: updated }))
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="timetable-page fade-in">
      <div className="dash-page-header">
        <h1 className="section-title">Timetable Generator</h1>
        <p className="section-subtitle">Get an optimized study schedule based on your subjects and exam date.</p>
      </div>

      <div className="timetable-layout">
        <div className="tt-form-panel">
          <div className="card">
            <h3 className="card-title" style={{marginBottom:20}}>Configure Schedule</h3>
            <div className="form-stack">
              <div className="form-group">
                <label>Add Subjects</label>
                <div className="subject-input-row">
                  <input
                    className="form-input"
                    placeholder="e.g. Mathematics"
                    value={subjectInput}
                    onChange={e => setSubjectInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSubject()}
                  />
                  <button className="btn-ghost add-btn" onClick={addSubject}>Add</button>
                </div>
                <div className="subject-tags">
                  {subjects.map(s => (
                    <span key={s} className="subject-tag">
                      {s}
                      <button onClick={() => removeSubject(s)}>×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Study Hours Per Day: <strong>{hours}h</strong></label>
                <input
                  type="range" min="1" max="12" value={hours}
                  onChange={e => setHours(Number(e.target.value))}
                  className="hour-slider"
                />
                <div className="slider-labels"><span>1h</span><span>12h</span></div>
              </div>

              <div className="form-group">
                <label>Exam Date</label>
                <input
                  type="date" className="form-input"
                  value={examDate} min={minDate}
                  onChange={e => setExamDate(e.target.value)}
                />
              </div>

              <button
                className="btn-primary generate-btn"
                onClick={handleGenerate}
                disabled={!subjects.length || !examDate}
              >
                ◷ Generate Schedule
              </button>
            </div>
          </div>
        </div>

        <div className="tt-output">
          {!schedule ? (
            <div className="card output-empty">
              <div className="empty-icon">◷</div>
              <h3>No schedule yet</h3>
              <p>Add subjects and set your exam date to generate a study plan.</p>
            </div>
          ) : (
            <div className="schedule-grid">
              {schedule.map((day, di) => {
                const total = day.blocks.length
                const done = day.blocks.filter((_, bi) => checks[`${di}-${bi}`]).length
                return (
                  <div key={di} className={`day-card card ${done === total ? 'day-complete' : ''}`}>
                    <div className="day-header">
                      <span className="day-date">{day.date}</span>
                      <span className="day-progress">{done}/{total}</span>
                    </div>
                    <div className="day-blocks">
                      {day.blocks.map((block, bi) => (
                        <label key={bi} className={`block-item ${checks[`${di}-${bi}`] ? 'done' : ''}`}>
                          <input
                            type="checkbox"
                            checked={!!checks[`${di}-${bi}`]}
                            onChange={() => toggleCheck(di, bi)}
                          />
                          <div>
                            <div className="block-subject">{block.subject}</div>
                            <div className="block-hours">{block.hours}h session</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
