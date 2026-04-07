import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Notes from './pages/Notes'
import Quiz from './pages/Quiz'
import Timetable from './pages/Timetable'
import Roadmap from './pages/Roadmap'
import Analytics from './pages/Analytics'
import StudentProfile from './pages/StudentProfile'
import DashboardLayout from './components/DashboardLayout'

// Protected route — redirects to /auth if not logged in
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'var(--bg-base)' }}>
      <div className="spinner" />
    </div>
  )
  return user ? children : <Navigate to="/auth" replace />
}

// Auth route — redirects to /dashboard if already logged in
function AuthRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
      <Route
        path="/dashboard"
        element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
      >
        <Route index element={<Dashboard />} />
        <Route path="notes" element={<Notes />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
