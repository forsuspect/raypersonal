import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'
import MouseFollower from './components/MouseFollower'
import ParticlesBackground from './components/ParticlesBackground'

function App() {
  React.useEffect(() => {
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 500);
    }
  }, []);

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
