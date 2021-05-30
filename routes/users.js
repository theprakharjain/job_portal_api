const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../authorization/inputValidation');

// Load User model
const User = require('../models/User');

// Array to save refresh tokens -> will be empty as soon as server restarts
// In production we'll use db
let refreshTokens = []


// Register New User - Authentication Required & Role Condition
router.post('/register', async (req,res) => {

  // Data validation from Joi
  const validation = registerValidation(req.body);
  if(validation.error){
    return res.status(400).send(validation.error.details[0].message);
  }
  
  // Checking if user already exists
  const emailExists = await User.findOne({email: req.body.email});
  if(emailExists){
    return res.status(400).send({message: "Email already exists"});
  }

  // Hash Passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //Checking the main company of recruiter
  if(req.body.role == 'recruiter' && req.body.companyName == undefined){
    return res.status(400).send({message: "Recruiter must be associated with some company"});
  }

  // User Registration - Creating new User JSON Object
  const user = new User ({

    role: req.body.role,
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
    companyName: req.body.companyName

  })
  try {
    const newUser = await user.save()
    res.status(201).json({user: newUser._id, username: newUser.name}) // in production send only id as response
  } catch (err) {
    res.status(400).json({ message: err.message })
  }

})

router.post('/login', async (req, res) => {

  // Data validation from Joi
  const validation = loginValidation(req.body);
  if(validation.error){
    return res.status(400).send(validation.error.details[0].message);
  }

  // Checking if user exists or not
  const userWithEmail = await User.findOne({email: req.body.email}); //Gives us the existing user with the email
  if(!userWithEmail){
    return res.status(400).send({message: "Email or password is wrong"});
  }

  const passwordValid = await bcrypt.compare(req.body.password, userWithEmail.password);

  if(!passwordValid){
    return res.status(400).send({message: "password is wrong"});
  }

  // // JWT Token Creation
  const token = generateToken(userWithEmail._id)

  const refreshToken = jwt.sign({_id: userWithEmail._id}, process.env.REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken)

  res.header('authToken', token).json({token: token, refreshToken: refreshToken})
  

  // Success Response
  res.send({message: "Successfully logged in"})

})

function generateToken(user){
  return jwt.sign({_id: user}, process.env.TOKEN_SECRET, {expiresIn: '1h'})
}


router.post('/refreshtoken', async (req, res) => {

  const refreshToken = req.body.refreshToken
 
  if(refreshToken == null){
    return res.status(400).send({message: "No refresh token found"})
  }
  if(!refreshTokens.includes(refreshToken)){
    return res.status(403).send({message: "refresh token not in array"})
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if(err){
      return res.status(403)
    }

    const token = generateToken(user)
    res.json({Token: token})
  })

})

// Logout route ->  deletes the refresh tokens
router.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})


module.exports = router;
