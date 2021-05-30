const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    jobRole: {
        type: String,
        required: true
    },
    skills: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    experienceMin: {
        type: Number,
        required: true
    },
    experienceMax: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "open"
    },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true})


module.exports = mongoose.model('Job', jobSchema)

// ,
//     datePosted: {
//         type: Date,
//         default: Date.now
//     }