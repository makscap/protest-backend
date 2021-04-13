const TestQuestions = require('./schemas/questions');

const getAllTechQ = async () => {
  const data = await TestQuestions.find({})

  return data;
};

const getAllTheoryQ = async () => {
  const data = await TestQuestions.find({})

  return data;
};

const getTechQ = async () => {
  const data = await TestQuestions.aggregate([{ $sample: {size: 12}}]);

  return data;
};

const getTheoryQ = async () => {
  const data = await TestQuestions.aggregate([{ $sample: {size: 12}}]);

  return data;
};

const getAnswers = (answer, right) => {
  const result = answer.filter(item => right.some(
    ({ _doc }) => item.questionId === _doc.questionId && item.answer === _doc.rightAnswer)
  )

  return result.length
}

module.exports = {
  getAllTechQ,
  getAllTheoryQ,
  getTechQ,
  getTheoryQ,
  getAnswers,
};
