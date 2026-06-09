import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from './store/useAuthStore'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import FeedPage from './pages/FeedPage'
import ProfilePage from './pages/ProfilePage'
import ExplorePage from './pages/ExplorePage'
import Navbar from './components/Navbar'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore()
  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  const { initAuth, isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    initAuth()
  }, [])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="text-center">
        <div className="text-5xl mb-4">🐾</div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
      </div>
    </div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <SignupPage />} />
        <Route path="/" element={<ProtectedRoute><Navbar /><FeedPage /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><Navbar /><ExplorePage /></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProtectedRoute><Navbar /><ProfilePage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
