import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { users } from '../api/api.js'
import { useAuth } from '../context/AuthContext.jsx'

// Any signed-in user: view and update their own account, or delete it
export default function Profile() {
  const { user, updateUser, signout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    users
      .read(user._id)
      .then((p) => {
        setProfile(p)
        setForm({ name: p.name, email: p.email, password: '' })
      })
      .catch((e) => setError(e.message))
  }, [user._id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const changes = { name: form.name, email: form.email }
    if (form.password) changes.password = form.password
    try {
      const updated = await users.update(user._id, changes)
      setProfile(updated)
      updateUser({ name: updated.name, email: updated.email })
      setForm({ ...form, password: '' })
      setMessage('Profile updated.')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Delete your account? This can't be undone.")) return
    try {
      await users.remove(user._id)
      await signout()
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="narrow">
      <h1>My profile</h1>
      {profile && (
        <p className="muted">
          <span className={`badge ${profile.role}`}>{profile.role}</span> · Member since{' '}
          {new Date(profile.created).toLocaleDateString()}
        </p>
      )}
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Name</span>
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label className="field">
          <span>New password</span>
          <input name="password" type="password" placeholder="Leave blank to keep current" value={form.password} onChange={handleChange} />
        </label>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        <div className="actions">
          <button type="submit" className="primary">Save</button>
          {profile?.role !== 'admin' && (
            <button type="button" className="danger" onClick={handleDelete}>Delete account</button>
          )}
        </div>
      </form>
    </section>
  )
}
