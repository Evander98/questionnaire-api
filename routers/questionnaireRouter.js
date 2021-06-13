const router = require('express').Router()
const { addQuestions, getQuestionnaire } = require('../controllers').questionnaire

router.post('/addQuestions/:userId', addQuestions)
router.get('/getQuestions', getQuestionnaire)

module.exports = router