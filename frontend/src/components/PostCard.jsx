import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../store/useAuthStore'

export default function PostCard({ post, onDelete }) {
  const { user } = useAuthStore()
  const [liked, setLiked] = useState(post.likedByCurrentUser)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    try {
      const res = await api.post(`/posts/${post.id}/like`)
      setLiked(res.data.liked)
      setLikeCount(prev => res.data.liked ? prev + 1 : prev - 1)
    } catch (e) {}
  }

  const loadComments = async () => {
    if (!showComments) {
      const res = await api.get(`/posts/${post.id}/comments`)
      setComments(res.data)
    }
    setShowComments(!showComments)
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setLoading(true)
    try {
      const res = await api.post(`/posts/${post.id}/comments`, { content: commentText })
      setComments(prev => [res.data, ...prev])
      setCommentText('')
    } catch (e) {}
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!window.confirm('게시물을 삭제하시겠습니까?')) return
    try {
      await api.delete(`/posts/${post.id}`)
      onDelete?.(post.id)
    } catch (e) {}
  }

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr)
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return '방금 전'
    if (mins < 60) return `${mins}분 전`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}시간 전`
    return `${Math.floor(hours / 24)}일 전`
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 mb-4 overflow-hidden shadow-sm">
      <div className="p-4 flex items-center justify-between">
        <Link to={`/profile/${post.author.id}`} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold overflow-hidden">
            {post.author.profileImageUrl ? <img src={post.author.profileImageUrl} alt="" className="w-full h-full object-cover" /> : post.author.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">{post.author.username}</p>
            <p className="text-xs text-gray-400">{timeAgo(post.createdAt)}</p>
          </div>
        </Link>
        {user?.id === post.author.id && (
          <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 text-xs">삭제</button>
        )}
      </div>

      {post.imageUrl && (
        <img src={post.imageUrl} alt="post" className="w-full object-cover max-h-96" />
      )}

      <div className="p-4">
        <p className="text-gray-800 text-sm mb-2 whitespace-pre-wrap">{post.content}</p>
        {post.hashtags?.length > 0 && (
          <p className="text-primary-500 text-sm mb-3">{post.hashtags.map(t => `#${t}`).join(' ')}</p>
        )}
        <div className="flex items-center gap-5 text-sm text-gray-500">
          <button onClick={handleLike} className={`flex items-center gap-1 transition-colors ${liked ? 'text-red-500' : 'hover:text-red-400'}`}>
            <span className="text-lg">{liked ? '❤️' : '🤍'}</span> {likeCount}
          </button>
          <button onClick={loadComments} className="flex items-center gap-1 hover:text-primary-500">
            <span className="text-lg">💬</span> {post.commentCount}
          </button>
        </div>
      </div>

      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
          <form onSubmit={handleComment} className="flex gap-2 mb-3">
            <input
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="flex-1 text-sm border border-gray-200 rounded-full px-3 py-1.5 focus:outline-none focus:border-primary-400"
            />
            <button disabled={loading} className="text-sm text-primary-600 font-medium hover:text-primary-700">등록</button>
          </form>
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-bold flex-shrink-0">
                {comment.author.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-700 mr-2">{comment.author.username}</span>
                <span className="text-xs text-gray-600">{comment.content}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
