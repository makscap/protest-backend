const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// установка схемы
const techQuestionsScheme = new Schema(
  {
    question: String,
    questionId: Number,
    answers: Array,
    rightAnswer: String,
  },
  { versionKey: false },
);
const TechQuestions = model('tech-question', techQuestionsScheme);

module.exports = TechQuestions;
