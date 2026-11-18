import { createContext, useContext, useState } from 'react'
import auth from '../api/auth.js'
import { signout as apiSignout } from '../api/api.js'

const AuthContext = createContext(null)

// Holds the signed-in user for the whole app, so the navbar, pages and route
// guards all update as soon as someone signs in or out
export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => auth.isAuthenticated() || null)

  const signin = (data) => {
    auth.authenticate(data)
    setSession(data)
  }

  const signout = async () => {
    auth.clearJWT()
    setSession(null)
    try {
      await apiSignout()
    } catch {
      /* the token is already cleared locally */
    }
  }

  // Keeps the stored name/email current after the user edits their profile
  const updateUser = (changes) => {
    if (!session) return
    const next = { ...session, user: { ...session.user, ...changes } }
    auth.authenticate(next)
    setSession(next)
  }

  const value = {
    user: session ? session.user : null,
    isSignedIn: !!session,
    isAdmin: session?.user?.role === 'admin',
    signin,
    signout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
