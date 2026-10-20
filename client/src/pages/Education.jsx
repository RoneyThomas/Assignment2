import ItemSection from '../components/ItemSection.jsx'
import { qualifications } from '../api/api.js'

export default function Education() {
  return <ItemSection api={qualifications} heading="Education" intro="My qualifications and studies." noun="qualification" />
}
