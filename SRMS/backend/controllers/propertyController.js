// ============================================
// controllers/propertyController.js
// CRUD for Properties
// ============================================

const Property = require('../models/Property');

// GET all properties of logged-in landlord
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find({ landlord: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: properties.length, data: properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET single property
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, data: property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST add new property
exports.addProperty = async (req, res) => {
  try {
    const { name, address, city, type, totalUnits, monthlyRent, description } = req.body;

    if (!name || !address || !totalUnits || !monthlyRent) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, address, units, and rent amount'
      });
    }

    const property = await Property.create({
      landlord: req.user._id,
      name, address, city, type, totalUnits, monthlyRent, description
    });

    res.status(201).json({
      success: true,
      message: `Property "${property.name}" added successfully!`,
      data: property
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT update property
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, landlord: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, message: 'Property updated!', data: property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE property
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({
      _id: req.params.id,
      landlord: req.user._id
    });
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, message: 'Property deleted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
