const jwt = require('jsonwebtoken')
const Users = require('../model/users')
const {HttpCode} = require('../helpers/constants')
const EmailService = require('../services/email')
const {nanoid} = require('nanoid')

require('dotenv').config()
const SECRET_KEY = process.env.JWT_SECRET_KEY

const register = async (req, res, next) => {
    const { email } = req.body
  
      try {
  
        const user = await Users.findByEmail(email)
  if (user) {
      return res.status(HttpCode.CONFLICT).json({
          status: 'error',
          code: HttpCode.CONFLICT,
          data: 'Conflict',
          message: 'Email in use'
      })
  }
  
        const verifyToken = nanoid()
        const emailService = new EmailService(process.env.NODE_ENV)
        await emailService.sendEmail(verifyToken, email)
  
        const newUser = await Users.create({ ...req.body, verifyToken })
        return res.status(HttpCode.CREATED).json({
          status: 'success',
          code: HttpCode.CREATED,
          data: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
          },
        })
      } catch (e) {
        next(e)
      }
    }

    const login = async (req, res, next) => {
      try {
        const { email,password } = req.body
          const user = await Users.findByEmail(email)
          const isValidPassword = await user?.validPassword(password)
    if (!user || !isValidPassword || !user.verify) {
        return res.status(HttpCode.UNAUTHORIZED).json({
            status: 'error',
            code: HttpCode.UNAUTHORIZED,
            data: 'Unauthorized',
            message: 'Invalid credentials'
        })
    }
    
          const id = user._id
          const payload = { id }
          const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' })
          await Users.updateToken(id, token)
  
          return res.status(HttpCode.OK).json({
            status: 'success',
            code: HttpCode.OK,
            data: {
              token,
            },
          })
        } catch (e) {
          next(e)
        }
    }

    const logout = async (req, res, next) => {
        const id = req.user.id
        await Users.updateToken(id, null)
        return res.status(HttpCode.NO_CONTENT).json({
          message: 'No info'
        })
    
      }

      const verify = async (req, res, next) => {
        try {
           const user = await Users.findByVerifyToken(req.params.verifyToken)
           if (user) {
            await Users.updateVerifyToken(user.id, true, null)
            return res.json({
             status: 'success',
             code: HttpCode.OK,
             message: 'Verification successful',
           })
           }
           return res.status(HttpCode.NOT_FOUND).json({
             status: 'error',
             code: HttpCode.NOT_FOUND,
             data: 'Not found',
             message: 'User not found',       
             })

        } catch(e) {
          next(e)
        }
      }

      module.exports = {register, login, logout, verify,}