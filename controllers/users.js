const jwt = require('jsonwebtoken');
// const queryString = require('query-string');
// const axios = require('axios');
const Users = require('../model/users');
const { HttpCode } = require('../helpers/constants');
const EmailService = require('../services/email');
const { nanoid } = require('nanoid');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const register = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await Users.findByEmail(email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        data: 'Conflict',
        message: 'Email in use',
      });
    }

    const verifyToken = nanoid();
    const emailService = new EmailService(process.env.NODE_ENV);
    await emailService.sendEmail(verifyToken, email);

    const newUser = await Users.create({ ...req.body, verifyToken });
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
      },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);
    if (!user || !isValidPassword || !user.verify) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'Unauthorized',
        message: 'Invalid credentials',
      });
    }

    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
    await Users.updateToken(id, token);

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        token,
      },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  const id = req.user.id;
  await Users.updateToken(id, null);
  return res.status(HttpCode.NO_CONTENT).json({
    message: 'No info',
  });
};

const verify = async (req, res, next) => {
  try {
    const user = await Users.findByVerifyToken(req.params.verifyToken);
    if (user) {
      await Users.updateVerifyToken(user.id, true, null);
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Verification successful',
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      data: 'Not found',
      message: 'User not found',
    });
  } catch (e) {
    next(e);
  }
};

// const getCurrentUser = async (req, res, next) => {
//   try {
//     const id = req.user._id;
//     const user = await Users.findById(id);
//     return res.status(HttpCode.OK).json({
//       status: 'success',
//       code: HttpCode.OK,
//       data: {
//         email: user.email,
//       },
//     });
//   } catch (e) {
//     next(e);
//   }
// };

const getCurrentUser = async (req, res, next) => {
  try {
    const [, token] = req.get('Authorization').split(' ');
    const user = await Users.findByToken(token);
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        email: user.email,
        name: user.name,
        id: user._id,
      },
    });
  } catch (e) {
    next(e);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const { /* name, picture, */ email } = ticket.getPayload();

    const user = await Users.findByEmail(email);
    if (!user || !user.verify) {
      return res.status(200).json({
        status: 'error',
        code: 403,
        data: 'Forbidden',
        message: 'Email is not registered',
      });
    }

    const id = user._id;
    const payload = { id };
    const newToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '6h' });
    await Users.updateToken(id, newToken);

    return res.status(200).json({
      status: 'success',
      code: 200,
      data: {
        token: user.token,
        user: { name: user.name, email: user.email },
      },
    });
  } catch (e) {
    next(e);
  }
};

// const googleAuth = async (req, res) => {
//   const stringifiedParams = queryString.stringify({
//     client_id: process.env.GOOGLE_CLIENT_ID,
//     redirect_uri: `${process.env.BASE_URL}/api/users/google-redirect`,
//     scope: [
//       'https://www.googleapis.com/auth/userinfo.email',
//       'https://www.googleapis.com/auth/userinfo.profile',
//     ].join(' '),
//     response_type: 'code',
//     access_type: 'offline',
//     prompt: 'consent',
//   });
//   return res.redirect(
//     `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`,
//   );
// };

// const googleRedirect = async (req, res) => {
//   const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
//   const urlObj = new URL(fullUrl);
//   const urlParams = queryString.parse(urlObj.search);
//   const code = urlParams.code;
//   const tokenData = await axios({
//     url: `https://oauth2.googleapis.com/token`,
//     method: 'post',
//     data: {
//       client_id: process.env.GOOGLE_CLIENT_ID,
//       client_secret: process.env.GOOGLE_CLIENT_SECRET,
//       redirect_uri: `${process.env.BASE_URL}/api/users/google-redirect`,
//       grant_type: 'authorization_code',
//       code,
//     },
//   });
//   const userData = await axios({
//     url: 'https://www.googleapis.com/oauth2/v2/userinfo',
//     method: 'get',
//     headers: {
//       Authorization: `Bearer ${tokenData.data.access_token}`,
//     },
//   });
//   // userData.data.email
//   // userData.data.given_name
//   // ...
//   // ...
//   // ...
//   const { email /* given_name: name */ } = userData.data;

//   const user = await Users.findByEmail(email);
//   if (!user || !user.verify) {
//     return res.redirect(`${process.env.FRONTEND_URL}/api/users/google/null`);
//   }

//   const id = user._id;
//   const payload = { id };
//   const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '6h' });
//   await Users.updateToken(id, token);
//   return res.redirect(`${process.env.FRONTEND_URL}/api/users/google/${id}`);
// };

module.exports = {
  register,
  login,
  logout,
  verify,
  getCurrentUser,
  // googleAuth,
  // googleRedirect,
  googleLogin,
};
