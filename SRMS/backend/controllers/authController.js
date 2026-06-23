// ============================================
// controllers/authController.js
// Register, Login, Get Profile
// ============================================

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper: generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// ── REGISTER ────────────────────────────────
// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered. Please login.'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'tenant',
      phone: phone || ''
    });

    // Return token + user info
    res.status(201).json({
      success: true,
      message: `Welcome ${user.name}! Registration successful.`,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── LOGIN ────────────────────────────────────
// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter email and password'
      });
    }

    // Find user — include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET MY PROFILE ───────────────────────────
// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
