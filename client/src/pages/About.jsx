export default function About() {
  return (
    <section>
      <h1>About me</h1>
      <p className="lead">
        I'm a developer who enjoys turning ideas into clean, usable web applications. I like working across the
        whole stack — from designing REST APIs and data models to building responsive React interfaces.
      </p>
      <h2>Skills</h2>
      <ul className="tags">
        {['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'REST APIs', 'JWT Auth', 'HTML & CSS', 'Git'].map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </section>
  )
}
