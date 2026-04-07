import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout, theme, toggleTheme } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <span className="logo-dot" />
          NeuroTrack
        </Link>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <a href="#features" className="nav-link" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#roadmaps" className="nav-link" onClick={() => setMenuOpen(false)}>Roadmaps</a>

          {/* Theme toggle */}
          <button className="nav-theme-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀' : '🌙'}
          </button>

          {user ? (
            <>
              <button className="nav-user-chip" onClick={() => { navigate('/dashboard/profile'); setMenuOpen(false) }}>
                <span className="nav-avatar">{user.avatar || user.name?.[0] || 'S'}</span>
                <span>{user.name?.split(' ')[0]}</span>
              </button>
              <button className="btn-ghost nav-cta" onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/auth" className="btn-ghost nav-cta" onClick={() => setMenuOpen(false)}>Log In</Link>
              <Link to="/auth" className="btn-primary nav-cta" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="nav-theme-btn-mobile" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀' : '🌙'}
          </button>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span className={menuOpen ? 'open' : ''} />
            <span className={menuOpen ? 'open' : ''} />
            <span className={menuOpen ? 'open' : ''} />
          </button>
        </div>
      </div>
    </nav>
  )
}
