import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Layout() {
  const navigate = useNavigate()
  const { user, isSignedIn, isAdmin, signout } = useAuth()

  const handleSignout = async () => {
    await signout()
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
          {isAdmin && (
            <>
              <NavLink to="/messages">Messages</NavLink>
              <NavLink to="/users">Users</NavLink>
            </>
          )}
          {isSignedIn ? (
            <>
              <NavLink to="/profile">
                {user.name} <span className={`badge ${user.role}`}>{user.role}</span>
              </NavLink>
              <button className="link" onClick={handleSignout}>Sign out</button>
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
