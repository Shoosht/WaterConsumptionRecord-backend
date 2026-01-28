const Record = require('../models/recordModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')
const { sendLimitExceededEmail } = require('../utils/emailUtil');

const getAllRecords = async (req, res) => {
    const user_id = req.user._id

    const records = await Record.find({user_id}).sort({ year: 1, month: 1 })

    res.status(200).json(records)
}


const createRecord = async (req, res) => {
    const { year, month, amount, paid } = req.body

    let emptyFields = []

    if(!year){
        emptyFields.push('year')
    }

    if(!month){
        emptyFields.push('month')
    }

    if(!amount){
        emptyFields.push('amount')
    }

    if(emptyFields.length > 0){
        return res.status(400).json({error: 'Please fill in all fields.', emptyFields})
    }


    try {
        const user_id = req.user._id
        const record = await Record.create({ year, month, amount, user_id, paid });
        
        const user = await User.findById(user_id);
        
        console.log('user backend:', user);

        if (user && user.monthlyLimit && amount > user.monthlyLimit) {
            try {
                const previewUrl = await sendLimitExceededEmail(
                    user.email,
                    amount,
                    user.monthlyLimit,
                    month,
                    year
                );
                console.log('Email preview URL:', previewUrl);
            } catch (emailError) {
                console.error('Failed to send email:', emailError);
            }
        }
        
        res.status(200).json(record);
    } catch (error) {
        res.status(400).json({ error: error.message });
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

    const record = await Record.findByIdAndUpdate({_id: id}, {...req.body}, {new: true})

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