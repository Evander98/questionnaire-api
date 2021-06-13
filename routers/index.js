const auth = require('./authRouter')
const questionaire = require('./questionnaireRouter')
const category = require('./categoryRouter')
const survey = require('./surveyRouter')

module.exports = {
  auth,
  questionaire,
  category,
  survey
}