const KEY = 'jwt'

const auth = {
  isAuthenticated() {
    try {
      const jwt = sessionStorage.getItem(KEY)
      return jwt ? JSON.parse(jwt) : false
    } catch {
      return false
    }
  },
  authenticate(jwt) {
    sessionStorage.setItem(KEY, JSON.stringify(jwt))
  },
  clearJWT() {
    sessionStorage.removeItem(KEY)
  },
}

export default auth
