import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
          <span>🐾</span> PawLog
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/explore" className="text-gray-600 hover:text-primary-600 text-sm font-medium">탐색</Link>
          <Link to={`/profile/${user?.id}`} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm overflow-hidden">
              {user?.profileImageUrl ? <img src={user.profileImageUrl} alt="" className="w-full h-full object-cover" /> : user?.username?.[0]?.toUpperCase()}
            </div>
          </Link>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500">로그아웃</button>
        </div>
      </div>
    </nav>
  )
}
