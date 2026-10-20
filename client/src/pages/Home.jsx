import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="hero">
      <p className="eyebrow">Hi, I'm</p>
      <h1>Roney Thomas</h1>
      <p className="lead">
        Software Engineering Technology student building full-stack web applications with React, Node.js, Express and MongoDB.
      </p>
      <div className="actions">
        <Link to="/projects" className="button primary">View my projects</Link>
        <Link to="/contact" className="button">Get in touch</Link>
      </div>
    </section>
  )
}
