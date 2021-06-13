const router = require('express').Router()
const { addData, countCategory, countAll } = require('../controllers').survey

router.post('/sendData', addData)
router.get('/countCategory', countCategory)
router.get('/countAll', countAll)

module.exports = router