import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
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
          const res = await axios.post('/api/auth/refresh', { refreshToken })
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
