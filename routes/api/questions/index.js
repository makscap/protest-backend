const express = require('express')
const router = express.Router()
const guard = require('../../../helpers/guard')
const questionsController = require('../../../controllers/questions')

router.get('/tech', guard, questionsController.getTechQ)
router.get('/theory', guard, questionsController.getTheoryQ)

router.post('/tech-results', guard, questionsController.getTechR)
router.post('/theory-results', guard, questionsController.getTheoryR)

module.exports = router;