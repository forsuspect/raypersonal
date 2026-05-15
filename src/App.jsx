import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'
import LoadingScreen from './components/LoadingScreen'
import MouseFollower from './components/MouseFollower'
import ParticlesBackground from './components/ParticlesBackground'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <MouseFollower />
      <ParticlesBackground />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/*" element={<DashboardPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </Router>
  )
}

export default App
