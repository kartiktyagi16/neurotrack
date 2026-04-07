import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './StudentProfile.css'

const GOAL_LABELS = {
  placement: '🎯 Campus Placement',
  exam: '📝 Competitive Exam',
  webdev: '🌐 Web Development',
  ai: '🤖 AI / Machine Learning',
  dsa: '⚡ DSA / Competitive Prog.',
  other: '🔭 Exploring',
  '': '—',
}

export default function StudentProfile() {
  const { user, updateProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    goal: user?.goal || '',
    subjects: (user?.subjects || []).join(', '),
  })
  const [saved, setSaved] = useState(false)

  if (!user) return null

  const joined = user.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown'

  const handleSave = () => {
    updateProfile({
      name: form.name,
      bio: form.bio,
      goal: form.goal,
      subjects: form.subjects.split(',').map(s => s.trim()).filter(Boolean),
    })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const stats = user.stats || {}
  const statCards = [
    { label: 'Notes Created', value: stats.notes || 0, icon: '✎', color: '#3ea6ff' },
    { label: 'Quizzes Taken', value: stats.quizzes || 0, icon: '◈', color: '#a78bfa' },
    { label: 'Avg Score', value: (stats.avgScore || 0) + '%', icon: '◉', color: '#34d399' },
    { label: 'Study Hours', value: stats.hours || 0, icon: '◷', color: '#fbbf24' },
  ]

  return (
    <div className="profile-page fade-in">
      <div className="dash-page-header">
        <h1 className="section-title">My Profile</h1>
        <p className="section-subtitle">Your personal learning identity.</p>
      </div>

      {saved && (
        <div className="profile-saved-toast">✓ Profile updated successfully</div>
      )}

      <div className="profile-grid">
        {/* Left: Profile Card */}
        <div className="card profile-card">
          <div className="profile-avatar-ring">
            <div className="profile-avatar-lg">{user.avatar || user.name?.[0] || 'S'}</div>
          </div>

          {editing ? (
            <div className="profile-edit-form">
              <div className="auth-field">
                <label>Full Name</label>
                <input
                  className="auth-input"
                  style={{ paddingLeft: '14px' }}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="auth-field">
                <label>Bio</label>
                <textarea
                  className="auth-input"
                  style={{ paddingLeft: '14px', resize: 'vertical', minHeight: '70px' }}
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="auth-field">
                <label>Learning Goal</label>
                <select
                  className="auth-input auth-select"
                  style={{ paddingLeft: '14px' }}
                  value={form.goal}
                  onChange={e => setForm(f => ({ ...f, goal: e.target.value }))}
                >
                  <option value="">Select goal</option>
                  <option value="placement">Campus Placement</option>
                  <option value="exam">Competitive Exam</option>
                  <option value="webdev">Web Development</option>
                  <option value="ai">AI / ML</option>
                  <option value="dsa">DSA</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="auth-field">
                <label>Subjects (comma-separated)</label>
                <input
                  className="auth-input"
                  style={{ paddingLeft: '14px' }}
                  value={form.subjects}
                  onChange={e => setForm(f => ({ ...f, subjects: e.target.value }))}
                  placeholder="Math, Physics, DSA..."
                />
              </div>
              <div className="profile-edit-actions">
                <button className="auth-btn-primary" style={{ flex: 1 }} onClick={handleSave}>Save Changes</button>
                <button className="auth-back-btn" style={{ flex: 1 }} onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="profile-name">{user.name}</div>
              <div className="profile-email">{user.email}</div>
              {user.bio && <div className="profile-bio">{user.bio}</div>}

              <div className="profile-meta-row">
                <span className="profile-badge">{GOAL_LABELS[user.goal] || '🔭 Exploring'}</span>
                <span className="profile-plan-badge">{user.plan || 'Free'} Plan</span>
              </div>

              {user.subjects?.length > 0 && (
                <div className="profile-subjects">
                  {user.subjects.map(s => (
                    <span className="profile-subject-tag" key={s}>{s}</span>
                  ))}
                </div>
              )}

              <div className="profile-joined">Member since {joined}</div>

              <button className="profile-edit-btn" onClick={() => setEditing(true)}>
                ✎ Edit Profile
              </button>
            </>
          )}
        </div>

        {/* Right: Stats */}
        <div className="profile-right">
          <div className="stat-grid">
            {statCards.map(s => (
              <div className="stat-card" key={s.label} style={{ '--stat-color': s.color }}>
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-body">
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Account Info card */}
          <div className="card profile-info-card">
            <h3 className="card-title" style={{ fontSize: '15px', marginBottom: '16px' }}>Account Details</h3>
            <div className="profile-info-rows">
              <div className="profile-info-row">
                <span className="profile-info-label">Email</span>
                <span className="profile-info-val">{user.email}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Plan</span>
                <span className="profile-info-val">{user.plan || 'Free'}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Study Streak</span>
                <span className="profile-info-val">🔥 {user.streak || 0} days</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Joined</span>
                <span className="profile-info-val">{joined}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
