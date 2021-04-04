const TechQuestions = require('./schemas/tech-questions');

const getAll = async () => {
  const data = await TechQuestions.find({});

  return data;
};
module.exports = {
  getAll,
};
