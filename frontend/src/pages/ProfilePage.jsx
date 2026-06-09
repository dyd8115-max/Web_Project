import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../store/useAuthStore'
import PostCard from '../components/PostCard'

export default function ProfilePage() {
  const { userId } = useParams()
  const { user: currentUser } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [pets, setPets] = useState([])
  const [posts, setPosts] = useState([])
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('posts')
  const [showPetForm, setShowPetForm] = useState(false)
  const [petForm, setPetForm] = useState({ name: '', species: '', age: '', photoUrl: '', description: '' })
  const isOwn = currentUser?.id === userId

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [userRes, petsRes, postsRes] = await Promise.all([
          api.get(`/users/${userId}`),
          api.get(`/pets/${userId}`),
          api.get(`/users/${userId}/posts`)
        ])
        setProfile(userRes.data)
        setPets(petsRes.data)
        setPosts(postsRes.data.content || [])
        if (!isOwn) {
          const followingRes = await api.get(`/users/${currentUser?.id}/following`)
          setFollowing(followingRes.data.some(u => u.id === userId))
        }
      } catch (e) {}
      setLoading(false)
    }
    load()
  }, [userId])

  const handleFollow = async () => {
    try {
      const res = await api.post(`/users/${userId}/follow`)
      setFollowing(res.data.following)
      setProfile(prev => ({ ...prev, followerCount: res.data.following ? prev.followerCount + 1 : prev.followerCount - 1 }))
    } catch (e) {}
  }

  const handleAddPet = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/pets', { ...petForm, age: petForm.age ? parseInt(petForm.age) : null })
      setPets(prev => [...prev, res.data])
      setShowPetForm(false)
      setPetForm({ name: '', species: '', age: '', photoUrl: '', description: '' })
    } catch (e) { alert('펫 등록에 실패했습니다') }
  }

  const handleDeletePet = async (petId) => {
    if (!window.confirm('펫 프로필을 삭제하시겠습니까?')) return
    try {
      await api.delete(`/pets/${petId}`)
      setPets(prev => prev.filter(p => p.id !== petId))
    } catch (e) {}
  }

  if (loading) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>
  if (!profile) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl font-bold overflow-hidden flex-shrink-0">
            {profile.profileImageUrl ? <img src={profile.profileImageUrl} alt="" className="w-full h-full object-cover" /> : profile.username?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 mb-1">{profile.username}</h1>
            {profile.bio && <p className="text-sm text-gray-600 mb-3">{profile.bio}</p>}
            <div className="flex gap-5 text-sm text-gray-500 mb-4">
              <span><strong className="text-gray-900">{posts.length}</strong> 게시물</span>
              <span><strong className="text-gray-900">{profile.followerCount || 0}</strong> 팔로워</span>
              <span><strong className="text-gray-900">{profile.followingCount || 0}</strong> 팔로잉</span>
            </div>
            {!isOwn && (
              <button onClick={handleFollow} className={`px-5 py-1.5 rounded-lg text-sm font-medium transition ${following ? 'border border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-primary-600 text-white hover:bg-primary-700'}`}>
                {following ? '팔로잉' : '팔로우'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-4">
        {['posts', 'pets'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500'}`}>
            {t === 'posts' ? '게시물' : '🐾 펫 프로필'}
          </button>
        ))}
      </div>

      {tab === 'posts' && (
        <div>
          {posts.map(post => <PostCard key={post.id} post={post} onDelete={id => setPosts(prev => prev.filter(p => p.id !== id))} />)}
          {posts.length === 0 && <div className="text-center py-12 text-gray-400"><p>게시물이 없습니다</p></div>}
        </div>
      )}

      {tab === 'pets' && (
        <div>
          {pets.map(pet => (
            <div key={pet.id} className="bg-white rounded-xl border border-gray-200 p-4 mb-3 flex items-center gap-4 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-2xl overflow-hidden flex-shrink-0">
                {pet.photoUrl ? <img src={pet.photoUrl} alt="" className="w-full h-full object-cover" /> : '🐶'}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{pet.name}</p>
                <p className="text-sm text-gray-500">{pet.species} {pet.age && `· ${pet.age}살`}</p>
                {pet.description && <p className="text-xs text-gray-400 mt-1">{pet.description}</p>}
              </div>
              {isOwn && <button onClick={() => handleDeletePet(pet.id)} className="text-xs text-gray-400 hover:text-red-500">삭제</button>}
            </div>
          ))}

          {isOwn && (
            <div className="mt-4">
              {!showPetForm ? (
                <button onClick={() => setShowPetForm(true)} className="w-full py-3 border-2 border-dashed border-primary-300 rounded-xl text-primary-500 text-sm font-medium hover:bg-primary-50">
                  + 새 펫 등록
                </button>
              ) : (
                <form onSubmit={handleAddPet} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900">새 펫 등록</h3>
                  <input value={petForm.name} onChange={e => setPetForm(p => ({...p, name: e.target.value}))} placeholder="이름 *" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400" />
                  <input value={petForm.species} onChange={e => setPetForm(p => ({...p, species: e.target.value}))} placeholder="종 (강아지, 고양이 등)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400" />
                  <input value={petForm.age} onChange={e => setPetForm(p => ({...p, age: e.target.value}))} placeholder="나이" type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400" />
                  <input value={petForm.photoUrl} onChange={e => setPetForm(p => ({...p, photoUrl: e.target.value}))} placeholder="사진 URL" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400" />
                  <input value={petForm.description} onChange={e => setPetForm(p => ({...p, description: e.target.value}))} placeholder="소개" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400" />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowPetForm(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">취소</button>
                    <button type="submit" className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">등록</button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
