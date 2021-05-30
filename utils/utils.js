const Job = require('../models/Job')
const Application = require('../models/Application')
const User = require('../models/User')

async function getJob(req, res, next) {
  let job
  try {
    job = await Job.findById(req.params.id)
    if (job == null) {
      return res.status(404).json({ message: 'Cannot find subscriber' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.job = job
  next()
}

async function getApplication(req, res, next) {
  let application
  try {
    application = await Application.findById(req.params.app_id)
    if (application == null) {
      return res.status(404).json({ message: 'Cannot find Application' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.application = application
  next()
}

async function isRecruiter(req, res, next) {
  let user
  try {
    user = await User.findById(req.user._id)
    if (user.role == "candidate") {
      return res.status(400).json({ message: 'Acces Denied' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  next()
}

async function isCandidate(req, res, next) {
  let user
  try {
    user = await User.findById(req.user._id)
    if (user.role == "recruiter") {
      return res.status(400).json({ message: 'Acces Denied' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  next()
}

module.exports.getJob = getJob;
module.exports.getApplication = getApplication;
module.exports.isRecruiter = isRecruiter;
module.exports.isCandidate = isCandidate;