import { Navigate, useLocation } from 'react-router-dom'
import auth from '../api/auth.js'

export default function PrivateRoute({ children }) {
  const location = useLocation()
  if (!auth.isAuthenticated()) {
    return <Navigate to="/signin" replace state={{ from: location }} />
  }
  return children
}
