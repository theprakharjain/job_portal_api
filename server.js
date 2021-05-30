require('dotenv').config()

const express = require ("express")
const mongoose = require('mongoose')

require('./models/Job');
require('./models/Application');
require('./models/User');

const app = express()


const PORT = process.env.PORT || 3000

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

// Lets the server accept json as a parameter
app.use(express.json())
app.use(express.urlencoded({ extended: false }));


// Router Routes

// Route to jobs API
const jobsRouter = require('./routes/jobs')
app.use('/jobs', jobsRouter) //localhost:3000/jobs

// Route to users API
const userRouter = require('./routes/users')
app.use('/users', userRouter) //localhost:3000/users

// Route to applications API
const applicationRouter = require('./routes/applications')
app.use('/applications', applicationRouter) //localhost:3000/applications

app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`))