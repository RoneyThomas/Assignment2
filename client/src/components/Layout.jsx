import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import auth from '../api/auth.js'
import { signout } from '../api/api.js'

export default function Layout() {
  const navigate = useNavigate()
  useLocation() // re-render the nav on route change so the auth links stay current
  const jwt = auth.isAuthenticated()

  const handleSignout = async () => {
    auth.clearJWT()
    try {
      await signout()
    } catch {
      /* the token is already cleared locally */
    }
    navigate('/')
  }

  return (
    <>
      <header className="nav">
        <NavLink to="/" className="brand">
          RT<span>.</span>
        </NavLink>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/education">Education</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {jwt ? (
            <>
              <NavLink to="/messages">Messages</NavLink>
              <button className="link" onClick={handleSignout}>
                Sign out ({jwt.user.name})
              </button>
            </>
          ) : (
            <>
              <NavLink to="/signin">Sign in</NavLink>
              <NavLink to="/signup">Sign up</NavLink>
            </>
          )}
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer">© {new Date().getFullYear()} Roney Thomas · Built with React, Express &amp; MongoDB</footer>
    </>
  )
}
