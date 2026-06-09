import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (e) {
      setError(e.response?.data?.message || '이메일 또는 비밀번호가 올바르지 않습니다')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🐾</div>
          <h1 className="text-3xl font-bold text-gray-900">PawLog</h1>
          <p className="text-gray-500 mt-1">반려동물과 함께하는 일상</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="이메일"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 bg-gray-50"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 bg-gray-50"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          계정이 없으신가요?{' '}
          <Link to="/signup" className="text-primary-600 font-semibold hover:underline">회원가입</Link>
        </p>
      </div>
    </div>
  )
}
