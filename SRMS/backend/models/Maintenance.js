// ============================================
// models/Maintenance.js
// Maintenance Request Records
// ============================================

const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
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
  // Short title e.g. "Leaking tap"
  title: {
    type: String,
    required: [true, 'Issue title is required'],
    trim: true
  },
  // Detailed description
  description: {
    type: String,
    required: [true, 'Please describe the issue']
  },
  // Category of the issue
  category: {
    type: String,
    enum: ['Plumbing', 'Electrical', 'AC/Appliance', 'Carpentry', 'Painting', 'Other'],
    default: 'Other'
  },
  // open → in-progress → done
  status: {
    type: String,
    enum: ['open', 'in-progress', 'done'],
    default: 'open'
  },
  // Landlord's update/note for tenant
  landlordNote: {
    type: String,
    default: ''
  },
  // Date when issue was resolved
  completedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', MaintenanceSchema);
