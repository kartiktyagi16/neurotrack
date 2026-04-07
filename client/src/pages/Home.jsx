import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Home.css'

const features = [
  {
    icon: '✎',
    title: 'AI Notes Generator',
    desc: 'Generate structured, comprehensive notes on any topic instantly. Definitions, key points, examples — all in one place.',
    accent: '#3ea6ff',
    tag: 'Popular',
  },
  {
    icon: '◈',
    title: 'Smart Quiz Builder',
    desc: 'Auto-generate MCQ quizzes on any subject. Test your knowledge and track performance over time.',
    accent: '#a78bfa',
    tag: 'New',
  },
  {
    icon: '◉',
    title: 'Growth Analytics',
    desc: 'Visual dashboards showing your learning velocity, quiz scores, and time spent studying.',
    accent: '#34d399',
  },
  {
    icon: '▦',
    title: 'Learning Heatmap',
    desc: 'GitHub-style activity heatmap that shows your study streaks and daily consistency.',
    accent: '#fbbf24',
  },
  {
    icon: '◷',
    title: 'Timetable Generator',
    desc: 'Input your subjects and exam dates. Get an optimized study schedule tailored to your pace.',
    accent: '#f87171',
  },
  {
    icon: '◬',
    title: 'Roadmap Builder',
    desc: 'Pick a goal — Placement, AI, Web Dev, DSA. Get a complete week-by-week learning roadmap.',
    accent: '#3ea6ff',
    tag: 'Beta',
  },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home">
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="hero-noise" />
        <div className="container hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Powered by AI · Designed for Learners
          </div>
          <h1 className="hero-title">
            Your Personal AI<br />
            <span className="hero-accent">Learning Operating System</span>
          </h1>
          <p className="hero-sub">
            NeuroTrack combines AI-generated notes, smart quizzes, learning heatmaps,
            and roadmaps into one sleek dashboard. Study smarter, not harder.
          </p>
          <div className="hero-pills">
            <span className="pill">📝 AI Notes</span>
            <span className="pill">🧠 Smart Quizzes</span>
            <span className="pill">🗺️ Roadmaps</span>
            <span className="pill">📊 Analytics</span>
          </div>
          <div className="hero-actions">
            <button className="btn-primary hero-btn" onClick={() => navigate('/auth')}>
              Get Started →
            </button>
            <a href="#features" className="btn-ghost hero-btn">
              Explore Features
            </a>
          </div>

          {/* Dashboard preview mockup */}
          <div className="hero-mockup">
            <div className="mockup-bar">
              <span /><span /><span />
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                {['Dashboard','Notes','Quiz','Timetable','Analytics'].map(i => (
                  <div key={i} className={`mockup-link ${i==='Dashboard'?'active':''}`}>{i}</div>
                ))}
              </div>
              <div className="mockup-content">
                <div className="mockup-stats">
                  {['Notes','Quizzes','Avg Score','Hours'].map((s, i) => (
                    <div key={s} className="mockup-stat">
                      <div className="mockup-stat-val">{['24','12','87%','48'][i]}</div>
                      <div className="mockup-stat-label">{s}</div>
                    </div>
                  ))}
                </div>
                <div className="mockup-chart">
                  {[40,55,35,65,50,80,60,85,70,90,75,95].map((h, i) => (
                    <div key={i} className="mockup-bar-col" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header">
            <span className="tag">Features</span>
            <h2 className="features-title">Everything you need to learn faster</h2>
            <p className="features-sub">Six powerful tools, one unified platform.</p>
          </div>
          <div className="features-grid">
            {features.map(f => (
              <div className="feature-card" key={f.title} style={{ '--card-accent': f.accent }}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-top">
                  <h3 className="feature-title">{f.title}</h3>
                  {f.tag && <span className="feature-tag">{f.tag}</span>}
                </div>
                <p className="feature-desc">{f.desc}</p>
                <div className="feature-line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="cta-band" id="roadmaps">
        <div className="container cta-inner">
          <div>
            <h2 className="cta-title">Ready to evolve your learning?</h2>
            <p className="cta-sub">Join thousands of students using NeuroTrack to ace their goals.</p>
          </div>
          <button className="btn-primary cta-btn" onClick={() => navigate('/auth')}>
            Open Dashboard →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">
              <span className="logo-dot" />NeuroTrack
            </span>
            <p className="footer-tagline">Track. Learn. Evolve.</p>
          </div>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#roadmaps">Roadmaps</a>
            <a href="/auth">Dashboard</a>
          </div>
          <div className="footer-social">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="social-link" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-link" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="footer-copy">
          Made with ♥ by Kartik &nbsp;·&nbsp; © 2026 NeuroTrack. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
