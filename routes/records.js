const express = require('express')
const {
    createRecord,
    getAllRecords,
} = require('../controllers/recordController')

const router = express.Router()

router.get('/', getAllRecords)

router.post('/', createRecord)

module.exports = router