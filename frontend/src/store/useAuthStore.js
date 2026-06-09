import { create } from 'zustand'
import api from '../api/axios'

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    window.__accessToken = res.data.accessToken
    localStorage.setItem('refreshToken', res.data.refreshToken)
    set({ user: res.data.user, isAuthenticated: true })
    return res.data
  },

  signup: async (email, password, username) => {
    const res = await api.post('/auth/signup', { email, password, username })
    window.__accessToken = res.data.accessToken
    localStorage.setItem('refreshToken', res.data.refreshToken)
    set({ user: res.data.user, isAuthenticated: true })
    return res.data
  },

  logout: () => {
    window.__accessToken = null
    localStorage.removeItem('refreshToken')
    set({ user: null, isAuthenticated: false })
  },

  initAuth: async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      set({ isLoading: false })
      return
    }
    try {
      const res = await api.post('/auth/refresh', { refreshToken })
      window.__accessToken = res.data.accessToken
      localStorage.setItem('refreshToken', res.data.refreshToken)
      set({ user: res.data.user, isAuthenticated: true, isLoading: false })
    } catch {
      localStorage.removeItem('refreshToken')
      set({ isLoading: false })
    }
  },

  setUser: (user) => set({ user })
}))

export default useAuthStore
