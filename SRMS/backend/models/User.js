// ============================================
// models/User.js
// User Schema (Landlord & Tenant)
// ============================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 4,
    select: false // Don't return password in queries
  },
  role: {
    type: String,
    enum: ['landlord', 'tenant'],
    default: 'tenant'
  },
  phone: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Hash password before saving to database
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check if entered password matches stored password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
