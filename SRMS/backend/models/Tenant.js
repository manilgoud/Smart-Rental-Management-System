// ============================================
// models/Tenant.js
// Tenant Record (links User to Property)
// ============================================

const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  // The landlord who added this tenant
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // The user account of the tenant
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Which property they are renting
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  // Unit number e.g. A-101, B-202
  unit: {
    type: String,
    required: [true, 'Unit number is required'],
    trim: true
  },
  // Monthly rent amount for this tenant
  monthlyRent: {
    type: Number,
    required: true,
    min: 0
  },
  leaseStart: {
    type: Date,
    default: Date.now
  },
  // Set to false when tenant leaves
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Tenant', TenantSchema);
