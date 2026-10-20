import Project from '../models/project.model.js'
import errorHandler from '../helpers/dbErrorHandler.js'

// POST /api/projects
const create = async (req, res) => {
  const project = new Project(req.body)
  try {
    await project.save()
    return res.status(201).json(project)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

// GET /api/projects
const list = async (req, res) => {
  try {
    const projects = await Project.find()
    res.json(projects)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

// Runs for every route with :projectId and attaches the document to req.project
const projectByID = async (req, res, next, id) => {
  try {
    const project = await Project.findById(id)
    if (!project) return res.status(404).json({ error: 'Project not found' })
    req.project = project
    next()
  } catch (err) {
    return res.status(400).json({ error: 'Could not retrieve project' })
  }
}

// GET /api/projects/:projectId
const read = (req, res) => res.json(req.project)

// PUT /api/projects/:projectId
const update = async (req, res) => {
  try {
    const project = Object.assign(req.project, req.body)
    await project.save()
    res.json(project)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

// DELETE /api/projects/:projectId
const remove = async (req, res) => {
  try {
    await req.project.deleteOne()
    res.json({ message: 'Project deleted successfully', deleted: req.project })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

// DELETE /api/projects
const removeAll = async (req, res) => {
  try {
    const result = await Project.deleteMany({})
    res.json({ message: `${result.deletedCount} project(s) deleted successfully` })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

export default { create, list, projectByID, read, update, remove, removeAll }
