import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export default function Auth() {
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'otp'
  const [step, setStep] = useState(1) // signup steps
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', goal: '', subjects: '' })
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [pendingUser, setPendingUser] = useState(null)
  const otpRefs = useRef([])
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const sendOtpEmail = async (email, name, code) => {
    // Try server-side OTP sending (uses nodemailer when SMTP is configured)
    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
      const data = await res.json()
      if (data.success) {
        // Server is running — if demo mode, server returns the OTP
        if (data.demo && data.otp) {
          // Override the locally generated OTP with server's OTP
          setGeneratedOtp(data.otp)
        } else {
          // Real email sent — keep the locally generated OTP as a fallback display
        }
        return !data.demo // true = real email sent
      }
    } catch {
      // Server not running — fall back to frontend-only demo mode
    }
    return false
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) return setError('Please fill in all fields.')
    if (!form.email.includes('@')) return setError('Enter a valid email address.')
    setLoading(true)

    // Check if user exists in localStorage
    const profileKey = `nt_profile_${form.email}`
    const stored = localStorage.getItem(profileKey)
    if (!stored) {
      setLoading(false)
      return setError("No account found. Please sign up first.")
    }

    const profile = JSON.parse(stored)
    if (profile.password !== form.password) {
      setLoading(false)
      return setError("Incorrect password.")
    }

    // Generate OTP and send email
    const code = generateOTP()
    setGeneratedOtp(code)
    setPendingUser(profile)

    const sent = await sendOtpEmail(form.email, profile.name, code)
    setLoading(false)

    if (sent) {
      setSuccess(`OTP sent to ${form.email}`)
    } else {
      // Demo mode - show OTP on screen
      setSuccess(`Demo mode: Your OTP is ${code}`)
    }
    setMode('otp')
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (step === 1) {
      if (!form.name.trim()) return setError('Please enter your full name.')
      if (!form.email.includes('@')) return setError('Enter a valid email address.')
      if (form.password.length < 6) return setError('Password must be at least 6 characters.')
      if (form.password !== form.confirm) return setError("Passwords don't match.")
      const existing = localStorage.getItem(`nt_profile_${form.email}`)
      if (existing) return setError('An account with this email already exists. Please log in.')
      setStep(2)
      return
    }

    if (step === 2) {
      setLoading(true)
      const code = generateOTP()
      setGeneratedOtp(code)
      const user = {
        name: form.name,
        email: form.email,
        password: form.password,
        goal: form.goal,
        subjects: form.subjects.split(',').map(s => s.trim()).filter(Boolean),
      }
      setPendingUser(user)

      const sent = await sendOtpEmail(form.email, form.name, code)
      setLoading(false)

      if (sent) {
        setSuccess(`OTP sent to ${form.email}`)
      } else {
        setSuccess(`Demo mode: Your OTP is ${code}`)
      }
      setMode('otp')
    }
  }

  const handleOtpChange = (val, idx) => {
    const clean = val.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[idx] = clean
    setOtp(next)
    if (clean && idx < 5) otpRefs.current[idx + 1]?.focus()
    if (!clean && idx > 0) otpRefs.current[idx - 1]?.focus()
    setError('')
  }

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (text.length === 6) {
      setOtp(text.split(''))
      otpRefs.current[5]?.focus()
    }
  }

  const verifyOtp = () => {
    const entered = otp.join('')
    if (entered.length < 6) return setError('Enter the 6-digit OTP.')
    if (entered !== generatedOtp) return setError('Incorrect OTP. Please try again.')
    login(pendingUser)
    navigate('/dashboard')
  }

  const resendOtp = async () => {
    setLoading(true)
    const code = generateOTP()
    setGeneratedOtp(code)
    setOtp(['', '', '', '', '', ''])
    const sent = await sendOtpEmail(pendingUser.email, pendingUser.name, code)
    setLoading(false)
    if (sent) {
      setSuccess(`OTP resent to ${pendingUser.email}`)
    } else {
      setSuccess(`Demo mode: Your new OTP is ${code}`)
    }
    setError('')
  }

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-grid" />
      </div>

      <div className="auth-left">
        <Link to="/" className="auth-logo">
          <span className="logo-dot" />
          NeuroTrack
        </Link>
        <div className="auth-brand-block">
          <h2 className="auth-brand-title">Your AI-powered<br />Learning OS</h2>
          <p className="auth-brand-sub">
            Generate notes, build quizzes, track your growth — all in one place built for serious learners.
          </p>
          <div className="auth-features-list">
            {[
              { icon: '✎', text: 'AI Notes Generator' },
              { icon: '◈', text: 'Smart Quiz Builder' },
              { icon: '◉', text: 'Growth Analytics' },
              { icon: '◬', text: 'Roadmap Planner' },
            ].map(f => (
              <div className="auth-feature-item" key={f.text}>
                <span className="auth-feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
          <div className="auth-stats-row">
            <div className="auth-stat"><span className="auth-stat-val">10K+</span><span className="auth-stat-lbl">Students</span></div>
            <div className="auth-stat"><span className="auth-stat-val">500K+</span><span className="auth-stat-lbl">Notes Generated</span></div>
            <div className="auth-stat"><span className="auth-stat-val">98%</span><span className="auth-stat-lbl">Satisfaction</span></div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          {/* OTP Mode */}
          {mode === 'otp' ? (
            <div className="auth-form-wrap fade-in">
              <div className="auth-otp-icon">📬</div>
              <h2 className="auth-title">Check your email</h2>
              <p className="auth-subtitle">
                We sent a 6-digit verification code to<br />
                <strong className="auth-email-highlight">{pendingUser?.email}</strong>
              </p>

              {success && (
                <div className="auth-success-banner">{success}</div>
              )}

              <div className="otp-inputs" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(e.target.value, i)}
                    onKeyDown={e => handleOtpKeyDown(e, i)}
                    className={`otp-box ${digit ? 'filled' : ''}`}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {error && <div className="auth-error">{error}</div>}

              <button className="auth-btn-primary" onClick={verifyOtp}>
                Verify & Continue →
              </button>

              <div className="auth-resend">
                Didn't receive it?{' '}
                <button className="auth-link-btn" onClick={resendOtp} disabled={loading}>
                  {loading ? 'Resending...' : 'Resend OTP'}
                </button>
              </div>

              <button className="auth-back-btn" onClick={() => { setMode('login'); setOtp(['','','','','','']); setError(''); setSuccess('') }}>
                ← Back to login
              </button>
            </div>
          ) : (
            <>
              {/* Tab Switch */}
              <div className="auth-tabs">
                <button
                  className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                  onClick={() => { setMode('login'); setStep(1); setError('') }}
                >
                  Sign In
                </button>
                <button
                  className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
                  onClick={() => { setMode('signup'); setStep(1); setError('') }}
                >
                  Create Account
                </button>
              </div>

              {/* LOGIN */}
              {mode === 'login' && (
                <form className="auth-form fade-in" onSubmit={handleLoginSubmit}>
                  <h2 className="auth-title">Welcome back</h2>
                  <p className="auth-subtitle">Sign in to continue your learning journey.</p>

                  <div className="auth-field">
                    <label>Email address</label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">✉</span>
                      <input
                        type="email" name="email" value={form.email}
                        onChange={handleChange} placeholder="you@example.com"
                        className="auth-input" required
                      />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label>Password</label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">🔒</span>
                      <input
                        type="password" name="password" value={form.password}
                        onChange={handleChange} placeholder="Enter your password"
                        className="auth-input" required
                      />
                    </div>
                  </div>

                  {error && <div className="auth-error">{error}</div>}

                  <button type="submit" className="auth-btn-primary" disabled={loading}>
                    {loading ? <span className="auth-spinner" /> : 'Send OTP & Sign In →'}
                  </button>

                  <div className="auth-divider"><span>or</span></div>
                  <p className="auth-switch">
                    New here?{' '}
                    <button type="button" className="auth-link-btn" onClick={() => { setMode('signup'); setStep(1); setError('') }}>
                      Create an account
                    </button>
                  </p>
                </form>
              )}

              {/* SIGNUP */}
              {mode === 'signup' && (
                <form className="auth-form fade-in" onSubmit={handleSignupSubmit}>
                  {step === 1 ? (
                    <>
                      <h2 className="auth-title">Create your account</h2>
                      <p className="auth-subtitle">Step 1 of 2 — Basic information</p>

                      <div className="auth-steps-bar">
                        <div className="auth-step-dot active" />
                        <div className="auth-step-line" />
                        <div className="auth-step-dot" />
                      </div>

                      <div className="auth-field">
                        <label>Full Name</label>
                        <div className="auth-input-wrap">
                          <span className="auth-input-icon">👤</span>
                          <input
                            type="text" name="name" value={form.name}
                            onChange={handleChange} placeholder="Your full name"
                            className="auth-input" required
                          />
                        </div>
                      </div>

                      <div className="auth-field">
                        <label>Email address</label>
                        <div className="auth-input-wrap">
                          <span className="auth-input-icon">✉</span>
                          <input
                            type="email" name="email" value={form.email}
                            onChange={handleChange} placeholder="you@example.com"
                            className="auth-input" required
                          />
                        </div>
                      </div>

                      <div className="auth-field">
                        <label>Password</label>
                        <div className="auth-input-wrap">
                          <span className="auth-input-icon">🔒</span>
                          <input
                            type="password" name="password" value={form.password}
                            onChange={handleChange} placeholder="Min 6 characters"
                            className="auth-input" required
                          />
                        </div>
                      </div>

                      <div className="auth-field">
                        <label>Confirm Password</label>
                        <div className="auth-input-wrap">
                          <span className="auth-input-icon">🔒</span>
                          <input
                            type="password" name="confirm" value={form.confirm}
                            onChange={handleChange} placeholder="Repeat password"
                            className="auth-input" required
                          />
                        </div>
                      </div>

                      {error && <div className="auth-error">{error}</div>}

                      <button type="submit" className="auth-btn-primary">
                        Next: Learning Profile →
                      </button>
                    </>
                  ) : (
                    <>
                      <h2 className="auth-title">Your learning profile</h2>
                      <p className="auth-subtitle">Step 2 of 2 — Help us personalize your experience</p>

                      <div className="auth-steps-bar">
                        <div className="auth-step-dot done" />
                        <div className="auth-step-line done" />
                        <div className="auth-step-dot active" />
                      </div>

                      <div className="auth-field">
                        <label>Learning Goal</label>
                        <select name="goal" value={form.goal} onChange={handleChange} className="auth-input auth-select">
                          <option value="">Select your primary goal</option>
                          <option value="placement">Campus Placement / Job</option>
                          <option value="exam">Competitive Exam (GATE, CAT…)</option>
                          <option value="webdev">Web Development</option>
                          <option value="ai">AI / Machine Learning</option>
                          <option value="dsa">DSA / Competitive Programming</option>
                          <option value="other">Other / Exploring</option>
                        </select>
                      </div>

                      <div className="auth-field">
                        <label>Current Subjects <span className="auth-hint">(comma-separated)</span></label>
                        <div className="auth-input-wrap">
                          <span className="auth-input-icon">📚</span>
                          <input
                            type="text" name="subjects" value={form.subjects}
                            onChange={handleChange} placeholder="e.g. Math, Physics, DSA"
                            className="auth-input"
                          />
                        </div>
                      </div>

                      {error && <div className="auth-error">{error}</div>}

                      <button type="submit" className="auth-btn-primary" disabled={loading}>
                        {loading ? <span className="auth-spinner" /> : 'Create Account & Send OTP →'}
                      </button>

                      <button type="button" className="auth-back-btn" onClick={() => setStep(1)}>
                        ← Back
                      </button>
                    </>
                  )}

                  <div className="auth-divider"><span>or</span></div>
                  <p className="auth-switch">
                    Already have an account?{' '}
                    <button type="button" className="auth-link-btn" onClick={() => { setMode('login'); setStep(1); setError('') }}>
                      Sign in
                    </button>
                  </p>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
