import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section>
      <h1>Page not found</h1>
      <p className="lead">That page doesn't exist.</p>
      <Link to="/" className="button primary">Go home</Link>
    </section>
  )
}
