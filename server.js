import config from './config/config.js'
import app from './server/express.js'
import mongoose from 'mongoose'

mongoose.Promise = global.Promise
// Mongoose doesn't retry a failed initial connection, so retry every 10 seconds
const connectWithRetry = () => {
  mongoose
    .connect(config.mongoUri, { dbName: 'Portfolio' })
    .then(() => {
      console.log('Connected to the database!')
    })
    .catch((err) => {
      console.error(`Unable to connect to database: ${err.message}`)
      setTimeout(connectWithRetry, 10000)
    })
}
connectWithRetry()

// Log the reason only - the connection string contains the database password
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err.message}`)
})

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to My Portfolio application.' })
})

app.listen(config.port, (err) => {
  if (err) {
    console.log(err)
  }
  console.info('Server started on port %s.', config.port)
})
