import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function ExplorePage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await api.get(`/users/search?q=${encodeURIComponent(query)}`)
      setResults(res.data); setSearched(true)
    } catch {}
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-5">탐색</h1>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="사용자 이름으로 검색..."
          className="flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 bg-white" />
        <button type="submit" className="px-5 py-3 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700">검색</button>
      </form>
      {loading && <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div></div>}
      {searched && !loading && results.length === 0 && <div className="text-center py-12 text-gray-400">검색 결과가 없습니다</div>}
      {results.map(user => (
        <Link key={user.id} to={`/profile/${user.id}`}
          className="flex items-center gap-4 bg-white rounded-xl border p-4 mb-3 hover:border-purple-300 transition shadow-sm">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
            {user.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{user.username}</p>
            {user.bio && <p className="text-sm text-gray-500">{user.bio}</p>}
          </div>
        </Link>
      ))}
    </div>
  )
}
