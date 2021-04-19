const TestQuestions = require('../model/questions');

const getTechQ = async (req, res, next) => {
  try {
    const techQuestions = await TestQuestions.getTechQ();
    return res.json({
      status: 'success',
      code: 200,
      data: {
        techQuestions,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getTheoryQ = async (req, res, next) => {
  try {
    const theoryQuestions = await TestQuestions.getTheoryQ();
    return res.json({
      status: 'success',
      code: 200,
      data: {
        theoryQuestions,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getTechR = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const techQ = await TestQuestions.getAllTechQ();

    const rightAnswers = TestQuestions.getAnswers(answers, techQ);
    const wrongAnswers = 12 - rightAnswers;
    return res.json({
      status: 'success',
      code: 201,
      data: {
        rightAnswers,
        wrongAnswers,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getTheoryR = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const theoryQ = await TestQuestions.getAllTheoryQ();

    const rightAnswers = TestQuestions.getAnswers(answers, theoryQ);
    const wrongAnswers = 12 - rightAnswers;
    return res.json({
      status: 'success',
      code: 201,
      data: {
        rightAnswers,
        wrongAnswers,
      },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getTechQ,
  getTheoryQ,
  getTechR,
  getTheoryR,
};
