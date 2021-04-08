const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const TechQuestions = require('./model/tech-questions');
const TheoryQuestions = require('./model/theory-questions');
const User = require('./model/users');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// test route user
app.get('/user', async (req, res) => {
  const user = await User.findById('606849d2cff14956ef33b043');
  return res.json({
    status: 'success',
    code: 200,
    data: user,
  });
});
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

app.use((_req, res) => {
  res.status(404).send({ massege: 'Not found' });
});

app.use((err, _req, res, _next) => {
  res.status(500).send({ massege: err.massege });
});

module.exports = app;
