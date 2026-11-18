import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

const empty = { title: '', firstname: '', lastname: '', email: '', completion: '', description: '' }
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const toInputDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '')

// Lists a collection (projects or qualifications). Everyone can view;
// only the admin gets the add / edit / delete controls.
export default function ItemSection({ api, heading, intro, noun }) {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const formRef = useRef(null)

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

  const resetForm = () => {
    setForm(empty)
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editingId) await api.update(editingId, form)
      else await api.create(form)
      setMessage(`${capitalize(noun)} ${editingId ? 'updated' : 'added'}.`)
      resetForm()
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const startEdit = (item) => {
    setEditingId(item._id)
    setMessage('')
    setForm({ ...empty, ...item, completion: toInputDate(item.completion) })
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete this ${noun}?`)) return
    try {
      await api.remove(id)
      if (editingId === id) resetForm()
      setMessage(`${capitalize(noun)} deleted.`)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteAll = async () => {
    if (!window.confirm(`Delete ALL ${heading.toLowerCase()}? This can't be undone.`)) return
    try {
      const res = await api.removeAll()
      resetForm()
      setMessage(res.message)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section>
      <div className="section-head">
        <div>
          <h1>{heading}</h1>
          <p className="lead">{intro}</p>
        </div>
        {isAdmin && items.length > 0 && (
          <button className="danger" onClick={handleDeleteAll}>Delete all</button>
        )}
      </div>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : items.length === 0 ? (
        <p className="muted">Nothing here yet.</p>
      ) : (
        <div className="grid">
          {items.map((item) => (
            <article className={`card ${editingId === item._id ? 'editing' : ''}`} key={item._id}>
              <h3>{item.title}</h3>
              {item.completion && (
                <p className="meta">
                  Completed {new Date(item.completion).toLocaleDateString(undefined, { year: 'numeric', month: 'long', timeZone: 'UTC' })}
                </p>
              )}
              <p>{item.description}</p>
              {(item.firstname || item.lastname) && (
                <p className="meta">
                  {item.firstname} {item.lastname} {item.email && `· ${item.email}`}
                </p>
              )}
              {isAdmin && (
                <div className="actions">
                  <button onClick={() => startEdit(item)}>Edit</button>
                  <button className="danger" onClick={() => handleDelete(item._id)}>Delete</button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {isAdmin && (
        <form className="form" onSubmit={handleSubmit} ref={formRef}>
          <h2>{editingId ? `Edit ${noun}` : `Add a ${noun}`}</h2>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <div className="row">
            <input name="firstname" placeholder="First name" value={form.firstname} onChange={handleChange} />
            <input name="lastname" placeholder="Last name" value={form.lastname} onChange={handleChange} />
          </div>
          <div className="row">
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <label className="field">
              <span>Completion date</span>
              <input name="completion" type="date" value={form.completion} onChange={handleChange} />
            </label>
          </div>
          <textarea name="description" placeholder="Description" rows="3" value={form.description} onChange={handleChange} />
          <div className="actions">
            <button type="submit" className="primary">{editingId ? 'Save changes' : 'Add'}</button>
            {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      )}
    </section>
  )
}
