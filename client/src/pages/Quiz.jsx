import React, { useState, useEffect } from 'react'
import './Quiz.css'

export default function Quiz() {
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [questions, setQuestions] = useState(null)
  const [selected, setSelected] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('nt_quiz_results') || '[]')
    setResults(saved)
  }, [])

  // 🔥 REAL AI CALL
  const handleGenerate = async () => {
    if (!topic.trim()) return

    setLoading(true)
    setQuestions(null)
    setSelected({})
    setSubmitted(false)
    setError(null)

    try {
      const res = await fetch('http://localhost:5001/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty, count: 5 })
      })

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to generate quiz")
      }

      // ✅ Convert backend format → frontend format
      const formatted = data.data.questions.map(q => ({
        q: q.question,
        options: q.options,
        answer: q.correctIndex,
        explanation: q.explanation
      }))

      setQuestions(formatted)

    } catch (err) {
      console.error(err)
      setError("Failed to generate quiz. Try again.")
    }

    setLoading(false)
  }

  const handleSelect = (qi, oi) => {
    if (submitted) return
    setSelected(prev => ({ ...prev, [qi]: oi }))
  }

  const handleSubmit = () => {
    if (!questions) return

    let correct = 0
    questions.forEach((q, i) => {
      if (selected[i] === q.answer) correct++
    })

    setScore(correct)
    setSubmitted(true)

    const result = {
      id: Date.now(),
      topic,
      difficulty,
      score: correct,
      total: questions.length,
      pct: Math.round((correct / questions.length) * 100),
      date: new Date().toLocaleString(),
    }

    const updated = [result, ...results].slice(0, 20)
    setResults(updated)
    localStorage.setItem('nt_quiz_results', JSON.stringify(updated))
  }

  const resetQuiz = () => {
    setQuestions(null)
    setSelected({})
    setSubmitted(false)
    setScore(0)
  }

  const getOptionClass = (qi, oi) => {
    if (!submitted) return selected[qi] === oi ? 'option selected' : 'option'
    if (oi === questions[qi].answer) return 'option correct'
    if (selected[qi] === oi && oi !== questions[qi].answer) return 'option wrong'
    return 'option'
  }

  return (
    <div className="quiz-page fade-in">

      <h1>AI Quiz Generator</h1>

      <input
        placeholder="Enter topic"
        value={topic}
        onChange={e => setTopic(e.target.value)}
      />

      <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Start Quiz"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {questions && questions.map((q, qi) => (
        <div key={qi}>
          <h3>{q.q}</h3>

          {q.options.map((opt, oi) => (
            <button
              key={oi}
              className={getOptionClass(qi, oi)}
              onClick={() => handleSelect(qi, oi)}
            >
              {opt}
            </button>
          ))}

          {submitted && (
            <div>
              {selected[qi] === q.answer ? "✅ Correct" : "❌ Wrong"}
              <p>{q.explanation}</p>
            </div>
          )}
        </div>
      ))}

      {questions && !submitted && (
        <button onClick={handleSubmit}>
          Submit Quiz
        </button>
      )}

      {submitted && (
        <div>
          <h2>Score: {score}/{questions.length}</h2>
          <button onClick={resetQuiz}>New Quiz</button>
        </div>
      )}

    </div>
  )
}