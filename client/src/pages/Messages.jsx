import { useEffect, useState } from 'react'
import { contacts } from '../api/api.js'

// Protected page: lists contact form submissions (GET /api/contacts requires a JWT)
export default function Messages() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  const load = () => contacts.list(true).then(setItems).catch((e) => setError(e.message))

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id) => {
    try {
      await contacts.remove(id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section>
      <h1>Contact messages</h1>
      {error && <p className="error">{error}</p>}
      {items.length === 0 ? (
        <p className="muted">No messages yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr><th>First name</th><th>Last name</th><th>Email</th><th></th></tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c._id}>
                <td>{c.firstname}</td>
                <td>{c.lastname}</td>
                <td>{c.email}</td>
                <td><button className="danger" onClick={() => handleDelete(c._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
