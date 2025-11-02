const express = require('express')
const {
    getAllBills,
    createBill,
    updateBill
} = require('../controllers/billController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

router.get('/', getAllBills)

router.post('/', createBill)

router.patch('/:id', updateBill)

module.exports = router