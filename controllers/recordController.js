const Record = require('../models/recordModel')
const mongoose = require('mongoose')

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


const deleteRecord = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'This record does not exist'})
    }

    const record = await Record.findOneAndDelete({_id: id})

    if (!record) {
        return res.status(404).json({error: 'This record does not exist'})
    }

    res.status(200).json(record)
}


const updateRecord = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'This record does not exist'})
    }

    const record = await Record.findByIdAndUpdate({_id: id}, {...req.body})

    if (!record) {
        return res.status(404).json({error: 'This record does not exist'})
    }

    res.status(200).json(record)
}


module.exports = { 
    createRecord,
    getAllRecords,
    deleteRecord,
    updateRecord
 }