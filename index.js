const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 2000

const { auth, questionaire, category, survey } = require('./routers')

app.use(cors())
app.use(express.json())

app.use('/auth', auth)
app.use('/questionnaire', questionaire)
app.use('/category', category)
app.use('/survey', survey)

app.use('/', (req, res) => {
  res.send('<h1>Welcome to API</h1>')
})


app.listen(port, () => console.log('Server running on port ' + port))