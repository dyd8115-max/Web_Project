import { useState, useEffect, useCallback } from 'react'
import api from '../api/axios'
import PostCard from '../components/PostCard'
import CreatePostModal from '../components/CreatePostModal'

export default function FeedPage() {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('all')
  const [showCreate, setShowCreate] = useState(false)

  const fetchPosts = useCallback(async (reset = false) => {
    setLoading(true)
    const currentPage = reset ? 0 : page
    try {
      const endpoint = tab === 'following' ? `/posts/feed?page=${currentPage}` : `/posts?page=${currentPage}`
      const res = await api.get(endpoint)
      const { content, last } = res.data
      setPosts(prev => reset ? content : [...prev, ...content])
      setHasMore(!last)
      if (!reset) setPage(p => p + 1)
      else setPage(1)
    } catch (e) {}
    setLoading(false)
  }, [tab, page])

  useEffect(() => {
    setPosts([])
    setPage(0)
    setHasMore(true)
    fetchPosts(true)
  }, [tab])

  const handleDelete = (id) => setPosts(prev => prev.filter(p => p.id !== id))
  const handleCreated = (post) => setPosts(prev => [post, ...prev])

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          <button onClick={() => setTab('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'all' ? 'bg-white shadow text-primary-600' : 'text-gray-500'}`}>전체 피드</button>
          <button onClick={() => setTab('following')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'following' ? 'bg-white shadow text-primary-600' : 'text-gray-500'}`}>팔로잉</button>
        </div>
        <button onClick={() => setShowCreate(true)} className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 flex items-center gap-1.5">
          <span>✏️</span> 글쓰기
        </button>
      </div>

      {posts.map(post => <PostCard key={post.id} post={post} onDelete={handleDelete} />)}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🐾</div>
          <p>아직 게시물이 없습니다</p>
        </div>
      )}

      {hasMore && !loading && posts.length > 0 && (
        <button onClick={() => fetchPosts()} className="w-full py-3 text-sm text-primary-600 border border-primary-200 rounded-xl hover:bg-primary-50 mt-2">
          더 보기
        </button>
      )}

      {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />}
    </div>
  )
}
