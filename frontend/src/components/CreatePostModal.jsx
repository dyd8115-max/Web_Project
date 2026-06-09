import { useState } from 'react'
import api from '../api/axios'

export default function CreatePostModal({ onClose, onCreated }) {
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [hashtagInput, setHashtagInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    try {
      const hashtags = hashtagInput.split(/[\s,]+/).filter(t => t.replace('#', '').trim()).map(t => t.replace('#', ''))
      const res = await api.post('/posts', { content, imageUrl: imageUrl || null, hashtags })
      onCreated(res.data)
      onClose()
    } catch (e) {
      alert('게시물 작성에 실패했습니다')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">새 게시물</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="반려동물과의 일상을 공유해보세요 🐾"
            rows={4}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-primary-400 resize-none mb-3"
          />
          <input
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="이미지 URL (선택사항)"
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-primary-400 mb-3"
          />
          <input
            value={hashtagInput}
            onChange={e => setHashtagInput(e.target.value)}
            placeholder="#해시태그 (공백 또는 쉼표로 구분)"
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-primary-400 mb-4"
          />
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600">취소</button>
            <button type="submit" disabled={loading || !content.trim()} className="flex-1 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
              {loading ? '게시 중...' : '게시하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
