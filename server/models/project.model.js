import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: 'Title is required' },
    firstname: { type: String, trim: true },
    lastname: { type: String, trim: true },
    email: {
      type: String,
      trim: true,
      match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    completion: { type: Date },
    description: { type: String, trim: true },
  },
  { collection: 'projects' }
)

export default mongoose.model('Project', ProjectSchema)
