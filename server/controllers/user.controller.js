import User from '../models/user.model.js'
import errorHandler from '../helpers/dbErrorHandler.js'

// POST /api/users  (sign up)
const create = async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    return res.status(201).json({ message: 'Successfully signed up!' })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

// GET /api/users
const list = async (req, res) => {
  try {
    const users = await User.find().select('name email created updated')
    res.json(users)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    req.profile = user
    next()
  } catch (err) {
    return res.status(400).json({ error: 'Could not retrieve user' })
  }
}

const strip = (user) => {
  user.hashed_password = undefined
  user.salt = undefined
  return user
}

// GET /api/users/:userId
const read = (req, res) => res.json(strip(req.profile))

// PUT /api/users/:userId
const update = async (req, res) => {
  try {
    const user = Object.assign(req.profile, req.body)
    user.updated = Date.now()
    await user.save()
    res.json(strip(user))
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

// DELETE /api/users/:userId
const remove = async (req, res) => {
  try {
    await req.profile.deleteOne()
    res.json({ message: 'User deleted successfully', deleted: strip(req.profile) })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

// DELETE /api/users
const removeAll = async (req, res) => {
  try {
    const result = await User.deleteMany({})
    res.json({ message: `${result.deletedCount} user(s) deleted successfully` })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

export default { create, list, userByID, read, update, remove, removeAll }
