const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const questionsScheme = new Schema(
  {
    question: String,
    questionId: Number,
    answers: Array,
    rightAnswer: String,
  },
  { versionKey: false },
);

const TechQuestions = model('tech-question', questionsScheme);
const TheoryQuestions = model('theory-question', questionsScheme);

module.exports = {
  TechQuestions,
  TheoryQuestions,
}
