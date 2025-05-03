const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consumptionSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('Consumption', consumptionSchema);