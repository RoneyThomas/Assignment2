import Qualification from '../models/qualification.model.js'
import errorHandler from '../helpers/dbErrorHandler.js'

// POST /api/qualifications
const create = async (req, res) => {
  const qualification = new Qualification(req.body)
  try {
    await qualification.save()
    return res.status(201).json(qualification)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

// GET /api/qualifications
const list = async (req, res) => {
  try {
    const qualifications = await Qualification.find()
    res.json(qualifications)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

// Runs for every route with :qualificationId and attaches the document to req.qualification
const qualificationByID = async (req, res, next, id) => {
  try {
    const qualification = await Qualification.findById(id)
    if (!qualification) return res.status(404).json({ error: 'Qualification not found' })
    req.qualification = qualification
    next()
  } catch (err) {
    return res.status(400).json({ error: 'Could not retrieve qualification' })
  }
}

// GET /api/qualifications/:qualificationId
const read = (req, res) => res.json(req.qualification)

// PUT /api/qualifications/:qualificationId
const update = async (req, res) => {
  try {
    const qualification = Object.assign(req.qualification, req.body)
    await qualification.save()
    res.json(qualification)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

// DELETE /api/qualifications/:qualificationId
const remove = async (req, res) => {
  try {
    await req.qualification.deleteOne()
    res.json({ message: 'Qualification deleted successfully', deleted: req.qualification })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

// DELETE /api/qualifications
const removeAll = async (req, res) => {
  try {
    const result = await Qualification.deleteMany({})
    res.json({ message: `${result.deletedCount} qualification(s) deleted successfully` })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

export default { create, list, qualificationByID, read, update, remove, removeAll }
