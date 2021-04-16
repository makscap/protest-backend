const express = require('express');
const router = express.Router();
const validate = require('../user/validation');
const userController = require('../../../controllers/users');
const guard = require('../../../helpers/guard');
const { createAccLimiter } = require('../../../helpers/rate-limit-reg');

router.post(
  '/register',
  createAccLimiter,
  validate.createUser,
  userController.register,
);
router.post('/login', userController.login);
router.post('/logout', guard, userController.logout);

router.get('/verify/:verifyToken', userController.verify);
router.get('/current', guard, userController.getCurrentUser);

router.post('/google', userController.googleLogin);

module.exports = router;
