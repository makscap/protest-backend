const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const { HttpCode } = require('./helpers/constants')
const usersRouter = require('./routes/api/user')

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const TechQuestions = require('./model/tech-questions');
const TheoryQuestions = require('./model/theory-questions');


const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());


app.use(express.json({ limit: 10000 })) // ставится лимит для того чтобы нельзя было положить сервер от большого количества обьемов инфы

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  handler: (req, res, next) => {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      data: "forbidden",
      message: "Too many requests, please try again later"
  })
  }
});

app.use('/api/', apiLimiter);
app.use('/api/users', usersRouter)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// test route swagger-ui
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// test route swagger-ui
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// test route tech questions
app.get('/qa-test/tech', async (req, res) => {
  const techQuestions = await TechQuestions.getTechQ();
  return res.json({
    status: 'success',
    code: 200,
    data: techQuestions,
  });
});
// test route theory question
app.get('/qa-test/theory', async (req, res) => {
  const theoryQuestions = await TheoryQuestions.getTheoryQ();
  return res.json({
    status: 'success',
    code: 200,
    data: theoryQuestions,
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found :( ' });
});

app.use((err, _req, res, _next) => {
  res.status(500).send({ message: err.massege });
});

module.exports = app;
