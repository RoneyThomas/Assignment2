import auth from './auth.js'

// In dev Vite proxies /api and /auth to Express. When the client is hosted separately,
// set VITE_API_URL to the backend's URL (e.g. https://my-portfolio-api.onrender.com).
const BASE = import.meta.env.VITE_API_URL || ''

const request = async (path, { method = 'GET', body, secure = false } = {}) => {
  const headers = { Accept: 'application/json' }
  if (body) headers['Content-Type'] = 'application/json'
  const jwt = auth.isAuthenticated()
  if (secure && jwt) headers.Authorization = 'Bearer ' + jwt.token

  const res = await fetch(BASE + path, {
    method,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

// Builds list/read/create/update/remove/removeAll helpers for one REST resource
const resource = (name) => ({
  list: (secure = false) => request(`/api/${name}`, { secure }),
  read: (id) => request(`/api/${name}/${id}`, { secure: true }),
  create: (item, secure = true) => request(`/api/${name}`, { method: 'POST', body: item, secure }),
  update: (id, item) => request(`/api/${name}/${id}`, { method: 'PUT', body: item, secure: true }),
  remove: (id) => request(`/api/${name}/${id}`, { method: 'DELETE', secure: true }),
  removeAll: () => request(`/api/${name}`, { method: 'DELETE', secure: true }),
})

export const projects = resource('projects')
export const qualifications = resource('qualifications')
export const contacts = resource('contacts')
export const users = resource('users')

export const signin = (credentials) => request('/auth/signin', { method: 'POST', body: credentials })
export const signout = () => request('/auth/signout')
