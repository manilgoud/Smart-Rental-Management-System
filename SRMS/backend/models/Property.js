// ============================================
// models/Property.js
// Property Schema (Apartment / House / Villa)
// ============================================

const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  // Which landlord owns this property
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Property name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  city: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['Apartment', 'Villa', 'House', 'PG'],
    default: 'Apartment'
  },
  totalUnits: {
    type: Number,
    required: true,
    min: 1
  },
  monthlyRent: {
    type: Number,
    required: [true, 'Monthly rent is required'],
    min: 0
  },
  description: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);
