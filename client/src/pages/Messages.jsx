import { useEffect, useState } from 'react'
import { contacts } from '../api/api.js'

const empty = { firstname: '', lastname: '', email: '' }

// Admin only: full CRUD for contact form submissions
export default function Messages() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(empty)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = () => contacts.list(true).then(setItems).catch((e) => setError(e.message))

  useEffect(() => {
    load()
  }, [])

  const run = async (action, successMessage) => {
    setError('')
    try {
      const res = await action()
      setMessage(successMessage || res.message)
      load()
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (await run(() => contacts.create(form), 'Contact added.')) setForm(empty)
  }

  const startEdit = (c) => {
    setEditingId(c._id)
    setEditForm({ firstname: c.firstname, lastname: c.lastname, email: c.email })
  }

  const saveEdit = async () => {
    if (await run(() => contacts.update(editingId, editForm), 'Contact updated.')) setEditingId(null)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this contact?')) run(() => contacts.remove(id), 'Contact deleted.')
  }

  const handleDeleteAll = () => {
    if (window.confirm("Delete ALL contacts? This can't be undone.")) run(() => contacts.removeAll())
  }

  const editInput = (name, type = 'text') => (
    <input
      type={type}
      value={editForm[name]}
      onChange={(e) => setEditForm({ ...editForm, [name]: e.target.value })}
      aria-label={name}
    />
  )

  return (
    <section>
      <div className="section-head">
        <div>
          <h1>Contact messages</h1>
          <p className="lead">People who reached out through the contact form.</p>
        </div>
        {items.length > 0 && <button className="danger" onClick={handleDeleteAll}>Delete all</button>}
      </div>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      {items.length === 0 ? (
        <p className="muted">No messages yet.</p>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>First name</th><th>Last name</th><th>Email</th><th></th></tr>
            </thead>
            <tbody>
              {items.map((c) =>
                editingId === c._id ? (
                  <tr key={c._id}>
                    <td>{editInput('firstname')}</td>
                    <td>{editInput('lastname')}</td>
                    <td>{editInput('email', 'email')}</td>
                    <td className="actions">
                      <button className="primary" onClick={saveEdit}>Save</button>
                      <button onClick={() => setEditingId(null)}>Cancel</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={c._id}>
                    <td>{c.firstname}</td>
                    <td>{c.lastname}</td>
                    <td>{c.email}</td>
                    <td className="actions">
                      <button onClick={() => startEdit(c)}>Edit</button>
                      <button className="danger" onClick={() => handleDelete(c._id)}>Delete</button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      <form className="form" onSubmit={handleAdd}>
        <h2>Add a contact</h2>
        <div className="row">
          <input name="firstname" placeholder="First name" value={form.firstname} onChange={(e) => setForm({ ...form, firstname: e.target.value })} required />
          <input name="lastname" placeholder="Last name" value={form.lastname} onChange={(e) => setForm({ ...form, lastname: e.target.value })} required />
        </div>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <div className="actions">
          <button type="submit" className="primary">Add</button>
        </div>
      </form>
    </section>
  )
}
