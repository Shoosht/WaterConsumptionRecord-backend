const express = require('express')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

const { loginUser, signupUser, updateUser, changePassword } = require('../controllers/userController')

router.post('/login', loginUser)

router.post('/signup', signupUser)

router.patch('/:id', requireAuth, updateUser)

router.patch('/:id/password', requireAuth, changePassword)

module.exports = router