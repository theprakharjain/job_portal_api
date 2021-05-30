const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { applicantInputValidation } = require('../authorization/inputValidation');
const { authorizedToken } = require('../authorization/tokenVerification');
const { getJob, isCandidate } = require('../utils/utils')

// Load Appliction model
const Application = mongoose.model('Application');;
// Load User model
const User = mongoose.model('User');
// Load Job model
const Job = mongoose.model('Job')


// Getting all Applications with statuses for logged in User - Authentication Required
router.get('/', authorizedToken, isCandidate, async (req, res) => {
    
  try { 
    const applications = await Application.find({applicantId: {$all: req.user._id}})
    res.json(applications)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }

})

// Application made for the job by the user - Authentication Required
router.post('/:id', getJob, authorizedToken, isCandidate, async (req, res) => {

  // Data validation from Joi
  const validation = applicantInputValidation(req.body);
  if(validation.error){
    return res.status(400).send(validation.error.details[0].message);
  }

  const application = new Application({

    applicantId: req.user._id, //User ID is saved in the token
    jobId: res.job._id,            //Job id ise received from getJob function based on the retrieved url parameter 
    status: "open"

  })
  try {
    const newApplication = await application.save()
    res.status(201).json(newApplication)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})


// Deleting the application by the candidate - Authentication Required
router.delete('/:id', getJob, authorizedToken, isCandidate, async (req, res) => {

try {
    const application = await Application.find({applicantId: {$all: req.user._id}, jobId: res.job._id})
    res.application.remove()
    res.json({ message: 'Application Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }

})


module.exports = router;