const Joi = require('joi')
const { HttpCode } = require('../../../helpers/constants')

const schemaCreateUser = Joi.object({
    email: Joi
      .string()
      .email()
      .required(),
    password: Joi
      .string()
      .required(),
  })

  const validate = (schema, obj, next) => {
    const { error } = schema.validate(obj)
  
    if (error) {
      const [{ message }] = error.details
      return next({
        status: HttpCode.BAD_REQUEST,
        message: `Field: ${message.replace(/"/g, '')}`
      })
    }
    next()
  }

  module.exports.createUser = (req, res, next) => {
    return validate(schemaCreateUser, req.body, next)
  }