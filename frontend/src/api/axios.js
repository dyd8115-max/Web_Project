import axios from 'axios'

const PROD_BACKEND = 'https://pawlog-backend-zc4r.onrender.com'
const BASE = import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? PROD_BACKEND
    : '')

const api = axios.create({
  baseURL: BASE + '/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const accessToken = window.__accessToken
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const res = await axios.post(BASE + '/api/auth/refresh', { refreshToken })
          window.__accessToken = res.data.accessToken
          localStorage.setItem('refreshToken', res.data.refreshToken)
          error.config.headers.Authorization = `Bearer ${res.data.accessToken}`
          return axios(error.config)
        } catch {
          localStorage.removeItem('refreshToken')
          window.__accessToken = null
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
