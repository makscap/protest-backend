const TechQuestions = require('./schemas/tech-questions');

const getTechQ = async () => {
  const data = await TechQuestions.aggregate([{ $sample: {size: 12}}]);

  return data;
};
module.exports = {
  getTechQ,
};
