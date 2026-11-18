import { useEffect, useState } from 'react'
import { users } from '../api/api.js'
import { useAuth } from '../context/AuthContext.jsx'

// Admin only: view all users, change their role, delete them
export default function Users() {
  const { user: me } = useAuth()
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = () => users.list(true).then(setItems).catch((e) => setError(e.message))

  useEffect(() => {
    load()
  }, [])

  const changeRole = async (u, role) => {
    setError('')
    try {
      await users.update(u._id, { role })
      setMessage(`${u.name} is now ${role === 'admin' ? 'an admin' : 'a user'}.`)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete ${u.name}'s account?`)) return
    try {
      await users.remove(u._id)
      setMessage(`${u.name} deleted.`)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section>
      <h1>Users</h1>
      <p className="lead">Everyone who has signed up. Admins can manage all content; users can only view it.</p>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Joined</th><th>Role</th><th></th></tr>
          </thead>
          <tbody>
            {items.map((u) => {
              const isMe = u._id === me._id
              return (
                <tr key={u._id}>
                  <td>{u.name}{isMe && <span className="muted"> (you)</span>}</td>
                  <td>{u.email}</td>
                  <td>{new Date(u.created).toLocaleDateString()}</td>
                  <td>
                    {isMe ? (
                      <span className={`badge ${u.role}`}>{u.role}</span>
                    ) : (
                      <select value={u.role} onChange={(e) => changeRole(u, e.target.value)} aria-label={`Role for ${u.name}`}>
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    )}
                  </td>
                  <td>{!isMe && <button className="danger" onClick={() => handleDelete(u)}>Delete</button>}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
