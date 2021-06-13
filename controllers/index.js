const auth = require('./authController')
const questionnaire = require('./questionnaireController')
const category = require('./categoryController')
const survey = require('./surveyController')

module.exports = {
  auth,
  questionnaire,
  category,
  survey
}