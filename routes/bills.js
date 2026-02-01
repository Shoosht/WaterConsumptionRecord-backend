const express = require('express')
const {
	getAllBills,
	createBill,
	updateBill,
	deleteBill
} = require('../controllers/billController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

router.get('/', getAllBills)

router.post('/', createBill)

router.patch('/:id', updateBill)

router.delete('/:id', deleteBill)

module.exports = router