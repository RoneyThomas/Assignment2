import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { expressjwt } from 'express-jwt'
import config from '../../config/config.js'

// POST /auth/signin
const signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(401).json({ error: 'User not found' })

    if (!user.authenticate(req.body.password)) {
      return res.status(401).json({ error: "Email and password don't match." })
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, config.jwtSecret, { expiresIn: '1d' })
    res.cookie('t', token, { expire: new Date(Date.now() + 9999) })

    return res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    return res.status(401).json({ error: 'Could not sign in' })
  }
}

// GET /auth/signout
const signout = (req, res) => {
  res.clearCookie('t')
  return res.status(200).json({ message: 'signed out' })
}

// Verifies the "Authorization: Bearer <token>" header; decoded payload is put on req.auth
const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ['HS256'],
  requestProperty: 'auth',
})

// Looks up the signed-in user's current role in the database (so a role change
// takes effect immediately rather than when the token expires)
const loadRole = async (req) => {
  const user = await User.findById(req.auth._id).select('role')
  return user ? user.role : null
}

// Only admins may continue
const isAdmin = async (req, res, next) => {
  try {
    if ((await loadRole(req)) !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }
    req.auth.role = 'admin'
    next()
  } catch (err) {
    return res.status(403).json({ error: 'Admin access required' })
  }
}

// A user may access their own account; an admin may access any account
const hasAuthorization = async (req, res, next) => {
  try {
    const isOwner = req.profile && req.auth && req.profile._id.toString() === req.auth._id
    const role = await loadRole(req)
    if (!isOwner && role !== 'admin') {
      return res.status(403).json({ error: 'User is not authorized' })
    }
    req.auth.role = role
    next()
  } catch (err) {
    return res.status(403).json({ error: 'User is not authorized' })
  }
}

export default { signin, signout, requireSignin, isAdmin, hasAuthorization }
