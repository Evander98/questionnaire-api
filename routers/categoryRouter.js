const router = require('express').Router()
const { getCategory, addCategory, deleteCategory } = require('../controllers').category

router.get('/getCategory', getCategory)
router.post('/addCategory', addCategory)
router.post('/deleteCategory', deleteCategory)

module.exports = router