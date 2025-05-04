const Record = require('../models/recordModel')

const getAllRecords = async (req, res) => {
    const records = await Record.find({}).sort({ year: 1, month: 1 })

    res.status(200).json(records)
}

const createRecord = async (req, res) => {
    const { year, month, amount } = req.body
    try{
        const record = await Record.create({year, month, amount})
        res.status(200).json(record)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}


module.exports = { createRecord, getAllRecords }