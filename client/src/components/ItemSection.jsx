import { useEffect, useState } from 'react'
import auth from '../api/auth.js'

const empty = { title: '', firstname: '', lastname: '', email: '', completion: '', description: '' }
const toInputDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '')

// Lists a collection (projects or qualifications). Signed-in users can add, edit and delete.
export default function ItemSection({ api, heading, intro, noun }) {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const signedIn = !!auth.isAuthenticated()

  const load = () =>
    api
      .list()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))

  useEffect(() => {
    load()
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editingId) await api.update(editingId, form)
      else await api.create(form)
      setForm(empty)
      setEditingId(null)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const startEdit = (item) => {
    setEditingId(item._id)
    setForm({ ...empty, ...item, completion: toInputDate(item.completion) })
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete this ${noun}?`)) return
    try {
      await api.remove(id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section>
      <h1>{heading}</h1>
      <p className="lead">{intro}</p>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : items.length === 0 ? (
        <p className="muted">Nothing here yet.</p>
      ) : (
        <div className="grid">
          {items.map((item) => (
            <article className="card" key={item._id}>
              <h3>{item.title}</h3>
              {item.completion && (
                <p className="meta">
                  Completed {new Date(item.completion).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                </p>
              )}
              <p>{item.description}</p>
              {(item.firstname || item.lastname) && (
                <p className="meta">
                  {item.firstname} {item.lastname} {item.email && `· ${item.email}`}
                </p>
              )}
              {signedIn && (
                <div className="actions">
                  <button onClick={() => startEdit(item)}>Edit</button>
                  <button className="danger" onClick={() => handleDelete(item._id)}>Delete</button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {signedIn && (
        <form className="form" onSubmit={handleSubmit}>
          <h2>{editingId ? `Edit ${noun}` : `Add a ${noun}`}</h2>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <div className="row">
            <input name="firstname" placeholder="First name" value={form.firstname} onChange={handleChange} />
            <input name="lastname" placeholder="Last name" value={form.lastname} onChange={handleChange} />
          </div>
          <div className="row">
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <input name="completion" type="date" value={form.completion} onChange={handleChange} />
          </div>
          <textarea name="description" placeholder="Description" rows="3" value={form.description} onChange={handleChange} />
          <div className="actions">
            <button type="submit" className="primary">{editingId ? 'Save changes' : 'Add'}</button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm(empty) }}>Cancel</button>
            )}
          </div>
        </form>
      )}
    </section>
  )
}
