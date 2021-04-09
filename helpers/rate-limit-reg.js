const rateLimit = require("express-rate-limit");
const { HttpCode } = require('./constants')

const createAccLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 20,
    handler: (req, res, next) => {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: "error",
        code: HttpCode.BAD_REQUEST,
        data: "forbidden",
        message: "You have exceeded the number of registration attempts, please try again later"
    })
    }
  });

  module.exports = {
      createAccLimiter
  }