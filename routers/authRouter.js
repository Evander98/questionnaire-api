const router = require('express').Router()
const { onRegister, onLogin } = require('../controllers').auth

router.post('/register', onRegister)
router.get('/login', onLogin)

module.exports = router