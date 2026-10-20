import ItemSection from '../components/ItemSection.jsx'
import { projects } from '../api/api.js'

export default function Projects() {
  return <ItemSection api={projects} heading="Projects" intro="A selection of things I've built." noun="project" />
}
