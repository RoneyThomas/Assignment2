const KEY = 'jwt'

// Reads the "exp" claim from the token so an expired session is treated as signed out
const isExpired = (token) => {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return exp ? exp * 1000 < Date.now() : false
  } catch {
    return true
  }
}

const auth = {
  // Returns { token, user: { _id, name, email, role } } or false
  isAuthenticated() {
    try {
      const jwt = JSON.parse(sessionStorage.getItem(KEY))
      if (!jwt || !jwt.token || isExpired(jwt.token)) return false
      return jwt
    } catch {
      return false
    }
  },
  authenticate(jwt) {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(jwt))
    } catch {
      /* storage unavailable - the session lasts until the page is reloaded */
    }
  },
  clearJWT() {
    try {
      sessionStorage.removeItem(KEY)
    } catch {
      /* nothing stored */
    }
  },
}

export default auth
