// ============================================
// models/Payment.js
// Rent Payment Records
// ============================================

const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  // e.g. "March 2024"
  month: {
    type: String,
    required: [true, 'Payment month is required']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  // paid = rent received, pending = not yet paid, overdue = past due date
  status: {
    type: String,
    enum: ['paid', 'pending', 'overdue'],
    default: 'pending'
  },
  // Date when rent was actually paid
  paidDate: {
    type: Date,
    default: null
  },
  // Track if reminder was sent
  reminderSent: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ''
  },
  // Razorpay payment details
  razorpayOrderId: {
    type: String,
    default: ''
  },
  razorpayPaymentId: {
    type: String,
    default: ''
  },
  razorpaySignature: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
