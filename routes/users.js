const express = require('express')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

const { loginUser, signupUser, updateUser } = require('../controllers/userController')

router.post('/login', loginUser)

router.post('/signup', signupUser)

router.patch('/:id', requireAuth, updateUser)

module.exports = router