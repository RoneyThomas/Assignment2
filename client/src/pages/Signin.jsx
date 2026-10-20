import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { signin } from '../api/api.js'
import auth from '../api/auth.js'

export default function Signin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await signin(form)
      auth.authenticate(data)
      navigate(location.state?.from?.pathname || '/', { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="narrow">
      <h1>Sign in</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        {error && <p className="error">{error}</p>}
        <button type="submit" className="primary">Sign in</button>
      </form>
    </section>
  )
}
