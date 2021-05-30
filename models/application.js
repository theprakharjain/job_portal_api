const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({

    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    status: {
        type: String,
        required: true
    }
}, {timestamps: true})


module.exports = mongoose.model('Application', applicationSchema)