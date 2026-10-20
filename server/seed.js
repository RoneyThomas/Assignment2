// Creates the Portfolio collections with some sample data (only inserts into empty collections).
// Run with: npm run seed
import mongoose from 'mongoose'
import config from '../config/config.js'
import User from './models/user.model.js'
import Contact from './models/contact.model.js'
import Project from './models/project.model.js'
import Qualification from './models/qualification.model.js'

const owner = { firstname: 'Roney', lastname: 'Thomas', email: 'roneythomas6@gmail.com' }

const seed = async () => {
  await mongoose.connect(config.mongoUri, { dbName: 'Portfolio' })
  console.log('Connected to the database!')

  if ((await User.countDocuments()) === 0) {
    await new User({ name: 'Admin', email: 'admin@portfolio.com', password: 'password123' }).save()
    console.log('users: created admin@portfolio.com / password123')
  }
  if ((await Contact.countDocuments()) === 0) {
    await Contact.create({ firstname: 'Jane', lastname: 'Doe', email: 'jane.doe@example.com' })
    console.log('contacts: created 1 document')
  }
  if ((await Project.countDocuments()) === 0) {
    await Project.create([
      { ...owner, title: 'Personal Portfolio', completion: new Date('2026-10-20'), description: 'MERN stack portfolio site with a REST API, MongoDB and JWT authentication.' },
      { ...owner, title: 'Task Tracker', completion: new Date('2026-06-15'), description: 'React to-do app with filtering and local persistence.' },
    ])
    console.log('projects: created 2 documents')
  }
  if ((await Qualification.countDocuments()) === 0) {
    await Qualification.create([
      { ...owner, title: 'Software Engineering Technology', completion: new Date('2027-04-30'), description: 'Diploma program - Centennial College.' },
      { ...owner, title: 'High School Diploma', completion: new Date('2024-06-30'), description: 'Graduated with honours.' },
    ])
    console.log('qualifications: created 2 documents')
  }

  await mongoose.disconnect()
  console.log('Seeding complete.')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
