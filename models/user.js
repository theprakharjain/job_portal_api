const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        min: 9,
        max: 9
    },
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 2048
    },
    companyName: {
        type: String,
        min: 3,
        max: 255
    }
}, {timestamps: true})



const User = mongoose.model('User', userSchema);

module.exports = User;