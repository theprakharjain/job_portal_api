const Joi = require('@hapi/joi');


const userRegisterValidation = data => {
    const schema = Joi.object({

        role: Joi.string().min(9).max(9).valid('candidate','recruiter').required(),
        name: Joi.string().min(6).max(255).required(),
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(2048).required(),
        companyName: Joi.string().min(3).max(255)

    })

    return schema.validate(data)

}

const userLoginValidation = data => {
    const schema = Joi.object({

        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(2048).required()

    })

    return schema.validate(data)

}

const jobInputValidation = data => {
    const schema = Joi.object({

        companyName: Joi.string().min(3).max(255).required(),
        jobRole: Joi.string().min(6).max(255).required(),
        skills: Joi.string().min(6).max(255).required(),
        jobType: Joi.string().min(6).max(255).required(),
        experienceMin: Joi.number().max(60).required(),
        experienceMax: Joi.number().max(60).required(),
        status: Joi.string().min(3).max(255).valid('open','closed'),
        postedBy: Joi.string().min(3).max(255)

    }) //.valid('candidate','recruiter')

    return schema.validate(data)

}

const applicantInputValidation = data => {
    const schema = Joi.object({

        applicantId: Joi.string().min(3).max(255),
        jobId: Joi.string().min(6).max(255),
        status: Joi.string().min(3).max(255).valid('reject','accept','open')

    })

    return schema.validate(data)

}

module.exports.registerValidation = userRegisterValidation;
module.exports.loginValidation = userLoginValidation;
module.exports.jobInputValidation = jobInputValidation;
module.exports.applicantInputValidation = applicantInputValidation;