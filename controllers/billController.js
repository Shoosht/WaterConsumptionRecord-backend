const Bill = require('../models/billsModel')
const mongoose = require('mongoose')


const getAllBills = async (req, res) => {
    const user_id = req.user._id

    const bills = await Bill.find({user_id}).sort({ year: 1, month: 1 })

    res.status(200).json(bills)
}

const createBill = async (req, res) => {
    const { year, month, amount, record_id, paid, paid_by } = req.body

    price = amount * 1.73

    try{
        const user_id = req.user._id
        const bill = await Bill.create({year, month, amount, user_id, record_id, price, paid, paid_by})
        res.status(200).json(bill)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

const updateBill = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'This bill does not exist'})
    }

    const bill = await Bill.findOneAndUpdate({record_id: id}, {...req.body}, {new: true})

    if (!bill) {
        return res.status(404).json({error: 'This bill does not exist'})
    }

    res.status(200).json(bill)
}


module.exports = {
    getAllBills, 
    createBill,
    updateBill
}