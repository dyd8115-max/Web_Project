import { useState, useRef } from 'react'
import api from '../api/axios'

export default function CreatePostModal({ onClose, onCreated }) {
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [hashtagInput, setHashtagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('5MB 이하 이미지만 업로드 가능합니다')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImagePreview(ev.target.result)
      setImageUrl(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setImageUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

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
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-400 resize-none mb-3"
          />

          {imagePreview ? (
            <div className="relative mb-3">
              <img src={imagePreview} alt="preview" className="w-full rounded-xl object-cover max-h-48" />
              <button type="button" onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-opacity-70">
                ✕
              </button>
            </div>
          ) : (
            <div className="mb-3">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                id="post-image-upload"
              />
              <label htmlFor="post-image-upload"
                className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-gray-400 cursor-pointer hover:border-purple-300 hover:text-purple-400 transition">
                📷 사진 추가
              </label>
            </div>
          )}

          <input
            value={hashtagInput}
            onChange={e => setHashtagInput(e.target.value)}
            placeholder="#해시태그 (공백 또는 쉼표로 구분)"
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-400 mb-4"
          />
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600">취소</button>
            <button type="submit" disabled={loading || !content.trim()} className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 disabled:opacity-50">
              {loading ? '게시 중...' : '게시하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
