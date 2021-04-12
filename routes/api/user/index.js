const express = require('express');
const router = express.Router();
const validate = require('../user/validation');
const userController = require('../../../controllers/users');
const guard = require('../../../helpers/guard');
const { createAccLimiter } = require('../../../helpers/rate-limit-reg');
const Users = require('../../../model/users');

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

// ---
router.get('/google', userController.googleAuth);
router.get('/google-redirect', userController.googleRedirect);

router.get('/google/null', async (req, res) => {
  return res.status(200).json({
    status: 'error',
    code: 403,
    data: 'Forbidden',
    message: 'Email is not registered',
  });
});

router.get('/google/:id', async (req, res) => {
  const { id } = req.params;
  const user = await Users.findById(id);
  return res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      token: user.token,
      user: { name: user.name, email: user.email },
    },
  });
});
module.exports = router;
