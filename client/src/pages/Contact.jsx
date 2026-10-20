import { useState } from 'react'
import { contacts } from '../api/api.js'

const empty = { firstname: '', lastname: '', email: '' }

export default function Contact() {
  const [form, setForm] = useState(empty)
  const [status, setStatus] = useState({ error: '', success: '' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await contacts.create(form, false)
      setForm(empty)
      setStatus({ error: '', success: 'Thanks! Your details were sent — I will be in touch soon.' })
    } catch (err) {
      setStatus({ error: err.message, success: '' })
    }
  }

  return (
    <section>
      <h1>Contact</h1>
      <p className="lead">Leave your details and I'll get back to you.</p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="row">
          <input name="firstname" placeholder="First name" value={form.firstname} onChange={handleChange} required />
          <input name="lastname" placeholder="Last name" value={form.lastname} onChange={handleChange} required />
        </div>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        {status.error && <p className="error">{status.error}</p>}
        {status.success && <p className="success">{status.success}</p>}
        <button type="submit" className="primary">Send</button>
      </form>
    </section>
  )
}
