const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// установка схемы
const theoryQuestionsScheme = new Schema(
  {
    question: String,
    questionId: Number,
    answers: Array,
    rightAnswer: String,
  },
  { versionKey: false },
);
const TheoryQuestions = model('theory-question', theoryQuestionsScheme);

module.exports = TheoryQuestions;
