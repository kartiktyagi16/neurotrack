import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('dark')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('nt_user')
    const storedTheme = localStorage.getItem('nt_theme') || 'dark'
    if (stored) setUser(JSON.parse(stored))
    setTheme(storedTheme)
    document.documentElement.setAttribute('data-theme', storedTheme)
    setLoading(false)
  }, [])

  const login = (userData) => {
    const profile = getOrCreateProfile(userData)
    setUser(profile)
    localStorage.setItem('nt_user', JSON.stringify(profile))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('nt_user')
  }

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('nt_theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  const getOrCreateProfile = (userData) => {
    const key = `nt_profile_${userData.email}`
    const existing = localStorage.getItem(key)
    if (existing) {
      const parsed = JSON.parse(existing)
      return { ...parsed, ...userData }
    }
    // Create a brand new student profile
    const newProfile = {
      ...userData,
      joinedAt: new Date().toISOString(),
      avatar: userData.name ? userData.name[0].toUpperCase() : 'S',
      stats: { notes: 0, quizzes: 0, avgScore: 0, hours: 0 },
      streak: 0,
      plan: 'Free',
      bio: '',
      subjects: [],
      goal: '',
      achievements: [],
    }
    localStorage.setItem(key, JSON.stringify(newProfile))
    return newProfile
  }

  const updateProfile = (updates) => {
    if (!user) return
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('nt_user', JSON.stringify(updated))
    localStorage.setItem(`nt_profile_${user.email}`, JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, theme, toggleTheme, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
