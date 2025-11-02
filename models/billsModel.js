const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billsSchema = new Schema({
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: 2100
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  user_id:{
    type: String,
    required: true
  },
  record_id:{
    type: String,
    required: true
  },
  price:{
    type: Number,
    min: 0
  },
  paid: {
    type: Boolean,
    required: true,
    default: false
  },
  paid_by: {
    type: String,
    default: "This bill hasn't been paid yet."
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('bill', billsSchema);