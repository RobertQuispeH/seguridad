import { useState } from 'react'
import LoginForm from './components/LoginForm'
import OtpForm from './components/OtpForm'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './components/AdminDashboard'
import ProfessorDashboard from './components/ProfessorDashboard'

const App = () => {
  const [userId, setUserId] = useState(null)
  const [qrCode, setQrCode] = useState(null)

  const handleLoginSuccess = (userId, qrCode) => {
    setUserId(userId)
    setQrCode(qrCode)
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !userId ? (
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            ) : (
              <OtpForm userId={userId} qrCode={qrCode} setUserId={setUserId} />
            )
          }
        />
        {/* Ruta protegida para admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* Ruta protegida para profesor */}
        <Route
          path="/professor"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <ProfessorDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
