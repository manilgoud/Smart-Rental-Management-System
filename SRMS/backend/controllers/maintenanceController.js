// ============================================
// controllers/maintenanceController.js
// Maintenance Request Management
// ============================================

const Maintenance = require('../models/Maintenance');
const Tenant = require('../models/Tenant');

// ── LANDLORD: Get all requests ───────────────
exports.getAllRequests = async (req, res) => {
  try {
    const filter = { landlord: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const requests = await Maintenance.find(filter)
      .populate({ path: 'tenant', populate: { path: 'user', select: 'name email phone' } })
      .populate('property', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── TENANT: Get own requests ─────────────────
exports.getMyRequests = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ user: req.user._id, isActive: true });
    if (!tenant) return res.status(404).json({ success: false, message: 'No tenant record found' });

    const requests = await Maintenance.find({ tenant: tenant._id })
      .populate('property', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── TENANT: Submit new request ───────────────
exports.createRequest = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    // Find tenant record for current user
    const tenant = await Tenant.findOne({ user: req.user._id, isActive: true });
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'No active tenant record found. Contact your landlord.' });
    }

    const request = await Maintenance.create({
      landlord: tenant.landlord,
      tenant: tenant._id,
      property: tenant.property,
      title,
      description,
      category: category || 'Other'
    });

    res.status(201).json({
      success: true,
      message: '✅ Maintenance request submitted successfully!',
      data: request
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── LANDLORD: Update status ──────────────────
// open → in-progress → done
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['open', 'in-progress', 'done'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const update = { status };
    if (status === 'done') update.completedAt = Date.now();

    const request = await Maintenance.findOneAndUpdate(
      { _id: req.params.id, landlord: req.user._id },
      update,
      { new: true }
    );

    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    const statusMsg = {
      'in-progress': '▶ Work started!',
      'done': '✅ Marked as Complete!'
    }[status] || 'Status updated!';

    res.json({ success: true, message: statusMsg, data: request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── LANDLORD: Add note ───────────────────────
exports.addNote = async (req, res) => {
  try {
    const { note } = req.body;
    const request = await Maintenance.findOneAndUpdate(
      { _id: req.params.id, landlord: req.user._id },
      { landlordNote: note },
      { new: true }
    );
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    res.json({ success: true, message: '📝 Note saved!', data: request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── LANDLORD: Delete request ─────────────────
exports.deleteRequest = async (req, res) => {
  try {
    const request = await Maintenance.findOneAndDelete({
      _id: req.params.id,
      landlord: req.user._id
    });
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    res.json({ success: true, message: 'Request deleted!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
