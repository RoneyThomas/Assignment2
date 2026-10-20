import { useState } from 'react'
import { Link } from 'react-router-dom'
import { users } from '../api/api.js'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await users.create(form, false)
      setDone(true)
    } catch (err) {
      setError(err.message)
    }
  }

  if (done) {
    return (
      <section className="narrow">
        <h1>Account created</h1>
        <p className="success">You have successfully signed up.</p>
        <Link to="/signin" className="button primary">Sign in</Link>
      </section>
    )
  }

  return (
    <section className="narrow">
      <h1>Sign up</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={handleChange} required />
        {error && <p className="error">{error}</p>}
        <button type="submit" className="primary">Create account</button>
      </form>
    </section>
  )
}
