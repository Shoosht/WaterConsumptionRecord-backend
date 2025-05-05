const express = require('express')
const {
    createRecord,
    getAllRecords,
    deleteRecord,
    updateRecord
} = require('../controllers/recordController')

const router = express.Router()

router.get('/', getAllRecords)

router.post('/', createRecord)

router.delete('/:id', deleteRecord)

router.patch('/:id', updateRecord)

module.exports = router