import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './DashboardLayout.css'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '⊞', end: true },
  { to: '/dashboard/notes', label: 'Notes', icon: '✎' },
  { to: '/dashboard/quiz', label: 'Quiz', icon: '◈' },
  { to: '/dashboard/timetable', label: 'Timetable', icon: '◷' },
  { to: '/dashboard/roadmap', label: 'Roadmap', icon: '◬' },
  { to: '/dashboard/analytics', label: 'Analytics', icon: '◉' },
  { to: '/dashboard/profile', label: 'My Profile', icon: '👤' },
]

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout, theme, toggleTheme } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className={`dash-shell ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-logo" onClick={() => navigate('/')}>
            <span className="logo-dot" />
            {!collapsed && 'NeuroTrack'}
          </span>
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)} title="Toggle sidebar">
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        {!collapsed && user && (
          <div className="sidebar-user-card">
            <div className="sidebar-user-avatar">{user.avatar || user.name?.[0] || 'S'}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.name}</div>
              <div className="sidebar-user-email">{user.email}</div>
            </div>
          </div>
        )}
        {collapsed && user && (
          <div className="sidebar-user-collapsed">
            <div className="sidebar-user-avatar-sm">{user.avatar || user.name?.[0] || 'S'}</div>
          </div>
        )}

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
              onClick={() => setMobileOpen(false)}
            >
              <span className="link-icon">{item.icon}</span>
              {!collapsed && <span className="link-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-theme-btn" onClick={toggleTheme} title="Toggle theme">
            <span className="link-icon">{theme === 'dark' ? '☀' : '🌙'}</span>
            {!collapsed && <span className="link-label">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          <button className="sidebar-logout-btn" onClick={handleLogout} title="Logout">
            <span className="link-icon">⏻</span>
            {!collapsed && <span className="link-label">Sign Out</span>}
          </button>
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-topbar">
          <div className="topbar-left">
            <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
            <span className="topbar-logo-sm" onClick={() => navigate('/')}>
              <span className="logo-dot" style={{width:'6px',height:'6px'}}/>
              NeuroTrack
            </span>
          </div>
          <div className="topbar-right">
            <button className="topbar-theme-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? '☀' : '🌙'}
            </button>
            <span className="topbar-badge">AI Ready</span>
            {user && (
              <div className="topbar-user" onClick={() => navigate('/dashboard/profile')}>
                <div className="topbar-avatar">{user.avatar || user.name?.[0] || 'S'}</div>
                <span className="topbar-name">{user.name}</span>
              </div>
            )}
          </div>
        </div>
        <div className="dash-content fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
