const express = require('express')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

const { loginUser, signupUser, updateUser, changePassword, forgotPassword, resetPassword } = require('../controllers/userController')

router.post('/login', loginUser)

router.post('/signup', signupUser)

router.patch('/:id', requireAuth, updateUser)

router.patch('/:id/password', requireAuth, changePassword)

router.post('/forgotpassword', forgotPassword)

router.post('/reset-password/:token', resetPassword)

module.exports = router