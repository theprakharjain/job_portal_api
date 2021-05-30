const express = require('express')
const router = express.Router()
const { getJob, getApplication, isRecruiter } = require('../utils/utils')
const { authorizedToken } = require('../authorization/tokenVerification');
const { jobInputValidation } = require('../authorization/inputValidation');

// Load Job Model
const Job = require('../models/Job')
// Load Application Model
const Application = require('../models/Application')
// Load User Model
const User = require('../models/User')


// Getting all Listed Jobs - No Authentication Required
router.get('/', async (req, res) => {

  try {
    const jobs = await Job.find()
    res.json(jobs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }

})

// Getting all Listed Jobs where status is open - No Authentication Required
router.get('/status/open', authorizedToken, isRecruiter, async (req, res) => {

  try {
    const jobs = await Job.find({status: {$all: "open"}})
    res.json(jobs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }

})

// Getting One- Authentication Required
router.get('/:id', authorizedToken, isRecruiter, getJob, (req, res) => {
  res.status(200).json(res.job)
})

// Creating one - Authentication Required
router.post('/', authorizedToken, isRecruiter, async (req, res) => {

  // Data validation from Joi
  const validation = jobInputValidation(req.body);
  if(validation.error){
    return res.status(400).send(validation.error.details[0].message);
  }

  const job = new Job({
    companyName: req.body.companyName,
    jobRole: req.body.jobRole,
    skills: req.body.skills,
    jobType: req.body.jobType,
    experienceMin: req.body.experienceMin,
    experienceMax: req.body.experienceMax,
    // datePosted: req.body.datePosted,
    status: req.body.status,
    postedBy: req.body.postedBy
  })
  try {
    const newJob = await job.save()
    res.status(201).json(newJob)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Updating One - Authentication Required
router.patch('/:id', authorizedToken, isRecruiter, getJob, async (req, res) => {
  if (req.body.companyName != null) {
    res.job.companyName = req.body.companyName
  }
  if (req.body.jobRole != null) {
    res.job.jobRole = req.body.jobRole
  }
  if (req.body.skills != null) {
    res.job.skills = req.body.skills
  }
  if (req.body.jobType != null) {
    res.job.jobType = req.body.jobType
  }
  if (req.body.experienceMin != null) {
    res.job.experienceMin = req.body.experienceMin
  }
  if (req.body.experienceMax != null) {
    res.job.experienceMax = req.body.experienceMax
  }
  if (req.body.status != null) {
    res.job.status = req.body.status
  }
  if (req.body.postedBy != null) {
    res.job.postedBy = req.body.postedBy
  }
  try {
    const updatedJob = await res.job.save()
    res.json(updatedJob)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Deleting One - Authentication Required
router.delete('/:id', authorizedToken, isRecruiter, getJob, async (req, res) => {
  try {
    await res.job.remove()
    res.json({ message: 'Deleted Job' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// Checking all applications for the job
router.get('/:id/application', authorizedToken, isRecruiter, getJob, async (req, res) => {

  try {
    const applications = await Application.find({jobId: {$all: res.job._id}});
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

})


// Checking one application for the job
router.get('/:id/application/:app_id', authorizedToken, isRecruiter, getJob, getApplication, async (req, res) => {

  try {
    const application = await Application.find({jobId: {$all: res.job._id}, _id: res.application});
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

})


// Accepting one application for the job
router.patch('/:id/application/:app_id/accept', authorizedToken, isRecruiter, getJob, getApplication, async (req, res) => {

  try {

    const filter = {_id: res.application};
    const application = await Application.findOneAndUpdate(filter,  {status : "accept"}, { new: true}, function(err, application){
    if(err){
      res.status(400).json({ message: err.message });
    }

    res.json(application);

    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }

})


// Rejecting one application for the job
router.patch('/:id/application/:app_id/accept', authorizedToken, isRecruiter, getJob, getApplication, async (req, res) => {

  try {

    const filter = {_id: res.application};
    const application = await Application.findOneAndUpdate(filter,  {status : "reject"}, { new: true}, function(err, application){
    if(err){
        res.status(400).json({ message: err.message });
    }

    res.json(application);

    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }

})


module.exports = router
