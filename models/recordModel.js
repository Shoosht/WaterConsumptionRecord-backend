const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recordSchema = new Schema({
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
  paid: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('record', recordSchema);