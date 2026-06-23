// ============================================
// middleware/authMiddleware.js
// JWT Authentication & Role-Based Access
// ============================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Protect Route (Must be logged in) ───────
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please login first.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user to request
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or expired. Please login again.'
    });
  }
};

// ── Landlord Only Access ─────────────────────
const landlordOnly = (req, res, next) => {
  if (req.user.role !== 'landlord') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. This action is for Landlords only.'
    });
  }
  next();
};

// ── Tenant Only Access ───────────────────────
const tenantOnly = (req, res, next) => {
  if (req.user.role !== 'tenant') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. This action is for Tenants only.'
    });
  }
  next();
};

module.exports = { protect, landlordOnly, tenantOnly };
