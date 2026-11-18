import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Redirects to sign in when nobody is signed in; with adminOnly, non-admins see a message
export default function PrivateRoute({ children, adminOnly = false }) {
  const { isSignedIn, isAdmin } = useAuth()
  const location = useLocation()

  if (!isSignedIn) {
    return <Navigate to="/signin" replace state={{ from: location }} />
  }
  if (adminOnly && !isAdmin) {
    return (
      <section>
        <h1>Admins only</h1>
        <p className="lead">You need an admin account to view this page.</p>
      </section>
    )
  }
  return children
}
