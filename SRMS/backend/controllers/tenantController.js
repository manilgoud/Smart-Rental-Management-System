// ============================================
// controllers/tenantController.js
// Tenant Management
// ============================================

const Tenant = require('../models/Tenant');
const User = require('../models/User');

// LANDLORD: Get all tenants
exports.getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find({ landlord: req.user._id, isActive: true })
      .populate('user', 'name email phone')
      .populate('property', 'name address')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: tenants.length, data: tenants });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// TENANT: Get own record
exports.getMyRecord = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ user: req.user._id, isActive: true })
      .populate('property', 'name address city')
      .populate('user', 'name email phone');
    if (!tenant) return res.status(404).json({ success: false, message: 'No record found' });
    res.json({ success: true, data: tenant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// LANDLORD: Add tenant by EMAIL
exports.addTenant = async (req, res) => {
  try {
    const { email, propertyId, unit, monthlyRent } = req.body;
    if (!email || !propertyId || !unit || !monthlyRent) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase(), role: 'tenant' });
    if (!user) {
      return res.status(400).json({ success: false, message: 'No tenant found with this email. Ask them to register first!' });
    }

    const existing = await Tenant.findOne({ user: user._id, isActive: true });
    if (existing) {
      return res.status(400).json({ success: false, message: 'This tenant is already active!' });
    }

    const tenant = await Tenant.create({
      landlord: req.user._id,
      user: user._id, property: propertyId, unit, monthlyRent
    });
    await tenant.populate(['user', 'property']);
    res.status(201).json({ success: true, message: `✅ ${user.name} added as tenant!`, data: tenant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// LANDLORD: Remove tenant
exports.removeTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findOneAndUpdate(
      { _id: req.params.id, landlord: req.user._id },
      { isActive: false }, { new: true }
    );
    if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found' });
    res.json({ success: true, message: 'Tenant removed!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
