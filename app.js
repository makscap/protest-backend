const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { HttpCode } = require('./helpers/constants');
const usersRouter = require('./routes/api/user');
const questionsRoute = require('./routes/api/questions');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(express.urlencoded({ extended: false }));
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 10000 })); // ставится лимит для того чтобы нельзя было положить сервер от большого количества обьемов инфы

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  handler: (req, res, next) => {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      data: 'forbidden',
      message: 'Too many requests, please try again later',
    });
  },
});

app.get('/', (req, res) => {
  // res.send('Hello World!');
  res.sendFile(path.join(__dirname, './public/link.html'));
});

// test route swagger-ui
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/', apiLimiter);
app.use('/api/users', usersRouter);

// test route tech questions
app.use('/qa-test', questionsRoute);


app.use((req, res) => {
  res.status(404).json({ message: 'Not found :( ' });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
