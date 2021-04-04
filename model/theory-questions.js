const TheoryQuestions = require('./schemas/theory-questions');

const getAll = async () => {
  const data = await TheoryQuestions.find({});

  return data;
};
module.exports = {
  getAll,
};
