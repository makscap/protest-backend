const TheoryQuestions = require('./schemas/theory-questions');

const getTheoryQ = async () => {
  const data = await TheoryQuestions.aggregate([{ $sample: {size: 12}}]);

  return data;
};
module.exports = {
  getTheoryQ,
};
